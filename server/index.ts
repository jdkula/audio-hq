import express from "express";
import bodyParser from "body-parser";
import io from "socket.io";
import PouchDB from "pouchdb";
import {convert, download} from "./lib/processor";

import Workspace, { StoredWorkspace, File } from "./../lib/Workspace";

import Multer from "multer";

const db = new PouchDB("workspace");
db.sync("http://admin:admin@localhost:5984/workspace", {live: true, retry: true}).catch(e => console.error(e))

const app = express();

const multer = Multer({
    storage: Multer.memoryStorage()
});

app.use(bodyParser.json());
app.use(bodyParser.text());

app.post("/:ws/download", async (req, res) => {
    const filepath = await download(req.body)
    const ws = req.params.ws;

    const file: File = {
        id: filepath,
        name: filepath,
        path: filepath,
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
    const filepath = await convert(file.buffer);
    const ws = req.params.ws;

    const wsfile: File = {
        id: filepath,
        name: filepath,
        path: filepath,
        type: "audio",
    };

    let doc;
    try {
        doc = await db.get<StoredWorkspace>(ws)
        doc.files.push(wsfile);
    } catch (e) {
        doc = {
            _id: ws,
            name: ws,
            files: [wsfile],
        };
    }

    await db.put(doc);

    res.status(200).send({done: true, path: filepath, ws: doc});
})

app.listen(3001);
