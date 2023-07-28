import type { NextApiRequest, NextApiResponse } from 'next';
import { mongo } from 'common/db/mongodb';
import { audiohq } from 'common/generated/proto';
import { asString, asObjectId } from 'common/db/oid_helpers';
import { readStream } from '../../..';

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

    const entryIdString = req.query.entryId as string;
    if (!entryIdString) return void res.status(400).end();
    const entryId = asObjectId(entryIdString);

    switch (req.method?.toUpperCase()) {
        case 'GET': {
            const result = await db.entries.findOne({ _id: entryId, _workspace: wsId });
            if (!result) {
                return void res.status(404).end();
            }

            return void res.send(audiohq.Entry.encode({ ...result, id: asString(result._id) }).finish());
        }
        case 'PATCH': {
            const input = await readStream(req);
            if (!input) {
                return void res.status(400).end();
            }
            const entryInput = audiohq.EntryMutate.decode(input).toJSON();
            const result = await db.entries.findOneAndUpdate(
                { _id: entryId, _workspace: wsId },
                { $set: entryInput },
                { returnDocument: 'after' },
            );
            if (!result.ok || !result.value) {
                return void res.status(500).end();
            }
            return void res.send(audiohq.Entry.encode({ ...result.value, id: asString(result.value._id) }).finish());
        }
        case 'DELETE': {
            const result = await db.entries.findOne({
                _id: entryId,
                _workspace: wsId,
            });

            if (!result) {
                return void res.status(404).end();
            }

            if (result.folder) {
                const del = await db.entries.deleteOne({ _id: result._id });
                if (!del || !del.acknowledged) {
                    return void res.status(404).end();
                }
            } else if (result.single) {
                const del = await db.deletejobs.insertOne({
                    entryId: entryId,
                    _workspace: wsId,
                    assignedWorker: null,
                    providerId: result.single.provider_id,
                });
                if (!del || !del.acknowledged) {
                    return void res.status(404).end();
                }
            }

            return void res.status(204).end();
        }
    }

    return void res.status(404).end();
}
