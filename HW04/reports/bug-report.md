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
