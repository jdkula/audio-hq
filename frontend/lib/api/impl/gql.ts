import request from 'graphql-request';
import {
    AddJobDocument,
    CreateWorkspaceDocument,
    DecksDocument,
    Deck_Type_Enum_Enum,
    DeleteFileDocument,
    PlayDeckDocument,
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
    UpdateSingleEntryDocument,
    UpdateDirectoryEntryDocument,
    DeleteFolderDocument,
    MovePathDocument,
    CreateFolderDocument,
} from '~/lib/generated/graphql';
import AudioHQApi, {
    GlobalWorkspaceApi,
    SpecificDeckApi,
    SpecificJobApi,
    SpecificEntryApi,
    SpecificWorkspaceApi,
    WorkspaceDecksApi,
    WorkspaceJobsApi,
    WorkspaceEntriesApi,
    entryIsSingle,
    entryIsFolder,
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
    Entry,
    EntryUpdate,
    Workspace,
    WorkspaceCreate,
    WorkspaceUpdate,
    SingleUpdate,
    Single,
    Folder,
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
                    id: htrack.single.dirent.id,
                    description: htrack.single.description,
                    length: htrack.single.length,
                    name: htrack.single.dirent.name,
                    path: htrack.single.dirent.path,
                    type: 'single',
                    url: htrack.single.download_url,
                    ordering: htrack.ordering,
                    __internal_id_single: htrack.single.id,
                } as Single),
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

    get entries(): WorkspaceEntriesApi {
        return new WorkspaceEntriesApiImpl(this._id);
    }

    entry<T extends Entry>(entry: T): SpecificEntryApi<T> {
        return new SpecificEntryApiImpl<T>(this._id, entry);
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

class WorkspaceEntriesApiImpl implements WorkspaceEntriesApi {
    constructor(private _workspaceId: string) {}

    async createFolder(name: string, basePath: string[], ordering?: number): Promise<Folder> {
        const ret = await request(kUrl, CreateFolderDocument, {
            name: name,
            ordering: ordering ?? null,
            path: basePath,
            workspaceId: this._workspaceId,
        });

        if (!ret.insert_folder_one) throw new Error('Could not create folder');

        return {
            id: ret.insert_folder_one.dirent.id,
            name: ret.insert_folder_one.dirent.name,
            ordering: ret.insert_folder_one.dirent.ordering ?? Number.POSITIVE_INFINITY,
            path: ret.insert_folder_one.dirent.path,
            type: 'folder',
        };
    }

    async list(): Promise<Entry[]> {
        const ret = await request(kUrl, WorkspaceFilesDocument, { workspaceId: this._workspaceId });

        return ret.directory_entry
            .sort((a, b) => {
                return (a.ordering ?? Number.POSITIVE_INFINITY) - (b.ordering ?? Number.POSITIVE_INFINITY);
            })
            .map((hfile) => {
                if (hfile.single) {
                    return {
                        id: hfile.id,
                        description: hfile.single.description,
                        length: hfile.single.length,
                        name: hfile.name,
                        path: hfile.path,
                        type: 'single',
                        url: hfile.single.download_url,
                        ordering: hfile.ordering ?? Number.POSITIVE_INFINITY,
                        __internal_id_single: hfile.single.id,
                    } as Single;
                } else if (hfile.folder) {
                    return {
                        id: hfile.id,
                        name: hfile.name,
                        ordering: hfile.ordering ?? Number.POSITIVE_INFINITY,
                        path: hfile.path,
                        type: 'folder',
                    } as Folder;
                }
            })
            .filter<Entry>((x): x is Entry => !!x);
    }
}

class SpecificEntryApiImpl<T extends Entry> implements SpecificEntryApi<T> {
    constructor(private _workspaceId: string, private _entry: T) {}

    async get(): Promise<T> {
        throw new Error('Method not implemented.');
    }
    async update(updateDef: T extends Single ? SingleUpdate : EntryUpdate): Promise<T> {
        if (entryIsSingle(this._entry) && (updateDef as SingleUpdate).description) {
            const ret = await request(kUrl, UpdateSingleEntryDocument, {
                id: this._entry.id,
                update: {
                    name: updateDef.name,
                    path: updateDef.path,
                    ordering: updateDef.ordering,
                },
                desc: (updateDef as SingleUpdate).description!,
            });
            const update = ret.update_directory_entry_by_pk;
            if (!update || !update.single) {
                throw new Error('There was no track to update.');
            }
            return {
                id: update.id,
                description: update.single.description,
                length: update.single.length,
                name: update.name,
                path: update.path,
                type: 'single',
                url: update.single.download_url,
                ordering: update.ordering ?? Number.POSITIVE_INFINITY,
                __internal_id_single: update.single.id,
            } as Single as T;
        } else if (entryIsFolder(this._entry) && (updateDef.path || updateDef.name)) {
            const name = updateDef.name ?? this._entry.name;
            const path = updateDef.path ?? this._entry.path;
            await request(kUrl, MovePathDocument, {
                workspaceId: this._workspaceId,
                oldpath: [...this._entry.path, this._entry.name],
                newpath: [...path, name],
            });
        }

        const ret = await request(kUrl, UpdateDirectoryEntryDocument, {
            id: this._entry.id,
            update: {
                name: updateDef.name,
                path: updateDef.path,
                ordering: updateDef.ordering,
            },
        });
        const update = ret.update_directory_entry_by_pk;

        if (!update) {
            throw new Error('There was no track to update.');
        }

        if (update.single) {
            return {
                id: update.id,
                description: update.single.description,
                length: update.single.length,
                name: update.name,
                path: update.path,
                type: 'single',
                url: update.single.download_url,
                ordering: update.ordering ?? Number.POSITIVE_INFINITY,
                __internal_id_single: update.single.id,
            } as Single as T;
        } else {
            return {
                id: update.id,
                name: update.name,
                path: update.path,
                type: 'folder',
                ordering: update.ordering ?? Number.POSITIVE_INFINITY,
            } as Folder as T;
        }
    }
    async delete(): Promise<void> {
        if (entryIsSingle(this._entry)) {
            await request(kUrl, DeleteFileDocument, { job: { single_id: this._entry.id } });
        } else {
            await request(kUrl, DeleteFolderDocument, { folderId: this._entry.id });
        }
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
                    queue: {
                        data: deck.queue.map((apitrack, i) => ({
                            single_id: apitrack.__internal_id_single,
                            ordering: i,
                        })),
                    },
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
