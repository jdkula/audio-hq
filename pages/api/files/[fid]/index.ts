import { NextApiHandler } from 'next';
import { mongofiles } from '~/lib/db';
import { ObjectId, GridFSBucketReadStream, ObjectID } from 'mongodb';
import mongoworkspaces from '~/lib/db/mongoworkspaces';
import { File, Workspace } from '~/lib/Workspace';

async function getFileMetadata(id: string): Promise<File | null> {
    return await (await mongoworkspaces)
        .findOne<Workspace>({ files: { $elemMatch: { id: new ObjectId(id) } } })
        .then((f) => f?.files.find((other) => ((other.id as unknown) as ObjectID).toHexString() === id) ?? null);
}

async function updateFile(id: string, info: Partial<File>): Promise<File | null> {
    delete info.id;
    delete info.length;
    delete info.type;

    const set: any = {};

    for (const key of Object.keys(info)) {
        set[`files.$.${key}`] = (info as any)[key];
    }

    const result = await (await mongoworkspaces).bulkWrite([
        {
            updateOne: {
                filter: { files: { $elemMatch: { id: new ObjectId(id) } } },
                update: {
                    $set: set,
                },
            },
        },
    ]);

    return await getFileMetadata(id);
}

async function delFile(id: string): Promise<void> {
    const workspaces = await mongoworkspaces;
    const files = await mongofiles;
    const fid = new ObjectId(id);
    await workspaces.bulkWrite([
        {
            updateOne: {
                filter: { files: { $elemMatch: { id: fid } } },
                update: {
                    $pull: {
                        files: {
                            id: fid,
                        },
                    } as any, // needed for some reason... the pull query works.
                },
            },
        },
    ]);

    return new Promise((resolve, reject) => {
        files.delete(fid, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
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

    res.status(204).send('Deleted.');
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
