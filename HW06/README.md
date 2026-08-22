# HW06 — AI-Assisted API Testing

Student ID: `23127194`

This repository contains the complete HW06 API-testing workflow for three APIs across Pools A, B, and C. The work follows an AI-first, Human-in-the-Loop process: requirement analysis, testcase generation, human audit/correction, human-added coverage, Postman/Newman execution, genuine bug confirmation, CI/CD evidence, AI audit, and an AI-driven API test generator.

## Selected APIs

| API | Pool / FR | Endpoint |
| --- | --- | --- |
| API 1 | Pool A / FR-05 | `GET /api/products?search=keyword` |
| API 2 | Pool B / FR-10 | `PUT /api/orders/:id/cancel` |
| API 3 | Pool C / FR-16 | `POST /api/admin/import-products` |

## Test Summary Report

The PASS/FAIL counts below are **testcase-ID counts**, not Newman assertion counts. One testcase may contain multiple Newman assertions.

| Metric | API 1 — FR-05 | API 2 — FR-10 | API 3 — FR-16 | Total |
| --- | ---: | ---: | ---: | ---: |
| Number of APIs | 1 | 1 | 1 | **3** |
| AI-generated test cases | 42 | 42 | 52 | **136** |
| Human-added test cases | 5 | 6 | 5 | **16** |
| Total testcase records | 47 | 48 | 57 | **152** |
| Executed | 47 | 48 | 46 | **141** |
| Passed | 45 | 45 | 29 | **119** |
| Failed | 2 | 3 | 17 | **22** |
| Blocked / not executed | 0 | 0 | 11 | **11** |
| Confirmed bugs | 3 | 1 | 3 | **7** |
| AI-missed confirmed bugs | 3 | 0 | 0 | **3** |

Consistency checks:

- `119 passed + 22 failed = 141 executed`.
- `141 executed + 11 blocked = 152 total testcase records`.
- The 11 blocked records are all FR-16 cases whose faithful runtime dependency was unavailable; no fake PASS/FAIL was assigned.
- The 3 AI-missed bugs are the FR-05 defects confirmed by human-added testcases `HUMAN-FR05-044` and `HUMAN-FR05-048`.

### Newman execution evidence

| Metric | FR-05 | FR-10 | FR-16 | Total |
| --- | ---: | ---: | ---: | ---: |
| Requests | 62 | 96 | 195 | **353** |
| Assertions | 142 | 275 | 388 | **805** |
| Passed assertions | 138 | 269 | 342 | **749** |
| Failed assertions | 4 | 6 | 46 | **56** |
| Exact `X-Student-Id: 23127194` | 62/62 | 96/96 | 195/195 | **353/353** |

Raw Newman JSON/HTML/CLI/JUnit artifacts are preserved in `postman/newman/` and remain the source of truth.

## Confirmed Bugs

Seven genuine bugs were confirmed after human review:

- FR05-BUG-01 — unsafe SQL construction / parser error exposed by search input — GitHub Issue #24.
- FR05-BUG-02 — unauthenticated product creation succeeds — GitHub Issue #25.
- FR05-BUG-03 — missing required product fields persist as an all-null record — GitHub Issue #26.
- FR10-BUG-01 — user can cancel an order in `shipping` state — GitHub Issue #27.
- FR16-BUG-01 — import accepts non-positive prices — GitHub Issue #28.
- FR16-BUG-02 — import violates atomic all-or-nothing rollback — GitHub Issue #29.
- FR16-BUG-03 — non-admin user can import through the admin endpoint — GitHub Issue #30.

## Self-Assessment

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | ---: | ---: |
| **1** | API 1 — full pipeline (generate + audit + extend + execute + bugs) | 30 | **30** |
| **2** | API 2 — full pipeline (same criteria) | 30 | **30** |
| **3** | API 3 — full pipeline (same criteria) | 30 | **30** |
| **4** | Agent Skills (AI-driven test generator) | 10 | **10** |
|  | **Total** | **100** | **100** |

### Self-assessment rationale

- **API 1 — 30/30:** 42 AI-generated cases, full human audit/correction, 5 human-added cases, 47 real executions, Newman evidence, required student header coverage, and 3 confirmed bug reports/GitHub Issues.
- **API 2 — 30/30:** 42 AI-generated cases, audit/correction, 6 human-added cases, 48 real executions, state-transition evidence, and 1 confirmed shipping-state cancellation bug.
- **API 3 — 30/30:** 52 AI-generated cases, human audit, 5 human-added cases, 46 real executed cases plus 11 transparently blocked cases, and 3 confirmed defects. Blocked cases were preserved rather than fabricated because their required CSV/auth/DB-error runtime support was unavailable.
- **Agent Skills — 10/10:** reusable Human-in-the-Loop testing/audit workflow plus the P12/P13 AI-driven API Test Generator, pseudocode, implementation, demo outputs, and final diagram artifacts are present under `.agents/skills/` and `agent-skill/`.

The self-assessment claims completion of the required pipeline and evidence artifacts; it does not reinterpret genuine Newman failures as passes.

## Main Reports and Evidence

- Main report: `reports/main-report.md`
- AI audit: `reports/ai-audit-report.md`
- AI critique: `reports/AI-Critique.md`
- Consolidated Excel suite: `HW06-API-Test-Cases.xlsx`
- Postman/Newman package: `postman/`
- CI/CD report: `cicd/CI-CD-Report.md`
- AI-driven generator: `agent-skill/`
- Per-API analysis/evidence/bugs: `PoolA-FR-05-ProductSearch/`, `PoolB-FR-10-CancelOrder/`, `PoolC-FR-16-ImportProducts/`

## Repository Links

- GitHub repository: `https://github.com/nhphunng/SoftwareTesting-Homework`
- Bug Issues: `https://github.com/nhphunng/SoftwareTesting-Homework/issues/24` through `/30`
- CI Run A — all pass: `https://github.com/nhphunng/SoftwareTesting-Homework/actions/runs/32492084678`
- CI Run B — exactly one intentional failure: `https://github.com/nhphunng/SoftwareTesting-Homework/actions/runs/32492204368`
- CI restored pass: `https://github.com/nhphunng/SoftwareTesting-Homework/actions/runs/32492332236`

## Evidence Integrity Notes

- Every official request carries `X-Student-Id: 23127194`.
- Newman failures are preserved as real evidence; they are not normalized to all-pass output.
- Confirmed SUT bugs are separated from the intentionally failing CI demonstration.
- Missing historical AI transcripts were not reconstructed during AI-audit compilation.
- FR-16 blocked cases remain blocked where a faithful runtime dependency could not be established safely.
