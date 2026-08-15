# Runtime Results

Create these paths only when real runs exist:

```text
results/
├── raw/
│   ├── load/
│   ├── stress/
│   ├── spike/
│   └── endurance/
├── html/
│   ├── load/
│   ├── stress/
│   ├── spike/
│   └── endurance/
└── summary/
    ├── load/
    ├── stress/
    ├── spike/
    └── endurance/
```

Do not add placeholder `.jtl`, JSON, CSV, HTML, screenshots, or metric files. Raw output must be written by the selected testing tool and retained unchanged.

## Completed Load run

- Phase 6 identity: independent `Run02` set selected by the tester
- Raw JTL: `raw/load/23127194_Load_20260812_Run02.jtl`
- JMeter log: `raw/load/23127194_Load_20260812_Run02.jmeter.log`
- HTML dashboard: `html/load/23127194_Load_20260812_Run02/`
- Analysis and checksum: `../reports/load-test-results.md`

The selected Load Run02 passed its reviewed latency, error-rate, and business-success thresholds. Its resource CSV has 140 malformed four-field rows under a five-column header and contains no attributable backend CPU/RSS, so no Load backend resource claim is accepted.

## Completed Stress run

- Raw JTL: `raw/stress/23127194_Stress_20260812.jtl`
- JMeter log: `raw/stress/23127194_Stress_20260812.jmeter.log`
- HTML dashboard: `html/stress/23127194_Stress_20260812/`
- Analysis and checksum: `../reports/stress-test-results.md`

The measured Stress run passed through the maximum tested 80 active threads without a threshold breach. This is not a measured capacity ceiling.

## Completed Spike run

- Raw JTL: `raw/spike/23127194_Spike_20260812.jtl`
- JMeter log: `raw/spike/23127194_Spike_20260812.jmeter.log`
- HTML dashboard: `html/spike/23127194_Spike_20260812/`
- Analysis and checksums: `../reports/spike-test-results.md`

The measured Spike run passed the reviewed functional, latency, and application-recovery criteria. Its timestamped resource evidence supports CPU recovery, while backend RSS remained above its pre-spike range during the short Recovery stage.

## Completed Endurance run

- Raw JTL: `raw/endurance/23127194_Endurance_20260812.jtl`
- JMeter log: `raw/endurance/23127194_Endurance_20260812.jmeter.log`
- Console log: `raw/endurance/23127194_Endurance_20260812.console.log`
- Backend log: `raw/endurance/23127194_Endurance_20260812.backend.log`
- HTML dashboard: `html/endurance/23127194_Endurance_20260812/`
- Deterministic window analysis: `raw/endurance/23127194_Endurance_20260812-analysis.json`
- Analysis and checksums: `../reports/endurance-test-results.md`

The measured 60-thread/12-minute run passed all eleven complete steady-state windows. Maximum observed stable complete-flow rate was 26.23 flows/s and maximum observed backend RSS was 188.84 MiB; neither is a universal capacity ceiling.
