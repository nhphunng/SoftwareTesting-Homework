---
name: hw05-ai-audit-report
description: Capture, append, and review mandatory AI Audit Report entries for HW05 performance testing. Use whenever AI helps design or change k6 plans, choose VU/RPS/thresholds, interpret raw results, propose optimizations, create reports or diagrams, or package submission artifacts, and when Codex must preserve the exact prompt/output plus a human VALID/INVALID/INCOMPLETE verdict without inventing execution evidence.
---

# HW05 AI Audit Report

## Required workflow

1. Record an entry immediately after every material AI interaction; do not reconstruct the history at submission time.
2. Preserve tool name, Asia/Ho_Chi_Minh timestamp, exact prompt, exact output, affected artifact, verdict, reasoning, and student correction.
3. Save long verbatim prompts and outputs under `audit/prompts/` and `audit/outputs/`; cite their paths and SHA-256 hashes in the row.
4. Use `VALID` only when the output is accepted after checking it against the assignment, SUT source, and raw evidence. Use `INVALID` for rejected claims and `INCOMPLETE` when human additions are required.
5. For metric claims, cite the exact raw k6 file, scenario tag, metric, aggregation, and value. Never treat an AI summary as execution evidence.
6. For optimization claims, inspect the relevant Express/SQLite source before classifying feasibility.
7. Highlight the human change in the Student Fix cell. Do not write “accepted” without describing the checks performed.
8. Append a row with `scripts/append_audit_entry.py`; never overwrite existing rows.
9. Validate completeness against [references/audit-schema.md](references/audit-schema.md) before PDF export.

## Append command

```bash
python3 scripts/append_audit_entry.py \
  --report audit/ai-audit-report.md \
  --artifact HW05/k6/plans/example.js \
  --tool Codex \
  --time "2026-08-10 14:00 +07" \
  --prompt-file audit/prompts/interaction-001.txt \
  --output-file audit/outputs/interaction-001.txt \
  --verdict INCOMPLETE \
  --reasoning "Checked against the HW05 requirement and raw k6 output." \
  --student-fix "Changed the workload after calibration."
```

Keep the report marker `<!-- AUDIT_ROWS -->`; the script inserts new rows immediately before it.
