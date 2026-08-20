# FR-05 Confirmed Bug Summary

Date: 2026-08-20
Status: **Step L screenshots and GitHub Issues created; screenshot attachment pending Chrome sign-in**
GitHub Issues: **CREATED**

| Bug ID | Requirement | Severity | Confirmed behavior | Found by |
| --- | --- | --- | --- | --- |
| FR05-BUG-01 | SEC-05 | High | Product search concatenates user-controlled `search` into SQL instead of using a parameterized query. Null-byte probe reproduced an SQLite parser failure. | HUMAN-FR05-044 |
| FR05-BUG-02 | FR-12 | Critical | `POST /api/products` accepts a request without JWT/Admin authorization and persists a product. | HUMAN-FR05-048 |
| FR05-BUG-03 | FR-15 | High | Product creation accepts missing required fields and persists an all-null product record. | HUMAN-FR05-048 |

## GitHub Issues

- FR05-BUG-01: https://github.com/nhphunng/SoftwareTesting-Homework/issues/24
- FR05-BUG-02: https://github.com/nhphunng/SoftwareTesting-Homework/issues/25
- FR05-BUG-03: https://github.com/nhphunng/SoftwareTesting-Homework/issues/26

## Evidence basis

- `PoolA-FR-05-ProductSearch/evidence/FR05-execution-summary.md`
- `PoolA-FR-05-ProductSearch/evidence/FR05-official-failure-evidence.json`
- `PoolA-FR-05-ProductSearch/evidence/FR05-human-gate-g-review.md`
- `postman/newman/FR05-official-cli.txt`
- `postman/newman/FR05-official-report.html`
- `postman/newman/FR05-official-report.json`
- `postman/newman/FR05-official-report.xml`
- `PoolA-FR-05-ProductSearch/evidence/screenshots/FR05-BUG-01.png`
- `PoolA-FR-05-ProductSearch/evidence/screenshots/FR05-BUG-02.png`
- `PoolA-FR-05-ProductSearch/evidence/screenshots/FR05-BUG-03.png`

## Evidence-state note

Product ID `8` remains intentionally preserved in the live SQLite database at the end of Step L documentation so the malformed persisted product can still be inspected. Cleanup should be done only after any required screenshot/GitHub Issue evidence is captured.

## Remaining Step L action

Screenshot evidence has been generated from the real official Newman responses and visually verified. Uploading the PNGs as GitHub Issue attachments requires an authenticated GitHub browser session; GitHub CLI does not expose issue-attachment upload.
