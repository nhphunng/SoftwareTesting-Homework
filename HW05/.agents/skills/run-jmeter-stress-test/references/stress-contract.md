# Scenario C Stress Contract

## Identity and source

| Item | Value |
| --- | --- |
| Plan | `HW05/tests/23127194_Stress_20260812.jmx` |
| Source flow | `HW05/tests/23127194_Load_20260812.jmx` |
| Listener | Aggregate Report |
| Load reference | 10 VUs; 0% errors; 100% business success; end-to-end p95 38.35 ms |

## Progressive workload

Use a standard Thread Group with 80 maximum threads, 240-second linear ramp-up, 300-second global flow-start deadline, and 250 ms think-time. The ramp adds approximately 20 threads per minute, followed by approximately 60 seconds with all 80 threads started.

Analyze completed flows by recorded `allThreads` bands:

1. 1–20 active threads
2. 21–40 active threads
3. 41–60 active threads
4. 61–80 active threads

This is a controlled search up to eight times the accepted Load concurrency. It does not prove capacity above the largest observed band.

## Degradation signals

- HTTP error rate greater than 1%.
- Business-flow success lower than 99%.
- End-to-end p95 greater than 250 ms.
- Any transaction p95 greater than 100 ms.
- Pending/non-canceled order after graceful completion.
- Sustained CPU or memory saturation only when supported by valid monitoring rows.

Use the first band that breaches a signal as the observed unsustainable band. If none breaches, state that no breakpoint was observed up to 80 threads.
