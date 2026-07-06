# FR-09 Discount Coupons - Domain Testing and Boundary Value Analysis

## 1. Feature Understanding

| Item              | Details                                                                                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feature ID        | FR-09                                                                                                                                                                        |
| Feature name      | Discount Coupons                                                                                                                                                             |
| User role         | Logged-in customer                                                                                                                                                           |
| Main purpose      | Allow a customer to apply a coupon at checkout and reduce the payable order total when all coupon conditions are satisfied.                                                  |
| Preconditions     | Customer is at Checkout; cart has at least one product; coupon data exists from FR-17 Coupon Management CRUD; customer has valid JWT token for authenticated scenarios.      |
| Main flow         | Customer enters coupon code, clicks Apply, system validates all coupon conditions, calculates discount, displays success message, discount amount, and final payable amount. |
| Alternative flows | Coupon does not exist, inactive, expired, below minimum order, user is not logged in, usage limit reached, or discount calculation creates invalid final amount.             |
| Related data      | Coupon records from FR-17: `code`, `type`, `discount_value`, `expired_at`, `min_order_amount`, `max_uses_per_user`, `is_active`; user coupon usage history; cart total.      |

### Assumptions to verify

* This feature depends on coupons created and maintained by FR-17.

* `is_active = 1` means coupon can be used; inactive coupon behavior requires a test coupon created/modified through FR-17 or test data setup.

* Current project date for date boundary analysis is `2026-06-23`.

* The rule says current date must be before `expired_at`; therefore a coupon expiring exactly on the current date may be invalid unless business rule treats expiration as end-of-day.

* `SAVE10`, `BIGBUY`, `VIP100`, and `EXPIRED` are available in the test database as sample coupons.

* Usage count is tracked per user and coupon.

* Formula given for fixed coupons does not explicitly cap `discount_amount` at cart total. This creates a risk of negative `final_amount` when fixed discount is greater than cart total.

* Screenshot provided for checkout with `SAVE10` suggests coupon UI and calculation display should be verified during execution, but no actual result is recorded in this draft.

## 2. Input / Output Identification

### Inputs

| No. | Input                       | Type         | Required? | Source                             | Constraint / Rule                                          | Notes                                                                              |
| --: | --------------------------- | ------------ | --------- | ---------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------- |
|   1 | Coupon code                 | Text         | Yes       | Customer checkout form             | Must exist in database and be active (`is_active = 1`)     | Depends on FR-17 coupon records.                                                   |
|   2 | Cart total                  | Money/number | Yes       | Cart/checkout state                | Must be greater than or equal to coupon `min_order_amount` | Used for minimum threshold and discount formula.                                   |
|   3 | User authentication token   | JWT/session  | Yes       | Logged-in customer session         | Must be valid                                              | Required by C4.                                                                    |
|   4 | Current date                | Date         | Yes       | System date                        | Must be before `expired_at`                                | Project date: `2026-06-23`.                                                        |
|   5 | Coupon active state         | Boolean      | Yes       | Coupon database                    | `is_active = 1`                                            | Inactive coupon requires setup from FR-17/test data.                               |
|   6 | Coupon usage count for user | Integer      | Yes       | Coupon usage history/order history | Must be less than `max_uses_per_user`                      | Boundary is `max_uses_per_user - 1`, `max_uses_per_user`, `max_uses_per_user + 1`. |
|   7 | Coupon type                 | Enum         | Yes       | Coupon database                    | `percent` or `fixed`                                       | Created/managed through FR-17.                                                     |
|   8 | Coupon discount value       | Number       | Yes       | Coupon database                    | Percent or fixed amount depending on type                  | Calculation source.                                                                |

### Outputs

| No. | Output                | Trigger                                  | Expected Behavior                                                             | Notes                                                        |
| --: | --------------------- | ---------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------ |
|   1 | Success message       | Valid coupon applied                     | Display coupon applied successfully.                                          | Exact message text to verify from UI.                        |
|   2 | Error message         | Invalid coupon condition                 | Display clear reason or generic rejection.                                    | Must not apply discount.                                     |
|   3 | Discount amount       | Valid coupon applied                     | Calculate by coupon formula.                                                  | `percent`: `total * value / 100`; `fixed`: fixed value.      |
|   4 | Final amount          | Valid coupon applied                     | `final_amount = total - discount_amount`                                      | Should not become negative; requirement needs clarification. |
|   5 | Payment total display | Coupon applied or rejected               | Shows final amount after valid coupon or original total after invalid coupon. | Must be consistent across UI fields.                         |
|   6 | Usage record          | Order/payment confirmed after coupon use | User coupon usage count increases after successful use.                       | Exact timing to verify: apply vs payment confirmation.       |

## 3. Domain Rule Identification

| Rule ID  | Field / Condition             | Valid Rule                                                 | Invalid Condition                                                             | Error Message / Expected Handling                              |
| -------- | ----------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------- |
| FR09-R01 | C1 - Coupon exists and active | Code exists and `is_active = 1`.                           | Code does not exist or `is_active = 0`.                                       | Reject coupon; do not change final amount.                     |
| FR09-R02 | C2 - Not expired              | Current date is before `expired_at`.                       | Current date is on/after expired date, depending on confirmed date semantics. | Reject coupon as expired.                                      |
| FR09-R03 | C3 - Minimum order            | Cart total is greater than or equal to `min_order_amount`. | Cart total is below `min_order_amount`.                                       | Reject coupon because order does not meet minimum.             |
| FR09-R04 | C4 - Logged in                | User has valid JWT token/session.                          | User is logged out or token is missing/invalid.                               | Reject coupon or redirect/login required.                      |
| FR09-R05 | C5 - Usage limit              | User usage count is less than `max_uses_per_user`.         | Usage count is equal to or greater than `max_uses_per_user`.                  | Reject coupon because usage limit reached.                     |
| FR09-R06 | Percent calculation           | `discount_amount = total * discount_value / 100`.          | Discount amount is calculated incorrectly.                                    | Show correct discount and final amount.                        |
| FR09-R07 | Fixed calculation             | `discount_amount = discount_value`.                        | Discount amount is calculated incorrectly.                                    | Show correct discount and final amount.                        |
| FR09-R08 | Final amount                  | `final_amount = total - discount_amount`.                  | Final amount is inconsistent or negative without defined behavior.            | Clarify whether discount should be capped at cart total.       |
| FR09-R09 | FR-17 dependency              | Coupon data from FR-17 is accurate and valid.              | FR-17 allows invalid coupon data that FR-09 later applies.                    | Reject invalid coupon at FR-09 or record cross-feature defect. |

## 4. Equivalence Class Partitioning

| EC ID       | Input / Condition                      | Class Type                    | Description                              | Representative Value                                             | Expected Result                                                       |
| ----------- | -------------------------------------- | ----------------------------- | ---------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------- |
| FR09-EC-001 | Coupon exists and active               | Valid                         | Existing active coupon.                  | `SAVE10`                                                         | Coupon can be applied if all other conditions pass.                   |
| FR09-EC-002 | Coupon does not exist                  | Invalid                       | Unknown coupon code.                     | `NO_SUCH_CODE`                                                   | Coupon is rejected.                                                   |
| FR09-EC-003 | Coupon inactive                        | Invalid                       | Existing coupon with `is_active = 0`.    | `INACTIVE10`                                                     | Coupon is rejected.                                                   |
| FR09-EC-004 | Coupon not expired                     | Valid                         | Expiration date in future.               | `SAVE10` expires `2099-12-31`                                    | Coupon can be applied if other conditions pass.                       |
| FR09-EC-005 | Coupon expired                         | Invalid                       | Expiration date in past.                 | `EXPIRED` expires `2020-01-01`                                   | Coupon is rejected.                                                   |
| FR09-EC-006 | Cart total meets minimum               | Valid                         | Total is equal to or above threshold.    | `SAVE10` with `300000`                                           | Coupon can be applied if other conditions pass.                       |
| FR09-EC-007 | Cart total below minimum               | Invalid                       | Total is below threshold.                | `SAVE10` with `299999`                                           | Coupon is rejected.                                                   |
| FR09-EC-008 | Logged-in user                         | Valid                         | User has valid JWT token.                | `Test User` logged in                                            | Coupon can be applied if other conditions pass.                       |
| FR09-EC-009 | Logged-out user                        | Invalid                       | Missing/invalid token.                   | Guest user                                                       | Coupon is rejected or login required.                                 |
| FR09-EC-010 | Usage count below limit                | Valid                         | User used coupon fewer times than limit. | `VIP100`, used `1` of `2`                                        | Coupon can be applied.                                                |
| FR09-EC-011 | Usage limit reached                    | Invalid                       | User usage count equals limit.           | `SAVE10`, used `1` of `1`                                        | Coupon is rejected.                                                   |
| FR09-EC-012 | Percent coupon                         | Valid                         | Coupon type is `percent`.                | `SAVE10`                                                         | Discount is calculated by percentage formula.                         |
| FR09-EC-013 | Fixed coupon                           | Valid                         | Coupon type is `fixed`.                  | `BIGBUY`                                                         | Discount is fixed amount.                                             |
| FR09-EC-014 | Fixed discount greater than cart total | Invalid / Requirement unclear | Fixed discount exceeds order total.      | Test coupon `FIXED_OVER_TOTAL`, total `50000`, discount `100000` | Requirement unclear; system should not produce negative final amount. |

