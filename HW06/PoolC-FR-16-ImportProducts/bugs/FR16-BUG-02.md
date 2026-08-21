# FR16-BUG-02 — Import violates atomic all-or-nothing rollback

GitHub Issue: https://github.com/nhphunng/SoftwareTesting-Homework/issues/29

## Summary

When an import batch contains an invalid row, `POST /api/admin/import-products` persists other rows from the same batch instead of rolling the entire import back.

## Severity

**High** — partial imports leave the catalog in a state explicitly forbidden by FR-16 and make bulk-import results unreliable.

## Requirement basis

FR-16 explicitly requires: if any row contains an error, the entire import must be rolled back. Contract invariant: `Any invalid row -> zero products from that import persist`.

## Related testcases

- `AI-FR16-013`, `014`, `015`
- `AI-FR16-024`, `025`, `026`, `027`, `028`, `029`
- `AI-FR16-043`, `051`
- `HUM-FR16-006`

## Preconditions

- Valid admin JWT
- Existing valid category
- Batch with at least one FR-16-invalid row and uniquely marked companion rows
- `X-Student-Id: 23127194` on every request

## Reproduction

1. Prepare a batch containing both valid and invalid rows; for example an invalid name or `price: 0` plus a valid companion row.
2. Send the batch to `POST /api/admin/import-products`.
3. Query every unique marker after the request.

## Expected behavior

Because at least one row is invalid, zero rows from the batch may persist.

## Actual behavior

The controlled Newman run shows rows from invalid batches persisted. In `AI-FR16-024`, companion rows remained after an invalid-first-row batch. `HUM-FR16-006` further showed repeated invalid submissions accumulating persisted rows across attempts rather than leaving zero rows after each attempt.

## Real evidence

- `PoolC-FR-16-ImportProducts/evidence/step-k-execution.md`
- `postman/newman/FR16-execution-summary.md`
- `postman/newman/FR16-execution-summary.json`
- `postman/newman/FR16-official-cli.txt`
- `postman/newman/FR16-official-report.json`
- `postman/newman/FR16-official-report.html`
- `postman/newman/FR16-official-report.xml`

## Screenshot workflow

Prefer `AI-FR16-024` for a concise screenshot: show the invalid-batch testcase plus the follow-up GET proving a companion marker persisted. `HUM-FR16-006` may be used as secondary evidence showing marker count accumulation. Preserve `X-Student-Id: 23127194` and redact JWT values.

## Confirmation

**CONFIRMED DEFECT — Human Gate H approved**
