import { Workspace, WorkspaceState, File as WSFile } from './Workspace';
import PouchDB from 'pouchdb';
import axios from 'axios';
import Pusher from 'pusher-js';
import Axios from 'axios';
import { createContext, useState, useRef, useEffect } from 'react';
import type { Job } from './processor';
import { Set } from 'immutable';
import { mutate } from 'swr';

interface FileManager {
    song: (id: string) => Promise<Blob[]>;
    reset: () => Promise<void>;
    import: (workspaceId: string, name: string, url: string) => Promise<Job>;
    upload: (workspaceId: string, name: string, file: File) => Promise<Job>;
    delete: (id: string, workspaceId?: string) => Promise<void>;
    cached: Set<string>;
    fetching: Set<Job>;
    working: Set<Job>;
}

async function waitForJob(id: string, workspaceId?: string, onUpdate?: (j: Job) => void): Promise<WSFile> {
    let handle: number | null = null;
    let fetching = false;
    return new Promise((resolve, reject) => {
        handle = window.setInterval(async () => {
            if (fetching) return;
            fetching = true;
            const res = await Axios.get(`/api/jobs/${id}`);
            if (res.data) onUpdate?.(res.data);
            if ((res.data as Job).status === 'done') {
                if (workspaceId) mutate(`/api/${workspaceId}/files`);

                if (handle) window.clearInterval(handle);
                handle = null;
                resolve((await Axios.get(`/api/files/${id}`)).data);
            } else if (res.data.status === 'error') {
                if (handle) window.clearInterval(handle);
                handle = null;
                reject((res.data as Job).errorInfo);
            }
            fetching = false;
        }, 1000);
    });
}

const useFileManager = (): FileManager => {
    const cache = useRef(new PouchDB('cache'));

    const [cached, setCached] = useState<Set<string>>(Set());
    const [fetching, setFetching] = useState<Set<Job>>(Set());
    const [working, setWorking] = useState<Set<Job>>(Set());

    useEffect(() => {
        cache.current.allDocs().then((docs) => setCached(Set(docs.rows.map((row) => row.id))));
    }, [cache.current]);

    const reset = async () => {
        await cache.current.destroy();
        cache.current = new PouchDB('cache');
        setCached(Set());
    };

    const updateFetching = (id: string, progress: number) => {
        setFetching((fetching) =>
            fetching.map((v) => (((v.jobId as unknown) as string) === id ? { ...v, progress } : v)),
        );
    };

    const song = async (id: string, name?: string): Promise<Blob[]> => {
        // TODO: audio sets
        try {
            const data = await cache.current.getAttachment(id, 'file');
            setCached((cached) => cached.add(id));
            return [data as Blob]; // client only.
        } catch (e) {
            setFetching((fetching) =>
                fetching.add({ jobId: id as any, name: name ?? 'Loading...', progress: 0, status: 'downloading' }),
            );
            const resp = await axios.get(`/api/files/${id}/download`, {
                responseType: 'blob',
                onDownloadProgress: (progress) => {
                    updateFetching(id, progress.loaded / progress.total);
                },
            });
            setFetching((fetching) =>
                fetching.add({ jobId: id as any, name: name ?? 'Loading...', progress: 0, status: 'done' }),
            );
            await cache.current.put({
                _id: id,
                _attachments: {
                    file: {
                        content_type: 'audio/mp3',
                        data: resp.data,
                    },
                },
            });
            setCached((cached) => cached.add(id));
            setFetching((fetching) => fetching.filterNot((v) => ((v.jobId as unknown) as string) === id));
            return [resp.data];
        }
    };

    const updateJob = (job: Job) => {
        setWorking((working) =>
            working.map((other) => (other.jobId === job.jobId ? job : other)).sortBy((v) => v.name),
        );
    };

    const imp = async (workspaceId: string, name: string, url: string) => {
        const res = await axios.post('/api/files/import', { workspace: workspaceId, name: name, url: url });
        setWorking(working.add(res.data));
        waitForJob(res.data.jobId, workspaceId, updateJob).then(({ id }) =>
            setWorking((working) => working.filterNot((job) => ((job.jobId as unknown) as string) === id)),
        );
        return res.data;
    };

    const upload = async (workspaceId: string, name: string, file: File) => {
        const formdata = new FormData();
        formdata.append('workspace', workspaceId);
        formdata.append('upload', file);
        formdata.append('name', name);
        const res = await axios.post('/api/files/convert', formdata);
        setWorking(working.add(res.data));
        waitForJob(res.data.jobId, workspaceId, updateJob).then(({ id }) =>
            setWorking((working) => working.filterNot((job) => ((job.jobId as unknown) as string) === id)),
        );
        return res.data;
    };

    const del = async (id: string, workspaceId?: string) => {
        try {
            const orig = await cache.current.get(id);
            await cache.current.remove({ _id: id, _rev: orig._rev });
        } catch (e) {
            // ignore
        }
        await Axios.delete(`/api/files/${id}`);
        setCached(cached.remove(id));
        if (workspaceId) mutate(`/api/${workspaceId}/files`);
    };

    return {
        cached,
        fetching,
        import: imp,
        delete: del,
        reset,
        song,
        upload,
        working,
    };
};

export default useFileManager;

export const FileManagerContext = createContext<FileManager>(null as never);
