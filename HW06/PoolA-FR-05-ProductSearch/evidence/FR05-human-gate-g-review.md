# FR-05 Human Gate G — Execution Review

Date: 2026-08-20
API under primary test: `GET /api/products?search=keyword`
Official execution source: `FR05-official-report.json` / `FR05-official-failure-evidence.json`
Decision status: **HUMAN GATE G APPROVED**

## Sources reviewed

1. Final HUMAN testcase definitions in `PoolA-FR-05-ProductSearch/generated/PoolA-FR05-ProductSearch-test.md`.
2. Business requirements in the SUT `README.md`:
   - FR-05 — product listing/search by product name.
   - FR-12 — all data-changing `POST/PUT/DELETE /api/products` APIs require a valid JWT and `role='admin'`.
   - FR-15 — product create/update requires name, positive price, and existing category.
   - SEC-05 — database queries must use parameterized queries and must not concatenate input directly.
3. `source/api_specification.md`:
   - `GET /api/products` with optional `?search=keyword` searches by product name.
   - `POST /api/products`, `PUT /api/products/:id`, and `DELETE /api/products/:id` are documented under “Thêm / Sửa / Xóa Sản phẩm (Dành cho Admin)”.
   - The documented create/update body contains `name`, `price`, `description`, `imageUrl`, and `category_id`.
4. Real Newman evidence from the official execution.
5. Backend implementation was inspected only to support root-cause analysis after the execution result was established.

---

## HUMAN-FR05-044 — Encoded null-byte inside search value

### Test expectation

The HUMAN testcase expected:

- the encoded null-byte request should not return `5xx`;
- the value should not be truncated or interpreted dangerously across parser/application/database boundaries;
- the response should not expose stack traces, database errors, or internal details;
- a subsequent normal search should remain operational.

### Actual execution

Request:

`GET /api/products?search=phone%00__NO_MATCH_23127194__`

Observed:

- HTTP `500`;
- `Content-Type: text/html`;
- body contained `Database Error` and `SQLITE_ERROR: unrecognized token...`;
- the following normal `phone` search returned HTTP 200.

The behavior reproduced in both smoke and official execution.

### Source-basis review

#### “Must not return 5xx”

**Not directly stated as a business/API contract requirement.**

Neither FR-05 nor `api_specification.md` defines a required status code for malformed/unusual `search` input. Therefore the bare assertion “must never return 5xx” is a reviewer-authored robustness/security expectation, not by itself a source-backed defect rule.

However, the 500 response is useful execution evidence because it reveals that the user-controlled search value reached SQL in a way that broke query parsing.

#### “Must not disclose internal DB error”

**Not directly stated as a generic requirement for FR-05.**

The supplied security requirements do not contain a general information-disclosure rule for all API errors. Therefore the HTML SQLite error disclosure is retained as a **security observation**, but should not be reported as a standalone confirmed contract defect solely from the current requirements.

#### SEC-05 parameterized query requirement

**Directly source-backed.**

README SEC-05 states that database queries must use parameterized queries and must not concatenate input directly.

The actual null-byte request caused a SQLite parser error. Backend inspection confirms the search implementation builds:

`SELECT * FROM products WHERE name LIKE '%${searchQuery}%'`

by direct string interpolation instead of a parameterized query.

### Gate G verdict

**CONFIRMED DEFECT BASIS: YES — SEC-05 violation.**

The confirmed defect is not simply “500 returned” and not separately “SQLite error disclosed”. The contract-backed defect is:

> Product search directly concatenates user-controlled `search` input into SQL instead of using a parameterized query, violating SEC-05. The null-byte execution provides real reproducible evidence that malformed input can break SQL parsing.

Secondary observations:

- HTTP 500 on the probe — robustness symptom, exact error-status contract unspecified.
- SQLite details exposed in HTML — security/information-disclosure observation, but no standalone generic requirement in the supplied source.

Recommended Step L bug candidate: **FR05-BUG-01 — Product search violates SEC-05 by concatenating search input into SQL.**

---

