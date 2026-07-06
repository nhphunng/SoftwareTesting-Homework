# FR-05 Product Listing and Search - Domain Testing and Boundary Value Analysis

## 1. Feature Understanding

| Item              | Details                                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Feature ID        | FR-05                                                                                                                                                                                                  |
| Feature name      | Product Listing and Search                                                                                                                                                                             |
| User role         | Visitor or logged-in customer                                                                                                                                                                          |
| Main purpose      | Display all products on the home page in a grid and allow users to search products by product name.                                                                                                    |
| Preconditions     | User opens the EShop home page; product data is available from the product API or local seed data.                                                                                                     |
| Main flow         | System loads product data, displays loading state while waiting, renders product cards in a grid, user enters a search keyword, system filters products by name, and matching products remain visible. |
| Alternative flows | Product list is empty, search has no match, search keyword is empty/whitespace, product image is missing, product price is invalid, or keyword contains HTML/script-like input.                        |
| Related data      | Product `id`, `name`, `price`, `image`, `image alt text`, and product list API/loading state.                                                                                                          |

### Assumptions to verify

* Search is performed by product name only.

* Search should be case-insensitive unless product requirements say otherwise.

* Accent-insensitive search for Vietnamese text is not specified and must be confirmed.

* Maximum search keyword length is not specified; `255` characters is used as a practical UI/API boundary to verify.

* Price must be displayed in Vietnamese dong using `₫` and thousands separators.

* Product images must keep a consistent card aspect ratio and have meaningful alt text.

* The screenshot provided is feature context only; it is not treated as executed test evidence.

## 2. Input / Output Identification

### Inputs

|    No. | Input             | Type         | Required? | Source                         | Constraint / Rule                                                                   | Notes                                   |
| -----: | ----------------- | ------------ | --------- | ------------------------------ | ----------------------------------------------------------------------------------- | --------------------------------------- |
|      1 | Product list data | Array/object | Yes       | Product API or local seed data | Each product should include name, price, image, and alt text.                       | Drives the grid display.                |
|      2 | Product name      | Text         | Yes       | Product data                   | Must be displayed as text.                                                          | Used by search matching.                |
|      3 | Search keyword    | Text         | No        | Search input                   | Search by product name; input must be rendered safely and must not execute HTML/JS. | Empty keyword should show all products. |
|      4 | Loading state     | Boolean      | Yes       | Frontend/API state             | Shows loading indicator while products are being fetched.                           | Must disappear after response.          |

### Outputs

|    No. | Output               | Trigger                                                      | Expected Behavior                                          | Notes                                             |
| -----: | -------------------- | ------------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------- |
|      1 | Product grid         | Product data loaded                                          | Displays all products as cards in a responsive grid.       | Cards should not overlap.                         |
|      2 | Safe keyword display | Keyword contains HTML/script-like text                       | Keyword is displayed as text only, never rendered as HTML. | Prevents XSS.                                     |
|      3 | Loading state        | Data request is pending                                      | A loading message/spinner is shown.                        | Should not show stale empty state during loading. |
|      4 | Empty state          | Search returns no matching products or product list is empty | Clear empty-state message is shown.                        | Should not show broken grid.                      |

## 3. Domain Rule Identification

| Rule ID  | Field / Condition      | Valid Rule                                                     | Invalid Condition                                                          | Error Message / Expected Handling                                  |
| -------- | ---------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| FR05-R01 | Product grid           | Loaded product data is rendered in a grid.                     | Products are missing, duplicated, or layout is broken.                     | Show correct product cards or an empty state if no products exist. |
| FR05-R02 | Product image          | Image keeps standard aspect ratio and has meaningful alt text. | Missing alt text, broken image, stretched image, or layout shift.          | Show accessible image/fallback without breaking card layout.       |
| FR05-R03 | Product name           | Product name is displayed as text.                             | Name is missing, clipped incorrectly, or rendered as HTML.                 | Escape text and keep layout readable.                              |
| FR05-R04 | Product price          | Price is displayed with thousands separators and `₫`.          | Missing currency, wrong separator, raw number, negative/non-numeric value. | Display valid formatted price or handle invalid data safely.       |
| FR05-R05 | Search by name         | Keyword filters by product name.                               | Search filters unrelated fields or returns incorrect products.             | Show only matching product names.                                  |
| FR05-R06 | Empty keyword          | Empty keyword shows all products.                              | Empty keyword hides all products or shows error.                           | Reset to full product list.                                        |
| FR05-R07 | No result              | Keyword has no match.                                          | Blank page or stale results remain visible.                                | Show appropriate empty-state message.                              |
| FR05-R08 | Safe keyword rendering | User input is escaped.                                         | HTML/script is executed or rendered.                                       | Display input safely and do not execute scripts.                   |
| FR05-R09 | Loading                | Loading state appears while data is pending.                   | No loading state or incorrect empty state during fetch.                    | Show loading indicator until response completes.                   |

## 4. Equivalence Class Partitioning

| EC ID       | Input / Condition                    | Class Type | Description                          | Representative Value        | Expected Result                                                   |
| ----------- | ------------------------------------ | ---------- | ------------------------------------ | --------------------------- | ----------------------------------------------------------------- |
| FR05-EC-008 | Keyword matches exact product name   | Valid      | Search term equals a product name.   | `iPhone 15 Pro Max`         | Matching product is displayed.                                    |
| FR05-EC-009 | Keyword matches partial product name | Valid      | Search term is a substring.          | `iPhone`                    | Matching products are displayed.                                  |
| FR05-EC-010 | Keyword differs only by case         | Valid      | Keyword uses different letter case.  | `iphone`                    | Matching products are displayed if search is case-insensitive.    |
| FR05-EC-011 | Keyword has no match                 | Valid      | No product name contains keyword.    | `Nintendo`                  | Empty state is displayed.                                         |
| FR05-EC-012 | Empty keyword                        | Valid      | Search field is empty.               | Empty string                | All products are displayed.                                       |
| FR05-EC-013 | Whitespace-only keyword              | Valid      | Keyword contains only spaces.        | `   `                       | Keyword is trimmed and all products are displayed.                |
| FR05-EC-014 | Keyword contains HTML/script         | Invalid    | User enters markup/script-like text. | `<script>alert(1)</script>` | Input is displayed safely and no script executes.                 |
| FR05-EC-015 | Keyword contains special characters  | Valid      | Keyword includes punctuation.        | `Q1!@#`                     | Search handles input safely and returns matching or empty result. |
| FR05-EC-016 | Keyword exceeds expected max length  | Invalid    | Very long keyword.                   | 256 characters              | App handles safely without crash or layout break.                 |

## 5. Domain Testing Test Cases

| Test Case ID | Objective                                  | Preconditions                        | Test Data                                                                | Steps                                 | Expected Result                                                                          | Actual Result                                                   | Status |
| ------------ | ------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------ |
| FR05-DT-001  | Verify product grid displays all products. | Product returns seeded product list. | Products: iPhone 15, Samsung S24, MacBook Pro, AirPods Pro, Keychron Q1. | Open home page.                       | All products are displayed in a grid with one card per product.                          | All products are displayed in a grid with one card per product. | Passed |
| FR05-DT-007  | Verify exact-name search.                  | Product list is loaded.              | Keyword `MacBook Pro M3`.                                                | Enter keyword and submit search.      | Only `MacBook Pro M3` is displayed.                                                      | Only `MacBook Pro M3` is displayed.                             | Passed |
| FR05-DT-008  | Verify partial-name search.                | Product list is loaded.              | Keyword `Samsung`.                                                       | Enter keyword and submit search.      | Matching Samsung product(s) are displayed.                                               | Matching Samsung product(s) are displayed.                      | Passed |
| FR05-DT-009  | Verify case-insensitive search.            | Product list is loaded.              | Keyword `iphone`.                                                        | Enter keyword and submit search.      | `iPhone 15 Pro Max` is displayed if search is case-insensitive.                          | `iPhone 15 Pro Max` is displayed.                               | Passed |
| FR05-DT-010  | Verify no-result search empty state.       | Product list is loaded.              | Keyword `Nintendo`.                                                      | Enter keyword and submit search.      | No product cards are displayed and an appropriate empty-state message is shown.          | No product cards are displayed.                                 | Passed |
| FR05-DT-011  | Verify empty search resets product list.   | Product list is loaded.              | Empty keyword.                                                           | Clear search input and submit search. | Full product list is displayed.                                                          | Full product list is displayed.                                 | Passed |
| FR05-DT-012  | Verify whitespace-only search is trimmed.  | Product list is loaded.              | Keyword `   `.                                                           | Enter spaces and submit search.       | App treats keyword as empty and displays full product list.                              | App treats keyword as empty and displays full product list.     | Passed |
| FR05-DT-013  | Verify search keyword is rendered safely.  | Product list is loaded.              | Keyword `<script>alert(1)</script>`.                                     | Enter keyword and submit search.      | Script is not executed; keyword is treated as plain text; safe empty state may be shown. | Script is not executed.                                         | Passed |

