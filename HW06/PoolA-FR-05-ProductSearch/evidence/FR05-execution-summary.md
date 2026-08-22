# FR-05 Step K — Official Newman Execution Summary

Date: 2026-08-20  
Target: `http://localhost:3000`  
Student header: `X-Student-Id: 23127194`  
Classification status: **CANDIDATE ONLY — HUMAN REVIEW REQUIRED**

## Smoke execution

- Executed 62 requests representing 47 testcase IDs (42 AI and 5 HUMAN).
- Assertions: 142 total, 138 passed, 4 failed.
- Requests, pre-request scripts, and test scripts: zero technical failures.
- Runtime variables, admin token, fixture discovery, rename chaining, and delete chaining were operational.
- The four failed assertions were reproduced SUT responses in `HUMAN-FR05-044` and `HUMAN-FR05-048`; they were not collection, data, authentication, or environment failures.
- No collection/test expectation was weakened or changed after the smoke run.

## Clean official-run setup

The SUT database was cleanly reseeded after smoke. The private admin token was verified without printing it. Disposable fixtures were recreated through the documented product API:

- Rename fixture: ID 6, `HW06_FR05_RENAME_23127194_OLD`
- Delete fixture: ID 7, `HW06_FR05_DELETE_23127194`

## Official command

```bash
/private/tmp/hw06-newman/node_modules/.bin/newman run HW06/postman/collection/HW06-FR05-ProductSearch.postman_collection.json \
  -e HW06/postman/environment/HW06-FR05-Local.private.postman_environment.json \
  -d HW06/postman/data/FR05-runtime-data.json \
  --reporters cli,json,htmlextra,junit \
  --reporter-json-export HW06/postman/newman/FR05-official-report.json \
  --reporter-htmlextra-export HW06/postman/newman/FR05-official-report.html \
  --reporter-junit-export HW06/postman/newman/FR05-official-report.xml \
  --color off \
  --timeout-request 10000
```

## Official result

| Metric | Result |
| --- | ---: |
| Testcase IDs | 47 |
| AI testcase IDs | 42 |
| HUMAN testcase IDs | 5 |
| Requests | 62 |
| Request failures | 0 |
| Script failures | 0 |
| Assertions | 142 |
| Assertions passed | 138 |
| Assertions failed | 4 |
| Testcase IDs with failed assertions | 2 |
| Duration | 1,184 ms |
| Response data | 24,134 bytes |

All 62 recorded requests carried `X-Student-Id: 23127194`.

## Candidate failure classification

### HUMAN-FR05-044 — POTENTIAL SUT DEFECT

The exact encoded null-byte request returned HTTP 500. The response was HTML and exposed an SQLite error message. The immediately following normal `phone` search returned HTTP 200, so the endpoint recovered for the next request.

Failed assertions:

1. Null-byte attack must not return 5xx.
2. Response must not disclose obvious database/internal error details.

This is not marked as a confirmed defect. Human review and any desired focused reproduction remain required.

### HUMAN-FR05-048 — POTENTIAL SUT DEFECT

The unauthenticated malformed `POST /api/products?search=phone` returned HTTP 200 with a product-created response instead of 4xx. The before/after listing comparison showed a new product ID 8 whose product fields were null.

Failed assertions:

1. Unsupported unauthenticated POST must be rejected with 4xx.
2. Product ID set must remain unchanged.

This is not marked as a confirmed defect. Human review and any desired focused reproduction remain required.

No failed assertion was classified as a test implementation, test data/setup, environment, or contract-ambiguity issue during this execution.

## Product mutation state after official execution

- ID 6 remains renamed to `HW06_FR05_RENAME_23127194_NEW`.
- ID 7 was deleted and is absent.
- ID 8 remains as the unintended all-null product created during `HUMAN-FR05-048`.
- Final product count: 7 (five seed products, renamed ID 6, and ID 8).
- No post-run cleanup was performed, preserving the observed state for review.

## Evidence handling

The HTML and JSON reporters initially embedded the private JWT in report metadata. The exact token was redacted from those two deliverables without changing requests, responses, assertions, timings, or failures. The CLI and JUnit reports did not contain the token.

No GitHub Issue was created, and no failure is marked confirmed.
