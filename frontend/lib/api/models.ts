////////// Workspaces

export interface Workspace {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export type WorkspaceCreate = Pick<Workspace, 'name'>;
export type WorkspaceUpdate = Partial<WorkspaceCreate>;

////////// Entries

export type EntryType = 'single' | 'directory';

interface EntryBase {
    id: string;
    path: Array<string>;
    name: string;
    ordering: number;
}

export type Entry = Single | Folder;

export interface Single extends EntryBase {
    type: 'single';
    description: string;
    length: number;
    url: string;

    __internal_id_single: string;
}

export interface Folder extends EntryBase {
    type: 'folder';
}

export type EntryCreate = Pick<Entry, 'path' | 'name'> & { ordering: number | null };
export type SingleCreate = EntryCreate & { description: string };
export type EntryUpdate = Partial<EntryCreate>;
export type SingleUpdate = Partial<SingleCreate>;

////////// Decks

export type DeckType = 'main' | 'ambient' | 'sfx';

export interface Deck {
    id: string;
    type: DeckType;

    volume: number;
    speed: number;
    pauseTimestamp: Date | null;
    startTimestamp: Date;

    queue: Array<Single>;

    createdAt: Date;
}

export type DeckCreate = Pick<Deck, 'type' | 'volume' | 'speed' | 'startTimestamp' | 'pauseTimestamp' | 'queue'>;
export type DeckUpdate = Partial<Omit<DeckCreate, 'type'>>;

////////// Jobs

export interface Job extends SingleCreate {
    id: string;
    modifications: Array<JobModification>;

    progress: number;
    status: JobStatus;
    assignedWorker: string | null;
    error?: string;
}

export type JobStatus =
    | 'getting ready'
    | 'assigned'
    | 'converting'
    | 'done'
    | 'downloading'
    | 'uploading'
    | 'saving'
    | 'waiting'
    | 'error';

export type JobModification = CutModification | FadeModification;

export interface CutModification {
    type: 'cut';
    startSeconds: number;
    endSeconds: number;
}

export interface FadeModification {
    type: 'fade';
    inSeconds: number;
    outSeconds: number;
}

export type JobCreate = Omit<Job, 'id' | 'progress' | 'status' | 'assignedWorker'>;
