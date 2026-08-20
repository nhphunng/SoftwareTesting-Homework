# HW06 Testcase and Evidence Contract

Use this reference when generating, auditing, implementing, executing, or reporting API testcases.

## Testcase record

Each testcase should preserve enough information to be independently reviewable and traceable.

Recommended fields:

| Field | Purpose |
| --- | --- |
| ID | Stable testcase identifier |
| Source | `AI` or `HUMAN` |
| API | Assigned API/feature |
| Requirement Basis | FR, SEC, parameter/domain, state, schema, or risk basis |
| Category | Functional / Domain / Boundary / State / Security / Schema |
| Preconditions | Required user, role, data, and state |
| Input | Path/query/body/file/test data |
| Steps | Reproducible request sequence |
| Expected Status | Status code only when supported by the spec/contract |
| Expected Response | Business expectation |
| Expected Schema | Relevant schema expectation |
| Security Expectation | Authorization/ownership/security expectation where applicable |
| State Before | State before request where applicable |
| State After | Expected state after request where applicable |
| AI Rationale | Why AI proposed the testcase |
| Human Audit Status | `VALID` / `INVALID` / `INCOMPLETE` after human review |
| Human Audit Reason | Reason for the human decision |
| Corrected Test | Corrected version when required |
| Execution Status | PASS / FAIL / BLOCKED after real execution |
| Actual Result | Real observed result only |
| Evidence | Repository-relative evidence path/link |
| Bug ID | Confirmed bug reference if applicable |

Do not fill human-review or execution fields with invented values.

## AI-generated coverage target

Per assigned API, target at least 35 AI-generated testcases covering applicable areas:

- domain partitions for every parameter
- boundary/negative behavior
- state transitions where applicable
- security requirements `SEC-01`–`SEC-07` where applicable
- response/error schema validation

Generate in reviewable batches rather than one generic prompt. Suggested batch purposes:

1. happy path and basic validation
2. domain partitions
3. boundary and negative cases
4. state-dependent behavior
5. security
6. schema validation
7. coverage-gap/deduplication review

The batch names are guidance, not a requirement to force irrelevant categories onto an API.

## Human audit contract

Preserve every original AI testcase. For each case, human review eventually records:

- `VALID` — correct and sufficiently specified
- `INVALID` — contradicts the specification or is otherwise wrong
- `INCOMPLETE` — potentially useful but missing necessary precondition/input/expected result/state/schema/detail

When correcting an invalid/incomplete testcase, keep both the original and corrected version.

## Human-added testcase boundary

The assignment requires at least five testcases per API that the student adds because AI missed them.

AI may:

- identify uncovered dimensions
- point to suspicious interactions
- explain why an existing AI suite may be incomplete
- review a human-authored testcase after the tester supplies it

AI must not:

- generate five cases and mark `Source = HUMAN`
- rewrite provenance to make an AI-authored case look human-created
- claim the human requirement is satisfied without tester confirmation

## Postman implementation contract

Every real request must carry:

```http
X-Student-Id: {{studentId}}
```

Prefer shared collection/environment configuration where appropriate. The suite should use meaningful Postman features such as variables, environments, pre-request scripts, test scripts, Collection Runner, and data-driven files where they improve the test design.

Do not use a feature only to claim coverage in the report.

## Execution evidence contract

Only real execution can produce:

- request/response observations
- PASS/FAIL/BLOCKED status
- Newman CLI output
- Newman HTML report
- screenshots
- measured response details

For each unexpected result, first distinguish test/setup/environment/specification problems from a potential product defect.

Never fabricate, manually alter, or summarize invented execution output as evidence.

## Bug evidence contract

A confirmed bug record should contain:

- Bug ID/title
- affected API and requirement
- severity/rationale
- preconditions
- exact reproduction steps/request
- expected result
- actual result
- real evidence
- reproducibility/environment
- provenance: AI-generated test or human-added test

GitHub Issue creation comes only after the tester confirms the defect is genuine.
