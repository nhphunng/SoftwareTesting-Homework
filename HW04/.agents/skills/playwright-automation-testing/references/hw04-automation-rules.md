# HW04 Automation Rules

## Scope

| Pool | Feature | Minimum logical cases | Browsers |
| --- | --- | ---: | --- |
| A | FR-05 Product Listing and Search | 12 | Chromium, Firefox, WebKit |
| B | FR-09 Discount Coupons | 12 | Chromium, Firefox, WebKit |
| C | FR-17 Coupon Management CRUD | 12 | Chromium, Firefox, WebKit |

Pool D is excluded from HW04.

## Mandatory implementation evidence

- Keep test data in a separate `.json` or `.csv` file.
- Use at least three distinct assertion patterns.
- Retain a separate attributable HTML report for every feature-browser run.
- Display `Run by: {StudentID}` and an ISO timestamp in the report.
- Explain AI errors, their likely causes, and human corrections.
- Document cases that cannot be automated and why.
- Record only reproduced defects; attach a screenshot to the Markdown bug report and GitHub Issue.

## Review checklist

- Trace every automated title to a source case ID.
- Confirm expected results against the current SUT/requirements.
- Prefer stable accessible locators.
- Assert both UI feedback and the underlying business outcome where observable.
- Avoid ordering dependencies between tests.
- Reset mutable state or use unique data.
- Verify money, dates, whitespace, Unicode, and boundary normalization deliberately.
- Re-run failures before classifying defects.

## Feature risks

### FR-05

- Product seed data may change.
- Empty-result text may be absent even when the result set is correctly empty.
- Long and script-like keywords must be handled without unsafe execution or layout failure.

### FR-09

- Coupon records originate in FR-17 and may be consumed or limited per account.
- Percent and fixed discounts require numeric assertions.
- Cart contents, minimum totals, expiration time, and usage state must be controlled.

### FR-17

- Create/delete operations mutate shared data.
- Codes must be unique across runs and browsers.
- Requirement gaps must not be mislabeled as confirmed validation defects.

