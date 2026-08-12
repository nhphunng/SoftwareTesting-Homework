# Scenario C Spike Test Design

## 1. Design status

**Gate status: The tester confirmed the complete Spike workload and recovery contract on 2026-08-12. The final JMX has been generated and structurally/functionally validated; visual tree review remains required before measured execution.**

This document defines Phase 4 without claiming measured Spike behavior. The final `tests/23127194_Spike_20260812.jmx` now implements the human-confirmed values below. The short validation run is functional evidence only, not measured Spike evidence.

| Evidence | Observed result | Design implication |
| --- | --- | --- |
| Measured Load | 10 VUs, 292/292 flows successful, 0% HTTP errors, end-to-end p95 38.35 ms | Use 10 threads as the pre-spike and recovery reference load |
| Measured Stress | No breakpoint through 80 active threads; 6,336/6,336 flows successful; band 61-80 end-to-end p95 26 ms; 0% errors | Use 80 threads as a sudden, previously sustainable spike level; do not call it a capacity or failure threshold |
| Stress resource evidence | Backend CPU peak 22.7%; RSS peak 188.11 MiB | Resource headroom existed in the progressive run, but sudden-arrival behavior still requires real Spike evidence |
| Functional contract | Load and Stress both completed every correlated checkout/cancel flow with zero residual non-canceled orders | Clone the exact nine-request controller and graceful flow completion behavior into every stage |

## 2. Experiment objective

The Spike test will determine whether Scenario C remains correct and returns to its pre-spike response-time range after concurrency rises abruptly from the accepted Load level to the highest level already exercised by Stress.

The experiment does not attempt to locate a capacity ceiling because Stress did not find a breakpoint through 80 threads. If all acceptance signals pass, the result may only be described as resilience and recovery at the tested 80-thread spike.

## 3. Human-confirmed stage model

Every value in this section was accepted by the tester on 2026-08-12.

| Stage | Threads | Stage duration | Thread ramp | Purpose |
| --- | ---: | ---: | ---: | --- |
| `01 Baseline Stage` | **10 - Human-confirmed** | **30 seconds - Human-confirmed** | **1 second - Human-confirmed** | Establish the immediate pre-spike distribution at the accepted Load concurrency |
| `02 Spike Stage` | **80 - Human-confirmed** | **60 seconds - Human-confirmed** | **1 second - Human-confirmed** | Apply an abrupt rise to the maximum concurrency already shown sustainable by Stress |
| `03 Recovery Stage` | **10 - Human-confirmed** | **30 seconds - Human-confirmed** | **1 second - Human-confirmed** | Observe return to the pre-spike concurrency and response range |
| All stages | N/A | N/A | N/A | **250 ms think-time - Human-confirmed**, matching Stress for comparability |

The three standard Thread Groups will be serialized. Each stage will finish complete business flows before the next stage begins; the transition is therefore an approximately one-second start ramp after the preceding stage closes, with no intentional idle hold. This creates an abrupt concurrency change while preventing checkout from being interrupted mid-flow.

The maximum simultaneous concurrency is 80. Provision `USER_COUNT >= 80` after every backend reset. Because stages do not overlap, the same 80-row pool may be reused safely by independent per-stage CSV Data Set Config elements. Each stage reads its CSV once per thread with `recycle=false`, `stopThread=true`, and thread-group sharing, then keeps that dedicated account for the stage's internal loop.

## 4. Fixed functional and JMeter structure

Each stage will contain exactly this unchanged flow:

1. `POST /api/login`; extract non-empty `${token}`.
2. `GET /api/products?search=${search_keyword}`.
3. `GET /api/products/${product_id}`; verify ID and positive price.
4. `POST /api/cart`.
5. `GET /api/cart`; verify selected product membership.
6. `POST /api/checkout`; extract a positive fresh `${orderId}`.
7. `GET /api/orders/${orderId}`; verify the same order is `pending`.
8. `PUT /api/orders/${orderId}/cancel`.
9. `GET /api/orders/my-orders`; verify the same `${orderId}` is `canceled`.

Final JMeter implementation:

- One unmeasured setup gate validating all required `spike.*` properties and at least 80 CSV rows.
- `TestPlan.serialize_threadgroups=true` and exactly three measured standard Thread Groups named Baseline, Spike, and Recovery.
- Nine HTTP samplers and the same HTTP/business assertions in every stage.
- Stable stage-prefixed transaction and sampler labels so raw JTL rows can be separated without relying on wall-clock inference.
- A deadline-controlled While Controller per stage: no new flow starts after its stage deadline, while an active flow finishes normally.
- Response Time Graph as the Spike-specific listener; Load already uses Summary Report and Stress uses Aggregate Report.
- View Results Tree present only as disabled debug structure.
- Raw JTL and HTML dashboard remain authoritative; the listener does not replace either artifact.

Required runtime properties will have no numeric defaults:

```text
-Jspike.baseline_threads=10
-Jspike.baseline_duration_seconds=30
-Jspike.baseline_ramp_seconds=1
-Jspike.peak_threads=80
-Jspike.peak_duration_seconds=60
-Jspike.peak_ramp_seconds=1
-Jspike.recovery_threads=10
-Jspike.recovery_duration_seconds=30
-Jspike.recovery_ramp_seconds=1
-Jspike.think_time_ms=250
```

All displayed numeric values are human-confirmed. The final JMX fails before measured traffic if a required property is absent or if the CSV has fewer rows than the maximum simultaneous thread count.

## 5. Human-confirmed acceptance and recovery contract

Every criterion below was accepted by the tester on 2026-08-12.

| Signal | Proposed criterion | Evidence/rationale |
| --- | --- | --- |
| HTTP error rate | **<= 1.0% in each stage** | Reuses the accepted Load/Stress functional limit; both prior measured runs had 0% |
| Business-flow success | **>= 99.0% in each stage** | Requires the correlated order to reach `canceled`, not merely HTTP 200 |
| End-to-end p95 | **<= 250 ms in each stage** | Reuses the accepted absolute response-time limit; Load measured 38.35 ms and Stress measured 25 ms overall |
| Transaction p95 | **<= 100 ms for every transaction in each stage** | Reuses the accepted per-transaction limit |
| Recovery-relative p95 | **Recovery end-to-end p95 <= 1.5 x Baseline-stage p95** | Detects a post-spike regression even when both stages remain below the broad 250 ms absolute limit |
| Time to recovery | **Within 20 seconds after Recovery Stage begins** | Evaluate consecutive 10-second recovery windows; recovery begins at the first window meeting the relative p95, HTTP-error, and business-success criteria whose later windows also remain compliant |
| Business residue | **0 non-canceled orders after all stages finish** | Prevents a stage transition or deadline from hiding incomplete checkout/cancel flows |
| Resource recovery | **Evidence required; descriptive, not an automatic pass/fail gate - Human-confirmed** | Report backend CPU/RSS peak and compare the final recovery window with the pre-spike window. Do not claim recovery if the monitor lacks valid timestamped samples |

The recovery comparison uses actual Baseline-stage metrics from the same Spike run, not the earlier Load result. If no recovery window meets the contract, report delayed/non-recovery at the tested level. If the Spike stage never breaches any criterion, report resilience at 80 threads without inventing a failure or capacity limit.

## 6. Evidence and execution boundary

Before generating the final JMX:

- [x] Read the measured Load and Stress evidence.
- [x] Preserve the exact Scenario C contract.
- [x] Propose baseline, spike, recovery, transition, durations, think-time, thresholds, and listener allocation.
- [x] Tester explicitly confirms all proposals in Sections 3 and 5.
- [x] Generate `tests/23127194_Spike_20260812.jmx` without overwriting an existing plan.
- [x] Run the Spike structural validator, Load-parity comparison, XML, and whitespace checks.
- [x] Perform a short functional dry run after a clean reset and provisioning; see `reports/spike-plan-validation.md`.
- [ ] Tester visually reviews the final JMeter tree.

Measured Spike execution requires a separate explicit request after final-tree review. It must preserve untouched raw JTL, a clean HTML report, valid resource samples, environment identity, stage metrics, and residual-order verification.

Human Review:
- Status: Complete proposal accepted by tester on 2026-08-12; generated JMeter tree pending visual review
- Accepted: Baseline/Spike/Recovery threads, durations, ramps, transition model, think-time, thresholds, recovery rule, CSV allocation, and Response Time Graph listener.
- Modified:
- Removed:
- Added:
- Notes: User prompt: `Xác nhận toàn bộ Spike proposal`
