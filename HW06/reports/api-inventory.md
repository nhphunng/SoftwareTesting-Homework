# HW06 — SUT API Inventory

## 1. Inspection scope

Phase 2 inspects the local clone at:

```text
/Users/nguyenhoangphihung/Document/eshop-sut
```

Repository snapshot inspected:

- Remote: `https://github.com/ttbhanh/eshop-sut.git`
- Branch: `main`
- Commit: `85af3ba875c88283615e22cb108f13e2fccaf0e9`
- Backend base URL: `http://localhost:3000`
- Backend stack: Node.js + Express + SQLite

The local clone is not completely clean. At inspection time, `README.md`, SQLite/package-lock/mobile files and local directories had working-tree changes. The inspected `api_specification.md` and `backend/server.js` were not reported as modified. The only `README.md` diff inspected was the local test-user password changing from `Test1234!` to `c`; no functional requirement text was changed by that diff.

## 2. Source hierarchy used for analysis

Three source types are kept separate:

1. `README.md` — explicitly states that it describes the **correct business requirements** used as the testing baseline.
2. `api_specification.md` — documents API methods, endpoint shapes, sample bodies, and selected response details.
3. `backend/server.js` — current implementation inspected statically to confirm route existence and identify implementation observations.

When these sources disagree, this report records the conflict rather than silently reconciling it. Static implementation observations are **not confirmed bugs** until reproduced through real API execution.

### Human Gate A decision — Option B

The tester selected the following source hierarchy for all later phases:

1. `README.md` = **business truth / expected business behavior**.
2. `api_specification.md` = **API interface contract**.
3. `backend/server.js` and runtime behavior = **implementation observation / actual behavior**.

Conflicts are preserved explicitly instead of being merged. Later testcases should distinguish:

- **Business Compliance Tests** — validate behavior against FR/SEC/business rules from `README.md`.
- **API Contract Tests** — validate the documented method/endpoint/request/response contract from `api_specification.md`.

Use these labels consistently in later analysis:

- `REQUIREMENT`
- `API CONTRACT`
- `UNRESOLVED / CONFLICT`
- `IMPLEMENTATION OBSERVATION`
- `CONFIRMED DEFECT` only after real runtime verification and human confirmation.

This decision resolves the Phase 2 source-precedence question without rewriting either specification source.

A verbatim copy of the API specification used for this homework is stored at:

```text
source/api_specification.md
```

## 3. API inventory summary

- Documented routes in `api_specification.md`: **30**
- Routes found in `backend/server.js`: **31**
- Implementation-only route: `POST /api/coupon-usage`
- Authentication mechanism: JWT through `Authorization: Bearer <token>`
- Business role requirement: Admin APIs require valid JWT plus `role = 'admin'` according to FR-12.

Pool mapping used by HW06:

- Pool A: FR-01 → FR-06
- Pool B: FR-07 → FR-11
- Pool C: FR-12 → FR-19

## 4. Endpoint matrix

`Expected Status` is listed only where the API specification states it explicitly. Otherwise it remains `UNRESOLVED` rather than being inferred from Express defaults.

