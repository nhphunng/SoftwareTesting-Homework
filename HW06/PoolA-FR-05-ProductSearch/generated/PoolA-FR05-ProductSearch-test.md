# API 1 — FR-05 Product Search — AI-Generated Test Cases

## Step F status

```text
API: GET /api/products?search=keyword
Source: AI
Total AI-generated testcases: 42
Primary source from Step G onward: this Markdown file
XLSX role: export/summary artifact only
Human Audit Status: PENDING
Execution Status: NOT EXECUTED
```

## Provenance and evidence rules

- Every testcase below preserves `Source = AI`.
- `Human Audit Status`, `Human Audit Reason`, `Execution Status`, `Actual Result`, `Evidence`, and `Defect ID` remain blank until the corresponding human-review or real-execution step.
- `UNRESOLVED` and `CHARACTERIZATION` labels are intentional and must not be silently converted into pass/fail contract expectations.
- Every request retains the project-required `X-Student-Id: 23127194` input.
- This file is the review source of truth for Step G onward. The XLSX file remains a generated export/summary, not the editable review master.

## Coverage summary

| Coverage | Count |
| --- | ---: |
| Functional | 8 |
| Domain | 12 |
| Boundary | 6 |
| State/Sequence | 5 |
| Security | 7 |
| Schema | 4 |
| **Total** | **42** |
| Required | ≥35 |

## Batch summary

| Batch | Count |
| --- | ---: |
| B1 Happy path | 6 |
| B2 Domain partitions | 12 |
| B3 Boundary & negative | 6 |
| B4 State & sequence | 5 |
| B5 Security | 7 |
| B6 Schema | 4 |
| B7 Cross-check | 2 |

