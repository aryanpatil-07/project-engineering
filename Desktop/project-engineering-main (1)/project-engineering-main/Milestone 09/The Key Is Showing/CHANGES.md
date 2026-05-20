# Security Refactor Log — NoteSnap

## Before Fix (Evidence)

- **Exposed key location:** `src/App.jsx` line **8** (`const apiKey = import.meta.env.VITE_OPENAI_API_KEY;`) and line **22** (`Authorization: `Bearer ${apiKey}`)
- **DevTools screenshot (before):**

![before](screenshots/before-devtools.png)

A `VITE_` variable is injected into the frontend bundle at build time and shipped to the browser, so it is not secret storage. Any user can inspect the network request or bundled JavaScript and recover the API key, which makes abuse and billing attacks possible.

## After Fix (Evidence)

- **DevTools screenshot (after):**

![after](screenshots/after-devtools.png)

- **Result:** Frontend now calls only backend `/api/summarize`; no browser request includes OpenAI authorization headers or API secrets.
- **Billing risk note:** If a leaked API key is abused by automated scripts, the account owner can incur large unauthorized usage charges within minutes.
