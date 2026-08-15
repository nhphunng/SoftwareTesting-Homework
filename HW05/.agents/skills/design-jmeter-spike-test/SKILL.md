---
name: design-jmeter-spike-test
description: Design, generate, and validate the HW05 Scenario C Apache JMeter Spike Test Plan. Use when implementing Phase 4, choosing baseline-spike-recovery stages from measured Load and Stress evidence, creating or revising `23127194_Spike_20260812.jmx`, verifying that the nine-request flow is unchanged, or preparing post-spike recovery checks and a third distinct listener/report allocation.
---

# Design JMeter Spike Test

Design a sudden-load-and-recovery experiment without inventing recovery behavior or claiming a capacity ceiling.

## Read required evidence

Read these files before proposing or generating a plan:

1. `HW05/reports/load-test-results.md`
2. `HW05/reports/stress-test-results.md`
3. `HW05/tests/23127194_Load_20260812.jmx`
4. `HW05/tests/23127194_Stress_20260812.jmx`
5. `HW05/plan.md`
6. [references/spike-contract.md](references/spike-contract.md)

## Gate the design

1. Propose baseline, spike, recovery, stage duration, transition time, think-time, thresholds, and listener allocation from measured evidence.
2. Label every proposal `Proposed - pending human review`.
3. Require explicit tester confirmation before generating `HW05/tests/23127194_Spike_20260812.jmx`.
4. Do not run measured Spike traffic until the tester visually reviews the final JMeter tree.

## Preserve the functional contract

Reuse exactly the nine Scenario C requests and business assertions from Load and Stress. Keep JWT and fresh `orderId` correlation, non-recycled CSV users, same-order cancellation, and final canceled-history verification.

Use standard JMeter 5.6.3 components. Model three named stages—baseline, sudden spike, and recovery—with explicit stage labels in the JTL. Ensure accounts cannot overlap across simultaneously active stages. Prefer sequential standard Thread Groups when avoiding plugins; if stages overlap, allocate non-overlapping CSV ranges and document them.

Use a third listener/report view distinct from Load's Summary Report and Stress's Aggregate Report. Keep View Results Tree disabled during measured execution. Treat `Response Time Graph` as a candidate until the tester confirms it.

## Generate and validate

After human confirmation, create the final plan by cloning the validated Scenario C functional controller from the Load plan into three explicitly named, serialized standard Thread Groups. Put approved numeric values and rationale in Test Plan comments; do not add hidden fallback values. Then run:

```bash
python3 HW05/.agents/skills/design-jmeter-spike-test/scripts/validate_spike_jmx.py \
  HW05/tests/23127194_Spike_20260812.jmx
```

Refuse to overwrite an existing plan. The validator must confirm filename, three stages, nine-request parity per stage, CSV isolation, correlation, listener allocation, and disabled View Results Tree.

## Define recovery evidence

Compare recovery-stage metrics against both pre-spike baseline and reviewed limits. Report:

- HTTP error rate and business success per stage;
- end-to-end and transaction p95 per stage;
- time until post-spike metrics return to the accepted recovery range;
- resource peak and return toward pre-spike level;
- residual non-canceled orders.

Call recovery successful only when real post-spike samples and business state support it. If the plan never reaches a failure condition, describe resilience at the tested spike level without calling it a capacity limit.

## Preserve evidence integrity

- Provision at least the maximum simultaneous thread count after each backend reset.
- Keep registration outside measured JTL.
- Preserve raw JTL, HTML report, resource CSV, environment, and order-state with one run identity.
- Never reuse Load or Stress metrics as if they were Spike measurements.
- Run `$ai-audit-report` after material Phase 4 work.
