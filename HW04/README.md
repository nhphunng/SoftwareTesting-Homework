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
| Features automated | 1 / 3 |
| Logical test cases automated | 12 |
| Browser test executions | 36 |
| Passed executions | 27 |
| Failed executions | 9 |
| Unique logical cases passed | 9 |
| Unique logical cases failed | 3 |
| Browser runs | 3 / 9 |
| Confirmed bugs | 3 |
| Demo video | To be added |

## Self-assessment

| No. | Criterion | Grade | Self-assessed grade |
| ---: | --- | ---: | ---: |
| 1 | Task 1 – Feature A (FR-05) | 25 | TBD |
| 2 | Task 1 – Feature B (FR-09) | 25 | TBD |
| 3 | Task 1 – Feature C (FR-17) | 25 | TBD |
| 4 | Task 2 – Demo video | 15 | TBD |
| 5 | Agent Skill | 10 | TBD |
| | **Total** | **100** | **TBD** |
