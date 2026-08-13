const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('مستخدم متصل:', socket.id);

    socket.on('join-room', (userId) => {
        socket.join(userId);
        console.log(`اللاعب ${userId} دخل غرفة الصوت`);
    });

    socket.on('disconnect', () => {
        console.log('مستخدم طلع:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
