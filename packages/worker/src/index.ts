import { Logger } from 'tslog';

import { audiohq } from 'common/lib/generated/proto';
import { mongo } from 'service/lib/db/mongodb';
import SocketTransport from 'clients/lib/impl/socketio.transport';

import { Processor } from './processor';

const kPsk = process.env.WORKER_PSK as string;

const io = new SocketTransport<Buffer>(process.env.NEXT_PUBLIC_WS_URL as string);
const log = new Logger({ name: 'worker' });

let working = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function reportError(job: audiohq.IJob, e: any) {
    await io.adminUpdateJob(
        kPsk,
        job.workspace!,
        job.id!,
        Buffer.from(
            audiohq.WorkerJobUpdate.encode({
                ...job,
                status: audiohq.JobStatus.ERROR,
                errorDetails:
                    e instanceof Error
                        ? e.name + '\ncause: ' + e.cause + '\nstack trace: ' + e.stack
                        : e.toString instanceof Function
                        ? e.toString()
                        : 'Unknown error',
            }).finish(),
        ),
    );
}

async function doDownload(processor: Processor, job: audiohq.IJob) {
    if (working) return false;
    working = true;
    try {
        // log.debug('Job found', job.value);
        log.silly('Import found. Downloading...');
        const cut = job.modifications?.find((x) => x.cut)?.cut;
        const fade = job.modifications?.find((x) => x.fade)?.fade;

        const inPath = await processor.download(job.source!, job.workspace!, job.id!);

        log.silly('Converting...');

        const outPath = await processor.convert(inPath, job.workspace!, job.id!, {
            cut: cut ? { start: cut.startSeconds!, end: cut.endSeconds! } : null,
            fadeIn: fade?.inSeconds ?? undefined,
            fadeOut: fade?.outSeconds ?? undefined,
        });

        log.silly('Adding to AHQ...');
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
    const workerStartHistogram: number[] = new Array(checkinFrequency);
    const workerStartOptimizationHistogram: number[] = new Array(checkinFrequency);
    workerStartHistogram.fill(0);
    workerStartOptimizationHistogram.fill(0);

    const db = await mongo;

    await io.pruneWorkers(kPsk);
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

    const idealOffset =
        'CHECKIN_OFFSET' in process.env
            ? parseInt(process.env['CHECKIN_OFFSET']!)
            : await getIdealOffset(checkinFrequency);

    log.silly('STARTUP: Pruned workers');

    const startTime = new Date(Date.now() + getMsToNextCheckin(idealOffset, checkinFrequency)).getTime();

    const info = await io.registerWorker(kPsk, checkinFrequency);
    if (info.error || !info.data) {
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

    io.addWorkerListener(async (proto: Buffer, ack) => {
        const job = audiohq.ClaimJob.decode(new Uint8Array(proto));

        if (!job.downloadJob) return void ack(false);

        ack(await doDownload(processor, job.downloadJob));
    });

    async function checkIn() {
        log.debug('Checking in...');
        await io.workerCheckIn(kPsk, myid);

        await io.adminRequestJob(kPsk, myid);

        const nextCheckin = getMsToNextCheckin(idealOffset, checkinFrequency);
        log.silly('Will check in again in ' + nextCheckin + 'ms');

        setTimeout(checkIn, nextCheckin);
    }

    log.info('Worker started.');
    setTimeout(checkIn, getMsToNextCheckin(idealOffset, checkinFrequency));
}

setup();
