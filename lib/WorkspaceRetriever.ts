import { Workspace, WorkspaceState, File } from './Workspace';
import PouchDB from 'pouchdb';
import axios from 'axios';
import Pusher from 'pusher-js';
import Axios from 'axios';

export class WorkspaceRetriever {
    private readonly pusher: Pusher;
    private static cache: PouchDB.Database = new PouchDB('cache');
    private readonly onChange: (() => void)[] = [];

    constructor(private readonly _workspaceId: string) {
        this.pusher = new Pusher('84babc6c05f24b3af609', {
            cluster: 'us3',
        });

        const channel = this.pusher.subscribe(_workspaceId);

        channel.bind('change', () => {
            for (const f of this.onChange) {
                if (f && typeof f === 'function') {
                    f();
                }
            }
        });
    }

    close(): void {
        throw new Error('Closing Retriever!!!');
        this.pusher.disconnect();
    }

    async workspace(): Promise<Workspace> {
        return (await Axios.get('/api/' + this._workspaceId)).data;
    }

    async files(): Promise<File[]> {
        return (await Axios.get('/api/' + this._workspaceId + '/files')).data;
    }

    async state(): Promise<WorkspaceState> {
        return (await Axios.get('/api/' + this._workspaceId + '/state')).data;
    }

    static async song(id: string): Promise<Blob[]> {
        // TODO: audio sets
        try {
            const data = await WorkspaceRetriever.cache.getAttachment(id, 'file');
            return [data as Blob]; // client only.
        } catch (e) {
            const resp = await axios.get('/api/files/' + id, {
                responseType: 'blob',
            });
            await WorkspaceRetriever.cache.put({
                _id: id,
                _attachments: {
                    file: {
                        content_type: 'audio/mp3',
                        data: resp.data,
                    },
                },
            });
            return [resp.data];
        }
    }

    addOnChangeHandler(onChange: () => void): void {
        this.onChange.push(onChange);
    }

    removeOnChangeHandler(onChange: () => void): void {
        const idx = this.onChange.findIndex(onChange);
        if (idx === -1) return;

        this.onChange.splice(idx, 1);
    }
}
