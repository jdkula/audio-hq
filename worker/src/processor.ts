// import fs from "promise-fs";
// import path from "path";
//
// import { v4 as uuidv4 } from "uuid";
// import ffmpeg, { FilterSpecification } from "fluent-ffmpeg";
// import { ObjectId } from "mongodb";
// import { findOrCreateWorkspace } from "~/../../frontend/pages/api/[ws]";
// import mongoworkspaces from "../../frontend/lib/db/mongoworkspaces";
// import { File } from "./Workspace";
//
// import { spawn } from "child_process";
// import Jobs from "./Jobs";
// import Job from "./Job";
// import { AppFS } from "../filesystems/FileSystem";
// import ConvertOptions from "../../frontend/lib/ConvertOptions";
// import which from "which";
//
// if (typeof global === undefined) {
//   throw new Error("processor.ts should never be imported in client side code!");
// }
//
// if (!process.env.TEMP_DIR) {
//   process.env.TEMP_DIR = "/tmp/audio-hq/storage";
// }
//
// const kBaseDir = process.env.TEMP_DIR;
//
// try {
//   fs.mkdirSync(kBaseDir, { recursive: true });
// } catch (e) {
//   // do nothing; already exists.
// }
//
// const _found_path =
//   which.sync("yt-dlp", { nothrow: true }) ??
//   which.sync("youtube-dl", { nothrow: true });
// if (!_found_path) {
//   throw new Error("Youtube-DL not found!");
// }
//
// const ytdlPath: string = _found_path;
//
// interface FileOptions {
//   name: string;
//   workspace: string;
//   path?: string[];
//   description?: string;
// }
//
// export async function addFile(
//   id: string,
//   filepath: string,
//   { name, workspace, path, description }: FileOptions
// ): Promise<string> {
//   const duration = await getAudioDurationInSeconds(filepath);
//
//   const file: File = {
//     id,
//     name: name,
//     path: path ?? [],
//     type: "audio",
//     length: duration,
//     description: description,
//   };
//
//   await findOrCreateWorkspace(workspace);
//
//   Jobs.set(id, (job) => ({ ...job, status: "saving" }));
//
//   await AppFS.write(
//     filepath,
//     id,
//     (progress) => progress && Jobs.set(id, (job) => ({ ...job, progress }))
//   );
//
//   await (
//     await mongoworkspaces
//   ).updateOne({ _id: workspace }, { $push: { files: file } });
//
//   return id;
// }
//
// export function processFile(
//   { name, workspace, path, description }: FileOptions,
//   filePath: (id: string) => Promise<string>
// ): Job {
//   const id = new ObjectId().toHexString();
//
//   const job: Job = {
//     jobId: id,
//     progress: 0,
//     status: "started",
//     name: name,
//     workspace: workspace,
//   };
//
//   (async () => {
//     try {
//       const filepath = await filePath(id);
//       await addFile(id, filepath, { name, workspace, path, description });
//       Jobs.set(id, (job) => ({ ...job, status: "done", result: id }));
//     } catch (e: unknown) {
//       const err = e as Error;
//       Jobs.set(id, (job) => ({
//         ...job,
//         status: "error",
//         errorInfo: err.toString(),
//       }));
//     }
//   })();
//
//   Jobs.set(id, job);
//
//   return job;
// }
//
// export async function download(
//   url: string,
//   id?: string,
//   options?: ConvertOptions
// ): Promise<string> {
//   const basedir = kBaseDir;
//
//   try {
//     await fs.mkdir(basedir);
//   } catch (e) {
//     // ignore
//   }
//
//   const uuid = uuidv4();
//
//   const outPath = path.join(basedir, uuid + ".%(ext)s");
//
//   id && Jobs.set(id, (job) => ({ ...job, status: "downloading" }));
//
//   return new Promise<string>((resolve, reject) => {
//     const ytdl = spawn(
//       ytdlPath,
//       ["--no-playlist", "-x", "-f", "bestaudio/best", "-o", outPath, url],
//       {
//         cwd: basedir,
//       }
//     );
//
//     ytdl.stdout.on("data", (data: string) => {
//       console.log("ytdl stdout: " + data);
//       const foundPercent = data.toString().match(/\[download\]\s*(\d+\.\d+)%/);
//       if (id && foundPercent?.[1]) {
//         Jobs.set(id, (job) => ({
//           ...job,
//           progress: parseFloat(foundPercent[1]) / 100,
//         }));
//       }
//     });
//
//     ytdl.stderr.on("data", (data) => {
//       console.log("ytdl stderr: " + data);
//     });
//
//     ytdl.on("close", (code) => {
//       if (code !== 0) {
//         reject(code);
//       } else {
//         fs.readdir(basedir)
//           .then((files) => files.find((f) => f.startsWith(uuid)))
//           .then((file) => {
//             if (!file) return null;
//             else return convert(path.join(basedir, file), id, options);
//           })
//           .then((converted) => {
//             if (!converted) reject("Conversion failed");
//             else resolve(converted);
//           });
//       }
//     });
//   });
// }
//
// export async function convert(
//   input: string,
//   id?: string,
//   options?: ConvertOptions
// ): Promise<string> {
//   const basedir = kBaseDir;
//
//   try {
//     await fs.mkdir(basedir);
//   } catch (e) {
//     // ignore
//   }
//
//   const uuid = uuidv4();
//
//   const outPath = path.join(basedir, uuid + ".mp3");
//
//   id && Jobs.set(id, (job) => ({ ...job, status: "converting" }));
//
//   return new Promise<string>((resolve, reject) => {
//     let cmd = ffmpeg(input).noVideo().audioQuality(3);
//
//     let length = 1;
//     let ofDuration = 1;
//
//     const complexFilter: (FilterSpecification | string)[] = [
//       { filter: "anull", inputs: ["0:a:0"], outputs: ["audio"] },
//     ];
//
//     if (options?.cut) {
//       ofDuration = options.cut.end - options.cut.start;
//
//       complexFilter.push({
//         filter: "atrim",
//         options: {
//           start: options.cut.start,
//           end: options.cut.end,
//         },
//         inputs: ["audio"],
//         outputs: ["audio"],
//       });
//     }
//
//     if (options?.fadeIn) {
//       complexFilter.push("aevalsrc=0:d=" + options.fadeIn + " [ain_silence]");
//       complexFilter.push({
//         filter: "acrossfade",
//         options: { d: options.fadeIn, curve1: "losi", curve2: "losi" },
//         inputs: ["ain_silence", "audio"],
//         outputs: ["audio"],
//       });
//     }
//
//     if (options?.fadeOut) {
//       complexFilter.push("aevalsrc=0:d=" + options.fadeOut + " [aout_silence]");
//       complexFilter.push({
//         filter: "acrossfade",
//         options: { d: options.fadeOut, curve1: "losi", curve2: "losi" },
//         inputs: ["audio", "aout_silence"],
//         outputs: ["audio"],
//       });
//     }
//
//     complexFilter.push({
//       filter: "asetpts",
//       options: "PTS-STARTPTS",
//       inputs: ["audio"],
//     });
//     // complexFilter.push({ filter: 'anull', inputs: ['audio'] });
//
//     cmd = cmd.complexFilter(complexFilter);
//
//     cmd
//       .on("error", async (err) => {
//         reject(err);
//       })
//       .on("end", async () => {
//         await fs.unlink(input);
//         resolve(outPath);
//       })
//       .on("codecData", (info) => {
//         length = fromTimestamp(info.duration);
//       })
//       .on("progress", (info) => {
//         const percentBoost =
//           options?.cut && ofDuration < length ? length / ofDuration : 1;
//         id &&
//           Jobs.set(id, (job) => ({
//             ...job,
//             progress: (info.percent / 100) * percentBoost,
//           }));
//       })
//       .save(outPath);
//   });
// }
//
// function fromTimestamp(ffmpegTimestamp: string): number {
//   const [hour, minute, seconds] = ffmpegTimestamp.split(":").map(parseFloat);
//   return hour * 3600 + minute * 60 + seconds;
// }
//
// async function getAudioDurationInSeconds(filepath: string): Promise<number> {
//   const ffprobe = await new Promise<string>((resolve, reject) => {
//     which("ffprobe", (err, path) => {
//       if (err || !path) {
//         reject(err);
//       } else {
//         resolve(path);
//       }
//     });
//   });
//
//   return new Promise<number>((resolve, reject) => {
//     const child = spawn(ffprobe, [
//       "-v",
//       "error",
//       "-select_streams",
//       "a:0",
//       "-show_format",
//       "-show_streams",
//       "-i",
//       filepath,
//     ]);
//     let result = "";
//     child.stdout.on("data", function (data) {
//       result += data.toString();
//     });
//     child.on("close", () => {
//       const search = "duration=";
//       let idx = result.indexOf(search);
//       if (idx === -1) {
//         reject();
//         return;
//       }
//       idx += search.length;
//       const eol = result.indexOf("\n", idx);
//       const subs = result.substring(idx, eol);
//       resolve(parseFloat(subs));
//     });
//   });
// }
