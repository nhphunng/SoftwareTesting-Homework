# Scenario C Endurance Test Design

## 1. Human-confirmed contract

The tester confirmed the complete Phase 5 proposal on 2026-08-12.

| Parameter | Confirmed value |
| --- | ---: |
| Sustained concurrency | 60 threads |
| Ramp-up | 30 seconds |
| Flow-start duration | 720 seconds |
| Think-time | 250 ms |
| Resource sampling | 1 second |
| Analysis window | 60 seconds |
| GUI listeners during measured run | Disabled |
| Final plan | `tests/23127194_Endurance_20260812.jmx` |

The 60-thread workload is below the highest tested Stress concurrency of 80. Stress did not find a breakpoint through 80 active threads, so neither 60 nor 80 is treated as a capacity ceiling.

## 2. Functional contract

The Endurance plan clones the validated Load Scenario C controller and preserves all paired assertions:

1. `POST /api/login` - auth-heavy.
2. `GET /api/products?search=...` - read-heavy.
3. `GET /api/products/${product_id}` - read-heavy.
4. `POST /api/cart` - transactional.
5. `GET /api/cart` - transactional verification.
6. `POST /api/checkout` - transactional order creation and fresh `orderId` extraction.
7. `GET /api/orders/${orderId}` - correlated pending-order verification.
8. `PUT /api/orders/${orderId}/cancel` - same-order cancellation.
9. `GET /api/orders/my-orders` - correlated canceled-history verification.

Each thread receives one non-recycled CSV account after backend reset. Registration remains outside the measured JTL. A thread may finish an active flow after the 720-second flow-start deadline, preventing partially completed checkout/order lifecycles from being counted as a graceful end.

## 3. Reviewed acceptance and analysis rules

- HTTP error rate <= 1% overall and in each complete steady-state minute.
- Business success >= 99% overall and in each complete steady-state minute.
- End-to-end p95 <= 250 ms overall and per complete steady-state minute.
- Every transaction p95 <= 100 ms overall and per complete steady-state minute.
- Zero residual non-canceled order after graceful completion.
- No backend crash, restart, or readiness loss.
- Resource CSV must contain timestamped backend and JMeter samples throughout the run.

Backend CPU/RSS and JMeter CPU/RSS are reported separately. Memory is descriptive unless the measured tail supports a stable plateau: report RSS average, peak, start/end, and slope. The result may state the maximum observed stable complete-flow RPS and maximum observed backend RSS for this configuration; it must not claim a universal RPS or memory capacity ceiling.

## 4. Evidence contract

The measured runner must reset the backend, provision at least 60 accounts, and preserve one attributed identity across:

- raw JTL;
- JMeter log and console log;
- generated HTML report;
- timestamped environment and resource evidence;
- final order state.

All GUI listeners stay disabled during measured execution. The tester must visually review the final tree before the 12-minute run is authorized.

Human Review:
- Status: Contract and final JMeter tree accepted; measured execution authorized
- Accepted: 60 threads, 30-second ramp, 720-second duration, 250 ms think-time, one-second resource sampling, 60-second analysis windows, acceptance rules, descriptive memory rule, disabled GUI listeners, and final tree
- Modified:
- Removed:
- Added:
- Notes: Contract confirmation supplied by `Tôi đã kiểm tra và xác nhận hãy tiếp tục thực hiện`; final-tree acceptance and execution authorization supplied by `Tôi đã xem qua final tree, bạn hãy measure endurance 12 phút`.
