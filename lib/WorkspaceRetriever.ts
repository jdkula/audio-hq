import { Workspace, WorkspaceState, File } from './Workspace';
import PouchDB from 'pouchdb';
import axios from 'axios';
import Pusher from 'pusher-js';
import Axios from 'axios';

export class WorkspaceRetriever {
    private readonly pusher: Pusher;
    private readonly cache: PouchDB.Database;
    private readonly onChange: (() => void)[] = [];

    constructor(private readonly _workspaceId: string) {
        this.pusher = new Pusher('84babc6c05f24b3af609', {
            cluster: 'us3',
        });

        this.cache = new PouchDB('cache');

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
        this.cache.close();
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

    async song(id: string): Promise<Blob> {
        try {
            const data = await this.cache.getAttachment(id, 'file');
            return data as Blob; // client only.
        } catch (e) {
            const resp = await axios.get('/api/files/' + id, {
                responseType: 'arraybuffer',
            });
            const blob = new Blob([resp.data]);
            await this.cache.put({
                _id: id,
                _attachments: {
                    file: {
                        content_type: 'audio/mp3',
                        data: blob,
                    },
                },
            });
            return blob;
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
