---
name: playwright-automation-testing
description: Build, review, execute, and maintain data-driven Playwright TypeScript tests for HW04 EShop features FR-05, FR-09, and FR-17. Use when selecting HW02 cases for automation, editing JSON/CSV test data, Page Objects, fixtures, or `.spec.ts` files, fixing selectors/assertions/waits, running Chromium/Firefox/WebKit, producing attributable HTML reports, or documenting automation gaps and real defects.
---

# Playwright Automation Testing

Create attributable automation evidence without inventing SUT behavior or execution results.

## Required context

Read these files before changing automation artifacts:

1. `HW04/2026.HW04.Automation Testing_En.md`
2. The relevant source under `HW02/test-cases/`
3. `HW04/playwright.config.ts` and the current feature spec/data/Page Object
4. [references/hw04-automation-rules.md](references/hw04-automation-rules.md)

When creating or changing external test data, also read [references/test-data-contract.md](references/test-data-contract.md).

## Workflow

Follow this order for one feature at a time.

1. Confirm the feature ID and trace at least 12 selected cases to HW02.
2. Inspect the running SUT before choosing selectors or expected UI behavior.
3. Identify preconditions, account role, seeded data, dependencies, and cleanup needs.
4. Store case inputs and expectations in the feature JSON or CSV file. Do not put a case array in the spec.
5. Put reusable UI actions and stable locators in the feature Page Object.
6. Add authentication/setup/cleanup behavior to fixtures only when it is reused.
7. Generate tests incrementally from the external data and preserve the HW02 case ID in each Playwright title.
8. Use at least three meaningful assertion patterns and verify persistent business results, not only transient notifications.
9. Run Chromium first. Fix deterministic failures before running Firefox and WebKit.
10. Run every feature-browser pair separately and retain its HTML report.
11. Review AI-generated code for fragile selectors, fixed delays, weak assertions, shared mutable data, calculation errors, and browser-specific assumptions.
12. Record unautomated cases with reasons. Create a bug record only after reproducible evidence exists.
13. Invoke `$ai-audit-logging` after each material AI-assisted analysis or file change.

## Automation rules

- Use role, label, accessible name, or verified test ID locators when available.
- Never invent selectors from screenshots or requirements alone.
- Never use `waitForTimeout` as the normal synchronization strategy.
- Keep tests independent and safe to repeat across three browsers.
- Generate unique mutable records and clean them up when the SUT supports it.
- For FR-09, control the FR-17 coupon dependency explicitly.
- Parse displayed currency before numeric assertions; do not compare formatted money as arbitrary strings.
- Keep `Actual Result` and execution totals unfilled until a real run produces evidence.
- Do not weaken an assertion merely to make a failing test pass.
- Capture screenshots/traces for failures according to Playwright configuration.

## Human review output

After a material implementation step, update or provide:

```text
Human Review:
- Accepted:
- Modified:
- Removed:
- Added:
- Assumptions to verify:
```

Classify unresolved behavior as a requirement gap or pending verification, not automatically as a defect.

## Commit discipline

Suggest a meaningful commit message after a coherent change to a `.spec.ts` file. Do not fabricate commit dates or create meaningless edits to satisfy the history requirement.

