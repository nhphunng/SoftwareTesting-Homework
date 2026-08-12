---
name: design-jmeter-load-test
description: Design, generate, and validate the HW05 Scenario C Apache JMeter Load Test Plan. Use when defining the Phase 2 baseline/workload contract, creating or revising `23127194_Load_20260812.jmx`, reviewing CSV correlation and assertions, or preparing a safe non-GUI load-test command and evidence checklist before measured execution.
---

# Design JMeter Load Test

Design the Phase 2 Load plan without inventing workload values, thresholds, or measured evidence. Keep the selected Scenario C functional flow unchanged for later Stress and Spike plans.

## Load required context

Read these project files before designing or generating anything:

1. `HW05/plan.md`
2. `HW05/scenario.md`
3. `HW05/runbook.md`
4. `HW05/reports/smoke-test.md`
5. `HW05/reports/user-provisioning.md`
6. [references/scenario-c-load-contract.md](references/scenario-c-load-contract.md)

Inspect the current SUT source only when an endpoint or payload remains ambiguous. Never copy credentials from conversation history into a tracked artifact.

## Follow the phase gate

1. Verify JMeter, Student ID, date, selected scenario, endpoint smoke status, and reset/provisioning behavior.
2. Review a real single-user baseline before proposing VUs, ramp-up, hold, ramp-down, think-time, or thresholds.
3. Present every proposed value with its evidence/rationale and label it `Proposed - pending human review`.
4. Do not generate the final `.jmx` until the tester confirms workload parameters, thresholds, and the Load report/listener allocation.
5. If confirmation is absent, update only a design section or checklist; leave the Phase 2 plan pending.

## Design the workload

Record the following contract in `HW05/plan.md` or a dedicated design artifact before generating XML:

| Parameter | Required basis |
| --- | --- |
| Threads/VUs | Target concurrency and available unique CSV rows |
| Ramp-up | Rate that avoids an accidental spike |
| Hold duration | Enough steady-state samples for the stated objective |
| Ramp-down | Explicit shutdown behavior |
| Think-time | User-behavior rationale or baseline observation |
| Thresholds | Baseline-derived p95/error/business-success criteria |
| Listener/report | Distinct from the later Stress and Spike allocations |

Require `USER_COUNT >= maximum concurrent threads`. Treat setup, registration, and provisioning as unmeasured traffic.

## Generate the JMeter plan

Create exactly `HW05/tests/23127194_Load_20260812.jmx`. Use standard JMeter 5.6.3 components and externally overrideable properties:

- `${__P(load.threads,)}`
- `${__P(load.ramp_up_seconds,)}`
- `${__P(load.duration_seconds,)}`
- `${__P(load.think_time_ms,)}`

Fail clearly when required properties are omitted; do not hide unreviewed numeric defaults in the JMX. Configure CSV Data Set Config for `data/scenario-c.local.csv`, `recycle=false`, and `stopThread=true`. Extract `token` and `orderId`, send `Authorization: Bearer ${token}`, and add both HTTP and business-state assertions.

Keep registration outside the measured Thread Group. Preserve the exact ordered Scenario C flow from the reference contract. Use transaction controllers and stable sampler names so results can be grouped by auth-heavy, read-heavy, and transactional work.

Keep heavy GUI listeners, especially View Results Tree, disabled during measured non-GUI runs. Record the human-approved report/listener allocation without claiming that a listener screenshot replaces raw `.jtl` evidence.

## Validate before execution

Run:

```bash
python3 HW05/.agents/skills/design-jmeter-load-test/scripts/validate_load_jmx.py \
  HW05/tests/23127194_Load_20260812.jmx
```

Then inspect the plan with JMeter GUI for structure only and perform a one-thread functional dry run after provisioning. Classify that dry run as validation, not load-test evidence. Do not start a measured Phase 2 run unless the user explicitly requests execution and the workload contract is human-approved.

## Preserve evidence integrity

- Never fabricate or hand-edit `.jtl`, HTML report, screenshot, hardware, or resource-monitor evidence.
- Keep secrets and `data/scenario-c.local.csv` untracked.
- Name real outputs so they can be attributed to this plan and one run.
- Run `$ai-audit-report` after material design or generation work and leave human review pending.
