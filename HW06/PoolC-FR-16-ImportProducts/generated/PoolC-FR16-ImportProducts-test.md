# API 3 — FR-16 Import Products — AI-Generated Test Cases

## Step F status

```text
API: POST /api/admin/import-products
Source: AI
AI-generated testcase count: 52
Required minimum: >=35
Schema/response checkpoint: APPROVED
Human Audit Status: STEP G RE-REVIEW COMPLETE — 51 VALID / 1 INCOMPLETE / 0 INVALID
Execution Status: NOT EXECUTED
Required per-request header for official requests: X-Student-Id: 23127194
```

## Provenance and review rules

- Every testcase in this artifact has `Source = AI`.
- `Human Audit Status` and `Human Audit Reason` below reflect the tester's Step G review plus the later human re-review of corrected cases. Six previously INCOMPLETE cases were approved as VALID; `AI-FR16-046` remains INCOMPLETE/BLOCKED.
- `Execution Status`, `Actual Result`, `Evidence`, and `Defect ID` remain blank until real implementation/execution/review stages.
- `UNRESOLVED` is deliberate for undocumented exact HTTP statuses, response field names, error schemas, and parser details.
- FR-16 business truth and the documented API transport remain separate: CSV business-contract cases must use the real CSV workflow if runtime-accessible; direct JSON cases exercise the documented `products[]` API surface.
- Atomicity oracle: if any FR-16-invalid row exists, **zero rows from that batch may persist**.
- For security cases, persistence/state evidence is stronger than response status alone.
- Current implementation fields such as `message`, `inserted`, `errors`, and `error` are characterization targets only, not invented contract schema.
- CSV formula injection, duplicate JSON key behavior, large values, duplicate/idempotency behavior, and some parser details remain risk-based/characterization unless an approved source states otherwise.
- Step G human re-review is complete for the six corrected cases. `AI-FR16-046` remains BLOCKED and must not be executed unless Step J establishes a safe deterministic DB-error trigger.

## Step G human audit note

- The tester reviewed all 52 AI-generated cases for testability, concrete/checkable oracles, executable preconditions/inputs, and consistency with FR-16 atomicity/security expectations.
- Result after human re-review: **51 VALID / 1 INCOMPLETE / 0 INVALID**.
- Human re-review approved corrected cases `AI-FR16-016`, `017`, `022`, `023`, `030`, and `040` as VALID. The only remaining `INCOMPLETE` case is `AI-FR16-046` (BLOCKED).
- `AI-FR16-046` remains incomplete because no concrete, safe, reproducible DB-error trigger has been established yet; its corrected disposition is BLOCKED pending Step J.
- No testcase is relabeled as human-authored; provenance remains `Source = AI`.

## Coverage summary

| Coverage | Count |
| --- | ---: |
| Functional | 6 |
| Domain | 15 |
| Boundary | 6 |
| State/Sequence | 8 |
| Security | 12 |
| Schema | 5 |
| **Total** | **52** |
| Required | >=35 |

## Coverage source traceability

- Requirements: `../analysis/requirements.md`
- Domain partitions: `../analysis/domain-partitions.md`
- State/sequence model: `../analysis/state-transitions.md`
- Security model: `../analysis/security.md`
- Schema/response model: `../analysis/schema.md`

---

## AI-FR16-001 — Canonical JSON import — one valid product

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16; JSON-TOP-01; JSON-ROW-01; JSON-BATCH-01; SCH-FR16-01 |
| Category | Functional |
| Preconditions | Valid admin JWT; controlled existing category if needed; unique product marker absent before test |
| Input | POST JSON `{products:[validRow]}` with non-empty name and positive price |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Confirm marker absent; send request; query products afterward |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Import is semantically successful; exactly the intended row persists; report semantics communicate success count 1, error count 0, and no false failure reason. |
| Expected Schema | S1 semantic report; exact fields/status UNRESOLVED |
| Security Expectation | SEC-02/SEC-03 satisfied by valid admin actor |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Clear precondition and a deterministic persistence oracle (marker absent then present); requirement basis matches the canonical FR-16 import path. Executable as written. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-002 — Canonical JSON import — multiple valid products

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16; JSON-BATCH-02; T02; SCH-FR16-02 |
| Category | Functional |
| Preconditions | Valid admin JWT; 3 unique valid product markers absent |
| Input | POST JSON with 3 valid rows |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify all markers absent; send request; query products afterward |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | All 3 intended rows persist together; semantic success count matches 3 and error count is 0; report does not contradict persistence. |
| Expected Schema | S1 semantic report; exact fields/status UNRESOLVED |
| Security Expectation | Authorized admin operation |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Same reasoning as AI-FR16-001 extended to a 3-row batch; oracle (all 3 persist, counts match) is unambiguous. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-003 — Business CSV workflow — exact header and valid rows

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16 CSV contract; CSV-HDR-01; CSV-PARSE-01; CROSS-07; TRANS-04 |
| Category | Functional |
| Preconditions | Real CSV import workflow is runtime-accessible; valid admin actor; unique markers absent |
| Input | `.csv` file with exact header and 2 valid rows |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Submit through the real CSV workflow; observe any frontend-to-backend bridge; verify persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Business-compliant CSV import succeeds semantically and all rows persist; clear business report communicates successful/error counts. |
| Expected Schema | CSV business report semantics; transport-specific exact response UNRESOLVED |
| Security Expectation | Admin authorization must still be enforced end-to-end |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Correctly routes through the real CSV workflow per the provenance rule separating business contract from JSON transport; the "if runtime-accessible" condition is explicit and does not block other cases. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-004 — CSV quoted comma is parsed as data, not delimiter

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16; CSV-PARSE-02/03; CSV-DESC-03 |
| Category | Functional |
| Preconditions | Real CSV workflow accessible; valid admin actor |
| Input | CSV row containing quoted comma in name or description |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Import file; query persisted product |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Quoted comma remains inside the intended field; row shape is not split; intended product persists if all rows are otherwise valid. |
| Expected Schema | Business report semantic only |
| Security Expectation | No parser confusion may cause unintended field mapping |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Standard RFC4180 quoted-comma case with a checkable oracle (comma stays inside the field, row is not split). |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-005 — Official request carries required student header

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SID-01; HW06 evidence rule |
| Category | Functional |
| Preconditions | Any canonical JSON testcase prepared for official execution |
| Input | Same canonical request plus `X-Student-Id: 23127194` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | At implementation/execution, assert the outgoing request evidence records the exact required header; separately verify business outcome |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Assignment evidence requirement is satisfied; no negative SUT expectation is inferred from this header itself. |
| Expected Schema | No SUT response schema assertion derived from student header |
| Security Expectation | N/A — project evidence constraint |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Correctly scoped as an evidence/process check rather than a SUT behavior assertion, and explicitly marked N/A for SUT expectations so it can't be mis-scored as a functional defect. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-006 — Missing top-level request body

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | JSON-TOP-02; SCH-FR16-09 |
| Category | Domain |
| Preconditions | Valid admin JWT; markers absent |
| Input | POST with no request body |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; query products afterward |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | No unintended product persists; actual rejection/status/body are runtime characterization. |
| Expected Schema | S2 characterization |
| Security Expectation | Authorization valid; request-shape failure must not mutate data |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Missing-body negative case has a sound oracle (zero unintended persistence) even though exact status/body are left as characterization by design. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-007 — Top-level JSON null

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | JSON-TOP-03 |
| Category | Domain |
| Preconditions | Valid admin JWT; markers absent |
| Input | JSON `null` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify persistence unchanged |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | No unintended persistence; exact parser/application response remains unresolved. |
| Expected Schema | S2 characterization |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Same reasoning as AI-FR16-006 for a JSON `null` top-level payload. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-008 — Top-level array instead of object

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | JSON-TOP-04 |
| Category | Domain |
| Preconditions | Valid admin JWT; markers absent |
| Input | `[validRow]` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify no intended marker persisted |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Documented `{products:[...]}` shape is not used; behavior recorded as characterization; no unintended persistence. |
| Expected Schema | S2 characterization |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Array-instead-of-object case is well scoped; the persistence oracle is unambiguous. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-009 — Missing `products` field

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | JSON-TOP-05; SCH-FR16-09 |
| Category | Domain |
| Preconditions | Valid admin JWT; markers absent |
| Input | `{}` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | No import data is accepted as a compliant import; zero unintended persistence; exact status/schema unresolved. |
| Expected Schema | S2 characterization |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Missing `products` key case; zero-persistence oracle is clear and testable. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-010 — Empty `products` array

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | JSON-TOP-06 |
| Category | Domain |
| Preconditions | Valid admin JWT; baseline recorded |
| Input | `{"products":[]}` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; record actual response and dataset state |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Empty-batch acceptance is unresolved; record behavior; zero unintended new product rows. |
| Expected Schema | S2 characterization |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Empty-array case still carries a meaningful oracle (no row is ever created), which is enough to catch a broken empty-batch handler even though accept-vs-reject is intentionally left open. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-011 — `products` null

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | JSON-TOP-07 |
| Category | Domain |
| Preconditions | Valid admin JWT; markers absent |
| Input | `{"products":null}` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify dataset unchanged |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Wrong type must not create product rows; exact response unresolved. |
| Expected Schema | S2 characterization |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | `products:null` type-mismatch case; oracle is clear. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-012 — `products` object instead of array

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | JSON-TOP-08 |
| Category | Domain |
| Preconditions | Valid admin JWT; markers absent |
| Input | `{"products":{}}` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify no mutation |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Wrong type relative to documented contract; zero unintended persistence. |
| Expected Schema | S2 characterization |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | `products` as object type-mismatch case; oracle is clear. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-013 — Empty product name in JSON row

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16; JSON-NAME-02; JSON-BATCH-03/04/05 |
| Category | Domain |
| Preconditions | Valid admin JWT; mixed batch includes unique valid rows plus one row with `name:""` |
| Input | JSON batch containing empty-name row |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify all markers absent; send request; query afterward |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Empty name is invalid and entire batch must rollback; zero batch rows persist; report contains clear failure information. |
| Expected Schema | S1 semantic failure report |
| Security Expectation | Atomicity must prevent partial write |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Empty-name atomicity case; FR-16's non-empty-name rule and the rollback oracle are both clear. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-014 — Missing product name in JSON row

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16; JSON-NAME-03 |
| Category | Domain |
| Preconditions | Valid admin JWT; batch marker setup |
| Input | Row omits `name` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send mixed batch; verify persistence afterward |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Row is invalid under non-empty-name rule; whole batch rolls back; zero batch rows persist. |
| Expected Schema | S1 semantic failure report |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Missing-name case; same reasoning as AI-FR16-013. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-015 — Null product name

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16; JSON-NAME-04 |
| Category | Domain |
| Preconditions | Valid admin JWT; controlled batch |
| Input | Row uses `name:null` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify no marker persists |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Null is not a non-empty name; batch rollback required. |
| Expected Schema | S1 semantic failure report |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Null-name case; same reasoning as AI-FR16-013/014. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-016 — Non-existing category ID — cross-requirement characterization

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | JSON-CAT-04; FR-15 inheritance UNRESOLVED |
| Category | Domain |
| Preconditions | Valid admin JWT; safely chosen category ID known absent |
| Input | Valid name/price with non-existing positive category_id |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; record response and persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Behavior is characterization because FR-16 category-existence inheritance is unresolved; do not label acceptance/rejection a FR-16 defect solely from this case. |
| Expected Schema | S2 characterization |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID — HUMAN RE-REVIEW APPROVED |
| Human Audit Reason | Original INCOMPLETE finding resolved by the approved Corrected Test. Human re-review approved the correction; case is now testable with the stated branching persistence/integrity oracle while unresolved policy remains characterization-only. |
| Corrected Test | Use a concrete absent category ID (for example `2147483647`) with a unique product marker, non-empty name, and positive price. Send the canonical JSON request as admin. Branching oracle: if the SUT rejects the row, assert zero marker persistence and no unrelated product/category mutation; if the SUT accepts it, assert exactly one marker row persists and unrelated products/categories remain unchanged. Record acceptance/rejection and response shape as characterization; do not claim FR-15 category-existence compliance from this case. |
| AI Re-review | HUMAN APPROVED — correction accepted by tester on 2026-08-21. |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-017 — Whitespace-only name — trimming semantics characterization

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | JSON-NAME-05; CSV-NAME-04 |
| Category | Domain |
| Preconditions | Valid admin JWT or real CSV workflow |
| Input | Name contains spaces only |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send via selected surface; record response/persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Trimming semantics are unresolved; capture actual behavior without inventing mandatory acceptance/rejection. |
| Expected Schema | S2 characterization |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID — HUMAN RE-REVIEW APPROVED |
| Human Audit Reason | Original INCOMPLETE finding resolved by the approved Corrected Test. Human re-review approved the correction; case is now testable with the stated branching persistence/integrity oracle while unresolved policy remains characterization-only. |
| Corrected Test | Send one canonical JSON row with a unique marker and `name:"   "` (three spaces), positive price, and otherwise valid fields. Branching oracle: if rejected, zero marker rows persist; if accepted, exactly one marker row may persist and unrelated data remains unchanged. Record whether the stored name is preserved/trimmed as characterization. Pass/fail is based on persistence consistency and no unrelated mutation, not on an invented trimming rule. |
| AI Re-review | HUMAN APPROVED — correction accepted by tester on 2026-08-21. |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-018 — Price = 1 — positive boundary valid

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16; JSON-PRICE-02; CSV-PRICE-02 |
| Category | Boundary |
| Preconditions | Valid admin JWT; unique marker absent |
| Input | Row with `price:1` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send canonical JSON request; verify marker persists |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Price is positive; row is valid with respect to FR-16 price rule; if all other fields valid, intended row persists. |
| Expected Schema | S1 semantic success report |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | price=1 positive-boundary case; the persistence oracle is unambiguous. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-019 — Price = 0 — boundary invalid and rollback

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16; JSON-PRICE-03; CSV-PRICE-03; CROSS-04 |
| Category | Boundary |
| Preconditions | Valid admin JWT; batch includes valid marker rows plus price=0 row |
| Input | Mixed JSON batch containing `price:0` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify all markers absent; send request; query afterward |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Zero is not positive; entire batch rolls back; zero batch rows persist; clear reason/report required. |
| Expected Schema | S1 semantic failure report |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | price=0 boundary-invalid case with a clear atomicity oracle. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-020 — Price = -1 — invalid negative boundary

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16; JSON-PRICE-04; CSV-PRICE-04 |
| Category | Boundary |
| Preconditions | Valid admin JWT; controlled mixed batch |
| Input | Row with `price:-1` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify no batch markers persist |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Negative price is invalid; batch rollback required. |
| Expected Schema | S1 semantic failure report |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | price=-1 negative-boundary case; same reasoning as AI-FR16-019. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-021 — Positive decimal price

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16; JSON-PRICE-05; CSV-PRICE-05 |
| Category | Boundary |
| Preconditions | Valid admin JWT; unique marker absent |
| Input | Row with `price:1.5` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify persisted row if all other fields valid |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | FR-16 says positive number, not integer; decimal is valid with respect to sign boundary unless another reviewed constraint applies. |
| Expected Schema | S1 semantic success report |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Decimal-price case; a reasonable, appropriately hedged inference from FR-16's "positive number" wording, with a clear persistence oracle. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-022 — Very large positive price — no invented maximum

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | JSON-PRICE-12; CSV-PRICE-11 |
| Category | Boundary |
| Preconditions | Valid admin JWT; safe large numeric representative chosen |
| Input | Row with a very large positive numeric value |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request only if safe for runtime; record response/persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | No maximum is documented; this is robustness characterization, not a mandatory rejection boundary. |
| Expected Schema | S2 characterization |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID — HUMAN RE-REVIEW APPROVED |
| Human Audit Reason | Original INCOMPLETE finding resolved by the approved Corrected Test. Human re-review approved the correction; case is now testable with the stated branching persistence/integrity oracle while unresolved policy remains characterization-only. |
| Corrected Test | Use the concrete positive value `1000000000000` (1e12) with a unique marker and otherwise valid row. Send as admin. The request must not crash the service or corrupt unrelated data. If accepted, exactly one marker row persists and the business report must be consistent with that persistence; if rejected, zero marker rows persist and the failure must not partially write the batch. Exact acceptance/rejection remains characterization because no maximum price is documented. |
| AI Re-review | HUMAN APPROVED — correction accepted by tester on 2026-08-21. |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-023 — Long name >255 — FR-15 inheritance unresolved

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | JSON-NAME-10; CSV-NAME-09 |
| Category | Boundary |
| Preconditions | Valid admin JWT; generated name >255 chars |
| Input | Row with non-empty long name and positive price |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send safely; record response/persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Do not assert FR-16 rejection unless human later adopts FR-15 inheritance; characterize actual behavior. |
| Expected Schema | S2 characterization |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID — HUMAN RE-REVIEW APPROVED |
| Human Audit Reason | Original INCOMPLETE finding resolved by the approved Corrected Test. Human re-review approved the correction; case is now testable with the stated branching persistence/integrity oracle while unresolved policy remains characterization-only. |
| Corrected Test | Use an exact 256-character ASCII name (for example `N` repeated 256 times), positive price, and a unique companion marker field/value. Send as admin. Because FR-15 inheritance is unresolved, do not require acceptance or rejection. Branching oracle: if accepted, exactly one intended row persists and unrelated data remains unchanged; if rejected, zero marker rows persist. Record the observed length handling as characterization and do not report a FR-16 defect solely from accept/reject. |
| AI Re-review | HUMAN APPROVED — correction accepted by tester on 2026-08-21. |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-024 — Invalid first row causes full rollback

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16 atomicity; JSON-BATCH-03; CSV-BATCH-03; T03; SCH-FR16-03 |
| Category | State/Sequence |
| Preconditions | Valid admin JWT; invalid first row plus later unique valid rows; all markers absent |
| Input | `[invalidName, validA, validB]` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; query all markers after |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Zero rows from the batch persist regardless of invalid row position; failure report contains usable reason(s). |
| Expected Schema | S1 semantic failure report |
| Security Expectation | Partial persistence is forbidden |
| State Before | Baseline: unique testcase markers absent |
| State After | P3 — baseline unchanged; zero batch markers present |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Invalid-first-row atomicity case; the rollback oracle is clear and directly testable. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-025 — Invalid middle row causes full rollback

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16 atomicity; JSON-BATCH-04; CSV-BATCH-04; T04; SCH-FR16-04 |
| Category | State/Sequence |
| Preconditions | Valid admin JWT; unique rows with invalid price in middle |
| Input | `[validA, price0, validB]` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; query markers |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Zero rows persist; valid rows before/after the invalid row must not remain. |
| Expected Schema | S1 semantic failure report |
| Security Expectation | Partial persistence forbidden |
| State Before | Baseline: unique testcase markers absent |
| State After | P3 — baseline unchanged |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Invalid-middle-row atomicity case; same reasoning as AI-FR16-024. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-026 — Invalid final row causes full rollback

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16 atomicity; JSON-BATCH-05; CSV-BATCH-05; T05; SCH-FR16-05 |
| Category | State/Sequence |
| Preconditions | Valid admin JWT; valid rows followed by invalid negative-price row |
| Input | `[validA, validB, invalidLast]` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; query all markers |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Zero rows persist despite earlier valid rows being processed first. |
| Expected Schema | S1 semantic failure report |
| Security Expectation | Detects loop-based partial-write risk |
| State Before | Baseline: unique testcase markers absent |
| State After | P3 — baseline unchanged |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Invalid-last-row atomicity case; same reasoning as AI-FR16-024/025. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-027 — Multiple invalid rows still yield zero persistence

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | JSON-BATCH-06; CSV-BATCH-06; T06; SCH-FR16-06 |
| Category | State/Sequence |
| Preconditions | Valid admin JWT; batch has multiple invalid rows and one valid marker |
| Input | Mixed invalid batch |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify no markers persisted |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | No rows persist; report gives clear failure information. Exact meaning of error count remains unresolved. |
| Expected Schema | S1 semantic failure report |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Multiple-invalid-rows case; the zero-persistence oracle is clear. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-028 — Failed batch followed by independent valid batch

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | T13; failed→valid recovery |
| Category | State/Sequence |
| Preconditions | Valid admin JWT; distinct batch A invalid and batch B fully valid; unique markers |
| Input | First send invalid batch A, then valid batch B |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify A markers absent after first request; then send B; verify B markers afterward |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Failure of batch A does not poison later independent valid import; A contributes zero rows, B persists fully. |
| Expected Schema | Semantic response per each request |
| Security Expectation | No hidden mutation from failed request |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Failed-batch-then-valid-batch sequencing case; oracle (A=0 rows, B=all rows) is clear and independently checkable. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-029 — Valid batch A followed by invalid batch B

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | T12; derived transactional integrity |
| Category | State/Sequence |
| Preconditions | Valid admin JWT; distinct marker sets A and B |
| Input | Import valid A, then invalid B |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify A persisted; send B; query both marker sets |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | A remains committed; B contributes zero rows; invalid later request must not rollback unrelated earlier committed data. |
| Expected Schema | Semantic response per each request |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Valid-then-invalid sequencing case; oracle (A remains committed, B=0 rows) is clear. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-030 — Repeat identical valid batch — duplicate/idempotency characterization

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | T14; JSON-BATCH-07/08 |
| Category | State/Sequence |
| Preconditions | Valid admin JWT; duplicate semantics not specified |
| Input | Send same valid batch twice |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Record first persistence; resend identical request; record second response/dataset |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Second-request behavior is characterization only; do not require rejection, deduplication, or duplicate insertion absent a contract rule. |
| Expected Schema | S2 characterization |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID — HUMAN RE-REVIEW APPROVED |
| Human Audit Reason | Original INCOMPLETE finding resolved by the approved Corrected Test. Human re-review approved the correction; case is now testable with the stated branching persistence/integrity oracle while unresolved policy remains characterization-only. |
| Corrected Test | Import a valid uniquely marked batch once and record the resulting marker-row count. Send the exact same batch a second time. Duplicate policy remains unspecified, so accept/reject/deduplicate/duplicate-insert are all characterization outcomes. Enforceable oracle: the second request must not alter unrelated products, must not corrupt the original rows, and any response/report must be consistent with the final persisted marker-row count. |
| AI Re-review | HUMAN APPROVED — correction accepted by tester on 2026-08-21. |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-031 — Malformed request followed by canonical valid request

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | Step C parser failure recovery |
| Category | State/Sequence |
| Preconditions | Valid admin JWT; malformed request marker set A and valid batch B distinct |
| Input | First malformed JSON, then canonical valid JSON |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify first request causes no marker persistence; send valid request; verify B persists |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Malformed request must not create hidden mutation or poison subsequent valid request processing. |
| Expected Schema | First S2 characterization; second S1 semantic success |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Malformed-then-valid recovery case; oracle (first request = 0 rows, second = full persistence) is clear. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-032 — Missing JWT cannot import

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SEC-02; AUTH-02; SD-01; SCH-FR16-07 |
| Category | Security |
| Preconditions | Unique valid batch markers absent; no Authorization header |
| Input | Canonical valid JSON body without JWT |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; query products afterward |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Request must not be authenticated/authorized; zero batch markers persist; exact status/body unresolved. |
| Expected Schema | S1 security semantic + S2 response characterization |
| Security Expectation | SEC-02 direct |
| State Before | Baseline: unique testcase markers absent |
| State After | P5 — unauthorized unchanged |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Missing-JWT case; the zero-persistence security oracle is unambiguous. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-033 — Malformed JWT cannot import

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SEC-02; AUTH-05; SD-02 |
| Category | Security |
| Preconditions | Unique valid markers absent |
| Input | Authorization `Bearer not-a-jwt` + valid batch |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Malformed token must not authenticate; zero rows persist. |
| Expected Schema | S1 security semantic |
| Security Expectation | SEC-02 direct |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Malformed-JWT case; same reasoning as AI-FR16-032. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-034 — Tampered JWT signature cannot import

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SEC-02; AUTH-06; SD-03 |
| Category | Security |
| Preconditions | Have a real valid token and a safely tampered copy; markers absent |
| Input | Tampered Bearer token + valid batch |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify no persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Tampered token must fail authentication; zero rows persist. |
| Expected Schema | S1 security semantic |
| Security Expectation | SEC-02 direct |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Tampered-signature case; same reasoning as AI-FR16-032/033, assuming the test environment can safely produce an invalid-signature token. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-035 — Valid non-admin JWT cannot import

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SEC-03; AUTH-08; SD-05; SCH-FR16-08 |
| Category | Security |
| Preconditions | Real valid non-admin JWT; valid batch; markers absent |
| Input | Canonical valid JSON with non-admin token |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; query markers |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Valid non-admin actor must not be authorized for `/api/admin/*`; zero rows persist; exact status/schema unresolved. |
| Expected Schema | S1 security semantic + S2 response characterization |
| Security Expectation | SEC-03 direct |
| State Before | Baseline: unique testcase markers absent |
| State After | P5 — unauthorized unchanged |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Valid-non-admin-JWT case; zero-persistence oracle is clear (SEC-03). |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-036 — Forged admin role in tampered token does not elevate privilege

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SEC-02+SEC-03; SD-06 |
| Category | Security |
| Preconditions | Valid non-admin token and modified payload claiming admin without valid signature |
| Input | Tampered JWT role=`admin` + valid batch |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify no persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Token tampering must not turn a non-admin into admin; zero rows persist. |
| Expected Schema | S1 security semantic |
| Security Expectation | SEC-02/SEC-03 combined |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Forged-admin-claim-in-tampered-token case; the zero-persistence oracle directly tests signature verification, which is well-defined and testable. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-037 — Unexpected body role/admin fields do not elevate actor

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SEC-ROLE-04; SD-07; JSON-ROW-07 |
| Category | Security |
| Preconditions | Valid non-admin JWT; markers absent |
| Input | Top-level/row extras such as `role:"admin"`, `isAdmin:true`, `id:999` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify authorization state and product persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Body fields must not override token authorization or mutate unrelated privileged/system state; acceptance/rejection of harmless extras remains characterization. |
| Expected Schema | S2 characterization |
| Security Expectation | Risk-based mass-assignment/unexpected-field coverage |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Mass-assignment/extra-fields case; storage of the extra fields themselves is left as characterization, but the core invariant (body cannot override token authorization, no unrelated mutation) is concretely testable. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-038 — SQL-looking product name remains inert data

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SEC-05; SD-10 |
| Category | Security |
| Preconditions | Valid admin JWT; unrelated baseline data recorded |
| Input | Name value like `HW06_SQL_'_--_23127194`, positive price |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send valid import; verify unrelated data intact and inspect persisted value if accepted |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Payload must not alter SQL structure or mutate unrelated records; rejection is not required merely because text looks SQL-like. |
| Expected Schema | S1 security invariant + S2 response characterization |
| Security Expectation | SEC-05 direct persistence-path probe |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | SQL-looking name case; the invariant (no structural DB mutation, unrelated data unaffected) is a clear, testable persistence-integrity oracle. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-039 — SQL-looking description remains inert data

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SEC-05; SD-11 |
| Category | Security |
| Preconditions | Valid admin JWT; unrelated baseline data recorded |
| Input | Description `x'); SELECT 1; --` with otherwise valid row |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify no second-statement/unrelated mutation |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Input must not change SQL semantics; if accepted it remains data. |
| Expected Schema | S1 security invariant + S2 characterization |
| Security Expectation | SEC-05 direct |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | SQL-looking description case; same reasoning as AI-FR16-038. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-040 — CSV formula-like value — risk characterization

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SD-13; CSV-NAME-10; CSV-DESC-06 |
| Category | Security |
| Preconditions | Real CSV workflow accessible; valid admin actor |
| Input | Formula-like name/description such as `=2+2` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Import through CSV workflow; record storage and later handling scope |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Storage/acceptance is characterization only; do not claim vulnerability or mandatory rejection without downstream spreadsheet execution evidence. |
| Expected Schema | S2 characterization |
| Security Expectation | Risk-based CSV formula injection |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID — HUMAN RE-REVIEW APPROVED |
| Human Audit Reason | Original INCOMPLETE finding resolved by the approved Corrected Test. Human re-review approved the correction; case is now testable with the stated branching persistence/integrity oracle while unresolved policy remains characterization-only. |
| Corrected Test | Through the real CSV workflow, import a valid CSV row whose unique product name is exactly `=2+2` and whose remaining fields are valid. The import layer must treat the cell as literal text rather than execute or transform it. If accepted, verify the persisted product name remains the literal `=2+2` and unrelated data is unchanged; if rejected, verify zero marker persistence. Do not claim spreadsheet-formula exploitation without downstream export/open evidence. |
| AI Re-review | HUMAN APPROVED — correction accepted by tester on 2026-08-21. |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-041 — Malformed CSV/parser confusion cannot partially persist

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SD-14; CSV-PARSE-04/05; CROSS-09 |
| Category | Security |
| Preconditions | Real CSV workflow accessible; valid admin actor; unique markers |
| Input | Unterminated quote or extra unquoted delimiter in one row |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Submit malformed CSV; verify dataset |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Malformed CSV must not yield a partially persisted compliant import; zero unintended batch rows persist. |
| Expected Schema | Business S1 + transport S2 characterization |
| Security Expectation | CSV parser security / persistence integrity |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Malformed-CSV/parser-confusion case; the zero-unintended-persistence oracle is clear. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-042 — Record success runtime response shape without promoting it to contract

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SCH-FR16-11; S2 strategy |
| Category | Schema |
| Preconditions | Valid admin JWT; canonical valid single-row batch |
| Input | Canonical JSON import |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Execute later; capture actual HTTP status, Content-Type, body kind, top-level fields and primitive types |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Persistence must be correct; actual response shape is recorded exactly as evidence, not pre-asserted as mandatory schema. |
| Expected Schema | S2 runtime characterization |
| Security Expectation | No security-specific requirement |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Schema-characterization case for the success path; the persistence requirement is a real assertion and the shape recording is explicitly non-normative, so the case is internally coherent. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-043 — Record validation-failure runtime response shape

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SCH-FR16-12; S2 strategy |
| Category | Schema |
| Preconditions | Valid admin JWT; invalid empty-name batch |
| Input | Canonical JSON shape with FR-16 invalid row |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Execute later; capture actual status/body/content-type; verify rollback |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Zero persistence and clear failure semantics are mandatory; exact response fields/status are characterized. |
| Expected Schema | S1 semantics + S2 runtime shape |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Schema-characterization case for the validation-failure path; the atomicity/rollback assertion is enforceable and the shape recording is non-normative. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-044 — Record authentication-failure runtime response shape

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SCH-FR16-13; S2 strategy |
| Category | Schema |
| Preconditions | No JWT; valid batch markers absent |
| Input | Canonical valid JSON without Authorization |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Execute later; record status/body/content-type; query persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Authentication rejection + zero persistence mandatory; exact response schema characterized only. |
| Expected Schema | S1 security semantic + S2 shape |
| Security Expectation | SEC-02 direct |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Schema-characterization case for the auth-failure path; the zero-persistence + rejection assertion is enforceable. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-045 — Record non-admin authorization response shape

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SCH-FR16-14; S2 strategy |
| Category | Schema |
| Preconditions | Valid non-admin JWT; valid batch markers absent |
| Input | Canonical valid JSON |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Execute later; record actual authorization response and persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Non-admin import forbidden and zero persistence mandatory; status/body exact shape characterized only. |
| Expected Schema | S1 security semantic + S2 shape |
| Security Expectation | SEC-03 direct |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Schema-characterization case for the non-admin path; the zero-persistence + rejection assertion is enforceable. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-046 — DB-error response and disclosure characterization — conditional

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | SCH-FR16-16; SD-18 |
| Category | Schema |
| Preconditions | Only if Step J can safely and deterministically create a DB-level failing row without corrupting environment |
| Input | Controlled DB-error-triggering import input if reproducible |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | If reproducible, execute and capture exact response; otherwise mark testcase BLOCKED at execution stage |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Do not fabricate a DB failure. If one occurs, preserve response and assess whether internal details are disclosed; atomicity still requires no partial batch persistence where FR-16 applies. |
| Expected Schema | S2/security characterization |
| Security Expectation | Information-disclosure characterization |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | Precondition is highly conditional ("only if Step J can safely and deterministically" reproduce a DB error) with no concrete trigger defined; as written this may simply never execute. Needs either a concrete reproducible input or an explicit BLOCKED/SKIP disposition rather than being carried as an ordinary pending case. |
| Corrected Test | Reclassify this testcase as `BLOCKED — no safe deterministic DB-error trigger identified yet`. Do not execute it in the official suite unless Step J establishes a concrete, reproducible, non-destructive input that causes a DB-level insert error. If such a trigger is later established, the testcase must specify the exact input, baseline, zero-partial-persistence oracle, and response-disclosure checks before human re-review. |
| AI Re-review | NOT READY FOR VALID — the correction gives a safe disposition, but this remains non-executable until Step J finds a reproducible DB-error trigger. |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-047 — CSV wrong extension is not compliant import

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16; CSV-FILE-04/05 |
| Category | Domain |
| Preconditions | Real CSV workflow accessible; admin actor |
| Input | Use `.txt` or no-extension file containing otherwise valid CSV content |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Attempt import through real workflow; verify persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Must not be treated as a compliant FR-16 CSV upload; zero unintended imported rows. Exact UI/API error shape unresolved. |
| Expected Schema | Business semantic; response shape UNRESOLVED |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Wrong-extension case; the zero-unintended-persistence oracle is clear. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-048 — CSV reordered header violates exact-header contract

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16; CSV-HDR-05; CROSS-08 |
| Category | Domain |
| Preconditions | Real CSV workflow accessible; admin actor; markers absent |
| Input | Header `price,name,description,imageUrl,category_id` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Submit file; verify persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Exact-header requirement is violated; compliant import must not succeed; zero batch rows persist. |
| Expected Schema | Business semantic failure report |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Reordered-header case; the exact-header-contract violation oracle is clear. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-049 — CSV extra header column violates exact-header contract

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | FR-16; CSV-HDR-04; SD-15 |
| Category | Domain |
| Preconditions | Real CSV workflow accessible; admin actor |
| Input | Header includes extra `role` or `stock` column |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Submit file; verify no markers persist |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Exact-header contract violated; no compliant import/partial persistence. Extra privileged-looking column must not affect authorization/system state. |
| Expected Schema | Business semantic + security characterization |
| Security Expectation | Header/column smuggling risk |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Extra-header-column case; both the contract-violation oracle and the "no privilege smuggling" invariant are testable. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-050 — CSV doubled quote escaping

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | CSV-PARSE-06; RFC4180 coverage |
| Category | Functional |
| Preconditions | Real CSV workflow accessible; valid admin actor |
| Input | Description contains RFC4180 doubled quote, e.g. `"Size ""XL"""` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Import; inspect persisted field |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Parser preserves intended literal quote and does not split columns; row persists if otherwise valid. |
| Expected Schema | Business semantic report |
| Security Expectation | N/A or as stated by testcase |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | RFC4180 doubled-quote case; the parser-correctness oracle is clear. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-051 — Mixed JSON row types cannot partially persist

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | JSON-BATCH-09; SEC-JSON-04; SD-17 |
| Category | Security |
| Preconditions | Valid admin JWT; one valid marker plus `null`/string/object invalid row values |
| Input | `{"products":[validRow,null,"x",{}]}` |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify marker absence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Type-confused batch must not produce arbitrary or partial persistence; under FR-16 import semantics, invalid batch contributes zero rows. |
| Expected Schema | S1 atomicity + S2 parser characterization |
| Security Expectation | Type-confusion/robustness |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Mixed-type JSON rows case; the zero/partial-persistence oracle is clear and directly exercises type-confusion handling. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR16-052 — Duplicate JSON keys — parser precedence characterization

| Field | Value |
| --- | --- |
| Source | AI |
| API | POST /api/admin/import-products |
| Requirement Basis | JSON-TOP-11; SEC-JSON-01/02; SD-16 |
| Category | Security |
| Preconditions | Valid admin JWT; raw JSON client capable of duplicate keys |
| Input | Raw JSON containing duplicate `products` or duplicate `price/name` keys |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send raw request; record parsed behavior and persistence |
| Expected Status | UNRESOLVED unless a later reviewed source establishes an exact code |
| Expected Response | Key precedence is not specified; characterize actual behavior. Must not cause unauthorized mutation or bypass atomicity/security invariants. |
| Expected Schema | S2 parser characterization |
| Security Expectation | Parser ambiguity risk |
| State Before | Baseline: unique testcase markers absent |
| State After | As stated by expected response / persistence oracle |
| AI Rationale | Generated from the approved FR-16 Requirement + Domain + State + Security + Schema analyses; preserves contract uncertainty and the persistence-first oracle. |
| Human Audit Status | VALID |
| Human Audit Reason | Duplicate-JSON-keys case; exact key precedence is left as characterization, but the enforceable invariant (no unauthorized mutation, atomicity preserved) is concretely testable. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |
