import { NextApiHandler } from 'next';
import mongoworkspaces from '~/lib/db/mongoworkspaces';
import { StoredWorkspace, Workspace } from '~/lib/Workspace';
import { FindAndModifyWriteOpResultObject } from 'mongodb';
import Jobs from '~/lib/Jobs';

export async function findOrCreateWorkspace(workspaceId: string): Promise<Workspace> {
    const workspace: FindAndModifyWriteOpResultObject<StoredWorkspace & { _id: any }> = await (
        await mongoworkspaces
    ).findOneAndUpdate(
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
                    startVolume: 1,
                },
            } as Omit<StoredWorkspace, '_id'>,
        },
        {
            returnOriginal: false,
            upsert: true,
        },
    );

    delete workspace.value?._id;

    return { ...workspace.value!, jobs: Jobs.ofWorkspace(workspaceId) };
}

const get: NextApiHandler = async (req, res) => {
    res.json(await findOrCreateWorkspace(req.query.ws as string));
};

const WorkspaceEndpoint: NextApiHandler = async (req, res) => {
    if (req.method === 'GET') {
        await get(req, res);
    }
};

export default WorkspaceEndpoint;
