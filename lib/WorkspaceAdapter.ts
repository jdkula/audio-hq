import Workspace, { StoredWorkspace } from "./Workspace";
import PouchDB from "pouchdb";
import { useState } from "react";
import AudioGraph from "./AudioGraph";

export default class WorkspaceAdapter {
    private readonly db: PouchDB.Database;
    private readonly onChange: (() => void)[] = [];

    constructor(private readonly _workspace: Workspace) {
        this.db = new PouchDB(_workspace.name);

        this.db
            .sync("http://admin:admin@localhost:5984/workspaces", {
                live: true,
                retry: true,
                doc_ids: [_workspace.name],
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
        const ws = await this.db.get<StoredWorkspace>(this._workspace.name);

        return ws;
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

export function useWorkspace(workspaceName: string): Workspace {
    const [workspace, setWorkspace] = useState<Workspace>({
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
    });

    const [adapter] = useState<WorkspaceAdapter>(new WorkspaceAdapter(workspace));

    adapter.addOnChangeHandler(async () => {
        setWorkspace({
            state: workspace.state,
            ...(await adapter.workspace()),
        });
    });

    adapter.workspace().then((ws) => {
        setWorkspace({
            state: workspace.state,
            ...ws,
        });
    });

    const graph = AudioGraph.graph(workspace, setWorkspace);

    // TODO: deal with updating state when playing stuff from nowPlaying!!

    return [workspace, graph];
}
