# HW04 Agent Instructions

## Project context

This project automates three EShop web features with Playwright and TypeScript:

- FR-05: Product Listing and Search
- FR-09: Discount Coupons
- FR-17: Coupon Management CRUD

Do not automate Mobile-FR04 for HW04.

## Required project skills

- Use `.agents/skills/playwright-automation-testing` whenever analyzing, creating, reviewing, running, or fixing HW04 automation tests and related data/Page Objects/fixtures/reports.
- Use `.agents/skills/ai-audit-logging` after every material AI-assisted HW04 output or repository change.

When both apply, use `playwright-automation-testing` first and `ai-audit-logging` second.

## Evidence integrity

- Never invent execution results, report files, screenshots, GitHub Issues, video evidence, or human review.
- Keep unexecuted cases marked as not executed.
- Record assumptions and requirement gaps explicitly.
- Never commit real credentials or `.env`.

## Working rules

- Use external JSON/CSV test data, not inline case arrays.
- Preserve source test case IDs in Playwright titles.
- Inspect the running SUT before implementing selectors.
- Prefer stable accessible locators and observable-state waits.
- Keep tests isolated and repeatable across Chromium, Firefox, and WebKit.
- After a coherent `.spec.ts` change, suggest a meaningful Git commit message.

