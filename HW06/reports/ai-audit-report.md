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

## AI Audit Entry - AI-008

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT with Liebe local coding connector |
| Date and Time | 2026-08-20T14:30:00+07:00 |
| Stage | Phase 4 / API 1 / Step D — Security Analysis |
| API | FR-05 Product Search — `GET /api/products?search=keyword` |
| User Prompt | Tiếp tục $api-testing-human-loop thực hiện step D |
| Evidence/Input Basis | `HW06/.agents/skills/api-testing-human-loop/references/workflow-gates.md` Gate D; approved Step A/B/C artifacts; `HW06/plan.md` Step D; `/Users/nguyenhoangphihung/Document/eshop-sut/README.md` SEC-01→SEC-07; `/Users/nguyenhoangphihung/Document/eshop-sut/backend/server.js` search route |
| Generated/Modified Files | `HW06/PoolA-FR-05-ProductSearch/analysis/security.md`; `HW06/reports/ai-audit-report.md` |
| AI Output | Applied `$api-testing-human-loop` Gate D. Mapped SEC-01 through SEC-07 by actual applicability, with SEC-05 directly applicable and SEC-04 partially applicable. Marked role escalation, IDOR/BOLA, mass assignment, replay, and unrelated auth requirements as not applicable rather than forcing generic security cases. Modeled SQL-injection payload families, public-access context, invalid-token characterization, information-disclosure risk, and rate/abuse as not specified. Recorded direct SQL interpolation and HTML DB-error output as implementation observations, not confirmed defects. Added six Human Gate D review options and did not select them on the user's behalf. No runtime execution, staging, or commit was performed. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

### Human Review Addendum for AI-008 — 2026-08-20T14:33:00+07:00

- Status: Accepted with explicit Gate D decisions
- Accepted: SEC-05 as the primary API security requirement, SEC-04 as partial API coverage, non-applicable security categories excluded, and implementation observations kept separate from confirmed defects.
- Modified: Human selected 1B, 2A, 3B, 4B, 5B, 6B.
- Removed: None.
- Added: SEC-05 defect criterion requires unsafe/non-parameterized query behavior or input altering/breaking SQL structure; information disclosure remains a separate risk dimension; SEC-04 requires UI/E2E evidence for full verification; invalid/expired JWT is optional characterization on this public endpoint; rate/abuse is not specified; testcase generation is limited to applicable/partial/risk-based security dimensions.
- Notes: Human Gate D is complete. Step D is approved and ready for the Schema/Response Analysis checkpoint.

## AI Audit Entry - AI-009

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT with Liebe local coding connector |
| Date and Time | 2026-08-20T14:35:00+07:00 |
| Stage | Phase 4 / API 1 / Step E — Schema Validation Design |
| API | FR-05 Product Search — `GET /api/products?search=keyword` |
| User Prompt | Tiếp tục $api-testing-human-loop thực hiện Step E |
| Evidence/Input Basis | `HW06/.agents/skills/api-testing-human-loop/references/workflow-gates.md` Schema/Response checkpoint; approved Step A/B/C/D artifacts; `HW06/plan.md` Step E; `/Users/nguyenhoangphihung/Document/eshop-sut/api_specification.md` product sections; `/Users/nguyenhoangphihung/Document/eshop-sut/README.md` FR-05; `/Users/nguyenhoangphihung/Document/eshop-sut/backend/server.js` GET product-search route |
| Generated/Modified Files | `HW06/PoolA-FR-05-ProductSearch/analysis/schema.md`; `HW06/reports/ai-audit-report.md` |
| AI Output | Applied `$api-testing-human-loop` Schema/Response checkpoint. Determined that GET `/api/products` has no formally specified response schema/status/error schema. Separated source-backed search semantics from characterization-only observations, avoided promoting CRUD request fields or implementation DB-row output into a GET response contract, and preserved no-match/status/type/additional-property details as unresolved. Added seven Human Review options covering top-level shape, product fields, primitive types, no-match representation, extra properties, error responses, and characterization-test inclusion. No human option was selected by the AI. No runtime execution, staging, or commit was performed. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

### Human Review Addendum for AI-009 — 2026-08-20T14:39:00+07:00

- Status: Accepted with explicit Schema/Response checkpoint decisions
- Accepted: Missing formal GET schema/status/error schema remains unresolved, while source-backed semantics and characterization checks stay separate.
- Modified: Human selected 1B, 2C, 3B, 4B, 5B, 6B, 7B.
- Removed: None.
- Added: Top-level response shape is characterization only; exact GET product fields and primitive types remain unresolved; no-match payload/status remains unresolved; extra properties do not fail by default; error schema remains unresolved with actual response recorded and information disclosure analyzed separately; Step F may include a limited number of clearly labeled CHARACTERIZATION schema cases.
- Notes: Schema/Response checkpoint is complete. Step E is approved and ready for Step F — AI Testcase Generation.

## AI Audit Entry - AI-010

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT with `$api-testing-human-loop`, Liebe local coding connector, and `artifact_tool` spreadsheet generation |
| Date and Time | 2026-08-20T14:40:00+07:00 |
| Stage | Phase 4 / API 1 / Step F — AI Testcase Generation |
| API | FR-05 Product Search — `GET /api/products?search=keyword` |
| User Prompt | Thực hiện tiếp tục Step F |
| Evidence/Input Basis | Approved API 1 Step A requirements; Step B domain partitions and Human Gate B decisions; Step C state/sequence model and Gate C decisions; Step D security analysis and Gate D decisions; Step E schema/response checkpoint decisions; `HW06/plan.md` Step F; `$api-testing-human-loop` testcase/evidence contract |
| Generated/Modified Files | `HW06/PoolA-FR-05-ProductSearch/generated/ai-generated-tests.xlsx`; `HW06/reports/ai-audit-report.md` |
| AI Output | Generated 42 AI-origin FR-05 testcases in seven staged batches rather than one generic batch: 6 happy-path/basic, 12 domain, 6 boundary/robustness, 5 state/sequence, 7 security, 4 schema, and 2 cross-check cases. Every testcase has `Source = AI` and includes `X-Student-Id: {{studentId}}` in its request input. Unsupported status codes and formal GET schemas remain `UNRESOLVED`; characterization cases are labeled explicitly; human-audit and real-execution fields are left blank. Workbook coverage formulas verify 42 total cases and the >=35 threshold. The first spreadsheet-engine startup attempt timed out before workbook creation; a fresh retry succeeded, and the final workbook was verified with no formula errors. No API requests were executed, no human audit classification was fabricated, no files were staged, and no commit was created. |

Human Review:
- Status: Pending Human Gate E / Step G audit
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-010

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT with Liebe local coding connector + artifact_tool spreadsheet generation |
| Date and Time | 2026-08-20T15:00:00+07:00 |
| Stage | Phase 4 / API 1 / Step F — AI Testcase Generation |
| API | FR-05 Product Search — `GET /api/products?search=keyword` |
| User Prompt | Thực hiện tiếp tục Step F |
| Evidence/Input Basis | `$api-testing-human-loop` testcase/evidence contract; approved Step A requirements; approved Step B domain partitions; approved Step C state/sequence analysis; approved Step D security analysis; approved Step E schema design; `HW06/plan.md` Step F and project constraints |
| Generated/Modified Files | `HW06/PoolA-FR-05-ProductSearch/generated/ai-generated-tests.xlsx`; `HW06/reports/ai-audit-report.md` |
| AI Output | Generated 42 AI-origin FR-05 testcases in seven batches rather than one generic batch: 6 happy-path/basic, 12 domain, 6 boundary/negative, 5 state/sequence, 7 security, 4 schema, and 2 cross-check cases. Every testcase has `Source = AI`, includes the required `X-Student-Id={{studentId}}` request header in its input definition, traces to approved requirements/partitions/state/security/schema bases, and preserves unsupported status/schema/normalization expectations as `UNRESOLVED` or `CHARACTERIZATION`. Human Audit Status, Human Audit Reason, Execution Status, Actual Result, Evidence, and Defect ID are intentionally blank. Workbook coverage formulas verified Total=42 and Threshold met=YES, with no spreadsheet formula errors detected. No API execution, Newman evidence, human review classification, staging, or commit was performed. |

