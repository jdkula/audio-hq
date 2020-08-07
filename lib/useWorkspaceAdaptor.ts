import { useAudioGraph, AudioGraph } from './AudioGraph';
import { useState, useRef, useEffect } from 'react';
import { Workspace, PlayState } from './Workspace';
import { WorkspaceRetriever } from './WorkspaceRetriever';

interface WorkspaceHookResult {
    graph: AudioGraph | null;
    files: Workspace['files'];
    state: Workspace['state'] | null;
    loading: {
        files: LoadingDetail[];
        workspace: boolean;
    };
    updateMain: (playState: Partial<PlayState | null>) => void | Promise<void>;
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
        files: workspaceFiles,
        state: workspaceState,
        loading: {
            files: filesLoading,
            workspace: workspaceLoading,
        },
        updateMain: async (state) => {
            if (!retriever.current || workspaceLoading || !graph || !workspaceState) return;

            const nowPlaying: PlayState =
                state === null
                    ? null
                    : workspaceState.playing === null && !state.id
                    ? null
                    : workspaceState.playing === null
                    ? {
                          fileId: null,
                          id: state.id,
                          paused: true,
                          timestamp: 0,
                          volume: 0,
                      }
                    : {
                          ...workspaceState.playing,
                          ...state,
                      };

            setState({
                ...workspaceState,
                playing: nowPlaying,
            });

            await graph.playMain(state, retriever.current);
        },
    };
};

export default useWorkspaceAdaptor;
