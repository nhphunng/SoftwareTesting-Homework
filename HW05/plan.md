# HW05 Implementation Plan - Scenario C

## Phase 1 - Human decisions and data

**Status: Decision gates and API smoke test complete; JMeter installation, user-pool capacity, execution date, and reset policy remain pending.**

- [x] Select the class-default tool: **JMeter**.
- [x] Confirm Student ID: **23127194**.
- [ ] Confirm the final execution date used in test-plan filenames.
- [x] Confirm Candidate C is unique in the group; Candidate A is already taken.
- [x] Verify the supplied user and admin demo accounts without storing their passwords in the repository.
- [x] Verify a real product for Scenario C: product `1`, `iPhone 15 Pro Max`.
- [ ] Prepare enough dedicated user accounts for the maximum planned JMeter threads. The single supplied user account is not sufficient for isolated concurrent carts.
- [ ] Decide the SQLite snapshot/reset policy and residual canceled-order handling.
- [x] Smoke-test every Scenario C endpoint.

### Phase 1 environment check

| Item | Verified result |
| --- | --- |
| JMeter | Not installed or not available on `PATH` |
| Java | Java 24 is installed |
| Backend | Started successfully on `http://127.0.0.1:3000` for the smoke test, then stopped |
| User account | `test@eshop.com` login verified; password intentionally not recorded |
| Admin account | `admin@eshop.com` login and `GET /api/admin/orders` verified; password intentionally not recorded |

### Scenario C smoke result - 2026-08-12T11:54:44+07:00

| Step | Endpoint | Result |
| --- | --- | --- |
| User login | `POST /api/login` | HTTP 200; JWT received |
| Product search | `GET /api/products?search=iPhone` | HTTP 200; product `1` selected |
| Product detail | `GET /api/products/1` | HTTP 200; matching ID and positive price |
| Add to cart | `POST /api/cart` | HTTP 200 |
| Verify cart | `GET /api/cart` | HTTP 200; selected product present |
| Checkout | `POST /api/checkout` | HTTP 200; order `1` created |
| Read fresh order | `GET /api/orders/1` | HTTP 200; status `pending` |
| Cancel fresh order | `PUT /api/orders/1/cancel` | HTTP 200 |
| Verify history | `GET /api/orders/my-orders` | HTTP 200; order `1` status `canceled` |
| Admin login | `POST /api/login` | HTTP 200; JWT received |
| Admin order read | `GET /api/admin/orders` | HTTP 200; array response |

The backend process was stopped after the smoke test, clearing its in-memory cart. Canceled order `1` remains in SQLite because the SUT has no order-deletion endpoint. This was a functional smoke test, not a performance run; it produced no `.jtl`, report, threshold, or resource evidence.

Suggested commit: `docs(hw05): select scenario C and define execution controls`

## Phase 2 - Load test

- Install and verify JMeter.
- Review baseline latency and throughput.
- Choose realistic VUs, ramp-up, hold, ramp-down, and think-time.
- Create the data-driven Scenario C JMeter `.jmx` plan and name it manually using the required convention.
- Add reviewed thresholds and response assertions.
- Run with raw output, report view, resource monitor, and hardware context.
- Review order creation/cancellation correctness and residual data.

Suggested commit: `test(hw05): implement reviewed scenario C load plan`

## Phase 3 - Stress test

- Define progressive stress stages from the Load baseline.
- Identify the first sustainable/unsustainable level without reusing locked or corrupted accounts.
- Create the Stress JMeter `.jmx` plan by reusing the exact Scenario C functional controllers from Load.
- Execute with isolated evidence and document recovery behavior.

Suggested commit: `test(hw05): implement scenario C stress breakpoint plan`

## Phase 4 - Spike test

- Define baseline, spike, and recovery stages from prior observations.
- Create the Spike JMeter `.jmx` plan by reusing the exact Scenario C functional controllers from Load.
- Execute with isolated evidence and verify post-spike recovery.

Suggested commit: `test(hw05): implement scenario C spike recovery plan`

## Phase 5 - Endurance threshold

- Select a sustained load below the observed stress breakpoint.
- Run for approximately 10-15 minutes with resource monitoring.
- Derive the maximum stable RPS and memory ceiling only from recorded evidence.

Suggested commit: `test(hw05): add endurance threshold experiment`

## Phase 6 - AI analysis and human critique

- Give AI the untouched raw outputs and environment context.
- Preserve the complete AI output.
- Verify every AI-cited value against raw logs.
- Record misinterpretations and corrected values.
- Classify each proposed optimization as feasible or hallucinated.
- Write the mandatory 200-300 word critique.

Suggested commit: `docs(hw05): review AI performance analysis against raw logs`

## Phase 7 - Continuous performance proposal and submission

- Add a commit-trigger decision flow and p95 regression policy.
- Discuss cost and false-alarm trade-offs.
- Complete Markdown/PDF reports and render checks.
- Record the 6+ minute Vietnamese demo with tool and resource monitor together.
- Export the real Git log and complete the submission checklist.

Suggested commit: `docs(hw05): finalize continuous testing proposal and submission`
