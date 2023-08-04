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
import * as API from 'common/lib/api/models';
import * as Transport from 'common/lib/api/transport/models';
import SocketTransport from './socketio.transport';
import axios from 'axios';

function toDeckType(type: Transport.DeckType): API.DeckType {
    switch (type) {
        case Transport.DeckType.AMBIENT:
            return 'ambient';
        case Transport.DeckType.MAIN:
            return 'main';
        case Transport.DeckType.SFX:
            return 'sfx';
    }
}

function toProtoDeckType(apitype: API.DeckType): Transport.DeckType {
    switch (apitype) {
        case 'ambient':
            return Transport.DeckType.AMBIENT;
        case 'main':
            return Transport.DeckType.MAIN;
        case 'sfx':
            return Transport.DeckType.SFX;
    }
}

function toApiEntry(tentry: Transport.Entry): API.Entry {
    return tentry.isFolder
        ? {
              type: 'folder',
              id: tentry.id,
              name: tentry.name,
              ordering: tentry.ordering,
              path: tentry.path,
          }
        : {
              type: 'single',
              description: tentry.single.description,
              length: tentry.single.duration,
              id: tentry.id,
              name: tentry.name,
              ordering: tentry.ordering,
              path: tentry.path,
              url: tentry.single.url,
          };
}

////////// Global

export class AudioHQApiImplProto implements AudioHQApi {
    private readonly instance: GlobalWorkspaceApiImplProto;

    constructor(public readonly transport: IService) {
        this.instance = new GlobalWorkspaceApiImplProto(transport);
    }

    async searchWorkspaces(query: string): Promise<API.Workspace[]> {
        const data = await this.transport.searchWorkspace(query);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }
        const out = data.data;
        return out.map((protoWorkspace) => ({
            id: protoWorkspace.id,
            name: protoWorkspace.name,
            createdAt: new Date(protoWorkspace.createdAt),
            updatedAt: new Date(protoWorkspace.updatedAt),
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
    constructor(private readonly _transport: IService) {}

    async create(workspace: API.WorkspaceMutate): Promise<API.Workspace> {
        const data = await this._transport.createWorkspace(workspace);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }
        const out = data.data;
        return {
            id: out.id,
            name: out.name,
            createdAt: new Date(out.createdAt),
            updatedAt: new Date(out.updatedAt),
        };
    }
}

class SpecificWorkspaceApiImplProto implements SpecificWorkspaceApi {
    constructor(
        private readonly _transport: IService,
        private _id: string,
    ) {}

    addJobsListener(fn: (jobs: API.Job[]) => void) {
        if (this._transport instanceof SocketTransport) {
            this._transport.addJobsListener(this._id, (jobs) => {
                fn(jobs.map(protoJobToJob));
            });
        }
    }
    addEntriesListiner(fn: (entries: API.Entry[]) => void) {
        if (this._transport instanceof SocketTransport) {
            this._transport.addEntriesListiner(this._id, (entries) => {
                fn(entries.map(toApiEntry));
            });
        }
    }
    addDecksListener(fn: (decks: API.Deck[]) => void, getCachedSingles?: () => API.Single[] | null | undefined) {
        if (this._transport instanceof SocketTransport) {
            this._transport.addDecksListener(this._id, async (decks) => {
                const singles =
                    getCachedSingles?.() ??
                    (await new WorkspaceEntriesApiImplProto(this._transport, this._id).list()).filter<API.Single>(
                        (x): x is API.Single => x.type === 'single',
                    );

                fn(decks.map((res) => protoDeckToDeck(res, singles)));
            });
        }
    }

    async get(): Promise<API.Workspace> {
        const data = await this._transport.getWorkspace(this._id);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }
        const out = data.data;
        return {
            id: out.id,
            name: out.name,
            createdAt: new Date(out.createdAt),
            updatedAt: new Date(out.updatedAt),
        };
    }

    async update(workspace: API.WorkspaceMutate): Promise<API.Workspace> {
        const data = await this._transport.updateWorkspace(this._id, workspace);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }
        const proto = data.data;
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

    entry(entry: API.Single): SpecificSingleApiImplProto;
    entry(entry: API.Folder): SpecificFolderApiImplProto;
    entry(entry: API.Entry): SpecificFolderApiImplProto;
    entry(entry: API.Entry): SpecificEntryApi<API.Entry> {
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
        private readonly _transport: IService,
        private _workspaceId: string,
    ) {}

    async createFolder(name: string, basePath: string[], ordering?: number): Promise<API.Folder> {
        const inp = { name, path: basePath, ordering: ordering ?? 0, isFolder: true as const };
        const data = await this._transport.createEntry(this._workspaceId, inp);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }
        const proto = data.data;

        return {
            name: proto.name,
            ordering: proto.ordering,
            path: proto.path,
            id: proto.id,
            type: 'folder',
        };
    }

