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
