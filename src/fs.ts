import {writeFile, existsSync, mkdirSync} from 'fs';
const fs = require('fs');
const path = require('path');


export function WriteFile(filePath: string, fileContent: string): Promise<void> {
    // checks if the folder exists, if not creates one.
    const p = path.dirname(filePath);
    if(!existsSync(p)) {
        mkdirSync(p, {recursive: true});
        console.log(`directory ${p} created`);
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

type resultType = {
    name?: string,
    path?: string,
    isFolder?: boolean,
    items?: resultType[]
}

export async function generateFileStructure(dirPath: string) {
  let result:resultType = {};
  result["name"] = path.basename(dirPath);
  result["path"] = path.resolve(dirPath);

  const op = await isDirectory(dirPath);
  if(op === false) {
    result["isFolder"] = false;
    return result;
  }

  if(op === true){
    result["isFolder"] = true;
    result['items'] = await readFiles(dirPath);
  }

  return result;
}


function readFiles(dirPath: string): Promise<resultType[]> {
  return new Promise((resolve, reject)=>{
    try {
      fs.readdir(dirPath, {withFileTypes:true}, (err:any, files:any)=>{
        const items: resultType[] = [];
        files?.map((file: any)=>{
          if(file.isDirectory()) {
            items.push({name: file.name, isFolder: file.isDirectory(), path: path.resolve(file.path, file.name), items: []});
          }
          else {
            items.push({name: file.name, isFolder: file.isDirectory(), path: path.resolve(file.path, file.name)});
          }
        });
        resolve(items);
      })
    } catch (error) {
      reject(error);
    }
  })
}

function isDirectory(dirPath:string) {
  return new Promise((resolve, reject) => {
    if(!fs.existsSync(dirPath)) {
      reject('path not exists');
      return;
    }
  
    fs.stat(dirPath, (err:any, stats: any)=>{
      if(err) {
        reject(err);
        return;
      }
  
      if(stats.isDirectory()) {
        resolve(true);
      }
      else resolve(false);
    })
  })
}
