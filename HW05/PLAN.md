# HW05 completion plan — k6 + Grafana

## 1. Fixed scope

Student ID: `23127194`

| Scenario | Endpoint group | SUT target | Reason for pairing | Primary report view |
| --- | --- | --- | --- | --- |
| Load | Read-heavy | `GET /api/products/:id` | Stable, repeatable reads model normal browsing and expose latency/throughput without mutating state. | k6 Web Dashboard HTML |
| Stress | Auth-heavy | `POST /api/login` | Increasing VUs can identify the authentication breakpoint; valid dedicated accounts avoid contaminating results with lockout. | Grafana time-series dashboard |
| Spike | Transactional | `POST /api/checkout` | A sudden flash-sale surge stresses concurrent SQLite writes and recovery behavior. | k6 end-of-test summary |

This mapping covers all three groups exactly once. The account-lockout behavior is verified in a separate controlled preflight; invalid-login traffic is not mixed into the measured Stress workload.

## 2. Definition of done

- Three date-compliant, data-driven k6 plans and three independent CSV files.
- One short dry-run and one evidence run per scenario, with raw k6 output and a distinct report view.
- Tool plus backend resource monitor screenshots for every evidence run.
- Hardware screenshot and matching spec table.
- One 10–15 minute soak run with a defensible maximum stable RPS and memory ceiling.
- AI analysis whose numbers are checked against raw logs; every identified misread has the correct raw value.
- Optimization proposals classified using inspected backend/SQLite code.
- Continuous-testing flow chart with p95 regression gate, cost, and false-alarm trade-offs.
- Six-minute-or-longer unlisted YouTube demo with Vietnamese narration and the tool/resource monitor in the same frame.
- Complete AI audit, 200–300 word critique, Markdown/PDF reports, README summary, Git log, skill, and final zip.

## 3. Execution sequence

### Phase A — design and baseline (about 2 hours)

1. Confirm no teammate duplicates the selected endpoint/workflow.
2. Inspect `server.js`, database schema, seed data, and API responses.
3. Replace sample CSV rows with isolated real test data.
4. Define hypotheses and initial thresholds; mark them provisional until baseline results exist.
5. Run one-VU smoke checks and correct assertions/data before load generation.
6. Save AI prompts and outputs immediately in `audit/ai-audit-report.md`.

### Phase B — calibration and evidence runs (about 3 hours)

1. Run Load at low/medium/target VUs; export Web Dashboard HTML and raw JSON.
2. Run Stress in increasing stages until p95/error/resource stability fails; inspect Grafana by scenario tag.
3. Run Spike from baseline to peak and back; verify recovery, dropped iterations, HTTP errors, and order creation.
4. Capture the k6 tool and backend resource monitor in the same frame for each final run.
5. If login lockout occurs, stop; use dedicated accounts, wait for the configured lock interval or reset only test-account lock fields, record the exact procedure, then rerun.

### Phase C — endurance threshold (about 1 hour elapsed, 30 minutes active)

1. Choose a sustained rate just below the first Stress breakpoint.
2. Run 10–15 minutes while tracking p95, RPS, error rate, dropped iterations, CPU, and RSS memory.
3. Call the load stable only if thresholds hold throughout the steady window and memory does not show unbounded growth.
4. Report the threshold as: workload + stable RPS + p95 + error rate + peak/ceiling memory + CPU + hardware.

### Phase D — analysis and critique (about 2 hours)

1. Give AI the raw artifacts and scenario definitions, not only screenshots or summaries.
2. Record its analysis unchanged, then validate every claimed value against raw data.
3. Build a misinterpretation table: AI claim, exact raw value, why wrong, corrected conclusion.
4. Inspect source before classifying indexes, connection pooling, WAL, caching, and concurrency recommendations.
5. Write the mandatory 200–300 word critique last, based on actual disagreements.

### Phase E — continuous model, demo, packaging (about 2 hours)

1. Finish the commit-watching p95 regression proposal and Mermaid flow chart.
2. Record at least six minutes of Vietnamese narration: scope, data, three runs, Grafana/resources, raw analysis, human correction, skill demo.
3. Export Markdown documents to PDF and visually check every page.
4. Generate `git-commit-log.txt`; run the artifact verifier; create the required zip filename.

## 4. Calibration rules

- Initial values in the plans are starting points, not claimed realistic limits.
- Increase one variable at a time and keep hardware, dataset, backend build, and background processes fixed.
- Exclude `setup` traffic from scenario conclusions by tags and time range.
- Use p95 with sample count and error rate; never judge using average latency alone.
- For `constant-arrival-rate`, treat `dropped_iterations` as unmet offered load.
- A Stress breakpoint is the first sustained stage where an agreed SLO or resource ceiling fails, not simply the highest attempted VU count.
- A Spike recovery claim requires metrics to return below the defined baseline tolerance within the recovery window.

## 5. Required commit sequence

1. `docs(hw05): map requirements and select endpoint groups`
2. `test(hw05): add read-heavy load plan and data`
3. `test(hw05): add auth-heavy stress plan and data`
4. `test(hw05): add checkout spike plan and data`
5. `test(hw05): add endurance run and execution evidence`
6. `docs(hw05): add AI analysis and human corrections`
7. `docs(hw05): add continuous performance proposal`
8. `feat(hw05): add reusable k6 performance skill`
9. `docs(hw05): finalize audit critique video and submission`

Do not commit generated raw evidence before checking that it contains no reusable secrets or tokens.

## 6. Known risks to address

- The current backend increments failed login attempts by `2` and locks for `180000 ms`, which conflicts with the stated +1 and 30-second rule. Treat this as a functional defect and isolate it from performance measurements.
- The SUT `run_servers.sh` is machine-specific and calls `killall node`; do not use it for evidence runs. Start only `backend/server.js` from its actual directory.
- SQLite write serialization may dominate checkout Spike behavior; avoid presenting a local single-process result as a general production capacity claim.
- Existing k6 scripts combine multiple endpoint groups and are therefore unsuitable as the three final HW05 plans without refactoring.
- The exact Grafana output transport is not yet captured in the repository. Set and document `GRAFANA_OUTPUT` for the locally installed stack before the Stress evidence run.
- The existing `database.sqlite` is modified. Back up or use a disposable test database before high-volume checkout runs.
- Checkout currently trusts client-supplied `total_amount`; if reproduced, report this functional/security defect separately from the Spike capacity result.
