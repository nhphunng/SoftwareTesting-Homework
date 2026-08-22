# FR-16 Import Products — Schema / Response Analysis

Date: 2026-08-21  
API: `POST /api/admin/import-products`  
Primary requirement: FR-16 — Product Import from CSV  
Gate A: **APPROVED**  
Gate B: **APPROVED**  
Gate C: **APPROVED**  
Gate D: **APPROVED**  
Schema/response checkpoint status: **APPROVED**

Checkpoint decision: the reviewer approved the three-layer response model, semantic `success count / error count / reasons` obligations, persistence-first atomicity oracle, and continued `UNRESOLVED` treatment for undocumented exact HTTP statuses and response schema details.

## 1. Scope and source separation

Step E preserves three distinct response layers instead of merging them into one invented schema.

1. **FR-16 business-report requirement** — after import, the user must receive a clear report containing:
   - number of successful rows;
   - number of error rows;
   - reason(s) for the errors.
2. **Documented API contract** — `api_specification.md` defines the endpoint and JSON request body `{ "products": [...] }`, but defines no success/error response schema or exact status codes for this endpoint.
3. **Current implementation observation** — `backend/server.js` currently returns JSON containing `message`, `inserted`, and `errors`, and returns `{ "error": ... }` for at least one request-shape failure. These are implementation observations, not automatically authoritative contract fields.

The schema design therefore tests semantic obligations strongly and exact response shape only where a source supports it.

---

## 2. Business-report response requirement

FR-16 requires the import result to clearly communicate three pieces of information:

```text
success count
error count
error reason(s)
```

This is a **semantic response contract**.

### What is contract-backed

For a valid batch of `M` rows:

```text
successful rows = M
error rows = 0
```

For an invalid batch under FR-16 atomicity:

```text
persisted rows from batch = 0
```

and the report must clearly expose the failure count/reasons associated with invalid input.

### What is not defined

FR-16 does not define exact JSON property names such as:

```text
inserted
successCount
failed
errorCount
errors
reasons
message
```

It also does not define nesting, exact strings, or whether counts are numbers or encoded within a message.

Therefore later tests must assert **semantic availability and consistency** rather than inventing exact property names unless a reviewed runtime schema is intentionally adopted.

---

## 3. Documented API response contract

`api_specification.md` §6.3 defines:

- `POST /api/admin/import-products`;
- admin authentication/authorization requirement inherited from §6;
- JSON request body with top-level `products[]`;
- documented row fields `name`, `price`, `description`, `imageUrl`, `category_id`.

It does **not** define:

- success status code;
- validation error status code;
- authentication failure status code;
- authorization failure status code;
- malformed JSON status code;
- success response body;
- error response body;
- report field names;
- primitive types of report fields;
- nullability;
- `Content-Type` response requirement.

All of these remain **UNRESOLVED** at the contract level.

---

## 4. Current implementation response — characterization only

Static implementation inspection currently shows a success/final response shaped approximately as:

```json
{
  "message": "Import hoàn tất: <inserted>/<rows> sản phẩm được thêm",
  "inserted": 1,
  "errors": []
}
```

For missing/non-array/empty `products`, the implementation currently uses a response shaped as:

```json
{
  "error": "Không có dữ liệu để import"
}
```

Implementation also appends row-level error strings to `errors`, including DB `err.message` values when insert errors occur.

These fields are classified as:

```text
RUNTIME / IMPLEMENTATION CHARACTERIZATION
```

not as mandatory FR-16/API-spec schema.

A later real Newman execution may record exact shapes. They become stable regression assertions only after human review explicitly accepts that decision.

---

## 5. Success response analysis

### 5.1 Fully valid single-row batch

Strong required outcome:

- product persists;
- business report indicates one successful row;
- business report indicates zero errors or otherwise clearly communicates no failures.

UNRESOLVED:

- exact HTTP status;
- exact property names;
- exact message;
- whether the created product is returned;
- whether an `id` is returned.

### 5.2 Fully valid multi-row batch

For `M` valid rows:

```text
Persistence: all M rows persist
Report semantics: success count = M; error count = 0
```

The response must not contradict persisted state.

Example inconsistency that should fail semantic validation:

```text
3 rows persist
response says 2 successful
```

This remains invalid even if exact response property names are undocumented because the business report must be clear and accurate.

---

## 6. Invalid batch / atomic rollback response

For a batch with one or more FR-16-invalid rows:

```text
Persistence: zero rows from that batch persist
```

The report must communicate failures clearly.

Important semantic consistency rule:

```text
The response must not claim successful imported rows that actually persisted from a batch which is required to rollback entirely.
```

For an invalid batch, a response such as:

```text
inserted = 2
errors = [one error]
```

would be suspicious only when real persistence evidence confirms partial insertion. Response counters alone are not sufficient to prove an atomicity defect.

### UNRESOLVED invalid-batch response details

Do not invent:

- `400` / `409` / `422`;
- exact `error` field;
- exact `errors[]` schema;
- row index format;
- whether all errors or only first error must be reported;
- exact error wording.

FR-16 requires clear reasons, but not exact text or count-of-reasons policy.

---

## 7. Business success count vs atomicity

The phrase “number of successful rows” must be interpreted consistently with FR-16 all-or-nothing behavior.

For an all-valid batch:

```text
success count = total batch rows
```

For a validation-failing batch:

```text
persisted success count = 0
```

This avoids treating a row that was temporarily processed before rollback as a successful imported row.

If the implementation reports “processed successfully before rollback,” that concept would need explicit source support; current FR-16 does not define such an alternate meaning.

---

## 8. Error count semantics

FR-16 explicitly asks for the number of errors, but it does not define whether this means:

- number of invalid rows;
- number of validation violations;
- number of parser errors;
- number of DB errors;
- total error messages.

Status: **UNRESOLVED SEMANTICS**.

Recommended Step F wording:

```text
The response/report must clearly communicate an error count consistent with the application's documented/reporting interpretation and provide reasons; exact counting semantics are UNRESOLVED unless real behavior is later human-approved.
```

Do not assert that two validation violations in one row must equal error count `2` unless a source defines that.

---

## 9. Error reasons schema

FR-16 requires reason(s), but does not define whether reasons are:

- one string;
- array of strings;
- array of objects;
- keyed by row number;
- nested under an `errors` object.

Therefore:

```text
Reason presence/clarity = contract-backed semantic requirement
Exact reason representation = UNRESOLVED
```

A response that provides only a generic “Import failed” with no usable reason may be a business-report compliance concern, but must be judged using real response evidence and Human Gate G/H rather than an invented JSON schema.

---

## 10. Row-number reporting

Current implementation uses strings such as:

```text
Hàng <index+2>: ...
```

FR-16 does not require row numbers.

Therefore:

- row-number presence is useful characterization;
- exact 1-based/2-based indexing is not a contract requirement;
- tests must not fail solely because the response omits row numbers, provided reasons remain clear enough to satisfy the business report.

---

## 11. Authentication failure response

SEC-02 provides strong behavior:

```text
invalid/missing JWT
→ request not authorized
→ zero batch rows persist
```

Exact response details are unresolved:

- status code;
- body shape;
- error field;
- exact text;
- response headers.

Schema assertion level:

```text
MANDATORY: rejection + zero persistence
CHARACTERIZATION: actual status/body/content-type
```

---

## 12. Non-admin authorization failure response

SEC-03 provides strong behavior:

```text
valid JWT + role != admin
→ import not authorized
→ zero batch rows persist
```

Do not force `403` or another exact status because the supplied contract does not define it.

Do not require a particular error field or phrase.

A success-looking response must still be evaluated against persistence; a misleading success response with no persistence is a separate response-quality issue from an actual authorization bypass.

---

## 13. Malformed JSON / wrong request-shape response

Examples:

- malformed JSON;
- top-level array;
- missing `products`;
- `products: null`;
- `products` non-array;
- empty array.

The API specification defines only the canonical request shape. It does not define exact error responses for these variants.

Schema policy:

- record actual status/body;
- do not invent exact `4xx` codes;
- verify zero unintended persistence;
- keep malformed-request response schema as characterization unless later reviewed.

The implementation's current `{ "error": "Không có dữ liệu để import" }` for several shapes is not promoted to contract schema.

---

## 14. CSV business-surface response

FR-16's CSV requirements include `.csv`, exact header, quoted comma support, row validation, and rollback.

Where the real workflow exposes CSV handling, response/report semantics should cover:

| CSV scenario | Business response requirement | Persistence oracle |
| --- | --- | --- |
| Valid CSV | Clear success report | all rows persist |
| Wrong extension | Import must not be treated as compliant success | zero unintended rows |
| Wrong/missing header | Clear failure/reporting behavior | zero rows persist |
| Malformed quote/parser failure | Clear failure reason where workflow can report it | zero unintended/partial rows |
| Invalid `name`/`price` | error count/reason(s) | zero rows persist |

Exact frontend/UI message shape remains outside API schema unless the workflow is intentionally tested at UI level.

---

## 15. CSV-to-JSON bridge schema distinction

If Step J confirms the frontend parses CSV and sends JSON to this endpoint, there are two response layers:

```text
Frontend CSV parser/reporting
        ↓
Backend JSON import response
```

Do not assume the backend response itself must contain CSV-specific concepts like filename, header diagnostics, or RFC4180 parser errors if those are handled before the backend request.

Conversely, frontend success UI must not override backend persistence/auth failures.

The exact responsibility split remains runtime/workflow characterization until verified.

---

## 16. Information-disclosure response checks

Current implementation may expose DB `err.message` strings inside `errors`.

Step E classification:

- exact error schema remains unresolved;
- internal-error content should be captured during real execution when safely reproducible;
- stack trace / SQL / DB detail exposure is security characterization;
- it is not automatically a confirmed defect without an accepted requirement basis and Gate H confirmation.

Do not deliberately corrupt the DB merely to force such a response.

---

## 17. Content-Type and response parsing

The contract does not define exact response `Content-Type` for FR-16.

During real execution:

- record actual `Content-Type`;
- parse JSON when valid JSON is returned;
- preserve text/HTML errors as evidence when observed;
- do not classify media type alone as a defect without source-backed expectation.

For JSON implementation responses, later tests may characterize primitive types, but types are not mandatory contract assertions until human-approved.

---

## 18. Three-layer schema strategy

### S1 — Contract-backed semantic response schema

Mandatory:

- authorized valid batch → all intended rows persist;
- invalid batch → zero rows persist;
- unauthorized/non-admin → zero rows persist;
- report clearly communicates success count, error count, and reasons where applicable;
- report must not contradict persistence evidence.

### S2 — Runtime response-shape characterization

Record without prematurely enforcing:

- actual status code;
- JSON/text/HTML body type;
- top-level fields;
- `message` value/pattern;
- `inserted` type/value if present;
- `errors` type/contents if present;
- error response field(s);
- content type.

### S3 — Human-approved stable regression schema

Only after reviewed real execution may selected S2 observations become stable regression expectations.

Do not silently promote implementation behavior to specification truth.

---

## 19. Candidate schema/response tests for Step F

| Schema ID | Scenario | Assertion level | Expected basis |
| --- | --- | --- | --- |
| SCH-FR16-01 | Valid single-row JSON import | S1 | one row persists; report semantics indicate success=1/errors=0 |
| SCH-FR16-02 | Valid multi-row JSON import | S1 | all M persist; report success count semantically matches M |
| SCH-FR16-03 | Invalid first row | S1 | zero persistence; clear failure count/reason(s) |
| SCH-FR16-04 | Invalid middle row | S1 | zero persistence; clear failure count/reason(s) |
| SCH-FR16-05 | Invalid final row | S1 | zero persistence; clear failure count/reason(s) |
| SCH-FR16-06 | Multiple invalid rows | S1 | zero persistence; report contains usable failure information; exact error-count semantics unresolved |
| SCH-FR16-07 | Missing JWT | S1 | rejection + zero persistence; exact status/schema unresolved |
| SCH-FR16-08 | Valid non-admin JWT | S1 | rejection + zero persistence; exact status/schema unresolved |
| SCH-FR16-09 | Missing/empty `products` | S2 + persistence | characterize response; zero unintended persistence |
| SCH-FR16-10 | Malformed JSON | S2 + persistence | characterize parser response; zero unintended persistence |
| SCH-FR16-11 | Success runtime shape | S2 | record actual status/content-type/fields/types |
| SCH-FR16-12 | Validation failure runtime shape | S2 | record actual error/report shape without invented fields |
| SCH-FR16-13 | Auth failure runtime shape | S2 | record actual status/body |
| SCH-FR16-14 | Non-admin runtime shape | S2 | record actual authorization response |
| SCH-FR16-15 | CSV malformed/header failure through real workflow | S1/S2 | clear failure + zero persistence; exact transport-layer response characterized |
| SCH-FR16-16 | DB error response if safely reproducible | S2/security | record actual response and disclosure indicators; no fabricated failure |

---

## 20. Response-counter consistency rules

If runtime response exposes counters, use consistency checks without claiming those field names are contractually mandatory.

Example when `inserted` exists:

### Valid batch

```text
inserted == number of persisted test rows
```

### Invalid batch

```text
inserted should not claim persisted success inconsistent with zero-persistence atomicity
```

If runtime exposes `errors` as an array:

- characterize its length and contents;
- do not equate `errors.length` to FR-16's “error count” by default unless reviewed semantics support that interpretation.

Persistence evidence outranks a response counter when evaluating atomicity.

---

## 21. Error-message semantic policy

FR-16 requires clear reasons, not exact strings.

Therefore tests should evaluate:

- reason exists when a meaningful import validation/parser failure is reported;
- reason is not falsely a success-only message;
- reason is sufficiently tied to the failure to support human interpretation.

Avoid exact string equality such as:

```text
"Hàng 2: Thiếu tên sản phẩm"
```

unless a later human-approved regression contract intentionally adopts it.

---

## 22. AI testcase-generation rules carried into Step F

When generating the FR-16 AI testcase suite:

1. Never invent exact HTTP status codes for FR-16 responses.
2. Never invent mandatory JSON field names for the business report.
3. Preserve `success count / error count / reasons` as semantic FR-16 obligations.
4. Use before/after persistence as the primary atomicity/security oracle.
5. Distinguish CSV business-report behavior from backend JSON response behavior.
6. Treat `message`, `inserted`, `errors`, and `error` as implementation/runtime characterization unless human-approved later.
7. Keep auth/role rejection schema unresolved while asserting zero persistence.
8. Keep malformed JSON/body error schema unresolved.
9. Do not infer that `errors.length` is necessarily the FR-16 error count.
10. Do not infer exact row-number/error-string formatting.
11. Record actual runtime response shape during execution rather than backfilling hypothetical evidence.
12. Any schema assertion promoted from S2 to stable regression must be human-reviewed.

---

## 23. Human Schema / Response Checkpoint

Please review before Step F — AI Testcase Generation:

1. Accept the three-layer source model: FR-16 business-report semantics, API request contract, and implementation/runtime response characterization remain separate.
2. Accept `success count + error count + reasons` as semantic business-report requirements without inventing property names.
3. Keep exact success/validation/auth/authorization/parser HTTP status codes `UNRESOLVED`.
4. Keep exact response JSON field names/types/nesting `UNRESOLVED` at contract level.
5. Accept persistence evidence as the primary oracle for atomicity; response counters must be consistent with persisted state but cannot replace it.
6. For an invalid batch, interpret persisted success count as zero because FR-16 requires rollback; do not count temporarily processed rows as imported successes without explicit source support.
7. Keep the meaning of “error count” unresolved between invalid rows vs validation violations vs error messages.
8. Treat error reason presence/clarity semantically; do not require exact strings or row-number format.
9. Treat current `message`, `inserted`, `errors`, and `{error: ...}` response fields as S2 runtime/implementation characterization only.
10. Allow Step F to include limited schema-characterization cases that record actual response shape later without making those shapes mandatory contract assertions.
11. Preserve CSV-vs-JSON workflow responsibility boundaries; backend response need not expose CSV parser details if parsing occurs upstream.
12. Keep information-disclosure response checks as security characterization pending real evidence and defect review.

Do not proceed to Step F until this Schema/Response checkpoint is approved.
