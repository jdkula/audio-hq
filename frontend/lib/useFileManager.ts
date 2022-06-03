import { createContext, useMemo, useState } from 'react';
import { broadcastOut, BroadcastMessage, useIsCached } from './sw_client';
import ConvertOptions from './ConvertOptions';
import {
    WorkspaceJobsSubscription,
    useAddJobMutation,
    useDeleteFileMutation,
    useWorkspaceFilesQuery,
    useWorkspaceJobsSubscription,
} from './generated/graphql';
import { File_Minimum } from './graphql_type_helper';
import { nonNull } from './utility';

export type FileManager = ReturnType<typeof useFileManager>;

const useFileManager = (() => {
    return (workspaceId: string) => {
        // <== State ==>
        const [filesData] = useWorkspaceFilesQuery({ variables: { workspaceId } });
        const [jobsData] = useWorkspaceJobsSubscription({ variables: { workspaceId } });

        const [, addJob] = useAddJobMutation();
        const [, delFile] = useDeleteFileMutation();

        const files = useMemo(() => filesData.data?.file ?? [], [filesData.data?.file]);
        const urls = useMemo(() => files.map((f) => f.download_url), [files]);
        const jobs = useMemo(
            () =>
                new Map<string, WorkspaceJobsSubscription['job'][number]>(
                    (jobsData.data?.job ?? []).map((job) => [job.id, job]),
                ),
            [jobsData.data?.job],
        );
        const cacheInfo = useIsCached(urls, /* useBulk = */ true);
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
                // TODO
                await delFile({ job: { file_id: id } });
            },
            track: (file: File_Minimum): string => {
                return file.download_url;
            },
            download: (file: File_Minimum) => {
                broadcastOut.postMessage({
                    type: 'cache',
                    urls: [file.download_url],
                } as BroadcastMessage);
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
                broadcastOut.postMessage({
                    type: 'cache',
                    urls: [...files.values()].map((f) => f.download_url),
                } as BroadcastMessage);
            },
        };
    };
})();

export default useFileManager;

export const FileManagerContext = createContext<FileManager>(null as never);
