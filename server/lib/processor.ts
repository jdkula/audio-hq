import fs from "promise-fs";
import { ReadStream } from "fs";
import path from "path";
import ytdl from "youtube-dl";

import {uuid as uuidv4} from "uuidv4";
import ffmpeg from "fluent-ffmpeg";

//@ts-ignore
ytdl.setYtdlBinary('/Library/Frameworks/Python.framework/Versions/3.8/bin/youtube-dl')

export async function download(url: string): Promise<Buffer> {

    const basedir = path.join(process.cwd(), "processor");

    try {
        await fs.mkdir(basedir);
    } catch (e) {
        // ignore
    }

    const uuid = uuidv4();

    const outPath = path.join(basedir, uuid + ".%(ext)s");
    const realOut = path.join(basedir, uuid + ".mp3");

    return new Promise<Buffer>((resolve, reject) => {
        ytdl.exec(url, ['-x', '--audio-format', 'mp3', '--audio-quality', '320k', '-k', '-o', outPath], {cwd: basedir}, async (err, out) => {
            if (err) {
                reject(err);
            } else {
                console.log(out);
                resolve(fs.readFile(realOut));
            }
        });
    });
}

export async function convert(input: Buffer | ReadStream): Promise<Buffer> {
    const basedir = path.join(process.cwd(), "processor");

    try {
        await fs.mkdir(basedir);
    } catch (e) {
        // ignore
    }

    const uuid = uuidv4();

    const inPath = path.join(basedir, uuid + "-in");
    await fs.writeFile(inPath, input);

    const outPath = path.join(basedir, uuid + ".mp3");

    return new Promise<Buffer>((resolve, reject) =>{
        ffmpeg(inPath)
            .noVideo()
            .audioBitrate('320k')
            .on('error', async (err) => {
                reject(err);
            })
            .on('end', async (done) => {
                resolve(fs.readFile(outPath));
            })
            .save(outPath)
    });

}
