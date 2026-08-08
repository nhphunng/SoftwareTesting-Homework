# HW04 – Automation Testing Report

> Student ID: loaded from `.env` at execution time. Credentials are not committed.

## 1. Scope and selected features

| Pool | Feature | Automation status |
| --- | --- | --- |
| A | FR-05 Product Listing and Search | Implemented and executed on three browsers |
| B | FR-09 Discount Coupons | Implemented; Chromium completed, Firefox/WebKit pending Day 4 |
| C | FR-17 Coupon Management CRUD | Implemented; Chromium completed, Firefox/WebKit pending Day 4 |

## 2. Automation architecture

- Framework: Playwright with TypeScript.
- Pattern: external JSON test data + Page Object + feature spec.
- FR-05 source cases: `HW02/test-cases/FR05-product-listing-search.md`.
- Data: `data/fr05-search.json`.
- Page Object: `pages/product.page.ts`.
- Spec: `tests/fr05-product-search.spec.ts`.
- FR-17 source cases: `HW02/test-cases/FR17-coupon-management-crud.md`.
- FR-17 data/Page Object/spec: `data/fr17-coupon-crud.json`, `pages/admin-coupon.page.ts`, `tests/fr17-coupon-management.spec.ts`.
- Reusable admin authentication: `fixtures/auth.fixture.ts`, with credentials read only from `.env`.
- FR-09 source cases: `HW02/test-cases/FR09-discount-coupons.md`.
- FR-09 data/Page Object/spec: `data/fr09-coupons.json`, `pages/checkout.page.ts`, `tests/fr09-discount-coupons.spec.ts`.
- Controlled FR-09 dependencies: `fixtures/coupon.fixture.ts` creates unique coupons through authenticated admin APIs, prepares usage state when needed, and deletes every created coupon after its test.
- Browsers: Chromium, Firefox, and WebKit.
- Evidence: one independent HTML report per feature-browser run.

## 3. FR-05 – Product Listing and Search

### Automated cases

The suite contains 12 enabled cases traced to HW02:

| Type | Case IDs |
| --- | --- |
| Domain | `FR05-DT-001`, `FR05-DT-007`–`FR05-DT-013` |
| Boundary | `FR05-BVA-004`–`FR05-BVA-007` |

The external data loader checks the feature ID, minimum enabled-case count, duplicate IDs, ID prefix, and consistency between expected result count and expected product names.

### Assertion patterns

The implementation uses more than three assertion patterns:

- `toBeVisible()` for headings, product names, search feedback, and empty state.
- `toHaveCount()` for products, `<h1>` elements, unsafe markup, and absent feedback.
- `toHaveValue()` for the entered search keyword.
- `toContainText()` for literal and safe keyword display.

### Execution results

Executed on 2026-08-06 against the local EShop frontend at `http://localhost:5173`.

| Browser | Automated | Passed | Failed | Flaky | HTML report |
| --- | ---: | ---: | ---: | ---: | --- |
| Chromium | 12 | 9 | 3 | 0 | `reports/html/fr05-chromium/index.html` |
| Firefox | 12 | 9 | 3 | 0 | `reports/html/fr05-firefox/index.html` |
| WebKit | 12 | 9 | 3 | 0 | `reports/html/fr05-webkit/index.html` |
| **Total executions** | **36** | **27** | **9** | **0** | 3 reports |

Each embedded Playwright report contains `runBy`, an ISO timestamp, `targetApp: user`, a browser-specific run label, and an options title in the form `HW04 FR05-{Browser} (user) | Run by: {StudentID} | {ISO timestamp}`.

### Confirmed failures

The same three failures occurred across Chromium, Firefox, and WebKit:

| Case | Expected | Actual | Defect |
| --- | --- | --- | --- |
| `FR05-DT-001` | Exactly one `<h1>` on the page | Two `<h1>` elements | `FR05-BUG-001` |
| `FR05-DT-010` | Friendly empty-state message for no match | No products and no empty-state message | `FR05-BUG-002` |
| `FR05-DT-013` | Script-like keyword displayed as literal text | A runtime `<script>` node is inserted into the result echo | `FR05-BUG-003` |

See `reports/bug-report.md` and the screenshots under `screenshots/`.

## 4. FR-09 – Discount Coupons

### Automated cases and controlled dependencies

The Day 3 suite contains 14 enabled cases traced to HW02:

`FR09-DT-001`–`FR09-DT-003`, `FR09-DT-005`–`FR09-DT-009`, `FR09-BVA-001`–`FR09-BVA-003`, `FR09-BVA-007`, `FR09-BVA-012`, and `FR09-BVA-013`.

Coverage includes a valid percentage coupon, unknown and expired codes, a reached usage limit, below/exactly/above minimum-order boundaries, fixed and percentage calculations, usage below the limit, fixed discount equal to the total, and fixed discount greater than the total. Each mutable case receives a unique coupon created through the FR-17 admin API. The usage-limit case records one controlled usage for the same user. Fixture teardown deletes all created coupon rows; live verification after each run showed only `SAVE10`, `BIGBUY`, `VIP100`, and `EXPIRED`. The SUT has no usage-record deletion endpoint, so the isolated usage setup leaves one orphan `coupon_usage` row referencing a deleted, never-reused coupon ID; it cannot affect later tests but remains a cleanup limitation to disclose.

The checkout Page Object adds a seeded product through the UI, opens checkout as the authenticated user, edits the test total, waits for the actual apply-coupon response, and parses displayed VND text into numbers before comparison. Assertions cover visible messages, input values, element counts, HTTP status, discount amount, coupon final amount, payment total, response JSON, and non-negative safety invariants.

### Chromium execution result

Executed on 2026-08-08 against the user frontend selected by `USER_WEB_URL`.

| Browser | Automated | Passed | Failed | Flaky | HTML report |
| --- | ---: | ---: | ---: | ---: | --- |
| Chromium | 14 | 8 | 6 | 0 | `reports/html/fr09-chromium/index.html` |
| Firefox | Not executed | — | — | — | Day 4 |
| WebKit | Not executed | — | — | — | Day 4 |

All six failures were rerun as a focused set and reproduced. A final full 14-case run produced the canonical report.

| Cases | Expected | Actual | Defect |
| --- | --- | --- | --- |
| `FR09-DT-001`, `FR09-DT-007`, `FR09-BVA-003` | Percentage discount is `total × value / 100`; final amount subtracts that discount | A 10-percent coupon returns a negative discount (`-252,000,000` for total `28,000,000`) and an inflated final amount (`280,000,000`) | `FR09-BUG-001` |
| `FR09-BVA-002` | Total exactly equal to minimum is eligible | API returns 400 and reports that the order is below the minimum | `FR09-BUG-002` |
| `FR09-DT-009`, `FR09-BVA-013` | Discount is capped or rejected so payable total is never negative | Final totals are `-50,000` and `-1` respectively | `FR09-BUG-003` |

## 5. FR-17 – Coupon Management CRUD

### Automated cases and isolation

The Day 2 suite contains 15 enabled cases traced to HW02:

`FR17-DT-001`–`FR17-DT-008`, `FR17-DT-010`, `FR17-DT-011`, `FR17-DT-013`, `FR17-DT-015`, `FR17-DT-017`, `FR17-DT-019`, and `FR17-BVA-005`.

Coverage includes viewing the seeded list, valid percent/fixed creation, required fields, duplicate code, discount boundaries, past-date display, minimum order, per-user usage limit, whitespace normalization, and delete. Mutable cases use a unique code derived from case ID, timestamp, worker, and retry. Successful creation is verified in the table and after reload. `afterEach` removes only test-owned records, including records created by a failing assertion. After execution, the live table was checked and contained only `SAVE10`, `BIGBUY`, `VIP100`, and `EXPIRED`.

Assertion patterns include `toBeVisible()`, `toBeEnabled()`, `toHaveValue()`, `toHaveCount()`, `toContainText()`, numeric HTTP status assertions, native form-validity assertions, and exact raw stored-code comparison.

### Chromium execution result

Executed on 2026-08-07 against the admin frontend selected by `ADMIN_WEB_URL`.

| Browser | Automated | Passed | Failed | Flaky | HTML report |
| --- | ---: | ---: | ---: | ---: | --- |
| Chromium | 15 | 11 | 4 | 0 | `reports/html/fr17-chromium/index.html` |
| Firefox | Not executed | — | — | — | Day 4 |
| WebKit | Not executed | — | — | — | Day 4 |

The four Chromium failures were rerun separately and reproduced. The full 15-case run was then repeated to produce the canonical report.

| Case | Expected | Actual | Classification |
| --- | --- | --- | --- |
| `FR17-DT-007` | Reject zero discount | POST returned 200 and an extra row was stored | `FR17-BUG-001` |
| `FR17-DT-008` | Reject negative fixed discount | POST returned 200 and an extra row was stored | `FR17-BUG-001` |
| `FR17-DT-013` | Reject negative minimum order | POST returned 200 and an extra row was stored | `FR17-BUG-002` |
| `FR17-DT-019` | Reject or normalize surrounding whitespace | The code was stored with its leading/trailing spaces intact | Requirement gap / potential defect; code-normalization rule is unspecified |

## 6. Multi-browser execution summary

FR-05 has completed three browser runs; FR-09 and FR-17 have each completed Chromium. This is 5 of the required 9 feature-browser runs. Firefox and WebKit remain for FR-09 and FR-17.

## 7. Human review and AI gap analysis

