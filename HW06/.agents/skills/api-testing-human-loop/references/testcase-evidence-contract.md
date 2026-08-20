# Reusable API Testcase and Evidence Contract

Use this reference when generating, reviewing, implementing, executing, or reporting API testcases. Adapt optional fields and thresholds to the current project rather than hard-coding assignment-specific requirements.

## Testcase record

A testcase should preserve enough information to be independently reviewable and traceable.

Recommended fields:

| Field | Purpose |
| --- | --- |
| ID | Stable testcase identifier |
| Source | Provenance such as AI / HUMAN / EXISTING |
| API | Endpoint or feature under test |
| Requirement Basis | Contract, business rule, security requirement, state rule, schema rule, or risk |
| Category | Functional / Domain / Boundary / State / Security / Schema / Other |
| Preconditions | Required identity, role, resource data, state, and setup |
| Input | Path/query/header/body/file/test data |
| Steps | Reproducible request sequence |
| Expected Status | Status code when supported by the contract |
| Expected Response | Business expectation |
| Expected Schema | Relevant response/schema expectation |
| Security Expectation | Authorization/ownership/security expectation when applicable |
| State Before | Pre-request state when applicable |
| State After | Expected post-request state when applicable |
| Rationale | Why this testcase exists |
| Human Review Status | Project-defined review result when human review is required |
| Human Review Reason | Basis for the review decision |
| Corrected Test | Corrected version where auditability matters |
| Execution Status | PASS / FAIL / BLOCKED or project-defined equivalent after real execution |
| Actual Result | Real observed result only |
| Evidence | Evidence path/link/reference |
| Defect ID | Confirmed defect reference if applicable |

Do not fill human-review or execution fields with invented values.

## Coverage design

Determine coverage from the API contract and risk profile. Common dimensions include:

- happy path/business success
- input domain partitions
- boundaries and malformed input
- missing/empty/null/type/format behavior
- state transitions and request sequences
- authentication/authorization/ownership
- injection and unexpected fields
- schema/content-type/header validation
- idempotency/retries
- concurrency/races where meaningful
- pagination/filter/sort/search behavior
- upload/import/file behavior
- error handling and information disclosure

Do not force irrelevant categories merely to satisfy a generic checklist.

If the project requires a minimum testcase count or specific categories, treat those as current-project constraints and verify them explicitly.

## AI-generated testcase review

Preserve original AI-generated testcases when the workflow requires auditing AI output.

For each AI testcase, a human reviewer may classify it using the project's labels. Common outcomes include:

- valid/correct
- invalid/incorrect
- incomplete
- duplicate/redundant
- unsupported by requirements

AI may propose classifications and corrections, but provenance must remain visible until human review is explicitly completed.

## Human-authored testcase boundary

When a project requires human-authored additions, AI may:

- identify uncovered dimensions
- point to suspicious interactions
- explain likely model blind spots
- review a testcase after the tester supplies it

AI must not:

- generate required human-origin cases and mark them as human-created
- rewrite provenance to disguise AI authorship
- claim a human-authorship requirement is satisfied without tester confirmation

If the project has no such provenance requirement, human and AI may collaborate normally while still preserving review ownership.

## Test implementation contract

Use the framework chosen by the current project. Examples include:

- Postman/Newman
- Karate
- REST Assured
- pytest + requests/httpx
- Playwright APIRequest
- curl/custom harnesses

Respect project-required headers, authentication, environment variables, data-driven inputs, naming conventions, reports, and CI integration. Do not inject assignment-specific headers or tool features unless the current project requires them.

Prefer reusable setup, variables, fixtures, helpers, and data-driven design when they improve clarity and maintainability.

## Execution evidence contract

Only real execution can establish:

- actual request/response observations
- PASS/FAIL/BLOCKED status
- CLI/test-run output
- HTML/XML/JSON reports
- screenshots
- measured response details
- CI results

For each unexpected result, first distinguish test/setup/environment/contract problems from a potential product defect.

Never fabricate, hand-edit, or present hypothetical execution as real evidence.

## Defect evidence contract

A confirmed defect should normally capture:

- identifier/title
- affected API/feature
- requirement or expected-behavior basis
- severity/impact rationale when required
- preconditions
- exact reproduction steps/request
- expected result
- actual result
- real evidence
- reproducibility/environment
- testcase provenance when relevant

Create or finalize an external issue only after the human tester confirms the defect and the project permits that action.