    async list(): Promise<API.Entry[]> {
        const data = await this._transport.listEntries(this._workspaceId);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }
        const proto = data.data;

        return proto.map(toApiEntry);
    }
}

class SpecificFolderApiImplProto implements SpecificEntryApi<API.Folder> {
    constructor(
        private readonly _transport: IService,
        private _workspaceId: string,
        private _entry: API.Folder,
    ) {}

    async get(): Promise<API.Folder> {
        const data = await this._transport.getEntry(this._workspaceId, this._entry.id);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }
        const protoEntry = data.data;
        return {
            type: 'folder',
            id: protoEntry.id,
            name: protoEntry.name,
            ordering: protoEntry.ordering,
            path: protoEntry.path,
        } satisfies API.Folder;
    }

    async update(updateDef: API.EntryMutate): Promise<API.Folder> {
        const data = await this._transport.updateEntry(this._workspaceId, this._entry.id, {
            ...updateDef,
            isFolder: true,
            ordering: updateDef.ordering ?? 0,
        });
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }

        const protoEntry = data.data;
        return {
            type: 'folder',
            id: protoEntry.id,
            name: protoEntry.name,
            ordering: protoEntry.ordering,
            path: protoEntry.path,
        } satisfies API.Folder;
    }
    async delete(): Promise<void> {
        await this._transport.deleteEntry(this._workspaceId, this._entry.id);
    }
}

class SpecificSingleApiImplProto implements SpecificEntryApi<API.Single> {
    constructor(
        private readonly _transport: IService,
        private _workspaceId: string,
        private _entry: API.Single,
    ) {}

    async get(): Promise<API.Single> {
        const data = await this._transport.getEntry(this._workspaceId, this._entry.id);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }
        const protoEntry = data.data;
        if (protoEntry.isFolder) throw new Error('Got folder for single');

        return {
            type: 'single',
            id: protoEntry.id!,
            name: protoEntry.name!,
            ordering: protoEntry.ordering!,
            path: protoEntry.path!,
            description: protoEntry.single!.description!,
            length: protoEntry.single!.duration!,
            url: protoEntry.single!.url!,
        } satisfies API.Single;
    }

    async update(updateDef: API.SingleMutate): Promise<API.Single> {
        const inp = {
            ...updateDef,
            ordering: updateDef.ordering ?? 0,
            single: { description: updateDef.description },
            isFolder: false as const,
        };
        const data = await this._transport.updateEntry(this._workspaceId, this._entry.id, inp);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }

        const protoEntry = data.data;
        if (protoEntry.isFolder) throw new Error('Got folder for single');
        return {
            type: 'single',
            id: protoEntry.id!,
            name: protoEntry.name!,
            ordering: protoEntry.ordering!,
            path: protoEntry.path!,
            description: protoEntry.single!.description!,
            length: protoEntry.single!.duration!,
            url: protoEntry.single!.url!,
        } satisfies API.Single;
    }
    async delete(): Promise<void> {
        await this._transport.deleteEntry(this._workspaceId, this._entry.id);
    }
}

function protoDeckToDeck(deck: Transport.Deck, singles: API.Single[]): API.Deck {
    return {
        id: deck.id!,
        type: toDeckType(deck.type!),
        createdAt: new Date(deck.createdAt!),
        startTimestamp: new Date(deck.startTimestamp!),
        pauseTimestamp: deck.pausedTimestamp === null ? null : new Date(deck.pausedTimestamp!),
        speed: deck.speed!,
        volume: deck.volume!,
        queue: deck.queue!.map((sid) => singles.find((s) => s.id === sid)).filter((x): x is API.Single => !!x),
    } satisfies API.Deck;
}

function deckToProtoDeck(deck: API.DeckCreate): Transport.DeckCreate {
    return {
        queue: deck.queue?.map((s) => s.id) ?? [],
        speed: deck.speed ?? 1,
        volume: deck.volume ?? 1,
        type: toProtoDeckType(deck.type),
        startTimestamp: deck.startTimestamp?.getTime(),
        pausedTimestamp: deck.pauseTimestamp?.getTime() ?? null,
    };
}

////////// Decks

class WorkspaceDecksApiImplProto implements WorkspaceDecksApi {
    constructor(
        private readonly _transport: IService,
        private _workspaceId: string,
    ) {}

    async listAll(): Promise<API.Deck[]>;
    async listAll(cachedSingles?: API.Single[]): Promise<API.Deck[]>;
    async listAll(cachedSingles?: API.Single[]): Promise<API.Deck[]> {
        const data = await this._transport.listDecks(this._workspaceId);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }
        const proto = data.data;

        const singles =
            cachedSingles ??
            (await new WorkspaceEntriesApiImplProto(this._transport, this._workspaceId).list()).filter<API.Single>(
                (x): x is API.Single => x.type === 'single',
            );

        return proto.map((res) => protoDeckToDeck(res, singles));
    }

    async create(deck: API.DeckCreate): Promise<API.Deck>;
    async create(deck: API.DeckCreate, cachedSingles?: API.Single[]): Promise<API.Deck> {
        const inp = deckToProtoDeck(deck);
        const data = await this._transport.createDeck(this._workspaceId, inp);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }

        const proto = data.data;
        const singles =
            cachedSingles ??
            (await new WorkspaceEntriesApiImplProto(this._transport, this._workspaceId).list()).filter<API.Single>(
                (x): x is API.Single => x.type === 'single',
            );

        return protoDeckToDeck(proto, singles);
    }
}

class SpecificDeckApiImplProto implements SpecificDeckApi {
    constructor(
        private readonly _transport: IService,
        private _workspaceId: string,
        private _deckId: string,
    ) {}

    async get(): Promise<API.Deck>;
    async get(cachedSingles?: API.Single[]): Promise<API.Deck>;
    async get(cachedSingles?: API.Single[]): Promise<API.Deck> {
        const singles =
            cachedSingles ??
            (await new WorkspaceEntriesApiImplProto(this._transport, this._workspaceId).list()).filter<API.Single>(
                (x): x is API.Single => x.type === 'single',
            );

        const data = await this._transport.getDeck(this._workspaceId, this._deckId);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }

        return protoDeckToDeck(data.data, singles);
    }

    async update(update: Omit<API.DeckCreate, 'type'>): Promise<API.Deck>;
    async update(update: Omit<API.DeckCreate, 'type'>, cachedSingles?: API.Single[]): Promise<API.Deck>;
    async update(update: Omit<API.DeckCreate, 'type'>, cachedSingles?: API.Single[]): Promise<API.Deck> {
        const singles =
            cachedSingles ??
            (await new WorkspaceEntriesApiImplProto(this._transport, this._workspaceId).list()).filter<API.Single>(
                (x): x is API.Single => x.type === 'single',
            );

        const inp = deckToProtoDeck({ ...update, type: 'main' });
        const data = await this._transport.updateDeck(this._workspaceId, this._deckId, inp);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }

        return protoDeckToDeck(data.data, singles);
    }
    async delete(): Promise<void> {
        await this._transport.deleteDeck(this._workspaceId, this._deckId);
    }
}

