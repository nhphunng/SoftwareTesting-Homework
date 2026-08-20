# API 1 — FR-05 Product Search — Domain Partition Design

## 1. Scope and basis

```text
Endpoint: GET /api/products
Query parameter: search (optional)
Authentication: Public
Primary requirement: search products by name
Security basis: SEC-05 parameterized database query
```

This partition model is derived from `analysis/requirements.md` and follows Option B:

1. `README.md` defines business expectations.
2. `api_specification.md` defines the API contract.
3. `backend/server.js` is implementation observation only.

No undocumented length, case-sensitivity, trimming, normalization, status-code, or response-schema rule is introduced here.

---

## 2. Parameter inventory

FR-05 exposes one documented API input parameter:

| Parameter | Location | Required | Documented meaning | Explicit constraints |
| --- | --- | --- | --- | --- |
| `search` | Query | No | Search products by name | None beyond being an optional query keyword |

There are no documented path parameters or request-body fields for this endpoint.

The absence of the optional parameter is itself a meaningful contract partition because it represents the normal product-listing behavior.

---

## 3. Partition model

### P-FR05-01 — `search` omitted

| Attribute | Value |
| --- | --- |
| Category | MISSING / VALID CONTRACT STATE |
| Example | `GET /api/products` |
| Basis | C-FR05-02, R-FR05-01 |
| Expected | Retrieve the product listing |
| Status/schema | `UNRESOLVED` |

Rationale: `search` is optional, so omission is valid and semantically different from an explicit search value.

---

### P-FR05-02 — non-empty keyword with at least one name match

| Attribute | Value |
| --- | --- |
| Category | VALID |
| Example | `search=<known substring of an existing product name>` |
| Basis | R-FR05-02, C-FR05-03 |
| Precondition | Test data contains at least one product whose **name** matches the chosen keyword |
| Expected | Returned results satisfy product-name search semantics |

Do not hard-code a product keyword until the test dataset used for execution is established.

---

### P-FR05-03 — non-empty keyword with no name match

| Attribute | Value |
| --- | --- |
| Category | VALID / NO-MATCH |
| Example | `search=<keyword known not to occur in any product name>` |
| Basis | R-FR05-02, R-FR05-05 |
| Precondition | Dataset is known not to contain the keyword in product names |
| Expected | No matching products are fabricated |
| Exact payload/status | `UNRESOLVED` |

The UI empty-state message is outside this API partition. This partition only covers API no-match semantics.

---

### P-FR05-04 — empty value

| Attribute | Value |
| --- | --- |
| Category | EMPTY / CHARACTERIZATION |
| Example | `GET /api/products?search=` |
| Basis | U-FR05-03, U-FR05-05 |
| Expected | `UNRESOLVED` whether empty is treated as omitted or as an explicit empty search |

Reason: neither business requirement nor API specification defines empty-string semantics.

Do not classify a particular normalization behavior as correct until a human-approved expectation is established.

---

### P-FR05-05 — whitespace-only value

| Attribute | Value |
| --- | --- |
| Category | WHITESPACE / CHARACTERIZATION |
| Example | `search=%20%20%20` |
| Basis | U-FR05-05 |
| Expected | `UNRESOLVED` whether whitespace is trimmed, matched literally, or otherwise normalized |

This is a useful partition because whitespace-only input is operationally distinct from omitted and empty query forms.

---

### P-FR05-06 — keyword with leading/trailing whitespace

| Attribute | Value |
| --- | --- |
| Category | FORMAT / CHARACTERIZATION |
| Example | `search=%20phone%20` |
| Basis | U-FR05-05 |
| Expected | Search normalization behavior is `UNRESOLVED` |

The test may record actual behavior, but must not assert trimming unless a human-approved requirement is added.

---

### P-FR05-07 — exact full product-name keyword

| Attribute | Value |
| --- | --- |
| Category | VALID |
| Example | `search=<exact existing product name>` |
| Basis | R-FR05-02, C-FR05-03 |
| Expected | Matching product name is discoverable through the search behavior |

This partition complements substring search without assuming exact-match-only semantics.

---

### P-FR05-08 — partial product-name keyword

| Attribute | Value |
| --- | --- |
| Category | VALID |
| Example | `search=<known substring of an existing product name>` |
| Basis | API example `search=keyword` + business search-by-name semantics |
| Expected | Characterize whether matching by substring satisfies documented behavior |

The implementation currently uses SQL `LIKE '%keyword%'`, but that implementation detail is **not** treated as the expected contract. The expected matching algorithm beyond "search by name" remains partially unspecified.

---

### P-FR05-09 — keyword whose text exists only in a non-name field

| Attribute | Value |
| --- | --- |
| Category | NEGATIVE BUSINESS PARTITION |
| Example | keyword present in description/category but absent from all product names |
| Basis | R-FR05-02 |
| Precondition | Controlled dataset supports the distinction |
| Expected | A product must not be considered a correct match solely because another field contains the keyword |

This is one of the strongest source-supported negative partitions because FR-05 explicitly says search is by **name**.

