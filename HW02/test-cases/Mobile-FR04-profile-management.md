# Mobile-FR04 Profile Management - Domain Testing and Boundary Value Analysis

## 1. Feature Understanding

| Item              | Details                                                                                                                                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feature ID        | Mobile-FR04                                                                                                                                                                                                                              |
| Feature name      | Profile Management                                                                                                                                                                                                                       |
| User role         | Logged-in customer                                                                                                                                                                                                                       |
| Main purpose      | Allow a logged-in user to view/update their own profile information and review their order history from the mobile profile screen.                                                                                                       |
| Preconditions     | User is authenticated and opens the EShop Mobile profile page.                                                                                                                                                                           |
| Main flow         | User opens profile, reviews email, edits full name, phone number, and default shipping address, taps `Cập nhật` to save, and views `Lịch sử đơn hàng`.                                                                                   |
| Alternative flows | Invalid phone number is rejected; email remains non-editable; user cannot update another account; user cannot self-change `role`; order history can be empty; pending orders can show a cancel action; user logs out by tapping `Thoat`. |
| Related data      | Email, full name, phone number, default shipping address, authenticated user ID/session, user role, order ID, order date, total amount, order status, and cancel action.                                                                 |

### Assumptions to verify

* Full name is required, but minimum and maximum length are not specified.

* Default shipping address can be empty unless the requirements say it is required for checkout.

* Maximum shipping address length is not specified; `255` characters is used as a practical boundary to verify.

* Phone number must start with `0` and contain only digits with total length from 10 to 11 digits.

* Email is shown on the screen but must not be changed through the mobile UI.

* Profile update must apply only to the authenticated user's own account.

* `role` is not visible in the UI and must not be changeable through profile update data.

* Order history should show only orders belonging to the logged-in user.

* Order date, total amount, and status formatting rules must be confirmed.

* The screenshot shows a pending order with `Hủy đơn`; cancel eligibility by status must be verified.

* Screenshot is used as evidence only for visible order-history display fields; it does not prove cancel behavior or hidden authorization behavior.

## 2. Input / Output Identification

### Inputs

| No. | Input                       | Type                | Required?           | Source                | Constraint / Rule                                       | Notes                                            |
| --: | --------------------------- | ------------------- | ------------------- | --------------------- | ------------------------------------------------------- | ------------------------------------------------ |
|   1 | Email                       | Text                | Yes for display     | Existing user profile | Non-editable through UI                                 | Screenshot shows email field disabled/read-only. |
|   2 | Full name                   | Text                | Yes                 | Profile update form   | User can update own full name                           | Length and character rules must be verified.     |
|   3 | Phone number                | Text                | No/conditional      | Profile update form   | If provided, starts with `0`, digits only, length 10-11 | Placeholder example: `0912345678`.               |
|   4 | Default shipping address    | Textarea            | No/conditional      | Profile update form   | User can update own default shipping address            | Requiredness and max length must be verified.    |
|   5 | Update action               | Button/action       | Yes for save flow   | `Cập nhật` button     | Saves valid editable fields for current user only       | Must not change email or role.                   |
|   6 | Logout action               | Button/action       | Yes for logout flow | `Thoat` button        | Ends current user session                               | Not the main update flow but visible on screen.  |
|   7 | Authenticated user identity | Session/context     | Yes                 | Login/session state   | User can update only their own profile                  | Prevents cross-account profile changes.          |
|   8 | Role attribute              | Hidden/system field | No UI input         | System/user record    | User cannot self-change role                            | Must not be accepted from profile UI data.       |
|   9 | Order history data          | Array/object        | No                  | Current user's orders | Each row should belong to the logged-in user            | Includes order number, date, total, and status.  |
|  10 | Cancel order action         | Button/action       | Conditional         | Pending order card    | Available only for cancellable orders                   | Screenshot shows `Hủy đơn` for `Chờ xác nhận`.   |

### Outputs

