import express from 'express';
import { initWs } from './ws';

const app = express();
const httpServer = app.listen(3000, ()=>console.log('server started on port 3000'));

app.get('/connect', (req, res)=>{
    initWs(httpServer);  // initiates a websocket connection
    res.send('connection established');
});

// TODO:
// 1. newbox - when a new box is creating...if its done, navigates to coding page else shows loading... on screen
// 2. file-click - if its a file, show its content on code editor
//                     else expand its directory
// 3. coding - sends the code writing on the web to container and s3
// 4. terminal-write - sends command and receives output
// 5. close-inbrowser - closes the browser present inside the webapp
// 5. opens-inbrowser - opens the browser present inside the webapp

