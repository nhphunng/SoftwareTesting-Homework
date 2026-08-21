# FR16-BUG-01 — Import accepts non-positive product prices

GitHub Issue: https://github.com/nhphunng/SoftwareTesting-Homework/issues/28

## Summary

`POST /api/admin/import-products` accepts and persists products whose `price` is not positive. The controlled Newman run observed persisted products with `price: 0` and `price: -1`.

## Severity

**High** — invalid commercial data is accepted through a bulk-import path and stored in the product catalog.

## Requirement basis

FR-16 explicitly requires `price` to be a positive number (`> 0`).

## Related testcases

- `AI-FR16-019` — `price = 0`
- `AI-FR16-020` — `price = -1`

## Preconditions

- SUT: `http://localhost:3000`
- Valid admin JWT
- Existing valid category
- `X-Student-Id: 23127194` on every request

## Reproduction

1. Send an import containing a uniquely marked row with `price: 0` (or `price: -1`).
2. Query the unique marker through the real product read endpoint.
3. Inspect persistence.

## Expected behavior

The invalid row must be rejected and must not persist because FR-16 requires `price > 0`.

## Actual behavior

The official Newman evidence shows the marker persisted. For `AI-FR16-019`, the follow-up product query returned a stored row with `"price":0`. For `AI-FR16-020`, the stored row had `"price":-1`.

## Real evidence

- `PoolC-FR-16-ImportProducts/evidence/step-k-execution.md`
- `postman/newman/FR16-execution-summary.md`
- `postman/newman/FR16-execution-summary.json`
- `postman/newman/FR16-official-cli.txt`
- `postman/newman/FR16-official-report.json`
- `postman/newman/FR16-official-report.html`
- `postman/newman/FR16-official-report.xml`

Official run totals: 46 testcase IDs, 195 requests, 388 assertions, 46 failed assertions, and exact `X-Student-Id: 23127194` on 195/195 requests.

## Screenshot workflow

Use the real Newman HTML/JSON evidence for `AI-FR16-019` or `AI-FR16-020`. The screenshot must visibly preserve the testcase ID, request/result context, persistence evidence, and `X-Student-Id: 23127194`; redact Authorization/JWT values. Do not recreate or fabricate a Postman response.

## Confirmation

**CONFIRMED DEFECT — Human Gate H approved**