| No. | Output                   | Trigger                                        | Expected Behavior                                                                 | Notes                                               |
| --: | ------------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------- |
|   1 | Updated profile data     | User submits valid editable fields             | Full name, phone number, and default shipping address are saved for current user. | Email and role stay unchanged.                      |
|   2 | Validation error         | User submits invalid phone/name/address data   | Profile is not updated and a clear validation message is shown.                   | Exact message text must be verified.                |
|   3 | Read-only email field    | User views profile screen                      | Email is displayed but cannot be edited through UI.                               | Field may be disabled or read-only.                 |
|   4 | Authorization protection | User attempts to update another user's profile | Update is rejected and target account is unchanged.                               | May require API/devtools setup to verify beyond UI. |
|   5 | Role protection          | User attempts to self-change role              | Role remains unchanged and request is rejected/ignored.                           | Role control must not be exposed on profile screen. |
|   6 | Logout state             | User taps `Thoat`                              | User session ends and user is redirected/logged out.                              | Secondary visible behavior.                         |
|   7 | Order history list       | User opens profile page                        | User's orders are displayed under `Lịch sử đơn hàng`.                             | Screenshot shows `Đơn #1`.                          |
|   8 | Empty order state        | User has no orders                             | Clear no-order message is displayed.                                              | Earlier screenshot showed no orders.                |
|   9 | Cancel order result      | User cancels an eligible pending order         | Order is canceled or status/list updates according to confirmed rule.             | Exact confirmation behavior must be verified.       |

## 3. Domain Rule Identification

| Rule ID   | Field / Condition           | Valid Rule                                                                                     | Invalid Condition                                                                 | Error Message / Expected Handling                        |
| --------- | --------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------- |
| MFR04-R01 | Authenticated access        | Logged-in user can open profile page.                                                          | Guest opens profile page.                                                         | Redirect to login or deny access.                        |
| MFR04-R02 | Own profile update          | User updates only their own profile.                                                           | User attempts to update another user's profile.                                   | Reject update and do not modify target user.             |
| MFR04-R03 | Email immutability          | Email is displayed as non-editable.                                                            | User changes email through UI.                                                    | UI prevents editing; saved profile keeps original email. |
| MFR04-R04 | Role immutability           | Role is not exposed and cannot be changed by user.                                             | User self-changes role.                                                           | Reject/ignore role change and keep original role.        |
| MFR04-R05 | Full name editable          | Non-empty full name is accepted.                                                               | Full name is empty or whitespace-only.                                            | Reject update and show required/invalid name validation. |
| MFR04-R06 | Phone number optional/valid | Empty phone is allowed if optional; provided phone starts with `0`, digits only, length 10-11. | Phone is too short, too long, lacks leading `0`, contains letters/symbols/spaces. | Reject update and show phone validation.                 |
| MFR04-R07 | Address editable            | Default shipping address can be updated according to requiredness rule.                        | Address violates requiredness or length rule.                                     | Reject update or save according to confirmed rule.       |
| MFR04-R08 | Successful update           | Valid editable fields are saved.                                                               | Save fails silently or old values remain after refresh.                           | Show success state and persist updated values.           |
| MFR04-R09 | Logout                      | User can log out from profile page.                                                            | Logout button does not end session.                                               | End session and redirect/update UI.                      |
| MFR04-R10 | Order history visibility    | Logged-in user sees their own order history.                                                   | Orders from another user are shown or own orders are missing.                     | Show only current user's orders or a clear empty state.  |
| MFR04-R11 | Order fields                | Each order displays order number, order date, total amount, and status.                        | Required order fields are missing or unreadable.                                  | Display complete order summary.                          |
| MFR04-R12 | Order amount format         | Total amount is formatted in VND with thousands separators and `đ`.                            | Raw number, wrong separator, missing currency, negative total.                    | Display valid formatted amount or handle invalid data.   |
| MFR04-R13 | Order status display        | Order status is displayed in Vietnamese and matches stored order state.                        | Wrong status text or stale status is displayed.                                   | Display correct status such as `Chờ xác nhận`.           |
| MFR04-R14 | Cancel pending order        | Cancellable pending orders expose `Hủy đơn`.                                                   | Cancel button appears for non-cancellable orders or is missing for pending order. | Show/hide cancel action according to order status.       |

## 4. Equivalence Class Partitioning

| EC ID        | Input / Condition  | Class Type | Description                                             | Representative Value             | Expected Result                                                                                       |
| ------------ | ------------------ | ---------- | ------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| MFR04-EC-001 | Authenticated user | Valid      | Logged-in user opens profile.                           | `test@eshop.com` session         | Profile page is displayed.                                                                            |
| MFR04-EC-002 | Guest user         | Invalid    | Unauthenticated user opens profile.                     | No session                       | Access is denied or redirected to login.                                                              |
| MFR04-EC-003 | Full name          | Valid      | Non-empty normal name.                                  | `Test User`                      | Profile can be updated when other fields are valid.                                                   |
| MFR04-EC-004 | Full name          | Valid      | Vietnamese name with diacritics.                        | `Nguyen Van A` / `Nguyen Thi An` | Profile can be updated if Unicode names are supported.                                                |
| MFR04-EC-005 | Full name          | Invalid    | Empty full name.                                        | Empty string                     | Update is rejected.                                                                                   |
| MFR04-EC-006 | Full name          | Invalid    | Whitespace-only full name.                              | `"   "`                          | Update is rejected after trimming.                                                                    |
| MFR04-EC-007 | Phone number       | Valid      | 9 digits according to executed system behavior.         | `123456789`                      | Profile can be updated, but this conflicts with the stated 10-11 digit requirement.                   |
| MFR04-EC-008 | Phone number       | Valid      | 10 digits according to executed system behavior.        | `1912345678`                     | Profile can be updated, but missing leading `0` conflicts with the stated requirement.                |
| MFR04-EC-009 | Phone number       | Valid      | Empty phone when optional.                              | Empty string                     | Profile can be updated if phone is optional.                                                          |
| MFR04-EC-010 | Phone number       | Invalid    | 8 digits, below observed lower boundary.                | `12345678`                       | Update is rejected.                                                                                   |
| MFR04-EC-011 | Phone number       | Invalid    | 11 digits, above observed upper boundary.               | `12345678901`                    | Update is rejected by the current system, but this conflicts with the stated 10-11 digit requirement. |
| MFR04-EC-012 | Phone number       | Invalid    | 10 digits starting with `0` rejected by current system. | `0912345678`                     | Current system rejects this value, but this is a defect against the stated requirement.               |
| MFR04-EC-013 | Phone number       | Invalid    | Contains letters.                                       | `09123abc78`                     | Update is rejected.                                                                                   |
| MFR04-EC-014 | Phone number       | Invalid    | Contains spaces or symbols.                             | `091 234 5678`                   | Update is rejected unless formatting is explicitly allowed.                                           |
| MFR04-EC-015 | Address            | Valid      | Normal shipping address.                                | `123 Le Loi, Q1, TP HCM`         | Profile can be updated.                                                                               |
| MFR04-EC-016 | Address            | Valid      | Empty address if optional.                              | Empty string                     | Profile can be updated if address is optional.                                                        |
| MFR04-EC-017 | Address            | Valid      | Empty or short address accepted by executed system.     | Empty string / `A`               | Profile can be updated when address is empty or short.                                                |
| MFR04-EC-018 | Email field        | Valid      | Email remains unchanged.                                | `test@eshop.com`                 | Email stays the same after update.                                                                    |
| MFR04-EC-019 | Email field        | Invalid    | User attempts to edit email through UI.                 | `new@eshop.com`                  | UI prevents edit or update ignores email change.                                                      |
| MFR04-EC-020 | Profile ownership  | Invalid    | User attempts to update another user profile.           | Other user ID                    | Update is rejected and other profile is unchanged.                                                    |
| MFR04-EC-021 | Role attribute     | Invalid    | User attempts to change own role.                       | `admin`                          | Role remains unchanged.                                                                               |
| MFR04-EC-022 | Logout             | Valid      | User taps logout button.                                | `Thoat`                          | User is logged out.                                                                                   |
| MFR04-EC-023 | Order history      | Valid      | User has one order.                                     | `Đơn #1`                         | One order card is displayed.                                                                          |
| MFR04-EC-024 | Order history      | Valid      | User has no orders.                                     | Empty order list                 | No-order message is displayed.                                                                        |
| MFR04-EC-025 | Order ownership    | Invalid    | Order history contains another user's order.            | Other user's order               | Other user's order is not displayed.                                                                  |
| MFR04-EC-026 | Order fields       | Valid      | Order has complete summary fields.                      | Date, total, status              | Order number, date, total, and status are displayed.                                                  |
| MFR04-EC-027 | Order amount       | Valid      | Positive total amount.                                  | `30.000.000 đ`                   | Total amount is formatted correctly.                                                                  |
| MFR04-EC-028 | Order status       | Valid      | Pending order status.                                   | `Chờ xác nhận`                   | Pending status is displayed and cancel action is available.                                           |
| MFR04-EC-029 | Cancel action      | Valid      | User cancels a pending order.                           | Tap `Hủy đơn`                    | Order is canceled or status/list updates according to confirmed rule.                                 |
| MFR04-EC-030 | Cancel action      | Invalid    | Cancel action on non-cancellable order.                 | Delivered/canceled order         | Cancel action is hidden or rejected.                                                                  |

