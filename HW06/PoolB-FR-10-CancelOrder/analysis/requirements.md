# FR-10 Cancel Order — Requirement Extraction

Date: 2026-08-20  
API under test: `PUT /api/orders/:id/cancel`  
Pool: B  
Primary requirement: FR-10 — Order State Machine  
Human Gate A status: **APPROVED**

Gate A decision: cross-user cancellation is included as a **risk-based authorization expectation**: User A must not be able to cancel an order owned by User B. This expectation is intentionally not presented as direct FR-10 wording.

## Sources

1. `source/api_specification.md`
2. EShop SUT `README.md`, especially FR-10, FR-18, FR-20, and SEC-01..SEC-07
3. `plan.md`
4. `.agents/skills/api-testing-human-loop/SKILL.md`
5. `.agents/skills/api-testing-human-loop/references/workflow-gates.md`
6. `.agents/skills/api-testing-human-loop/references/testcase-evidence-contract.md`

## 1. Endpoint contract

| Item | Extracted requirement | Source basis |
| --- | --- | --- |
| Feature | Cancel order | FR-10 / API specification |
| Method | `PUT` | API specification §4.6 |
| Endpoint | `/api/orders/:id/cancel` | API specification §4.6 |
| Path parameter | `id` — order identifier | Endpoint path |
| Authentication | `Authorization: Bearer <token>` required for Cart & Orders APIs | API specification §4 |
| Request body | No request body documented for cancel endpoint | API specification §4.6 |
| Success operation | Change the order status to `canceled` | API specification §4.6 |
| Required project header | `X-Student-Id: 23127194` on every executed request | HW06 project constraint |

## 2. Order states

FR-10 defines exactly five documented order states:

```text
pending
confirmed
shipping
delivered
canceled
```

Documented state graph:

```text
pending ──Admin confirm──> confirmed ──Admin ship──> shipping ──Admin complete──> delivered
   │                          │
   └──User/Admin cancel──> canceled
                              ▲
confirmed ──User/Admin cancel─┘
```

## 3. Cancel rules for the user-facing cancel API

| Current state | User cancel via `PUT /api/orders/:id/cancel` | Expected state after valid cancel | Requirement basis |
| --- | --- | --- | --- |
| `pending` | Allowed | `canceled` | FR-10 state graph; FR-20 clarification |
| `confirmed` | Allowed | `canceled` | FR-10 state graph; FR-20 clarification |
| `shipping` | Not allowed for User | unchanged | FR-10 explicitly says User cannot self-cancel once shipping |
| `delivered` | Not allowed | unchanged | FR-10 final-state rule |
| `canceled` | Not allowed | unchanged | FR-10 final-state rule |

FR-20 explicitly restates the mobile/user-facing cancel behavior as: cancel is allowed only when the order is `pending` or `confirmed`.

## 4. Invalid-transition behavior

FR-10 states:

> Every invalid transition must return an error with an appropriate message.

The exact HTTP status code and exact error JSON/message text are **UNRESOLVED** by the supplied contract.

Testing consequence:

- tests may assert that an invalid transition is rejected and the state remains unchanged;
- tests must not invent a mandatory `400`, `403`, `409`, or exact error-message string unless another source defines it;
- actual status/body should be characterized during real execution.

## 5. Authentication and authorization

### 5.1 Authentication

The API specification places order APIs under the requirement:

```http
Authorization: Bearer <token>
```

Therefore an unauthenticated request to this cancel endpoint is expected to be rejected.

Applicable security requirement:

- `SEC-02` — security-sensitive APIs must require a valid JWT token.

### 5.2 Ownership / cross-user authorization

FR-11 states users may view only their own orders. The selected FR-10 cancel endpoint is user-facing, but the supplied source does **not explicitly state** in one sentence that a user may cancel only their own order.

This is a material security/authorization question because `PUT /api/orders/:id/cancel` takes an arbitrary order ID.

Status: **ACCEPTED AT HUMAN GATE A AS A RISK-BASED AUTHORIZATION EXPECTATION.**

The suite will test that User A cannot cancel User B's order, while preserving the distinction that this expectation is not direct FR-10/API-spec wording.

### 5.3 Admin behavior

FR-10 state graph says User/Admin may cancel from `pending` and `confirmed`, and only Admin may act after the order reaches `shipping`.

However, the documented admin order-management API is:

```text
PUT /api/admin/orders/:id/status
```

not `PUT /api/orders/:id/cancel`.

Therefore admin cancellation through the **selected user-facing cancel endpoint** is **UNRESOLVED / OUTSIDE PRIMARY API CONTRACT**. Admin state transitions should be tested against the documented admin endpoint when relevant, not assumed for this endpoint.

## 6. Path parameter `id`

The API contract documents an order ID in the path but does not define:

- numeric type explicitly;
- minimum value;
- maximum value;
- UUID vs integer grammar;
- behavior for zero/negative IDs;
- behavior for non-numeric IDs;
- behavior for missing/empty ID;
- exact response for a non-existing ID.

These are testable robustness/domain cases, but expected exact status codes remain **UNRESOLVED** unless supported by another source.

## 7. Request body and unexpected input

No body is documented for `PUT /api/orders/:id/cancel`.

Potential characterization/risk tests may include:

- empty body;
- unexpected JSON fields;
- attempted `status` override;
- malformed JSON;
- unexpected query parameters.

The contract does not explicitly define rejection semantics for these inputs. They must not be given invented exact outcomes. Security-sensitive fields should be evaluated according to whether they actually influence the state transition.

## 8. Response contract

The supplied API specification does not define the exact response body/schema for cancel success or failure.

Status: **UNRESOLVED** for:

- exact success status code;
- exact error status codes;
- success message field/name;
- returned order object vs message-only response;
- error JSON schema;
- Content-Type requirements beyond normal API characterization.

Schema tests should therefore distinguish:

- contract-backed state/result behavior; and
- runtime characterization of actual response shape.

## 9. State invariants

Contract-backed invariants:

1. A valid cancel from `pending` results in `canceled`.
2. A valid cancel from `confirmed` results in `canceled`.
3. `delivered` is final and must not transition to another state.
4. `canceled` is final and must not transition to another state.
5. A User cannot self-cancel from `shipping`.
6. Invalid transitions must be rejected with an appropriate error.
7. Failed/invalid cancel attempts must not change the order into an unauthorized state.

Additional risk-based invariant approved at Gate A:

8. A user must not be able to cancel another user's order by changing `:id` — **RISK-BASED AUTHORIZATION EXPECTATION; not direct FR-10 wording.**

## 10. Applicable security mapping — preliminary

| Security requirement | Applicability to FR-10 cancel API | Basis |
| --- | --- | --- |
| SEC-01 Password storage | Not applicable | No password operation |
| SEC-02 Valid JWT required | Applicable | Authenticated order API |
| SEC-03 Admin role check | Not directly applicable to selected user cancel endpoint | Selected endpoint is not `/api/admin/*` |
| SEC-04 UI escaping | Not applicable to API-only cancel behavior | No UI rendering under primary API test |
| SEC-05 Parameterized queries | Potentially applicable to order ID/database access | Generic DB security rule; specific exploitation expectations require later security analysis |
| SEC-06 Profile role mass assignment | Not applicable | Not profile update |
| SEC-07 Reset OTP | Not applicable | No password reset |

Ownership/BOLA/IDOR remains a separate authorization risk even though it is not assigned a dedicated SEC number in SEC-01..07.

## 11. Project-specific testing constraints

For FR-10, the HW06 flow requires:

- at least 35 AI-generated testcase records;
- every AI testcase human-audited with `VALID / INVALID / INCOMPLETE`;
- at least 5 genuinely human-authored additions after AI coverage review;
- Postman implementation;
- runtime-state preparation using real orders and authenticated actors;
- real Newman execution;
- `X-Student-Id: 23127194` on every request;
- Human Gate G before defect classification;
- Human Gate H before genuine bug reporting;
- compact Step K execution summaries should be used by AI by default instead of ingesting full Newman raw reports.

## 12. Runtime data implications for later Step J

FR-10 will require reproducible real orders in, at minimum:

```text
pending
confirmed
shipping
delivered
canceled
```

Likely actor/data needs:

- authenticated User A token;
- order IDs owned by User A in the required states;
- preferably User B + an order owned by User B if Gate A accepts ownership/IDOR coverage;
- admin token and admin status-update API for fixture preparation/reset only when contractually appropriate;
- setup/reset/cleanup strategy so state-changing tests can be rerun safely.

No IDs, tokens, ownership relationships, or execution states should be fabricated before Step J verifies them against the real SUT.

## 13. Gate A — items requiring human review

Please review and accept/reject these points before Step B:

1. Primary API is `PUT /api/orders/:id/cancel` and requires a valid JWT.
2. User cancellation is contractually allowed only from `pending` and `confirmed`.
3. `shipping`, `delivered`, and `canceled` must reject user cancel; `delivered`/`canceled` are final states.
4. Exact HTTP success/error status codes and exact response schema remain `UNRESOLVED` unless later source evidence defines them.
5. **Ownership/IDOR:** treat “User A must not cancel User B's order” as a required risk-based authorization testcase, while explicitly labeling the expected ownership rule as not directly stated in FR-10/API specification.
6. Do not test admin cancellation through `/api/orders/:id/cancel` as a contract requirement; use `/api/admin/orders/:id/status` only for fixture setup/admin-state behavior when needed.
7. Path-ID malformed/non-existing cases are valid domain/robustness tests, but exact response codes remain `UNRESOLVED` unless source-backed.
