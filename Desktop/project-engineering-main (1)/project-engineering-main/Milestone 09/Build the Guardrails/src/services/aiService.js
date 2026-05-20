import fetch from 'node-fetch';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

export async function analyzeWithAI(text, userId) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is missing from environment variables');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': 'jobscan-ai-guardrails',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are JobScan AI, an expert job-description analyst. Return a structured JSON analysis with required skills, experience level, key responsibilities, and salary range indicators.',
          },
          {
            role: 'user',
            content: text,
          },
        ],
      }),
    });

    clearTimeout(timeoutId);

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
          endpoint: 'analyze_job_description',
        })
      );
    }

    if (!response.ok) {
      throw new Error(data?.error?.message || 'OpenRouter request failed');
    }

    return data?.choices?.[0]?.message?.content || '';
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      console.error(
        '[AI_TIMEOUT]',
        JSON.stringify({
          timestamp: new Date().toISOString(),
          userId,
          timeoutMs: 15000,
        })
      );

      return {
        success: false,
        fallback: true,
        message: 'Analysis unavailable. Please try again shortly.',
      };
    }

    console.error(
      '[AI_ERROR]',
      JSON.stringify({
        timestamp: new Date().toISOString(),
        userId,
        error: err.message,
      })
    );

    return {
      success: false,
      fallback: true,
      message: 'Analysis unavailable. Please try again shortly.',
    };
  }
}