---

### P-FR05-10 — Unicode / Vietnamese text

| Attribute | Value |
| --- | --- |
| Category | SPECIAL CHARACTER / CHARACTERIZATION |
| Example | `search=điện`, `search=áo` when supported by known test data |
| Basis | No charset restriction documented; application content is Vietnamese |
| Expected | Functional search semantics where matching test data exists; normalization/accent behavior beyond literal matching is `UNRESOLVED` |

Do not assert accent-insensitive or Unicode-normalized equivalence unless separately approved.

---

### P-FR05-11 — punctuation/symbol characters

| Attribute | Value |
| --- | --- |
| Category | SPECIAL CHARACTER |
| Example | `search=-`, `search=&`, `search=%25` after correct URL encoding |
| Basis | No format restriction documented |
| Expected | Request must not be treated as a license for SQL-structure manipulation; normal matching semantics otherwise depend on dataset |

This partition is distinct from deliberate injection payloads.

---

### P-FR05-12 — HTML/script-like text

| Attribute | Value |
| --- | --- |
| Category | SECURITY INPUT / SEC-04 PARTIAL |
| Example | `search=<script>alert(1)</script>` URL-encoded in the request |
| Basis | R-FR05-03, SEC-04 |
| API expectation | API behavior can be observed; safe browser rendering cannot be proven by API testing alone |

This input may be retained in the API suite as a security-oriented request partition, but final XSS safety belongs to UI testing.

---

### P-FR05-13 — SQL-injection-oriented input

| Attribute | Value |
| --- | --- |
| Category | SECURITY / SEC-05 |
| Example class | quote/comment/operator payloads intended to alter SQL meaning |
| Basis | SEC-05 |
| Expected | User-controlled input must not alter SQL query structure through concatenation/injection |
| Exact status | `UNRESOLVED`; do not require 400/422 without contract support |

This is a high-priority partition because SEC-05 directly requires parameterized queries.

Examples should be selected later during testcase generation so individual payloads can be audited and safely encoded.

---

### P-FR05-14 — URL-encoded reserved characters

| Attribute | Value |
| --- | --- |
| Category | FORMAT / SPECIAL CHARACTER |
| Example | encoded `+`, `%`, `&`, `=` inside the query value |
| Basis | Query-string transport behavior; no product-specific restriction documented |
| Expected | Correctly encoded input should remain a `search` value rather than accidentally changing query-string structure |

This partition checks request construction/transport correctness without inventing product-name matching rules.

---

### P-FR05-15 — case variation

| Attribute | Value |
| --- | --- |
| Category | CHARACTERIZATION |
| Example | existing product name keyword in lower/upper/mixed case |
| Basis | U-FR05-04 |
| Expected | Case sensitivity is `UNRESOLVED` |

Record actual behavior; do not classify case-insensitive or case-sensitive matching as a requirement yet.

---

### P-FR05-16 — very short non-empty keyword

| Attribute | Value |
| --- | --- |
| Category | LENGTH / CHARACTERIZATION |
| Example | one-character keyword |
| Basis | U-FR05-06 |
| Expected | No documented minimum length; behavior can be characterized |

A one-character value is useful as a short-length representative, but it is **not** declared a formal boundary because the specification defines no minimum.

---

### P-FR05-17 — long keyword

| Attribute | Value |
| --- | --- |
| Category | LENGTH / CHARACTERIZATION |
| Example | a deliberately long but safely generated search string |
| Basis | U-FR05-06 |
| Expected | No documented maximum length or overflow threshold |

Do not invent values such as 255/256 or 1024/1025 as specification boundaries. If concrete lengths are later exercised, label them test-design representatives rather than contractual boundary values.

---

### P-FR05-18 — duplicate `search` query parameters

| Attribute | Value |
| --- | --- |
| Category | DUPLICATE / EXPLORATORY |
| Example | `?search=phone&search=laptop` |
| Basis | U-FR05-08 |
| Expected | `UNRESOLVED` |

This partition may be tested for characterization, but no correct duplicate-parameter precedence is defined by the SUT contract.

---

### P-FR05-19 — literal textual values such as `null`, `undefined`, numbers, booleans

| Attribute | Value |
| --- | --- |
| Category | TYPE-LIKE / FORMAT CHARACTERIZATION |
| Example | `search=null`, `search=123`, `search=true` |
| Basis | Query values arrive textually; API contract provides no type validation rule |
| Expected | Treat as textual search input unless a later source defines another rule; matching outcome depends on dataset |

Important: HTTP query strings do not carry JSON `null`, numeric, or boolean types by themselves. These are textual values, so they must not be mislabeled as true type-mismatch cases.

---

## 4. Categories intentionally not forced onto FR-05

The generic Step B checklist contains categories such as `NULL`, `TYPE MISMATCH`, `OVERFLOW`, and numeric `BOUNDARY`. For this endpoint they must be interpreted carefully.

