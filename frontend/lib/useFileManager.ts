import _ from 'lodash';
import PouchDB from 'pouchdb';
import { useCallback, useEffect, useState } from 'react';
import ConvertOptions from './ConvertOptions';
import {
    WorkspaceFilesQuery,
    WorkspaceJobsSubscription,
    useAddJobMutation,
    useDeleteFileMutation,
    useWorkspaceFilesQuery,
    useWorkspaceJobsSubscription,
} from './generated/graphql';
import { File_Minimum } from './graphql_type_helper';

export type FileManager = ReturnType<typeof useFileManager>;

async function* readBody(body: ReadableStream<Uint8Array>) {
    const reader = body.getReader();
    while (true) {
        const next = await reader.read();
        if (next.done) break;
        yield next;
    }
    reader.releaseLock();
}

const useFileManager = (() => {
    // <== Static Variables ==>
    let cache = new PouchDB('cache');
    const fetchCallbacks = new Map<string, Array<(track: Blob) => void>>();

    // <== Static Functions ==>

    function addFetchCallback(id: string, cb: (track: Blob) => void) {
        const arr = fetchCallbacks.get(id) ?? [];
        arr.push(cb);
        fetchCallbacks.set(id, arr);
    }

    return (workspaceId: string) => {
        // <== State ==>
        const [filesData] = useWorkspaceFilesQuery({ variables: { workspaceId } });
        const [jobsData] = useWorkspaceJobsSubscription({ variables: { workspaceId } });

        const [, addJob] = useAddJobMutation();
        const [, delFile] = useDeleteFileMutation();

        const files = new Map<string, WorkspaceFilesQuery['file'][number]>(
            (filesData.data?.file ?? []).map((file) => [file.id, { ...file }]),
        );
        const jobs = new Map<string, WorkspaceJobsSubscription['job'][number]>(
            (jobsData.data?.job ?? []).map((job) => [job.id, job]),
        );

        const [cached, setCached] = useState<string[]>([]);
        const [fetching, setFetching] = useState<{ id: string; progress: number }[]>([]);
        const [uploading, setUploading] = useState<string[]>([]);

        // <== Private Functions ==>

        const reset = useCallback(async () => {
            await cache.destroy();
            cache = new PouchDB('cache');
            setCached([]);
        }, []);

        const updateFetching = (id: string, progress: number) => {
            setFetching((fetching) => fetching.map((v) => (v.id === id ? { ...v, progress } : v)));
        };

        const retrieveFile = async (fileId: string, url: string) => {
            setFetching((fetching) => [...fetching, { id: fileId, progress: 0 }]);
            const resp = await fetch(url, {
                headers: {
                    Accept: 'audio/ogg',
                },
            });

            if (!resp || !resp.body) throw new Error(JSON.stringify(resp));

            const bytes = parseInt(resp.headers.get('Content-Length') ?? '1');
            let read = 0;
            let lastNotified = 0;
            const data: Uint8Array[] = [];
            for await (const chunk of readBody(resp.body)) {
                read += chunk.value.length;
                data.push(chunk.value);
                if (Date.now() - lastNotified > 250) {
                    // only update every quarter second
                    updateFetching(fileId, read / bytes);
                    lastNotified = Date.now();
                }
            }

            const blob = new Blob(data, { type: 'audio/ogg' });

            fetchCallbacks.get(fileId)?.forEach((callback) => callback(blob));
            fetchCallbacks.delete(fileId);

            return blob;
        };

        const cacheFile = async (fileId: string, blob: Blob) => {
            try {
                await cache.put({
                    _id: fileId,
                    workspace: workspaceId,
                    _attachments: {
                        file: {
                            content_type: 'audio/ogg',
                            data: blob,
                        },
                    },
                });
            } catch (e: unknown) {
                console.warn(e);
                return;
            }
            setCached((cached) => [...cached, fileId]);
            setFetching((fetching) => fetching.filter((v) => v.id !== fileId));
        };

        // <== Data Effects ==>

        useEffect(() => {
            if (window.localStorage.getItem('__AHQ_CACHE_VERSION') !== 'v1.1') {
                reset().then(() => {
                    window.localStorage.setItem('__AHQ_CACHE_VERSION', 'v1.1');
                    window.location.reload();
                });
            } else {
                cache
                    .allDocs()
                    .then((docs) => setCached((cached) => _.uniq([...cached, ...docs.rows.map((row) => row.id)])));
            }
        }, [reset]);

        return {
            cached,
            fetching,
            uploading,
            jobs,
            import: async (
                name: string,
                url: string,
                currentPath?: string[],
                description?: string,
                options?: ConvertOptions,
            ) => {
                await addJob({
                    job: {
                        name,
                        description,
                        options,
                        url,
                        file_upload: null,
                        path: currentPath,
                        workspace_id: workspaceId,
                    },
                });
            },
            delete: async (id: string) => {
                try {
                    const orig = await cache.get(id);
                    await cache.remove({ _id: id, _rev: orig._rev });
                } catch (e) {
                    // ignore
                }
                setCached((cached) => cached.filter((oid) => oid !== id));
                await delFile({ job: { file_id: id } });
            },
            reset,
            track: (file: File_Minimum): { remoteUrl: string; data: () => Promise<Blob> } => {
                const inflight = fetchCallbacks.has(file.id);

                if (inflight) {
                    const promise = new Promise<Blob>((resolve) => addFetchCallback(file.id, resolve));
                    return {
                        remoteUrl: file.download_url,
                        data: () => promise,
                    };
                } else {
                    const promise = cache
                        .getAttachment(file.id, 'file')
                        .then((data) => {
                            setCached((cached) => [...cached, file.id]);
                            fetchCallbacks.get(file.id)?.forEach((cb) => cb(data as Blob));
                            fetchCallbacks.delete(file.id);
                            return data as Blob;
                        })
                        .catch(() =>
                            retrieveFile(file.id, file.download_url).then((blob) => {
                                cacheFile(file.id, blob);
                                return blob;
                            }),
                        );
                    return {
                        remoteUrl: file.download_url,
                        data: () => promise,
                    };
                }
            },
            upload: async (
                name: string,
                file: File,
                currentPath?: string[],
                description?: string,
                options?: ConvertOptions,
            ) => {
                const base64 = await new Promise<string>((resolve, reject) => {
                    const fr = new FileReader();
                    fr.onload = () => {
                        resolve(fr.result as string);
                    };
                    fr.onerror = (e) => {
                        reject(e);
                    };
                    fr.readAsDataURL(file);
                });

                const job = {
                    name,
                    description,
                    options,
                    url: null,
                    file_upload: base64,
                    path: currentPath,
                    workspace_id: workspaceId,
                };

                setUploading((uploading) => [...uploading, name]);

                try {
                    await addJob({ job });
                } finally {
                    setUploading((uploading) => uploading.filter((upName) => upName !== name));
                }
            },
            downloadAll: async (
                onStart?: (cached: number, total: number) => void,
                onProgress?: (started: number, finished: number) => void,
            ) => {
                console.log('Downloading all songs...');
                console.log('Already cached ', cached.length, 'of', files.size, 'total');
                onStart?.(cached.length, files.size);

                const max = files.size - cached.length;
                const progress = { started: 0, finished: 0, total: max };

                for (const [, file] of files) {
                    if (!cached.includes(file.id)) {
                        console.log('Downloading', file.name, `(${file.id})`);
                        progress.started++;
                        onProgress?.(progress.started, progress.finished);
                        await cacheFile(file.id, await retrieveFile(file.id, file.download_url));
                    }
                }
                console.log('Done.');
            },
        };
    };
})();

export default useFileManager;
