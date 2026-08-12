# HW05 - Performance Testing

## Project status

| Item | Current value |
| --- | --- |
| Selected workflow | Scenario C - Checkout then cancel |
| Tool | k6 skeleton; tester confirmation required before execution |
| Endpoint groups | Auth-heavy, read-heavy, transactional |
| Load / Stress / Spike runs | Not executed |
| Endurance threshold | TBD - requires a real 10-15 minute run |
| Bugs / performance issues | TBD - no execution evidence yet |
| Demo video | TBD |

Scenario C is distinct from Candidate A, which the tester reports is already used by another group member.

## Scenario C flow

1. Login with a valid user (`POST /api/login`).
2. Search products (`GET /api/products?search=...`).
3. Read a selected product (`GET /api/products/{id}`).
4. Add it to the backend cart and verify the cart (`POST` and `GET /api/cart`).
5. Create a fresh order (`POST /api/checkout`).
6. Correlate and read the returned order (`GET /api/orders/{orderId}`).
7. Cancel the same fresh order (`PUT /api/orders/{orderId}/cancel`).
8. Verify its final state in user history (`GET /api/orders/my-orders`).

The same functional sequence is imported by the Load, Stress, and Spike templates. Only their workload models differ.

## Safe setup

1. Install k6 separately and verify `k6 version`.
2. Copy `data/scenario-c.example.csv` to `data/scenario-c.local.csv`.
3. Replace every placeholder with valid, dedicated test data. Never commit real passwords.
4. Smoke-test every account and product against the running backend.
5. Decide workload parameters from a measured baseline and document the human review.
6. Manually copy and rename the three templates using the required pattern:

   ```text
   {StudentID}_{ScenarioType}_{YYYYMMDD}.js
   ```

7. Pass `WORKLOAD_CONFIRMED=true`, `DATA_FILE`, `REQUIRED_USER_ROWS`, and `THINK_TIME_SECONDS` to k6 with `-e NAME=value` only after review. `REQUIRED_USER_ROWS` must be at least the maximum configured VUs.
8. Follow [runbook.md](runbook.md) to execute and collect evidence.

The templates refuse a real run when workload confirmation or non-example CSV data is missing.

## Structure

```text
HW05/
├── data/                         CSV schema and local runtime data
├── evidence/                     Screenshot, hardware, and video guidance
├── lib/                          Shared Scenario C and CSV helpers
├── reports/                      Mandatory report templates and AI audit
├── results/                      Raw output and HTML/summary guidance
├── tests/templates/              Load, Stress, Spike, and Endurance templates
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
