# FR-10 Cancel Order — Human-Authored Test Cases

Date: 2026-08-20  
API: `PUT /api/orders/:id/cancel`  
Step H status: **COMPLETE — 6 HUMAN-authored cases**  
Source provenance: **HUMAN**

## Step H review outcome

The six proposed human-authored cases are accepted for FR-10 Step H. They add coverage not present as an equivalent combined scenario in the 42 AI-generated cases.

Two wording adjustments are applied to preserve contract accuracy:

1. `HUMAN-FR10-044` remains a **risk-based enumeration/information-disclosure expectation**. FR-10 does not explicitly require foreign-order and nonexistent-order responses to be identical.
2. `HUMAN-FR10-048` remains a **risk-based method-confusion expectation**. The API contract documents `PUT`; whether middleware supports method override is not directly specified, so the testcase checks that undocumented override handling does not create unintended cancellation.

Every official execution request must retain `X-Student-Id: 23127194`.

---

## HUMAN-FR10-043 — Cross-user cancellation with forged body owner

| Field | Value |
| --- | --- |
| Source | HUMAN |
| API | `PUT /api/orders/:id/cancel` |
| Category | Security / Ownership / Cross-user |
| Preconditions | User A and User B have valid JWTs and known user IDs; User B owns a dedicated `pending` order. |
| Input | Path: `{userBPendingOrderId}`; User A JWT; raw JSON body `{"user_id":"<User-A-id>"}`. |
| Headers | `X-Student-Id: 23127194`; `Authorization: Bearer {{userAToken}}`; `Content-Type: application/json`. |
| Steps | 1. Read User B's order with an authorized request and confirm `pending`. 2. Send the forged cancellation as User A. 3. Read the same order again using User B's token. |
| Expected Status | The forged request must not result in authorized cross-user cancellation; exact HTTP rejection behavior remains runtime characterization where the contract is silent. |
| Expected Response | Supplying User A's ID in the body must not make User A the owner of User B's order or authorize cancellation. |
| Security Expectation | Authorization must derive ownership from the authenticated identity and target resource, not from a client-controlled body field. This is risk-based BOLA/ownership coverage approved under Gate A. |
| State Before | User B's order is `pending`. |
| State After | User B's order remains `pending`; owner remains User B. |
| Newman Execution | Sequential; use collection/environment variables for both tokens, user IDs, and order ID. |
| Why AI missed this | The AI tested a body `user_id` override on User A's own order and direct cross-user cancellation separately, but did not combine both inputs to test a forged-body ownership bypass. |

---

## HUMAN-FR10-044 — Existing foreign order versus nonexistent order enumeration

| Field | Value |
| --- | --- |
| Source | HUMAN |
| API | `PUT /api/orders/:id/cancel` |
| Category | Security / Ownership / Information disclosure |
| Preconditions | User A has a valid JWT; User B owns a known `pending` order; a plausible nonexistent order ID is available. |
| Input | Request 1 targets `{userBPendingOrderId}`; Request 2 targets `{nonExistingOrderId}`; both use User A's JWT. |
| Headers | `X-Student-Id: 23127194`; `Authorization: Bearer {{userAToken}}`. |
| Steps | 1. Attempt to cancel User B's existing order as User A. 2. Attempt to cancel the nonexistent order with the same token. 3. Normalize dynamic values such as timestamps/request IDs. 4. Compare status, response structure, and error detail. 5. Verify User B's order remains `pending`. |
| Expected Status | Both attempts must not mutate an order. Exact status-code equality is **not** a direct FR-10 contract requirement. |
| Expected Response | The foreign-order response must not expose sensitive order details. Material differences that create a reliable order-existence oracle should be recorded as a **risk-based information-disclosure observation**, not automatically claimed as a direct FR-10 defect. |
| Security Expectation | Assess authenticated order-ID enumeration/BOLA information-disclosure risk while preserving the distinction between risk-based expectation and direct contract. |
| State Before | User B's order is `pending`. |
| State After | User B's order remains `pending`. |
| Newman Execution | Store normalized response characteristics from the first request in collection variables and compare them with the second request. |
| Why AI missed this | The AI verified that User A could not mutate User B's order, but did not compare rejection behavior against a nonexistent ID to look for existence disclosure. |

