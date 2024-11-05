const ws = new WebSocket('ws://melo.pylex.xyz:9164');
const messageInput = document.getElementById('message-input');
const messagesDiv = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');
const usernameInput = document.getElementById('username');
const sendBtn = document.getElementById('send-btn');

ws.onopen = () => console.log("Connected to WebSocket server");

// Display messages from the server
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'message') {
    const message = document.createElement('div');
    message.textContent = `${data.message.user}: ${data.message.text}`;
    messagesDiv.appendChild(message);
  } else if (data.type === 'typing') {
    typingIndicator.style.display = 'block';
  } else if (data.type === 'welcome') {
    data.messages.forEach(msg => {
      const message = document.createElement('div');
      message.textContent = `${msg.user}: ${msg.text}`;
      messagesDiv.appendChild(message);
    });
  }
};

sendBtn.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    ws.send(JSON.stringify({ type: 'message', text: message }));
    messageInput.value = '';
  }
});

messageInput.addEventListener('keypress', () => {
  ws.send(JSON.stringify({ type: 'typing' }));
});
