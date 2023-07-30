import type { NextApiRequest, NextApiResponse } from 'next';
import { readStream } from '../..';
import { AudioHQApiImpl } from '~/common/server/api';

export const config = {
    runtime: 'nodejs',
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method?.toUpperCase()) {
        case 'GET': {
            res.send(await AudioHQApiImpl.listJobs(req.query.id as string));
            return;
        }
        case 'POST': {
            const input = await readStream(req);
            // TODO
            res.send(await AudioHQApiImpl.submitUrl(req.query.id as string, input, ''))
            return;
        }
    }

    res.status(404).end();
}
