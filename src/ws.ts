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
        if(message.event === 'new-box') {
         
         ws.send('creating new box...');
        }
    })
}

