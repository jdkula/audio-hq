import FileSystem, { FileInfo } from "./FileSystem";

import fsProm from "fs/promises";
import fs from "fs";

import AWS, { Endpoint } from "aws-sdk";

if (process.env.S3_BUCKET_NAME === undefined) {
  throw new Error("S3_BUCKET_NAME environment variable must be defined!");
}
if (process.env.AWS_ACCESS_KEY_ID === undefined) {
  throw new Error("AWS_ACCESS_KEY_ID environment variable must be defined!");
}
if (process.env.AWS_SECRET_ACCESS_KEY === undefined) {
  throw new Error(
    "AWS_SECRET_ACCESS_KEY environment variable must be defined!"
  );
}

const defaultParams = {
  Bucket: process.env.S3_BUCKET_NAME,
};

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

export default class S3FileSystem implements FileSystem {
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
        }
      );
    });
  }

  async write(
    filepath: string,
    id: string,
    contentType: string,
    onProgress?: ((progress: number | undefined) => void) | undefined
  ): Promise<string> {
    const size = (await fsProm.stat(filepath)).size;

    const upload = new AWS.S3.ManagedUpload({
      service: S3,
      params: {
        ...defaultParams,
        Key: id,
        ContentType: contentType,
        ContentLength: size,
        Body: fs.createReadStream(filepath),
        ACL: "public-read",
      },
    });

    upload.on("httpUploadProgress", (progress) =>
      onProgress?.(progress.loaded / (progress.total ?? size))
    );

    const data = await upload.promise();

    return data.Location;
  }
}
