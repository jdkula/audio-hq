/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { io } from 'socket.io-client';
import MsgParser from 'socket.io-msgpack-parser';
import { ClientServiceSocket, IService, Status } from 'service/lib/IService';
import {
    WorkspaceSearchResponse,
    WorkspaceMutate,
    Workspace,
    ListEntriesResponse,
    EntryMutate,
    Entry,
    ListDecksResponse,
    DeckCreate,
    Deck,
    DeckMutate,
    ListJobsResponse,
    NewJob,
    Job,
    AdminJobMutate,
    JobComplete,
} from 'common/lib/api/transport/models';

export default class SocketTransport implements IService {
    public readonly socket: ClientServiceSocket;

    private _rejoin: (() => Promise<void> | void) | null = null;
    private _joinedWorkspace: string | null = null;

    constructor(init: string | ClientServiceSocket) {
        if (typeof init === 'string') {
            this.socket = io(init, {
                parser: MsgParser,
                rejectUnauthorized: false,
            });
        } else {
            this.socket = init;
        }

        this.socket.on('connect', () => {
            if (this._joinedWorkspace) {
                this.join(this._joinedWorkspace);
            }
            if (this._rejoin) {
                this._rejoin();
            }
        });
    }

    addJobsListener(workspaceId: string, fn: (jobs: Job[]) => void) {
        this.join(workspaceId);
        this.socket.on('jobsUpdate', fn);
    }
    addEntriesListiner(workspaceId: string, fn: (entries: Entry[]) => void) {
        this.join(workspaceId);
        this.socket.on('entriesUpdate', fn);
    }
    addDecksListener(workspaceId: string, fn: (decks: Deck[]) => void) {
        this.join(workspaceId);
        this.socket.on('decksUpdate', fn);
    }
    addWorkerListener(fn: (job: Job, ack: (accepted: boolean) => void) => void) {
        this.socket.on('jobOffer', fn);
    }

    async searchWorkspace(query: string): Promise<Status<WorkspaceSearchResponse>> {
        return await this.socket.emitWithAck('searchWorkspace', query);
    }
    async createWorkspace(workspace: WorkspaceMutate): Promise<Status<Workspace>> {
        return await this.socket.emitWithAck('createWorkspace', workspace);
    }
    async getWorkspace(id: string): Promise<Status<Workspace>> {
        return await this.socket.emitWithAck('getWorkspace', id);
    }
    async updateWorkspace(id: string, mutate: WorkspaceMutate): Promise<Status<Workspace>> {
        return await this.socket.emitWithAck('updateWorkspace', id, mutate);
    }
    async deleteWorkspace(id: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('deleteWorkspace', id);
    }
    async listEntries(workspaceId: string): Promise<Status<ListEntriesResponse>> {
        return await this.socket.emitWithAck('listEntries', workspaceId);
    }
    async createEntry(workspaceId: string, input: EntryMutate): Promise<Status<Entry>> {
        return await this.socket.emitWithAck('createEntry', workspaceId, input);
    }
    async getEntry(workspaceId: string, id: string): Promise<Status<Entry>> {
        return await this.socket.emitWithAck('getEntry', workspaceId, id);
    }
    async updateEntry(workspaceId: string, id: string, input: EntryMutate): Promise<Status<Entry>> {
        return await this.socket.emitWithAck('updateEntry', workspaceId, id, input);
    }
    async deleteEntry(workspaceId: string, id: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('deleteEntry', workspaceId, id);
    }
    async listDecks(workspaceId: string): Promise<Status<ListDecksResponse>> {
        return await this.socket.emitWithAck('listDecks', workspaceId);
    }
    async createDeck(workspaceId: string, input: DeckCreate): Promise<Status<Deck>> {
        return await this.socket.emitWithAck('createDeck', workspaceId, input);
    }
    async getDeck(workspaceId: string, id: string): Promise<Status<Deck>> {
        return await this.socket.emitWithAck('getDeck', workspaceId, id);
    }
    async updateDeck(workspaceId: string, id: string, input: DeckMutate): Promise<Status<Deck>> {
        return await this.socket.emitWithAck('updateDeck', workspaceId, id, input);
    }
    async deleteDeck(workspaceId: string, id: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('deleteDeck', workspaceId, id);
    }
    async listJobs(workspaceId: string): Promise<Status<ListJobsResponse>> {
        return await this.socket.emitWithAck('listJobs', workspaceId);
    }
    async uploadFile(fileSizeBytes: number, type: string): Promise<Status<string>> {
        return await this.socket.emitWithAck('uploadFile', fileSizeBytes, type);
    }
    async submitJob(workspaceId: string, input: NewJob): Promise<Status<Job>> {
        return await this.socket.emitWithAck('submitJob', workspaceId, input);
    }
    async getJob(workspaceId: string, id: string): Promise<Status<Job>> {
        return await this.socket.emitWithAck('getJob', workspaceId, id);
    }
    async cancelJob(workspaceId: string, id: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('cancelJob', workspaceId, id);
    }
    async join(workspaceId: string): Promise<Status<void>> {
        const status = await this.socket.emitWithAck('join', workspaceId);
        if (status.error === null) {
            this._joinedWorkspace = workspaceId;
        }
        return status;
    }
    async leave(workspaceId: string): Promise<Status<void>> {
        const status = await this.socket.emitWithAck('leave', workspaceId);
        if (status.error === null) {
            this._joinedWorkspace = null;
        }
        return status;
    }
    async registerWorker(sharedKey: string, checkinFrequency: number, id?: string): Promise<Status<string>> {
        const status = await this.socket.emitWithAck('registerWorker', sharedKey, checkinFrequency, id);
        if (status.error === null) {
            const confirmedId = status.data;
            this._rejoin = async () => {
                await this.socket.emitWithAck('registerWorker', sharedKey, checkinFrequency, confirmedId);
            };
        }
        return status;
    }
    async workerCheckIn(sharedKey: string, id: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('workerCheckIn', sharedKey, id);
    }
    async adminRequestJob(sharedKey: string, workerId: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('adminRequestJob', sharedKey, workerId);
    }
    async adminUpdateJob(
        sharedKey: string,
        workspaceId: string,
        id: string,
        update: AdminJobMutate,
    ): Promise<Status<Job>> {
        return await this.socket.emitWithAck('adminUpdateJob', sharedKey, workspaceId, id, update);
    }
    async adminCompleteJob(
        sharedKey: string,
        workspaceId: string,
        id: string,
        completion: JobComplete,
        buffer: Buffer | ArrayBuffer,
    ): Promise<Status<void>> {
        return await this.socket.emitWithAck('adminCompleteJob', sharedKey, workspaceId, id, completion, buffer);
    }
    async pruneWorkers(sharedKey: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('pruneWorkers', sharedKey);
    }
}
