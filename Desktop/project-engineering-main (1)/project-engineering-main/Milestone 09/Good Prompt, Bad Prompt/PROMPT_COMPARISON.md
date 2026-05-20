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

Mitosis is when cells divide. There are 4 phases. Prophase is when chromosomes condense.
Metaphase the chromosomes line up. Anaphase they split. Telophase new cells form. DNA
replicates before division starts. This is important for growth and repair.

### Bad Prompt Output

Not executed in this run (user requested **DO NOT TEST**). Reserved for raw output from:
`node runner.js --task=a --version=bad --temperature=0.7`

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

I interviewed at Google for a SWE intern role in March. The interview had 3 rounds.
First was a screening call, then two technical rounds. They asked me about arrays and
dynamic programming. I solved the first problem easily but struggled with the DP one.
I was given an offer but turned it down due to relocation. The interviewers were nice
and gave good feedback about my problem-solving approach.

### Bad Prompt Output

Not executed in this run (user requested **DO NOT TEST**). Reserved for raw output from:
`node runner.js --task=b --version=bad --temperature=0.7`

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

TypeError: Cannot read properties of undefined (reading 'map')
	at UserList.render (/app/components/UserList.jsx:34:22)
	at processChild (/app/node_modules/react-dom/cjs/react-dom-server.node.development.js:3990:14)
	at resolve (/app/node_modules/react-dom/cjs/react-dom-server.node.development.js:4054:5)
	at ReactDOMServerRenderer.read (/app/node_modules/react-dom/cjs/react-dom-server.node.development.js:4402:29)

### Bad Prompt Output

Not executed in this run (user requested **DO NOT TEST**). Reserved for raw output from:
`node runner.js --task=c --version=bad --temperature=0.7`

### Good Prompt Output

[To be added in Step 4]

### Improvement

[To be added in Step 5]
