import type { NextApiRequest, NextApiResponse } from 'next';
import { mongo } from 'common/db/mongodb';
import { audiohq } from 'common/generated/proto';
import { readStream } from '..';
import { asString, asObjectId } from 'common/db/oid_helpers';

export const config = {
    runtime: 'nodejs',
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await mongo;
    switch (req.method?.toUpperCase()) {
        case 'GET': {
            const id = req.query.id as string;
            if (!id) {
                res.status(400).end();
                return;
            }

            const result = await db.workspaces.findOne({ _id: asObjectId(id) });
            if (!result) {
                res.status(404).end();
                return;
            }

            res.send(audiohq.Workspace.encode({ ...result, id: asString(result._id) }).finish());
            return;
        }
        case 'PATCH': {
            const id = req.query.id as string;
            if (!id) {
                res.status(400).end();
                return;
            }

            const input = await readStream(req);
            if (!input) {
                res.status(400).end();
                return;
            }
            const wsInput = audiohq.WorkspaceMutate.decode(input).toJSON();

            const result = await db.workspaces.findOneAndUpdate(
                { _id: asObjectId(id) },
                { $set: wsInput },
                { returnDocument: 'after' },
            );
            if (!result.ok || !result.value) {
                res.status(404).end();
                return;
            }

            res.send(audiohq.Workspace.encode({ ...result.value, id: asString(result.value._id) }).finish());
            return;
        }
    }

    res.status(404).end();
}
