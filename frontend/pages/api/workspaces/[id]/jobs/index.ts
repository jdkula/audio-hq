import type { NextApiRequest, NextApiResponse } from 'next';
import { JobsCollectionType, mongo } from 'common/db/mongodb';
import { audiohq } from 'common/generated/proto';
import { readStream } from '../..';
import { asString, asObjectId } from 'common/db/oid_helpers';

export const config = {
    runtime: 'nodejs',
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await mongo;
    const wsIdString = req.query.id as string;
    if (!wsIdString) {
        res.status(400).end();
        return;
    }
    const wsId = asObjectId(wsIdString);

    switch (req.method?.toUpperCase()) {
        case 'GET': {
            const results = await db.jobs.find({ _workspace: wsId }).toArray();

            res.send(
                audiohq.ListJobsResponse.encode({
                    results: results.map((res) => ({ ...res, id: asString(res._id) })),
                }).finish(),
            );
            return;
        }
        case 'POST': {
            const input = await readStream(req);
            if (!input) {
                res.status(400).end();
                return;
            }
            const jobInput = audiohq.JobCreate.decode(input);
            if (!jobInput.details || !Array.isArray(jobInput.modifications)) {
                res.status(400).end();
                return;
            }
            const job: JobsCollectionType = {
                _workspace: wsId,
                assignedWorker: null,
                details: {
                    description: jobInput.details.description ?? "",
                    last: true,
                    ordering: 0,
                    name: jobInput.details.name ?? "",
                    path: jobInput.details.path ?? []
                },
                errorDetails: null,
                modifications: jobInput.modifications ?? [],
                progress: null,
                status: audiohq.JobStatus.GETTING_READY,
                url: jobInput.url,
            };
            const result = await db.jobs.insertOne(job);
            res.send(
                audiohq.Job.encode({
                    ...job,
                    id: asString(result.insertedId),
                }).finish(),
            );
            return;
        }
    }

    res.status(404).end();
}
