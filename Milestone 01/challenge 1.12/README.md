# Challenge 1.12 — Build and Deploy Your First AI Chatbot

## What I built

A full AI chatbot with:

- Frontend chat UI (`frontend/index.html`, `frontend/script.js`, `frontend/style.css`)
- Backend Express API (`backend/server.js`) with `POST /chat`
- Real AI integration via OpenRouter
- Context-aware conversation by sending full message history on each request
- Deployment-ready setup for Render (backend) and Netlify (frontend)

## Architecture

User → Frontend → Backend `/chat` → OpenRouter API  
API key is stored only in backend `.env` and never exposed to browser code.

## Question 1 — API and model

I used the **OpenRouter API** with model **`openai/gpt-4o-mini`**.

## Question 2 — Why backend not frontend

If the API call is made from the frontend, users can extract the API key from browser DevTools/network traffic and abuse it, causing unauthorized usage and billing risk. Keeping the call in the backend protects the secret and lets us enforce validation/rate-limiting server-side.

## Question 3 — Fallback provider

If OpenRouter credits run out, I would switch to **Google Gemini API**.  
The two required code changes are:

1. Change the API base URL (OpenRouter endpoint → Gemini endpoint)
2. Change the model name to a Gemini model

(Everything else in the message flow can remain the same.)

## Live Deployment

- Frontend URL: `https://dancing-dango-3e8145.netlify.app/`
- Backend URL: `https://ai-chatbot-backend-s3z5.onrender.com`
- Health Check: `https://ai-chatbot-backend-s3z5.onrender.com/health`

## Local setup

```bash
cd backend
npm install
npm start
```
