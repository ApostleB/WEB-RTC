import http from "http";
import express from "express";
import SocketIO from "socket.io"

const PORT = 3000;

const app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + "/views");
app.use('/public', express.static(__dirname + '/public'));

app.get('/',(req, res) => {
    res.render('home');
})


const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on('connection', (socket) => {
    socket.onAny((e) => {
        console.log(`socket Event:${e}`);
    });
    
    socket.on('enter_room', async (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit('welcome')
    });
})

httpServer.listen(PORT, handleListen);


// const wss = new WebSocket.Server({ server });

// const onSocketClose = (socket) => {
//     console.log("Disconnected from the Browser X");
// }

// const sockets = [];

// wss.on('connection', (socket) => {
//     sockets.push(socket);
//     socket['nickname'] = 'anon';
//     console.log("connection to Brower");
//     socket.on('close', onSocketClose )

//     socket.on('message', (msg) => {
//         const message = JSON.parse(msg);
//         switch(message.type){
//             case "new_message":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
//             case "nickname" :
//                 socket['nickname'] = message.payload;
//                 console.log(message.payload);
//         }
//     })
    
// });