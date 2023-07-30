import type { NextApiRequest, NextApiResponse } from 'next';
import { readStream } from '..';
import { AudioHQApiImpl } from '~/common/server/api';
import makeHandler from '~/common/server/nextjsWrapper';

export const config = {
    runtime: 'nodejs',
    api: {
        bodyParser: false,
    },
};

export default makeHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method?.toUpperCase()) {
        case 'GET': {
            const id = req.query.id as string;
            res.send(await AudioHQApiImpl.getWorkspace(id));
            return;
        }
        case 'PATCH': {
            const id = req.query.id as string;
            const input = await readStream(req);
            res.send(await AudioHQApiImpl.updateWorkspace(id, input));
            return;
        }
    }

    res.status(404).end();
});
