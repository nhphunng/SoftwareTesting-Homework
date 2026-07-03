# Bug Report

## Defect Log

| Bug ID | Feature | Summary | Severity | Status | Related Test Case(s) | Evidence |
|---|---|---|---|---|---|---|
| FR17-BUG-001 | FR-17 Coupon Management CRUD | System accepts invalid `discount_value` values from the admin form. | High | Confirmed | FR17-DT-007, FR17-DT-008, FR17-DT-009, FR17-BVA-001, FR17-BVA-006, FR17-BVA-007, FR17-BVA-008 | [DT-007](<../screenshots/FR17-DT-007 copy.png>), [DT-008](<../screenshots/FR17-DT-008 copy.png>), [DT-009](<../screenshots/FR17-DT-009 copy.png>) |
| FR17-BUG-002 | FR-17 Coupon Management CRUD | System accepts a past expiration date for a new coupon. | High | Confirmed | FR17-DT-011, FR17-BVA-017 | [DT-011](<../screenshots/FR17-DT-011 copy.png>) |
| FR17-BUG-003 | FR-17 Coupon Management CRUD | System accepts missing or negative `min_order_amount`. | High | Confirmed | FR17-DT-012, FR17-DT-013, FR17-BVA-010 | [DT-012](<../screenshots/FR17-DT-012 copy.png>), [DT-013](<../screenshots/FR17-DT-013 copy.png>) |
| FR17-BUG-004 | FR-17 Coupon Management CRUD | System accepts whitespace-only coupon code. | High | Confirmed | FR17-DT-018 | [DT-018](<../screenshots/FR17-DT-018 copy.png>) |
| FR17-BUG-005 | FR-17 Coupon Management CRUD | Coupon code trimming and allowed-character behavior are unclear and may create confusing coupons. | Medium | Potential Defect - Requirement Clarification Needed | FR17-DT-019, FR17-DT-020, FR17-DT-021 | [DT-019](<../screenshots/FR17-DT-019 copy.png>), [DT-021](<../screenshots/FR17-DT-021 copy.png>) |
| FR09-BUG-001 | FR-09 Discount Coupons | Percent coupon is accepted but final amount remains unchanged. | High | Confirmed | FR09-DT-001, FR09-DT-007 | [DT-001](../screenshots/FR09-DT-001.png), [DT-007](../screenshots/FR09-DT-007.png) |
| FR09-BUG-002 | FR-09 Discount Coupons | Coupon is rejected when cart total is exactly at the minimum order amount. | High | Confirmed | FR09-BVA-002 | [BVA-002](../screenshots/FR09-BVA-002.png) |
| FR09-BUG-003 | FR-09 Discount Coupons | Fixed discount greater than cart total produces a negative final amount. | High | Confirmed | FR09-DT-009, FR09-BVA-013 | [DT-009](../screenshots/FR09-DT-009.png), [BVA-013](../screenshots/FR09-BVA-013.png) |
| MFR04-BUG-001 | Mobile-FR04 Profile Management | System accepts empty or whitespace-only full name. | High | Confirmed | MFR04-DT-005, MFR04-DT-006 | [DT-005](../screenshots/MFR04-DT-005.jpg), [DT-006](../screenshots/MFR04-DT-006.jpg) |
| MFR04-BUG-002 | Mobile-FR04 Profile Management | System rejects valid phone numbers that start with `0`. | High | Confirmed | MFR04-DT-007, MFR04-DT-009, MFR04-BVA-006 | [DT-007](../screenshots/MFR04-DT-007.jpg), [DT-009](../screenshots/MFR04-DT-009.jpg), [BVA-006](../screenshots/MFR04-BVA-006.jpg) |
| MFR04-BUG-003 | Mobile-FR04 Profile Management | System accepts phone numbers that do not start with `0`. | High | Confirmed | MFR04-DT-011, MFR04-BVA-007 | [DT-011](../screenshots/MFR04-DT-011.jpg), [BVA-007](../screenshots/MFR04-BVA-007.jpg) |

## Bug Details

### FR17-BUG-001 - Invalid discount value is accepted

| Field | Content |
|---|---|
| Bug ID | FR17-BUG-001 |
| Title | Invalid `discount_value` values are accepted |
| Feature | FR-17 Coupon Management CRUD |
| Severity | High |
| Priority | High |
| Environment | EShop Admin, local test environment |
| Preconditions | Admin is logged in. |
| Steps to Reproduce | 1. Create coupons from the admin form using invalid `discount_value` values such as `0`, `-1`, or `101` for percent. |
| Expected Result | Coupon is not created. System returns a clear validation error because `discount_value` is required, positive, and percent discount should not exceed the confirmed maximum. |
| Actual Result | Coupon is created with invalid discount values. |
| Screenshot | [DT-007](<../screenshots/FR17-DT-007 copy.png>), [DT-008](<../screenshots/FR17-DT-008 copy.png>), [DT-009](<../screenshots/FR17-DT-009 copy.png>) |
| Related Test Case | FR17-DT-007, FR17-DT-008, FR17-DT-009, FR17-BVA-001, FR17-BVA-006, FR17-BVA-007, FR17-BVA-008 |
| GitHub Issue Link |  |

### FR17-BUG-002 - Past expiration date is accepted

| Field | Content |
|---|---|
| Bug ID | FR17-BUG-002 |
| Title | Past `expired_at` value is accepted for a new coupon |
| Feature | FR-17 Coupon Management CRUD |
| Severity | High |
| Priority | High |
| Environment | EShop Admin, local test environment |
| Preconditions | Admin is logged in. |
| Steps to Reproduce | 1. Create a coupon from the admin form with `expired_at=2020-01-01` or another date before the active-date boundary. |
| Expected Result | Coupon is rejected or created only as expired according to a confirmed product rule. |
| Actual Result | Coupon is created as a normal new coupon. |
| Screenshot | [DT-011](<../screenshots/FR17-DT-011 copy.png>) |
| Related Test Case | FR17-DT-011, FR17-BVA-017 |
| GitHub Issue Link |  |

### FR17-BUG-003 - Invalid minimum order amount is accepted

| Field | Content |
|---|---|
| Bug ID | FR17-BUG-003 |
| Title | Missing or negative `min_order_amount` is accepted |
| Feature | FR-17 Coupon Management CRUD |
| Severity | High |
| Priority | High |
| Environment | EShop Admin, local test environment |
| Preconditions | Admin is logged in. |
| Steps to Reproduce | 1. Create coupons from the admin form with empty `min_order_amount` or `min_order_amount=-1`. |
| Expected Result | Coupon is not created. System returns a clear validation error because `min_order_amount` is required and must be greater than or equal to `0`. |
| Actual Result | Coupon is created with invalid minimum order amount. |
| Screenshot | [DT-012](<../screenshots/FR17-DT-012 copy.png>), [DT-013](<../screenshots/FR17-DT-013 copy.png>) |
| Related Test Case | FR17-DT-012, FR17-DT-013, FR17-BVA-010 |
| GitHub Issue Link |  |

### FR17-BUG-004 - Whitespace-only coupon code is accepted

| Field | Content |
|---|---|
| Bug ID | FR17-BUG-004 |
| Title | Whitespace-only coupon code is accepted |
| Feature | FR-17 Coupon Management CRUD |
| Severity | High |
| Priority | High |
| Environment | EShop Admin, local test environment |
| Preconditions | Admin is logged in. |
| Steps to Reproduce | 1. Create coupon with `code=" "` and other fields valid. |
| Expected Result | Coupon is not created because code is empty after trimming. System displays required/invalid code validation. |
| Actual Result | Coupon is created. |
| Screenshot | [DT-018](<../screenshots/FR17-DT-018 copy.png>) |
| Related Test Case | FR17-DT-018 |
| GitHub Issue Link |  |

### FR17-BUG-005 - Coupon code normalization rules are unclear

