/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { IService } from 'service/lib/IService';
import AudioHQApi, {
    GlobalWorkspaceApi,
    SpecificDeckApi,
    SpecificEntryApi,
    SpecificJobApi,
    SpecificWorkspaceApi,
    WorkspaceDecksApi,
    WorkspaceEntriesApi,
    WorkspaceJobsApi,
} from '../AudioHQApi';
import {
    CutModification,
    Deck,
    DeckCreate,
    DeckType,
    Entry,
    EntryMutate,
    FadeModification,
    Folder,
    Job,
    JobCreate,
    JobStatus,
    Single,
    SingleMutate,
    Workspace,
    WorkspaceMutate,
} from 'common/src/api/models';
import { audiohq } from 'common/lib/generated/proto';
import SocketTransport from './socketio.transport';
import axios from 'axios';

function toDeckType(type: audiohq.DeckType): DeckType {
    switch (type) {
        case audiohq.DeckType.AMBIENT:
            return 'ambient';
        case audiohq.DeckType.MAIN:
            return 'main';
        case audiohq.DeckType.SFX:
            return 'sfx';
    }
}

function toProtoDeckType(apitype: DeckType): audiohq.DeckType {
    switch (apitype) {
        case 'ambient':
            return audiohq.DeckType.AMBIENT;
        case 'main':
            return audiohq.DeckType.MAIN;
        case 'sfx':
            return audiohq.DeckType.SFX;
    }
}

function protoEntryToEntry(protoEntry: audiohq.IEntry): Entry {
    return protoEntry.isFolder
        ? ({
              type: 'folder',
              id: protoEntry.id!,
              name: protoEntry.name!,
              ordering: protoEntry.ordering!,
              path: protoEntry.path!,
          } satisfies Folder)
        : ({
              type: 'single',
              id: protoEntry.id!,
              name: protoEntry.name!,
              ordering: protoEntry.ordering!,
              path: protoEntry.path!,
              description: protoEntry.single!.description!,
              length: protoEntry.single!.length!,
              url: protoEntry.single!.url!,
              __internal_id_single: protoEntry.id!,
          } satisfies Single);
}

////////// Global

export class AudioHQApiImplProto implements AudioHQApi {
    private readonly instance: GlobalWorkspaceApiImplProto;

    constructor(public readonly transport: IService<ArrayBuffer>) {
        this.instance = new GlobalWorkspaceApiImplProto(transport);
    }

    async searchWorkspaces(query: string): Promise<Workspace[]> {
        const { data: out, error } = await this.transport.searchWorkspace(query);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }
        const { results } = audiohq.WorkspaceSearchResponse.decode(new Uint8Array(out));
        return results.map((protoWorkspace) => ({
            id: protoWorkspace.id!,
            name: protoWorkspace.name!,
            createdAt: new Date(protoWorkspace.createdAt!),
            updatedAt: new Date(protoWorkspace.updatedAt!),
        }));
    }

    get workspaces(): GlobalWorkspaceApiImplProto {
        return this.instance;
    }

    workspace(id: string): SpecificWorkspaceApiImplProto {
        return new SpecificWorkspaceApiImplProto(this.transport, id);
    }
}

////////// Workspaces

class GlobalWorkspaceApiImplProto implements GlobalWorkspaceApi {
    constructor(private readonly _transport: IService<ArrayBuffer>) {}

    async create(workspace: WorkspaceMutate): Promise<Workspace> {
        const inp = audiohq.WorkspaceMutate.encode(workspace).finish();
        const { data: out, error } = await this._transport.createWorkspace(inp);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }
        const proto = audiohq.Workspace.decode(new Uint8Array(out));
        return {
            id: proto.id,
            name: proto.name,
            createdAt: new Date(proto.createdAt),
            updatedAt: new Date(proto.updatedAt),
        };
    }
}

class SpecificWorkspaceApiImplProto implements SpecificWorkspaceApi {
    constructor(
        private readonly _transport: IService<ArrayBuffer>,
        private _id: string,
    ) {}