| Gap ID | AI output issue | Cause | Human correction |
| --- | --- | --- | --- |
| FR05-AI-GAP-001 | Initial project config did not load `.env` and used a single `BASE_URL`. | The scaffold assumed environment variables would be loaded automatically and did not model the separate user/admin frontends. | Added Node `loadEnvFile()` and `TARGET_APP` routing: FR-05/FR-09 use `USER_WEB_URL`; FR-17 uses `ADMIN_WEB_URL`. |
| FR05-AI-GAP-002 | The first Page Object treated HTTP `304 Not Modified` as an API failure in Firefox. | It assumed every successful GET must have a 2xx status and ignored browser cache semantics. | Accepted `304` for the read-only products request, eliminating three false failures without weakening business assertions. |
| FR05-AI-GAP-003 | A source-only review could have mistaken the unsafe echo for an unproven defect. | `dangerouslySetInnerHTML` is risky, but source inspection alone is not execution evidence. | Verified the live DOM after search; one `<script>` node was inserted and the literal keyword was not displayed. |
| FR17-AI-GAP-001 | The first empty-code assertion used a code locator with an empty string, which matched every coupon row. | Text locators normalize an empty matcher broadly; the generated helper assumed every code was non-empty. | Replaced the rejected-case persistence check with a total-row-count assertion, making empty input safe. |
| FR17-AI-GAP-002 | The first duplicate-code run left an unawaited coupon-list response waiter when POST failed. | The initial Page Object started the success-only refresh waiter before knowing the POST outcome. | Added rejection handling for the unused waiter so a valid backend error does not become an automation failure. |
| FR17-AI-GAP-003 | A whitespace-only case could not be identified safely for cleanup after the SUT accepted it. | Whitespace normalization makes an empty-looking row ambiguous and could cause deletion of a seed coupon. | Removed the orphan test record, changed the selected source case to unique leading/trailing whitespace (`FR17-DT-019`), and asserted raw stored text so cleanup remains test-owned and deterministic. |
| FR09-AI-GAP-001 | The initial user-login helper used `getByLabel()` and timed out before any FR-09 business case ran. | The visible Username and Mật khẩu text is not associated with its inputs using `for`/`id` or label wrapping. | Scoped the locator to the verified Sign In form and selected its two inputs in DOM order; a fixed-discount smoke test then passed. |
| FR09-AI-GAP-002 | Using seeded coupons would make usage counts and browser reruns order-dependent. | FR-09 consumes mutable FR-17 records and usage history, while seed records may already have been consumed. | Added an authenticated API fixture that creates unique coupon records, prepares only the required usage count, and deletes test-owned coupons during teardown. |
| FR09-AI-GAP-003 | The first percentage assertion stopped after the displayed savings mismatch, hiding the other incorrect totals. | Hard assertions terminate the case at the first calculation difference. | Used soft assertions for displayed savings, coupon final, payment total, and response discount so one run records all related calculation errors without weakening expectations. |

Human Review:
- Accepted: external data separation, source-ID traceability, Page Object structure, stable accessible search locators, and business assertions.
- Modified: environment loading, frontend base URL, and HTTP 304 handling.
- Removed: the skipped scaffold test.
- Added: 12 executable cases, runtime data validation, cross-browser reports, failure evidence, and three defect records.
- Assumptions to verify: exact wording/icon design for the required friendly empty state; whether the course expects a separate accessibility case ID for the single-`h1` requirement.

FR-17 Human Review:
- Accepted: external data, source-ID traceability, admin fixture, accessible locators, API-backed synchronization, reload persistence checks, unique data, and cleanup.
- Modified: empty-code row assertion, failed-POST response waiting, whitespace coverage, and persistent rejected-case assertions.
- Removed: the unsafe whitespace-only cleanup approach and the skipped FR-17 scaffold.
- Added: 15 executable cases, native/server/business rejection paths, test-owned cleanup, repeated failure verification, and two confirmed defect records.
- Assumptions to verify: whether coupon codes must be trimmed or rejected when surrounded by whitespace; whether past-date coupon creation is intentionally allowed; whether 100 is the official maximum percentage.

FR-09 Human Review:
- Accepted: external data, source-ID traceability, controlled coupon setup, user authentication, API-backed waits, VND parsing, numeric UI/API assertions, and teardown.
- Modified: inaccessible label locators, percentage failure diagnostics, and seed-dependent coupon setup.
- Removed: the skipped FR-09 scaffold and assumptions that shared seed usage state would be clean.
- Added: 14 executable cases, usage-limit preparation, threshold boundaries, safe-final-amount assertions, focused reruns, and three confirmed defect records.
- Assumptions to verify: the product owner's preferred behavior when fixed discount exceeds total (reject or cap at zero); whether a test-only usage cleanup interface should be added; the source file's `FFR09-DT-010` typo was intentionally excluded rather than silently renamed.

## 8. Bugs and unautomated cases

Three FR-05 defects were reproduced across all three browsers. Two FR-17 validation defects and three FR-09 defects were reproduced twice on Chromium; the FR-17 whitespace behavior remains a requirement gap. GitHub Issues and stable FR-09/FR-17 issue screenshots are pending the Day 4 evidence pass. No selected FR-05, FR-09, or FR-17 case remains unautomated.

## 9. Demo video and repository links

- Demo video: To be added.
- Public repository: To be added.
