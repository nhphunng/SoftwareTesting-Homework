# HW06 AI Audit Templates

## New report

```markdown
# AI Audit Report

> Declaration: I use AI tools for the following tasks.

## AI Tools Used

| AI Tool | Tasks |
| --- | --- |
| ChatGPT / Codex | Replace with the actual assisted tasks. |
```

## Interaction entry

```markdown
## AI Audit Entry - AI-NNN

| Field | Content |
| --- | --- |
| AI Tool | Actual tool name |
| Date and Time | YYYY-MM-DDTHH:mm:ss+07:00 |
| Stage | e.g. API Selection / FR-05 Domain Partition / Newman Analysis |
| API | FR-05 / FR-10 / FR-16 / N/A |
| User Prompt | Verbatim prompt |
| Evidence/Input Basis | Repository-relative input paths, or `None` |
| Generated/Modified Files | Repository-relative output paths, or `None` |
| AI Output | Complete response, or a precise artifact summary plus session-log reference |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:
```

For long advisory output, store the complete response under `HW06/reports/ai-session-logs/AI-NNN.md`. Do not use a summary to hide output that is not otherwise preserved.

For API execution analysis, identify the exact Postman/Newman/request-response evidence used and distinguish observed execution from AI inference.
