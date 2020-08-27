import PouchDB from 'pouchdb';
import Axios from 'axios';
import { createContext, MutableRefObject, useEffect, useRef, useState } from 'react';
import { Set } from 'immutable';
import { mutate } from 'swr';
import type { Job } from './jobs';
import { useJobs } from './useWorkspace';
import { File as WSFile, Reorderable } from './Workspace';

interface FileManager {
    song: (id: string, onCacheRetrieve?: (song: Blob) => void) => string;
    reset: () => Promise<void>;
    import: (name: string, url: string, path?: string[]) => Promise<Job>;
    upload: (name: string, file: File, path?: string[]) => Promise<Job>;
    delete: (id: string) => Promise<void>;
    update: (id: string, update: Partial<WSFile & Reorderable>) => Promise<void>;
    cached: Set<string>;
    fetching: Set<Job>;
    working: Set<Job>;
}

async function* readBody(body: ReadableStream<Uint8Array>) {
    const reader = body.getReader();
    while (true) {
        const next = await reader.read();
        if (next.done) break;
        yield next;
    }
    reader.releaseLock();
}

const useFileManager = (workspaceId: string): FileManager => {
    const cache = useRef(new PouchDB('cache'));

    const fetchCallbacks: MutableRefObject<Map<string, Set<(song: Blob) => void>>> = useRef(new Map());

    const [cached, setCached] = useState<Set<string>>(Set());
    const [fetching, setFetching] = useState<Set<Job>>(Set());
    const [working, setWorking] = useState<Set<Job>>(Set());
    const { jobs } = useJobs(workspaceId);

    useEffect(() => {
        cache.current.allDocs().then((docs) => setCached(Set(docs.rows.map((row) => row.id))));
    }, [cache.current]);

    useEffect(() => {
        Promise.all(jobs.filter((j) => j.status === 'done').map((j) => Axios.delete(`/api/jobs/${j.jobId}`))).then(
            () => {
                mutate(`/api/${workspaceId}/files`);
                mutate(`/api/${workspaceId}/jobs`);
            },
        );
    }, [jobs]);

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

    const song = (id: string, onCacheRetrieve?: (song: Blob) => void): string => {
        // TODO: audio sets
        const url = `/api/files/${id}/download`;
        const inflight = fetchCallbacks.current.has(id);
        if (onCacheRetrieve) {
            fetchCallbacks.current.set(id, (fetchCallbacks.current.get(id) ?? Set()).add(onCacheRetrieve));
        }

        if (inflight) return url;

        cache.current
            .getAttachment(id, 'file')
            .then((data) => {
                setCached((cached) => cached.add(id));
                (fetchCallbacks.current.get(id) ?? Set()).forEach((callback) => callback(data as Blob));
                fetchCallbacks.current.delete(id);
            })
            .catch(async () => {
                setFetching((fetching) =>
                    fetching.add({
                        jobId: id as any,
                        name: 'Loading...',
                        progress: 0,
                        status: 'downloading',
                        workspace: workspaceId,
                    }),
                );
                let resp = await fetch(url, {
                    headers: {
                        'X-Manual-Redirect': 'true',
                        Accept: 'audio/mp3',
                    },
                });
                console.warn(resp);

                if (resp.headers.get('X-Redirect-Location')) {
                    resp = await fetch(resp.headers.get('X-Redirect-Location')!, {
                        headers: {
                            Accept: 'audio/mp3',
                        },
                    });
                }
                console.warn(resp);
                if (!resp || !resp.body) throw new Error(JSON.stringify(resp));

                const bytes = parseInt(resp.headers.get('Content-Length') ?? '1');
                let read = 0;
                let lastNotified = 0;
                const data: Uint8Array[] = [];
                for await (const chunk of readBody(resp.body)) {
                    read += chunk.value.length;
                    data.push(chunk.value);
                    if (Date.now() - lastNotified > 500) {
                        // only update every half second
                        updateFetching(id, read / bytes);
                        lastNotified = Date.now();
                    }
                }

                const blob = new Blob(data, { type: 'audio/mp3' });

                setFetching((fetching) =>
                    fetching.map((v) =>
                        v.jobId === id
                            ? {
                                  jobId: id as any,
                                  name: name ?? 'Loading...',
                                  progress: null,
                                  status: 'saving',
                                  workspace: workspaceId,
                              }
                            : v,
                    ),
                );
                try {
                    await cache.current.put({
                        _id: id,
                        _attachments: {
                            file: {
                                content_type: 'audio/mp3',
                                data: blob,
                            },
                        },
                    });
                } catch (e) {
                    if (e?.status === 409) {
                        console.warn('Confict error... probably added in another tab?');
                    } else {
                        throw e;
                    }
                }
                setCached((cached) => cached.add(id));
                setFetching((fetching) => fetching.filterNot((v) => ((v.jobId as unknown) as string) === id));
                (fetchCallbacks.current.get(id) ?? Set()).forEach((callback) => callback(blob));
                fetchCallbacks.current.delete(id);
            });

        return url;
    };

    const imp = async (name: string, url: string, currentPath?: string[]) => {
        const res = await Axios.post('/api/files/import', {
            workspace: workspaceId,
            name: name,
            url: url,
            path: currentPath,
        });
        mutate(`/api/${workspaceId}/jobs`);
        return res.data;
    };

    const upload = async (name: string, file: File, currentPath?: string[]) => {
        const formdata = new FormData();
        formdata.append('workspace', workspaceId);
        formdata.append('upload', file);
        formdata.append('name', name);
        currentPath && formdata.append('path', JSON.stringify(currentPath));
        setWorking((working) =>
            working.add({ jobId: name, name, progress: 0, status: 'uploading', workspace: workspaceId }),
        );
        try {
            const res = await Axios.post('/api/files/convert', formdata, {
                onUploadProgress: (progress) =>
                    setWorking((working) =>
                        working.map((v) =>
                            v.jobId === name ? { ...v, progress: progress.loaded / progress.total } : v,
                        ),
                    ),
            });
            mutate(`/api/${workspaceId}/jobs`, (jobs: Job[]) => [...jobs, res.data]);
            return res.data;
        } finally {
            setWorking((working) => working.filterNot((v) => v.jobId === name));
        }
    };

    const del = async (id: string) => {
        try {
            const orig = await cache.current.get(id);
            await cache.current.remove({ _id: id, _rev: orig._rev });
        } catch (e) {
            // ignore
        }
        setCached(cached => cached.remove(id));
        mutate(`/api/${workspaceId}/files`, (files?: WSFile[]) => files?.filter((f) => f.id !== id), false);
        await Axios.delete(`/api/files/${id}`);
        mutate(`/api/${workspaceId}/files`);
    };

    const update = async (id: string, update: Partial<WSFile & Reorderable>) => {
        mutate(
            `/api/${workspaceId}/files`,
            (files: WSFile[]) => {
                files = files.map((file) => (file.id !== id ? file : { ...file, ...update }));
                if (update.reorder) {
                    const target = update.reorder.before || update.reorder.after;

                    let insertIndex = files.findIndex((file) => file.id === target);
                    const removeIndex = files.findIndex((file) => file.id === id);

                    if (insertIndex === -1 || removeIndex === -1) return files;
                    if (update.reorder.after) insertIndex++;

                    const file = files[removeIndex];
                    files.splice(removeIndex, 1);
                    files.splice(insertIndex, 0, file);
                }
                return files;
            },
            false,
        );
        await Axios.put(`/api/files/${id}`, update);
        mutate(`/api/${workspaceId}/files`);
    };

    return {
        cached,
        fetching,
        import: imp,
        delete: del,
        reset,
        song,
        upload,
        update,
        working: working.concat(jobs),
    };
};

export default useFileManager;

export const FileManagerContext = createContext<FileManager>(null as never);
