import { NextApiHandler } from 'next';
import mongoworkspaces from '~/lib/db/mongoworkspaces';
import { Workspace, WorkspaceState, File } from '~/lib/Workspace';
import { FindAndModifyWriteOpResultObject } from 'mongodb';

async function findOrCreateWorkspaceFiles(workspaceId: string): Promise<File[]> {
    const workspace: FindAndModifyWriteOpResultObject<Workspace> = await (await mongoworkspaces).findOneAndUpdate(
        { _id: workspaceId },
        {
            $setOnInsert: {
                files: [],
                name: workspaceId,
                state: {
                    ambience: [],
                    live: false,
                    playing: null,
                    queued: null,
                    suggestions: [],
                    users: [],
                },
            } as Omit<Workspace, '_id'>,
        },
        {
            returnOriginal: false,
            upsert: true,
            projection: {
                files: true,
            },
        },
    );

    return workspace.value!.files;
}

const get: NextApiHandler = async (req, res) => {
    res.json(await findOrCreateWorkspaceFiles(req.query.ws as string));
};

const post: NextApiHandler = async (req, res) => {};

const WorkspaceEndpoint: NextApiHandler = async (req, res) => {
    if (req.method === 'POST') {
        await post(req, res);
    }

    if (req.method === 'GET') {
        await get(req, res);
    }
};

export default WorkspaceEndpoint;