////////// Jobs

function protoJobStatusToJobStatus(jobType: Transport.JobStatus): API.JobStatus {
    switch (jobType) {
        case Transport.JobStatus.GETTING_READY:
            return 'getting ready';
        case Transport.JobStatus.WAITING:
            return 'waiting';
        case Transport.JobStatus.ASSIGNED:
            return 'assigned';
        case Transport.JobStatus.DOWNLOADING:
            return 'downloading';
        case Transport.JobStatus.CONVERTING:
            return 'converting';
        case Transport.JobStatus.UPLOADING:
            return 'uploading';
        case Transport.JobStatus.SAVING:
            return 'saving';
        case Transport.JobStatus.DONE:
            return 'done';
        case Transport.JobStatus.ERROR:
            return 'error';
    }
}

function protoJobToJob(protoJob: Transport.Job): API.Job {
    return {
        id: protoJob.id!,
        description: protoJob.details!.single!.description!,
        name: protoJob.details!.name!,
        ordering: protoJob.details!.ordering!,
        path: protoJob.details!.path!,
        assignedWorker: protoJob.assignedWorker ?? null,
        modifications: protoJob.modifications!.map((mod) =>
            mod.type === Transport.ModificationType.CUT
                ? ({
                      type: 'cut',
                      startSeconds: mod.startSeconds!,
                      endSeconds: mod.endSeconds!,
                  } satisfies API.CutModification)
                : ({
                      type: 'fade',
                      inSeconds: mod.inSeconds!,
                      outSeconds: mod.outSeconds!,
                  } satisfies API.FadeModification),
        ),
        status: protoJobStatusToJobStatus(protoJob.status!),
        progress: protoJob.progress ?? 0,
    };
}

class WorkspaceJobsApiImplProto implements WorkspaceJobsApi {
    constructor(
        private readonly _transport: IService,
        private _workspaceId: string,
    ) {}

    async list(): Promise<API.Job[]> {
        const data = await this._transport.listJobs(this._workspaceId);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }
        const proto = data.data;

        return proto.map(protoJobToJob);
    }
    async upload(file: Blob, info: API.JobCreate): Promise<API.Job> {
        const data = await this._transport.uploadFile(file.size, file.type);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }
        // TODO
        const upload = await axios.put(data.data, file);
        if (upload.status !== 201) {
            throw new Error('Failed to upload');
        }

        return await this.submit(data.data, info);
    }
    async submit(url: string, info: API.JobCreate): Promise<API.Job> {
        const submission = await this._transport.submitJob(this._workspaceId, {
            modifications: info.modifications.map((mod) =>
                mod.type === 'cut'
                    ? ({ ...mod, type: Transport.ModificationType.CUT } satisfies Transport.Modification)
                    : ({ ...mod, type: Transport.ModificationType.FADE } satisfies Transport.Modification),
            ),
            details: {
                ...info,
                ordering: info.ordering ?? 0,
                isFolder: false as const,
                single: {
                    description: info.description,
                },
            },
            source: url,
            workspace: this._workspaceId,
        });
        if (submission.error !== null) {
            throw new Error('Failed: ' + submission.error);
        }

        return protoJobToJob(submission.data);
    }
}

class SpecificJobApiImplProto implements SpecificJobApi {
    constructor(
        private readonly _transport: IService,
        private _workspaceId: string,
        private _jobId: string,
    ) {}

    async cancel(): Promise<void> {
        await this._transport.cancelJob(this._workspaceId, this._jobId);
    }
    async get(): Promise<API.Job> {
        const data = await this._transport.getJob(this._workspaceId, this._jobId);
        if (data.error !== null) {
            throw new Error('Failed: ' + data.error);
        }
        const proto = data.data;
        return protoJobToJob(proto);
    }
}
