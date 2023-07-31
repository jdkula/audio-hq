import { Readable } from 'node:stream';
import S3FileSystem from './S3FileSystem';

export default interface FileSystem {
    write(
        filepath: string,
        id: string,
        contentType: string,
        onProgress?: (progress: number | undefined) => void,
    ): Promise<string>;
    writeFromMemory(
        stream: Readable | Uint8Array,
        size: number,
        id: string,
        contentType: string,
        onProgress?: (progress: number | undefined) => void,
    ): Promise<string>;
    delete(id: string): Promise<void>;
}

export const AppFS: FileSystem = new S3FileSystem();
