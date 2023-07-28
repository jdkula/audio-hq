import type { NextApiRequest, NextApiResponse } from 'next';
import { mongo } from 'common/db/mongodb';
import { audiohq } from 'common/generated/proto';
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
    if (!wsIdString) return void res.status(400).end();
    const wsId = asObjectId(wsIdString);

    const jobIdString = req.query.jobId as string;
    if (!wsIdString) return void res.status(400).end();
    const jobId = asObjectId(jobIdString);

    switch (req.method?.toUpperCase()) {
        case 'GET': {
            const result = await db.jobs.findOne({ _id: jobId, _workspace: wsId });
            if (!result) {
                return void res.status(404).end();
            }

            return void res.send(audiohq.Job.encode({ ...result, id: asString(result._id) }).finish());
        }
        case 'DELETE': {
            const result = await db.jobs.deleteOne({
                _id: jobId,
                _workspace: wsId,
                status: { $in: [audiohq.JobStatus.DONE, audiohq.JobStatus.ERROR] },
            });

            if (!result || !result.acknowledged || result.deletedCount === 0) {
                return void res.status(404).end();
            }

            return void res.status(204).end();
        }
    }

    return void res.status(404).end();
}
