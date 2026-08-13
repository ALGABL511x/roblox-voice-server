const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// قراءة ملف الـ HTML مباشرة
app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    socket.on('join-room', (userId) => {
        socket.join(userId);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Server is running');
});
