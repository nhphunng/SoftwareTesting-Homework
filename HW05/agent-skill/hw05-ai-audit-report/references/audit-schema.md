# HW05 audit schema

| Column | Required content | Performance-specific check |
| --- | --- | --- |
| Prompt + Tool | Artifact, tool, timestamp, exact prompt or verbatim prompt file/hash | Include scenario and requested decision |
| AI Output | Exact output or verbatim output file/hash | Keep proposed VUs, RPS, thresholds, and metric claims |
| Verdict | `VALID`, `INVALID`, or `INCOMPLETE` | Decide only after human verification |
| Reasoning | Assignment/SUT/raw-evidence basis | Cite raw file and exact metric for result analysis |
| Student Fix | Accepted check or visible correction | State changed values/code and why |

## Mandatory interaction categories

- Endpoint/scenario mapping and workload design.
- Generated or revised k6 plans and CSV data.
- Calibration-based VU/RPS and threshold choices.
- AI analysis of raw outputs and every misinterpretation correction.
- Optimization recommendations and source-based feasibility classification.
- Continuous performance-testing proposal and flow chart.
- Main report, critique, PDF/export, video plan, and final packaging assistance.

## Integrity rules

- Do not log screenshots, video, raw metrics, hardware values, or issue links as AI-produced when they came from real execution.
- Do not paraphrase a prompt and label it exact.
- Do not delete invalid AI outputs; retain them because the assignment grades the human critique.
- Link large output artifacts and include SHA-256 so later edits are detectable.
