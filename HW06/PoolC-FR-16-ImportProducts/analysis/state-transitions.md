# FR-16 Import Products — State Transition / Persistence Analysis

Date: 2026-08-21  
API: `POST /api/admin/import-products`  
Primary requirement: FR-16 — Import Products from CSV  
Gate A: **APPROVED**  
Gate B: **APPROVED**  
Human Gate C status: **PENDING HUMAN REVIEW**

## 1. Scope and modeling choice

FR-16 does **not** define a named business state machine like FR-10. The selected API is a batch-import operation, so Step C models **persistence states and request sequences** rather than inventing artificial lifecycle states.

The core contract-backed state rule is atomicity:

```text
All rows valid   -> imported rows may persist together
Any row invalid  -> zero rows from that batch may persist
```

This invariant applies to the FR-16 business operation regardless of whether the real workflow begins with CSV or reaches the backend through the documented JSON `products[]` bridge.

---

## 2. State vocabulary

The analysis uses the following observable persistence states.

| State ID | State | Meaning | Contract status |
| --- | --- | --- | --- |
| P0 | Baseline | Controlled pre-import product dataset exists; no row from current batch is present | Test precondition |
| P1 | Validated / no persistence yet | Batch has been accepted for validation/parsing, but persistence is not yet proven | Conceptual intermediate state only |
| P2 | Fully persisted | Every intended row from a valid batch is present after import | CONTRACT-BACKED successful outcome |
| P3 | Rolled back / unchanged baseline | No row from the invalid batch is persisted; baseline remains unchanged | CONTRACT-BACKED invalid-batch outcome |
| P4 | Partial persistence | Some valid rows persist while one or more rows fail | **FORBIDDEN by FR-16 atomicity** |
| P5 | Unauthorized unchanged | Request is unauthenticated/non-admin and no batch row is persisted | FR-12 / SEC-02 / SEC-03 outcome |
| P6 | Characterized duplicate/repeat result | Dataset after repeating a valid import when duplicate semantics are unspecified | UNRESOLVED / CHARACTERIZATION |

`P1` is useful for reasoning only. The contract does not expose an API-visible “validated” state, so tests should not require that state to be observable.

---

## 3. Initial-state requirements

Before each persistence-sensitive testcase, establish a controlled baseline.

Recommended baseline properties:

- record the product count or a controlled set of unique test product names before the request;
- ensure none of the current batch’s unique identifiers/names already exist unless duplicate behavior is the subject of the test;
- use dedicated test rows so persistence can be checked unambiguously;
- avoid relying only on response counters; verify persisted data after the request where possible;
- reset/delete disposable imported products between mutating cases or recreate the baseline.

No concrete product IDs, row counts, or cleanup IDs should be fabricated before runtime preparation in Step J.

---

## 4. Core transition matrix

| From | Action / condition | To | Valid? | Requirement basis |
| --- | --- | --- | --- | --- |
| P0 | Admin imports one fully valid row | P2 | Yes | FR-16 valid import intent |
| P0 | Admin imports multiple fully valid rows | P2 | Yes | FR-16 multiple-product import |
| P0 | Batch contains invalid empty `name` | P3 | Yes — rejection/rollback path | FR-16 name validation + atomicity |
| P0 | Batch contains `price = 0` | P3 | Yes — rejection/rollback path | FR-16 `price > 0` + atomicity |
| P0 | Batch contains negative price | P3 | Yes — rejection/rollback path | FR-16 `price > 0` + atomicity |
| P0 | First row invalid, later rows valid | P3 | Yes — rollback path | FR-16 all-or-nothing |
| P0 | Middle row invalid between valid rows | P3 | Yes — rollback path | FR-16 all-or-nothing |
| P0 | Last row invalid after valid rows | P3 | Yes — rollback path | FR-16 all-or-nothing |
| P0 | Missing/invalid JWT with otherwise valid batch | P5 | Yes — auth rejection path | FR-12 + SEC-02 |
| P0 | Valid non-admin JWT with otherwise valid batch | P5 | Yes — authorization rejection path | FR-12 + SEC-03 |
| P0 | Malformed CSV/header where FR-16 contract is exercised | P3 | Yes — no compliant import | FR-16 file/header/parser rules |
| P0 | Invalid batch causes some rows to persist | P4 | **No** | Direct FR-16 atomicity violation |

The most important forbidden transition is:

```text
P0 -- invalid mixed batch --> P4 partial persistence
```

Any confirmed occurrence of this transition is a strong FR-16 defect candidate, subject to real execution evidence and Human Gate H.

---

## 5. Valid-batch persistence sequences

### ST-FR16-01 — Single valid row

```text
P0
  -> submit one valid row as Admin
  -> verify import outcome
  -> verify row exists
P2
```

Expected invariant:

- the intended row is persisted once according to the observed implementation behavior;
- unrelated baseline products remain present/unmodified;
- exact success status/response fields remain unresolved until Step E/runtime characterization.

### ST-FR16-02 — Multiple all-valid rows

```text
P0
  -> submit M valid rows
  -> verify every intended row exists
P2
```

Expected invariant:

```text
persisted rows from batch = M
```

when the import succeeds and no unrelated concurrent mutation occurs.

The contract does not define generated IDs, insertion order, or exact response representation.

---

## 6. Invalid-batch rollback sequences

These are the highest-priority Step C sequences.

### ST-FR16-03 — Invalid first row

```text
P0
  -> [invalid row, valid row, valid row]
  -> validation/import attempt
P3
```

Expected:

- invalid row is not persisted;
- later valid rows are also not persisted;
- baseline remains unchanged with respect to this batch.

### ST-FR16-04 — Invalid middle row

```text
P0
  -> [valid row A, invalid row, valid row B]
  -> validation/import attempt
P3
```

Expected:

- row A must not remain persisted merely because it appeared before the invalid row;
- row B must not be persisted;
- zero rows from the batch persist.

### ST-FR16-05 — Invalid last row

```text
P0
  -> [valid row A, valid row B, invalid final row]
  -> validation/import attempt
P3
```

This sequence is especially valuable because it can expose implementations that insert rows sequentially and discover an error only after earlier inserts.

Expected:

```text
row A absent after request
row B absent after request
invalid row absent after request
```

### ST-FR16-06 — Multiple invalid rows

```text
P0
  -> mixed batch containing multiple validation errors
  -> import attempt
P3
```

Persistence oracle remains zero rows from the batch. FR-16 additionally requires clear reporting of successes/errors/reasons, but exact schema and whether every invalid reason must be enumerated will be handled at Step E.

---

## 7. Authentication / authorization persistence sequences

Authorization failure must be treated as a state-preservation rule, not only an HTTP-response check.

### ST-FR16-07 — Missing/invalid JWT

```text
P0
  -> submit otherwise valid batch without valid JWT
P5
```

Expected:

- request is not authorized;
- zero batch rows persist;
- baseline remains unchanged.

### ST-FR16-08 — Valid non-admin JWT

```text
P0
  -> regular user JWT + fully valid batch
P5
```

Expected:

- non-admin user cannot import;
- zero rows persist.

This is direct FR-12 / SEC-03 coverage, not merely risk-based characterization.

### ST-FR16-09 — Admin JWT + invalid batch

Authentication success does not weaken validation/rollback:

```text
P0
  -> valid admin JWT + invalid mixed batch
P3
```

Expected: zero rows from batch persist.

---

## 8. CSV workflow vs JSON backend bridge sequence

Gate A preserved two surfaces:

```text
CSV business input
  -> parse/transform step (if actual frontend/workflow performs one)
  -> JSON { products: [...] }
  -> POST /api/admin/import-products
  -> database persistence
```

The API specification and implementation suggest a JSON bridge, while FR-16 describes CSV upload. Step C therefore distinguishes two layers:

1. **CSV workflow state integrity** — malformed/invalid CSV must not become partially persisted products.
2. **Backend JSON batch atomicity** — an invalid product row in `products[]` must not result in partial persistence if this endpoint is the persistence step implementing FR-16.

Do not assume the frontend parser performs all validation unless real workflow evidence later proves it. Backend atomicity still needs verification against the business requirement.

---

## 9. Repeated import / idempotency analysis

FR-16 does not define what happens when the **same fully valid batch is imported twice**.

Possible behaviors include:

- duplicate rows are inserted again;
- duplicates are rejected;
- existing products are updated/upserted;
- some duplicate policy based on name or another field exists.

None is specified.

Therefore:

### ST-FR16-10 — Repeat same valid import

```text
P0
  -> valid batch B
  -> resulting dataset D1
  -> repeat exact batch B
  -> resulting dataset D2
P6
```

Classification: **UNRESOLVED / CHARACTERIZATION**.

Do not fail the SUT merely because duplicates appear or are rejected unless another accepted requirement defines duplicate semantics.

Atomicity still applies to each individual request if the repeated request contains an invalid row.

---

## 10. Failed import followed by valid import

### ST-FR16-11 — Rollback then recovery

```text
P0
  -> invalid mixed batch
  -> verify P3 (no rows persisted)
  -> submit independent valid batch
  -> verify P2
```

Purpose:

- prove failed batch leaves no residue that corrupts the next import;
- verify the endpoint remains operational after validation failure;
- avoid treating one failed request as a permanent state transition.

Contract-backed portion:

- first batch must leave zero imported rows.

Subsequent operational recovery is a reasonable sequence expectation but exact error-recovery semantics are not explicitly documented; characterize response details.

---

## 11. Valid import followed by invalid import

### ST-FR16-12 — Existing successful data must survive later rollback

```text
P0
  -> valid batch A
  -> P2 with A persisted
  -> invalid batch B
  -> rollback B
  -> A remains present; B contributes zero rows
```

Critical invariant:

FR-16 rollback applies to the **current invalid import transaction**, not to previously committed valid products.

Therefore a later failed batch must not delete or corrupt prior valid imports.

This is a derived transactional integrity expectation strongly implied by “rollback the entire import” for the failing import operation.

---

## 12. Unrelated-product isolation

For every mutation sequence, verify when practical:

- products existing before the import are not modified unexpectedly;
- rollback removes/reverts only rows created by the current failed batch;
- failure handling does not delete unrelated products.

FR-16 does not explicitly say “other products remain unchanged,” but this is a necessary transactional integrity oracle for interpreting rollback correctly. Treat it as a derived persistence invariant rather than quoting it as direct FR-16 wording.

---

## 13. Parser/transport failure persistence behavior

### CSV malformed cases

For malformed CSV, wrong exact header, or invalid `.csv` workflow input:

```text
P0 -> parser/validation failure -> P3
```

if the real CSV workflow reaches a persistence-capable stage.

Strong oracle: no products from malformed input should appear as a successful compliant import.

### JSON malformed/body-shape cases

Malformed JSON, missing `products`, or wrong top-level type are API-shape failures. Exact HTTP semantics are unresolved.

Persistence oracle:

```text
zero unintended product rows persist
```

Do not automatically equate every malformed body with FR-16 row-validation rollback; distinguish request parser failure from business validation while keeping the state-preservation oracle.

---

## 14. Concurrency analysis

FR-16 does not define concurrent-import semantics, transaction isolation level, duplicate locking, or conflict resolution.

Potential scenario:

```text
Admin request A imports batch A
Admin request B imports batch B concurrently
```

Status: **OPTIONAL CHARACTERIZATION**, not a mandatory Gate C contract assertion.

If later included, concurrency tests should ask:

- does each request preserve its own all-or-nothing atomicity?
- can one failed batch partially affect the other batch?
- are unrelated rows corrupted?

Do not invent serialization or ordering requirements.

---

## 15. State-transition matrix by high-value condition

| Transition ID | Before | Actor | Input condition | Required after-state | Classification |
| --- | --- | --- | --- | --- | --- |
| T01 | P0 | Admin | one valid row | P2 | CONTRACT |
| T02 | P0 | Admin | multi-row all valid | P2 | CONTRACT |
| T03 | P0 | Admin | empty `name` in first row | P3 | CONTRACT |
| T04 | P0 | Admin | `price=0` in middle row | P3 | CONTRACT |
| T05 | P0 | Admin | negative price in final row | P3 | CONTRACT |
| T06 | P0 | Admin | multiple invalid rows | P3 | CONTRACT |
| T07 | P0 | unauthenticated | valid batch | P5 | FR-12 / SEC-02 |
| T08 | P0 | non-admin | valid batch | P5 | FR-12 / SEC-03 |
| T09 | P0 | Admin | malformed CSV/header | P3 / no compliant persistence | BUSINESS CONTRACT |
| T10 | P0 | Admin | malformed JSON/body shape | unchanged baseline | API SHAPE / CHARACTERIZATION |
| T11 | P0 | Admin | invalid mixed batch but some rows persist | P4 | **FORBIDDEN** |
| T12 | P2 after batch A | Admin | invalid batch B | A remains; B adds zero | DERIVED TRANSACTION INTEGRITY |
| T13 | P3 after failed batch | Admin | independent valid batch | P2 | SEQUENCE / RECOVERY |
| T14 | P2 | Admin | repeat identical valid batch | P6 | UNRESOLVED DUPLICATE SEMANTICS |

---

## 16. Primary runtime verification strategy for later Step J/K

Persistence-sensitive tests should use before/after evidence rather than trusting only the import response.

Recommended pattern:

```text
1. Establish unique batch marker(s), e.g. test-specific product names.
2. Query/list products before import and confirm marker absent.
3. Execute import request/workflow.
4. Query/list products after import.
5. Compare persistence against expected state:
   - valid batch -> all markers present
   - invalid batch -> no markers present
   - unauthorized request -> no markers present
6. Clean up any products created by valid characterization tests when safe.
```

Exact setup/cleanup implementation belongs to Step J and must use real runtime data.

---

## 17. What Step C intentionally does not decide

The following remain outside the approved state contract unless later sources/human decisions resolve them:

- duplicate/upsert/idempotency policy;
- maximum batch size;
- file-size limits;
- exact HTTP status codes;
- exact response JSON schema;
- whether whitespace-only names are invalid after trimming;
- full FR-15 inheritance (`name <= 255`, existing category);
- transaction isolation/concurrency ordering;
- whether CSV parsing occurs in frontend, backend, or both in the real workflow.

These should not become mandatory expected results merely because they are testable.

---

## 18. Human Gate C review checklist

Please review before Step D:

1. Accept that FR-16 has **no explicit named state machine**; Step C should use persistence states/sequences rather than artificial lifecycle states.
2. Accept `P4 Partial persistence` as a **forbidden state** under direct FR-16 atomicity.
3. Accept invalid first/middle/last row sequences as equivalent rollback requirements: zero rows from that batch persist.
4. Accept authorization failures as persistence-preserving transitions: missing/invalid JWT or valid non-admin JWT must leave zero batch rows persisted.
5. Accept before/after product verification as the primary runtime state oracle, not response counters alone.
6. Accept failed-import -> valid-import recovery sequence as useful sequence coverage, while exact response/recovery details remain characterization.
7. Accept valid batch A -> invalid batch B invariant: A remains committed; B contributes zero rows. Label this as **derived transactional integrity**, not verbatim FR-16 wording.
8. Keep repeated identical valid import behavior as **UNRESOLVED / CHARACTERIZATION** because duplicate/idempotency semantics are not specified.
9. Keep concurrency optional/characterization; do not invent transaction isolation or ordering requirements.
10. Preserve the CSV-vs-JSON bridge distinction: both surfaces must ultimately respect persistence integrity, but transport/parser behavior remains separately classified.

Do not proceed to Step D until Human Gate C is approved.