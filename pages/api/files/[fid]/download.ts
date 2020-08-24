import { GridFSBucketReadStream, ObjectId } from 'mongodb';
import { mongofiles } from '~/lib/db';
import { NextApiHandler } from 'next';

interface FileInfo {
    stream: GridFSBucketReadStream;
    length: number;
}

async function getFile(id: string): Promise<FileInfo> {
    const fs = await mongofiles;

    return new Promise<FileInfo>((resolve, reject) => {
        const downloadStream = fs.openDownloadStream(new ObjectId(id));
        downloadStream.on('error', (e) => reject(e));
        downloadStream.on('file', (doc) => {
            resolve({ stream: downloadStream, length: doc.length });
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
        const { stream, length } = await getFile(req.query.fid as string);
        res.setHeader('Content-Type', 'audio/mp3');
        res.setHeader('Content-Length', length);
        res.status(200).send(stream);
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
