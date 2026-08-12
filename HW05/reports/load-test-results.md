# Scenario C Measured Load Results

## 1. Run identity

| Field | Value |
| --- | --- |
| Classification | Measured Phase 2 Load execution |
| Tester GUI approval | Confirmed before execution on 2026-08-12 |
| Start | 2026-08-12T13:56:18+07:00 |
| End | 2026-08-12T13:58:42+07:00 |
| Plan | `tests/23127194_Load_20260812.jmx` |
| Plan SHA-256 | `ffb7442c9bba6efe7b5c8c221832981cbaf01bb91f4d5db532440182173fd4ed` |
| Raw JTL | `results/raw/load/23127194_Load_20260812.jtl` |
| Raw JTL SHA-256 | `85bfb17b1fbc384cb8f2f00836ede96883c59030ba56e246cf103e8fe6ff8014` |
| HTML dashboard | `results/html/load/23127194_Load_20260812/` |
| Workload | 10 VUs; 20 s ramp-up; 140 s flow-start deadline; 500 ms think-time |

The backend was reset and 10 unique accounts were provisioned before JMeter started. Registration and provisioning are not present in the measured JTL.

## 2. Integrity checks

| Check | Measured result |
| --- | ---: |
| Complete Scenario C flows | 292 |
| Successful business flows | 292 |
| HTTP samples | 2,628 |
| HTTP 200 samples | 2,628 |
| Total JTL rows | 4,381 |
| Failed JTL rows | 0 |
| Orders after execution | 292 |
| Canceled orders | 292 |
| Non-canceled orders | 0 |

The JTL contains the setup gate, nine HTTP samples per flow, and six transaction samples per flow. Raw data was not edited after JMeter generated it.

## 3. Measured metrics

JMeter's generated `statistics.json` supplies p90, p95, and p99. Values below use its p95 field.

| Label | Samples | Errors | Average | p95 | Max | Throughput |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Scenario C End-to-End | 292 | 0 | 27.38 ms | 38.35 ms | 75 ms | 2.09 flows/s |
| Auth Heavy | 292 | 0 | 2.93 ms | 5 ms | 18 ms | 2.09/s |
| Read Heavy | 292 | 0 | 4.96 ms | 9 ms | 13 ms | 2.09/s |
| Transactional Cart | 292 | 0 | 4.20 ms | 8 ms | 17 ms | 2.09/s |
| Transactional Checkout | 292 | 0 | 5.03 ms | 10 ms | 61 ms | 2.10/s |
| Transactional Order Lifecycle | 292 | 0 | 10.26 ms | 16 ms | 23 ms | 2.10/s |
| JMeter HTTP/setup total | 2,629 | 0 | 3.05 ms | 7 ms | 61 ms | 18.19 samples/s |

## 4. Acceptance verdict

| Criterion | Reviewed threshold | Measured | Verdict |
| --- | ---: | ---: | --- |
| HTTP error rate | <= 1.0% | 0/2,628 = 0% | Pass |
| Business-flow success | >= 99.0% | 292/292 = 100% | Pass |
| End-to-end p95 | <= 250 ms | 38.35 ms | Pass |
| Every transaction p95 | <= 100 ms | Highest: 16 ms | Pass |

The measured Load run passes every reviewed functional and response-time criterion. This result demonstrates behavior under the reviewed 10-VU workload only; it is not a capacity ceiling.

## 5. Environment and evidence limitation

Environment metadata records macOS 26.3 on arm64, 10 logical CPUs, 16 GiB RAM, Java 24, and JMeter 5.6.3 in `evidence/load/23127194_Load_20260812-environment.txt`.

The automated resource monitor file `evidence/load/23127194_Load_20260812-resources.csv` contains only its header because the monitor process exited before collecting samples. It is not valid CPU or memory evidence, and no utilization or resource ceiling is claimed. The monitoring loop was corrected for future runs, but this raw run was not overwritten or relabeled.

## 6. Preparation issues excluded from measured evidence

Two pre-execution attempts stopped before JMeter traffic:

1. The sandboxed backend process could not accept localhost connections even though initialization logged successfully.
2. The first unrestricted preparation exposed delayed post-registration login for one user. Provisioning retry was increased from five attempts at 0.2 seconds to twenty attempts at 0.5 seconds while retaining fail-closed behavior.

Neither preparation attempt produced a measured JTL. The successful run provisioned all 10 accounts before JMeter started.

Human Review:
- Status: Pending human review of measured results
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:
