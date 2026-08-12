---
name: ai-audit-report
description: Maintain the mandatory, chronological, attributable HW05 AI Audit Report. Use after AI assists with performance-test planning, JMeter or k6 test plans, CSV data, execution guidance, JTL/log analysis, threshold interpretation, optimization proposals, AI critique, continuous-testing design, reports, debugging, or any other HW05 deliverable; also use to review or correct an existing audit entry and when preparing the final Markdown/PDF appendix.
---

# AI Audit Report

Record every material AI interaction honestly. Preserve the user's exact prompt and enough output provenance for a grader to reconstruct what AI produced.

## Required context

Read before updating the audit:

1. `HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf`, especially sections 2, 6, and 8-11
2. `HW05/reports/ai-audit-report.md`, if it exists
3. [references/audit-entry-template.md](references/audit-entry-template.md)

## Append an interaction

1. Create the report from the reference template if it does not exist.
2. Inspect the entire report and assign the next sequential ID: `AI-001`, `AI-002`, and so on. Never reuse an ID.
3. Obtain the current ISO 8601 timestamp with timezone. If it cannot be obtained, write `To be filled by tester`; never guess.
4. Record the actual AI tool name and add it to the report's AI Tools Used table if it is new.
5. Copy the user's prompt verbatim, preserving mistakes and formatting. Redact only secrets or private personal data and mark each redaction explicitly.
6. Preserve the AI output:
   - For files written to the repository, list every generated or modified repository-relative path and summarize the material changes. The files are the full output of record.
   - For advisory text not preserved in an artifact, copy the complete response into the entry. If it is long, save it as `HW05/reports/ai-session-logs/AI-NNN.md` and link it from the entry.
   - For JTL or performance-log analysis, name the exact source files and separate measured values from AI interpretation or recommendations.
7. Set the review status to `Pending human review` unless the user explicitly provides a review or the change is directly verifiable from user-authored evidence.
8. Append the entry in chronological order. Do not replace, reorder, or silently rewrite earlier entries.
9. Ask the tester to complete the Accepted/Modified/Removed/Added fields after review.

## Evidence integrity

- Include the exact declaration: `I use AI tools for the following tasks.`
- Never fabricate test execution, `.jtl` contents, HTML reports, screenshots, resource usage, hardware specifications, GitHub issues, demo video evidence, or human judgments.
- Treat proposed VUs, ramp-up, think-time, thresholds, and optimizations as AI suggestions until the tester validates them.
- Label throughput, latency, p95, error rate, resource ceilings, and endurance thresholds as measured only when traceable to real raw logs or captured evidence.
- Do not create, edit, rename, or summarize a raw `.jtl` file as if it were tool-produced execution evidence.
- Do not mark an output accepted merely because AI generated it.
- Append a correction note to an earlier entry instead of hiding the original error.
- Keep paths repository-relative and never record credentials, tokens, passwords, or private personal data.

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

Leave the last five fields for the tester unless the tester explicitly supplies the review.
