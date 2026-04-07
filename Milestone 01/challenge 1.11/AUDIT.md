# Pre-Refactor Audit

Read the full codebase before any changes were made. Every issue listed below is addressed in the refactor.

---

## 1. Meaningless Variable Names

| Location       | Variable           | Problem                                              |
| -------------- | ------------------ | ---------------------------------------------------- |
| app.js line 4  | `confessions`      | OK — but mutable `var` instead of `let/const`        |
| app.js line 5  | `x`                | No indication it is an ID counter                    |
| app.js line 7  | `d`                | Holds request body — completely opaque               |
| app.js line 8  | `r`                | Holds request params — completely opaque             |
| app.js line 16 | `tmp`              | Holds the new confession object                      |
| app.js line 37 | `arr`              | Holds sorted confessions array                       |
| app.js line 44 | `i` (create block) | Parsed integer ID — no context                       |
| app.js line 45 | `info`             | Holds found confession — vague                       |
| app.js line 56 | `cat`              | Category param — acceptable but short                |
| app.js line 59 | `stuff`            | Filtered confessions — meaningless                   |
| app.js line 67 | `i` (delete block) | Parsed integer ID — reused name                      |
| app.js line 68 | `handler`          | Holds findIndex result — should be `confessionIndex` |
| app.js line 70 | `res2`             | Holds splice result — shadows `res` visually         |
| app.js line 87 | `startStr`         | Pointless variable, used once inline                 |

---

## 2. Monolithic Function

- `handleAll()` at line 7 handles **five completely different operations** in one function:
  - Input validation for creation
  - Creating and saving a confession
  - Fetching all confessions
  - Fetching a single confession by ID
  - Fetching confessions by category
  - Deleting a confession
- It uses a string flag `t` to switch behaviour — this is a manual dispatcher, not a function
- Each branch should be its own named function

---

## 3. No Folder Structure / MVC

- The entire app lives in a single `app.js` file
- Routes, business logic, and data access are all mixed together
- No `routes/`, `controllers/`, or `services/` separation

---

## 4. Hardcoded Values

| Location       | Value                                          | Problem                                           |
| -------------- | ---------------------------------------------- | ------------------------------------------------- |
| app.js line 13 | `["bug", "deadline", "imposter", "vibe-code"]` | Hardcoded and duplicated on line 57               |
| app.js line 69 | `'supersecret123'`                             | Secret token hardcoded in source — security issue |
| app.js line 83 | `3000`                                         | Port hardcoded — should come from environment     |

---

## 5. Inconsistent Error Responses

- Some errors return `{msg: 'bad'}`, others return plain strings, others return `{error: "..."}` — no consistent shape

---

## 6. No Comments

- Zero comments explaining why any decision was made
- The `confessions.length > 500` check at the bottom runs once at startup and never again — makes no sense and is not explained

---

## 7. Misplaced / Dead Code

- `if (confessions.length > 500)` at line 86 runs **once at startup** when array is empty — this check is effectively dead code

---

## 8. Use of `var` Throughout

- `var` is used everywhere instead of `const`/`let` — allows accidental re-declaration and function-scoped hoisting bugs

---

## 9. Category List Duplicated

- Valid categories array is defined in two separate places (line 13 and line 57) — if a category is added, both must be updated manually
