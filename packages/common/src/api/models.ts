////////// Workspaces

export interface Workspace {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export type WorkspaceMutate = Pick<Workspace, 'name'>;

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
    source: string;
}

export interface Folder extends EntryBase {
    type: 'folder';
}

export type EntryMutate = Pick<Entry, 'path' | 'name'> & { ordering: number | null };
export type SingleMutate = EntryMutate & { description: string };

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
export type DeckUpdate = Omit<DeckCreate, 'type'>;

////////// Jobs

export interface Job extends SingleMutate {
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
