# FR-10 Step K — Real Newman Execution

## Scope

- API: `PUT /api/orders/:id/cancel`
- Feature: FR-10 Order State Machine
- Runner: `./scripts/run-step-k.sh FR10`
- Base URL: `http://localhost:3000`
- Student header: `X-Student-Id: 23127194`

## Execution sequence

1. `./scripts/run-step-k.sh FR10 --dry-run` resolved the FR10 collection, private environment, runtime-data file, Newman binary, and output paths successfully.
2. The first real run exposed stale runtime fixtures after the local SUT data had been reset: most follow-up GET requests returned `404 Order not found`. This was classified as a runtime-data/setup problem rather than an SUT defect.
3. The approved runtime preparation script was rerun to recreate isolated FR10 users/orders and refresh the private environment.
4. The next real run reduced failures to four testcase IDs. Gate G analysis identified `AI-FR10-004` as a Postman implementation defect because it reused `pendingOrderId` after `AI-FR10-001` had already canceled that fixture.
5. A dedicated pending fixture `canonicalRequestOrderId` was added for `AI-FR10-004`; the runtime dataset was recreated again, producing 40 isolated order fixtures.
6. `./scripts/run-step-k.sh FR10` was rerun. `AI-FR10-004` passed. The final current run contains only three failed testcase IDs, all exercising the same FR-10 shipping-cancel rule.

## Final current Newman result

| Metric | Result |
| --- | ---: |
| Testcase IDs | 48 |
| Requests observed by Newman | 96 |
| Assertions | 275 |
| Assertions passed | 269 |
| Assertions failed | 6 |
| Failed testcase IDs | 3 |
| X-Student-Id exact match | 96/96 |
| Newman exit code | 1 |

Failed testcase IDs:

- `AI-FR10-003`
- `AI-FR10-021`
- `AI-FR10-040`

All three failures show the same observed behavior: a User cancellation request against an order in `shipping` returns a success-class response, and the follow-up GET observes state `canceled` instead of remaining `shipping`.

## Contract basis

FR-10 states that once an order is `shipping`, a User must not be able to cancel it; only Admin may act. Invalid transitions must return an appropriate error.

The API contract defines the selected endpoint as `PUT /api/orders/:id/cancel`.

## Gate G classification

| Finding | Classification | Reason |
| --- | --- | --- |
| Initial 404-heavy run | Runtime-data/setup problem | Dedicated order IDs were stale after SUT reset. Recreating fixtures removed these failures. |
| `AI-FR10-004` failure | Test implementation defect | It reused the same pending fixture already consumed by `AI-FR10-001`. Dedicated fixture fixed the failure. |
| `AI-FR10-003`, `021`, `040` | Potential genuine SUT defect | Reproducible real execution violates the FR-10 shipping cancellation rule and matches the current server implementation. Human Gate H is still required before filing the defect as confirmed. |

## Static implementation correlation

The current server implementation only blocks cancellation when state is `delivered` or `canceled`; it does not reject `shipping`. This correlates with the runtime evidence but is not used as a substitute for the real Newman execution.

## Evidence files

Raw evidence source of truth:

- `postman/newman/FR10-official-cli.txt`
- `postman/newman/FR10-official-report.json`
- `postman/newman/FR10-official-report.html`
- `postman/newman/FR10-official-report.xml`

Compact AI-consumption evidence:

- `postman/newman/FR10-execution-summary.json`
- `postman/newman/FR10-execution-summary.md`

Runtime fixture evidence:

- `PoolB-FR-10-CancelOrder/postman/runtime-fixture-manifest.json`
- `postman/data/FR10-runtime-data.json`

## Human gate status

- Step K real execution: COMPLETE
- Gate G execution classification: PREPARED
- Potential defect requiring Human Gate H: User can cancel a `shipping` order
- Genuine bug report / GitHub Issue: NOT YET CREATED
