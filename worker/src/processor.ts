import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

import ffmpeg, { FilterSpecification } from "fluent-ffmpeg";

import { v4, v4 as uuidv4 } from "uuid";
import { spawn } from "child_process";
import { AppFS } from "./filesystems/FileSystem";
import type ConvertOptions from "../../frontend/lib/ConvertOptions";
import which from "which";
import {
  CommitJobDocument,
  CommitJobMutation,
  CommitJobMutationVariables,
  File_Type_Enum_Enum,
  UpdateJobProgressDocument,
  UpdateJobProgressMutation,
  UpdateJobProgressMutationVariables,
} from "./generated/graphql";
import { Client } from "@urql/core";
import fsProm from "fs/promises";
import { Logger } from "tslog";

const processorLog = new Logger({ name: "processor" });
const ytdlLog = processorLog.getChildLogger({ name: "youtube-dl" });
const ffmpegLog = processorLog.getChildLogger({ name: "ffmpeg" });

if (!process.env.TEMP_DIR) {
  process.env.TEMP_DIR = "/tmp/audio-hq/storage";
}

const kBaseDir = process.env.TEMP_DIR;

try {
  processorLog.silly("Creating temporary directory");
  fsSync.mkdirSync(kBaseDir, { recursive: true });
} catch (e) {
  // do nothing; already exists.
}

processorLog.silly("Searching for youtube-dl");
const _found_path =
  which.sync("yt-dlp", { nothrow: true }) ??
  which.sync("youtube-dl", { nothrow: true });
if (!_found_path) {
  throw new Error("Youtube-DL not found!");
}

const ytdlPath: string = _found_path;
processorLog.silly("youtube-dl found");

interface FileOptions {
  name: string;
  workspace: string;
  path?: string[];
  description?: string;
}

export class Processor {
  private _client: Client;

  constructor(client: Client) {
    this._client = client;
  }

  private async updateProgress(
    jobId: string,
    progress: number,
    progressStage: string
  ) {
    processorLog.silly(
      `Updating job progress for ${jobId} to ${progressStage}:${progress}`
    );
    await this._client
      .mutation(UpdateJobProgressDocument, {
        jobId,
        progress,
        progressStage,
      })
      .toPromise();
  }

