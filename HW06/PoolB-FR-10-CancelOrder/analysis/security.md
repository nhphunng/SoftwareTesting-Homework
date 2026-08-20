# FR-10 Cancel Order — Security Analysis

Date: 2026-08-20  
API: `PUT /api/orders/:id/cancel`  
Primary requirement: FR-10 — Order State Machine  
Gate A: **APPROVED**  
Gate B: **APPROVED**  
Gate C: **APPROVED**  
Human Gate D status: **PENDING HUMAN REVIEW**

## 1. Security scope

The selected endpoint is a state-changing, authenticated order API. Its most relevant security properties are:

- valid JWT enforcement;
- protection against cross-user order mutation (BOLA/IDOR risk);
- state-machine integrity;
- resistance to parameter/body/query manipulation that attempts to override the target order, owner, or state;
- safe database handling of the path identifier where applicable;
- rejection of invalid transitions without mutating protected state.

The analysis below distinguishes:

1. direct project security requirements (`SEC-01..SEC-07`);
2. FR-10/FR-20 state rules;
3. the Human Gate A-approved ownership/IDOR rule, which is a **risk-based authorization expectation**, not direct FR-10 wording;
4. characterization-only risks where the supplied contract is silent.

---

## 2. SEC-01..SEC-07 mapping

| SEC ID | Requirement | Applicable to selected FR-10 API? | Security test implication |
| --- | --- | --- | --- |
| SEC-01 | Passwords must not be stored plaintext | No | No password operation occurs in cancel flow. |
| SEC-02 | Security-sensitive APIs require a valid JWT | **Yes — directly applicable** | Missing, malformed, tampered, or otherwise invalid JWT must not authorize cancellation. |
| SEC-03 | Admin APIs must verify `role='admin'` | Not directly | Selected endpoint is `/api/orders/:id/cancel`, not `/api/admin/*`. Do not force admin-role assertions onto this endpoint. |
| SEC-04 | User input rendered in UI must be escaped | No for API-only scope | No browser rendering is under direct test. |
| SEC-05 | DB queries must be parameterized, not concatenated | **Potentially applicable** | Path `:id` reaches database-backed order lookup/update. Injection-like probes may characterize whether user-controlled ID can alter query semantics. Do not claim violation without execution/source evidence. |
| SEC-06 | Profile update must not allow client role change | No | Not a profile endpoint. |
| SEC-07 | Reset OTP entropy/expiry/single-use | No | Not a password-reset flow. |

### Security priority

For FR-10, the primary contract-backed security requirement is **SEC-02**. The highest-risk non-numbered authorization concern is **cross-user cancellation/BOLA**.

---

## 3. Authentication security

### SEC-AUTH-01 — Missing JWT

Request:

```http
PUT /api/orders/{ownPendingOrderId}/cancel
```

without `Authorization`.

Expected:

- request must not be treated as authenticated;
- order state remains unchanged;
- exact HTTP status remains `UNRESOLVED` by current contract.

Basis: API specification authentication requirement + SEC-02.

### SEC-AUTH-02 — Malformed JWT

Examples:

```text
Bearer not-a-jwt
Bearer abc.def.ghi
```

Expected:

- must not authenticate;
- no order mutation.

### SEC-AUTH-03 — Tampered JWT / invalid signature

Use a real token whose payload/signature is deliberately altered without possessing the signing key.

Expected:

- token must not authenticate;
- no state change.

This is stronger than a purely malformed token because it tests signature verification.

### SEC-AUTH-04 — Expired JWT

Conditional on Step J being able to obtain a real reproducible expired token.

Expected:

- expired token must not authorize cancellation;
- no state change.

If a reproducible expired token cannot be prepared safely, mark this testcase `BLOCKED` rather than fabricating evidence.

### SEC-AUTH-05 — Wrong authentication scheme

Example:

```http
Authorization: Basic ...
```

Expected:

- must not be accepted as valid JWT authentication;
- no order mutation.

### Duplicate Authorization header

This remains **optional characterization** only because behavior depends on HTTP client/server normalization and may not be deterministic through Postman/Newman.

---

## 4. Ownership / BOLA / IDOR

Human Gate A approved the following risk-based security expectation:

> User A must not be able to cancel an order owned by User B.

This is not presented as direct FR-10 wording.

### SEC-OWN-01 — User A targets User B pending order

Precondition:

- User A has a valid JWT;
- User B owns an order in `pending`.

Action:

```http
PUT /api/orders/{userBPendingOrderId}/cancel
Authorization: Bearer <User-A-token>
```

Expected security invariant:

- User A must not be allowed to mutate User B's order;
- User B's order remains `pending`.

Exact rejection status/body remains unresolved.

### SEC-OWN-02 — User A targets User B confirmed order

Same security expectation as SEC-OWN-01, but using an otherwise cancelable `confirmed` order.

Why important: it isolates ownership authorization from state authorization. If the order were `shipping` or `delivered`, rejection could be caused by state rather than ownership.

### SEC-OWN-03 — Symmetric actor swap

User B attempts to cancel User A's otherwise cancelable order.

Purpose:

- detect actor-specific hard-coding or asymmetric authorization behavior;
- optional if runtime fixture cost is high, but useful when two actors are already available.

### Ownership oracle

For ownership tests, the strongest oracle is not a particular status code. It is:

```text
unauthorized actor cannot change the target order state
```

plus a runtime characterization of the actual response.

---

## 5. State-machine integrity attacks

### SEC-STATE-01 — Body attempts `status` override

Example:

```json
{"status":"delivered"}
```

sent to the cancel endpoint.

Expected:

- the endpoint must not behave as a generic status-update endpoint;
- it must not transition the order to `delivered`, `shipping`, `pending`, or another client-selected state;
- canonical cancel behavior must remain governed by FR-10.

Whether the extra field is ignored or rejected is contractually unresolved.

### SEC-STATE-02 — Query attempts `status` override

Example:

```text
/api/orders/{id}/cancel?status=delivered
```

Expected:

- query value must not override the cancel action/state machine.

### SEC-STATE-03 — Body attempts owner/user override

Example:

```json
{"user_id": <User-B-id>}
```

Expected:

- must not alter order ownership;
- must not grant access to another user's resource;
- must not turn an unauthorized target into an authorized one.

This is a mass-assignment-style risk test, not a direct SEC-06 application.

### SEC-STATE-04 — Query/path target conflict

Example:

```text
/api/orders/{User-A-order-id}/cancel?id={User-B-order-id}
```

Expected:

- undocumented query `id` must not override the documented path target;
- no unintended order should be mutated.

### SEC-STATE-05 — Repeated cancel

Sequence:

```text
pending/confirmed → cancel succeeds → canceled → cancel again
```

Expected:

- second request is an invalid final-state transition;
- state remains `canceled`;
- request must not reopen or move the order elsewhere.

This is contract-backed state integrity rather than merely robustness.

---

## 6. SEC-05 / injection-oriented analysis

The selected endpoint accepts an order identifier in the URL path. The contract does not explicitly define its data type, but DB-backed lookup/update is implied by the resource operation.

Potential probes:

| Security ID | Input class | Example | Expected security property |
| --- | --- | --- | --- |
| SEC-INJ-01 | quote-like path input | `'` / encoded quote | Must not alter SQL/query structure; no unrelated mutation |
| SEC-INJ-02 | boolean-style SQL input | encoded `' OR '1'='1` if routing permits | Must remain data; must not broaden target selection |
| SEC-INJ-03 | comment-style input | encoded `1--` / `x'--` | Must not change query semantics |
| SEC-INJ-04 | path traversal/reserved encoding | `%2e%2e`, `%2F` | Must not retarget another route/resource unexpectedly |
| SEC-INJ-05 | very large numeric string | long digits | Must not overflow into unintended order selection/mutation |

Important limitation:

- a `4xx` or `5xx` response alone does **not** prove SEC-05 compliance;
- a DB parser error or source inspection showing concatenation may support a violation;
- no defect should be confirmed until Gate G/H reviews real evidence and contract basis.

To keep Step K token-efficient, only failed injection cases should trigger raw evidence inspection when the compact Newman summary is insufficient.

---

## 7. Information disclosure

Potential observations during invalid-auth, malformed-ID, and injection probes:

- stack traces;
- SQL/database engine details;
- filesystem paths;
- JWT verification internals;
- implementation stack names.

The supplied requirements do not define a standalone generic information-disclosure requirement.

Therefore:

- record disclosure as a security observation;
- do not automatically classify it as a confirmed contract defect unless another requirement/source provides the basis;
- if disclosure accompanies a source-backed defect (for example SEC-05 violation), preserve it as supporting impact evidence.

---

## 8. Authorization vs state test isolation

Security tests must avoid ambiguous rejection causes.

Good ownership test fixture:

```text
User A token
+
User B order in pending or confirmed
```

because state permits cancel, so rejection should be attributable to authorization.

Poor ownership test fixture:

```text
User A token
+
User B delivered order
```

because both ownership and final-state rules would justify rejection.

Similarly, authentication tests should preferably target an own `pending` order so a rejected request is not confounded by invalid state.

---

## 9. Concurrency security/race considerations

Two race-oriented cases were identified in Step C:

1. User cancel vs Admin transition to `shipping`.
2. Two simultaneous cancel requests for the same `pending` order.

Security relevance:

- race conditions could violate state-machine integrity;
- stale authorization/state checks could allow an invalid transition.

However, these remain **optional risk-based characterization** because:

- FR-10 does not specify concurrency semantics;
- deterministic reproduction through Newman may be difficult;
- flaky concurrency evidence should not weaken the official suite.

Do not make them mandatory official cases unless a deterministic harness is established later.

---

## 10. Security test candidate matrix

| Candidate | Threat | Contract/risk basis | Priority | Official-suite recommendation |
| --- | --- | --- | --- | --- |
| SEC-AUTH-01 | Missing JWT | SEC-02 | High | Include |
| SEC-AUTH-02 | Malformed JWT | SEC-02 | High | Include |
| SEC-AUTH-03 | Tampered JWT | SEC-02 | High | Include |
| SEC-AUTH-04 | Expired JWT | SEC-02 | High | Conditional on runtime fixture |
| SEC-AUTH-05 | Wrong auth scheme | SEC-02 | Medium | Include |
| SEC-OWN-01 | User A cancels User B pending order | Gate A risk-based BOLA | Critical | Include |
| SEC-OWN-02 | User A cancels User B confirmed order | Gate A risk-based BOLA | Critical | Include |
| SEC-OWN-03 | Symmetric actor swap | Risk-based | Medium | Optional/useful |
| SEC-STATE-01 | Body status override | State integrity | High | Include |
| SEC-STATE-02 | Query status override | State integrity | Medium | Include |
| SEC-STATE-03 | Body user_id override | Authorization/mass-assignment risk | High | Include |
| SEC-STATE-04 | Query/path ID conflict | Authorization/parser risk | High | Include |
| SEC-STATE-05 | Repeated cancel | FR-10 final-state integrity | High | Include |
| SEC-INJ-01..05 | Injection/path parser probes | SEC-05 / robustness | Medium–High | Include selected deterministic probes |
| RACE-01/02 | Race/state TOCTOU | Risk-based | Medium | Optional, not mandatory |

---

## 11. Non-applicable security dimensions

Do not force these into FR-10 direct API testing:

- password hashing (SEC-01);
- UI XSS rendering (SEC-04);
- profile role escalation rule (SEC-06);
- password-reset OTP security (SEC-07);
- Admin role enforcement (SEC-03) on the selected non-admin endpoint.

Admin APIs may be used later only for controlled fixture setup where appropriate.

---

## 12. Step J implications

To execute security cases reproducibly later, prepare:

```text
User A valid token
User B valid token
User A own pending order
User A own confirmed order
User A own shipping order
User A own delivered order
User A own canceled order
User B pending order
User B confirmed order
admin token for fixture state setup only
non-existing order ID
tampered JWT derived from a real token
expired JWT only if safely reproducible
```

Every mutation-sensitive security testcase must have a before/after state oracle and reset strategy.

No runtime values should be fabricated during design.

---

## 13. Human Gate D review checklist

Please review before Step E:

1. Accept `SEC-02` as the primary directly applicable numbered security requirement.
2. Keep ownership/BOLA (`User A` cannot cancel `User B` order) as **mandatory risk-based authorization coverage**, not direct FR-10 wording.
3. Include status/user/id override attempts as state-integrity/authorization risk tests without inventing exact rejection status codes.
4. Include selected deterministic injection/path probes under SEC-05, while recognizing that response errors alone do not establish compliance or violation.
5. Treat generic information disclosure as an observation unless another source gives a direct defect basis.
6. Keep expired-token testing conditional on real runtime preparation.
7. Keep concurrency/race cases optional unless a deterministic execution harness is available.
8. Prioritize security tests that isolate one cause: own pending order for auth tests, other-user pending/confirmed orders for ownership tests.
