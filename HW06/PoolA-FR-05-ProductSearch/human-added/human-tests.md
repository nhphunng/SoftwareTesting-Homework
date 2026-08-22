# FR-05 Human-Added Test Cases

Date: 2026-08-20  
API: `GET /api/products?search=keyword` plus documented product mutation APIs where required for state-history/security scenarios  
Status: **5 HUMAN-AUTHORED CASES APPROVED, IMPLEMENTED, AND EXECUTED**

These five cases are the retained Human Extension (Step H). Each preserves `Source = HUMAN` and includes `Why AI missed this`. AI assistance was limited to translation/wording tightening; the case ideas are reviewer-authored.

## HUMAN-FR05-043 — Structured query parameter injection

| Field | Value |
| --- | --- |
| Source | HUMAN |
| API | GET /api/products |
| Requirement Basis | Human-discovered API-specific parser/security gap for duplicate and structured query-parameter forms |
| Scope Type | SECURITY / API-SPECIFIC BEHAVIOR |
| Category | Security / API-specific behavior |
| Preconditions | A keyword is known to match no product, using the fixed value `__NO_MATCH_23127194__`. |
| Input | Baseline: `?search=__NO_MATCH_23127194__`; Attack: `?search=__NO_MATCH_23127194__&search[$ne]=x` |
| Headers | `X-Student-Id: 23127194` |
| Steps | 1. Send the baseline request and record the returned product IDs. 2. Send the attack request with the additional bracket-notation parameter. 3. Compare status, response body, and returned product IDs. |
| Expected Status | The attack request must not cause a `5xx` response. |
| Expected Response | `search[$ne]` must not turn `search` into an object/operator, bypass the intended filter, or expose the full product list. The attack result must not become broader than the baseline because of operator-style interpretation. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Query parameters must be handled as typed input. `$ne` must be treated as an unsupported parameter name rather than a query operator. |
| State Before | Stable dataset |
| State After | No mutation expected |
| Why AI missed this | The AI covered classic SQL-oriented payloads and duplicate `search` parameters, but did not combine a normal `search` value with bracket-notation syntax that may be parsed differently by query parsers or middleware. |
| Root Cause | API-specific behavior / structured-parameter parser gap |
| Human Audit Status | VALID |
| Human Audit Reason | Reviewer-authored replacement case; executable sequentially in Postman/Newman while preserving the mandatory fixed student header. |
| Execution Status | PASSED — official Newman execution |
| Actual Result | All assertions for this testcase passed in the official run. |
| Evidence | `../evidence/FR05-execution-summary.md`; `../../postman/newman/FR05-official-report.json` |
| Defect ID | |

## HUMAN-FR05-044 — Encoded null-byte inside search value

| Field | Value |
| --- | --- |
| Source | HUMAN |
| API | GET /api/products?search=keyword |
| Requirement Basis | Human-discovered unusual-input/parser-differential gap |
| Scope Type | SECURITY / ROBUSTNESS |
| Category | Security / Unusual input / Parser differential |
| Preconditions | The keyword `phone` matches at least one product, and no product name contains the full string `phone\u0000__NO_MATCH_23127194__`. |
| Input | `?search=phone%00__NO_MATCH_23127194__` |
| Headers | `X-Student-Id: 23127194` |
| Steps | 1. Send the request with `%00` between a valid keyword and the non-matching suffix. 2. Record status and response. 3. Send a normal search immediately afterward to verify that the endpoint remains operational. |
| Expected Status | The request must not return `5xx`; the server may reject it with `4xx` or process the entire value as data. |
| Expected Response | The value must not be truncated at `%00` and then treated as `search=phone`. The response must not expose stack traces, database errors, or other internal details. The subsequent normal search must still operate normally. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | No dangerous null-byte truncation or parser differential between URL parsing, application handling, and database processing. |
| State Before | Stable dataset |
| State After | No mutation; endpoint remains operational |
| Why AI missed this | The AI covered punctuation, encoded reserved characters, and SQL-oriented payloads, but did not test an encoded null byte that can produce parser/application/database interpretation differences. |
| Root Cause | parser differential / unusual-input gap |
| Human Audit Status | VALID |
| Human Audit Reason | Reviewer-authored replacement case; fully executable as two sequential Postman/Newman requests. |
| Execution Status | FAILED — reproduced in smoke and official Newman execution; reviewed at Human Gate G |
| Actual Result | Encoded null-byte search returned HTTP 500 with an SQLite parser error in HTML; subsequent normal search remained operational. Human Gate G confirmed the contract-backed defect as SEC-05 non-parameterized query usage rather than the 500 status itself. |
| Evidence | `PoolA-FR-05-ProductSearch/evidence/FR05-official-failure-evidence.json`; `PoolA-FR-05-ProductSearch/evidence/FR05-human-gate-g-review.md` |
| Defect ID | FR05-BUG-01 — GitHub #24 |

## HUMAN-FR05-046 — Search consistency after product rename

