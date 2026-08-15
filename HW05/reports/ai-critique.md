# AI Critique

The AI was useful for generating JMeter plans, automating evidence collection, and calculating metrics from large JTL files, but its output still required deliberate human control. Its generated skills were usually optimized for one phase and Scenario C, limiting reuse for another endpoint group or a similar test. I changed several high-level AI directions: I selected Scenario C instead of the preliminary Candidate A, replaced the early k6 scaffold with the class-required JMeter workflow, required automatic account provisioning after every backend reset, and selected Load Run02 as the complete Phase 6 evidence identity when the original resource CSV was unusable. In contrast, I reviewed and accepted the numerical Load, Stress, Spike, and Endurance workload proposals without changing their parameters; human review does not require inventing a modification when the proposal is reasonable. The most important corrections concerned interpretation. Eighty active threads was the maximum tested concurrency, not a capacity ceiling; 26.23 represented complete business flows per second, not HTTP RPS; and 188.84 MiB was the maximum observed RSS, not a proven memory ceiling. A populated Load Run02 resource CSV also appeared usable, but its rows did not match the header and contained no attributable backend CPU/RSS values. These failures arise because AI can follow labels and patterns without proving run identity, units, field attribution, or experimental scope. I learned to define reusable skill boundaries, preserve approval gates, and verify every conclusion against untouched JTL files, runner code, and same-run evidence. AI accelerates the work, but the tester remains responsible for experimental validity and final judgment.

Human Review:
- Status: Pending tester review of this 258-word critique
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:
