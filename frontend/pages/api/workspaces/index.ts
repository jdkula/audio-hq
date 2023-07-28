import type { NextApiRequest, NextApiResponse } from 'next';
import { mongo } from 'common/db/mongodb';
import { audiohq } from 'common/generated/proto';
import { arrayBuffer } from 'node:stream/consumers';
import { asString } from 'common/db/oid_helpers';

export const config = {
    runtime: 'nodejs',
    api: {
        bodyParser: false,
    },
};

export async function readStream(req: NodeJS.ReadableStream): Promise<Uint8Array> {
    return new Uint8Array(await arrayBuffer(req));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await mongo;

    switch (req.method?.toUpperCase()) {
        case 'GET': {
            const query = req.query.q;
            if (!query) {
                res.send(audiohq.WorkspaceSearchResponse.encode({ results: [] }).finish());
                return;
            }

            const results = (
                await db.workspaces
                    .find({ name: { $regex: new RegExp('^' + query + '$', 'i') } }, { limit: 5 })
                    .toArray()
            ).map((ws) => ({ ...ws, id: asString(ws._id) }) satisfies audiohq.IWorkspace);

            res.send(audiohq.WorkspaceSearchResponse.encode({ results }).finish());
            return;
        }
        case 'POST': {
            const input = await readStream(req);
            if (!input) {
                res.status(400).end();
                return;
            }
            const wsInput = audiohq.WorkspaceMutate.decode(input).toJSON();
            const ws = { ...wsInput, createdAt: Date.now(), updatedAt: Date.now(), name: wsInput.name };
            if (!ws.name) {
                res.status(400).end();
                return;
            }
            const result = await db.workspaces.insertOne(ws);
            res.send(
                audiohq.Workspace.encode({
                    ...ws,
                    id: asString(result.insertedId),
                }).finish(),
            );
            return;
        }
    }

    res.status(404).end();
}