| Field | Value |
| --- | --- |
| Source | HUMAN |
| API | Documented product-update API → GET /api/products?search=keyword |
| Requirement Basis | Human-discovered state-history dependency: search after a documented product-name mutation |
| Scope Type | STATE TRANSITION / CHARACTERIZATION |
| Category | State Transition / State-history / Cache |
| Preconditions | A product with a unique searchable name `OldName` exists; the documented product-update endpoint is available and the tester has the required authorization to update the product. |
| Input | Search `OldName`; update the product name to `NewName`; then search both `OldName` and `NewName`. |
| Steps | Confirm the product is searchable by `OldName`; update `OldName` → `NewName` through the documented API; after the update request completes successfully, immediately search `OldName`, then search `NewName`; record any observed delay as runtime characterization only. |
| Expected Status | Follow each documented API contract; where GET status is unspecified, keep it `UNRESOLVED`. |
| Expected Response | Subsequent search behavior should reflect the updated product name according to search-by-name semantics. Do not assume an eventual-consistency window; if stale behavior is observed, record the actual delay before deciding whether it is a defect. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | No unsupported cache/index assumption; stale behavior is evidence to characterize, not automatically a defect without a defined consistency requirement. |
| State Before | Product name = `OldName` |
| State After | Product name = `NewName` |
| Why AI missed this | The AI generated tests against a stable dataset and did not compose a documented write operation with later search behavior. |
| Root Cause | state-history dependency |
| Human Audit Status | VALID |
| Human Audit Reason | Reviewer-approved mutation→search scenario; retained because it does not invent a new product lifecycle state. |
| Execution Status | PASSED — official Newman execution |
| Actual Result | All assertions for this testcase passed in the official run. |
| Evidence | `../evidence/FR05-execution-summary.md`; `../../postman/newman/FR05-official-report.json` |
| Defect ID | |

## HUMAN-FR05-047 — Deleted product must not remain searchable

| Field | Value |
| --- | --- |
| Source | HUMAN |
| API | Documented product-delete API → GET /api/products?search=keyword |
| Requirement Basis | Human-discovered state-history dependency after a documented product deletion |
| Scope Type | STATE TRANSITION / BUSINESS |
| Category | State Transition / Cache |
| Preconditions | A documented product-delete endpoint exists; a product with a unique searchable name is present; the tester has the required authorization to delete it. |
| Input | Search the unique product name before and after successful deletion. |
| Steps | Search the unique name and record the product ID; delete that product through the documented endpoint; after successful deletion completes, search the same unique name again. |
| Expected Status | Follow each documented API contract; where GET status is unspecified, keep it `UNRESOLVED`. |
| Expected Response | After successful deletion, the deleted product must not continue to appear as an existing searchable product. This case does not assume `hidden`, `soft-delete`, or visibility states unless later source evidence defines them. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Search must not expose a product that the documented delete operation has removed from the active product set. |
| State Before | Product exists and is searchable |
| State After | Product has been successfully deleted through the documented API |
| Why AI missed this | The AI tested GET search independently and did not compose the documented delete operation with subsequent search behavior. |
| Root Cause | API-specific state-history behavior |
| Human Audit Status | VALID |
| Human Audit Reason | Reviewer-approved delete→search scenario; hidden/soft-delete assumptions were intentionally removed. |
| Execution Status | PASSED — official Newman execution |
| Actual Result | All assertions for this testcase passed in the official run. |
| Evidence | `../evidence/FR05-execution-summary.md`; `../../postman/newman/FR05-official-report.json` |
| Defect ID | |

## HUMAN-FR05-048 — Unsupported or malformed POST must not mutate products

| Field | Value |
| --- | --- |
| Source | HUMAN |
| API | GET /api/products → POST /api/products?search=keyword → GET /api/products |
| Requirement Basis | Human-discovered unusual-sequence and method-confusion gap around the product collection endpoint |
| Scope Type | SECURITY / STATE TRANSITION |
| Category | Unusual sequence / State transition / Method confusion |
| Preconditions | Product listing works; use only `X-Student-Id: 23127194`; do not send a JWT. |
| Input | `POST /api/products?search=phone` with JSON body `{"unexpectedSearchField":"phone"}` |
| Headers | `X-Student-Id: 23127194`; `Content-Type: application/json` |
| Steps | 1. Send GET listing and save the product ID set. 2. Send the malformed/unauthorized POST with the `search` query. 3. Send GET listing again. 4. Compare product IDs before and after. |
| Expected Status | The POST must be rejected with an appropriate `4xx` response and must not be accepted as a GET-style search. |
| Expected Response | The POST must not return search results as though it were a GET and must not create or update a product. The product ID set before and after must remain unchanged. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | No HTTP method confusion, mass assignment, or unintended product mutation. |
| State Before | Snapshot of current product IDs is stored |
| State After | Product IDs remain unchanged |
| Why AI missed this | The AI focused FR-05 on GET search behavior and did not compose a malformed unauthenticated POST attempt with before/after listing verification for unintended mutation. |
| Root Cause | unusual-sequence / method-confusion gap |
| Human Audit Status | VALID |
| Human Audit Reason | Reviewer-authored replacement case; executable as a deterministic three-request Postman/Newman sequence. |
| Execution Status | FAILED — reproduced in smoke and official Newman execution; reviewed at Human Gate G |
| Actual Result | Unauthenticated malformed `POST /api/products?search=phone` returned HTTP 200, created product ID 8, and persisted all product fields as null. Gate G corrected the reporting basis: POST is documented; the confirmed violations are FR-12 authorization and FR-15 input validation. |
| Evidence | `PoolA-FR-05-ProductSearch/evidence/FR05-official-failure-evidence.json`; `PoolA-FR-05-ProductSearch/evidence/FR05-human-gate-g-review.md` |
| Defect ID | FR05-BUG-02 — GitHub #25; FR05-BUG-03 — GitHub #26 |
