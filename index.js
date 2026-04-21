const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("User:", socket.id);

    socket.on("join_room", (room) => {
        socket.join(room);
    });

    socket.on("send_message", (data) => {
        io.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("Left:", socket.id);
    });
});

app.get("/", (req, res) => {
    res.send("Server alive");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Running on", PORT));