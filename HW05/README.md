# HW05 - Performance Testing

## Project status

| Item | Current value |
| --- | --- |
| Student ID | 23127194 |
| Selected workflow | Scenario C - Checkout then cancel |
| Tool | Apache JMeter 5.6.3 - installed and CLI verified |
| Official execution date | 2026-08-12 |
| Endpoint groups | Auth-heavy, read-heavy, transactional |
| API smoke test | Passed on 2026-08-12; order `1` changed `pending` to `canceled` |
| Load / Stress / Spike runs | All three measured runs passed their reviewed HTTP, business, and latency criteria |
| Endurance | Measured 60-thread/12-minute run passed all reviewed criteria in 11 complete steady-state minutes |
| Endurance threshold | Maximum observed stable rate 26.23 complete flows/s; maximum observed backend RSS 188.84 MiB; no memory plateau/capacity ceiling claimed |
| Bugs / performance issues | No reviewed functional/latency threshold failure; Stress breakpoint not observed through 80 threads; Spike memory recovery and Endurance memory plateau were not demonstrated |
| Demo video | TBD |

Scenario C is distinct from Candidate A, which the tester reports is already used by another group member.

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
| 1 | Task 1 - Load testing | 20 | TBD |
| 2 | Task 1 - Stress testing | 20 | TBD |
| 3 | Task 1 - Spike testing | 20 | TBD |
| 4 | Task 2 - AI analysis and misinterpretation hunt | 10 | TBD |
| 5 | Task 3 - Continuous Performance Testing proposal | 10 | TBD |
| 6 | Agent Skills | 10 | TBD |
|  | **Total printed in assignment** | **100** | **TBD** |

The six published row values sum to 90 while the assignment prints a total of 100. Confirm the missing 10-point allocation with the lecturer instead of silently inventing a criterion.

## Integrity rules

- Do not claim any metric until it is traceable to a real raw output file.
- Do not commit credentials or machine-private data.
- Do not create or edit raw evidence manually.
- Keep setup/cleanup traffic distinguishable from measured Scenario C traffic.
- Update the AI Audit Report after every material AI-assisted change or analysis.
