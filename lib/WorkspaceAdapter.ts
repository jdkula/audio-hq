import Workspace, { StoredWorkspace, WorkspaceState } from "./Workspace";
import PouchDB from "pouchdb";
import { useState, useEffect } from "react";
import AudioGraph from "./AudioGraph";

export default class WorkspaceAdapter {
    private readonly db: PouchDB.Database;
    private readonly onChange: (() => void)[] = [];

    constructor(private readonly _workspace: string) {
        this.db = new PouchDB(_workspace);

        this.db
            .sync("http://admin:admin@localhost:5984/workspace", {
                live: true,
                retry: true,
                doc_ids: [_workspace],
            })
            .on("change", () => {
                for (const f of this.onChange) {
                    if (f && typeof f === "function") {
                        f();
                    }
                }
            });
    }

    async workspace(): Promise<StoredWorkspace> {
        try {
            return await this.db.get<StoredWorkspace>(this._workspace);
        } catch (e) {
            await this.db.put<StoredWorkspace>({
                files: [],
                name: this._workspace,
                _id: this._workspace,
            });

            return await this.db.get<StoredWorkspace>(this._workspace);
        }
    }

    addOnChangeHandler(onChange: () => void): void {
        this.onChange.push(onChange);
    }

    removeOnChangeHandler(onChange: () => void): void {
        const idx = this.onChange.findIndex(onChange);
        if (idx === -1) return;

        this.onChange.splice(idx, 1);
    }
}

export type StateUpdate = Partial<WorkspaceState> | ((ws: WorkspaceState) => WorkspaceState);

export function useWorkspace(workspaceName: string): [Workspace, (state: StateUpdate) => void] {
    const defaultWorkspace = {
        name: workspaceName,
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

    if (typeof window === "undefined") {
        console.warn("RETURNING DEFAULT WORKSPACE");
        return [defaultWorkspace, () => {}];
    }

    const [workspace, setWorkspace] = useState<Workspace>(defaultWorkspace);

    const adapter = new WorkspaceAdapter(workspace.name);

    useEffect(() => {
        adapter.addOnChangeHandler(async () => {
            const ws = await adapter.workspace();
            setWorkspace((oldWorkspace) => ({
                state: oldWorkspace.state,
                ...ws,
            }));
        });

        adapter.workspace().then((ws) => {
            setWorkspace((oldWorkspace) => ({
                state: oldWorkspace.state,
                ...ws,
            }));
        });
    }, []);

    function setState(state: StateUpdate) {
        setWorkspace((oldWorkspace) => {
            let newState: WorkspaceState;
            if (typeof state === "function") {
                newState = state(oldWorkspace.state);
            } else {
                newState = Object.assign(oldWorkspace.state, state);
            }

            const newWs = {
                ...oldWorkspace,
                state: newState,
            };

            setWorkspace(newWs);
        });
    }

    // TODO: deal with updating state when playing stuff from nowPlaying!!

    return [workspace, setState];
}
