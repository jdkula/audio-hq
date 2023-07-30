import { IService, IServiceBase } from './IService';
import { DecksCollectionType, EntriesCollectionType, JobsCollectionType, mongo } from './db/mongodb';
import { asString, asObjectId } from './db/oid_helpers';
import { audiohq } from 'common/lib/generated/proto';
import { ObjectId } from 'mongodb';
import { InvalidInput, NotFound, OtherError } from './errors';

export const AudioHQServiceBase: IServiceBase<Uint8Array> = {
    async searchWorkspace(query: string): Promise<Uint8Array> {
        if (!query) {
            return audiohq.WorkspaceSearchResponse.encode({ results: [] }).finish();
        }

        const db = await mongo;

        const results = (
            await db.workspaces.find({ name: { $regex: new RegExp('^' + query + '$', 'i') } }, { limit: 5 }).toArray()
        ).map((ws) => ({ ...ws, id: asString(ws._id) }) satisfies audiohq.IWorkspace);

        return audiohq.WorkspaceSearchResponse.encode({ results }).finish();
    },
    async createWorkspace(input: Uint8Array): Promise<Uint8Array> {
        const db = await mongo;
        const wsInput = audiohq.WorkspaceMutate.decode(input).toJSON();
        const ws = { ...wsInput, createdAt: Date.now(), updatedAt: Date.now(), name: wsInput.name };
        if (!ws.name) {
            throw new InvalidInput();
        }
        const result = await db.workspaces.insertOne(ws);
        return audiohq.Workspace.encode({
            ...ws,
            id: asString(result.insertedId),
        }).finish();
    },
    async getWorkspace(id: string): Promise<Uint8Array> {
        const db = await mongo;
        if (!id) {
            throw new InvalidInput();
        }

        const result = await db.workspaces.findOne({ _id: asObjectId(id) });
        if (!result) {
            throw new NotFound();
        }

        return audiohq.Workspace.encode({ ...result, id: asString(result._id) }).finish();
    },
    async updateWorkspace(id: string, mutate: Uint8Array): Promise<Uint8Array> {
        const db = await mongo;
        if (!id) {
            throw new InvalidInput();
        }

        if (!mutate) {
            throw new InvalidInput();
        }
        const wsInput = audiohq.WorkspaceMutate.decode(mutate).toJSON();

        const result = await db.workspaces.findOneAndUpdate(
            { _id: asObjectId(id) },
            { $set: wsInput },
            { returnDocument: 'after' },
        );
        if (!result.ok || !result.value) {
            throw new NotFound();
        }

        return audiohq.Workspace.encode({ ...result.value, id: asString(result.value._id) }).finish();
    },
    async deleteWorkspace(): Promise<void> {
        // TODO
        throw new OtherError();
    },
    async listEntries(workspaceId: string): Promise<Uint8Array> {
        if (!workspaceId) throw new InvalidInput();
        const db = await mongo;
        const results = await db.entries.find({ _workspace: asObjectId(workspaceId) }).toArray();

        return audiohq.ListEntriesResponse.encode({
            entries: results.map((res) => ({ ...res, id: asString(res._id) })),
        }).finish();
    },
    async createEntry(workspaceId: string, input: Uint8Array): Promise<Uint8Array> {
        const db = await mongo;
        if (!input || !workspaceId) {
            throw new InvalidInput();
        }
        const entryInput = audiohq.EntryMutate.decode(input);
        if (!entryInput.folder || !entryInput.folder.name) {
            throw new InvalidInput();
        }

        const entry: EntriesCollectionType = {
            _workspace: asObjectId(workspaceId),
            name: entryInput.folder.name,
            path: entryInput.folder.path ?? [],
            ordering: entryInput.folder.last ? null : entryInput.folder.ordering!,
            folder: {
                isFolder: true,
            },
        };
        const result = await db.entries.insertOne(entry);
        return audiohq.Entry.encode({
            id: asString(result.insertedId),
            folder: entry.folder,
        }).finish();
    },
    async getEntry(workspaceId: string, id: string): Promise<Uint8Array> {
        if (!workspaceId || !id) {
            throw new InvalidInput();
        }

        const db = await mongo;
        const result = await db.entries.findOne({ _id: asObjectId(id), _workspace: asObjectId(workspaceId) });
        if (!result) {
            throw new NotFound();
        }

        return audiohq.Entry.encode({ ...result, id: asString(result._id) }).finish();
    },
    async updateEntry(workspaceId: string, id: string, input: Uint8Array): Promise<Uint8Array> {
        const db = await mongo;
        if (!input || !workspaceId || !id) {
            throw new InvalidInput();
        }
        const entryInput = audiohq.EntryMutate.decode(input).toJSON();
        const result = await db.entries.findOneAndUpdate(
            { _id: asObjectId(id), _workspace: asObjectId(workspaceId) },
            { $set: entryInput },
            { returnDocument: 'after' },
        );
        if (!result.ok || !result.value) {
            throw new OtherError();
        }
        return audiohq.Entry.encode({ ...result.value, id: asString(result.value._id) }).finish();
    },
    async deleteEntry(workspaceId: string, id: string): Promise<void> {
        const db = await mongo;
        if (!workspaceId || !id) {
            throw new InvalidInput();
        }

        const oid = asObjectId(id);
        const oWsId = asObjectId(workspaceId);

        const result = await db.entries.findOne({
            _id: oid,
            _workspace: oWsId,
        });

        if (!result) {
            throw new NotFound();
        }

        if (result.folder) {
            const del = await db.entries.deleteOne({ _id: result._id });
            if (!del || !del.acknowledged) {
                throw new NotFound();
            }
        } else if (result.single) {
            const del = await db.deletejobs.insertOne({
                entryId: oid,
                _workspace: oWsId,
                assignedWorker: null,
                providerId: result.single.provider_id,
            });
            if (!del || !del.acknowledged) {
                throw new NotFound();
            }
        }
    },
    async listDecks(workspaceId: string): Promise<Uint8Array> {
        if (!workspaceId) throw new InvalidInput();

        const db = await mongo;
        const results = await db.decks.find({ _workspace: asObjectId(workspaceId) }).toArray();

        return audiohq.ListDecksResponse.encode({
            results: results.map((deck) => ({
                ...deck,
                id: asString(deck._id),
                queue: deck.queue.map((oid) => asString(oid)),
            })),
        }).finish();
    },
    async createDeck(workspaceId: string, input: Uint8Array): Promise<Uint8Array> {
        if (!input || !workspaceId) throw new InvalidInput();
        const db = await mongo;
        const entryInput = audiohq.DeckCreate.decode(input);

        const oWsId = asObjectId(workspaceId);

        const deck: DecksCollectionType = {
            _workspace: oWsId,
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
                { _workspace: oWsId, type: audiohq.DeckType.MAIN },
                { $set: deck },
                { upsert: true, returnDocument: 'after' },
            );
            if (!result.value || !result.ok) {
                throw new OtherError();
            }
            oid = result.value._id;
        } else {
            const result = await db.decks.insertOne(deck);
            oid = result.insertedId;
        }
        return audiohq.Deck.encode({
            ...deck,
            id: oid.toHexString(),
            queue: deck.queue.map((oid) => asString(oid)),
        }).finish();
    },
    async getDeck(workspaceId: string, id: string): Promise<Uint8Array> {
        if (!workspaceId || !id) throw new InvalidInput();
        const db = await mongo;

        const oWsId = asObjectId(workspaceId);
        const deckId =
            id.toLowerCase() === 'main'
                ? (await db.decks.findOne({ type: audiohq.DeckType.MAIN, _workspace: oWsId }))?._id
                : asObjectId(id);

        if (!deckId) {
            throw new NotFound();
        }

        const result = await db.decks.findOne({ _id: deckId, _workspace: oWsId });
        if (!result) {
            throw new NotFound();
        }

        return audiohq.Deck.encode({
            ...result,
            id: asString(result._id),
            queue: result.queue.map((oid) => asString(oid)),
        }).finish();
    },
    async updateDeck(workspaceId: string, id: string, input: Uint8Array): Promise<Uint8Array> {
        if (!input || !workspaceId || !id) throw new InvalidInput();
        const db = await mongo;
        const oWsId = asObjectId(workspaceId);
        const deckId =
            id.toLowerCase() === 'main'
                ? (await db.decks.findOne({ type: audiohq.DeckType.MAIN, _workspace: oWsId }))?._id
                : asObjectId(id);

        const deckInput = audiohq.DeckMutate.decode(input);
        if (id.toLowerCase() === 'main' && !deckId) {
            const result = await db.decks.findOneAndUpdate(
                deckId ? { _id: deckId, _workspace: oWsId } : { _workspace: oWsId },
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
                throw new OtherError();
            }
            return audiohq.Deck.encode({
                ...result.value,
                id: asString(result.value._id),
                queue: result.value.queue.map((oid) => asString(oid)),
            }).finish();
        } else {
            const result = await db.decks.findOneAndUpdate(
                { _id: deckId, _workspace: oWsId },
                {
                    $set: deckInput.toJSON(),
                },
                { returnDocument: 'after' },
            );
            if (!result.ok || !result.value) {
                console.log(result);
                throw new OtherError();
            }
            return audiohq.Deck.encode({
                ...result.value,
                id: asString(result.value._id),
                queue: result.value.queue.map((oid) => asString(oid)),
            }).finish();
        }
    },
    async deleteDeck(workspaceId: string, id: string): Promise<void> {
        if (!workspaceId || !id) throw new InvalidInput();
        const db = await mongo;
        const oWsId = asObjectId(workspaceId);
        const deckId =
            id.toLowerCase() === 'main'
                ? (await db.decks.findOne({ type: audiohq.DeckType.MAIN, _workspace: oWsId }))?._id
                : asObjectId(id);

        if (!deckId) {
            throw new NotFound();
        }

        const result = await db.decks.deleteOne({
            _id: deckId,
            _workspace: oWsId,
        });

        if (!result || !result.acknowledged || result.deletedCount === 0) {
            throw new NotFound();
        }
    },
    async listJobs(workspaceId: string): Promise<Uint8Array> {
        if (!workspaceId) throw new InvalidInput();
        const db = await mongo;
        const results = await db.jobs.find({ _workspace: asObjectId(workspaceId) }).toArray();

        return audiohq.ListJobsResponse.encode({
            results: results.map((res) => ({ ...res, id: asString(res._id) })),
        }).finish();
    },
    async uploadFile(workspaceId: string, input: Uint8Array, file: Blob): Promise<Uint8Array> {
        if (!input || !file || !workspaceId) throw new InvalidInput();
        // TODO
        throw new OtherError();
    },
    async submitUrl(workspaceId: string, input: Uint8Array, url: string): Promise<Uint8Array> {
        if (!input || !url || !workspaceId) throw new InvalidInput();
        const db = await mongo;
        const jobInput = audiohq.JobCreate.decode(input);
        if (!jobInput.details || !Array.isArray(jobInput.modifications)) {
            throw new InvalidInput();
        }
        const job: JobsCollectionType = {
            _workspace: asObjectId(workspaceId),
            assignedWorker: null,
            details: {
                description: jobInput.details.description ?? '',
                last: true,
                ordering: 0,
                name: jobInput.details.name ?? '',
                path: jobInput.details.path ?? [],
            },
            errorDetails: null,
            modifications: jobInput.modifications ?? [],
            progress: null,
            status: audiohq.JobStatus.GETTING_READY,
            url: url,
        };
        const result = await db.jobs.insertOne(job);
        return audiohq.Job.encode({
            ...job,
            id: asString(result.insertedId),
        }).finish();
    },
    async getJob(workspaceId: string, id: string): Promise<Uint8Array> {
        if (!workspaceId || !id) throw new InvalidInput();
        const db = await mongo;
        const results = await db.jobs.find({ _workspace: asObjectId(workspaceId) }).toArray();

        return audiohq.ListJobsResponse.encode({
            results: results.map((res) => ({ ...res, id: asString(res._id) })),
        }).finish();
    },
    async cancelJob(workspaceId: string, id: string): Promise<void> {
        if (!workspaceId || !id) throw new InvalidInput();
        // TODO;
        throw new OtherError();
    },
};