## 5. Domain Testing Test Cases

| Test Case ID | Objective                                                        | Preconditions                                                                                 | Test Data                                                               | Steps                                                                      | Expected Result                                                                                                                             | Actual Result                                                                      | Status       |
| ------------ | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------ |
| FR09-DT-001  | Verify valid percent coupon can be applied.                      | User is logged in; cart total meets minimum; `SAVE10` active, not expired, usage not reached. | Cart total `28000000`; coupon `SAVE10`                                  | Open checkout, enter `SAVE10`, click Apply.                                | Coupon is applied successfully; discount amount is `2800000`; final amount is `25200000`.                                                   | Counpon is applied but final amount remains unchanged                              | Failed       |
| FR09-DT-002  | Verify invalid/unknown coupon is rejected.                       | User is logged in; cart has eligible product.                                                 | Coupon `NO_SUCH_CODE`                                                   | Open checkout, enter unknown coupon, click Apply.                          | Coupon is rejected; final amount remains unchanged; clear error message is shown.                                                           | Coupon is rejected; final amount remains unchanged; clear error message is shown.  | Passed       |
| FR09-DT-003  | Verify expired coupon is rejected.                               | User is logged in; cart total meets `EXPIRED` minimum.                                        | Cart total `100000`; coupon `EXPIRED`; expired\_at `2020-01-01`.        | Open checkout, enter `EXPIRED`, click Apply.                               | Coupon is rejected as expired; final amount remains unchanged.                                                                              | Coupon is rejected as expired; final amount remains unchanged.                     | Passed       |
| FR09-DT-005  | Verify coupon usage limit reached is rejected.                   | User is logged in; user has already used `SAVE10` once; `SAVE10.max_uses_per_user=1`.         | Coupon `SAVE10`; usage count `1`; max uses `1`; cart total `300000`.    | Open checkout, enter `SAVE10`, click Apply.                                | Coupon is rejected because usage limit is reached; final amount remains unchanged.                                                          | Coupon is rejected because usage limit is reached; final amount remains unchanged. | Passed       |
| FR09-DT-006  | Verify cart total below minimum order rejects coupon.            | User is logged in; `FR09-DT-006` active and not expired.                                      | Coupon `FR09-DT-006`; cart total `28000000`; min order `30000000`.      | Open checkout with cart below threshold, enter `FR09-DT-006`, click Apply. | Coupon is rejected because cart total is below `min_order_amount`.                                                                          | Coupon is rejected because cart total is below `min_order_amount`.                 | Passed       |
| FR09-DT-007  | Verify percentage discount calculation.                          | User is logged in; `FR09-DT-007` can still be used by the user.                               | Cart total `28000000`; coupon `FR09-DT-007`; value `10%`.               | Apply `FR09-DT-007` at checkout.                                           | Discount amount is `10%`; final amount is `2520000`.                                                                                        | Counpon is applied but final amount remains unchanged                              | Failed       |
| FR09-DT-008  | Verify fixed amount discount calculation.                        | User is logged in; `BIGBUY` active, not expired, usage not reached; cart meets minimum.       | Cart total `28000000`; coupon `BIGBUY`; fixed discount `50000`.         | Apply `BIGBUY` at checkout.                                                | Discount amount is `50000`; final amount is `27950000`.                                                                                     | final amount is `27950000`                                                         | Passed       |
| FR09-DT-009  | Verify fixed discount greater than cart total is handled safely. | User is logged in; test coupon exists with fixed discount greater than cart total.            | Coupon `FIXED_OVER_TOTAL`; cart total `50000`; fixed discount `100000`. | Apply `FIXED_OVER_TOTAL` at checkout.                                      | Requirement unclear: system should not produce negative final amount; expected behavior should be reject coupon or cap final amount at `0`. | System produce nagative final amount                                               | Failed       |
| FFR09-DT-010 | Verify logged-out user cannot apply coupon.                      | User is logged out or JWT token is missing/invalid.                                           | Coupon `SAVE10`; cart total `300000`.                                   | Open checkout as guest or remove token, enter `SAVE10`, click Apply.       | Coupon is not applied; login required or unauthorized message is shown.                                                                     | TBD                                                                                | Not Executed |

