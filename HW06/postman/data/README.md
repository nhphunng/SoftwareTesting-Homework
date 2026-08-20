# FR-05 Postman runtime data and limitations

This folder contains setup data only. It contains no execution result, PASS/FAIL evidence, or report.

## Runtime variables

- Configure controlled-dataset values in `FR05-runtime-data.json` or the Postman environment before execution.
- Keep `baseUrl=http://localhost:3000` and the assignment header `X-Student-Id: 23127194`.
- Set `adminToken` only in a local/private Postman value; it is intentionally absent from the data file.
- `enableDestructiveStateTests` defaults to `false`. Turn it on only for disposable, controlled products after configuring all rename/delete variables.

## Postman limitations

- `HUMAN-FR05-043` is documentation-only in this assignment collection because the case requires two different `X-Student-Id` values, while every assignment request is required to use `23127194`. Do not infer tenancy or header partition semantics.
- `HUMAN-FR05-044` requires true 20-A + 20-B request concurrency for three rounds. Normal Collection Runner/Newman ordering is sequential, so the placeholder request is skipped.
- `HUMAN-FR05-048` requires overlapping expensive and normal traffic plus recovery measurement. The placeholder is skipped because repeating requests sequentially would not represent the approved burst case.
- Postman's `pm.execution.skipRequest()` is used for documentation-only and opt-in cases. Use a current Postman/Newman runtime that supports this API; otherwise exclude those folders manually.

No official Newman evidence phase has been run.
