import { NextApiHandler } from 'next';
import path from 'path';
import { download, convert } from '~/lib/processor';
import { File, Workspace } from '~/lib/Workspace';
import { findOrCreateWorkspace } from '.';
import mongoworkspaces from '~/lib/db/mongoworkspaces';
import { mongofiles } from '~/lib/db';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import formidable from 'formidable';
import { addFile } from './import';

const Convert: NextApiHandler = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = '/tmp/audio-hq';
    form.keepExtensions = true;
    const parsePromise = new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });

    const { fields, files } = await parsePromise;

    for (const filename of Object.keys(files)) {
        const file = files[filename];
        const out = await convert(file.path);
        const name = fields.name as string;

        const ws: string = req.query.ws as string;

        const workspace = await addFile(out, name, ws);

        res.status(200).send({ done: true, path: file.path, ws: workspace });
        return;
    }
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default Convert;
