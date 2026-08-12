# HW05 Implementation Plan - Scenario C

## Phase 1 - Human decisions and data

- Confirm k6 with the lecturer if the class defaults to JMeter.
- Confirm Student ID and final execution date.
- Confirm Candidate C is unique in the group.
- Prepare dedicated user accounts and valid products.
- Decide database snapshot/reset and residual-order handling.
- Smoke-test every Scenario C endpoint.

Suggested commit: `docs(hw05): select scenario C and define execution controls`

## Phase 2 - Load test

- Review baseline latency and throughput.
- Choose realistic VUs, ramp-up, hold, ramp-down, and think-time.
- Copy and rename the Load template manually.
- Add reviewed thresholds and response assertions.
- Run with raw output, report view, resource monitor, and hardware context.
- Review order creation/cancellation correctness and residual data.

Suggested commit: `test(hw05): implement reviewed scenario C load plan`

## Phase 3 - Stress test

- Define progressive stress stages from the Load baseline.
- Identify the first sustainable/unsustainable level without reusing locked or corrupted accounts.
- Copy and rename the Stress template manually.
- Execute with isolated evidence and document recovery behavior.

Suggested commit: `test(hw05): implement scenario C stress breakpoint plan`

## Phase 4 - Spike test

- Define baseline, spike, and recovery stages from prior observations.
- Copy and rename the Spike template manually.
- Execute with isolated evidence and verify post-spike recovery.

Suggested commit: `test(hw05): implement scenario C spike recovery plan`

## Phase 5 - Endurance threshold

- Select a sustained load below the observed stress breakpoint.
- Run for approximately 10-15 minutes with resource monitoring.
- Derive the maximum stable RPS and memory ceiling only from recorded evidence.

Suggested commit: `test(hw05): add endurance threshold experiment`

## Phase 6 - AI analysis and human critique

- Give AI the untouched raw outputs and environment context.
- Preserve the complete AI output.
- Verify every AI-cited value against raw logs.
- Record misinterpretations and corrected values.
- Classify each proposed optimization as feasible or hallucinated.
- Write the mandatory 200-300 word critique.

Suggested commit: `docs(hw05): review AI performance analysis against raw logs`

## Phase 7 - Continuous performance proposal and submission

- Add a commit-trigger decision flow and p95 regression policy.
- Discuss cost and false-alarm trade-offs.
- Complete Markdown/PDF reports and render checks.
- Record the 6+ minute Vietnamese demo with tool and resource monitor together.
- Export the real Git log and complete the submission checklist.

Suggested commit: `docs(hw05): finalize continuous testing proposal and submission`
