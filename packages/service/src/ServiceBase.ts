import { IServiceBase } from './IService';
import { DecksCollectionType, EntriesCollectionType, JobsCollectionType, mongo } from './db/mongodb';
import { asString, asObjectId } from './db/oid_helpers';
import { audiohq } from 'common/lib/generated/proto';
import { ObjectId } from 'mongodb';
import { InvalidInput, NotFound, OtherError, NotAuthorized } from './errors';

import { AppFS } from './storage/FileSystem';

const kAudioExtension = '.v1.mp3';

export interface WorkerHandler {
    handleUpload: (job: JobsCollectionType, upload: Buffer) => Promise<void>;
    handleUrlSubmit: (job: JobsCollectionType, submission: string) => Promise<void>;
}

export class AudioHQServiceBase implements IServiceBase<Buffer> {
    constructor(private readonly _handler: WorkerHandler) {}

    async searchWorkspace(query: string): Promise<Buffer> {
        if (!query) {
            return Buffer.from(audiohq.WorkspaceSearchResponse.encode({ results: [] }).finish());
        }

        const db = await mongo;

        const results = (
            await db.workspaces.find({ name: { $regex: new RegExp('^' + query + '$', 'i') } }, { limit: 5 }).toArray()
        ).map((ws) => ({ ...ws, id: asString(ws._id) }) satisfies audiohq.IWorkspace);

        return Buffer.from(audiohq.WorkspaceSearchResponse.encode({ results }).finish());
    }
    async createWorkspace(input: Buffer): Promise<Buffer> {
        const db = await mongo;
        const wsInput = audiohq.WorkspaceMutate.decode(input).toJSON();
        const ws = { ...wsInput, createdAt: Date.now(), updatedAt: Date.now(), name: wsInput.name };
        if (!ws.name) {
            throw new InvalidInput();
        }
        const result = await db.workspaces.insertOne(ws);
        return Buffer.from(
            audiohq.Workspace.encode({
                ...ws,
                id: asString(result.insertedId),
            }).finish(),
        );
    }
    async getWorkspace(id: string): Promise<Buffer> {
        const db = await mongo;
        if (!id) {
            throw new InvalidInput();
        }

        const result = await db.workspaces.findOne({ _id: asObjectId(id) });
        if (!result) {
            throw new NotFound();
        }

        return Buffer.from(audiohq.Workspace.encode({ ...result, id: asString(result._id) }).finish());
    }
    async updateWorkspace(id: string, mutate: Buffer): Promise<Buffer> {
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

        return Buffer.from(audiohq.Workspace.encode({ ...result.value, id: asString(result.value._id) }).finish());
    }
    async deleteWorkspace(): Promise<void> {
        // TODO
        throw new OtherError();
    }
    async listEntries(workspaceId: string): Promise<Buffer> {
        if (!workspaceId) throw new InvalidInput();
        const db = await mongo;
        const results = await db.entries.find({ _workspace: asObjectId(workspaceId) }).toArray();

        return Buffer.from(
            audiohq.ListEntriesResponse.encode({
                entries: results.map((res) => ({ ...res, id: asString(res._id) })),
            }).finish(),
        );
    }
    async createEntry(workspaceId: string, input: Buffer): Promise<Buffer> {
        const db = await mongo;
        if (!input || !workspaceId) {
            throw new InvalidInput();
        }
        const entryInput = audiohq.EntryMutate.decode(input);
        if (!entryInput.isFolder || !entryInput.name) {
            throw new InvalidInput();
        }

        const entry: EntriesCollectionType = {
            _workspace: asObjectId(workspaceId),
            name: entryInput.name,
            path: entryInput.path ?? [],
            ordering: entryInput.ordering,
            isFolder: true,
        };
        const result = await db.entries.insertOne(entry);
        return Buffer.from(
            audiohq.Entry.encode({
                id: asString(result.insertedId),
                isFolder: entry.isFolder,
                name: entry.name,
                ordering: entry.ordering,
                path: entry.path,
            }).finish(),
        );
    }
    async getEntry(workspaceId: string, id: string): Promise<Buffer> {
        if (!workspaceId || !id) {
            throw new InvalidInput();
        }

        const db = await mongo;
        const result = await db.entries.findOne({ _id: asObjectId(id), _workspace: asObjectId(workspaceId) });
        if (!result) {
            throw new NotFound();
        }

        return Buffer.from(audiohq.Entry.encode({ ...result, id: asString(result._id) }).finish());
    }
    async updateEntry(workspaceId: string, id: string, input: Buffer): Promise<Buffer> {
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
        return Buffer.from(audiohq.Entry.encode({ ...result.value, id: asString(result.value._id) }).finish());
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
                await AppFS.delete(result.single!.provider_id);
                await db.entries.deleteOne({ _id: oid }, { session });
            });
        }
    }
    async listDecks(workspaceId: string): Promise<Buffer> {
        if (!workspaceId) throw new InvalidInput();

        const db = await mongo;
        const results = await db.decks.find({ _workspace: asObjectId(workspaceId) }).toArray();

        return Buffer.from(
            audiohq.ListDecksResponse.encode({
                results: results.map((deck) => ({
                    ...deck,
                    id: asString(deck._id),
                    queue: deck.queue.map((oid) => asString(oid)),
                })),
            }).finish(),
        );
    }
    async createDeck(workspaceId: string, input: Buffer): Promise<Buffer> {
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
        return Buffer.from(
            audiohq.Deck.encode({
                ...deck,
                id: oid.toHexString(),
                queue: deck.queue.map((oid) => asString(oid)),
            }).finish(),
        );
    }
    async getDeck(workspaceId: string, id: string): Promise<Buffer> {
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

        return Buffer.from(
            audiohq.Deck.encode({
                ...result,
                id: asString(result._id),
                queue: result.queue.map((oid) => asString(oid)),
            }).finish(),
        );
    }
    async updateDeck(workspaceId: string, id: string, input: Buffer): Promise<Buffer> {
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
            return Buffer.from(
                audiohq.Deck.encode({
                    ...result.value,
                    id: asString(result.value._id),
                    queue: result.value.queue.map((oid) => asString(oid)),
                }).finish(),
            );
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
            return Buffer.from(
                audiohq.Deck.encode({
                    ...result.value,
                    id: asString(result.value._id),
                    queue: result.value.queue.map((oid) => asString(oid)),
                }).finish(),
            );
        }
    }
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
    }
    async listJobs(workspaceId: string): Promise<Buffer> {
        if (!workspaceId) throw new InvalidInput();
        const db = await mongo;
        const results = await db.jobs.find({ _workspace: asObjectId(workspaceId) }).toArray();

        return Buffer.from(
            audiohq.ListJobsResponse.encode({
                results: results.map((res) => ({
                    ...res,
                    id: asString(res._id),
                    assignedWorker: res.assignedWorker ? asString(res.assignedWorker) : null,
                    workspace: asString(res._workspace),
                })),
            }).finish(),
        );
    }
    async uploadFile(workspaceId: string, input: Buffer, file: Buffer): Promise<Buffer> {
        const [out, job] = await this._createJob(workspaceId, input, 'upload://');
        await this._handler.handleUpload(job, file);
        return out;
    }
    async submitUrl(workspaceId: string, input: Buffer, url: string): Promise<Buffer> {
        const [out, job] = await this._createJob(workspaceId, input, url);
        await this._handler.handleUrlSubmit(job, url);
        return out;
    }
    private async _createJob(
        workspaceId: string,
        input: Buffer,
        url: string,
    ): Promise<[out: Buffer, job: JobsCollectionType]> {
        if (!input || !url || !workspaceId) throw new InvalidInput();
        const db = await mongo;
        const jobInput = audiohq.JobCreate.decode(input);
        if (
            !jobInput.details ||
            !jobInput.details.single ||
            !Array.isArray(jobInput.modifications) ||
            !jobInput.details.name ||
            !jobInput.details.ordering ||
            !Array.isArray(jobInput.details.path)
        ) {
            throw new InvalidInput();
        }
        const job: JobsCollectionType = {
            _workspace: asObjectId(workspaceId),
            assignedWorker: null,
            assignedAt: 0,
            details: {
                isFolder: false,
                name: jobInput.details.name,
                ordering: jobInput.details.ordering,
                path: jobInput.details.path,
                single: {
                    description: jobInput.details.single.description,
                },
            },
            errorDetails: null,
            modifications: jobInput.modifications ?? [],
            progress: null,
            status: audiohq.JobStatus.GETTING_READY,
            source: url,
        };
        const result = await db.jobs.insertOne(job);
        return [
            Buffer.from(
                audiohq.Job.encode({
                    ...job,
                    id: asString(result.insertedId),
                    assignedWorker: null,
                    workspace: workspaceId,
                }).finish(),
            ),
            job,
        ];
    }
    async getJob(workspaceId: string, id: string): Promise<Buffer> {
        if (!workspaceId || !id) throw new InvalidInput();
        const db = await mongo;
        const results = await db.jobs.find({ _workspace: asObjectId(workspaceId) }).toArray();

        return Buffer.from(
            audiohq.ListJobsResponse.encode({
                results: results.map((res) => ({
                    ...res,
                    id: asString(res._id),
                    assignedWorker: res.assignedWorker ? asString(res.assignedWorker) : null,
                })),
            }).finish(),
        );
    }
    async cancelJob(workspaceId: string, id: string): Promise<void> {
        if (!workspaceId || !id) throw new InvalidInput();
        // TODO;
        throw new OtherError();
    }
    join(): Promise<void> {
        throw new Error('This function should be handled at the transport layer.');
    }
    leave(): Promise<void> {
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
    async adminUpdateJob(sharedKey: string, _: string, id: string, update: Buffer): Promise<Buffer> {
        if (sharedKey !== process.env.WORKER_PSK) throw new NotAuthorized();
        const db = await mongo;
        const inp = audiohq.WorkerJobUpdate.decode(update);

        const res = await db.jobs.findOneAndUpdate(
            { _id: asObjectId(id) },
            {
                $set: {
                    assignedWorker: inp.assignment === 'unassigned' ? null : asObjectId(inp.assignedWorker!),
                    errorDetails: inp.ok ? null : inp.errorDetails!,
                    progress: inp.progress,
                    status: inp.status,
                },
            },
            { returnDocument: 'after' },
        );
        if (!res.ok || !res.value) {
            throw new NotFound();
        }

        return Buffer.from(
            audiohq.Job.encode({
                ...res.value,
                assignedWorker: res.value.assignedWorker ? asString(res.value.assignedWorker) : null,
            }).finish(),
        );
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
    async adminCompleteJob(sharedKey: string, _: string, completion: Buffer): Promise<void> {
        if (sharedKey !== process.env.WORKER_PSK) throw new NotAuthorized();
        const db = await mongo;
        const info = audiohq.CompleteJob.decode(completion);
        const job = await db.jobs.findOne({ _id: asObjectId(info.jobId) });
        if (!job) throw new NotFound();

        const id = new ObjectId();
        const providerId = asString(id) + kAudioExtension;

        const location = await AppFS.writeFromMemory(
            info.content,
            info.content.length,
            providerId,
            info.mime,
            async (progress) => {
                if (!progress) return;
                await db.jobs.updateOne({ _id: job._id }, { $set: { status: audiohq.JobStatus.SAVING, progress } });
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
                    length: info.length,
                    provider_id: providerId,
                    source: job.source,
                    url: location,
                },
            };
            await db.entries.insertOne(entry, { session });
        });
    }
    async adminRequestJob(): Promise<void> {
        throw new Error('This should be handled at the transport layer.');
    }
    async getNextAvailableJob(): Promise<JobsCollectionType | null> {
        const db = await mongo;

        const result = await db.jobs.findOneAndUpdate(
            { assignedWorker: null, status: audiohq.JobStatus.GETTING_READY },
            { $set: { status: audiohq.JobStatus.WAITING, assignedAt: Date.now() } },
        );
        if (result.ok && result.value) {
            return result.value;
        }
        return null;
    }
}
