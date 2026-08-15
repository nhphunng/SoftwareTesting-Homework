# Scenario C Measured Stress Results

## 1. Run identity

| Field | Value |
| --- | --- |
| Classification | Measured Phase 3 progressive Stress execution |
| Start | 2026-08-12T14:22:34.788+07:00 |
| End | 2026-08-12T14:27:37.088+07:00 |
| Plan | `tests/23127194_Stress_20260812.jmx` |
| Plan SHA-256 | `e25df04030ac34277294b3d32c14aa9f77f291a0c948eaef4fd0c73d5052f233` |
| Raw JTL | `results/raw/stress/23127194_Stress_20260812.jtl` |
| Raw JTL SHA-256 | `11017bc182bcfa53966964620e5a957a39cdbcf7c42cf1dc3080555c253660b8` |
| HTML dashboard | `results/html/stress/23127194_Stress_20260812/` |
| Workload | Linear ramp to 80 threads over 240 s; 300 s flow-start deadline; 250 ms think-time |
| Listener | Aggregate Report |

The backend was reset and 80 unique accounts were provisioned before measured traffic. The exact nine-request Scenario C flow and assertions were reused from Load.

## 2. Whole-run integrity

| Check | Result |
| --- | ---: |
| Maximum recorded active threads | 80 |
| Complete business flows | 6,336 |
| Successful business flows | 6,336 |
| HTTP samples | 57,024 |
| Failed HTTP samples | 0 |
| Total JTL rows | 95,041 |
| Failed JTL rows | 0 |
| Orders after run | 6,336 |
| Canceled orders | 6,336 |
| Non-canceled orders | 0 |

## 3. Metrics by active-thread band

Bands are calculated from each raw JTL row's `allThreads` value. They do not assume that scheduled threads were already active.

| Active threads | Flows | Business success | HTTP samples | HTTP errors | E2E average | E2E p95 | Highest transaction p95 | Observed flow throughput |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1-20 | 283 | 100% | 2,474 | 0% | 15.02 ms | 24 ms | 10.90 ms | 0.94 flows/s |
| 21-40 | 805 | 100% | 7,223 | 0% | 14.29 ms | 22 ms | 10 ms | 3.33 flows/s |
| 41-60 | 1,328 | 100% | 11,993 | 0% | 14.95 ms | 25 ms | 12 ms | 7.33 flows/s |
| 61-80 | 3,920 | 100% | 35,334 | 0% | 14.88 ms | 26 ms | 13 ms | 32.50 flows/s |

The flow-throughput values are descriptive within each band's observed timestamp window. Ramp bands overlap thread transitions and therefore should not be interpreted as independent steady-state tests.

## 4. Whole-run JMeter metrics

| Label | Samples | Errors | Average | p95 | Max | Throughput |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Scenario C End-to-End | 6,336 | 0 | 14.83 ms | 25 ms | 57 ms | 21.12 flows/s |
| Auth Heavy | 6,336 | 0 | 1.68 ms | 4 ms | 27 ms | 21.12/s |
| Read Heavy | 6,336 | 0 | 3.01 ms | 7 ms | 36 ms | 21.15/s |
| Transactional Cart | 6,336 | 0 | 1.59 ms | 4 ms | 13 ms | 21.16/s |
| Transactional Checkout | 6,336 | 0 | 2.35 ms | 5 ms | 34 ms | 21.16/s |
| Transactional Order Lifecycle | 6,336 | 0 | 6.20 ms | 12 ms | 47 ms | 21.16/s |

## 5. Breakpoint verdict

| Signal | Limit | Highest measured band value | Verdict |
| --- | ---: | ---: | --- |
| HTTP error rate | <= 1% | 0% | Sustainable through 61-80 |
| Business success | >= 99% | 100% | Sustainable through 61-80 |
| End-to-end p95 | <= 250 ms | 26 ms | Sustainable through 61-80 |
| Transaction p95 | <= 100 ms | 13 ms | Sustainable through 61-80 |
| Residual non-canceled orders | 0 | 0 | Pass |

**No breakpoint was observed up to 80 active threads.** This is the maximum tested concurrency, not a proven capacity ceiling. A higher-level follow-up would be required to locate the actual failure point.

## 6. Resource evidence

The resource CSV contains 294 timestamped samples after its header.

| Process | CPU average | CPU peak | RSS average | RSS peak |
| --- | ---: | ---: | ---: | ---: |
| Backend `node` | 9.56% | 22.7% | 130.88 MiB | 188.11 MiB |
| JMeter JVM | 5.92% | 211.8% | 488.54 MiB | 823.11 MiB |

On macOS, process CPU can exceed 100% when multiple logical cores are used. The backend did not approach a one-core CPU ceiling in these samples. JMeter's initial CPU peak is load-generator activity and is not SUT CPU. These observations apply only to this local machine and run.

## 7. Validation incident

The first dry run connected to a stale backend already holding port 3000. Provisioning appeared to reuse accounts, but the subsequent JMeter logins returned 401. It produced no checkout order and is excluded from measured results. The runner now refuses to start when port 3000 is occupied and waits for the new backend's database initialization marker. DryRun02 then passed 24/24 flows, 216/216 HTTP requests, and left 24/24 orders canceled before measured execution.

Human Review:
- Status: Stress design, JMeter tree, and measured results reviewed and approved by tester on 2026-08-14
- Accepted: Measured results, active-thread-band analysis, resource interpretation, and the conclusion that no breakpoint was observed through 80 active threads
- Modified:
- Removed:
- Added:
- Notes:
