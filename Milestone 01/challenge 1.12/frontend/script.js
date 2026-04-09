// Conversation history (full context)
const messages = [];

const chatDisplay = document.getElementById('chatDisplay');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Local backend for development
let CHAT_API_URL = 'https://ai-chatbot-backend-s3z5.onrender.com/chat';

// Optional: if you host frontend + backend separately, set this before build/deploy
// CHAT_API_URL = 'https://your-render-service.onrender.com/chat';

function renderMessage(role, content) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', role);
  messageDiv.textContent = content;
  chatDisplay.appendChild(messageDiv);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function setLoading(isLoading) {
  sendBtn.disabled = isLoading;
  sendBtn.textContent = isLoading ? 'Sending...' : 'Send';
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  // 1) Add user message to state
  messages.push({ role: 'user', content: text });

  // 2) Render user message
  renderMessage('user', text);

  // 3) Clear input
  messageInput.value = '';

  try {
    setLoading(true);

    // 4) Send FULL message history to backend
    const res = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || 'Failed to get AI response');
    }

    // 5) Add assistant message to state
    messages.push({ role: 'assistant', content: data.reply });

    // 6) Render assistant message
    renderMessage('assistant', data.reply);
  } catch (err) {
    renderMessage('assistant', `Error: ${err.message}`);
  } finally {
    setLoading(false);
    messageInput.focus();
  }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});