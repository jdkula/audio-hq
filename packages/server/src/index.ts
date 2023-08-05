import { Server } from 'socket.io';
import { ServerServiceSocket, Status } from 'service/lib/IService';
import { AudioHQServiceBase as AHQBase } from 'service/lib/ServiceBase';
import { NotFound, InvalidInput, OtherError } from 'service/lib/errors';
import { Last } from 'socket.io/dist/typed-events';
import MsgParser from 'socket.io-msgpack-parser';
import { asString } from 'service/lib/db/oid_helpers';
import { mongo } from 'service/lib/db/mongodb';
import pino from 'pino';
import * as Transport from 'common/lib/api/transport/models';

const log = pino({ transport: { target: 'pino-pretty' }, level: 'trace' });
const reqlog = pino({ name: 'request', transport: { target: 'pino-pretty' }, level: 'trace' });

const io = new Server({
    parser: MsgParser,
    connectionStateRecovery: {
        maxDisconnectionDuration: 1000 * 60 * 60,
        skipMiddlewares: false,
    },
    cors: {
        origin: '*',
        allowedHeaders: '*',
        exposedHeaders: '*',
    },
    maxHttpBufferSize: 1e9,
});

let id = 0;
async function wrap<T, Args extends any[]>(fn: (...args: Args) => Promise<T>, ...args: Args): Promise<Status<T>> {
    const myId = id++;
    const data = await (async () => {
        try {
            reqlog.trace(`RPC ${myId} ${fn.name} %j`, args);
            return {
                data: await fn(...args),
                error: null,
            };
        } catch (e) {
            console.warn(`RPC ${myId} error`, e);
            if (e instanceof NotFound) {
                return {
                    error: 'Not Found: ' + e.message,
                };
            } else if (e instanceof InvalidInput) {
                return {
                    error: 'Invalid Input: ' + e.message,
                };
            } else if (e instanceof OtherError) {
                return {
                    error: 'Other Error: ' + e.message,
                };
            } else if (e instanceof Error) {
                return {
                    error: 'Fatal: ' + e.message,
                };
            } else {
                return {
                    error: 'Undiagnosed error, see server.',
                };
            }
        }
    })();
    reqlog.trace(`RPC ${myId} RET: %j`, data);
    return data;
}

const workspaceListeners: Map<string, Set<ServerServiceSocket>> = new Map();
const connectedWorkers: Array<{ socket: ServerServiceSocket; workerId: string }> = [];

async function notifyJobs(workspace: string) {
    const listeners = workspaceListeners.get(workspace);
    if (!listeners) return;

    const data = await AudioHQServiceBase.listJobs(workspace);
    for (const socket of listeners) {
        socket.emit('jobsUpdate', data);
    }
}
async function notifyEntries(workspace: string) {
    const listeners = workspaceListeners.get(workspace);
    if (!listeners) return;

    const data = await AudioHQServiceBase.listEntries(workspace);
    for (const socket of listeners) {
        socket.emit('entriesUpdate', data);
    }
}
async function notifyDecks(workspace: string) {
    const listeners = workspaceListeners.get(workspace);
    if (!listeners) return;

    const data = await AudioHQServiceBase.listDecks(workspace);
    for (const socket of listeners) {
        socket.emit('decksUpdate', data);
    }
}

async function distributeJob(workerId?: string) {
    log.debug('Distributing jobs to wid %s', workerId);
    if (connectedWorkers.length === 0) return;

    let worker: ServerServiceSocket | undefined;
    if (workerId) {
        worker = connectedWorkers.find((info) => workerId === info.workerId)?.socket;
    } else {
        const [info] = connectedWorkers.splice(0, 1);
        connectedWorkers.push(info);
        worker = info.socket;
    }
    if (!worker) return;

    log.debug('Worker found, getting next job');
    const job = await AudioHQServiceBase.getNextAvailableJob();
    log.debug('Found job %j', job);
    if (!job) return;

    log.debug('Offering job...');
    const accepted = worker.emitWithAck('jobOffer', {
        ...job,
        id: asString(job._id!),
        workspace: asString(job._workspace),
        assignedWorker: null,
    });
    if (!accepted) {
        log.debug('Job not accepted, returning it...');
        await (
            await mongo
        ).jobs.updateOne(
            { _id: job._id },
            { $set: { assignedAt: 0, status: Transport.JobStatus.GETTING_READY, assignedWorker: null } },
        );
    }
}

const AudioHQServiceBase = new AHQBase();

io.on('connection', (socket: ServerServiceSocket) => {
    log.debug('Client connected', socket.id);
    const savedSet = { current: null as null | Set<ServerServiceSocket> };

    socket.on('disconnect', () => {
        log.debug('Client disconnected', socket.id);
        if (savedSet.current) {
            savedSet.current.delete(socket);
            savedSet.current = null;
        }
        const idx = connectedWorkers.findIndex((p) => p.socket === socket);
        connectedWorkers.splice(idx, 1);
    });

    socket.on('join', (joined, resolve) => {
        if (savedSet.current !== null) {
            savedSet.current.delete(socket);
            savedSet.current = null;
        }
        let set = workspaceListeners.get(joined);
        if (!set) {
            set = new Set();
            workspaceListeners.set(joined, set);
        }
        set.add(socket);
        savedSet.current = set;
        resolve({ error: null, data: undefined });
    });
    socket.on('leave', (_, resolve) => {
        if (!savedSet.current) return;
        savedSet.current.delete(socket);
        savedSet.current = null;
        resolve({ error: null, data: undefined });
    });

    socket.on('cancelJob', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['cancelJob']>;
        const status = await wrap(AudioHQServiceBase.cancelJob, ...rest);
        resolve(status);
        notifyJobs(rest[0]);
    });
    socket.on('createDeck', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['createDeck']>;
        const status = await wrap(AudioHQServiceBase.createDeck, ...rest);
        resolve(status);
        notifyDecks(rest[0]);
    });
    socket.on('createEntry', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['createEntry']>;
        const status = await wrap(AudioHQServiceBase.createEntry, ...rest);
        resolve(status);
        notifyEntries(rest[0]);
    });
    socket.on('createWorkspace', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['createWorkspace']>;
        const status = await wrap(AudioHQServiceBase.createWorkspace, ...rest);
        resolve(status);
    });
    socket.on('deleteDeck', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['deleteDeck']>;
        const status = await wrap(AudioHQServiceBase.deleteDeck, ...rest);
        resolve(status);
        notifyDecks(rest[0]);
    });
    socket.on('deleteEntry', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['deleteEntry']>;
        const status = await wrap(AudioHQServiceBase.deleteEntry, ...rest);
        resolve(status);
        notifyEntries(rest[0]);
    });
    socket.on('deleteWorkspace', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['deleteWorkspace']>;
        const status = await wrap(AudioHQServiceBase.deleteWorkspace, ...rest);
        resolve(status);
    });
    socket.on('getDeck', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['getDeck']>;
        const status = await wrap(AudioHQServiceBase.getDeck, ...rest);
        resolve(status);
    });
    socket.on('getEntry', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['getEntry']>;
        const status = await wrap(AudioHQServiceBase.getEntry, ...rest);
        resolve(status);
    });
    socket.on('getJob', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['getJob']>;
        const status = await wrap(AudioHQServiceBase.getJob, ...rest);
        resolve(status);
    });
    socket.on('getWorkspace', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['getWorkspace']>;
        const status = await wrap(AudioHQServiceBase.getWorkspace, ...rest);
        resolve(status);
    });
    socket.on('listDecks', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['listDecks']>;
        const status = await wrap(AudioHQServiceBase.listDecks, ...rest);
        resolve(status);
    });
    socket.on('listEntries', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['listEntries']>;
        const status = await wrap(AudioHQServiceBase.listEntries, ...rest);
        resolve(status);
    });
    socket.on('listJobs', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['listJobs']>;
        const status = await wrap(AudioHQServiceBase.listJobs, ...rest);
        resolve(status);
    });
    socket.on('searchWorkspace', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['searchWorkspace']>;
        const status = await wrap(AudioHQServiceBase.searchWorkspace, ...rest);
        resolve(status);
    });
    socket.on('submitJob', async (workspaceId, input, resolve) => {
        const status = await wrap(AudioHQServiceBase.submitJob, workspaceId, input);
        resolve(status);
        notifyJobs(workspaceId);
        distributeJob();
    });
    socket.on('updateDeck', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['updateDeck']>;
        const status = await wrap(AudioHQServiceBase.updateDeck, ...rest);
        resolve(status);
        notifyDecks(args[0]);
    });
    socket.on('updateEntry', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['updateEntry']>;
        const status = await wrap(AudioHQServiceBase.updateEntry, ...rest);
        resolve(status);
        notifyEntries(args[0]);
    });
    socket.on('updateWorkspace', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['updateWorkspace']>;
        const status = await wrap(AudioHQServiceBase.updateWorkspace, ...rest);
        resolve(status);
    });
    socket.on('uploadFile', async (...args) => {
        const resolve = args[args.length - 1] as Last<typeof args>;
        const rest = args.slice(0, -1) as Parameters<(typeof AudioHQServiceBase)['uploadFile']>;
        const status = await wrap(AudioHQServiceBase.uploadFile, ...rest);
        resolve(status);
    });

    socket.on('registerWorker', async (psk, checkinTime, resolve) => {
        const status = await wrap(AudioHQServiceBase.registerWorker, psk, checkinTime);
        if (status.error === null) {
            connectedWorkers.push({ socket, workerId: status.data });
        }
        resolve(status);
    });
    socket.on('workerCheckIn', async (psk, id, resolve) => {
        const status = await wrap(AudioHQServiceBase.workerCheckIn, psk, id);
        resolve(status);
    });

    socket.on('adminUpdateJob', async (psk, wsid, id, update, resolve) => {
        const status = await wrap(AudioHQServiceBase.adminUpdateJob, psk, wsid, id, update);
        resolve(status);
        notifyJobs(wsid);
    });
    socket.on('adminCompleteJob', async (psk, wsid, id, completion, buffer, resolve) => {
        const status = await wrap(AudioHQServiceBase.adminCompleteJob, psk, wsid, id, completion, buffer);
        resolve(status);
        notifyJobs(wsid);
    });
    socket.on('adminRequestJob', async (psk, workerId, resolve) => {
        if (psk !== process.env.WORKER_PSK) return void resolve({ error: 'Not authorized' });
        await distributeJob(workerId);
        resolve({ error: null, data: undefined });
    });
    socket.on('pruneWorkers', async (psk, resolve) => {
        if (psk !== process.env.WORKER_PSK) return void resolve({ error: 'Not authorized' });
        const res = await wrap(AudioHQServiceBase.pruneWorkers, psk);
        resolve(res);
    });
});

io.listen(3050);
