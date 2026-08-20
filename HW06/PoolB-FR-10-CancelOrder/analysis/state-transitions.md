# FR-10 Cancel Order — State Transition Analysis

Date: 2026-08-20  
API: `PUT /api/orders/:id/cancel`  
Primary requirement: FR-10 — Order State Machine  
Gate A: **APPROVED**  
Gate B: **APPROVED**  
Human Gate C status: **APPROVED**

## 1. Documented order states

FR-10 defines five states:

```text
pending
confirmed
shipping
delivered
canceled
```

Documented global state machine:

```text
pending ──Admin confirm──> confirmed ──Admin ship──> shipping ──Admin complete──> delivered
   │                          │
   └──User/Admin cancel──> canceled
                              ▲
confirmed ──User/Admin cancel─┘
```

Final states:

```text
delivered
canceled
```

Both are terminal: no further transition is allowed.

---

## 2. Scope of the selected API

The selected API under direct test is:

```http
PUT /api/orders/:id/cancel
```

This is the user-facing cancel operation. For this endpoint, the contract-backed state behavior is:

```text
pending   --cancel--> canceled   VALID
confirmed --cancel--> canceled   VALID
shipping  --cancel--> rejected   INVALID for User
delivered --cancel--> rejected   INVALID
canceled  --cancel--> rejected   INVALID / repeated final-state action
```

The documented admin endpoint for other state changes is:

```http
PUT /api/admin/orders/:id/status
```

Admin state transitions may be used later for fixture preparation/reset, but they are not silently treated as behavior of the selected user cancel endpoint.

---

## 3. Core transition matrix

| Transition ID | From | Action | Actor | Expected To | Valid? | Basis |
| --- | --- | --- | --- | --- | --- | --- |
| ST-01 | `pending` | cancel | owning User | `canceled` | YES | FR-10 + FR-20 |
| ST-02 | `confirmed` | cancel | owning User | `canceled` | YES | FR-10 + FR-20 |
| ST-03 | `shipping` | cancel | owning User | `shipping` unchanged | NO | FR-10 explicitly forbids User self-cancel after shipping |
| ST-04 | `delivered` | cancel | owning User | `delivered` unchanged | NO | FR-10 final-state rule |
| ST-05 | `canceled` | cancel | owning User | `canceled` unchanged | NO | FR-10 final-state rule |

Invalid transitions must return an error with an appropriate message, but exact status code/message schema remain `UNRESOLVED`.

---

## 4. Semantic transition boundary

The most important FR-10 state boundary for the user cancel API is:

```text
confirmed  -> cancel allowed
shipping   -> cancel forbidden for User
```

This should be tested as a paired state-boundary scenario using controlled orders so that the only meaningful difference is the current state.

Why this matters:

- it verifies the state machine itself rather than only endpoint availability;
- it catches implementations that use an overly broad rule such as `status != delivered`;
- it catches implementations that allow cancellation too late in fulfillment.

---

## 5. Repeated-operation sequences

### SEQ-01 — Valid cancel followed by repeated cancel

```text
pending
  ↓ cancel
canceled
  ↓ cancel again
canceled
```

Expected:

1. first cancel is valid;
2. second cancel is an invalid transition because `canceled` is final;
3. second call must not produce another state change;
4. exact error status/body remains `UNRESOLVED`.

### SEQ-02 — Confirmed cancel followed by repeated cancel

Same oracle as SEQ-01, beginning from `confirmed`.

This is not assumed to be idempotent success. FR-10 explicitly defines `canceled` as terminal and says invalid transitions must return an error.

---

## 6. Invalid-attempt state preservation

For every rejected cancel attempt, the postcondition should preserve the original state.

