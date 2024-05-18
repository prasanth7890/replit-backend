import { config } from "dotenv";
config();

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { WriteFile } from "./fs";
import { join } from "path";

// TODO;
// DONE - getInitFiles
// copys3folder
// savetos3

const client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  },
});

//example - await getInitFiles( boxid , join(__dirname , '..', 'codebox', "boxname"));
export async function getInitFiles(boxId: string, localpath: string) {
  try {
    const input = {
      Bucket: process.env.BUCKET, // required
      Prefix: `code/${boxId}`, // required - eg. bucket/boxid
    };

    const command = new ListObjectsV2Command(input);
    const response = await client.send(command);

    if (response.Contents) {
      await Promise.all(
        response.Contents.map(async (file) => {
          if (file.Key) {
            const input = {
              Bucket: process.env.BUCKET, // required
              Key: file.Key, // required
            };

            const command = new GetObjectCommand(input);
            const response = await client.send(command);

            if (response.Body) {
              const content = await response.Body?.transformToString();
              await WriteFile(
                `${localpath}/${file.Key.split("/").pop()}`,
                content
              );
              console.log(`file downloaded - ${file.Key?.split("/").pop()}`);
            }
          }
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
}

// @example
// source - init/node , destination - code/boxname
export async function copyS3Folder(
  sourcePath: string,
  destinationPath: string
) {
  try {
    const input = {
      Bucket: process.env.BUCKET, // required - process.env.bucket
      Prefix: sourcePath, // required
    };

    const command = new ListObjectsV2Command(input);
    const response = await client.send(command);
    if (response.Contents) {
      await Promise.all(
        response.Contents.map(async (object) => {
          if (object.Key) {
            const copyCommand = new CopyObjectCommand({
              CopySource: `${process.env.BUCKET}/${object.Key}`,
              Bucket: process.env.BUCKET,
              Key: `${destinationPath}/${object.Key.split("/").pop()}`,
            });

            await client.send(copyCommand);
          }
        })
      );
      console.log(
        `Done Copying files from ${sourcePath} to ${destinationPath}`
      );
    }
  } catch (error) {
    console.log(error);
  }
}

// returns true if the box is present in s3, else returns false
// FIXME returning false even if the boxId is present in s3
export async function isBoxPresentInS3(boxId: string): Promise<boolean> {
  try {
    const input = {
      Bucket: process.env.BUCKET, // required - process.env.bucket
      Prefix: "code/",
      Delimiter: "/",
    };

    const command = new ListObjectsV2Command(input);
    const response = await client.send(command);

    let isPresent = false;
    if (response.CommonPrefixes) {
      for(const commonPrefix of response.CommonPrefixes) {
        if (commonPrefix.Prefix) {
          const folderName = commonPrefix.Prefix.split("/")[1];
          if (folderName === boxId) {
            isPresent = true;
            break;
          }
        }
      }
    }

    return isPresent;
  } catch (error) {
    console.log(error);
    return true;
  }
}