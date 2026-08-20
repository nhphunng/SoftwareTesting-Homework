---
name: api-testing-human-loop
description: Guide reusable API testing with explicit human approval gates. Use when analyzing an API contract, designing domain/state/security/schema coverage, generating or auditing test cases, implementing automated API tests, interpreting execution evidence, or evaluating defect candidates without allowing AI to silently replace required human judgment.
---

# API Testing Human-in-the-Loop

Guide API testing as a reusable, evidence-driven workflow. AI may analyze, propose, generate, implement, and review; the human tester owns acceptance of requirements, review judgments, provenance-sensitive work, execution evidence, and defect confirmation.

## Load the task context

Before material work, identify and read the sources that define the current testing task:

1. API contract/specification (OpenAPI, API documentation, requirements, source contract, or equivalent).
2. Project/test plan or assignment instructions, if any.
3. Existing test artifacts and execution evidence for the API under test.
4. [references/workflow-gates.md](references/workflow-gates.md).
5. [references/testcase-evidence-contract.md](references/testcase-evidence-contract.md) when generating, reviewing, executing, or reporting tests.

Treat project-specific requirements as **inputs**, not permanent skill rules. Examples include required testcase counts, required headers, named security controls, specific tools, evidence formats, CI requirements, or minimum human-authored cases.

## Establish the testing contract

Before designing tests, extract or explicitly mark unknown:

- endpoint and HTTP method
- authentication and authorization model
- path/query/header/body/file inputs
- input constraints and business rules
- success and error responses
- response schema
- resource ownership rules
- state-dependent behavior
- relevant security requirements
- project-specific testing constraints

Do not invent missing contract details. Mark material unknowns as `UNRESOLVED` and identify what source or human decision is needed.

## Work stage by stage

Use this progression when applicable:

```text
Contract analysis
→ Human Gate A
→ Input/domain partition design
→ Human Gate B
→ State/sequence analysis
→ Human Gate C
→ Security/authorization analysis
→ Human Gate D
→ Schema/response analysis
→ AI testcase generation
→ Human Gate E: review AI-generated cases
→ Human Gate F: confirm human-authored additions when required
→ Test implementation
→ Runtime test data & preconditions preparation
→ Real execution
→ Human Gate G: review execution
→ Defect analysis
→ Human Gate H: confirm genuine defects
```

Not every API requires every analytical dimension. Skip or collapse stages only when non-applicability is explicit and justified. Do not silently advance across a required human gate. See [references/workflow-gates.md](references/workflow-gates.md).

## Prepare runtime test data and preconditions before execution

After test implementation and before any official execution/evidence run, establish the real runtime inputs needed to make the suite reproducible.

For each API, identify when applicable:

- real base URL / reachable SUT instance
- required users, tokens, roles, and ownership relationships
- controlled matching/non-matching values
- resource IDs and initial states
- dedicated/disposable records for mutation tests
- upload/import fixtures
- setup path and cleanup/reset strategy
- unresolved runtime dependencies

This stage is API-specific. Do not reuse another API's fixture model mechanically.

Examples:

- search APIs may need known matching/no-match keywords and disposable products for mutation→search scenarios
- stateful order APIs may need reproducible resources in several documented states and correct actor ownership
- import/upload APIs may need controlled valid/invalid files, auth roles, baseline data, rollback verification data, and cleanup rules

Do not fabricate tokens, IDs, resources, state, files, or dataset assumptions merely to make automation pass.

Classify readiness explicitly when useful:

```text
READY
BLOCKED — missing runtime data
BLOCKED — missing auth/role
BLOCKED — unsafe mutation setup
```

Do not start the official evidence run for a testcase until its required preconditions are real, known, and reproducible. A syntax-only or smoke validation may happen earlier, but it must not be represented as official execution evidence.

## Preserve contract fidelity

- Do not invent endpoints, fields, roles, status codes, schema rules, state transitions, or security expectations.
- Distinguish source-derived facts from AI inference and test-design proposals.
- Trace each testcase to at least one basis: contract rule, input partition, business rule, state/sequence rule, schema rule, security requirement, or explicitly identified risk.
- Do not force generic security or state cases onto an API when they are not applicable.
- When implementation behavior and documentation conflict, record the conflict; do not silently redefine the expected result.

## Preserve human ownership and provenance

When a task requires human review or human-authored work:

- Keep AI-generated cases labeled as AI-generated.
- AI may suggest review classifications and corrections, but do not present those suggestions as completed human review until the tester confirms them.
- AI may identify coverage gaps for human investigation, but must not relabel AI-authored testcases as human-authored.
- Preserve original AI output when correcting it if the workflow requires an audit trail.
- Do not mark a defect genuine until the expected behavior, reproducibility, actual behavior, and real evidence have been reviewed.

If the current project has no provenance-sensitive human requirement, these rules still apply to factual review and defect confirmation, but do not invent artificial approval work.

## Evidence integrity

Never fabricate or simulate as real evidence:

- API execution
- request/response results
- test-run output
- CLI/HTML reports
- screenshots
- CI/CD runs
- issue-tracker records
- logs or measurements
- human judgments

When analyzing execution, identify the exact evidence source and separate observed facts from AI interpretation.

## Tool and framework neutrality

Do not assume Postman/Newman. Use the tools selected by the project, such as Postman/Newman, Karate, REST Assured, pytest, Playwright APIRequest, curl-based harnesses, or another suitable framework.

When the project mandates a tool or feature, follow that requirement. Otherwise choose based on the existing stack, maintainability, data-driven needs, reporting, and CI integration.

## Output discipline

Write artifacts to the locations defined by the current project. Do not impose a folder structure from a previous project on unrelated work.

When creating testcase artifacts, follow [references/testcase-evidence-contract.md](references/testcase-evidence-contract.md) and adapt optional fields to the API and project.

If an AI-audit mechanism exists in the current project, use it after material AI assistance. Do not assume a specific audit skill or report path unless the project defines one.
