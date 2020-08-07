import { NextApiHandler } from 'next';
import mongoworkspaces from '~/lib/db/mongoworkspaces';
import { Workspace, WorkspaceState } from '~/lib/Workspace';
import { FindAndModifyWriteOpResultObject } from 'mongodb';

async function findOrCreateWorkspaceState(workspaceId: string): Promise<WorkspaceState> {
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
                state: true,
            },
        },
    );

    return workspace.value!.state;
}

const get: NextApiHandler = async (req, res) => {
    res.json(await findOrCreateWorkspaceState(req.query.ws as string));
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
