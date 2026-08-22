# Newman Execution Summary

Source: `postman/newman/FR05-official-report.json`

| Metric | Result |
| --- | ---: |
| Testcase IDs | 47 |
| Requests | 62 |
| Assertions | 142 |
| Assertions passed | 138 |
| Assertions failed | 4 |
| Failed testcase IDs | 2 |
| X-Student-Id exact match | 62/62 |

## Failures only

### HUMAN-FR05-044

- Request: `GET http://localhost:3000/api/products?search=phone%00__NO_MATCH_23127194__`
- HTTP status: 500
- Failed assertion: [HUMAN] HUMAN-FR05-044 — Step 1 of 2 — encoded null-byte attack | null-byte attack does not return 5xx — expected 500 to be below 500
- Failed assertion: [HUMAN] HUMAN-FR05-044 — Step 1 of 2 — encoded null-byte attack | no obvious internal-error disclosure — expected '<h1>Database Error</h1><p>SQLITE_ERRO…' not to match /(?:SQLITE(?:_ERROR)?|SELECT\s+.+FROM|(?:Error|Exception):\s+.+\n\s+at\s+)/i
- Response preview: `<h1>Database Error</h1><p>SQLITE_ERROR: unrecognized token: "'%phone"</p>`

### HUMAN-FR05-048

- Request: `POST http://localhost:3000/api/products?search=phone`
- HTTP status: 200
- Failed assertion: [HUMAN] HUMAN-FR05-048 — Step 2 of 3 — unauthenticated malformed POST with search query | unsupported unauthenticated POST is rejected with 4xx — expected 200 to be within 400..499
- Failed assertion: [HUMAN] HUMAN-FR05-048 — Step 3 of 3 — verify product IDs after POST | product ID set is unchanged after rejected POST — expected [ '1', '2', '3', '4', '5', '6', '8' ] to deeply equal [ '1', '2', '3', '4', '5', '6' ]
- Response preview: `{"message":"Product created","id":8}`

## AI-consumption rule

Use this compact summary for Step K/Gate G reasoning. Keep the raw Newman JSON/HTML/CLI files as execution evidence, but do not load them into AI context unless a specific failed case requires deeper inspection.

