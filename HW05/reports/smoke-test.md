# Scenario C API Smoke Test

## Run identity

| Field | Value |
| --- | --- |
| Timestamp | 2026-08-12T11:54:44+07:00 |
| Student ID | 23127194 |
| Base URL | `http://127.0.0.1:3000` |
| Tool | Direct HTTP smoke checks; not JMeter performance execution |
| Scenario | C - Checkout then cancel |

The tester supplied the documented demo accounts `test@eshop.com` and `admin@eshop.com`. Their passwords were used only in temporary requests; passwords and JWTs were neither printed nor stored in the repository.

## Results

| Step | Endpoint | HTTP | Business verification |
| --- | --- | ---: | --- |
| User login | `POST /api/login` | 200 | JWT returned |
| Search | `GET /api/products?search=iPhone` | 200 | Array returned; product `1` selected |
| Product detail | `GET /api/products/1` | 200 | ID matched and price was positive |
| Add cart item | `POST /api/cart` | 200 | Request accepted |
| Read cart | `GET /api/cart` | 200 | Product `1` present |
| Checkout | `POST /api/checkout` | 200 | Order `1` returned |
| Read order | `GET /api/orders/1` | 200 | Status `pending` |
| Cancel order | `PUT /api/orders/1/cancel` | 200 | Cancellation accepted |
| Read history | `GET /api/orders/my-orders` | 200 | Order `1` status `canceled` |
| Admin login | `POST /api/login` | 200 | JWT returned |
| Admin order list | `GET /api/admin/orders` | 200 | Array returned |

## State and limitations

- Overall smoke verdict: **Passed**.
- The backend was stopped after the run, clearing the in-memory cart.
- Canceled order `1` remains in SQLite because no order-deletion endpoint exists.
- Only one user account is currently available for Scenario C. It is insufficient for isolated JMeter concurrency because threads would share the same server-side cart.
- This smoke test generated no `.jtl`, HTML report, performance metric, threshold, hardware evidence, or video evidence.

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:
