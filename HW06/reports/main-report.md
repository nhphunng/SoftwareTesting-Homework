# HW06 — AI-Assisted API Testing Main Report

Student ID: `23127194`  
Assignment: **HW06 — API Testing**  
Date: 2026-08-22  
SUT: EShop (`ttbhanh/eshop-sut`)  
Execution toolchain: Postman + Newman  
AI workflow: AI-first with Human-in-the-Loop review gates

---

## 1. Assignment Overview

This assignment applies an AI-assisted, human-reviewed API-testing workflow to three APIs selected from three different pools. For every API, the work includes requirement analysis, domain partitioning, state/security/schema analysis, AI testcase generation, human audit, human-added coverage, Postman implementation, real Newman execution, and defect confirmation from execution evidence.

The three assigned APIs are:

| API | Pool / FR | Method and endpoint | Main testing focus |
| --- | --- | --- | --- |
| API 1 | Pool A / FR-05 | `GET /api/products?search=keyword` | Search input domains, injection/parser behavior, response consistency |
| API 2 | Pool B / FR-10 | `PUT /api/orders/:id/cancel` | Order state machine, invalid transitions, authorization/ownership |
| API 3 | Pool C / FR-16 | `POST /api/admin/import-products` | Import validation, atomicity, admin authorization, persistence integrity |

The final suite contains **152 testcase records**: **136 AI-generated** and **16 human-added**. The official Newman executions ran **141 testcase IDs**; **11 FR-16 records remained blocked** because the required CSV transport or safe supporting runtime endpoint/error trigger was unavailable.

---

## 2. SUT and Test Environment

The SUT was executed locally on `http://localhost:3000`. The homework repository stores the specification, per-API analysis, generated/audited testcases, Postman collections, runtime data, raw Newman reports, screenshots, bug reports, CI/CD evidence, AI audit, and the AI-driven generator artifacts.

Every official Postman/Newman request was required to carry:

```http
X-Student-Id: 23127194
```

The final official evidence confirms exact header coverage on **353/353 requests**:

| API | Requests | `X-Student-Id` exact match |
| --- | ---: | ---: |
| FR-05 | 62 | 62/62 |
| FR-10 | 96 | 96/96 |
| FR-16 | 195 | 195/195 |
| **Total** | **353** | **353/353** |

Raw Newman JSON/HTML/CLI/JUnit artifacts are preserved under `postman/newman/`. Compact execution summaries are used for analysis without replacing the raw reports as the source of truth.

---

## 3. AI Usage Method and Human Review

The workflow deliberately avoided a one-prompt “generate and run everything” approach. Instead, each API moved through separate stages:

```text
Requirement Extraction
→ Human Gate A
→ Domain Partition
→ Human Gate B
→ State Transition
→ Human Gate C
→ Security Analysis
→ Human Gate D
→ Schema Analysis
→ AI Test Generation
→ Human Audit
→ Human Extension
→ Postman Implementation
→ Runtime Preparation
→ Real Newman Execution
→ Failure Analysis
→ Human Bug Confirmation
```

AI was used to produce breadth and structure. Human review was responsible for preserving unresolved requirements, correcting non-deterministic tests, adding missing cross-request scenarios, and deciding whether observed runtime failures represented genuine SUT defects.

The detailed chronological record is maintained in `reports/ai-audit-report.md` and summarized again in Section 13 / Appendix A of this report.

---

## 4. API Selection

The selected combination satisfies the assignment requirement of exactly one API from each of Pools A, B, and C:

1. **FR-05 Product Search** — `GET /api/products?search=keyword`
2. **FR-10 Cancel Order** — `PUT /api/orders/:id/cancel`
3. **FR-16 Import Products** — `POST /api/admin/import-products`

Selection details and endpoint/security mapping are recorded in `reports/api-selection.md` and `reports/api-inventory.md`.

---

# 5. API 1 — FR-05 Product Search

## 5.1 Requirement and Test Design Analysis

FR-05 was analyzed across query-domain behavior, response semantics, parser/input edge cases, security risks, and state effects caused by related product operations. The API itself has no explicit business state machine, so the state analysis focused on resource existence/mutation and sequences that could affect later search results.

Artifacts:

- `PoolA-FR-05-ProductSearch/analysis/requirements.md`
- `PoolA-FR-05-ProductSearch/analysis/domain-partitions.md`
- `PoolA-FR-05-ProductSearch/analysis/state-transitions.md`
- `PoolA-FR-05-ProductSearch/analysis/security.md`
- `PoolA-FR-05-ProductSearch/analysis/schema.md`

## 5.2 AI Generation and Human Audit

The AI generated **42** FR-05 cases. The initial human audit classified:

| VALID | INCOMPLETE | INVALID | Total |
| ---: | ---: | ---: | ---: |
| 32 | 10 | 0 | 42 |

The ten incomplete cases were preserved, corrected into deterministic forms, and human-reviewed again. Final audit status was **42 VALID / 0 INCOMPLETE / 0 INVALID**.

This is an important audit result: AI’s main weakness was not irrelevant test ideas, but insufficiently concrete inputs/oracles such as vague “long input” or injection probes.

## 5.3 Human Extension

Humans added **5** cases, bringing the FR-05 executable testcase set to **47**. These cases targeted parser edge conditions, cross-request persistence, and unsupported/unauthorized write behavior that the endpoint-scoped AI generation did not cover deeply enough.

The most important human-added cases were:

- `HUMAN-FR05-044` — encoded null-byte parser/injection probe.
- `HUMAN-FR05-048` — before/after search plus unauthenticated malformed `POST` sequence.

## 5.4 Postman / Newman Execution

Official result:

| Metric | Result |
| --- | ---: |
| Testcase IDs executed | 47 |
| Passed testcase IDs | 45 |
| Failed testcase IDs | 2 |
| Requests | 62 |
| Assertions | 142 |
| Assertions passed | 138 |
| Assertions failed | 4 |
| Student header | 62/62 |

The two failed testcase IDs were `HUMAN-FR05-044` and `HUMAN-FR05-048`.

## 5.5 Confirmed Bugs

Human Gate H confirmed **3 defects**:

| Bug | Severity | Confirmed behavior | Found by |
| --- | --- | --- | --- |
| FR05-BUG-01 | High | Search input reaches SQL construction unsafely and a null-byte probe exposes an SQLite parser error | `HUMAN-FR05-044` |
| FR05-BUG-02 | Critical | `POST /api/products` accepts a request without JWT/Admin authorization and persists a product | `HUMAN-FR05-048` |
| FR05-BUG-03 | High | Product creation accepts missing required fields and persists an all-null record | `HUMAN-FR05-048` |

GitHub Issues: #24, #25, #26.

These three defects are counted as **AI-missed bugs** because their confirming scenarios were human-added rather than AI-generated.

---

# 6. API 2 — FR-10 Cancel Order

## 6.1 Requirement and State Analysis

FR-10 is primarily a state-transition API. The contract permits user cancellation only from cancelable order states and requires invalid transitions to be rejected without changing the order state. Security analysis also considered authentication, ownership/IDOR risk, malformed IDs, repeated cancellation, and response characterization when exact error status/schema were not specified.

Artifacts are stored under `PoolB-FR-10-CancelOrder/analysis/`.

## 6.2 AI Generation and Human Audit

The AI generated **42** cases. Human audit identified **6 INCOMPLETE** cases that required more reproducible setup or evidence/oracle definitions. After correction and explicit human re-review, all **42 AI cases were implementation-ready**; none was discarded as INVALID.

## 6.3 Human Extension

Humans added **6** additional cases. The final FR-10 execution set therefore contained **48 testcase IDs**.

The human additions concentrated on risk-based authorization, state-history dependencies, sequencing, and gaps that required more than isolated single-request reasoning.

## 6.4 Postman / Newman Execution

Official result:

| Metric | Result |
| --- | ---: |
| Testcase IDs executed | 48 |
| Passed testcase IDs | 45 |
| Failed testcase IDs | 3 |
| Requests | 96 |
| Assertions | 275 |
| Assertions passed | 269 |
| Assertions failed | 6 |
| Student header | 96/96 |

The failed testcase IDs were:

- `AI-FR10-003`
- `AI-FR10-021`
- `AI-FR10-040`

All three independently demonstrated the same defect.

## 6.5 Confirmed Bug

**FR10-BUG-01 — User can cancel an order in `shipping` state** (High).

Expected: a user cancellation of a shipping order must be semantically rejected and the order must remain `shipping`.

Actual: the cancel endpoint returned HTTP `200`, and follow-up reads showed the order persisted as `canceled`. The behavior reproduced on three independently isolated shipping fixtures.

GitHub Issue: #27.

This defect was discovered by **AI-generated tests** and therefore is not counted as AI-missed.

---

# 7. API 3 — FR-16 Import Products

## 7.1 Requirement and Contract Analysis

FR-16 required special handling because two input surfaces had to be distinguished:

1. the business CSV-import contract; and
2. the documented JSON `products[]` API contract.

The analysis avoided inventing exact HTTP status codes or response field names when the specification did not define them. Persistence became the main oracle for validation, authorization, and atomic rollback. The critical requirement was that invalid rows must not produce partial batch persistence.

Artifacts are stored under `PoolC-FR-16-ImportProducts/analysis/`.

## 7.2 AI Generation and Human Audit

The AI generated **52** cases, exceeding the minimum requirement of 35. Initial human review found seven incomplete cases. After correction/re-review, the final audit state was:

| VALID | INCOMPLETE / BLOCKED | INVALID | Total |
| ---: | ---: | ---: | ---: |
| 51 | 1 | 0 | 52 |

`AI-FR16-046` remained blocked because no safe, deterministic DB-level error trigger could be established. The case was not fabricated or force-executed.

## 7.3 Human Extension

Humans retained **5** FR-16 cases after reviewing six candidates. The retained tests covered concurrency, stale category references, token lifecycle, stale role/token state, and repeated invalid submissions.

Total FR-16 testcase records: **57**.

## 7.4 Runtime Readiness and Blocked Cases

Only **46 of 57** FR-16 testcase records were executable in the official environment. **11 were marked NOT EXECUTED — BLOCKED**, including cases that depended on a faithful CSV transport, safe DB-error trigger, logout/revocation endpoint, or role-promotion endpoint.

Keeping these cases blocked preserves evidence integrity: unavailable runtime capabilities were not simulated and no fake execution result was created.

## 7.5 Postman / Newman Execution

Official result:

| Metric | Result |
| --- | ---: |
| Testcase IDs executed | 46 |
| Passed testcase IDs | 29 |
| Failed testcase IDs | 17 |
| Blocked testcase records | 11 |
| Requests | 195 |
| Assertions | 388 |
| Assertions passed | 342 |
| Assertions failed | 46 |
| Student header | 195/195 |

The failures clustered around three real defect classes: invalid price acceptance, violation of all-or-nothing rollback, and non-admin access to the admin import operation.

## 7.6 Confirmed Bugs

Human Gate H confirmed **3 defects**:

| Bug | Confirmed behavior |
| --- | --- |
| FR16-BUG-01 | Import accepts non-positive product prices |
| FR16-BUG-02 | Import violates atomic all-or-nothing rollback |
| FR16-BUG-03 | Non-admin user can import products through the admin endpoint |

GitHub Issues: #28, #29, #30.

The primary FR-16 defect classes were already represented by AI-generated tests, so they are not counted as AI-missed bugs. A human repeated-invalid-batch case (`HUM-FR16-006`) also reproduced rollback-related behavior, but this is the same defect class rather than an additional independent bug.

---

# 8. Postman Features Used

The final implementation uses Postman/Newman features for real testing rather than checklist-only demonstrations:

- separate collections for FR-05, FR-10, and FR-16;
- public environment files plus git-ignored private runtime environments;
- collection/environment/local variables;
- collection-level pre-request scripts;
- mandatory `X-Student-Id` injection;
- runtime JSON data files;
- test scripts and semantic/persistence assertions;
- helper requests for state verification;
- `pm.sendRequest()` where cross-request/concurrency behavior required it;
- HTML, JSON, CLI, and JUnit Newman reporters.

The shared runner is:

```bash
./scripts/run-step-k.sh FR05
./scripts/run-step-k.sh FR10
./scripts/run-step-k.sh FR16
```

---

# 9. CI/CD Integration

The repository includes `.github/workflows/hw06-api-tests.yml` and a deliberately separate deterministic CI demonstration suite. This separation prevents genuine official Step-K defect failures from being hidden merely to produce a green pipeline sample.

## Run A — all passing

- Commit: `06cd7d9b544a3d0ee9d8c5d19e5d00f1af4bba06`
- GitHub Actions run: `32492084678`
- Result: **SUCCESS**
- Requests: 4
- Assertions: 12
- Failed: 0
- Student header: 4/4

## Run B — exactly one intentional failure

- Commit: `b564ce2229ada6f4c14a13491eaafd37086b6068`
- GitHub Actions run: `32492204368`
- Result: **FAILURE — intentional CI demonstration**
- Requests: 4
- Assertions: 13
- Failed: exactly 1
- Failing assertion: `CI-DEMO-ONLY | intentional single failure`

The branch was then restored to passing mode in commit `582811c82d7239c91a819d938e4dd36696423467`, with successful run `32492332236`.

Detailed evidence: `cicd/CI-CD-Report.md`.

---

# 10. AI-Driven API Test Generator

The P12/P13 generator artifacts are under `agent-skill/`:

- `agent-skill/pseudocode.md`
- `agent-skill/api-test-generator/SKILL.md`
- `agent-skill/api-test-generator/generate.mjs`
- `agent-skill/api-test-generator/README.md`
- `agent-skill/api-test-generator-diagram.mmd`
- `agent-skill/api-test-generator-diagram.png`
- `agent-skill/demo/`

The generator accepts an API specification, endpoint, FR/security context, and output format, then produces an auditable requirement/endpoint/coverage model and candidate tests. It deliberately preserves unknowns instead of inventing unsupported contract details and ends at a **Human Review Required** gate.

Its internal flow is:

```text
Specification Input
→ Requirement Parser
→ Endpoint Model
→ Parameter / Constraint Analyzer
→ Domain Partition Generator
→ State Transition Analyzer
→ Security Mapper
→ Schema Test Generator
→ Coverage Analyzer
→ Deduplicator
→ Human Review Gate
→ Final Test Cases
```

---

# 11. Consolidated Test Summary

## 11.1 Testcase-level summary

The assignment README requirement refers to tests/testcases, so testcase IDs—not Newman assertions—are used for the main PASS/FAIL totals.

| Metric | FR-05 | FR-10 | FR-16 | Total |
| --- | ---: | ---: | ---: | ---: |
| APIs | 1 | 1 | 1 | **3** |
| AI-generated testcases | 42 | 42 | 52 | **136** |
| Human-added testcases | 5 | 6 | 5 | **16** |
| Total testcase records | 47 | 48 | 57 | **152** |
| Executed testcase IDs | 47 | 48 | 46 | **141** |
| Passed testcase IDs | 45 | 45 | 29 | **119** |
| Failed testcase IDs | 2 | 3 | 17 | **22** |
| Blocked / not executed | 0 | 0 | 11 | **11** |
| Confirmed bugs | 3 | 1 | 3 | **7** |
| AI-missed confirmed bugs | 3 | 0 | 0 | **3** |

Check: `119 passed + 22 failed = 141 executed`; `141 executed + 11 blocked = 152 total testcase records`.

## 11.2 Newman assertion-level evidence

Newman assertion numbers are preserved separately because one testcase can contain multiple assertions:

| Metric | FR-05 | FR-10 | FR-16 | Total |
| --- | ---: | ---: | ---: | ---: |
| Requests | 62 | 96 | 195 | **353** |
| Assertions | 142 | 275 | 388 | **805** |
| Passed assertions | 138 | 269 | 342 | **749** |
| Failed assertions | 4 | 6 | 46 | **56** |

The assertion totals must not be confused with testcase PASS/FAIL counts.

---

# 12. AI Critique

The evidence-based critique is maintained in `reports/AI-Critique.md` and is summarized here.

AI was effective at generating broad systematic coverage, but first-pass outputs frequently needed human correction to become executable. FR-05 had ten initially incomplete AI cases, FR-10 had six, and FR-16 had seven. The recurring problem was insufficient reproducibility: vague long strings, abstract injection payloads, or environment-dependent error triggers needed concrete values, fixtures, and branching oracles.

The strongest AI blind spot was compositional and cross-endpoint reasoning. Human-added FR-05 tests combined parser-layer attacks with before/after persistence checks and revealed three confirmed bugs that the AI suite had not identified. Human additions elsewhere covered concurrency, stale references, token lifecycle, role-state consistency, and repeated operations. These gaps reflect the endpoint-scoped generation process: it was strong at local partitions and state/security matrices but weaker at temporal and cross-feature interactions.

At the same time, AI-generated cases did successfully reveal the FR-10 shipping cancellation defect and the main FR-16 validation, rollback, and authorization failures. The practical lesson is that AI is useful for systematic breadth, while humans remain necessary to challenge assumptions, turn vague tests into reproducible experiments, add cross-layer sequences, and decide whether observed failures actually violate the specification.

---

# 13. AI Audit

The complete chronological AI audit is preserved in:

`reports/ai-audit-report.md`

The audit was compiled without recreating missing historical transcripts or fabricating evidence. Before the P14 compilation entry, it contained **59 recorded interaction occurrences / 56 distinct historical IDs**, covering setup/shared workflow, all three per-API pipelines, consolidation/CI, the generator, and the diagram process. The compilation normalized equivalent historical field labels while preserving numbering anomalies rather than rewriting history.

The audit demonstrates the required pattern:

```text
AI Output
→ Human Evaluation
→ Correction / Decision
→ Final Artifact
```

Representative chains include:

| Audit chain | Human control demonstrated |
| --- | --- |
| `AI-002` | Generalized an initially HW06-specific testing skill instead of accepting hard-coded assumptions |
| `AI-005` → `AI-006` | Preserved unresolved FR-05 behavior rather than inventing search semantics |
| `AI-029` → `AI-030` | Corrected six incomplete FR-10 cases and re-approved them explicitly |
| `AI-043` → `AI-045` | Corrected/re-reviewed FR-16 incomplete cases; retained a blocked DB-error case when no safe trigger existed |
| `AI-054` | Separated truthful defect-bearing Step-K suites from the controlled CI pass/one-fail demonstration |
| `AI-055` | Fixed generator parsing after validation exposed a false HTTP-status interpretation |
| `AI-056` | Human-reviewed the diagram artifact before final rendering |

Evidence-integrity constraints applied throughout the audit:

- no fake Newman execution;
- no fabricated screenshot;
- no invented GitHub Actions result;
- no fake human approval;
- no defect claimed without specification + reproduction + execution evidence;
- blocked cases remain blocked rather than being assigned artificial PASS/FAIL results.

For submission, `reports/ai-audit-report.md` is the authoritative detailed AI-audit appendix accompanying this main report.

---

# 14. Conclusion

HW06 completed the required three-API AI-assisted testing workflow across Pools A, B, and C. The work produced **152 testcase records**, executed **141** real testcase IDs, preserved **11 blocked cases** without fabricating evidence, and confirmed **7 genuine defects**. Three of those defects were found only after human-added FR-05 scenarios, while AI-generated tests successfully exposed the FR-10 state-transition bug and the principal FR-16 validation/transaction/authorization failures.

The results support the central human-in-the-loop design of the assignment: AI improves coverage breadth and analysis speed, but reliable testing still depends on human review of requirements, deterministic setup, cross-request reasoning, evidence integrity, and final bug confirmation.

---

# Appendix A — Key Evidence Index

| Area | Primary artifact |
| --- | --- |
| API selection | `reports/api-selection.md` |
| API inventory | `reports/api-inventory.md` |
| Consolidated test cases | `HW06-API-Test-Cases.xlsx` |
| FR-05 audit | `PoolA-FR-05-ProductSearch/audit/audit-summary.md` |
| FR-05 execution | `postman/newman/FR05-execution-summary.md` |
| FR-10 execution | `postman/newman/FR10-execution-summary.md` |
| FR-16 execution | `postman/newman/FR16-execution-summary.md` |
| Full Newman evidence | `postman/newman/*-official-report.{json,html,xml}` |
| Confirmed bug reports | `Pool*-*/bugs/` |
| CI/CD | `cicd/CI-CD-Report.md` |
| AI generator | `agent-skill/` |
| AI audit | `reports/ai-audit-report.md` |
| AI critique | `reports/AI-Critique.md` |

# Appendix B — Repository / External Evidence

- Repository: `https://github.com/nhphunng/SoftwareTesting-Homework`
- Confirmed bug issues: `#24` through `#30`
- CI all-pass run: `https://github.com/nhphunng/SoftwareTesting-Homework/actions/runs/32492084678`
- CI one-fail demonstration: `https://github.com/nhphunng/SoftwareTesting-Homework/actions/runs/32492204368`
- CI restored-pass run: `https://github.com/nhphunng/SoftwareTesting-Homework/actions/runs/32492332236`