---

## HUMAN-FR10-045 — Unauthorized attempt followed by rightful-owner cancellation

| Field | Value |
| --- | --- |
| Source | HUMAN |
| API | `PUT /api/orders/:id/cancel` |
| Category | Unusual sequence / Cross-user / State history |
| Preconditions | User B owns a dedicated `confirmed` order; User A and User B have valid JWTs. |
| Input | First cancellation uses User A's token; second cancellation of the same order uses User B's token. |
| Headers | Every request includes `X-Student-Id: 23127194`. |
| Steps | 1. Confirm the order is `confirmed`. 2. Attempt cancellation as User A. 3. Verify it remains `confirmed`. 4. Cancel the same order as User B. 5. Retrieve it again as User B. |
| Expected Status | User A's attempt is semantically unauthorized; User B's subsequent valid request is accepted semantically. Exact HTTP codes remain contract-dependent/runtime-characterized where unresolved. |
| Expected Response | A prior unauthorized attempt must not consume, cache, lock, or otherwise prevent the rightful owner from performing the valid transition. |
| Security Expectation | Failed authorization must have no persistent side effects that weaken or alter later authorized behavior. |
| State Before | `confirmed`. |
| Intermediate State | `confirmed` after User A's attempt. |
| State After | `canceled` after User B's request. |
| Newman Execution | Sequentially preserve the same order ID in a collection variable. |
| Why AI missed this | The AI tested unauthorized cancellation and valid cancellation independently but did not test the state-history dependency between them on the same order. |

---

## HUMAN-FR10-046 — Unsigned JWT using the `none` algorithm

| Field | Value |
| --- | --- |
| Source | HUMAN |
| API | `PUT /api/orders/:id/cancel` |
| Category | Security / Authentication |
| Preconditions | User A owns a dedicated `pending` order; the application uses JWT authentication. |
| Input | `Authorization: Bearer <unsigned-alg-none-token>` containing User A's claimed identity. |
| Headers | `X-Student-Id: 23127194`; `Authorization: Bearer {{algNoneToken}}`. |
| Steps | 1. Confirm the target order is `pending` using a valid token. 2. Send cancellation using the unsigned token. 3. Retrieve the order again using the valid token. |
| Expected Status | Authentication must not be accepted. Exact status code remains runtime characterization unless documented elsewhere. |
| Expected Response | The unsigned token must not be accepted even if its payload contains a valid user ID or familiar claims. If stack traces/JWT-library details appear, record them as supporting security observations. |
| Security Expectation | The server must enforce a signed JWT acceptable under SEC-02; an unsigned `alg:none` token must not authenticate. |
| State Before | `pending`. |
| State After | `pending`. |
| Newman Execution | Generate/store the unsigned token in a pre-request script; no external helper required. |
| Why AI missed this | The AI covered malformed and signature-tampered JWTs but not the structurally valid unsigned-token family. |

### Example Postman token construction

```javascript
function base64url(value) {
  return btoa(JSON.stringify(value))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

const header = base64url({ alg: "none", typ: "JWT" });
const payload = base64url({
  sub: pm.environment.get("userAId"),
  exp: Math.floor(Date.now() / 1000) + 3600
});

pm.variables.set("algNoneToken", `${header}.${payload}.`);
```

---

## HUMAN-FR10-047 — Duplicate JSON keys must not bypass ownership

