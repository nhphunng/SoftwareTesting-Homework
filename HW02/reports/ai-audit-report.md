# AI Audit Report

## Declaration

I use AI tools for the following tasks.

## AI Tools Used

| No. | AI Tool | Purpose                                                                                                                                           |
| --- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Codex   | Assist in generating black-box Domain Testing and Boundary Value Analysis artifacts, AI gap analysis, bug report templates, and report structure. |

## AI Interaction Log

| Interaction ID | AI Tool | Date and Time | Task | User Prompt | AI Output Summary | Human Review |
| -------------- | ------- | ------------- | ---- | ----------- | ----------------- | ------------ |
| AI-001 | Codex | 2026-06-22 13:45 +07 | Create first draft testing artifacts for FR-17 Coupon Management CRUD | Use the domain-boundary-testing skill for FR-17 Coupon Management CRUD. Goal: Create the first draft of testing artifacts for this feature. Requirements: identify inputs/outputs, validation rules and assumptions, equivalence classes, Domain Testing test cases, Boundary Value Analysis test cases, AI Gap Analysis, Human Review notes, and suggest a Git commit message. Do not invent actual execution results. Use Actual Result = TBD and Status = Not Executed. Save the output to `test-cases/FR17-coupon-management-crud.md`. | Generated FR-17 feature understanding, input/output tables, validation rules, equivalence classes, Domain Testing cases, BVA cases, execution summary, bug report template, AI Gap Analysis, Human Review notes, and suggested commit message. Generated file: `test-cases/FR17-coupon-management-crud.md`. | Pending human review |
| AI-002 | Codex | 2026-06-23 10:56 +07 | Improve FR-17 test artifact with missing coupon code, API robustness, and delete safety tests | Improve the existing FR-17 test artifact by adding missing test cases for coupon code validation, API/Postman invalid data types and missing/null values, and delete behavior/delete safety. Add Additional Equivalence Classes, Additional Boundary Identification, and Additional Test Cases using continuing IDs such as `FR17-DT-022` onward and `FR17-BVA-024` onward. | Added FR-17 code validation equivalence classes and boundaries, API negative/robustness test cases, delete safety test cases, bug report suggestions, AI Gap Analysis updates, Human Review notes, and updated execution summary. Generated file: `test-cases/FR17-coupon-management-crud.md`. | Pending human review |
| AI-003 | Codex | 2026-06-23 12:56 +07 | Update FR-17 execution summary and bug report from executed results | Dựa vào kết quả các test case hãy viết lại phần 8 và `bug-report.md` dựa trên skill đồng thời dùng attach hình ảnh tôi đã cung cấp trong folder screenshot. | Recalculated FR-17 execution summary from current test results, updated Section 8 in `test-cases/FR17-coupon-management-crud.md`, rewrote `reports/bug-report.md`, grouped failed and potential-defect test cases into bug reports, and referenced screenshots from `screenshots/`. | Pending human review |
| AI-004 | Codex | 2026-06-23 15:37 +07 | Write FR-17 AI Gap Analysis | Write AI gap analysis for FR017. If your AI tools miss any test cases or bugs, which is test case in additinoal domain and boundary. Explain why the AI missed them, for example due to prompt quality, AI tool limitations, or feature complexity. | Added FR-17 AI Gap Analysis explaining missed Additional Domain/API and Boundary test cases, related bugs, why AI missed them, and how human review corrected the gaps. Generated file: `test-cases/FR17-coupon-management-crud.md`. | Pending human review |
| AI-005 | Codex | 2026-06-23 16:01 +07 | Create FR-09 Discount Coupons testing artifact | Use the domain-boundary-testing skill for FR-09 Discount Coupons. Create test cases for valid coupon, invalid coupon, expired coupon, inactive coupon, usage limit reached, cart total below minimum order, percentage discount, fixed amount discount, and discount greater than cart total. Do not invent actual execution results. Save the output to `test-cases/FR09-discount-coupons.md`. | Generated FR-09 feature understanding, input/output tables, rules C1-C5, equivalence classes, Domain Testing test cases, BVA test cases, execution table, bug report template, AI Gap Analysis, Human Review notes, and suggested commit message. Generated file: `test-cases/FR09-discount-coupons.md`. | Pending human review |
| AI-006 | Codex | 2026-06-30 11:26 +07 | Update FR-09 execution summary, AI Gap Analysis, and bug report from actual results | Based on the actual result test case of FR09 in HW02/test-cases/FR09-discount-coupons.md, you need to update 8.Test Excution Table and 9.AI Gap Analysis and update HW02/reports/bug-report.md remember attach each image for each bug test case | Updated FR-09 Section 8 execution table and Section 9 AI Gap Analysis from actual result data, added FR09 bug entries to `reports/bug-report.md`, grouped failed cases into 3 defects, and attached screenshots for each failed FR09 bug test case. | Pending human review |
| AI-007 | Codex | 2026-07-01 11:40 +07 | Create FR-05 product listing and search testing artifact | Using domain-boundary-testing skill for HW02/test-cases/FR05-product-listing-search.md. INFORMATION: Trang chủ hiển thị danh sách tất cả sản phẩm dạng lưới (grid). Mỗi sản phẩm hiển thị: Ảnh (tỷ lệ chuẩn, có alt text mô tả), Tên sản phẩm, Giá (đơn vị: ₫, định dạng phân cách hàng nghìn). Thanh tìm kiếm tìm theo tên sản phẩm. Từ khóa tìm kiếm phải được hiển thị an toàn (không render HTML). Khi đang tải dữ liệu phải hiển thị trạng thái loading. Khi không có kết quả tìm kiếm phải hiển thị thông báo empty state phù hợp. | Generated FR-05 product listing/search Domain Testing and Boundary Value Analysis artifact with feature understanding, inputs/outputs, rules, equivalence classes, domain test cases, BVA cases, execution table, bug report template, AI Gap Analysis, Human Review notes, and suggested commit message. | Pending human review |
| AI-008 | Codex | 2026-07-01 12:09 +07 | Format FR-05 test artifact and update AI Gap Analysis from human execution changes | I completed test case and remove unsuitable test case, you need to format HW02/test-cases/FR05-product-listing-search.md and comparation what is change to rewrite AI gap analysis and Human review note | Cleaned blank table rows left after removed cases, corrected FR-05 actual-result wording, updated Section 8 execution counts, rewrote Section 10 AI Gap Analysis comparing AI draft versus human changes, and rewrote Section 11 Human Review Notes. | Pending human review |

## Detailed AI Audit Entries

### AI Audit Entry - AI-001

| Field          | Content                                                                                                                                                                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AI Tool        | Codex                                                                                                                                                                                                                                                |
| Date and Time  | 2026-06-22 13:45 +07                                                                                                                                                                                                                                 |
| Task           | Create black-box testing artifact for FR-17 Coupon Management CRUD                                                                                                                                                                                   |
| User Prompt    | Use the domain-boundary-testing skill for FR-17 Coupon Management CRUD. Goal: Create the first draft of testing artifacts for this feature. Requirements: 1. Identify inputs and outputs. 2. Identify validation rules and assumptions. 3. Create equivalence classes. 4. Create Domain Testing test cases. 5. Create Boundary Value Analysis test cases. 6. Add AI Gap Analysis. 7. Add Human Review notes. 8. Suggest a Git commit message. Do not invent actual execution results. Use Actual Result = TBD and Status = Not Executed. Save the output to `test-cases/FR17-coupon-management-crud.md`. Feature information: FR-17 Coupon Management CRUD. Admin can add, view, and delete discount coupons. Required fields: `code` required and unique; `type` required with allowed values `percent` and `fixed`; `discount_value` required and positive; `expired_at` required; `min_order_amount` required and `>= 0`; `max_uses_per_user` required and `>= 1`. |
| AI Output      | Codex generated black-box feature discovery, input/output identification, business rules, equivalence classes, Domain Testing test cases, Boundary Value Analysis test cases, AI Gap Analysis, Human Review Notes, and suggested Git commit message. |
| Generated File | test-cases/FR17-coupon-management-crud.md                                                                                                                                                                                                            |
| Human Review   | Pending human review                                                                                                                                                                                                                                 |

### AI Audit Entry - AI-002

