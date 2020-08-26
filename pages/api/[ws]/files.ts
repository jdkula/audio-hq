import { NextApiHandler } from 'next';
import { findOrCreateWorkspace } from './index';

const WorkspaceFiles: NextApiHandler = async (req, res) => {
    res.json((await findOrCreateWorkspace(req.query.ws as string)).files);
};

export default WorkspaceFiles;
