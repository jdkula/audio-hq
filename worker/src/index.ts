import { createUrqlClient } from './urql_worker';
import * as GQL from './generated/graphql';
import { pipe, subscribe, onEnd } from 'wonka';
import { Processor } from './processor';
import { AppFS } from './filesystems/FileSystem';

import { Logger } from 'tslog';
import { myid } from './id';

const log = new Logger({ name: 'worker' });

const client = createUrqlClient();
const processor = new Processor(client);

let working = false;

async function reportError(jobId: string, e: any) {
    await client
        .mutation<GQL.SetJobErrorMutation, GQL.SetJobErrorMutationVariables>(GQL.SetJobErrorDocument, {
            jobId,
            error:
                e instanceof Error
                    ? e.name + '\ncause: ' + e.cause + '\nstack trace: ' + e.stack
                    : e.toString instanceof Function
                    ? e.toString()
                    : 'Unknown error',
        })
        .toPromise();
}

async function doJobs() {
    if (working) return;
    working = true;
    try {
        while (true) {
            log.silly('Attempting to claim a job...');
            const jobRaw = await client
                .mutation<GQL.ClaimJobMutation, GQL.ClaimJobMutationVariables>(GQL.ClaimJobDocument, {
                    myId: myid,
                })
                .toPromise();

            const job = jobRaw.data?.claim_job;
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
            const jobRaw = await client
                .mutation<GQL.ClaimDeleteJobMutation, GQL.ClaimDeleteJobMutationVariables>(GQL.ClaimDeleteJobDocument, {
                    myId: myid,
                })
                .toPromise();

            const job = jobRaw.data?.claim_delete_job;
            if (!job || !job.id) {
                log.silly('No delete job found. Waiting for more delete jobs...', job);
                return;
            }

            try {
                log.debug('Delete job received', job);
                log.silly('Deleting file in database...');
                await client
                    .mutation<GQL.CommitDeleteJobMutation, GQL.CommitDeleteJobMutationVariables>(
                        GQL.CommitDeleteJobDocument,
                        {
                            jobId: job.id,
                            fileId: job.file.id,
                        },
                    )
                    .toPromise();

                if (job.file.provider_id) {
                    log.silly('Deleting in AWS...');
                    await AppFS.delete(job.file.provider_id);
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

let ready = false;

function setup() {
    const newJobs = client.subscription<
        GQL.NewJobsSubscriptionSubscription,
        GQL.NewJobsSubscriptionSubscriptionVariables
    >(GQL.NewJobsSubscriptionDocument);

    const newDeleteJobs = client.subscription<
        GQL.DeleteJobsSubscriptionSubscription,
        GQL.DeleteJobsSubscriptionSubscriptionVariables
    >(GQL.DeleteJobsSubscriptionDocument);

    function setupJobsSubscription() {
        pipe(
            newJobs,
            onEnd(() => {
                log.warn('Jobs subscription ended, recreating...');
                setupJobsSubscription();
            }),
            subscribe((result) => {
                log.silly('Got new jobs data', result.data);
                if (!result.data || result.data.available_jobs.length == 0) return;
                doJobs();
            }),
        );
    }

    function setupDeleteJobsSubscription() {
        pipe(
            newDeleteJobs,
            onEnd(() => {
                log.warn('Delete jobs subscription ended, recreating...');
                setupDeleteJobsSubscription();
            }),
            subscribe((result) => {
                log.silly('Got new delete jobs data', result.data);
                if (!result.data || result.data.delete_job.length == 0) return;
                doDeletion();
            }),
        );
    }

    setupJobsSubscription();
    setupDeleteJobsSubscription();
    ready = true;
    log.info('Worker started');
}

async function checkIn() {
    log.debug('Checking in...');
    await client
        .mutation<GQL.CheckInMutation, GQL.CheckInMutationVariables>(GQL.CheckInDocument, { myId: myid })
        .toPromise();

    if (!ready) {
        log.info('Starting subscription...');
        setup();
    }

    doJobs();
    doDeletion();

    setTimeout(checkIn, 10000);
}
checkIn();
