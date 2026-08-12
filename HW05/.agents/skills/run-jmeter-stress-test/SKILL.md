---
name: run-jmeter-stress-test
description: Design, generate, execute, and analyze the HW05 Scenario C Apache JMeter Stress test. Use when implementing Phase 3, creating or revising `23127194_Stress_20260812.jmx`, selecting progressive concurrency from measured Load evidence, running an isolated stress breakpoint experiment, or determining the first sustainable and unsustainable active-thread band from raw JTL and resource data.
---

# Run JMeter Stress Test

Find the first observed degradation or failure band without changing Scenario C or fabricating a breakpoint.

## Read required evidence

Read `HW05/reports/load-test-results.md`, `HW05/tests/23127194_Load_20260812.jmx`, `HW05/plan.md`, and [references/stress-contract.md](references/stress-contract.md). Use only measured Load values as the Phase 3 starting point.

## Design progressive stress

1. Start above the reviewed Load concurrency and increase progressively.
2. Use standard JMeter components unless a plugin is already installed and documented.
3. Preserve the exact nine-request Scenario C flow, CSV isolation, correlation, and assertions.
4. Provision at least one unique account per maximum thread after every backend reset.
5. Use Aggregate Report for Stress so it is distinct from Load's Summary Report.
6. Define observation bands by the JTL `allThreads` field; do not infer concurrency only from elapsed wall time.
7. Treat the Load thresholds as degradation signals, not automatic proof of system capacity.

## Generate and validate

Run the bundled generator from the repository root:

```bash
python3 HW05/.agents/skills/run-jmeter-stress-test/scripts/generate_stress_jmx.py
python3 HW05/.agents/skills/run-jmeter-stress-test/scripts/validate_stress_jmx.py \
  HW05/tests/23127194_Stress_20260812.jmx
```

Require runtime properties `${__P(stress.threads,)}`, `${__P(stress.ramp_up_seconds,)}`, `${__P(stress.duration_seconds,)}`, and `${__P(stress.think_time_ms,)}` with no numeric fallback. Keep View Results Tree disabled.

## Execute safely

Use `HW05/scripts/run-measured-stress.sh`. Refuse to overwrite existing evidence. Reset the backend, provision the maximum thread count, run non-GUI, capture environment/resource/order-state evidence, and stop the backend afterward.

Perform a short dry run before measured execution when the generated JMX has changed. Classify dry-run outputs separately and never include them in measured Stress metrics.

## Analyze breakpoint

Run `scripts/analyze_stress_jtl.py` on the untouched measured JTL. For each active-thread band report:

- complete end-to-end samples and success rate;
- HTTP error rate;
- end-to-end average and p95;
- highest transaction p95;
- throughput.

Call a band unsustainable only when its real data breaches a declared signal or shows a repeatable resource/failure condition. If no band breaches, report `No breakpoint observed up to N active threads`; do not extrapolate beyond N.

Verify residual orders: every successful checkout should finish canceled, and no pending order should remain after graceful completion. Preserve raw artifacts and label resource evidence unavailable if monitoring failed.
