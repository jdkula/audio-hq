import fs from 'promise-fs';
import path from 'path';
import ytdl from 'youtube-dl';

import { uuid as uuidv4 } from 'uuidv4';
import ffmpeg from 'fluent-ffmpeg';

const kBaseDir = '/tmp/audio-hq/storage';

// Type definitions for ytdl are bad... this exists! (gotta love the double-disable...)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
ytdl.setYtdlBinary('/Library/Frameworks/Python.framework/Versions/3.8/bin/youtube-dl');

export async function download(url: string): Promise<string> {
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

export async function convert(input: string): Promise<string> {
    const basedir = kBaseDir;

    try {
        await fs.mkdir(basedir);
    } catch (e) {
        // ignore
    }

    const uuid = uuidv4();

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
            .save(outPath);
    });
}
