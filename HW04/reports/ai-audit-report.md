# AI Audit Report

> Declaration: "I use AI tools for the following tasks."

## AI Audit Entry – AI-001

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | To be filled by tester |
| Task | Read the HW04 assignment and prepare an implementation plan |
| User Prompt | `Hãy đọc [2026.HW04.Automation Testing_En.md](HW04/2026.HW04.Automation Testing_En.md)và lập kế hoạch thực hiện bài tập này cho tôi` |
| Generated/Modified Files | `HW04/plan.md` |
| AI Output | A complete plan tailored to FR-05, FR-09, and FR-17 is preserved in `HW04/plan.md`. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry – AI-002

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | To be filled by tester |
| Task | Set up the HW04 Playwright project structure |
| User Prompt | `Bây giờ hãy thực hiện set up cấu trúc thư mục mà bạn đề xuất trong [HW04](HW04/)` |
| Generated/Modified Files | `HW04/package.json`, `HW04/tsconfig.json`, `HW04/playwright.config.ts`, `HW04/.env.example`, `HW04/.gitignore`, `HW04/README.md`, `HW04/tests/`, `HW04/data/`, `HW04/pages/`, `HW04/fixtures/`, `HW04/reports/`, `HW04/screenshots/`, `HW04/git-commit-log.txt`, `HW04/submission-checklist.md` |
| AI Output | Created a Playwright/TypeScript scaffold with three skipped feature specs, external JSON placeholders, Page Objects, fixtures, nine feature-browser commands, report templates, and evidence placeholders. JSON syntax validation passed; no test execution result or defect was fabricated. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry – AI-003

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | To be filled by tester |
| Task | Recommend the next implementation steps |
| User Prompt | `Bây giờ tôi cần làm gì tiếp theo` |
| Generated/Modified Files | None |
| AI Output | The complete advisory response is preserved in `HW04/reports/ai-session-logs/AI-003.md`. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry – AI-004

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-06T13:02:19+07:00 |
| Task | Create and install project-local automation and AI audit skills |
| User Prompt | `Oke bây giờ tôi cần bạn thực hiện việc cài đặt skill cho việc viết automation testcase, và ai-audit (tương tự skill trong hw02)` |
| Generated/Modified Files | `HW04/AGENTS.md`, `HW04/README.md`, `HW04/.agents/skills/playwright-automation-testing/`, `HW04/.agents/skills/ai-audit-logging/`, `HW04/reports/ai-audit-report.md`, `HW04/reports/ai-session-logs/AI-003.md` |
| AI Output | Created two project-local skills with UI metadata and focused references. The automation skill enforces HW02 traceability, external data, stable selectors, human review, isolated multi-browser runs, and evidence integrity. The audit skill records verbatim prompts, attributable outputs, ISO timestamps, and pending human review. Added project-level activation rules and validated both skills with the official `quick_validate.py`; both returned `Skill is valid!`. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry – AI-005

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-06T13:25:31+07:00 |
| Task | Implement and execute FR-05 Playwright automation |
| User Prompt | `Sử dụng $playwright-automation-testing để triển khai FR-05` |
| Generated/Modified Files | `HW04/playwright.config.ts`, `HW04/tsconfig.json`, `HW04/data/fr05-search.json`, `HW04/pages/product.page.ts`, `HW04/tests/fr05-product-search.spec.ts`, `HW04/.gitignore`, `HW04/README.md`, `HW04/reports/main-report.md`, `HW04/reports/bug-report.md`, `HW04/reports/html/fr05-chromium/`, `HW04/reports/html/fr05-firefox/`, `HW04/reports/html/fr05-webkit/`, `HW04/screenshots/FR05-BUG-001-multiple-h1-webkit.png`, `HW04/screenshots/FR05-BUG-002-missing-empty-state-webkit.png`, `HW04/screenshots/FR05-BUG-003-unsafe-search-rendering-webkit.png` |
| AI Output | Inspected the live EShop UI and source before selecting locators. Implemented 12 external-data-driven cases traced to HW02, a Product Page Object, runtime data validation, and four assertion patterns. Fixed `.env` loading/default frontend URL and a TypeScript 7 configuration incompatibility. The first Firefox run revealed that the AI-generated response helper incorrectly rejected HTTP 304; the helper was corrected and Firefox was rerun. Final result for each of Chromium, Firefox, and WebKit: 12 executed, 9 passed, 3 failed, 0 flaky. The same three SUT defects were reproduced across all browsers: duplicate `<h1>`, missing empty state, and unsafe HTML rendering of the search keyword. Generated three attributable HTML reports and preserved three WebKit failure screenshots. No GitHub Issue was posted. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry – AI-006

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-06T13:33:19+07:00 |
| Task | Route feature tests to the separate user and admin web frontends |
| User Prompt | `có 2 web cho riêng cho user và admin tôi có cung  cấp trong .env` |
| Generated/Modified Files | `HW04/.env.example`, `HW04/package.json`, `HW04/playwright.config.ts`, `HW04/README.md`, `HW04/reports/main-report.md`, `HW04/reports/ai-audit-report.md`, `HW04/reports/html/fr05-chromium/`, `HW04/reports/html/fr05-firefox/`, `HW04/reports/html/fr05-webkit/` |
| AI Output | Replaced the single-base-URL assumption with explicit frontend routing. Playwright now loads `USER_WEB_URL` and `ADMIN_WEB_URL` from `.env`; `TARGET_APP=user` is assigned automatically to FR-05/FR-09 scripts and `TARGET_APP=admin` to FR-17 scripts. Invalid target values fail fast, and report metadata records the selected target without exposing URL values or credentials. TypeScript validation passed and FR-05 still listed 12 tests. The suite was rerun against the user frontend on Chromium, Firefox, and WebKit; each run produced 9 passed and the same 3 confirmed failures, with refreshed HTML reports. The real `.env` file and its values were not modified or printed. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry – AI-007

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-07T15:48:08+07:00 |
| Task | Implement and execute the Day 2 FR-17 coupon-management automation |
| User Prompt | `Thực hiện task của ngày 2 có trong [plan.md](HW04/plan.md). Khi cần thực hiện viết script hãy sử dụng skill [playwright-automation-testing](HW04/.agents/skills/playwright-automation-testing/)` |
| Generated/Modified Files | `HW04/data/fr17-coupon-crud.json`, `HW04/fixtures/auth.fixture.ts`, `HW04/pages/admin-coupon.page.ts`, `HW04/tests/fr17-coupon-management.spec.ts`, `HW04/README.md`, `HW04/reports/main-report.md`, `HW04/reports/bug-report.md`, `HW04/reports/ai-audit-report.md`, `HW04/reports/html/fr17-chromium/`, `HW04/test-results/` |
| AI Output | Applied the project-local Playwright automation skill and inspected the running admin UI/source before selecting locators. Implemented 15 external-data-driven FR-17 cases traced to HW02, reusable `.env`-backed admin authentication, a coupon Page Object, unique test-owned codes, reload persistence checks, native/server/business rejection paths, and `afterEach` cleanup. Human review corrected an empty-code locator that matched every row, a success-only GET waiter left pending after duplicate rejection, and an unsafe whitespace-only cleanup strategy; the whitespace case now uses a unique surrounded code and compares raw stored text. TypeScript validation passed and Playwright listed 15 cases. The canonical Chromium run executed 15 tests: 11 passed and 4 failed. A focused rerun reproduced all four failures. Three failing cases form two confirmed validation defects (non-positive discount and negative minimum order); the untrimmed-code behavior remains a requirement gap. The final HTML report was verified as `targetApp=admin`, attributable to the configured student ID, ISO-timestamped, with 11 passed and 4 failed. Live cleanup verification showed only the four seeded coupons remained. Firefox and WebKit were not run because the plan assigns multi-browser execution to Day 4. No GitHub Issue was posted and no stable FR-17 issue screenshot was claimed. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:
