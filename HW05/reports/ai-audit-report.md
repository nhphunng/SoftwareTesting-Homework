# AI Audit Report

> Declaration: I use AI tools for the following tasks.

## AI Tools Used

| AI Tool | Tasks |
| --- | --- |
| Codex | Create and maintain the HW05 AI audit, design Scenario C, and scaffold the k6 performance-testing project. |

## AI Audit Entry - AI-001

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T11:06:04+07:00 |
| Task | Initialize the HW05 AI Audit Report skill |
| User Prompt | `Đầu tiên bạn hãy khởi tạo skill AI-audit-report cho folder [HW05](/Users/nguyenhoangphihung/Document/ky_3/SoftwareTesting-Homework/HW05/), có thể tham khảo skill này trong các folder homework trước dó` |
| Evidence/Input Basis | `HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf`, `HW04/.agents/skills/ai-audit-logging/`, `HW04/AGENTS.md`, `HW04/reports/ai-audit-report.md`, `HW02/AGENTS.md`, `HW02/reports/ai-audit-report.md` |
| Generated/Modified Files | `HW05/.agents/skills/ai-audit-report/SKILL.md`, `HW05/.agents/skills/ai-audit-report/agents/openai.yaml`, `HW05/.agents/skills/ai-audit-report/references/audit-entry-template.md`, `HW05/AGENTS.md`, `HW05/reports/ai-audit-report.md` |
| AI Output | Initialized a project-local `ai-audit-report` skill with UI metadata, a reusable report/entry template, automatic HW05 activation rules, and performance-evidence integrity controls tailored to the assignment. The skill requires verbatim prompts, attributable file outputs, exact input-log paths for performance analysis, sequential IDs, ISO timestamps, and pending human review. It prohibits fabricating raw `.jtl` logs, execution results, screenshots, hardware/resource evidence, demo videos, or measured thresholds. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-002

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T11:18:05+07:00 |
| Task | Create selectable HW05 performance-test scenario candidates |
| User Prompt | `Dựa trên những feature của sut đã cung cấp trong yêu cầu [2026.HW05.Performance Testing_En_2.0_HTThanh.pdf](/Users/nguyenhoangphihung/Document/ky_3/SoftwareTesting-Homework/HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf) bạn hãy khởi tạo scenario.md có biểu đồ dưới dạng mermaid để sau đó tôi có thể thực hiện việc lựa chọn luồng scenario phù hợp để thực hiện testing` |
| Evidence/Input Basis | `HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf`; external SUT workspace `eshop-sut-seminar`: `api_specification.md`, `backend/server.js`, `frontend-web/src/`, `frontend-admin/src/`, and `k6/tests/` |
| Generated/Modified Files | `HW05/scenario.md`, `HW05/reports/ai-audit-report.md` |
| AI Output | Created a scenario-selection document with a Mermaid decision map, verified feature-to-endpoint mappings, and four candidate end-to-end workflows: standard purchase, coupon purchase, checkout then cancel, and admin order fulfillment. Added a comparison matrix, suggested CSV schemas, exact request sequences, SUT state/data risks, assignment constraints, a selection checklist, and a tester decision template. Candidate A is labeled only as a preliminary baseline recommendation; the selected scenario remains `TBD` pending human review, group-duplication checks, smoke tests, and available test data. No workload values, thresholds, execution results, or evidence were fabricated. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-003

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T11:32:56+07:00 |
| Task | Set up the HW05 k6 skeleton for selected Scenario C |
| User Prompt | `Do mỗi thành viên trong nhóm không được chọn scenario trùng nhau, và trước đó đã có bạn chọn scenario A nên tôi chọn scenario C, bạn hãy thực hiện việc set up skeleton cho [HW05](/Users/nguyenhoangphihung/Document/ky_3/SoftwareTesting-Homework/HW05/) theo scenario mà tôi đã chọn và yêu cầu của [2026.HW05.Performance Testing_En_2.0_HTThanh.pdf](/Users/nguyenhoangphihung/Document/ky_3/SoftwareTesting-Homework/HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf)` |
| Evidence/Input Basis | `HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf`, `HW05/scenario.md`; external SUT workspace `eshop-sut-seminar`: `README.md`, `api_specification.md`, `backend/server.js`, and existing `k6/tests/` |
| Generated/Modified Files | `HW05/scenario.md`, `HW05/.gitignore`, `HW05/package.json`, `HW05/README.md`, `HW05/data/scenario-c.example.csv`, `HW05/lib/csv.js`, `HW05/lib/workload-config.js`, `HW05/lib/scenario-c.js`, `HW05/tests/templates/scenario-c-load.template.js`, `HW05/tests/templates/scenario-c-stress.template.js`, `HW05/tests/templates/scenario-c-spike.template.js`, `HW05/tests/templates/scenario-c-endurance.template.js`, `HW05/runbook.md`, `HW05/plan.md`, `HW05/results/README.md`, `HW05/evidence/README.md`, `HW05/reports/main-report.md`, `HW05/reports/ai-analysis.md`, `HW05/reports/continuous-performance-proposal.md`, `HW05/reports/ai-critique.md`, `HW05/reports/bug-report.md`, `HW05/submission-checklist.md`, `HW05/reports/ai-audit-report.md` |
| AI Output | Marked Candidate C as the tester-selected, non-duplicated workflow and created a k6 project skeleton that reuses one shared flow for Load, Stress, and Spike: valid login, product search/detail, backend cart add/read, checkout with correlated `orderId`, order detail, cancellation, and canceled-history verification. Added RFC-style quoted CSV parsing, dedicated-user validation, per-VU account assignment, reviewed-workload guards, endpoint-group tags, business checks, and checkout/cancellation metrics. Added Load, Stress, Spike, and Endurance workload templates without invented production parameters or thresholds; final assignment filenames remain a manual tester action. Added run/evidence guidance, report templates, the required self-assessment and submission checklist, continuous-testing Mermaid template, and explicit warnings about cart/order state growth and k6/JMeter evidence terminology. `package.json` parsed successfully, `git diff --check` passed, and all four templates passed `k6 inspect` using syntax-only validation mode. No SUT execution, raw result, screenshot, report, issue, threshold, hardware evidence, or video was claimed. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:
