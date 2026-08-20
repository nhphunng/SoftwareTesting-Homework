# AI Audit Report

> Declaration: I use AI tools for the following tasks.

## AI Tools Used

| AI Tool | Tasks |
| --- | --- |
| ChatGPT | HW06 planning, skill design, API-testing assistance, and report support; extend this row as additional tasks are actually performed. |

> New material AI interactions are appended chronologically using `$ai-audit-report`. Human review remains pending until explicitly completed by the tester.

## AI Audit Entry - AI-001

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT with Liebe local coding connector |
| Date and Time | 2026-08-20T10:23:00+07:00 |
| Stage | P1 — AI Audit Skill refinement |
| API | N/A |
| User Prompt | Skill AI Audit của HW06 bạn có thể tham khảo các HW trước đó như /ky_3/SoftwareTesting-Homework/HW05/.agents/skills/ai-audit-report và chỉnh lại cho phù hợp. Bạn không dùng lệnh $skill-creator để tạo skill được à? |
| Evidence/Input Basis | `HW05/.agents/skills/ai-audit-report/SKILL.md`; `HW05/.agents/skills/ai-audit-report/references/audit-entry-template.md`; `HW05/.agents/skills/ai-audit-report/agents/openai.yaml`; `HW06/plan.md`; local system skill `~/.codex/skills/.system/skill-creator/SKILL.md` |
| Generated/Modified Files | `HW06/.agents/skills/ai-audit-report/SKILL.md`; `HW06/.agents/skills/ai-audit-report/agents/openai.yaml`; `HW06/.agents/skills/ai-audit-report/references/audit-entry-template.md`; `HW06/reports/ai-audit-report.md`; `HW06/reports/ai-session-logs/.gitkeep`; `HW06/plan.md`; removed the earlier custom `HW06/skills/ai-audit/` and `HW06/ai-audit/` implementation |
| AI Output | Refactored P1 to follow the established HW05 audit-skill pattern and the system `$skill-creator` guidance. The skill now uses a concise `SKILL.md`, OpenAI interface metadata, a reusable audit-entry reference template, chronological report appending, explicit pending human review, and HW06-specific evidence-integrity rules. The system validator was invoked but could not complete because local Python lacks the `yaml` module; no dependency was installed automatically. |

Human Review:

- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-002

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT with Liebe local coding connector |
| Date and Time | 2026-08-20T10:30:00+07:00 |
| Stage | P2 — API Testing Human-in-the-Loop Skill creation |
| API | N/A — shared workflow for FR-05, FR-10, FR-16 |
| User Prompt | **B**ước tiếp theo là P2 — tạo `API Testing Human-in-the-Loop Skill`, và lần này tôi sẽ dùng ngay `$skill-creator` pattern.\nLưu ý: Không commit, tôi sẽ kiểm tra sau đó commit sau |
| Evidence/Input Basis | `HW06/plan.md`; `HW05/.agents/skills/design-jmeter-load-test/SKILL.md`; `HW05/.agents/skills/design-jmeter-load-test/agents/openai.yaml`; `~/.codex/skills/.system/skill-creator/SKILL.md`; `~/.codex/skills/.system/skill-creator/references/openai_yaml.md` |
| Generated/Modified Files | `HW06/.agents/skills/api-testing-human-loop/SKILL.md`; `HW06/.agents/skills/api-testing-human-loop/agents/openai.yaml`; `HW06/.agents/skills/api-testing-human-loop/references/workflow-gates.md`; `HW06/.agents/skills/api-testing-human-loop/references/testcase-evidence-contract.md`; `HW06/plan.md`; `HW06/reports/ai-audit-report.md` |
| AI Output | Created the P2 skill using the system `$skill-creator` initializer with a references resource directory, then replaced the scaffold with HW06-specific Human-in-the-Loop instructions. Added explicit Gate A–H semantics, testcase/evidence provenance rules, protection for the required human-added testcases, real-execution evidence constraints, and integration with `$ai-audit-report`. Fixed an initializer command shell-expansion issue in `agents/openai.yaml`. Manual structure validation passed. The official `quick_validate.py` was attempted but could not run because the local Python environment lacks the `yaml` module; no package was installed. No files were staged and no commit was created. |

Human Review:

- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

### Human Review Addendum for AI-002 — 2026-08-20T10:48:00+07:00

- Status: Modified after human review
- Accepted: Use of `$skill-creator`, Human-in-the-Loop gates, contract fidelity, evidence integrity, and reusable references.
- Modified: Removed HW06-specific API assignments, testcase-count requirements, SEC-01–SEC-07 assumptions, `X-Student-Id`, fixed Postman/Newman requirements, and HW06-specific folder behavior from the skill. Project-specific constraints are now supplied as runtime/task context.
- Removed: Fixed references to FR-05, FR-10, FR-16 and assignment-specific provenance/count rules as universal skill behavior.
- Added: Tool/framework neutrality, generic contract extraction, reusable state/security/schema coverage guidance, and configurable project-specific constraints.
- Notes: The skill remains stored inside HW06 for this project, but its instructions are intentionally reusable for future API-testing work.

