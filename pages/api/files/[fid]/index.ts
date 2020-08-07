import { NextApiHandler } from 'next';
import { mongofiles } from '~/lib/db';
import { ObjectId, GridFSBucketReadStream } from 'mongodb';
import mongoworkspaces from '~/lib/db/mongoworkspaces';

async function getFile(id: string): Promise<GridFSBucketReadStream> {
    const fs = await mongofiles;

    return new Promise<GridFSBucketReadStream>((resolve, reject) => {
        const downloadStream = fs.openDownloadStream(new ObjectId(id));
        downloadStream.on('error', (e) => reject(e));
        downloadStream.on('file', () => {
            resolve(downloadStream);
        });
        downloadStream.resume();
    });
}

async function delFile(id: string): Promise<void> {
    const workspaces = await mongoworkspaces;
    const files = await mongofiles;
    const fid = new ObjectId(id);
    await workspaces.bulkWrite([
        {
            updateMany: {
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

    return new Promise(async (resolve, reject) => {
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
        const downloadStream = await getFile(req.query.fid as string);
        res.setHeader('Content-Type', 'audio/mp3');
        res.status(200).send(downloadStream);
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

const Files: NextApiHandler = async (req, res) => {
    if (req.method === 'DELETE') {
        return await del(req, res);
    }

    if (req.method === 'GET') {
        return await get(req, res);
    }
};

export default Files;