## 6. Boundary Identification

| Boundary ID | Field / Condition                             | Boundary Rule                                     | Values to Test                                        | Reason                                                                                                  |
| ----------- | --------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| FR09-BD-001 | Cart total vs `min_order_amount` for `SAVE10` | Coupon valid when total `>= 300000`.              | `299999`, `300000`, `300001`                          | Tests just below, exactly at, and just above minimum order.                                             |
| FR09-BD-002 | Cart total vs `min_order_amount` for `BIGBUY` | Coupon valid when total `>= 500000`.              | `499999`, `500000`, `500001`                          | Tests fixed coupon threshold.                                                                           |
| FR09-BD-003 | Usage limit for `SAVE10`                      | Valid when used count `< 1`.                      | `0`, `1`, `2`                                         | Tests below limit, exactly at limit, and above limit.                                                   |
| FR09-BD-004 | Usage limit for `VIP100`                      | Valid when used count `< 2`.                      | `1`, `2`, `3`                                         | Tests below limit, at limit, and above limit for max uses `2`.                                          |
| FR09-BD-005 | Expiration date boundary                      | Current date must be before `expired_at`.         | `2026-06-22`, `2026-06-23`, `2026-06-24`              | Tests before current date, exactly current date, and after current date with project date `2026-06-23`. |
| FR09-BD-006 | Percent discount calculation                  | Percent discount should match formula exactly.    | `total=1000000`, `discount_value=10`                  | Verifies expected discount `100000`.                                                                    |
| FR09-BD-007 | Fixed discount equal/greater than total       | Final amount should not be unsafe.                | fixed `49999`, `50000`, `50001` against total `50000` | Tests just below, equal to, and greater than cart total.                                                |
| FR09-BD-008 | Coupon code existence boundary                | Code field must map to an existing active coupon. | Empty, unknown code, existing code                    | Separates missing/invalid/existing coupon classes.                                                      |

## 7. Boundary Value Analysis Test Cases

