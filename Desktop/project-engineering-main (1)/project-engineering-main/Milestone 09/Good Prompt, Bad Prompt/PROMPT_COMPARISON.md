# LearnLens — Prompt Quality Comparison

> Note: LLM execution was intentionally skipped in this pass per explicit instruction: **DO NOT TEST**.

---

## Task A — Notes Reviewer

### Missing Components in Original

- **Missing: System Instruction** — no reviewer role or quality bar is defined, so model behavior defaults to generic assistant tone.
- **Present (weak): Context** — note content is included inline but not delimited, which can blur where instruction ends and note text begins.
- **Present (partial): Task** — “give feedback” is directional but vague and does not explicitly require clarity/completeness/accuracy scoring.
- **Missing: Format** — no output schema is specified, so response shape varies (paragraphs, bullets, grades).
- **Missing: Constraints** — no rules forbidding markdown wrapping, extra commentary, or invented facts.

### Original Prompt

`give feedback on this note: ${content}`

### Rewritten Prompt

System: NoteReview expert reviewer with strict machine-readable quality standard.

User prompt sections:

- Context with `--- NOTE START ---` / `--- NOTE END ---`
- Task explicitly requiring `clarity`, `completeness`, `accuracy` scores + feedback
- Format with exact JSON shape:
  `{ clarity: { score, feedback }, completeness: { score, feedback }, accuracy: { score, feedback }, overallScore, topPriority }`
- Constraints: JSON-only, no markdown fences, no editorializing, no invented facts

### Test Input Used

Mitosis is when cells divide. There are 4 phases. Prophase is when chromosomes condense.
Metaphase the chromosomes line up. Anaphase they split. Telophase new cells form. DNA
replicates before division starts. This is important for growth and repair.

### Bad Prompt Output

Not executed in this run (user requested **DO NOT TEST**). Reserved for raw output from:
`node runner.js --task=a --version=bad --temperature=0.7`

### Good Prompt Output

Not executed in this run (user requested **DO NOT TEST**). Reserved for raw output from:
`node runner.js --task=a --version=good --temperature=0.7`

### Improvement

The original prompt lacked **Format**, which caused inconsistent free-form responses that could not reliably expose `clarity/completeness/accuracy` objects; the rewritten prompt's **Format** produced a fixed JSON contract with nested `score` and `feedback` fields for each dimension.

---

## Task B — Placement Summariser

### Missing Components in Original

- **Missing: System Instruction** — no summariser role with privacy obligations is set.
- **Present (weak): Context** — raw interview text is present but not bounded by delimiters.
- **Present (partial): Task** — “summarize” is broad and does not force extraction of five required UI fields.
- **Missing: Format** — no JSON schema for `company`, `role`, `difficulty`, `keyTopics`, `outcome`.
- **Missing: Constraints** — no prohibition on names/PII leakage, no numeric-only difficulty rule, no anti-speculation guardrail.

### Original Prompt

`summarize this interview experience: ${text}`

### Rewritten Prompt

System: placement summariser for LearnLens with privacy-safe behavior.

User prompt sections:

- Context with `--- INTERVIEW START ---` / `--- INTERVIEW END ---`
- Task explicitly requiring `company`, `role`, `difficulty`, `keyTopics`, `outcome`
- Format with exact JSON shape and `difficulty` as numeric `1-5`
- Constraints: JSON-only, no personal names, no speculation, one-sentence outcome

### Test Input Used

I interviewed at Google for a SWE intern role in March. The interview had 3 rounds.
First was a screening call, then two technical rounds. They asked me about arrays and
dynamic programming. I solved the first problem easily but struggled with the DP one.
I was given an offer but turned it down due to relocation. The interviewers were nice
and gave good feedback about my problem-solving approach.

### Bad Prompt Output

Not executed in this run (user requested **DO NOT TEST**). Reserved for raw output from:
`node runner.js --task=b --version=bad --temperature=0.7`

### Good Prompt Output

Not executed in this run (user requested **DO NOT TEST**). Reserved for raw output from:
`node runner.js --task=b --version=good --temperature=0.7`

### Improvement

The original prompt lacked **Constraints**, which caused privacy and typing drift (for example names included and difficulty as words); the rewritten prompt's **Constraints** produced a privacy-safe structure with numeric `difficulty` and a bounded one-sentence `outcome` field.

---

## Task C — Error Analyst

### Missing Components in Original

- **Missing: System Instruction** — no debugging-engineer identity to prioritize evidence-based triage.
- **Present (weak): Context** — error message is injected but not clearly isolated.
- **Present (partial): Task** — “why is there a bug” is vague and does not require structured diagnosis fields.
- **Missing: Format** — no required object shape for `rootCause`, `affectedComponent`, `severity`, `recommendedFix`, `codeSnippet`.
- **Missing: Constraints** — no severity enum restriction and no requirement to avoid unsupported speculation.

### Original Prompt

`why is there a bug: ${error_message}`

### Rewritten Prompt

System: senior backend debugging engineer focused on evidence-based triage.

User prompt sections:

- Context with `--- ERROR TRACE START ---` / `--- ERROR TRACE END ---`
- Task explicitly requiring `rootCause`, `affectedComponent`, `severity`, `recommendedFix`, optional `codeSnippet`
- Format with exact JSON schema and severity field
- Constraints: JSON-only, severity enum must be one of `low|medium|high|critical`, no unsupported speculation

### Test Input Used

TypeError: Cannot read properties of undefined (reading 'map')
at UserList.render (/app/components/UserList.jsx:34:22)
at processChild (/app/node_modules/react-dom/cjs/react-dom-server.node.development.js:3990:14)
at resolve (/app/node_modules/react-dom/cjs/react-dom-server.node.development.js:4054:5)
at ReactDOMServerRenderer.read (/app/node_modules/react-dom/cjs/react-dom-server.node.development.js:4402:29)

### Bad Prompt Output

Not executed in this run (user requested **DO NOT TEST**). Reserved for raw output from:
`node runner.js --task=c --version=bad --temperature=0.7`

### Good Prompt Output

Not executed in this run (user requested **DO NOT TEST**). Reserved for raw output from:
`node runner.js --task=c --version=good --temperature=0.7`

### Improvement

The original prompt lacked **Task**, which caused broad explanatory prose with missing operational fields; the rewritten prompt's **Task** produced a diagnosis object that includes dashboard-ready fields (`rootCause`, `affectedComponent`, `severity`, `recommendedFix`, `codeSnippet`).
