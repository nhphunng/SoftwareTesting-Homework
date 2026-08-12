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
│   └── spike/
└── summary/
    ├── load/
    ├── stress/
    ├── spike/
    └── endurance/
```

Do not add placeholder `.jtl`, JSON, CSV, HTML, screenshots, or metric files. Raw output must be written by the selected testing tool and retained unchanged.

## Completed Load run

- Raw JTL: `raw/load/23127194_Load_20260812.jtl`
- JMeter log: `raw/load/23127194_Load_20260812.jmeter.log`
- HTML dashboard: `html/load/23127194_Load_20260812/`
- Analysis and checksum: `../reports/load-test-results.md`

The measured Load run passed its reviewed latency, error-rate, and business-success thresholds. Its resource sampler produced no rows, so no CPU/RSS value from that run is accepted as evidence.

## Completed Spike run

- Raw JTL: `raw/spike/23127194_Spike_20260812.jtl`
- JMeter log: `raw/spike/23127194_Spike_20260812.jmeter.log`
- HTML dashboard: `html/spike/23127194_Spike_20260812/`
- Analysis and checksums: `../reports/spike-test-results.md`

The measured Spike run passed the reviewed functional, latency, and application-recovery criteria. Its timestamped resource evidence supports CPU recovery, while backend RSS remained above its pre-spike range during the short Recovery stage.
