import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

import ffmpeg, { FilterSpecification } from 'fluent-ffmpeg';

import { v4 as uuidv4 } from 'uuid';
import { spawn } from 'child_process';
import which from 'which';
import pino from 'pino';

import SocketTransport from 'clients/lib/impl/socketio.transport';
import * as Transport from 'common/lib/api/transport/models';

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

const processorLog = pino({ name: 'processor', transport: { target: 'pino-pretty' }, level: 'trace' });

const ytdlLog = processorLog.child({ name: 'youtube-dl' });
const ffmpegLog = processorLog.child({ name: 'ffmpeg' });

if (!process.env.TEMP_DIR) {
    process.env.TEMP_DIR = '/tmp/audio-hq/storage';
}

const kBaseDir = process.env.TEMP_DIR;

try {
    processorLog.trace('Creating temporary directory');
    fsSync.mkdirSync(kBaseDir, { recursive: true });
} catch (e) {
    // do nothing; already exists.
}

processorLog.trace('Searching for youtube-dl');
const _found_path = which.sync('yt-dlp', { nothrow: true }) ?? which.sync('youtube-dl', { nothrow: true });
if (!_found_path) {
    throw new Error('Youtube-DL not found!');
}

const ytdlPath: string = _found_path;
processorLog.trace('youtube-dl found');

interface FileOptions {
    name: string;
    workspace: string;
    path?: string[];
    description?: string;
    source?: string;
}

export class Processor {
    constructor(
        private readonly _id: string,
        private readonly _io: SocketTransport,
        private readonly _psk: string,
    ) {}
    private async updateProgress(
        jobId: string,
        workspaceId: string,
        progress: number,
        progressStage: Transport.JobStatus,
        source: string,
    ) {
        processorLog.trace(`Updating job progress for ${jobId} to ${progressStage}:${progress}`);

        await this._io.adminUpdateJob(this._psk, workspaceId, jobId, {
            assignedWorker: this._id,
            error: null,
            progress,
            status: progressStage,
            source,
        });
    }

    async addFile(jobId: string, filepath: string, { workspace }: FileOptions): Promise<void> {
        processorLog.debug(`Completing ${filepath}...`);
        const duration = await getAudioDurationInSeconds(filepath);
        processorLog.trace(`Got ${filepath} as ${duration} seconds long`);
        await this._io.adminCompleteJob(this._psk, workspace, jobId, {
            duration: duration,
            mime: 'audio/mp3',
            content: new Uint8Array(await fs.readFile(filepath)),
        });
    }

    async download(url: string, workspaceId: string, jobId: string): Promise<string> {
        const basedir = kBaseDir;

        try {
            await fs.mkdir(basedir);
        } catch (e) {
            // ignore
        }

        const uuid = uuidv4();

        const outPath = path.join(basedir, uuid + '.%(ext)s');
        processorLog.debug(`Downloading ${url} with pattern ${outPath}`);

        this.updateProgress(jobId, workspaceId, 0, Transport.JobStatus.DOWNLOADING, url);

        return new Promise<string>((resolve, reject) => {
            const ytdl = spawn(ytdlPath, ['--no-playlist', '-x', '-f', 'bestaudio/best', '-o', outPath, url], {
                cwd: basedir,
            });

            ytdl.stdout.on('data', (data: string) => {
                ytdlLog.trace(data.toString());
                const foundPercent = data.toString().match(/\[download\]\s*(\d+\.\d+)%/);
                if (jobId && foundPercent?.[1]) {
                    this.updateProgress(
                        jobId,
                        workspaceId,
                        parseFloat(foundPercent[1]) / 100,
                        Transport.JobStatus.DOWNLOADING,
                        url,
                    );
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

    async convert(
        input: string,
        workspaceId: string,
        jobId: string,
        source: string,
        options?: ConvertOptions,
    ): Promise<string> {
        const basedir = kBaseDir;

        try {
            await fs.mkdir(basedir);
        } catch (e) {
            // ignore
        }

        const uuid = uuidv4();

        const outPath = path.join(basedir, uuid + '.mp3');
        processorLog.debug(`Converting ${input} to ${outPath}`);

        this.updateProgress(jobId, workspaceId, 0, Transport.JobStatus.CONVERTING, source);

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
                    ffmpegLog.trace('Got codec info %j', info);
                    length = fromTimestamp(info.duration);
                })
                .on('progress', (info) => {
                    ffmpegLog.trace('Got progress %d', info.percent);
                    const percentBoost = options?.cut && ofDuration < length ? length / ofDuration : 1;
                    this.updateProgress(
                        jobId,
                        workspaceId,
                        (info.percent / 100) * percentBoost,
                        Transport.JobStatus.CONVERTING,
                        source,
                    );
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
            processorLog.trace(`ffprobe done`);
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
