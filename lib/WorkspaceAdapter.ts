import Workspace, { WorkspaceState, PlayState } from "./Workspace";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import AudioGainPair from "./AudioGainPair";
import AudioGraph from "./AudioGraph";
import { Update, applyUpdate } from "./Utility";
import WorkspaceRetriever from "./WorkspaceRetriever";

const defaultWorkspace = {
    name: "workspace",
    files: [],
    state: {
        ambience: [],
        live: false,
        playing: null,
        queued: null,
        suggestions: [],
        users: [],
    },
};

export default class WorkspaceAdapter {
    private static _instance: WorkspaceAdapter | null = null;

    static instance(workspaceId: string, hook?: Dispatch<SetStateAction<Workspace>>): WorkspaceAdapter {
        if (this._instance?._workspace?.name !== workspaceId) {
            this._instance?.close();
            this._instance = null;
        }

        if (!this._instance) {
            this._instance = new WorkspaceAdapter(workspaceId, hook);
        }

        return this._instance;
    }

    public readonly retriever: WorkspaceRetriever;
    private _workspace: Workspace | null = null;
    private _graph: AudioGraph = AudioGraph.graph();

    constructor(workspaceId: string, private hook: Dispatch<SetStateAction<Workspace>> | null = null) {
        this.retriever = new WorkspaceRetriever(workspaceId);
        this.retriever.workspace().then((ws) => this._setWorkspace({ ...defaultWorkspace, ...ws }));
        this.retriever.addOnChangeHandler(async () => {
            if (!this._workspace) return;
            this._setWorkspace({
                ...this._workspace,
                ...(await this.retriever.workspace())
            });
        });
    }

    private _setWorkspace(ws: Workspace) {
        this._workspace = ws;
        this.hook?.(ws);
    }

    async close(): Promise<void> {
        this._graph.close();
        this.retriever.close();
    }

    setHook(hook: Dispatch<SetStateAction<Workspace>> | null): void {
        this.hook = hook;
    }

    updateMain(stateUpdate: Update<PlayState | null>): void {
        const newState = applyUpdate(this._workspace?.state.playing ?? null, stateUpdate);
        this._graph.playMain(newState, this.retriever);
    }

    updateAmbient(stateUpdates: Update<PlayState[]>): void {
        const newState = applyUpdate(this._workspace?.state.ambience ?? [], stateUpdates);
    }

    playSFX(sfx: PlayState): void {

    }
}

export function useWorkspace(workspaceName: string): [Workspace, Dispatch<SetStateAction<Workspace>>] {
    if (typeof window === "undefined") {
        return [
            defaultWorkspace,
            () => {
                throw new Error("setWorkspace called server-side");
            },
        ];
    }

    const [workspace, setWorkspace] = useState<Workspace>(defaultWorkspace);

    useEffect(() => {
        WorkspaceAdapter.instance(workspaceName, setWorkspace);
    }, []);

    // function setState(state: StateUpdate) {
    //     setWorkspace((oldWorkspace) => {
    //         let newState: WorkspaceState;
    //         if (typeof state === "function") {
    //             newState = state(oldWorkspace.state);
    //         } else {
    //             newState = Object.assign(oldWorkspace.state, state);
    //         }

    //         const newWs = {
    //             ...oldWorkspace,
    //             state: newState,
    //         };

    //         return newWs;
    //     });
    // }

    // TODO: deal with updating state when playing stuff from nowPlaying!!

    return [workspace, setWorkspace];
}
