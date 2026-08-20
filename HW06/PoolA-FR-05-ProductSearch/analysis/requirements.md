# API 1 — FR-05 Product Search — Requirement Extraction

## 1. Scope

```text
Pool: A
FR: FR-05 — Product listing and search
Method: GET
Endpoint: /api/products
Query: ?search=keyword (optional)
Authentication: Public
```

This artifact follows the approved Option B source model:

1. `README.md` = business truth / expected business behavior.
2. `api_specification.md` = API interface contract.
3. `backend/server.js` = implementation observation only.

Implementation observations do not redefine expected behavior and are not confirmed defects without runtime verification.

---

## 2. REQUIREMENT — Business behavior

Source: SUT `README.md`, FR-05.

### R-FR05-01 — Product listing

The home page must display the product list.

API relevance:

- The API must support retrieving products for the listing workflow.
- `GET /api/products` is the documented API serving this behavior.

### R-FR05-02 — Search by product name

The search bar searches **by product name**.

API relevance:

- search semantics should be based on product name;
- a search result should not be considered correct merely because another product field contains the keyword.

### R-FR05-03 — Safe handling of displayed search text

User-provided search keywords must be displayed safely and must not be rendered as HTML.

Classification:

```text
UI / security-rendering requirement
```

API relevance:

- API tests may use HTML/script-like search strings as inputs;
- however, whether the keyword is rendered safely belongs to UI behavior and cannot be proven by API response testing alone.

Related security requirement: `SEC-04`.

### R-FR05-04 — Loading state

The UI must show a loading state while data is being loaded.

Classification:

```text
UI-only requirement for this API-testing scope
```

Do not convert this into an API functional testcase unless a later test specifically measures client loading behavior outside the API suite.

### R-FR05-05 — Empty state

When search returns no result, the UI must show an appropriate empty-state message.

API relevance:

- API testing can verify the **no-match API result behavior**;
- the visual/message requirement itself is UI-only.

### R-FR05-06 — Product presentation fields

Each product is displayed with image, name and price, with UI-specific image/price formatting requirements.

API relevance:

- whether the API response contains product fields may be tested only where supported by the API contract or a human-approved schema expectation;
- image aspect ratio, alt text and currency formatting are UI requirements, not API response requirements.

### R-FR05-07 — Single `<h1>`

The page must contain exactly one `<h1>`.

Classification:

```text
UI-only requirement
```

Not part of the API testcase scope.

---

## 3. API CONTRACT

Source: `api_specification.md`, section 3.1.

### C-FR05-01 — Endpoint

```http
GET /api/products
```

### C-FR05-02 — Optional query parameter

```text
search
```

The API specification defines:

```http
GET /api/products?search=keyword
```

The `search` query is optional.

### C-FR05-03 — Search meaning

The API specification states that `search` searches products by **name**.

### C-FR05-04 — Authentication

No authentication requirement is documented for `GET /api/products`.

Classification:

```text
Public endpoint
```

### C-FR05-05 — Request body

No request body is documented.

Expected request shape:

```text
Method: GET
Path: /api/products
Optional query: search=<keyword>
Body: none
```

---

## 4. SECURITY REQUIREMENTS

### S-FR05-01 — SEC-05: Parameterized database query

SEC-05 states that database queries must use parameterized queries and must not concatenate user input directly into SQL.

Applicability:

```text
DIRECTLY APPLICABLE
```

Reason:

`search` is user-controlled input used for product-name lookup.

This requirement supports later injection-oriented test design.

### S-FR05-02 — SEC-04: Safe UI rendering

SEC-04 states that user-provided data displayed on the UI must be escaped correctly and must not be rendered through unsafe HTML handling.

Applicability to API suite:

```text
PARTIAL
```

The API suite can supply malicious-looking search values and inspect API behavior, but cannot alone prove safe browser rendering.

### SEC requirements not directly applicable

