import http from "http";
import WebSocket from "ws";
import express from "express";
const PORT = 3000;

const app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + "/views");
app.use('/public', express.static(__dirname + '/public'));

app.get('/',(req, res) => {
    res.render('home');
})


const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);

const server =http.createServer(app);
const wss = new WebSocket.Server({ server });

const onSocketClose = (socket) => {
    console.log("Disconnected from the Browser X");
}

const sockets = [];

wss.on('connection', (socket) => {
    sockets.push(socket);
    socket['nickname'] = 'anon';
    console.log("connection to Brower");
    socket.on('close', onSocketClose )

    socket.on('message', (msg) => {
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
            case "nickname" :
                socket['nickname'] = message.payload;
                console.log(message.payload);
        }
    })
    
});

server.listen(PORT, handleListen);