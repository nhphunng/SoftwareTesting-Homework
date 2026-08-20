# FR-05 Confirmed Bug Summary

Date: 2026-08-20
Status: **Step L complete — confirmed bugs documented, GitHub Issues created, PNG evidence attached, and post-evidence cleanup completed**
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

Product ID `8` was intentionally preserved until all required screenshot/GitHub Issue evidence was captured. After the user confirmed the PNGs were attached to Issues #24/#25/#26, cleanup was completed: ID 8 was deleted; rename fixture ID 6 was reset to `HW06_FR05_RENAME_23127194_OLD`; delete fixture was recreated as ID 9 with name `HW06_FR05_DELETE_23127194` for future reruns.

## Step L completion

The user confirmed that the verified PNG evidence was attached to GitHub Issues #24, #25, and #26. No remaining Step L evidence action is pending for FR-05.
