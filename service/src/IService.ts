import type { Socket as ServerSocket } from 'socket.io';
import type { Socket as ClientSocket } from 'socket.io-client';

export type ServerToClientEvents<BufferType = ArrayBuffer> = {
    entriesUpdate: (entries: BufferType) => void;
    decksUpdate: (decks: BufferType) => void;
    jobsUpdate: (jobs: BufferType) => void;
};

export type Status<T> = {
    data?: T;
    error?: string;
};

export type ClientToServerEvents<BufferType = ArrayBuffer> = {
    searchWorkspace: (query: string) => Promise<Status<BufferType>>;
    createWorkspace: (input: BufferType) => Promise<Status<BufferType>>;
    getWorkspace: (id: string) => Promise<Status<BufferType>>;
    updateWorkspace: (id: string, mutate: BufferType) => Promise<Status<BufferType>>;
    deleteWorkspace: (id: string) => Promise<Status<void>>;
    listEntries: (workspaceId: string) => Promise<Status<BufferType>>;
    createEntry: (workspaceId: string, input: BufferType) => Promise<Status<BufferType>>;
    getEntry: (workspaceId: string, id: string) => Promise<Status<BufferType>>;
    updateEntry: (workspaceId: string, id: string, input: BufferType) => Promise<Status<BufferType>>;
    deleteEntry: (workspaceId: string, id: string) => Promise<Status<void>>;
    listDecks: (workspaceId: string) => Promise<Status<BufferType>>;
    createDeck: (workspaceId: string, input: BufferType) => Promise<Status<BufferType>>;
    getDeck: (workspaceId: string, id: string) => Promise<Status<BufferType>>;
    updateDeck: (workspaceId: string, id: string, input: BufferType) => Promise<Status<BufferType>>;
    deleteDeck: (workspaceId: string, id: string) => Promise<Status<void>>;
    listJobs: (workspaceId: string) => Promise<Status<BufferType>>;
    uploadFile: (workspaceId: string, input: BufferType, file: Blob) => Promise<Status<BufferType>>;
    submitUrl: (workspaceId: string, input: BufferType, url: string) => Promise<Status<BufferType>>;
    getJob: (workspaceId: string, id: string) => Promise<Status<BufferType>>;
    cancelJob: (workspaceId: string, id: string) => Promise<Status<void>>;
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

export type IServiceBase<T> = NoStatus<ClientToServerEvents<T>>;
export type IService<T> = ClientToServerEvents<T>;

export type ServerServiceSocket<BufferType> = ServerSocket<CallbackStyle<ClientToServerEvents<BufferType>>, CallbackStyle<ServerToClientEvents<BufferType>>>;
export type ClientServiceSocket<BufferType> = ClientSocket<CallbackStyle<ServerToClientEvents<BufferType>>, CallbackStyle<ClientToServerEvents<BufferType>>>;