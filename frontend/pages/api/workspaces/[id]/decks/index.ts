import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { DecksCollectionType, mongo } from 'common/db/mongodb';
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
            const results = await db.decks.find({ _workspace: wsId }).toArray();

            return void res.send(
                audiohq.ListDecksResponse.encode({
                    results: results.map((deck) => ({
                        ...deck,
                        id: asString(deck._id),
                        queue: deck.queue.map((oid) => asString(oid)),
                    })),
                }).finish(),
            );
        }
        case 'POST': {
            const input = await readStream(req);
            if (!input) {
                return void res.status(400).end();
            }
            const entryInput = audiohq.DeckCreate.decode(input);

            const deck: DecksCollectionType = {
                _workspace: wsId,
                createdAt: Date.now(),
                pausedTimestamp: entryInput.pausedTimestamp ?? 0,
                playing: entryInput.playing ?? false,
                speed: entryInput.speed,
                startTimestamp: entryInput.startTimestamp,
                type: entryInput.type,
                volume: entryInput.volume,
                queue: entryInput.queue.map((oid) => asObjectId(oid)),
            };
            let oid: ObjectId;
            if (deck.type === audiohq.DeckType.MAIN) {
                const result = await db.decks.findOneAndUpdate(
                    { _workspace: wsId, type: audiohq.DeckType.MAIN },
                    { $set: deck },
                    { upsert: true, returnDocument: 'after' },
                );
                if (!result.value || !result.ok) {
                    return void res.status(500).end();
                }
                oid = result.value._id;
            } else {
                const result = await db.decks.insertOne(deck);
                oid = result.insertedId;
            }
            return void res.send(
                audiohq.Deck.encode({
                    ...deck,
                    id: oid.toHexString(),
                    queue: deck.queue.map((oid) => asString(oid)),
                }).finish(),
            );
        }
    }

    return void res.status(404).end();
}
