import { StoredWorkspace } from "./Workspace";
import PouchDB from "pouchdb";
import axios from "axios";
export default class WorkspaceRetriever {
    private readonly db: PouchDB.Database;
    private readonly cache: PouchDB.Database;
    private readonly onChange: (() => void)[] = [];

    constructor(private readonly _workspaceId: string) {
        this.db = new PouchDB("workspace");
        this.cache = new PouchDB("cache");

        this.db
            .sync("http://admin:admin@localhost:5984/workspace", {
                live: true,
                retry: true,
                doc_ids: [_workspaceId],
            })
            .on("change", () => {
                for (const f of this.onChange) {
                    if (f && typeof f === "function") {
                        f();
                    }
                }
            });
    }

    close(): void {
        this.db.close();
        this.cache.close();
    }

    async workspace(): Promise<StoredWorkspace> {
        try {
            return await this.db.get<StoredWorkspace>(this._workspaceId);
        } catch (e) {
            await this.db.put<StoredWorkspace>({
                files: [],
                name: this._workspaceId,
                _id: this._workspaceId,
            });

            return await this.db.get<StoredWorkspace>(this._workspaceId);
        }
    }

    async song(id: string): Promise<Blob> {
        try {
            const data = await this.cache.getAttachment(id, "file");
            return data as Blob; // client only.
        } catch (e) {
            const resp = await axios.get("http://localhost:3001/download/" + id, {
                responseType: "arraybuffer",
            });
            const blob = new Blob([resp.data]);
            await this.cache.put({
                _id: id,
                _attachments: {
                    file: {
                        content_type: "audio/mp3",
                        data: blob,
                    },
                },
            });
            return blob;
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
