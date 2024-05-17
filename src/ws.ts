import { WebSocket, WebSocketServer } from 'ws';
import { getInitFiles } from './aws';
import path from 'path';

export function initWs(httpServer:any) {
    const wss = new WebSocketServer({server: httpServer});
    wss.on('connection', async (ws: WebSocket, req)=>{
        const boxId = req.url?.split('=')[1] || "";
        ws.on('error', console.error);
        
        await getInitFiles(boxId, path.join(__dirname, '..', 'codebox', boxId));
        ws.send(JSON.stringify({event: 'loaded'}))
        socketHandlers(ws);
    });
}

function socketHandlers(ws:WebSocket) {
    ws.on('close', ()=>{
        console.log('socket closed');
    });

    // WORKING
    // copy codebox folder from s3 to local machine and send the current folder structure to fronend via websocket

    ws.on('message', (data:any)=>{
        const message = JSON.parse(data);
        if(message.event === 'newbox') {
            // copyCodeFromS3()
            // install dependencies
            //sends current file structure
        }
        else if(message.event === 'file-click') {
            //fires when clicked on file explorer.
            // if (file) {
            //     return fileContent
            // }
            // else {    
            //     return files in the current folder 
            // }
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
    });
}

