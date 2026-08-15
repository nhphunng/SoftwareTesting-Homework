# Scenario C Measured Spike Results

## 1. Run identity

| Field | Value |
| --- | --- |
| Classification | Measured Phase 4 Spike execution |
| Tester visual tree approval | Confirmed before execution on 2026-08-12 |
| Measured start | 2026-08-12T15:13:31.999+07:00 |
| Measured end | 2026-08-12T15:15:38.303+07:00 |
| Plan | `tests/23127194_Spike_20260812.jmx` |
| Plan SHA-256 | `6f451d52364f87c4cca719d96a3f90047bd1cbe7180183c221ea7cafd174f827` |
| Raw JTL | `results/raw/spike/23127194_Spike_20260812.jtl` |
| Raw JTL SHA-256 | `62592462cb28c12ea3469fa73836db1b91793161b45cba1ebcbc024bb8c53c9e` |
| HTML dashboard | `results/html/spike/23127194_Spike_20260812/` |
| Workload | Baseline 10 threads/30 s, Spike 80 threads/60 s, Recovery 10 threads/30 s; one-second ramps and 250 ms think-time |
| Listener | Response Time Graph |

The runner reset the backend, waited for the database initialization marker, and provisioned 80 fresh accounts before JMeter began. Registration is outside the measured JTL. The serialized groups began at 15:13:32.312, 15:14:03.505, and 15:15:06.010 local time; active flows were allowed to complete after each flow-start deadline.

## 2. Integrity and business state

| Check | Measured result |
| --- | ---: |
| Complete Scenario C flows | 2,363 |
| Successful business flows | 2,363 |
| HTTP samples | 21,267 |
| Successful HTTP samples | 21,267 |
| Total raw JTL rows | 35,546 |
| Failed raw JTL rows | 0 |
| Orders after execution | 2,363 |
| Canceled orders | 2,363 |
| Non-canceled orders | 0 |

The counts are internally consistent: every complete flow produced exactly nine HTTP requests and one canceled order. The raw JTL was not edited after JMeter generated it.

## 3. Metrics by stage

JMeter's generated `statistics.json` supplies the stage p95 values below.

| Stage | Flows | Business success | HTTP samples | HTTP errors | E2E average | E2E p95 | Highest transaction p95 | Flow throughput |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Baseline | 130 | 100% | 1,170 | 0% | 22.89 ms | 36.45 ms | 16.45 ms | 4.54/s |
| Spike | 2,102 | 100% | 18,918 | 0% | 14.50 ms | 27.00 ms | 14.00 ms | 35.06/s |
| Recovery | 131 | 100% | 1,179 | 0% | 17.98 ms | 26.00 ms | 11.00 ms | 4.37/s |

| Stage | Auth p95 | Read p95 | Cart p95 | Checkout p95 | Order lifecycle p95 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Baseline | 12.40 ms | 8.45 ms | 5.00 ms | 12.60 ms | 16.45 ms |
| Spike | 4.00 ms | 6.00 ms | 4.00 ms | 7.00 ms | 14.00 ms |
| Recovery | 5.00 ms | 6.00 ms | 5.00 ms | 7.00 ms | 11.00 ms |

All three stages passed the reviewed absolute criteria: HTTP errors <= 1%, business success >= 99%, end-to-end p95 <= 250 ms, and every transaction p95 <= 100 ms.

## 4. Recovery analysis

The full Recovery-stage p95 was 26.00 ms, or 0.71 times the same run's Baseline p95 of 36.45 ms. This is below the reviewed relative limit of 1.5 times Baseline (54.68 ms).

Recovery windows use Recovery end-to-end sample start timestamps from the untouched JTL. Window p95 is calculated from raw elapsed values; HTTP and business results are taken from the same timestamp interval.

| Recovery window | Complete flows | Business success | E2E p95 | HTTP samples | HTTP errors | Contract result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| 0-10 s | 48 | 100% | 25.00 ms | 368 | 0% | Pass |
| 10-20 s | 42 | 100% | 23.95 ms | 392 | 0% | Pass |
| 20-30 s | 41 | 100% | 26.00 ms | 390 | 0% | Pass |

The first full 10-second window met the relative p95, absolute p95, HTTP-error, and business-success limits, and both later full windows remained compliant. Therefore, application-level recovery was confirmed at the end of the first window, **10 seconds after Recovery began**, within the reviewed 20-second limit.

## 5. Resource evidence

The resource CSV contains 125 timestamped backend samples and 124 JMeter JVM samples after its header.

| Process/window | CPU average | CPU peak | RSS average | RSS peak |
| --- | ---: | ---: | ---: | ---: |
| Backend, whole run | 9.23% | 25.4% | 141.38 MiB | 190.06 MiB |
| Backend, Spike stage | 15.91% | 25.4% | 156.08 MiB | 189.48 MiB |
| Backend, final 10 s before Spike | 2.27% | 3.9% | 77.27 MiB | 78.48 MiB |
| Backend, final full 10 s of Recovery | 3.62% | 4.7% | 182.17 MiB | 182.59 MiB |
| JMeter JVM, whole run | 13.13% | 216.4% | 560.76 MiB | 811.91 MiB |

Backend CPU returned toward its pre-spike level during the final Recovery window. Backend RSS fell below the run peak but remained substantially above its pre-spike window, so memory recovery is **not** claimed. The higher JMeter CPU peak is load-generator activity on a multicore macOS host and is not SUT CPU.

## 6. Verdict and scope

The measured run passes every reviewed HTTP, business, latency, and application-recovery criterion and leaves no residual non-canceled order. It demonstrates Scenario C resilience and application-level recovery for the tested sudden change from 10 to 80 and back to 10 threads.

Stress previously found no breakpoint through 80 active threads, and this Spike run also produced no failure condition. Therefore, 80 remains the maximum tested concurrency, not a capacity ceiling. Memory did not return to its pre-spike RSS range during the short Recovery stage; a longer observation would be required to determine whether that reflects retained runtime allocation, delayed reclamation, or continued growth.

Human Review:
- Status: Measured Spike results reviewed and approved by tester on 2026-08-14
- Accepted: Final Spike tree, measured stage metrics, application-recovery conclusion, resource interpretation, and execution evidence
- Modified:
- Removed:
- Added:
- Notes:
