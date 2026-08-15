# AI Audit Report

> Declaration: I use AI tools for the following tasks.

## AI Tools Used

| AI Tool | Tasks |
| --- | --- |
| Codex | Create and maintain the HW05 AI audit; design Scenario C; scaffold, execute, and analyze JMeter Load, Stress, and Spike testing; design the Endurance threshold workflow; prepare evidence guidance. |
| Codex Browser | Attempt local JMeter HTML-dashboard screenshot capture; respect browser URL-policy blocks and avoid fabricating evidence. |

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

## AI Audit Entry - AI-007

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T13:01:08+07:00 |
| Task | Recommend the next Phase 2 action |
| User Prompt | `Bây giờ tôi cần làm gì tiếp theo?` |
| Evidence/Input Basis | `HW05/plan.md`, `HW05/.agents/skills/design-jmeter-load-test/SKILL.md`, `HW05/reports/ai-audit-report.md` |
| Generated/Modified Files | `HW05/reports/ai-audit-report.md` |
| AI Output | Việc tiếp theo là **xác nhận skill và cho phép bắt đầu baseline của Phase 2**; chưa chạy Load test chính thức. Tester cần review AI-006, sau đó yêu cầu thực hiện baseline Scenario C. Codex sẽ tạo một plan baseline tách biệt, reset backend, provision account, chạy một luồng đơn có kiểm soát, lưu raw `.jtl`, và phân tích latency/throughput/error/business assertions. Từ bằng chứng baseline, Codex sẽ đề xuất workload và thresholds với trạng thái `Proposed - pending human review`. Chỉ sau khi tester xác nhận các giá trị đó mới sinh `tests/23127194_Load_20260812.jmx` và chuẩn bị measured Load run. Credential chỉ được truyền lúc chạy và không được ghi vào repository. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-008

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T13:08:24+07:00 |
| Task | Design the Scenario C JMeter Load plan and evaluate the final-JMX generation gate |
| User Prompt | `Using [design-jmeter-load-test](HW05/.agents/skills/design-jmeter-load-test/) thực hiện việc design và generate testplan cho load testing` |
| Evidence/Input Basis | `HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf`, `HW05/AGENTS.md`, `HW05/plan.md`, `HW05/scenario.md`, `HW05/runbook.md`, `HW05/reports/smoke-test.md`, `HW05/reports/user-provisioning.md`, `HW05/.agents/skills/design-jmeter-load-test/SKILL.md`, `HW05/.agents/skills/design-jmeter-load-test/references/scenario-c-load-contract.md`, `HW05/.agents/skills/design-jmeter-load-test/scripts/validate_load_jmx.py`, `HW05/lib/scenario-c.js`; external SUT workspace `eshop-sut-seminar/backend/server.js` |
| Generated/Modified Files | `HW05/reports/load-test-design.md`, `HW05/plan.md`, `HW05/reports/ai-audit-report.md` |
| AI Output | Documented the final Load-plan design contract: fixed nine-request Scenario C flow; endpoint-group transaction structure; CSV isolation and reset rules; token, product-price, and fresh-order correlation; separate HTTP and business assertions; failed-iteration handling; standard JMeter 5.6.3 components; required property expressions with no hidden workload defaults; evidence boundaries; and a baseline/human-approval checklist. Proposed `Summary Report` for the Load-specific listener allocation with status `Proposed - pending human review`. The repository contains no real single-user baseline `.jtl`, so no numeric workload or threshold was proposed. In accordance with the selected skill and `HW05/AGENTS.md`, the final `tests/23127194_Load_20260812.jmx` was intentionally not generated until the tester confirms VUs, ramp-up, hold, ramp-down, think-time, thresholds, and listener allocation. The validator self-test passed and `git diff --check` reported no whitespace errors. No Load run, `.jtl`, HTML report, performance metric, screenshot, resource evidence, threshold, or human approval was fabricated. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-009

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T13:22:28+07:00 |
| Task | Execute and analyse the Scenario C single-user JMeter baseline |
| User Prompt | `Xác nhận cho phép chạy single-user baseline` |
| Evidence/Input Basis | `HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf`, `HW05/AGENTS.md`, `HW05/plan.md`, `HW05/scenario.md`, `HW05/runbook.md`, `HW05/reports/smoke-test.md`, `HW05/reports/user-provisioning.md`, `HW05/reports/load-test-design.md`, `HW05/.agents/skills/design-jmeter-load-test/SKILL.md`, `HW05/.agents/skills/design-jmeter-load-test/references/scenario-c-load-contract.md`; real raw result `HW05/results/raw/baseline/23127194_ScenarioC_Baseline_20260812.jtl`; JMeter-generated report `HW05/results/html/baseline/23127194_ScenarioC_Baseline_20260812/statistics.json`; external SUT database `eshop-sut-seminar/backend/database.sqlite` |
| Generated/Modified Files | `HW05/tests/baseline/23127194_ScenarioC_Baseline_20260812.jmx`, `HW05/reports/load-baseline.md`, `HW05/reports/load-test-design.md`, `HW05/plan.md`, `HW05/reports/ai-audit-report.md`; local ignored evidence `HW05/results/raw/baseline/23127194_ScenarioC_Baseline_20260812.jtl`, `HW05/results/raw/baseline/attempt-01-connectivity-failure.jtl`, `HW05/results/html/baseline/23127194_ScenarioC_Baseline_20260812/`, and `HW05/data/scenario-c.local.csv` |
| AI Output | Created a separate standard-JMeter baseline plan with one thread, 20 sequential iterations, 20 unique non-recycled CSV accounts, the fixed nine-request Scenario C flow, JWT/order correlation, separate HTTP/business assertions, and disabled View Results Tree. The first execution attempt contained only connection failures because the backend process did not persist between tool sessions; that raw attempt was preserved separately and excluded from analysis. The valid rerun kept backend start, provisioning, JMeter, and shutdown in one controlled session. Measured from the untouched valid JTL: 180/180 HTTP requests returned 200, all 20/20 end-to-end flows passed, all 300 JTL rows including transaction parents succeeded, and database verification found 20/20 orders `canceled`. JMeter reported end-to-end average 11.00 ms, p95 40.65 ms, and 22.25 flows/s; HTTP total average 1.22 ms, p95 2.00 ms, and 346.15 requests/s. The JTL SHA-256 is `a7d157e1a763e85811da03192a7f1d638031d812096ca68857a0fce730d1fa84`. These are explicitly classified as short local zero-think-time baseline measurements, not Load capacity or Phase 2 evidence. Proposed, pending human review: 10 VUs; 20-second ramp-up; 120-second steady hold; 140-second scheduler duration; no staged ramp-down; 500 ms think-time; HTTP errors <= 1%; business success >= 99%; end-to-end p95 <= 250 ms; each transaction p95 <= 100 ms; Summary Report allocation. The final Load JMX was not generated because these values still require tester confirmation. No credentials, measured Load result, screenshot, resource usage, hardware evidence, or human judgment was fabricated. |

Human Review:
- Status: Accepted by tester on 2026-08-12
- Accepted: Entire proposed Load contract: VUs, ramp-up, hold, scheduler duration, ramp-down behavior, think-time, thresholds, and Summary Report allocation.
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-010

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T13:40:11+07:00 |
| Task | Generate and validate the human-confirmed Scenario C Load JMX |
| User Prompt | `Xác nhận toàn bộ proposal` |
| Evidence/Input Basis | `HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf`, `HW05/AGENTS.md`, `HW05/plan.md`, `HW05/reports/load-baseline.md`, `HW05/reports/load-test-design.md`, `HW05/.agents/skills/design-jmeter-load-test/SKILL.md`, `HW05/.agents/skills/design-jmeter-load-test/references/scenario-c-load-contract.md`, `HW05/.agents/skills/design-jmeter-load-test/scripts/validate_load_jmx.py`; final validation result `HW05/results/raw/validation/23127194_Load_20260812_dry-run.jtl`; external SUT database `eshop-sut-seminar/backend/database.sqlite` |
| Generated/Modified Files | `HW05/tests/23127194_Load_20260812.jmx`, `HW05/reports/load-baseline.md`, `HW05/reports/load-test-design.md`, `HW05/reports/load-plan-validation.md`, `HW05/plan.md`, `HW05/reports/ai-audit-report.md`; local ignored validation evidence under `HW05/results/raw/validation/` and local `HW05/data/scenario-c.local.csv` |
| AI Output | Recorded the tester's acceptance of the complete proposal and generated exactly `tests/23127194_Load_20260812.jmx`. The standard-JMeter 5.6.3 plan requires the four reviewed runtime properties without defaults, validates them and CSV capacity before measured traffic, assigns one non-recycled CSV row per thread, reuses that dedicated account inside a deadline-controlled flow loop, preserves the exact nine Scenario C requests, correlates token/product/order data, separates HTTP and business assertions, enables the human-approved Summary Report, disables View Results Tree, and records the accepted aggregate criteria. XML parsing, whitespace validation, the skill structural validator, and a missing-property negative test passed. Validation exposed and corrected four test-plan issues: Java 24/Groovy setup incompatibility, BeanShell null handling, scheduler interruption that left one checkout order pending, and transaction nesting that limited top-level Summary Report visibility. Failed/limited attempts were preserved separately and excluded from final validation. The final one-thread dry run used validation-only overrides of 1 thread, 1-second ramp-up, 8-second deadline, and 100 ms think-time. Its untouched JTL SHA-256 is `6141881d6cb7e291a003e81b6c0a2d111b1e8d670c90792673bbdd98fada45b4`; it contains 72/72 HTTP 200 samples, 8 complete samples for every HTTP and transaction label, 0/121 failures, and database verification found 8/8 orders `canceled` with no residual non-canceled order. The final JMX SHA-256 is `ffb7442c9bba6efe7b5c8c221832981cbaf01bb91f4d5db532440182173fd4ed`. JMeter GUI launched the plan, but automated accessibility could not attach to the Java application; tester visual tree review remains pending and was not fabricated. No measured 10-VU Load run, Load `.jtl`, HTML Load report, screenshot, resource usage, or hardware evidence was claimed. |

Human Review:
- Status: Pending human review of generated JMX
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-011

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T14:33:01+07:00 |
| Task | Execute and analyze the tester-approved Scenario C measured Load run |
| User Prompt | `Tôi đã review final JMeter tree và chấp nhận cho measured Load execution.` |
| Evidence/Input Basis | `HW05/tests/23127194_Load_20260812.jmx`, `HW05/reports/load-baseline.md`, `HW05/reports/load-plan-validation.md`, `HW05/.agents/skills/design-jmeter-load-test/`; real raw result `HW05/results/raw/load/23127194_Load_20260812.jtl`; JMeter-generated `HW05/results/html/load/23127194_Load_20260812/statistics.json`; real environment and database-state evidence under `HW05/evidence/load/`; external SUT database `eshop-sut-seminar/backend/database.sqlite` |
| Generated/Modified Files | `HW05/README.md`, `HW05/plan.md`, `HW05/reports/load-baseline.md`, `HW05/reports/load-plan-validation.md`, `HW05/reports/load-test-results.md`, `HW05/reports/main-report.md`, `HW05/results/README.md`, `HW05/scripts/provision-jmeter-users.sh`, `HW05/scripts/run-measured-load.sh`; local evidence `HW05/results/raw/load/23127194_Load_20260812.jtl`, `HW05/results/raw/load/23127194_Load_20260812.jmeter.log`, `HW05/results/raw/load/23127194_Load_20260812.console.log`, `HW05/results/html/load/23127194_Load_20260812/`, `HW05/evidence/load/23127194_Load_20260812-environment.txt`, `HW05/evidence/load/23127194_Load_20260812-order-state.txt`, and `HW05/evidence/load/23127194_Load_20260812-resources.csv` |
| AI Output | Recorded the tester's explicit visual acceptance of the final JMeter tree and executed the human-confirmed Load contract: 10 VUs, 20-second ramp-up, 140-second flow-start deadline containing the reviewed 120-second full-load hold, and 500 ms think-time. Two sandboxed backend starts stopped before JMeter and produced no measured JTL; unrestricted preparation then exposed delayed post-registration login, so provisioning retry was increased from five attempts at 0.2 seconds to twenty attempts at 0.5 seconds while retaining fail-closed CSV publication. The successful measured run generated an untouched JTL with SHA-256 `85bfb17b1fbc384cb8f2f00836ede96883c59030ba56e246cf103e8fe6ff8014`: 292/292 complete business flows passed, 2,628/2,628 HTTP samples returned 200, all 4,381 JTL rows passed, and database verification found 292/292 orders canceled with zero non-canceled orders. JMeter statistics measured end-to-end p95 38.35 ms and highest transaction p95 16 ms; HTTP errors were 0% and business success was 100%, so all reviewed Load criteria passed. The resource monitor CSV contained only its header and was explicitly rejected as CPU/RAM evidence; no resource-utilization claim was made. The runner was corrected for future attributed runs without overwriting the raw Load evidence. |

