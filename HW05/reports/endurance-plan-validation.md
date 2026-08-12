# Scenario C Endurance Plan Validation

## 1. Final plan identity

| Field | Value |
| --- | --- |
| Plan | `tests/23127194_Endurance_20260812.jmx` |
| SHA-256 | `9c8e988e338935e904bd7b1a8a36ce84ef918a8fbdaba164aedc5fb5d39bac2d` |
| JMeter | 5.6.3 |
| Classification | Structurally validated; measured execution not authorized |

## 2. Structural validation

The Phase 5 validator passed and confirmed:

- exactly one measured Endurance Thread Group;
- exact parity with the Load plan's nine HTTP sampler and paired assertion trees;
- auth-heavy, read-heavy, and transactional coverage;
- JWT and fresh `orderId` correlation;
- non-recycled CSV data with thread stop on exhaustion;
- required `endurance.threads`, `endurance.ramp_up_seconds`, `endurance.duration_seconds`, and `endurance.think_time_ms` properties without numeric fallbacks;
- Summary Report and View Results Tree both disabled;
- no known credential embedded in the JMX.

Validation command:

```bash
python3 .agents/skills/design-jmeter-endurance-test/scripts/validate_endurance_jmx.py \
  tests/23127194_Endurance_20260812.jmx
```

## 3. Validation-only dry run

The dry run used runtime overrides only to check functional behavior:

| Parameter | Validation value |
| --- | ---: |
| Threads | 2 |
| Ramp-up | 1 second |
| Flow-start duration | 8 seconds |
| Think-time | 50 ms |

The backend was reset and two temporary accounts were provisioned before JMeter. Results from the untouched validation JTL:

| Check | Result |
| --- | ---: |
| Complete flows | 30/30 successful |
| HTTP requests | 270/270 successful |
| Total JTL rows | 451 |
| Failed JTL rows | 0 |
| Orders | 30 total, 30 canceled, 0 non-canceled |
| JTL SHA-256 | `a0775dd03a03238bf7f745bcf03c130c1f3de60c24f6cd6c780f86aac497168f` |

Local validation artifacts:

- `results/raw/validation/23127194_Endurance_20260812_dry-run.jtl`
- `results/raw/validation/23127194_Endurance_20260812_dry-run.jmeter.log`

This eight-second run is not Endurance evidence and cannot establish stable RPS, latency trends, resource trends, or a memory ceiling.

## 4. Human gate outcome

The tester visually reviewed and accepted the final tree, then explicitly authorized the measured 60-thread, 720-second execution on 2026-08-12.

Human Review:
- Status: Final Endurance tree visually reviewed and measured execution authorized
- Accepted: Workload proposal, final JMX, validation evidence, final visual tree, and measured execution
- Modified:
- Removed:
- Added:
- Notes: Authorization supplied by `Tôi đã xem qua final tree, bạn hãy measure endurance 12 phút`.
