/* eslint-disable @typescript-eslint/no-non-null-assertion */

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
    EntryUpdate,
    FadeModification,
    Folder,
    Job,
    JobCreate,
    JobStatus,
    Single,
    SingleUpdate,
    Workspace,
    WorkspaceCreate,
    WorkspaceUpdate,
} from '../models';
import { Axios } from 'axios';
import { audiohq } from 'common/generated/proto';

const axios = new Axios({
    responseType: 'arraybuffer',
    transformResponse: (data: ArrayBuffer) => {
        return new Uint8Array(data);
    },
    headers: {
        'Content-Type': 'application/octet-stream',
    },
});

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

////////// Global

export class AudioHQApiImplRest implements AudioHQApi {
    private readonly instance: GlobalWorkspaceApiImplRest;

    constructor(public readonly baseUrl: string) {
        this.instance = new GlobalWorkspaceApiImplRest(baseUrl);
    }

    async searchWorkspaces(query: string): Promise<Workspace[]> {
        return audiohq.WorkspaceSearchResponse.decode(
            (await axios.get(`${this.baseUrl}/workspaces`, { params: { q: query } })).data,
        ).results.map((protoWorkspace) => ({
            id: protoWorkspace.id!,
            name: protoWorkspace.name!,
            createdAt: new Date(protoWorkspace.createdAt!),
            updatedAt: new Date(protoWorkspace.updatedAt!),
        }));
    }

    get workspaces(): GlobalWorkspaceApiImplRest {
        return this.instance;
    }

    workspace(id: string): SpecificWorkspaceApiImplRest {
        return new SpecificWorkspaceApiImplRest(this.baseUrl, id);
    }
}

////////// Workspaces

class GlobalWorkspaceApiImplRest implements GlobalWorkspaceApi {
    constructor(public readonly baseUrl: string) {}

    async create(workspace: WorkspaceCreate): Promise<Workspace> {
        const proto = audiohq.Workspace.decode(
            (await axios.post(`${this.baseUrl}/workspaces`, audiohq.WorkspaceMutate.encode(workspace).finish())).data,
        );
        return {
            id: proto.id,
            name: proto.name,
            createdAt: new Date(proto.createdAt),
            updatedAt: new Date(proto.updatedAt),
        };
    }
}

class SpecificWorkspaceApiImplRest implements SpecificWorkspaceApi {
    constructor(
        public readonly baseUrl: string,
        private _id: string,
    ) {}

    async get(): Promise<Workspace> {
        const proto = audiohq.Workspace.decode((await axios.get(`${this.baseUrl}/workspaces/${this._id}`)).data);
        return {
            id: proto.id,
            name: proto.name,
            createdAt: new Date(proto.createdAt),
            updatedAt: new Date(proto.updatedAt),
        };
    }

    async update(workspace: WorkspaceUpdate): Promise<Workspace> {
        const proto = audiohq.Workspace.decode(
            (
                await axios.patch(
                    `${this.baseUrl}/workspaces/${this._id}`,
                    audiohq.WorkspaceMutate.encode(workspace).finish(),
                )
            ).data,
        );
        return {
            id: proto.id,
            name: proto.name,
            createdAt: new Date(proto.createdAt),
            updatedAt: new Date(proto.updatedAt),
        };
    }

    async delete(): Promise<void> {
        await axios.delete(`${this.baseUrl}/workspaces/${this._id}`);
    }

    get entries(): WorkspaceEntriesApiImplRest {
        return new WorkspaceEntriesApiImplRest(this.baseUrl, this._id);
    }

    entry(entry: Single): SpecificSingleApiImplRest;
    entry(entry: Folder): SpecificFolderApiImplRest;
    entry(entry: Entry): SpecificFolderApiImplRest;
    entry(entry: Entry): SpecificEntryApi<Entry> {
        if (entry.type === 'single') {
            return new SpecificSingleApiImplRest(this.baseUrl, this._id, entry);
        } else {
            return new SpecificFolderApiImplRest(this.baseUrl, this._id, entry);
        }
    }

    get decks(): WorkspaceDecksApiImplRest {
        return new WorkspaceDecksApiImplRest(this.baseUrl, this._id);
    }
    get mainDeck(): SpecificDeckApiImplRest {
        return new SpecificDeckApiImplRest(this.baseUrl, this._id, 'main');
    }
    deck(id: string): SpecificDeckApiImplRest {
        return new SpecificDeckApiImplRest(this.baseUrl, this._id, id);
    }
    get jobs(): WorkspaceJobsApiImplRest {
        return new WorkspaceJobsApiImplRest(this.baseUrl, this._id);
    }
    job(id: string): SpecificJobApiImplRest {
        return new SpecificJobApiImplRest(this.baseUrl, this._id, id);
    }
}

////////// Tracks

class WorkspaceEntriesApiImplRest implements WorkspaceEntriesApi {
    constructor(
        public readonly baseUrl: string,
        private _workspaceId: string,
    ) {}