    addJobsListener(fn: (jobs: Job[]) => void) {
        if (this._transport instanceof SocketTransport) {
            this._transport.addJobsListener(this._id, (proto) => {
                fn(audiohq.ListJobsResponse.decode(new Uint8Array(proto)).results.map(protoJobToJob));
            });
        }
    }
    addEntriesListiner(fn: (entries: Entry[]) => void) {
        if (this._transport instanceof SocketTransport) {
            this._transport.addJobsListener(this._id, (proto) => {
                fn(audiohq.ListEntriesResponse.decode(new Uint8Array(proto)).entries.map(protoEntryToEntry));
            });
        }
    }
    addDecksListener(fn: (decks: Deck[]) => void, getCachedSingles?: () => Single[] | null | undefined) {
        if (this._transport instanceof SocketTransport) {
            this._transport.addJobsListener(this._id, async (proto) => {
                const out = audiohq.ListDecksResponse.decode(new Uint8Array(proto));

                const singles =
                    getCachedSingles?.() ??
                    (await new WorkspaceEntriesApiImplProto(this._transport, this._id).list()).filter<Single>(
                        (x): x is Single => x.type === 'single',
                    );

                fn(out.results.map((res) => protoDeckToDeck(res, singles)));
            });
        }
    }

    async get(): Promise<Workspace> {
        const { data: out, error } = await this._transport.getWorkspace(this._id);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }
        const proto = audiohq.Workspace.decode(new Uint8Array(out));
        return {
            id: proto.id,
            name: proto.name,
            createdAt: new Date(proto.createdAt),
            updatedAt: new Date(proto.updatedAt),
        };
    }

    async update(workspace: WorkspaceMutate): Promise<Workspace> {
        const inp = audiohq.WorkspaceMutate.encode(workspace).finish();
        const { data: out, error } = await this._transport.updateWorkspace(this._id, inp);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }
        const proto = audiohq.Workspace.decode(new Uint8Array(out));
        return {
            id: proto.id,
            name: proto.name,
            createdAt: new Date(proto.createdAt),
            updatedAt: new Date(proto.updatedAt),
        };
    }

    async delete(): Promise<void> {
        await this._transport.deleteWorkspace(this._id);
    }

    get entries(): WorkspaceEntriesApiImplProto {
        return new WorkspaceEntriesApiImplProto(this._transport, this._id);
    }

    entry(entry: Single): SpecificSingleApiImplProto;
    entry(entry: Folder): SpecificFolderApiImplProto;
    entry(entry: Entry): SpecificFolderApiImplProto;
    entry(entry: Entry): SpecificEntryApi<Entry> {
        if (entry.type === 'single') {
            return new SpecificSingleApiImplProto(this._transport, this._id, entry);
        } else {
            return new SpecificFolderApiImplProto(this._transport, this._id, entry);
        }
    }

    get decks(): WorkspaceDecksApiImplProto {
        return new WorkspaceDecksApiImplProto(this._transport, this._id);
    }
    get mainDeck(): SpecificDeckApiImplProto {
        return new SpecificDeckApiImplProto(this._transport, this._id, 'main');
    }
    deck(id: string): SpecificDeckApiImplProto {
        return new SpecificDeckApiImplProto(this._transport, this._id, id);
    }
    get jobs(): WorkspaceJobsApiImplProto {
        return new WorkspaceJobsApiImplProto(this._transport, this._id);
    }
    job(id: string): SpecificJobApiImplProto {
        return new SpecificJobApiImplProto(this._transport, this._id, id);
    }
}

////////// Tracks

class WorkspaceEntriesApiImplProto implements WorkspaceEntriesApi {
    constructor(
        private readonly _transport: IService<ArrayBuffer>,
        private _workspaceId: string,
    ) {}

    async createFolder(name: string, basePath: string[], ordering?: number): Promise<Folder> {
        const inp = audiohq.EntryMutate.encode({ name, path: basePath, ordering, isFolder: true }).finish();
        const { data: out, error } = await this._transport.createEntry(this._workspaceId, inp);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }
        const proto = audiohq.Entry.decode(new Uint8Array(out));

