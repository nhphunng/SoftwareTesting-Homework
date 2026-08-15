# HW05 Submission Checklist

## Test design and execution

- [x] Scenario C remains unique in the group.
- [x] JMeter version evidence identifies Apache JMeter 5.6.3.
- [x] Each run provisions at least one unique account per maximum concurrent thread after backend reset.
- [x] Three final test-plan filenames match `{StudentID}_{ScenarioType}_{YYYYMMDD}`.
- [x] Load, Stress, and Spike reuse the same Scenario C functional flow.
- [x] Final CSV data/templates are included without real credentials.
- [x] Load, Stress, and Spike use three distinct enabled listener/report types: Summary Report, Aggregate Report, and Response Time Graph.
- [x] Three untouched raw outputs are present locally; Load uses the independently selected Run02 set.
- [x] Three reviewed HTML report folders are present locally.
- [x] Load, Stress, and Spike resource-monitor screenshots exist and show the test/tool output with backend `node` monitoring in the same frame.
- [x] Hardware screenshot and specification table use the real matching hostname `Phi-Hero.local`.
- [x] Login lockout prevention, detection, backend reset, account reprovisioning, and isolated rerun handling are documented.
- [x] Endurance run is approximately 10-15 minutes and supports concrete observed threshold numbers with explicit limitations.

## Analysis and reporting

- [ ] Main report exists in Markdown and PDF.
- [x] AI analysis uses untouched raw results.
- [x] Every identified AI misinterpretation cites the correct raw value or same-run resource/runner source.
- [x] AI optimizations are classified as feasible, unproven, unsupported, or hallucinated with reasoning.
- [ ] AI Critique is one human-reviewed 200-300 word paragraph.
- [ ] Continuous Performance Testing proposal includes a flow chart and cost/false-alarm trade-offs.
- [ ] AI Audit Report exists in Markdown and PDF with all interactions.
- [ ] Bug report links only genuine GitHub Issues with evidence.

## Demonstration and traceability

- [ ] Unlisted YouTube video is at least 6 minutes total.
- [ ] Video shows JMeter and the resource monitor in the same frame.
- [ ] Video uses the tester's own Vietnamese narration.
- [ ] Agent Skill and an end-to-end endpoint-group demonstration are included.
- [ ] A meaningful Git commit exists for each procedural step.
- [x] Real Git commit log is exported verbatim as `git-commit-log.md`.

## Package

- [x] README contains the self-assessment table, scenarios run, endpoint groups, measured Endurance threshold, issue count, repository link, and demo-video links.
- [ ] Submission name matches `<StudentID>_HW05_AI_Performance_<SelfAssessedGrade>.zip`.
- [ ] Public repository link is included.
- [ ] Required evidence is present in the ZIP even when ignored by Git.
- [ ] The assessment-table 90-vs-100 inconsistency has been clarified with the lecturer.
