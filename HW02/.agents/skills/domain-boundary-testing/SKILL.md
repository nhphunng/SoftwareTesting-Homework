---
name: domain-boundary-testing
description: Use this skill when designing Domain Testing and Boundary Value Analysis test cases for EShop homework features such as product search, discount coupons, coupon CRUD, and mobile profile management. Trigger this skill when the user asks to analyze a feature, create test cases, prepare reports, perform AI gap analysis, or generate testing deliverables for HW02 Domain Testing.
---

# Domain Boundary Testing Skill

## Purpose

This skill helps produce structured testing deliverables for HW02 - Domain Testing on EShop.

It must be used for these selected features:
- FR-05: Product listing and search
- FR-09: Discount coupons
- FR-17: Coupon management CRUD
- Mobile-FR04: Personal profile management on Mobile

## Mandatory Workflow

For every feature, follow this exact order:

1. Feature Understanding
2. Input / Output Identification
3. Domain Rule Identification
4. Equivalence Class Partitioning
5. Domain Testing Test Case Design
6. Boundary Identification
7. Boundary Value Analysis Test Case Design
8. Test Execution Table
9. Bug Report Template
10. AI Gap Analysis
11. Human Review Notes
12. Suggested Git Commit Message

Do not skip steps.


## Step 1: Feature Understanding

For each feature, summarize:
- Feature ID
- Feature name
- User role
- Main purpose
- Preconditions
- Main flow
- Alternative flows
- Related data

If some information is missing, write it under "Assumptions to verify".

## Step 2: Input / Output Identification

Create this table:

| No. | Input | Type | Required? | Source | Constraint / Rule | Notes |
|---|---|---|---|---|---|---|

Create this output table:

| No. | Output | Trigger | Expected Behavior | Notes |
|---|---|---|---|---|

## Step 3: Domain Rule Identification

Create this table:

| Rule ID | Field / Condition | Valid Rule | Invalid Condition | Error Message / Expected Handling |
|---|---|---|---|---|

## Step 4: Equivalence Class Partitioning

Create this table:

| EC ID | Input / Condition | Class Type | Description | Representative Value | Expected Result |
|---|---|---|---|---|---|

Class Type must be one of:
- Valid
- Invalid

## Step 5: Domain Testing Test Cases

Create test cases from equivalence classes.

Use this table:

| Test Case ID | Objective | Preconditions | Test Data | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|

Rules:
- Status must be "Not Executed" unless actual execution evidence is provided.
- Actual Result must be "TBD" unless the tester provides the actual result.
- Each invalid class should have at least one negative test case.
- Each important valid class should have at least one positive test case.

## Step 6: Boundary Identification

Create this table:

| Boundary ID | Field / Condition | Boundary Rule | Values to Test | Reason |
|---|---|---|---|---|

Use boundary values:
- min - 1
- min
- min + 1
- max - 1
- max
- max + 1

For dates, use:
- before boundary
- exactly at boundary
- after boundary

For money, use:
- negative value
- zero
- minimum valid value
- just below threshold
- exactly threshold
- just above threshold

## Step 7: Boundary Value Analysis Test Cases

Create this table:

| Test Case ID | Boundary Target | Preconditions | Test Data | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|

## Step 8: Test Execution Table

Create this summary:

| Feature ID | Designed | Executed | Passed | Failed | Not Executed | Bugs Found |
|---|---:|---:|---:|---:|---:|---:|

Do not invent execution numbers. If not executed yet, set Executed = 0 and Not Executed = Designed.

## Step 9: Bug Report Template

If a test case fails, create this bug report:

| Field | Content |
|---|---|
| Bug ID | |
| Title | |
| Feature | |
| Severity | |
| Priority | |
| Environment | |
| Preconditions | |
| Steps to Reproduce | |
| Expected Result | |
| Actual Result | |
| Screenshot | |
| Related Test Case | |
| GitHub Issue Link | |

## Step 10: AI Gap Analysis

Create this section:

| Gap ID | AI Output Issue | Missed / Wrong / Incomplete | Why It Happened | Human Correction |
|---|---|---|---|---|

Common AI gaps to check:
- Missing invalid equivalence classes
- Missing boundary values
- Wrong expected result
- Duplicate test cases
- Assumptions not verified from UI or API
- Missing role-based or permission cases
- Missing data dependency between FR-17 and FR-09

## Step 11: AI Audit Entry

For every AI-assisted output, create an AI Audit Entry.

This is mandatory because the assignment requires an AI Audit Report appendix.

If AI was used, include this declaration in the AI Audit Report:

"I use AI tools for the following tasks."

If AI was not used, include this declaration:

"I do not use any AI help in this exercise."

For each AI interaction, record:

| Interaction ID | AI Tool | Date and Time | Task | User Prompt | AI Output Summary | Human Review |
| -------------- | ------- | ------------- | ---- | ----------- | ----------------- | ------------ |

Rules:

* AI Tool should be "Codex" unless the tester specifies another tool.
* Date and Time should be filled with the current date/time if available. If not available, write "To be filled by tester".
* User Prompt must include the actual prompt used by the tester.
* AI Output Summary must summarize what Codex generated.
* If the generated output was saved to a file, reference the file path.
* Human Review must describe what the tester accepted, modified, removed, or added.
* Do not invent human review results. If not reviewed yet, write "Pending human review".

Required audit entry format:

```markdown
## AI Audit Entry - [Interaction ID]

| Field | Content |
|---|---|
| AI Tool | Codex |
| Date and Time | To be filled by tester |
| Task | |
| User Prompt | |
| AI Output | |
| Generated File | |
| Human Review | Pending human review |
```

After generating anything, Codex must also provide a short instruction:
"Copy this AI Audit Entry into reports/ai-audit-report.md."


## Step 12: Human Review Notes

Always include:

```text
Human Review:
- Accepted:
- Modified:
- Removed:
- Added:
- Assumptions to verify:

