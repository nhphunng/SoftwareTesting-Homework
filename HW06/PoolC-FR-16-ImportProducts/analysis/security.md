# FR-16 Import Products — Security Analysis

Date: 2026-08-21  
API: `POST /api/admin/import-products`  
Primary requirement: FR-16 — Product Import from CSV  
Gate A: **APPROVED**  
Gate B: **APPROVED**  
Gate C: **APPROVED**  
Human Gate D status: **PENDING HUMAN REVIEW**

## 1. Security scope

FR-16 is a security-sensitive, data-changing admin import operation. Security coverage must protect both authorization and persistence integrity while preserving the Gate A contract distinction:

1. **CSV business surface** — `.csv` file, exact header, RFC4180 quoted-comma behavior, validation, atomic rollback.
2. **JSON API surface** — documented body `{ "products": [...] }` for `POST /api/admin/import-products`.

The analysis distinguishes:

- direct project security requirements (`SEC-01..SEC-07`);
- direct FR-12 admin access requirements;
- direct FR-16 atomicity/validation requirements that create security-relevant persistence invariants;
- risk-based import/file/parser threats where the supplied contract is silent;
- implementation observations used only to prioritize later runtime tests, not to pre-confirm defects.

---

## 2. SEC-01..SEC-07 mapping

| SEC ID | Requirement | Applicability to FR-16 | Security implication |
| --- | --- | --- | --- |
| SEC-01 | Passwords must not be stored plaintext | No | Import flow does not process or persist passwords. |
| SEC-02 | Security-sensitive APIs require a valid JWT | **Yes — directly applicable** | Missing, malformed, tampered, expired, or otherwise invalid JWT must not authorize import or persist batch rows. |
| SEC-03 | Admin APIs must verify `role='admin'` | **Yes — directly applicable** | A valid non-admin JWT must not authorize `/api/admin/import-products`. Token presence alone is insufficient. |
| SEC-04 | User input rendered in UI must be escaped | **Partially/downstream applicable** | Imported `name`, `description`, and possibly `imageUrl` may later be rendered. API-only import testing can preserve payloads and verify persistence, but full XSS/escaping compliance needs UI/E2E evidence. |
| SEC-05 | DB queries must be parameterized, not concatenated | **Yes — applicable to persistence path** | Imported fields are attacker-controlled database inputs. Injection-oriented values must not alter SQL structure or cause unrelated DB mutation. Static implementation currently uses parameter placeholders for the insert path, but runtime/security testing remains useful. |
| SEC-06 | Profile update must not permit role change | No | This is not a profile update operation. Do not force profile-specific mass-assignment requirements here. |
| SEC-07 | Reset OTP entropy/expiry/single-use | No | No password-reset/OTP flow exists in FR-16. |

### Security priority

Priority order for FR-16:

1. `SEC-03` admin authorization / role escalation;
2. `SEC-02` authentication integrity;
3. FR-16 atomicity as a persistence-integrity security property;
4. `SEC-05` injection-safe persistence;
5. import/parser/file risks and malicious content as explicitly labeled risk-based coverage;
6. `SEC-04` only partially verifiable at API level.

---

## 3. Authentication security — SEC-02

### SEC-AUTH-01 — Missing Authorization header

Input:

```http
POST /api/admin/import-products
```

with otherwise valid import data but no `Authorization` header.

Required security invariant:

```text
request is not authenticated
AND
zero rows from the batch persist
```

Exact HTTP status/body remains `UNRESOLVED`.

### SEC-AUTH-02 — Empty or incomplete Bearer token

Examples:

```text
Authorization:
Authorization: Bearer
```

Expected:

- must not authenticate;
- zero import rows persist.

### SEC-AUTH-03 — Malformed JWT

Examples:

```text
Bearer not-a-jwt
Bearer abc.def.ghi
```

Expected:

- must not authenticate;
- no product mutation from the attempted batch.

### SEC-AUTH-04 — Tampered-signature JWT

Use a real reproducible JWT, modify payload/signature without the signing secret.

Expected:

- token must not authenticate;
- zero rows persist.

This is stronger than a generic malformed-token case because it directly checks signature enforcement.

### SEC-AUTH-05 — Expired JWT

Conditional on Step J being able to prepare a real expired token.

Expected:

- expired token must not authorize import;
- zero rows persist.

If deterministic setup is unavailable, mark the later testcase `BLOCKED` instead of fabricating an expired token.

### SEC-AUTH-06 — Wrong auth scheme

Example:

```http
Authorization: Basic ...
```

Expected:

- must not be treated as valid JWT authentication;
- no import persistence.

### Duplicate Authorization headers

