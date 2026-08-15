# Scenario C Load Test Design

## 1. Design status

**Gate status: Human-confirmed contract generated and validated as the final JMX; measured Load execution remains pending.**

This document defines the Load plan structure without inventing workload values, thresholds, or execution evidence. It is not a measured result and does not authorize a Phase 2 Load run.

| Item | Status | Evidence or next action |
| --- | --- | --- |
| JMeter | Confirmed: Apache JMeter 5.6.3 | Phase 1 environment check in `plan.md` |
| Student ID and date | Confirmed: `23127194`, `2026-08-12` | Phase 1 tester decision |
| Scenario | Confirmed: C - Checkout then cancel | Unique within the group |
| Endpoint smoke test | Passed | `reports/smoke-test.md` |
| Reset and user provisioning | Confirmed and automated | `reports/user-provisioning.md` |
| Single-user performance baseline | Complete | 20 sequential flows, 180/180 HTTP successes, 20/20 business successes; see `reports/load-baseline.md` |
| Workload and thresholds | Human-confirmed | See `reports/load-baseline.md` Section 4 |
| Final JMX | Generated and validated | `tests/23127194_Load_20260812.jmx`; see `reports/load-plan-validation.md` |

## 2. Objective and scope

The Load test will assess the sustained behavior of one complete customer order lifecycle while preserving per-user state isolation. Each iteration authenticates one provisioned user, performs catalogue reads, creates cart and order state, correlates the new order, cancels that same order, and verifies the final state.

Endpoint-group coverage:

| Group | Covered steps |
| --- | --- |
| Auth-heavy | Login and JWT extraction |
| Read-heavy | Product search and product detail |
| Transactional | Add/read cart, checkout, fresh-order read, cancellation, and order-history verification |

Registration and product preflight are setup activities and must not be included in measured Load samples. The same measured HTTP sequence must be reused unchanged in the later Stress and Spike plans.

## 3. Fixed measured flow

| Order | Stable sampler name | Request | Correlation or business verification |
| ---: | --- | --- | --- |
| 1 | `01 Login` | `POST /api/login` | HTTP 200; extract non-empty `token` |
| 2 | `02 Search Products` | `GET /api/products?search=${search_keyword}` | HTTP 200; JSON array contains `${product_id}` |
| 3 | `03 Product Detail` | `GET /api/products/${product_id}` | HTTP 200; matching ID; extract a positive numeric price |
| 4 | `04 Add To Cart` | `POST /api/cart` | HTTP 200; success message |
| 5 | `05 Verify Cart` | `GET /api/cart` | HTTP 200; selected product exists in the cart |
| 6 | `06 Checkout` | `POST /api/checkout` | HTTP 200; compute total from price and quantity; extract positive `orderId` |
| 7 | `07 Read Fresh Order` | `GET /api/orders/${orderId}` | HTTP 200; ID equals `${orderId}` and status is `pending` |
| 8 | `08 Cancel Fresh Order` | `PUT /api/orders/${orderId}/cancel` | HTTP 200; cancellation success message |
| 9 | `09 Verify Canceled History` | `GET /api/orders/my-orders` | HTTP 200; the same `${orderId}` has status `canceled` |

The final JMX will group these samplers into stable transaction controllers for auth-heavy, read-heavy, cart, checkout, and order-lifecycle reporting. At the start of every loop it will clear correlation variables so a failed iteration cannot reuse a prior token, price, or order ID. `ThreadGroup.on_sample_error` will use `startnextloop` so a failed assertion aborts the current business flow without terminating the user's remaining scheduled workload.

## 4. Data and state contract

The JMX will read `data/scenario-c.local.csv` with this header:

```text
email,password,search_keyword,product_id,quantity,shipping_address
```

CSV Data Set Config requirements:

- Sharing mode: all threads.
- `recycle=false`.
- `stopThread=true`.
- No credentials or fallback credential placeholders in the tracked JMX.
- `USER_COUNT >= load.threads`; every concurrent thread must receive a distinct provisioned account.

Before a validation or measured run, restart the backend and immediately provision users. A successful iteration creates one persistent order and changes it to `canceled`; the next backend restart resets the database. Cart state remains in process memory and grows if a thread performs multiple iterations, so iteration count and residual state must be reported as limitations.

## 5. JMeter component design

The final plan will use standard JMeter 5.6.3 components only:

1. Test Plan with base protocol, host, and port variables for the smoke-verified `http://127.0.0.1:3000` target.
2. A non-HTTP setup validation section that fails with a named error if a required runtime property is blank or invalid.
3. Exactly one measured Thread Group with scheduler enabled and no hidden numeric workload defaults.
4. One CSV Data Set Config targeting `data/scenario-c.local.csv`.
5. HTTP Request Defaults and JSON content headers; authenticated requests send `Authorization: Bearer ${token}`.
6. Transaction Controllers with stable names for endpoint-group aggregation.
7. JSON Extractors for `token`, product price, and `orderId` with unmistakable missing-value sentinels.
8. Response Assertions for expected HTTP status codes and JSR223 Assertions for business state and same-order correlation.
9. Constant Timers scoped to user-action boundaries and driven by the reviewed property.
10. A disabled View Results Tree for structure/debugging only; it must remain disabled during non-GUI measured execution.

Required runtime properties:

```text
-Jload.threads=<reviewed-positive-integer>
-Jload.ramp_up_seconds=<reviewed-positive-integer>
-Jload.duration_seconds=<reviewed-positive-integer>
-Jload.think_time_ms=<reviewed-non-negative-integer>
```

The JMX expressions will be exactly `${__P(load.threads,)}`, `${__P(load.ramp_up_seconds,)}`, `${__P(load.duration_seconds,)}`, and `${__P(load.think_time_ms,)}`. Omitted properties must fail clearly rather than falling back to unreviewed values.

## 6. Workload contract awaiting human review

The real one-thread baseline is documented in `reports/load-baseline.md`. The raw JTL contains 180/180 successful HTTP requests and 20/20 successful end-to-end flows; its SHA-256 is recorded in that report. The following values remain AI proposals until the tester reviews them.

| Parameter | Current value | Required basis before approval |
| --- | --- | --- |
| Threads/VUs | `10 - Human-confirmed` | Controlled initial concurrency using 10 isolated accounts |
| Ramp-up | `20 seconds - Human-confirmed` | One VU every 2 seconds to avoid an accidental spike |
| Hold duration | `120 seconds - Human-confirmed` | Hundreds of expected complete flows at full concurrency |
| Ramp-down | `0 seconds staged - Human-confirmed` | At the deadline, start no new flow and let the active flow finish using standard components |
| Think-time | `500 ms - Human-confirmed` | Prevents the zero-think-time tight loop used only by the baseline |
| HTTP error threshold | `<= 1.0% - Human-confirmed` | Baseline: 0/180 HTTP errors |
| Business-flow success threshold | `>= 99.0% - Human-confirmed` | Baseline: 20/20 successful flows |
| p95 threshold | `end-to-end <= 250 ms; each transaction <= 100 ms - Human-confirmed` | Baseline: 40.65 ms end-to-end p95; highest transaction p95 18.15 ms |
| Load report/listener allocation | `Summary Report - Human-confirmed` | Lightweight Load-specific view; raw `.jtl` and HTML dashboard remain the authoritative evidence |

The proposed Summary Report allocation reserves other distinct listener/report types for Stress and Spike. It does not replace raw `.jtl` evidence and must be confirmed together with the workload contract.

## 7. Baseline and approval gate

Before final JMX generation:

- [x] Create a separate baseline/functional validation plan; do not mislabel it as the final Load plan.
- [x] Restart the backend and provision fresh users without exposing the password.
- [x] Run one thread with a controlled iteration count and retain the untouched baseline `.jtl`.
- [x] Verify all nine HTTP requests, correlation values, and business assertions.
- [x] Calculate baseline transaction latency, iteration time, throughput, p95, HTTP error rate, and business-flow success from the raw result.
- [x] Record proposed workload values and rationale, each labeled `Proposed - pending human review`.
- [x] Obtain tester confirmation for VUs, ramp-up, hold duration, ramp-down, think-time, thresholds, and Summary Report allocation.
- [x] Generate `tests/23127194_Load_20260812.jmx` and pass the structural validator.
- [x] Perform a one-thread dry run after provisioning; automated GUI-tree inspection remains pending tester visual confirmation.

The baseline and dry run are validation evidence, not measured Phase 2 Load evidence. A measured Load run requires a separate explicit execution request after this gate is approved.

Human Review:
- Status: Workload contract accepted; generated JMX pending tester review
- Accepted: 10 VUs, 20-second ramp-up, 120-second hold, 0-second staged ramp-down, 500 ms think-time, reviewed thresholds, and Summary Report allocation.
- Modified:
- Removed:
- Added:
- Notes:
