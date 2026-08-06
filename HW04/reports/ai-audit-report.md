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

