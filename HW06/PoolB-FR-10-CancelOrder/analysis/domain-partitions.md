# FR-10 Cancel Order — Domain Partition Design

Date: 2026-08-20  
API: `PUT /api/orders/:id/cancel`  
Primary requirement: FR-10 — Order State Machine  
Gate A: **APPROVED**  
Human Gate B status: **APPROVED**

## Gate A decision carried forward

The reviewer approved the following authorization test rule:

> User A must not be able to cancel an order owned by User B.

This is retained as a **risk-based authorization expectation**. It is not presented as a direct FR-10/API-spec sentence.

## Partitioning principles

- Do not invent numeric bounds for `:id` because the contract defines no minimum/maximum.
- Do not invent exact HTTP status codes where the contract is silent.
- Distinguish contract-backed valid/invalid state behavior from robustness characterization.
- Authentication partitions are meaningful because the order API requires `Authorization: Bearer <token>`.
- `X-Student-Id: 23127194` is a project-execution requirement, not a SUT business input constraint.
- Request-body/query partitions are characterization/security cases because the cancel endpoint documents no body or query parameters.

---

## 1. Path parameter `:id`

| Partition ID | Partition | Example shape | Expected / oracle basis | Type |
| --- | --- | --- | --- | --- |
| ID-01 | Existing order ID owned by authenticated User A, state=`pending` | `/api/orders/{pendingOwnId}/cancel` | Valid cancel; state becomes `canceled` | CONTRACT-BACKED VALID |
| ID-02 | Existing order ID owned by User A, state=`confirmed` | `/api/orders/{confirmedOwnId}/cancel` | Valid cancel; state becomes `canceled` | CONTRACT-BACKED VALID |
| ID-03 | Existing own order, state=`shipping` | `/api/orders/{shippingOwnId}/cancel` | User cancel rejected; state unchanged | CONTRACT-BACKED INVALID STATE |
| ID-04 | Existing own order, state=`delivered` | `/api/orders/{deliveredOwnId}/cancel` | Reject transition; final state unchanged | CONTRACT-BACKED INVALID STATE |
| ID-05 | Existing own order, state=`canceled` | `/api/orders/{canceledOwnId}/cancel` | Reject transition/repeat cancel; final state unchanged | CONTRACT-BACKED INVALID STATE |
| ID-06 | Existing order ID owned by User B | `/api/orders/{otherUserOrderId}/cancel` | Must not authorize User A to mutate User B's order | RISK-BASED AUTHORIZATION |
| ID-07 | Non-existing syntactically plausible ID | `/api/orders/{nonExistingId}/cancel` | Must not mutate any real order; exact status/body UNRESOLVED | DOMAIN / NOT-FOUND CHARACTERIZATION |
| ID-08 | `0` | `/api/orders/0/cancel` | Robustness characterization; no exact status invented | ROBUSTNESS |
| ID-09 | Negative integer | `/api/orders/-1/cancel` | Robustness characterization; no exact status invented | ROBUSTNESS |
| ID-10 | Non-numeric text | `/api/orders/abc/cancel` | Robustness/parser characterization | ROBUSTNESS |
| ID-11 | Decimal-like text | `/api/orders/1.5/cancel` | Robustness/parser characterization | ROBUSTNESS |
| ID-12 | Very large digit string | `/api/orders/999999999999999999999/cancel` | Overflow/parser robustness; must not mutate arbitrary order | ROBUSTNESS |
| ID-13 | Encoded special/path-like input | e.g. `%2e%2e`, `%2F`, quote-like content if request library permits | Input must not redirect to another resource/query; exact status UNRESOLVED | SECURITY / ROBUSTNESS |
| ID-14 | Missing `:id` segment | `/api/orders//cancel` or route without id depending client/router | Route-level characterization; exact result UNRESOLVED | MISSING / ROUTING |

### Notes on `:id`

No contract source defines:

- integer-only grammar;
- minimum value;
- maximum value;
- zero/negative validity;
- exact non-existing-ID status.

Therefore ID-08..ID-14 must not be written with invented `400/404` expectations. The strong oracle is **no unintended state mutation** plus runtime response characterization.

---

## 2. Authentication / Authorization header partitions

Primary input:

```http
Authorization: Bearer <token>
```

