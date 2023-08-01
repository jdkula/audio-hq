/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { io } from 'socket.io-client';
import MsgParser from 'socket.io-msgpack-parser';
import { ClientServiceSocket, IService, Status } from 'service/lib/IService';

export default class SocketTransport<BufferType> implements IService<BufferType> {
    public readonly socket: ClientServiceSocket<BufferType>;

    constructor(baseUrl: string) {
        this.socket = io(baseUrl, {
            parser: MsgParser,
        });
    }

    addJobsListener(workspaceId: string, fn: (proto: BufferType) => void) {
        this.join(workspaceId);
        this.socket.on('jobsUpdate', fn);
    }
    addEntriesListiner(workspaceId: string, fn: (proto: BufferType) => void) {
        this.join(workspaceId);
        this.socket.on('entriesUpdate', fn);
    }
    addDecksListener(workspaceId: string, fn: (proto: BufferType) => void) {
        this.join(workspaceId);
        this.socket.on('decksUpdate', fn);
    }
    addWorkerListener(fn: (proto: BufferType, ack: (accepted: boolean) => void) => void) {
        this.socket.on('jobOffer', fn);
    }

    async adminRequestJob(sharedKey: string, workerId: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('adminRequestJob', sharedKey, workerId);
    }
    async adminCompleteJob(sharedKey: string, workspaceId: string, completion: BufferType): Promise<Status<void>> {
        return await this.socket.emitWithAck('adminCompleteJob', sharedKey, workspaceId, completion);
    }
    async join(workspaceId: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('join', workspaceId);
    }
    async leave(workspaceId: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('leave', workspaceId);
    }
    async registerWorker(sharedKey: string, checkinFrequency: number): Promise<Status<string>> {
        return await this.socket.emitWithAck('registerWorker', sharedKey, checkinFrequency);
    }
    async workerCheckIn(sharedKey: string, id: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('workerCheckIn', sharedKey, id);
    }
    async adminUpdateJob(
        sharedKey: string,
        workspaceId: string,
        id: string,
        update: BufferType,
    ): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('adminUpdateJob', sharedKey, workspaceId, id, update);
    }
    async pruneWorkers(sharedKey: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('pruneWorkers', sharedKey);
    }

    async searchWorkspace(query: string): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('searchWorkspace', query);
    }
    async createWorkspace(input: BufferType): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('createWorkspace', input);
    }
    async getWorkspace(id: string): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('getWorkspace', id);
    }
    async updateWorkspace(id: string, mutate: BufferType): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('updateWorkspace', id, mutate);
    }
    async deleteWorkspace(id: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('deleteWorkspace', id);
    }
    async listEntries(workspaceId: string): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('listEntries', workspaceId);
    }
    async createEntry(workspaceId: string, input: BufferType): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('createEntry', workspaceId, input);
    }
    async getEntry(workspaceId: string, id: string): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('getEntry', workspaceId, id);
    }
    async updateEntry(workspaceId: string, id: string, input: BufferType): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('updateEntry', workspaceId, id, input);
    }
    async deleteEntry(workspaceId: string, id: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('deleteEntry', workspaceId, id);
    }
    async listDecks(workspaceId: string): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('listDecks', workspaceId);
    }
    async createDeck(workspaceId: string, input: BufferType): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('createDeck', workspaceId, input);
    }
    async getDeck(workspaceId: string, id: string): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('getDeck', workspaceId, id);
    }
    async updateDeck(workspaceId: string, id: string, input: BufferType): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('updateDeck', workspaceId, id, input);
    }
    async deleteDeck(workspaceId: string, id: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('deleteDeck', workspaceId, id);
    }
    async listJobs(workspaceId: string): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('listJobs', workspaceId);
    }
    async uploadFile(fileSizeBytes: number, type: string): Promise<Status<string>> {
        return await this.socket.emitWithAck('uploadFile', fileSizeBytes, type);
    }
    async submitJob(workspaceId: string, input: BufferType): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('submitJob', workspaceId, input);
    }
    async getJob(workspaceId: string, id: string): Promise<Status<BufferType>> {
        return await this.socket.emitWithAck('getJob', workspaceId, id);
    }
    async cancelJob(workspaceId: string, id: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('cancelJob', workspaceId, id);
    }
}
