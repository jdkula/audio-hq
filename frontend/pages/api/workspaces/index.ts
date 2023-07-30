import type { NextApiRequest, NextApiResponse } from 'next';
import { arrayBuffer } from 'node:stream/consumers';
import makeHandler from '~/lib/api/wrapper';
import { AudioHQServiceBase } from 'service/lib/ServiceBase';

export const config = {
    runtime: 'nodejs',
    api: {
        bodyParser: false,
    },
};

export async function readStream(req: NodeJS.ReadableStream): Promise<Uint8Array> {
    return new Uint8Array(await arrayBuffer(req));
}

export default makeHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method?.toUpperCase()) {
        case 'GET': {
            const query = req.query.q as string;
            res.send(await AudioHQServiceBase.searchWorkspace(query));
            return;
        }
        case 'POST': {
            const input = await readStream(req);
            res.send(await AudioHQServiceBase.createWorkspace(input));
            return;
        }
    }

    res.status(404).end();
});
