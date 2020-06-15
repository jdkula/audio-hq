import express from "express";
import bodyParser from "body-parser";
import PouchDB from "pouchdb";
import { convert, download } from "./lib/processor";
import fs from "promise-fs";
import cors from "cors";

import path from "path";

import { StoredWorkspace, File } from "./../lib/Workspace";

import Multer from "multer";

const db = new PouchDB("http://admin:admin@localhost:5984/workspace");

const app = express();

const multer = Multer({
    storage: Multer.diskStorage({
        destination: path.resolve(process.cwd(), "download"),
    }),
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.post("/:ws/download", async (req, res) => {
    if (!req.body.url || !req.body.name) {
        res.status(400).send("Invalid body.");
        return;
    }

    const filepath = await download(req.body.url);
    const ws = req.params.ws;

    const id = path.basename(filepath, ".mp3");

    const file: File = {
        id: id,
        name: req.body.name,
        path: "/",
        type: "audio",
    };

    let doc;
    try {
        doc = await db.get<StoredWorkspace>(ws);
        doc.files.push(file);
    } catch (e) {
        doc = {
            _id: ws,
            name: ws,
            files: [file],
        };
    }

    await db.put(doc);

    res.status(200).send({ done: true, path: filepath, ws: doc });
});

app.post("/:ws/import", multer.single("upload"), async (req, res) => {
    const file = req.file;
    const filepath = await convert(file.path);
    const ws = req.params.ws;
    const id = path.basename(filepath, ".mp3");

    const wsfile: File = {
        id: id,
        name: req.body.name || file.originalname,
        path: "/",
        type: "audio",
    };

    let doc;
    try {
        doc = await db.get<StoredWorkspace>(ws);
        doc.files.push(wsfile);
    } catch (e) {
        doc = {
            _id: ws,
            name: ws,
            files: [wsfile],
        };
    }

    await db.put(doc);

    res.status(200).send({ done: true, path: filepath, ws: doc });
});

app.get("/download/:id", (req, res) => {
    if (!/[-0-9A-Fa-f]/.test(req.params.id)) {
        res.status(400).send("Bad ID");
        return;
    }
    res.sendFile(
        req.params.id + ".mp3",
        {
            root: path.resolve(process.cwd(), "storage"),
            dotfiles: "deny",
        },
        (err) => {
            if (err) {
                res.status(404).end("File not found.");
            }
        },
    );
});

async function verifyAllFiles() {
    const allWorkspaces = await db.allDocs<StoredWorkspace>({
        include_docs: true,
    });

    const base = path.resolve(process.cwd(), "storage");
    const changes = new Map<string, PouchDB.Core.ExistingDocument<StoredWorkspace>>();

    for (const row of allWorkspaces.rows) {
        if (!row.doc) {
            throw new Error("Didn't do the thing!");
        }
        for (const file of row.doc.files || []) {
            try {
                await fs.access(path.resolve(base, file.id + ".mp3"));
            } catch (e) {
                // can't access file for whatever reason.
                if (!changes.has(row.id)) {
                    changes.set(row.id, JSON.parse(JSON.stringify(row.doc)));
                }
                const toRemove = changes.get(row.id)!;
                const idx = toRemove.files.findIndex((f: File) => f.id === file.id);
                toRemove.files.splice(idx, 1);
                changes.set(row.id, toRemove);
                console.log("Removing file", file.id, "from workspace", row.doc.name);
            }
        }
    }

    for (const id of changes.keys()) {
        await db.put(changes.get(id)!);
    }
}

verifyAllFiles().then(() => app.listen(3001));
