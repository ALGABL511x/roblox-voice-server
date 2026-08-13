const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    socket.on('join-room', (userId) => {
        socket.join(userId);
    });

    socket.on('signal', (data) => {
        socket.to(data.target).emit('signal', { sender: data.sender, data: data.data });
    });
});

http.listen(process.env.PORT || 3000, () => {
    console.log('Server is running');
});
