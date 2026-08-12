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
| OS and hostname | TBD |
| CPU | TBD |
| RAM | TBD |
| Backend/runtime versions | TBD |
| Database state/reset | TBD |
| Resource-monitor evidence | TBD |

## 4. Data-driven workflow

Describe CSV fields, account isolation, product validation, correlation of `orderId`, cart/order cleanup, assertions, and login-lockout handling.

Phase 1 smoke validation passed for every Scenario C endpoint using the supplied demo user. Product `1` (`iPhone 15 Pro Max`) was added to cart, order `1` was created as `pending`, canceled, and verified as `canceled` in user history. Admin login and the admin order-list endpoint also returned HTTP 200. The backend was then stopped, clearing the in-memory cart; canceled order `1` remains in SQLite. This was not a measured performance run.

Backend source inspection confirmed that each start drops and reseeds all database tables. A parameterized provisioning script now creates one deterministic user per maximum JMeter thread after every start, verifies login, and writes a protected local CSV. Functional verification created and recreated five users across two resets; five is not a performance workload recommendation.

## 5. Load test

- Final test-plan filename: TBD
- Reviewed workload parameters and rationale: TBD
- Distinct report view: TBD
- Raw output: TBD
- Resource evidence: TBD
- Results and human review: TBD

## 6. Stress test

- Final test-plan filename: TBD
- Progressive stages and breakpoint rationale: TBD
- Distinct report view: TBD
- Raw output: TBD
- Resource evidence: TBD
- Breakpoint and recovery observations: TBD

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
