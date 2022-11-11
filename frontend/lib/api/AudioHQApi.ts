////////// Global

import {
    Deck,
    DeckCreate,
    DeckUpdate,
    Job,
    JobCreate,
    Track,
    TrackUpdate,
    Workspace,
    WorkspaceCreate,
    WorkspaceUpdate,
} from './models';

export default interface AudioHQApi {
    searchWorkspaces(query: string): Promise<Array<Workspace>>;

    workspaces: GlobalWorkspaceApi;
    workspace(id: string): SpecificWorkspaceApi;
}

////////// Workspaces

export interface GlobalWorkspaceApi {
    create(workspace: WorkspaceCreate): Promise<Workspace>;
}

export interface SpecificWorkspaceApi {
    get(): Promise<Workspace>;
    update(workspace: WorkspaceUpdate): Promise<Workspace>;
    delete(): Promise<void>;

    tracks: WorkspaceTracksApi;
    track(id: string): SpecificTrackApi;

    decks: WorkspaceDecksApi;
    mainDeck: SpecificDeckApi;
    deck(id: string): SpecificDeckApi;

    jobs: WorkspaceJobsApi;
    job(id: string): SpecificJobApi;
}

////////// Tracks

export interface WorkspaceTracksApi {
    list(): Promise<Array<Track>>;
}

export interface SpecificTrackApi {
    get(): Promise<Track>;
    update(file: TrackUpdate): Promise<Track>;
    delete(): Promise<void>;
}

////////// Decks

export interface WorkspaceDecksApi {
    listAll(): Promise<Array<Deck>>;
    getMain(): Promise<Deck | null>;
    listAmbient(): Promise<Array<Deck>>;
    create(deck: DeckCreate): Promise<Deck>;
}

export interface SpecificDeckApi {
    get(): Promise<Deck>;
    update(update: DeckUpdate): Promise<Deck>;
    delete(): Promise<void>;
}

////////// Jobs

export interface WorkspaceJobsApi {
    list(): Promise<Array<Job>>;
    upload(file: Blob, info: JobCreate): Promise<Job>;
    submit(url: string, info: JobCreate): Promise<Job>;
}

export interface SpecificJobApi {
    cancel(): Promise<void>;
    get(): Promise<Job>;
}
