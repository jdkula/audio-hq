import { NextApiHandler } from 'next';
import { download } from '~/lib/processor';
import { File, Workspace } from '~/lib/Workspace';
import { findOrCreateWorkspace } from '../[ws]';
import mongoworkspaces from '~/lib/db/mongoworkspaces';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { mongofiles } from '~/lib/db';
import fs from 'fs';

export async function addFile(filepath: string, filename: string, workspaceId: string): Promise<Workspace> {
    const upload = (await mongofiles).openUploadStream(filename);
    const duration = await getAudioDurationInSeconds(filepath);

    const file: File = {
        id: upload.id as string, // upload.id here is an ObjectId!! but it's serialized later as a string.
        name: filename,
        path: '/',
        type: 'audio',
        length: duration,
    };

    const workspace = await findOrCreateWorkspace(workspaceId);
    workspace.files.push(file);

    await (await mongoworkspaces).updateOne(
        { _id: workspaceId },
        {
            $set: {
                files: workspace.files,
            },
        },
    );

    await new Promise((resolve, reject) => {
        fs.createReadStream(filepath)
            .pipe(upload)
            .on('error', (error) => {
                if (error) reject(error);
            })
            .on('finish', () => {
                resolve();
            });
    });

    return workspace;
}

const Import: NextApiHandler = async (req, res) => {
    if (!req.body.url || !req.body.name) {
        res.status(400).send('Invalid body.');
        return;
    }

    const filepath = await download(req.body.url);
    const ws = await addFile(filepath, req.body.name, req.body.ws);

    res.status(200).send({ done: true, path: filepath, ws });
};

export default Import;
