const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// إجبار السيرفر على قراءة ملف index.html من نفس المجلد
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('join-room', (userId) => {
        socket.join(userId);
    });

    socket.on('signal', (data) => {
        socket.to(data.target).emit('signal', { sender: data.sender, data: data.data });
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