| SEC | Applicability to GET product search | Reason |
| --- | --- | --- |
| SEC-01 | Not directly applicable | Password storage is unrelated |
| SEC-02 | Not applicable under documented contract | Endpoint is public |
| SEC-03 | Not applicable | Endpoint is not Admin-only |
| SEC-06 | Not applicable | Profile-role update only |
| SEC-07 | Not applicable | OTP/reset-password only |

---

## 5. Inputs and constraints

### 5.1 Path parameters

None.

### 5.2 Query parameters

| Parameter | Required | Type | Business meaning | Explicit constraints |
| --- | --- | --- | --- | --- |
| `search` | No | `UNRESOLVED` at HTTP contract level; treated as query text by documentation | Search product by name | No length, format, charset or normalization constraint specified |

Important distinction:

The documentation gives an example textual keyword but does **not** formally define:

- maximum/minimum length;
- case sensitivity;
- trimming behavior;
- Unicode normalization;
- wildcard semantics;
- whether empty string equals omitted parameter;
- whether multiple `search` parameters are allowed;
- encoding rules beyond normal URL/query behavior.

These must not be invented as requirements.

### 5.3 Headers

No endpoint-specific required headers are documented.

Standard HTTP headers may be used by the client/tool, but they are not FR-05 requirements unless later evidence establishes otherwise.

### 5.4 Request body

None documented.

---

## 6. Expected behavior supported by sources

### 6.1 No search parameter

Supported expectation:

```text
Retrieve the product listing.
```

Exact HTTP status and formal schema: `UNRESOLVED` unless stated elsewhere.

### 6.2 Search parameter with a matching keyword

Supported expectation:

```text
Return product results matching the product-name search semantics.
```

The exact matching algorithm is not specified beyond searching by name.

### 6.3 Search parameter with no matching product

Supported API-level expectation:

```text
Represent a no-match search result without fabricating matching products.
```

The business requirement explicitly requires a UI empty state, but the API's exact no-result payload/schema/status is not specified.

### 6.4 Invalid or malicious-looking input

The sources do not define a special HTTP status for such inputs.

Security expectation from SEC-05:

```text
User-controlled search input must not change SQL structure through string concatenation/injection.
```

Do not invent a required 400/422 response unless later contract evidence supports it.

---

## 7. Response contract

### Explicitly specified

The API returns product-list data for `GET /api/products` and supports filtering/searching by product name.

### UNRESOLVED

The following are not formally specified in `api_specification.md` for this endpoint:

- success HTTP status code;
- error HTTP status codes;
- exact JSON array/object schema;
- required product response fields;
- field types;
- ordering;
- case sensitivity;
- pagination;
- sorting;
- result-count metadata;
- content-type requirement;
- error response schema.

These must not be turned into expected contract assertions without an additional approved basis.

---

## 8. State model

FR-05 search is a read-only operation and no explicit business state machine is defined.

```text
State machine: N/A
State change: none expected
```

Relevant contextual states may include product dataset contents (matching product exists / no matching product), but these are test-data preconditions rather than resource state transitions caused by the request.

---

## 9. IMPLEMENTATION OBSERVATIONS — not expected behavior

Source: `backend/server.js`.

The current implementation:

```text
reads req.query.search
if truthy → builds a SQL LIKE query
otherwise → SELECT * FROM products
```

Static code inspection shows the search branch constructs SQL using string interpolation:

```text
SELECT * FROM products WHERE name LIKE '%<searchQuery>%'
```

rather than passing the search value as a query parameter.

Classification:

```text
IMPLEMENTATION OBSERVATION
Potential SEC-05 mismatch
Not a CONFIRMED DEFECT yet
```

The implementation also returns an HTML-formatted database error on search-query DB failure. Since the API specification does not define the error schema, this is an implementation observation and a later security/information-disclosure test target, not yet an expected-schema violation.

---

## 10. Requirement traceability matrix

