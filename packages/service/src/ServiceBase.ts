import { IServiceBase } from './IService';
import { DecksCollectionType, EntriesCollectionType, JobsCollectionType, mongo } from './db/mongodb';
import { asString, asObjectId } from './db/oid_helpers';
import { ObjectId } from 'mongodb';
import { InvalidInput, NotFound, OtherError, NotAuthorized } from './errors';

import S3FileSystem from './storage/S3FileSystem';
import {
    WorkspaceSearchResponse,
    WorkspaceMutate,
    Workspace,
    ListEntriesResponse,
    EntryMutate,
    Entry,
    ListDecksResponse,
    DeckMutate,
    Deck,
    ListJobsResponse,
    NewJob,
    Job,
    AdminJobMutate,
    JobComplete,
    DeckCreate,
    DeckType,
    JobStatus,
} from 'common/lib/api/transport/models';

const kAudioExtension = '.v1.mp3';

const asEntry = (res: EntriesCollectionType): Entry =>
    res.isFolder
        ? {
              ...pick(res, 'name', 'path'),
              ordering: res.ordering ?? 0,
              id: asString(res._id!),
              isFolder: true,
          }
        : {
              ...pick(res, 'name', 'path'),
              ordering: res.ordering ?? 0,
              id: asString(res._id!),
              isFolder: false,
              single: res.single!,
          };

const asDeck = (deck: DecksCollectionType): Deck => ({
    ...deck,
    id: asString(deck._id!),
    queue: deck.queue.map((oid) => asString(oid)),
});

const asJob = (job: JobsCollectionType): Job => ({
    ...job,
    id: asString(job._id!),
    assignedWorker: job.assignedWorker ? asString(job.assignedWorker) : null,
    workspace: asString(job._workspace),
});

function pick<T, K extends Array<keyof T>>(input: T, ...keys: K): Pick<T, K[number]> {
    const out: any = {};
    for (const key of keys) {
        out[key] = input[key];
    }
    return out;
}

export class AudioHQServiceBase implements IServiceBase {
    async searchWorkspace(query: string): Promise<WorkspaceSearchResponse> {
        if (!query) {
            return [];
        }

        const db = await mongo;

        const results = (
            await db.workspaces.find({ name: { $regex: new RegExp('^' + query + '$', 'i') } }, { limit: 5 }).toArray()
        ).map((ws) => ({ ...ws, id: asString(ws._id) }) satisfies Workspace);

        return results;
    }
    async createWorkspace(workspace: WorkspaceMutate): Promise<Workspace> {
        const db = await mongo;
        const ws = { createdAt: Date.now(), updatedAt: Date.now(), name: workspace.name };
        if (!ws.name) {
            throw new InvalidInput();
        }
        const result = await db.workspaces.insertOne(ws);
        return {
            ...ws,
            id: asString(result.insertedId),
        };
    }
    async getWorkspace(id: string): Promise<Workspace> {
        const db = await mongo;
        if (!id) {
            throw new InvalidInput();
        }

        const result = await db.workspaces.findOne({ _id: asObjectId(id) });
        if (!result) {
            throw new NotFound();
        }

        return { ...result, id: asString(result._id) };
    }
    async updateWorkspace(id: string, mutate: WorkspaceMutate): Promise<Workspace> {
        const db = await mongo;
        if (!id) {
            throw new InvalidInput();
        }

        if (!mutate) {
            throw new InvalidInput();
        }

        const result = await db.workspaces.findOneAndUpdate(
            { _id: asObjectId(id) },
            { $set: { name: mutate.name } },
            { returnDocument: 'after' },
        );
        if (!result.ok || !result.value) {
            throw new NotFound();
        }

        return {
            id,
            ...pick(result.value, 'name', 'createdAt', 'updatedAt'),
        };
    }
    async deleteWorkspace(id: string): Promise<void> {
        // TODO
        throw new OtherError('Not implemented // ' + id);
    }
    async listEntries(workspaceId: string): Promise<ListEntriesResponse> {
        if (!workspaceId) throw new InvalidInput();
        const db = await mongo;
        const results = await db.entries.find({ _workspace: asObjectId(workspaceId) }).toArray();

        return results.map(asEntry);
    }
    async createEntry(workspaceId: string, input: EntryMutate): Promise<Entry> {
        const db = await mongo;
        if (!input || !workspaceId) {
            throw new InvalidInput();
        }
        if (!input.isFolder || !input.name) {
            throw new InvalidInput();
        }

        const entry: EntriesCollectionType = {
            _workspace: asObjectId(workspaceId),
            name: input.name,
            path: input.path ?? [],
            ordering: input.ordering,
            isFolder: true,
        };
        const result = await db.entries.insertOne(entry);
        return {
            id: asString(result.insertedId),
            isFolder: true,
            name: entry.name,
            ordering: entry.ordering ?? 0,
            path: entry.path,
        };
    }
    async getEntry(workspaceId: string, id: string): Promise<Entry> {
        if (!workspaceId || !id) {
            throw new InvalidInput();
        }

        const db = await mongo;
        const result = await db.entries.findOne({ _id: asObjectId(id), _workspace: asObjectId(workspaceId) });
        if (!result) {
            throw new NotFound();
        }

        return asEntry(result);
    }
    async updateEntry(workspaceId: string, id: string, input: EntryMutate): Promise<Entry> {
        const db = await mongo;
        if (!input || !workspaceId || !id) {
            throw new InvalidInput();
        }
        const result = await db.entries.findOneAndUpdate(
            { _id: asObjectId(id), _workspace: asObjectId(workspaceId) },
            { $set: pick(input, 'name', 'ordering', 'path') },
            { returnDocument: 'after' },
        );
        if (!result.ok || !result.value) {
            throw new OtherError();
        }
        return asEntry(result.value);
    }
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

        if (result.isFolder) {
            const del = await db.entries.deleteOne({ _id: result._id });
            if (!del || !del.acknowledged) {
                throw new NotFound();
            }
        } else if (result.single) {
            await db.client.withSession(async (session) => {
                await new S3FileSystem().delete(result.single!.provider_id);
                await db.entries.deleteOne({ _id: oid }, { session });
            });
        }
    }
    async listDecks(workspaceId: string): Promise<ListDecksResponse> {
        if (!workspaceId) throw new InvalidInput();

        const db = await mongo;
        const results = await db.decks.find({ _workspace: asObjectId(workspaceId) }).toArray();

        return results.map(asDeck);
    }
    async createDeck(workspaceId: string, input: DeckCreate): Promise<Deck> {
        if (!input || !workspaceId) throw new InvalidInput();
        const db = await mongo;

        const oWsId = asObjectId(workspaceId);

        const deck: DecksCollectionType = {
            _workspace: oWsId,
            createdAt: Date.now(),
            pausedTimestamp: input.pausedTimestamp ?? 0,
            speed: input.speed,
            startTimestamp: input.startTimestamp,
            type: input.type,
            volume: input.volume,
            queue: input.queue.map((oid) => asObjectId(oid)),
        };
        let oid: ObjectId;
        if (deck.type === DeckType.MAIN) {
            const result = await db.decks.findOneAndUpdate(
                { _workspace: oWsId, type: DeckType.MAIN },
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
        return {
            ...deck,
            id: oid.toHexString(),
            queue: deck.queue.map((oid) => asString(oid)),
        };
    }
    async getDeck(workspaceId: string, id: string): Promise<Deck> {
        if (!workspaceId || !id) throw new InvalidInput();
        const db = await mongo;

        const oWsId = asObjectId(workspaceId);
        const deckId =
            id.toLowerCase() === 'main'
                ? (await db.decks.findOne({ type: DeckType.MAIN, _workspace: oWsId }))?._id
                : asObjectId(id);

        if (!deckId) {
            throw new NotFound();
        }

        const result = await db.decks.findOne({ _id: deckId, _workspace: oWsId });
        if (!result) {
            throw new NotFound();
        }

        return {
            ...result,
            id: asString(result._id),
            queue: result.queue.map((oid) => asString(oid)),
        };
    }
    async updateDeck(workspaceId: string, id: string, input: DeckMutate): Promise<Deck> {
        if (!input || !workspaceId || !id) throw new InvalidInput();
        const db = await mongo;
        const oWsId = asObjectId(workspaceId);
        const deckId =
            id.toLowerCase() === 'main'
                ? (await db.decks.findOne({ type: DeckType.MAIN, _workspace: oWsId }))?._id
                : asObjectId(id);

        if (id.toLowerCase() === 'main' && !deckId) {
            const result = await db.decks.findOneAndUpdate(
                deckId ? { _id: deckId, _workspace: oWsId } : { _workspace: oWsId },
                {
                    $set: {
                        ...pick(input, 'pausedTimestamp', 'speed', 'startTimestamp', 'volume'),
                        queue: input.queue.map(asObjectId),
                    },
                    $setOnInsert: {
                        createdAt: Date.now(),
                        pausedTimestamp: 0,
                        playing: true,
                        queue: [],
                        speed: 1,
                        startTimestamp: Date.now(),
                        type: DeckType.MAIN,
                        volume: 1,
                    },
                },
                { returnDocument: 'after', upsert: true },
            );
            if (!result.ok || !result.value) {
                throw new OtherError();
            }
            return {
                ...result.value,
                id: asString(result.value._id),
                queue: result.value.queue.map((oid) => asString(oid)),
            };
        } else {
            const result = await db.decks.findOneAndUpdate(
                { _id: deckId, _workspace: oWsId },
                {
                    $set: {
                        ...pick(input, 'pausedTimestamp', 'speed', 'startTimestamp', 'volume'),
                        queue: input.queue.map(asObjectId),
                    },
                },
                { returnDocument: 'after' },
            );
            if (!result.ok || !result.value) {
                console.log(result);
                throw new OtherError();
            }
            return {
                ...result.value,
                id: asString(result.value._id),
                queue: result.value.queue.map((oid) => asString(oid)),
            };
        }
    }
    async deleteDeck(workspaceId: string, id: string): Promise<void> {
        if (!workspaceId || !id) throw new InvalidInput();
        const db = await mongo;
        const oWsId = asObjectId(workspaceId);
        const deckId =
            id.toLowerCase() === 'main'
                ? (await db.decks.findOne({ type: DeckType.MAIN, _workspace: oWsId }))?._id
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
    }
    async listJobs(workspaceId: string): Promise<ListJobsResponse> {
        if (!workspaceId) throw new InvalidInput();
        const db = await mongo;
        const results = await db.jobs.find({ _workspace: asObjectId(workspaceId) }).toArray();

        return results.map(asJob);
    }
    async uploadFile(fileSizeBytes: number, type: string): Promise<string> {
        return await new S3FileSystem(process.env.S3_TEMP_BUCKET as string).createPresignedUpload(fileSizeBytes, type);
    }
    async submitJob(workspaceId: string, input: NewJob): Promise<Job> {
        if (!input || !workspaceId) throw new InvalidInput();
        const db = await mongo;
        if (
            !input.details ||
            input.details.isFolder ||
            !Array.isArray(input.modifications) ||
            !input.details.name ||
            !input.details.ordering ||
            !Array.isArray(input.details.path)
        ) {
            throw new InvalidInput();
        }
        const job: JobsCollectionType = {
            _workspace: asObjectId(workspaceId),
            assignedWorker: null,
            assignedAt: 0,
            details: {
                isFolder: false,
                name: input.details.name,
                ordering: input.details.ordering,
                path: input.details.path,
                single: {
                    description: input.details.single.description,
                },
            },
            error: null,
            modifications: input.modifications ?? [],
            progress: 0,
            status: JobStatus.GETTING_READY,
            source: input.source,
        };
        const result = await db.jobs.insertOne(job);
        job._id = result.insertedId;
        return asJob(job);
    }
    async getJob(workspaceId: string, id: string): Promise<Job> {
        if (!workspaceId || !id) throw new InvalidInput();
        const db = await mongo;
        const result = await db.jobs.findOne({ _workspace: asObjectId(workspaceId), _id: asObjectId(id) });
        if (!result) throw new NotFound();

        return asJob(result);
    }
    async cancelJob(workspaceId: string, id: string): Promise<void> {
        if (!workspaceId || !id) throw new InvalidInput();
        // TODO;
        throw new OtherError('Not Implemented');
    }
    async join(): Promise<void> {
        throw new Error('This function should be handled at the transport layer.');
    }
    async leave(): Promise<void> {
        throw new Error('This function should be handled at the transport layer.');
    }
    async registerWorker(sharedKey: string, checkinFrequency: number): Promise<string> {
        if (sharedKey !== process.env.WORKER_PSK) throw new NotAuthorized();
        const db = await mongo;

        const result = await db.workers.insertOne({
            checkinFrequency: checkinFrequency,
            lastCheckinTime: Date.now(),
            startTime: Date.now(),
        });

        return asString(result.insertedId);
    }
    async workerCheckIn(sharedKey: string, id: string): Promise<void> {
        if (sharedKey !== process.env.WORKER_PSK) throw new NotAuthorized();
        const db = await mongo;

        const result = await db.workers.updateOne({ _id: asObjectId(id) }, { $set: { lastCheckinTime: Date.now() } });
        if (result.matchedCount === 0) {
            throw new NotFound();
        }
    }
    async adminRequestJob(): Promise<void> {
        throw new Error('This should be handled at the transport layer.');
    }
    async adminUpdateJob(sharedKey: string, workspaceId: string, id: string, update: AdminJobMutate): Promise<Job> {
        if (sharedKey !== process.env.WORKER_PSK) throw new NotAuthorized();
        const db = await mongo;

        const res = await db.jobs.findOneAndUpdate(
            { _id: asObjectId(id) },
            {
                $set: {
                    assignedWorker: update.assignedWorker === null ? null : asObjectId(update.assignedWorker),
                    error: update.error,
                    progress: update.progress,
                    status: update.status,
                },
            },
            { returnDocument: 'after' },
        );
        if (!res.ok || !res.value) {
            throw new NotFound();
        }

        return asJob(res.value);
    }
    async adminCompleteJob(sharedKey: string, workspaceId: string, id: string, completion: JobComplete): Promise<void> {
        if (sharedKey !== process.env.WORKER_PSK) throw new NotAuthorized();
        const db = await mongo;
        const job = await db.jobs.findOne({ _id: asObjectId(id) });
        if (!job) throw new NotFound();

        const newId = new ObjectId();
        const providerId = asString(newId) + kAudioExtension;

        const content = completion.content as Buffer;
        const location = await new S3FileSystem().writeFromMemory(
            content,
            content.length,
            providerId,
            completion.mime,
            async (progress) => {
                if (!progress) return;
                await db.jobs.updateOne({ _id: job._id }, { $set: { status: JobStatus.SAVING, progress } });
            },
        );

        await db.client.withSession(async (session) => {
            const entry: EntriesCollectionType = {
                _workspace: job._workspace,
                name: job.details.name,
                path: job.details.path,
                ordering: job.details.ordering,
                isFolder: false,
                single: {
                    description: job.details.single.description as string,
                    duration: completion.duration,
                    provider_id: providerId,
                    source: job.source,
                    url: location,
                },
            };
            await db.entries.insertOne(entry, { session });
        });
    }
    async pruneWorkers(sharedKey: string): Promise<void> {
        if (sharedKey !== process.env.WORKER_PSK) throw new NotAuthorized();
        const db = await mongo;
        const session = db.client.startSession({
            defaultTransactionOptions: {
                readPreference: 'primary',
                readConcern: { level: 'local' },
                writeConcern: { w: 'majority' },
            },
        });

        try {
            await session.withTransaction(async () => {
                const result = await db.workers
                    .find(
                        {
                            $expr: {
                                $lt: [
                                    '$lastCheckinTime',
                                    { $add: ['$lastCheckinTime', { $multiply: ['$checkinFrequency', 3] }] },
                                ],
                            },
                        },
                        { session },
                    )
                    .toArray();

                await db.workers.deleteMany({ _id: { $in: result.map((wk) => wk._id) } }, { session });
                await db.jobs.updateMany(
                    { assignedWorker: { $in: result.map((wk) => wk._id) } },
                    { $set: { assignedWorker: null } },
                    { session },
                );
            });
        } finally {
            await session.endSession();
        }
    }
    async getNextAvailableJob(): Promise<JobsCollectionType | null> {
        const db = await mongo;

        const result = await db.jobs.findOneAndUpdate(
            { assignedWorker: null, status: JobStatus.GETTING_READY },
            { $set: { status: JobStatus.WAITING, assignedAt: Date.now() } },
        );
        if (result.ok && result.value) {
            return result.value;
        }
        return null;
    }
}