        return {
            name: proto.name!,
            ordering: proto.ordering!,
            path: proto.path!,
            id: proto.id,
            type: 'folder',
        };
    }

    async list(): Promise<Entry[]> {
        const { data: out, error } = await this._transport.listEntries(this._workspaceId);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }
        const proto = audiohq.ListEntriesResponse.decode(new Uint8Array(out));

        return proto.entries.map(protoEntryToEntry);
    }
}

class SpecificFolderApiImplProto implements SpecificEntryApi<Folder> {
    constructor(
        private readonly _transport: IService<ArrayBuffer>,
        private _workspaceId: string,
        private _entry: Folder,
    ) {}

    async get(): Promise<Folder> {
        const { data: out, error } = await this._transport.getEntry(this._workspaceId, this._entry.id);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }
        const protoEntry = audiohq.Entry.decode(new Uint8Array(out));
        return {
            type: 'folder',
            id: protoEntry.id!,
            name: protoEntry.name!,
            ordering: protoEntry.ordering!,
            path: protoEntry.path!,
        } satisfies Folder;
    }

    async update(updateDef: EntryMutate): Promise<Folder> {
        const inp = audiohq.EntryMutate.encode(updateDef).finish();
        const { data: out, error } = await this._transport.updateEntry(this._workspaceId, this._entry.id, inp);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }

        const protoEntry = audiohq.Entry.decode(new Uint8Array(out));
        return {
            type: 'folder',
            id: protoEntry.id!,
            name: protoEntry.name!,
            ordering: protoEntry.ordering!,
            path: protoEntry.path!,
        } satisfies Folder;
    }
    async delete(): Promise<void> {
        await this._transport.deleteEntry(this._workspaceId, this._entry.id);
    }
}

class SpecificSingleApiImplProto implements SpecificEntryApi<Single> {
    constructor(
        private readonly _transport: IService<ArrayBuffer>,
        private _workspaceId: string,
        private _entry: Single,
    ) {}

    async get(): Promise<Single> {
        const { data: out, error } = await this._transport.getEntry(this._workspaceId, this._entry.id);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }
        const protoEntry = audiohq.Entry.decode(new Uint8Array(out));

        return {
            type: 'single',
            id: protoEntry.id!,
            name: protoEntry.name!,
            ordering: protoEntry.ordering!,
            path: protoEntry.path!,
            description: protoEntry.single!.description!,
            length: protoEntry.single!.length!,
            url: protoEntry.single!.url!,
            __internal_id_single: protoEntry.id!,
        } satisfies Single;
    }

    async update(updateDef: SingleMutate): Promise<Single> {
        const inp = audiohq.EntryMutate.encode({
            ...updateDef,
            single: { description: updateDef.description },
        }).finish();
        const { data: out, error } = await this._transport.updateEntry(this._workspaceId, this._entry.id, inp);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }

        const protoEntry = audiohq.Entry.decode(new Uint8Array(out));
        return {
            type: 'single',
            id: protoEntry.id!,
            name: protoEntry.name!,
            ordering: protoEntry.ordering!,
            path: protoEntry.path!,
            description: protoEntry.single!.description!,
            length: protoEntry.single!.length!,
            url: protoEntry.single!.url!,
            __internal_id_single: protoEntry.id!,
        } satisfies Single;
    }
    async delete(): Promise<void> {
        await this._transport.deleteEntry(this._workspaceId, this._entry.id);
    }
}

function protoDeckToDeck(deck: audiohq.IDeck, singles: Single[]): Deck {
    return {
        id: deck.id!,
        type: toDeckType(deck.type!),
        createdAt: new Date(deck.createdAt!),
        startTimestamp: new Date(deck.startTimestamp!),
        pauseTimestamp: deck.playing ? null : new Date(deck.pausedTimestamp!),
        speed: deck.speed!,
        volume: deck.volume!,
        queue: deck.queue!.map((sid) => singles.find((s) => s.id === sid)).filter((x): x is Single => !!x),
    } satisfies Deck;
}

