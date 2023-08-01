import fsProm from 'fs/promises';
import fs from 'fs';

import AWS, { Endpoint } from 'aws-sdk';
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

const S3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    ...(process.env.AWS_ENDPOINT_URL
        ? {
              endpoint: new Endpoint(process.env.AWS_ENDPOINT_URL),
              s3ForcePathStyle: true,
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

    async createPresignedUpload(fileSize: number, mimeType: string): Promise<string> {
        // TODO
        return S3.createPresignedPost({
            ...this.defaultParams,
            Conditions: [
                {
                    'Content-Length': fileSize,
                },
                {
                    'Content-Type': mimeType,
                },
            ],
        }).url;
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
        const upload = new AWS.S3.ManagedUpload({
            service: S3,
            params: {
                ...this.defaultParams,
                Key: id,
                ContentType: contentType,
                ContentLength: size,
                Body: stream,
                ACL: 'public-read',
            },
        });

        upload.on('httpUploadProgress', (progress) => onProgress?.(progress.loaded / (progress.total ?? size)));

        const data = await upload.promise();

        return data.Location;
    }
}
