# Bug and Performance Issue Report

## Summary

| Item | Result |
| --- | --- |
| Genuine functional bugs filed | 0 |
| Genuine performance issues filed | 0 |
| GitHub Issue URLs | None |
| Issue screenshots | None required because no reproducible issue was filed |

All approved Load, Stress, Spike, and Endurance JTL rows passed their HTTP and business assertions. Therefore no GitHub issue or issue screenshot is fabricated for this submission.

## Observations that are not filed defects

- Stress did not reach a breakpoint through the maximum tested 80 active threads. This limits the capacity conclusion but is not a failure.
- Spike end-to-end latency and CPU recovered, while RSS did not return to its pre-spike range during the short Recovery stage. The evidence is insufficient to classify this as a leak.
- Endurance backend RSS peaked at 188.84 MiB and the final-five-minute slope remained positive. A longer repeated soak is required before declaring a memory issue or ceiling.
- Load Run02 resource rows do not match the declared CSV header and cannot support backend CPU/RSS claims. This is an evidence-quality limitation, not a demonstrated SUT defect.

If a future run produces a reproducible failure, create a GitHub issue containing the exact plan/run identity, environment, reproduction steps, expected and actual results, raw metric source, severity, and screenshot before adding it to this report.
