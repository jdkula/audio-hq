import request from 'graphql-request';
import {
    DeleteFileDocument,
    UpdateFileDocument,
    WorkspaceDetailByNameDocument,
    WorkspaceDetailDocument,
    WorkspaceFilesDocument,
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
import { Deck, DeckCreate, Job, Track, TrackCreate, TrackUpdate, Workspace, WorkspaceCreate } from '../models';

const kUrl = process.env.NEXT_PUBLIC_HASURA_URL_HTTP as string;

////////// Global

export class AudioHQApiImplRest implements AudioHQApi {
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
        throw new Error('Method not implemented.');
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

    async update(workspace: Partial<WorkspaceCreate>): Promise<Workspace> {
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
                ordering: file.order,
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
        throw new Error('Method not implemented.');
    }
    async getMain(): Promise<Deck | null> {
        throw new Error('Method not implemented.');
    }
    async listAmbient(): Promise<Deck[]> {
        throw new Error('Method not implemented.');
    }
    async create(deck: DeckCreate): Promise<Deck> {
        throw new Error('Method not implemented.');
    }
}

class SpecificDeckApiImpl implements SpecificDeckApi {
    constructor(private _workspaceId: string, private _deckId: string) {}

    async get(): Promise<Deck> {
        throw new Error('Method not implemented.');
    }
    async update(update: Partial<Omit<DeckCreate, 'type'>>): Promise<Deck> {
        throw new Error('Method not implemented.');
    }
    async delete(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

class MainDeckApiImpl implements SpecificDeckApi {
    constructor(private _workspaceId: string) {}

    async get(): Promise<Deck> {
        throw new Error('Method not implemented.');
    }
    async update(update: Partial<Omit<DeckCreate, 'type'>>): Promise<Deck> {
        throw new Error('Method not implemented.');
    }
    async delete(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

////////// Jobs

class WorkspaceJobsApiImpl implements WorkspaceJobsApi {
    constructor(private _workspaceId: string) {}

    async list(): Promise<Job[]> {
        throw new Error('Method not implemented.');
    }
    async upload(file: Blob, info: TrackCreate): Promise<Job> {
        throw new Error('Method not implemented.');
    }
    async submit(url: string, info: TrackCreate): Promise<Job> {
        throw new Error('Method not implemented.');
    }
}

class SpecificJobApiImpl implements SpecificJobApi {
    constructor(private _workspaceId: string, private _jobId: string) {}

    async cancel(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async get(): Promise<Job> {
        throw new Error('Method not implemented.');
    }
}
