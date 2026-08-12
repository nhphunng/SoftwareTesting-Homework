# Scenario C Final Load Plan Validation

## 1. Result

**Status: Final JMX generated and structurally/functionally validated. Measured Load execution has not been run.**

| Item | Result |
| --- | --- |
| Final plan | `tests/23127194_Load_20260812.jmx` |
| JMX SHA-256 | `ffb7442c9bba6efe7b5c8c221832981cbaf01bb91f4d5db532440182173fd4ed` |
| JMeter | Apache JMeter 5.6.3 on Java 24 |
| Skill structural validator | Passed |
| XML parse and whitespace checks | Passed |
| Required-property negative test | Passed; missing `-Jload.threads` failed before measured traffic with an explicit message |
| Final one-thread dry run | Passed |
| GUI launch | Plan opened in JMeter GUI; automated accessibility could not attach to the Java app, so tester visual confirmation remains pending |

## 2. Implemented human-confirmed contract

The plan requires runtime properties and contains no hidden workload defaults:

```text
-Jload.threads=10
-Jload.ramp_up_seconds=20
-Jload.duration_seconds=140
-Jload.think_time_ms=500
```

The setup gate validates that all four values are present and valid and that `data/scenario-c.local.csv` has at least `load.threads` rows. The CSV is read once for each thread, with `recycle=false`, `stopThread=true`, and all-thread sharing. Each thread then reuses its own assigned account for complete Scenario C flows until the reviewed deadline.

At the deadline, the While Controller starts no new flow and lets an active flow finish. This implements the confirmed zero-second staged ramp-down without leaving a checkout order pending. The Load-specific `Summary Report` listener is enabled; `View Results Tree` is present but disabled.

The reviewed post-run acceptance criteria are recorded in the plan:

- HTTP error rate <= 1.0%.
- Business-flow success >= 99.0%.
- End-to-end p95 <= 250 ms.
- Each transaction p95 <= 100 ms.

These aggregate criteria must be evaluated from the untouched measured JTL and HTML report after execution. The JMX assertions enforce HTTP and business correctness during each flow.

## 3. Final dry-run evidence

The final dry run used validation-only overrides:

```text
load.threads=1
load.ramp_up_seconds=1
load.duration_seconds=8
load.think_time_ms=100
```

It is functional validation, not Load evidence.

| Check | Result |
| --- | --- |
| Raw validation file | `results/raw/validation/23127194_Load_20260812_dry-run.jtl` |
| Raw JTL SHA-256 | `6141881d6cb7e291a003e81b6c0a2d111b1e8d670c90792673bbdd98fada45b4` |
| Setup validation samples | 1 passed |
| Complete end-to-end flows | 8 passed |
| HTTP samples | 72/72 returned HTTP 200 |
| JTL failures | 0/121 |
| Transaction reporting | 8 samples for each of auth, reads, cart, checkout, order lifecycle, and end-to-end labels |
| Database verification | 8 total orders; 8 `canceled`; 0 non-canceled |

## 4. Defects found and corrected during validation

All failed validation attempts are preserved under `results/raw/validation/` and excluded from final evidence:

1. `attempt-01-setup-groovy-compatibility.jtl`: Groovy setup validation could not compile an exception path on Java 24. The setup gate was changed to BeanShell; business assertions remain Groovy and had already executed successfully.
2. `attempt-02-setup-beanshell-null.jtl`: BeanShell treated a null-initialized message variable as undefined. The gate now uses a non-null empty string and fails clearly.
3. `attempt-03-scheduler-interrupted-flow.jtl`: scheduler expiry interrupted the last flow after checkout, leaving one order `pending`. Deadline-controlled flow start replaced mid-iteration scheduler termination.
4. `attempt-04-nested-summary-limited.jtl`: functional flow passed, but parent-sample nesting limited the top-level Summary Report view. Transaction Controllers now generate additional samples, preserving all stable group labels in Summary Report and raw JTL.

No attempt file is a measured Load result.

## 5. Remaining human action

- [ ] Open the final plan in JMeter GUI and visually confirm the tree and reviewed values.
- [ ] Commit the reviewed plan and reports.
- [ ] Before measured execution, reset the backend and provision at least 10 users.
- [ ] Capture JMeter and backend resource monitor in the same frame.
- [ ] Execute with the human-confirmed properties, untouched raw JTL, and a clean HTML report directory.

Human Review:
- Status: Pending human review of generated JMX
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:
