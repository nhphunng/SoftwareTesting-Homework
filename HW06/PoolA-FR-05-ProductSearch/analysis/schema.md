# API 1 — FR-05 Product Search — Schema Validation Design

## 1. Scope and source model

```text
Endpoint: GET /api/products
Query: ?search=keyword (optional)
FR: FR-05 — Product listing and search
Authentication: Public
```

This Step E artifact follows `$api-testing-human-loop` Schema/Response checkpoint and the approved Option B source model:

1. `README.md` = business truth / expected business behavior.
2. `api_specification.md` = API interface contract.
3. `backend/server.js` = implementation observation only.

Approved Step A decision relevant here:

```text
Exact success HTTP status: UNRESOLVED
Full response schema/field types: UNRESOLVED
No-result exact payload/status: UNRESOLVED
```

Therefore this artifact does **not** invent a formal JSON Schema that the sources do not define.

---

## 2. Source-supported response expectations

### 2.1 Business-level expectations

FR-05 supports the following business semantics:

- the product listing workflow can retrieve products;
- search operates by **product name**;
- a no-match search must not fabricate matching products;
- the UI displays product image, name and price, but the README does not formally define the GET API response schema for those values.

Important distinction:

```text
UI presentation field requirement ≠ automatically a formal API response-field contract
```

The API suite may later characterize which fields are present, but Step E must not silently convert UI presentation wording into exact required JSON keys/types unless the human explicitly approves that interpretation.

### 2.2 API-contract expectations

`api_specification.md` documents:

```http
GET /api/products
GET /api/products?search=keyword
```

and says the optional `search` parameter searches product names.

It does **not** formally define for this endpoint:

- success status code;
- error status codes;
- top-level JSON type;
- product item required fields;
- product field primitive types;
- nullable fields;
- nested objects;
- enums;
- date/time formats;
- numeric constraints;
- whether extra properties are allowed;
- error response schema.

These remain `UNRESOLVED` unless a later human decision introduces a test hypothesis.

---

## 3. Schema dimension matrix

| Dimension | Source-supported contract | Step E treatment |
| --- | --- | --- |
| Top-level array/object | Not formally stated | `UNRESOLVED`; characterize actual response |
| Required product fields | Not formally stated for GET | `UNRESOLVED`; do not invent |
| `name` field | Search semantics depend on product name | Semantic relevance resolved; exact key/schema requirement not formally stated for GET |
| `price` field | UI displays price | API-key/type requirement `UNRESOLVED` |
| image/imageUrl field | UI displays product image; product CRUD example uses `imageUrl` | GET schema requirement `UNRESOLVED` |
| `description` | Appears in product CRUD example, not GET contract | `UNRESOLVED` for GET |
| `category_id` | Appears in product CRUD example, not GET contract | `UNRESOLVED` for GET |
| Primitive types | Not specified for GET | `UNRESOLVED` |
| Arrays | Not formally specified despite list semantics | Characterize actual top-level shape |
| Nested objects | Not specified | No mandatory nested-schema assertion |
| Enums | None specified | N/A |
| Nullable fields | Not specified | `UNRESOLVED` |
| Date/time format | No date/time field contract specified | N/A unless runtime reveals fields; not contractual |
| Numeric constraints | No GET response numeric constraints specified | `UNRESOLVED` |
| Extra properties | No prohibition specified | Do not fail on undocumented extra fields solely for being extra |
| Error response schema | Not specified | `UNRESOLVED`; security disclosure checks handled separately |
| Content-Type | Not explicitly specified for GET | `UNRESOLVED` as contract assertion |

---

## 4. Minimal semantic validation model

Because the formal schema is missing, Step E separates **schema assertions** from **business semantic assertions**.

### SV-FR05-01 — Listing response is consumable as product-result data

Basis:

```text
FR-05 product listing + API contract GET /api/products
```

Allowed assertion level:

```text
The response must represent the product-list/search result in a form the API returns.
```

Not yet allowed as a strict contract assertion:

```text
response must be JSON array
response must be HTTP 200
response must contain exactly fields X/Y/Z
```

unless a human-approved schema hypothesis is added.

### SV-FR05-02 — Matching search semantics are traceable to product name

For controlled data where a known product-name match exists:

```text
returned matching items must be consistent with search-by-name semantics
```

This is a business-content assertion, not a full schema assertion.

### SV-FR05-03 — Non-name-only keyword should not create a false positive

For controlled data where a keyword exists only in another field but not product name:

```text
a product must not be considered a correct FR-05 match solely because another field contains the keyword
```

Again, this does not require a specific JSON shape.

### SV-FR05-04 — No-match semantics

For controlled no-match data:

```text
no matching products may be fabricated
```

Exact representation such as:

```json
[]
```

is **not** yet a required contract expectation.

---

## 5. Implementation observations — not contract truth

Current `backend/server.js` uses:

```text
res.json(rows)
```

for normal product-list/search responses.

This suggests the current implementation serializes database rows as JSON. However, under Option B:

```text
implementation output is actual behavior, not automatically the expected API contract
```

The implementation also sends an HTML-formatted database error in one search failure path:

```text
<h1>Database Error</h1><p>...</p>
```

This is relevant to the approved Step D information-disclosure risk, but because the API specification defines no error schema, Step E must not call the HTML format a schema defect by itself.

Potential security defect classification requires real execution evidence plus Gate H confirmation.

---

## 6. Cross-endpoint product-field observation

The API specification's product create/update example uses:

```json
{
  "name": "Tên sản phẩm",
  "price": 100000,
  "description": "Mô tả",
  "imageUrl": "http://...",
  "category_id": 1
}
```

This proves those fields are documented as **request fields for product create/update**.

It does **not** prove that GET `/api/products` must:

- return every one of those fields;
- return only those fields;
- use identical primitive types;
- make them all non-null;
- forbid extra properties.

Therefore they remain useful **characterization candidates**, not mandatory GET response schema assertions unless explicitly approved by the human reviewer.

---

## 7. Candidate schema checks for later testcase generation

### Contract-backed / semantic checks

| Candidate | Basis | Assertion strength |
| --- | --- | --- |
| Search results obey product-name semantics | FR-05 + API spec | Strong |
| No-search supports listing behavior | FR-05 + API spec | Strong business semantic |
| No-match does not fabricate matches | FR-05 | Strong semantic; payload shape unresolved |
| Response after security-like input does not disclose internals | Approved Step D risk | Security-oriented; depends on real execution |

### Characterization-only checks

| Candidate | Why characterization only |
| --- | --- |
| Top-level response is JSON array | Observed implementation, not formal GET contract |
| Items contain `id` | Likely DB-row behavior but not source-defined GET schema |
| Items contain `name` | Semantically useful, but formal GET field requirement not stated |
| Items contain `price` | UI/business relevance, but formal GET field/type not stated |
| Items contain `description` | CRUD request example only |
| Items contain `imageUrl` | CRUD request example/UI image need, not GET schema contract |
| Items contain `category_id` | CRUD request example only |
| Numeric/string primitive types | Not specified for GET |
| No extra properties | No such restriction exists |

Characterization results may later identify inconsistencies worth review, but they must not be automatically labeled contract defects.

---

## 8. Error-schema validation design

### API contract

```text
Error response schema: UNRESOLVED
```

Therefore later tests should record:

- actual HTTP status;
- actual content type;
- actual body shape;
- whether internal DB/stack/query details are exposed.

Do not assert a fabricated canonical shape such as:

```json
{"error":"..."}
```

unless another approved source supports it.

### Security overlay

Step D approved information disclosure as a separate risk dimension.

Thus an error response may be problematic even when no formal error schema exists if real evidence shows exposure of sensitive internal details. That classification belongs to security/defect analysis, not merely JSON-schema mismatch.

---

## 9. Schema-validation boundaries not to invent

Do **not** introduce requirements such as:

```text
id must be integer > 0
name must be string <= 255
price must always be numeric
imageUrl must be URI format
category_id must be integer
response must be 200 application/json
no-match must be []
additionalProperties = false
```

unless a source or explicit human-approved test hypothesis supports them.

