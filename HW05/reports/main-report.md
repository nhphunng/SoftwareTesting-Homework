# HW05 Performance Testing Report

## 1. Identification

| Field | Value |
| --- | --- |
| Student ID | 23127194 |
| SUT | EShop backend API |
| Tool | Apache JMeter 5.6.3 - installed and CLI verified |
| Official execution date | 2026-08-12 |
| Selected workflow | Scenario C - Checkout then cancel |
| Repository | TBD |
| Demo video | TBD |

## 2. Scenario and endpoint coverage

Document why Scenario C is unique in the group and how it covers auth-heavy, read-heavy, and transactional endpoints. Reference `scenario.md` and the final test plans.

## 3. Environment and hardware

| Item | Measured value / evidence path |
| --- | --- |
| OS | macOS 26.3 (Build 25D125), arm64 |
| CPU | 10 logical CPUs; model and utilization not captured |
| RAM | 16 GiB installed; utilization not captured |
| Backend/runtime versions | Node.js EShop backend; Java 24; JMeter 5.6.3 |
| Database state/reset | Reset before run; 292 orders after run, all canceled |
| Resource-monitor evidence | Unavailable for this run: generated CSV contains only its header and is explicitly excluded |

## 4. Data-driven workflow

Describe CSV fields, account isolation, product validation, correlation of `orderId`, cart/order cleanup, assertions, and login-lockout handling.

Phase 1 smoke validation passed for every Scenario C endpoint using the supplied demo user. Product `1` (`iPhone 15 Pro Max`) was added to cart, order `1` was created as `pending`, canceled, and verified as `canceled` in user history. Admin login and the admin order-list endpoint also returned HTTP 200. The backend was then stopped, clearing the in-memory cart; canceled order `1` remains in SQLite. This was not a measured performance run.

Backend source inspection confirmed that each start drops and reseeds all database tables. A parameterized provisioning script now creates one deterministic user per maximum JMeter thread after every start, verifies login, and writes a protected local CSV. Functional verification created and recreated five users across two resets; five is not a performance workload recommendation.

## 5. Load test

- Final test-plan filename: `tests/23127194_Load_20260812.jmx`
- Reviewed workload: 10 VUs, 20-second ramp-up, 120-second full-load hold within a 140-second flow-start deadline, and 500 ms think-time.
- Distinct report view: Summary Report; raw JTL and HTML dashboard are authoritative.
- Raw output: `results/raw/load/23127194_Load_20260812.jtl`.
- Result: 292/292 business flows passed; 2,628/2,628 HTTP samples passed; end-to-end p95 38.35 ms; 0% errors.
- Threshold verdict: Passed for HTTP errors, business success, end-to-end p95, and all transaction p95 limits.
- Limitation: CPU/RSS monitor produced no samples, so this run supports no resource-utilization claim.
- Detailed evidence and human review: `reports/load-test-results.md`.

## 6. Stress test

- Final test-plan filename: `tests/23127194_Stress_20260812.jmx`.
- Progressive workload: linear ramp to 80 threads over 240 seconds, then approximately 60 seconds at the maximum-started level; 250 ms think-time.
- Distinct report view: Aggregate Report.
- Raw output: `results/raw/stress/23127194_Stress_20260812.jtl`.
- Resource evidence: `evidence/stress/23127194_Stress_20260812-resources.csv` with 294 timestamped samples.
- Result: 6,336/6,336 flows and 57,024/57,024 HTTP requests passed; whole-run end-to-end p95 was 25 ms.
- Breakpoint: no threshold breach was observed up to the maximum tested 80 active threads; 80 is not claimed as the capacity ceiling.
- Detailed band analysis: `reports/stress-test-results.md`.

## 7. Spike test

- Final test-plan filename: TBD
- Baseline/spike/recovery rationale: TBD
- Distinct report view: TBD
- Raw output: TBD
- Resource evidence: TBD
- Recovery observations: TBD

## 8. Endurance threshold

Record the real 10-15 minute run, sustained load, stable RPS, p95, error rate, CPU, memory ceiling, instability signal, and exact evidence paths. Do not fill this section from estimates.

## 9. AI analysis and misinterpretation hunt

Summarize `reports/ai-analysis.md`. For every AI error, cite the exact correct value and raw source location.

## 10. Optimization feasibility

Classify AI proposals as feasible or hallucinated and connect feasible items to actual EShop architecture/evidence.

## 11. Continuous Performance Testing proposal

Summarize `reports/continuous-performance-proposal.md`, including the flow chart, p95 regression rule, cost, and false-alarm trade-offs.

## 12. Issues

Reference `reports/bug-report.md` and public GitHub Issues only when real reproducible evidence exists.

## 13. AI critique

Insert or reference the final 200-300 word critique from `reports/ai-critique.md`.

## 14. Conclusion

Summarize scenarios run, endpoint coverage, measured endurance threshold, issue count, limitations, and demo video.

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:
