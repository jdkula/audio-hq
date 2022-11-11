////////// Workspaces

export interface Workspace {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export type WorkspaceCreate = Pick<Workspace, 'name'>;
export type WorkspaceUpdate = Partial<WorkspaceCreate>;

////////// Tracks

export type TrackType = 'single';

export interface Track {
    id: string;
    type: TrackType;
    path: Array<string>;

    name: string;
    description: string;
    length: number;

    url: string;
}

export type TrackCreate = Pick<Track, 'path' | 'name' | 'description'> & { order: number | null };
export type TrackUpdate = Partial<TrackCreate>;

////////// Decks

export type DeckType = 'main' | 'ambient' | 'sfx';

export interface Deck {
    id: string;
    type: DeckType;

    volume: number;
    speed: number;
    pauseTimestamp: Date | null;
    startTimestamp: Date;

    queue: Array<Track>;

    createdAt: Date;
}

export type DeckCreate = Pick<Deck, 'type' | 'volume' | 'speed' | 'startTimestamp' | 'pauseTimestamp' | 'queue'>;
export type DeckUpdate = Partial<Omit<DeckCreate, 'type'>>;

////////// Jobs

export interface Job extends TrackCreate {
    id: string;
    modifications: Array<JobModification>;

    progress: number;
    status: string;
    assignedWorker: string | null;
}

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

export type JobCreate = TrackCreate;
