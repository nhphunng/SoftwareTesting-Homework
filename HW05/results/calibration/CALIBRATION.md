# HW05 k6 calibration — 2026-08-10

Purpose: choose evidence-run VU/RPS values. These runs were executed without the required same-frame resource-monitor recording and therefore are not final evidence.

## Environment confirmation

- Backend: Node process listening on TCP 3000; `GET /api/products` returned HTTP 200.
- Accounts: `admin@eshop.com` and `test@eshop.com` both returned HTTP 200 from `/api/login`; database roles are `admin` and `user`.
- Dataset before calibration: 5 products, 0 orders.
- Database backup: `/Users/nguyenhoangphihung/Document/eshop-sut-seminar/result/calibration/database-before-20260810.sqlite`.
- Database after calibration: 21,687 orders; `PRAGMA integrity_check` returned `ok`.
- k6: Grafana k6 v2.0.0.
- External Grafana output: none found. No Grafana server, Prometheus, InfluxDB, Docker metrics stack, or `GRAFANA_OUTPUT` configuration was present/running.
- Integrated Web Dashboard: k6 recognized `K6_WEB_DASHBOARD=true`; 3-second and 12-second probes were deliberately too short for HTML generation and emitted `report generation was skipped (not enough data)`. Confirm the HTML file during the full seven-minute Load evidence run.

## Smoke results

| Flow | VU | Checks | HTTP failure | p95 |
| --- | ---: | ---: | ---: | ---: |
| FR-05 search | 1 | 100% | 0% | 8.26 ms |
| Login + user profile/admin coupon list | 1 | 100% | 0% | 4.00 ms |
| BIGBUY + checkout | 1 | 100% | 0% | 3.94 ms |

## VU calibration

| Scenario | Load | Aggregate rate | p95 | HTTP failure | Checks | Interpretation |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Load | 25 VU | 13.22 req/s | 5.61 ms | 0% | 100% | Stable |
| Load | 50 VU | 25.38 req/s | 4.38 ms | 0% | 100% | Stable; selected as realistic Load target |
| Load | 100 VU | 50.32 req/s | 3.75 ms | 0% | 100% | Stable |
| Load | 200 VU | 100.78 req/s | 3.758 ms | 0% | 100% | Highest Load VU probe |
| Stress | 50→200→600→1,200 VU | 1,926.30 HTTP req/s | 9.01 ms | 0% | 100% | Login plus role-specific authenticated surface; no breakpoint observed; use as final peak, not claimed capacity |
| Spike | 50 VU peak | 238.55 HTTP req/s | 4.85 ms | 0% | 100% | Stable |
| Spike | 200 VU peak | 886.05 HTTP req/s | 5.17 ms | 0% | 100% | Stable |
| Spike | 400 VU peak | 1,567.63 HTTP req/s | 32.524 ms | 0% | 100% | Stable but latency knee becomes visible; selected peak |

Spike rate counts both coupon and checkout HTTP requests, plus one setup login. The iteration rate at 400 VU was 783.78 checkout workflows/s over the whole ramp/hold/recovery run.

Stress rate counts two HTTP requests per completed workflow: login plus either user profile or admin coupon list. The final calibration completed about 963.15 authenticated workflows/s aggregate. Earlier `stress-*.json` files that do not contain `surfaces` are superseded login-only probes and must not be cited for the final Stress plan.

## Arrival-rate calibration

| Offered RPS | Achieved RPS | p95 | Failed | Dropped | Decision |
| ---: | ---: | ---: | ---: | ---: | --- |
| 100 | 100.09 | 3.20 ms | 0% | 0 | Stable |
| 500 | 500.07 | 1.52 ms | 0% | 0 | Stable |
| 1,000 | 1,000.03 | 1.42 ms | 0% | 0 | Stable |
| 2,000 | 1,999.98 | 0.510 ms | 0% | 0 | Stable |
| 4,000 | 3,999.97 | 0.283 ms | 0% | 0 | Stable; selected 12-minute soak rate |
| 6,000 | 5,999.76 | 0.752 ms | 0% | 0 | Highest zero-drop 10-second probe |
| 7,000 | 6,995.98 | 2.796 ms | 0% | 37 | First repeatable strict-threshold failure |
| 7,500 | 7,428.50 | 20.44 ms | 0% | 711 | Unstable |
| 8,000 | 7,981.72 | 5.49 ms | 0% | 178 | Unstable |
| 10,000 | 9,958.54 | 7.89 ms | 0% | 147 | Unstable |
| 20,000 | 7,292.98 | 52.57 ms | 0% | 49,472 | Saturated; k6 reached 2,000 VUs |
| 40,000 | 7,915.87 | 49.38 ms | 0% | 148,060 | Saturated; k6 reached 2,000 VUs |

The non-monotonic p95 close to saturation is why `dropped_iterations`, achieved rate, and generator limits must be reviewed together. A low p95 does not mean the offered load was served.

## Evidence-run recommendation

1. Load: use 50 VU, preserving realistic 1–2 second think times.
2. Stress: use stages 50, 200, 600, 1,200 VU; do not describe 1,200 as the breakpoint unless the longer hold fails.
3. Spike: use 20 baseline, 400 spike, 20 recovery. Report phase/recovery metrics, not only aggregate p95.
4. Endurance: use 4,000 RPS for 12 minutes with Activity Monitor on the backend PID. Report the final stable RPS only if dropped iterations remain zero and memory shows no unbounded growth.
5. Preserve calibration summaries separately from the final raw outputs. Do not copy calibration values into the final evidence table without rerunning in the recorded environment.