| Field | Content |
|---|---|
| Bug ID | FR17-BUG-005 |
| Title | Coupon code trimming, separator, and Unicode behavior may create confusing coupons |
| Feature | FR-17 Coupon Management CRUD |
| Severity | Medium |
| Priority | Medium |
| Environment | EShop Admin, local test environment |
| Preconditions | Admin is logged in; coupon `FR17-DT-019` exists for trim/canonicalization test. |
| Steps to Reproduce | 1. Create coupon with `code=" FR17-DT-019 "`. 2. Create coupon with `code=SAVE_10`. 3. Create coupon with `code=GIẢM10`. |
| Expected Result | Inconclusive - Requirement unclear. The product should define whether coupon code is trimmed and which characters/Unicode values are allowed. System must not create confusing duplicates. |
| Actual Result | Coupons are created. |
| Screenshot | [DT-019](<../screenshots/FR17-DT-019 copy.png>), [DT-021](<../screenshots/FR17-DT-021 copy.png>) |
| Related Test Case | FR17-DT-019, FR17-DT-020, FR17-DT-021 |
| GitHub Issue Link |  |

### FR09-BUG-001 - Percent coupon does not update final amount

| Field | Content |
|---|---|
| Bug ID | FR09-BUG-001 |
| Title | Percent coupon is accepted but final amount remains unchanged |
| Feature | FR-09 Discount Coupons |
| Severity | High |
| Priority | High |
| Environment | EShop checkout, local test environment |
| Preconditions | Customer is logged in; cart total meets coupon minimum; percent coupon is active, not expired, and usage limit is not reached. |
| Steps to Reproduce | 1. Open checkout with cart total `28000000`. 2. Enter percent coupon `SAVE10` or `FR09-DT-007`. 3. Click Apply. |
| Expected Result | Coupon is applied and final amount reflects the percentage discount. For `SAVE10`, discount should be `2800000` and final amount should be `25200000`. |
| Actual Result | Coupon is applied, but the final amount remains unchanged. |
| Screenshot | [FR09-DT-001](../screenshots/FR09-DT-001.png), [FR09-DT-007](../screenshots/FR09-DT-007.png) |
| Related Test Case | FR09-DT-001, FR09-DT-007 |
| GitHub Issue Link |  |

### FR09-BUG-002 - Exact minimum order boundary is rejected

| Field | Content |
|---|---|
| Bug ID | FR09-BUG-002 |
| Title | Coupon is rejected when cart total is exactly at the minimum order amount |
| Feature | FR-09 Discount Coupons |
| Severity | High |
| Priority | High |
| Environment | EShop checkout, local test environment |
| Preconditions | Customer is logged in; coupon `VIP100` is active, not expired, and usage limit is not reached. |
| Steps to Reproduce | 1. Open checkout with cart total exactly `300000`. 2. Enter coupon `VIP100`. 3. Click Apply. |
| Expected Result | Coupon is accepted because cart total is equal to `min_order_amount`; discount is `30000` and final amount is `270000`. |
| Actual Result | Coupon is rejected because the system says the total is below minimum. |
| Screenshot | [FR09-BVA-002](../screenshots/FR09-BVA-002.png) |
| Related Test Case | FR09-BVA-002 |
| GitHub Issue Link |  |

### FR09-BUG-003 - Fixed discount can produce negative final amount

| Field | Content |
|---|---|
| Bug ID | FR09-BUG-003 |
| Title | Fixed discount greater than cart total produces a negative final amount |
| Feature | FR-09 Discount Coupons |
| Severity | High |
| Priority | High |
| Environment | EShop checkout, local test environment |
| Preconditions | Customer is logged in; fixed discount coupon exists, is active, not expired, and can still be used. |
| Steps to Reproduce | 1. Open checkout with cart total `50000`. 2. Apply a fixed discount coupon whose value is greater than cart total, such as `FIXED_OVER_TOTAL` with discount `100000` or a fixed coupon with discount `50001`. |
| Expected Result | System should not produce a negative final amount; coupon should be rejected or final amount should be capped at `0` according to the confirmed product rule. |
| Actual Result | System produces a negative final amount. |
| Screenshot | [FR09-DT-009](../screenshots/FR09-DT-009.png), [FR09-BVA-013](../screenshots/FR09-BVA-013.png) |
| Related Test Case | FR09-DT-009, FR09-BVA-013 |
| GitHub Issue Link |  |

### MFR04-BUG-001 - Empty or whitespace-only full name is accepted

| Field | Content |
|---|---|
| Bug ID | MFR04-BUG-001 |
| Title | Empty or whitespace-only full name is accepted |
| Feature | Mobile-FR04 Profile Management |
| Severity | High |
| Priority | High |
| Environment | EShop Mobile, local test environment |
| Preconditions | Customer is logged in and opens the profile page. |
| Steps to Reproduce | 1. Clear the full name field and tap `Cập nhật`. 2. Enter only spaces in the full name field and tap `Cập nhật`. |
| Expected Result | Profile update is rejected and a required/invalid full-name validation message is shown. |
| Actual Result | Profile is saved with an empty or whitespace-only full name. |
| Screenshot | [DT-005](../screenshots/MFR04-DT-005.jpg), [DT-006](../screenshots/MFR04-DT-006.jpg) |
| Related Test Case | MFR04-DT-005, MFR04-DT-006 |
| GitHub Issue Link |  |

### MFR04-BUG-002 - Valid leading-zero phone number is rejected

| Field | Content |
|---|---|
| Bug ID | MFR04-BUG-002 |
| Title | Valid phone numbers starting with `0` are rejected |
| Feature | Mobile-FR04 Profile Management |
| Severity | High |
| Priority | High |
| Environment | EShop Mobile, local test environment |
| Preconditions | Customer is logged in and opens the profile page. |
| Steps to Reproduce | 1. Enter a phone number starting with `0`, such as `0912345678` or `091234567`. 2. Tap `Cập nhật`. |
| Expected Result | Profile is saved when the phone value satisfies the confirmed valid phone rule. |
| Actual Result | System shows phone validation error such as `Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số`. |
| Screenshot | [DT-007](../screenshots/MFR04-DT-007.jpg), [DT-009](../screenshots/MFR04-DT-009.jpg), [BVA-006](../screenshots/MFR04-BVA-006.jpg) |
| Related Test Case | MFR04-DT-007, MFR04-DT-009, MFR04-BVA-006 |
| GitHub Issue Link |  |

### MFR04-BUG-003 - Phone number without leading zero is accepted

| Field | Content |
|---|---|
| Bug ID | MFR04-BUG-003 |
| Title | Phone numbers not starting with `0` are accepted |
| Feature | Mobile-FR04 Profile Management |
| Severity | High |
| Priority | High |
| Environment | EShop Mobile, local test environment |
| Preconditions | Customer is logged in and opens the profile page. |
| Steps to Reproduce | 1. Enter a phone number that does not start with `0`, such as `123456789`. 2. Tap `Cập nhật`. |
| Expected Result | Profile update is rejected because phone number must start with `0`. |
| Actual Result | Profile is saved and the updated value remains after reload. |
| Screenshot | [DT-011](../screenshots/MFR04-DT-011.jpg), [BVA-007](../screenshots/MFR04-BVA-007.jpg) |
| Related Test Case | MFR04-DT-011, MFR04-BVA-007 |
| GitHub Issue Link |  |

## Human Review

```text
Human Review:
- Accepted:
- Modified:
- Removed:
- Added:
  - FR-09 bugs for percent discount calculation/display, exact minimum-order boundary handling, and fixed discounts that create negative final amounts.
  - Mobile-FR04 bugs for full-name validation and phone-number validation mismatches.
- Assumptions to verify:
  - Whether percent discount must be limited to 100.
  - Whether creating already-expired coupons is allowed.
  - Whether coupon codes should be trimmed before validation and storage.
  - Allowed coupon code character set and Unicode support.
  - Expected validation message for each failed admin-form submission.
  - Whether fixed coupons greater than cart total should be rejected or capped at `0`.
  - Whether minimum-order validation should use `>= min_order_amount` consistently for all coupons.
  - Whether Mobile-FR04 phone rule should follow the requirement `0` + 10-11 digits or the current app message saying 9-10 digits.
  - Whether full name is mandatory after trimming whitespace.
```

## Suggested Git Commit Message

```text
Update Mobile-FR04 bug report evidence
```
