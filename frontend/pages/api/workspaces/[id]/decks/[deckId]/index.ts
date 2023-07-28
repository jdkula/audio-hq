import type { NextApiRequest, NextApiResponse } from 'next';
import { mongo } from 'common/db/mongodb';
import { audiohq } from 'common/generated/proto';
import { asString, asObjectId } from 'common/db/oid_helpers';
import { readStream } from '../../..';
import { ObjectId } from 'mongodb';

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

    const deckIdString = (req.query.deckId as string);
    if (!deckIdString) return void res.status(400).end();
    const deckId =
        deckIdString.toLowerCase() === 'main'
            ? (await db.decks.findOne({ type: audiohq.DeckType.MAIN, _workspace: wsId }))?._id
            : asObjectId(deckIdString);

    switch (req.method?.toUpperCase()) {
        case 'GET': {
            if (!deckId) {
                return void res.status(404).end();
            }

            const result = await db.decks.findOne({ _id: deckId, _workspace: wsId });
            if (!result) {
                return void res.status(404).end();
            }

            return void res.send(
                audiohq.Deck.encode({
                    ...result,
                    id: asString(result._id),
                    queue: result.queue.map((oid) => asString(oid)),
                }).finish(),
            );
        }
        case 'PATCH': {
            const input = await readStream(req);
            if (!input) {
                return void res.status(400).end();
            }
            const deckInput = audiohq.DeckMutate.decode(input);
            if (deckIdString.toLowerCase() === 'main' && !deckId) {
                const result = await db.decks.findOneAndUpdate(
                    deckId ? { _id: deckId, _workspace: wsId } : { _workspace: wsId },
                    {
                        $set: deckInput.toJSON(),
                        $setOnInsert: {
                            createdAt: Date.now(),
                            pausedTimestamp: 0,
                            playing: true,
                            queue: [],
                            speed: 1,
                            startTimestamp: Date.now(),
                            type: audiohq.DeckType.MAIN,
                            volume: 1,
                        },
                    },
                    { returnDocument: 'after', upsert: true },
                );
                if (!result.ok || !result.value) {
                    return void res.status(500).end();
                }
                return void res.send(
                    audiohq.Deck.encode({
                        ...result.value,
                        id: asString(result.value._id),
                        queue: result.value.queue.map((oid) => asString(oid)),
                    }).finish(),
                );
            } else {
                const result = await db.decks.findOneAndUpdate(
                    { _id: deckId, _workspace: wsId },
                    {
                        $set: deckInput.toJSON(),
                    },
                    { returnDocument: 'after' },
                );
                if (!result.ok || !result.value) {
                    console.log(result);
                    return void res.status(500).end();
                }
                return void res.send(
                    audiohq.Deck.encode({
                        ...result.value,
                        id: asString(result.value._id),
                        queue: result.value.queue.map((oid) => asString(oid)),
                    }).finish(),
                );
            }
        }
        case 'DELETE': {
            if (!deckId) {
                return void res.status(404).end();
            }

            const result = await db.decks.deleteOne({
                _id: deckId,
                _workspace: wsId,
            });

            if (!result || !result.acknowledged || result.deletedCount === 0) {
                return void res.status(404).end();
            }

            return void res.status(204).end();
        }
    }

    return void res.status(404).end();
}