Optional parser/security characterization only. Header merging/precedence can vary across HTTP tooling and middleware, so no mandatory precedence rule is invented.

---

## 4. Admin authorization / role escalation — SEC-03

This is a direct contract-backed security boundary.

```text
valid JWT + role=admin     -> may reach import validation
valid JWT + role!=admin    -> must not authorize import
```

### SEC-ROLE-01 — Valid regular-user JWT + valid JSON batch

Precondition:

- regular user has a valid JWT;
- batch is otherwise fully valid.

Expected:

```text
zero batch rows persist
```

This isolates role authorization from input validation.

### SEC-ROLE-02 — Valid regular-user JWT + invalid batch

Purpose: ensure a request does not reach a persistence-capable path merely because validation also fails.

Security oracle:

- non-admin remains unauthorized regardless of batch validity;
- zero rows persist.

Exact error precedence between authorization and validation is `UNRESOLVED` unless runtime characterization is later intentionally adopted.

### SEC-ROLE-03 — Role claim manipulation

Use a valid non-admin token and a tampered version whose payload changes role to `admin` without re-signing.

Expected:

- must fail authentication/signature validation;
- must not become admin;
- zero rows persist.

This covers combined SEC-02 + SEC-03 integrity.

### SEC-ROLE-04 — Body attempts role/admin override

Example row or top-level extra properties:

```json
{
  "role": "admin",
  "products": [
    {
      "name": "HW06-role-probe",
      "price": 100,
      "role": "admin"
    }
  ]
}
```

Classification: **RISK-BASED MASS-ASSIGNMENT / UNEXPECTED-FIELD CHARACTERIZATION**.

Expected security invariant:

- request body must not elevate the authenticated actor;
- unexpected fields must not mutate authorization state or unrelated privileged data.

Whether the extra fields are ignored or rejected is contractually unresolved.

---

## 5. Persistence integrity and atomicity as a security property

FR-16 directly forbids partial persistence when any row is invalid. This is primarily a business/transaction requirement, but it is also a security-integrity property because a maliciously crafted batch must not bypass validation by placing valid rows before an invalid row.

### SEC-ATOMIC-01 — Invalid first row

```text
[invalid, valid, valid]
```

Required after-state:

```text
zero rows from batch persist
```

### SEC-ATOMIC-02 — Invalid middle row

```text
[valid, invalid, valid]
```

Required after-state:

```text
zero rows from batch persist
```

### SEC-ATOMIC-03 — Invalid final row

```text
[valid, valid, invalid]
```

Required after-state:

```text
zero rows from batch persist
```

This is especially important because streaming/loop-based persistence can otherwise expose a partial-write weakness.

### SEC-ATOMIC-04 — Multiple validation errors

Expected:

- no row persists;
- business report should be clear about failures according to FR-16;
- exact response schema is deferred to Step E.

### SEC-ATOMIC-05 — Database error on one row

If Step J can safely construct a deterministic DB-level failing row without corrupting the environment, verify all-or-nothing behavior.

Classification: **CONDITIONAL / RUNTIME-DEPENDENT**.

Do not fabricate a DB error merely to execute this case.

---

## 6. SQL/database injection — SEC-05

Imported product values are attacker-controlled DB inputs. Security probes should use safe inert strings and verify both response behavior and database state.

### 6.1 Fields worth probing

- `name`
- `description`
- `imageUrl`
- `category_id` when transport/parser allows noncanonical values
- JSON extra fields only as characterization

### SEC-SQL-01 — Quote/comment-like product name

Example inert literal:

```text
HW06_SQL_'_--_23127194
```

Expected:

- value must not terminate/alter the insert SQL statement;
- no unrelated rows/tables are modified;
- if accepted as data, it should remain data.

Do not require rejection merely because the value looks SQL-like.

### SEC-SQL-02 — SQL-looking description

Example:

```text
x'); SELECT 1; --
```

Expected security criterion:

- payload does not change SQL structure;
- no second statement/unrelated mutation occurs.

### SEC-SQL-03 — Boolean/UNION-looking text

Examples kept as inert string values:

```text
' OR '1'='1
UNION SELECT 1
```

Expected:

- no query-structure change;
- input may be stored as literal data if otherwise valid.

### SEC-SQL-04 — Category/type confusion

Use nonnumeric/string/object category forms only as robustness/security characterization because FR-16 does not define category grammar.

Oracle:

- must not cause unrelated SQL execution;
- partial persistence remains forbidden when the row is treated as invalid.

### Implementation observation

Current `server.js` uses:

```text
INSERT INTO products (...) VALUES (?, ?, ?, ?, ?)
```

