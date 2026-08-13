const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    socket.on('join-room', (userId) => {
        socket.join(userId);
        socket.broadcast.emit('user-connected', userId);

        socket.on('signal', (data) => {
            socket.to(data.target).emit('signal', { sender: userId, data: data.data });
        });

        socket.on('disconnect', () => {
            socket.broadcast.emit('user-disconnected', userId);
        });
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
