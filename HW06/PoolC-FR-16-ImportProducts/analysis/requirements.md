# FR-16 Import Products — Requirement Extraction

Date: 2026-08-21  
API under test: `POST /api/admin/import-products`  
Pool: C  
Primary requirement: FR-16 — Import Products from CSV  
Human Gate A status: **APPROVED**

Gate A decision: preserve both input surfaces without normalizing the conflict. FR-16 remains the business CSV contract, while `api_specification.md` remains the documented JSON API contract. Step B and later stages must cover both explicitly.

## Sources

1. `source/api_specification.md`, especially §6 and §6.3
2. EShop SUT `README.md`, especially FR-12, FR-15, FR-16, and SEC-01..SEC-07
3. `plan.md`, Step A — Requirement Extraction
4. `.agents/skills/api-testing-human-loop/SKILL.md`
5. `.agents/skills/api-testing-human-loop/references/workflow-gates.md`
6. `reports/api-inventory.md`
7. `reports/api-selection.md`
8. EShop implementation `backend/server.js` — observation only, not a replacement for the requirement contract

## 1. Endpoint identity

| Item | Extracted requirement | Source basis |
| --- | --- | --- |
| Feature | Import multiple products | FR-16 / API specification §6.3 |
| Method | `POST` | API specification §6.3 |
| Endpoint | `/api/admin/import-products` | API specification §6.3 |
| Role | Admin only | FR-12; API specification §6 |
| Authentication | `Authorization: Bearer <token>` | FR-12; API specification §6 |
| Authorization | JWT must represent `role = 'admin'` | FR-12; SEC-03 |
| Required project header | `X-Student-Id: 23127194` on every executed request | HW06 project constraint |

## 2. Primary business requirement — FR-16

FR-16 defines the intended import operation as a **CSV file upload**.

### 2.1 CSV file rules

The business requirement states:

1. Admin can upload a CSV file to import multiple products at once.
2. File extension must be `.csv`.
3. First row/header must be exactly:

```text
name,price,description,imageUrl,category_id
```

4. Fields containing commas must be supported when enclosed in double quotes according to RFC 4180 behavior.

### 2.2 Per-row validation

FR-16 explicitly defines:

- `name` must not be empty.
- `price` must be a positive number (`> 0`).

FR-16 does not explicitly define additional import-specific constraints for:

- maximum `name` length;
- `description` length/content;
- `imageUrl` format;
- `category_id` existence;
- duplicate product names;
- duplicate rows within one import;
- maximum row count;
- maximum file size.

These items remain **UNRESOLVED** for FR-16 unless another accepted requirement is intentionally inherited.

### 2.3 Atomicity / rollback

FR-16 explicitly requires all-or-nothing behavior:

> If any row contains an error, the entire import must be rolled back.

Contract-backed invariant:

```text
Any invalid row -> zero products from that import are persisted.
```

Partial success is therefore not compliant with FR-16.

### 2.4 Import report

FR-16 requires a clear report containing:

- number of successful rows;
- number of failed rows;
- reason(s) for failure.

The requirement does **not** define the exact API JSON property names, nesting, wording, or HTTP status code for this report.

Exact response schema remains **UNRESOLVED** until another source defines it.

## 3. API specification contract

The supplied `api_specification.md` documents the same endpoint under the heading:

```text
Import Sản phẩm từ CSV (JSON Array)
```

but the actual request interface shown is **JSON**, not a multipart/file upload.

Documented body shape:

```json
{
  "products": [
    {
      "name": "SP 1",
      "price": 10000,
      "description": "Mô tả 1",
      "imageUrl": "",
      "category_id": 1
    }
  ]
}
```

Therefore, under the API specification contract:

- request body is JSON;
- top-level field is `products`;
- `products` is shown as an array of product objects;
- product example fields are `name`, `price`, `description`, `imageUrl`, `category_id`.

The specification does not define:

- multipart field name for a file;
- uploaded filename semantics;
- CSV MIME type;
- exact success HTTP status;
- exact error HTTP statuses;
- exact success/error response schema;
- whether `products` may be empty;
- maximum number of products;
- exact behavior for malformed JSON;
- exact behavior for unknown/additional fields.

These remain **UNRESOLVED** unless source-backed later.

## 4. Material contract conflict — CSV file vs JSON array

There is a direct mismatch between the business requirement and API specification:

```text
README / FR-16:
CSV file upload + .csv extension + exact CSV header + RFC 4180 parsing

api_specification.md:
POST JSON body { "products": [...] }
```

Status: **UNRESOLVED CONTRACT CONFLICT — MUST BE REVIEWED AT GATE A.**

This extraction does not silently rewrite either source.

Recommended downstream separation if Gate A accepts the existing Option-B approach:

1. **API-contract tests** — exercise the documented JSON endpoint and body structure.
2. **Business-compliance tests** — verify FR-16 CSV/header/RFC4180/validation/atomicity requirements wherever the real workflow exposes them.
3. The absence of a CSV transport on this endpoint must not automatically be called a confirmed bug before real execution/workflow evidence and Human Gate H review.

## 5. Authentication and authorization

### 5.1 JWT authentication

FR-12 states that all `/api/admin/*` APIs require a valid JWT.

Applicable requirement:

- `SEC-02` — security-sensitive APIs require a valid JWT token.

Therefore requests with missing or invalid authentication must not be authorized to perform an import.

The exact rejection status/body is not specified and remains **UNRESOLVED**.

### 5.2 Admin role authorization

FR-12 additionally requires:

```text
role = 'admin' in the Token
```

SEC-03 repeats that Admin APIs must validate the admin role, not merely the existence of a token.

Therefore a valid JWT belonging to a non-admin user must not be authorized to import products.

This is a direct contract-backed authorization requirement.

## 6. Relationship to FR-15 Product constraints

FR-15 defines general Product CRUD constraints:

- `name` required, maximum 255 characters;
- `price` required and `> 0`;
- category required and must come from the existing category list.

FR-16 independently repeats only:

- non-empty `name`;
- positive `price`.

It is **UNRESOLVED** whether FR-16 imports are required to inherit every FR-15 Product CRUD constraint, especially:

- `name <= 255`;
- category existence/validity.

Do not silently promote these FR-15 rules to direct FR-16 import requirements without Human Gate A approval. They may still be useful as cross-requirement/risk-based tests after review.

## 7. Request-input model for later domain analysis

Two input surfaces currently exist because of the conflict.

### 7.1 Business CSV surface

Potential inputs explicitly grounded in FR-16:

- file presence;
- filename/extension;
- CSV header;
- CSV rows;
- quoted comma behavior;
- per-row `name`;
- per-row `price`;
- batch containing one or more invalid rows.

### 7.2 Documented JSON API surface

Inputs documented by `api_specification.md`:

- top-level `products` array;
- row `name`;
- row `price`;
- row `description`;
- row `imageUrl`;
- row `category_id`.

No path or query parameters are documented for the selected endpoint.

## 8. Response contract

### 8.1 Business-level response expectation

FR-16 requires a clear import report with success count, error count, and reasons.

### 8.2 Exact API response

Exact details are **UNRESOLVED**:

- success status code;
- validation-failure status code;
- authentication/authorization failure code;
- atomic rollback failure code;
- response field names;
- error object/array shape;
- whether successful imported products are returned;
- Content-Type beyond normal runtime characterization.

Later schema tests must not invent exact response contracts.

## 9. State / persistence rules

FR-16 does not define a named state machine, but it does define a strong persistence transition.

### Valid batch

```text
Before: N existing products
Action: import a fully valid batch of M rows
After: N + M products, assuming no unrelated concurrent mutation
```

### Invalid batch

```text
Before: N existing products
Action: import batch where any row is invalid
After: N existing products; zero rows from that batch persist
```

This atomicity rule is a primary state/persistence oracle for later testing.

No requirement defines:

- idempotency on repeated import;
- duplicate detection;
- overwrite/upsert behavior;
- concurrency semantics.

