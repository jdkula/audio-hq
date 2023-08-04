import type { Socket as ServerSocket } from 'socket.io';
import type { Socket as ClientSocket } from 'socket.io-client';
import { JobsCollectionType } from './db/mongodb';
import * as API from 'common/lib/api/transport/models';

export type ServerToClientEvents = {
    entriesUpdate: (entries: Array<API.Entry>) => void;
    decksUpdate: (decks: Array<API.Deck>) => void;
    jobsUpdate: (jobs: Array<API.Job>) => void;

    /* for workers */
    jobOffer: (job: API.Job, ack: (accepted: boolean) => void) => void;
};

export type Status<T> =
    | {
          error: string;
      }
    | {
          data: T;
          error: null;
      };

export type ClientToServerEvents = {
    searchWorkspace: (query: string) => Promise<Status<API.WorkspaceSearchResponse>>;
    createWorkspace: (workspace: API.WorkspaceMutate) => Promise<Status<API.Workspace>>;
    getWorkspace: (id: string) => Promise<Status<API.Workspace>>;
    updateWorkspace: (id: string, mutate: API.WorkspaceMutate) => Promise<Status<API.Workspace>>;
    deleteWorkspace: (id: string) => Promise<Status<void>>;
    listEntries: (workspaceId: string) => Promise<Status<API.ListEntriesResponse>>;
    createEntry: (workspaceId: string, input: API.EntryMutate) => Promise<Status<API.Entry>>;
    getEntry: (workspaceId: string, id: string) => Promise<Status<API.Entry>>;
    updateEntry: (workspaceId: string, id: string, input: API.EntryMutate) => Promise<Status<API.Entry>>;
    deleteEntry: (workspaceId: string, id: string) => Promise<Status<void>>;
    listDecks: (workspaceId: string) => Promise<Status<API.ListDecksResponse>>;
    createDeck: (workspaceId: string, input: API.DeckCreate) => Promise<Status<API.Deck>>;
    getDeck: (workspaceId: string, id: string) => Promise<Status<API.Deck>>;
    updateDeck: (workspaceId: string, id: string, input: API.DeckMutate) => Promise<Status<API.Deck>>;
    deleteDeck: (workspaceId: string, id: string) => Promise<Status<void>>;
    listJobs: (workspaceId: string) => Promise<Status<API.ListJobsResponse>>;
    uploadFile: (fileSizeBytes: number, type: string) => Promise<Status<string>>;
    submitJob: (workspaceId: string, input: API.NewJob) => Promise<Status<API.Job>>;
    getJob: (workspaceId: string, id: string) => Promise<Status<API.Job>>;
    cancelJob: (workspaceId: string, id: string) => Promise<Status<void>>;

    join: (workspaceId: string) => Promise<Status<void>>;
    leave: (workspaceId: string) => Promise<Status<void>>;
};
export type AdminClientToServerEvents = {
    /* for workers */
    registerWorker: (sharedKey: string, checkinFrequency: number) => Promise<Status<string>>;
    workerCheckIn: (sharedKey: string, id: string) => Promise<Status<void>>;

    adminRequestJob: (sharedKey: string, workerId: string) => Promise<Status<void>>;
    adminUpdateJob: (
        sharedKey: string,
        workspaceId: string,
        id: string,
        update: API.AdminJobMutate,
    ) => Promise<Status<API.Job>>;
    adminCompleteJob: (
        sharedKey: string,
        workspaceId: string,
        id: string,
        completion: API.JobComplete,
    ) => Promise<Status<void>>;

    pruneWorkers: (sharedKey: string) => Promise<Status<void>>;
};
export type UtilityFunctions = {
    getNextAvailableJob: () => Promise<JobsCollectionType | null>;
};

type OnlyFunctions<ReturnType = any> = { [K: string]: (...args: any) => ReturnType };
type MaybeUnwrapPromise<Wrapped extends Promise<unknown>> = Wrapped extends Promise<infer Internal>
    ? Internal
    : Wrapped;

export type CallbackStyle<I extends OnlyFunctions> = {
    [P in keyof I]: (...args: [...Parameters<I[P]>, (output: MaybeUnwrapPromise<ReturnType<I[P]>>) => void]) => void;
};

export type NoStatus<I extends OnlyFunctions> = {
    [P in keyof I]: (
        ...args: Parameters<I[P]>
    ) => MaybeUnwrapPromise<ReturnType<I[P]>> extends Status<infer Data> ? Promise<Data> : ReturnType<I[P]>;
};

type AllEvents = ClientToServerEvents & AdminClientToServerEvents;
export type IServiceBase = NoStatus<AllEvents> & UtilityFunctions;
export type IService = AllEvents;

export type ServerServiceSocket = ServerSocket<CallbackStyle<AllEvents>, ServerToClientEvents>;
export type ClientServiceSocket = ClientSocket<ServerToClientEvents, CallbackStyle<AllEvents>>;
