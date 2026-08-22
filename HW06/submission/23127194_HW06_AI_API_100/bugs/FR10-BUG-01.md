# FR10-BUG-01 — User can cancel an order in `shipping` state

GitHub Issue: https://github.com/nhphunng/SoftwareTesting-Homework/issues/27

## Summary

An authenticated User can cancel their own order after it has reached `shipping` by calling `PUT /api/orders/:id/cancel`. The endpoint returns a success-class response and persists the order as `canceled`, violating the FR-10 state machine.

## Severity

**High**

Reason: this allows a User to invalidate an order after fulfillment has begun, creating order-integrity, shipment, and financial-reconciliation risk. The defect does not require Admin privileges or a malformed request.

## API

`PUT /api/orders/:id/cancel`

## Requirement basis — FR-10

FR-10 defines that a User may cancel an order only while it is `pending` or `confirmed`. Once the order reaches `shipping`, a User must not be able to cancel it; invalid transitions must return an appropriate error.

The exact error status code and response schema are not specified. The contract-backed oracles are semantic rejection and preservation of the `shipping` state.

## Related testcases

- `AI-FR10-003` — semantic boundary: confirmed cancellation allowed vs shipping cancellation rejected
- `AI-FR10-021` — shipping order cannot be user-canceled
- `AI-FR10-040` — invalid shipping transition response characterization

All three cases have `Source = AI` and were approved in the FR-10 human audit before implementation.

## Preconditions

- SUT running at `http://localhost:3000`.
- A valid JWT for a regular User.
- An order owned by that User in the `shipping` state.
- Every request includes `X-Student-Id: 23127194`.

## Reproduction

1. Confirm that the User-owned order is in `shipping`:

   ```http
   GET /api/orders/{shippingOrderId}
   Authorization: Bearer <user-token>
   X-Student-Id: 23127194
   ```

2. Attempt to cancel it as the same User:

   ```http
   PUT /api/orders/{shippingOrderId}/cancel
   Authorization: Bearer <user-token>
   X-Student-Id: 23127194
   ```

3. Fetch the order again with the same User credentials.

## Expected behavior

- The cancellation is rejected with an error and an appropriate message. No exact error status/body is asserted because the contract does not specify one.
- The order remains in `shipping`.

## Actual behavior

- The cancel request returns HTTP `200`.
- The follow-up `GET /api/orders/{id}` returns HTTP `200` and reports `"status":"canceled"`.

The final controlled Newman run observed this on three independently isolated fixtures:

| Testcase | Shipping order ID | Observed post-state |
| --- | ---: | --- |
| `AI-FR10-003` | 47 | `canceled` |
| `AI-FR10-021` | 43 | `canceled` |
| `AI-FR10-040` | 71 | `canceled` |

## Reproducibility

**3/3 independently isolated testcase scenarios in the final controlled Newman run.** Each produced the same HTTP `200` cancellation behavior and persisted `shipping → canceled` transition.

Before confirmation, the earlier stale-fixture setup failure and the separate `AI-FR10-004` shared-fixture test defect were corrected. The suite was rerun with recreated isolated fixtures; neither competing explanation accounts for these three remaining failures.

## Real evidence

- Screenshot evidence view: `PoolB-FR-10-CancelOrder/evidence/screenshots/FR10-BUG-01.png`
- Screenshot source view: `PoolB-FR-10-CancelOrder/evidence/screenshots/FR10-BUG-01-evidence.html`
- `PoolB-FR-10-CancelOrder/evidence/step-k-execution.md`
- `postman/newman/FR10-execution-summary.md`
- `postman/newman/FR10-execution-summary.json`
- `postman/newman/FR10-official-cli.txt`
- `postman/newman/FR10-official-report.html`
- `postman/newman/FR10-official-report.json`
- `postman/newman/FR10-official-report.xml`

Final execution totals recorded in those artifacts:

- 48 testcase IDs
- 96 requests
- 275 assertions: 269 passed, 6 failed
- 3 failed testcase IDs: `AI-FR10-003`, `AI-FR10-021`, `AI-FR10-040`
- exact `X-Student-Id: 23127194` coverage: 96/96 requests

The PNG above is a post-run evidence view rendered directly from the real `FR10-official-report.json` data for `AI-FR10-021`. It is not a fabricated Postman UI screenshot; the Authorization value is intentionally redacted while the recorded `X-Student-Id: 23127194`, HTTP status, response/post-state, and assertion results are preserved.

## Confirmation

**CONFIRMED DEFECT — Human Gate H approved**

The approved decision is that a User must not be able to cancel an order in `shipping`. Test expectations were preserved unchanged.
