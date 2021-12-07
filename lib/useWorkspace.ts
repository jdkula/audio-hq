import { Workspace, WorkspaceUpdate, updatePlayState, File, WorkspaceState, WorkspaceResolver } from './Workspace';
import Axios from 'axios';
import useSWR from 'swr';
import Job from './Job';
import { createContext } from 'react';

interface WorkspaceHookResult {
    workspace: Workspace | null;
    loading: boolean;
    resolve: WorkspaceResolver;
}

const fetcher = (url: string) => Axios.get(url).then((res) => res.data);

export const useFiles = (workspaceId: string): { files: File[]; changeFiles: () => void; loading: boolean } => {
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
        refreshWhenOffline: true,
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
        copy.playing = updatePlayState(update.playing, copy.playing, copy.startVolume);
        copy.startVolume = copy.playing?.volume ?? copy.startVolume ?? 1;

        if (update.ambience) {
            let updated = false;
            for (let i = 0; i < copy.ambience.length; i++) {
                if (copy.ambience[i].id === update.ambience.id) {
                    // both non-null, output will be non-null.
                    copy.ambience[i] = updatePlayState(update.ambience, copy.ambience[i], copy.startVolume)!;
                    updated = true;
                }
            }
            if (!updated) {
                const newState = updatePlayState(update.ambience, null, copy.startVolume);
                newState && copy.ambience.push(newState);
            }
        } else if (update.delAmbience) {
            copy.ambience = copy.ambience.filter((ps) => ps.id !== update.delAmbience);
        }

        if (update.sfx !== undefined) {
            copy.sfx.sfx = updatePlayState(update.sfx, update.sfxMerge ? copy.sfx.sfx : null, copy.startVolume);
            if (!update.sfxMerge) {
                copy.sfx.triggerTimestamp = Date.now();
                copy.sfx.timeoutTimestamp = copy.sfx.triggerTimestamp + 10 * 1000;
            }
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

export type WorkspaceContextType = Workspace & { resolver: WorkspaceResolver };
export const WorkspaceContext = createContext<WorkspaceContextType>(null as never);
