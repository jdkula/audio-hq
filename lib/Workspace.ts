type ID = string;
export interface File {
    name: string;
    path: string;
    id: ID;
    type: 'audioset' | 'audio';
    length: number;
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
    fileId: ID;
    startTimestamp: number;
    volume: number;
    pauseTime: number | null;
}

export type PlayStateResolver = (update: PlayStateUpdate) => void;

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
    ambience: PlayState[];
    suggestions: Suggestion[];
    users: PlayerState[];
}

export interface Workspace {
    name: string;
    files: File[];
    state: WorkspaceState;
}

export interface PlayerStateUpdate {
    name: string;
    status?: Status;
    volume?: number;
}

export interface PlayStateUpdate {
    id?: ID;
    fileId?: ID;
    startTimestamp?: number;
    volume?: number;
    pauseTime?: number | null;
}

export interface WorkspaceUpdate {
    playing?: PlayStateUpdate | null;
    ambience?: PlayStateUpdate | null;
    sfx?: PlayState | null;
    suggestion?: Suggestion;
    users?: PlayerState;
    delAmbience?: ID;
    delSuggestion?: ID;
    delUser?: string;
}

export type WorkspaceResolver = (update: WorkspaceUpdate) => Promise<void>;

export function updatePlayState(
    update: PlayStateUpdate | null | undefined,
    original: PlayState | null,
): PlayState | null {
    if (update === undefined) return original;
    if (update === null) return null;
    if (update.id === undefined && original === null) return null;

    const copy: PlayState =
        original === null
            ? {
                  id: update.id as string,
                  fileId: update.fileId ?? (update.id as string),
                  pauseTime: update.pauseTime ?? update.startTimestamp ?? Date.now(),
                  startTimestamp: update.startTimestamp ?? Date.now(),
                  volume: update.volume ?? 1,
              }
            : { ...original };

    if (update) {
        if (update.id) {
            copy.id = update.id;
        }
        if (update.pauseTime === null) {
            if (original?.pauseTime) {
                const difference = Date.now() - original.pauseTime;
                copy.startTimestamp += difference;
            }

            copy.pauseTime = null;
        } else if (update.pauseTime !== undefined) {
            copy.pauseTime = update.pauseTime;
        }
        if (typeof update.startTimestamp === 'number') {
            copy.startTimestamp = update.startTimestamp;
        }
        if (typeof update.volume === 'number') {
            copy.volume = update.volume;
        }
    }

    return copy;
}
