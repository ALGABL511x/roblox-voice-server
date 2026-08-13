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

        socket.on('offer', (data) => {
            socket.to(data.target).emit('offer', { offer: data.offer, sender: userId });
        });

        socket.on('answer', (data) => {
            socket.to(data.target).emit('answer', { answer: data.answer, sender: userId });
        });

        socket.on('ice-candidate', (data) => {
            socket.to(data.target).emit('ice-candidate', { candidate: data.candidate, sender: userId });
        });

        socket.on('disconnect', () => {
            socket.broadcast.emit('user-disconnected', userId);
        });
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Voice Server is running on port ' + PORT);
});
