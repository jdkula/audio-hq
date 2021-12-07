import { NextApiHandler } from 'next';
import mongoworkspaces from '~/lib/db/mongoworkspaces';
import { File, Reorderable, StoredWorkspace, Workspace } from '~/lib/Workspace';
import { AppFS } from '~/lib/filesystems/FileSystem';

async function getFileMetadata(id: string): Promise<File | null> {
    return await (await mongoworkspaces)
        .findOne<Workspace>({ files: { $elemMatch: { id } } })
        .then((f) => f?.files.find((other) => other.id === id) ?? null);
}

async function getWorkspaceWithFile(id: string): Promise<StoredWorkspace | null> {
    return await (await mongoworkspaces).findOne({ files: { $elemMatch: { id } } });
}

async function reorder(id: string, { reorder }: Reorderable) {
    const ws = await getWorkspaceWithFile(id);
    if (!ws) return;

    const target = reorder.before || reorder.after;

    let insertIndex = ws.files.findIndex((file) => file.id === target);
    const removeIndex = ws.files.findIndex((file) => file.id === id);

    if (insertIndex === -1 || removeIndex === -1) return;
    if (reorder.after) insertIndex++;

    const file = ws.files[removeIndex];

    await (
        await mongoworkspaces
    ).bulkWrite([
        { updateOne: { filter: { _id: ws.name }, update: { $pull: { files: { id } } } } },
        {
            updateOne: {
                filter: { _id: ws.name },
                update: { $push: { files: { $each: [file], $position: insertIndex } } },
            },
        },
    ]);
}

async function updateFile(id: string, info: Partial<File & Reorderable>): Promise<File | null> {
    delete info.id;
    delete info.length;
    delete info.type;

    const set: any = {};

    for (const key of Object.keys(info)) {
        set[`files.$.${key}`] = (info as any)[key];
    }

    await (
        await mongoworkspaces
    ).bulkWrite([
        {
            updateOne: {
                filter: { files: { $elemMatch: { id } } },
                update: {
                    $set: set,
                },
            },
        },
    ]);

    if (info.reorder) {
        await reorder(id, info as Reorderable);
    }

    return await getFileMetadata(id);
}

async function delFile(id: string): Promise<void> {
    const workspaces = await mongoworkspaces;
    await workspaces.bulkWrite([
        {
            updateOne: {
                filter: { files: { $elemMatch: { id: id } } },
                update: {
                    $pull: {
                        files: {
                            id: id,
                        },
                    } as any, // needed for some reason... the pull query works.
                },
            },
        },
    ]);

    await AppFS.delete(id);
}

const get: NextApiHandler = async (req, res) => {
    if (!req.query.fid) {
        res.status(400).send('Invalid URL.');
        return;
    }

    try {
        const meta = await getFileMetadata(req.query.fid as string);
        if (!meta) throw new Error('not found');
        res.json(meta);
    } catch (e) {
        res.status(404).end('Not found.');
    }
};

const del: NextApiHandler = async (req, res) => {
    if (!req.query.fid || req.method !== 'DELETE') {
        res.status(400).send('Invalid URL.');
        return;
    }

    try {
        await delFile(req.query.fid as string);
    } catch (e) {
        res.status(404).end('Not found.');
        return;
    }

    res.status(204).end();
};

const put: NextApiHandler = async (req, res) => {
    if (!req.query.fid || req.method !== 'PUT') {
        res.status(400).send('Invalid URL.');
        return;
    }

    try {
        res.json(await updateFile(req.query.fid as string, req.body));
    } catch (e) {
        res.status(404).end('Not found.');
        return;
    }
};

const Files: NextApiHandler = async (req, res) => {
    if (req.method === 'DELETE') {
        return await del(req, res);
    }

    if (req.method === 'GET') {
        return await get(req, res);
    }

    if (req.method === 'PUT') {
        return await put(req, res);
    }
};

export default Files;