function deckToProtoDeck(deck: Partial<DeckCreate>): audiohq.IDeckCreate {
    return {
        queue: deck.queue?.map((s) => s.id),
        speed: deck.speed,
        volume: deck.volume,
        type: deck.type ? toProtoDeckType(deck.type) : undefined,
        startTimestamp: deck.startTimestamp?.getTime(),
        pausedTimestamp: deck.pauseTimestamp?.getTime() ?? null,
        playing: !deck.pauseTimestamp,
    };
}

////////// Decks

class WorkspaceDecksApiImplProto implements WorkspaceDecksApi {
    constructor(
        private readonly _transport: IService<ArrayBuffer>,
        private _workspaceId: string,
    ) {}

    async listAll(): Promise<Deck[]>;
    async listAll(cachedSingles?: Single[]): Promise<Deck[]>;
    async listAll(cachedSingles?: Single[]): Promise<Deck[]> {
        const { data: out, error } = await this._transport.listDecks(this._workspaceId);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }
        const proto = audiohq.ListDecksResponse.decode(new Uint8Array(out));

        const singles =
            cachedSingles ??
            (await new WorkspaceEntriesApiImplProto(this._transport, this._workspaceId).list()).filter<Single>(
                (x): x is Single => x.type === 'single',
            );

        return proto.results.map((res) => protoDeckToDeck(res, singles));
    }

    async create(deck: DeckCreate): Promise<Deck>;
    async create(deck: DeckCreate, cachedSingles?: Single[]): Promise<Deck> {
        const inp = audiohq.DeckCreate.encode(deckToProtoDeck(deck)).finish();
        const { data: out, error } = await this._transport.createDeck(this._workspaceId, inp);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }

        const proto = audiohq.Deck.decode(new Uint8Array(out));
        const singles =
            cachedSingles ??
            (await new WorkspaceEntriesApiImplProto(this._transport, this._workspaceId).list()).filter<Single>(
                (x): x is Single => x.type === 'single',
            );

        return protoDeckToDeck(proto, singles);
    }
}

class SpecificDeckApiImplProto implements SpecificDeckApi {
    constructor(
        private readonly _transport: IService<ArrayBuffer>,
        private _workspaceId: string,
        private _deckId: string,
    ) {}

    async get(): Promise<Deck>;
    async get(cachedSingles?: Single[]): Promise<Deck>;
    async get(cachedSingles?: Single[]): Promise<Deck> {
        const singles =
            cachedSingles ??
            (await new WorkspaceEntriesApiImplProto(this._transport, this._workspaceId).list()).filter<Single>(
                (x): x is Single => x.type === 'single',
            );

        const { data: out, error } = await this._transport.getDeck(this._workspaceId, this._deckId);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }

        return protoDeckToDeck(audiohq.Deck.decode(new Uint8Array(out)), singles);
    }

    async update(update: Partial<Omit<DeckCreate, 'type'>>): Promise<Deck>;
    async update(update: Partial<Omit<DeckCreate, 'type'>>, cachedSingles?: Single[]): Promise<Deck>;
    async update(update: Partial<Omit<DeckCreate, 'type'>>, cachedSingles?: Single[]): Promise<Deck> {
        const singles =
            cachedSingles ??
            (await new WorkspaceEntriesApiImplProto(this._transport, this._workspaceId).list()).filter<Single>(
                (x): x is Single => x.type === 'single',
            );

        const inp = audiohq.DeckMutate.encode(deckToProtoDeck(update)).finish();
        const { data: out, error } = await this._transport.updateDeck(this._workspaceId, this._deckId, inp);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }

        return protoDeckToDeck(audiohq.Deck.decode(new Uint8Array(out)), singles);
    }
    async delete(): Promise<void> {
        await this._transport.deleteDeck(this._workspaceId, this._deckId);
    }
}

////////// Jobs

