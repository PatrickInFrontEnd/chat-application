const socket = io({ forceNew: true });

const d = document;
const chatContainer = d.querySelector(".messages-container");
const messageForm = d.querySelector("#message-form");
const messageInput = d.querySelector("#message-data");
const sendButton = d.querySelector("#send-message");
const header = d.querySelector(".welcome");
const errorElement = d.querySelector(".errorMessage");
const nameForm = d.querySelector("#nameForm");
const nameElement = d.querySelector("#name");
const joinButton = d.querySelector("#send-name");

let name;

socket.on("nick-already-used", ({ name }) => {
    animateErrorElement(`Your name '${name}' already exist. Try another nick.`);
});

socket.on("join-success", ({ name }) => {
    joinChatSuccess(name);
});

nameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nickname = nameElement.value;
    if (!nickname) {
        console.log("Write your name.");
        return;
    }
    joinButton.disabled = true;
    requestJoin(nickname);
});

sendButton.disabled = true;

function joinChatSuccess(name) {
    initializeChat(name);
}

function requestJoin(name) {
    socket.emit("join-request", { name });
}

function initializeChat(name) {
    socket.emit("new-user", { name });

    header.innerHTML = `Welcome, you joined the chat ${name}`;
    sendButton.disabled = false;

    socket.on("chat-message", ({ message, name }) => {
        reciveMessage(message, name);
    });

    socket.on("user-connected", (name) => {
        const txtOfNotification = `A new user called ${name} joined the chat!`;
        addNotification(txtOfNotification);
    });

    socket.on("user-disconnected", (name) => {
        const txtOfNotification = `An user called ${name} has left the chat.`;
        addNotification(txtOfNotification);
    });

    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const { value: message } = messageInput;
        if (!message) return;

        socket.emit("send-chat-message", message);
        appendMessage(message, name);
        messageInput.value = "";
    });

    messageInput.addEventListener("keydown", (e) => {
        const { code, shiftKey } = e;
        if (code === "Enter" && shiftKey !== true) {
            e.preventDefault();
            sendButton.click();
        }
    });
}

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

errorElement.addEventListener("animationend", resetErrorElement);

function animateErrorElement(msg) {
    if (msg) {
        errorElement.textContent = `${msg}`;
    }
    errorElement.style.animation = "slideIn 1s both";
}

function resetErrorElement() {
    setTimeout(() => {
        errorElement.style.animation = "";
        errorElement.style.transform = "translateX(120%);";
        errorElement.textContent = "";
        joinButton.disabled = false;
    }, 3000);
}
