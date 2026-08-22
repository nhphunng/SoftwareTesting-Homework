# AI-Driven API Test Generator

This folder contains the optional implementation for HW06 Phase 7 / P12.

## Design goal

Convert an API specification section into a structured, auditable set of **candidate** tests while preserving uncertainty instead of hallucinating contract details.

The implementation is dependency-free Node.js and intentionally does not call an external LLM. It models the AI-agent workflow deterministically so the generated artifact is reproducible and easy to audit.

## Supported input

```text
--spec       path to Markdown/text API specification
--endpoint   exact METHOD + path
--fr         selected FR identifier
--security   explicit security requirements supplied by caller
--format     json | markdown
--out        output path
```

## Example

```bash
node agent-skill/api-test-generator/generate.mjs \
  --spec source/api_specification.md \
  --endpoint "POST /api/admin/import-products" \
  --fr FR16 \
  --security "SEC-02 valid JWT required; SEC-03 admin role required" \
  --format json \
  --out agent-skill/demo/fr16-generator-output.json
```

## Output contract

```text
requirementModel
endpointModel
coverageModel
candidateTests[]
auditMetadata
finalizationGate = HUMAN_REVIEW_REQUIRED
```

## Important limitation

The generator only sees the source inputs supplied to it. For example, `source/api_specification.md` documents FR16's JSON `products[]` body and the parent admin authentication requirement, but it does not state the full business rules previously extracted from the SUT README (such as positive-price validation or atomic rollback). Therefore this demo must not invent those rules.

To obtain stronger contract-level tests, provide those business/security requirements explicitly as source input and still send the resulting candidates through human review.
