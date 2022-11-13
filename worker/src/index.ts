import * as GQL from './generated/graphql';
import { Processor } from './processor';
import { AppFS } from './filesystems/FileSystem';

import { Logger } from 'tslog';
import { myid } from './id';
import { createGraphqlRequestClient } from './gql_request_client';

const log = new Logger({ name: 'worker' });

const client = createGraphqlRequestClient();
const processor = new Processor(client);

let working = false;

async function reportError(jobId: string, e: any) {
    await client.request(GQL.SetJobErrorDocument, {
        error:
            e instanceof Error
                ? e.name + '\ncause: ' + e.cause + '\nstack trace: ' + e.stack
                : e.toString instanceof Function
                ? e.toString()
                : 'Unknown error',
        jobId,
    });
}

async function doJobs() {
    if (working) return;
    working = true;
    try {
        while (true) {
            log.silly('Attempting to claim a job...');
            const jobRaw = await client.request(GQL.ClaimJobDocument, {
                myId: myid,
            });

            const job = jobRaw?.claim_job;
            if (!job || !job.id) {
                log.silly('No job found. Waiting for more jobs...');
                return;
            }

            try {
                log.debug('Job found', job);
                let inPath;
                if (job.file_upload) {
                    log.silly('Raw file upload found. Saving to disk...');
                    inPath = await processor.saveInput(job.file_upload.base64);
                } else if (job.url) {
                    log.silly('Import found. Downloading...');
                    let cut: any = { start: job.option_cut_start, end: job.option_cut_end };
                    if (!cut.start) cut = undefined;

                    inPath = await processor.download(job.url, job.id, {
                        cut,
                        fadeIn: job.option_fade_in ?? undefined,
                        fadeOut: job.option_fade_out ?? undefined,
                    });
                } else {
                    throw new Error('Neither job nor file upload is defined!');
                }

                log.silly('Converting...');
                let cut: any = { start: job.option_cut_start, end: job.option_cut_end };
                if (!cut.start) cut = undefined;

                const outPath = await processor.convert(inPath, job.id, {
                    cut,
                    fadeIn: job.option_fade_in ?? undefined,
                    fadeOut: job.option_fade_out ?? undefined,
                });

                log.silly('Adding to AHQ...');
                await processor.addFile(job.id, outPath, {
                    name: job.name,
                    path: job.path,
                    workspace: job.workspace_id,
                    description: job.description,
                });

                log.debug('Job finished');
            } catch (e) {
                log.warn('Got error while processing job:', e);
                reportError(job.id, e);
            }
        }
    } finally {
        working = false;
    }
}

let deleting = false;

async function doDeletion() {
    if (deleting) return;
    deleting = true;
    try {
        while (true) {
            log.silly('Attempting to claim a delete job...');
            const jobRaw = await client.request(GQL.ClaimDeleteJobDocument, {
                myId: myid,
            });

            const job = jobRaw?.claim_delete_job;
            if (!job || !job.id) {
                log.silly('No delete job found. Waiting for more delete jobs...', job);
                return;
            }

            try {
                log.debug('Delete job received', job);
                log.silly('Deleting file in database...');
                await client.request(GQL.CommitDeleteJobDocument, {
                    jobId: job.id,
                    fileId: job.single.dirent.id,
                });

                if (job.single.provider_id) {
                    log.silly('Deleting in AWS...');
                    await AppFS.delete(job.single.provider_id);
                } else {
                    log.debug('No provide ID associated with this file, skipping AWS delete...');
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

async function checkIn() {
    log.debug('Checking in...');
    await client.request(GQL.CheckInDocument, { myId: myid });

    doJobs();
    doDeletion();

    setTimeout(checkIn, 10000);
}

log.info('Worker started.');
checkIn();
