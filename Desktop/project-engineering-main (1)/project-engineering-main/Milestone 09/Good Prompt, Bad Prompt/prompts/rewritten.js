// prompts/rewritten.js
// Students: implement all three prompts using the five-component structure.
// Each prompt must have: system instruction, context with delimiters, task, format (JSON shape), constraints.
// Label each section with a comment.

// Task A — Notes Reviewer
export const TASK_A_PROMPT = (content) => ({
  // 1) System Instruction
  systemMsg:
    'You are NoteReview, an expert academic note reviewer. Your quality standard is factual precision, concise guidance, and consistent machine-readable output.',
  // 2) Context + 3) Task + 4) Format + 5) Constraints
  userMsg: `
## Context
--- NOTE START ---
${content}
--- NOTE END ---

## Task
Review the note across exactly these three dimensions:
1) clarity
2) completeness
3) accuracy

Provide a score (0-10 integer) and short feedback for each dimension.
Also provide overallScore (0-10 integer) and topPriority (single highest-priority improvement action).

## Format (return exactly this JSON shape)
{
  "clarity": { "score": 0, "feedback": "" },
  "completeness": { "score": 0, "feedback": "" },
  "accuracy": { "score": 0, "feedback": "" },
  "overallScore": 0,
  "topPriority": ""
}

## Constraints
- Return valid JSON only (no markdown fences, no prose outside JSON).
- Do not editorialize about the student.
- Do not invent facts not supported by the note.
- If information is missing, state it in the relevant feedback field only.
`.trim()
})

// Task B — Placement Summariser
export const TASK_B_PROMPT = (text) => ({
  // 1) System Instruction
  systemMsg:
    'You are a placement-experience summariser for LearnLens. You produce privacy-safe, structured interview summaries for UI cards.',
  // 2) Context + 3) Task + 4) Format + 5) Constraints
  userMsg: `
## Context
--- INTERVIEW START ---
${text}
--- INTERVIEW END ---

## Task
Extract exactly these fields from the interview experience:
- company
- role
- difficulty (numeric 1-5)
- keyTopics (array of strings)
- outcome (one sentence)

## Format (return exactly this JSON shape)
{
  "company": "",
  "role": "",
  "difficulty": 1,
  "keyTopics": [""],
  "outcome": ""
}

## Constraints
- Return valid JSON only (no markdown fences, no prose outside JSON).
- Do not include personal names.
- difficulty must be a number (1-5), not a word.
- Do not speculate beyond what is explicitly stated.
- outcome must be exactly one sentence.
`.trim()
})

// Task C — Error Analyst
export const TASK_C_PROMPT = (error_message) => ({
  // 1) System Instruction
  systemMsg:
    'You are a senior backend debugging engineer. You produce evidence-based, structured incident analyses for developer dashboards.',
  // 2) Context + 3) Task + 4) Format + 5) Constraints
  userMsg: `
## Context
--- ERROR TRACE START ---
${error_message}
--- ERROR TRACE END ---

## Task
Analyze the trace and provide:
- rootCause
- affectedComponent
- severity (low | medium | high | critical)
- recommendedFix
- codeSnippet (optional; include only if directly useful)

## Format (return exactly this JSON shape)
{
  "rootCause": "",
  "affectedComponent": "",
  "severity": "low",
  "recommendedFix": "",
  "codeSnippet": ""
}

## Constraints
- Return valid JSON only (no markdown fences, no prose outside JSON).
- severity must be exactly one of: low, medium, high, critical.
- Do not speculate about causes not evidenced in the provided stack trace.
- If no snippet is needed, set codeSnippet to an empty string.
`.trim()
})
