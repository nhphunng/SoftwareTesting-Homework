# FR-17 Coupon Management CRUD - First Draft Testing Artifacts

## 1. Feature Understanding

| Item | Details |
|---|---|
| Feature ID | FR-17 |
| Feature name | Coupon Management CRUD |
| User role | Admin |
| Main purpose | Allow an admin to add, view, and delete discount coupons. |
| Preconditions | Admin is authenticated and has access to the EShop Admin coupon management page. |
| Main flow | Admin opens Coupon Management, enters coupon data, creates a coupon, sees the coupon in the list, and can delete an existing coupon. |
| Alternative flows | Validation error for missing/invalid input; duplicate coupon code is rejected; expired coupon is displayed as expired; delete may require confirmation. |
| Related data | Coupon code, type, discount value, expiration date, minimum order amount, maximum uses per user. FR-17 data is consumed by FR-09 Discount Coupons. |

### Assumptions to verify

- The UI shown in the screenshot is the admin page for FR-17.
- Coupon creation is the only visible write form; update/edit is not visible in the screenshot even though the feature name says CRUD.
- Delete either removes the coupon from the list or marks it unavailable; exact database behavior must be confirmed.
- Coupon code case sensitivity is not specified. This draft assumes uniqueness should be case-insensitive to avoid duplicate business codes such as `SAVE10` and `save10`.
- Maximum coupon code length is not specified. This draft marks max-length tests as assumptions to verify.
- Percent discount upper limit is not specified. This draft assumes percent values should be in the range `1` to `100`.
- Fixed discount upper limit is not specified. This draft assumes any positive fixed amount is accepted unless business rules define a maximum.
- Expiration date rule is not specified. This draft assumes the field is required and should accept the current date or a future date for a newly created active coupon.

## 2. Input / Output Identification

### Inputs

| No. | Input | Type | Required? | Source | Constraint / Rule | Notes |
|---:|---|---|---|---|---|---|
| 1 | `code` | Text | Yes | Admin create coupon form | Required and unique | Case sensitivity and max length must be verified. |
| 2 | `type` | Enum | Yes | Admin create coupon form | Allowed values: `percent`, `fixed` | UI labels may display as percentage/fixed in Vietnamese. |
| 3 | `discount_value` | Number | Yes | Admin create coupon form | Must be positive | Percent upper bound is assumed to be 100. |
| 4 | `expired_at` | Date | Yes | Admin create coupon form | Required | Valid date range must be verified. |
| 5 | `min_order_amount` | Money/number | Yes | Admin create coupon form | Must be `>= 0` | Currency appears to be VND. |
| 6 | `max_uses_per_user` | Integer | Yes | Admin create coupon form | Must be `>= 1` | Decimal handling must be verified. |
| 7 | Delete action | Button/action | Yes for delete flow | Coupon table row | Existing coupon selected for deletion | Confirmation behavior must be verified. |
| 8 | Coupon list state | Existing data | Yes for view/delete flows | System database/seed data | Coupon records can be active or expired | Existing codes shown in screenshot include `SAVE10`, `BIGBUY`, `VIP100`, and `EXPIRED`. |

### Outputs

| No. | Output | Trigger | Expected Behavior | Notes |
|---:|---|---|---|---|
| 1 | Created coupon row | Admin submits valid create form | New coupon appears in the coupon list with correct values. | Exact success message is not specified. |
| 2 | Validation error | Admin submits missing or invalid fields | Coupon is not created and field/form error is shown. | Exact message text must be verified. |
| 3 | Duplicate code error | Admin submits an existing coupon code | Coupon is not created and duplicate code error is shown. | Use existing code such as `SAVE10` only if present in the test environment. |
| 4 | Coupon list | Admin opens coupon management page | Existing coupons are displayed with code, type, value, minimum order, expiration, uses/user, and action. | View/read behavior. |
| 5 | Expired status | Coupon expiration date is in the past | Coupon is displayed as expired or otherwise unavailable. | Screenshot shows an expired row label. |
| 6 | Deleted coupon state | Admin deletes an existing coupon | Coupon is removed from list or marked deleted/unavailable. | Exact behavior must be verified. |

## 3. Domain Rule Identification

| Rule ID | Field / Condition | Valid Rule | Invalid Condition | Error Message / Expected Handling |
|---|---|---|---|---|
| FR17-R01 | Admin access | Authenticated admin can access coupon management. | Unauthenticated or non-admin user accesses page. | Access is denied or redirected. |
| FR17-R02 | `code` required | Non-empty coupon code is provided. | Empty or whitespace-only code. | Reject creation and show required-field validation. |
| FR17-R03 | `code` unique | Code does not already exist. | Code duplicates an existing coupon. | Reject creation and show duplicate-code validation. |
| FR17-R04 | `type` required/allowed | Type is `percent` or `fixed`. | Missing type or unsupported type value. | Reject creation and show type validation. |
| FR17-R05 | `discount_value` required | Discount value is provided. | Empty value. | Reject creation and show required-field validation. |
| FR17-R06 | `discount_value` positive | Discount value is greater than 0. | Zero or negative value. | Reject creation and show positive-value validation. |
| FR17-R07 | Percent discount range | Percent discount is assumed valid from 1 to 100. | Percent value greater than 100. | Reject creation or cap behavior must be verified. |
| FR17-R08 | `expired_at` required | Expiration date is provided. | Empty expiration date. | Reject creation and show required-field validation. |
| FR17-R09 | Expiration date active rule | Assumed valid when date is today or future for a new active coupon. | Past expiration date for a new coupon. | Reject creation or create as expired; expected behavior must be verified. |
| FR17-R10 | `min_order_amount` required | Minimum order amount is provided. | Empty value. | Reject creation and show required-field validation. |
| FR17-R11 | `min_order_amount` lower bound | Minimum order amount is greater than or equal to 0. | Negative value. | Reject creation and show minimum-value validation. |
| FR17-R12 | `max_uses_per_user` required | Maximum uses per user is provided. | Empty value. | Reject creation and show required-field validation. |
| FR17-R13 | `max_uses_per_user` lower bound | Maximum uses per user is an integer greater than or equal to 1. | Zero, negative, or decimal value. | Reject creation and show usage-limit validation. |
| FR17-R14 | View coupon list | Existing coupons are readable by admin. | List fails to load or omits saved coupon. | Show correct list or error state. |
| FR17-R15 | Delete coupon | Existing coupon can be deleted by admin. | Delete target does not exist or request fails. | Do not delete unrelated records; show error if deletion fails. |

## 4. Equivalence Class Partitioning

| EC ID | Input / Condition | Class Type | Description | Representative Value | Expected Result |
|---|---|---|---|---|---|
| FR17-EC-001 | Admin role | Valid | Authenticated admin opens coupon management. | Admin user | Page displays coupon form and list. |
| FR17-EC-002 | Admin role | Invalid | Non-admin or unauthenticated user opens coupon management. | Guest user | Access is denied or redirected. |
| FR17-EC-003 | `code` | Valid | New non-empty unique code. | `NEW10` | Coupon can be created when other fields are valid. |
| FR17-EC-004 | `code` | Invalid | Empty code. | Empty string | Creation is rejected. |
| FR17-EC-005 | `code` | Invalid | Duplicate code. | `SAVE10` | Creation is rejected as duplicate. |
| FR17-EC-006 | `type` | Valid | Percent type. | `percent` | Coupon can be created when other fields are valid. |
| FR17-EC-007 | `type` | Valid | Fixed type. | `fixed` | Coupon can be created when other fields are valid. |
| FR17-EC-008 | `type` | Invalid | Unsupported type. | `free_shipping` | Creation is rejected. |
| FR17-EC-009 | `discount_value` | Valid | Positive percent discount within assumed range. | `10` | Coupon can be created when other fields are valid. |
| FR17-EC-010 | `discount_value` | Valid | Positive fixed discount. | `50000` | Coupon can be created when other fields are valid. |
| FR17-EC-011 | `discount_value` | Invalid | Missing discount value. | Empty | Creation is rejected. |
| FR17-EC-012 | `discount_value` | Invalid | Zero discount. | `0` | Creation is rejected. |
| FR17-EC-013 | `discount_value` | Invalid | Negative discount. | `-1` | Creation is rejected. |
| FR17-EC-014 | `discount_value` percent | Invalid | Percent discount above assumed maximum. | `101` | Creation is rejected or behavior must be verified. |
| FR17-EC-015 | `expired_at` | Valid | Required date in the future. | `2099-12-31` | Coupon can be created when other fields are valid. |
| FR17-EC-016 | `expired_at` | Invalid | Missing expiration date. | Empty | Creation is rejected. |
| FR17-EC-017 | `expired_at` | Invalid | Past expiration date for newly created active coupon. | `2020-01-01` | Creation is rejected or created as expired; behavior must be verified. |
| FR17-EC-018 | `min_order_amount` | Valid | Zero minimum order amount. | `0` | Coupon can be created when other fields are valid. |
| FR17-EC-019 | `min_order_amount` | Valid | Positive minimum order amount. | `300000` | Coupon can be created when other fields are valid. |
| FR17-EC-020 | `min_order_amount` | Invalid | Missing minimum order amount. | Empty | Creation is rejected. |
| FR17-EC-021 | `min_order_amount` | Invalid | Negative minimum order amount. | `-1` | Creation is rejected. |
| FR17-EC-022 | `max_uses_per_user` | Valid | Integer at least 1. | `1` | Coupon can be created when other fields are valid. |
| FR17-EC-023 | `max_uses_per_user` | Invalid | Zero uses per user. | `0` | Creation is rejected. |
| FR17-EC-024 | `max_uses_per_user` | Invalid | Negative uses per user. | `-1` | Creation is rejected. |
| FR17-EC-025 | `max_uses_per_user` | Invalid | Decimal uses per user. | `1.5` | Creation is rejected. |
| FR17-EC-026 | Coupon list | Valid | Existing coupons are displayed. | Seed coupon list | List shows coupon details. |
| FR17-EC-027 | Delete existing coupon | Valid | Admin deletes an existing coupon. | `NEW10` | Coupon is removed or unavailable after delete. |
| FR17-EC-028 | Delete missing coupon | Invalid | Admin attempts to delete a nonexistent coupon. | Deleted coupon ID | System handles request without deleting another coupon. |

### Additional Equivalence Classes

| EC ID | Input / Condition | Class Type | Description | Representative Value | Expected Result |
|---|---|---|---|---|---|
| FR17-EC-029 | `code` whitespace-only | Invalid | Covers FR17-DT-022: code contains only spaces and should be treated as empty after trimming. | `" "` | Coupon is rejected with required/invalid code validation and coupon is not created. |
| FR17-EC-030 | `code` leading/trailing spaces | Invalid | Covers FR17-DT-023: code contains spaces around an existing coupon code. | `" SAVE10 "` | Inconclusive - Requirement unclear: system should trim before uniqueness check or reject untrimmed input; it must not create a confusing duplicate. |
| FR17-EC-031 | `code` case sensitivity | Invalid | Covers FR17-DT-024: lowercase variant of an existing uppercase coupon code. | `save10` when `SAVE10` exists | Inconclusive - Requirement unclear: recommended behavior is case-insensitive duplicate rejection. |
| FR17-EC-032 | `code` special separator character | Valid | Covers FR17-DT-025: coupon code contains a separator character and allowed characters are not specified. | `SAVE_10` | Inconclusive - Requirement unclear because allowed coupon code characters are not specified. |
| FR17-EC-033 | `code` Unicode/Vietnamese characters | Valid | Covers FR17-DT-026: coupon code contains Vietnamese diacritics. | `GIẢM10` | Inconclusive - Requirement unclear because Unicode coupon code support is not specified. |
| FR17-EC-034 | API `discount_value` non-numeric string | Invalid | Covers FR17-DT-027: required numeric discount field receives a string. | `"abc"` | API rejects the request with a clear validation error and coupon is not created. |
| FR17-EC-035 | API `min_order_amount` non-numeric string | Invalid | Covers FR17-DT-028: required numeric minimum-order field receives a string. | `"abc"` | API rejects the request with a clear validation error and coupon is not created. |
| FR17-EC-036 | API `max_uses_per_user` non-numeric string | Invalid | Covers FR17-DT-029: required integer usage-limit field receives a string. | `"abc"` | API rejects the request with a clear validation error and coupon is not created. |
| FR17-EC-037 | API `expired_at` non-date string | Invalid | Covers FR17-DT-030: required date field receives a non-date string. | `"abc"` | API rejects the request with a clear date validation error and coupon is not created. |
| FR17-EC-038 | API `expired_at` impossible date | Invalid | Covers FR17-DT-031: required date field receives a syntactically date-like but impossible date. | `"2026-99-99"` | API rejects the request with a clear date validation error and coupon is not created. |

## 5. Domain Testing Test Cases

| Test Case ID | Objective | Preconditions | Test Data | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|
| FR17-DT-001 | Verify admin can view coupon management page and coupon list. | Admin account exists and is logged in. | Existing coupons available. | Open EShop Admin > Ma Giam Gia. | Coupon form and coupon table are displayed with coupon fields. | Coupon form and coupon table are displayed with coupon fields. | Passed |
| FR17-DT-002 | Verify admin can create a valid percent coupon. | Admin is logged in; code `NEW10` does not exist. | `code=NEW10`; `type=percent`; `discount_value=10`; `expired_at=2099-12-31`; `min_order_amount=0`; `max_uses_per_user=1` | Fill all fields and submit create coupon form. | Coupon is created and appears in the list with matching values. | Coupon is created and appears in the list with matching values. | Passed |
| FR17-DT-003 | Verify admin can create a valid fixed coupon. | Admin is logged in; code `FIXED50K` does not exist. | `code=FIXED50K`; `type=fixed`; `discount_value=50000`; `expired_at=2099-12-31`; `min_order_amount=300000`; `max_uses_per_user=2` | Fill all fields and submit create coupon form. | Coupon is created and appears in the list with matching values. | Coupon is created and appears in the list with matching values. | Pass|
| FR17-DT-004 | Verify empty coupon code is rejected. | Admin is logged in. | `code=` empty; other fields valid. | Leave code blank and submit create coupon form. | Coupon is not created and code required validation is shown. | Coupon is not created and code required validation is shown. | Pass |
| FR17-DT-005 | Verify duplicate coupon code is rejected. | Admin is logged in; coupon `SAVE10` exists. | `code=SAVE10`; other fields valid. | Enter existing code and submit create coupon form. | Coupon is not created and duplicate code validation is shown. | Coupon is not created and duplicate code validation is shown. | Pass |
| FR17-DT-006 | Verify unsupported coupon type is rejected. | Admin is logged in; unsupported type can be submitted through API/devtools or equivalent test interface. | `type=free_shipping`; other fields valid. | Submit create coupon request with unsupported type. | Coupon is not created and type validation is shown. | Coupon created | Failed |
| FR17-DT-007 | Verify missing discount value is rejected. | Admin is logged in. | `discount_value=` empty; other fields valid. | Leave discount value blank and submit create coupon form. | Coupon is not created and discount required validation is shown. | Coupon is not created and discount required validation is shown. | Pass |
| FR17-DT-008 | Verify zero discount value is rejected. | Admin is logged in. | `discount_value=0`; other fields valid. | Enter zero discount value and submit create coupon form. | Coupon is not created and positive discount validation is shown. | Coupon is created | Failed |
| FR17-DT-009 | Verify negative discount value is rejected. | Admin is logged in. | `discount_value=-1`; other fields valid. | Enter negative discount value and submit create coupon form. | Coupon is not created and positive discount validation is shown. | Coupon is created | Failed |
| FR17-DT-010 | Verify percent discount above assumed maximum is rejected. | Admin is logged in; percent upper limit confirmed as 100 or test marked for review. | `type=percent`; `discount_value=101`; other fields valid. | Enter percent discount over 100 and submit create coupon form. | Coupon is not created or the observed behavior is flagged for rule clarification. | Coupon is created | Failed |
| FR17-DT-011 | Verify missing expiration date is rejected. | Admin is logged in. | `expired_at=` empty; other fields valid. | Leave expiration date blank and submit create coupon form. | Coupon is not created and expiration required validation is shown. | Coupon is not created and expiration required validation is shown. | Pass |
| FR17-DT-012 | Verify missing expiration date is rejected. | Admin is logged in. | `expired_at=""` empty; other fields valid. | Leave expiration date blank and submit create coupon form. | Coupon is not created and expiration required validation is shown. | Coupon is created | Failed |
| FR17-DT-013 | Verify past expiration date handling for new coupon. | Admin is logged in; expected active-coupon date rule needs confirmation. | `expired_at=2020-01-01`; other fields valid. | Enter past expiration date and submit create coupon form. | Coupon is rejected or created as expired according to confirmed requirement. | Counpon is created | Failed |
| FR17-DT-014 | Verify missing minimum order amount is rejected. | Admin is logged in. | `min_order_amount=` empty; other fields valid. | Leave minimum order blank and submit create coupon form. | Coupon is not created and minimum order required validation is shown. | Counpon is created | Failed |
| FR17-DT-015 | Verify negative minimum order amount is rejected. | Admin is logged in. | `min_order_amount=-1`; other fields valid. | Enter negative minimum order and submit create coupon form. | Coupon is not created and minimum order validation is shown. | Coupon is created | Failed |
| FR17-DT-016 | Verify missing max uses per user is rejected. | Admin is logged in. | `max_uses_per_user=` empty; other fields valid. | Leave max uses per user blank and submit create coupon form. | Coupon is not created and max uses required validation is shown. | Coupon is not created and max uses required validation is shown. | Passed |
| FR17-DT-017 | Verify zero max uses per user is rejected. | Admin is logged in. | `max_uses_per_user=0`; other fields valid. | Enter zero max uses per user and submit create coupon form. | Coupon is not created and max uses lower-bound validation is shown. | Counpon is created | Failed |
| FR17-DT-018 | Verify decimal max uses per user is rejected. | Admin is logged in. | `max_uses_per_user=1.5`; other fields valid. | Enter decimal max uses per user and submit create coupon form. | Coupon is not created and integer validation is shown. | Coupon is created | Failed |
| FR17-DT-019 | Verify admin can delete an existing coupon. | Admin is logged in; test coupon `NEW10` exists and is safe to delete. | `code=NEW10` | Click delete for the coupon and confirm if prompted. | Coupon is removed from the list or marked unavailable according to confirmed delete behavior. | Coupon is removed from the list or marked unavailable according to confirmed delete behavior. | Pass |
| FR17-DT-020 | Verify delete request for a nonexistent coupon is handled safely. | Admin is logged in; test submit delete for a missing coupon ID. | Nonexistent/deleted coupon ID. | Submit delete request for missing coupon ID. | System shows an error or no-op response and does not delete any other coupon. | Backend return "Coupon deleted" | Failed |
| FR17-DT-021 | Verify non-admin user cannot manage coupons. | Non-admin or logged-out user session is available. | Non-admin session. | Attempt to open coupon management page or call create/delete endpoint. | Access is denied and coupon data is not modified. | Access is denied and coupon data is not modified. | Passed |

### Additional Domain/API/Delete Test Cases

| Test Case ID | Objective | Preconditions | Test Data | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|
| FR17-DT-022 | Verify whitespace-only coupon code is rejected. | Admin is logged in. | `code=" "`; other fields valid. | Submit create coupon form or API request. | Coupon is rejected because code is empty after trimming; coupon is not created. | Coupon is created | Failed |
| FR17-DT-023 | Verify leading/trailing spaces are handled safely. | Admin is logged in; coupon `SAVE10` exists. | `code=" SAVE10 "`; other fields valid. | Submit create coupon form or API request. | Inconclusive - Requirement unclear: system should trim before uniqueness check or reject untrimmed code; it must not create a confusing duplicate. | Coupon is created | Inconclusive - Requirement unclear; potential defect |
| FR17-DT-024 | Verify coupon code uniqueness case sensitivity. | Admin is logged in; coupon `SAVE10` exists. | `code=save10`; other fields valid. | Submit create coupon form or API request. | Inconclusive - Requirement unclear: recommended behavior is case-insensitive duplicate rejection. | Coupon is created | Inconclusive - Requirement unclear; potential defect |
| FR17-DT-025 | Verify separator character in coupon code. | Admin is logged in; code `SAVE_10` does not exist. | `code=SAVE_10`; other fields valid. | Submit create coupon form or API request. | Inconclusive - Requirement unclear because allowed characters are not specified. | Counpon is created | Inconclusive - Requirement unclear; potential defect |
| FR17-DT-026 | Verify Unicode/Vietnamese coupon code handling. | Admin is logged in; code `GIẢM10` does not exist. | `code=GIẢM10`; other fields valid. | Submit create coupon form or API request. | Inconclusive - Requirement unclear because Unicode coupon code support is not specified. | Counpon is created | Inconclusive - Requirement unclear; potential defect |
| FR17-DT-027 | API rejects `discount_value` as string. | Admin API token/session is available. | Request body has `discount_value="abc"`; all other fields valid. | Send create coupon request through API/Postman. | API returns clear validation error; coupon is not created; no misleading success response. | Coupon is created, it note validate data type of variable | Failed |
| FR17-DT-028 | API rejects `min_order_amount` as string. | Admin API token/session is available. | Request body has `min_order_amount="abc"`; all other fields valid. | Send create coupon request through API/Postman. | API returns clear validation error; coupon is not created. | Coupon is created, it not validate data type of variable  | Failed |
| FR17-DT-029 | API rejects `max_uses_per_user` as string. | Admin API token/session is available. | Request body has `max_uses_per_user="abc"`; all other fields valid. | Send create coupon request through API/Postman. | API returns clear validation error; coupon is not created. | Coupon is created, it note validate data type of variable  | Failed |
| FR17-DT-030 | API rejects `expired_at` as non-date string. | Admin API token/session is available. | Request body has `expired_at="abc"`; all other fields valid. | Send create coupon request through API/Postman. | API returns clear date validation error; coupon is not created. | Coupon is created, it not validate data type of variable | Failed |
| FR17-DT-031 | API rejects impossible date. | Admin API token/session is available. | Request body has `expired_at="2026-99-99"`; all other fields valid. | Send create coupon request through API/Postman. | API returns clear date validation error; coupon is not created. | Coupon is created, it is not check valid day | Failed |

## 6. Boundary Identification

| Boundary ID | Field / Condition | Boundary Rule | Values to Test | Reason |
|---|---|---|---|---|
| FR17-BD-001 | `discount_value` lower bound | Must be positive. | `0`, `1`, `2` | Tests min - 1, min, and min + 1 when minimum valid value is 1. |
| FR17-BD-002 | Percent `discount_value` upper bound | Assumed maximum is 100. | `99`, `100`, `101` | Tests max - 1, max, and max + 1 for percent discounts. |
| FR17-BD-003 | Fixed `discount_value` lower money boundary | Must be positive. | `-1`, `0`, `1` | Covers negative value, zero, and minimum valid value for money. |
| FR17-BD-004 | `min_order_amount` lower bound | Must be greater than or equal to 0. | `-1`, `0`, `1` | Covers negative value, zero, and just above minimum. |
| FR17-BD-005 | `max_uses_per_user` lower bound | Must be integer greater than or equal to 1. | `0`, `1`, `2` | Tests min - 1, min, and min + 1. |
| FR17-BD-006 | `max_uses_per_user` integer rule | Must be whole number. | `0.9`, `1`, `1.1` | Tests just below/at/just above integer boundary. |
| FR17-BD-007 | `expired_at` active date boundary | Assumed valid from the current date onward for new active coupons. | `2026-06-21`, `2026-06-22`, `2026-06-23` | Tests before boundary, exactly at boundary, and after boundary using the project date `2026-06-22`. |
| FR17-BD-008 | `code` length lower boundary | Required non-empty code. | Empty, 1 character, 2 characters | Tests missing, min, and min + 1 if minimum valid length is 1. |
| FR17-BD-009 | `code` length upper boundary | Maximum length is not specified. | max - 1, max, max + 1 after requirement is confirmed | Boundary cannot be finalized until max length is known. |

## 7. Boundary Value Analysis Test Cases

| Test Case ID | Boundary Target | Preconditions | Test Data | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|
| FR17-BVA-001 | `discount_value` at lower invalid boundary | Admin is logged in. | `type=percent`; `discount_value=0`; other fields valid. | Submit create coupon form. | Coupon is rejected because discount value must be positive. | Coupon is created. | Failed |
| FR17-BVA-002 | `discount_value` at minimum valid boundary | Admin is logged in. | `type=percent`; `discount_value=1`; other fields valid. | Submit create coupon form. | Coupon is created. | Coupon is created. | Passed |
| FR17-BVA-003 | `discount_value` just above minimum | Admin is logged in. | `type=percent`; `discount_value=2`; other fields valid. | Submit create coupon form. | Coupon is created. | Coupon is created. | Passed |
| FR17-BVA-004 | Percent discount just below assumed maximum | Admin is logged in. | `type=percent`; `discount_value=99`; other fields valid. | Submit create coupon form. | Coupon is created if percent max is 100. | Coupon is created. | Passed |
| FR17-BVA-005 | Percent discount at assumed maximum | Admin is logged in. | `type=percent`; `discount_value=100`; other fields valid. | Submit create coupon form. | Coupon is created if percent max is 100. | Coupon is created | Passed |
| FR17-BVA-006 | Percent discount above assumed maximum | Admin is logged in. | `type=percent`; `discount_value=101`; other fields valid. | Submit create coupon form. | Coupon is rejected or requirement gap is recorded if accepted. | Coupon is created | Failed |
| FR17-BVA-007 | Fixed discount negative money boundary | Admin is logged in. | `type=fixed`; `discount_value=-1`; other fields valid. | Submit create coupon form. | Coupon is rejected because fixed discount must be positive. | Counpon is created | Failed |
| FR17-BVA-008 | Fixed discount zero boundary | Admin is logged in. | `type=fixed`; `discount_value=0`; other fields valid. | Submit create coupon form. | Coupon is rejected because fixed discount must be positive. | Counpon is created | Failed |
| FR17-BVA-009 | Fixed discount minimum valid money boundary | Admin is logged in| `type=fixed`; `discount_value=1`; other fields valid. | Submit create coupon form. | Coupon is created. | Coupon is created | Pass |
| FR17-BVA-010 | `min_order_amount` below lower boundary | Admin is logged in. | `min_order_amount=-1`; other fields valid. | Submit create coupon form. | Coupon is rejected because minimum order cannot be negative. | Coupon is created | Failed |
| FR17-BVA-011 | `min_order_amount` at lower boundary | Admin is logged in | `min_order_amount=0`; other fields valid. | Submit create coupon form. | Coupon is created. | Coupon is created | Passed |
| FR17-BVA-012 | `min_order_amount` just above lower boundary | Admin is logged in. | `min_order_amount=1`; other fields valid. | Submit create coupon form. | Coupon is created. | Coupon is created | Passed |
| FR17-BVA-013 | `max_uses_per_user` below lower boundary | Admin is logged in. | `max_uses_per_user=0`; other fields valid. | Submit create coupon form. | Coupon is rejected because max uses per user must be at least 1. | Coupon is created | Failed |
| FR17-BVA-014 | `max_uses_per_user` at lower boundary | Admin is logged in. | `max_uses_per_user=1`; other fields valid. | Submit create coupon form. | Coupon is created. | Coupon is created | Passed |
| FR17-BVA-015 | `max_uses_per_user` just above lower boundary | Admin is logged in. | `max_uses_per_user=2`; other fields valid. | Submit create coupon form. | Coupon is created. | Coupon is created | Passed |
| FR17-BVA-016 | `max_uses_per_user` decimal below/near boundary | Admin is logged in. | `max_uses_per_user=1.1`; other fields valid. | Submit create coupon form. | Coupon is rejected because max uses per user must be an integer. | Coupon is created | Failed |
| FR17-BVA-017 | `expired_at` before active-date boundary | Admin is logged in. | `expired_at=2026-06-21`; other fields valid. | Submit create coupon form. | Coupon is rejected or created as expired according to confirmed requirement. | Coupon is created | Failed |
| FR17-BVA-018 | `expired_at` exactly at active-date boundary | Admin is logged in; code `TODAY01` does not exist. | `expired_at=2026-06-22`; other fields valid. | Submit create coupon form. | Coupon is created if same-day expiration is allowed. | Coupon is created | Passed |
| FR17-BVA-019 | `expired_at` after active-date boundary | Admin is logged in; code `TOMOR01` does not exist. | `expired_at=2026-06-23`; other fields valid. | Submit create coupon form. | Coupon is created. | Coupon is created | Passed |
| FR17-BVA-020 | `code` empty lower boundary | Admin is logged in. | `code=` empty; other fields valid. | Submit create coupon form. | Coupon is rejected because code is required. | Coupon is rejected because code is required. | Passed |
| FR17-BVA-021 | `code` minimum non-empty boundary | Admin is logged in; code `A` does not exist; min code length confirmed as 1. | `code=A`; other fields valid. | Submit create coupon form. | Coupon is created if one-character codes are allowed; otherwise record requirement gap. | Coupon is created | Passed |
| FR17-BVA-022 | `code` max length boundary placeholder | Admin is logged in; max code length is confirmed before execution. | `code=max+1 length`; other fields valid. | Submit create coupon form. | Coupon is rejected if it exceeds confirmed max length. | Coupon was created successfully with a 256-character code. | Inconclusive - max length is not specified in requirement. |
| FR17-BVA-023 | `code` empty lower boundary | Admin is logged in. | `code=""` empty; other fields valid. | Submit create coupon form. | Coupon is rejected because code is required. | Coupon is rejected because code is required. | Passed |


## 8. Test Execution Table

| Feature ID | Designed | Executed | Passed | Failed | Not Executed | Bugs Found |
|---|---:|---:|---:|---:|---:|---:|
| FR-17 | 114 | 44 | 24 | 19 | 70 | 19 |

Note: One previously executed boundary case is marked inconclusive because the maximum coupon code length is not specified. Newly added cases use `Actual Result = TBD` and `Status = Not Executed`.

## 10. AI Gap Analysis

## 11. Human Review Notes

```text
Human Review:
- Accepted:
- Modified:
- Removed:
- Added:
- Assumptions to verify:
  - Is coupon code uniqueness case-sensitive?
  - What are the allowed characters and max length for coupon code?
  - Is percent discount limited to 100?
  - Can admin create a coupon with a past expiration date?
  - Is today's date accepted as an expiration date?
  - Is update/edit part of FR-17 scope?
  - Does delete hard-delete, soft-delete, or require confirmation?
  - What are the exact validation messages?
  - Should coupon code be trimmed before uniqueness validation and storage?
  - Should coupon code uniqueness be case-insensitive?
  - Are hyphen, underscore, @, and Vietnamese/Unicode characters allowed in coupon codes?
  - What is the maximum coupon code length?
  - Should decimal values be allowed for discount_value and min_order_amount?
  - What API status code and response body should validation errors return?
  - What should happen when deleting a coupon already used by an order?
  - What should happen when deleting the same coupon twice or deleting a nonexistent ID?
  - How should failed delete requests prove that unrelated coupons were not changed?
```

## 12. Suggested Git Commit Message

```text
Expand FR-17 coupon validation API and delete safety tests
```
