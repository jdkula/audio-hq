import FileSystem, { FileInfo } from './FileSystem';

import fs from 'promise-fs';
import path from 'path';

export default class RealFSFileSystem implements FileSystem {
    private _root: string;

    constructor(storageDir: string) {
        this._root = path.resolve(storageDir);
        try {
            fs.mkdirSync(this._root, { recursive: true });
        } catch (e) {
            // exists, ignore
        }
    }

    private _getPath(id: string): string {
        return path.resolve(this._root, id);
    }

    async read(id: string): Promise<FileInfo> {
        const stat = await fs.stat(this._getPath(id));
        const stream = fs.createReadStream(this._getPath(id));

        return { length: stat.size, stream };
    }

    async delete(id: string): Promise<void> {
        await fs.unlink(this._getPath(id));
    }

    async write(
        filepath: string,
        id: string,
        onProgress?: ((progress: number | undefined) => void) | undefined,
    ): Promise<void> {
        const destination = fs.createWriteStream(this._getPath(id));
        const size = (await fs.stat(filepath)).size;
        let uploaded = 0;

        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(filepath)
                .on('data', (chunk) => {
                    uploaded += chunk.length;
                    onProgress?.(size / uploaded);
                })
                .pipe(destination)
                .on('error', (error) => {
                    if (error) reject(error);
                })
                .on('finish', () => {
                    resolve();
                });
        });
    }
}
