# Scenario C Stress Test Design

## Objective

Find the first observed concurrency band where Scenario C no longer satisfies the Load-derived degradation signals. Preserve the same login, product reads, cart, checkout, correlated order read, cancellation, and history verification flow.

## Evidence-derived workload

The measured Load run completed 292/292 flows with 0% HTTP errors and an end-to-end p95 of 38.35 ms at 10 VUs. Phase 3 therefore increases concurrency to eight times that level:

| Parameter | Stress value | Rationale |
| --- | ---: | --- |
| Maximum threads | 80 | Search materially above the accepted 10-VU Load point without claiming an unmeasured capacity |
| Ramp-up | 240 seconds | Add approximately 20 threads per minute for progressive observation |
| Flow-start deadline | 300 seconds | Observe approximately 60 seconds after all 80 threads have started |
| Think-time | 250 ms | Increase pressure relative to the 500 ms Load pacing while retaining user-action pacing |
| Listener | Aggregate Report | Distinct from Load's Summary Report |

The active-thread bands are 1-20, 21-40, 41-60, and 61-80. Analysis must use the JTL `allThreads` field rather than assuming scheduled concurrency.

## Degradation signals

- HTTP error rate greater than 1%.
- Business success lower than 99%.
- End-to-end p95 greater than 250 ms.
- Any transaction p95 greater than 100 ms.
- A non-canceled residual order after graceful completion.
- Resource saturation only when traceable to valid resource-monitor samples.

If no band breaches, report that no breakpoint was observed up to 80 active threads. Do not extrapolate beyond the measured maximum.

## Evidence boundary

The Stress plan and workload are AI-designed from the real Load result and authorized by the tester's request to execute Phase 3. Raw JTL, HTML report, resource CSV, environment file, and order-state file must use the Stress run identity and must not overwrite Phase 2 evidence.

Human Review:
- Status: Pending human review of Phase 3 design and measured results
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:
