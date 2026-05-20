import fetch from 'node-fetch';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export async function summarizeNotes(notes) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured on the server');
  }

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a concise study note summariser. Return a bullet-point summary of the key concepts.',
        },
        {
          role: 'user',
          content: notes,
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Failed to summarize notes');
  }

  return data?.choices?.[0]?.message?.content || '';
}