function protoJobStatusToJobStatus(jobType: audiohq.JobStatus): JobStatus {
    switch (jobType) {
        case audiohq.JobStatus.GETTING_READY:
            return 'getting ready';
        case audiohq.JobStatus.WAITING:
            return 'waiting';
        case audiohq.JobStatus.ASSIGNED:
            return 'assigned';
        case audiohq.JobStatus.DOWNLOADING:
            return 'downloading';
        case audiohq.JobStatus.CONVERTING:
            return 'converting';
        case audiohq.JobStatus.UPLOADING:
            return 'uploading';
        case audiohq.JobStatus.SAVING:
            return 'saving';
        case audiohq.JobStatus.DONE:
            return 'done';
        case audiohq.JobStatus.ERROR:
            return 'error';
    }
}

function protoJobToJob(protoJob: audiohq.IJob): Job {
    return {
        id: protoJob.id!,
        description: protoJob.details!.single!.description!,
        name: protoJob.details!.name!,
        ordering: protoJob.details!.ordering!,
        path: protoJob.details!.path!,
        assignedWorker: protoJob.assignedWorker ?? null,
        modifications: protoJob.modifications!.map((mod) =>
            mod.cut
                ? ({
                      type: 'cut',
                      startSeconds: mod.cut!.startSeconds!,
                      endSeconds: mod.cut!.endSeconds!,
                  } satisfies CutModification)
                : ({
                      type: 'fade',
                      inSeconds: mod.fade!.inSeconds!,
                      outSeconds: mod.fade!.outSeconds!,
                  } satisfies FadeModification),
        ),
        status: protoJobStatusToJobStatus(protoJob.status!),
        progress: protoJob.progress ?? 0,
    };
}

class WorkspaceJobsApiImplProto implements WorkspaceJobsApi {
    constructor(
        private readonly _transport: IService<ArrayBuffer>,
        private _workspaceId: string,
    ) {}

    async list(): Promise<Job[]> {
        const { data: out, error } = await this._transport.listJobs(this._workspaceId);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }
        const proto = audiohq.ListJobsResponse.decode(new Uint8Array(out));

        return proto.results.map(protoJobToJob);
    }
    async upload(file: Blob, info: JobCreate): Promise<Job> {
        const { data: uploadUrl, error } = await this._transport.uploadFile(file.size, file.type);
        if (!!error || !uploadUrl) {
            throw new Error('Failed: ' + error);
        }
        // TODO
        const upload = await axios.put(uploadUrl, file);
        if (upload.status !== 201) {
            throw new Error('Failed to upload');
        }

        const inp = audiohq.JobCreate.encode({
            modifications: info.modifications.map((mod) =>
                mod.type === 'cut'
                    ? ({ cut: mod } satisfies audiohq.IModification)
                    : ({ fade: mod } satisfies audiohq.IModification),
            ),
            details: {
                ...info,
            },
            url: uploadUrl,
        }).finish();
        const { data, error: submitError } = await this._transport.submitJob(this._workspaceId, inp);
        if (!!submitError || !data) {
            throw new Error('Failed: ' + submitError);
        }
        const proto = audiohq.Job.decode(new Uint8Array(data));

        return protoJobToJob(proto);
    }
    async submit(url: string, info: JobCreate): Promise<Job> {
        const inp = audiohq.JobCreate.encode({
            modifications: info.modifications.map((mod) =>
                mod.type === 'cut'
                    ? ({ cut: mod } satisfies audiohq.IModification)
                    : ({ fade: mod } satisfies audiohq.IModification),
            ),
            details: {
                ...info,
            },
            url: url,
        }).finish();
        const { data: out, error } = await this._transport.submitJob(this._workspaceId, inp);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }
        const proto = audiohq.Job.decode(new Uint8Array(out));

        return protoJobToJob(proto);
    }
}

class SpecificJobApiImplProto implements SpecificJobApi {
    constructor(
        private readonly _transport: IService<ArrayBuffer>,
        private _workspaceId: string,
        private _jobId: string,
    ) {}

    async cancel(): Promise<void> {
        await this._transport.cancelJob(this._workspaceId, this._jobId);
    }
    async get(): Promise<Job> {
        const { data: out, error } = await this._transport.getJob(this._workspaceId, this._jobId);
        if (!!error || !out) {
            throw new Error('Failed: ' + error);
        }
        const proto = audiohq.Job.decode(new Uint8Array(out));
        return protoJobToJob(proto);
    }
}