| Generic category | FR-05 treatment | Reason |
| --- | --- | --- |
| NULL | Not directly representable as JSON null in a normal query string | `search=null` is text, not a true null value |
| TYPE MISMATCH | Not directly defined | Query parameters are textual at HTTP transport level and no typed schema is documented |
| Numeric boundary | Not applicable | `search` is not documented as numeric |
| Formal length boundary | `UNRESOLVED` | No min/max length specified |
| Overflow | Characterization only | No defined storage/input limit in the contract |
| Request body validation | Not applicable | GET endpoint has no documented body |

This prevents artificial testcase creation merely to tick every generic category.

---

## 5. Coverage matrix

| Partition ID | Dimension | Requirement / Contract basis | Expected confidence |
| --- | --- | --- | --- |
| P-FR05-01 | Missing optional query | C-FR05-02, R-FR05-01 | Resolved |
| P-FR05-02 | Matching keyword | R-FR05-02, C-FR05-03 | Resolved business semantics |
| P-FR05-03 | No-match keyword | R-FR05-02, R-FR05-05 | Resolved semantics; payload unresolved |
| P-FR05-04 | Empty | U-FR05-03/05 | Characterization |
| P-FR05-05 | Whitespace only | U-FR05-05 | Characterization |
| P-FR05-06 | Leading/trailing whitespace | U-FR05-05 | Characterization |
| P-FR05-07 | Exact-name search | R-FR05-02 | Resolved search basis; algorithm partially unresolved |
| P-FR05-08 | Partial-name search | R-FR05-02, C-FR05-03 | Search basis resolved; substring semantics partially unresolved |
| P-FR05-09 | Keyword only in non-name field | R-FR05-02 | Strong resolved negative partition |
| P-FR05-10 | Unicode/Vietnamese | No charset restriction + domain content | Characterization beyond literal semantics |
| P-FR05-11 | Punctuation/symbol | No format restriction | Characterization/security-adjacent |
| P-FR05-12 | HTML/script-like text | R-FR05-03, SEC-04 | Partial API coverage |
| P-FR05-13 | SQL injection-oriented | SEC-05 | Strong security requirement |
| P-FR05-14 | Encoded reserved characters | HTTP query transport | Contract/transport characterization |
| P-FR05-15 | Case variation | U-FR05-04 | Characterization |
| P-FR05-16 | Very short keyword | U-FR05-06 | Characterization |
| P-FR05-17 | Long keyword | U-FR05-06 | Characterization |
| P-FR05-18 | Duplicate query | U-FR05-08 | Exploratory |
| P-FR05-19 | Textual type-like values | Query-string semantics | Characterization |

---

## 6. Data-precondition model

Some partitions require controlled product data. Test generation must distinguish the following dataset conditions:

```text
D1 — at least one product name contains the chosen keyword
D2 — no product name contains the chosen keyword
D3 — keyword exists in another product field but not in product name
D4 — product names contain Vietnamese/Unicode text when Unicode matching is tested
D5 — known exact product name exists for exact-name search
```

These are test-data preconditions, not API state transitions.

Do not use arbitrary keywords and then infer expected matches without first establishing the dataset.

---

## 7. Security partition notes

### SEC-05

The core security invariant is:

```text
search input must remain data, not executable SQL structure
```

Later security testcases should vary payload families rather than relying on one injection string. Potential families include:

- unmatched quote;
- boolean/operator manipulation;
- SQL comment syntax;
- wildcard-heavy input;
- combinations of encoded quote/comment characters.

Individual payloads and expected observations belong to Step F testcase generation and later human audit.

### SEC-04

HTML/script-like values can be sent through the API, but the API suite cannot prove safe rendering. The final requirement should be traced to UI testing if the homework later needs SEC-04 end-to-end evidence.

---

## 8. Boundary handling decision

There is **no source-supported numeric length boundary** for `search`.

Therefore Step B explicitly avoids invented equivalence classes such as:

```text
VALID: length 1–255
INVALID: length >255
BOUNDARY: 255 / 256
```

Those would be fabricated requirements.

Instead, length is represented as:

```text
short representative
normal representative
long representative
```

with long/short behavior treated as characterization until a contract limit is approved.

---

## 9. Step B review checklist

Human Gate B should verify:

- [ ] The only documented API parameter, `search`, is fully considered.
- [ ] Omitted `search` is treated separately from empty and whitespace-only values.
- [ ] Matching and no-match partitions use controlled test data.
- [ ] Search correctness is evaluated against **product name**, not unrelated fields.
- [ ] SEC-05 injection-oriented coverage is retained.
- [ ] SEC-04 API-vs-UI scope is not conflated.
- [ ] No artificial min/max search length was invented.
- [ ] Case, trimming, duplicate-query and long-input behavior remain characterization where unresolved.
- [ ] `search=null`/`123`/`true` are understood as textual query values, not true JSON type mismatches.
- [ ] Irrelevant generic categories are not forced onto the endpoint.

## 10. Step B status

```text
Partition model: COMPLETE FOR HUMAN REVIEW
Gate B: PENDING HUMAN REVIEW
Next step after approval: Step C — State Transition Analysis
```
