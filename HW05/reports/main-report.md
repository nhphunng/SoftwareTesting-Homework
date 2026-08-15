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
| Hardware identity | MacBook Pro `MacBookPro18,1`; computer name `Phi Hero`; local hostname `Phi-Hero.local` |
| CPU | Apple M1 Pro; 10 cores (8 performance, 2 efficiency) |
| RAM | 16 GiB installed |
| Backend/runtime versions | Node.js EShop backend; Java 24; JMeter 5.6.3 |
| Database state/reset | Reset per phase; final Endurance state: 18,400 orders, all canceled |
| Resource-monitor evidence | Load Run02 CSV is malformed and contains no attributable backend CPU/RSS; Stress, Spike, and Endurance contain valid timestamped CPU/RSS samples |
| Live tool/resource screenshots | [Load Run02](../evidence/screenshots/load/06-running-load-and-resource-monitor.png), [Stress Run02](../evidence/screenshots/stress/06-running-stress-and-resource-monitor.png), and [Spike Run02](../evidence/screenshots/spike/06-running-spike-and-resource-monitor.png) show the test execution and backend `node` resource monitor in the same frame. The Load frame captured backend CPU at 0%, so it proves process visibility but is weaker than a mid-load utilization frame. |
| Hardware screenshot | [`01-hardware-report-with-hostname.png`](../evidence/hardware/01-hardware-report-with-hostname.png) visibly corroborates hostname `Phi-Hero.local`, computer name `Phi Hero`, model `MacBookPro18,1`, Apple M1 Pro, 10 cores, 16 GB RAM, and macOS 26.3. The screenshot satisfies the hardware/hostname evidence requirement, but serial and UUID fields should be redacted before public upload. |

## 4. Data-driven workflow

The protected local CSV supplies `email`, `password`, `search_keyword`, `product_id`, `quantity`, and `shipping_address`. Each maximum concurrent thread receives a separate verified account. The plan validates the selected product, extracts the login JWT and newly created `orderId`, asserts the fresh order is `pending`, cancels that exact order, and verifies it becomes `canceled` in the user's history. Restarting the backend between measured runs clears in-memory carts and resets the isolated database before a fresh account pool is provisioned.

### Login lockout prevention and reset handling

The backend tracks failed login attempts and can lock an account after three invalid attempts. The measured Load, Stress, and Spike workloads therefore use verified valid credentials, assign one unique account per maximum concurrent thread, and do not intentionally include invalid-login traffic.

Before each measured run, the backend is restarted, which resets the database and any previous account-lock state. The provisioning script then recreates the required account pool and verifies that every account can log in. Verification uses at most five bounded attempts; if an account remains unusable, provisioning stops without replacing the existing local CSV.

If a measured run produces an unexpected authentication response, a failed login assertion, or no JWT token, the run must be stopped. Its partial JTL is preserved for diagnosis but excluded from the approved measured result. The tester must restart the backend, reprovision and reverify the accounts, and rerun the test under a new run identity; artifacts from the failed and replacement runs must not be mixed. No account lockout was observed in the approved measured runs, so this is a preventive and recovery procedure rather than an observed performance-test incident. Operational details are in [`runbook.md`](../runbook.md) and [`user-provisioning.md`](user-provisioning.md).

Phase 1 smoke validation passed for every Scenario C endpoint using the supplied demo user. Product `1` (`iPhone 15 Pro Max`) was added to cart, order `1` was created as `pending`, canceled, and verified as `canceled` in user history. Admin login and the admin order-list endpoint also returned HTTP 200. The backend was then stopped, clearing the in-memory cart; canceled order `1` remains in SQLite. This was not a measured performance run.

Backend source inspection confirmed that each start drops and reseeds all database tables. A parameterized provisioning script now creates one deterministic user per maximum JMeter thread after every start, verifies login, and writes a protected local CSV. Functional verification created and recreated five users across two resets; five is not a performance workload recommendation.

### Distinct listener/report evidence

The three required plans use three different enabled JMeter listener/report types. The screenshots below were captured by the tester after loading the corresponding Run02 JTL solely to populate each view. They prove the listener allocation; they do not change the numerical evidence identities listed in Sections 5-8. The untouched raw JTL and generated HTML dashboards remain the authoritative result sources.

| Test | Enabled listener/report type | Tester-captured evidence |
| --- | --- | --- |
| Load | Summary Report - `Summary Report - Human Approved Load Listener` | [`01-load-summary-report-tree.png`](../evidence/screenshots/load/01-load-summary-report-tree.png) |
| Stress | Aggregate Report - `Aggregate Report - Stress Listener` | [`01-stress-aggregate-report-tree.png`](../evidence/screenshots/stress/01-stress-aggregate-report-tree.png) |
| Spike | Response Time Graph - `Response Time Graph - Spike Listener` | [`01-spike-response-time-graph-tree.png`](../evidence/screenshots/spike/01-spike-response-time-graph-tree.png) |

## 5. Load test

- Final test-plan filename: `tests/23127194_Load_20260812.jmx`
- Reviewed workload: 10 VUs, 20-second ramp-up, 120-second full-load hold within a 140-second flow-start deadline, and 500 ms think-time.
- Distinct report view: Summary Report; raw JTL and HTML dashboard are authoritative.
- Phase 6 evidence identity: independent Run02 set; no unsuffixed/Run02 artifacts are mixed.
- Raw output: `results/raw/load/23127194_Load_20260812_Run02.jtl`.
- Result: 291/291 business flows passed; 2,619/2,619 HTTP samples passed; end-to-end p95 48 ms; 0% errors.
- Threshold verdict: Passed for HTTP errors, business success, end-to-end p95, and all transaction p95 limits.
- Limitation: the Run02 resource CSV has 140 malformed four-field rows under a five-column header and no attributable backend CPU/RSS, so it supports no backend resource-utilization claim.
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

- Final test-plan filename: `tests/23127194_Spike_20260812.jmx`.
- Human-confirmed workload: 10 threads for 30 seconds, sudden 80 threads for 60 seconds, then 10 threads for 30 seconds; one-second ramps and 250 ms think-time.
- Distinct report view: Response Time Graph.
- Raw output: `results/raw/spike/23127194_Spike_20260812.jtl`.
- Resource evidence: `evidence/spike/23127194_Spike_20260812-resources.csv` with 125 backend samples.
- Result: 2,363/2,363 flows and 21,267/21,267 HTTP requests passed; Baseline/Spike/Recovery end-to-end p95 values were 36.45/27.00/26.00 ms.
- Recovery: the first 10-second Recovery window passed and all later full windows remained compliant; CPU returned toward baseline, but RSS did not return to its pre-spike range.
- Detailed evidence: `reports/spike-test-results.md`.

## 8. Endurance threshold

- Final plan: `tests/23127194_Endurance_20260812.jmx`.
- Measured workload: 60 threads, 30-second ramp, 720-second flow-start duration, and 250 ms think-time.
- Raw output: `results/raw/endurance/23127194_Endurance_20260812.jtl`.
- Resource evidence: `evidence/endurance/23127194_Endurance_20260812-resources.csv` with 698 timestamped rows.
- Result: 18,400/18,400 flows, 165,600/165,600 HTTP requests, 0 failed JTL rows, end-to-end p95 30 ms, and highest transaction p95 14 ms.
- All eleven complete one-minute steady-state windows passed; maximum observed stable complete-flow rate was 26.23 flows/s.
- Backend CPU averaged 12.01% and peaked at 23.2%; RSS averaged 99.73 MiB and peaked at 188.84 MiB.
- Final-five-minute RSS slope was +5.99 MiB/minute, so no stable memory plateau or capacity ceiling is claimed.
- Detailed evidence: `reports/endurance-test-results.md`.

## 9. AI analysis and misinterpretation hunt

The preserved AI analysis in `reports/ai-analysis.md` uses Load Run02 and the unsuffixed Stress, Spike, and Endurance evidence sets. Human verification rejected six overclaims: treating a populated but malformed resource CSV as valid backend evidence; calling 80 VUs a capacity ceiling; calling 26.23 complete flows/s HTTP RPS; calling 188.84 MiB a memory ceiling; treating latency recovery as memory recovery; and generalizing a local demo run to production. Each correction is tied to the raw JTL, resource file, or runner implementation.

## 10. Optimization feasibility

Feasible experiments are indexes on `users(email)` and `orders(user_id, id DESC)`, SQLite WAL/`busy_timeout` A/B testing, and low-priority product-read caching. A conventional server-database connection pool, unchanged horizontal Node scaling, and generic Node thread-pool tuning are classified as inapplicable, unsafe, or unsupported for the current SQLite plus process-local-cart architecture. None is reported as a measured improvement before an A/B run.

## 11. Continuous Performance Testing proposal

Summarize `reports/continuous-performance-proposal.md`, including the flow chart, p95 regression rule, cost, and false-alarm trade-offs.

## 12. Issues

Reference `reports/bug-report.md` and public GitHub Issues only when real reproducible evidence exists.

## 13. AI critique

The critique in `reports/ai-critique.md` records the tester's actual interventions: selecting Scenario C, replacing the early k6 direction with JMeter, requiring reset-safe user provisioning, and selecting Load Run02 as the Phase 6 evidence identity. It also distinguishes these changes from the numerical Load, Stress, Spike, and Endurance proposals, which the tester accepted without parameter modification, and explains why units, run identity, raw logs, runner code, and same-run evidence require human verification. Final wording remains pending tester approval.

## 14. Conclusion

Summarize scenarios run, endpoint coverage, measured endurance threshold, issue count, limitations, and demo video.

Human Review:
- Status: Phase 2–5 measured results approved; Phase 6 analysis and critique pending final tester review
- Accepted: Load Run02 selection and all measured Load, Stress, Spike, and Endurance result reports
- Modified:
- Removed:
- Added:
- Notes:
