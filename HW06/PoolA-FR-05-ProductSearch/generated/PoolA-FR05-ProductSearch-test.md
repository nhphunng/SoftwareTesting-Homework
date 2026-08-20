# API 1 — FR-05 Product Search — Audited Test Cases

## Step G status

```text
API: GET /api/products?search=keyword
Source: MIXED (AI + HUMAN)
Total testcases currently retained: 47 (42 AI-generated + 5 human-added)
AI-generated audit result: 32 initially VALID / 10 initially INCOMPLETE / 0 INVALID; all 42 approved after correction/re-review
Primary source from Step G onward: this Markdown file
XLSX role: export/summary artifact only
Human Audit Status: COMPLETE (AI-FR05-001..042)
Human-added testcase status: 5 reviewer-authored cases approved, implemented, and included in official execution
Execution Status: OFFICIAL NEWMAN EXECUTION COMPLETE — 47 testcase IDs / 62 requests / 142 assertions / 138 passed / 4 failed; 3 confirmed defects
Required per-request header: X-Student-Id: 23127194 (fixed value, no longer a template placeholder)
```

## Provenance and evidence rules

- Every AI-FR05-xxx testcase preserves `Source = AI`. Every HUMAN-FR05-xxx testcase preserves genuine `Source = HUMAN` provenance and was supplied by the reviewer; AI only translated and tightened wording to remove unsupported assumptions.
- `Human Audit Status` and `Human Audit Reason` are filled for all 42 AI-generated cases. The official execution completed on 2026-08-20; execution-level evidence is recorded in `evidence/FR05-execution-summary.md` and the Newman reports. Per-case execution fields in this design master are retained primarily for defect-bearing HUMAN cases; the official Newman report is the execution source of truth for the full suite.
- `UNRESOLVED` and `CHARACTERIZATION` labels are intentional and must not be silently converted into pass/fail contract expectations.
- Every request carries the project-required header `X-Student-Id: 23127194`, sendable via a Postman/Newman pre-request script.
- Audit labels used: `VALID` (correct, adequately grounded), `INVALID` (not applicable / duplicate / wrong expectation), `INCOMPLETE` (right idea, but missing a concrete value, precondition, or traceability needed before implementation).
- This file is the review source of truth for Step G onward. The XLSX file remains a generated export/summary, not the editable review master.

## Audit summary (AI-FR05-001 .. 042)

| Label | Count | Case IDs |
| --- | ---: | --- |
| VALID | 32 | 001–011, 014–019, 021–028, 030, 036–039, 041–042 |
| INCOMPLETE | 10 | 012, 013, 020, 029, 031, 032, 033, 034, 035, 040 |
| INVALID | 0 | — |

The 10 cases labeled `INCOMPLETE` below preserve their **original Step G audit status** for provenance. They were corrected with concrete inputs, human re-reviewed, approved, implemented, and included in the official execution. Originally, these cases were not implementation-ready because The dominant issue is **reproducibility**: several cases use descriptive categories or conditional triggers instead of concrete literal inputs (for example, "boolean/operator injection-oriented payload", "deliberately long safely generated string", or "error-triggering input"). `AI-FR05-029` also needs the exact prior case ID it reuses. `AI-FR05-013` is incomplete for a different reason: API-only evidence can characterize handling of script-like input, but it cannot by itself prove the UI escaping requirement in SEC-04; its API-layer assertion boundary must remain explicit rather than inventing a mandatory response Content-Type. Fix these gaps before Postman implementation.


## Audit revision note

- Reviewer-requested cleanup applied before Postman implementation.
- `AI-FR05-035` and `AI-FR05-040` were changed from `VALID` to `INCOMPLETE` because their error triggers are not concrete/reproducible.
- `AI-FR05-013` remains `INCOMPLETE`, but its audit reason now preserves the SEC-04 boundary: API tests cannot by themselves prove browser escaping/rendering safety.
- Previous `HUM-FR05-001..005` cases were removed from the retained suite. Five replacement cases `HUMAN-FR05-043`, `044`, `046`, `047`, and `048` were human-authored, approved, implemented, and executed.
- Official execution completed on 2026-08-20. Three confirmed defects were reported as FR05-BUG-01/02/03 and linked to GitHub Issues #24/#25/#26.

## Correction status for previously INCOMPLETE AI cases

The original Human Audit labels are preserved for provenance. Ten AI cases previously marked `INCOMPLETE` were corrected with concrete, reproducible versions and subsequently approved by human re-review before Postman implementation.

| Case IDs | Original Audit | Correction Status |
| --- | --- | --- |
| AI-FR05-012, 013, 020, 029, 031, 032, 033, 034, 035, 040 | INCOMPLETE | Corrected for reproducibility; `VALID — HUMAN RE-REVIEW APPROVED` |

No case was automatically reclassified by AI; the corrected versions were explicitly human re-reviewed and approved before execution.

## Coverage summary

| Coverage | Count |
| --- | ---: |
| Functional | 8 |
| Domain | 12 |
| Boundary | 6 |
| State/Sequence | 5 |
| Security | 7 |
| Schema | 4 |
| **Total currently retained** | **42** |
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
| Human Audit Status | VALID |
| Human Audit Reason | Sound baseline listing test; correctly avoids asserting an undocumented default status/schema for the omitted-search case. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Reproducible positive-match case with a controlled precondition; core requirement coverage. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Correctly separates the no-match business rule from any status/schema assumption not in the contract. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Distinct partition from AI-FR05-002 (exact full-name match vs partial keyword match); minor overlap is acceptable and does not make the case incorrect, though the two could be merged for efficiency. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Important negative business rule (search-by-name only, not by description/category); well scoped and testable. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Confirms the documented public-access contract without inventing an authentication requirement that is not specified. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Empty-string search=<blank> is a distinct domain partition from omitted search; correctly scoped as characterization. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Whitespace-only search is a distinct partition from both omitted and empty string; justified separation. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Leading/trailing whitespace around a real keyword is a reasonable and reproducible characterization case. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Substring/partial-name matching characterization is reproducible given the stated precondition. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Unicode/Vietnamese text coverage is directly relevant to the product domain and is a real risk area (encoding, normalization). |
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
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | The input value 'punctuation/symbol text' is a placeholder, not a concrete literal. A tester cannot reproduce or automate this case without a fixed example string (e.g. a defined set of symbol characters). Needs a concrete value before implementation. |
| Corrected Input | Header: `X-Student-Id: 23127194`; `search=!@#$^*()_+-=[]{};,.?` (URL-encode through the client/request library) |
| Corrected Steps | Send exactly the fixed punctuation string above as the search value; record status, response body shape, and whether the request is parsed as one search value. |
| Corrected Expected | CHARACTERIZATION: no specific match set is required. The fixed symbol string must be treated as request data rather than altering request parsing or SQL structure. |
| Correction Notes | Replaces the descriptive `<punctuation/symbol text>` placeholder with one fixed literal so the same case can be rerun identically. |
| Re-review Status | VALID — HUMAN RE-REVIEW APPROVED |
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
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | The payload is concrete, but the case does not define a sufficiently clear API-layer assertion. SEC-04 is a UI rendering/escaping requirement, so API-only evidence cannot prove that script text is safely rendered in the browser. Keep this case as partial characterization and explicitly limit its assertion to safe request/response handling; full SEC-04 verification requires UI/E2E evidence. Do not invent a mandatory Content-Type requirement that the contract does not define. |
| Corrected Input | Header: `X-Student-Id: 23127194`; `search=<script>alert(1)</script>` (URL-encoded by the client) |
| Corrected Steps | Send the exact script-like string; record status, response Content-Type, and response body. Do not treat API-only evidence as proof of browser/DOM XSS safety. |
| Corrected Expected | PARTIAL SEC-04 CHARACTERIZATION: record how the API transports/returns data for this exact input. Full SEC-04 verdict remains dependent on UI/E2E rendering behavior; no mandatory JSON Content-Type is invented. |
| Correction Notes | Keeps the concrete payload and adds an explicit API-level observation target without turning JSON Content-Type into an unsupported contract requirement. |
| Re-review Status | VALID — HUMAN RE-REVIEW APPROVED |
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
| Human Audit Status | VALID |
| Human Audit Reason | Reserved-character transport encoding (%2B) is a legitimate, low-cost boundary case. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Lower-case variation is a reasonable representative for the case-sensitivity partition. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Upper/mixed-case variation complements AI-FR05-015 as the other side of the same partition. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Numeric-as-text input is a real ambiguity worth characterizing explicitly. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Literal 'null' string vs JSON null is a genuine and common implementation pitfall worth covering. |
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
| Human Audit Status | VALID |
| Human Audit Reason | One-character keyword is a reasonable minimum-length representative without inventing a contractual minimum. |
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
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | 'Deliberately long safely generated string' has no concrete length. Without a fixed number of characters (e.g. 2,000 or 10,000), the case is not reproducible and cannot be re-run identically during regression. Needs an explicit length parameter. |
| Corrected Input | Header: `X-Student-Id: 23127194`; `search=` followed by exactly 2,000 ASCII `A` characters |
| Corrected Steps | Generate `A.repeat(2000)` in the test data/pre-request script; send it as the search value; record actual status/body and confirm the request does not cause persistent mutation. |
| Corrected Expected | ROBUSTNESS CHARACTERIZATION: no contractual maximum length is assumed. Record actual behavior for the fixed 2,000-character input. |
| Correction Notes | Fixes the length at exactly 2,000 characters so regression runs exercise the same boundary representative. |
| Re-review Status | VALID — HUMAN RE-REVIEW APPROVED |
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
| Human Audit Status | VALID |
| Human Audit Reason | Duplicate query parameter handling (?search=phone&search=laptop) is a legitimate and often-overlooked precedence/parsing case. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Literal '%' as a SQL LIKE wildcard character is a well-targeted case bridging boundary and injection-adjacent risk. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Literal '&' as an encoded reserved character is a legitimate transport-boundary case, distinct from AI-FR05-014/024. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Literal '=' as an encoded reserved character rounds out the reserved-character family started by AI-FR05-014/023. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Read-only repeatability (idempotent GET, no mutation) is a correct and necessary state/sequence case. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Repeated identical search is a reasonable idempotency-style check, correctly scoped to semantic equivalence rather than byte-identity. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Request-scoped independence between two different searches (A then B) is a correct and necessary sequence case. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Verifying that a prior filtered search does not leak into a later unfiltered listing is an important state-isolation case. |
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
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | 'Approved unusual input' is a forward reference to an unspecified case with no ID cited. To be independently reproducible and auditable, this must name the exact prior input it reuses (e.g., 'reuse the payload from AI-FR05-013' or 'AI-FR05-030'). As written, two different testers would not necessarily choose the same 'unusual input'. |
| Corrected Input | Request 1: reuse the exact unmatched-quote payload from `AI-FR05-030` (`search='`). Request 2: immediately reuse the normal controlled search input from `AI-FR05-002`. |
| Corrected Steps | Run `AI-FR05-030` input first; immediately run the same controlled normal search used by `AI-FR05-002`; compare Request 2 against the normal-search semantics expected for `AI-FR05-002`. |
| Corrected Expected | The unusual first request must not create persistent search/error state that changes the semantics of the immediately following normal search. |
| Correction Notes | Pins both sequence inputs to exact prior testcase IDs instead of leaving 'approved unusual input' undefined. |
| Re-review Status | VALID — HUMAN RE-REVIEW APPROVED |
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
| Human Audit Status | VALID |
| Human Audit Reason | Unmatched single quote is the canonical, well-justified representative for classic SQL injection resistance (SEC-05). |
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
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | 'Boolean/operator injection-oriented payload' is a placeholder with no concrete example (e.g. "' OR '1'='1"). Without a literal value the case cannot be executed identically twice and cannot be distinguished from AI-FR05-030/032/033 during review. |
| Corrected Input | Header: `X-Student-Id: 23127194`; exact search value: `' OR '1'='1` |
| Corrected Steps | URL-encode and send exactly `' OR '1'='1`; compare behavior with controlled normal/no-match searches and inspect for evidence that boolean SQL logic changed the query. |
| Corrected Expected | SEC-05: the payload must remain data and must not broaden/alter database query logic through SQL injection. |
| Correction Notes | Replaces the boolean/operator payload family placeholder with one fixed literal. |
| Re-review Status | VALID — HUMAN RE-REVIEW APPROVED |
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
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | Same issue as AI-FR05-031: 'SQL comment-oriented payload' needs a concrete literal (e.g. "admin'--") to be reproducible and to justify it as a distinct family from the quote and boolean cases. |
| Corrected Input | Header: `X-Student-Id: 23127194`; exact search value: `x'--` |
| Corrected Steps | URL-encode and send exactly `x'--`; record actual response and inspect whether SQL comment syntax changes query structure or exposes an internal database error. |
| Corrected Expected | SEC-05: SQL comment syntax supplied by the user must remain data and must not alter query structure. |
| Correction Notes | Uses a fixed quote-plus-comment literal distinct from the unmatched quote and boolean-expression cases. |
| Re-review Status | VALID — HUMAN RE-REVIEW APPROVED |
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
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | Same issue as AI-FR05-031/032: 'UNION-like injection-oriented payload' needs a concrete literal value before this can be implemented or audited as materially different from the other SEC-05 cases. |
| Corrected Input | Header: `X-Student-Id: 23127194`; exact search value: `x' UNION SELECT NULL --` |
| Corrected Steps | URL-encode and send exactly `x' UNION SELECT NULL --`; record actual response and inspect for evidence of UNION/query-structure manipulation. Do not require the payload to succeed. |
| Corrected Expected | SEC-05: user input must not extend or restructure the database query. A database rejection/error does not itself prove safety; actual handling is recorded. |
| Correction Notes | Provides a concrete UNION-family probe without assuming a column count or successful exploitation. |
| Re-review Status | VALID — HUMAN RE-REVIEW APPROVED |
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
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | 'Percent/quote/comment combination, encoded' is described only as a category, not a value. Also, since it deliberately combines the payload classes from AI-FR05-022/030/032, the case should say so explicitly to justify why it is not simply redundant with those three. |
| Corrected Input | Header: `X-Student-Id: 23127194`; raw search value `%' OR '1'='1'--`, transmitted URL-encoded as `%25%27%20OR%20%271%27%3D%271%27--` |
| Corrected Steps | Send the exact encoded value; verify the server receives one search value; record whether decoding plus mixed wildcard/quote/comment syntax changes SQL behavior. |
| Corrected Expected | SEC-05: URL encoding must not make the mixed payload capable of altering query structure; the decoded value must still be treated as data. |
| Correction Notes | Fixes both the raw and encoded forms and explains why this case is distinct: it combines percent wildcard + quote + boolean expression + comment after transport decoding. |
| Re-review Status | VALID — HUMAN RE-REVIEW APPROVED |
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
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | The risk dimension is valid, but `<error-triggering input>` is still an unspecified placeholder. Without one fixed literal trigger or an explicit reference to a concrete prior testcase, the case is not reproducible. Pin the exact input before Postman implementation; keep the disclosure assertion separate from the SQL-injection root cause. |
| Corrected Input | Header: `X-Student-Id: 23127194`; exact error-probe search value: `'` (reuse `AI-FR05-030`) |
| Corrected Steps | Send the exact unmatched quote. If the runtime returns an error, capture actual status, Content-Type, and body and inspect for SQL/database/stack/internal implementation details. If no error occurs, record that the disclosure path was not reached by this probe. |
| Corrected Expected | RISK-BASED: no formal error schema/status is assumed. If an error response is produced, it should be evaluated for unnecessary internal-information disclosure. |
| Correction Notes | Makes the conditional disclosure test reproducible by pinning its trigger to the exact `AI-FR05-030` payload. |
| Re-review Status | VALID — HUMAN RE-REVIEW APPROVED |
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
| Human Audit Status | VALID |
| Human Audit Reason | Invalid/expired token on a documented public endpoint is a correct characterization case that avoids inventing a rejection requirement. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Top-level response shape characterization is appropriately scoped and non-committal about implementation. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Item-level keys/types characterization, with an explicit rule not to fail on undocumented extra fields, is good practice for contract-first testing. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Combining the no-match business assertion with no-match payload-shape characterization is a reasonable, non-redundant pairing. |
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
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | Error-path schema characterization is a useful, distinct lens from AI-FR05-035, but `input selected to reach error path` is not a concrete reproducible input. Pin this case to the same fixed error-triggering literal (or an exact prior testcase ID) before implementation, then record actual status/content-type/body as characterization only. |
| Corrected Input | Header: `X-Student-Id: 23127194`; exact error-probe search value: `'` (reuse `AI-FR05-030`) |
| Corrected Steps | Send the exact unmatched quote. If an error response is reached, record actual status, Content-Type, top-level/body shape, and representative fields/text. If no error is reached, record the error-schema characterization as not reached for this probe. |
| Corrected Expected | SCHEMA CHARACTERIZATION: formal error schema remains unresolved; only the actual error response shape is recorded when the fixed probe reaches an error path. |
| Correction Notes | Uses the same fixed trigger as `AI-FR05-035` but keeps a distinct purpose: 035 evaluates disclosure risk, while 040 characterizes error response shape. |
| Re-review Status | VALID — HUMAN RE-REVIEW APPROVED |
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
| Human Audit Status | VALID |
| Human Audit Reason | Whole-result-set consistency check (not just a single expected item) is a meaningful cross-check that individual positive-match cases do not cover. |
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
| Human Audit Status | VALID |
| Human Audit Reason | Omitted-vs-empty-search equivalence check is a useful, correctly-scoped cross-check between two previously approved partitions. |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## Human-added testcases — Reviewer-authored additions

```text
Required human-added cases for FR-05: >= 5
Current retained human-added cases: 5
Source: HUMAN
Status: APPROVED FOR IMPLEMENTATION
```

The following five cases were authored by the reviewer. Their provenance remains `HUMAN`. The wording below was translated to English and tightened only to remove unsupported assumptions; no additional human-origin case was invented by AI.

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
| Evidence | `PoolA-FR-05-ProductSearch/evidence/FR05-execution-summary.md`; `postman/newman/FR05-official-report.json` |
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
| Evidence | `PoolA-FR-05-ProductSearch/evidence/FR05-execution-summary.md`; `postman/newman/FR05-official-report.json` |
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
| Evidence | `PoolA-FR-05-ProductSearch/evidence/FR05-execution-summary.md`; `postman/newman/FR05-official-report.json` |
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
