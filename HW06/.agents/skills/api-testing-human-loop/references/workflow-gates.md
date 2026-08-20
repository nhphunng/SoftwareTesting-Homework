# API Testing Human Review Gates

Use these gates to keep API testing reviewable without turning every project into the same rigid process. A project may rename, combine, or omit gates when the testing contract justifies it.

## Gate A — Contract accepted

Before relying on the API contract for downstream test design, the tester reviews the extracted expectations:

- endpoint and HTTP method
- authentication/authorization
- inputs and constraints
- business rules
- success/error behavior
- response schema
- ownership/security rules
- state/sequence rules
- project-specific constraints

Any material uncertainty remains `UNRESOLVED`. Do not silently infer it.

## Gate B — Input/domain model accepted

Before treating input coverage as adequate, review that:

- every applicable input is considered
- meaningful valid/invalid/boundary/missing/empty/null/type/format/length classes are covered
- boundaries come from the contract or an explicit test hypothesis
- redundant partitions are removed or justified

Not every input needs every generic partition type.

## Gate C — State/sequence model accepted

When behavior depends on state or prior requests, review:

- relevant states/preconditions
- valid transitions/sequences
- invalid transitions/sequences
- terminal states
- repeated/idempotent operations
- ownership/permission effects
- concurrency/race behavior when applicable

If state testing is not applicable, record why rather than creating artificial transitions.

## Gate D — Security coverage accepted

Review applicable risks based on the API's threat surface and project requirements, for example:

- unauthenticated access
- authorization/role escalation
- ownership/IDOR/BOLA
- injection
- mass assignment/unexpected fields
- token/session misuse
- information disclosure
- rate/abuse behavior
- file/upload/import risks

Named security requirements supplied by the project should be mapped explicitly. Do not claim complete security coverage from a generic checklist alone.

## Schema/response checkpoint

Review exact success and error response expectations where defined:

- required fields
- primitive types
- arrays/nesting
- enums
- nullability
- formats
- additional properties
- headers/content types when relevant

Schema uncertainty should remain explicit before tests depend on it.

## Gate E — AI-generated testcase review completed

When AI generates testcases, preserve enough information to review each one. The human reviewer should eventually determine whether each case is:

- correct/usable
- incorrect
- incomplete
- duplicate/redundant
- unsupported by the contract

If the project defines labels such as `VALID / INVALID / INCOMPLETE`, use those labels. AI may propose a classification, but should not represent its own judgment as completed human review.

## Gate F — Human-authored additions confirmed when required

Some projects or assignments require testcases that must originate from a human reviewer after inspecting AI gaps.

When such a requirement exists:

- AI may identify coverage gaps or risky dimensions
- the tester authors or explicitly confirms the required human additions
- provenance is preserved
- AI-authored content must not be relabeled as human-authored

If no such project requirement exists, this gate may simply confirm that the human reviewer is satisfied with coverage gaps and extensions.

## Runtime-data readiness checkpoint

After test implementation and before official execution, verify that the runtime setup required by the suite is real and reproducible.

Review when applicable:

- reachable SUT/base URL
- required users, tokens, roles, and ownership relationships
- controlled input values and fixture files
- resource IDs and required initial states
- dedicated/disposable records for mutation tests
- setup procedure
- cleanup/reset procedure
- unresolved runtime dependencies

Do not fabricate data, IDs, tokens, files, state, or expected dataset values merely to unblock automation.

A useful readiness classification is:

```text
READY
BLOCKED — missing runtime data
BLOCKED — missing auth/role
BLOCKED — unsafe mutation setup
```

Official execution evidence should not begin for a testcase until its required runtime preconditions are known and reproducible. Syntax validation or a clearly labeled smoke check may occur earlier, but it is not official evidence.

## Gate G — Execution result reviewed

Only real execution can establish observed results. Before defect analysis, distinguish unexpected behavior among:

- test implementation defect
- test-data/setup problem
- environment problem
- contract ambiguity
- potential product defect

Do not populate measured/observed fields from hypothetical execution.

## Gate H — Defect confirmed

A failed testcase becomes a confirmed defect only after review of:

1. expected behavior and its basis
2. reproducible request/sequence
3. actual observed behavior
4. real execution evidence
5. environment/test data
6. competing explanations such as test or setup defects

Only after confirmation should the workflow create or finalize an issue/bug record as a genuine product defect.
