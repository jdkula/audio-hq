import { NextApiHandler } from 'next';
import mongoworkspaces from '~/lib/db/mongoworkspaces';
import { findOrCreateWorkspace } from '.';

const get: NextApiHandler = async (req, res) => {
    res.json((await findOrCreateWorkspace(req.query.ws as string)).state);
};

const post: NextApiHandler = async (req, res) => {
    await (await mongoworkspaces).updateOne({ _id: req.query.ws }, { $set: { state: req.body } });
    await get(req, res);
};

const WorkspaceEndpoint: NextApiHandler = async (req, res) => {
    if (req.method === 'POST') {
        await post(req, res);
    }

    if (req.method === 'GET') {
        await get(req, res);
    }
};

export default WorkspaceEndpoint;
