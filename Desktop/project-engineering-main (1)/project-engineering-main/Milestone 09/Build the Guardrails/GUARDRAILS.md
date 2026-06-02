# JobScan AI — Production Guardrails

## Guardrail 1 — Input Length Validation

**What was added:** `src/controllers/analyzeController.js` now rejects empty text with `400 { error: 'input_required', message: 'Job description text is required.' }` and rejects payloads over 3000 characters with `400 { error: 'input_too_long', limit: 3000, received: text.length }` before any call to `src/services/aiService.js`.

**What it protects against:** It prevents oversized job descriptions from being sent to the LLM and stops the backend from wasting time and tokens on requests that are too large to handle safely.

**Production incident it prevents:** A copied-and-pasted mega job post or prompt-injection blob can no longer trigger an expensive analysis call that burns tokens and slows down the queue for everyone else.

## Guardrail 2 — Request Timeout

**What was added:** `src/services/aiService.js` wraps the OpenRouter fetch in an `AbortController` with a 15000ms timer, clears the timeout on success or failure, and returns a fallback response with `success: false`, `fallback: true`, and a user-friendly message when the request aborts.

**What it protects against:** It prevents the server from holding an HTTP connection open indefinitely when the LLM provider is slow or unresponsive.

**Production incident it prevents:** A stuck provider no longer leaves users staring at a spinner while a Node process ties up a worker thread for 60 seconds or longer.

## Guardrail 3 — LLM Failure Handling

**What was added:** `src/services/aiService.js` now catches non-timeout errors, logs `[AI_ERROR]` with the error message, and returns the same fallback object; `src/controllers/analyzeController.js` converts that fallback into a `503` response.

**What it protects against:** It prevents a provider authentication failure, 401, 5xx, or malformed response from crashing the request handler and taking down the server.

**Production incident it prevents:** At 2 AM, a bad API key or upstream outage now returns a graceful 503 instead of collapsing the whole service and forcing an emergency restart.
