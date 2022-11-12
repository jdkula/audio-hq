import request from 'graphql-request';
import {
    AddJobDocument,
    CreateWorkspaceDocument,
    DecksDocument,
    Deck_Type_Enum_Enum,
    DeleteFileDocument,
    PlayDeckDocument,
    UpdateFileDocument,
    WorkspaceDetailByNameDocument,
    WorkspaceDetailDocument,
    WorkspaceFilesDocument,
    Deck as HDeck,
    StopDeckDocument,
    UpdateDeckDocument,
    StopMainDeckDocument,
    UpdateMainDeckDocument,
    WorkspaceJobsDocument,
    DeleteErrorJobDocument,
    UpdateDeckAndSetQueueDocument,
} from '~/lib/generated/graphql';
import AudioHQApi, {
    GlobalWorkspaceApi,
    SpecificDeckApi,
    SpecificJobApi,
    SpecificTrackApi,
    SpecificWorkspaceApi,
    WorkspaceDecksApi,
    WorkspaceJobsApi,
    WorkspaceTracksApi,
} from '../AudioHQApi';
import {
    CutModification,
    Deck,
    DeckCreate,
    DeckType,
    DeckUpdate,
    FadeModification,
    Job,
    JobCreate,
    Track,
    TrackUpdate,
    Workspace,
    WorkspaceCreate,
    WorkspaceUpdate,
} from '../models';

const kUrl = process.env.NEXT_PUBLIC_HASURA_URL_HTTP as string;

function toDeckType(htype: Deck_Type_Enum_Enum): DeckType {
    switch (htype) {
        case Deck_Type_Enum_Enum.Ambience:
            return 'ambient';
        case Deck_Type_Enum_Enum.Main:
            return 'main';
        case Deck_Type_Enum_Enum.Sfx:
            return 'sfx';
    }
}

function toHdeckType(apitype: DeckType): Deck_Type_Enum_Enum {
    switch (apitype) {
        case 'ambient':
            return Deck_Type_Enum_Enum.Ambience;
        case 'main':
            return Deck_Type_Enum_Enum.Main;
        case 'sfx':
            return Deck_Type_Enum_Enum.Sfx;
    }
}

function toDeck(hdeck: Omit<HDeck, 'workspace' | 'workspace_id'>): Deck {
    return {
        id: hdeck.id,
        createdAt: new Date(hdeck.created_at),
        startTimestamp: new Date(hdeck.start_timestamp),
        pauseTimestamp: hdeck.pause_timestamp ? new Date(hdeck.pause_timestamp) : null,
        volume: hdeck.volume,
        speed: hdeck.speed,
        queue: hdeck.queue.map(
            (htrack) =>
                ({
                    id: htrack.file.id,
                    description: htrack.file.description,
                    length: htrack.file.length,
                    name: htrack.file.name,
                    path: htrack.file.path,
                    type: 'single',
                    url: htrack.file.download_url,
                } as Track),
        ),
        type: toDeckType(hdeck.type),
    };
}

////////// Global

export class AudioHQApiImplGraphQL implements AudioHQApi {
    async searchWorkspaces(query: string): Promise<Workspace[]> {
        const ret = await request(kUrl, WorkspaceDetailByNameDocument, {
            workspaceName: query,
        });

        return ret.workspace.map((hws) => ({
            id: hws.id,
            createdAt: new Date(hws.created_at),
            name: hws.name,
            updatedAt: new Date(hws.created_at),
        }));
    }

    get workspaces(): GlobalWorkspaceApi {
        return GlobalWorkspaceApiImpl.instance;
    }

    workspace(id: string): SpecificWorkspaceApi {
        return new SpecificWorkspaceApiImpl(id);
    }
}

////////// Workspaces

class GlobalWorkspaceApiImpl implements GlobalWorkspaceApi {
    async create(workspace: WorkspaceCreate): Promise<Workspace> {
        const res = await request(kUrl, CreateWorkspaceDocument, { name: workspace.name });

        const ws = res.insert_workspace_one;
        if (!ws) throw new Error('Failed to create workspace');
        return {
            id: ws.id,
            createdAt: new Date(ws.created_at),
            updatedAt: new Date(ws.created_at),
            name: ws.name,
        };
    }

    static instance = new GlobalWorkspaceApiImpl();
}

class SpecificWorkspaceApiImpl implements SpecificWorkspaceApi {
    constructor(private _id: string) {}

    async get(): Promise<Workspace> {
        const ret = await request(kUrl, WorkspaceDetailDocument, {
            workspaceId: this._id,
        });

        const hws = ret.workspace_by_pk;

        if (!hws) {
            throw new Error('A workspace by that ID does not exist');
        }

        return {
            id: hws.id,
            createdAt: new Date(hws.created_at),
            name: hws.name,
            updatedAt: new Date(hws.created_at),
        };
    }

    async update(workspace: WorkspaceUpdate): Promise<Workspace> {
        throw new Error('Method not implemented.');
    }

    async delete(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    get tracks(): WorkspaceTracksApi {
        return new WorkspaceTracksApiImpl(this._id);
    }

    track(id: string): SpecificTrackApi {
        return new SpecificTrackApiImpl(this._id, id);
    }

    get decks(): WorkspaceDecksApi {
        return new WorkspaceDecksApiImpl(this._id);
    }
    get mainDeck(): SpecificDeckApi {
        return new MainDeckApiImpl(this._id);
    }
    deck(id: string): SpecificDeckApi {
        return new SpecificDeckApiImpl(this._id, id);
    }
    get jobs(): WorkspaceJobsApi {
        return new WorkspaceJobsApiImpl(this._id);
    }
    job(id: string): SpecificJobApi {
        return new SpecificJobApiImpl(this._id, id);
    }
}

////////// Tracks

class WorkspaceTracksApiImpl implements WorkspaceTracksApi {
    constructor(private _workspaceId: string) {}

    async list(): Promise<Track[]> {
        const ret = await request(kUrl, WorkspaceFilesDocument, { workspaceId: this._workspaceId });

        return ret.file
            .sort((a, b) => {
                if (!a && b) {
                    return -1;
                } else if (a && !b) {
                    return 1;
                } else if (!a && !b) {
                    return 0;
                } else {
                    return a.ordering! - b.ordering!;
                }
            })
            .map((hfile) => ({
                id: hfile.id,
                description: hfile.description,
                length: hfile.length,
                name: hfile.name,
                path: hfile.path,
                type: 'single',
                url: hfile.download_url,
                ordering: hfile.ordering ?? Number.POSITIVE_INFINITY,
            }));
    }
}

class SpecificTrackApiImpl implements SpecificTrackApi {
    constructor(private _workspaceId: string, private _trackId: string) {}

    async get(): Promise<Track> {
        throw new Error('Method not implemented.');
    }
    async update(file: TrackUpdate): Promise<Track> {
        const ret = await request(kUrl, UpdateFileDocument, {
            id: this._trackId,
            update: {
                name: file.name,
                description: file.description,
                path: file.path,
                ordering: file.ordering,
            },
        });

        const update = ret.update_file_by_pk;

        if (!update) {
            throw new Error('There was no track to update.');
        }

        return {
            id: update.id,
            description: update.description,
            length: update.length,
            name: update.name,
            path: update.path,
            type: 'single',
            url: update.download_url,
            ordering: update.ordering ?? Number.POSITIVE_INFINITY,
        };
    }
    async delete(): Promise<void> {
        await request(kUrl, DeleteFileDocument, { job: { file_id: this._trackId } });
    }
}

////////// Decks

class WorkspaceDecksApiImpl implements WorkspaceDecksApi {
    constructor(private _workspaceId: string) {}

    async listAll(): Promise<Deck[]> {
        const res = await request(kUrl, DecksDocument, { workspaceId: this._workspaceId });

        return res.workspace_by_pk?.decks.map(toDeck as any) ?? [];
    }
    async getMain(): Promise<Deck | null> {
        const res = await request(kUrl, DecksDocument, { workspaceId: this._workspaceId });

        const hdeck = res.workspace_by_pk?.decks.find((hdeck) => hdeck.type === Deck_Type_Enum_Enum.Main);

        if (!hdeck) return null;

        return toDeck(hdeck as any);
    }
    async listAmbient(): Promise<Deck[]> {
        return (await this.listAll()).filter((deck) => deck.type === 'ambient');
    }
    async create(deck: DeckCreate): Promise<Deck> {
        const dk = (
            await request(kUrl, PlayDeckDocument, {
                workspaceId: this._workspaceId,
                isMain: deck.type === 'main',
                deck: {
                    start_timestamp: deck.startTimestamp.toISOString(),
                    pause_timestamp: deck.pauseTimestamp?.toISOString() ?? null,
                    queue: { data: deck.queue.map((apitrack, i) => ({ file_id: apitrack.id, ordering: i })) },
                    speed: deck.speed,
                    type: toHdeckType(deck.type),
                    volume: deck.volume,
                    workspace_id: this._workspaceId,
                },
            })
        ).insert_deck_one;

        if (!dk) {
            throw new Error('Failed to create deck');
        }

        return toDeck(dk as any);
    }
}

class SpecificDeckApiImpl implements SpecificDeckApi {
    constructor(private _workspaceId: string, private _deckId: string) {}

    async get(): Promise<Deck> {
        throw new Error('Method not implemented.');
    }
    async update(update: Partial<Omit<DeckCreate, 'type'>>): Promise<Deck> {
        if (update.queue) {
            const dk = (
                await request(kUrl, UpdateDeckAndSetQueueDocument, {
                    deckId: this._deckId,
                    update: {
                        pause_timestamp: update.pauseTimestamp === null ? null : update.pauseTimestamp?.toISOString(),
                        start_timestamp: update.startTimestamp?.toISOString(),
                        speed: update.speed,
                        volume: update.volume,
                    },
                    newQueue: update.queue.map((q, i) => ({ file_id: q.id, deck_id: this._deckId, ordering: i })),
                })
            ).update_deck_by_pk;

            if (!dk) throw new Error("Couldn't update deck");

            return toDeck(dk as any);
        } else {
            const dk = (
                await request(kUrl, UpdateDeckDocument, {
                    deckId: this._deckId,
                    update: {
                        pause_timestamp: update.pauseTimestamp === null ? null : update.pauseTimestamp?.toISOString(),
                        start_timestamp: update.startTimestamp?.toISOString(),
                        speed: update.speed,
                        volume: update.volume,
                    },
                })
            ).update_deck_by_pk;

            if (!dk) throw new Error('Could not update deck');

            return toDeck(dk as any);
        }
    }
    async delete(): Promise<void> {
        await request(kUrl, StopDeckDocument, {
            deckId: this._deckId,
        });
    }
}

class MainDeckApiImpl implements SpecificDeckApi {
    constructor(private _workspaceId: string) {}

    async get(): Promise<Deck> {
        const dk = await new WorkspaceDecksApiImpl(this._workspaceId).getMain();
        if (!dk) throw new Error('No main deck available');

        return dk;
    }
    async update(update: DeckUpdate): Promise<Deck> {
        if (update.queue) {
            const wsapi = new SpecificWorkspaceApiImpl(this._workspaceId);
            const maindeck = await wsapi.decks.getMain();
            if (!maindeck) {
                throw new Error('No main deck to update!');
            }

            return await wsapi.deck(maindeck.id).update(update);
        } else {
            const dk = (
                await request(kUrl, UpdateMainDeckDocument, {
                    workspaceId: this._workspaceId,
                    update: {
                        pause_timestamp: update.pauseTimestamp?.toISOString(),
                        start_timestamp: update.startTimestamp?.toISOString(),
                        speed: update.speed,
                        volume: update.volume,
                    },
                })
            ).update_deck?.returning?.[0];

            if (!dk) throw new Error("Couldn't update main deck");

            return toDeck(dk as any);
        }
    }
    async delete(): Promise<void> {
        await request(kUrl, StopMainDeckDocument, {
            workspaceId: this._workspaceId,
        });
    }
}

////////// Jobs

class WorkspaceJobsApiImpl implements WorkspaceJobsApi {
    constructor(private _workspaceId: string) {}

    async list(): Promise<Job[]> {
        const jobs = await request(kUrl, WorkspaceJobsDocument, {
            workspaceId: this._workspaceId,
        });

        return jobs.job.map((hjob) => ({
            id: hjob.id,
            assignedWorker: hjob.assigned_worker ?? null,
            description: hjob.description,
            modifications: [], // TODO
            name: hjob.name,
            ordering: 0, // TODO
            path: hjob.path,
            progress: hjob.progress ?? 0,
            status: hjob.status,
        }));
    }
    async upload(file: Blob, info: JobCreate): Promise<Job> {
        const base64 = await new Promise<string>((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => {
                resolve(fr.result as string);
            };
            fr.onerror = (e) => {
                reject(e);
            };
            fr.readAsDataURL(file);
        });

        const cut = info.modifications.find((mod) => mod.type === 'cut') as CutModification;
        const fade = info.modifications.find((mod) => mod.type === 'fade') as FadeModification;

        const res = await request(kUrl, AddJobDocument, {
            job: {
                name: info.name,
                description: info.description,
                option_cut_start: cut?.startSeconds ?? null,
                option_cut_end: cut?.endSeconds ?? null,
                option_fade_in: fade?.inSeconds ?? null,
                option_fade_out: fade?.outSeconds ?? null,
                url: null,
                path: info.path,
                workspace_id: this._workspaceId,
                file_upload: {
                    data: { base64: base64 },
                },
            },
        });

        const job = res.insert_job_one;
        if (!job) throw new Error('Could not create job');

        return {
            id: job.id,
            assignedWorker: job.assigned_worker ?? null,
            description: job.description,
            modifications: [], // TODO
            name: job.name,
            ordering: 0, // TODO
            path: job.path,
            progress: job.progress ?? 0,
            status: job.status,
        };
    }
    async submit(url: string, info: JobCreate): Promise<Job> {
        const cut = info.modifications.find((mod) => mod.type === 'cut') as CutModification;
        const fade = info.modifications.find((mod) => mod.type === 'fade') as FadeModification;

        const res = await request(kUrl, AddJobDocument, {
            job: {
                name: info.name,
                description: info.description,
                option_cut_start: cut?.startSeconds ?? null,
                option_cut_end: cut?.endSeconds ?? null,
                option_fade_in: fade?.inSeconds ?? null,
                option_fade_out: fade?.outSeconds ?? null,
                url: url,
                path: info.path,
                workspace_id: this._workspaceId,
                file_upload: null,
            },
        });

        const job = res.insert_job_one;
        if (!job) throw new Error('Could not create job');

        return {
            id: job.id,
            assignedWorker: job.assigned_worker ?? null,
            description: job.description,
            modifications: [], // TODO
            name: job.name,
            ordering: 0, // TODO
            path: job.path,
            progress: job.progress ?? 0,
            status: job.status,
        };
    }
}

class SpecificJobApiImpl implements SpecificJobApi {
    constructor(private _workspaceId: string, private _jobId: string) {}

    async cancel(): Promise<void> {
        await request(kUrl, DeleteErrorJobDocument, { jobId: this._jobId });
    }
    async get(): Promise<Job> {
        throw new Error('Method not implemented.');
    }
}
