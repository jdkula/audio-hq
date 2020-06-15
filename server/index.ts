import express from "express";
import bodyParser from "body-parser";
import io from "socket.io";
import PouchDB from "pouchdb";
import {convert, download} from "./lib/processor";

import Multer from "multer";

const db = new PouchDB("workspaces");
db.sync("http://admin:admin@localhost:5984/workspace").catch(e => console.error(e))

const app = express();

const multer = Multer({
    storage: Multer.memoryStorage()
});

app.use(bodyParser.json());
app.use(bodyParser.text());

app.post("/:ws/download", async (req, res) => {
    const filepath = await download(req.body)
    const ws = req.params.ws;

    let doc;
    try {
        doc = await db.get<{files: string[]}>(ws)
        doc.files.push(filepath);
    } catch (e) {
        doc = {
            _id: ws,
            files: [filepath]
        }
    }

    await db.put(doc);

    res.status(200).send({done: true, path: filepath, ws: doc});
})


app.post("/:ws/import", multer.single("upload"), async (req, res) => {
    const file = req.file;
    const filepath = await convert(file.buffer);
    const ws = req.params.ws;

    let doc;
    try {
        doc = await db.get<{files: string[]}>(ws)
        doc.files.push(filepath);
    } catch (e) {
        doc = {
            _id: ws,
            files: [filepath]
        }
    }

    await db.put(doc);

    res.status(200).send({done: true, path: filepath, ws: doc});
})

app.listen(3001);
