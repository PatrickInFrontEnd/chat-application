const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { initializeListeners } = require("./server.utils");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.resolve(__dirname, "public")));

const users = {};
const userNames = {};

io.on("connection", (socket) => {
    console.log("New socket connected");

    initializeListeners(socket, { users, userNames });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port:", PORT);
    console.log("Go to your site");
});
