# Scenario C Measured Endurance Results

## 1. Run identity

| Field | Value |
| --- | --- |
| Classification | Measured Phase 5 Endurance execution |
| Tester visual tree approval | Confirmed before execution on 2026-08-12 |
| Measured flow interval | 2026-08-12T16:08:38.453+07:00 to 2026-08-12T16:20:38.247+07:00 |
| Measured flow elapsed | 719.794 seconds |
| Plan | `tests/23127194_Endurance_20260812.jmx` |
| Plan SHA-256 | `9c8e988e338935e904bd7b1a8a36ce84ef918a8fbdaba164aedc5fb5d39bac2d` |
| Raw JTL | `results/raw/endurance/23127194_Endurance_20260812.jtl` |
| Raw JTL SHA-256 | `15752a8303fc0db4c7696b6da116b899d1c38e79e90aa351dac8daede4f072c9` |
| HTML dashboard | `results/html/endurance/23127194_Endurance_20260812/` |
| Workload | 60 threads; 30-second ramp; 720-second flow-start duration; 250 ms think-time |
| GUI listeners | Disabled |

The runner reset the backend, waited for database initialization, and provisioned 60 fresh accounts before JMeter. Registration is outside the measured JTL. Active flows were allowed to finish after the flow-start deadline.

## 2. Integrity and business state

| Check | Measured result |
| --- | ---: |
| Complete Scenario C flows | 18,400 |
| Successful business flows | 18,400 (100%) |
| HTTP samples | 165,600 |
| Successful HTTP samples | 165,600 (100%) |
| Total raw JTL rows | 276,001 |
| Failed raw JTL rows | 0 |
| Orders after execution | 18,400 |
| Canceled orders | 18,400 |
| Non-canceled orders | 0 |
| Backend alive after JMeter | Yes |
| Backend readiness after JMeter | HTTP 200 |

Every complete flow produced exactly nine HTTP requests and one canceled order. The raw JTL was not edited after JMeter generated it.

## 3. Whole-run metrics

JMeter's generated `statistics.json` and the raw-JTL analyzer agree on the aggregate values.

| Metric | Measured value | Reviewed limit | Verdict |
| --- | ---: | ---: | --- |
| HTTP error rate | 0% | <= 1% | Pass |
| Business success | 100% | >= 99% | Pass |
| End-to-end average | 16.03 ms | Descriptive | - |
| End-to-end p95 | 30 ms | <= 250 ms | Pass |
| Highest transaction p95 | 14 ms | <= 100 ms | Pass |
| Observed complete-flow rate | 25.56 flows/s | Descriptive | - |

| Transaction | p95 |
| --- | ---: |
| Auth Heavy | 5 ms |
| Read Heavy | 8 ms |
| Transactional Cart | 3 ms |
| Transactional Checkout | 5 ms |
| Transactional Order Lifecycle | 14 ms |

## 4. Complete steady-state windows

The analyzer excludes the 30-second ramp and evaluates eleven complete one-minute windows whose start timestamps precede the reviewed flow-start deadline. Samples are assigned by their raw start timestamp.

| Minute | Flows | Flow rate | Business success | HTTP errors | E2E p95 | Highest transaction p95 | Backend CPU avg | Backend RSS avg / peak | Result |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | 1,569 | 26.15/s | 100% | 0% | 23 ms | 10 ms | 11.93% | 151.16 / 188.44 MiB | Pass |
| 2 | 1,570 | 26.17/s | 100% | 0% | 27 ms | 13 ms | 10.83% | 177.37 / 188.84 MiB | Pass |
| 3 | 1,560 | 26.00/s | 100% | 0% | 27 ms | 12 ms | 11.13% | 148.98 / 177.44 MiB | Pass |
| 4 | 1,554 | 25.90/s | 100% | 0% | 28 ms | 14 ms | 11.19% | 74.47 / 82.73 MiB | Pass |
| 5 | 1,549 | 25.82/s | 100% | 0% | 19 ms | 9 ms | 12.81% | 75.97 / 78.70 MiB | Pass |
| 6 | 1,555 | 25.92/s | 100% | 0% | 25 ms | 12 ms | 12.99% | 72.37 / 75.23 MiB | Pass |
| 7 | 1,565 | 26.08/s | 100% | 0% | 44 ms | 20 ms | 14.46% | 71.47 / 78.50 MiB | Pass |
| 8 | 1,560 | 26.00/s | 100% | 0% | 39 ms | 22 ms | 12.42% | 75.51 / 76.50 MiB | Pass |
| 9 | 1,574 | 26.23/s | 100% | 0% | 26 ms | 13 ms | 11.49% | 80.97 / 95.28 MiB | Pass |
| 10 | 1,569 | 26.15/s | 100% | 0% | 28 ms | 14 ms | 12.18% | 94.01 / 96.06 MiB | Pass |
| 11 | 1,567 | 26.12/s | 100% | 0% | 32 ms | 16 ms | 12.64% | 92.36 / 92.91 MiB | Pass |

All eleven complete steady-state minutes passed every reviewed HTTP, business, end-to-end p95, and transaction p95 criterion. The highest passing one-minute complete-flow rate was **26.23 flows/s** in minute 9. This is the maximum observed stable complete-flow rate for this run and workload, not a universal maximum RPS or hardware capacity ceiling.

## 5. Resource evidence and memory interpretation

The resource CSV contains 698 timestamped rows after its header. Backend and load-generator metrics are separate.

| Process/interval | CPU average | CPU peak | RSS average | RSS peak |
| --- | ---: | ---: | ---: | ---: |
| Backend, whole run | 12.01% | 23.2% | 99.73 MiB | 188.84 MiB |
| JMeter JVM, whole run | 3.44% | 189.7% | 598.20 MiB | 810.61 MiB |

Backend RSS began at 63.16 MiB, peaked at 188.84 MiB during the early steady windows, and the final resource sample was 79.53 MiB. It fell sharply after the early peak, so that peak is not a sustained plateau.

Across the final five complete steady-state minutes, backend RSS averaged 82.91 MiB, began at 67.53 MiB, ended at 92.91 MiB, peaked at 96.06 MiB, and had a linear slope of **+5.99 MiB/minute**. Because the reviewed contract contains no numeric plateau tolerance and this tail slope is positive, a memory plateau or safe memory ceiling is **not** claimed. The defensible concrete number is the maximum observed backend RSS of **188.84 MiB** on this machine and run; longer or repeated observation is required for a memory ceiling.

The JMeter JVM CPU peak is load-generator activity on a multicore macOS host and is not SUT CPU.

## 6. Verdict and scope

The measured 60-thread Endurance run passed all reviewed functional, HTTP-error, business-success, and latency criteria overall and in every complete steady-state minute. It left no residual non-canceled order, and the backend remained alive and ready after JMeter.

For this exact Scenario C configuration, the run supports:

- maximum observed stable complete-flow rate: **26.23 flows/s**;
- maximum observed backend RSS: **188.84 MiB**;
- no observed functional or reviewed latency degradation during twelve minutes.

It does not establish a global maximum RPS, a capacity ceiling, a stable memory plateau, or absence of a longer-term memory issue.

Human Review:
- Status: Pending human review of measured Endurance results
- Accepted: Final Endurance tree and authorization to execute the measured run
- Modified:
- Removed:
- Added:
- Notes:
