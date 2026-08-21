# FR-10 Cancel Order — Step I Postman Implementation

Date: 2026-08-21  
Step I status: **COMPLETE**  
Official execution status: **NOT STARTED — Step J runtime preparation required**

## Implemented artifacts

- `postman/collection/HW06-FR10-CancelOrder.postman_collection.json`
- `postman/environment/HW06-FR10-Local.postman_environment.json`
- `postman/environment/HW06-FR10-Local.private.postman_environment.json`

## Collection coverage

- 42 AI testcase IDs: `AI-FR10-001..042`
- 6 HUMAN testcase IDs: `HUMAN-FR10-043..048`
- Total unique testcase IDs: **48**
- Total executable Postman requests: **53**

The request count is greater than the testcase-ID count because sequence cases intentionally use more than one request, including semantic-boundary, repeated-cancel, enumeration-comparison, and unauthorized→rightful-owner sequences.

## Implementation behavior

- Collection-level pre-request script enforces `X-Student-Id: 23127194` on every Postman/Newman request.
- Exact HTTP status codes are not hard-coded where the approved contract marked them `UNRESOLVED`.
- Valid cancel transitions assert the HTTP success class (`2xx`) plus follow-up order state where applicable.
- Contract-backed invalid transitions/authentication failures assert an error-class response (`>=400`) plus unchanged state where applicable.
- Characterization/risk-based cases avoid inventing direct-contract response requirements.
- `GET /api/orders/:id` is used as the documented follow-up state oracle.
- Runtime response shape is logged for schema/characterization cases.
- Corrected inputs are implemented for `%27`, the fixed SQL-style probe, the 4096-character payload, and suite-wide header evidence.

## Special case handling

### AI-FR10-011

The approved correction requires a raw-path-capable request:

```bash
curl --path-as-is -X PUT 'http://localhost:3000/api/orders//cancel' \
  -H 'Authorization: Bearer <User-A-token>' \
  -H 'X-Student-Id: 23127194'
```

A Postman trace item remains in the collection for testcase provenance, but Postman/Newman URL normalization must not be treated as sufficient official evidence for this case. Step J/K must retain the external raw-path execution evidence when this case is run.

### AI-FR10-042

The collection provides a representative request-level header assertion. The approved final oracle remains suite-wide verification against the official Newman JSON report, where every execution must contain the exact student header.

## Runtime variables

The environment skeleton defines runtime placeholders for:

- User A / User B JWTs and IDs;
- optional admin token;
- tampered JWT and auth-negative values;
- dedicated order IDs for documented states;
- dedicated/disposable stateful cases;
- cross-user ownership cases;
- HUMAN sequence cases.

Only `baseUrl=http://localhost:3000` and `studentId=23127194` are populated at Step I. All actual tokens, user IDs, and order IDs intentionally remain blank until Step J verifies them against the real SUT.

## Validation performed

- Postman collection JSON parsed successfully.
- Both environment JSON files parsed successfully.
- Unique testcase IDs: `48`.
- AI testcase IDs: `42/42`, none missing.
- HUMAN testcase IDs: `6/6`, none missing.
- Executable requests: `53`.
- Postman scripts syntax-checked: `57` scripts, `0` syntax errors.
- `run-step-k.sh FR10 --dry-run` resolves the new collection/environment and currently blocks only on:

```text
MISSING: postman/data/FR10-runtime-data.json
```

This is expected because runtime data belongs to Step J.

## Step I conclusion

Step I is complete. The collection is implementation-ready but **not runtime-ready**. Do not execute an official Newman evidence run until Step J creates/verifies real actors, tokens, ownership relationships, order states, reset strategy, and `postman/data/FR10-runtime-data.json`.
