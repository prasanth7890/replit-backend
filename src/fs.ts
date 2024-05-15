import {writeFile, existsSync, mkdirSync} from 'fs';
import {dirname} from 'path';

export function WriteFile(filePath: string, fileContent: string): Promise<void> {
    // checks if the folder exists, if not creates one.
    const path = dirname(filePath);
    if(!existsSync(path)) {
        mkdirSync(path, {recursive: true});
        console.log(`directory ${path} created`);
    }

    return new Promise((resolve, reject)=>{
        writeFile(filePath, fileContent, (err: any)=>{
            if(err) {
                reject(err);
            }
            resolve();
        })
    })
}