import { NextApiHandler } from 'next';
import mongoworkspaces from '~/lib/db/mongoworkspaces';
import { StoredWorkspace, Workspace } from '~/lib/Workspace';
import Jobs from '~/lib/Jobs';
import { ModifyResult } from 'mongodb';

export async function findOrCreateWorkspace(workspaceId: string): Promise<Workspace> {
    const workspace = await (
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
                    sfx: {
                        sfx: null,
                        timeoutTimestamp: 0,
                        triggerTimestamp: 0,
                    },
                },
            } as Omit<StoredWorkspace, '_id'>,
        },
        {
            returnDocument: 'before',
            upsert: true,
        },
    );

    // @ts-expect-error
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
