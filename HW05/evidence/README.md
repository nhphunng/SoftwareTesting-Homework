# Execution Evidence

Store only real, attributable evidence:

```text
evidence/
├── screenshots/
│   ├── load/
│   ├── stress/
│   ├── spike/
│   └── endurance/
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

JMeter-tree, Activity Monitor, provisioning, and live Baseline/Spike/Recovery screenshots must be captured by the tester during a visible run so the tool and backend resource monitor appear in the same frame.

Phase 5 screenshots are planned under `screenshots/endurance/`. No Endurance screenshot is currently claimed as captured; the tester must capture the JMeter tree, visible measured run, dashboard, analysis, resource trend, and business-state evidence listed in `phase-5-recording-script.md`.

The tester supplied three live-run images in chat on 2026-08-14. They were visually classified as Load Run02, Stress Run02, and Spike Run02, but they are not present as filesystem artifacts and therefore are not yet included in repository or ZIP evidence. See `screenshot-requirements-review.md` for target filenames and quality notes. The required hardware-report screenshot remains missing.
