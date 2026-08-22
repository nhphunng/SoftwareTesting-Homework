# FR05-BUG-02 — Unauthenticated client can create products through an admin-only product API

GitHub Issue: https://github.com/nhphunng/SoftwareTesting-Homework/issues/25

## Summary

`POST /api/products` accepts a request with no JWT and creates a product. This violates README requirement **FR-12**, which requires all data-changing product APIs to require both a valid JWT and `role='admin'`.

## Severity

**Critical**

Reason: an unauthenticated client can perform a privileged data-changing operation and persist a new product record.

## Found by

- **Human-added test:** `HUMAN-FR05-048`
- AI missed: **Yes**
- Root coverage gap: unusual sequence / unauthorized mutation

## API

`POST /api/products`

## Requirement basis

**README — FR-12 Access Control**

All data-changing `POST/PUT/DELETE /api/products` APIs must require:

1. a valid JWT; and
2. `role = 'admin'` in the token.

Supporting API contract:

`api_specification.md` documents `POST /api/products` under product create/update/delete operations for Admin.

## Preconditions

- SUT running at `http://localhost:3000`.
- Product listing works.
- No `Authorization` header is sent.
- Request includes `X-Student-Id: 23127194`.

## Reproduction

1. Capture the product ID set using `GET /api/products`.
2. Send:

```http
POST /api/products?search=phone
Content-Type: application/json
X-Student-Id: 23127194

{"unexpectedSearchField":"phone"}
```

3. Do not send a JWT.
4. Fetch `GET /api/products` again.
5. Compare product IDs before and after.

## Expected

Because the endpoint changes product data and is Admin-only, a request without a valid Admin JWT must not create a product.

The requirement does not prescribe one exact rejection status code, so the confirmed violation is authorization bypass plus mutation, not specifically “must return 401” or “must return 403”.

## Actual

The official Newman execution returned:

```text
HTTP 200
{"message":"Product created","id":8}
```

The following product listing contained new product ID `8`, proving that the unauthenticated request mutated persistent product data.

## Reproducibility

**2/2 observed runs**

- Smoke run: reproduced.
- Official Newman run: reproduced.

## Evidence

- Screenshot: `PoolA-FR-05-ProductSearch/evidence/screenshots/FR05-BUG-02.png`
- `PoolA-FR-05-ProductSearch/evidence/FR05-official-failure-evidence.json`
- `PoolA-FR-05-ProductSearch/evidence/FR05-execution-summary.md`
- `PoolA-FR-05-ProductSearch/evidence/FR05-human-gate-g-review.md`
- `postman/newman/FR05-official-report.html`
- `postman/newman/FR05-official-report.json`

## Notes

`POST /api/products` is a documented endpoint, so this defect should **not** be reported as HTTP method confusion. The confirmed defect is the lack of required authentication/authorization enforcement on an Admin-only data-changing endpoint.

## Confirmation

**CONFIRMED DEFECT — Human Gate G approved**

Contract violated: **FR-12**.
