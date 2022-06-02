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

const useFileManager = (() => {

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

        const [uploading, setUploading] = useState<string[]>([]);


        return {
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
                // TODO
                await delFile({ job: { file_id: id } });
            },
            track: (file: File_Minimum): string => {
                return file.download_url;
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
                // TODO
            },
        };
    };
})();

export default useFileManager;
