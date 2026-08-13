const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let players = {};

app.post("/update-positions", (req, res) => {
    const data = req.body;
    if (Array.isArray(data)) {
        data.forEach(p => {
            players[p.userId] = {
                username: p.username,
                x: p.position.x,
                y: p.position.y,
                z: p.position.z
            };
        });
        io.emit("positionsUpdate", players);
    }
    res.sendStatus(200);
});

io.on("connection", (socket) => {
    socket.on("join-room", (userId) => {
        socket.userId = userId;
        socket.join("voice-room");
        socket.broadcast.emit("user-connected", userId);
    });

    socket.on("disconnect", () => {
        if (socket.userId) {
            delete players[socket.userId];
            io.emit("user-disconnected", socket.userId);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