These remain **UNRESOLVED / characterization or risk-based dimensions**.

## 10. Preliminary SEC-01..SEC-07 mapping

| Security requirement | Applicability | Step A basis |
| --- | --- | --- |
| SEC-01 Password plaintext | Not applicable | Import flow does not manage passwords |
| SEC-02 Valid JWT required | **Directly applicable** | `/api/admin/*` is protected by FR-12 |
| SEC-03 Admin role required | **Directly applicable** | Selected endpoint is `/api/admin/import-products` |
| SEC-04 UI escaping | Potentially / partially applicable downstream | Imported product fields may later be displayed, but API-only import testing cannot prove browser rendering safety |
| SEC-05 Parameterized DB queries | **Applicable to persistence path** | Imported fields are written to the database; later security analysis should verify safe query handling without inferring a defect from status alone |
| SEC-06 Profile role mass assignment | Not applicable | No profile update endpoint |
| SEC-07 OTP security | Not applicable | No reset-password/OTP behavior |

File/import-specific risks such as CSV formula injection, parser abuse, oversized batches, malicious content, and partial-write behavior are relevant threat-model candidates, but only SEC-backed or explicitly risk-based expectations should be treated as mandatory.

## 11. Implementation observations — not requirements

Static inspection of `backend/server.js` currently shows that the selected route:

- is implemented as `POST /api/admin/import-products`;
- uses `authenticateToken`;
- reads `req.body.products` as an array;
- rejects missing/non-array/empty `products` with a `400` in the implementation;
- checks missing `row.name`;
- inserts rows using a parameterized statement;
- does not visibly validate `price > 0` before insertion;
- does not visibly apply an admin-role middleware/check at this route;
- inserts rows individually and accumulates errors;
- does not visibly wrap the batch in an explicit database transaction/rollback;
- returns an implementation response containing `message`, `inserted`, and `errors`.

These are **implementation observations only** and high-priority runtime verification targets. They are not used to redefine the expected contract, and they are not confirmed bugs at Step A.

## 12. Project-specific testing constraints

For FR-16, HW06 later requires:

- at least 35 AI-generated testcase records;
- human audit of AI-generated cases with `VALID / INVALID / INCOMPLETE`;
- at least 5 genuinely human-authored additions after AI coverage review;
- Postman implementation;
- real runtime fixture/import preparation;
- real Newman execution;
- `X-Student-Id: 23127194` on every request;
- Human Gate G before execution-result defect classification;
- Human Gate H before confirmed bug reporting.

No request/response execution evidence is created in Step A.

## 13. Gate A — items requiring human review

Please review and accept/reject these points before Step B:

1. Selected API identity is `POST /api/admin/import-products`, Pool C, FR-16.
2. Treat FR-16 CSV upload rules as the **business requirement**: `.csv`, exact header, RFC4180 quoted commas, non-empty `name`, positive `price`, all-or-nothing rollback, clear result report.
3. Preserve the documented API contract separately: JSON body `{ "products": [...] }`.
4. Accept the CSV-vs-JSON mismatch as an explicit **UNRESOLVED CONTRACT CONFLICT**, not something AI may silently normalize.
5. Use the existing Option-B testing model: API-contract tests for JSON plus business-compliance tests for FR-16 wherever the real workflow permits CSV behavior to be exercised.
6. Treat `SEC-02` and `SEC-03` as directly applicable: valid JWT plus admin role are required.
7. Keep exact success/error HTTP codes and exact response schema `UNRESOLVED` because the supplied requirements do not define them.
8. Treat atomic rollback as a direct contract-backed persistence invariant: any invalid row means zero rows from that batch may persist.
9. Keep full inheritance of FR-15 constraints (`name <= 255`, valid existing category) **UNRESOLVED** unless the human reviewer explicitly accepts that relationship for FR-16.
10. Treat current `server.js` behavior only as implementation observation and runtime-test targeting, not as defect confirmation.

Do not proceed to Step B until Human Gate A is approved.