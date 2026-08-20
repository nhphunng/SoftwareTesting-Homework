# FR-10 Cancel Order — Schema / Response Analysis

Date: 2026-08-20  
API: `PUT /api/orders/:id/cancel`  
Primary requirement: FR-10 — Order State Machine  
Gate A: **APPROVED**  
Gate B: **APPROVED**  
Gate C: **APPROVED**  
Gate D: **APPROVED**  
Schema/response checkpoint status: **APPROVED**

## 1. Contract evidence available

The supplied API specification documents:

- endpoint: `PUT /api/orders/:id/cancel`;
- authentication: `Authorization: Bearer <token>` for Cart & Orders APIs;
- operation: change order status to `canceled`;
- business restriction: cancellation only while the order has not been delivered;

The SUT README / FR-10 clarifies:

- user cancellation is valid from `pending` and `confirmed`;
- user cancellation is invalid from `shipping`;
- `delivered` and `canceled` are final states;
- invalid transitions must return an error with an appropriate message.

The current sources do **not** define an exact response JSON schema for the selected cancel endpoint.

---

## 2. Success response — known vs unresolved

### Contract-backed facts

For a successful cancel request on an owned `pending` or `confirmed` order:

```text
before: pending/confirmed
action: PUT /api/orders/:id/cancel
after: canceled
```

The strongest success oracle is therefore **state transition**, not a guessed response field.

### UNRESOLVED success details

The supplied contract does not define:

- exact success HTTP status (`200`, `204`, etc.);
- whether the response is JSON, empty, or another body shape;
- whether it contains `message`;
- whether it returns the updated order;
- whether returned order fields include `id`, `status`, `user_id`, etc.;
- exact `Content-Type` header.

Therefore AI-generated tests must not assert invented success JSON such as:

```json
{"message":"Order canceled successfully"}
```

unless later runtime/source evidence establishes that as a stable contract.

---

## 3. Invalid state response

Invalid user cancellation applies to:

```text
shipping
delivered
canceled
```

Contract-backed response behavior:

- request is rejected as an invalid transition;
- an appropriate error/message must be returned;
- order state remains unchanged.

### UNRESOLVED invalid-state details

Do not invent:

- exact status `400`, `403`, or `409`;
- exact error field name (`error`, `message`, `detail`);
- exact wording;
- error-code enum;
- exact JSON nesting.

For test generation, preferred expectation wording is:

```text
Expected Status: UNRESOLVED — must represent rejection, not success.
Expected Response: error response appropriate to invalid transition.
State After: unchanged.
```

At execution time, actual status/body can be characterized from real evidence.

---

## 4. Authentication failure response

For missing/invalid JWT, SEC-02 provides a strong authorization oracle:

```text
request must not be authenticated
order must not be mutated
```

The current contract does not define exact authentication error schema.

UNRESOLVED:

- `401` vs another rejection status;
- JSON vs text body;
- exact message;
- WWW-Authenticate behavior.

Schema tests must not hard-code these without source/runtime basis.

---

## 5. Ownership/BOLA response

For the Human Gate A-approved risk-based case:

```text
User A token
+
User B pending/confirmed order
```

Strong security oracle:

```text
User A cannot mutate User B order
state remains unchanged
```

The expected rejection status/body is intentionally `UNRESOLVED` because ownership is being tested as a risk-based authorization expectation rather than a direct FR-10 response contract.

Do not force `403` or `404` as the expected response.

---

## 6. Non-existing / malformed `:id` response

The contract gives no exact rules for:

- non-existing ID;
- `0`;
- negative ID;
- non-numeric ID;
- decimal-like ID;
- large ID;
- encoded/path-special input.

Response analysis for these cases should be characterization-oriented.

Minimum safe oracle:

- no unrelated order mutation;
- no unauthorized state transition;
- response/status recorded exactly as observed.

Exact status/schema remains unresolved.

---

## 7. Unexpected body/query response

The documented cancel request has no body and no query parameters.

For unexpected inputs such as:

```json
{"status":"delivered"}
```

or:

```text
?status=delivered
?user_id=...
?id=...
```

there are two acceptable implementation strategies from a contract perspective:

1. reject unsupported input; or
2. ignore unsupported input while still performing only the documented cancel operation.

What is **not** acceptable:

- undocumented input changes the target order;
- client-selected `status` overrides the state machine;
- user/owner values alter authorization;
- query `id` overrides the path resource unexpectedly.

Therefore response status alone is not the primary oracle; state/authorization integrity is.

---

## 8. Schema testing strategy

Because the exact cancel response schema is undocumented, use three schema layers.

### Layer S1 — Contract-backed state/result schema

This is mandatory.

Validate via follow-up order retrieval or other documented state evidence:

- target order remains the same resource;
- successful cancel results in `status = canceled`;
- invalid/security attempts leave state unchanged.

### Layer S2 — Runtime response characterization

During real execution record:

- HTTP status;
- Content-Type;
- whether body is empty/text/JSON;
- top-level keys;
- primitive types;
- representative success/error shape.

This is evidence collection, not automatically a contract assertion.

### Layer S3 — Stable runtime schema regression

Only after a human reviews S2 and decides the observed shape should be treated as stable may later tests assert it as a regression expectation.

Do not silently turn one observed runtime response into a specification requirement.

---

## 9. Suggested schema candidate tests

| Schema ID | Scenario | Assertion level | Expected basis |
| --- | --- | --- | --- |
| SCH-01 | Successful cancel from pending | S1 mandatory | Follow-up state = `canceled` |
| SCH-02 | Successful cancel from confirmed | S1 mandatory | Follow-up state = `canceled` |
| SCH-03 | Shipping cancel rejected | S1 mandatory | State remains `shipping`; error response observed |
| SCH-04 | Delivered cancel rejected | S1 mandatory | State remains `delivered`; error response observed |
| SCH-05 | Repeated cancel | S1 mandatory | State remains `canceled`; error response observed |
| SCH-06 | Missing JWT | S1 mandatory | State unchanged; authentication rejection observed |
| SCH-07 | Cross-user pending order | S1 mandatory | Other user's state unchanged |
| SCH-08 | Success runtime shape | S2 characterization | Record actual status/content-type/body shape |
| SCH-09 | Invalid-state runtime shape | S2 characterization | Record actual error status/body shape |
| SCH-10 | Auth-error runtime shape | S2 characterization | Record actual authentication error shape |
| SCH-11 | Non-existing-ID runtime shape | S2 characterization | Record actual result without invented `404` |
| SCH-12 | Malformed-ID error handling | S2/security observation | Record status/body and disclosure indicators |

---

## 10. State verification dependency

For FR-10, response-only assertions are insufficient for many important tests.

Example:

```text
PUT /api/orders/123/cancel
→ HTTP 200
```

is not enough to prove correct behavior.

The suite should verify the order afterward using a documented read endpoint where possible:

```http
GET /api/orders/:id
```

and confirm the resulting state/ownership information available through the real response.

For invalid/security tests, before/after state comparison is especially important because an error-looking response could still accompany unintended mutation.

Step J must ensure the read endpoint and real actor/order fixtures are available before official execution.

---

## 11. Content-Type policy

The contract does not mandate a precise response Content-Type for this endpoint.

During execution:

- record the actual header;
- if body parses as JSON, characterize the JSON shape;
- if the server returns HTML/plain-text error pages, record them as observed evidence;
- do not classify Content-Type alone as a defect unless a source-backed requirement is identified.

If an error page exposes DB/stack details, preserve it as a security observation and evaluate it at Gate G/H with the relevant requirement basis.

---

## 12. Error-message policy

FR-10 requires an "appropriate message" for invalid transitions, but does not define exact text.

Therefore an invalid-state test may assert semantically that:

- an error response exists; and
- the response does not falsely claim successful cancellation.

Exact string equality is not justified at design time.

During Gate G, human review may evaluate whether a real message is sufficiently appropriate in context.

---

## 13. AI testcase-generation rules carried into Step F

When generating ≥35 AI cases, enforce these rules:

1. Never invent exact success/error HTTP codes unless traceable to a source.
2. Never invent exact success/error JSON schemas.
3. Use `UNRESOLVED` explicitly for undocumented response details.
4. Use state transition/state preservation as the primary oracle.
5. Use follow-up `GET /api/orders/:id` where needed to verify mutation.
6. Distinguish contract-backed schema assertions from runtime characterization.
7. Cross-user response code remains unresolved; ownership mutation is the security oracle.
8. Injection/malformed input errors do not automatically indicate a defect.
9. Any later stable-schema assertion must be based on reviewed real evidence, not AI assumption.

---

## 14. Human schema/response checkpoint

Please review before AI testcase generation:

1. Accept **state verification as the primary response oracle** for FR-10.
2. Keep exact success HTTP status and success JSON schema `UNRESOLVED`.
3. Keep invalid-state/auth/ownership exact status and JSON schema `UNRESOLVED`.
4. Use follow-up order retrieval for before/after verification when possible.
5. Allow runtime response-shape tests as `CHARACTERIZATION`, not contract assertions.
6. Do not report HTML/text error shape or Content-Type differences as standalone defects without requirement basis.
7. Treat FR-10's "appropriate error message" semantically rather than requiring exact string equality.
8. After this checkpoint is approved, proceed to AI testcase generation while preserving all `UNRESOLVED` boundaries.
