// import { Workspace, WorkspaceState, PlayState } from './Workspace';
// import { useState, useEffect, SetStateAction, Dispatch } from 'react';
// import { AudioGainPair } from './AudioGainPair';
// import { AudioGraph } from './AudioGraph';
// import { applyUpdate } from './Utility';
// import { WorkspaceRetriever } from './WorkspaceRetriever';

// const defaultWorkspace = {
//     name: 'workspace',
//     files: [],
//     state: {
//         ambience: [],
//         live: false,
//         playing: null,
//         queued: null,
//         suggestions: [],
//         users: [],
//     },
// };

// export class WorkspaceAdapter {
//     private static _instance: WorkspaceAdapter | null = null;

//     static instance(workspaceId: string, hook?: Dispatch<SetStateAction<Workspace>>): WorkspaceAdapter {
//         if (this._instance?._workspace?.name !== workspaceId) {
//             this._instance?.close();
//             this._instance = null;
//         }

//         if (!this._instance) {
//             this._instance = new WorkspaceAdapter(workspaceId, hook);
//         }

//         return this._instance;
//     }

//     public readonly graph: AudioGraph = AudioGraph.graph();
//     public readonly retriever: WorkspaceRetriever;
//     private _workspace: Workspace;

//     private _timestampHandle: number;
//     private _currentTime: number = 0;
//     private _currentDuration: number = 0;

//     constructor(workspaceId: string, private hook: Dispatch<SetStateAction<Workspace>> | null = null) {
//         this._workspace = { ...defaultWorkspace, name: workspaceId };
//         this.retriever = new WorkspaceRetriever(workspaceId);
//         this.retriever.workspace().then((ws) => this._setWorkspace({ ...defaultWorkspace, ...ws }));
//         this.retriever.addOnChangeHandler(async () => {
//             if (!this._workspace) return;
//             this._setWorkspace({
//                 ...this._workspace,
//                 ...(await this.retriever.workspace()),
//             });
//         });

//         this._timestampHandle = window.setInterval(() => {
//             if (!this._workspace.state.playing) return;
//             this._currentTime = this.graph.main.player(0)?.seek() ?? 0;
//             this._currentDuration = this.graph.main.player(0)?.duration ?? 0;
//             this._workspace.state.playing.timestamp = this._currentTime;
//             this._setWorkspace(JSON.parse(JSON.stringify(this._workspace)));
//         }, 500);
//     }

//     get mainDuration(): number {
//         return this._currentDuration;
//     }

//     private _setWorkspace(ws: Workspace): void {
//         this._workspace = JSON.parse(JSON.stringify(ws));
//         this.hook?.(this._workspace);
//     }

//     get workspace(): Workspace {
//         return this._workspace;
//     }

//     async close(): Promise<void> {
//         this.graph.close();
//         this.retriever.close();
//         window.clearInterval(this._timestampHandle);
//         WorkspaceAdapter._instance = null;
//     }

//     setHook(hook: Dispatch<SetStateAction<Workspace>> | null): void {
//         this.hook = hook;
//     }

//     async updateMain(stateUpdate: Partial<PlayState | null>): Promise<void> {
//         const newState = applyUpdate(this._workspace.state.playing, stateUpdate, {
//             fileId: null,
//             id: '',
//             paused: true,
//             timestamp: null,
//             volume: 1,
//         });
//         await this.graph.playMain(stateUpdate, this.retriever);
//         this._workspace.state.playing = newState;
//         this._setWorkspace(this._workspace);
//     }

//     updateAmbient(stateUpdates: Partial<PlayState>[], full = false): void {}

//     playSFX(sfx: PlayState): void {}
// }

// export function useWorkspace(workspaceName: string): [Workspace, Dispatch<SetStateAction<Workspace>>] {
//     if (typeof window === 'undefined') {
//         return [
//             defaultWorkspace,
//             () => {
//                 throw new Error('setWorkspace called server-side');
//             },
//         ];
//     }

//     const [workspace, setWorkspace] = useState<Workspace>(defaultWorkspace);

//     useEffect(() => {
//         WorkspaceAdapter.instance(workspaceName, setWorkspace);
//     }, []);

//     // function setState(state: StateUpdate) {
//     //     setWorkspace((oldWorkspace) => {
//     //         let newState: WorkspaceState;
//     //         if (typeof state === "function") {
//     //             newState = state(oldWorkspace.state);
//     //         } else {
//     //             newState = Object.assign(oldWorkspace.state, state);
//     //         }

//     //         const newWs = {
//     //             ...oldWorkspace,
//     //             state: newState,
//     //         };

//     //         return newWs;
//     //     });
//     // }

//     // TODO: deal with updating state when playing stuff from nowPlaying!!

//     return [workspace, setWorkspace];
// }
