import { GridFSBucketReadStream, ObjectId } from 'mongodb';
import { mongofiles } from '~/lib/db';
import { NextApiHandler } from 'next';

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

const Download: NextApiHandler = async (req, res) => {
    if (req.method === 'GET') {
        return await get(req, res);
    }
};

export default Download;
