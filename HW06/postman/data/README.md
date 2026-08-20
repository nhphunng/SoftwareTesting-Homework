# FR-05 Postman runtime data

This folder contains setup data only. It contains no execution result, PASS/FAIL evidence, or report.

## Runtime variables

- Runtime values are prepared in `FR05-runtime-data.json` for the controlled local dataset.
- Keep `baseUrl=http://localhost:3000` and the assignment header `X-Student-Id: 23127194`.
- Set `adminToken` only in a local/private Postman value; it is intentionally absent from the data file.
- `enableDestructiveStateTests` controls the opt-in rename and delete cases `HUMAN-FR05-046` and `HUMAN-FR05-047`. Use only controlled, disposable products.

## Final HUMAN sequence notes

- `HUMAN-FR05-043` executes a fixed no-match baseline followed by the structured `search[$ne]` query-parameter attack.
- `HUMAN-FR05-044` executes the encoded null-byte search followed immediately by a normal `phone` search.
- `HUMAN-FR05-048` executes GET listing → unauthenticated malformed POST → GET listing and compares observable product IDs.
- These cases do not impose an undocumented response envelope. Product-ID comparisons run when the response representation exposes product IDs; raw observations are retained otherwise.

No official Newman evidence phase has been run.
