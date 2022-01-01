import { NextApiHandler } from 'next';
import mongoworkspaces from '~/lib/db/mongoworkspaces';
import { File, StoredWorkspace, Workspace } from '~/lib/Workspace';
import Jobs from '~/lib/Jobs';

export async function findOrCreateWorkspace(workspaceId: string): Promise<Workspace> {
    const defaultState = {
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
    };
    const workspace = await (
        await mongoworkspaces
    ).findOneAndUpdate(
        { _id: workspaceId },
        {
            $setOnInsert: {
                files: [],
                name: workspaceId,
                state: defaultState,
            } as Omit<StoredWorkspace, '_id'>,
        },
        {
            returnDocument: 'before',
            upsert: true,
        },
    );

    // @ts-expect-error  We don't want _id to be returned below.
    delete workspace.value?._id;

    let files: File[] = [];

    if (workspace.value) {
        files = workspace.value.files;

        for (const id of workspace.value.extends ?? []) {
            const extendsWs = await (await mongoworkspaces).findOne({ _id: id });
            if (extendsWs) {
                files = files.concat(extendsWs.files);
            }
        }
    }

    return {
        name: workspace.value?.name ?? workspaceId,
        state: workspace.value?.state ?? defaultState,
        extends: workspace.value?.extends ?? undefined,
        jobs: Jobs.ofWorkspace(workspaceId),
        files,
    };
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