| Field | Content |
|---|---|
| AI Tool | Codex |
| Date and Time | 2026-06-23 10:56 +07 |
| Task | Improve FR-17 test artifact with missing coupon code validation, API robustness, and delete safety tests |
| User Prompt | Please improve my existing FR-17 test artifact by adding missing test cases for the following areas only: coupon code validation, API negative and robustness tests, and delete behavior/delete safety. Add equivalence classes, boundary values, and test cases for whitespace-only code, leading/trailing spaces, case sensitivity, special characters, Unicode/Vietnamese characters, SQL/script-like input, very long code, invalid API data types/null/missing values, invalid date/type/code values, delete existing/cancel/confirm/expired/used/twice/nonexistent/invalid/null IDs, unauthorized delete, no unrelated deletion, and hard-delete/soft-delete/unavailable behavior. Use `Actual Result = TBD` and `Status = Not Executed` for new cases, and mark unclear expected results as `Inconclusive - Requirement unclear`. |
| AI Output | Codex updated the FR-17 artifact by adding additional equivalence classes, additional boundary identification rows, additional Domain/API/delete test cases, additional BVA test cases, delete/API/code bug report suggestions, AI Gap Analysis entries, Human Review notes, updated execution summary, and a suggested commit message. |
| Generated File | test-cases/FR17-coupon-management-crud.md |
| Human Review | Pending human review |

### AI Audit Entry - AI-003

| Field | Content |
|---|---|
| AI Tool | Codex |
| Date and Time | 2026-06-23 12:56 +07 |
| Task | Update FR-17 execution summary and bug report from executed results |
| User Prompt | Dựa vào kết quả các test case hãy viết lại phần 8 và `bug-report.md` dựa trên skill đồng thời dùng attach hình ảnh tôi đã cung cấp trong folder screenshot. |
| AI Output | Codex recalculated the FR-17 execution summary from the current test case statuses, updated Section 8 in `test-cases/FR17-coupon-management-crud.md`, rewrote `reports/bug-report.md`, consolidated failed cases into bug groups, added a potential-defect group for unclear coupon-code behavior, and referenced available screenshots from the `screenshots/` folder. |
| Generated File | test-cases/FR17-coupon-management-crud.md; reports/bug-report.md |
| Human Review | Pending human review |

### AI Audit Entry - AI-004

| Field | Content |
|---|---|
| AI Tool | Codex |
| Date and Time | 2026-06-23 15:37 +07 |
| Task | Write FR-17 AI Gap Analysis |
| User Prompt | Write AI gap analysis for FR017. If your AI tools miss any test cases or bugs, which is test case in additinoal domain and boundary. Explain why the AI missed them — for example, due to the quality of your input (prompt), the limitations of the AI tool itself, or the inherent complexity of the feature under test. |
| AI Output | Codex wrote the FR-17 AI Gap Analysis in `test-cases/FR17-coupon-management-crud.md`, identifying missed Additional Domain/API test cases, missed boundary clarification, related bugs, causes from prompt quality/tool limitations/feature complexity, and human corrections. |
| Generated File | test-cases/FR17-coupon-management-crud.md |
| Human Review | Pending human review |

### AI Audit Entry - AI-005

| Field | Content |
|---|---|
| AI Tool | Codex |
| Date and Time | 2026-06-23 16:01 +07 |
| Task | Create FR-09 Discount Coupons testing artifact |
| User Prompt | Use the domain-boundary-testing skill for FR-09 Discount Coupons. Important dependency: This feature depends on coupons created from FR-17 Coupon Management CRUD. Create test cases for valid coupon, invalid coupon, expired coupon, inactive coupon, usage limit reached, cart total below minimum order, percentage discount, fixed amount discount, and discount greater than cart total. Do not invent actual execution results. Save the output to `test-cases/FR09-discount-coupons.md`. |
| AI Output | Codex generated the FR-09 testing artifact with feature understanding, input/output identification, validation rules C1-C5, equivalence classes, Domain Testing cases, Boundary Value Analysis cases, execution summary, bug report template, AI Gap Analysis, Human Review notes, and suggested commit message. |
| Generated File | test-cases/FR09-discount-coupons.md |
| Human Review | Pending human review |

### AI Audit Entry - AI-006

