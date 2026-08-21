# FR16-BUG-03 — Non-admin user can import products through admin endpoint

GitHub Issue: https://github.com/nhphunng/SoftwareTesting-Homework/issues/30

## Summary

A valid JWT belonging to a regular non-admin user can call `POST /api/admin/import-products` and cause a product to persist.

## Severity

**Critical** — this is a broken role-authorization control on an admin-only data-changing endpoint.

## Requirement basis

FR-12 and SEC-03 require all `/api/admin/*` APIs to validate both a valid JWT and `role = 'admin'`. A valid non-admin JWT must not be authorized to import products.

## Related testcases

- `AI-FR16-035`
- `AI-FR16-037`
- `AI-FR16-045`

## Preconditions

- A real valid JWT for a regular user, verified as non-admin during Step J
- Valid import row with a unique marker
- `X-Student-Id: 23127194`

## Reproduction

1. Authenticate as a regular non-admin user and keep that valid JWT.
2. Call `POST /api/admin/import-products` with the non-admin JWT and a valid uniquely marked product.
3. Query the marker through the product read endpoint.

## Expected behavior

The request must not be authorized to perform the import, and zero marker rows may persist. Exact rejection status/schema is unresolved.

## Actual behavior

The official Newman evidence shows the uniquely marked product persisted after the request made with a valid non-admin JWT. `AI-FR16-035`, `AI-FR16-037`, and `AI-FR16-045` independently expose the same authorization failure path.

## Real evidence

- `PoolC-FR-16-ImportProducts/evidence/step-k-execution.md`
- `postman/newman/FR16-execution-summary.md`
- `postman/newman/FR16-execution-summary.json`
- `postman/newman/FR16-official-cli.txt`
- `postman/newman/FR16-official-report.json`
- `postman/newman/FR16-official-report.html`
- `postman/newman/FR16-official-report.xml`

## Screenshot evidence

- PNG: `PoolC-FR-16-ImportProducts/evidence/screenshots/FR16-BUG-03.png`
- Rendered evidence source: `PoolC-FR-16-ImportProducts/evidence/screenshots/FR16-BUG-03-evidence.html`
- Source of truth: `postman/newman/FR16-official-report.json`

## Screenshot workflow

Use the real evidence for `AI-FR16-035`: show the testcase ID, the non-admin scenario, follow-up persistence result, and `X-Student-Id: 23127194`. Authorization/JWT must be redacted. Do not expose the real token in a screenshot or Markdown artifact.

## Confirmation

**CONFIRMED DEFECT — Human Gate H approved**
