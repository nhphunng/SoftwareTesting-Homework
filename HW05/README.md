# HW05 - Performance Testing

## Test summary report

| Item | Current value |
| --- | --- |
| Student ID | 23127194 |
| Selected workflow | Scenario C - Checkout then cancel |
| Tool | Apache JMeter 5.6.3 - installed and CLI verified |
| Public repository | <https://github.com/nhphunng/SoftwareTesting-Homework> |
| Official execution date | 2026-08-12 |
| Endpoint groups | Auth-heavy, read-heavy, transactional |
| API smoke test | Passed on 2026-08-12; order `1` changed `pending` to `canceled` |
| Load / Stress / Spike runs | All three measured runs passed their reviewed HTTP, business, and latency criteria |
| Endurance | Measured 60-thread/12-minute run passed all reviewed criteria in 11 complete steady-state minutes |
| Endurance threshold | Maximum observed stable rate 26.23 complete flows/s; maximum observed backend RSS 188.84 MiB; no memory plateau/capacity ceiling claimed |
| Bugs / performance issues | **0 genuine bugs or performance issues filed.** Stress breakpoint not observed through 80 threads, Spike memory recovery was not demonstrated, and Endurance retained a positive RSS slope; these are reported as limitations/risks, not fabricated defects. |
| Demo videos | [Agent Skill](https://youtu.be/6HXgiGy_3UI); [Load](https://youtu.be/4-lbUzKKrik); [Stress](https://youtu.be/q1ofKyPXU-Q); [Spike](https://youtu.be/rwhBLCXov1k); [Endurance](https://youtu.be/rA0cl0rgR88) |

Scenario C is distinct from Candidate A, which the tester reports is already used by another group member.

### Scenarios executed

| Scenario | Workload and measured outcome | Endpoint groups covered |
| --- | --- | --- |
| Load | 10 VUs; 20-second ramp; 120-second full-load hold; 291/291 flows passed; end-to-end p95 48 ms | Auth-heavy, read-heavy, transactional |
| Stress | Progressive ramp to 80 threads; 6,336/6,336 flows passed; end-to-end p95 25 ms; no breakpoint observed | Auth-heavy, read-heavy, transactional |
| Spike | 10-thread Baseline, 80-thread Spike, 10-thread Recovery; 2,363/2,363 flows passed; phase p95 values 36.45/27.00/26.00 ms | Auth-heavy, read-heavy, transactional |
| Endurance | 60 threads for a 720-second flow-start duration; 18,400/18,400 flows passed; 26.23 maximum observed stable complete flows/s | Auth-heavy, read-heavy, transactional |

Every scenario reused Scenario C: valid login, product search/detail, cart operations, checkout with fresh `orderId` correlation, order lookup, cancellation, and canceled-history verification. The detailed performance report and AI-analysis critique are in [`reports/main-report.md`](reports/main-report.md).

## Project skills

- `.agents/skills/design-jmeter-load-test`: gate the Phase 2 workload design, generate the reviewed Load `.jmx`, and validate its Scenario C structure.
- `.agents/skills/run-jmeter-stress-test`: design, generate, execute, and analyze the Phase 3 progressive Stress breakpoint test.
- `.agents/skills/design-jmeter-spike-test`: design the baseline-spike-recovery contract and generate/validate the Phase 4 Spike JMX after human confirmation.
- `.agents/skills/design-jmeter-endurance-test`: design the 10-15 minute sustained-load contract and generate/validate the Phase 5 Endurance JMX after human confirmation.
- `.agents/skills/ai-audit-report`: record every material AI-assisted HW05 change with evidence boundaries and pending human review.

## Scenario C flow

1. Login with a valid user (`POST /api/login`).
2. Search products (`GET /api/products?search=...`).
3. Read a selected product (`GET /api/products/{id}`).
4. Add it to the backend cart and verify the cart (`POST` and `GET /api/cart`).
5. Create a fresh order (`POST /api/checkout`).
6. Correlate and read the returned order (`GET /api/orders/{orderId}`).
7. Cancel the same fresh order (`PUT /api/orders/{orderId}/cancel`).
8. Verify its final state in user history (`GET /api/orders/my-orders`).

The same functional sequence must be reused by the final Load, Stress, and Spike JMeter plans. Only their workload models and report listeners may differ.

## Safe setup

1. Verify `jmeter --version` returns Apache JMeter 5.6.3.
2. Start/reset the backend and provision a local user pool:

   ```bash
   USER_COUNT=<maximum-reviewed-threads> \
   JMETER_USER_PASSWORD=<local-secret> \
   scripts/start-backend-and-provision.sh
   ```

3. Use `data/scenario-c.local.csv` in JMeter CSV Data Set Config. It is mode `600` and Git-ignored.
4. Require `USER_COUNT` to be at least the maximum planned thread count; one shared user would create cart interference.
5. The Load workload contract has been baseline-derived, human-reviewed, generated, and executed; see `reports/load-test-results.md`.
6. Create the remaining Stress and Spike plans using the required pattern:

   ```text
   23127194_Stress_20260812.jmx
   23127194_Spike_20260812.jmx
   ```

7. Configure CSV Data Set Config, JSON extractors, assertions, timers, and report listeners before measured execution.
8. Follow the JMeter preparation and execution rules in [runbook.md](runbook.md).

The existing k6 files are retained only as an earlier scaffold/reference. They are superseded by the confirmed JMeter decision and must not be submitted as the final test plans.

## Structure

```text
HW05/
├── .agents/skills/                Project-local design and audit workflows
├── data/                         CSV schema and local runtime data
├── evidence/                     Screenshot, hardware, and video guidance
├── lib/                          Superseded k6 Scenario C reference helpers
├── reports/                      Mandatory report templates and AI audit
├── results/                      Raw output and HTML/summary guidance
├── scripts/                      Backend reset/start and user provisioning
├── tests/templates/              Superseded k6 templates; JMeter plans pending Phase 2
├── plan.md                       Implementation and evidence sequence
├── runbook.md                    Safe validation/run procedure
├── scenario.md                   Scenario decision and endpoint rationale
└── submission-checklist.md       Final package checklist
```

## Self-assessment

| No. | Criterion | Grade | Self-assessed grade |
| ---: | --- | ---: | ---: |
| 1 | Task 1 - Load testing | 20 | 20 |
| 2 | Task 1 - Stress testing | 20 | 20 |
| 3 | Task 1 - Spike testing | 20 | 20 |
| 4 | Task 2 - AI analysis and misinterpretation hunt | 10 | 10 |
| 5 | Task 3 - Continuous Performance Testing proposal | 10 | 10 |
| 6 | Agent Skills | 10 | 10 |
|  | **Total printed in assignment** | **100** | **100** |

The six published row values sum to 90 while the assignment prints a total of 100. The table preserves the assignment's printed total and the tester's stated self-assessed grade; the unexplained 10-point difference is not assigned to an invented criterion.

## Integrity rules

- Do not claim any metric until it is traceable to a real raw output file.
- Do not commit credentials or machine-private data.
- Do not create or edit raw evidence manually.
- Keep setup/cleanup traffic distinguishable from measured Scenario C traffic.
- Update the AI Audit Report after every material AI-assisted change or analysis.