Human Review:
- Status: Pending Step G human audit
- Accepted:
- Modified:
- Removed:
- Added:
- Notes: Step F generation is complete. The generated cases must next be audited individually with project labels VALID / INVALID / INCOMPLETE; AI must not fill those labels as human decisions.

## AI Audit Entry - AI-010

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT with Liebe local coding connector + artifact_tool spreadsheet generation |
| Date and Time | 2026-08-20T15:06:00+07:00 |
| Stage | Phase 4 / API 1 / Step F — AI Testcase Generation |
| API | FR-05 Product Search — `GET /api/products?search=keyword` |
| User Prompt | Thực hiện tiếp tục Step F |
| Evidence/Input Basis | `$api-testing-human-loop` testcase/evidence contract; approved Step A requirements; approved Step B partitions; approved Step C state/sequence model; approved Step D security model; approved Step E schema/response checkpoint; `HW06/plan.md` Step F and project header/count requirements |
| Generated/Modified Files | `HW06/PoolA-FR-05-ProductSearch/generated/ai-generated-tests.xlsx`; `HW06/reports/ai-audit-report.md` |
| AI Output | Generated 42 AI-origin FR-05 testcases in seven batches rather than one generic generation pass. Every testcase has `Source = AI` and includes `X-Student-Id: {{studentId}}` in its request input. Coverage workbook reports: Functional 8, Domain 12, Boundary 6, State/Sequence 5, Security 7, Schema 4, Total 42, threshold >=35 met. Expected HTTP status remains `UNRESOLVED` where the contract does not define it. Schema/normalization/duplicate-query cases approved as characterization remain explicitly labeled as such. Human audit, execution, actual-result, evidence, and defect fields are intentionally blank. No API request was executed and no evidence was fabricated. No staging or commit was performed. |

Human Review:
- Status: Pending human review / Gate E
- Accepted:
- Modified:
- Removed:
- Added:
- Notes: Step G must audit every AI testcase using VALID / INVALID / INCOMPLETE. This entry does not claim that review is complete.

## AI Audit Entry - AI-011

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT with Liebe local coding connector |
| Date and Time | 2026-08-20T15:25:00+07:00 |
| Stage | Phase 4 / API 1 / Step F artifact conversion before Step G |
| API | FR-05 Product Search — `GET /api/products?search=keyword` |
| User Prompt | chuyển bộ 42 testcase hiện tại từ XLSX sang Markdown và dùng Markdown làm source chính từ Step G trở đi |
| Evidence/Input Basis | Existing `PoolA-FR-05-ProductSearch/generated/ai-generated-tests.xlsx` containing the 42 Step F AI-generated testcases |
| Generated/Modified Files | `HW06/PoolA-FR-05-ProductSearch/generated/ai-generated-tests.md`; `HW06/reports/ai-audit-report.md` |
| AI Output | Converted the existing 42 FR-05 AI-generated testcase records from XLSX into Markdown while preserving IDs `AI-FR05-001` through `AI-FR05-042`, `Source = AI`, requirement traces, `UNRESOLVED`/`CHARACTERIZATION` labels, and blank human-audit/execution/evidence/defect fields. The Markdown file is now explicitly designated as the review source of truth from Step G onward; the XLSX file is retained as an export/summary artifact only. Verification counted exactly 42 testcase sections and zero pre-populated Human Audit Status values. No testcase semantics were reclassified, no API execution was performed, and no staging or commit was performed. |

Human Review:
- Status: User explicitly requested this artifact-source change
- Accepted: Markdown becomes the primary editable/review source from Step G onward
- Modified: XLSX role changed from primary Step F artifact to export/summary artifact
- Removed: None
- Added: `PoolA-FR-05-ProductSearch/generated/ai-generated-tests.md`
- Notes: Step G should read and update the Markdown file, preserving AI provenance. XLSX may be regenerated/synchronized later if needed for final submission.

### Student ID Header Update — 2026-08-20T16:41:00+07:00

- User provided StudentID: `23127194`.
- Updated the primary FR-05 Markdown testcase source so every testcase now carries `X-Student-Id: 23127194` instead of the `{{studentId}}` placeholder.
- Normalized the testcase request notation to exact HTTP-header form: `Header: X-Student-Id: 23127194`.
- Newman/HTML report is not generated at this stage because Postman implementation and real execution have not occurred yet; no report or execution evidence was fabricated.

## AI Audit Entry - AI-012

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT |
| Date and Time | 2026-08-20T16:57:00+07:00 |
| Stage | Phase 4 / API 1 / Step G — Human Audit revision review |
| API | FR-05 Product Search — `GET /api/products?search=keyword` |
| User Prompt | hãy thực hiện cập nhật phần audit tôi sẽ xem lại và đề xuất 5 test case khác |
| Evidence/Input Basis | User-uploaded `PoolA-FR05-ProductSearch-test-AUDITED.md`; previous Step A-E approvals; prior review feedback on AI-FR05-013, AI-FR05-035, AI-FR05-040 and the five human-added cases |
| Generated/Modified Files | Updated conversation artifact `PoolA-FR05-ProductSearch-test-AUDIT-UPDATED.md`; `HW06/reports/ai-audit-report.md` |
| AI Output | Revised the audit summary from 34 VALID / 8 INCOMPLETE to 32 VALID / 10 INCOMPLETE. `AI-FR05-035` and `AI-FR05-040` were changed to INCOMPLETE because their error-trigger inputs were not concrete/reproducible. `AI-FR05-013` remains INCOMPLETE, but its reason now explicitly avoids inventing a mandatory Content-Type requirement and preserves the SEC-04 API-vs-UI boundary. Removed the previous HUM-FR05-001..005 set from the retained suite so the reviewer can propose five new genuinely human-authored cases. Current retained suite: 42 AI cases, 0 human-added cases pending replacement. No execution/evidence/defect fields were populated. |

Human Review:
- Status: Pending reviewer re-check of the revised audit and pending five new human-authored cases
- Accepted:
- Modified:
- Removed: Previous HUM-FR05-001..005 from the retained suite
- Added: None — AI intentionally did not generate replacement HUMAN cases
- Notes: Human provenance requirement remains unsatisfied until the reviewer supplies five new cases.

## AI Audit Entry - AI-013

| Field | Content |
| --- | --- |
| AI Tool | ChatGPT |
| Date and Time | 2026-08-20T17:05:00+07:00 |
| Stage | Phase 4 / API 1 / Step H — Human-added testcase translation and tightening |
| API | FR-05 Product Search — `GET /api/products?search=keyword` plus documented product mutation APIs where applicable |
| User Prompt | Vậy hãy chuyển sang tiếng anh và cập nhật giúp tôi |
| Evidence/Input Basis | Six reviewer-authored HUMAN-FR05-043..048 proposals supplied directly in chat; previously approved Gate A-E decisions; audit decision to exclude unsupported draft/published lifecycle assumptions |
| Generated/Modified Files | Conversation artifact `PoolA-FR05-ProductSearch-test-AUDIT-FINAL.md`; `HW06/reports/ai-audit-report.md` |
| AI Output | Translated and tightened the reviewer-authored human cases while preserving HUMAN provenance. Retained five cases: 043 cross-user header-context characterization, 044 concurrent search isolation, 046 rename→search state-history, 047 documented delete→search state-history, and 048 repeated expensive-search robustness. Removed 045 because draft/unpublished/published product lifecycle states are unsupported by the current source. Case 043 was constrained to characterization until X-Student-Id semantics are confirmed; 044 now uses a fixed reproducible workload; 046 removes any assumed eventual-consistency window; 047 removes hidden/soft-delete assumptions; 048 remains robustness/characterization because rate/abuse policy is NOT SPECIFIED. No execution evidence or defects were created. |

Human Review:
- Status: Pending final human confirmation of the five retained HUMAN cases
- Accepted: Reviewer authorship/provenance of HUMAN-FR05-043, 044, 046, 047, 048
- Modified: English wording and scope tightened to remove unsupported assumptions
- Removed: HUMAN-FR05-045 from the retained set
- Added: None — no new HUMAN testcase invented by AI
- Notes: The downloadable conversation artifact is the updated review copy. The existing local project testcase source is not overwritten automatically by this entry; synchronize only after the reviewer accepts the five retained cases.