## AI-FR05-001 — B1 Happy path

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | R-FR05-01; C-FR05-01/02 |
| Scope Type | BUSINESS + API CONTRACT |
| Category | Functional |
| Preconditions | Stable product dataset |
| Input | Header: X-Student-Id: 23127194; search omitted |
| Steps | Send GET /api/products with X-Student-Id; observe listing response. |
| Expected Status | UNRESOLVED |
| Expected Response | Request represents product-listing behavior; no search filter is applied. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Normal public read behavior |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Valid omission of optional search and base listing behavior |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-002 — B1 Happy path

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | R-FR05-02; C-FR05-02/03; DS-FR05-01 |
| Scope Type | BUSINESS + API CONTRACT |
| Category | Functional |
| Preconditions | Known keyword exists in at least one product name |
| Input | Header: X-Student-Id: 23127194; search=<known matching keyword> |
| Steps | Choose controlled matching keyword; send GET with search; inspect returned products. |
| Expected Status | UNRESOLVED |
| Expected Response | Returned results satisfy product-name search semantics for the controlled keyword. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Search input remains data |
| State Before | Matching product exists |
| State After | No mutation expected |
| AI Rationale | Core positive search behavior |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-003 — B1 Happy path

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | R-FR05-02/05; DS-FR05-02 |
| Scope Type | BUSINESS |
| Category | Functional |
| Preconditions | Keyword is absent from every product name |
| Input | Header: X-Student-Id: 23127194; search=<known no-match keyword> |
| Steps | Establish no-match keyword; send search request; inspect response. |
| Expected Status | UNRESOLVED |
| Expected Response | No matching products are fabricated; exact payload/status remains unresolved. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Normal input handling |
| State Before | No matching product |
| State After | No mutation expected |
| AI Rationale | No-match semantics without inventing [] or status |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-004 — B1 Happy path

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | R-FR05-02; C-FR05-03; DS-FR05-05 |
| Scope Type | BUSINESS |
| Category | Functional |
| Preconditions | Known exact product name exists |
| Input | Header: X-Student-Id: 23127194; search=<exact existing product name> |
| Steps | Select exact existing product name; search using full text; inspect discoverability. |
| Expected Status | UNRESOLVED |
| Expected Response | Matching product is discoverable through search-by-name semantics. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Search input remains data |
| State Before | Exact product name exists |
| State After | No mutation expected |
| AI Rationale | Positive representative for search by product name |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-005 — B1 Happy path

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | R-FR05-02; DS-FR05-03 |
| Scope Type | BUSINESS |
| Category | Functional |
| Preconditions | Keyword exists in description/category but not in any product name |
| Input | Header: X-Student-Id: 23127194; search=<keyword present only outside name> |
| Steps | Establish controlled dataset; search keyword; inspect unrelated-field-only matches. |
| Expected Status | UNRESOLVED |
| Expected Response | A product must not be considered a correct match solely because a non-name field contains the keyword. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Normal input handling |
| State Before | Keyword exists only outside name |
| State After | No mutation expected |
| AI Rationale | Strong negative rule from search-by-name requirement |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-006 — B1 Happy path

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | C-FR05-04; project X-Student-Id requirement |
| Scope Type | API CONTRACT |
| Category | Functional |
| Preconditions | Endpoint available; no JWT required by contract |
| Input | Header: X-Student-Id: 23127194; no Authorization header |
| Steps | Send public GET with X-Student-Id and no Authorization header; observe response. |
| Expected Status | UNRESOLVED |
| Expected Response | Request is valid under documented public-access contract; exact response/status remains unspecified. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Do not invent an auth requirement |
| State Before | N/A |
| State After | No mutation expected |
| AI Rationale | Confirms public endpoint context |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-007 — B2 Domain partitions

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-04; Gate A 2C |
| Scope Type | CHARACTERIZATION |
| Category | Domain |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search= |
| Steps | Send GET /api/products?search=; record actual behavior. |
| Expected Status | UNRESOLVED |
| Expected Response | Characterize empty-search behavior; no normalization defect criterion. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Input must remain safe data |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Empty-string semantics are unresolved |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-008 — B2 Domain partitions

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-05; Gate A 2C |
| Scope Type | CHARACTERIZATION |
| Category | Domain |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=%20%20%20 |
| Steps | Send whitespace-only search; record matching/normalization behavior. |
| Expected Status | UNRESOLVED |
| Expected Response | Whitespace trimming/matching semantics remain unresolved. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Input remains data |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Separates whitespace-only from omitted/empty |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-009 — B2 Domain partitions

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-06; Gate B 2B |
| Scope Type | CHARACTERIZATION |
| Category | Domain |
| Preconditions | Known normal keyword exists |
| Input | Header: X-Student-Id: 23127194; search=%20<keyword>%20 |
| Steps | Send padded-whitespace keyword; compare behavior without declaring trim requirement. |
| Expected Status | UNRESOLVED |
| Expected Response | Characterize leading/trailing whitespace handling. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Input remains data |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Distinct request form retained by Gate B |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-010 — B2 Domain partitions

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-08; Gate B 1B |
| Scope Type | CHARACTERIZATION |
| Category | Domain |
| Preconditions | Known product name contains chosen substring |
| Input | Header: X-Student-Id: 23127194; search=<known partial name> |
| Steps | Send partial-name search; record whether substring matching occurs. |
| Expected Status | UNRESOLVED |
| Expected Response | Partial/sub-string behavior is characterization only. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Input remains data |
| State Before | Matching product exists |
| State After | No mutation expected |
| AI Rationale | Preserves partial-name coverage without inventing substring contract |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-011 — B2 Domain partitions

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-10; DS-FR05-04 |
| Scope Type | CHARACTERIZATION |
| Category | Domain |
| Preconditions | Known Vietnamese/Unicode text exists in a product name |
| Input | Header: X-Student-Id: 23127194; search=<literal Vietnamese/Unicode keyword> |
| Steps | Send correctly encoded Unicode search; record result. |
| Expected Status | UNRESOLVED |
| Expected Response | Literal search behavior may be observed; accent/normalization equivalence is unresolved. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Input remains data |
| State Before | Unicode product data exists |
| State After | No mutation expected |
| AI Rationale | Covers Vietnamese/Unicode text |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-012 — B2 Domain partitions

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-11 |
| Scope Type | CHARACTERIZATION |
| Category | Domain |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=<punctuation/symbol text> |
| Steps | Send correctly URL-encoded punctuation/symbol value; record behavior. |
| Expected Status | UNRESOLVED |
| Expected Response | No format restriction is specified; record actual behavior. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Special characters must not alter SQL structure |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Covers textual domain outside alphanumerics |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-013 — B2 Domain partitions

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-12; SEC-04 |
| Scope Type | PARTIAL SECURITY / CHARACTERIZATION |
| Category | Domain |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=<script>alert(1)</script> (URL-encoded) |
| Steps | Send script-like search text; observe API response only; do not claim UI safety. |
| Expected Status | UNRESOLVED |
| Expected Response | API behavior is recorded; full SEC-04 requires UI/E2E evidence. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Partial SEC-04 coverage only |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Script-like input retained as an input-domain class |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-014 — B2 Domain partitions

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-14 |
| Scope Type | CHARACTERIZATION |
| Category | Domain |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=%2B |
| Steps | Send literal plus sign using explicit URL encoding; record behavior. |
| Expected Status | UNRESOLVED |
| Expected Response | Request construction should preserve intended literal search value. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Encoded input remains data |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Reserved-character transport coverage |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-015 — B2 Domain partitions

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-15; Gate A 1C |
| Scope Type | CHARACTERIZATION |
| Category | Domain |
| Preconditions | Known matching keyword available |
| Input | Header: X-Student-Id: 23127194; search=<lower-case variation> |
| Steps | Search lower-case variation; record result. |
| Expected Status | UNRESOLVED |
| Expected Response | Case sensitivity remains unresolved; behavior is characterization only. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Input remains data |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Case-variation representative |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-016 — B2 Domain partitions

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-15; Gate A 1C |
| Scope Type | CHARACTERIZATION |
| Category | Domain |
| Preconditions | Known matching keyword available |
| Input | Header: X-Student-Id: 23127194; search=<upper/mixed-case variation> |
| Steps | Search upper/mixed-case variation; record result. |
| Expected Status | UNRESOLVED |
| Expected Response | Case sensitivity remains unresolved; behavior is characterization only. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Input remains data |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Second case-variation representative |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-017 — B2 Domain partitions

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-19 |
| Scope Type | CHARACTERIZATION |
| Category | Domain |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=123 |
| Steps | Send textual numeric query value; record text-search behavior. |
| Expected Status | UNRESOLVED |
| Expected Response | Treat 123 as textual query input; matching depends on dataset. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Input remains data |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Avoids false numeric type-mismatch classification |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-018 — B2 Domain partitions

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-19 |
| Scope Type | CHARACTERIZATION |
| Category | Domain |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=null |
| Steps | Send literal text null; record result. |
| Expected Status | UNRESOLVED |
| Expected Response | Treat 'null' as textual query input, not JSON null. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Input remains data |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Preserves HTTP query-string semantics |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-019 — B3 Boundary & negative

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-16; Gate A 3C |
| Scope Type | CHARACTERIZATION |
| Category | Boundary |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=<one-character keyword> |
| Steps | Send one-character non-empty keyword; record behavior. |
| Expected Status | UNRESOLVED |
| Expected Response | No documented minimum length; short representative only. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Input remains data |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Short representative without fabricated min boundary |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-020 — B3 Boundary & negative

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-17; Gate B 4B |
| Scope Type | ROBUSTNESS / CHARACTERIZATION |
| Category | Boundary |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=<deliberately long safely generated string> |
| Steps | Send long keyword representative; record behavior without asserting max cutoff. |
| Expected Status | UNRESOLVED |
| Expected Response | No contractual max length; treat behavior as robustness characterization. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Long input must not create unsafe query behavior |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Approved long-input robustness coverage |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-021 — B3 Boundary & negative

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-18; Gate A 8B; Gate B 5B |
| Scope Type | ROBUSTNESS / CHARACTERIZATION |
| Category | Boundary |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; ?search=phone&search=laptop |
| Steps | Send duplicate search parameters; record precedence/representation behavior. |
| Expected Status | UNRESOLVED |
| Expected Response | Duplicate semantics are characterization only. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Input must not cause unsafe query construction |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Preserves duplicate-query human decision |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-022 — B3 Boundary & negative

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-11/14 |
| Scope Type | CHARACTERIZATION |
| Category | Boundary |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=%25 (literal %) |
| Steps | Send URL-encoded literal percent; record matching behavior. |
| Expected Status | UNRESOLVED |
| Expected Response | Wildcard/literal behavior is not specified. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Percent input must not become executable SQL structure |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | LIKE-sensitive character coverage |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-023 — B3 Boundary & negative

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-14 |
| Scope Type | CHARACTERIZATION |
| Category | Boundary |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=%26 (literal &) |
| Steps | Send URL-encoded ampersand; ensure it remains one search value; record behavior. |
| Expected Status | UNRESOLVED |
| Expected Response | Ampersand matching behavior is characterization only. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Encoded value remains data |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Delimiter-sensitive reserved character |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-024 — B3 Boundary & negative

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-14 |
| Scope Type | CHARACTERIZATION |
| Category | Boundary |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=%3D (literal =) |
| Steps | Send URL-encoded equals sign as value; record behavior. |
| Expected Status | UNRESOLVED |
| Expected Response | Equals-sign matching behavior is characterization only. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Encoded value remains data |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Key/value delimiter character as data |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-025 — B4 State & sequence

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | SQ-FR05-01; Gate C 2B |
| Scope Type | BUSINESS INVARIANT |
| Category | State/Sequence |
| Preconditions | Product dataset remains stable |
| Input | Header: X-Student-Id: 23127194; search omitted twice |
| Steps | Send listing request twice; verify first GET causes no mutation; do not require byte/order identity. |
| Expected Status | UNRESOLVED |
| Expected Response | Both requests preserve listing semantics; first GET does not mutate product data. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Read-only behavior |
| State Before | Stable dataset |
| State After | Stable dataset; no mutation |
| AI Rationale | Read-only repeatability |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-026 — B4 State & sequence

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | SQ-FR05-02; Gate C 2B |
| Scope Type | BUSINESS INVARIANT |
| Category | State/Sequence |
| Preconditions | Stable dataset and controlled keyword |
| Input | Header: X-Student-Id: 23127194; same search sent twice |
| Steps | Send controlled search twice; compare semantic behavior under stable data. |
| Expected Status | UNRESOLVED |
| Expected Response | Repeated search preserves equivalent semantics and no mutation. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Search input remains data |
| State Before | Stable dataset |
| State After | Stable dataset; no mutation |
| AI Rationale | Repeated read/idempotency-style behavior |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-027 — B4 State & sequence

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | SQ-FR05-03; Gate C 3A |
| Scope Type | BUSINESS INVARIANT |
| Category | State/Sequence |
| Preconditions | Dataset has distinct controlled keywords A and B |
| Input | Header: X-Student-Id: 23127194; search=A then search=B |
| Steps | Search A; then search B; verify B uses B rather than stale A state. |
| Expected Status | UNRESOLVED |
| Expected Response | Second request reflects its own search input. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Request-scoped input |
| State Before | Stable dataset |
| State After | No persistent search state |
| AI Rationale | Request independence |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-028 — B4 State & sequence

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | SQ-FR05-04; C-FR05-02; Gate C 3A |
| Scope Type | BUSINESS + API CONTRACT |
| Category | State/Sequence |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=<keyword> then search omitted |
| Steps | Send filtered search; then unfiltered GET; verify second request represents listing behavior. |
| Expected Status | UNRESOLVED |
| Expected Response | Prior search does not permanently filter later listing request. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Request isolation |
| State Before | Filtered request completed |
| State After | No persistent filter state |
| AI Rationale | Optional query is request-scoped |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-029 — B4 State & sequence

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | SQ-FR05-05; Gate C 2B/3A |
| Scope Type | ROBUSTNESS / SEQUENCE |
| Category | State/Sequence |
| Preconditions | Stable dataset and known normal keyword |
| Input | Header: X-Student-Id: 23127194; unusual search then normal search |
| Steps | Send approved unusual input; immediately send normal search; verify independence. |
| Expected Status | UNRESOLVED |
| Expected Response | Prior unusual GET does not persistently alter later normal search semantics. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | No persistent security side effect |
| State Before | Stable dataset |
| State After | Normal search remains independent |
| AI Rationale | State safety after unusual input |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-030 — B5 Security

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | SEC-05; Gate D 1B |
| Scope Type | SECURITY |
| Category | Security |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=' |
| Steps | Send unmatched-quote search value with correct encoding; observe whether SQL structure breaks. |
| Expected Status | UNRESOLVED |
| Expected Response | User input must not alter/break SQL structure through unsafe concatenation. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | SEC-05 parameterized query / injection resistance |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | High-priority unmatched-quote family |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-031 — B5 Security

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | SEC-05; Gate D 1B |
| Scope Type | SECURITY |
| Category | Security |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=<boolean/operator injection-oriented payload> |
| Steps | Send encoded boolean/operator payload; check for query-logic alteration beyond ordinary text matching. |
| Expected Status | UNRESOLVED |
| Expected Response | Input must remain data and not alter query logic. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | SEC-05 injection resistance |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Boolean/operator family |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-032 — B5 Security

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | SEC-05; Gate D 1B |
| Scope Type | SECURITY |
| Category | Security |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=<SQL comment-oriented payload> |
| Steps | Send encoded quote/comment payload; observe for structural manipulation. |
| Expected Status | UNRESOLVED |
| Expected Response | Comment syntax in input must not alter SQL structure. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | SEC-05 injection resistance |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | SQL comment family |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-033 — B5 Security

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | SEC-05; Gate D 1B |
| Scope Type | SECURITY |
| Category | Security |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=<UNION-like injection-oriented payload> |
| Steps | Send encoded UNION-like payload; inspect for query extension/manipulation. |
| Expected Status | UNRESOLVED |
| Expected Response | User input must not extend/alter DB query structure. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | SEC-05 injection resistance |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Structurally distinct injection family |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-034 — B5 Security

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | SEC-05; Gate D 1B |
| Scope Type | SECURITY |
| Category | Security |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; search=<percent/quote/comment combination, encoded> |
| Steps | Send encoded mixed wildcard/quote/comment input; inspect for unsafe SQL interpretation. |
| Expected Status | UNRESOLVED |
| Expected Response | Encoded input must remain data and not alter SQL structure. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | SEC-05 injection resistance with encoding |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Encoded mixed-character family |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-035 — B5 Security

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | Gate D 2A; information-disclosure risk |
| Scope Type | RISK-BASED SECURITY |
| Category | Security |
| Preconditions | Use input capable of triggering DB error if reachable during real execution |
| Input | Header: X-Student-Id: 23127194; search=<error-triggering input> |
| Steps | Send request; if error occurs, capture status/content-type/body; inspect for DB/internal details. |
| Expected Status | UNRESOLVED |
| Expected Response | Formal error schema is unresolved; internal details are evaluated as separate disclosure risk. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Avoid unnecessary internal DB/error disclosure |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Separates disclosure risk from injection root cause |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-036 — B5 Security

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | Gate D 4B; public endpoint |
| Scope Type | CHARACTERIZATION |
| Category | Security |
| Preconditions | Endpoint available |
| Input | Header: X-Student-Id: 23127194; Authorization: Bearer <invalid-or-expired-token> |
| Steps | Send public search with invalid/expired Authorization header; record actual behavior. |
| Expected Status | UNRESOLVED |
| Expected Response | Optional characterization only; do not invent rejection requirement. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Invalid-token behavior on public endpoint is characterization |
| State Before | N/A |
| State After | No mutation expected |
| AI Rationale | Preserves public contract while characterizing auth header behavior |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-037 — B6 Schema

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | Step E 1B/7B |
| Scope Type | CHARACTERIZATION |
| Category | Schema |
| Preconditions | Successful GET response available |
| Input | Header: X-Student-Id: 23127194; normal listing or controlled search |
| Steps | Send request; record whether top-level payload is array/object/other; do not treat it as formal contract. |
| Expected Status | UNRESOLVED |
| Expected Response | Record top-level response shape only. |
| Expected Schema | CHARACTERIZATION: top-level shape |
| Security Expectation | None |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Schema coverage without promoting implementation shape |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-038 — B6 Schema

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | Step E 2C/3B/5B/7B |
| Scope Type | CHARACTERIZATION |
| Category | Schema |
| Preconditions | Response contains at least one product representation |
| Input | Header: X-Student-Id: 23127194; controlled matching search |
| Steps | Send request; record item keys and primitive types; do not fail on undocumented extra fields/types alone. |
| Expected Status | UNRESOLVED |
| Expected Response | Search semantics remain source-backed; exact fields/types are recorded only. |
| Expected Schema | CHARACTERIZATION: observed keys/types/additional properties |
| Security Expectation | None |
| State Before | Matching data exists |
| State After | No mutation expected |
| AI Rationale | Fields/types/extra-properties characterization |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-039 — B6 Schema

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | Step E 4B/7B; R-FR05-05 |
| Scope Type | BUSINESS + CHARACTERIZATION |
| Category | Schema |
| Preconditions | Controlled no-match keyword |
| Input | Header: X-Student-Id: 23127194; search=<known no-match keyword> |
| Steps | Send no-match search; verify no fabricated matches; record actual payload representation. |
| Expected Status | UNRESOLVED |
| Expected Response | Business assertion: no fabricated matches; schema assertion: record representation only. |
| Expected Schema | CHARACTERIZATION: no-match payload shape |
| Security Expectation | None |
| State Before | No matching product |
| State After | No mutation expected |
| AI Rationale | Source-backed semantics plus no-match schema characterization |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-040 — B6 Schema

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | Step E 6B/7B; Gate D 2A |
| Scope Type | CHARACTERIZATION + RISK |
| Category | Schema |
| Preconditions | A real error response is reachable |
| Input | Header: X-Student-Id: 23127194; input selected to reach error path |
| Steps | Trigger real error path if reachable; record status/content-type/body; evaluate disclosure separately. |
| Expected Status | UNRESOLVED |
| Expected Response | Formal error schema remains unresolved; record actual response structure. |
| Expected Schema | CHARACTERIZATION: error status/content-type/body |
| Security Expectation | Check information-disclosure risk separately |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Error-path schema characterization |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-041 — B7 Cross-check

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | R-FR05-02; C-FR05-03; coverage consistency |
| Scope Type | BUSINESS |
| Category | Functional |
| Preconditions | Controlled keyword and dataset permit evaluating each returned item |
| Input | Header: X-Student-Id: 23127194; search=<controlled keyword> |
| Steps | Send search; for each evaluable returned item, verify consistency with product-name search semantics. |
| Expected Status | UNRESOLVED |
| Expected Response | Result set must be consistent with search-by-product-name business meaning. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Normal input handling |
| State Before | Stable controlled dataset |
| State After | No mutation expected |
| AI Rationale | Checks whole result-set consistency, not only one expected item |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR05-042 — B7 Cross-check

| Field | Value |
| --- | --- |
| Source | AI |
| API | GET /api/products?search=keyword |
| Requirement Basis | P-FR05-01 vs P-FR05-04; Gate A 2C |
| Scope Type | CHARACTERIZATION |
| Category | Functional |
| Preconditions | Stable dataset |
| Input | Header: X-Student-Id: 23127194; compare search omitted vs search= |
| Steps | Send unfiltered GET; then empty-search GET; record whether behavior is equivalent or different without asserting either. |
| Expected Status | UNRESOLVED |
| Expected Response | Omitted-vs-empty relationship is characterization only. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Safe input handling |
| State Before | Stable dataset |
| State After | No mutation expected |
| AI Rationale | Cross-checks two approved domain partitions |
| Human Audit Status | |
| Human Audit Reason | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |
