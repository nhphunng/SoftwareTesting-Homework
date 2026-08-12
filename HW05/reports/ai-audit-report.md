# AI Audit Report

> Declaration: I use AI tools for the following tasks.

## AI Tools Used

| AI Tool | Tasks |
| --- | --- |
| Codex | Create and maintain the HW05 AI audit, design Scenario C, scaffold testing artifacts, and execute/document API smoke validation. |

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

## AI Audit Entry - AI-004

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T11:56:30+07:00 |
| Task | Confirm Phase 1 decisions and smoke-test Scenario C APIs |
| User Prompt | `This is confirmation for phase 1 of [plan.md](/Users/nguyenhoangphihung/Document/ky_3/SoftwareTesting-Homework/HW05/plan.md) , read it and update`<br>`- Class default là JMeter`<br>`- Class ID: 23127194`<br>`- I have confirmed scenario C is unique`<br>`- We have 2 account:`<br>`  - User account: test@eshop.com \| [REDACTED PASSWORD]`<br>`  - Admin account: admin@eshop.com \| [REDACTED PASSWORD]`<br>`- Do smoke test with api endpoint for me`<br><br>Passwords were explicitly redacted from the audit entry and were not stored in repository artifacts. |
| Evidence/Input Basis | `HW05/plan.md`, `HW05/scenario.md`; external SUT workspace `eshop-sut-seminar`: `backend/server.js`, `backend/database.js`, `api_specification.md`, and the running backend on `http://127.0.0.1:3000` |
| Generated/Modified Files | `HW05/plan.md`, `HW05/scenario.md`, `HW05/README.md`, `HW05/package.json`, `HW05/runbook.md`, `HW05/evidence/README.md`, `HW05/submission-checklist.md`, `HW05/reports/main-report.md`, `HW05/reports/smoke-test.md`, `HW05/reports/ai-audit-report.md` |
| AI Output | Confirmed JMeter as the final class-default tool, Student ID `23127194`, and Scenario C uniqueness. Verified Java 24 is installed and JMeter is not currently available on `PATH`. Started the EShop backend and executed the complete Scenario C API smoke chain with temporary credentials: user login, product search/detail, add/read cart, checkout, order read, cancellation, and user-history verification; also verified admin login and admin order-list access. All eleven requests returned HTTP 200. Product `1` (`iPhone 15 Pro Max`) was used; order `1` transitioned from `pending` to `canceled`. The backend was stopped afterward, clearing the in-memory cart; canceled order `1` remains in SQLite. Updated Phase 1 as decision/smoke complete but not fully closed because JMeter installation, final execution date, a sufficiently large isolated user pool, and database reset policy remain pending. Marked the earlier k6 scaffold as superseded reference material. No password, JWT, `.jtl`, performance metric, HTML report, threshold, resource screenshot, or video evidence was stored or claimed. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-005

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T12:33:32+07:00 |
| Task | Install JMeter and automate user provisioning after backend reset |
| User Prompt | `- Thực hiện việc cài đặt JMeter`<br>`- Ngày chạy chính thức là 12/08/2026`<br>`- Hãy thực hiện việc đăng ký user account phục vụ cho JMeter thread`<br>`- Khi khởi chạy lại backend thì backend sẽ tự reset, do đó việc khởi tọa user account ở trên nên được automation ở các phase tiếp theo` |
| Evidence/Input Basis | `HW05/plan.md`, `HW05/scenario.md`, `HW05/reports/smoke-test.md`; external SUT workspace `eshop-sut-seminar/backend/database.js` and running backend API; Apache JMeter official 5.6.3 binary and published SHA-512 checksum |
| Generated/Modified Files | `HW05/.gitignore`, `HW05/README.md`, `HW05/plan.md`, `HW05/runbook.md`, `HW05/scenario.md`, `HW05/submission-checklist.md`, `HW05/scripts/provision-jmeter-users.sh`, `HW05/scripts/start-backend-and-provision.sh`, `HW05/reports/main-report.md`, `HW05/reports/user-provisioning.md`, `HW05/reports/ai-audit-report.md`; local ignored file `HW05/data/scenario-c.local.csv`; local installation `~/.local/opt/apache-jmeter-5.6.3` and symlink `~/.local/bin/jmeter` |
| AI Output | Confirmed the official execution date `2026-08-12` and final plan names `23127194_Load_20260812.jmx`, `23127194_Stress_20260812.jmx`, and `23127194_Spike_20260812.jmx`. Homebrew's download queue stalled twice, so installation switched to the official Apache JMeter 5.6.3 binary; its SHA-512 exactly matched Apache's published checksum. Installed JMeter under `~/.local/opt`, created a PATH-visible symlink, verified `jmeter --version`, and completed a non-GUI CLI smoke run. Source inspection confirmed every backend start drops and reseeds all tables. Added parameterized automation that waits for backend readiness, validates the selected product, provisions deterministic per-thread accounts, verifies login, and atomically writes a mode-600 Git-ignored CSV. Verification created five users, then restarted/reset the backend and recreated all five (`created=5`, `reused=0`). A transient immediate-login failure found on the first restart check led to a bounded retry fix; the rerun passed. Five users are explicitly classified as a functional verification pool, not a performance workload. No credential or JWT was printed or committed. Phase 1 is complete; each later phase must pass `USER_COUNT` at least equal to its reviewed maximum threads. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-006

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T12:57:04+07:00 |
| Task | Initialize the Scenario C JMeter Load Test design and generation skill |
| User Prompt | `Trước khi thực hiện phase 2 hãy thực hiện việc khởi tạo skill design và generate test plan load testing` |
| Evidence/Input Basis | `HW05/plan.md`, `HW05/scenario.md`, `HW05/runbook.md`, `HW05/reports/smoke-test.md`, `HW05/reports/user-provisioning.md`, `HW05/.agents/skills/ai-audit-report/`; Codex system `skill-creator` instructions |
| Generated/Modified Files | `HW05/.agents/skills/design-jmeter-load-test/SKILL.md`, `HW05/.agents/skills/design-jmeter-load-test/agents/openai.yaml`, `HW05/.agents/skills/design-jmeter-load-test/references/scenario-c-load-contract.md`, `HW05/.agents/skills/design-jmeter-load-test/scripts/validate_load_jmx.py`, `HW05/AGENTS.md`, `HW05/README.md`, `HW05/plan.md`, `HW05/reports/ai-audit-report.md` |
| AI Output | Initialized the project-local `$design-jmeter-load-test` skill as a mandatory Phase 2 design/generation gate. The skill requires reading the Phase 1 evidence and Scenario C contract, collecting a real single-user baseline, labeling proposed workload values as pending review, and obtaining human confirmation for threads, ramp-up, hold, ramp-down, think-time, thresholds, and the Load listener/report allocation before generating `tests/23127194_Load_20260812.jmx`. It fixes the nine-step correlated checkout-and-cancel flow, requires one provisioned CSV account per concurrent thread after every backend reset, prohibits embedded credentials and fabricated evidence, and keeps heavy GUI listeners disabled during measured runs. Added a deterministic JMX structural validator with passing self-tests; the official skill validator also passed and `git diff --check` reported no whitespace errors. No `.jmx`, `.jtl`, HTML report, metric, threshold, screenshot, or measured Load result was created or claimed. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:
