import { useState, useRef, useEffect } from 'react';
import { Workspace, WorkspaceUpdate, updatePlayState, File, WorkspaceState, WorkspaceResolver } from './Workspace';
import { WorkspaceRetriever } from './WorkspaceRetriever';
import Axios from 'axios';
import useSWR from 'swr';

interface WorkspaceHookResult {
    workspace: Workspace | null;
    loading: {
        files: LoadingDetail[];
        workspace: boolean;
    };
    resolve: WorkspaceResolver;
}

enum LoadingState {
    LOADING = 'LOADING',
    STORING = 'STORING',
    CACHED = 'CACHED',
}

interface LoadingDetail {
    fileId: string;
    state: LoadingState;
    progress: number;
}

const fetcher = (url: string) => Axios.get(url).then((res) => res.data);

const useFiles = (workspaceId: string): { files: File[]; changeFiles: () => {} } => {
    const { data, mutate } = useSWR<Workspace['files']>(`/api/${workspaceId}/files`, fetcher);

    // TODO: Pusher.

    return { files: data ?? [], changeFiles: mutate };
};

const useWorkspaceState = (
    workspaceId: string,
): { state: WorkspaceState | null; mutateState: (state: WorkspaceState) => void } => {
    const { data, mutate } = useSWR<WorkspaceState>(`/api/${workspaceId}/state`, fetcher, {
        refreshInterval: 1000,
        refreshWhenHidden: true,
    });

    const mutateState = (state: WorkspaceState) => {
        mutate(state, false);
        Axios.post(`/api/${workspaceId}/state`, state).then((response) => mutate(response.data));
    };

    return { state: data ?? null, mutateState };
};

const useWorkspace = (workspaceId: string): WorkspaceHookResult => {
    const { files, changeFiles } = useFiles(workspaceId);
    const { state, mutateState } = useWorkspaceState(workspaceId);

    const [filesLoading, setFilesLoading] = useState<LoadingDetail[]>([]);
    const [workspaceLoading, setWorkspaceLoading] = useState(true);

    const resolve = async (update: WorkspaceUpdate) => {
        if (state === null) return;

        const copy = { ...state };
        copy.playing = updatePlayState(update.playing, copy.playing);

        mutateState(copy);
    };

    return {
        workspace:
            state === null
                ? null
                : {
                      files: files,
                      state: state,
                      name: workspaceId,
                  },
        loading: {
            files: filesLoading,
            workspace: workspaceLoading,
        },
        resolve,
    };
};

export default useWorkspace;
