# AGENTS.md

## Project Context

This project is HW02 - Domain Testing on EShop.

Selected features:
- FR-05: Product listing and search
- FR-09: Discount coupons
- FR-17: Coupon management CRUD
- Mobile-FR04: Personal profile management on Mobile

## Assignment Requirements

For each selected feature, Codex must help produce:
1. Input / Output identification
2. Domain Testing analysis
3. Boundary Value Analysis
4. Test cases
5. Test execution table
6. Bug report if defects are found

Mandatory deliverables:
- Main report in Markdown and PDF
- Bug report with screenshots
- AI Audit Report in Markdown and PDF
- Git commit log as text file

## Working Rules
- Do not generate final test cases without first identifying inputs, outputs, constraints, and validation rules.
- Always separate Domain Testing from Boundary Value Analysis.
- Always mark uncertain assumptions clearly.
- Always include a Human Review section after AI-generated output.
- Prefer Markdown tables for test cases.
- Use clear test case IDs:
  - FR05-DT-001 for Domain Testing
  - FR05-BVA-001 for Boundary Value Analysis
  - FR09-DT-001
  - FR09-BVA-001
  - FR17-DT-001
  - FR17-BVA-001
  - MFR04-DT-001
  - MFR04-BVA-001
- Do not invent actual execution results. Use "Not Executed" until the tester provides actual results.
- If a bug is found, create a bug report template with steps, expected result, actual result, severity, and screenshot placeholder.
- After each major step, suggest a Git commit message.

## AI Audit Report Rule

AI Audit Report is mandatory for HW02.

If AI is used, the report must include this declaration:

"I use AI tools for the following tasks."

For every AI interaction, Codex must generate an AI Audit Entry with:

1. Name of the AI tool
2. Date and time
3. User prompt
4. AI output summary
5. Human review notes

Codex must not claim that the work was fully human-made if AI was used.

For every generated testing artifact, Codex must append or provide an audit entry in this format:

| Interaction ID | AI Tool | Date and Time | Task | User Prompt | AI Output Summary | Human Review |
| -------------- | ------- | ------------- | ---- | ----------- | ----------------- | ------------ |

If the exact date and time is not available, Codex must write:
"To be filled by tester"

If the full AI output is too long, Codex must summarize the output and reference the generated file path.

Codex must also include a short "Human Review" section after each AI-generated artifact:

* Accepted:
* Modified:
* Removed:
* Added:
* Assumptions to verify:
