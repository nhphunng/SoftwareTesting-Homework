# API 1 — FR-05 Product Search — Security Analysis

## 1. Scope and basis

```text
Endpoint: GET /api/products
Query: ?search=keyword
FR: FR-05 — Product listing and search
Authentication: Public
Primary security input: search
```

This Step D analysis follows `$api-testing-human-loop` Gate D and the approved Option B source model:

1. `README.md` = business/security requirement truth.
2. `api_specification.md` = API interface contract.
3. `backend/server.js` = implementation observation only.

Human Gates A–C are complete. Their decisions remain binding:

- unspecified status/schema/normalization behavior stays `UNRESOLVED`;
- security-oriented values remain valid input-domain classes;
- detailed security analysis belongs here in Step D;
- FR-05 has no business state machine;
- authentication is contextual because the endpoint is public.

---

## 2. Named security requirement mapping — SEC-01 → SEC-07

| SEC | Requirement | Applicability to FR-05 | Reason / Test Direction |
| --- | --- | --- | --- |
| SEC-01 | Passwords must not be stored plaintext | NOT APPLICABLE | Product search does not create/read/update passwords |
| SEC-02 | Sensitive APIs require valid JWT | NOT APPLICABLE under documented contract | `GET /api/products` is documented as public; do not invent an authentication requirement |
| SEC-03 | Admin APIs must validate `role = 'admin'` | NOT APPLICABLE | Endpoint is not Admin-only |
| SEC-04 | User input displayed on UI must be escaped safely | PARTIALLY APPLICABLE | API can accept HTML/script-like search input; browser rendering safety requires UI/E2E evidence |
| SEC-05 | DB queries must use parameterized queries, not direct concatenation | DIRECTLY APPLICABLE | `search` is user-controlled input used in DB lookup; primary API security requirement |
| SEC-06 | Profile update must not allow client role changes | NOT APPLICABLE | No profile update/body fields |
| SEC-07 | OTP must have entropy/expiry/single-use behavior | NOT APPLICABLE | No OTP/reset-password behavior |

Primary security focus:

```text
SEC-05 — SQL injection resistance / parameterized query requirement
```

Secondary/partial focus:

```text
SEC-04 — malicious-looking search text at API input boundary; final browser-rendering safety remains outside API-only proof
```

---

## 3. Threat-surface analysis

### 3.1 Unauthenticated access

The endpoint is public by contract.

```text
No Authorization header = normal valid context
```

Therefore unauthenticated access is **not** a security defect candidate for FR-05.

Testing may still verify that the endpoint works without a JWT as an API-contract case, but that is not an access-control attack test.

---

### 3.2 Invalid/expired token supplied to a public endpoint

The contract does not define behavior when a client voluntarily sends an invalid/expired Authorization header to a public endpoint.

Classification:

```text
UNRESOLVED / robustness-security characterization
```

Do not require accept/reject behavior unless another source defines it.

---

### 3.3 Wrong role / role escalation

```text
NOT APPLICABLE
```

Reason:

- endpoint is public;
- no role check is required;
- no privileged action is exposed by this request.

Do not create fake `user vs admin` expected-behavior tests merely to satisfy a generic security checklist.

---

### 3.4 Ownership / IDOR / BOLA

```text
NOT APPLICABLE
```

Reason:

- no user-owned resource identifier is supplied;
- endpoint returns public product-list/search data;
- no ownership rule is defined for product visibility.

---

### 3.5 Mass assignment / unexpected fields

The documented endpoint is GET with no request body.

```text
Mass assignment: NOT APPLICABLE
```

Unexpected query keys could be used for robustness characterization, but no security requirement says arbitrary unknown query keys must be rejected.

Do not label ignored/accepted unknown query parameters as a vulnerability without a supporting contract or demonstrated impact.

---

### 3.6 Replay

```text
NOT APPLICABLE as a security requirement
```

The operation is public and read-only. Repeating the request is addressed as read-only sequence behavior in Step C, not token/action replay security.

---

### 3.7 Enumeration

Product discovery is the intended public behavior.

Therefore ordinary product-name enumeration is not automatically a vulnerability.

Potential concern would require an additional confidentiality/rate-limiting requirement, which the current sources do not define.

Classification:

```text
NOT A REQUIREMENT-BASED DEFECT DIMENSION under current sources
```

---

### 3.8 Rate/abuse behavior

No rate limit, throttling rule, request quota, or abuse threshold is defined in FR-05, SEC-01–SEC-07, or the API specification.

Classification:

```text
NOT SPECIFIED
```

A stress/abuse experiment could characterize behavior, but no pass/fail security expectation can be invented here.

---

## 4. SEC-05 — SQL injection security model

### Security invariant

```text
User-controlled search input must remain query data and must not alter SQL structure through string concatenation/injection.
```

### Source basis

SEC-05 explicitly requires parameterized queries and prohibits direct SQL string concatenation.

### Input families to cover later

| Security Class | Purpose | Expected security invariant |
| --- | --- | --- |
| Unmatched quote | Detect unsafe SQL string construction / DB error path | Search value must not break SQL structure |
| Boolean/operator manipulation | Detect widened/altered result set caused by SQL interpretation | Input must remain data, not executable predicate logic |
| Comment syntax | Detect truncation/alteration of generated SQL | Comment tokens must not alter query structure |
| Quote + comment combination | Detect classic injection paths | Query structure must remain intact |
| Encoded injection characters | Ensure URL encoding does not bypass secure handling | Decoded input must still remain data |
| Wildcard-heavy input | Characterize LIKE/wildcard behavior vs injection | Wildcard semantics may be characterization; must not become arbitrary SQL execution |
| Malformed SQL-like text | Exercise error handling and parser boundary | Must not expose unsafe DB execution behavior/internals |

Important distinction:

```text
SQL wildcard semantics are not automatically SQL injection.
```

For example, `%` may have LIKE-pattern meaning depending on implementation. Since the business contract does not define wildcard escaping semantics, that matching behavior may remain characterization. The core SEC-05 defect criterion is unsafe query construction / user-controlled alteration of SQL structure.

---

## 5. Implementation observation — SEC-05 candidate mismatch

Static inspection of `backend/server.js` shows:

```text
const query = `SELECT * FROM products WHERE name LIKE '%${searchQuery}%'`;
```

This directly interpolates user-controlled `searchQuery` into SQL text.

Classification:

```text
IMPLEMENTATION OBSERVATION
Strong potential SEC-05 mismatch
NOT YET CONFIRMED DEFECT
```

Why it is not yet labeled confirmed:

- current workflow requires real runtime evidence;
- later execution must show reproducible behavior/evidence;
- human defect confirmation remains required.

However, because SEC-05 is explicit, this observation makes injection-oriented runtime testing **high priority**.

---

## 6. Information disclosure

The current implementation's search error path sends:

```text
<h1>Database Error</h1><p>${err.message}</p>
```

Static concern:

```text
database error details may be reflected to the client
```

But the source requirements do not explicitly define a generic API error schema or a dedicated SEC ID for information disclosure.

Potential testing classification:

```text
SECURITY RISK / IMPLEMENTATION OBSERVATION
```

A runtime case may check whether malformed/injection-oriented input can trigger a DB error and whether internal error details are disclosed.

Defect classification should distinguish:

1. **SEC-05 violation** — unsafe SQL construction;
2. **information disclosure risk** — internal database details returned to client.

Do not merge them automatically into a single defect.

---

## 7. SEC-04 — HTML/script-like input

FR-05 says search keywords must be displayed safely and not rendered as HTML. SEC-04 requires user-provided data displayed in UI to be escaped correctly.

API-layer capability:

```text
Send HTML/script-like search input
Observe API response/error behavior
Ensure API call itself does not accidentally return executable HTML as a required success representation
```

API-layer limitation:

```text
Cannot prove that the frontend escapes the search keyword when rendering it in the browser
```

Therefore:

| Test concern | API suite | UI/E2E needed |
| --- | --- | --- |
| API accepts/handles script-like query input | Yes | No |
| API unexpectedly returns server-generated HTML error content | Yes | No |
| Search keyword is rendered as text rather than HTML in browser | No | Yes |
| DOM XSS actually executes | No | Yes |

SEC-04 should remain **partial coverage** in this API-only pipeline.

---

## 8. Security test-candidate matrix

These are candidate **classes**, not final testcase records yet.

| Candidate ID | Security basis | Threat | Input / Setup | Test idea | Applicable |
| --- | --- | --- | --- | --- | --- |
| SC-FR05-01 | SEC-05 | SQL injection — quote break | `search` with unmatched quote | Verify input cannot alter/break SQL structure | Yes — High |
| SC-FR05-02 | SEC-05 | Boolean-based injection | SQL-like boolean expression | Verify result set cannot be manipulated via SQL predicate injection | Yes — High |
| SC-FR05-03 | SEC-05 | SQL comment injection | comment-style payload family | Verify comments cannot truncate/alter SQL | Yes — High |
| SC-FR05-04 | SEC-05 | Encoded injection | URL-encoded quote/operator/comment family | Verify decoding does not bypass safe query handling | Yes — High |
| SC-FR05-05 | SEC-05 | Malformed SQL-like input | parser-breaking input family | Verify safe handling; inspect whether DB internals leak | Yes — High |
| SC-FR05-06 | SEC-04 partial | HTML/script-like input | encoded script/HTML-like keyword | Characterize API behavior; UI execution remains outside API proof | Partial |
| SC-FR05-07 | Info disclosure risk | DB error leakage | input that reproducibly triggers DB error if possible | Inspect response for internal DB details | Yes — risk-based |
| SC-FR05-08 | Public contract | Unauthenticated access | no JWT | Verify documented public access | Yes — contract/security context |
| SC-FR05-09 | Unresolved | Invalid token on public endpoint | malformed/expired Authorization | Characterize only; do not invent rejection/acceptance expectation | Optional characterization |
| SC-FR05-10 | Not specified | Rate/abuse | repeated/high-volume queries | No pass/fail requirement from current sources | Not required |
| SC-FR05-11 | N/A | Role escalation | user/admin tokens | No privileged behavior exists | No |
| SC-FR05-12 | N/A | IDOR/BOLA | ownership identifiers | No owned-resource ID input | No |
| SC-FR05-13 | N/A | Mass assignment | unexpected body fields | GET has no body contract | No |
| SC-FR05-14 | N/A | Replay | repeated public GET | Covered as Step C read sequence, not security replay | No separate security case |

