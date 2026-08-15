# Scenario C Load Contract

## Fixed identity

| Item | Value |
| --- | --- |
| Tool | Apache JMeter 5.6.3 |
| Student ID | `23127194` |
| Scenario | C - Checkout then cancel |
| Official date | `2026-08-12` |
| Required plan | `HW05/tests/23127194_Load_20260812.jmx` |
| Local CSV | `HW05/data/scenario-c.local.csv` |

## Ordered measured flow

1. `POST /api/login`; extract JWT as `token`.
2. `GET /api/products?search=${search_keyword}`.
3. `GET /api/products/${product_id}`.
4. `POST /api/cart`.
5. `GET /api/cart`; verify the selected product exists.
6. `POST /api/checkout`; extract the new `orderId`.
7. `GET /api/orders/${orderId}`; verify status `pending`.
8. `PUT /api/orders/${orderId}/cancel`.
9. `GET /api/orders/my-orders`; verify that `${orderId}` is `canceled`.

Use one freshly provisioned account per concurrent thread. Do not register users inside the measured flow. The same sequence must later be reused unchanged by Stress and Spike.

## CSV contract

```text
email,password,search_keyword,product_id,quantity,shipping_address
```

Set CSV sharing across all threads, disable recycling, and stop a thread at EOF. Provision immediately after every backend start because startup drops and reseeds all database tables.

## Correlation and assertions

- Extract `token` from login and set `Authorization: Bearer ${token}` on authenticated requests.
- Extract `orderId` only from the current checkout response; never select an arbitrary order from history.
- Assert expected HTTP response codes separately from JSON/business state.
- Verify positive product price, cart membership, checkout ID, pre-cancel `pending`, cancel success, and final `canceled` state for the same order.
- Fail the iteration on missing correlation values or business assertion failures.

## SUT risks to disclose

- Each successful iteration inserts an order; cancellation changes state but does not delete it.
- Cart state is process-memory state and grows if an account is reused across iterations.
- Checkout accepts a client-provided total and is weakly coupled to cart contents.
- A bad password can contribute to account lockout; use only provisioned, verified CSV rows.

## Evidence boundary

A baseline, dry run, or XML validation is not a measured Load result. Only claim latency, throughput, p95, error rate, resource use, or thresholds when traceable to untouched raw output and captured environment evidence.
