import { WebSocket, WebSocketServer } from 'ws';
import { getInitFiles, isBoxPresentInS3 } from './aws';
import { generateFileStructure } from './fs';
import path from 'path';
import fs from 'fs';

export function initWs(httpServer:any) {
    const wss = new WebSocketServer({server: httpServer});
    wss.on('connection', async (ws: WebSocket, req)=>{
        ws.on('error', console.error);

        const boxId = req.url?.split('=')[1] || "";
        const isPresent = await isBoxPresentInS3(boxId); 
        if(isPresent) {
            console.log(`boxId: ${boxId} already exists`);
        }
        else {
            await getInitFiles(boxId, path.join(__dirname, '..', 'codebox', boxId));
        }

        const dirPath: string = path.join(__dirname, '..', 'codebox', boxId);
        const fileStructure = await generateFileStructure(dirPath)

        ws.send(JSON.stringify({event: 'loaded', data: fileStructure}));

        socketHandlers(ws);
    });
}

function socketHandlers(ws:WebSocket) {
    ws.on('close', ()=>{
        console.log('socket closed');
    });

    ws.on('message', (data:any)=>{
        const message = JSON.parse(data);
        if(message.event === 'file-click') {
            // WORKING
            const filePath = message.data;
            const fileName = filePath.split('\\').pop();  // `\` is for windows 
            fs.readFile(filePath, "utf-8", (err, data)=> {
                ws.send(JSON.stringify({event: 'file', data: data, name: fileName}));
                console.log(`file content of ${fileName} sent succesfully`);
            })
        }
        else if(message.event === 'coding') {
            // fires when user edits the opened file in editor
            // add debouncing on fronend
            // take the data coming from browser
            // open the corresponding file and update it with this new data
        }
        else if(message.event === 'terminal-write') {
            //take the keystrokes from frontend 
            //execute the command on server 
            // send the output to frontend 
        }
        else if(message.event === 'folder-click') {
            // when clicked on folder, 
            // sent that folder structure to fronend
        }
    });
}

