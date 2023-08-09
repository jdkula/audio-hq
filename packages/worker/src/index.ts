import pino from 'pino';

import * as Transport from 'common/lib/api/transport/models';
import { mongo } from 'service/lib/db/mongodb';
import SocketTransport from 'clients/lib/impl/socketio.transport';
import { io as socketio } from 'socket.io-client';
import MsgParser from 'socket.io-msgpack-parser';

import { Processor } from './processor';

const kPsk = process.env.WORKER_PSK as string;

const log = pino({ name: 'worker', transport: { target: 'pino-pretty' }, level: 'trace' });
let didStart = false;

const socket: any = socketio(process.env.NEXT_PUBLIC_WS_BASE as string, {
    parser: MsgParser,
});
socket.on('error', (err: any) => {
    log.error(err);
});

socket.on('connect', () => {
    log.info('Connected');
    if (!didStart) {
        log.info('Starting');
        didStart = true;
        setup();
    }
});
socket.on('disconnect', () => {
    log.info('Disconnected');
});
socket.on('connect_error', (err: any) => {
    log.error(err);
});

const io = new SocketTransport(socket);

let working = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function reportError(job: Transport.Job, e: any) {
    await io.adminUpdateJob(kPsk, job.workspace!, job.id!, {
        ...job,
        status: Transport.JobStatus.ERROR,
        error:
            e instanceof Error
                ? e.name + '\ncause: ' + e.cause + '\nstack trace: ' + e.stack
                : e.toString instanceof Function
                ? e.toString()
                : 'Unknown error',
    });
}

async function doDownload(processor: Processor, job: Transport.Job) {
    if (working) return false;
    working = true;
    try {
        // log.debug('Job found', job.value);
        log.trace('Import found. Downloading...');
        const cut = job.modifications?.find(
            (x): x is Transport.CutModification => x.type === Transport.ModificationType.CUT,
        );
        const fade = job.modifications?.find(
            (x): x is Transport.FadeModification => x.type === Transport.ModificationType.FADE,
        );

        const inPath = await processor.download(job.source!, job.workspace!, job.id!);

        log.trace('Converting...');

        const outPath = await processor.convert(inPath, job.workspace!, job.id!, job.source, {
            cut: cut ? { start: cut.startSeconds!, end: cut.endSeconds! } : null,
            fadeIn: fade?.inSeconds ?? undefined,
            fadeOut: fade?.outSeconds ?? undefined,
        });

        log.trace('Adding to AHQ...');
        await processor.addFile(job.id!, outPath, {
            name: job.details!.name!,
            path: job.details!.path!,
            workspace: job.workspace!,
            description: job.details!.single!.description!,
            source: job.source!,
        });

        log.debug('Job finished');
    } catch (e) {
        log.warn('Got error while processing job:', e);
        reportError(job, e);
    } finally {
        working = false;
    }
    return true;
}

function getWrappedDistance(x: number, y: number, wrapAt: number): number {
    const big = Math.max(x, y) % wrapAt;
    const small = Math.min(x, y) % wrapAt;

    const forwardDistance = big - small;
    const backwardDistance = small + wrapAt - big;

    return Math.min(forwardDistance, backwardDistance);
}

function getMsToNextCheckin(offset: number, frequency_s: number): number {
    const msIntoBlock = Date.now() % (frequency_s * 1000);
    const target = offset * 1000;

    if (target <= msIntoBlock) {
        return target + frequency_s * 1000 - msIntoBlock;
    }
    return target - msIntoBlock;
}

async function getIdealOffset(checkinFrequency: number): Promise<number> {
    log.trace('Getting ideal offset w/ checkin frequency %d...', checkinFrequency);
    const workerStartHistogram: number[] = new Array(checkinFrequency);
    const workerStartOptimizationHistogram: number[] = new Array(checkinFrequency);
    workerStartHistogram.fill(0);
    workerStartOptimizationHistogram.fill(0);

    const db = await mongo;

    log.trace('Attempting to prune workers...');
    await io.pruneWorkers(kPsk);
    log.trace('STARTUP: Got worker timestamps');
    const workers = await db.workers.find().toArray();

    for (const worker of workers) {
        let start = (new Date(worker.startTime).getTime() / 1000) % checkinFrequency;
        while (start < checkinFrequency) {
            workerStartHistogram[Math.floor(start)] += 1;
            start += worker.checkinFrequency;
        }
    }

    for (let i = 0; i < checkinFrequency; i++) {
        const numWorkersInBucket = workerStartHistogram[i];
        for (let j = 0; j < checkinFrequency; j++) {
            workerStartOptimizationHistogram[j] +=
                numWorkersInBucket * (1 / (1 + getWrappedDistance(i, j, checkinFrequency)));
        }
    }

    const idealStartOffset = workerStartOptimizationHistogram.indexOf(
        workerStartOptimizationHistogram.reduce((prev, cur) => Math.min(prev, cur), Number.POSITIVE_INFINITY),
    );

    return idealStartOffset;
}

async function setup() {
    const checkinFrequency = parseInt(process.env['CHECKIN_FREQUENCY'] ?? '10');
    log.trace('STARTUP: Got checkin frequency %d sec', checkinFrequency);

    const idealOffset =
        'CHECKIN_OFFSET' in process.env
            ? parseInt(process.env['CHECKIN_OFFSET']!)
            : await getIdealOffset(checkinFrequency);

    log.trace('STARTUP: Pruned workers');

    const startTime = new Date(Date.now() + getMsToNextCheckin(idealOffset, checkinFrequency)).getTime();

    const info = await io.registerWorker(kPsk, checkinFrequency);
    if (info.error !== null || !info.data) {
        console.warn(info.error);
        return;
    }
    const myid = info.data;

    log.info(
        'STARTUP: Will check in at',
        startTime,
        '(with offset',
        idealOffset,
        '– in',
        getMsToNextCheckin(idealOffset, checkinFrequency),
        'ms), and every',
        checkinFrequency,
        'seconds after that',
    );

    const processor = new Processor(myid, io, kPsk);

    io.addWorkerListener(async (job: Transport.Job, ack) => {
        log.info('Got job offer! %j', job);
        ack(await doDownload(processor, job));
    });

    async function checkIn() {
        log.debug('Checking in...');
        await io.workerCheckIn(kPsk, myid);

        if (!working) {
            await io.adminRequestJob(kPsk, myid);
        }

        const nextCheckin = getMsToNextCheckin(idealOffset, checkinFrequency);
        log.trace('Will check in again in ' + nextCheckin + 'ms');

        setTimeout(checkIn, nextCheckin);
    }

    log.info('Worker started.');
    setTimeout(checkIn, getMsToNextCheckin(idealOffset, checkinFrequency));
}