| Case | State before | Attempt | Expected state after |
| --- | --- | --- | --- |
| PRES-01 | shipping | User cancel | shipping |
| PRES-02 | delivered | User cancel | delivered |
| PRES-03 | canceled | User cancel | canceled |
| PRES-04 | pending/confirmed | unauthenticated cancel | unchanged |
| PRES-05 | User B order | User A cancel | unchanged — risk-based authorization expectation |
| PRES-06 | valid state | malformed/non-existing target ID | no unrelated order changes |

This is a stronger oracle than checking only HTTP status because the contract is primarily about allowed state transitions.

---

## 7. Authentication and state interaction

Authentication failure should block the transition before state mutation.

### AUTH-STATE-01

```text
pending + no valid JWT
        ↓ cancel
pending unchanged
```

### AUTH-STATE-02

```text
confirmed + malformed/tampered JWT
          ↓ cancel
confirmed unchanged
```

Exact authentication error codes are not invented. The observable requirement is that invalid authentication must not cause the cancel transition.

---

## 8. Ownership and state interaction

Gate A approved the following risk-based authorization expectation:

> User A must not cancel an order owned by User B.

This is not presented as direct FR-10 wording.

### OWN-01

```text
User B order = pending
User A authenticated
       ↓ cancel by ID
pending unchanged
```

### OWN-02

```text
User B order = confirmed
User A authenticated
       ↓ cancel by ID
confirmed unchanged
```

These are especially important because `pending` and `confirmed` are otherwise valid cancel states. A flawed implementation that checks only state but not ownership could incorrectly permit the transition.

### OWN-03

Other-user order already in `shipping`, `delivered`, or `canceled` should also remain unchanged. However, such cases are lower-value for proving IDOR because the state rule alone already blocks cancellation. The strongest ownership evidence comes from cross-user orders in a state that would be cancellable by the rightful owner.

---

## 9. State setup sequences for later Step J

To test FR-10 reproducibly, Step J should prepare dedicated orders rather than mutate one shared order across the whole suite.

Recommended fixture model:

```text
Order P1: User A, pending
Order P2: User A, pending          -> disposable valid-cancel case
Order C1: User A, confirmed
Order C2: User A, confirmed       -> disposable valid-cancel case
Order S1: User A, shipping
Order D1: User A, delivered
Order X1: User A, canceled
Order OP1: User B, pending
Order OC1: User B, confirmed
```

Reason for separate fixtures:

- valid cancel mutates state irreversibly to `canceled`;
- repeated-cancel needs a known first transition;
- cross-user authorization needs an otherwise cancellable order;
- parallel tests should not accidentally depend on execution order.

If fixture creation is expensive, the suite may use setup/reset through documented APIs, but official execution must remain reproducible.

---

## 10. Admin fixture transitions

The admin endpoint may be used to establish specific states:

```http
PUT /api/admin/orders/:id/status
```

Documented statuses:

```text
pending
confirmed
shipping
delivered
canceled
```

However, fixture preparation must respect FR-10 rather than blindly forcing impossible transitions if the SUT API itself enforces the state machine.

Preferred setup strategy later:

1. create/checkout a disposable order;
2. use documented admin transition path to reach `confirmed`, `shipping`, or `delivered`;
3. verify state before the FR-10 testcase;
4. run cancel attempt;
5. verify post-state;
6. reset/recreate as needed.

Do not use direct database mutation for official evidence unless the assignment/source explicitly permits it.

---

## 11. State-oriented malformed-input behavior

Unexpected body/query values such as:

```json
{"status":"delivered"}
```

or:

```text
?status=delivered
```

must not transform the cancel endpoint into a generic state-update operation.

State-integrity expectation:

```text
selected operation = cancel
allowed target state = canceled only
```

The client must not be able to use undocumented input to force:

```text
pending -> delivered
confirmed -> pending
shipping -> pending
...
```

Exact rejection/ignore behavior is `UNRESOLVED`; the critical oracle is that no unauthorized alternative state transition occurs.

---

## 12. Non-existing/malformed target and global state preservation

For malformed/non-existing `:id`, the suite should verify not only the response but also that no known fixture order changes unexpectedly.

Examples:

```text
PUT /api/orders/999999999/cancel
PUT /api/orders/abc/cancel
PUT /api/orders/-1/cancel
```

Expected:

- no unrelated order is transitioned to `canceled`;
- no exact error status is invented unless later source evidence defines one.

This protects against parser/coercion mistakes such as malformed IDs resolving to an unintended record.

---

## 13. Concurrency / race-condition analysis

FR-10 does not explicitly define concurrency semantics, but the state machine creates a meaningful race risk.

### RACE-01 — cancel vs admin ship from `confirmed`

Starting state:

```text
confirmed
```

Concurrent actions:

```text
User:  cancel
Admin: shipping transition
```

Acceptable final state should be one state resulting from a valid serialized transition order, not a contradictory/corrupted state.

Potential serialized outcomes:

```text
cancel wins first  -> canceled; later ship should be invalid
ship wins first    -> shipping; later User cancel should be invalid
```

Because the contract does not explicitly define transaction/concurrency guarantees, this should be treated as a **risk-based concurrency characterization** unless the human reviewer chooses to include it in the final suite.

### RACE-02 — duplicate simultaneous cancel from `pending`

Two concurrent User cancel requests against the same pending order.

Desired invariant:

- final state is `canceled`;
- no duplicate/corrupt side effect;
- one request may succeed while the other observes final-state rejection depending on serialization.

Exact response combination is `UNRESOLVED`.

Concurrency tests may be omitted from official FR-10 execution if Postman/Newman implementation would make them nondeterministic or non-reproducible; if omitted, record the reason.

---

## 14. State coverage priorities

### Mandatory high-value coverage

1. pending -> canceled
2. confirmed -> canceled
3. shipping -> reject/unchanged
4. delivered -> reject/unchanged
5. canceled -> reject/unchanged
6. cancel twice sequence
7. unauthenticated valid-state order -> unchanged
8. cross-user pending order -> unchanged
9. cross-user confirmed order -> unchanged
10. attempted body/query state override -> cannot force another transition

### Optional/risk-based coverage

11. malformed/non-existing IDs with global-state preservation
12. cancel vs admin-ship race
13. duplicate simultaneous cancel

---

## 15. Preliminary testcase seeds from the state model

These are **coverage seeds only**, not final testcase records yet.

```text
STATE-SEED-01 pending own order cancel succeeds
STATE-SEED-02 confirmed own order cancel succeeds
STATE-SEED-03 shipping own order cancel rejected
STATE-SEED-04 delivered own order cancel rejected
STATE-SEED-05 canceled own order repeated cancel rejected
STATE-SEED-06 pending cancel then second cancel rejected
STATE-SEED-07 confirmed cancel then second cancel rejected
STATE-SEED-08 unauthenticated pending cancel does not mutate
STATE-SEED-09 User A vs User B pending order does not mutate
STATE-SEED-10 User A vs User B confirmed order does not mutate
STATE-SEED-11 attempted status override does not create alternate transition
STATE-SEED-12 malformed target ID does not mutate known orders
STATE-SEED-13 cancel vs shipping race characterization
STATE-SEED-14 simultaneous duplicate cancel characterization
```

AI testcase generation will happen only after the remaining analysis gates are reviewed.

---

## 16. Human Gate C review checklist

Please review before Step D:

1. Approve the five-state transition matrix ST-01..05.
2. Approve repeated cancel as an **invalid second transition**, not idempotent success.
3. Approve state-preservation as the primary oracle for rejected attempts.
4. Approve cross-user ownership tests mainly on `pending`/`confirmed` because those isolate authorization from state rejection.
5. Approve use of the documented admin status endpoint for fixture preparation only, not as behavior of the selected cancel endpoint.
6. Approve attempted body/query `status` override as a state-integrity risk test.
7. Decide whether concurrency cases RACE-01/RACE-02 should remain optional characterization or be mandatory in the final FR-10 suite.
