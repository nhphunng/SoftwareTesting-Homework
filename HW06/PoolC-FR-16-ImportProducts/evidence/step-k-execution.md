# FR-16 Step K — Real Newman Execution

## Scope

- API: `POST /api/admin/import-products`
- Feature: FR-16 Import Products
- Runner: `./scripts/run-step-k.sh FR16`
- Base URL: `http://localhost:3000`
- Student header: `X-Student-Id: 23127194`
- Runtime-ready testcase IDs executed: 46
- Documented blocked testcase IDs not executed: 11

## Execution sequence

1. Human approved Step J runtime readiness.
2. `./scripts/run-step-k.sh FR16` was executed against the live EShop SUT using the private git-ignored FR16 environment and prepared runtime data.
3. Newman completed and returned exit code `1`, preserving raw CLI/JSON/HTML/JUnit evidence.
4. The first compact summary incorrectly counted 43 testcase IDs and omitted the failing HUMAN ID because `scripts/extract-newman-summary.js` recognized `HUMAN-FR..` but not the FR16 Step H naming convention `HUM-FR..`.
5. This was classified as a reporting-tool implementation defect. The extractor regex was expanded to support `AI`, `HUMAN`, and `HUM` prefixes.
6. The compact summary was regenerated from the same raw Newman JSON. The SUT was not rerun for this reporting correction.

## Final current Newman result

| Metric | Result |
| --- | ---: |
| Testcase IDs executed | 46 |
| Requests observed by Newman | 195 |
| Assertions | 388 |
| Assertions passed | 342 |
| Assertions failed | 46 |
| Testcase IDs with failures | 17 |
| Testcase IDs without failures | 29 |
| X-Student-Id exact match | 195/195 |
| Newman exit code | 1 |

Failed testcase IDs:

- `AI-FR16-013`
- `AI-FR16-014`
- `AI-FR16-015`
- `AI-FR16-019`
- `AI-FR16-020`
- `AI-FR16-024`
- `AI-FR16-025`
- `AI-FR16-026`
- `AI-FR16-027`
- `AI-FR16-028`
- `AI-FR16-029`
- `AI-FR16-035`
- `AI-FR16-037`
- `AI-FR16-043`
- `AI-FR16-045`
- `AI-FR16-051`
- `HUM-FR16-006`

## Observed failure clusters

### Cluster A — FR-16 invalid-row handling / atomic rollback

Affected evidence includes:

- empty/missing/null-name rollback cases: `AI-FR16-013`, `014`, `015`
- non-positive price cases: `AI-FR16-019`, `020`
- invalid row at first/middle/final positions: `AI-FR16-024`, `025`, `026`
- multiple-invalid / sequence cases: `AI-FR16-027`, `028`, `029`
- validation-failure schema path: `AI-FR16-043`
- mixed-type invalid batch: `AI-FR16-051`
- repeated identical invalid batch: `HUM-FR16-006`

Real follow-up GET evidence shows rows from invalid batches persisted when the approved FR-16 oracle requires zero persistence for the entire batch. Examples observed in the raw/compact evidence include persisted products with `price:0` and `price:-1`, valid companion rows remaining after invalid-name batches, and accumulation across repeated invalid-batch submissions.

Classification: **Potential genuine SUT defect(s)**. The evidence directly conflicts with FR-16's positive-price validation and all-or-nothing rollback requirements. Human Gate H is required before deciding final defect grouping/reporting.

### Cluster B — Admin-role authorization

Affected evidence:

- `AI-FR16-035` — valid non-admin JWT cannot import
- `AI-FR16-037` — non-admin JWT plus privileged-looking body fields
- `AI-FR16-045` — non-admin authorization response/persistence path

Real persistence verification shows the product marker exists after the non-admin request. This conflicts with FR-12/SEC-03, which requires admin role for admin APIs.

Classification: **Potential genuine SUT defect**. Human Gate H is required before confirmation/reporting.

## Gate G classification

| Finding | Classification | Reason |
| --- | --- | --- |
| Initial summary reports 43 IDs and omits HUMAN failed ID | Test/reporting implementation defect | Extractor accepted `HUMAN-FR..` but FR16 uses `HUM-FR..`; corrected and re-extracted from the same raw evidence. |
| Invalid-name / invalid-price / mixed-invalid batches persist rows | Potential genuine SUT defect | Real persistence contradicts FR-16 validation/atomic rollback rules. |
| Repeated invalid batch accumulates persisted rows (`HUM-FR16-006`) | Potential genuine SUT defect | Each invalid attempt is required to contribute zero rows, but marker count grows across attempts. |
| Valid non-admin JWT imports products | Potential genuine SUT defect | Real persistence contradicts FR-12/SEC-03 admin-role requirement. |
| 11 Step J blockers | Not executed / not failed | Missing faithful CSV transport, safe DB-error trigger, logout endpoint, or role-promotion endpoint; no endpoint/transport was invented. |

## Static implementation correlation

Static source inspection correlates with the runtime findings:

- the FR16 handler uses `authenticateToken` but has no visible admin-role check;
- it checks missing/falsy `name` row-by-row but inserts other rows individually;
- it has no explicit `price > 0` validation;
- inserts are performed without a visible transaction/rollback boundary.

These observations support diagnosis but are not substitutes for the real Newman evidence above.

## Evidence files

Raw evidence source of truth:

- `postman/newman/FR16-official-cli.txt`
- `postman/newman/FR16-official-report.json`
- `postman/newman/FR16-official-report.html`
- `postman/newman/FR16-official-report.xml`

Compact AI-consumption evidence:

- `postman/newman/FR16-execution-summary.json`
- `postman/newman/FR16-execution-summary.md`

Runtime setup evidence:

- `PoolC-FR-16-ImportProducts/postman/runtime-fixture-manifest.json`
- `PoolC-FR-16-ImportProducts/postman/runtime-preconditions.md`
- `postman/data/FR16-runtime-data.json`

## Rerun note

`HUM-FR16-003` consumes/deletes its disposable category. Before any fresh official rerun, rerun the Step J preparation script with valid runtime JWTs to create a fresh `humanStaleCategoryId` and refresh the private environment.

## Human gate status

- Step J: APPROVED by tester
- Step K real execution: COMPLETE
- Gate G execution classification: PREPARED
- Potential SUT defect cluster A: invalid-row validation / atomic rollback violation
- Potential SUT defect cluster B: missing admin-role authorization on import
- Human Gate H defect confirmation: PENDING
- Bug report / GitHub Issue: NOT YET CREATED
