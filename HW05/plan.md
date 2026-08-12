# HW05 Implementation Plan - Scenario C

## Phase 1 - Human decisions and data

**Status: Phase 1 complete. JMeter, execution identity/date, Scenario C, API smoke validation, backend reset behavior, and parameterized user provisioning are confirmed. Workload sizing remains a Phase 2 decision.**

- [x] Select the class-default tool: **JMeter**.
- [x] Confirm Student ID: **23127194**.
- [x] Confirm the final execution date: **2026-08-12** (`20260812` in filenames).
- [x] Confirm Candidate C is unique in the group; Candidate A is already taken.
- [x] Verify the supplied user and admin demo accounts without storing their passwords in the repository.
- [x] Verify a real product for Scenario C: product `1`, `iPhone 15 Pro Max`.
- [x] Automate dedicated JMeter user provisioning with `scripts/provision-jmeter-users.sh`. Each phase must pass `USER_COUNT >= maximum concurrent threads` after workload review.
- [x] Confirm reset policy: every backend start drops and reseeds all tables; run user provisioning immediately after each start. This also removes residual orders from the prior process.
- [x] Smoke-test every Scenario C endpoint.

### Phase 1 environment check

| Item | Verified result |
| --- | --- |
| JMeter | Apache JMeter 5.6.3 installed under `~/.local/opt/apache-jmeter-5.6.3`; `~/.local/bin/jmeter` is on `PATH` |
| JMeter integrity | Official binary SHA-512 matched Apache's published checksum |
| Java | Java 24; JMeter version and non-GUI CLI smoke execution passed |
| Backend | Started successfully on `http://127.0.0.1:3000` for the smoke test, then stopped |
| User account | `test@eshop.com` login verified; password intentionally not recorded |
| Admin account | `admin@eshop.com` login and `GET /api/admin/orders` verified; password intentionally not recorded |

### Scenario C smoke result - 2026-08-12T11:54:44+07:00

| Step | Endpoint | Result |
| --- | --- | --- |
| User login | `POST /api/login` | HTTP 200; JWT received |
| Product search | `GET /api/products?search=iPhone` | HTTP 200; product `1` selected |
| Product detail | `GET /api/products/1` | HTTP 200; matching ID and positive price |
| Add to cart | `POST /api/cart` | HTTP 200 |
| Verify cart | `GET /api/cart` | HTTP 200; selected product present |
| Checkout | `POST /api/checkout` | HTTP 200; order `1` created |
| Read fresh order | `GET /api/orders/1` | HTTP 200; status `pending` |
| Cancel fresh order | `PUT /api/orders/1/cancel` | HTTP 200 |
| Verify history | `GET /api/orders/my-orders` | HTTP 200; order `1` status `canceled` |
| Admin login | `POST /api/login` | HTTP 200; JWT received |
| Admin order read | `GET /api/admin/orders` | HTTP 200; array response |

The backend process was stopped after the smoke test, clearing its in-memory cart. Canceled order `1` remains in SQLite because the SUT has no order-deletion endpoint. This was a functional smoke test, not a performance run; it produced no `.jtl`, report, threshold, or resource evidence.

### Automated JMeter user provisioning

The backend implementation drops and recreates all tables on every start. Therefore, each Load, Stress, Spike, and Endurance preparation must:

1. Start the backend and wait for `GET /api/products` to return HTTP 200.
2. Run `scripts/provision-jmeter-users.sh` with the reviewed `USER_COUNT` and a local `JMETER_USER_PASSWORD`.
3. Use the generated Git-ignored `data/scenario-c.local.csv` in JMeter CSV Data Set Config.
4. Require at least one unique account per maximum concurrent thread.

Automation verification created five temporary accounts for Student ID `23127194`, verified every account by login, and generated a six-line local CSV (header plus five rows) with file mode `600`. A second backend start reset the database, and the script successfully recreated all five accounts (`created=5`, `reused=0`). During verification, immediate post-registration login was briefly inconsistent for one user, so the script now retries that verification up to five times and fails closed if the account remains unusable. Five is only a functional verification count, not a workload recommendation.

Suggested commit: `docs(hw05): select scenario C and define execution controls`

## Phase 2 - Load test

