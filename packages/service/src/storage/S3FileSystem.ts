import fsProm from 'fs/promises';
import fs from 'fs';

import { S3 as S3Client, PutObjectCommand, type CompleteMultipartUploadOutput } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'node:stream';

if (process.env.S3_BUCKET_NAME === undefined) {
    throw new Error('S3_BUCKET_NAME environment variable must be defined!');
}
if (process.env.AWS_ACCESS_KEY_ID === undefined) {
    throw new Error('AWS_ACCESS_KEY_ID environment variable must be defined!');
}
if (process.env.AWS_SECRET_ACCESS_KEY === undefined) {
    throw new Error('AWS_SECRET_ACCESS_KEY environment variable must be defined!');
}

const S3 = new S3Client({
    region: 'us-west-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    ...(process.env.AWS_ENDPOINT_URL
        ? {
              endpoint: process.env.AWS_ENDPOINT_URL as string,
              forcePathStyle: true,
          }
        : {}),
});

export default class S3FileSystem {
    constructor(private readonly _bucket: string = process.env.S3_BUCKET_NAME as string) {}

    get defaultParams() {
        return {
            Bucket: this._bucket,
        };
    }

    async createPresignedUpload(id: string, fileSize: number, mimeType: string): Promise<string> {
        const command = new PutObjectCommand({
            ...this.defaultParams,
            Key: id,
            ContentType: mimeType,
            ContentLength: fileSize,
            ACL: 'public-read',
        });
        return getSignedUrl(S3, command, { expiresIn: 3600 });
    }

    async delete(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            S3.deleteObject(
                {
                    ...this.defaultParams,
                    Key: id,
                },
                (err) => {
                    if (err) reject(err);
                    else resolve();
                },
            );
        });
    }

    async write(
        filepath: string,
        id: string,
        contentType: string,
        onProgress?: ((progress: number | undefined) => void) | undefined,
    ): Promise<string> {
        const size = (await fsProm.stat(filepath)).size;
        return await this.writeFromMemory(fs.createReadStream(filepath), size, id, contentType, onProgress);
    }

    async writeFromMemory(
        stream: Readable | Uint8Array,
        size: number,
        id: string,
        contentType: string,
        onProgress?: ((progress: number | undefined) => void) | undefined,
    ): Promise<string> {
        const upload = new Upload({
            client: S3,
            params: {
                ...this.defaultParams,
                Key: id,
                ContentType: contentType,
                ContentLength: size,
                Body: stream,
                ACL: 'public-read',
            },
        });

        console.warn({
            client: S3,
            params: {
                ...this.defaultParams,
                Key: id,
                ContentType: contentType,
                ContentLength: size,
                Body: stream,
                ACL: 'public-read',
            },
        });

        upload.on(
            'httpUploadProgress',
            (progress) => progress.loaded && progress.total && onProgress?.(progress.loaded / (progress.total ?? size)),
        );

        const data = (await upload.done()) as CompleteMultipartUploadOutput;
        if (typeof data.Location !== 'string') {
            throw new Error('Failed upload');
        }

        return data.Location;
    }
}
