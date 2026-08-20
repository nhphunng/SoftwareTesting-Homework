# HW06 API Testing Workflow Gates

Use this reference when deciding whether the API-testing workflow may advance to the next stage.

## Gate A — Requirement mapping accepted

Before domain partitioning, the tester reviews the extracted API contract:

- endpoint and HTTP method
- FR mapping
- authentication/authorization
- parameters and constraints
- request/response schemas
- expected status/error responses
- applicable SEC requirements
- state rules

Any missing material requirement remains `UNRESOLVED`. Do not silently infer it.

## Gate B — Domain partition model accepted

Before treating domain coverage as complete, the tester checks that:

- every applicable parameter is covered
- valid/invalid/boundary/missing/empty/null/type/format/length classes are considered where meaningful
- boundaries come from the specification, not invented limits
- redundant partitions are removed or justified

## Gate C — State model accepted

If the API has state-dependent behavior, the tester reviews:

- states and initial/precondition state
- valid transitions
- invalid transitions
- terminal/non-cancelable states
- repeated operations
- permission/ownership effects

For an API without an explicit state machine, record why state-transition testing is not applicable or what limited state behavior still matters.

## Gate D — Security coverage accepted

The tester reviews the mapping between the API and applicable `SEC-01`–`SEC-07` requirements.

Consider only applicable risks, such as:

- unauthenticated access
- authorization/role escalation
- IDOR/ownership
- injection
- malformed/unexpected fields
- token/session validity
- information disclosure
- import/file-specific security risks

Do not claim full SEC coverage simply because seven generic security cases exist.

## Schema analysis checkpoint

Schema analysis follows accepted requirement/security context. It should cover the exact success/error response contract, including required fields, types, arrays/nesting, enums, nullability, formats, and additional properties when the specification defines them.

This checkpoint does not require a separate approval gate in the current plan, but schema uncertainty must be resolved or marked `UNRESOLVED` before testcase generation relies on it.

## Gate E — AI-generated testcase audit completed

The assignment requires human review of every AI-generated testcase.

For each AI testcase, preserve:

- original AI testcase
- proposed or human-confirmed status: `VALID`, `INVALID`, or `INCOMPLETE`
- reason
- correction where required

AI may assist by suggesting a classification, but do not represent AI's own classification as the student's completed human audit without explicit confirmation.

## Gate F — Human-added testcase set confirmed

The tester must provide at least five genuinely human-added testcases per API that AI missed.

AI may surface coverage gaps and explain likely blind spots, but must not generate those cases and label them as human-created.

Each confirmed human-added case should record why AI missed it, such as:

- prompt limitation
- missing context
- model limitation
- specification ambiguity
- API-specific behavior
- cross-request/state-history reasoning
- ownership/security assumption

## Gate G — Execution result reviewed

Only real Postman/Newman execution can populate execution status and actual result.

Before progressing to bug analysis, the tester distinguishes each unexpected result as:

- test implementation defect
- test-data/setup issue
- environment issue
- specification ambiguity
- potential SUT defect

## Gate H — Bug confirmed

A testcase failure becomes a genuine bug only after review of:

1. applicable specification/requirement
2. reproducible steps
3. expected result
4. actual result
5. real execution evidence
6. environment/test data

Only then create or finalize the Markdown bug report and GitHub Issue.
