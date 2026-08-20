---
name: api-testing-human-loop
description: Guide the reviewed HW06 API-testing workflow for the three assigned APIs. Use when analyzing the API specification, designing partitions/state/security/schema coverage, generating or auditing test cases, preparing Postman/Newman work, interpreting execution evidence, or evaluating bug candidates; stop at required human approval gates instead of silently advancing.
---

# HW06 API Testing Human-in-the-Loop

Guide one HW06 API-testing stage at a time. AI may analyze, propose, generate, and review, but the tester owns requirement acceptance, testcase audit, human-added tests, execution evidence, and bug confirmation.

## Load required context

Read before material work:

1. `HW06/2026.HW06.API Testing_En.md`
2. `HW06/plan.md`
3. The SUT `api_specification.md` once it is available locally
4. The current API folder and existing artifacts for the stage being performed
5. [references/workflow-gates.md](references/workflow-gates.md)
6. [references/testcase-evidence-contract.md](references/testcase-evidence-contract.md) when generating, auditing, executing, or reporting tests

Use these fixed assignments unless the tester explicitly changes them:

- `PoolA-FR-05-ProductSearch` — `GET /api/products?search=keyword` — FR-05
- `PoolB-FR-10-CancelOrder` — `PUT /api/orders/:id/cancel` — FR-10
- `PoolC-FR-16-ImportProducts` — `POST /api/admin/import-products` — FR-16

## Work stage by stage

Determine the current stage from `plan.md` and existing artifacts. Perform only that stage plus the minimum verification needed to make its output reviewable.

The normal progression is:

```text
Specification analysis
→ Human Gate A
→ Domain partition design
→ Human Gate B
→ State-transition analysis
→ Human Gate C
→ Security analysis
→ Human Gate D
→ Schema analysis
→ AI testcase generation
→ Human Gate E: audit AI cases
→ Human Gate F: confirm human-added cases
→ Postman implementation
→ Real execution
→ Human Gate G: review execution
→ Bug analysis
→ Human Gate H: confirm genuine bugs
```

Do not advance across a required gate unless the tester has explicitly accepted the relevant artifact or supplied the human judgment required at that gate. See [references/workflow-gates.md](references/workflow-gates.md) for gate semantics.

## Preserve specification fidelity

- Do not invent endpoints, fields, roles, status codes, schema rules, state transitions, or security requirements.
- If the specification does not resolve a material expectation, mark it `UNRESOLVED` and identify exactly what evidence is missing.
- Distinguish specification-derived facts from AI inference or test-design proposals.
- Trace every testcase to at least one concrete basis: FR, SEC requirement, parameter/domain rule, state rule, schema rule, or explicitly identified risk.
- Do not force a generic security/state testcase onto an API when it is not applicable; record the non-applicability rationale instead.

## Protect the human work required by the assignment

- AI-generated cases must remain labeled as AI-generated.
- Do not author the student's required `>=5` human-added cases and present them as human-created work. AI may identify coverage gaps or risk areas for the tester to investigate, but the final human-added cases must be authored/confirmed by the tester.
- For AI-generated test audit, AI may propose `VALID`, `INVALID`, or `INCOMPLETE` with reasoning, but treat that classification as pending until the tester performs or confirms the human review.
- Preserve the original AI testcase when correcting it so the audit trail shows original → review → correction.
- Do not mark a bug genuine until specification, reproducibility, expected result, actual result, and real execution evidence have been checked.

## Evidence integrity

Never fabricate or simulate as real evidence:

- `X-Student-Id` console/header proof
- Postman execution
- Newman CLI/HTML output
- request/response results
- screenshots
- GitHub Actions runs
- GitHub Issues
- bug reproduction evidence
- demo video evidence
- the final self-drawn AI test-generator diagram

When analyzing execution, identify the exact real artifact used and separate observed facts from AI interpretation.

## Output discipline

Write artifacts into the assigned API folder for the current stage, using the paths defined in `plan.md`. Keep shared Postman/Newman assets under `HW06/postman/` and shared reports under `HW06/reports/`.

When creating testcase artifacts, follow [references/testcase-evidence-contract.md](references/testcase-evidence-contract.md).

After any material AI assistance, use `$ai-audit-report` to append the interaction to `HW06/reports/ai-audit-report.md` and leave human review pending unless the tester explicitly provides the review.
