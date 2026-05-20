import fetch from 'node-fetch';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

export async function summarizeNotes({ noteContent, userId, model = DEFAULT_MODEL }) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is missing from environment variables');
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
      'X-Title': 'noteai-token-logging',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a concise academic note summariser. Return a structured JSON summary that is easy for a frontend to render.',
        },
        {
          role: 'user',
          content: noteContent,
        },
      ],
    }),
  });

  const data = await response.json();

  const usage = data.usage;
  if (usage) {
    console.log(
      '[AI_USAGE]',
      JSON.stringify({
        timestamp: new Date().toISOString(),
        userId,
        model: DEFAULT_MODEL,
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        endpoint: 'summarize_note',
      })
    );
  }

  if (!response.ok) {
    throw new Error(data?.error?.message || 'OpenRouter request failed');
  }

  return data?.choices?.[0]?.message?.content || '';
}
