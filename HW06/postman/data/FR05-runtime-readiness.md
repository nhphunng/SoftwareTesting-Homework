# FR-05 Step J — Runtime Test Data and Preconditions Readiness

Date: 2026-08-20
API: `GET /api/products?search=keyword`
Student header: `X-Student-Id: 23127194`
Official Newman evidence run: **NOT RUN**

## Runtime target

| Item | Status | Runtime value / note |
| --- | --- | --- |
| SUT | READY | `http://localhost:3000` responds to `/api/products` |
| Wrong-local-process guard | READY | `127.0.0.1:3000` is not the FR-05 SUT in the current machine state |
| Student header | READY | fixed `23127194` |
| Matching data | READY | `iPhone` → product ID 1 |
| No-match data | READY | `__NO_MATCH_23127194__` → no products |
| Exact product | READY | `iPhone 15 Pro Max` |
| Partial search | READY | `iPhone 15` |
| Unicode search | READY | `Bàn` → product ID 5 |
| Case probes | READY | `iphone`, `IPHONE` |
| One-character search | READY | `i` |
| A/B sequence keywords | READY | `iPhone`, `Samsung` |
| Non-name-only keyword | READY | `camera` appears in product 2 description, not its name |
| HUMAN-044 valid prefix | READY | `phone` matches product ID 1 |
| Admin actor | READY | real login verified; role `admin` verified |
| Admin JWT | READY | private git-ignored Postman environment; token not recorded here |
| Rename fixture | READY | ID 6, `HW06_FR05_RENAME_23127194_OLD` |
| Delete fixture | READY | ID 7, `HW06_FR05_DELETE_23127194` |
| Mutation reset strategy | READY | recreate/reset dedicated fixtures before repeated run |

## Test-suite readiness

| Scope | Readiness | Reason |
| --- | --- | --- |
| 42 finalized AI cases | READY | controlled runtime values are now available; corrected cases already human-approved |
| HUMAN-FR05-046 | READY | dedicated rename fixture + admin token available |
| HUMAN-FR05-047 | READY | dedicated delete fixture + admin token available |
| HUMAN-FR05-043 | BLOCKED — stale Postman implementation | testcase source was replaced, but collection still implements old cross-user case |
| HUMAN-FR05-044 | BLOCKED — stale Postman implementation | testcase source was replaced, but collection still implements old concurrency case |
| HUMAN-FR05-048 | BLOCKED — stale Postman implementation | testcase source was replaced, but collection still implements old burst case |

## Step J decision

Runtime data/preconditions are prepared for FR-05. The **runtime-data gate itself is satisfied**, including real controlled search values, authentication, and disposable mutation fixtures.

The suite is **not yet ready for official Step K/Newman execution** because three HUMAN Postman implementations must first be synchronized with the final approved testcase source.
