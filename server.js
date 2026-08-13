const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// صفحة المايك والواجهة مدمجة مباشرة هنا لتجنب أي مشاكل في المسارات
const htmlPage = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VoiceBlox</title>
    <style>
        body { background: #111; color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; margin: 0; }
        .btn { border: none; width: 150px; height: 150px; border-radius: 50%; cursor: pointer; font-size: 40px; transition: 0.3s; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
        .off { background: #2563eb; }
        .on { background: #dc2626; }
        h2 { margin-bottom: 20px; font-size: 22px; }
    </style>
</head>
<body>
    <h2 id="status">المايك مغلق</h2>
    <button id="micBtn" class="btn off" onclick="toggleMic()">🎙️</button>
    <script src="/socket.io/socket.io.js"></script>
    <script>
        const socket = io();
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        let localStream = null;

        if (userId) {
            socket.emit('join-room', userId);
        }

        async function toggleMic() {
            const btn = document.getElementById('micBtn');
            if (!localStream) {
                try {
                    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    btn.className = "btn on";
                    document.getElementById('status').innerText = "المايك شغال (يسمعونك)";
                } catch (err) {
                    alert("الرجاء السماح للبرنامج بالوصول للميكروفون من إعدادات المتصفح");
                }
            } else {
                localStream.getTracks().forEach(t => t.stop());
                localStream = null;
                btn.className = "btn off";
                document.getElementById('status').innerText = "المايك مغلق";
            }
        }
    </script>
</body>
</html>
`;

// إرسال الصفحة مباشرة لأي رابط يتم فتحه
app.get('*', (req, res) => {
    res.send(htmlPage);
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