## 6. Boundary Identification

| Boundary ID | Field / Condition             | Boundary Rule                                  | Values to Test                 | Reason                                                  |
| ----------- | ----------------------------- | ---------------------------------------------- | ------------------------------ | ------------------------------------------------------- |
| FR05-BD-002 | Search keyword length minimum | Empty keyword is allowed and resets the list.  | `0`, `1`, `2` characters       | Tests empty, minimum non-empty, and just above minimum. |
| FR05-BD-003 | Search keyword length maximum | Assumed practical maximum is `255` characters. | `254`, `255`, `256` characters | Verifies long input handling and UI stability.          |
| FR05-BD-004 | Search result count           | Results can be none, one, or many.             | `0`, `1`, `2+` matches         | Verifies empty state and filtered grid.                 |

## 7. Boundary Value Analysis Test Cases

| Test Case ID | Boundary Target      | Preconditions                          | Test Data              | Steps                            | Expected Result                                                                        | Actual Result                                           | Status       |
| ------------ | -------------------- | -------------------------------------- | ---------------------- | -------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------ |
| FR05-BVA-001 | Product count `0`    | Product API can return empty list.     | `[]`                   | Open home page.                  | Empty-state message is shown and no broken cards appear.                               | TBD                                                     | Not Executed |
| FR05-BVA-002 | Product count `1`    | Product API can return one product.    | One product only.      | Open home page.                  | One product card is displayed cleanly in the grid area.                                | TBD                                                     | Not Executed |
| FR05-BVA-003 | Product count `2+`   | Product API returns multiple products. | Five products.         | Open home page.                  | Multiple product cards are displayed in grid layout.                                   | TBD                                                     | Not Executed |
| FR05-BVA-004 | Keyword length `0`   | Product list is loaded.                | Empty keyword.         | Submit empty search.             | Full product list is displayed.                                                        | Full product list is displayed.                         | Passed       |
| FR05-BVA-005 | Keyword length `1`   | Product list is loaded.                | Keyword `Q`.           | Submit search.                   | Matching products are shown or empty state appears; app remains stable.                | Matching products are shown.                            | Passed       |
| FR05-BVA-006 | Keyword length `255` | Product list is loaded.                | 255-character keyword. | Paste keyword and submit search. | App handles input safely without crash or layout break.                                | App handles input safely without crash or layout break. | Passed       |
| FR05-BVA-007 | Keyword length `256` | Product list is loaded.                | 256-character keyword. | Paste keyword and submit search. | App rejects, truncates, or safely handles keyword according to confirmed product rule. | App handles input safely without crash or layout break. | Passed       |

## 8. Test Execution Table

| Feature ID | Designed | Executed | Passed | Failed | Not Executed | Bugs Found |
| ---------- | -------: | -------: | -----: | -----: | -----------: | ---------: |
| FR-05      |       15 |       12 |     12 |      0 |            3 |          0 |

## 9. Bug Report Template

Use this template only after a defect is observed during execution.

