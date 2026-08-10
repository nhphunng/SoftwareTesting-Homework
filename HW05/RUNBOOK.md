# HW05 execution runbook

Run the SUT and observability stack from `eshop-sut-seminar`; keep the versioned test plans and submission evidence under `SoftwareTesting-Homework/HW05`.

## Before the evidence session

1. Record both repository commit hashes and `k6 version` in the audit/report.
2. Make a recoverable copy of the test database outside the evidence folders. Use a database dedicated to performance tests.
3. Replace `REPLACE_ME` rows with isolated accounts. Use enough auth/checkout users to avoid one account becoming an artificial serialization point.
4. Confirm every product ID exists and every checkout user can log in with a one-VU smoke run.
5. Confirm the final plan date in each filename. If the official plan date changes, copy/rename all four plan files consistently and set `RUN_DATE`.
6. Start screen recording only after arranging k6/Grafana and the backend resource monitor in the same visible frame.

## Terminal A — SUT backend

```bash
cd /Users/nguyenhoangphihung/Document/eshop-sut-seminar/backend
node server.js
```

Do not use the repository's current `run_servers.sh`: it contains another machine's absolute path and terminates all Node processes.

## Terminal B — Grafana k6 report path

Repository/process inspection on 2026-08-10 found Grafana k6 v2.0.0 and k6 MCP/skills, but no Grafana server, Prometheus remote-write receiver, InfluxDB, Docker metrics stack, or configured `GRAFANA_OUTPUT`. Therefore do not pass a fabricated external `--out` value.

Use the integrated Grafana k6 Web Dashboard for the Load view through `K6_WEB_DASHBOARD=true` and its HTML export. Stress uses a full textual summary and Spike uses a JSON summary so the three report views remain distinct. If an external Grafana stack is installed later, record its actual output URI and configuration before changing the runner.

## Terminal C — k6 plans and artifacts

```bash
cd /Users/nguyenhoangphihung/Document/ky_3/SoftwareTesting-Homework/HW05
BASE_URL=http://127.0.0.1:3000 ./k6/run-scenario.sh load
BASE_URL=http://127.0.0.1:3000 ./k6/run-scenario.sh stress
BASE_URL=http://127.0.0.1:3000 ./k6/run-scenario.sh spike
BASE_URL=http://127.0.0.1:3000 STABLE_RPS=<CALIBRATED_VALUE> ./k6/run-scenario.sh endurance
```

Run short smoke/calibration variants before these evidence commands by overriding stage/rate environment variables. Do not overwrite final artifacts; use distinct timestamps or preserve each calibration run separately.

## Terminal D — resource evidence

Open Activity Monitor and filter/select the backend Node process. Display CPU and memory columns. Also capture a terminal command that identifies the exact PID so the report can prove the monitored process is the backend.

## Lockout recovery

Measured Stress traffic must use correct passwords. If a test account is locked during preflight:

1. Stop the run and record the response/status and time.
2. Prefer waiting for the actual implemented lock interval.
3. If time requires a database reset, change only the dedicated test accounts' `login_attempts` and `locked_until` fields after making a database copy; record the exact query and before/after rows.
4. Re-run the one-VU smoke check before restarting Stress.

## After every run

1. Record start/end time, command, plan hash, CSV hash, SUT commit, and database state.
2. Check raw output is non-empty and includes the intended scenario/endpoint tags.
3. Export/capture the designated report view with the correct time range.
4. Write observations before asking AI to analyse the result.
5. Never edit raw output. If a run is invalid, keep it under a clearly named calibration/invalid folder and explain why.