    async createFolder(name: string, basePath: string[], ordering?: number): Promise<Folder> {
        const proto = audiohq.Entry.decode(
            (
                await axios.post(
                    `${this.baseUrl}/workspaces/${this._workspaceId}/entries`,
                    audiohq.EntryMutate.encode({ folder: { name, path: basePath, ordering } }).finish(),
                )
            ).data,
        );

        return {
            name: proto.folder!.name!,
            ordering: proto.folder!.ordering!,
            path: proto.folder!.path!,
            id: proto.id,
            type: 'folder',
        };
    }

    async list(): Promise<Entry[]> {
        const proto = audiohq.ListEntriesResponse.decode(
            (await axios.get(`${this.baseUrl}/workspaces/${this._workspaceId}/entries`)).data,
        );

        return proto.entries.map((protoEntry) =>
            protoEntry.folder
                ? ({
                      type: 'folder',
                      id: protoEntry.id!,
                      name: protoEntry.folder.name!,
                      ordering: protoEntry.folder.ordering!,
                      path: protoEntry.folder.path!,
                  } satisfies Folder)
                : ({
                      type: 'single',
                      id: protoEntry.id!,
                      name: protoEntry.single!.name!,
                      ordering: protoEntry.single!.ordering!,
                      path: protoEntry.single!.path!,
                      description: protoEntry.single!.description!,
                      length: protoEntry.single!.length!,
                      url: protoEntry.single!.url!,
                      __internal_id_single: protoEntry.id!,
                  } satisfies Single),
        );
    }
}

class SpecificFolderApiImplRest implements SpecificEntryApi<Folder> {
    constructor(
        public readonly baseUrl: string,
        private _workspaceId: string,
        private _entry: Folder,
    ) {}

    async get(): Promise<Folder> {
        const protoEntry = audiohq.Entry.decode(
            (await axios.get(`${this.baseUrl}/workspaces/${this._workspaceId}/entries/${this._entry.id}`)).data,
        );
        return {
            type: 'folder',
            id: protoEntry.id!,
            name: protoEntry.folder!.name!,
            ordering: protoEntry.folder!.ordering!,
            path: protoEntry.folder!.path!,
        } satisfies Folder;
    }

    async update(updateDef: EntryUpdate): Promise<Folder> {
        const protoEntry = audiohq.Entry.decode(
            (
                await axios.patch(
                    `${this.baseUrl}/workspaces/${this._workspaceId}/entries/${this._entry.id}`,
                    audiohq.FolderMutate.encode(updateDef).finish(),
                )
            ).data,
        );
        return {
            type: 'folder',
            id: protoEntry.id!,
            name: protoEntry.folder!.name!,
            ordering: protoEntry.folder!.ordering!,
            path: protoEntry.folder!.path!,
        } satisfies Folder;
    }
    async delete(): Promise<void> {
        await axios.delete(`${this.baseUrl}/workspaces/${this._workspaceId}/entries/${this._entry.id}`);
    }
}

class SpecificSingleApiImplRest implements SpecificEntryApi<Single> {
    constructor(
        public readonly baseUrl: string,
        private _workspaceId: string,
        private _entry: Single,
    ) {}

    async get(): Promise<Single> {
        const protoEntry = audiohq.Entry.decode(
            (await axios.get(`${this.baseUrl}/workspaces/${this._workspaceId}/entries/${this._entry.id}`)).data,
        );
        return {
            type: 'single',
            id: protoEntry.id!,
            name: protoEntry.single!.name!,
            ordering: protoEntry.single!.ordering!,
            path: protoEntry.single!.path!,
            description: protoEntry.single!.description!,
            length: protoEntry.single!.length!,
            url: protoEntry.single!.url!,
            __internal_id_single: protoEntry.id!,
        } satisfies Single;
    }

