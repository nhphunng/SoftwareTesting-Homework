# Scenario C Endurance Contract

## Fixed identity and measured basis

| Item | Value |
| --- | --- |
| Plan | `HW05/tests/23127194_Endurance_20260812.jmx` |
| Functional source | Load Scenario C nine-request flow and paired assertions |
| Load reference | 10 VUs; 2.09 complete flows/s; E2E p95 38.35 ms; 0% errors |
| Stress reference | No breakpoint through 80 active threads; 61-80 band E2E p95 26 ms; 0% errors |
| Spike reference | 80-thread spike passed; application recovery at 10 s; backend RSS did not return to pre-spike range |
| Duration rule | Approximately 10-15 minutes, excluding only setup/provisioning |

Because no Stress breakpoint was observed, describe 80 as the highest tested concurrency rather than a breakpoint or capacity ceiling. Select the sustained Endurance load below 80 unless new reviewed evidence justifies a different bound.

## Starting proposal

The following values are a design starting point, not an approved workload:

| Parameter | Candidate | Rationale |
| --- | ---: | --- |
| Threads | 60 | Sustains 75% of the highest tested concurrency and stays below 80 |
| Ramp-up | 30 seconds | Avoids treating startup as steady state while remaining short relative to the run |
| Duration | 720 seconds | Twelve minutes, within the required 10-15 minute range |
| Think-time | 250 ms | Matches the measured Stress/Spike pacing |
| Resource interval | 1 second | Supports per-minute and tail-trend analysis |
| Analysis window | 60 seconds | Exposes time-dependent degradation without overclaiming per-sample precision |
| GUI listeners | Disabled | Limits load-generator memory distortion; use raw JTL and generated HTML |

Label the entire table `Proposed - pending human review` whenever presenting it. Require tester confirmation or modification before generation.

## Candidate acceptance signals

These are proposed until the tester reviews them:

- HTTP error rate <= 1% overall and in every complete steady-state minute.
- Business success >= 99% overall and in every complete steady-state minute.
- End-to-end p95 <= 250 ms overall and per complete steady-state minute.
- Every transaction p95 <= 100 ms overall and per complete steady-state minute.
- Zero residual non-canceled orders after graceful completion.
- No backend crash, restart, or loss of readiness.
- Resource CSV contains timestamped backend and JMeter samples across the entire measured interval.
- Memory stability must use a tester-approved tail-window slope or plateau rule; until confirmed, report RSS average, peak, start/end, and slope descriptively without a pass/fail memory-ceiling claim.

## Threshold interpretation

A single Endurance run can establish:

- the maximum complete-flow RPS observed while all reviewed stability signals passed;
- the maximum backend RSS observed on the recorded machine;
- whether RSS plateaued or continued trending over the observed duration.

It cannot establish a universal maximum RPS, a safe hardware memory ceiling, or absence of a memory leak beyond the measured duration. If throughput varies, do not use raw HTTP samples/s as business-flow RPS; report both with explicit labels.

## Run isolation

- Reset backend and provision at least the approved thread count before the run.
- Keep registration outside the measured JTL.
- Use a new suffix for repeat runs and refuse artifact overwrite.
- Keep raw JTL untouched and calculate time windows from its timestamps.
- Record backend and JMeter resources separately; macOS process CPU may exceed 100% on multicore systems.
