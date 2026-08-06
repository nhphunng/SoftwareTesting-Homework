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