## 5. Domain Testing Test Cases

| Test Case ID | Objective                                                         | Preconditions                                          | Test Data                                                                   | Steps                                               | Expected Result                                                                           | Actual Result                                                                                                  | Status |
| ------------ | ----------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------ |
| MFR04-DT-001 | Verify logged-in user can view profile page.                      | User is logged in.                                     | Existing profile: `test@eshop.com`, `Test User`.                            | Open profile page.                                  | Profile page displays email, full name, phone, address, update button, and logout button. | Profile page displays email, full name, phone, address, update button, and logout button.                      | Passed |
| MFR04-DT-002 | Verify guest cannot access profile page.                          | User is logged out.                                    | No session.                                                                 | Open profile page URL/screen.                       | User is redirected to login                                                               | User is redirected to login                                                                                    | Passed |
| MFR04-DT-003 | Verify valid profile update.                                      | User is logged in.                                     | Full name `Test User Updated`, phone `123456789`, address `123 Le Loi, Q1`. | Edit fields and tap `Cập nhật`.                     | Profile is saved and updated values remain after reload/reopen.                           | Profile is saved and update  values remain after reload                                                        | Passed |
| MFR04-DT-004 | Verify Vietnamese full name is accepted.                          | User is logged in.                                     | Full name `Nguyễn Hoàng Phi Hùng`; other fields valid.                      | Edit full name and tap `Cập nhật`.                  | Profile is saved with the entered name.                                                   | Profile is saved with entered name                                                                             | Passed |
| MFR04-DT-005 | Verify empty full name is rejected.                               | User is logged in.                                     | Full name empty; other fields valid.                                        | Clear full name and tap `Cập nhật`.                 | Update is rejected and name validation is shown.                                          | Profile is save with entered name                                                                              | Failed |
| MFR04-DT-006 | Verify whitespace-only full name is rejected.                     | User is logged in.                                     | Full name `"   "`; other fields valid.                                      | Enter spaces in full name and tap `Cập nhật`.       | Update is rejected after trimming and name validation is shown.                           | Profile is save with the whitespace-only full name                                                             | Failed |
| MFR04-DT-007 | Verify 10-digit phone starting with 0 is accepted.                | User is logged in.                                     | Phone `0912345678`; other fields valid.                                     | Enter phone and tap `Cập nhật`.                     | Profile is saved.                                                                         | Error message: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số"                                    | Failed |
| MFR04-DT-008 | Verify 11-digit phone starting with 0 is accepted.                | User is logged in.                                     | Phone `01234567890`; other fields valid.                                    | Enter phone and tap `Cập nhật`.                     | Update is rejected                                                                        | Update is rejected                                                                                             | Passed |
| MFR04-DT-009 | Verify 9-digit phone is accepted.                                 | User is logged in.                                     | Phone `091234567`; other fields valid.                                      | Enter phone and tap `Cập nhật`.                     | Profile is saved                                                                          | Error message: "Số điện thoại không hợp lệ". Vui lòng đăng nhập 9-10 chữ số                                    | Failed |
| MFR04-DT-010 | Verify 11-digit phone is rejected.                                | User is logged in.                                     | Phone `12345678901`; other fields valid.                                    | Enter phone and tap `Cập nhật`.                     | Update is rejected because phone length is **greater than or equal to** 11 digits.        | Update is rejected because phone length is **greater than or equal to** 11 digits.                             | Passed |
| MFR04-DT-011 | Verify phone not starting with 0 is rejected.                     | User is logged in.                                     | Phone `123456789`; other fields valid.                                      | Enter phone and tap `Cập nhật`.                     | Update is rejected because phone must start with `0`.                                     | Profile is saved and update  values remain after reload                                                        | Failed |
| MFR04-DT-012 | Verify phone containing symbol is rejected.                       | User is logged in.                                     | Phone `123*56789`; other fields valid.                                      | Enter phone and tap `Cập nhật`.                     | Update is rejected because phone must contain digits only.                                | Update is rejected because phone must contain digits only.                                                     | Passed |
| MFR04-DT-014 | Verify default shipping address can be updated.                   | User is logged in.                                     | Address `123 Le Loi, Q1, TP HCM`; other fields valid.                       | Enter address and tap `Cập nhật`.                   | Address is saved as default shipping address.                                             | Address is saved as default shipping address.                                                                  | Passed |
| MFR04-DT-015 | Verify empty address handling.                                    | User is logged in.                                     | Address empty; other fields valid.                                          | Clear address and tap `Cập nhật`.                   | Profile is saved if address is optional; otherwise validation is shown.                   | Profile is saved if address is optional; otherwise validation is shown.                                        | Passed |
| MFR04-DT-016 | Verify email cannot be changed through UI.                        | User is logged in.                                     | Current email `test@eshop.com`.                                             | Attempt to focus/edit email field.                  | Email field is disabled/read-only and value cannot be changed through UI.                 | Email field is disabled/read-only and value cannot be changed through UI.                                      | Passed |
| MFR04-DT-017 | Verify update does not change email.                              | User is logged in.                                     | Existing email `test@eshop.com`; valid editable fields.                     | Update full name/phone/address and reopen profile.  | Email remains `test@eshop.com`.                                                           | Email remains `test@eshop.com`.                                                                                | Passed |
| MFR04-DT-020 | Verify logout from profile page.                                  | User is logged in.                                     | Tap `Thoat`.                                                                | Tap logout button.                                  | User session ends and app shows logged-out state or login page.                           | User session ends and app shows logged-out state or login page                                                 | Passed |
| MFR04-DT-021 | Verify order history section is displayed for a user with orders. | User is logged in and has at least one order.          | Order `#1` exists.                                                          | Open profile page and scroll to `Lịch sử đơn hàng`. | Order history section displays the user's order card.                                     | `Lịch sử đơn hàng` displays `Đơn #1`.                                                                          | Passed |
| MFR04-DT-022 | Verify empty order history state.                                 | User is logged in and has no orders.                   | Empty order list.                                                           | Open profile page and view `Lịch sử đơn hàng`.      | Clear message such as `Bạn chưa có đơn hàng nào.` is displayed.                           | Clear message such as `Bạn chưa có đơn hàng nào.` is displayed.                                                | Passed |
| MFR04-DT-024 | Verify order summary fields are displayed.                        | User is logged in and has order `#1`.                  | Order date `2/7/2026`, total `30.000.000 đ`, status `Chờ xác nhận`.         | Open profile page and view order card.              | Order card displays order number, order date, total amount, and status.                   | Order card displays `Đơn #1`, `Ngày đặt: 2/7/2026`, `Tổng tiền: 30.000.000 đ`, and `Trạng thái: Chờ xác nhận`. | Passed |
| MFR04-DT-025 | Verify pending order shows cancel button.                         | User is logged in and has a pending order.             | Order status `Chờ xác nhận`.                                                | Open profile page and view order card.              | `Hủy đơn` button is shown for the pending order.                                          | `Hủy đơn` button is shown.                                                                                     | Passed |
| MFR04-DT-026 | Verify cancel pending order behavior.                             | User is logged in and has a cancellable pending order. | Tap `Hủy đơn` on order `#1`.                                                | Tap cancel button and confirm if prompted.          | Order is canceled or status/list updates according to confirmed product rule.             | Order is canceled and status of order is updated "Đã hủy"                                                      | Passed |
| MFR04-DT-027 | Verify non-cancellable order does not show cancel button.         | User is logged in and has a delivered/canceled order.  | Status `Đã giao` or `Đã hủy`.                                               | Open profile page and view order card.              | `Hủy đơn` is hidden or cancel attempt is rejected.                                        | `Hủy đơn` is hidden or cancel attempt is rejected.                                                             | Passed |

## 6. Boundary Identification

| Boundary ID  | Field / Condition             | Boundary Rule                                                                                                         | Values to Test                   | Reason                                                                                    |
| ------------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------- |
| MFR04-BD-001 | Phone length lower boundary   | Executed system behavior accepts 9 digits, although the stated requirement says 10-11 digits.                         | 8, 9, 10 digits                  | Tests observed min - 1, observed min, and observed min + 1; records requirement mismatch. |
| MFR04-BD-002 | Phone length upper boundary   | Executed system behavior rejects 11 digits, although the stated requirement says 10-11 digits.                        | 9, 10, 11 digits                 | Tests observed max - 1, observed max, and observed max + 1; records requirement mismatch. |
| MFR04-BD-003 | Phone first character         | Stated requirement says phone must start with `0`, but execution shows inconsistent behavior.                         | First char `0`, first char `1`   | Verifies leading-zero requirement and exposes mismatch.                                   |
| MFR04-BD-004 | Full name lower boundary      | Full name is assumed required after trimming.                                                                         | 0, 1, 2 characters               | Tests empty, minimum non-empty, and just above minimum.                                   |
| MFR04-BD-006 | Address length lower boundary | Address may be optional; requiredness must be confirmed.                                                              | 0, 1, 2 characters               | Verifies empty/short address behavior.                                                    |
| MFR04-BD-008 | Order count boundary          | Order history can contain zero, one, or multiple orders.                                                              | 0, 1, 2+ orders                  | Verifies empty state, single order card, and repeated cards.                              |
| MFR04-BD-009 | Order total lower boundary    | Order total display should handle zero and positive values; negative-total behavior still needs controlled test data. | 0, 1 VND                         | Verifies minimum display behavior from executed cases.                                    |
| MFR04-BD-010 | Order total display boundary  | Large totals should remain readable and formatted.                                                                    | `999`, `1.000`, `30.000.000` VND | Verifies thousands separator and layout stability.                                        |

## 7. Boundary Value Analysis Test Cases

| Test Case ID  | Boundary Target                       | Preconditions                                  | Test Data                                            | Steps                  | Expected Result                                                         | Actual Result                                                               | Status |
| ------------- | ------------------------------------- | ---------------------------------------------- | ---------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------ |
| MFR04-BVA-001 | Phone length below minimum            | User is logged in.                             | Phone `12345678` (8 digits); other fields valid.     | Submit profile update. | Update is rejected because phone must be 9-10 digits.                   | Update is rejected because phone must be 9-10 digits.                       | Passed |
| MFR04-BVA-002 | Phone length at minimum               | User is logged in.                             | Phone `123456789` (9 digits); other fields valid.    | Submit profile update. | Profile is saved.                                                       | Profile is saved.                                                           | Passed |
| MFR04-BVA-004 | Phone length above maximum            | User is logged in.                             | Phone `12345678901` (11 digits); other fields valid. | Submit profile update. | Update is rejected because phone must be 9-10 digits.                   | Update is rejected because phone must be 9-10 digits.                       | Passed |
| MFR04-BVA-006 | Phone leading zero valid boundary     | User is logged in.                             | Phone `0912345678`; other fields valid.              | Submit profile update. | Profile is saved.                                                       | Error message: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số" | Failed |
| MFR04-BVA-007 | Phone leading zero invalid boundary   | User is logged in.                             | Phone `123456789`; other fields valid.               | Submit profile update. | Update is rejected because phone does not start with `0`.               | Profile is saved                                                            | Failed |
| MFR04-BVA-008 | Full name empty boundary              | User is logged in.                             | Full name empty; other fields valid.                 | Submit profile update. | Update is rejected if full name is required.                            | Profile is saved                                                            | Passed |
| MFR04-BVA-009 | Full name minimum non-empty boundary  | User is logged in.                             | Full name `A`; other fields valid.                   | Submit profile update. | Profile is saved if one-character names are allowed.                    | Profile is saved                                                            | Passed |
| MFR04-BVA-010 | Full name just above minimum boundary | User is logged in.                             | Full name `An`; other fields valid.                  | Submit profile update. | Profile is saved.                                                       | Profile is saved                                                            | Passed |
| MFR04-BVA-014 | Address empty boundary                | User is logged in.                             | Address empty; other fields valid.                   | Submit profile update. | Profile is saved if address is optional; otherwise validation is shown. | Profile is saved                                                            | Passed |
| MFR04-BVA-015 | Address minimum non-empty boundary    | User is logged in.                             | Address `A`; other fields valid.                     | Submit profile update. | Profile is saved if one-character address is allowed.                   | Profile is saved                                                            | Passed |
| MFR04-BVA-019 | Order count zero boundary             | User is logged in with no orders.              | `0` orders.                                          | Open profile page.     | Empty order-history message is displayed.                               | Empty order-history message is displayed.                                   | Passed |
| MFR04-BVA-020 | Order count one boundary              | User is logged in with one order.              | `1` order.                                           | Open profile page.     | One order card is displayed without layout issues.                      | `Đơn #1` is displayed.                                                      | Passed |
| MFR04-BVA-021 | Order count multiple boundary         | User is logged in with multiple orders.        | `2+` orders.                                         | Open profile page.     | Multiple order cards are displayed in order history.                    | Multiple order cards are displayed in order history.                        | Passed |
| MFR04-BVA-023 | Order total zero boundary             | User has an order with zero total.             | Total `0 đ`.                                         | Open profile page.     | Zero total is displayed only if valid by product rule.                  | Zero total is displayed only if valid by product rule.                      | Passed |
| MFR04-BVA-024 | Order total minimum positive boundary | User has an order with minimal positive total. | Total `1 đ`.                                         | Open profile page.     | Total is displayed with currency.                                       | Zero total is displayed only if valid by product rule.                      | Passed |
| MFR04-BVA-025 | Large order total display boundary    | User has a high-value order.                   | Total `30.000.000 đ`.                                | Open profile page.     | Total is formatted with thousands separators and does not break layout. | `30.000.000 đ` is displayed.                                                | Passed |

## 8. Test Execution Table

| Feature ID  | Designed | Executed | Passed | Failed | Not Executed | Bugs Found |
| ----------- | -------: | -------: | -----: | -----: | -----------: | ---------: |
| Mobile-FR04 |       39 |       39 |     30 |      9 |            0 |          9 |

## 9. Bug Report Template

Use this template only after a defect is observed during execution.

| Field              | Content                                       |
| ------------------ | --------------------------------------------- |
| Bug ID             | MFR04-BUG-\_\_\_                              |
| Title              |                                         |
| Feature            | Mobile-FR04 Profile Management                |
| Severity           |                                         |
| Priority           |                                         |
| Environment        | Mobile browser/app, device, OS, app URL/build |
| Preconditions      | User login state and profile data setup       |
| Steps to Reproduce | 1.                                            |
| Expected Result    |                                         |
| Actual Result      |                                         |
| Screenshot         | `screenshots/MFR04-BUG-___.png`               |
| Related Test Case  | MFR04-\_\_\_                                  |
| GitHub Issue Link  |                                         |

## 10. AI Gap Analysis

| Gap ID        | AI Output Issue                                                                                 | Missed / Wrong / Incomplete | Why It Happened                                                                                                                                                                                                        | Human Correction                                                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MFR04-GAP-001 | Earlier equivalence classes assumed the stated phone rule without reflecting executed behavior. | Incomplete                  | The requirement says phone numbers start with `0` and have 10-11 digits, but the executed results show the app behaves closer to a 9-10 digit rule and inconsistently handles leading `0`.                             | Updated phone equivalence classes to separate stated-rule expectations from observed execution behavior, including accepted 9-digit/no-leading-zero values and rejected leading-zero values. |
| MFR04-GAP-002 | Earlier boundary identification used 10-11 digits as the only phone boundary.                   | Wrong / Incomplete          | Human execution added boundary data for 8, 9, 10, and 11 digits and exposed a mismatch between expected requirement and system validation message.                                                                     | Rewrote phone boundary rows around the executed 8/9/10/11-digit results and explicitly recorded the requirement mismatch.                                                                    |
| MFR04-GAP-003 | Earlier analysis kept unexecuted placeholder rows and stale execution totals.                   | Wrong                       | The previous version still counted not-executed rows from the draft and included blank table rows after human cleanup.                                                                                                 | Removed blank rows and recalculated Section 8 as 39 designed, 39 executed, 30 passed, 9 failed, 0 not executed.                                                                              |
| MFR04-GAP-004 | Full name validation expectation did not match execution results.                               | Incomplete                  | The draft treated empty and whitespace-only names as invalid, but execution showed those values were saved.                                                                                                            | Kept failed domain cases and adjusted review notes to flag missing name validation as a confirmed execution issue.                                                                           |
| MFR04-GAP-005 | Original profile-focused artifact did not cover `Lịch sử đơn hàng`.                             | Missed                      | The first prompt focused on editable profile fields, email immutability, own-profile access, and role protection. Order history was visible on the later screenshot but was not included in the earlier feature scope. | Added and executed order-history domain and boundary cases for empty/one/multiple orders, order fields, total formatting, status display, and cancel action.                                 |
| MFR04-GAP-006 | Order-total boundary actual text needed review after execution.                                 | Incomplete                  | The executed BVA rows confirmed zero, one-unit, and high-value totals, but one actual-result note reused the zero-total wording for the one-unit case.                                                                 | Kept the executed status and highlighted order-total formatting as a human-review item for evidence/message cleanup.                                                                         |

