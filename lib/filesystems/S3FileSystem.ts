import FileSystem, { FileInfo } from './FileSystem';

import fs from 'promise-fs';

import AWS from 'aws-sdk';

if (process.env.S3_BUCKET_NAME === undefined) {
    throw new Error('S3_BUCKET_NAME environment variable must be defined!');
}
if (process.env.AWS_ACCESS_KEY_ID === undefined) {
    throw new Error('AWS_ACCESS_KEY_ID environment variable must be defined!');
}
if (process.env.AWS_SECRET_ACCESS_KEY === undefined) {
    throw new Error('AWS_SECRET_ACCESS_KEY environment variable must be defined!');
}

const defaultParams = {
    Bucket: process.env.S3_BUCKET_NAME,
};

const S3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default class S3FileSystem implements FileSystem {
    async read(id: string): Promise<FileInfo> {
        return {
            redirect: `https://${defaultParams.Bucket}.s3.amazonaws.com/${id}`,
        };
    }

    async delete(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            S3.deleteObject(
                {
                    ...defaultParams,
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
        onProgress?: ((progress: number | undefined) => void) | undefined,
    ): Promise<void> {
        const size = (await fs.stat(filepath)).size;

        const upload = new AWS.S3.ManagedUpload({
            params: {
                ...defaultParams,
                Key: id,
                ContentType: 'audio/mp3',
                ContentLength: size,
                Body: fs.createReadStream(filepath),
                ACL: 'public-read',
            },
        });

        upload.on('httpUploadProgress', (progress) => onProgress?.(progress.loaded / (progress.total ?? size)));

        await upload.promise();
    }
}
