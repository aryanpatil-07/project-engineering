# DEPLOYMENT_LOG.md

> Fill in this document as you debug and fix the deployment. This is part of your submission.

---

## 1. What Failed?

```
Console (before fix):
Access to fetch at 'https://linkshelf-api.onrender.com/api/auth/login' from origin
'https://linkshelf-frontend.onrender.com' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.

UI (before fix):
API URL: ⚠️ undefined (VITE_API_URL not set!)

Network (before fix):
- OPTIONS /api/auth/login -> blocked/failed preflight in browser due to CORS mismatch
- POST /api/auth/login -> never completed successfully because preflight failed

Render backend logs (before fix):
PrismaClientInitializationError: Prisma Client has not been generated yet
```

---

## 2. Root Cause Analysis

<!-- For EACH issue you found, explain: What was wrong? Why did it cause the failure? -->

| #   | Issue Found                                               | File(s) Affected                 | Why It Caused a Failure                                                                                                                |
| --- | --------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | CORS origin used wildcard `*` with credentialed auth flow | `src/index.js`                   | Browsers reject credentialed cross-origin requests when `Access-Control-Allow-Origin` is `*`, so preflight/auth requests were blocked. |
| 2   | Frontend `VITE_API_URL` missing at build time             | `render.yaml` (frontend service) | Vite injects `import.meta.env.VITE_*` during build; missing value compiled to `undefined`, causing requests to `undefined/api/...`.    |
| 3   | Prisma client generation step missing in backend build    | `render.yaml` (backend service)  | Backend started without generated Prisma client, causing runtime crash on first DB access.                                             |

---

## 3. Fixes Applied

### Fix 1 — CORS Configuration:

- Updated CORS middleware in `src/index.js` to use:
  - `origin: process.env.CORS_ORIGIN`
  - `credentials: true`
  - Existing methods/headers preserved.
- Added `CORS_ORIGIN` to startup `validateEnv()` so misconfiguration fails fast.

### Fix 2 — Frontend Build Environment:

- Added frontend env var in `render.yaml`:
  - `VITE_API_URL: https://linkshelf-api.onrender.com`
- Added backend env var in `render.yaml`:
  - `CORS_ORIGIN: https://linkshelf-frontend.onrender.com`

### Fix 3 — Build Command:

- Updated backend build command in `render.yaml` to:
  - `npm install && npx prisma generate`

---

## 4. Verification

- **Preflight OPTIONS request**: After fix, backend responds with allowed origin from `CORS_ORIGIN` and credential-compatible headers.
- **API call succeeds**: Frontend now composes URLs using `VITE_API_URL`, so requests target the correct backend host.
- **Render deploy log**: Backend build includes `npx prisma generate`, preventing Prisma initialization crash at runtime.

> Screenshot references to attach in PR:
>
> 1. Network tab (before): failed preflight + CORS console error
> 2. Network tab (after): OPTIONS + POST success
> 3. Render build log showing successful `npx prisma generate`

---

## 5. Key Takeaways

CORS for credentialed requests must be explicit; wildcard origins are rejected by browsers when auth credentials/headers are involved. Vite frontend env values are injected at build time, while backend env values are read at runtime, so both deployment blueprint and runtime validation must be configured correctly. Including Prisma client generation in the backend build step prevents production-only runtime failures.