  async saveInput(input_b64: string) {
    const b64 = input_b64.replace(/^data:.*?;base64,/, "");
    const type = input_b64
      .replace(/;base64,.*$/, "")
      .replace(/^data:.*?\//, "");
    const uuid = v4();
    const outPath = path.join(kBaseDir, uuid + "." + type);
    processorLog.debug("Saving input to file", outPath);
    await fsProm.writeFile(outPath, b64, "base64url");
    processorLog.silly("File written");
    return outPath;
  }

  async addFile(
    id: string,
    filepath: string,
    { name, workspace, path, description }: FileOptions
  ): Promise<string> {
    processorLog.debug(`Saving file ${filepath} to S3 + Database...`);
    const duration = await getAudioDurationInSeconds(filepath);
    processorLog.silly(`Got ${filepath} as ${duration} seconds long`);

    this.updateProgress(id, 0, "saving");

    processorLog.silly(`Saving to S3...`);
    const dlurl = await AppFS.write(
      filepath,
      id,
      "audio/ogg",
      (progress) => progress && this.updateProgress(id, progress, "saving")
    );
    processorLog.silly(`Saved to S3`);

    const file: CommitJobMutationVariables["file"] = {
      name: name,
      path: path ?? [],
      type: File_Type_Enum_Enum.Audio,
      length: duration,
      description: description,
      workspace_id: workspace,
      provider_id: id,
      download_url: dlurl,
      ordering: null,
    };

    processorLog.silly(`Committing to database...`);
    const ret = await this._client
      .mutation<CommitJobMutation, CommitJobMutationVariables>(
        CommitJobDocument,
        {
          jobId: id,
          file,
        }
      )
      .toPromise();

    processorLog.silly(`Job committed`);
    return id;
  }

  async download(
    url: string,
    id: string,
    options?: ConvertOptions
  ): Promise<string> {
    const basedir = kBaseDir;

    try {
      await fs.mkdir(basedir);
    } catch (e) {
      // ignore
    }

    const uuid = uuidv4();

    const outPath = path.join(basedir, uuid + ".%(ext)s");
    processorLog.debug(`Downloading ${url} with pattern ${outPath}`);

    this.updateProgress(id, 0, "downloading");

    return new Promise<string>((resolve, reject) => {
      const ytdl = spawn(
        ytdlPath,
        ["--no-playlist", "-x", "-f", "bestaudio/best", "-o", outPath, url],
        {
          cwd: basedir,
        }
      );

      ytdl.stdout.on("data", (data: string) => {
        ytdlLog.silly(data.toString());
        const foundPercent = data
          .toString()
          .match(/\[download\]\s*(\d+\.\d+)%/);
        if (id && foundPercent?.[1]) {
          this.updateProgress(
            id,
            parseFloat(foundPercent[1]) / 100,
            "downloading"
          );
        }
      });

      ytdl.stderr.on("data", (data) => {
        ytdlLog.warn(data);
      });

      ytdl.on("close", (code) => {
        if (code !== 0) {
          reject(code);
        } else {
          ytdlLog.info("Done");
          fs.readdir(basedir)
            .then((files) => files.find((f) => f.startsWith(uuid)))
            .then((file) => {
              if (!file) return null;
              else return this.convert(path.join(basedir, file), id, options);
            })
            .then((converted) => {
              if (!converted) reject("Conversion failed");
              else resolve(converted);
            });
        }
      });
    });
  }

  async convert(
    input: string,
    id: string,
    options?: ConvertOptions
  ): Promise<string> {
    const basedir = kBaseDir;

    try {
      await fs.mkdir(basedir);
    } catch (e) {
      // ignore
    }

    const uuid = uuidv4();

    const outPath = path.join(basedir, uuid + ".ogg");
    processorLog.debug(`Converting ${input} to ${outPath}`);

    this.updateProgress(id, 0, "converting");

    return new Promise<string>((resolve, reject) => {
      let cmd = ffmpeg(input).noVideo().audioQuality(3);

      let length = 1;
      let ofDuration = 1;

      const complexFilter: (FilterSpecification | string)[] = [
        { filter: "anull", inputs: ["0:a:0"], outputs: ["audio"] },
      ];

      if (options?.cut) {
        ofDuration = options.cut.end - options.cut.start;

        complexFilter.push({
          filter: "atrim",
          options: {
            start: options.cut.start,
            end: options.cut.end,
          },
          inputs: ["audio"],
          outputs: ["audio"],
        });
      }

      if (options?.fadeIn) {
        complexFilter.push("aevalsrc=0:d=" + options.fadeIn + " [ain_silence]");
        complexFilter.push({
          filter: "acrossfade",
          options: { d: options.fadeIn, curve1: "losi", curve2: "losi" },
          inputs: ["ain_silence", "audio"],
          outputs: ["audio"],
        });
      }

      if (options?.fadeOut) {
        complexFilter.push(
          "aevalsrc=0:d=" + options.fadeOut + " [aout_silence]"
        );
        complexFilter.push({
          filter: "acrossfade",
          options: { d: options.fadeOut, curve1: "losi", curve2: "losi" },
          inputs: ["audio", "aout_silence"],
          outputs: ["audio"],
        });
      }

      complexFilter.push({
        filter: "asetpts",
        options: "PTS-STARTPTS",
        inputs: ["audio"],
      });
      // complexFilter.push({ filter: 'anull', inputs: ['audio'] });

      cmd = cmd.complexFilter(complexFilter);

      cmd
        .on("error", async (err) => {
          reject(err);
        })
        .on("end", async () => {
          await fs.unlink(input);
          resolve(outPath);
        })
        .on("codecData", (info) => {
          ffmpegLog.silly("Got codec info", info);
          length = fromTimestamp(info.duration);
        })
        .on("progress", (info) => {
          ffmpegLog.silly("Got progress", info.percent);
          const percentBoost =
            options?.cut && ofDuration < length ? length / ofDuration : 1;
          this.updateProgress(
            id,
            (info.percent / 100) * percentBoost,
            "converting"
          );
        })
        .save(outPath);
    });
  }
}

function fromTimestamp(ffmpegTimestamp: string): number {
  const [hour, minute, seconds] = ffmpegTimestamp.split(":").map(parseFloat);
  return hour * 3600 + minute * 60 + seconds;
}

async function getAudioDurationInSeconds(filepath: string): Promise<number> {
  const ffprobe = await new Promise<string>((resolve, reject) => {
    which("ffprobe", (err, path) => {
      if (err || !path) {
        reject(err);
      } else {
        resolve(path);
      }
    });
  });

  return new Promise<number>((resolve, reject) => {
    const child = spawn(ffprobe, [
      "-v",
      "error",
      "-select_streams",
      "a:0",
      "-show_format",
      "-show_streams",
      "-i",
      filepath,
    ]);
    let result = "";
    child.stdout.on("data", function (data) {
      result += data.toString();
    });
    child.on("close", () => {
      const search = "duration=";
      let idx = result.indexOf(search);
      if (idx === -1) {
        reject();
        return;
      }
      idx += search.length;
      const eol = result.indexOf("\n", idx);
      const subs = result.substring(idx, eol);
      resolve(parseFloat(subs));
    });
  });
}
