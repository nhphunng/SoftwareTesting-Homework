# Scenario C Measured Load Results

## 1. Run identity

| Field | Value |
| --- | --- |
| Classification | Measured Phase 2 Load execution |
| Tester GUI approval | Confirmed before execution on 2026-08-12 |
| Start | 2026-08-12T17:06:48.416+07:00 |
| End | 2026-08-12T17:09:12.805+07:00 |
| Plan | `tests/23127194_Load_20260812.jmx` |
| Plan SHA-256 | `ffb7442c9bba6efe7b5c8c221832981cbaf01bb91f4d5db532440182173fd4ed` |
| Run selection | `Run02`, selected by the tester as the independent official Load evidence set for Phase 6 |
| Raw JTL | `results/raw/load/23127194_Load_20260812_Run02.jtl` |
| Raw JTL SHA-256 | `93339257e0a408a5d591820ac11e591736f2ed40d69abe7a7e2db0fad8ac67b5` |
| HTML dashboard | `results/html/load/23127194_Load_20260812_Run02/` |
| Workload | 10 VUs; 20 s ramp-up; 140 s flow-start deadline; 500 ms think-time |

The backend was reset and 10 unique accounts were provisioned before JMeter started. Registration and provisioning are not present in the measured JTL.

## 2. Integrity checks

| Check | Measured result |
| --- | ---: |
| Complete Scenario C flows | 291 |
| Successful business flows | 291 |
| HTTP samples | 2,619 |
| HTTP 200 samples | 2,619 |
| Total JTL rows | 4,366 |
| Failed JTL rows | 0 |
| Orders after execution | 291 |
| Canceled orders | 291 |
| Non-canceled orders | 0 |

The JTL contains the setup gate, nine HTTP samples per flow, and six transaction samples per flow. Raw data was not edited after JMeter generated it.

## 3. Measured metrics

JMeter's generated `statistics.json` supplies p90, p95, and p99. Values below use its p95 field.

| Label | Samples | Errors | Average | p95 | Max | Throughput |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Scenario C End-to-End | 291 | 0 | 35.28 ms | 48 ms | 90 ms | 2.08 flows/s |
| Auth Heavy | 291 | 0 | 4.22 ms | 9 ms | 20 ms | 2.08/s |
| Read Heavy | 291 | 0 | 6.57 ms | 12 ms | 17 ms | 2.09/s |
| Transactional Cart | 291 | 0 | 5.63 ms | 10 ms | 18 ms | 2.09/s |
| Transactional Checkout | 291 | 0 | 5.99 ms | 10 ms | 24 ms | 2.09/s |
| Transactional Order Lifecycle | 291 | 0 | 12.87 ms | 19 ms | 34 ms | 2.09/s |
| JMeter HTTP/setup total | 2,620 | 0 | 3.93 ms | 8 ms | 24 ms | 18.15 samples/s |

## 4. Acceptance verdict

| Criterion | Reviewed threshold | Measured | Verdict |
| --- | ---: | ---: | --- |
| HTTP error rate | <= 1.0% | 0/2,619 = 0% | Pass |
| Business-flow success | >= 99.0% | 291/291 = 100% | Pass |
| End-to-end p95 | <= 250 ms | 48 ms | Pass |
| Every transaction p95 | <= 100 ms | Highest: 19 ms | Pass |

The measured Load run passes every reviewed functional and response-time criterion. This result demonstrates behavior under the reviewed 10-VU workload only; it is not a capacity ceiling.

## 5. Environment and evidence limitation

Environment metadata records macOS 26.3 on arm64, 10 logical CPUs, 16 GiB RAM, Java 24, and JMeter 5.6.3 in `evidence/load/23127194_Load_20260812_Run02-environment.txt`.

The selected Run02 resource file is `evidence/load/23127194_Load_20260812_Run02-resources.csv` (SHA-256 `722b76ebd8cb22a5ede0f88f493bd475610b9e7f68b5e835a4ac7bb492ed7d34`). It contains 140 data rows, but every row has four fields under a five-column header because the backend process statistics were absent and the runner collapsed the JMeter pair leftward. Runner-source inspection allows the last two numeric values to be inferred as JMeter CPU/RSS, but the CPU values are essentially zero and may refer to the open GUI process rather than the CLI load generator. Therefore the file is not accepted as backend CPU/RSS evidence and no Load resource ceiling is claimed. The tester-provided live screenshot is classified separately as visual execution evidence; it does not reconstruct a resource time series.

## 6. Preparation issues excluded from measured evidence

Two pre-execution attempts stopped before JMeter traffic:

1. The sandboxed backend process could not accept localhost connections even though initialization logged successfully.
2. The first unrestricted preparation exposed delayed post-registration login for one user. Provisioning retry was increased from five attempts at 0.2 seconds to twenty attempts at 0.5 seconds while retaining fail-closed behavior.

Neither preparation attempt produced a measured JTL. The successful run provisioned all 10 accounts before JMeter started.

Human Review:
- Status: Measured Run02 results reviewed and approved by tester on 2026-08-14
- Accepted: Independent Run02 JTL, HTML dashboard, environment, order state, measured metrics, threshold verdicts, and the explicit resource-CSV limitation
- Modified:
- Removed:
- Added:
- Notes:
