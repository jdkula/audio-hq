import { GridFSBucketReadStream, ObjectId } from 'mongodb';
import { mongofiles } from '~/lib/db';
import { NextApiHandler } from 'next';
import { AppFS, isRedirect } from '~/lib/filesystems/FileSystem';

const get: NextApiHandler = async (req, res) => {
    if (!req.query.fid) {
        res.status(400).send('Invalid URL.');
        return;
    }

    try {
        const info = await AppFS.read(req.query.fid as string);
        if (isRedirect(info)) {
            res.setHeader('Location', info.redirect);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
            res.setHeader('Access-Control-Max-Age', 3000);
            res.status(302).end();
            return;
        }
        res.setHeader('Content-Type', 'audio/mp3');
        res.setHeader('Content-Length', info.length);
        res.status(200).send(info.stream);
    } catch (e) {
        res.status(404).end('Not found.');
    }
};

const Download: NextApiHandler = async (req, res) => {
    if (req.method === 'GET') {
        return await get(req, res);
    } else if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD');
        res.setHeader('Access-Control-Max-Age', 3000);
        res.setHeader('test', 'OK');
        res.status(200).end();
    }
};

export default Download;
