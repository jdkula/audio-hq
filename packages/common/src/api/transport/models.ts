/// Workspaces

export interface Workspace {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
}

export interface WorkspaceMutate {
    name: string;
}

export type WorkspaceSearchResponse = Array<Workspace>;

/// Entries

export type Entry = EntryBase & (SingleEntry | FolderEntry);
interface EntryBase {
    id: string;
    path: Array<string>;
    name: string;
    ordering: number;
}
interface SingleEntry {
    isFolder: false;
    single: Single;
}
interface FolderEntry {
    isFolder: true;
}

export interface Single {
    description: string;
    duration: number;
    url: string;
    source: string;
}

export type EntryMutate = EntryMutateBase & (SingleMutateBase | FolderMutateBase);
interface EntryMutateBase {
    name: string;
    path: Array<string>;
    ordering: number;
}

interface SingleMutateBase {
    isFolder: false;
    single: SingleMutate;
}
interface FolderMutateBase {
    isFolder: true;
}
interface SingleMutate {
    description: string;
}

export type ListEntriesResponse = Array<Entry>;

// Decks

export enum DeckType {
    MAIN = 1,
    AMBIENT = 2,
    SFX = 3,
}

export interface Deck {
    id: string;
    type: DeckType;
    volume: number;
    speed: number;
    startTimestamp: number;
    pausedTimestamp: number | null;
    queue: Array<string>;
    createdAt: number;
}

export interface DeckMutate {
    volume: number;
    speed: number;
    startTimestamp: number;
    pausedTimestamp: number | null;
    queue: Array<string>;
}

export interface DeckCreate extends DeckMutate {
    type: DeckType;
}
export type ListDecksResponse = Array<Deck>;

/// Jobs
export enum JobStatus {
    GETTING_READY = 1,
    WAITING = 2,
    ASSIGNED = 3,
    DOWNLOADING = 4,
    CONVERTING = 5,
    UPLOADING = 6,
    SAVING = 7,
    DONE = 8,
    ERROR = 9,
}

export interface Job {
    id: string;
    workspace: string;
    details: EntryMutateBase & SingleMutateBase;
    modifications: Array<Modification>;

    progress: number;
    status: JobStatus;
    assignedWorker: string | null;
    error: string | null;
    source: string;
}

export interface NewJob {
    workspace: string;
    details: EntryMutateBase & SingleMutateBase;
    modifications: Array<Modification>;

    source: string;
    fromUpload?: boolean;
}

export interface AdminJobMutate {
    progress: number;
    status: JobStatus;
    assignedWorker: string | null;
    error: string | null;
    source: string;
}
export interface JobComplete {
    duration: number;
    mime: string;
}

export enum ModificationType {
    CUT = 1,
    FADE = 2,
}
export type Modification = CutModification | FadeModification;
export interface CutModification {
    type: ModificationType.CUT;
    startSeconds: number;
    endSeconds: number;
}
export interface FadeModification {
    type: ModificationType.FADE;
    inSeconds: number;
    outSeconds: number;
}

export type ListJobsResponse = Array<Job>;