| Pool | FR | Feature | Method | Endpoint | Main Input | Auth | Role | Expected Status | State Change | Implementation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | FR-01 | Register | POST | `/api/register` | JSON: `name,email,password` | No | Public | 200 | User created | Present |
| A | FR-02 | Login | POST | `/api/login` | JSON: `email,password` | No | Public | 200 | Login attempts / lock state | Present |
| A | FR-03 | Forgot password | POST | `/api/forgot-password` | JSON: `email` | No | Public | 200 | Reset token created | Present |
| A | FR-03 | Reset password | POST | `/api/reset-password` | JSON: `email,resetToken,newPassword` | No | Public | UNRESOLVED | Password/reset token | Present |
| A | FR-04 | Read profile | GET | `/api/users/me` | JWT | Yes | User | UNRESOLVED | No | Present |
| A | FR-04 | Update profile | PUT | `/api/users/me` | JSON: `name,shipping_address,phone` | Yes | User | UNRESOLVED | User profile | Present |
| A | FR-05 | Product listing/search | GET | `/api/products` | Optional query `search` | No | Public | UNRESOLVED | No | Present |
| A | FR-06 | Product detail | GET | `/api/products/:id` | Path `id` | No | Public | UNRESOLVED | No | Present |
| C | FR-15 | Create product | POST | `/api/products` | Product JSON | Required by FR-12 | Admin | UNRESOLVED | Product created | Present; auth mismatch candidate |
| C | FR-15 | Update product | PUT | `/api/products/:id` | Path `id` + product JSON | Required by FR-12 | Admin | UNRESOLVED | Product updated | Present; auth mismatch candidate |
| C | FR-15 | Delete product | DELETE | `/api/products/:id` | Path `id` | Required by FR-12 | Admin | UNRESOLVED | Product deleted | Present; auth mismatch candidate |
| C | FR-14 | List categories | GET | `/api/categories` | None | No | Public | UNRESOLVED | No | Present |
| C | FR-14 | Create category | POST | `/api/categories` | JSON: `name` | Required by FR-12 | Admin | UNRESOLVED | Category created | Present |
| C | FR-14 | Update category | PUT | `/api/categories/:id` | Path `id` + body | Required by FR-12 | Admin | UNRESOLVED | Category updated | Present; business requirement does not explicitly mention update |
| C | FR-14 | Delete category | DELETE | `/api/categories/:id` | Path `id` | Required by FR-12 | Admin | UNRESOLVED | Category deleted | Present |
| B | FR-07 | Read cart | GET | `/api/cart` | JWT | Yes | User | UNRESOLVED | No | Present |
| B | FR-07 | Add to cart | POST | `/api/cart` | JSON: `id,name,price,quantity` | Yes | User | UNRESOLVED | Cart changed | Present |
| B | FR-08 | Checkout | POST | `/api/checkout` | JSON: `total_amount,shipping_address` | Yes | User | UNRESOLVED | Order created | Present |
| B | FR-11 | Order history | GET | `/api/orders/my-orders` | JWT | Yes | User | UNRESOLVED | No | Present |
| B | FR-11 | Order detail | GET | `/api/orders/:id` | Path `id` | Requirement implies owner access | User | UNRESOLVED | No | Present; auth/ownership mismatch candidate |
| B | FR-10 | Cancel order | PUT | `/api/orders/:id/cancel` | Path `id` | Yes | User | UNRESOLVED | Order → canceled | Present |
| B | FR-09 | Apply coupon | POST | `/api/apply-coupon` | JSON: `code,total_amount,user_id` | FR-09 requires logged-in user | User | UNRESOLVED | Coupon calculation | Present; auth mismatch candidate |
| C | FR-17 | List coupons | GET | `/api/coupons` | JWT | Yes | Admin per feature context | UNRESOLVED | No | Present; role check candidate |
| C | FR-19 | List users | GET | `/api/admin/users` | JWT | Yes | Admin | UNRESOLVED | No | Present; role check candidate |
| C | FR-19 | Delete user | DELETE | `/api/admin/users/:id` | Path `id` | Yes | Admin | UNRESOLVED | User deleted | Present; role/self-delete candidate |
| C | FR-18 | List all orders | GET | `/api/admin/orders` | JWT | Yes | Admin | UNRESOLVED | No | Present; role check candidate |
| C | FR-18 / FR-10 | Update order status | PUT | `/api/admin/orders/:id/status` | Path `id`, JSON `status` | Yes | Admin | UNRESOLVED | Order status transition | Present; role/state candidate |
| C | FR-16 | Import products | POST | `/api/admin/import-products` | API spec: JSON `{products:[...]}`; business requirement: CSV upload | Yes | Admin | UNRESOLVED | Multiple products created | Present; contract conflict |
| C | FR-17 | Create coupon | POST | `/api/admin/coupons` | Coupon JSON | Yes | Admin | UNRESOLVED | Coupon created | Present; role check candidate |
| C | FR-17 | Delete coupon | DELETE | `/api/admin/coupons/:id` | Path `id` | Yes | Admin | UNRESOLVED | Coupon deleted | Present; role check candidate |
| Support | FR-09 | Record coupon usage | POST | `/api/coupon-usage` | JSON: `coupon_id` | Yes | User | UNRESOLVED | Usage record created | Present but absent from API spec |

## 5. Request/response contract notes

### Explicit success responses in `api_specification.md`

- `POST /api/register` → `200 OK`, body includes `message` and `id`.
- `POST /api/login` → `200 OK`, returns JWT `token` and `user` information.
- `POST /api/forgot-password` → `200 OK`, returns `message` and demo `resetToken`.
- `POST /api/apply-coupon` → response contains `discount_amount` and `final_amount`, but the success status code is not explicitly stated.

For most other endpoints, exact success/error status codes and full schemas are not specified. They remain `UNRESOLVED` for testcase expectation design until supported by the business requirements or a human-approved contract decision.

