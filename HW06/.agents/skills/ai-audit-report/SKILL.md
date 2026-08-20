---
name: ai-audit-report
description: Maintain the mandatory, chronological, attributable HW06 AI Audit Report. Use after AI assists with API selection, API-spec analysis, domain partitions, state transitions, security/schema analysis, test-case generation, Postman/Newman work, CI/CD, bug analysis, AI-test-generator design, AI critique, reports, or any other HW06 deliverable; also use to review or correct an existing audit entry and when preparing the final Markdown/PDF appendix.
---

# AI Audit Report

Record every material AI interaction honestly. Preserve the user's exact prompt and enough output provenance for a grader to reconstruct what AI produced.

## Required context

Read before updating the audit:

1. `HW06/2026.HW06.API Testing_En.md`, especially the AI-first, AI Audit, anti-AI-cheat, and submission requirements.
2. `HW06/plan.md` for the current execution stage and assigned APIs.
3. `HW06/reports/ai-audit-report.md`, if it exists.
4. [references/audit-entry-template.md](references/audit-entry-template.md).

The fixed API assignment is:

- Pool A / FR-05 — `GET /api/products?search=keyword`
- Pool B / FR-10 — `PUT /api/orders/:id/cancel`
- Pool C / FR-16 — `POST /api/admin/import-products`

## Append an interaction

1. Create `HW06/reports/ai-audit-report.md` from the reference template if it does not exist.
2. Inspect the entire report and assign the next sequential ID: `AI-001`, `AI-002`, and so on. Never reuse an ID.
3. Obtain the current ISO 8601 timestamp with timezone. If unavailable, write `To be filled by tester`; never guess.
4. Record the actual AI tool name and add it to the report's **AI Tools Used** table if it is new.
5. Copy the user's prompt verbatim, preserving mistakes and formatting. Redact only credentials, secrets, or private personal data and mark each redaction explicitly.
6. Record the evidence/input basis using repository-relative paths. For API work, identify the exact specification or artifact used.
7. Preserve the AI output:
   - If AI created or modified repository files, list every affected repository-relative path and summarize the material changes. Those files are the output of record.
   - If advisory text is not preserved elsewhere, copy the complete response into the entry. For long responses, save it under `HW06/reports/ai-session-logs/AI-NNN.md` and link it from the entry.
   - For test execution analysis, identify the exact Postman/Newman/request-response evidence used and clearly separate observed results from AI interpretation.
8. Set `Human Review` to `Pending human review` unless the user explicitly supplies a review decision.
9. Append chronologically. Do not replace, reorder, or silently rewrite earlier entries.
10. When the tester reviews an entry, preserve the original entry and append the supplied Accepted/Modified/Removed/Added/Notes information.

## Evidence integrity

- Include the exact declaration: `I use AI tools for the following tasks.`
- Never fabricate `X-Student-Id` evidence, Postman/Newman execution, request/response results, HTML reports, screenshots, GitHub Actions runs, GitHub Issues, bug evidence, or demo-video evidence.
- Never generate the final self-drawn AI test-generator diagram on the student's behalf.
- Treat AI-proposed expected status codes, response schemas, state rules, security expectations, and bug hypotheses as proposals until verified against the SUT specification or real evidence.
- Label a testcase as `VALID`, `INVALID`, or `INCOMPLETE` only as an AI audit proposal unless the tester has explicitly performed/confirmed the human review.
- Do not mark an AI-generated testcase accepted merely because it is syntactically valid or executable.
- Preserve original AI mistakes. Append correction/review notes instead of hiding them.
- Distinguish AI-generated tests from the student's required human-added tests. Do not present AI-authored cases as human-created work.
- Keep repository paths relative and never record passwords, tokens, cookies, secrets, or private personal data.

## Human review handoff

End each new entry with:

```text
Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:
```

Leave these review fields for the tester unless the tester explicitly provides the judgment.
