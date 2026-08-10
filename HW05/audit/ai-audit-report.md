# AI Audit Report

## 1. Declaration

I use AI tools for the following tasks.

| No. | AI Tool | Purpose |
| --- | --- | --- |
| 1 | Codex | Assist in scoping, generating, calibrating, analysing, reviewing, documenting, and auditing HW05 k6 performance-testing artifacts. |

## 2. Audit rules

- Add one row per material AI interaction or generated artifact.
- Preserve the verbatim prompt and output in the report or linked text artifacts with SHA-256 hashes.
- Tag the verdict as `VALID`, `INVALID`, or `INCOMPLETE`.
- Cite the assignment, SUT source, or exact raw k6 metric in Reasoning.
- State the concrete human check or correction in Student Fix.
- Never represent AI-generated values as real execution evidence.

## 3. Audit table

| (1) Prompt + Tool | (2) AI Output | (3) Verdict | (4) Reasoning (assignment / SUT / raw evidence) | (5) Student Fix |
| --- | --- | --- | --- | --- |
| **Artifact:** `HW05/PLAN.md; HW05/k6; HW05/results/calibration; HW05/agent-skill/hw05-ai-audit-report`<br><br>**Tool:** Codex<br><br>**Time:** 2026-08-10 16:07 +07<br><br>**Prompt file:** `HW05/audit/prompts/interaction-001.txt` (SHA-256 `b08db1481b0c14aef317b259d598a914f4c4f34fde3c6e5dbd5a590fde694bc3`)<br><br>**Exact prompt:** - Phần 1.Fix scope của PLAN.md hãy cập nhật lại dựa trên các FR mà tôi đã thực hiện ở HW02<br>- Bổ sung thêm skill AI audit report cho phần HW05, bạn có thể tham khảo skill này của các HW trước đó<br>- Tài khoản sẽ bao gồm 2 tài khoản cho 2 trang web là user và admin trong đó<br>  - Admin: admin@eshop.com / Admin123!<br>  - User test: test@eshop.com / Test1234!<br>- Bạn hãy tự xác nhận GRAFANA_OUTPUT hiện có trong eshop-sut-seminar giúp tôi<br>- Tôi đã chạy backend<br>- Hãy thực hiện việc chạy VU/RPS để tìm ra con số cho tôi thực hiện evidence run<br> | **Output file:** `HW05/audit/outputs/interaction-001.txt` (SHA-256 `b9c564ad822d00da43c63f57e62bb149996bd467f132d8d0d5d65d7e89bc8ab4`)<br><br>**Exact output:** Updated HW05 fixed scope to trace Load to FR-05, Stress to Mobile-FR04/FR-17 authenticated access, and Spike to FR-09 with FR-17 coupon data. Verified both admin and user credentials via HTTP 200 logins. Confirmed that Grafana k6 v2.0.0 is installed, but no Grafana server, Prometheus, InfluxDB, Docker metrics stack, k6 config output, GRAFANA_OUTPUT environment variable, or external output is configured. Added and validated the reusable hw05-ai-audit-report skill with a tested append script. Updated the CSV data and k6 plans. Executed one-VU smoke tests and short VU/RPS calibration runs. Recommended evidence settings: Load 50 VU; Stress stages 50/200/600/1200 VU; Spike 20 baseline to 400 peak to 20 recovery; Endurance 4000 RPS for 12 minutes. The highest zero-drop short probe was 6000 RPS; 7000 RPS dropped 37 iterations, so 6000 is not claimed as a proven endurance threshold. Calibration summaries were saved separately, and the pre-calibration SQLite database was backed up. Calibration created 21687 test orders; database integrity remained OK.<br> | INCOMPLETE | Scope and calibration values were checked against HW02 artifacts, SUT source, account HTTP responses, and k6 summary exports. The result remains INCOMPLETE because final evidence runs still require same-frame resource monitoring, long holds, and the 12-minute soak. | Human must record the final runs, verify CPU/RSS and recovery by phase, then replace calibration-only values with final raw evidence citations. |
<!-- AUDIT_ROWS -->