## 11. Human Review Notes

```text
Human Review:
- Accepted:
  - Executed profile-page access, logout, email immutability, address handling, and order-history display cases.
  - Executed order-history boundary cases for zero, one, and multiple orders.
- Modified:
  - Updated Equivalence Class Partitioning to reflect executed phone behavior and requirement mismatches.
  - Updated Boundary Identification from the previous 10-11 digit phone assumption to the executed 8/9/10/11-digit boundary set.
  - Recalculated the execution table from current Domain Testing and BVA statuses.
- Removed:
  - Blank placeholder rows left after deleted or skipped test cases.
  - Stale not-executed count from the previous version.
- Added:
  - Human-review notes for the observed phone-rule mismatch and full-name validation failures.
- Assumptions to verify:
  - Is full name required after trimming?
  - What are the minimum and maximum full name lengths?
  - Is default shipping address required, optional, or required only during checkout?
  - What is the maximum default shipping address length?
  - Are one-character names and one-character addresses allowed?
  - Are Vietnamese diacritics and punctuation allowed in full names and addresses?
  - Should the official phone rule be 10-11 digits starting with `0`, or the observed 9-10 digit behavior shown by the application message?
  - Should phone numbers with spaces, hyphens, missing leading `0`, or country code `+84` be rejected or normalized?
  - What exact validation messages should be shown for invalid phone/name/address?
  - How can own-profile-only and role-immutability checks be executed in the test environment?
  - Should order history be sorted newest-first?
  - Which order statuses allow `Hủy đơn`?
  - Does canceling an order require confirmation?
  - What status should be shown after a successful cancellation?
  - Should the order date use `d/m/yyyy` or another locale-specific format?
  - Should order totals always use VND format with thousands separators and `đ`?
  - Recheck the actual-result wording for `MFR04-BVA-024` because it appears to reuse the zero-total result text.
```

## 12. Suggested Git Commit Message

```text
Format mobile profile execution results
```
