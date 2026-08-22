# HW06 Submission Manifest

Folder: `23127194_HW06_AI_API_100`

## Required contents mapping

| Submission requirement | Included artifact |
| --- | --- |
| Main report including API-testing report + AI audit | `Main-Report.md` (full AI Audit appended as Appendix C) |
| Public GitHub repository link | `README.md` -> Repository Links |
| Postman collections | `postman/collections/*.postman_collection.json` |
| Newman HTML reports | `postman/newman/*-official-report.html` |
| Postman features used | `postman/Postman-Features.md` |
| CI/CD report + pipeline configuration | `cicd/CI-CD-Report.md`, `cicd/hw06-api-tests.yml` |
| CI/CD sample run screenshots/evidence/links | `cicd/screenshots/`, `cicd/evidence/`, links in `cicd/CI-CD-Report.md` |
| Excel test cases + test summary | `API-Test-Cases.xlsx`, summary in `README.md` and `Main-Report.md` |
| AI test-generator diagram | `agent-skill/api-test-generator-diagram.png`, `.mmd` |
| AI test-generator pseudocode / implementation | `agent-skill/pseudocode.md`, `agent-skill/skill/` |
| Bug reports | `bugs/FR05-BUG-*.md`, `FR10-BUG-01.md`, `FR16-BUG-*.md` |
| Bug runtime screenshots | `bugs/screenshots/FR*-BUG-*.png` |
| GitHub Issue page screenshots | `bugs/screenshots/GitHub-Issue-24.png` through `GitHub-Issue-30.png` |
| AI Critique | `ai/AI-Critique.md` |
| AI Audit Report | `ai/AI-Audit-Report.md` |
| Git commit log | `git-commit-log.txt` |
| README + self-assessment + test summary | `README.md` |
| Supporting materials | `supporting/`, Postman environments/data/scripts |

## Optional OpenAPI conversion

Not included. The regulations state this artifact is optional. The original API specification is included as `supporting/api_specification.md`.

## Evidence integrity

The package copies existing real artifacts. Genuine Newman failures and blocked FR16 cases remain unchanged; no fake execution evidence was generated for packaging.