| Field | Value |
| --- | --- |
| Source | HUMAN |
| API | `PUT /api/orders/:id/cancel` |
| Category | Security / Parser ambiguity / Cross-user |
| Preconditions | User B owns a dedicated `pending` order; User A has a valid JWT; both user IDs are known. |
| Input | User A targets User B's order with raw body `{"user_id":"<User-B-id>","user_id":"<User-A-id>"}`. |
| Headers | `X-Student-Id: 23127194`; `Authorization: Bearer {{userAToken}}`; `Content-Type: application/json`. |
| Steps | 1. Verify User B's order is `pending`. 2. Send the raw duplicate-key body as User A. 3. Retrieve the order using User B's token. |
| Expected Status | The request must not result in authorized cross-user cancellation; exact HTTP behavior is runtime-characterized where unresolved. |
| Expected Response | Differences in first-key/last-key parsing between processing layers must not result in ownership bypass. |
| Security Expectation | Authorization must not depend on ambiguous duplicate JSON fields. This extends the Gate A risk-based ownership expectation. |
| State Before | User B owns an order in `pending`. |
| State After | The order remains `pending`; ownership remains User B. |
| Newman Execution | Use Postman's raw body mode so duplicate keys are preserved exactly in the outgoing request. |
| Why AI missed this | Existing AI cases cover ordinary JSON types and a single ownership field but not duplicate-key interpretation across processing layers. |

---

## HUMAN-FR10-048 — HTTP method-override header must not create unintended cancellation

| Field | Value |
| --- | --- |
| Source | HUMAN |
| API | `POST /api/orders/:id/cancel` with method-override header |
| Category | Security / Unusual request / Method confusion |
| Preconditions | User A owns a dedicated `pending` order and has a valid JWT. |
| Input | Send `POST` to the cancel URL with `X-HTTP-Method-Override: PUT`; no cancellation body. |
| Headers | `X-Student-Id: 23127194`; `Authorization: Bearer {{userAToken}}`; `X-HTTP-Method-Override: PUT`. |
| Steps | 1. Confirm the order is `pending`. 2. Send the POST request carrying the override header. 3. Retrieve the order with the normal authorized GET endpoint. |
| Expected Status | Because the documented contract exposes `PUT`, the POST+override behavior is **runtime characterization**. Regardless of routing response, the undocumented form must not create an unintended cancellation unless such override behavior is explicitly established as supported. |
| Expected Response | A proxy/middleware method-override path must not silently bypass routing, authorization, or state controls. |
| Security Expectation | Assess HTTP method confusion risk without claiming a direct FR-10 requirement that all method-override headers must be rejected. |
| State Before | `pending`. |
| State After | `pending`, unless runtime documentation explicitly establishes method override as a supported equivalent contract (none is currently known). |
| Newman Execution | Standard Postman POST followed by authorized GET verification. Optional `X-Method-Override: PUT` should be a separate iteration, not another testcase. |
| Why AI missed this | The AI assumed the effective HTTP method was the method selected by the client and did not probe middleware-level method override handling. |

---

## Step H coverage contribution

| HUMAN case | New coverage contribution relative to AI set |
| --- | --- |
| HUMAN-FR10-043 | Combines cross-user BOLA with forged body ownership input in the same request. |
| HUMAN-FR10-044 | Compares foreign-existing versus nonexistent target responses for enumeration risk. |
| HUMAN-FR10-045 | Tests state/history side effects of unauthorized attempt followed by rightful-owner success. |
| HUMAN-FR10-046 | Adds JWT `alg:none` structural forgery, distinct from malformed/tampered-signature cases. |
| HUMAN-FR10-047 | Adds duplicate JSON-key parser ambiguity to cross-user authorization. |
| HUMAN-FR10-048 | Adds middleware/method-confusion characterization using method-override headers. |

## Step H conclusion

- Human-authored cases: **6**
- Required minimum: **>=5**
- Provenance: **HUMAN**
- AI-generated cases modified/relabelled as HUMAN: **0**
- Step H: **COMPLETE**
- Next workflow stage: Postman implementation / runtime data preparation according to `plan.md` and the human-loop gates.
