import { NextApiHandler } from "next";
import path from "path";
import { download } from "~/lib/processor";
import { File, StoredWorkspace } from "~/lib/Workspace";

const Download: NextApiHandler = async (req, res) => {
    if (!req.body.url || !req.body.name) {
        res.status(400).send("Invalid body.");
        return;
    }

    const filepath = await download(req.body.url);
    const ws = req.query.ws;

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

}

export default Download;