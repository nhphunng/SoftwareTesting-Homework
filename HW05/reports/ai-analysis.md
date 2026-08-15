# AI Performance Analysis and Misinterpretation Hunt

## 1. Raw inputs supplied to AI

The tester selected Load Run02 as one independent evidence set because the original Load resource CSV was unusable. Stress, Spike, and Endurance use their unsuffixed measured runs. No artifact from a different run identity is used to fill a missing metric.

| Run | Untouched raw JTL and SHA-256 | Same-run report and context | Resource evidence |
| --- | --- | --- | --- |
| Load Run02 | `results/raw/load/23127194_Load_20260812_Run02.jtl` — `93339257e0a408a5d591820ac11e591736f2ed40d69abe7a7e2db0fad8ac67b5` | `results/html/load/23127194_Load_20260812_Run02/`; Run02 environment and order state | Run02 CSV has malformed four-field rows and is not valid backend CPU/RSS evidence |
| Stress | `results/raw/stress/23127194_Stress_20260812.jtl` — `11017bc182bcfa53966964620e5a957a39cdbcf7c42cf1dc3080555c253660b8` | Unsuffixed Stress HTML report, environment, and order state | 294 timestamped samples |
| Spike | `results/raw/spike/23127194_Spike_20260812.jtl` — `62592462cb28c12ea3469fa73836db1b91793161b45cba1ebcbc024bb8c53c9e` | Unsuffixed Spike HTML report, environment, and order state | 125 backend samples; 124 JMeter samples |
| Endurance | `results/raw/endurance/23127194_Endurance_20260812.jtl` — `15752a8303fc0db4c7696b6da116b899d1c38e79e90aa351dac8daede4f072c9` | Unsuffixed Endurance HTML report, deterministic analysis JSON, environment, and order state | 698 timestamped samples |

## 2. Preserved AI output

The four runs completed without an HTTP or business-flow failure. Load Run02 passed 291/291 complete flows and 2,619/2,619 HTTP requests; its end-to-end p95 was 48 ms. Stress passed 6,336/6,336 flows and 57,024/57,024 HTTP requests; its highest measured active-thread band, 61–80, had an end-to-end p95 of 26 ms. This means only that no breakpoint was observed through 80 active threads. Spike passed 2,363/2,363 flows; Baseline, Spike, and Recovery p95 values were 36.45, 27.00, and 26.00 ms. Application recovery met the reviewed contract in the first complete 10-second Recovery window, while memory recovery was not demonstrated. Endurance passed 18,400/18,400 flows and all eleven complete steady-state minutes. Its highest passing one-minute complete-flow rate was 26.23 flows/s. Backend RSS peaked at 188.84 MiB, but the final-five-minute slope was +5.99 MiB/minute, so neither that peak nor the run proves a memory ceiling.

The accepted 250 ms end-to-end limit is useful as a broad functional guard but is too loose to detect a moderate regression on this local environment. Candidate diagnostic thresholds for a repeatable local run are: HTTP errors <= 1%, business success >= 99%, Load end-to-end p95 <= 75 ms, Stress 61–80-band p95 <= 60 ms, Spike recovery <= 1.5 times same-run Baseline within 20 seconds, and Endurance one-minute complete-flow rate >= 24 flows/s with end-to-end p95 <= 60 ms. These are AI proposals, not production SLOs, and require repeated-run validation before adoption.

## 3. Metric verification and human corrections

| AI interpretation under review | Correct raw value/source | Verdict | Human correction |
| --- | --- | --- | --- |
| “Load Run02 has valid backend resource monitoring because its CSV has 140 rows.” | Every Run02 row has four fields under a five-column header; backend statistics are absent. See the Run02 CSV and `scripts/run-measured-load.sh`. | Rejected | File existence and row count do not establish field attribution. No Load backend CPU/RSS claim is permitted. |
| “Stress established the capacity ceiling at 80 VUs.” | The 61–80 band had 0% HTTP errors, 100% business success, and 26 ms E2E p95. | Rejected | 80 is the maximum tested concurrency; the breakpoint was not reached. |
| “Endurance established a maximum stable RPS of 26.23.” | Minute 9 recorded 26.23 **complete Scenario C flows/s**; each flow contains nine HTTP requests. | Rejected | Report the unit as complete flows/s, not HTTP requests/s and not a universal maximum. |
| “188.84 MiB is the backend memory ceiling.” | It is the maximum observed RSS; the final-five-minute slope was +5.99 MiB/minute. | Rejected | A peak is not a ceiling or plateau. Longer/repeated soak tests are required. |
| “Spike fully recovered because Recovery p95 passed.” | Recovery p95 was 26 ms and CPU returned toward baseline, but final Recovery RSS averaged 182.17 MiB versus 77.27 MiB before Spike. | Partly correct | Claim application/latency and CPU recovery only; do not claim memory recovery. |
| “All four tests prove production performance.” | All evidence came from one local macOS host and a reset/reseeded demo SQLite database. | Rejected | Conclusions apply only to these workloads, machine, data volume, and run conditions. |

## 4. Optimization classification

| AI recommendation | Classification | SUT evidence and reasoning | Next validation / trade-off |
| --- | --- | --- | --- |
| Add a unique index on `users(email)` | Feasible | Login uses `WHERE email = ?`; `email` is not unique or indexed in `backend/database.js`. | Compare login p95/query plans at realistic user counts; migration must handle duplicates. |
| Add an index such as `orders(user_id, id DESC)` | Feasible | Order history uses `WHERE user_id = ? ORDER BY id DESC`; Endurance created 18,400 orders. | Benchmark with retained order data; writes become slightly more expensive. |
| Experiment with SQLite WAL and a bounded `busy_timeout` | Feasible but unproven | The SUT uses one `sqlite3.Database`; no WAL/busy-timeout configuration is present and no lock failure occurred. | Run write-heavy A/B tests; WAL changes durability/checkpoint behavior. |
| Cache product search/detail responses | Feasible, low priority | The same small seeded product set is read and measured read p95 remained low. | Add only with invalidation rules; current evidence does not show a read bottleneck. |
| Add a conventional database connection pool | Hallucinated/inapplicable as stated | The SUT uses embedded SQLite, not a network database server. | Reconsider after a server-DB migration; extra SQLite connections may increase lock contention. |
| Horizontally scale Node processes without other changes | Hallucinated/unsafe as stated | Carts are process-local memory and orders use one local SQLite file. | Requires shared state, a production database, routing, and correctness tests. |
| Increase a generic “Node thread pool” to fix latency | Unsupported | No CPU saturation or libuv worker-pool bottleneck was observed. | Profile first; unrelated tuning can add complexity without benefit. |

## 5. Human review of AI-assisted design

The tester approved all measured result reports. The tester also identified a process-level limitation: generated skills tended to encode one narrowly scoped task and did not generalize well to similar test types or other endpoint groups. Reinspection confirms that the Stress plan intentionally uses one progressive measured Thread Group and analyzes four active-thread bands; no three-stage Stress correction was made or required.

### Proposal-to-human-decision traceability

| AI proposal or initial direction | Tester action | Classification |
| --- | --- | --- |
| Candidate A was the preliminary scenario recommendation. | Selected Scenario C because Candidate A was already used by another group member. | Human changed the AI recommendation. |
| The early project skeleton used k6 before the class-default tool was confirmed. | Selected Apache JMeter as the final tool and superseded the k6 scaffold. | Human changed the implementation direction. |
| Accounts could not survive a backend restart because the SUT resets its database. | Required automated per-run provisioning with at least one unique account per maximum concurrent thread. | Human added an execution constraint and automation requirement. |
| Load proposal: 10 VUs, 20-second ramp, 120-second hold, 500 ms think-time, error/business/latency thresholds, and Summary Report. | Confirmed the complete proposal without numeric modification, then visually reviewed the final tree. | Human validated; no parameter refinement. |
| Stress proposal: progressive ramp to 80 threads over 240 seconds, 300-second flow-start deadline, 250 ms think-time, Aggregate Report, and four analysis bands. | Authorized execution and later approved the design, tree, and measured result without changing the workload values. | Human validated; no parameter refinement. |
| Spike proposal: serialized 10-thread Baseline, 80-thread Spike, 10-thread Recovery, stage/recovery thresholds, and Response Time Graph. | Explicitly confirmed the complete proposal and visually reviewed the final tree. | Human validated; no parameter refinement. |
| Endurance proposal: 60 threads, 30-second ramp, 720-second duration, 250 ms think-time, resource/window rules, and disabled GUI listeners. | Explicitly confirmed the complete proposal and visually reviewed the final tree. | Human validated; no parameter refinement. |
| The original unsuffixed Load run was the measured result of record. | Selected the independent Load Run02 JTL, HTML, environment, resource CSV, and order state for Phase 6 because the original resource CSV was unusable. | Human changed the Phase 6 evidence identity. |

Human involvement therefore consisted of changing tool/scenario/evidence choices, adding reset and account-isolation controls, approving final trees, authorizing executions, and accepting or rejecting interpretations. The repository does not show a tester-authored change to the numerical Load, Stress, Spike, or Endurance workload proposals. Corrections made by the agent during dry-run validation or runner debugging are implementation fixes, not human refinements.

Human Review:
- Status: Pending tester review of the Phase 6 AI analysis and proposed thresholds
- Accepted: All Phase 2–5 measured result reports were approved by the tester on 2026-08-14
- Modified: Load evidence selection changed to the independent Run02 set; unsupported Load backend resource claims were removed
- Removed: Capacity-ceiling, memory-ceiling, universal-RPS, and production-generalization interpretations
- Added: Tester critique of task-specific skill reuse and a proposal-to-human-decision traceability table
- Notes: Proposed optimizations and tighter diagnostic thresholds remain recommendations until experimentally validated.
