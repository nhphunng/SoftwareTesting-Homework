# Execution Evidence

Store only real, attributable evidence:

```text
evidence/
├── screenshots/
│   ├── load/
│   ├── stress/
│   ├── spike/
│   ├── endurance/
│   └── rejected/
├── hardware/
└── video/
```

For each measured run, capture JMeter and the backend resource monitor in the same frame. Hardware evidence must show the real machine/hostname and match previous homework deployments. Record the unlisted YouTube link only after the tester uploads a video with their own Vietnamese narration.

Recording guides:

- `phase-2-recording-script.md`: Load test narration and screenshots.
- `phase-3-recording-script.md`: progressive Stress test, resource monitoring, and breakpoint evidence.
- `phase-4-recording-script.md`: three-stage Spike/recovery narration, live resource evidence, recovery-window interpretation, and screenshot checklist.
- `phase-5-recording-script.md`: 12-minute Endurance narration, live sustained-load/resource evidence, steady-window and memory-trend interpretation, and screenshot checklist.
- `screenshot-requirements-review.md`: mapping of the three tester-provided images to Load, Stress, and Spike plus the remaining rubric evidence.

Measured Spike evidence:

- `spike/23127194_Spike_20260812-environment.txt`
- `spike/23127194_Spike_20260812-resources.csv`
- `spike/23127194_Spike_20260812-order-state.txt`

Measured Endurance evidence:

- `endurance/23127194_Endurance_20260812-environment.txt`
- `endurance/23127194_Endurance_20260812-resources.csv`
- `endurance/23127194_Endurance_20260812-order-state.txt`

Measured Run 01 dashboard screenshots created from the real JMeter HTML report:

- `screenshots/spike/09-spike-dashboard-overview.jpg`
- `screenshots/spike/10-spike-statistics.jpg`
- `screenshots/spike/11-active-threads-over-time.jpg`
- `screenshots/spike/12-spike-response-times-over-time.jpg`

Tester-captured distinct listener/report evidence loaded from the corresponding Run02 JTL:

- `screenshots/load/01-load-summary-report-tree.png`
- `screenshots/stress/01-stress-aggregate-report-tree.png`
- `screenshots/spike/01-spike-response-time-graph-tree.png`

These three images establish the distinct enabled listener/report allocation. The separate live-run screenshots listed below show the testing tool and backend resource monitor in the same frame.

Tester-captured live execution and backend resource-monitor evidence:

- `screenshots/load/06-running-load-and-resource-monitor.png`
- `screenshots/stress/06-running-stress-and-resource-monitor.png`
- `screenshots/spike/06-running-spike-and-resource-monitor.png`

All three show the relevant JMeter plan or non-GUI execution together with monitoring of the backend `node` process. The Load image shows backend CPU at 0% at capture time, so a busier mid-load frame would be stronger but is not substituted or fabricated here.

Hardware evidence:

- `hardware/01-hardware-report-with-hostname.png`

The hardware image shows hostname `Phi-Hero.local`, computer name `Phi Hero`, model `MacBookPro18,1`, Apple M1 Pro, 10 cores, 16 GB RAM, and macOS 26.3. It satisfies the assignment's hardware/hostname evidence requirement. Serial-number and UUID fields remain visible, so redact those identifiers before public upload while preserving the hostname and specification lines.

Phase 5 screenshots are planned under `screenshots/endurance/`. No Endurance screenshot is currently claimed as captured; the tester must capture the JMeter tree, visible measured run, dashboard, analysis, resource trend, and business-state evidence listed in `phase-5-recording-script.md`.

The three live-run images and hostname-bearing hardware report are now present as filesystem artifacts under their normalized names above. They are separate from the listener/report screenshots. See `screenshot-requirements-review.md` for attribution, quality notes, and the remaining privacy-redaction recommendation.