Human Review:
- Status: Measured Load results reviewed and approved by tester on 2026-08-14; original run retained for traceability, while independent Run02 is selected for Phase 6
- Accepted: Final JMeter tree, original measured result, and the Phase 6 decision to use only the complete Run02 JTL/HTML/environment/resource/order-state identity
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-012

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T14:33:02+07:00 |
| Task | Prepare the Phase 2 recording and screenshot script |
| User Prompt | `Hãy soạn kịch bản quay và chụp màn hình phase 2 cho tôi` |
| Evidence/Input Basis | `HW05/.agents/skills/design-jmeter-load-test/SKILL.md`, `HW05/reports/load-test-results.md`, `HW05/evidence/README.md`, `HW05/submission-checklist.md`, `HW05/scripts/run-measured-load.sh` |
| Generated/Modified Files | `HW05/evidence/phase-2-recording-script.md`, `HW05/scripts/run-measured-load.sh` |
| AI Output | Created a 3-4 minute Vietnamese Phase 2 recording script with window layout, narration, exact JMeter nodes to show, ten required screenshot names, credential-redaction rules, and post-recording checks. The script requires JMeter and Activity Monitor in the same frame, instructs the tester not to open the local credential CSV, and explains that measured metrics must come from the matching raw JTL/HTML report. Updated the Load runner to accept a sanitized `RUN_SUFFIX`, allowing a future `Run02` with separate JTL, HTML, resource, environment, and order-state paths instead of overwriting Run 01. The document truthfully identifies Run 01's resource CSV as invalid and requires a later run to contain actual resource rows before it can support CPU/RAM evidence. No screenshot or video was claimed to exist. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-013

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T14:33:03+07:00 |
| Task | Create and apply the Scenario C JMeter Stress-test skill for Phase 3 |
| User Prompt | `Tương tự thực hiện phase 3 bằng cách tạo skill và áp dụng skill đó thực hiện phase 3` |
| Evidence/Input Basis | `HW05/reports/load-test-results.md`, `HW05/tests/23127194_Load_20260812.jmx`, `HW05/plan.md`; Codex system `skill-creator` instructions; real raw result `HW05/results/raw/stress/23127194_Stress_20260812.jtl`; JMeter-generated `HW05/results/html/stress/23127194_Stress_20260812/statistics.json`; real resource/order-state evidence under `HW05/evidence/stress/`; external SUT database `eshop-sut-seminar/backend/database.sqlite` |
| Generated/Modified Files | `HW05/.agents/skills/run-jmeter-stress-test/SKILL.md`, `HW05/.agents/skills/run-jmeter-stress-test/agents/openai.yaml`, `HW05/.agents/skills/run-jmeter-stress-test/references/stress-contract.md`, `HW05/.agents/skills/run-jmeter-stress-test/scripts/generate_stress_jmx.py`, `HW05/.agents/skills/run-jmeter-stress-test/scripts/validate_stress_jmx.py`, `HW05/.agents/skills/run-jmeter-stress-test/scripts/analyze_stress_jtl.py`, `HW05/AGENTS.md`, `HW05/README.md`, `HW05/plan.md`, `HW05/tests/23127194_Stress_20260812.jmx`, `HW05/scripts/run-measured-stress.sh`, `HW05/reports/stress-test-design.md`, `HW05/reports/stress-test-results.md`, `HW05/reports/main-report.md`; local dry-run and measured artifacts under `HW05/results/raw/stress/`, `HW05/results/html/stress/`, and `HW05/evidence/stress/` |
| AI Output | Initialized and officially validated `$run-jmeter-stress-test`, including deterministic JMX generation, structural validation, active-thread-band analysis, progressive-stress rules, and evidence-integrity controls. Derived a Phase 3 experiment from the real 10-VU Load result: linear ramp to 80 threads over 240 seconds, 300-second flow-start deadline, 250 ms think-time, and Aggregate Report distinct from Load's Summary Report. Generated a Stress JMX with the exact same nine HTTP samplers as Load and no embedded credentials. The first dry run connected to a stale backend holding port 3000, produced two HTTP 401 login failures and no orders, and was preserved and excluded. The runner was corrected to fail when port 3000 is occupied and wait for the new database initialization marker; DryRun02 then passed 24/24 flows and 216/216 HTTP samples. The measured run provisioned 80 unique accounts and produced raw JTL SHA-256 `11017bc182bcfa53966964620e5a957a39cdbcf7c42cf1dc3080555c253660b8`: 6,336/6,336 flows passed, 57,024/57,024 HTTP requests passed, all 95,041 JTL rows passed, and 6,336/6,336 orders ended canceled. Active-thread bands 1-20, 21-40, 41-60, and 61-80 had 0% HTTP errors, 100% business success, end-to-end p95 values of 24, 22, 25, and 26 ms, and highest transaction p95 values of 10.90, 10, 12, and 13 ms. No degradation signal breached, so no breakpoint was observed up to 80 active threads; 80 was explicitly not claimed as a capacity ceiling. The resource file contained 294 timestamped samples; backend CPU averaged 9.56% and peaked at 22.7%, while backend RSS averaged 130.88 MiB and peaked at 188.11 MiB. JMeter JVM measurements were separated from SUT measurements. Stress tree/results remain pending tester visual and human review. |

