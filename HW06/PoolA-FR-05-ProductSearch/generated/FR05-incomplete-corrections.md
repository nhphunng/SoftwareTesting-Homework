# FR-05 — Corrected versions for previously INCOMPLETE AI cases

These corrections preserve the original audit history, but the reviewer has now explicitly re-reviewed all ten corrected cases and accepted them as `VALID`. The corrected versions below are the approved implementation basis for Postman/Newman.

## AI-FR05-012
- Corrected Input: `X-Student-Id: 23127194`; `search=!@#$^*()_+-=[]{};,.?` (URL-encode through the client/request library).
- Corrected Steps: Send exactly the fixed punctuation string; record status, response body shape, and whether the request is parsed as one search value.
- Corrected Expected: CHARACTERIZATION only; no specific match set is required. The fixed symbol string must remain request data and must not alter request parsing or SQL structure.
- Re-review Status: `VALID — HUMAN RE-REVIEW APPROVED`.

## AI-FR05-013
- Corrected Input: `X-Student-Id: 23127194`; `search=<script>alert(1)</script>` (URL-encoded by the client).
- Corrected Steps: Send the exact script-like string; record status, response Content-Type, and body. Do not treat API-only evidence as proof of browser/DOM XSS safety.
- Corrected Expected: PARTIAL SEC-04 CHARACTERIZATION. Full SEC-04 verdict still requires UI/E2E rendering evidence; no mandatory JSON Content-Type is invented.
- Re-review Status: `VALID — HUMAN RE-REVIEW APPROVED`.

## AI-FR05-020
- Corrected Input: `X-Student-Id: 23127194`; `search=` followed by exactly 2,000 ASCII `A` characters.
- Corrected Steps: Generate `A.repeat(2000)` in test data/pre-request script; send it; record actual status/body and confirm no persistent mutation.
- Corrected Expected: ROBUSTNESS CHARACTERIZATION. No contractual maximum length is assumed.
- Re-review Status: `VALID — HUMAN RE-REVIEW APPROVED`.

## AI-FR05-029
- Corrected Input: Request 1 reuses the exact `AI-FR05-030` unmatched-quote payload (`search='`). Request 2 immediately reuses the normal controlled search input from `AI-FR05-002`.
- Corrected Steps: Run the AI-FR05-030 input first; immediately run the AI-FR05-002 normal search; compare Request 2 against AI-FR05-002 normal search semantics.
- Corrected Expected: The unusual first request must not create persistent search/error state affecting the following normal search.
- Re-review Status: `VALID — HUMAN RE-REVIEW APPROVED`.

## AI-FR05-031
- Corrected Input: `X-Student-Id: 23127194`; exact search value: `' OR '1'='1`.
- Corrected Steps: URL-encode and send the exact value; compare with controlled normal/no-match searches and inspect for evidence of boolean SQL logic alteration.
- Corrected Expected: SEC-05 — input must remain data and must not broaden/alter database query logic through SQL injection.
- Re-review Status: `VALID — HUMAN RE-REVIEW APPROVED`.

## AI-FR05-032
- Corrected Input: `X-Student-Id: 23127194`; exact search value: `x'--`.
- Corrected Steps: URL-encode and send exactly `x'--`; record actual response and inspect whether SQL comment syntax alters query structure or exposes an internal database error.
- Corrected Expected: SEC-05 — comment syntax supplied by the user must remain data and must not alter query structure.
- Re-review Status: `VALID — HUMAN RE-REVIEW APPROVED`.

## AI-FR05-033
- Corrected Input: `X-Student-Id: 23127194`; exact search value: `x' UNION SELECT NULL --`.
- Corrected Steps: URL-encode and send the exact value; record actual response and inspect for evidence of UNION/query-structure manipulation. Do not require the payload to succeed.
- Corrected Expected: SEC-05 — user input must not extend or restructure the database query. A database rejection/error does not itself prove safety.
- Re-review Status: `VALID — HUMAN RE-REVIEW APPROVED`.

## AI-FR05-034
- Corrected Input: `X-Student-Id: 23127194`; raw value `%' OR '1'='1'--`, sent URL-encoded as `%25%27%20OR%20%271%27%3D%271%27--`.
- Corrected Steps: Send the exact encoded value; verify the server receives one search value; record whether decoding plus wildcard/quote/comment syntax changes SQL behavior.
- Corrected Expected: SEC-05 — URL encoding must not make the mixed payload capable of altering query structure; decoded input must remain data.
- Re-review Status: `VALID — HUMAN RE-REVIEW APPROVED`.

## AI-FR05-035
- Corrected Input: `X-Student-Id: 23127194`; exact error probe `search='` (reuse AI-FR05-030).
- Corrected Steps: Send the unmatched quote. If runtime returns an error, capture actual status, Content-Type, and body and inspect for SQL/database/stack/internal details. If no error occurs, record that this probe did not reach the disclosure path.
- Corrected Expected: RISK-BASED. No formal error schema/status is assumed; if an error occurs, evaluate unnecessary internal-information disclosure.
- Re-review Status: `VALID — HUMAN RE-REVIEW APPROVED`.

## AI-FR05-040
- Corrected Input: `X-Student-Id: 23127194`; exact error probe `search='` (reuse AI-FR05-030).
- Corrected Steps: Send the unmatched quote. If an error is reached, record actual status, Content-Type, top-level/body shape, and representative fields/text. If no error is reached, record the error-schema characterization as not reached for this probe.
- Corrected Expected: SCHEMA CHARACTERIZATION. Formal error schema remains unresolved; only actual error response shape is recorded when the fixed probe reaches an error path.
- Re-review Status: `VALID — HUMAN RE-REVIEW APPROVED`.