    async update(updateDef: SingleUpdate): Promise<Single> {
        const protoEntry = audiohq.Entry.decode(
            (
                await axios.patch(
                    `${this.baseUrl}/workspaces/${this._workspaceId}/entries/${this._entry.id}`,
                    audiohq.SingleMutate.encode(updateDef).finish(),
                )
            ).data,
        );
        return {
            type: 'single',
            id: protoEntry.id!,
            name: protoEntry.single!.name!,
            ordering: protoEntry.single!.ordering!,
            path: protoEntry.single!.path!,
            description: protoEntry.single!.description!,
            length: protoEntry.single!.length!,
            url: protoEntry.single!.url!,
            __internal_id_single: protoEntry.id!,
        } satisfies Single;
    }
    async delete(): Promise<void> {
        await axios.delete(`${this.baseUrl}/workspaces/${this._workspaceId}/entries/${this._entry.id}`);
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

class WorkspaceDecksApiImplRest implements WorkspaceDecksApi {
    constructor(
        public readonly baseUrl: string,
        private _workspaceId: string,
    ) {}

    async listAll(): Promise<Deck[]>;
    async listAll(cachedSingles?: Single[]): Promise<Deck[]>
    async listAll(cachedSingles?: Single[]): Promise<Deck[]> {
        const proto = audiohq.ListDecksResponse.decode(
            (await axios.get(`${this.baseUrl}/workspaces/${this._workspaceId}/decks`)).data,
        );

        const singles =
            cachedSingles ??
            (await new WorkspaceEntriesApiImplRest(this.baseUrl, this._workspaceId).list()).filter<Single>(
                (x): x is Single => x.type === 'single',
            );

        return proto.results.map((res) => protoDeckToDeck(res, singles));
    }

    async create(deck: DeckCreate): Promise<Deck>;
    async create(deck: DeckCreate, cachedSingles?: Single[]): Promise<Deck> {
        const proto = audiohq.Deck.decode(
            (
                await axios.post(
                    `${this.baseUrl}/workspaces/${this._workspaceId}/decks`,
                    audiohq.DeckCreate.encode(deckToProtoDeck(deck)).finish(),
                )
            ).data,
        );
        const singles =
            cachedSingles ??
            (await new WorkspaceEntriesApiImplRest(this.baseUrl, this._workspaceId).list()).filter<Single>(
                (x): x is Single => x.type === 'single',
            );

        return protoDeckToDeck(proto, singles);
    }
}

class SpecificDeckApiImplRest implements SpecificDeckApi {
    constructor(
        public readonly baseUrl: string,
        private _workspaceId: string,
        private _deckId: string,
    ) {}

    async get(): Promise<Deck>;
    async get(cachedSingles?: Single[]): Promise<Deck> {
        const singles =
            cachedSingles ??
            (await new WorkspaceEntriesApiImplRest(this.baseUrl, this._workspaceId).list()).filter<Single>(
                (x): x is Single => x.type === 'single',
            );

        return protoDeckToDeck(
            audiohq.Deck.decode(
                (await axios.get(`${this.baseUrl}/workspaces/${this._workspaceId}/decks/${this._deckId}`)).data,
            ),
            singles,
        );
    }
    async update(update: Partial<Omit<DeckCreate, 'type'>>): Promise<Deck>;
    async update(update: Partial<Omit<DeckCreate, 'type'>>, cachedSingles?: Single[]): Promise<Deck> {
        const singles =
            cachedSingles ??
            (await new WorkspaceEntriesApiImplRest(this.baseUrl, this._workspaceId).list()).filter<Single>(
                (x): x is Single => x.type === 'single',
            );

        return protoDeckToDeck(
            audiohq.Deck.decode(
                (
                    await axios.patch(
                        `${this.baseUrl}/workspaces/${this._workspaceId}/decks/${this._deckId}`,
                        audiohq.DeckMutate.encode(deckToProtoDeck(update)).finish(),
                    )
                ).data,
            ),
            singles,
        );
    }
    async delete(): Promise<void> {
        await axios.delete(`${this.baseUrl}/workspaces/${this._workspaceId}/decks/${this._deckId}`);
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
        description: protoJob.details!.description!,
        name: protoJob.details!.name!,
        ordering: protoJob.details!.last ? null : protoJob.details!.ordering!,
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

class WorkspaceJobsApiImplRest implements WorkspaceJobsApi {
    constructor(
        public readonly baseUrl: string,
        private _workspaceId: string,
    ) {}

    async list(): Promise<Job[]> {
        const proto = audiohq.ListJobsResponse.decode(
            (await axios.get(`${this.baseUrl}/workspaces/${this._workspaceId}/jobs`)).data,
        );

        return proto.results.map(protoJobToJob);
    }
    async upload(file: Blob, info: JobCreate): Promise<Job> {
        const url = ''; // TODO

        return await this.submit(url, info);
    }
    async submit(url: string, info: JobCreate): Promise<Job> {
        const proto = audiohq.Job.decode(
            (
                await axios.post(
                    `${this.baseUrl}/workspaces/${this._workspaceId}/jobs`,
                    audiohq.JobCreate.encode({
                        modifications: info.modifications.map((mod) =>
                            mod.type === 'cut'
                                ? ({ cut: mod } satisfies audiohq.IModification)
                                : ({ fade: mod } satisfies audiohq.IModification),
                        ),
                        details: {
                            ...info,
                            last: info.ordering === null ? true : undefined,
                        },
                        url,
                    }).finish(),
                )
            ).data,
        );

        return protoJobToJob(proto);
    }
}

class SpecificJobApiImplRest implements SpecificJobApi {
    constructor(
        public readonly baseUrl: string,
        private _workspaceId: string,
        private _jobId: string,
    ) {}

    async cancel(): Promise<void> {
        await axios.delete(`${this.baseUrl}/workspaces/${this._workspaceId}/jobs/${this._jobId}`);
    }
    async get(): Promise<Job> {
        const proto = audiohq.Job.decode(
            (await axios.get(`${this.baseUrl}/workspaces/${this._workspaceId}/jobs/${this._jobId}`)).data,
        );
        return protoJobToJob(proto);
    }
}