Human Review:
- Status: Stress design, JMeter tree, and measured results reviewed and approved by tester on 2026-08-14
- Accepted: Measured Stress evidence and corrected design intent
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-014

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T14:37:36+07:00 |
| Task | Prepare the Phase 3 Stress recording and screenshot script |
| User Prompt | `Thực hiện việc lên kịch bản quay chụp cho phase 3` |
| Evidence/Input Basis | `HW05/.agents/skills/run-jmeter-stress-test/SKILL.md`, `HW05/.agents/skills/run-jmeter-stress-test/references/stress-contract.md`, `HW05/reports/stress-test-results.md`, `HW05/scripts/run-measured-stress.sh`, `HW05/evidence/phase-2-recording-script.md`, `HW05/evidence/README.md` |
| Generated/Modified Files | `HW05/evidence/phase-3-recording-script.md`, `HW05/evidence/README.md`, `HW05/reports/ai-audit-report.md` |
| AI Output | Created a Vietnamese Phase 3 recording guide for a 5-6 minute segment with a four-window layout, exact non-GUI `Run02` command, console/resource monitoring commands, active-thread-band analysis command, time-coded narration, and fourteen named screenshots. The guide requires the Stress JMeter tree, the unchanged nine-request Scenario C flow, 80-thread/240-second ramp/300-second deadline/250-ms think-time contract, Aggregate Report, disabled View Results Tree, provisioning of 80 isolated accounts, mid-ramp and high-band evidence, HTML charts, raw-JTL `allThreads` analysis, order state, and matching resource artifacts. It prohibits exposing the credential CSV, password, or JWT; prohibits copying Run 01 metrics into Run 02; and requires saying `no breakpoint observed up to 80 active threads` rather than calling 80 a capacity ceiling when no failure point is measured. Added the guide to the evidence index. No Run 02 execution, screenshot, recording, upload, or human narration was claimed. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-015

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T14:45:29+07:00 |
| Task | Initialize the Phase 4 JMeter Spike Test design and generation skill |
| User Prompt | `Thực hiện khởi tọ skill cho việc design và khởi tạo test plan cho spike test của phase 4` |
| Evidence/Input Basis | `HW05/reports/load-test-results.md`, `HW05/reports/stress-test-results.md`, `HW05/tests/23127194_Load_20260812.jmx`, `HW05/tests/23127194_Stress_20260812.jmx`, `HW05/plan.md`; Codex system `skill-creator` instructions |
| Generated/Modified Files | `HW05/.agents/skills/design-jmeter-spike-test/SKILL.md`, `HW05/.agents/skills/design-jmeter-spike-test/agents/openai.yaml`, `HW05/.agents/skills/design-jmeter-spike-test/references/spike-contract.md`, `HW05/.agents/skills/design-jmeter-spike-test/scripts/validate_spike_jmx.py`, `HW05/AGENTS.md`, `HW05/README.md`, `HW05/plan.md`, `HW05/reports/ai-audit-report.md` |
| AI Output | Initialized and officially validated `$design-jmeter-spike-test` as the Phase 4 design/generation gate. The skill requires measured Load and Stress evidence, preserves the exact nine-request Scenario C flow, requires explicit baseline/spike/recovery stage labels, enforces CSV account isolation and JWT/fresh-order correlation, reserves a third listener distinct from Load Summary Report and Stress Aggregate Report, and defines post-spike latency, business-state, resource, and recovery evidence. Added a candidate—not approved—model of 10 baseline threads for 30 seconds, an abrupt rise to 80 threads for 60 seconds, recovery at 10 threads for 30 seconds, transition within one second, 250 ms think-time, and Response Time Graph. The candidate uses 80 because Stress observed no degradation through that measured level and explicitly does not claim it will create a failure or represents a capacity ceiling. The skill requires tester confirmation before creating `tests/23127194_Spike_20260812.jmx` and tester visual tree review before measured execution. Added a deterministic validator for filename, three named stages, nine samplers per stage, CSV controls, token/order correlation, listener choice, disabled View Results Tree, and absence of known credentials. Validator self-test and official skill validation passed. No Spike JMX, dry run, measured Spike traffic, JTL, report, screenshot, recovery result, or human approval was created or claimed. |

Human Review:
- Status: Pending human review of Spike proposal
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-016

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T14:50:58+07:00 |
| Task | Design the Phase 4 Scenario C JMeter Spike and recovery contract |
| User Prompt | `Using [design-jmeter-spike-test](HW05/.agents/skills/design-jmeter-spike-test/) to design and generate test plans for phase 4` |
| Evidence/Input Basis | `HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf`, `HW05/AGENTS.md`, `HW05/plan.md`, `HW05/reports/load-test-results.md`, `HW05/reports/stress-test-results.md`, `HW05/tests/23127194_Load_20260812.jmx`, `HW05/tests/23127194_Stress_20260812.jmx`, `HW05/.agents/skills/design-jmeter-spike-test/SKILL.md`, `HW05/.agents/skills/design-jmeter-spike-test/references/spike-contract.md`, `HW05/.agents/skills/design-jmeter-spike-test/scripts/validate_spike_jmx.py` |
| Generated/Modified Files | `HW05/reports/spike-test-design.md`, `HW05/plan.md`, `HW05/reports/ai-audit-report.md` |
| AI Output | Designed a three-stage standard-JMeter Spike experiment from measured evidence and preserved the exact nine-request Scenario C flow. Proposed, pending human review: a serialized 10-thread Baseline stage for 30 seconds, an abrupt 80-thread Spike stage for 60 seconds, a 10-thread Recovery stage for 30 seconds, one-second thread ramps/transitions, 250 ms think-time, provisioning of at least 80 unique accounts, and Response Time Graph as the third distinct listener after Load Summary Report and Stress Aggregate Report. Proposed per-stage criteria are HTTP errors <= 1%, business success >= 99%, end-to-end p95 <= 250 ms, and every transaction p95 <= 100 ms. Proposed recovery criteria require Recovery end-to-end p95 <= 1.5 times the same run's Baseline-stage p95, recovery within 20 seconds based on consecutive 10-second windows, zero residual non-canceled orders, and valid timestamped resource evidence reported descriptively. The design explicitly states that Stress found no breakpoint through 80 threads, so a passing Spike run would demonstrate resilience at 80 rather than a capacity ceiling or failure point. It specifies serialized stage/account isolation, graceful completion of active flows at each deadline, stage-prefixed JTL labels, required no-default `spike.*` properties, and a fail-fast CSV-capacity gate. The Spike validator self-test and `git diff --check` passed. In accordance with the selected skill, `tests/23127194_Spike_20260812.jmx` was intentionally not generated because the tester has not explicitly confirmed the proposed stages, transition, think-time, thresholds, recovery rule, and listener allocation. No Spike dry run, measured traffic, JTL, report, screenshot, recovery behavior, resource evidence, or human approval was fabricated. |

Human Review:
- Status: Complete Spike proposal accepted by tester on 2026-08-12
- Accepted: Serialized 10-thread/30-second Baseline, 80-thread/60-second Spike, and 10-thread/30-second Recovery with one-second ramps, 250 ms think-time, all acceptance/recovery criteria, CSV allocation, and Response Time Graph listener.
- Modified:
- Removed:
- Added:
- Notes: Approval supplied in the subsequent prompt `Xác nhận toàn bộ Spike proposal`.

## AI Audit Entry - AI-017

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T15:01:44+07:00 |
| Task | Generate and validate the human-confirmed Scenario C Spike JMX |
| User Prompt | `Xác nhận toàn bộ Spike proposal` |
| Evidence/Input Basis | `HW05/reports/load-test-results.md`, `HW05/reports/stress-test-results.md`, `HW05/reports/spike-test-design.md`, `HW05/tests/23127194_Load_20260812.jmx`, `HW05/tests/23127194_Stress_20260812.jmx`, `HW05/.agents/skills/design-jmeter-spike-test/SKILL.md`, `HW05/.agents/skills/design-jmeter-spike-test/references/spike-contract.md`; validation-only raw result `HW05/results/raw/validation/23127194_Spike_20260812_dry-run.jtl`; external SUT database `eshop-sut-seminar/backend/database.sqlite` |
| Generated/Modified Files | `HW05/.agents/skills/design-jmeter-spike-test/scripts/generate_spike_jmx.py`, `HW05/.agents/skills/design-jmeter-spike-test/scripts/validate_spike_jmx.py`, `HW05/tests/23127194_Spike_20260812.jmx`, `HW05/reports/spike-test-design.md`, `HW05/reports/spike-plan-validation.md`, `HW05/plan.md`, `HW05/reports/ai-audit-report.md`; local ignored validation evidence `HW05/results/raw/validation/23127194_Spike_20260812_dry-run.jtl`, `.jmeter.log`, and `.console.log` |
| AI Output | Recorded the tester's complete Spike-proposal acceptance and generated exactly `tests/23127194_Spike_20260812.jmx` with overwrite refusal. The standard-JMeter plan contains three serialized Thread Groups implementing the accepted 10-thread/30-second Baseline, sudden 80-thread/60-second Spike, and 10-thread/30-second Recovery; each uses a one-second ramp, 250 ms think-time, stage-prefixed labels, graceful flow deadlines, independent non-recycled CSV allocation, and the unchanged nine-request token/order-correlated Scenario C controller. It requires all ten `spike.*` properties without numeric fallbacks, validates CSV capacity against maximum stage concurrency, enables the confirmed Response Time Graph, disables View Results Tree, and records the accepted absolute/relative recovery contract in Test Plan metadata. The validator was strengthened to compare each stage's actual HTTP sampler, correlation, and paired assertion XML directly with the validated Load JMX; self-test and official validation passed. The final JMX SHA-256 is `6f451d52364f87c4cca719d96a3f90047bd1cbe7180183c221ea7cafd174f827`. A clean-reset validation-only dry run used 2→4→2 VUs, 4/5/4-second stage deadlines, one-second ramps, 50 ms think-time, and four fresh users. Its untouched JTL SHA-256 is `f5e40c0a2ca5fa9f8b36c310ca7de4421e1b1b3e4b39b55eb16ebcfa6741ebb6`: 67/67 complete flows passed, 603/603 HTTP requests passed, all 1,014 JTL rows succeeded, and database verification found 67 canceled orders with zero non-canceled orders. This short run is classified only as functional validation. No measured 10→80→10 Spike run, HTML Spike report, resource-recovery evidence, screenshot, visual review, capacity ceiling, or measured recovery conclusion was claimed. Measured execution remains blocked on tester visual review of the final tree and a separate authorization. |

Human Review:
- Status: Final Spike tree visually reviewed and accepted by tester on 2026-08-12
- Accepted: Complete Spike proposal, generated JMX, validation evidence, final visual tree, and authorization for measured execution
- Modified:
- Removed:
- Added:
- Notes: Visual acceptance and execution authorization supplied in the subsequent prompt `Tôi đã thực hiện việc xác nhận spike tree hãy thực hiện việc execution`.

## AI Audit Entry - AI-018

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T15:18:44+07:00 |
| Task | Execute and analyze the tester-approved Scenario C measured Spike run |
| User Prompt | `Tôi đã thực hiện việc xác nhận spike tree hãy thực hiện việc execution` |
| Evidence/Input Basis | `HW05/tests/23127194_Spike_20260812.jmx`, `HW05/reports/spike-test-design.md`, `HW05/reports/spike-plan-validation.md`, `HW05/reports/load-test-results.md`, `HW05/reports/stress-test-results.md`, `HW05/.agents/skills/design-jmeter-spike-test/SKILL.md`; real raw result `HW05/results/raw/spike/23127194_Spike_20260812.jtl`; JMeter-generated `HW05/results/html/spike/23127194_Spike_20260812/statistics.json`; real environment/resource/order-state evidence under `HW05/evidence/spike/`; external SUT database `eshop-sut-seminar/backend/database.sqlite` |
| Generated/Modified Files | `HW05/scripts/run-measured-spike.sh`, `HW05/reports/spike-test-results.md`, `HW05/plan.md`, `HW05/README.md`, `HW05/results/README.md`, `HW05/evidence/README.md`, `HW05/reports/main-report.md`, `HW05/reports/ai-audit-report.md`; local measured artifacts `HW05/results/raw/spike/23127194_Spike_20260812.jtl`, `.jmeter.log`, `.console.log`, `HW05/results/html/spike/23127194_Spike_20260812/`, `HW05/evidence/spike/23127194_Spike_20260812-environment.txt`, `-resources.csv`, and `-order-state.txt` |
| AI Output | Recorded the tester's visual acceptance of the final Spike tree and executed the human-confirmed measured workload after a clean backend reset and provisioning of 80 fresh accounts: serialized Baseline 10 threads/30 seconds, sudden Spike 80 threads/60 seconds, Recovery 10 threads/30 seconds, one-second ramps, and 250 ms think-time. The untouched raw JTL SHA-256 is `62592462cb28c12ea3469fa73836db1b91793161b45cba1ebcbc024bb8c53c9e`: 2,363/2,363 complete business flows passed, 21,267/21,267 HTTP requests passed, all 35,546 raw JTL rows succeeded, and database verification found 2,363 canceled orders with zero non-canceled orders. Baseline/Spike/Recovery end-to-end p95 values from JMeter's generated statistics were 36.45/27.00/26.00 ms; highest transaction p95 values were 16.45/14.00/11.00 ms. All per-stage HTTP, business, absolute p95, and transaction thresholds passed. Recovery p95 was 0.71 times same-run Baseline and below the 1.5-times limit. Raw timestamp analysis found the 0-10, 10-20, and 20-30 second Recovery windows had p95 values of 25.00, 23.95, and 26.00 ms, 100% business success, and 0% HTTP errors; since the first window and every later full window passed, application recovery was confirmed at 10 seconds within the reviewed 20-second limit. The resource CSV contained 125 backend samples: whole-run CPU averaged 9.23% and peaked at 25.4%, and RSS averaged 141.38 MiB and peaked at 190.06 MiB. Backend CPU returned toward baseline in the final Recovery window (3.62% versus 2.27% before Spike), while RSS remained elevated (182.17 versus 77.27 MiB); therefore application/CPU recovery was reported, but memory recovery was not claimed. The run demonstrates resilience and recovery at the tested 80-thread spike, not a capacity ceiling. No screenshot, video, defect, or longer-term memory conclusion was fabricated. |