---

## 9. Security expected-result discipline

For later testcase generation, separate three kinds of expectations.

### 9.1 Source-supported security expectations

Strong assertions may include:

```text
search input must not alter SQL structure
query construction must satisfy SEC-05 parameterization requirement
public endpoint must not be made Admin-only/auth-required without contract basis
```

### 9.2 UNRESOLVED response details

Do not invent:

```text
must return 400
must return 422
must return JSON error object
must sanitize by deleting special characters
must reject all SQL-like strings
```

SEC-05 requires safe query construction; it does **not** specify one particular HTTP rejection strategy.

A safe implementation may legitimately treat suspicious-looking text as ordinary search data.

### 9.3 Implementation observations

Observed runtime status/body is recorded as **actual result**, not automatically converted into expected behavior.

---

## 10. Human Gate D — review options

### Review Item 1 — SEC-05 defect criterion

- **Option A:** Treat any SQL-like/special-character search input that is accepted as a security defect.
- **Option B:** Treat the defect criterion as **user input altering/breaking SQL structure or evidence of non-parameterized unsafe query execution**; acceptance of SQL-like text as ordinary data is allowed.
- **Option C:** Require a specific HTTP rejection status such as 400/422 for all injection-like values.

**Recommended: B** — matches SEC-05 without inventing an input blacklist or status contract.

### Review Item 2 — Information disclosure

- **Option A:** Include database/internal-error disclosure as a separate risk/test dimension in Step D.
- **Option B:** Ignore information disclosure because it has no dedicated SEC-01–SEC-07 identifier.
- **Option C:** Merge any DB-error disclosure automatically into the SQL injection defect.

**Recommended: A** — Gate D permits threat-surface risks beyond named SEC IDs, while keeping defect causes separate.

### Review Item 3 — SEC-04 coverage

- **Option A:** Claim full SEC-04 coverage from API tests using script-like search strings.
- **Option B:** Keep SEC-04 as **partial API coverage** and require UI/E2E evidence to prove safe rendering/no DOM execution.
- **Option C:** Remove SEC-04 entirely from FR-05 API analysis.

**Recommended: B** — preserves requirement traceability without overstating API-only evidence.

### Review Item 4 — Invalid/expired JWT on public endpoint

- **Option A:** Define invalid token as expected rejection even though auth is not required.
- **Option B:** Keep it as optional robustness/security characterization with expected behavior `UNRESOLVED`.
- **Option C:** Remove it completely from later test generation.

**Recommended: B** — useful characterization while preserving the public contract.

### Review Item 5 — Rate/abuse testing

- **Option A:** Add rate-limit/abuse cases with self-defined thresholds.
- **Option B:** Mark rate/abuse as `NOT SPECIFIED` and exclude it from required FR-05 functional/security coverage.
- **Option C:** Infer acceptable thresholds from runtime performance and turn them into requirements.

**Recommended: B** — no current source defines a rate-limit contract.

### Review Item 6 — Security candidate scope for testcase generation

- **Option A:** Generate final tests for every generic category from the project checklist even when marked N/A.
- **Option B:** Generate security tests only for applicable/partial/risk-based dimensions: SEC-05, SEC-04 partial, public-access context, information disclosure, plus optional invalid-token characterization.
- **Option C:** Generate only one SQL injection testcase because SEC-05 is the only directly applicable named API security requirement.

**Recommended: B** — broad enough for meaningful coverage without fabricating irrelevant role/IDOR/mass-assignment cases.

### Human Gate D decisions

The tester selected:

```text
1B — SEC-05 defect criterion is unsafe/non-parameterized query behavior or input altering/breaking SQL structure; SQL-like text may still be valid data
2A — Keep database/internal-error information disclosure as a separate security risk/test dimension
3B — SEC-04 remains partial API coverage; UI/E2E evidence is required for full rendering-safety verification
4B — Invalid/expired JWT on this public endpoint remains optional robustness/security characterization with expected behavior UNRESOLVED
5B — Rate/abuse behavior is NOT SPECIFIED and excluded from required FR-05 security coverage
6B — Generate security tests only for applicable/partial/risk-based dimensions; do not force N/A categories
```

These decisions approve the security coverage model without inventing authentication, authorization, rate-limit, status-code, or UI-rendering guarantees that the sources do not define.

---

## 11. Step D status

```text
SEC-01 → SEC-07: MAPPED AND APPROVED
Primary API security requirement: SEC-05
Partial requirement: SEC-04
Additional approved risk: information disclosure
Threat-surface applicability: APPROVED
Gate D: COMPLETE
Next checkpoint: Schema/Response Analysis
```
