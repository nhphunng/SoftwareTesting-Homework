# HW04 Bug Report

## FR05-BUG-001 – Product page contains two level-one headings

| Field | Content |
| --- | --- |
| Feature | FR-05 Product Listing and Search |
| Related test | `FR05-DT-001` |
| Severity / Priority | Minor / Medium |
| Environment | EShop local; Chromium, Firefox, WebKit; 2026-08-06 |
| Preconditions | Backend and frontend are running with seeded products |
| Steps to reproduce | 1. Open `/`. 2. Wait for products to load. 3. Count page `<h1>` elements. |
| Expected result | The page contains exactly one `<h1>`. |
| Actual result | The page contains two `<h1>` elements: the page title and the product-count summary. |
| Reproducibility | Reproduced on all three browsers and twice on Chromium |
| Screenshot | `screenshots/FR05-BUG-001-multiple-h1-webkit.png` |
| GitHub Issue | Pending publication |

## FR09-BUG-001 – Percentage coupon calculation produces negative discount and inflated total

| Field | Content |
| --- | --- |
| Feature | FR-09 Discount Coupons |
| Related tests | `FR09-DT-001`, `FR09-DT-007`, `FR09-BVA-003` |
| Severity / Priority | Critical / High |
| Environment | EShop local user frontend; Chromium; 2026-08-08 |
| Preconditions | User is authenticated; controlled active 10-percent coupon exists; total is above minimum |
| Steps to reproduce | 1. Add a product and open checkout. 2. Set total to `28,000,000`. 3. Apply an eligible 10-percent coupon. 4. Inspect savings and final totals. |
| Expected result | Savings is `2,800,000`; coupon final and payment total are `25,200,000`. |
| Actual result | API/UI report savings `-252,000,000` and final/payment total `280,000,000`. The same formula error occurs for total `300,001`. |
| Reproducibility | Three cases failed in the full Chromium run and reproduced in a focused rerun |
| Screenshot | Pending stable issue screenshot during the Day 4 evidence pass; current Playwright evidence is local |
| GitHub Issue | Pending publication |

## FR09-BUG-002 – Coupon is rejected when cart total equals the minimum order

| Field | Content |
| --- | --- |
| Feature | FR-09 Discount Coupons |
| Related test | `FR09-BVA-002` |
| Severity / Priority | Major / High |
| Environment | EShop local user frontend; Chromium; 2026-08-08 |
| Preconditions | User is authenticated; controlled active coupon has minimum order `300,000` |
| Steps to reproduce | 1. Open checkout. 2. Set total to exactly `300,000`. 3. Apply the eligible coupon. |
| Expected result | The coupon is accepted because the rule is total greater than or equal to minimum. |
| Actual result | API returns 400 and the UI says the order has not reached the minimum. |
| Reproducibility | Reproduced in the full Chromium run and focused rerun |
| Screenshot | Pending stable issue screenshot during the Day 4 evidence pass; current Playwright evidence is local |
| GitHub Issue | Pending publication |

## FR09-BUG-003 – Fixed coupon can produce a negative payable total

| Field | Content |
| --- | --- |
| Feature | FR-09 Discount Coupons |
| Related tests | `FR09-DT-009`, `FR09-BVA-013` |
| Severity / Priority | Critical / High |
| Environment | EShop local user frontend; Chromium; 2026-08-08 |
| Preconditions | User is authenticated; controlled fixed coupon is greater than the checkout total |
| Steps to reproduce | 1. Open checkout with total `50,000`. 2. Apply a fixed coupon worth `100,000` or `50,001`. |
| Expected result | Coupon is rejected or capped so savings does not exceed total and final amount is `0`. |
| Actual result | UI/API show final totals of `-50,000` and `-1`. |
| Reproducibility | Both cases failed in the full Chromium run and reproduced in a focused rerun |
| Screenshot | Pending stable issue screenshot during the Day 4 evidence pass; current Playwright evidence is local |
| GitHub Issue | Pending publication |