Human Review:
- Status: Measured Spike results reviewed and approved by tester on 2026-08-14
- Accepted: Final Spike tree, measured stage metrics, recovery interpretation, and resource evidence
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-019

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T15:28:29+07:00 |
| Task | Design the Phase 4 Spike recording script and capture existing measured dashboard screenshots |
| User Prompt | `Thực hiện thiết kế recording script và chụp màn hình cho phase 4` |
| Evidence/Input Basis | `HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf`, `HW05/.agents/skills/design-jmeter-spike-test/SKILL.md`, `HW05/.agents/skills/design-jmeter-spike-test/references/spike-contract.md`, `HW05/tests/23127194_Spike_20260812.jmx`, `HW05/scripts/run-measured-spike.sh`, `HW05/reports/spike-test-results.md`, real raw result `HW05/results/raw/spike/23127194_Spike_20260812.jtl`, and JMeter-generated HTML dashboard `HW05/results/html/spike/23127194_Spike_20260812/` |
| Generated/Modified Files | `HW05/evidence/phase-4-recording-script.md`, `HW05/evidence/README.md`, `HW05/evidence/screenshots/spike/09-spike-dashboard-overview.jpg`, `HW05/evidence/screenshots/spike/10-spike-statistics.jpg`, `HW05/evidence/screenshots/spike/11-active-threads-over-time.jpg`, `HW05/evidence/screenshots/spike/12-spike-response-times-over-time.jpg`, `HW05/reports/ai-audit-report.md` |
| AI Output | Created a Vietnamese 5-6 minute Phase 4 recording guide with a four-region screen layout, exact non-GUI `RUN_SUFFIX=Run02 scripts/run-measured-spike.sh` command, console/resource monitoring commands, time-coded narration, and fifteen evidence groups. The guide covers the reviewed serialized 10-thread/30-second Baseline, 80-thread/60-second sudden Spike, and 10-thread/30-second Recovery workload with one-second ramps and 250 ms think-time; the unchanged nine-request Scenario C flow; CSV/JWT/fresh-order correlation; Response Time Graph; disabled View Results Tree; automated provisioning of 80 users; live Baseline/Spike/Recovery frames; same-run recovery-window analysis; order state; and resource interpretation. It requires Run02 metrics to come only from Run02 evidence, prohibits exposing credentials or mixing run identities, warns that the JMeter one-minute graph alone cannot establish recovery time, and prohibits claiming a capacity ceiling or memory recovery without evidence. Captured four real 1280x720 JPEG screenshots from the existing measured Run01 JMeter HTML dashboard: report identity/request summary, Statistics, Active Threads Over Time, and Response Times Over Time. The Statistics image shows the measured report's real values and the two chart images are JMeter-generated views of the same Run01. No screenshot was fabricated or edited. No Run02 execution, JMeter GUI screenshot, Activity Monitor screenshot, live tool/resource-monitor frame, new raw JTL, new performance result, video, upload, or human narration was created or claimed; those visible-run items remain for the tester to capture. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-020

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T15:47:30+07:00 |
| Task | Initialize the Phase 5 JMeter Endurance design and generation skill |
| User Prompt | `Thiết kế skill để design và generate test plan cho endurance test của phase 5` |
| Evidence/Input Basis | `HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf`, `HW05/plan.md`, `HW05/reports/load-test-results.md`, `HW05/reports/stress-test-results.md`, `HW05/reports/spike-test-results.md`, `HW05/tests/23127194_Load_20260812.jmx`; Codex system `skill-creator` instructions |
| Generated/Modified Files | `HW05/.agents/skills/design-jmeter-endurance-test/SKILL.md`, `HW05/.agents/skills/design-jmeter-endurance-test/agents/openai.yaml`, `HW05/.agents/skills/design-jmeter-endurance-test/references/endurance-contract.md`, `HW05/.agents/skills/design-jmeter-endurance-test/scripts/generate_endurance_jmx.py`, `HW05/.agents/skills/design-jmeter-endurance-test/scripts/validate_endurance_jmx.py`, `HW05/AGENTS.md`, `HW05/README.md`, `HW05/plan.md`, `HW05/reports/ai-audit-report.md` |
| AI Output | Initialized and officially validated `$design-jmeter-endurance-test` as the Phase 5 design/generation gate. The skill requires the measured Load, Stress, and Spike evidence; preserves the exact nine-request Scenario C flow and paired assertions; requires explicit tester confirmation of sustained threads, ramp, 10-15 minute duration, think-time, latency/business thresholds, memory-trend rule, resource interval, analysis windows, and disabled-GUI-listener strategy before creating `tests/23127194_Endurance_20260812.jmx`; and blocks measured traffic until visual JMeter-tree review. Added a starting proposal, explicitly pending human review, of 60 threads, 30-second ramp, 720-second duration, 250 ms think-time, one-second resource samples, 60-second analysis windows, and no enabled GUI listener. The candidate stays below the maximum tested Stress concurrency of 80 because no breakpoint was observed through 80; it does not label 80 a capacity ceiling. Added a deterministic overwrite-refusing generator that clones the validated Load functional flow and requires all four `endurance.*` properties without numeric fallbacks. Added a validator for exact Load sampler/assertion parity, nine HTTP samplers, CSV isolation, JWT/fresh-order correlation, disabled GUI listeners, filename, and credential absence. Official skill validation and validator self-test passed. A temporary 60-thread/30-second-ramp/720-second-duration/250-ms-think-time JMX was generated only under `/tmp` and passed the structural validator; it is not a repository deliverable or execution result. No final Endurance JMX, backend execution, dry run, measured traffic, JTL, HTML report, RPS threshold, memory ceiling, screenshot, or human approval was created or claimed. |

Human Review:
- Status: Endurance proposal accepted by tester on 2026-08-12
- Accepted: 60 threads, 30-second ramp, 720-second duration, 250 ms think-time, one-second resource sampling, 60-second analysis windows, acceptance thresholds, descriptive memory-trend rule, disabled GUI listeners, and authorization to generate the final JMX
- Modified:
- Removed:
- Added:
- Notes: Confirmation supplied in the subsequent prompt `Tôi đã kiểm tra và xác nhận hãy tiếp tục thực hiện`.

## AI Audit Entry - AI-021

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T15:57:53+07:00 |
| Task | Generate and validate the human-confirmed Scenario C Endurance JMX |
| User Prompt | `Tôi đã kiểm tra và xác nhận hãy tiếp tục thực hiện` |
| Evidence/Input Basis | `HW05/.agents/skills/design-jmeter-endurance-test/SKILL.md`, `HW05/.agents/skills/design-jmeter-endurance-test/references/endurance-contract.md`, `HW05/reports/load-test-results.md`, `HW05/reports/stress-test-results.md`, `HW05/reports/spike-test-results.md`, `HW05/tests/23127194_Load_20260812.jmx`; validation-only raw result `HW05/results/raw/validation/23127194_Endurance_20260812_dry-run.jtl`; external SUT database `eshop-sut-seminar/backend/database.sqlite` |
| Generated/Modified Files | `HW05/tests/23127194_Endurance_20260812.jmx`, `HW05/reports/endurance-test-design.md`, `HW05/reports/endurance-plan-validation.md`, `HW05/plan.md`, `HW05/README.md`, `HW05/reports/ai-audit-report.md`; local ignored validation artifacts `HW05/results/raw/validation/23127194_Endurance_20260812_dry-run.jtl` and `HW05/results/raw/validation/23127194_Endurance_20260812_dry-run.jmeter.log`; local ignored credential CSV regenerated for two validation accounts |
| AI Output | Recorded the tester's acceptance of the complete Endurance proposal and generated exactly `tests/23127194_Endurance_20260812.jmx` with overwrite refusal. The JMX SHA-256 is `9c8e988e338935e904bd7b1a8a36ce84ef918a8fbdaba164aedc5fb5d39bac2d`. The standard-JMeter plan records the accepted 60-thread, 30-second-ramp, 720-second-flow-start-duration, and 250-ms-think-time contract; requires all four `endurance.*` runtime properties without numeric fallbacks; contains one measured Thread Group; preserves exact parity with the Load plan's nine HTTP samplers and paired assertions covering auth-heavy, read-heavy, and transactional groups; keeps non-recycled CSV allocation and JWT/fresh-`orderId` correlation; and disables both Summary Report and View Results Tree for measured execution. Structural validation passed. A clean-reset validation-only dry run provisioned two temporary accounts and used 2 threads, one-second ramp, eight-second flow-start duration, and 50 ms think-time. Its untouched JTL SHA-256 is `a0775dd03a03238bf7f745bcf03c130c1f3de60c24f6cd6c780f86aac497168f`: 30/30 complete flows passed, 270/270 HTTP requests passed, all 451 JTL rows succeeded, and database verification found 30 canceled orders with zero non-canceled orders. This short run is classified only as functional validation and was not used to calculate RPS, latency trend, resource trend, or memory ceiling. The backend was stopped afterward. The final measured 60-thread/12-minute execution remains blocked until the tester visually reviews the final JMeter tree and explicitly authorizes it. No measured Endurance run, HTML Endurance report, resource evidence, maximum stable RPS, memory ceiling, screenshot, or visual approval was created or claimed. |

