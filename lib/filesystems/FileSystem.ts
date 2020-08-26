import { Readable } from 'stream';
import RealFSFileSystem from './RealFSFileSystem';
import S3FileSystem from './S3FileSystem';

export interface ReadableInfo {
    stream: Readable | Buffer | string;
    length: number;
}

export interface Redirect {
    redirect: string;
}

export type FileInfo = ReadableInfo | Redirect;

export function isRedirect(info: FileInfo): info is Redirect {
    return Object.keys(info).includes('redirect');
}

export default interface FileSystem {
    write(filepath: string, id: string, onProgress?: (progress: number | undefined) => void): Promise<void>;
    read(id: string): Promise<FileInfo>;
    delete(id: string): Promise<void>;
}

export const AppFS: FileSystem = new S3FileSystem();