| Field              | Content                                           |
| ------------------ | ------------------------------------------------- |
| Bug ID             | FR05-BUG-\_\_\_                                   |
| Title              |                                             |
| Feature            | FR-05 Product Listing and Search                  |
| Severity           |                                             |
| Priority           |                                             |
| Environment        | Browser, OS, app URL, build/commit                |
| Preconditions      | Product data setup, user state, API/network state |
| Steps to Reproduce | 1.                                                |
| Expected Result    |                                             |
| Actual Result      |                                             |
| Screenshot         | `screenshots/FR05-BUG-___.png`                    |
| Related Test Case  | FR05-\_\_\_                                       |
| GitHub Issue Link  |                                             |

## 10. AI Gap Analysis

| Gap ID       | AI Output Issue                                                                                          | Missed / Wrong / Incomplete | Why It Happened                                                                                                                                                | Human Correction                                                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| FR05-GAP-001 | AI generated several product-data and UI-resilience cases that were unsuitable for this execution scope. | Wrong / Incomplete          | The prompt described image, price, loading, and empty-state requirements, but the current manual test setup mainly supported visible grid and search behavior. | Human removed unsuitable rows from equivalence classes and test cases, including mocked invalid image/price and loading-state execution cases. |
| FR05-GAP-002 | AI kept all originally designed cases in the execution summary after the human removed unsuitable tests. | Wrong                       | The generated summary still counted 26 designed cases and 26 not executed, even though only 15 cases remained in the edited file.                              | Recounted the remaining test cases as 15 designed, 12 executed, 12 passed, 0 failed, 3 not executed, and 0 bugs found.                         |
| FR05-GAP-003 | Case-insensitive search was initially written as an assumption.                                          | Incomplete                  | Requirement only said search by product name and did not explicitly define case handling.                                                                      | Human executed `FR05-DT-009`; actual result confirms lowercase `iphone` finds `iPhone 15 Pro Max`.                                             |
| FR05-GAP-004 | Maximum keyword length was an AI assumption.                                                             | Incomplete                  | No explicit product rule for search keyword maximum length was provided.                                                                                       | Human executed `FR05-BVA-006` and `FR05-BVA-007`; both 255- and 256-character inputs were handled safely without crash or layout break.        |
| FR05-GAP-005 | Product-count boundary cases still require controlled test data.                                         | Incomplete                  | The current UI data set did not provide controlled API responses for `0`, `1`, and `2+` product-count boundaries during execution.                             | Keep `FR05-BVA-001` to `FR05-BVA-003` as not executed until product API mocking or seed-data control is available.                             |
| FR05-GAP-006 | Empty-state assertion is partly incomplete.                                                              | Incomplete                  | The actual result for `FR05-DT-010` confirms no product cards are displayed, but it does not record the exact empty-state message.                             | Re-execute or update evidence to capture the empty-state message text if the assignment requires message verification.                         |

## 11. Human Review Notes

```text
Human Review:
- Accepted:
  - Product grid display case `FR05-DT-001`.
  - Search cases `FR05-DT-007` to `FR05-DT-013`.
  - Keyword length boundary cases `FR05-BVA-004` to `FR05-BVA-007`.
- Modified:
  - Cleaned empty table rows left after removing unsuitable AI-generated test cases.
  - Corrected the execution summary to match the remaining test cases and actual results.
  - Updated AI Gap Analysis based on completed execution and removed cases.
- Removed:
  - Unsuitable generated execution cases that required unavailable setup or mocked data, such as invalid image, invalid price, and loading-state execution.
  - Search-result count and price boundary cases that were not executed in the current manual test scope.
- Added:
  - Actual results and Passed status for executed FR05 search/grid test cases.
- Assumptions to verify:
  - Exact empty-state message text for no-result search.
  - Accent-insensitive matching for Vietnamese product names.
  - Required exact currency symbol: `₫` versus `VND`.
  - Product image fallback behavior when image URL is missing or broken.
  - Whether invalid product prices should be blocked by backend or handled by UI.
  - Loading-state behavior under delayed network/API response.
  - Controlled product-count boundary setup for `0`, `1`, and `2+` products.
```

## 12. Suggested Git Commit Message

```text
Add FR-05 product listing and search domain tests
```