| ID | Source | Requirement / Contract | API-test relevance | Status |
| --- | --- | --- | --- | --- |
| R-FR05-01 | README FR-05 | Product listing | Direct | Resolved |
| R-FR05-02 | README FR-05 | Search by product name | Direct | Resolved |
| R-FR05-03 | README FR-05 | Search text safely rendered | Partial — UI validation required | Resolved scope |
| R-FR05-04 | README FR-05 | Loading state | UI only | Excluded from API suite |
| R-FR05-05 | README FR-05 | Empty state | API no-match + UI presentation | Partial |
| R-FR05-06 | README FR-05 | Product presentation fields | Partial / mostly UI | Partial |
| R-FR05-07 | README FR-05 | Exactly one h1 | UI only | Excluded from API suite |
| C-FR05-01 | API spec | `GET /api/products` | Direct | Resolved |
| C-FR05-02 | API spec | Optional `search` | Direct | Resolved |
| C-FR05-03 | API spec | Search by name | Direct | Resolved |
| C-FR05-04 | API spec | Public endpoint | Direct | Resolved |
| S-FR05-01 | SEC-05 | Parameterized queries | Direct security coverage | Resolved |
| S-FR05-02 | SEC-04 | Safe rendering | Partial / UI | Resolved scope |

---

## 11. UNRESOLVED items for later human review/test design

| ID | Unresolved question | Why unresolved | Handling |
| --- | --- | --- | --- |
| U-FR05-01 | Exact success HTTP status | Not stated for this endpoint | **Human decision: Option C** — keep `UNRESOLVED`; do not use implementation defaults as the expected contract |
| U-FR05-02 | Exact response schema/field types | Not formally specified | **Human decision: Option C** — assert only source-supported search semantics; keep the full schema `UNRESOLVED` |
| U-FR05-03 | Empty/no-match payload | UI behavior specified, API payload not specified | **Human decision: Option C** — require only no-match business semantics; keep exact payload/status `UNRESOLVED` |
| U-FR05-04 | Case sensitivity | Not specified | **Human decision: Option C** — keep `UNRESOLVED`; characterize actual behavior without treating it as a requirement violation |
| U-FR05-05 | Whitespace trimming | Not specified | **Human decision: Option C** — keep `UNRESOLVED`; characterize actual behavior without assuming trim/no-trim semantics |
| U-FR05-06 | Search length boundaries | Not specified | **Human decision: Option C** — do not invent a numeric maximum; long-input cases may be robustness/security tests only |
| U-FR05-07 | Pagination/sort/filter interaction | Not documented for this endpoint | **Human decision: Option C** — mark `NOT SPECIFIED / NOT IN SCOPE` unless another approved source introduces it |
| U-FR05-08 | Duplicate query parameter semantics | Not specified | **Human decision: Option B** — include as a robustness/characterization case if useful, but do not claim FR-05 violation from the observed semantics alone |

### Human Gate A decisions

The tester reviewed all eight unresolved items and selected:

```text
1C — Case sensitivity: keep UNRESOLVED
2C — Whitespace trimming: keep UNRESOLVED
3C — Search length boundary: no invented maximum
4C — No-result payload/status: business semantics only; exact API contract remains UNRESOLVED
5C — Success HTTP status: keep UNRESOLVED
6C — Full response schema: keep UNRESOLVED except source-supported semantics
7C — Pagination/sort/filter: NOT SPECIFIED / NOT IN SCOPE
8B — Duplicate search query parameters: robustness/characterization only
```

These decisions close the Step A review without creating new requirements. They constrain later test design so exploratory or robustness behavior is not misreported as business non-compliance.

---

## 12. Step A output summary

For the API suite, the strongest source-supported testing bases are:

```text
1. GET /api/products is public.
2. search is optional.
3. search operates on product name.
4. no-search retrieves the product listing.
5. no-match behavior must not invent matches; UI empty-state presentation is separate.
6. SEC-05 requires parameterized database queries for user-controlled search input.
7. Exact status/schema/normalization/boundary rules remain UNRESOLVED where not specified.
8. FR-05 has no explicit state transition model.
```

Human Gate A review is complete. Step A is approved to proceed to Step B — Domain Partition Design under the decisions above.