through a prepared statement. This is favorable evidence for SEC-05 at the inspected insert point, but Step D does not mark SEC-05 PASS solely from static inspection. Runtime probes may still verify that parsing/coercion does not reach an unsafe alternate path.

---

## 7. CSV-specific attack surface

These risks arise from the FR-16 CSV business surface. Unless tied to a supplied security requirement, they remain explicitly **risk-based**, not direct mandatory contract rules.

### 7.1 CSV formula injection

Potential dangerous prefixes in spreadsheet applications include formula-like strings such as:

```text
=2+2
+SUM(1,1)
-HYPERLINK(...)
@SUM(1,1)
```

Candidate fields:

- `name`
- `description`

Classification: **RISK-BASED CSV/EXPORT CONSUMER RISK**.

Important scope rule:

- FR-16 does not say these values must be rejected or neutralized;
- an API-only import test can characterize whether they are stored;
- proving exploitability requires a downstream spreadsheet/export/opening context and must not be inferred from storage alone.

### 7.2 Quoted comma / quote parser confusion

Attack-style malformed variants:

- unterminated quote;
- inconsistent quote escaping;
- delimiter injection via unquoted comma;
- extra/missing columns produced by parser confusion.

Security/persistence oracle:

```text
malformed input must not result in a partially persisted compliant import
```

Exact parser error/status remains unresolved.

### 7.3 Header manipulation

Examples:

- duplicate `name` header;
- reordered headers;
- extra privileged-looking header such as `role` or `id`;
- BOM-prefixed header;
- leading/trailing whitespace.

Direct FR-16 rule: exact required header only.

Security value: prevents field confusion and accidental mapping of attacker-controlled columns.

### 7.4 CSV row/column smuggling

Examples:

- quoted embedded newline;
- extra delimiters;
- empty line between records;
- values crafted to shift `category_id` into another column.

Classification:

- quoted comma is contract-backed;
- broader RFC4180/multiline behavior is characterization where not explicit;
- strong persistence oracle remains no unintended/partial product insertion.

### 7.5 File disguise/content mismatch

`.csv` filename containing non-CSV content is not a compliant FR-16 import.

Expected:

- must not produce a successful valid import;
- zero unintended product rows persist.

MIME sniffing rules are not specified and are not invented.

---

## 8. JSON parser / object-shape attack surface

The documented API surface accepts JSON `products[]`.

### SEC-JSON-01 — Duplicate top-level `products` keys

Classification: parser/security characterization.

Purpose:

- detect key-precedence ambiguity;
- ensure one duplicate value cannot smuggle an unauthorized/invalid alternate batch unexpectedly.

No precedence rule is contract-backed.

### SEC-JSON-02 — Duplicate row property keys

Example raw JSON with duplicate `name` or `price` keys.

Purpose:

- characterize parser behavior;
- ensure ambiguity does not bypass the direct non-empty-name / positive-price business validation.

### SEC-JSON-03 — Extra system-like fields

Examples:

```json
{"id":999,"user_id":1,"role":"admin","isAdmin":true}
```

Expected security invariant:

- no unrelated privileged/system state is changed;
- extra fields cannot override authentication/authorization;
- acceptance/rejection of harmless extras remains unresolved.

### SEC-JSON-04 — Mixed row types

Example:

```json
{"products":[validRow,null,"x",{}]}
```

Security/persistence expectation:

- type confusion must not produce arbitrary or partial persistence;
- if any row is invalid under the import business operation, FR-16 atomicity requires zero batch rows persist.

---

## 9. Stored content / downstream XSS — SEC-04 boundary

Imported text can later become UI content. Relevant API probes include inert strings such as:

```text
<script>alert(1)</script>
<img src=x onerror=alert(1)>
```

At Step D/API level, these tests can determine only:

- whether content is accepted/rejected;
- how it is persisted/returned;
- whether server responses disclose or transform it unexpectedly.

They **cannot** prove SEC-04 UI escaping by themselves.

Full SEC-04 verification requires browser/UI evidence showing that later rendering treats the value as text rather than executable markup.

Therefore:

```text
SEC-04 = PARTIAL API COVERAGE + UI/E2E REQUIRED FOR FULL VERIFICATION
```

Do not mark an API that stores `<script>` text as defective solely from storage behavior when the contract does not require input rejection.

---

## 10. Information disclosure

Error handling should be inspected for accidental leakage of:

- SQL/SQLite error details;
- stack traces;
- filesystem paths;
- implementation internals;
- JWT verification internals;
- raw sensitive auth data.

However, the supplied SEC list does not define a standalone generic information-disclosure requirement for this endpoint.

Therefore:

- capture real error responses later;
- flag disclosure as a security risk for human review;
- do not automatically convert any `5xx` or DB message into a confirmed defect without a contract/security basis and Gate H confirmation.

Implementation observation: current import code may include `err.message` in its `errors` array for database insert errors. This is a high-value runtime characterization target, not a confirmed defect at Step D.

---

## 11. Rate, resource exhaustion, and oversized import abuse

Potential risks:

- very large CSV file;
- very large `products[]` array;
- very long field values;
- repeated rapid imports;
- many concurrent imports.

Current contract defines no:

- file-size maximum;
- row-count maximum;
- API rate limit;
- concurrency quota;
- field-length limit for FR-16 beyond unresolved FR-15 inheritance.

Therefore these remain:

```text
ROBUSTNESS / RESOURCE-ABUSE CHARACTERIZATION
```

Do not fail the SUT merely for accepting a particular size that was never prohibited. Later tests may still verify that safe bounded probes do not corrupt data or violate per-request atomicity.

---

## 12. Replay / repeated import

A valid JWT may be reused for multiple legitimate requests; no nonce or one-time import token is specified.

Repeated identical import semantics are also not defined.

Therefore:

- replay is **not** treated as a direct vulnerability merely because the same valid request can be sent twice;
- duplicate/idempotency behavior remains `UNRESOLVED / CHARACTERIZATION` from Step C;
- security tests should not invent “second request must be rejected”.

If repeated requests expose unauthorized mutation, partial persistence, or cross-request corruption, those concrete invariants may still be evaluated.

---

## 13. Ownership / IDOR / enumeration applicability

The selected endpoint has no path resource ID and does not operate on a user-owned target resource.

Therefore generic BOLA/IDOR testing is **not directly applicable** in the FR-10 sense.

Do not invent cases such as “User A imports into User B's product collection” because no per-user product ownership model is specified.

Relevant authorization dimension is instead:

```text
Admin vs non-admin role boundary
```

Enumeration of category/product IDs may appear in `category_id` probes, but the contract does not define category secrecy or anti-enumeration behavior. Treat those as type/existence characterization, not a security requirement.

---

## 14. Transport-conflict security considerations

Gate A preserved the mismatch between CSV business requirements and JSON endpoint contract.

### Direct endpoint JSON

`application/json` + `{products:[...]}` is the documented API contract surface.

### Direct multipart/raw CSV to endpoint

Not documented by the API specification. Security tests may characterize whether unexpected transports are ignored/rejected/parsed, but should not assert a specific media-type rejection unless supported later.

### Real frontend CSV -> JSON bridge

If Step J confirms that the frontend parses CSV and sends JSON:

- CSV parser security belongs partly to frontend/workflow behavior;
- backend must still enforce authentication/authorization and persistence integrity;
- backend must not trust the frontend to enforce admin role or atomicity.

This distinction is important: client-side validation is not a substitute for server-side security.

---

## 15. Implementation observations — not confirmed defects

Static inspection of `backend/server.js` currently shows:

1. route uses `authenticateToken`;
2. route does not visibly perform an admin-role check at the route itself;
3. route receives `req.body.products` JSON;
4. insert uses a prepared statement with placeholders;
5. code checks missing `row.name` but not visibly `price > 0`;
6. rows are inserted individually in a loop;
7. no explicit transaction/rollback is visible;
8. DB insert errors are added using `err.message`;
9. response exposes `inserted` and `errors` implementation fields.

These observations prioritize later runtime checks for:

- SEC-03 role escalation;
- FR-16 validation and atomicity;
- information-disclosure characterization;
- SEC-05 verification.

They are **not** defect confirmations. Only real execution + Gate G/H can establish confirmed product defects.

---

## 16. Security candidate matrix

