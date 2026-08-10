---
name: ai-audit-logging
description: Record complete, attributable AI interactions for the HW04 AI Audit Report. Use after AI assists with planning, analysis, test data, Playwright code, Page Objects, fixtures, configuration, debugging, reports, bug analysis, critique, or any other HW04 deliverable; also use when reviewing or correcting an existing audit entry or assembling the final audit appendix.
---

# AI Audit Logging

Maintain an honest chronological record of AI assistance. Never infer user review or execution evidence.

## Required context

Read:

1. `HW04/2026.HW04.Automation Testing_En.md`, sections 2, 9, 10, and 11
2. `HW04/reports/ai-audit-report.md`
3. [references/audit-entry-template.md](references/audit-entry-template.md)

## Append an interaction

1. Inspect the audit report and assign the next sequential ID: `AI-001`, `AI-002`, and so on.
2. Obtain the current ISO 8601 timestamp with timezone. If unavailable, write `To be filled by tester`.
3. Record the actual AI tool name.
4. Copy the user's prompt verbatim. Do not paraphrase it in the prompt field.
5. Preserve the AI output:
   - For code or documents written to the repository, list every generated or modified path and summarize the material changes.
   - For advisory text, copy the complete response into the entry or an attached session-log Markdown file and link it.
   - Never claim an artifact was generated when it was not written.
6. Set human review to `Pending human review` unless the user has explicitly supplied their review.
7. Append the entry; never replace or reorder earlier entries.
8. Ask the user to complete Accepted/Modified/Removed/Added notes after reviewing the output.

## Integrity rules

- Include the declaration: `I use AI tools for the following tasks.`
- Do not fabricate prompts, output, timestamps, test results, screenshots, reports, bugs, or human judgments.
- Do not mark the output accepted merely because the AI generated it.
- Corrections to an earlier entry must remain traceable; append a correction note instead of silently rewriting history.
- Do not store credentials, tokens, passwords, or private personal data in the audit.
- Keep exact prompts even when they contain spelling or grammar mistakes.
- Use Markdown and keep paths repository-relative.

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

Do not fill the last five fields on the user's behalf.

