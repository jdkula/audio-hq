import fs from 'promise-fs';
import path from 'path';
import ytdl from 'youtube-dl';

import { uuid as uuidv4 } from 'uuidv4';
import ffmpeg from 'fluent-ffmpeg';
import { ObjectId } from 'mongodb';
import getAudioDurationInSeconds from 'get-audio-duration';
import { findOrCreateWorkspace } from '~/pages/api/[ws]';
import mongoworkspaces from './db/mongoworkspaces';
import { File } from './Workspace';

import { spawn } from 'child_process';
import Jobs, { Job } from './jobs';
import { AppFS } from './filesystems/FileSystem';

const kBaseDir = '/tmp/audio-hq/storage';

try {
    fs.mkdirSync('/tmp/audio-hq');
} catch (e) {
    // do nothing;
}

// Type definitions for ytdl are bad... this exists! (gotta love the double-disable...)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
const ytdlPath = ytdl.getYtdlBinary();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(require('@ffprobe-installer/ffprobe').path);

interface FileOptions {
    name: string;
    workspace: string;
    path?: string[];
}

export async function addFile(id: string, filepath: string, { name, workspace, path }: FileOptions): Promise<string> {
    const duration = await getAudioDurationInSeconds(filepath);

    const file: File = {
        id,
        name: name,
        path: path ?? [],
        type: 'audio',
        length: duration,
    };

    await findOrCreateWorkspace(workspace);

    Jobs.set(id, (job) => ({ ...job, status: 'saving' }));

    await AppFS.write(filepath, id, (progress) => progress && Jobs.set(id, (job) => ({ ...job, progress })));

    await (await mongoworkspaces).updateOne({ _id: workspace }, { $push: { files: file } });

    return id;
}

export function processFile({ name, workspace, path }: FileOptions, filePath: (id: string) => Promise<string>): Job {
    const id = new ObjectId().toHexString();

    const job: Job = {
        jobId: id,
        progress: 0,
        status: 'started',
        name: name,
        workspace: workspace,
    };

    (async () => {
        try {
            const filepath = await filePath(id);
            await addFile(id, filepath, { name, workspace, path });
            Jobs.set(id, (job) => ({ ...job, status: 'done', result: id }));
        } catch (e) {
            Jobs.set(id, (job) => ({ ...job, status: 'error', errorInfo: e.toString() }));
        }
    })();

    Jobs.set(id, job);

    return job;
}

export async function download(url: string, id?: string): Promise<string> {
    const basedir = kBaseDir;

    try {
        await fs.mkdir(basedir);
    } catch (e) {
        // ignore
    }

    const uuid = uuidv4();

    const outPath = path.join(basedir, uuid + '.%(ext)s');

    id && Jobs.set(id, (job) => ({ ...job, status: 'downloading' }));

    return new Promise<string>((resolve, reject) => {
        const ytdl = spawn(ytdlPath, ['--ffmpeg-location', ffmpegPath, '-x', '-f', 'bestaudio', '-o', outPath, url], {
            cwd: basedir,
        });

        ytdl.stdout.on('data', (data: string) => {
            console.log('ytdl stdout: ' + data);
            const foundPercent = data.toString().match(/\[download\]\s*(\d+\.\d+)%/);
            if (id && foundPercent?.[1]) {
                Jobs.set(id, (job) => ({ ...job, progress: parseFloat(foundPercent[1]) / 100 }));
            }
        });

        ytdl.stderr.on('data', (data) => {
            console.log('ytdl stderr: ' + data);
        });

        ytdl.on('close', (code) => {
            if (code !== 0) {
                reject(code);
            } else {
                fs.readdir(basedir)
                    .then((files) => files.find((f) => f.startsWith(uuid)))
                    .then((file) => {
                        if (!file) return null;
                        else return convert(path.join(basedir, file), id);
                    })
                    .then((converted) => {
                        if (!converted) reject('Conversion failed');
                        else resolve(converted);
                    });
            }
        });
    });
}

export async function convert(input: string, id?: string): Promise<string> {
    const basedir = kBaseDir;

    try {
        await fs.mkdir(basedir);
    } catch (e) {
        // ignore
    }

    const uuid = uuidv4();

    const outPath = path.join(basedir, uuid + '.mp3');

    id && Jobs.set(id, (job) => ({ ...job, status: 'converting' }));

    return new Promise<string>((resolve, reject) => {
        ffmpeg(input, { niceness: 20 })
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
                id && Jobs.set(id, (job) => ({ ...job, progress: info.percent / 100 }));
            })
            .save(outPath);
    });
}
