function initializeListeners(socket, { users, userNames }) {
    socket.on("join-request", ({ name }) => {
        if (userNames[name]) {
            socket.emit("nick-already-used", { name });
        } else {
            socket.emit("join-success", { name });
        }
    });

    socket.on("new-user", ({ name }) => handleNewUserConnection(name, socket));

    socket.on("send-chat-message", (msg) => handleSendMessage(msg, socket));

    socket.on("disconnect", () => {
        socket.broadcast.emit("user-disconnected", users[socket.id]);

        const username = users[socket.id];
        console.log(`User called '${username}' has left the chat.`);

        delete userNames[username];
        delete users[socket.id];
    });

    function handleSendMessage(message, socket) {
        socket.broadcast.emit("chat-message", {
            message,
            name: users[socket.id],
        });
    }

    function handleNewUserConnection(name, socket) {
        console.log("New user", name);
        users[socket.id] = name;
        userNames[name] = name;
        socket.broadcast.emit("user-connected", name);
    }
}

module.exports = { initializeListeners };
