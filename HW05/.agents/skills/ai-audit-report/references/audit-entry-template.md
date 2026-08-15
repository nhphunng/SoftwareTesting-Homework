# HW05 AI Audit Templates

## New report

```markdown
# AI Audit Report

> Declaration: I use AI tools for the following tasks.

## AI Tools Used

| AI Tool | Tasks |
| --- | --- |
| Codex | Describe the actual assisted tasks. |
```

## Interaction entry

```markdown
## AI Audit Entry - AI-NNN

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | YYYY-MM-DDTHH:mm:ss+07:00 |
| Task | Concise task name |
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

For long advisory output, store the complete response under `HW05/reports/ai-session-logs/AI-NNN.md`. Do not use a summary to conceal output that is not otherwise preserved. For performance analysis, identify the raw `.jtl` or other evidence used and distinguish measured values from AI inference.
