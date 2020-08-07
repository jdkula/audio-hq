import type { ObjectId } from 'mongodb';

type ID = ObjectId;
export interface File {
    name: string;
    path: string;
    id: ID;
    type: 'audioset' | 'audio';
}

export interface Audio extends File {
    type: 'audio';
}

export interface AudioSet extends File {
    type: 'audioset';
    fileIds: ID[];
}

export interface PlayState {
    id: ID;
    fileId: ID | null;
    timestamp: number | null;
    volume: number;
    paused: boolean;
}

export interface Suggestion {
    from: string;
    file: File;
}

export type Status = 'playing' | 'buffering';

export interface PlayerState {
    name: string;
    status: Status;
    volume: number;
}

export interface WorkspaceState {
    playing: PlayState | null;
    queued: PlayState | null;
    live: boolean;
    ambience: (PlayState & { fileId: null })[];
    suggestions: Suggestion[];
    users: PlayerState[];
}
export interface Workspace {
    _id: string;
    name: string;
    files: File[];
    state: WorkspaceState;
}
