import type { NextApiRequest, NextApiResponse } from 'next';
import { EntriesCollectionType, mongo } from 'common/db/mongodb';
import { audiohq } from 'common/generated/proto';
import { asString, asObjectId } from 'common/db/oid_helpers';
import { readStream } from '../..';

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

    switch (req.method?.toUpperCase()) {
        case 'GET': {
            const results = await db.entries.find({ _workspace: wsId }).toArray();

            return void res.send(
                audiohq.ListEntriesResponse.encode({
                    entries: results.map((res) => ({ ...res, id: asString(res._id) })),
                }).finish(),
            );
        }
        case 'POST': {
            const input = await readStream(req);
            if (!input) {
                return void res.status(400).end();
            }
            const entryInput = audiohq.EntryMutate.decode(input);
            if (!entryInput.folder || !entryInput.folder.name) {
                return void res.status(400).end();
            }

            const entry: EntriesCollectionType = {
                _workspace: wsId,
                folder: {
                    name: entryInput.folder.name,
                    path: entryInput.folder.path ?? [],
                    ordering: entryInput.folder.last ? null : entryInput.folder.ordering!,
                },
            };
            const result = await db.entries.insertOne(entry);
            return void res.send(
                audiohq.Entry.encode({
                    id: asString(result.insertedId),
                    folder: entry.folder,
                }).finish(),
            );
        }
    }

    return void res.status(404).end();
}