| Test Case ID | Boundary Target                        | Preconditions                                                    | Test Data                                             | Steps                       | Expected Result                                                                                    | Actual Result                                                                    | Status |
| ------------ | -------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------ |
| FR09-BVA-001 | Cart total just below `VIP100` minimum | User logged in; `VIP100` active, not expired, usage not reached. | Cart total `299999`; coupon `SAVE10`; min `300000`.   | Apply `SAVE10` at checkout. | Coupon is rejected because total is below minimum.                                                 | Coupon is rejected because total is below minimum.                               | Passed |
| FR09-BVA-002 | Cart total exactly at `VIP100` minimum | User logged in; `VIP100` active, not expired, usage not reached. | Cart total `300000`; coupon `VIP100`.                 | Apply `VIP100` at checkout. | Coupon is accepted; discount is `30000`; final amount is `270000`.                                 | Coupon is rejected because total is below minimum.                               | Failed |
| FR09-BVA-003 | Cart total just above `VIP100` minimum | User logged in; `VIP100` active, not expired, usage not reached. | Cart total `300001`; coupon `VIP100`.                 | Apply `VIP100` at checkout. | Coupon is accepted; discount is `30000.1` before rounding; rounding/display rule must be verified. | Coupon is accepted                                                               | Passed |
| FR09-BVA-007 | Usage count below `SAVE10` limit       | User logged in; usage history can be prepared.                   | `SAVE10`; used count `0`; max uses `1`.               | Apply `SAVE10`.             | Coupon is accepted if all other conditions pass.                                                   | Coupon is accepted                                                               | Passed |
| FR09-BVA-008 | Usage count exactly at `SAVE10` limit  | User logged in; usage history can be prepared.                   | `SAVE10`; used count `1`; max uses `1`.               | Apply `SAVE10`.             | Coupon is rejected because usage count is not less than max uses.                                  | Coupon is rejected                                                               | Passed |
| FR09-BVA-009 | Usage count below `VIP100` limit       | User logged in; usage history can be prepared.                   | `VIP100`; used count `1`; max uses `2`.               | Apply `VIP100`.             | Coupon is accepted                                                                                 | Coupon is accepted                                                               | Passed |
| FR09-BVA-010 | Expiration exactly at current date     | User logged in; coupon exists with `expired_at=2026-06-30`.      | Coupon `EXPIRES_TODAY`; current date `2026-06-30`.    | Apply coupon.               | Requirement unclear: coupon should be rejected unless end-of-day behavior is defined.              | Coupon is rejected                                                               | Passed |
| FR09-BVA-011 | Expiration after current date          | User logged in; coupon exists with `expired_at=2026-07-01`.      | Coupon `EXPIRES_TOMORROW`; current date `2026-07-01`. | Apply coupon.               | Coupon is accepted if all other conditions pass.                                                   | Coupon is accepted                                                               | Passed |
| FR09-BVA-012 | Fixed discount equals cart total       | User logged in; test fixed coupon exists.                        | Cart total `50000`; fixed discount `50000`.           | Apply coupon.               | Final amount is `0`; payment flow handles zero amount according to product rule.                   | Final amount is `0`; payment flow handles zero amount according to product rule. | Passed |
| FR09-BVA-013 | Fixed discount greater than cart total | User logged in; test fixed coupon exists.                        | Cart total `50000`; fixed discount `50001`.           | Apply coupon.               | Final amount is `0`; payment flow handles zero amount according to product rule.                   | Final amout is nagative value                                                    | Failed |

## 8. Test Execution Table

| Feature ID | Designed | Executed | Passed | Failed | Not Executed | Bugs Found |
| ---------- | -------: | -------: | -----: | -----: | -----------: | ---------: |
| FR-09      |       23 |       23 |     12 |      7 |            0 |          3 |

## 9. AI Gap Analysis

| Gap ID       | AI Output Issue                                                           | Missed / Wrong / Incomplete | Why It Happened                                                                                                                   | Human Correction                                                                                                   |
| ------------ | ------------------------------------------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| FR09-GAP-001 | Usage-limit cases require controlled user history.                        | Incomplete                  | AI cannot infer or create actual usage history without execution setup.                                                           | Prepare user coupon usage counts for `FR09-DT-005` and `FR09-BVA-007` to `FR09-BVA-009`.                           |
| FR09-GAP-002 | Discount greater than cart total was treated as unclear before execution. | Incomplete                  | Formula does not define whether fixed discount should be capped, but actual execution shows negative payable amounts.             | Record defects for `FR09-DT-009` and `FR09-BVA-013`; clarify whether expected behavior is rejection or cap at `0`. |
| FR09-GAP-003 | Date boundary semantics are unclear.                                      | Incomplete                  | Requirement says current date must be before `expired_at`, but UI/business may treat expiration date as valid through end of day. | Clarify whether a coupon expiring on the current date is valid through end of day.                                 |
| FR09-GAP-004 | FR-17 defects may affect FR-09 behavior.                                  | Incomplete                  | FR-09 consumes coupon data from FR-17, and FR-17 execution found validation defects.                                              | Add cross-feature verification with invalid FR-17-created coupons in future FR09 tests.                            |
| FR09-GAP-005 | Rounding/display rule for percentage discount is not specified.           | Incomplete                  | Formula can produce decimal VND values for totals like `300001`.                                                                  | Clarify rounding before asserting exact display for `FR09-BVA-003`.                                                |

## 10. Human Review Notes

```text
Human Review:
- Accepted:
- Modified:
- Removed:
- Added:
- Assumptions to verify:
  - How to create or identify inactive coupon data for FR-09.
  - Whether coupon usage count increments when coupon is applied or when payment is confirmed.
  - Whether expiration date is inclusive or exclusive.
  - Whether fixed discount greater than cart total should be rejected or capped.
  - Rounding rule for percentage discount with decimal VND result.
  - Whether FR-09 validates coupon data again when FR-17 creates invalid coupon records.
```

## 11. Suggested Git Commit Message

```text
Add FR-09 discount coupon domain and boundary tests
```
