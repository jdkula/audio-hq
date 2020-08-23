import { NextApiHandler } from 'next';
import { download, processFile } from '~/lib/processor';
import { File, Workspace } from '~/lib/Workspace';
import { findOrCreateWorkspace } from '../[ws]';
import mongoworkspaces from '~/lib/db/mongoworkspaces';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { mongofiles } from '~/lib/db';
import fs from 'fs';

const Import: NextApiHandler = async (req, res) => {
    if (!req.body.url || !req.body.name) {
        res.status(400).send('Invalid body.');
        return;
    }

    const job = processFile(req.body.name, req.body.workspace, () => download(req.body.url));

    res.status(200).send(job);
};

export default Import;