Some of those may be reasonable product-model assumptions, but they are not established GET `/api/products` contract facts in the supplied sources.

---

## 10. Human Review — Schema/Response checkpoint options

### Review Item 1 — Top-level response shape

- **Option A:** Define a JSON array as the required GET response contract because the endpoint is a product list and the implementation uses `res.json(rows)`.
- **Option B:** Keep top-level shape `UNRESOLVED`; test JSON-array behavior as characterization only.
- **Option C:** Do not test top-level shape at all.

**Recommended: B** — preserves useful schema observation without promoting implementation behavior to contract truth.

### Review Item 2 — Product fields (`name`, `price`, `imageUrl`, etc.)

- **Option A:** Require all product CRUD fields as mandatory GET response fields.
- **Option B:** Require only `name` because search-by-name semantics need it, while all other fields remain characterization.
- **Option C:** Keep all exact GET field requirements `UNRESOLVED`; validate search semantics using controlled response content without declaring a formal required-field schema.

**Recommended: C** — `name` is semantically central, but the sources still do not explicitly declare GET response keys.

### Review Item 3 — Primitive types

- **Option A:** Infer GET field types from request examples/database behavior and enforce them.
- **Option B:** Keep primitive types `UNRESOLVED`; record actual types as characterization.
- **Option C:** Skip type observation entirely.

**Recommended: B** — prevents implementation-derived types from becoming invented contract requirements.

### Review Item 4 — No-match representation

- **Option A:** Require `[]` as the canonical no-match response.
- **Option B:** Keep exact payload/status `UNRESOLVED`; require only no fabricated matching products and record actual representation.
- **Option C:** Treat any 2xx/4xx response as equally correct.

**Recommended: B** — directly preserves the approved Step A decision.

### Review Item 5 — Extra properties

- **Option A:** Fail if GET items contain fields not listed in the product CRUD request example.
- **Option B:** Do not fail solely on extra properties because GET `additionalProperties` behavior is not specified.
- **Option C:** Require exact equality with current DB row shape.

**Recommended: B** — no source prohibits additional fields.

### Review Item 6 — Error responses

- **Option A:** Define a custom canonical JSON error schema now.
- **Option B:** Keep formal error schema `UNRESOLVED`; record actual status/content-type/body and separately evaluate information disclosure under Step D.
- **Option C:** Ignore all error response structure.

**Recommended: B** — preserves evidence while avoiding a fabricated error contract.

### Review Item 7 — Characterization checks in generated testcases

- **Option A:** Exclude all schema characterization cases because the formal schema is missing.
- **Option B:** Include a limited set of schema characterization cases clearly labeled `CHARACTERIZATION`, alongside source-backed semantic assertions.
- **Option C:** Treat characterization observations as pass/fail contract assertions.

**Recommended: B** — keeps Step F's required schema coverage meaningful without misrepresenting undocumented behavior.

### Human Schema/Response checkpoint decisions

The tester selected:

```text
1B — Keep top-level GET response shape UNRESOLVED; JSON-array behavior is characterization only
2C — Keep exact GET product-field requirements UNRESOLVED; validate source-supported search semantics without declaring a formal required-field schema
3B — Keep primitive types UNRESOLVED; record actual types as characterization
4B — Keep no-match payload/status UNRESOLVED; require only no fabricated matching products and record actual representation
5B — Do not fail solely on extra properties because additionalProperties behavior is not specified
6B — Keep formal error schema UNRESOLVED; record actual status/content-type/body and evaluate information disclosure separately
7B — Include a limited set of clearly labeled CHARACTERIZATION schema cases in Step F alongside source-backed semantic assertions
```

These decisions approve the schema-validation design without converting implementation behavior or cross-endpoint examples into a formal GET response contract.

---

## 11. Step E status

```text
Formal GET response schema: UNRESOLVED BY DESIGN
Source-backed semantic validation: APPROVED
Characterization schema checks: APPROVED
Error schema: UNRESOLVED BY DESIGN
Schema/Response checkpoint: COMPLETE
Next step: Step F — AI Testcase Generation
```
