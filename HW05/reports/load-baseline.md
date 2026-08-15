# Scenario C Single-User Baseline

## 1. Classification and identity

| Field | Value |
| --- | --- |
| Classification | Functional/performance validation baseline; not measured Phase 2 Load evidence |
| Timestamp | 2026-08-12T13:17:34+07:00 |
| Tool | Apache JMeter 5.6.3, non-GUI mode |
| Plan | `tests/baseline/23127194_ScenarioC_Baseline_20260812.jmx` |
| Raw result | `results/raw/baseline/23127194_ScenarioC_Baseline_20260812.jtl` |
| HTML report | `results/html/baseline/23127194_ScenarioC_Baseline_20260812/` |
| Raw JTL SHA-256 | `a7d157e1a763e85811da03192a7f1d638031d812096ca68857a0fce730d1fa84` |
| Concurrency | 1 thread |
| Iterations | 20 sequential iterations |
| Data | 20 freshly provisioned unique users; CSV recycling disabled |
| Think-time | 0 ms, intentionally excluded to observe local API/service latency |
| Base URL | `http://127.0.0.1:3000` |

The baseline used the exact nine-request Scenario C sequence. Registration and provisioning occurred before JMeter and are not present in the JTL. The backend was stopped after the test, clearing in-memory cart state.

## 2. Execution integrity

The first attempt produced only connection failures because the background backend process did not survive across execution sessions. It is preserved separately as `results/raw/baseline/attempt-01-connectivity-failure.jtl` and is excluded from every metric below. The valid rerun started the backend, provisioned users, executed JMeter, and stopped the backend in one controlled session.

Valid-run checks:

| Check | Result |
| --- | --- |
| HTTP samples | 180: 20 samples for each of 9 HTTP samplers |
| HTTP response codes | 180 HTTP 200; 0 non-200 responses |
| Transaction parent samples | 120: 20 samples for each of 6 transaction labels |
| Total JTL rows excluding header | 300 |
| Failed JTL rows | 0 |
| End-to-end business flows | 20 passed; 0 failed |
| Database state after run | 20 total orders; 20 `canceled`; 0 non-canceled |
| Credentials in tracked JMX | None; only `${email}` and `${password}` CSV variables |

## 3. Measured baseline metrics

The values below come from the untouched raw JTL and JMeter-generated `statistics.json`. JMeter's default report percentiles are p90, p95, and p99.

| Label | Samples | Errors | Average | p90 | p95 | p99 | Max | Throughput |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Scenario C End-to-End | 20 | 0 | 11.00 ms | 14.80 ms | 40.65 ms | 42.00 ms | 42 ms | 22.25 flows/s |
| Auth Heavy | 20 | 0 | 2.20 ms | 2.00 ms | 18.15 ms | 19.00 ms | 19 ms | 22.45 samples/s |
| Read Heavy | 20 | 0 | 1.50 ms | 2.00 ms | 2.95 ms | 3.00 ms | 3 ms | 45.45 samples/s |
| Transactional Cart | 20 | 0 | 1.55 ms | 2.00 ms | 2.95 ms | 3.00 ms | 3 ms | 57.64 samples/s |
| Transactional Checkout | 20 | 0 | 2.45 ms | 6.50 ms | 10.80 ms | 11.00 ms | 11 ms | 60.06 samples/s |
| Transactional Order Lifecycle | 20 | 0 | 3.30 ms | 5.80 ms | 6.00 ms | 6.00 ms | 6 ms | 62.70 samples/s |
| HTTP total | 180 | 0 | 1.22 ms | 2.00 ms | 2.00 ms | 12.52 ms | 19 ms | 346.15 requests/s |

The complete 20-flow wall-clock window was approximately 0.90 seconds, equivalent to about 22.17 flows/s when calculated from the earliest transaction start to the latest transaction end. JMeter's HTTP-total throughput uses the HTTP sample time window and therefore reports 346.15 requests/s. These short local, zero-think-time measurements are a baseline comparison point, not a demonstrated capacity ceiling.

## 4. Human-confirmed Load contract

The tester confirmed every proposed value on 2026-08-12. The values below are the generation contract for `tests/23127194_Load_20260812.jmx`.

| Parameter | Proposed value | Evidence and rationale |
| --- | --- | --- |
| Threads/VUs | **10 VUs - Human-confirmed** | A controlled initial concurrency level; it is well above the one-thread baseline but requires only 10 isolated CSV accounts. It is intended to reveal concurrent SQLite/cart behavior without claiming a capacity limit. |
| Ramp-up | **20 seconds - Human-confirmed** | Starts one VU every 2 seconds, avoiding an accidental spike and allowing authentication/database activity to build progressively. |
| Hold duration | **120 seconds steady state - Human-confirmed** | With 10 VUs and 500 ms action pacing, this should produce hundreds of complete flows and thousands of HTTP samples, materially more representative than the 20-flow baseline. |
| JMeter scheduler duration | **140 seconds - Human-confirmed** | Includes the 20-second ramp-up plus 120 seconds at full target concurrency. This is the value intended for `load.duration_seconds`. |
| Ramp-down | **0 seconds staged ramp-down - Human-confirmed** | At the reviewed 140-second deadline, the standard-component control loop starts no new business flow and allows an active flow to finish. This avoids both a non-standard plugin and an order left `pending` by a mid-iteration scheduler stop. |
| Think-time | **500 ms per user-action boundary - Human-confirmed** | The baseline intentionally used 0 ms. A small 500 ms pause prevents an unrealistic tight loop while retaining enough request volume for a two-minute Load observation. |
| HTTP error rate | **<= 1.0% - Human-confirmed** | Baseline was 0/180 errors. A 1% ceiling permits isolated environmental noise but still rejects sustained functional or transport failures. |
| Business-flow success | **>= 99.0% - Human-confirmed** | Baseline was 20/20 successful. The same-order pending/canceled assertions remain mandatory; this gate prevents HTTP 200 responses from hiding incorrect order state. |
| End-to-end p95 | **<= 250 ms - Human-confirmed** | Baseline JMeter p95 was 40.65 ms. The proposed limit provides roughly a 6.1x concurrency/environment margin while still flagging a material regression. |
| Per-transaction p95 | **<= 100 ms - Human-confirmed** | The highest baseline transaction p95 was 18.15 ms. A 100 ms ceiling provides roughly a 5.5x margin and keeps auth, reads, cart, checkout, and cancellation individually accountable. |
| Load report/listener | **Summary Report - Human-confirmed** | Lightweight and distinct for Load. Raw JTL and the HTML dashboard remain authoritative; View Results Tree stays disabled during measured non-GUI execution. |

## 5. Gate remaining before final JMX

- [x] Run a real one-thread baseline after reset and provisioning.
- [x] Preserve the untouched raw JTL and checksum.
- [x] Verify all HTTP and business assertions.
- [x] Verify residual order state against the database.
- [x] Propose workload parameters, thresholds, and listener allocation from evidence.
- [x] Tester confirms every proposed value in Section 4.
- [x] Generate and structurally validate `tests/23127194_Load_20260812.jmx`.
- [x] Tester visually confirmed the final plan tree in JMeter GUI on 2026-08-12.
- [x] Perform a one-thread functional dry run after provisioning; see `reports/load-plan-validation.md`.

Human Review:
- Status: Accepted by tester on 2026-08-12
- Accepted: Entire proposed Load contract in Section 4.
- Modified:
- Removed:
- Added:
- Notes:
