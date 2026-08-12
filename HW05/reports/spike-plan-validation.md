# Scenario C Spike Plan Validation

## Status

The human-confirmed Phase 4 JMX was generated at `tests/23127194_Spike_20260812.jmx`. Structural and functional validation passed. No measured Spike execution, HTML Spike report, resource-recovery result, or production-like performance conclusion is claimed here.

## Final plan checks

| Check | Result |
| --- | --- |
| Exact filename | Pass: `23127194_Spike_20260812.jmx` |
| Standard Thread Groups | Pass: three serialized groups named Baseline, Spike, and Recovery |
| Functional parity | Pass: 9 HTTP samplers per stage; every HTTP request, correlation processor, and paired assertion tree matches the validated Load plan |
| Runtime configuration | Pass: all ten `spike.*` values are required without numeric defaults |
| CSV isolation | Pass: one independent non-recycled, stop-on-EOF CSV Data Set per serialized stage; measured execution requires at least 80 rows |
| Listener allocation | Pass: Response Time Graph enabled; View Results Tree disabled |
| XML and whitespace | Pass |
| Final JMX SHA-256 | `6f451d52364f87c4cca719d96a3f90047bd1cbe7180183c221ea7cafd174f827` |

The official validator self-test and final-plan invocation both passed. The validator was strengthened to compare the actual sampler and paired assertion XML of every stage directly against `tests/23127194_Load_20260812.jmx`, rather than relying only on sampler counts.

## Validation-only dry run

The dry run used a clean local backend reset, four freshly provisioned accounts, and reduced validation overrides: Baseline 2 VUs/4 seconds, Spike 4 VUs/5 seconds, Recovery 2 VUs/4 seconds, one-second ramps, and 50 ms think-time. These values are not the accepted measured workload and must not be reused as Phase 4 performance results.

| Evidence | Observed validation result |
| --- | --- |
| Raw JTL | `results/raw/validation/23127194_Spike_20260812_dry-run.jtl` |
| Raw JTL SHA-256 | `f5e40c0a2ca5fa9f8b36c310ca7de4421e1b1b3e4b39b55eb16ebcfa6741ebb6` |
| Complete Scenario C flows | 67/67 passed: Baseline 14, Spike 38, Recovery 15 |
| HTTP requests | 603/603 passed; every flow completed all nine requests |
| Entire JTL | 1,014/1,014 rows successful, including transaction parents and setup/deadline samples |
| Post-run order state | 67 canceled, 0 non-canceled |

The first readiness probe occurred before the backend began listening and was retried successfully; it did not create a JMeter sample. A final database query initially used the wrong filename (`eshop.db`); the correct `database.sqlite` query then verified the order state above. No raw JTL was altered.

## Remaining gate

The tester must visually review the generated JMeter tree before authorizing measured Spike traffic. The measured run must reset the backend again, provision at least 80 accounts, use the confirmed 10→80→10 workload, and capture raw JTL, HTML, timestamped resource samples, environment identity, stage metrics, recovery windows, and final order state under one run identity.
