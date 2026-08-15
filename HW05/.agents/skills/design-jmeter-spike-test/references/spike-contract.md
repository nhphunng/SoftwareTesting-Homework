# Scenario C Spike Contract

## Fixed identity

| Item | Value |
| --- | --- |
| Plan | `HW05/tests/23127194_Spike_20260812.jmx` |
| Functional source | Load/Stress Scenario C nine-request flow |
| Load reference | 10 VUs; end-to-end p95 38.35 ms; 0% errors |
| Stress reference | No breakpoint through 80 threads; band 61-80 p95 26 ms; 0% errors |
| Candidate listener | Response Time Graph, pending tester confirmation |

## Candidate stage model

The following is a starting proposal, not an approved workload:

| Stage | Candidate concurrency | Candidate duration | Purpose |
| --- | ---: | ---: | --- |
| Baseline | 10 threads | 30 seconds | Establish immediate pre-spike behavior |
| Spike | 80 threads | 60 seconds | Sudden jump to the highest concurrency already shown sustainable by Stress |
| Recovery | 10 threads | 30 seconds | Observe return to the pre-spike workload |
| Transition | 1 second or less | N/A | Make the rise/fall abrupt rather than a stress ramp |
| Think-time | 250 ms | All stages | Match Stress pacing for comparison |

Require human confirmation or modification before generation. Because Stress found no breakpoint at 80 threads, this candidate tests recovery from a sudden but previously sustainable level; it does not promise a failure spike.

## Stage acceptance signals

- HTTP error rate <= 1%.
- Business success >= 99%.
- End-to-end p95 <= 250 ms.
- Each transaction p95 <= 100 ms.
- Recovery end-to-end p95 returns within an approved multiplier of the pre-spike baseline.
- No residual non-canceled order after graceful completion.
- Resource recovery is claimed only from valid timestamped samples.

## Isolation rule

For sequential stages, the same provisioned pool may be reused after the previous stage fully stops. For overlapping stages, assign disjoint CSV ranges so no account is active in two Thread Groups concurrently. Record stage identity in sampler/thread names so raw JTL rows can be separated deterministically.
