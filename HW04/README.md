# HW04 – AI Automation Testing

Playwright/TypeScript automation project for:

- FR-05: Product Listing and Search
- FR-09: Discount Coupons
- FR-17: Coupon Management CRUD

## Setup

1. Copy `.env.example` to `.env` and fill in the real values.
2. Install dependencies with `npm install`.
3. Install browser binaries with `npx playwright install`.
4. Start the EShop SUT and verify both `USER_WEB_URL` and `ADMIN_WEB_URL`.
5. Run a feature or one of the nine feature-browser scripts from `package.json`.

Do not commit real credentials or fabricated execution evidence.

`TARGET_APP=user` selects `USER_WEB_URL` for FR-05 and FR-09. `TARGET_APP=admin` selects `ADMIN_WEB_URL` for FR-17. The feature scripts set this automatically.

## Project skills

- `.agents/skills/playwright-automation-testing`: data-driven Playwright workflow, review, and multi-browser evidence.
- `.agents/skills/ai-audit-logging`: chronological AI interaction logging with pending human review.

Invoke them explicitly as `$playwright-automation-testing` and `$ai-audit-logging`, or work inside `HW04/` so that `AGENTS.md` supplies the project rules.

## Test summary

| Metric | Value |
| --- | ---: |
| Selected features | 3 |
| Features automated | 3 / 3 |
| Logical test cases automated | 41 |
| Browser test executions | 123 |
| Passed executions | 84 |
| Failed executions | 39 |
| Unique logical cases passed | 28 |
| Unique logical cases failed | 13 |
| Browser runs | 9 / 9 |
| Confirmed bugs | 8 |
| Open requirement gaps | 1 |
| Demo video | To be added |

All nine HTML reports include `Run by: 23127194`, an ISO timestamp, the browser-specific run label, and the selected user/admin target. The reports and Playwright runtime artifacts remain local/ignored as required by this repository's `.gitignore` policy.

## Day 4 execution matrix

| Feature | Chromium | Firefox | WebKit |
| --- | ---: | ---: | ---: |
| FR-05 | 9 passed / 3 failed | 9 passed / 3 failed | 9 passed / 3 failed |
| FR-09 | 8 passed / 6 failed | 8 passed / 6 failed | 8 passed / 6 failed |
| FR-17 | 11 passed / 4 failed | 11 passed / 4 failed | 11 passed / 4 failed |

Confirmed defects are published as [GitHub Issues #14–#21](https://github.com/nhphunng/SoftwareTesting-Homework/issues?q=is%3Aissue%20state%3Aopen%20number%3A14..21), each with a real execution screenshot. FR17-DT-019 remains a requirement gap and was not published as a confirmed defect.

## Self-assessment

| No. | Criterion | Grade | Self-assessed grade |
| ---: | --- | ---: | ---: |
| 1 | Task 1 – Feature A (FR-05) | 25 | TBD |
| 2 | Task 1 – Feature B (FR-09) | 25 | TBD |
| 3 | Task 1 – Feature C (FR-17) | 25 | TBD |
| 4 | Task 2 – Demo video | 15 | TBD |
| 5 | Agent Skill | 10 | TBD |
| | **Total** | **100** | **TBD** |
