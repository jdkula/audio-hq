const kAudioType = 'audio/mp3';
const kAudioExtension = '.v1.mp3';

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

import ffmpeg, { FilterSpecification } from 'fluent-ffmpeg';

import { v4, v4 as uuidv4 } from 'uuid';
import { spawn } from 'child_process';
import { AppFS } from './filesystems/FileSystem';
import which from 'which';
import fsProm from 'fs/promises';
import { Logger } from 'tslog';
import { myid } from './id';
import { ObjectId } from 'mongodb';
import { mongo } from './common/db/mongodb';
import { asString } from './common/db/oid_helpers';
import { audiohq } from './common/generated/proto.js';

interface ConvertOptions {
    cut?:
        | {
              start: number;
              end: number;
          }
        | null
        | undefined;
    fadeIn?: number | null | undefined;
    fadeOut?: number | null | undefined;
}

const processorLog = new Logger({ name: 'processor' });
const ytdlLog = processorLog.getSubLogger({ name: 'youtube-dl' });
const ffmpegLog = processorLog.getSubLogger({ name: 'ffmpeg' });

if (!process.env.TEMP_DIR) {
    process.env.TEMP_DIR = '/tmp/audio-hq/storage';
}

const kBaseDir = process.env.TEMP_DIR;

try {
    processorLog.silly('Creating temporary directory');
    fsSync.mkdirSync(kBaseDir, { recursive: true });
} catch (e) {
    // do nothing; already exists.
}

processorLog.silly('Searching for youtube-dl');
const _found_path = which.sync('yt-dlp', { nothrow: true }) ?? which.sync('youtube-dl', { nothrow: true });
if (!_found_path) {
    throw new Error('Youtube-DL not found!');
}

const ytdlPath: string = _found_path;
processorLog.silly('youtube-dl found');

interface FileOptions {
    name: string;
    workspace: ObjectId;
    path?: string[];
    description?: string;
    source?: string;
}

export class Processor {
    private async updateProgress(jobId: ObjectId, progress: number, progressStage: audiohq.JobStatus) {
        const db = await mongo;

        processorLog.silly(`Updating job progress for ${jobId} to ${progressStage}:${progress}`);
        try {
            const updateData = await db.jobs.updateOne(
                { _id: jobId, assignedWorker: myid },
                {
                    $set: {
                        progress,
                        status: progressStage,
                    },
                },
            );

            if (updateData.matchedCount === 0) {
                processorLog.fatal("Started work on a job we don't own, exiting now!!");
                process.exit(1);
            }
        } catch (e) {
            processorLog.warn('Could not update progress', e);
        }
    }

