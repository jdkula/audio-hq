/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { io } from 'socket.io-client';
import MsgParser from 'socket.io-msgpack-parser';
import { ClientServiceSocket, IService, Status } from 'service/lib/IService';

export default class SocketTransport implements IService<ArrayBuffer> {
    public readonly socket: ClientServiceSocket<ArrayBuffer>;

    constructor(baseUrl: string) {
        this.socket = io(baseUrl, {
            parser: MsgParser,
        });
    }

    async searchWorkspace(query: string): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('searchWorkspace', query);
    }
    async createWorkspace(input: ArrayBuffer): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('createWorkspace', input);
    }
    async getWorkspace(id: string): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('getWorkspace', id);
    }
    async updateWorkspace(id: string, mutate: ArrayBuffer): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('updateWorkspace', id, mutate);
    }
    async deleteWorkspace(id: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('deleteWorkspace', id);
    }
    async listEntries(workspaceId: string): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('listEntries', workspaceId);
    }
    async createEntry(workspaceId: string, input: ArrayBuffer): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('createEntry', workspaceId, input);
    }
    async getEntry(workspaceId: string, id: string): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('getEntry', workspaceId, id);
    }
    async updateEntry(workspaceId: string, id: string, input: ArrayBuffer): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('updateEntry', workspaceId, id, input);
    }
    async deleteEntry(workspaceId: string, id: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('deleteEntry', workspaceId, id);
    }
    async listDecks(workspaceId: string): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('listDecks', workspaceId);
    }
    async createDeck(workspaceId: string, input: ArrayBuffer): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('createDeck', workspaceId, input);
    }
    async getDeck(workspaceId: string, id: string): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('getDeck', workspaceId, id);
    }
    async updateDeck(workspaceId: string, id: string, input: ArrayBuffer): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('updateDeck', workspaceId, id, input);
    }
    async deleteDeck(workspaceId: string, id: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('deleteDeck', workspaceId, id);
    }
    async listJobs(workspaceId: string): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('listJobs', workspaceId);
    }
    async uploadFile(workspaceId: string, input: ArrayBuffer, file: Blob): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('uploadFile', workspaceId, input, file);
    }
    async submitUrl(workspaceId: string, input: ArrayBuffer, url: string): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('submitUrl', workspaceId, input, url);
    }
    async getJob(workspaceId: string, id: string): Promise<Status<ArrayBuffer>> {
        return await this.socket.emitWithAck('getJob', workspaceId, id);
    }
    async cancelJob(workspaceId: string, id: string): Promise<Status<void>> {
        return await this.socket.emitWithAck('cancelJob', workspaceId, id);
    }
}