Human Review:
- Status: Final Endurance tree visually reviewed and accepted by tester on 2026-08-12
- Accepted: Complete Endurance proposal, generated JMX, validation evidence, final visual tree, and authorization for measured execution
- Modified:
- Removed:
- Added:
- Notes: Visual acceptance and execution authorization supplied in the subsequent prompt `Tôi đã xem qua final tree, bạn hãy measure endurance 12 phút`.

## AI Audit Entry - AI-022

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-12T16:26:55+07:00 |
| Task | Execute and analyze the tester-approved Scenario C measured Endurance run |
| User Prompt | `Tôi đã xem qua final tree, bạn hãy measure endurance 12 phút` |
| Evidence/Input Basis | `HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf`, `HW05/tests/23127194_Endurance_20260812.jmx`, `HW05/reports/endurance-test-design.md`, `HW05/reports/endurance-plan-validation.md`, `HW05/.agents/skills/design-jmeter-endurance-test/SKILL.md`; real raw result `HW05/results/raw/endurance/23127194_Endurance_20260812.jtl`; JMeter-generated `HW05/results/html/endurance/23127194_Endurance_20260812/statistics.json`; analyzer output `HW05/results/raw/endurance/23127194_Endurance_20260812-analysis.json`; real environment/resource/order-state evidence under `HW05/evidence/endurance/`; external SUT database `eshop-sut-seminar/backend/database.sqlite` |
| Generated/Modified Files | `HW05/.agents/skills/design-jmeter-endurance-test/SKILL.md`, `HW05/.agents/skills/design-jmeter-endurance-test/scripts/analyze_endurance.py`, `HW05/scripts/run-measured-endurance.sh`, `HW05/reports/endurance-test-design.md`, `HW05/reports/endurance-plan-validation.md`, `HW05/reports/endurance-test-results.md`, `HW05/plan.md`, `HW05/README.md`, `HW05/results/README.md`, `HW05/evidence/README.md`, `HW05/reports/main-report.md`, `HW05/reports/ai-audit-report.md`; local measured artifacts `HW05/results/raw/endurance/23127194_Endurance_20260812.jtl`, `.jmeter.log`, `.console.log`, `.backend.log`, `HW05/results/raw/endurance/23127194_Endurance_20260812-analysis.json`, `HW05/results/html/endurance/23127194_Endurance_20260812/`, `HW05/evidence/endurance/23127194_Endurance_20260812-environment.txt`, `-resources.csv`, and `-order-state.txt` |
| AI Output | Recorded the tester's visual acceptance of the final Endurance tree and executed the human-confirmed measured workload after a clean backend reset and provisioning of 60 fresh accounts: 60 threads, 30-second ramp, 720-second flow-start duration, 250 ms think-time, one-second resource sampling, and disabled GUI listeners. The measured flow interval was `2026-08-12T16:08:38.453+07:00` to `2026-08-12T16:20:38.247+07:00` (719.794 seconds). The untouched raw JTL SHA-256 is `15752a8303fc0db4c7696b6da116b899d1c38e79e90aa351dac8daede4f072c9`: 18,400/18,400 complete business flows passed, 165,600/165,600 HTTP requests passed, all 276,001 JTL rows succeeded, and database verification found 18,400 canceled orders with zero non-canceled orders. Whole-run end-to-end average/p95 were 16.03/30 ms, the highest transaction p95 was 14 ms, HTTP errors were 0%, and business success was 100%. Raw timestamp analysis excluded the ramp and evaluated eleven complete one-minute steady windows; all eleven passed, with a maximum observed stable complete-flow rate of 26.23 flows/s in minute 9. The resource CSV contained 698 samples: backend CPU averaged 12.01% and peaked at 23.2%, while backend RSS averaged 99.73 MiB and peaked at 188.84 MiB. The final five complete windows had a positive RSS slope of +5.99 MiB/minute, so no memory plateau or safe memory ceiling was claimed; 188.84 MiB is reported only as the maximum observed backend RSS for this machine and run. The result does not establish a global maximum RPS or capacity ceiling. No screenshot, video, defect, human acceptance of measured results, or longer-term memory conclusion was fabricated. |

Human Review:
Human Review:
- Status: Measured Endurance results reviewed and approved by tester on 2026-08-14
- Accepted: Final Endurance tree, measured result, steady-window analysis, resource interpretation, and limitations
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-023

