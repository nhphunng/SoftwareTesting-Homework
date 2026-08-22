# FR05-BUG-01 — Product search violates SEC-05 by concatenating user input into SQL

GitHub Issue: https://github.com/nhphunng/SoftwareTesting-Homework/issues/24

## Summary

`GET /api/products?search=keyword` builds the product-search SQL by directly interpolating the user-controlled `search` value instead of using a parameterized query. This violates README security requirement **SEC-05**.

## Severity

**High**

Reason: the defect is a direct violation of the database-query security requirement and exposes the search query to injection/parser-manipulation risk. This report does **not** claim that arbitrary SQL injection was proven; the confirmed defect is the non-parameterized query implementation itself.

## Found by

- **Human-added test:** `HUMAN-FR05-044`
- AI missed: **Yes**
- Root coverage gap: parser differential / unusual input

## API

`GET /api/products?search=keyword`

## Requirement basis

**README — SEC-05**

> Database queries must use parameterized queries and must not concatenate input directly.

Supporting API contract:

- `GET /api/products`
- optional `?search=keyword`
- searches products by name

## Preconditions

- SUT running at `http://localhost:3000`.
- Product dataset available.
- Request includes `X-Student-Id: 23127194`.

## Reproduction

Send:

```http
GET /api/products?search=phone%00__NO_MATCH_23127194__
X-Student-Id: 23127194
```

Then send a normal product search to verify the service remains reachable.

## Expected

The database query must treat `search` as data through a parameterized query. User-controlled input must not be concatenated into SQL text.

The exact HTTP status for malformed/unusual search input is **not specified** by the contract and is therefore not the primary defect assertion.

## Actual

The official Newman execution returned:

```text
HTTP 500
Content-Type: text/html; charset=utf-8
```

Response body contained an SQLite parser error:

```text
Database Error
SQLITE_ERROR: unrecognized token ...
```

Backend inspection after reproduction confirmed the implementation constructs the query with direct interpolation:

```js
const query = `SELECT * FROM products WHERE name LIKE '%${searchQuery}%'`;
```

rather than binding `searchQuery` as a parameter.

## Reproducibility

**2/2 observed runs**

- Smoke run: reproduced.
- Official Newman run: reproduced.

## Evidence

- Screenshot: `PoolA-FR-05-ProductSearch/evidence/screenshots/FR05-BUG-01.png`
- `PoolA-FR-05-ProductSearch/evidence/FR05-official-failure-evidence.json`
- `PoolA-FR-05-ProductSearch/evidence/FR05-execution-summary.md`
- `PoolA-FR-05-ProductSearch/evidence/FR05-human-gate-g-review.md`
- `postman/newman/FR05-official-report.html`
- `postman/newman/FR05-official-report.json`

## Additional observations

The request returned HTTP 500 and exposed SQLite details in the response body. These are useful security/robustness observations, but Human Gate G did not classify them as separate confirmed contract defects because the supplied requirements do not define a generic error-status or information-disclosure rule for FR-05.

## Confirmation

**CONFIRMED DEFECT — Human Gate G approved**

Contract violated: **SEC-05**.
