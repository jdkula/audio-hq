import fs from 'promise-fs';
import path from 'path';
import ytdl from 'youtube-dl';

import { uuid as uuidv4 } from 'uuidv4';
import ffmpeg from 'fluent-ffmpeg';
import { ObjectID } from 'mongodb';
import { mongofiles } from './db';
import getAudioDurationInSeconds from 'get-audio-duration';
import { findOrCreateWorkspace } from '~/pages/api/[ws]';
import mongoworkspaces from './db/mongoworkspaces';
import { File } from './Workspace';

const kBaseDir = '/tmp/audio-hq/storage';

try {
    fs.mkdirSync('/tmp/audio-hq');
} catch (e) {
    // do nothing;
}

// Type definitions for ytdl are bad... this exists! (gotta love the double-disable...)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
ytdl.setYtdlBinary('/Library/Frameworks/Python.framework/Versions/3.8/bin/youtube-dl');

export interface Job {
    jobId: ObjectID;
    name: string;
    status: 'started' | 'error' | 'done';
    progress: number | null;
    errorInfo?: string;
    result?: string;
}

const g = global as { __PROC_CACHE?: Map<string, Job> };

if (!g.__PROC_CACHE) {
    g.__PROC_CACHE = new Map();
}

export function getJobStatus(id: string): Job | null {
    return g.__PROC_CACHE?.get(id) ?? null;
}

export async function addFile(
    id: ObjectID,
    filepath: string,
    filename: string,
    workspaceId: string,
): Promise<ObjectID> {
    const upload = (await mongofiles).openUploadStreamWithId(id, filename);
    const duration = await getAudioDurationInSeconds(filepath);

    const file: File = {
        id: (id as unknown) as string, // upload.id here is an ObjectId!! but it's serialized later as a string.
        name: filename,
        path: '/',
        type: 'audio',
        length: duration,
    };

    await findOrCreateWorkspace(workspaceId);

    const res = await (await mongoworkspaces).updateOne(
        { _id: workspaceId },
        {
            $push: {
                files: file,
            },
        },
    );

    await new Promise((resolve, reject) => {
        fs.createReadStream(filepath)
            .pipe(upload)
            .on('error', (error: any) => {
                if (error) reject(error);
            })
            .on('finish', () => {
                resolve();
            });
    });

    return id;
}

export function processFile(name: string, workspace: string, filePath: (id: ObjectID) => Promise<string>): Job {
    const id = new ObjectID();

    const job: Job = {
        jobId: id,
        progress: 0,
        status: 'started',
        name: name,
    };

    (async () => {
        try {
            const filepath = await filePath(id);
            await addFile(id, filepath, name, workspace);
            job.status = 'done';
            job.result = id.toHexString();
        } catch (e) {
            job.status = 'error';
            job.errorInfo = e.toString();
        }
    })();

    g.__PROC_CACHE!.set(id.toHexString(), job);

    return job;
}

export async function download(url: string, id?: ObjectID): Promise<string> {
    const basedir = kBaseDir;

    try {
        await fs.mkdir(basedir);
    } catch (e) {
        // ignore
    }

    const uuid = uuidv4();

    const outPath = path.join(basedir, uuid + '.%(ext)s');
    const realOut = path.join(basedir, uuid + '.mp3');

    return new Promise<string>((resolve, reject) => {
        ytdl.exec(
            url,
            ['-x', '--audio-format', 'mp3', '--audio-quality', '3', '-o', outPath],
            { cwd: basedir },
            async (err: string, output: string[]) => {
                if (err) {
                    reject(err);
                } else {
                    output.forEach((s) => console.log(s));
                    resolve(realOut);
                }
            },
        );
    });
}

export async function convert(input: string, id?: ObjectID): Promise<string> {
    const basedir = kBaseDir;

    try {
        await fs.mkdir(basedir);
    } catch (e) {
        // ignore
    }

    const uuid = uuidv4();
    const sid = id?.toHexString();

    const outPath = path.join(basedir, uuid + '.mp3');

    return new Promise<string>((resolve, reject) => {
        ffmpeg(input)
            .noVideo()
            .audioQuality(3)
            .on('error', async (err) => {
                reject(err);
            })
            .on('end', async () => {
                await fs.unlink(input);
                resolve(outPath);
            })
            .on('progress', (info) => {
                if (sid && g.__PROC_CACHE?.get(sid)) {
                    g.__PROC_CACHE.get(sid)!.progress = info.percent;
                }
            })
            .save(outPath);
    });
}
