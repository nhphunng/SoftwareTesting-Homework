# Screenshot Evidence Review

## Requirement basis

Section 6 requires, for each Load, Stress, and Spike run, a screenshot showing the testing tool together with the backend process's resource usage. It separately requires a hardware-report screenshot and specification table. Sections 11 and 14 require the hardware hostname to match prior deployments and require resource-monitor/hardware screenshots in the submission package. Endurance must run for about 10–15 minutes and produce concrete observed values, but the assignment does not explicitly require a fourth live Endurance screenshot.

## Tester-provided images

| Image | Classification | Target repository filename | Review |
| --- | --- | --- | --- |
| Image 1 | Load Run02 | `screenshots/load/06-running-load-and-resource-monitor.png` | Present and accepted as execution evidence. Shows the Load JMX, Run02 console output, and Activity Monitor detail for backend `node` in one frame. Backend CPU is 0% at capture, so a mid-load frame with visible activity would be stronger. |
| Image 2 | Stress Run02 | `screenshots/stress/06-running-stress-and-resource-monitor.png` | Present and accepted as execution evidence. Shows active non-GUI Stress Run02 output and live `top` for backend `node`. Historical Spike output is also visible, but the active command and Stress console identify the run. |
| Image 3 | Spike Run02 | `screenshots/spike/06-running-spike-and-resource-monitor.png` | Present and accepted as execution evidence. Shows active non-GUI Spike Run02 output, the Spike JMX identity, and live `top` for backend `node`. Historical Load output is also visible, but the active command and Spike console identify the run. |

The three images were supplied by the tester, visually reviewed, and are now present under `evidence/screenshots/` with normalized filenames. They satisfy the requirement to show the test/tool output and backend resource monitor in the same frame. The screenshots remain tester-authored evidence; no image content was generated or altered by AI.

## Hardware screenshot review

`hardware/01-hardware-report-with-hostname.png` visibly corroborates hostname `Phi-Hero.local`, computer name `Phi Hero`, model `MacBookPro18,1`, Apple M1 Pro, 10 cores, 16 GB RAM, and macOS 26.3. It satisfies the assignment's hardware/specification and matching-hostname requirements. The screenshot still exposes the machine serial number and UUID fields; redact those identifiers before public upload without hiding the hostname or specification lines.

## Missing or recommended additions

| Priority | Evidence | Status / action |
| --- | --- | --- |
| Required | Hardware-report screenshot using `screenfetch`, System Information, or equivalent, with the real hostname visible | Complete. `hardware/01-hardware-report-with-hostname.png` visibly shows `Phi-Hero.local`; privacy redaction remains recommended before public upload. |
| Required | Hardware specification table matching the screenshot | Complete. Model, CPU, cores, RAM, OS, computer name, and hostname match the main report. |
| Required for submission | The three supplied live screenshots as actual files | Complete. Normalized Load, Stress, and Spike files exist at the paths above. |
| Strongly recommended | Screenshot of each distinct view: Load Summary Report, Stress Aggregate Report, Spike Response Time Graph | Complete. Tester-captured Run02 listener evidence exists at `screenshots/load/01-load-summary-report-tree.png`, `screenshots/stress/01-stress-aggregate-report-tree.png`, and `screenshots/spike/01-spike-response-time-graph-tree.png`. |
| Strongly recommended | Endurance live run/resource and dashboard/resource-trend screenshots | Not explicitly the fourth mandatory scenario screenshot, but useful for the soak-test claim and demo. |
| Conditional | GitHub Issue screenshots | Required only for a genuine reproducible issue. Do not create an issue solely for a screenshot. |

The Vietnamese demo video is a separate mandatory artifact: at least six minutes total, with the tool and resource monitor in the same frame. Still screenshots do not replace it.
