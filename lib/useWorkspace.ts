import { Workspace, WorkspaceUpdate, updatePlayState, File, WorkspaceState, WorkspaceResolver } from './Workspace';
import Axios from 'axios';
import useSWR from 'swr';
import Job from './Job';

interface WorkspaceHookResult {
    workspace: Workspace | null;
    loading: boolean;
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

const useFiles = (workspaceId: string): { files: File[]; changeFiles: () => void; loading: boolean } => {
    const { data, mutate } = useSWR<Workspace['files']>(`/api/${encodeURIComponent(workspaceId)}/files`, fetcher, {
        refreshInterval: 2000,
    });

    // TODO: Pusher.

    return { files: data ?? [], changeFiles: mutate, loading: data === undefined };
};

const useWorkspaceState = (
    workspaceId: string,
): { state: WorkspaceState | null; mutateState: (state: WorkspaceState) => void; loading: boolean } => {
    const { data, mutate } = useSWR<WorkspaceState>(`/api/${encodeURIComponent(workspaceId)}/state`, fetcher, {
        refreshInterval: 1000,
        refreshWhenHidden: true,
    });

    const mutateState = (state: WorkspaceState) => {
        mutate(state, false);
        Axios.post(`/api/${encodeURIComponent(workspaceId)}/state`, state).then((response) => mutate(response.data));
    };

    return { state: data ?? null, mutateState, loading: data === undefined };
};

export const useJobs = (workspaceId: string): { jobs: Job[]; mutateJobs: (jobs?: Job[]) => void } => {
    const jobs = useSWR<Workspace['jobs']>(`/api/${encodeURIComponent(workspaceId)}/jobs`, fetcher, {
        refreshInterval: 1000,
        refreshWhenHidden: true,
    });
    return { jobs: jobs.data ?? [], mutateJobs: jobs.mutate };
};

const useWorkspace = (workspaceId: string): WorkspaceHookResult => {
    const { files, loading: filesLoading } = useFiles(workspaceId);
    const { state, mutateState, loading: stateLoading } = useWorkspaceState(workspaceId);
    const { jobs } = useJobs(workspaceId);

    const resolve = async (update: WorkspaceUpdate) => {
        if (state === null) return;

        const copy: WorkspaceState = JSON.parse(JSON.stringify(state));
        copy.playing = updatePlayState(update.playing, copy.playing);

        if (update.ambience) {
            let updated = false;
            for (let i = 0; i < copy.ambience.length; i++) {
                if (copy.ambience[i].id === update.ambience.id) {
                    // both non-null, output will be non-null.
                    copy.ambience[i] = updatePlayState(update.ambience, copy.ambience[i])!;
                    updated = true;
                }
            }
            if (!updated) {
                const newState = updatePlayState(update.ambience, null);
                newState && copy.ambience.push(newState);
            }
        } else if (update.delAmbience) {
            copy.ambience = copy.ambience.filter((ps) => ps.id !== update.delAmbience);
        }

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
                      jobs: jobs,
                  },
        resolve,
        loading: stateLoading || filesLoading,
    };
};

export default useWorkspace;
