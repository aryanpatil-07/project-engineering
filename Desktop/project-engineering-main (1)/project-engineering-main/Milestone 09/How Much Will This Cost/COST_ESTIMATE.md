# NoteAI — Token Logging & Cost Projection

> Live LLM calls and terminal log capture were intentionally not run in this session because the user explicitly said **DO NOT TEST**. This document is therefore a ready-to-fill cost projection scaffold plus the pricing data needed for the final arithmetic once logs are captured.

## Section 1 — Token Usage Table

| Call    | Note Length (words) | Prompt Tokens | Completion Tokens | Total Tokens |
| ------- | ------------------: | ------------: | ----------------: | -----------: |
| 1       |                  88 |             0 |                 0 |            0 |
| 2       |                 126 |             0 |                 0 |            0 |
| 3       |                 130 |             0 |                 0 |            0 |
| 4       |                  79 |             0 |                 0 |            0 |
| 5       |                 105 |             0 |                 0 |            0 |
| Average |                 106 |             0 |                 0 |            0 |

## Section 2 — Model Pricing

| Model                   | Input Price per 1M tokens | Output Price per 1M tokens |
| ----------------------- | ------------------------: | -------------------------: |
| openai/gpt-4o-mini      |                      0.15 |                       0.60 |
| google/gemini-3.5-flash |                      1.50 |                       9.00 |

## Section 3 — Cost Projection Table

| Model            | Avg Tokens/Req | Cost/Request | Daily (10 users, 5 calls) | Daily (100 users, 5 calls) | Monthly (100 users) |
| ---------------- | -------------: | -----------: | ------------------------: | -------------------------: | ------------------: |
| gpt-4o-mini      |              0 |         0.00 |                      0.00 |                       0.00 |                0.00 |
| gemini-3.5-flash |              0 |         0.00 |                      0.00 |                       0.00 |                0.00 |

### Formula

cost/req = (avg*prompt_tokens × input*$/1,000,000) + (avg_completion_tokens × output_$/1,000,000)

## Section 4 — Model Recommendation

I recommend `openai/gpt-4o-mini` because it is far cheaper than `google/gemini-3.5-flash` at the listed prices. At 100 users and 5 calls per user per day, its monthly cost is $0.00 in this draft because live token measurements were not collected in this session.

## Section 5 — Token Plausibility Verification

Token verification was not performed because the user explicitly instructed **DO NOT TEST**. Once a live run is allowed, paste one test note into the tokenizer, compare the note token count against the logged `promptTokens`, and confirm the difference is explained by the system prompt overhead.