## HUMAN-FR05-048 — Malformed unauthenticated POST must not mutate products

### Test expectation

The HUMAN testcase performed:

`GET /api/products → POST /api/products?search=phone → GET /api/products`

The POST used no JWT and body:

```json
{"unexpectedSearchField":"phone"}
```

The testcase expected the request to be rejected and the product-ID set to remain unchanged.

### Actual execution

Observed:

- POST returned HTTP `200`;
- body: `{"message":"Product created","id":8}`;
- product ID 8 was persisted;
- ID 8 contained `null` for `name`, `price`, `description`, `imageUrl`, and `category_id`;
- before/after product ID sets differed.

The behavior reproduced in both smoke and official execution.

### Exact contract review

#### Is `POST /api/products` an unsupported method?

**No.**

`api_specification.md` explicitly documents `POST /api/products` as the create-product endpoint. The testcase wording “unsupported POST” / “method confusion” is therefore imprecise.

This does not invalidate the core security test because the request was intentionally sent without authentication and with an invalid body.

#### Does `POST /api/products` require authentication/admin role?

**Yes — directly source-backed.**

README FR-12 states that all data-changing `POST/PUT/DELETE /api/products` APIs require:

1. a valid JWT; and
2. `role = 'admin'` in the token.

`api_specification.md` also groups `POST /api/products` under product create/update/delete “Dành cho Admin”.

Therefore a request with no JWT must not be allowed to create a product. The exact rejection status is not explicitly specified, so the important contract violation is acceptance/mutation, not a specific 401 vs 403 code.

### Gate G verdict — authorization

**CONFIRMED DEFECT BASIS: YES.**

> `POST /api/products` accepts an unauthenticated request and creates a product, violating FR-12 admin access control.

Recommended Step L bug candidate: **FR05-BUG-02 — Unauthenticated client can create products through admin-only product mutation API.**

#### Is product body validation defined?

**Yes — directly source-backed by README FR-15.**

FR-15 requires:

- product name: required, max 255 characters;
- price: required and positive;
- category: required and selected from an existing category.

`api_specification.md` also documents the expected create/update body fields.

The request supplied none of these product fields, yet ID 8 was created with null values.

### Gate G verdict — validation

**CONFIRMED DEFECT BASIS: YES.**

> Product creation accepts a body with no required product fields and persists an all-null product, violating FR-15 input constraints.

Recommended Step L bug candidate: **FR05-BUG-03 — Product creation does not enforce required name, positive price, and category validation.**

### Testcase wording correction for reporting

Do not describe this defect as “HTTP method confusion” in the final bug report because POST is a documented method. Use:

- unauthorized product mutation; and
- missing create-product validation.

The failed before/after ID assertion remains valid evidence of unintended mutation.

---

## Human Gate G final decision

| Execution finding | Gate G decision |
| --- | --- |
| HUMAN-FR05-044 returned 500 | Supporting symptom; not a standalone contract defect because exact unusual-input status is unspecified |
| HUMAN-FR05-044 disclosed SQLite error | Security observation; not standalone confirmed from current generic requirements |
| HUMAN-FR05-044 demonstrates direct SQL concatenation | **APPROVED AS CONFIRMED DEFECT BASIS — SEC-05** |
| HUMAN-FR05-048 accepted no-JWT product create | **APPROVED AS CONFIRMED DEFECT — FR-12** |
| HUMAN-FR05-048 persisted all-null product | **APPROVED AS CONFIRMED DEFECT — FR-15** |

Human Gate G is complete. Three contract-backed defect records may now proceed to Step L:

1. FR05-BUG-01 — SEC-05 parameterized-query violation in product search.
2. FR05-BUG-02 — unauthenticated product creation despite admin-only requirement.
3. FR05-BUG-03 — missing required product-field validation allows an all-null product.

No GitHub Issue has been created at this gate.

## Evidence-state handling

Product ID 8 is intentionally retained at the completion of this review so the persisted mutation remains directly inspectable for Step L bug documentation. Cleanup should occur only after the required bug evidence has been captured/documented.
