# LearnLens — Prompt Quality Comparison

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
[To be added in Step 3]

### Test Input Used
[To be added in Step 1]

### Bad Prompt Output
[To be added in Step 2]

### Good Prompt Output
[To be added in Step 4]

### Improvement
[To be added in Step 5]

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
[To be added in Step 3]

### Test Input Used
[To be added in Step 1]

### Bad Prompt Output
[To be added in Step 2]

### Good Prompt Output
[To be added in Step 4]

### Improvement
[To be added in Step 5]

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
[To be added in Step 3]

### Test Input Used
[To be added in Step 1]

### Bad Prompt Output
[To be added in Step 2]

### Good Prompt Output
[To be added in Step 4]

### Improvement
[To be added in Step 5]
