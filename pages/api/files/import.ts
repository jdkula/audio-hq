import { NextApiHandler } from 'next';
import { download, processFile } from '~/lib/processor';

const Import: NextApiHandler = async (req, res) => {
    if (!req.body.url || !req.body.name) {
        res.status(400).send('Invalid body.');
        return;
    }

    const job = processFile(
        { name: req.body.name, description: req.body.description, workspace: req.body.workspace, path: req.body.path },
        (id) => download(req.body.url, id, req.body.options),
    );

    res.status(200).send(job);
};

export default Import;
