# Newman Execution Summary

Source: `postman/newman/FR10-official-report.json`

| Metric | Result |
| --- | ---: |
| Testcase IDs | 48 |
| Requests | 96 |
| Assertions | 275 |
| Assertions passed | 269 |
| Assertions failed | 6 |
| Failed testcase IDs | 3 |
| X-Student-Id exact match | 96/96 |

## Failures only

### AI-FR10-003

- Request: `GET http://localhost:3000/api/orders/47`
- HTTP status: 200
- Failed assertion: AI-FR10-003 | semantic rejection class — expected 200 to be at least 400
- Failed assertion: [AI] AI-FR10-003 — Branch B — shipping cancel rejected | post-state oracle — expected 'canceled' to deeply equal 'shipping'
- Failed assertion: AI-FR10-003 | semantic rejection class — expected 200 to be at least 400
- Failed assertion: [AI] AI-FR10-003 — Branch B — shipping cancel rejected | post-state oracle — expected 'canceled' to deeply equal 'shipping'
- Response preview: `{"id":47,"user_id":5,"total_amount":100000,"status":"canceled","shipping_address":"HW06 FR10 boundaryShippingOrderId 20260821084449","created_at":"2026-08-21 01:44:49"}`

### AI-FR10-021

- Request: `GET http://localhost:3000/api/orders/43`
- HTTP status: 200
- Failed assertion: AI-FR10-021 | semantic rejection class — expected 200 to be at least 400
- Failed assertion: [AI] AI-FR10-021 — Shipping order cannot be user-canceled | post-state oracle — expected 'canceled' to deeply equal 'shipping'
- Failed assertion: AI-FR10-021 | semantic rejection class — expected 200 to be at least 400
- Failed assertion: [AI] AI-FR10-021 — Shipping order cannot be user-canceled | post-state oracle — expected 'canceled' to deeply equal 'shipping'
- Response preview: `{"id":43,"user_id":5,"total_amount":100000,"status":"canceled","shipping_address":"HW06 FR10 shippingOrderId 20260821084449","created_at":"2026-08-21 01:44:49"}`

### AI-FR10-040

- Request: `GET http://localhost:3000/api/orders/71`
- HTTP status: 200
- Failed assertion: AI-FR10-040 | semantic rejection class — expected 200 to be at least 400
- Failed assertion: [AI] AI-FR10-040 — Invalid shipping transition response characterization | post-state oracle — expected 'canceled' to deeply equal 'shipping'
- Failed assertion: AI-FR10-040 | semantic rejection class — expected 200 to be at least 400
- Failed assertion: [AI] AI-FR10-040 — Invalid shipping transition response characterization | post-state oracle — expected 'canceled' to deeply equal 'shipping'
- Response preview: `{"id":71,"user_id":5,"total_amount":100000,"status":"canceled","shipping_address":"HW06 FR10 schemaShippingOrderId 20260821084449","created_at":"2026-08-21 01:44:49"}`

## AI-consumption rule

Use this compact summary for Step K/Gate G reasoning. Keep the raw Newman JSON/HTML/CLI files as execution evidence, but do not load them into AI context unless a specific failed case requires deeper inspection.

