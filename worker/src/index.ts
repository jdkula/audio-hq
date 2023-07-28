import { Processor } from './processor';
import { AppFS } from './filesystems/FileSystem';

import { Logger } from 'tslog';
import { myid } from './id';
import { mongo } from './common/db/mongodb';
import { audiohq } from './common/generated/proto.js';
import { ObjectId } from 'mongodb';

const log = new Logger({ name: 'worker' });

const processor = new Processor();

let working = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function reportError(jobId: ObjectId, e: any) {
    await (
        await mongo
    ).jobs.findOneAndUpdate(
        { _id: jobId },
        {
            $set: {
                status: audiohq.JobStatus.ERROR,
                errorInfo:
                    e instanceof Error
                        ? e.name + '\ncause: ' + e.cause + '\nstack trace: ' + e.stack
                        : e.toString instanceof Function
                        ? e.toString()
                        : 'Unknown error',
            },
        },
    );
}

async function doJobs() {
    if (working) return;
    working = true;
    const db = await mongo;
    try {
        while (true) {
            log.silly('Attempting to claim a job...');
            const job = await db.jobs.findOneAndUpdate({ assignedWorker: null }, { $set: { assignedWorker: myid } });

            if (!job.value) {
                log.silly('No job found. Waiting for more jobs...');
                return;
            }

            try {
                // log.debug('Job found', job.value);
                log.silly('Import found. Downloading...');
                const cut = job.value.modifications?.find((x) => x.cut)?.cut;
                const fade = job.value.modifications?.find((x) => x.fade)?.fade;

                const inPath = await processor.download(job.value.url!, job.value._id);

                log.silly('Converting...');

                const outPath = await processor.convert(inPath, job.value._id, {
                    cut: cut ? { start: cut.startSeconds!, end: cut.endSeconds! } : null,
                    fadeIn: fade?.inSeconds ?? undefined,
                    fadeOut: fade?.outSeconds ?? undefined,
                });

                log.silly('Adding to AHQ...');
                await processor.addFile(job.value._id, outPath, {
                    name: job.value.details!.name!,
                    path: job.value.details!.path!,
                    workspace: job.value._workspace,
                    description: job.value.details!.description!,
                    source: job.value.url ?? undefined,
                });

                log.debug('Job finished');
            } catch (e) {
                log.warn('Got error while processing job:', e);
                reportError(job.value._id, e);
            }
        }
    } finally {
        working = false;
    }
}

let deleting = false;

async function pruneWorkers() {
    const db = await mongo;
    const session = db.client.startSession({
        defaultTransactionOptions: {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' },
        },
    });

    try {
        await session.withTransaction(async () => {
            const result = await db.workers
                .find(
                    {
                        $expr: {
                            $lt: [
                                '$lastCheckinTime',
                                { $add: ['$lastCheckinTime', { $multiply: ['$checkinFrequency', 3] }] },
                            ],
                        },
                    },
                    { session },
                )
                .toArray();

            await db.workers.deleteMany({ _id: { $in: result.map((wk) => wk._id) } }, { session });
            await db.jobs.updateMany(
                { assignedWorker: { $in: result.map((wk) => wk._id) } },
                { $set: { assignedWorker: null } },
                { session },
            );
        });
    } finally {
        await session.endSession();
    }
}

async function doDeletion() {
    if (deleting) return;
    deleting = true;
    const db = await mongo;
    try {
        while (true) {
            log.silly('Attempting to claim a delete job...');

            await pruneWorkers();
            const jobRaw = await db.deletejobs.findOneAndUpdate(
                { assignedWorker: null },
                { $set: { assignedWorker: myid } },
            );

            if (!jobRaw.ok || !jobRaw.value) {
                log.silly('No delete job found. Waiting for more delete jobs...');
                return;
            }
            const job = jobRaw.value;

            try {
                log.debug('Delete job received', job);
                log.silly('Deleting file in database...');

                const session = db.client.startSession({
                    defaultTransactionOptions: {
                        readPreference: 'primary',
                        readConcern: { level: 'local' },
                        writeConcern: { w: 'majority' },
                    },
                });

                try {
                    await session.withTransaction(async () => {
                        if (job.providerId) {
                            log.silly('Deleting in AWS...');
                            await AppFS.delete(job.providerId);
                        } else {
                            log.debug('No provide ID associated with this file, skipping AWS delete...');
                        }
                        await db.entries.deleteOne({ _id: job.entryId }, { session });
                        await db.deletejobs.deleteOne({ _id: job._id }, { session });
                    });
                } finally {
                    await session.endSession();
                }

                log.debug('Delete job finished');
            } catch (e) {
                log.warn('Failed to remove file', e);
            }
        }
    } finally {
        deleting = false;
    }
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
    const workerStartHistogram: number[] = new Array(checkinFrequency);
    const workerStartOptimizationHistogram: number[] = new Array(checkinFrequency);
    workerStartHistogram.fill(0);
    workerStartOptimizationHistogram.fill(0);

    const db = await mongo;

    await pruneWorkers();
    log.silly('STARTUP: Got worker timestamps');
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
    log.silly('STARTUP: Got checkin frequency', checkinFrequency, 'sec');

    const db = await mongo;

    const idealOffset =
        'CHECKIN_OFFSET' in process.env
            ? parseInt(process.env['CHECKIN_OFFSET']!)
            : await getIdealOffset(checkinFrequency);

    await db.workers.deleteMany({
        $expr: { $lt: ['$lastCheckinTime', { $add: ['$lastCheckinTime', { $multiply: ['$checkinFrequency', 3] }] }] },
    });
    log.silly('STARTUP: Pruned workers');

    const startTime = new Date(Date.now() + getMsToNextCheckin(idealOffset, checkinFrequency)).getTime();

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

    async function checkIn() {
        log.debug('Checking in...');
        await db.workers.findOneAndUpdate(
            { _id: myid },
            { $set: { checkinFrequency, startTime, lastCheckinTime: Date.now() } },
            { upsert: true },
        );

        await pruneWorkers();
        doJobs();
        doDeletion();

        const nextCheckin = getMsToNextCheckin(idealOffset, checkinFrequency);
        log.silly('Will check in again in ' + nextCheckin + 'ms');

        setTimeout(checkIn, nextCheckin);
    }

    log.info('Worker started.');
    setTimeout(checkIn, getMsToNextCheckin(idealOffset, checkinFrequency));
}

setup();
