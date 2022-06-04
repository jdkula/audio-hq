import { useMemo, useState } from 'react';
import { broadcastOut, BroadcastMessage, useIsCached } from './sw_client';
import ConvertOptions from './ConvertOptions';
import {
    useAddJobMutation,
    useDeleteFileMutation,
    useWorkspaceFilesQuery,
    useWorkspaceJobsSubscription,
    Deck_Type_Enum_Enum,
    useDecksQuery,
    useFileEventsSubscription,
    useDeckEventsSubscription,
} from './generated/graphql';
import { Deck_Minimum, File_Minimum } from './urql/graphql_type_helper';

export type FileManager = ReturnType<typeof useFileManager>;

export function useFileManager(workspaceId: string) {
    // <== Subscription ==>
    useFileEventsSubscription({ variables: { workspaceId } });

    // <== State ==>
    const [filesData] = useWorkspaceFilesQuery({ variables: { workspaceId } });
    const [jobsData] = useWorkspaceJobsSubscription({ variables: { workspaceId } });

    const [, addJob] = useAddJobMutation();
    const [, delFile] = useDeleteFileMutation();

    // List of jobs currently in progress in the workspace
    const jobs = useMemo(() => jobsData.data?.job ?? [], [jobsData.data?.job]);

    // Files in this workspace
    const files = useMemo(() => filesData.data?.file ?? [], [filesData.data?.file]);

    // URLs of files in this workspace
    const urls = useMemo(() => files.map((f) => f.download_url), [files]);
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
            await addJob({
                job: {
                    name,
                    description,
                    option_cut_start: options?.cut?.start ?? null,
                    option_cut_end: options?.cut?.end ?? null,
                    option_fade_in: options?.fadeIn ?? null,
                    option_fade_out: options?.fadeOut ?? null,
                    url,
                    file_upload: null,
                    path: currentPath,
                    workspace_id: workspaceId,
                },
            });
        },
        delete: async (id: string) => {
            await delFile({ job: { file_id: id } });
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
                option_cut_start: options?.cut?.start ?? null,
                option_cut_end: options?.cut?.end ?? null,
                option_fade_in: options?.fadeIn ?? null,
                option_fade_out: options?.fadeOut ?? null,
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
        downloadAll: async () => {
            broadcastOut.postMessage({
                type: 'cache',
                urls: [...files.values()].map((f) => f.download_url),
            } as BroadcastMessage);
        },
    };
}

export function useWorkspaceDecks(workspaceId: string): {
    main: Deck_Minimum | null;
    ambience: Deck_Minimum[];
    sfx: Deck_Minimum[];
} {
    useDeckEventsSubscription({
        variables: { workspaceId: workspaceId },
    });

    const [{ data: statusData }] = useDecksQuery({
        variables: { workspaceId },
    });

    const main = statusData?.workspace_by_pk?.decks.filter((x) => x.type === Deck_Type_Enum_Enum.Main)[0] ?? null;
    const ambience = statusData?.workspace_by_pk?.decks.filter((x) => x.type === Deck_Type_Enum_Enum.Ambience) ?? [];
    const sfx = statusData?.workspace_by_pk?.decks.filter((x) => x.type === Deck_Type_Enum_Enum.Sfx) ?? [];

    return { main, ambience, sfx };
}
