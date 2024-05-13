import { WebSocket, WebSocketServer } from 'ws';

export function initWs(httpServer:any) {
    const wss = new WebSocketServer({server: httpServer});
    wss.on('connection', (ws: WebSocket)=>{
        ws.on('error', console.error);
    
        ws.send('a new connection established');

        socketHandlers(ws);
    });
}

function socketHandlers(ws:WebSocket) {
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

