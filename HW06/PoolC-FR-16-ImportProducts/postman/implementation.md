# FR-16 Import Products — Step I Postman Implementation

Date: 2026-08-21  
Step I status: **COMPLETE**  
Official Newman execution: **NOT STARTED**

## Artifacts

- `postman/collection/HW06-FR16-ImportProducts.postman_collection.json`
- `postman/environment/HW06-FR16-Local.postman_environment.json`
- `PoolC-FR-16-ImportProducts/postman/build-collection.mjs`

The builder deterministically creates and statically validates the collection and public environment. It is not an execution harness and does not call the SUT or Newman.

## Testcase coverage

| Provenance | Approved records represented | Executable in the documented API surface | Technically blocked |
| --- | ---: | ---: | ---: |
| AI VALID | 51 | 43 | 8 |
| AI INCOMPLETE | 1 | 0 | 1 (`AI-FR16-046`) |
| HUMAN | 5 | 3 | 2 |
| **Total** | **57** | **46** | **11** |

All original IDs and `Source = AI/HUMAN` provenance are preserved. Sequence cases contain multiple request items, so the collection has 56 executable request items for 46 executable testcase IDs.

## Technical blockers

### Real CSV workflow unavailable to Postman

The approved CSV cases require the real CSV workflow. The supplied `api_specification.md` documents only `POST /api/admin/import-products` with JSON `{products:[...]}` and does not define a CSV endpoint, multipart field, raw-file transport, or callable frontend bridge. The following cases are retained as empty, clearly marked Postman folders and have no fabricated request:

- `AI-FR16-003`, `AI-FR16-004`
- `AI-FR16-040`, `AI-FR16-041`
- `AI-FR16-047`, `AI-FR16-048`, `AI-FR16-049`, `AI-FR16-050`

Step J may unblock them only after identifying the real CSV workflow and transport.

### DB-error trigger unavailable

`AI-FR16-046` remains **BLOCKED** exactly as approved. No DB-error body, constraint violation, or environment fault was invented.

### Required HUMAN cross-endpoint APIs unavailable

- `HUM-FR16-004`: no logout/token-revocation endpoint is documented.
- `HUM-FR16-005`: no user role-promotion/update endpoint is documented.

Both remain traceable, technically blocked Postman folders without invented requests. Category CRUD is documented, so `HUM-FR16-003` uses the real `DELETE /api/categories/:id` endpoint with a dedicated disposable category variable.

## Oracle strategy

- Collection and request scripts apply and assert `X-Student-Id: 23127194`.
- Every `pm.sendRequest()` helper also sends the exact student header explicitly.
- `GET /api/products` and `GET /api/products?search=...` provide before/after persistence checks.
- Fresh per-test marker names prevent ambiguous matches.
- Invalid, unauthenticated, and non-admin cases assert zero marker persistence rather than inventing exact HTTP codes.
- Characterization cases use branching state oracles and log the observed response shape without promoting it to contract.
- If a response exposes a success counter, it is checked for consistency with persistence; no response field is required by an invented schema.
- Dataset snapshots cover malformed/top-level cases that cannot safely carry a marker.
- `HUM-FR16-001` performs real parallel dispatch: after confirming the marker is absent, two byte-identical import calls are launched from the same pre-request callback without awaiting either call. The primary request then queries final persistence.
- `HUM-FR16-006` contains five sequential, byte-identical invalid imports; each independently checks rollback.

## Public environment variables

Populated non-secret values:

- `baseUrl=http://localhost:3000`
- `studentId=23127194`
- `absentCategoryId=2147483647` (must still be confirmed absent in Step J)

Blank runtime placeholders:

- `adminToken`, `nonAdminToken`
- `tamperedJwt`, `forgedAdminJwt`
- `staleToken`, `superAdminToken`
- `categoryId`, `humanStaleCategoryId`
- `roleTargetUserId`

No real credentials, JWTs, or environment-specific category IDs are committed.

## Static validation

The collection builder verifies:

- all 52 AI and five retained HUMAN IDs are represented;
- the expected 11 technical blockers are explicit;
- all executable request items contain `X-Student-Id: {{studentId}}`;
- credential variables remain blank;
- every generated Postman script parses as JavaScript.

Latest static build: 57 testcase IDs, 56 request items, 105 scripts syntax-checked, and 56 request headers checked.

No Newman run, SUT request, PASS/FAIL result, Actual Result, Evidence, screenshot, response sample, or defect artifact was produced in Step I.
