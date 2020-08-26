import { NextApiHandler } from 'next';
import { findOrCreateWorkspace } from './index';

const WorkspaceJobs: NextApiHandler = async (req, res) => {
    res.json((await findOrCreateWorkspace(req.query.ws as string)).jobs);
};

export default WorkspaceJobs;
