# HW04 – Automation Testing Report

> Student ID: loaded from `.env` at execution time. Credentials are not committed.

## 1. Scope and selected features

| Pool | Feature | Automation status |
| --- | --- | --- |
| A | FR-05 Product Listing and Search | Implemented and executed on three browsers |
| B | FR-09 Discount Coupons | Not implemented yet |
| C | FR-17 Coupon Management CRUD | Not implemented yet |

## 2. Automation architecture

- Framework: Playwright with TypeScript.
- Pattern: external JSON test data + Page Object + feature spec.
- FR-05 source cases: `HW02/test-cases/FR05-product-listing-search.md`.
- Data: `data/fr05-search.json`.
- Page Object: `pages/product.page.ts`.
- Spec: `tests/fr05-product-search.spec.ts`.
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

Not implemented yet.

## 5. FR-17 – Coupon Management CRUD

Not implemented yet.

## 6. Multi-browser execution summary

FR-05 has completed 3 of the assignment's required 9 feature-browser runs. FR-09 and FR-17 remain outstanding.

## 7. Human review and AI gap analysis

| Gap ID | AI output issue | Cause | Human correction |
| --- | --- | --- | --- |
| FR05-AI-GAP-001 | Initial project config did not load `.env` and used a single `BASE_URL`. | The scaffold assumed environment variables would be loaded automatically and did not model the separate user/admin frontends. | Added Node `loadEnvFile()` and `TARGET_APP` routing: FR-05/FR-09 use `USER_WEB_URL`; FR-17 uses `ADMIN_WEB_URL`. |
| FR05-AI-GAP-002 | The first Page Object treated HTTP `304 Not Modified` as an API failure in Firefox. | It assumed every successful GET must have a 2xx status and ignored browser cache semantics. | Accepted `304` for the read-only products request, eliminating three false failures without weakening business assertions. |
| FR05-AI-GAP-003 | A source-only review could have mistaken the unsafe echo for an unproven defect. | `dangerouslySetInnerHTML` is risky, but source inspection alone is not execution evidence. | Verified the live DOM after search; one `<script>` node was inserted and the literal keyword was not displayed. |

Human Review:
- Accepted: external data separation, source-ID traceability, Page Object structure, stable accessible search locators, and business assertions.
- Modified: environment loading, frontend base URL, and HTTP 304 handling.
- Removed: the skipped scaffold test.
- Added: 12 executable cases, runtime data validation, cross-browser reports, failure evidence, and three defect records.
- Assumptions to verify: exact wording/icon design for the required friendly empty state; whether the course expects a separate accessibility case ID for the single-`h1` requirement.

## 8. Bugs and unautomated cases

Three FR-05 defects were reproduced across all three browsers. GitHub Issues are pending publication by the student. No selected FR-05 case remains unautomated.

## 9. Demo video and repository links

- Demo video: To be added.
- Public repository: To be added.