- [x] Initialize `.agents/skills/design-jmeter-load-test` as the design/generation gate for the Scenario C Load plan.
- [x] Document the fixed JMeter structure, data/correlation contract, evidence boundary, and approval checklist in `reports/load-test-design.md`.
- [x] Use the skill to run and document a real single-user baseline in `reports/load-baseline.md`.
- [x] Obtain human confirmation for 10 VUs, 20-second ramp-up, 120-second hold, 0-second staged ramp-down, 500 ms think-time, reviewed thresholds, and Summary Report allocation.
- [x] Generate `tests/23127194_Load_20260812.jmx` after confirmation.
- [x] Pass XML/skill validation, required-property negative validation, and a one-thread functional dry run; see `reports/load-plan-validation.md`.
- [x] Tester visually reviewed and accepted the final tree in JMeter GUI before measured execution.
- [x] Execute the reviewed measured Load run and retain raw JTL, HTML dashboard, environment context, and database state; see `reports/load-test-results.md`.
- [ ] Repeat resource capture in a future attributed run if CPU/RSS evidence is required; the measured run's monitor CSV contains only its header and is not accepted as resource evidence.
- Use final Load filename `23127194_Load_20260812.jmx`.
- Review baseline latency and throughput.
- Choose realistic VUs, ramp-up, hold, ramp-down, and think-time.
- Create the data-driven Scenario C JMeter `.jmx` plan.
- Add reviewed thresholds and response assertions.
- Run with raw output, report view, resource monitor, and hardware context.
- Review order creation/cancellation correctness and residual data.

Suggested commit: `test(hw05): implement reviewed scenario C load plan`

## Phase 3 - Stress test

- [x] Initialize and validate `.agents/skills/run-jmeter-stress-test`.
- [x] Derive a progressive 1-80 thread stress contract from measured Load evidence; see `reports/stress-test-design.md`.
- [x] Generate and structurally validate `tests/23127194_Stress_20260812.jmx` with Aggregate Report.
- [x] Complete a short functional dry run after correcting stale-backend/reset control; 24/24 flows passed with 0 residual non-canceled orders.
- [x] Execute the measured Stress run and analyze active-thread bands; no breakpoint was observed through 80 active threads. See `reports/stress-test-results.md`.
- Use final Stress filename `23127194_Stress_20260812.jmx`.
- Define progressive stress stages from the Load baseline.
- Identify the first sustainable/unsustainable level without reusing locked or corrupted accounts.
- Create the Stress JMeter `.jmx` plan by reusing the exact Scenario C functional controllers from Load.
- Execute with isolated evidence and document recovery behavior.
- [ ] Tester visually reviews the final Stress tree and measured results in JMeter GUI/HTML dashboard.

Suggested commit: `test(hw05): implement scenario C stress breakpoint plan`

## Phase 4 - Spike test

- [x] Initialize and validate `.agents/skills/design-jmeter-spike-test` as the Phase 4 design/generation gate.
- [x] Derive and document a three-stage Spike/recovery proposal from measured Load and Stress evidence in `reports/spike-test-design.md`.
- [x] Review and confirm baseline, spike, recovery, transition, think-time, recovery thresholds, and the third listener allocation.
- [x] Generate and validate `tests/23127194_Spike_20260812.jmx` after explicit confirmation; exact Load request/assertion parity and a validation-only 2→4→2 VU dry run passed. See `reports/spike-plan-validation.md`.
- [x] Tester visually reviewed and accepted the final Spike tree before measured execution.
- [x] Execute the measured 10→80→10 Spike run and retain raw JTL, HTML dashboard, environment, resource, and order-state evidence; application recovery was confirmed within 10 seconds. See `reports/spike-test-results.md`.
- Use final Spike filename `23127194_Spike_20260812.jmx`.
- Define baseline, spike, and recovery stages from prior observations.
- Create the Spike JMeter `.jmx` plan by reusing the exact Scenario C functional controllers from Load.
- Execute with isolated evidence and verify post-spike recovery.

Suggested commit: `test(hw05): implement scenario C spike recovery plan`

## Phase 5 - Endurance threshold

- [x] Initialize and validate `.agents/skills/design-jmeter-endurance-test` as the Phase 5 design/generation gate.
- [x] Derive and review a 10-15 minute sustained-load proposal from measured Load, Stress, and Spike evidence. See `reports/endurance-test-design.md`.
- [x] Confirm workload, ramp, duration, think-time, latency/business thresholds, descriptive memory-trend rule, and disabled-listener strategy.
- [x] Generate and validate `tests/23127194_Endurance_20260812.jmx`; structural parity and a validation-only 2-thread dry run passed. See `reports/endurance-plan-validation.md`.
- [x] Tester visually reviewed and accepted the final Endurance tree before measured execution.
- [x] Execute and analyze the measured 60-thread/12-minute Endurance run; all 11 complete steady-state minutes passed, maximum observed stable flow rate was 26.23 flows/s, and maximum observed backend RSS was 188.84 MiB without a demonstrated plateau. See `reports/endurance-test-results.md`.
- Select a sustained load below the highest tested Stress concurrency; no breakpoint was observed through 80 active threads.
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