    async saveInput(input_b64: string) {
        if (input_b64.startsWith('\\x')) {
            input_b64 = Buffer.from(input_b64.substring(2), 'hex').toString();
        }
        const b64 = input_b64.replace(/^data:.*?;base64,/, '');
        const type = input_b64.replace(/;base64,.*$/, '').replace(/^data:.*?\//, '');
        const uuid = v4();

        if (/[-/.~]/.exec(type)) {
            throw new Error('Invalid type: ' + type);
        }
        const outPath = path.join(kBaseDir, uuid + '.' + type);
        processorLog.debug('Saving input to file', outPath);
        await fsProm.writeFile(outPath, b64, 'base64url');
        processorLog.silly('File written');
        return outPath;
    }

    async addFile(
        jobId: ObjectId,
        filepath: string,
        { name, workspace, path, description, source }: FileOptions,
    ): Promise<ObjectId> {
        processorLog.debug(`Saving file ${filepath} to S3 + Database...`);
        const duration = await getAudioDurationInSeconds(filepath);
        processorLog.silly(`Got ${filepath} as ${duration} seconds long`);

        this.updateProgress(jobId, 0, audiohq.JobStatus.SAVING);

        const db = await mongo;

        const session = db.client.startSession({
            defaultTransactionOptions: {
                readPreference: 'primary',
                readConcern: { level: 'local' },
                writeConcern: { w: 'majority' },
            },
        });
        try {
            let id: ObjectId | undefined = undefined;
            await session.withTransaction(async () => {
                processorLog.silly(`Saving to S3...`);
                const dlurl = await AppFS.write(
                    filepath,
                    asString(jobId) + kAudioExtension,
                    kAudioType,
                    (progress) => progress && this.updateProgress(jobId, progress, audiohq.JobStatus.SAVING),
                );
                processorLog.silly(`Saved to S3`);
        
                processorLog.silly(`Committing to database...`);
        
                const inserted = await db.entries.insertOne(
                    {
                        _workspace: workspace,
                        single: {
                            description: description ?? '',
                            name: name,
                            path: path ?? [],
                            url: dlurl,
                            length: duration,
                            ordering: null,
                            source: source ?? "",
                            provider_id: asString(jobId) + kAudioExtension,
                        },
                    },
                    { session },
                );
                await db.jobs.deleteOne({ _id: jobId });
                processorLog.silly(`Job committed`);
                id = inserted.insertedId;
            });

            if (!id) throw Error();

            return id;
        } finally {
            await session.endSession();
        }
    }

    async download(url: string, jobId: ObjectId): Promise<string> {
        const basedir = kBaseDir;

        try {
            await fs.mkdir(basedir);
        } catch (e) {
            // ignore
        }

        const uuid = uuidv4();

        const outPath = path.join(basedir, uuid + '.%(ext)s');
        processorLog.debug(`Downloading ${url} with pattern ${outPath}`);

        this.updateProgress(jobId, 0, audiohq.JobStatus.DOWNLOADING);

        return new Promise<string>((resolve, reject) => {
            const ytdl = spawn(ytdlPath, ['--no-playlist', '-x', '-f', 'bestaudio/best', '-o', outPath, url], {
                cwd: basedir,
            });

            ytdl.stdout.on('data', (data: string) => {
                ytdlLog.silly(data.toString());
                const foundPercent = data.toString().match(/\[download\]\s*(\d+\.\d+)%/);
                if (jobId && foundPercent?.[1]) {
                    this.updateProgress(jobId, parseFloat(foundPercent[1]) / 100, audiohq.JobStatus.DOWNLOADING);
                }
            });

            ytdl.stderr.on('data', (data) => {
                ytdlLog.warn(data);
            });

            ytdl.on('close', (code) => {
                if (code !== 0) {
                    reject(code);
                } else {
                    ytdlLog.info('Done');
                    fs.readdir(basedir)
                        .then((files) => files.find((f) => f.startsWith(uuid)))
                        .then((file) => {
                            if (!file) reject('conversion failed');
                            else resolve(path.join(basedir, file));
                        });
                }
            });
        });
    }

    async convert(input: string, jobId: ObjectId, options?: ConvertOptions): Promise<string> {
        const basedir = kBaseDir;

        try {
            await fs.mkdir(basedir);
        } catch (e) {
            // ignore
        }

        const uuid = uuidv4();

        const outPath = path.join(basedir, uuid + '.mp3');
        processorLog.debug(`Converting ${input} to ${outPath}`);

        this.updateProgress(jobId, 0, audiohq.JobStatus.CONVERTING);

        return new Promise<string>((resolve, reject) => {
            let cmd = ffmpeg(input).noVideo().audioQuality(3);

            let length = 1;
            let ofDuration = 1;

            const complexFilter: (FilterSpecification | string)[] = [
                { filter: 'anull', inputs: ['0:a:0'], outputs: ['audio'] },
            ];

            if (options?.cut) {
                ofDuration = options.cut.end - options.cut.start;

                complexFilter.push({
                    filter: 'atrim',
                    options: {
                        start: options.cut.start,
                        end: options.cut.end,
                    },
                    inputs: ['audio'],
                    outputs: ['audio'],
                });
            }

            if (options?.fadeIn) {
                complexFilter.push('aevalsrc=0:d=' + options.fadeIn + ' [ain_silence]');
                complexFilter.push({
                    filter: 'acrossfade',
                    options: { d: options.fadeIn, curve1: 'losi', curve2: 'losi' },
                    inputs: ['ain_silence', 'audio'],
                    outputs: ['audio'],
                });
            }

            if (options?.fadeOut) {
                complexFilter.push('aevalsrc=0:d=' + options.fadeOut + ' [aout_silence]');
                complexFilter.push({
                    filter: 'acrossfade',
                    options: { d: options.fadeOut, curve1: 'losi', curve2: 'losi' },
                    inputs: ['audio', 'aout_silence'],
                    outputs: ['audio'],
                });
            }

            complexFilter.push({
                filter: 'asetpts',
                options: 'PTS-STARTPTS',
                inputs: ['audio'],
            });
            // complexFilter.push({ filter: 'anull', inputs: ['audio'] });

            cmd = cmd.complexFilter(complexFilter);

            cmd.on('error', async (err) => {
                reject(err);
            })
                .on('end', async () => {
                    await fs.unlink(input);
                    resolve(outPath);
                })
                .on('codecData', (info) => {
                    ffmpegLog.silly('Got codec info', info);
                    length = fromTimestamp(info.duration);
                })
                .on('progress', (info) => {
                    ffmpegLog.silly('Got progress', info.percent);
                    const percentBoost = options?.cut && ofDuration < length ? length / ofDuration : 1;
                    this.updateProgress(jobId, (info.percent / 100) * percentBoost, audiohq.JobStatus.CONVERTING);
                })
                .save(outPath);
        });
    }
}

function fromTimestamp(ffmpegTimestamp: string): number {
    const [hour, minute, seconds] = ffmpegTimestamp.split(':').map(parseFloat);
    return hour * 3600 + minute * 60 + seconds;
}

async function getAudioDurationInSeconds(filepath: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        const child = spawn('ffprobe', [
            '-v',
            'error',
            '-select_streams',
            'a:0',
            '-show_format',
            '-show_streams',
            '-i',
            filepath,
        ]);
        let result = '';
        child.stdout.on('data', function (data) {
            result += data.toString();
        });
        child.on('close', () => {
            processorLog.silly(`ffprobe done`);
            const search = 'duration=';
            let idx = result.indexOf(search);
            if (idx === -1) {
                reject();
                return;
            }
            idx += search.length;
            const eol = result.indexOf('\n', idx);
            const subs = result.substring(idx, eol);
            resolve(parseFloat(subs));
        });
    });
}
