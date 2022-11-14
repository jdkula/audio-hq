import { useMemo, useState } from 'react';
import { broadcastOut, BroadcastMessage, useIsCached } from './sw_client';
import ConvertOptions from './ConvertOptions';
import * as API from './api/models';
import {
    useCreateImportJob,
    useCreateUploadJob,
    useDeleteEntryMutation,
    useWorkspaceJobs,
    useWorkspaceEntries,
} from './api/hooks';
import { entryIsSingle } from './api/AudioHQApi';

export type FileManager = ReturnType<typeof useFileManager>;

export function useFileManager(workspaceId: string) {
    // <== State ==>
    const { data: filesData } = useWorkspaceEntries(workspaceId);
    const files = useMemo(() => filesData ?? [], [filesData]);
    const { data: jobsData } = useWorkspaceJobs(workspaceId);
    const jobs = useMemo(() => jobsData ?? [], [jobsData]);

    const uploadJob = useCreateUploadJob(workspaceId);
    const importJob = useCreateImportJob(workspaceId);

    const delFile = useDeleteEntryMutation(workspaceId);

    // URLs of files in this workspace
    const urls = useMemo(() => files.filter(entryIsSingle).map((f) => f.url), [files]);
    const cacheInfo = useIsCached(urls);

    // Load the cache info into two sets of URLs
    const { cached, caching } = useMemo(() => {
        const cached = new Set<string>();
        const caching = new Set<string>();
        for (const ci of cacheInfo) {
            if (ci.cached === 'cached') {
                cached.add(ci.url);
            } else if (ci.cached === 'loading') {
                caching.add(ci.url);
            }
        }
        return { cached, caching };
    }, [cacheInfo]);

    const [uploading, setUploading] = useState<string[]>([]);

    return {
        uploading,
        jobs,
        cached,
        caching,
        files,
        import: async (
            name: string,
            url: string,
            currentPath?: string[],
            description?: string,
            options?: ConvertOptions,
        ) => {
            const modifications: API.JobModification[] = [];
            if (options?.cut) {
                modifications.push({
                    type: 'cut',
                    startSeconds: options.cut.start,
                    endSeconds: options.cut.end,
                });
            }
            if (options?.fadeIn || options?.fadeOut) {
                modifications.push({
                    type: 'fade',
                    inSeconds: options.fadeIn ?? 0,
                    outSeconds: options.fadeOut ?? 0,
                });
            }

            const job = {
                name,
                description,
                path: currentPath,
                modifications: modifications,
                ordering: Number.POSITIVE_INFINITY,
            } as API.JobCreate;

            await importJob.mutateAsync({
                url: url,
                info: job,
            });
        },
        delete: async (entry: API.Entry) => {
            await delFile.mutateAsync({ entry });
        },
        download: (file: API.Single) => {
            broadcastOut?.postMessage({
                type: 'cache',
                urls: [file.url],
            } as BroadcastMessage);
        },
        upload: async (
            name: string,
            file: File,
            currentPath?: string[],
            description?: string,
            options?: ConvertOptions,
        ) => {
            const modifications: API.JobModification[] = [];
            if (options?.cut) {
                modifications.push({
                    type: 'cut',
                    startSeconds: options.cut.start,
                    endSeconds: options.cut.end,
                });
            }
            if (options?.fadeIn || options?.fadeOut) {
                modifications.push({
                    type: 'fade',
                    inSeconds: options.fadeIn ?? 0,
                    outSeconds: options.fadeOut ?? 0,
                });
            }

            const job = {
                name,
                description,
                path: currentPath,
                modifications: modifications,
                ordering: Number.POSITIVE_INFINITY,
            } as API.JobCreate;

            setUploading((uploading) => [...uploading, name]);

            try {
                await uploadJob.mutateAsync({ file, info: job });
            } finally {
                setUploading((uploading) => uploading.filter((upName) => upName !== name));
            }
        },
        downloadAll: async () => {
            console.log(
                'Downloading all. Uncached:',
                files.filter(entryIsSingle).filter((f) => !cached.has(f.url)),
            );
            broadcastOut?.postMessage({
                type: 'cache',
                urls: files.filter(entryIsSingle).map((f) => f.url),
            } as BroadcastMessage);
        },
    };
}
