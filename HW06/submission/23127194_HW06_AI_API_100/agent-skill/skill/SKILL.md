# API Test Generator Skill

## Purpose

Generate **audit-ready candidate API testcases** from a supplied API specification and a selected endpoint/FR. The skill is human-in-the-loop by design: output is never considered final until a human review gate classifies and corrects the candidates.

## Inputs

- `spec path` — Markdown/text API specification.
- `selected endpoint/FR` — e.g. `POST /api/admin/import-products`, `FR16`.
- `security requirements` — optional explicit security text supplied by the caller.
- `output format` — `json` or `markdown`.

## Outputs

- requirement model;
- endpoint model;
- coverage model;
- candidate testcases;
- audit-ready metadata;
- explicit unresolved assumptions;
- human-review gate status.

## Required internal stages

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
→ Final Test Cases (human-approved only)
```

## Safety / provenance rules

1. Never invent an exact status code, schema field, validation limit, state rule, or authorization rule that is absent from the provided sources.
2. When a useful test depends on an unsupported expectation, emit it as `CHARACTERIZATION` or `NEEDS_HUMAN_REVIEW` rather than pretending it is a contract assertion.
3. Never generate PASS/FAIL, actual responses, screenshots, runtime logs, or defect claims without real execution evidence.
4. Every generated testcase must keep `source = AI_CANDIDATE` until human review.
5. Human-added cases must remain `source = HUMAN`; the generator must not relabel them as AI-generated.
6. Preserve source evidence and unresolved assumptions in the output.
7. Deduplicate by testing intent and input shape, not merely by title text.

## CLI

```bash
node agent-skill/api-test-generator/generate.mjs \
  --spec source/api_specification.md \
  --endpoint "POST /api/admin/import-products" \
  --fr FR16 \
  --security "valid JWT required; admin role required" \
  --format json \
  --out agent-skill/demo/fr16-generator-output.json
```

## Human review requirement

The CLI intentionally exits successfully after producing **candidate** tests, but the output contains:

```text
finalizationGate = HUMAN_REVIEW_REQUIRED
```

No downstream workflow should treat those candidates as final without an explicit human decision.
