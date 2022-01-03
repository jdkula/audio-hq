import Job from './Job';

type ID = string;
export interface File {
    name: string;
    path: string[];
    description?: string;
    id: ID;
    type: 'audioset' | 'audio';
    length: number;
}

export interface Reorderable {
    reorder: {
        after?: string;
        before?: string;
    };
}

export interface Audio extends File {
    type: 'audio';
}

export interface AudioSet extends File {
    type: 'audioset';
    fileIds: ID[];
}

export interface PlayState {
    queue: ID[];
    startTimestamp: number | null; // These timestamps are in ms
    volume: number;
    pauseTime: number | null;
    speed: number;
}

export type PlayStateResolver = (update: PlayStateUpdate | null) => void;

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

export interface SfxState {
    triggerTimestamp: number;
    sfx: PlayState | null;
    timeoutTimestamp: number;
}

export interface WorkspaceState {
    playing: PlayState | null;
    ambience: PlayState[];
    suggestions: Suggestion[];
    users: PlayerState[];
    sfx: SfxState;
    startVolume: number;
}

export interface StoredWorkspace {
    _id: string;
    name: string;
    files: File[];
    state: WorkspaceState;
    extends?: ID[];
}

export interface Workspace extends Omit<StoredWorkspace, '_id'> {
    jobs: Job[];
}

export interface PlayerStateUpdate {
    name: string;
    status?: Status;
    volume?: number;
}

export interface PlayStateUpdate {
    queue?: ID[];
    volume?: number;
    pauseTime?: number | null;
    timePlayed?: number; //  in seconds
    speed?: number;
}

export interface WorkspaceUpdate {
    playing?: PlayStateUpdate | null;
    ambience?: PlayStateUpdate | null;
    sfx?: PlayStateUpdate | null;
    sfxMerge?: boolean;
    suggestion?: Suggestion;
    users?: PlayerState;
    delAmbience?: ID[];
    delSuggestion?: ID;
    delUser?: string;
}

export type WorkspaceResolver = (update: WorkspaceUpdate) => Promise<void>;

export function updatePlayState(
    update: PlayStateUpdate | null | undefined,
    original: PlayState | null,
    defaultVolume?: number,
): PlayState | null {
    if (update === undefined) return original;
    if (update === null) return null;
    if (update.queue === undefined && original === null) return null;

    const newStartTimestamp = update.timePlayed !== undefined ? Date.now() - update.timePlayed * 1000 : null;

    const copy: PlayState =
        original === null
            ? {
                  queue: update.queue as string[],
                  pauseTime: update.pauseTime ?? null,
                  startTimestamp: newStartTimestamp ?? Date.now(),
                  volume: update.volume ?? defaultVolume ?? 1,
                  speed: update.speed ?? 1,
              }
            : { ...original };

    if (update) {
        if (update.queue) {
            copy.queue = [...update.queue];
        }
        if (update.timePlayed !== undefined) {
            copy.startTimestamp = newStartTimestamp;
            if (copy.pauseTime !== null && update.pauseTime === undefined) {
                copy.pauseTime = Date.now(); // update pause time to reflect seek.
            }
        }
        if (update.pauseTime === null) {
            if (original?.pauseTime) {
                const difference = Date.now() - original.pauseTime;
                if (copy.startTimestamp !== null) {
                    copy.startTimestamp += difference;
                } else {
                    console.warn('Resuming without start... starting at beginning.');
                }
            }

            copy.pauseTime = null;
        } else if (update.pauseTime !== undefined) {
            copy.pauseTime = update.pauseTime;
            if (copy.startTimestamp === null) {
                if (update.timePlayed === undefined) {
                    console.warn('Pausing without start time... assuming pausing at beginning.');
                    copy.startTimestamp = update.pauseTime;
                } else {
                    copy.startTimestamp = update.pauseTime - update.timePlayed * 1000;
                }
            }
        }
        if (typeof update.volume === 'number') {
            copy.volume = update.volume;
        }
        if (typeof update.speed === 'number') {
            copy.speed = update.speed;
            if (update.timePlayed) {
                copy.startTimestamp = Date.now() - (update.timePlayed * 1000) / copy.speed;
            } else {
                console.warn('When updating speed, the timePlayed should be specified.');
            }
        }
    }

    return copy;
}
