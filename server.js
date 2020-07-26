const cors = require("cors");
const bodyparser = require("body-parser");
const enforce = require("express-sslify");
const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const { initializeListeners } = require("./server.utils");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV === "production") {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
}
app.use(express.static(path.resolve(__dirname, "public"), { root: __dirname }));

const server = http.createServer(app);
const io = socketio(server);

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