| Candidate ID | Requirement / risk | Threat | Test idea | Mandatory? |
| --- | --- | --- | --- | --- |
| SD-01 | SEC-02 | Unauthenticated import | Valid batch with no JWT; verify zero persistence | YES |
| SD-02 | SEC-02 | Malformed JWT | Valid batch + malformed Bearer token | YES |
| SD-03 | SEC-02 | Tampered JWT | Modify valid JWT signature/payload | YES |
| SD-04 | SEC-02 | Expired JWT | Real expired JWT if reproducible | CONDITIONAL |
| SD-05 | SEC-03 | Role escalation | Valid non-admin JWT + valid batch | YES |
| SD-06 | SEC-03 + SEC-02 | Forged admin role | Tamper non-admin JWT role without valid signature | YES |
| SD-07 | Risk-based | Body role/mass assignment | Add `role/isAdmin/id` fields | CHARACTERIZATION |
| SD-08 | FR-16 | Partial-write integrity | Invalid final row after valid rows | YES |
| SD-09 | FR-16 | Partial-write integrity | Invalid middle row | YES |
| SD-10 | SEC-05 | SQL injection | SQL-looking `name` literal | YES |
| SD-11 | SEC-05 | SQL injection | SQL-looking `description` literal | YES |
| SD-12 | SEC-04 partial | Stored XSS payload | Persist inert HTML/script-like text then reserve UI verification | PARTIAL / RISK-BASED |
| SD-13 | CSV risk | Formula injection | Formula-like `name/description` in CSV | RISK-BASED |
| SD-14 | CSV contract/risk | Parser confusion | Unterminated quote/extra delimiter; verify no partial persistence | YES for malformed CSV business compliance |
| SD-15 | CSV contract | Header smuggling/confusion | Extra/reordered/privileged-looking header | YES for exact-header rule |
| SD-16 | JSON risk | Duplicate keys | Duplicate `products/name/price` keys | CHARACTERIZATION |
| SD-17 | JSON risk | Type confusion | Mixed row types | SECURITY/ROBUSTNESS + atomicity oracle |
| SD-18 | Info disclosure | DB/internal errors | Capture deterministic real error if safely reproducible | CHARACTERIZATION |
| SD-19 | Resource abuse | Oversized batch | Safe bounded large batch | OPTIONAL ROBUSTNESS |
| SD-20 | Role + transport | Non-admin through CSV workflow | Valid CSV workflow with non-admin actor | YES if real CSV workflow is runtime-accessible |

---

## 17. Runtime security oracle strategy

For state-changing security tests, response status alone is insufficient.

Recommended later execution pattern:

```text
1. Prepare unique product markers for the testcase.
2. Confirm markers absent before request.
3. Execute security probe.
4. Capture real response/status/body.
5. Query persisted products after request.
6. Assert security invariant:
   - unauthenticated/non-admin -> zero markers persist
   - invalid batch -> zero markers persist
   - valid authorized injection-looking literals -> no unrelated DB mutation
7. Preserve evidence before cleanup.
```

For SQL/security probes, verify unrelated baseline records remain intact where feasible.

---

## 18. What Step D intentionally does not claim

Step D does **not** invent or assert:

- exact auth rejection HTTP status;
- exact authorization rejection HTTP status;
- exact error response schema;
- a mandatory file-size or row-count limit;
- a mandatory rate limit;
- a duplicate/idempotency policy;
- MIME-sniffing behavior;
- generic IDOR where no ownership model exists;
- automatic rejection of HTML/script/formula-like text;
- complete SEC-04 compliance from API-only tests;
- a vulnerability solely because implementation source looks suspicious.

---

## 19. Human Gate D review checklist

Please review before Step E — Schema/Response Analysis:

1. Accept `SEC-02` as directly applicable: invalid/missing/tampered auth must leave zero batch rows persisted.
2. Accept `SEC-03` as directly applicable and high priority: a valid non-admin JWT must not authorize `/api/admin/import-products`.
3. Accept JWT role-claim tampering as combined SEC-02/SEC-03 security coverage.
4. Accept FR-16 partial persistence as a security-integrity concern in addition to its business/transaction role; invalid first/middle/last rows all require zero batch persistence.
5. Accept `SEC-05` SQL-oriented probes using inert literals, with the defect criterion being altered/broken SQL semantics or unintended DB mutation — not merely acceptance of SQL-looking text.
6. Accept `SEC-04` as partial at API scope; full escaping/XSS verification requires downstream UI/E2E evidence.
7. Accept CSV formula injection as **risk-based characterization**, not a direct FR-16 rejection requirement.
8. Accept malformed quote/header/column-smuggling cases as CSV business/parser security coverage, with no-partial-persistence as the strong oracle.
9. Accept duplicate JSON keys, extra system-like fields, and mixed row types as parser/mass-assignment/type-confusion characterization; do not invent key precedence or generic mandatory `4xx` behavior.
10. Accept information-disclosure checking as characterization unless a supplied security requirement or later human decision establishes a stronger defect criterion.
11. Keep oversized batch, rapid repetition, and concurrency as optional robustness/resource-abuse characterization because no limits are specified.
12. Mark ownership/IDOR as not directly applicable because this endpoint has no user-owned path resource; role authorization is the relevant access-control boundary.
13. Preserve the CSV-vs-JSON transport distinction and do not treat frontend validation as a substitute for backend auth/atomicity enforcement.
14. Keep implementation observations separate from confirmed defects until real execution and Gate G/H review.

Do not proceed to Step E until Human Gate D is approved.
