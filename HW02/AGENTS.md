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