| Field | Content |
| --- | --- |
| AI Tool | Codex; Codex Browser (capture attempt only) |
| Date and Time | 2026-08-12T16:37:03+07:00 |
| Task | Prepare the Phase 5 Endurance recording and screenshot script |
| User Prompt | `Lên recording script và screenshot cho phase 5` |
| Evidence/Input Basis | `HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf`, `HW05/.agents/skills/design-jmeter-endurance-test/SKILL.md`, `HW05/.agents/skills/design-jmeter-endurance-test/references/endurance-contract.md`, `HW05/tests/23127194_Endurance_20260812.jmx`, `HW05/scripts/run-measured-endurance.sh`, `HW05/reports/endurance-test-results.md`, real raw result `HW05/results/raw/endurance/23127194_Endurance_20260812.jtl`, JMeter-generated dashboard `HW05/results/html/endurance/23127194_Endurance_20260812/`, analyzer output `HW05/results/raw/endurance/23127194_Endurance_20260812-analysis.json`, and real resource/order-state evidence under `HW05/evidence/endurance/` |
| Generated/Modified Files | `HW05/evidence/phase-5-recording-script.md`, `HW05/evidence/README.md`, `HW05/reports/ai-audit-report.md` |
| AI Output | Created a Vietnamese Phase 5 recording guide for an approximately 5-6 minute narrated segment, with four-region screen layout, exact non-GUI `RUN_SUFFIX=Run02 scripts/run-measured-endurance.sh` command, live console/resource commands, deterministic Run02 analyzer command, time-coded narration, and sixteen screenshot groups. The guide covers the reviewed 60-thread, 30-second-ramp, 720-second-flow-start-duration, and 250-ms-think-time contract; the unchanged nine-request Scenario C flow; CSV/JWT/fresh-`orderId` correlation; disabled GUI listeners; automated provisioning of 60 users; real ramp/mid-run/final-minute frames; JMeter dashboard views; eleven complete one-minute steady windows; same-run stable complete-flow rate; resource separation; memory-tail interpretation; order state; and artifact identity. It includes the real Run01 values only as Run01 narration and prohibits copying them to Run02, mixing run identities, exposing credentials, calling complete-flow rate HTTP RPS, claiming a capacity ceiling, or claiming a memory plateau/ceiling when the observed tail slope remains positive. Browser-based capture of the local `file://` JMeter dashboard was attempted, but the browser URL policy blocked local-file navigation. No workaround was used and no Phase 5 screenshot was created or claimed. The guide and evidence index therefore mark every Phase 5 screenshot as a tester capture, especially the assignment-required JMeter/resource-monitor same-frame evidence. No Run02 execution, new JTL, new performance metric, screenshot, recording, upload, or human narration was created or claimed. |

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:

## AI Audit Entry - AI-024

| Field | Content |
| --- | --- |
| AI Tool | Codex |
| Date and Time | 2026-08-14T16:08:34+07:00 |
| Task | Complete Phase 6 AI analysis, human-correction record, critique draft, and screenshot requirement review |
| User Prompt | `Đây là những thông tin về phần việc của tôi hãy xem qua và cập nhật tương ứng sau đó thực hiện phần việc của bạn:`<br>`1. Bộ run chính thức của phase 6 mặc định là không có hậu tố, tuy nhiên đối với load test phần csv của load run không có hậu tố hiện tại bị mất nên hãy thay thế bằng Run2`<br>`2. Các mesured result tôi đã review qua và approve toàn bộ hãy update toàn bộ`<br>`3. Chọn Run02 làm một run độc lập rồi phân tích toàn bộ JTL, environment và resource của chính Run02.`<br>`4. Cách creator skill khi agent thực hiện, agent thường chỉ thiết kế skill cho task cụ thể, không hoặc hạn chế trong khả năng tái sử dụng ở các tình huống cần loại test tương tự. File jmx ban đầu của phần stress test ban đầu không chi thành 3 mà gom thành 1, tôi đã chỉnh sửa lại chia thành 3 giai đoạn cụ thể. Nguyên nhân một phần là do prompt ban đầu tôi đưa cho agent thực hiện không đủ context`<br>`5. 3 hình ảnh tôi cung cấp là hình ảnh chụp khi đang chạy thực tế 3 loại testing, hiện tại đang thiếu 1 cái bạn hãy kiểm tra cập nhật cho loại testing tương ứng và báo tôi loại testing còn thiếu để tôi thực hiện bổ sung`<br>`6. Hãy xem lại requirement [2026.HW05.Performance Testing_En_2.0_HTThanh.pdf](HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf) xem ảnh screenshot minh chứng đã đủ chưa, nếu chưa hãy liệt kê để tôi bổ sung thêm.`<br><br>Three live-run screenshots were attached to the prompt and visually classified as Load Run02, Stress Run02, and Spike Run02. |
| Evidence/Input Basis | `HW05/2026.HW05.Performance Testing_En_2.0_HTThanh.pdf`; tester-provided live-run screenshots; Load Run02 raw JTL, HTML statistics, environment, resource CSV, order state, and runner; unsuffixed Stress, Spike, and Endurance JTL/HTML/resource/environment/order-state evidence; `HW05/tests/23127194_Stress_20260812.jmx`; external SUT `backend/database.js` and `backend/server.js` |
| Generated/Modified Files | `HW05/reports/load-test-results.md`, `HW05/reports/stress-test-results.md`, `HW05/reports/spike-test-results.md`, `HW05/reports/endurance-test-results.md`, `HW05/reports/ai-analysis.md`, `HW05/reports/ai-critique.md`, `HW05/reports/main-report.md`, `HW05/evidence/screenshot-requirements-review.md`, `HW05/evidence/README.md`, `HW05/results/README.md`, `HW05/plan.md`, `HW05/submission-checklist.md`, `HW05/reports/ai-audit-report.md` |
| AI Output | Recorded tester approval of all four measured-result reports and selected the complete Load Run02 identity for Phase 6 while retaining the original Load run for traceability. Verified Load Run02 directly: SHA-256 `93339257e0a408a5d591820ac11e591736f2ed40d69abe7a7e2db0fad8ac67b5`, 291/291 successful flows, 2,619/2,619 HTTP 200 samples, 4,366 successful JTL rows, 48 ms end-to-end p95, and 291 canceled orders. The Run02 resource CSV has 140 malformed four-field rows under a five-column header and no attributable backend CPU/RSS, so no Load backend-resource claim was made. Completed the Phase 6 cross-run analysis, six metric/interpretation corrections, candidate diagnostic thresholds, and architecture-based optimization classification. Drafted a 250-word critique incorporating the tester's observations about limited skill reuse, missing Stress-stage context, and human responsibility. Reviewed the assignment PDF visually and textually: the three attached images map to the required Load/Stress/Spike live-run types; among all four locally used test types, Endurance is the missing live image, but the assignment explicitly mandates live screenshots only for Load/Stress/Spike. A separate hostname-bearing hardware-report screenshot/spec table is still required. The chat images are not filesystem artifacts and were not falsely claimed as saved. The existing Stress JMX/raw run remain untouched because changing the plan associated with an existing JTL would break evidence traceability; a future three-stage version requires a new versioned execution. |

Human Review:
- Status: Tester decisions recorded; Phase 6 AI analysis, proposed thresholds, optimization classifications, and critique wording pending final tester review
- Accepted: All Phase 2–5 measured result reports; independent Load Run02 evidence identity; tester-authored skill/Stress/prompt critique points
- Modified: Load Phase 6 source changed from the unsuffixed run to Run02
- Removed: Unsupported Load backend-resource inference and cross-run evidence mixing
- Added: Screenshot mapping, missing-evidence list, metric corrections, optimization classification, and 250-word critique draft
- Notes: Tester must save/reattach the three chat screenshots as files and supply a hardware-report screenshot. An Endurance live screenshot is missing from the four-type set but is recommended rather than explicitly required by the assignment's three-scenario screenshot clause.
