---
name: k6-performance-workflow
description: Design, execute, document, and audit data-driven k6 performance tests with Grafana for Load, Stress, Spike, and short endurance scenarios. Use when Codex must map endpoint groups to exactly one scenario, create k6 plans and CSV data, preserve raw evidence, analyse p95/error/throughput/resource metrics, challenge AI interpretations, or prepare a performance-testing assignment without fabricating execution evidence.
---

# K6 Performance Workflow

## Guardrails

- Treat raw logs, screenshots, resource measurements, hardware facts, issue links, and video links as human-executed evidence. Never invent or backfill them.
- Inspect the SUT source and API contract before choosing endpoints or assertions.
- Keep each endpoint group assigned to exactly one required scenario.
- Keep setup traffic separate from measured traffic and tag both explicitly.
- Use a dedicated CSV per endpoint group. Validate row counts and required columns before a run.
- Record every AI interaction in the audit report as it happens.
- Stop and report a blocker when the backend, metrics sink, or evidence capture is unavailable.

## Workflow

1. Read the assignment and build a requirement-to-artifact matrix. For HW05-style submissions, read [references/deliverables.md](references/deliverables.md).
2. Inspect endpoints, authentication rules, state changes, database constraints, and known defects.
3. Select one endpoint group for each Load, Stress, and Spike scenario. Explain the pairing.
4. Define workload hypotheses before values: normal traffic, expected limit, surge size, ramp/hold/recovery, and think time.
5. Create one CSV per group and isolate mutable users/orders from other scenarios.
6. Add checks and thresholds for status, business correctness, p95, error rate, throughput, dropped iterations, and recovery where relevant.
7. Dry-run with one VU and a short duration. Correct functional failures before increasing load.
8. Execute calibration runs, then evidence runs while the backend resource monitor is visible.
9. Preserve the exact plan, CSV, command, environment, raw output, summary, report view, screenshots, and timestamps for every run.
10. Run an approximately 10–15 minute soak near the candidate stable limit. State the threshold operationally, including p95/error/resource ceilings.
11. Analyse raw values, then cross-check every AI claim against the raw artifact. Separate observation, inference, and recommendation.
12. Classify optimizations as feasible, conditional, or hallucinated by checking the SUT implementation.
13. Propose a commit-triggered regression gate with a p95 baseline, tolerance, retry policy, and false-alarm controls.
14. Run `scripts/verify_hw05_artifacts.sh <submission-root>` before packaging.

## k6 and Grafana evidence

- Preserve a machine-readable raw k6 output for every scenario; do not rename fabricated data to `.jtl`.
- State explicitly that k6 raw JSON/CSV is the JMeter `.jtl` equivalent when the course accepts k6.
- Provide three distinct human-facing views across the scenarios, such as k6 Web Dashboard HTML, Grafana dashboard, and k6 textual/JSON summary.
- Export the Grafana dashboard definition or capture the dashboard with the run time range and scenario tags visible.
- Capture backend CPU and memory in the same frame as the test tool for the required demo.

## Review protocol

For each conclusion, cite the source file and exact metric. Check aggregation scope, percentile versus average, setup traffic contamination, HTTP failure semantics, dropped iterations, test duration, and sample count. Do not recommend indexes, connection pools, WAL, caching, or concurrency changes until the relevant code and database behavior have been inspected.
