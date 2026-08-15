---
name: design-jmeter-endurance-test
description: Design, generate, and validate the HW05 Scenario C Apache JMeter Endurance Test Plan and sustained-load threshold experiment. Use when implementing Phase 5, selecting a 10-15 minute load below the highest sustainable Stress level, creating or revising `23127194_Endurance_20260812.jmx`, preserving the nine-request Scenario C flow, or defining evidence for maximum observed stable RPS and backend memory behavior.
---

# Design JMeter Endurance Test

Design a sustained-load experiment without converting a short test, an observed peak, or an unbounded memory trend into a capacity claim.

## Read required evidence

Read these files before proposing or generating a plan:

1. `HW05/reports/load-test-results.md`
2. `HW05/reports/stress-test-results.md`
3. `HW05/reports/spike-test-results.md`
4. `HW05/tests/23127194_Load_20260812.jmx`
5. `HW05/plan.md`
6. [references/endurance-contract.md](references/endurance-contract.md)

## Gate the design

1. Propose sustained threads, ramp, duration, think-time, acceptance thresholds, measurement windows, resource-sampling interval, and listener strategy from measured evidence.
2. Label every unconfirmed value `Proposed - pending human review`.
3. Require explicit tester confirmation before generating `HW05/tests/23127194_Endurance_20260812.jmx`.
4. Generate with [scripts/generate_endurance_jmx.py](scripts/generate_endurance_jmx.py) only after confirmation; pass every approved workload value explicitly.
5. Do not run measured Endurance traffic until the tester visually reviews the final JMeter tree.

## Preserve the functional contract

Reuse exactly the nine Scenario C requests and paired assertions from Load. Preserve auth-heavy, read-heavy, and transactional coverage; JWT and fresh `orderId` correlation; non-recycled CSV users; same-order cancellation; and final canceled-history verification.

Use one standard JMeter Thread Group with a graceful flow-start deadline. Require runtime properties without numeric fallbacks:

- `endurance.threads`
- `endurance.ramp_up_seconds`
- `endurance.duration_seconds`
- `endurance.think_time_ms`

Provision at least one account per concurrent thread after every backend reset. Keep registration outside the measured JTL. Keep GUI listeners disabled during the measured run; obtain the raw JTL with `-l` and the HTML dashboard with `-e -o`.

## Generate and validate

Generate only after human approval:

```bash
python3 HW05/.agents/skills/design-jmeter-endurance-test/scripts/generate_endurance_jmx.py \
  --threads APPROVED_THREADS \
  --ramp-seconds APPROVED_RAMP_SECONDS \
  --duration-seconds APPROVED_DURATION_SECONDS \
  --think-time-ms APPROVED_THINK_TIME_MS
```

The generator must refuse to overwrite an existing plan. Then run:

```bash
python3 HW05/.agents/skills/design-jmeter-endurance-test/scripts/validate_endurance_jmx.py \
  HW05/tests/23127194_Endurance_20260812.jmx
```

The validator must confirm filename, one sustained Thread Group, exact Load request/assertion parity, four no-fallback runtime properties, CSV isolation, correlation, nine samplers, and disabled GUI listeners.

## Define endurance evidence

Analyze the steady portion in fixed one-minute windows after ramp-up. Report:

- HTTP error rate, business success, end-to-end p95, and transaction p95 per window;
- complete-flow throughput per window and the maximum observed stable RPS under this exact run;
- backend CPU and RSS average/peak per window;
- backend RSS trend over the reviewed tail window, including slope and whether a plateau is actually observed;
- JMeter CPU/RSS separately from backend resources;
- residual non-canceled orders and incomplete flows.

Run the deterministic analyzer against the untouched evidence:

```bash
python3 HW05/.agents/skills/design-jmeter-endurance-test/scripts/analyze_endurance.py \
  HW05/results/raw/endurance/RUN.jtl \
  HW05/evidence/endurance/RUN-resources.csv \
  --output HW05/results/raw/endurance/RUN-analysis.json
```

Call a rate “maximum observed stable RPS” only within the tested configuration. Call a memory value “maximum observed backend RSS” unless valid evidence demonstrates a stable plateau under the reviewed memory criterion. Never call either value a global capacity ceiling.

## Preserve evidence integrity

- Preserve raw JTL, JMeter log, console log, HTML report, environment, resource CSV, and order-state with one run identity.
- Sample resources throughout ramp and steady state; do not accept a header-only resource file.
- Exclude provisioning, dry runs, and preparation failures from measured metrics.
- Never reuse Load, Stress, or Spike metrics as Endurance measurements.
- Stop and retain evidence if the backend crashes, JMeter fails, storage becomes constrained, or account capacity is insufficient.
- Run `$ai-audit-report` after material Phase 5 work.
