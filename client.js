const ws = new WebSocket('ws://melo.pylex.xyz:9164');
let userId = Date.now();
let username = localStorage.getItem('username') || 'Anonymous';
let profilePic = localStorage.getItem('profilePic') || '';

// Elements
const usernameInput = document.getElementById('username');
const profilePicInput = document.getElementById('profilePic');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Register user on connect
ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'register', userId, username, profilePic }));
};

// Handle incoming messages
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'message') {
        displayMessage(message.user.username, message.user.profilePic, message.text);
    } else if (message.type === 'userConnected') {
        displayNotification(`${message.user.username} joined the chat.`);
    } else if (message.type === 'userDisconnected') {
        displayNotification(`${message.user.username} left the chat.`);
    }
};

// Send message
sendBtn.onclick = () => {
    const text = messageInput.value;
    if (text) {
        ws.send(JSON.stringify({ type: 'chat', text }));
        messageInput.value = '';
    }
};

// Handle username change
usernameInput.onchange = () => {
    username = usernameInput.value;
    localStorage.setItem('username', username);
    ws.send(JSON.stringify({ type: 'updateProfile', username }));
};

// Handle profile picture upload
profilePicInput.onchange = () => {
    const reader = new FileReader();
    reader.onload = () => {
        profilePic = reader.result;
        localStorage.setItem('profilePic', profilePic);
        ws.send(JSON.stringify({ type: 'updateProfile', profilePic }));
    };
    reader.readAsDataURL(profilePicInput.files[0]);
};

// Helper functions
function displayMessage(username, profilePic, text) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message');
    messageEl.innerHTML = `<strong>${username}</strong>: ${text}`;
    if (profilePic) {
        const img = document.createElement('img');
        img.src = profilePic;
        img.style.width = '30px';
        img.style.height = '30px';
        img.style.borderRadius = '50%';
        messageEl.prepend(img);
    }
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function displayNotification(text) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerText = text;
    messagesDiv.appendChild(notification);
}
