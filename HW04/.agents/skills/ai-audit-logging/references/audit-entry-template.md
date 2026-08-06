# AI Audit Entry Template

```markdown
## AI Audit Entry – AI-NNN

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | YYYY-MM-DDTHH:mm:ss+07:00 |
| Task | Concise task name |
| User Prompt | Verbatim prompt |
| Generated/Modified Files | Repository-relative paths, or `None` |
| AI Output | Complete response, or a precise artifact summary plus session-log reference |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:
```

For a long advisory response, store the complete response under `HW04/reports/ai-session-logs/AI-NNN.md` and reference it from `AI Output`. Do not use this indirection to omit code or documents already preserved in generated files.

