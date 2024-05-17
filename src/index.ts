import express from 'express';
import { initWs } from './ws';
import { copyS3Folder } from './aws';

const app = express();
app.use(express.json());
const httpServer = app.listen(3000, ()=>console.log('server started on port 3000'));

app.post('/project', async (req, res)=> {
    const {boxId, template} = req.body;
    
    if(!boxId || !template) {
        res.status(400).send('Bad Request');
        return;
    }

    await copyS3Folder(`init/${template}`, `code/${boxId}`);
    res.send('New Project Created');
})

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

// core functional requirements
// WORKING
// - when a box created, code should copy from template/s3/github to the machine
// also send curr file structure for fronend sidebar.

// 1. create a folder codebox if is not existed, now create a folder inside codebox with boxname, 
// 2. now go to the boxfolder, clone the respective repo form github to get initial code.
// 3. install dependencies if any 
// 4. send a message if everything worked out fine through websocket. else send an error event message