| Partition ID | Partition | Example | Expected / oracle basis | Type |
| --- | --- | --- | --- | --- |
| AUTH-01 | Valid User A JWT | `Bearer <valid-user-a-token>` | Authenticated request may proceed subject to state/ownership rules | CONTRACT-BACKED VALID |
| AUTH-02 | Authorization header omitted | no header | Request must be rejected; SEC-02/auth contract | CONTRACT-BACKED INVALID |
| AUTH-03 | Empty header value | `Authorization:` | Invalid authentication; exact status UNRESOLVED | AUTH NEGATIVE |
| AUTH-04 | `Bearer` scheme without token | `Authorization: Bearer` | Invalid authentication | AUTH NEGATIVE |
| AUTH-05 | Malformed token string | `Authorization: Bearer not-a-jwt` | Invalid authentication | AUTH NEGATIVE |
| AUTH-06 | Structurally JWT-like but invalid signature | tampered token | Must not authenticate | SEC-02 SECURITY |
| AUTH-07 | Expired token, if a real reproducible expired token can be prepared | expired JWT | Must not authenticate; only include in official suite if runtime-ready | SEC-02 SECURITY / CONDITIONAL |
| AUTH-08 | Valid User B JWT against User A's order | other user token | Must not authorize cross-user mutation | RISK-BASED AUTHORIZATION |
| AUTH-09 | Valid admin JWT on selected user cancel endpoint | admin token | CHARACTERIZATION only unless source later defines behavior for this endpoint | OUTSIDE PRIMARY CONTRACT / CHARACTERIZATION |
| AUTH-10 | Wrong auth scheme | `Basic ...` | Must not be treated as valid JWT auth | AUTH NEGATIVE |
| AUTH-11 | Duplicate Authorization headers, if tool/server allows | two auth headers | Parser/security characterization; do not invent precedence | SECURITY CHARACTERIZATION |

### Authentication constraints

`SEC-02` is directly applicable: the endpoint is an authenticated order API and must require a valid JWT.

`SEC-03` does **not** automatically apply to this selected endpoint because it is not `/api/admin/*`. Admin-role behavior on this endpoint is not promoted to a contract rule.

---

## 3. `X-Student-Id` project-header partitions

This header is required by **HW06 evidence rules**, not by FR-10 business logic.

Official execution partition:

| Partition ID | Input | Expected |
| --- | --- | --- |
| SID-01 | `X-Student-Id: 23127194` | Mandatory on every official request |

No negative SUT behavior is inferred from missing/wrong `X-Student-Id` unless the assignment explicitly asks the application to validate it. The test suite should verify that the outgoing official request contains the required exact value.

---

## 4. Request body partitions

The cancel endpoint documents **no body**.

| Partition ID | Partition | Example | Expected / oracle basis | Type |
| --- | --- | --- | --- | --- |
| BODY-01 | No body | none | Canonical documented request shape | CONTRACT-SHAPE VALID |
| BODY-02 | Empty JSON object | `{}` | Characterize whether ignored/rejected; valid cancel result must still obey state/ownership rules | CHARACTERIZATION |
| BODY-03 | Unexpected benign field | `{"foo":"bar"}` | Must not create unrelated mutation; exact rejection behavior UNRESOLVED | ROBUSTNESS |
| BODY-04 | Attempted status override | `{"status":"delivered"}` or `{"status":"pending"}` | Must not let client bypass cancel operation/state machine via undocumented field | SECURITY / STATE-INTEGRITY |
| BODY-05 | Attempted ownership/user override | `{"user_id": <other>}` | Must not rebind ownership or authorize another order | SECURITY / MASS-ASSIGNMENT RISK |
| BODY-06 | Malformed JSON with `Content-Type: application/json` | `{invalid` | Parser/error characterization; no exact status invented | ROBUSTNESS |
| BODY-07 | JSON `null` | `null` | Characterization; must not alter operation semantics unexpectedly | ROBUSTNESS |
| BODY-08 | Array body | `[]` | Type-shape characterization | ROBUSTNESS |
| BODY-09 | Large unexpected JSON payload | generated safe payload | Robustness only; no undocumented size threshold invented | BOUNDARY CHARACTERIZATION |

### Request-body oracle

Because no body is documented, BODY-02..09 are not automatically required to return `4xx`. Their important test oracles are:

- undocumented fields must not bypass the state machine;
- they must not change ownership;
- they must not cause unrelated order mutation;
- runtime status/body are characterized where the contract is silent.

---

## 5. Query-string partitions

The cancel endpoint documents no query parameters.

| Partition ID | Partition | Example | Expected / oracle basis | Type |
| --- | --- | --- | --- | --- |
| QUERY-01 | No query string | canonical URL | Documented request shape | VALID |
| QUERY-02 | Unknown benign query | `?foo=bar` | Characterization; must not alter target/state rules | ROBUSTNESS |
| QUERY-03 | Attempted state override | `?status=delivered` | Must not bypass cancel semantics/state machine | SECURITY / STATE-INTEGRITY |
| QUERY-04 | Attempted user/owner override | `?user_id=<other>` | Must not authorize/mutate another user's order | SECURITY / AUTHORIZATION |
| QUERY-05 | Duplicate/structured ID-like query | `?id=<other>` / bracket notation | Must not override path target unexpectedly | PARSER / AUTHORIZATION RISK |

---

## 6. Content-Type partitions

Since the canonical request has no body, `Content-Type` is not required by the documented cancel contract.

| Partition ID | Partition | Expected |
| --- | --- | --- |
| CT-01 | No `Content-Type` with no body | Canonical/acceptable request shape |
| CT-02 | `application/json` with `{}` | Characterization |
| CT-03 | Mismatched content type with body | Parser robustness; no exact status invented |

Do not add arbitrary media-type acceptance/rejection requirements beyond characterization.

---

## 7. State × ownership × auth cross-partitions

These combinations are more valuable than testing each input independently.

| Cross ID | Auth actor | Order owner | State | Core expectation |
| --- | --- | --- | --- | --- |
| CROSS-01 | User A | User A | pending | Cancel succeeds → canceled |
| CROSS-02 | User A | User A | confirmed | Cancel succeeds → canceled |
| CROSS-03 | User A | User A | shipping | Reject; unchanged |
| CROSS-04 | User A | User A | delivered | Reject; unchanged |
| CROSS-05 | User A | User A | canceled | Reject repeated cancel; unchanged |
| CROSS-06 | no valid auth | User A | pending | Reject authentication; unchanged |
| CROSS-07 | User A | User B | pending | Reject cross-user mutation; unchanged — risk-based authorization |
| CROSS-08 | User A | User B | confirmed | Reject cross-user mutation; unchanged — risk-based authorization |
| CROSS-09 | User B | User A | shipping/delivered | Reject regardless of state; unchanged |

These cross-partitions should drive later testcase generation and state/security analysis because they test the interaction among `:id`, authentication, ownership, and state.

---

## 8. Boundary policy

There are no contract-defined numerical boundaries for order ID or request-size limits.

Therefore FR-10 will use two kinds of boundaries:

1. **semantic boundaries** — state-machine boundaries such as `confirmed → canceled` being valid while `shipping → canceled` is invalid for User;
2. **robustness probes** — `0`, negative, very large ID, long body, malformed input — labeled as characterization rather than invented contract limits.

The semantic boundary between `confirmed` and `shipping` is especially important because it is the exact point where user cancellation permission changes.

---

## 9. Preliminary coverage mapping

| Coverage dimension | Partitions |
| --- | --- |
| Happy path | ID-01, ID-02, AUTH-01, BODY-01 |
| Invalid state | ID-03, ID-04, ID-05 |
| Ownership/IDOR | ID-06, AUTH-08, CROSS-07..09 |
| Authentication | AUTH-02..07, AUTH-10..11 |
| Missing/non-existing/malformed ID | ID-07..14 |
| Request-shape robustness | BODY-02..09, QUERY-02..05, CT-02..03 |
| State integrity / mass-assignment risk | BODY-04..05, QUERY-03..05 |
| Project evidence header | SID-01 |

---

## 10. Human Gate B review checklist

Please review before Step C:

1. Accept `:id` partitions ID-01..14, with malformed/numeric edge cases treated as robustness characterization rather than contract-defined invalid ranges.
2. Accept authentication partitions AUTH-01..11; expired-token and duplicate-header cases remain conditional on runtime reproducibility/tool support.
3. Confirm cross-user cases remain explicitly labeled **risk-based authorization**, not direct FR-10 wording.
4. Accept BODY/QUERY unexpected-input cases primarily as state-integrity/security characterization; do not require arbitrary `4xx` unless contract-backed.
5. Accept the semantic state boundary: User may cancel `confirmed`, but once `shipping`, User cancellation must be rejected.
6. Accept that `X-Student-Id` only needs a positive official-request verification partition, not fabricated negative SUT behavior.
