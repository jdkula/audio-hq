import { useAudioGraph, AudioGraph } from './AudioGraph';
import { useState, useRef, useEffect } from 'react';
import { Workspace, PlayState, WorkspaceState, WorkspaceUpdate, updatePlayState } from './Workspace';
import { WorkspaceRetriever } from './WorkspaceRetriever';
import { AudioSet } from './AudioSet';

interface WorkspaceHookResult {
    graph: AudioGraph | null;
    workspace: Workspace | null;
    loading: {
        files: LoadingDetail[];
        workspace: boolean;
    };
    resolve: (update: WorkspaceUpdate) => Promise<void>;
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

const useWorkspaceAdaptor = (workspaceId: string): WorkspaceHookResult => {
    const graph = useAudioGraph();
    const [workspaceFiles, setFiles] = useState<Workspace['files']>([]);
    const [workspaceState, setState] = useState<Workspace['state'] | null>(null);
    const [filesLoading, setFilesLoading] = useState<LoadingDetail[]>([]);
    const [workspaceLoading, setWorkspaceLoading] = useState(true);

    const retriever = useRef<WorkspaceRetriever>();

    const updateTimeHandler = useRef<number | null>(null);

    useEffect(() => {
        setWorkspaceLoading(true);
        retriever.current = new WorkspaceRetriever(workspaceId);

        (async () => {
            if (!retriever.current) return;

            setState(await retriever.current.state());
            setFiles(await retriever.current.files());
            setWorkspaceLoading(false);
        })();
    }, [workspaceId]);

    return {
        graph,
        workspace:
            workspaceState === null
                ? null
                : {
                      files: workspaceFiles,
                      state: workspaceState,
                      name: workspaceId,
                  },
        loading: {
            files: filesLoading,
            workspace: workspaceLoading,
        },
        resolve: async (update) => {
            if ((window as any).__WORKING) return;
            if (!retriever.current || !workspaceState) return;
            (window as any).__WORKING = true;

            await graph?.resolve(update, retriever.current);

            const copy = { ...workspaceState };
            copy.playing = updatePlayState(update.playing, copy.playing);

            setState(copy);
            (window as any).__WORKING = false;
        },
    };
};

export default useWorkspaceAdaptor;
