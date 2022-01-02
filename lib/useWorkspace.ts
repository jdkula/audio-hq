import {
    Workspace,
    WorkspaceUpdate,
    updatePlayState,
    File as WSFile,
    WorkspaceState,
    WorkspaceResolver,
    PlayState,
} from './Workspace';
import Axios from 'axios';
import useSWR from 'swr';
import Job from './Job';
import { createContext } from 'react';

interface CurrentFileInfo {
    file: WSFile;
    duration: number; // in s
    totalTimeBefore: number; // in s
}
interface WorkspaceHookResult {
    workspace: Workspace | null;
    getCurrentTrackFrom: (state: PlayState, idx?: number) => CurrentFileInfo | null;
    loading: boolean;
    resolve: WorkspaceResolver;
}

const fetcher = (url: string) => Axios.get(url).then((res) => res.data);

export const useFiles = (workspaceId: string): { files: WSFile[]; changeFiles: () => void; loading: boolean } => {
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
                if (copy.ambience[i].queue.every((id, idx) => id === update.ambience?.queue?.[idx])) {
                    // both non-null, output will be non-null.
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    copy.ambience[i] = updatePlayState(update.ambience, copy.ambience[i], copy.startVolume)!;
                    updated = true;
                }
            }
            if (!updated) {
                const newState = updatePlayState(update.ambience, null, copy.startVolume);
                newState && copy.ambience.push(newState);
            }
        } else if (update.delAmbience) {
            copy.ambience = copy.ambience.filter(
                (ps) => !ps.queue.every((id, idx) => id === update.delAmbience?.[idx]),
            );
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

    const getFile = (id: string) => {
        return files.find((f) => f.id === id) ?? null;
    };

    const allNonNull = <T>(list: (T | null)[]): list is T[] => {
        for (const x of list) {
            if (x === null) {
                return false;
            }
        }
        return true;
    };

    const getCurrentTrackFrom = (state: PlayState, idx?: number) => {
        // debugger;
        const files = state.queue.map(getFile);
        if (!allNonNull<WSFile>(files) || state.startTimestamp === null) {
            return null;
        }

        const totalTime = files.reduce((prev, cur) => prev + cur.length, 0); // in seconds
        const curTs = state.pauseTime ?? Date.now();
        const curDuration = ((curTs - state.startTimestamp) * state.speed) % (totalTime * 1000); // in ms
        let elapsed = 0;

        if (idx !== undefined) {
            if (idx < 0) return null;
            idx %= files.length;

            const totalTimeBefore = files.slice(0, idx).reduce((sum, f) => sum + f.length, 0) * 1000; // in ms
            const duration = (curDuration - totalTimeBefore) / 1000;
            return { file: files[idx], duration: duration, totalTimeBefore };
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const prevElapsed = elapsed;
            elapsed += file.length * 1000; // in ms
            if (curDuration < elapsed) {
                const duration = (curDuration - prevElapsed) / 1000;
                return { file, duration, totalTimeBefore: prevElapsed / 1000 };
            }
        }

        return null;
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
        getCurrentTrackFrom,
        loading: stateLoading || filesLoading,
    };
};

export default useWorkspace;

export type WorkspaceContextType = Workspace & { resolver: WorkspaceResolver } & {
    getCurrentTrackFrom: (state: PlayState, idx?: number) => CurrentFileInfo | null;
};
export const WorkspaceContext = createContext<WorkspaceContextType>(null as never);