| Field | Content |
|---|---|
| AI Tool | Codex |
| Date and Time | 2026-06-30 11:26 +07 |
| Task | Update FR-09 execution summary, AI Gap Analysis, and bug report from actual results |
| User Prompt | Based on the actual result test case of FR09 in HW02/test-cases/FR09-discount-coupons.md, you need to update 8.Test Excution Table and 9.AI Gap Analysis and update HW02/reports/bug-report.md remember attach each image for each bug test case |
| AI Output | Codex updated Section 8 in `test-cases/FR09-discount-coupons.md` using the actual result values, updated Section 9 AI Gap Analysis with execution-summary and result-consistency gaps, added FR09 defect rows and detailed bug reports in `reports/bug-report.md`, and referenced screenshots for `FR09-DT-001`, `FR09-DT-007`, `FR09-BVA-002`, `FR09-DT-009`, and `FR09-BVA-013`. |
| Generated File | test-cases/FR09-discount-coupons.md; reports/bug-report.md |
| Human Review | Pending human review |

### AI Audit Entry - AI-007

| Field | Content |
|---|---|
| AI Tool | Codex |
| Date and Time | 2026-07-01 11:40 +07 |
| Task | Create FR-05 product listing and search testing artifact |
| User Prompt | Using domain-boundary-testing skill for HW02/test-cases/FR05-product-listing-search.md. INFORMATION: Trang chủ hiển thị danh sách tất cả sản phẩm dạng lưới (grid). Mỗi sản phẩm hiển thị: **Ảnh** (tỷ lệ chuẩn, có alt text mô tả), **Tên sản phẩm**, **Giá** (đơn vị: ₫, định dạng phân cách hàng nghìn). Thanh tìm kiếm tìm theo tên sản phẩm. Từ khóa tìm kiếm phải được **hiển thị an toàn** (không render HTML). Khi đang tải dữ liệu phải hiển thị trạng thái **loading**. Khi không có kết quả tìm kiếm phải hiển thị thông báo **empty state** phù hợp. [Image #1] |
| AI Output | Codex used the `domain-boundary-testing` skill and rewrote `test-cases/FR05-product-listing-search.md` with the required HW02 structure: feature understanding, input/output identification, domain rules, equivalence classes, Domain Testing cases, boundary identification, BVA cases, execution table, bug report template, AI Gap Analysis, Human Review notes, and suggested commit message. |
| Generated File | test-cases/FR05-product-listing-search.md |
| Human Review | Pending human review |

### AI Audit Entry - AI-008

| Field | Content |
|---|---|
| AI Tool | Codex |
| Date and Time | 2026-07-01 12:09 +07 |
| Task | Format FR-05 test artifact and update AI Gap Analysis from human execution changes |
| User Prompt | I completed test case and remove unsuitable test case, you need to format HW02/test-cases/FR05-product-listing-search.md and comparation what is change to rewrite AI gap analysis and Human review note |
| AI Output | Codex formatted `test-cases/FR05-product-listing-search.md`, removed leftover blank rows from tables, corrected the FR-05 execution table to match the remaining completed/not-executed cases, rewrote AI Gap Analysis to compare the AI-generated draft with human removals and execution results, and rewrote Human Review Notes. |
| Generated File | test-cases/FR05-product-listing-search.md |
| Human Review | Pending human review |

### AI Audit Entry - AI-009

| Field | Content |
|---|---|
| AI Tool | Codex |
| Date and Time | 2026-07-01 14:29 +07 |
| Task | Create mobile profile management domain and boundary testing artifact |
| User Prompt | Based on domain-boudary-testing skill do HW02/test-cases/FR05-product-listing-search.md. INFORMATION: Người dùng đã đăng nhập có thể cập nhật Họ Tên, Số điện thoại, Địa chỉ giao hàng mặc định. Số điện thoại hợp lệ bắt đầu bằng số 0, từ 10-11 chữ số. Email không được phép thay đổi qua giao diện. Người dùng chỉ có thể cập nhật hồ sơ của chính mình; không thể tự thay đổi thuộc tính role. [Image #1] |
| AI Output | Codex used the repo-local `domain-boundary-testing` skill and rewrote `test-cases/FR05-product-listing-search.md` as a Mobile-FR04 profile management artifact with feature understanding, inputs/outputs, domain rules, equivalence classes, Domain Testing cases, boundary identification, BVA cases, execution table, bug report template, AI Gap Analysis, Human Review notes, and suggested commit message. |
| Generated File | test-cases/FR05-product-listing-search.md |
| Human Review | Pending human review |

### AI Audit Entry - AI-010

| Field | Content |
|---|---|
| AI Tool | Codex |
| Date and Time | 2026-07-02 18:18 +07 |
| Task | Update Mobile-FR04 profile management artifact for order history |
| User Prompt | Above HW02/.agents/skills/domain-boundary-testing to update HW02/test-cases/Mobile-FR04-profile-management.md about "Lịch sử đơn hàng" [Image #1] |
| AI Output | Codex used the repo-local `domain-boundary-testing` skill and updated `test-cases/Mobile-FR04-profile-management.md` with order-history inputs/outputs, rules, equivalence classes, Domain Testing cases, BVA cases, execution summary updates, AI Gap Analysis, Human Review notes, and a suggested commit message. |
| Generated File | test-cases/Mobile-FR04-profile-management.md |
| Human Review | Pending human review |

### AI Audit Entry - AI-011

| Field | Content |
|---|---|
| AI Tool | Codex |
| Date and Time | 2026-07-02 18:57 +07 |
| Task | Format Mobile-FR04 test artifact and update analysis from executed results |
| User Prompt | I have updated domain test case and boundary value analysis test case result of HW02/test-cases/Mobile-FR04-profile-management.md. Requirement: update Boundary Identification and Equivalence Class Partitioning to suitable to result; compare it with the last version to update 8.Test Execution Table, 10. AI Gap Analysis and 11. Human review note; format file md. |
| AI Output | Codex used the repo-local `domain-boundary-testing` skill to remove blank rows, align equivalence classes and boundary identification with current execution results, recalculate the execution table, rewrite AI Gap Analysis, rewrite Human Review Notes, and update the suggested commit message. |
| Generated File | test-cases/Mobile-FR04-profile-management.md |
| Human Review | Pending human review |

### AI Audit Entry - AI-012

| Field | Content |
|---|---|
| AI Tool | Codex |
| Date and Time | 2026-07-02 19:32 +07 |
| Task | Update bug report for Mobile-FR04 executed failures |
| User Prompt | I have updated screen shot of HW02/test-cases/Mobile-FR04-profile-management.md, please update HW02/reports/bug-report.md based on skill |
| AI Output | Codex used the repo-local `domain-boundary-testing` skill to group failed Mobile-FR04 test cases into confirmed defects, add defect-log rows, add detailed bug reports, attach available screenshot evidence, and update the bug report human review notes and suggested commit message. |
| Generated File | reports/bug-report.md |
| Human Review | Pending human review |

### AI Audit Entry - AI-013

| Field | Content |
|---|---|
| AI Tool | Codex |
| Date and Time | 2026-07-05 10:35 +07 |
| Task | Create HW02 main testing report in Markdown and PDF |
| User Prompt | Based on HW02/test-cases write HW02/reports/main-report.md (Markdown + PDF), including the Domain Testing report and the Boundary Value Analysis report. |
| AI Output | Codex used the repo-local `domain-boundary-testing` workflow and PDF rendering workflow to write `reports/main-report.md`, generate `reports/main-report.pdf`, summarize Domain Testing and Boundary Value Analysis results from the current test-case artifacts, and include execution totals, defect summary, AI gap analysis, human review notes, and follow-up questions. |
| Generated File | reports/main-report.md; reports/main-report.pdf |
| Human Review | Pending human review |

### AI Audit Entry - AI-014

| Field | Content |
|---|---|
| AI Tool | Codex |
| Date and Time | 2026-07-05 10:46 +07 |
| Task | Restructure HW02 main report by feature and update README summary |
| User Prompt | I want main report is summarize of HW02/test-cases, each FR is a session on main report including content: Feature Understanding (expect Assumptions to verify), Input / Output Identification, Domain Rule Identification, Equivalence Class Partitioning, Domain Testing Test Cases, Boundary Identification. HW02/README.md containing the self-assessment table and a test summary report: number of features; number of test cases designed, executed, passed, failed, and not yet executed; number of bugs. |
| AI Output | Codex used the repo-local `domain-boundary-testing` workflow to rewrite `reports/main-report.md` as per-feature sessions with the requested sections, update `README.md` with the self-assessment table and test summary report, and regenerate `reports/main-report.pdf` from the updated Markdown. |
| Generated File | reports/main-report.md; reports/main-report.pdf; README.md |
| Human Review | Pending human review |
