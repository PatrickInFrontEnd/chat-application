const socket = io("http://192.168.55.103:5000", { forceNew: true });

const d = document;
const chatContainer = d.querySelector(".messages-container");
const messageForm = d.querySelector("#message-form");
const messageContainer = d.querySelector("#message-data");
const sendButton = d.querySelector("#send-message");
const header = d.querySelector(".welcome");

let name;

while (!name) {
    name = prompt("What's your name?");
}

header.textContent = `Welcome, you joined the chat ${name}`;

socket.emit("new-user", name);

socket.on("chat-message", ({ message, name }) => {
    reciveMessage(message, name);
});

socket.on("user-connected", name => {
    const txtOfNotification = `A new user called ${name} joined the chat!`;
    addNotification(txtOfNotification);
});

socket.on("user-disconnected", name => {
    const txtOfNotification = `An user called ${name} has left the chat.`;
    addNotification(txtOfNotification);
});

messageForm.addEventListener("submit", e => {
    e.preventDefault();
    const { value: message } = messageContainer;

    socket.emit("send-chat-message", message);
    appendMessage(message, name);
    messageContainer.value = "";
});

messageContainer.addEventListener("keydown", e => {
    const { code, shiftKey } = e;
    if (code === "Enter" && shiftKey !== true) {
        e.preventDefault();
        sendButton.click();
    }
});

function createMessageElement(message, name, classPrefix) {
    const messageContainer = d.createElement("div");
    messageContainer.classList.add(`message__container${classPrefix}`);
    const messageTextElement = d.createElement("p");
    const nickElement = d.createElement("p");
    nickElement.classList.add("nick");
    nickElement.textContent = name;
    messageTextElement.textContent = message;
    messageContainer.appendChild(messageTextElement);
    messageContainer.appendChild(nickElement);

    return messageContainer;
}

function appendMessage(message) {
    const messageContainer = createMessageElement(message, "You", "--me");
    chatContainer.appendChild(messageContainer);
}

function reciveMessage(message, name) {
    const messageContainer = createMessageElement(message, name, "--sender");
    chatContainer.appendChild(messageContainer);
}

function addNotification(message) {
    const messageContainer = createMessageElement(
        message,
        "SYSTEM",
        "--notification"
    );
    chatContainer.appendChild(messageContainer);
}