## AI Audit Entry - AI-003

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT with Liebe local coding connector |
| Date and Time | 2026-08-20T11:24:00+07:00 |
| Stage | Phase 2 — Obtain and Inspect SUT |
| API | Full SUT inventory; focus later on FR-05, FR-10, FR-16 |
| User Prompt | Tôi đã thực hiện clone document/eshop-sut dựa vào đó thực hiện phase 2 Obtain and Inspect SUT |
| Evidence/Input Basis | `/Users/nguyenhoangphihung/Document/eshop-sut/README.md`; `/Users/nguyenhoangphihung/Document/eshop-sut/api_specification.md`; `/Users/nguyenhoangphihung/Document/eshop-sut/backend/server.js`; repository metadata at commit `85af3ba875c88283615e22cb108f13e2fccaf0e9`; `HW06/plan.md` |
| Generated/Modified Files | `HW06/source/api_specification.md`; `HW06/reports/api-inventory.md`; `HW06/reports/ai-audit-report.md` |
| AI Output | Verified the local SUT clone and repository snapshot, copied the API specification into the HW06 source folder, inventoried 30 documented routes and 31 implemented routes, mapped FR/security/state/validation concerns, separated business requirements from API contract and implementation observations, and recorded unresolved/conflicting contract points. Key conflict: FR-16 business requirements describe CSV upload/RFC4180/atomic rollback while the API specification and implementation use a JSON products array. Static mismatch candidates were recorded but explicitly not classified as confirmed bugs without real execution. No runtime API tests were executed and no commit was created. |

Human Review:

- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

### Human Review Addendum for AI-003 — 2026-08-20T13:32:00+07:00

- Status: Accepted with source-handling decision
- Accepted: Phase 2 inventory, conflict preservation, FR/SEC/state mapping, and separation of static observations from confirmed defects.
- Modified: Adopt Option B as the authoritative source-handling rule for later phases.
- Removed: None.
- Added: `README.md` = business truth; `api_specification.md` = API interface contract; implementation/runtime = actual behavior. Later tests must distinguish Business Compliance Tests from API Contract Tests and use `CONFIRMED DEFECT` only after real execution plus human confirmation.
- Notes: Gate A source-precedence decision is approved. Existing unresolved response/status/schema items remain unresolved unless supported by requirement/contract evidence.

## AI Audit Entry - AI-004

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT with Liebe local coding connector |
| Date and Time | 2026-08-20T13:35:00+07:00 |
| Stage | Phase 3 — Select Three APIs |
| API | FR-05 Product Search; FR-10 Cancel Order; FR-16 Import Products |
| User Prompt | Tiếp tục với phase 3 |
| Evidence/Input Basis | `HW06/plan.md`; `HW06/reports/api-inventory.md`; `HW06/source/api_specification.md`; `/Users/nguyenhoangphihung/Document/eshop-sut/README.md`; `/Users/nguyenhoangphihung/Document/eshop-sut/backend/server.js`; Human Gate A Option B decision |
| Generated/Modified Files | `HW06/reports/api-selection.md`; `HW06/reports/ai-audit-report.md` |
| AI Output | Verified the already-assigned API combination instead of performing a new selection. Confirmed one API from each required pool, verified each endpoint exists in both API specification and implementation, documented Requirement/API Contract/Conflict/Implementation Observation layers under Option B, and recorded why FR-05, FR-10, and FR-16 provide complementary testing dimensions. Did not fabricate proof that no group member has the same combination; that remains a human/group coordination assertion. No runtime execution and no commit were performed. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-005

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT with Liebe local coding connector |
| Date and Time | 2026-08-20T13:37:00+07:00 |
| Stage | Phase 4 / API 1 / Step A — Requirement Extraction |
| API | FR-05 Product Search — `GET /api/products?search=keyword` |
| User Prompt | bắt đầu **Phase 4 với API 1 — FR-05 Product Search**, trước tiên là **Step A — Requirement Extraction**. |
| Evidence/Input Basis | `/Users/nguyenhoangphihung/Document/eshop-sut/README.md` FR-05 and SEC-04/SEC-05; `/Users/nguyenhoangphihung/Document/eshop-sut/api_specification.md` section 3.1; `/Users/nguyenhoangphihung/Document/eshop-sut/backend/server.js` product-search route; `HW06/reports/api-inventory.md`; approved Option B source model |
| Generated/Modified Files | `HW06/PoolA-FR-05-ProductSearch/analysis/requirements.md`; `HW06/reports/ai-audit-report.md` |
| AI Output | Extracted source-supported FR-05 business requirements, API contract, applicable security requirements, request inputs, response expectations, state applicability, and unresolved items. Explicitly separated UI-only requirements (loading, h1, presentation/empty-state rendering) from API-testable behavior. Preserved unspecified status codes, response schemas, case sensitivity, trimming, length limits, pagination and duplicate-query semantics as `UNRESOLVED` rather than inventing expectations. Recorded the SQL interpolation in `backend/server.js` as an implementation observation and potential SEC-05 mismatch, not a confirmed defect. No runtime API execution and no commit were performed. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

### Human Review Addendum for AI-005 — 2026-08-20T14:12:00+07:00

