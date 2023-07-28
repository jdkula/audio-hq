////////// Global

import {
    Deck,
    DeckCreate,
    DeckUpdate,
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

    entries: WorkspaceEntriesApi;
    entry<T extends Entry>(entry: T): SpecificEntryApi<T>;

    decks: WorkspaceDecksApi;
    mainDeck: SpecificDeckApi;
    deck(id: string): SpecificDeckApi;

    jobs: WorkspaceJobsApi;
    job(id: string): SpecificJobApi;
}

////////// Tracks

export interface WorkspaceEntriesApi {
    createFolder(name: string, basePath: string[], ordering?: number): Promise<Folder>;
    list(): Promise<Array<Entry>>;
}

export interface SpecificEntryApi<T extends Entry> {
    get(): Promise<T>;
    update(update: T extends Single ? SingleUpdate : EntryUpdate): Promise<T>;
    delete(): Promise<void>;
}

////////// Decks

export interface WorkspaceDecksApi {
    listAll(): Promise<Array<Deck>>;
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

/// Helpers

export function entryIsSingle(entry: Entry): entry is Single {
    return entry.type === 'single';
}

export function entryIsFolder(entry: Entry): entry is Folder {
    return entry.type === 'folder';
}
