import FileSystem, { FileInfo } from './FileSystem';
import { mongofiles } from '../db';
import { ObjectId } from 'mongodb';

import fs from 'promise-fs';

export default class MongoDBFileSystem implements FileSystem {
    async read(id: string): Promise<FileInfo> {
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

    async delete(id: string): Promise<void> {
        const fs = await mongofiles;

        await new Promise((resolve, reject) => {
            fs.delete(new ObjectId(id), (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    async write(
        filepath: string,
        id: string,
        onProgress?: ((progress: number | undefined) => void) | undefined,
    ): Promise<void> {
        const upload = (await mongofiles).openUploadStreamWithId(new ObjectId(id), filepath);
        const size = (await fs.stat(filepath)).size;
        let uploaded = 0;

        await new Promise((resolve, reject) => {
            fs.createReadStream(filepath)
                .on('data', (chunk) => {
                    uploaded += chunk.length;
                    onProgress?.(size / uploaded);
                })
                .pipe(upload)
                .on('error', (error) => {
                    if (error) reject(error);
                })
                .on('finish', () => {
                    resolve();
                });
        });
    }
}