- Status: Accepted with explicit Step A decisions
- Accepted: FR-05 requirement extraction, Option B source separation, API-vs-UI scoping, and preservation of unsupported expectations as unresolved.
- Modified: Human selected 1C, 2C, 3C, 4C, 5C, 6C, 7C, 8B for the eight unresolved review items.
- Removed: None.
- Added: Case sensitivity, whitespace, search length, no-result payload/status, success status, and full schema remain `UNRESOLVED`; pagination/sort/filter is `NOT SPECIFIED / NOT IN SCOPE`; duplicate `search` parameters may be tested only as robustness/characterization behavior and cannot alone establish FR-05 non-compliance.
- Notes: Human Gate A for API 1 Step A is complete. Proceed to Step B — Domain Partition Design using these constraints.

## AI Audit Entry - AI-006

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT with Liebe local coding connector |
| Date and Time | 2026-08-20T14:20:00+07:00 |
| Stage | Phase 4 / API 1 / Step B — Domain Partition Design |
| API | FR-05 Product Search — `GET /api/products?search=keyword` |
| User Prompt | Using $api-testing-human-loop để thự hiện Step B |
| Evidence/Input Basis | `HW06/.agents/skills/api-testing-human-loop/SKILL.md`; `HW06/.agents/skills/api-testing-human-loop/references/workflow-gates.md`; approved Step A decisions in `PoolA-FR-05-ProductSearch/analysis/requirements.md`; `HW06/plan.md`; existing `PoolA-FR-05-ProductSearch/analysis/domain-partitions.md` |
| Generated/Modified Files | `HW06/PoolA-FR-05-ProductSearch/analysis/domain-partitions.md`; `HW06/reports/ai-audit-report.md` |
| AI Output | Applied `$api-testing-human-loop` Gate B rules to review the existing FR-05 domain model. Confirmed the only documented parameter `search` is covered without inventing typed null, numeric boundary, or length constraints. Preserved controlled-data requirements, SEC-05 input-domain coverage, and Step A unresolved decisions. Added explicit Human Gate B review options for exact-vs-partial matching, empty/whitespace partition granularity, security-oriented input placement, long-input representatives, and duplicate-query handling. No human option was selected by the AI. No runtime API execution, staging, or commit was performed. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

### Human Review Addendum for AI-006 — 2026-08-20T14:23:00+07:00

- Status: Accepted with explicit Gate B decisions
- Accepted: Domain partition coverage, non-invention of unsupported boundaries/types, controlled-data requirements, and separation of characterization from contractual expectations.
- Modified: Human selected 1B, 2B, 3B, 4B, 5B.
- Removed: None.
- Added: Partial-name search remains characterization; empty/whitespace/padded-whitespace stay separate; security-oriented values remain input-domain classes with detailed security analysis deferred to Step D; long keywords remain robustness representatives without contractual max-length assertions; duplicate search parameters remain robustness/characterization only.
- Notes: Human Gate B is complete. Step B partition model is approved and ready for Step C — State/Sequence Analysis.

## AI Audit Entry - AI-007

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT with Liebe local coding connector |
| Date and Time | 2026-08-20T14:26:00+07:00 |
| Stage | Phase 4 / API 1 / Step C — State/Sequence Analysis |
| API | FR-05 Product Search — `GET /api/products?search=keyword` |
| User Prompt | Tiếp tục sử dụng $api-testing-human-loop cho Step C — State/Sequence Analysis |
| Evidence/Input Basis | `HW06/.agents/skills/api-testing-human-loop/SKILL.md`; `HW06/.agents/skills/api-testing-human-loop/references/workflow-gates.md`; approved Step A requirements; approved Step B domain partitions; `HW06/plan.md` Step C |
| Generated/Modified Files | `HW06/PoolA-FR-05-ProductSearch/analysis/state-transitions.md`; `HW06/reports/ai-audit-report.md` |
| AI Output | Applied `$api-testing-human-loop` Gate C. Determined that FR-05 has no explicit business state machine and did not fabricate lifecycle states. Modeled dataset conditions as preconditions, request independence/repeatability sequences, public-auth context, and concurrency only as a data-stability concern. Added explicit Human Gate C options for whether to model a formal state machine, repeatability expectations, cross-query sequences, authentication context, and concurrency treatment. No human option was selected by the AI. No runtime execution, staging, or commit was performed. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

### Human Review Addendum for AI-007 — 2026-08-20T14:27:00+07:00

- Status: Accepted with explicit Gate C decisions
- Accepted: No explicit FR-05 business state machine, contextual dataset preconditions, read-only request sequences, and separation of sequence analysis from security/concurrency requirements.
- Modified: Human selected 1B, 2B, 3A, 4B, 5B.
- Removed: None.
- Added: Keep contextual states/sequences instead of artificial lifecycle states; repeatability is non-mutation plus equivalent semantics under stable data; retain Search A → Search B and Search → listing independence checks; authentication remains contextual and moves to Step D for detailed security analysis; concurrent dataset changes remain an environment/data-stability concern only.
- Notes: Human Gate C is complete. Step C is approved and ready for Step D — Security Analysis.