## FR17-BUG-001 – Admin can create coupons with non-positive discount values

| Field | Content |
| --- | --- |
| Feature | FR-17 Coupon Management CRUD |
| Related tests | `FR17-DT-007`, `FR17-DT-008` |
| Severity / Priority | Major / High |
| Environment | EShop local admin frontend; Chromium; 2026-08-07 |
| Preconditions | Admin is authenticated; generated coupon code does not exist |
| Steps to reproduce | 1. Open Mã Giảm Giá. 2. Enter otherwise valid data. 3. Set percent discount to `0` or fixed discount to `-1`. 4. Click `Tạo mã`. |
| Expected result | The coupon is rejected because its discount value must be positive. |
| Actual result | POST `/api/admin/coupons` returns 200 and the invalid coupon appears in the table. The automation verifies the added row before removing the test-owned record. |
| Reproducibility | Both cases reproduced in the full Chromium run and a focused rerun |
| Screenshot | Pending stable issue screenshot during the Day 4 evidence pass; current failure evidence is retained by Playwright locally |
| GitHub Issue | Pending publication |

## FR17-BUG-002 – Admin can create a coupon with a negative minimum order

| Field | Content |
| --- | --- |
| Feature | FR-17 Coupon Management CRUD |
| Related test | `FR17-DT-013` |
| Severity / Priority | Major / High |
| Environment | EShop local admin frontend; Chromium; 2026-08-07 |
| Preconditions | Admin is authenticated; generated coupon code does not exist |
| Steps to reproduce | 1. Open Mã Giảm Giá. 2. Enter valid coupon data. 3. Set Đơn tối thiểu to `-1`. 4. Click `Tạo mã`. |
| Expected result | The coupon is rejected because minimum order must be at least zero. |
| Actual result | POST `/api/admin/coupons` returns 200 and the coupon with `-1 ₫` minimum order appears in the table. The test-owned record is removed afterward. |
| Reproducibility | Reproduced in the full Chromium run and a focused rerun |
| Screenshot | Pending stable issue screenshot during the Day 4 evidence pass; current failure evidence is retained by Playwright locally |
| GitHub Issue | Pending publication |

## FR05-BUG-002 – No friendly empty state for an unmatched search

| Field | Content |
| --- | --- |
| Feature | FR-05 Product Listing and Search |
| Related test | `FR05-DT-010` |
| Severity / Priority | Minor / Medium |
| Environment | EShop local; Chromium, Firefox, WebKit; 2026-08-06 |
| Preconditions | Product list is loaded |
| Steps to reproduce | 1. Open `/`. 2. Enter `Nintendo`. 3. Click `Tìm`. |
| Expected result | No cards are displayed and a friendly empty-state message/icon is visible. |
| Actual result | No cards are displayed, but the page shows no empty-state message or illustration. |
| Reproducibility | Reproduced on all three browsers and twice on Chromium |
| Screenshot | `screenshots/FR05-BUG-002-missing-empty-state-webkit.png` |
| GitHub Issue | Pending publication |

## FR05-BUG-003 – Search keyword is rendered as HTML instead of literal text

| Field | Content |
| --- | --- |
| Feature | FR-05 Product Listing and Search |
| Related test | `FR05-DT-013` |
| Severity / Priority | High / High |
| Environment | EShop local; Chromium, Firefox, WebKit; 2026-08-06 |
| Preconditions | Product list is loaded |
| Steps to reproduce | 1. Open `/`. 2. Enter `<script>alert(1)</script>`. 3. Click `Tìm`. 4. Inspect the result echo DOM. |
| Expected result | The complete keyword is displayed as literal text and no executable/markup element is created. |
| Actual result | The literal tags are not displayed and the result echo contains one runtime `<script>` element. No script execution is claimed by this test. |
| Reproducibility | Reproduced on all three browsers and confirmed by live DOM inspection |
| Screenshot | `screenshots/FR05-BUG-003-unsafe-search-rendering-webkit.png` |
| GitHub Issue | Pending publication |
