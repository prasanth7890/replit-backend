import {config} from 'dotenv';
config();

import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { WriteFile } from "./fs";
import { join } from 'path';

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

export async function getInitFiles(template: string, localpath: string) {
    try {
        const input = {
          Bucket: process.env.BUCKET, // required
          Prefix: `init/${template}`, // required - eg. bucket/node
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
                  await WriteFile(`${localpath}/${file.Key.split('/').pop()}`, content);
                  console.log(`file downloaded - ${file.Key?.split('/').pop()}`);
                }
              }
            })
          );
        }
    } catch (error) {
        console.log(error);
    }
}

//example - await getInitFiles( 'node' , join(__dirname , '..', 'codebox', "boxname"));