# CHANGES.md

All refactoring decisions made during the clean-up of Dev Confessions.

---

## Section 1 — Variable Renames

| Old Name   | New Name              | Why                                                                                  |
| ---------- | --------------------- | ------------------------------------------------------------------------------------ |
| `x`        | `nextId`              | `x` gave no indication it was an auto-increment ID counter                           |
| `d`        | `confessionData`      | `d` revealed nothing; the new name describes the shape and purpose of the value      |
| `r`        | _(removed)_           | Was only used to reach `req.params` — just access `req.params` directly              |
| `tmp`      | `newConfession`       | `tmp` implied the value was throwaway; it is actually the object being persisted     |
| `arr`      | `sortedConfessions`   | Describes both the type (array) and what it contains and why it exists               |
| `i`        | `confessionId`        | `i` looked like a loop index; the new name makes its role unambiguous                |
| `info`     | `confession`          | `info` is vague for any data type; `confession` matches the domain model             |
| `cat`      | `category`            | Full word is clearer, matches the field name on the object                           |
| `stuff`    | `filteredConfessions` | Describes both the type and why it was filtered                                      |
| `handler`  | `confessionIndex`     | `handler` implied a function; it is actually the array index returned by `findIndex` |
| `res2`     | `deletedConfession`   | `res2` shadowed the `res` response object visually; new name describes the value     |
| `startStr` | _(removed)_           | Pointless single-use variable; message is now inline in `console.log`                |

---

## Section 2 — Function Splits

### `handleAll()` split into:

| New Function                  | Location                              | Responsibility                                               |
| ----------------------------- | ------------------------------------- | ------------------------------------------------------------ |
| `validateConfessionInput()`   | `services/confessionService.js`       | Validates required fields and constraints before any write   |
| `saveConfession()`            | `services/confessionService.js`       | Single write to the in-memory store                          |
| `getAllConfessions()`         | `services/confessionService.js`       | Retrieves and sorts all confessions                          |
| `getConfessionById()`         | `services/confessionService.js`       | Finds one confession by numeric ID                           |
| `getConfessionsByCategory()`  | `services/confessionService.js`       | Filters by category and validates category name              |
| `deleteConfession()`          | `services/confessionService.js`       | Removes one confession by ID                                 |
| `createConfession()`          | `controllers/confessionController.js` | Handles POST: calls validate + save, sends 201               |
| `listAllConfessions()`        | `controllers/confessionController.js` | Handles GET all: calls service, sends response               |
| `getOneConfession()`          | `controllers/confessionController.js` | Handles GET by ID: calls service, sends 404 if missing       |
| `listConfessionsByCategory()` | `controllers/confessionController.js` | Handles GET by category: calls service, sends 400 if invalid |
| `removeConfession()`          | `controllers/confessionController.js` | Handles DELETE: checks token, calls service, sends result    |

**Why:** `handleAll()` had 6 responsibilities mixed into one function controlled by a string flag. This made it impossible to test any single behaviour in isolation. Splitting into service + controller functions means each function does exactly one thing and can be changed or tested without touching the others.

---

## Section 3 — Folder Structure

**Before:** Everything in `app.js`

**After:**

```
app.js                          — entry point only (env + middleware + listen)
routes/confessionRoutes.js      — URL-to-handler wiring only
controllers/confessionController.js — HTTP in/out, no business logic
services/confessionService.js   — all business logic, no HTTP objects
```

**Why:** MVC separation means each layer has a single reason to change. If the storage backend changes, only the service changes. If an HTTP response shape changes, only the controller changes.

---

## Section 4 — Environment Variables

**Before:** `'supersecret123'` and `3000` hardcoded directly in `app.js`

**After:** Both live in `.env`, read via `process.env`. `.env.example` added as a safe template to commit.

**Why:** Hardcoding secrets in source code means they end up in version history. Environment variables keep secrets out of the repo and make the app configurable across environments without code changes.

---

## Section 5 — Duplicate Category List

**Before:** `["bug", "deadline", "imposter", "vibe-code"]` defined on two separate lines in `handleAll()`

**After:** `VALID_CATEGORIES` const defined once in `confessionService.js`, exported and used everywhere

**Why:** Duplicated constants create silent bugs — if a category is added in one place but not the other, the two branches diverge.

---

## Section 6 — Dead Code Removed

**Before:** `if (confessions.length > 500) { console.log("too many") }` at end of `app.js` — runs once at startup when the array is always empty, never again

**After:** Removed entirely

**Why:** It was unreachable in any meaningful sense and added confusion about intent.

---

## Section 7 — Route Ordering Fix

**Before:** `app.get('/api/v1/confessions/:id')` was registered before `/category/:cat`, causing Express to match the string `"category"` as an ID parameter

**After:** `/category/:cat` is registered first in `confessionRoutes.js`

**Why:** Express matches routes in registration order. A static segment like `/category/:cat` must come before a dynamic one like `/:id` to avoid being swallowed.
