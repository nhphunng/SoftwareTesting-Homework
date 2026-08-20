# HW06 — API Selection Confirmation

## 1. Selection status

The three APIs were assigned before Phase 3 and are treated as fixed for this homework unless an official reassignment occurs.

Phase 3 therefore performs **verification and documentation**, not a new selection exercise.

Selected set:

| API | Pool | FR | Feature | Method | Endpoint |
| --- | --- | --- | --- | --- | --- |
| API 1 | A | FR-05 | Product listing/search | GET | `/api/products?search=keyword` |
| API 2 | B | FR-10 | Cancel order | PUT | `/api/orders/:id/cancel` |
| API 3 | C | FR-16 | Import products | POST | `/api/admin/import-products` |

Constraint check:

- [x] Exactly one API from Pool A.
- [x] Exactly one API from Pool B.
- [x] Exactly one API from Pool C.
- [x] No Pool D API selected.
- [x] The three selected endpoints exist in `api_specification.md`.
- [x] The three selected routes exist in `backend/server.js`.

The assignment-level requirement that no group member use the exact same three-API combination remains a **human/group coordination assertion**. This report records the assigned combination but does not fabricate evidence about other group members' selections.

## 2. Source-handling rule

Human Gate A selected **Option B** in Phase 2:

1. `README.md` = business truth / expected business behavior.
2. `api_specification.md` = API interface contract.
3. `backend/server.js` + runtime = implementation / actual behavior.

Therefore Phase 3 verifies each selected API across both the business requirement and API contract instead of forcing conflicting sources into one interpretation.

Labels used below:

- `REQUIREMENT`
- `API CONTRACT`
- `UNRESOLVED / CONFLICT`
- `IMPLEMENTATION OBSERVATION`

`CONFIRMED DEFECT` is reserved for later runtime reproduction plus human confirmation.

---

# 3. API 1 — Pool A — FR-05 Product Search

## 3.1 Verified identity

```text
Feature: Product listing and search
Pool: A
FR: FR-05
Method: GET
Endpoint: /api/products
Query: ?search=keyword (optional)
Authentication: Public
```

### REQUIREMENT

FR-05 states that:

- products can be listed;
- search is by product name;
- user-provided search text must be displayed safely on the UI;
- an empty result must have an appropriate empty state;
- loading state and other UI requirements also apply to the web page.

SEC-05 is directly relevant to database query construction. SEC-04 is relevant to how user input is rendered on the UI, but UI rendering must not be confused with API response validation.

### API CONTRACT

`api_specification.md` defines:

```http
GET /api/products
GET /api/products?search=keyword
```

The `search` query parameter is optional and searches products by name.

Exact success/error status codes and a formal response schema are not specified.

### IMPLEMENTATION OBSERVATION

The route exists in `backend/server.js` and reads `req.query.search`.

Static inspection shows that the search value is interpolated into a SQL string rather than passed as a parameterized value. This is a high-priority security test target, but it is **not yet a confirmed defect**.

## 3.2 Why this API is suitable for the assignment

Strong test-design dimensions:

- query-parameter domain partitioning;
- missing/empty/whitespace search;
- normal, partial, Unicode, special-character and no-result searches;
- injection-oriented cases under SEC-05;
- response-list consistency;
- API contract vs business/UI behavior separation.

Potential limits:

- no explicit state machine;
- exact status/error/schema details are partially `UNRESOLVED`.

## 3.3 Phase 3 verification result

**CONFIRMED FOR TESTING**

---

# 4. API 2 — Pool B — FR-10 Cancel Order

## 4.1 Verified identity

```text
Feature: Cancel order
Pool: B
FR: FR-10
Method: PUT
Endpoint: /api/orders/:id/cancel
Authentication: JWT required
Actor: User for this endpoint
```

### REQUIREMENT

FR-10 defines the order state machine:

```text
pending   → confirmed → shipping → delivered
   │           │
   └───────────┴────────→ canceled
```

For user cancellation:

- `pending → canceled` = valid;
- `confirmed → canceled` = valid;
- `shipping → canceled` = invalid for User;
- `delivered` and `canceled` are final states.

FR-11 ownership rules are also relevant because users must only access their own orders.

SEC-02 applies because the endpoint is authenticated.

### API CONTRACT

`api_specification.md` defines:

```http
PUT /api/orders/:id/cancel
Authorization: Bearer <token>
```

It states that cancellation changes the order status to `canceled` and is only allowed while the order has not yet been delivered/shipped, but the wording is less precise than the FR-10 state machine.

Exact success/error status codes and formal response schemas are not specified.

### UNRESOLVED / CONFLICT

The API specification's phrase "chỉ được thực hiện khi đơn hàng chưa giao" is less precise than the business state machine.

By Option B, the precise FR-10 business state machine is the expected business behavior. The API wording remains a documentation ambiguity rather than replacing FR-10.

### IMPLEMENTATION OBSERVATION

The route exists and requires JWT authentication. The lookup scopes the order by both order ID and authenticated `user_id`.

Static inspection shows the implementation rejects cancellation only for `delivered` and `canceled`; `shipping` therefore appears cancelable by User. This conflicts with FR-10 but remains an implementation observation until runtime verification.

## 4.2 Why this API is suitable for the assignment

Strong test-design dimensions:

- path-parameter partitions for `id`;
- state-transition testing;
- valid and invalid transitions;
- repeated cancellation;
- terminal states;
- authentication;
- ownership / IDOR;
- state-before/state-after validation;
- strong deterministic business expectations from FR-10.

## 4.3 Phase 3 verification result

**CONFIRMED FOR TESTING**

---

# 5. API 3 — Pool C — FR-16 Import Products

## 5.1 Verified identity

```text
Feature: Import products
Pool: C
FR: FR-16
Method: POST
Endpoint: /api/admin/import-products
Business role: Admin
Authentication: JWT required
```

### REQUIREMENT

FR-16 defines product import as a CSV-based operation:

- uploaded file must have `.csv` extension;
- header must be exactly `name,price,description,imageUrl,category_id`;
- quoted fields containing commas must follow RFC 4180 behavior;
- `name` must not be empty;
- `price` must be positive;
- if any row is invalid, the complete import must rollback (all-or-nothing);
- the system must clearly report successes/errors and reasons.

FR-12 requires all `/api/admin/*` APIs to validate both a JWT and `role = 'admin'`.

SEC-02 and SEC-03 are directly applicable.

### API CONTRACT

`api_specification.md` defines:

```http
POST /api/admin/import-products
Authorization: Bearer <token>
Content-Type: application/json
```

with a body shaped as:

```json
{
  "products": [
    {
      "name": "SP 1",
      "price": 10000,
      "description": "Mô tả 1",
      "imageUrl": "",
      "category_id": 1
    }
  ]
}
```

The specification heading calls this `CSV (JSON Array)`, but the actual API interface shown is JSON rather than file upload.

### UNRESOLVED / CONFLICT

This is the main Phase 2/3 contract conflict:

```text
Business requirement:
CSV upload + RFC4180 + validation + atomic rollback

API contract:
JSON { products: [...] }
```

Option B means both dimensions must be preserved:

- **API Contract Tests** verify the documented JSON endpoint behavior.
- **Business Compliance Tests** verify the FR-16 validation and atomicity expectations wherever they can be exercised through the actual interface/workflow.

The conflict itself must not be silently rewritten.

### IMPLEMENTATION OBSERVATION

The route exists and accepts JSON `products` rows.

Static inspection shows:

- JWT authentication is present;
- no explicit admin-role check is visible;
- missing `name` is checked;
- explicit `price > 0` validation is not visible;
- rows are inserted individually;
- errors are collected while successful rows may remain inserted;
- no transaction/rollback is visible.

These are high-priority runtime verification targets, not confirmed defects yet.

## 5.2 Why this API is suitable for the assignment

Strong test-design dimensions:

- authentication and authorization;
- role escalation;
- request/body structure;
- batch input partitions;
- row validation;
- malformed/partial data;
- atomicity/rollback;
- result summary/error reporting;
- business-vs-contract conflict testing;
- SEC-02/SEC-03 coverage.

## 5.3 Phase 3 verification result

**CONFIRMED FOR TESTING**

---

# 6. Selection rationale summary

| API | Domain/Boundary | State | Security | Schema/Contract | Business Determinism | Overall |
| --- | --- | --- | --- | --- | --- | --- |
| FR-05 Product Search | Strong | N/A | Strong (SEC-05) | Moderate | Strong for search semantics | Good Pool A choice |
| FR-10 Cancel Order | Strong | Very strong | Strong | Moderate | Very strong | Good Pool B choice |
| FR-16 Import Products | Very strong | Batch/transaction state | Very strong | Strong but conflicting | Strong for validation/atomicity | Good Pool C choice |

Together the three APIs provide complementary coverage:

```text
FR-05 → query/domain/security
FR-10 → state/ownership/authentication
FR-16 → batch validation/authorization/atomicity/contract conflict
```

This gives better methodological diversity than selecting three APIs with similar CRUD behavior.

# 7. Human Selection Gate

Phase 3 verification status:

```text
API 1 / Pool A / FR-05  VERIFIED
API 2 / Pool B / FR-10  VERIFIED
API 3 / Pool C / FR-16  VERIFIED
```

The assigned combination is therefore ready for the per-API testing pipeline.

The following still require later human/runtime evidence and are **not** resolved by Phase 3:

- whether the exact three-API combination duplicates another group member's combination;
- runtime behavior of static mismatch candidates;
- exact unspecified HTTP statuses/response schemas;
- confirmed defect status for any implementation mismatch.