## 6. Authentication and authorization model

### Business requirement baseline

FR-12 requires all `/api/admin/*` APIs and all data-changing product/category/coupon APIs to require:

1. valid JWT token;
2. `role = 'admin'` in the token.

SEC-02 requires valid JWT on security-sensitive APIs.
SEC-03 requires Admin APIs to verify the admin role, not merely token existence.

### Static implementation observation

`backend/server.js` defines `authenticateToken`, which validates a JWT and assigns `req.user`, but the inspected middleware does not perform an admin-role check.

Observed static candidates:

- `/api/admin/*` routes use `authenticateToken` but no separate role-check middleware is visible.
- `POST/PUT/DELETE /api/products` have no authentication middleware in the inspected route declarations.
- Category mutations use JWT authentication but no explicit admin-role validation.
- `GET /api/orders/:id` has no authentication middleware despite FR-11 ownership requirements.
- `POST /api/apply-coupon` has no authentication middleware although FR-09 condition C4 requires a logged-in user.

These are **static mismatch candidates**, not confirmed defects.

## 7. Security requirement mapping

| SEC | Requirement | Primary relevant API areas | Phase 2 observation |
| --- | --- | --- | --- |
| SEC-01 | Passwords not plaintext | Register, login, reset password, users storage | Relevant to FR-01/02/03; implementation inspection shows password comparison/storage code paths that require later validation/reporting |
| SEC-02 | Sensitive APIs require valid JWT | Profile, cart, checkout, orders, admin APIs | Broadly applicable; some documented/implemented endpoints need runtime verification |
| SEC-03 | Admin role must be checked | `/api/admin/*`, product/category/coupon mutations | High priority; static implementation shows token validation without explicit admin role middleware |
| SEC-04 | User input safely escaped in UI | Search text, shipping address, product/user content | Primarily UI rendering; API tests may supply payloads but UI rendering evidence is separate |
| SEC-05 | Parameterized DB queries | Search, CRUD, auth, orders, coupons | High priority for FR-05 search; static implementation interpolates `search` into SQL string |
| SEC-06 | Profile update cannot change `role` | `PUT /api/users/me` | Directly applicable; implementation reads optional `role` from body — static mismatch candidate |
| SEC-07 | OTP entropy/expiry/single use | Forgot/reset password | Directly applicable to FR-03 |

## 8. Order state model

Business requirement FR-10 defines five states:

```text
pending
confirmed
shipping
delivered
canceled
```

Valid transitions:

| Actor | From | Action | To | Expected Validity |
| --- | --- | --- | --- | --- |
| Admin | pending | confirm | confirmed | Valid |
| User/Admin | pending | cancel | canceled | Valid |
| Admin | confirmed | ship | shipping | Valid |
| User/Admin | confirmed | cancel | canceled | Valid |
| Admin | shipping | deliver | delivered | Valid |
| User | shipping | cancel | canceled | Invalid |
| Any | delivered | any transition | other | Invalid — final state |
| Any | canceled | any transition | other | Invalid — final state |

Static implementation observations:

- User cancel endpoint rejects only `delivered` and `canceled`, therefore `shipping` appears cancelable in code. This conflicts with the business requirement that users cannot cancel once shipping.
- Admin status endpoint contains a transition from `canceled` → `delivered`, which conflicts with `canceled` being a final state.

Both remain candidate defects until runtime reproduction.

## 9. Validation rules extracted from business requirements

| FR | Validation / constraint |
| --- | --- |
| FR-01 | Email valid and unique; password >=8 with uppercase/lowercase/digit/special; confirm password matches |
| FR-02 | Failed login increments exactly 1; lock after >=3 failures for 30 seconds |
| FR-03 | OTP six digits, email-bound; new password follows FR-01; confirmation matches |
| FR-04 | Phone begins `0`, 10–11 digits; email immutable; user cannot update `role` |
| FR-05 | Search by product name; user-provided search text must be safely displayed |
| FR-06 | Quantity positive integer, minimum 1 |
| FR-08 | User authenticated; backend recalculates total and does not trust client `total_amount` |
| FR-09 | Coupon must satisfy existence/active, expiry, minimum `>=`, authentication, usage limit |
| FR-10 | State transitions constrained as defined above |
| FR-14 | Category name required/non-empty |
| FR-15 | Product name required/max 255; price >0; category required/existing |
| FR-16 | CSV extension; exact header `name,price,description,imageUrl,category_id`; RFC4180 quoting; name non-empty; price >0; atomic rollback on any row error |
| FR-17 | Coupon code unique; type percent/fixed; discount positive; min order >=0; max uses >=1 |
| FR-19 | Admin cannot delete currently logged-in admin account |

## 10. Specification conflicts and unresolved points

### CONFLICT-01 — FR-16 transport/input format

Business requirement (`README.md`):

- Admin uploads a `.csv` file.
- CSV header is `name,price,description,imageUrl,category_id`.
- RFC 4180 quoted commas are supported.
- Entire import must rollback if any row is invalid.

API specification:

- `POST /api/admin/import-products`
- Body is JSON `{ "products": [...] }`.
- Section heading says `CSV (JSON Array)`.

Implementation:

- Accepts JSON `{products: rows}`.
- Inserts rows individually.
- Checks missing `name`, but no explicit `price > 0` validation in the inspected route.
- Collects errors and still reports inserted rows; no transaction/rollback is visible.

**Phase 2 disposition:** keep business CSV/atomicity rules as the correctness baseline, retain the API-spec JSON transport conflict explicitly, and design later tests to distinguish transport behavior from business import rules. Do not silently rewrite one document to match the other.

### CONFLICT-02 — FR-10 cancel wording

`api_specification.md` says cancellation is allowed while an order is “chưa giao” (not delivered/shipped wording is ambiguous), whereas `README.md` precisely allows user cancellation only in `pending` or `confirmed` and explicitly forbids user cancellation in `shipping`.

**Phase 2 disposition:** use the precise FR-10 state machine as the business expected behavior and preserve the API-spec wording as a documentation ambiguity.

### UNRESOLVED-01 — Exact response schemas/status codes

Most endpoints do not have complete success/error schemas or explicit HTTP status codes in `api_specification.md`.

**Disposition:** do not invent them during test generation. Derive only where a requirement explicitly defines behavior, otherwise flag for human review or treat observed runtime response as actual behavior rather than expected contract.

### UNRESOLVED-02 — Category update business requirement

The API specification exposes `PUT /api/categories/:id`, while FR-14 explicitly says Admin can Add/View/Delete categories and does not explicitly state Update.

**Disposition:** endpoint exists and can be tested as documented API behavior, but its business FR mapping should be noted as partially unsupported by FR-14 wording.

## 11. Assigned API focus for later phases

The assigned APIs are present in both the API specification and implementation:

### Pool A — FR-05 Product Search

```text
GET /api/products?search=keyword
```

Key Phase 2 facts:

- public endpoint;
- optional `search` query;
- searches product name;
- SEC-05 is strongly applicable to database query construction;
- safe rendering of search input belongs to FR-05/SEC-04 UI behavior and should not be conflated with API response safety;
- static implementation interpolates `search` into SQL, making injection-oriented API tests high priority later.

### Pool B — FR-10 Cancel Order

```text
PUT /api/orders/:id/cancel
```

Key Phase 2 facts:

- JWT required;
- implementation scopes lookup to `id` + authenticated `user_id`;
- valid user cancellation states from business requirements: `pending`, `confirmed`;
- invalid for user: `shipping`, `delivered`, `canceled`;
- static implementation appears to permit `shipping` → `canceled`, which must be reproduced before calling it a bug.

### Pool C — FR-16 Import Products

```text
POST /api/admin/import-products
```

Key Phase 2 facts:

- business role: Admin;
- JWT required;
- SEC-02 and SEC-03 applicable;
- business requirement expects CSV and atomic rollback;
- API spec/implementation accept JSON products array;
- implementation uses JWT authentication but no explicit admin-role check is visible;
- static implementation appears non-atomic and does not visibly enforce positive price.

## 12. Phase 2 completion status

Completed:

- [x] Local SUT clone verified.
- [x] Repository remote/branch/commit recorded.
- [x] `api_specification.md` located and copied to `source/`.
- [x] All documented endpoints inventoried.
- [x] Implementation route list compared against API specification.
- [x] Methods/path/query/body/auth/role/state/validation dimensions extracted where supported.
- [x] FR and SEC mappings recorded.
- [x] State-transition rules recorded.
- [x] Specification conflicts and unresolved expectations preserved.
- [x] Assigned APIs verified to exist.

Not performed in Phase 2:

- real API execution;
- Postman/Newman implementation;
- runtime defect confirmation;
- screenshots/evidence capture;
- human testcase audit.

Those belong to later phases.
