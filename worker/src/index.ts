import { createUrqlClient } from "./urql_worker";
import * as GQL from "./generated/graphql";
import { pipe, subscribe } from "wonka";
import { Processor } from "./processor";
import { v4 } from "uuid";
import fsProm from "fs/promises";
import { AppFS } from "./filesystems/FileSystem";

import { Logger } from "tslog";

const log = new Logger({ name: "worker" });

const client = createUrqlClient();
const processor = new Processor(client);
const myid = v4();

let working = false;

async function doJobs() {
  if (working) return;
  working = true;
  try {
    while (true) {
      log.silly("Attempting to claim a job...");
      const jobRaw = await client
        .mutation<GQL.ClaimJobMutation, GQL.ClaimJobMutationVariables>(
          GQL.ClaimJobDocument,
          {
            myId: myid,
          }
        )
        .toPromise();

      const job = jobRaw.data?.claim_job;
      if (!job || !job.id) {
        log.silly("No job found. Waiting for more jobs...");
        return;
      }

      log.debug("Job found", job);
      let inPath;
      if (job.file_upload) {
        log.silly("Raw file upload found. Saving to disk...");
        inPath = await processor.saveInput(job.file_upload);
      } else if (job.url) {
        log.silly("Import found. Downloading...");
        inPath = await processor.download(job.url, job.id, job.options);
      } else {
        throw new Error("Neither job nor file upload is defined!");
      }

      log.silly("Converting...");
      const outPath = await processor.convert(inPath, job.id, job.options);

      log.silly("Adding to AHQ...");
      await processor.addFile(job.id, outPath, {
        name: job.name,
        path: job.path,
        workspace: job.workspace_id,
        description: job.description,
      });

      log.debug("Job finished");
    }
  } finally {
    working = false;
  }
}

let deleting = false;

async function dpDeletion() {
  if (deleting) return;
  deleting = true;
  try {
    while (true) {
      log.silly("Attempting to claim a delete job...");
      const jobRaw = await client
        .mutation<
          GQL.ClaimDeleteJobMutation,
          GQL.ClaimDeleteJobMutationVariables
        >(GQL.ClaimDeleteJobDocument, {
          myId: myid,
        })
        .toPromise();

      const job = jobRaw.data?.claim_delete_job;
      if (!job || !job.id) {
        log.silly("No delete job found. Waiting for more delete jobs...", job);
        return;
      }

      log.debug("Delete job received", job);
      log.silly("Deleting file in database...");
      await client
        .mutation<
          GQL.CommitDeleteJobMutation,
          GQL.CommitDeleteJobMutationVariables
        >(GQL.CommitDeleteJobDocument, {
          jobId: job.id,
          fileId: job.file.id,
        })
        .toPromise();

      if (job.file.provider_id) {
        log.silly("Deleting in AWS...");
        await AppFS.delete(job.file.provider_id);
      } else {
        log.debug(
          "No provide ID associated with this file, skipping AWS delete..."
        );
      }

      log.debug("Delete job finished");
    }
  } finally {
    deleting = false;
  }
}

const newJobs = client.subscription<
  GQL.NewJobsSubscriptionSubscription,
  GQL.NewJobsSubscriptionSubscriptionVariables
>(GQL.NewJobsSubscriptionDocument);

const newDeleteJobs = client.subscription<
  GQL.DeleteJobsSubscriptionSubscription,
  GQL.DeleteJobsSubscriptionSubscriptionVariables
>(GQL.DeleteJobsSubscriptionDocument);

pipe(
  newJobs,
  subscribe((result) => {
    log.silly("Got new jobs data", result.data);
    if (!result.data || result.data.job.length == 0) return;
    doJobs();
  })
);

pipe(
  newDeleteJobs,
  subscribe((result) => {
    log.silly("Got new delete jobs data", result.data);
    if (!result.data || result.data.delete_job.length == 0) return;
    dpDeletion();
  })
);

log.info("Worker started");
