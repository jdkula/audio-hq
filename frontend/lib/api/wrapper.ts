import { NextApiRequest, NextApiResponse } from 'next/types';
import { NotFound, InvalidInput } from 'service/lib/errors';

export default async function makeHandler(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            await handler(req, res);
        } catch (e) {
            if (e instanceof NotFound) {
                return void res.status(404).send({error: 'Not Found'});
            } else if (e instanceof InvalidInput) {
                return void res.status(400).send({error: 'Invalid Input'});
            }
            return void res.status(500).send({error: 'Server Error'});
        }
    };
}