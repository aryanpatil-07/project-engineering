const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

// Initialize dotenv at the top
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Health check route to verify server status
app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

/**
 * AI Chat Route
 * Accepts: { messages: [{ role, content }, ...] }
 * Returns: { reply: "..." }
 */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Server misconfiguration: missing OPENROUTER_API_KEY' });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid request: messages must be a non-empty array' });
    }

    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Optional but recommended by OpenRouter:
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:5500',
        'X-Title': 'challenge-1.12-ai-chatbot'
      },
      body: JSON.stringify({
        model,
        messages
      })
    });

    const data = await aiRes.json();

    if (!aiRes.ok) {
      return res.status(aiRes.status).json({
        error: data?.error?.message || 'OpenRouter request failed'
      });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({ error: 'Invalid AI response format' });
    }

    return res.json({ reply });
  } catch (error) {
    console.error('Chat route error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});