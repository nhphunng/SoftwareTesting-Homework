# Scenario C Runbook

> **Superseded:** Phase 1 confirmed JMeter as the class-default and final project tool. The k6 commands below are retained only as historical scaffold notes. Do not use them for the final HW05 execution. Create the JMeter runbook during Phase 2.

## 1. Validate the skeleton

```bash
npm run validate
```

This performs static k6 inspection with syntax-only values. It does not contact the SUT or produce execution evidence.

## 2. Prepare final test plans manually

After choosing the actual execution date, manually copy each template and give it the assignment-required name:

```text
tests/{StudentID}_Load_{YYYYMMDD}.js
tests/{StudentID}_Stress_{YYYYMMDD}.js
tests/{StudentID}_Spike_{YYYYMMDD}.js
```

Do not leave `{StudentID}` or `{YYYYMMDD}` in submitted filenames. Keep the Endurance file separately named and document that it supports the threshold experiment rather than replacing one of the three required plans.

## 3. Prepare test data

1. Copy `data/scenario-c.example.csv` to `data/scenario-c.local.csv`.
2. Add enough unique valid accounts for the reviewed maximum concurrency.
3. Ensure every `search_keyword` returns data and every `product_id` exists.
4. Use only dedicated test accounts so login lockout or cart growth cannot affect other work.
5. Keep the local credential CSV out of Git. Provide a sanitized data template in the public repository.

## 4. Required runtime configuration

Every real run must supply:

```text
BASE_URL
DATA_FILE
WORKLOAD_CONFIRMED=true
REQUIRED_USER_ROWS
THINK_TIME_SECONDS
GRACEFUL_RAMP_DOWN or GRACEFUL_STOP
scenario-specific VU and duration variables
```

The wrapper throws an error when a required workload value is absent. No workload parameters in this skeleton are recommendations.

k6 script variables must be passed explicitly with `-e`; ordinary shell variables are not automatically exposed as `__ENV` values. Use this shape and replace every placeholder with a reviewed value:

```bash
k6 run \
  -e BASE_URL=<reviewed-url> \
  -e DATA_FILE=<absolute-local-csv-path> \
  -e WORKLOAD_CONFIRMED=true \
  -e REQUIRED_USER_ROWS=<at-least-maximum-vus> \
  -e THINK_TIME_SECONDS=<reviewed-seconds> \
  -e <SCENARIO_VARIABLE>=<reviewed-value> \
  tests/<final-assignment-compliant-filename>.js
```

## 5. Output plan

Retain one attributable raw output and one reviewed report view for each run. Suggested k6 equivalents, subject to lecturer confirmation:

| Scenario | Raw output | Distinct report view |
| --- | --- | --- |
| Load | k6 JSON output | Web dashboard overview exported to `results/html/load/` |
| Stress | k6 CSV output | End-of-test summary focused on breakpoint stages in `results/summary/stress/` |
| Spike | k6 JSON output | Recovery-focused dashboard exported to `results/html/spike/` |

The assignment uses JMeter `.jtl` and HTML-folder terminology. Confirm the exact accepted k6 equivalents before final execution and submission.

## 6. Per-run evidence procedure

1. Record the final test-plan filename and Git commit.
2. Restore a known database/process state and document it.
3. Start the backend and resource monitor.
4. Put k6 and the backend resource monitor in the same captured frame.
5. Start the run with a unique run label and output paths.
6. Do not modify the raw output after k6 writes it.
7. Capture the resource monitor and tool result.
8. Record observed errors and verify whether they are functional, performance, data, or script failures.
9. Confirm all newly created orders are correlated and canceled; disclose residual rows.
10. Archive raw output, report view, screenshot, runtime command, hardware context, and Git commit together.

## 7. Endurance experiment

- Run for approximately 10-15 minutes at a human-reviewed sustained load.
- Observe throughput, p95, error rate, memory, and CPU together.
- Report a threshold only from real stable/unstable observations on the tester's hardware.
- Preserve the raw output and resource evidence used to justify the threshold.

## 8. AI analysis handoff

Provide the untouched raw output to AI, preserve the AI response, then compare every cited metric with the raw source. Record misread metrics and classify every optimization as feasible or hallucinated with evidence.
