# HW02 - Domain Testing on EShop

## Folder Structure

```text
HW02/
├── AGENTS.md
├── .agents/
│   └── skills/
│       └── domain-boundary-testing/
├── reports/
├── test-cases/
├── screenshots/
├── videos/
├── git-commit-log.txt
└── README.md
```

## Selected Features

| Feature ID | Feature Name |
|---|---|
| FR-05 | Product listing and search |
| FR-09 | Discount coupons |
| FR-17 | Coupon management CRUD |
| Mobile-FR04 | Profile management |

## Main Files

| File | Purpose |
|---|---|
| `reports/main-report.md` | Main HW02 report |
| `reports/ai-audit-report.md` | AI usage and human review audit |
| `reports/ai-critique.md` | Reflection on AI strengths, weaknesses, and risks |
| `reports/bug-report.md` | Defect log and bug report details |
| `test-cases/*.md` | Domain Testing and Boundary Value Analysis test cases |
| `git-commit-log.txt` | Git history submitted with the assignment |

## Test Summary Report

| Metric | Value |
|---|---:|
| Number of features | 4 |
| Number of test cases designed | 131 |
| Number of test cases executed | 128 |
| Number of test cases passed | 78 |
| Number of test cases failed | 41 |
| Number of test cases not yet executed | 3 |
| Number of bugs | 20 |

### Summary by Feature

| Feature ID | Feature Name | Designed | Executed | Passed | Failed | Not Executed | Bugs Found |
|---|---|---:|---:|---:|---:|---:|---:|
| FR-05 | Product listing and search | 15 | 12 | 12 | 0 | 3 | 0 |
| FR-09 | Discount coupons | 23 | 23 | 12 | 7 | 0 | 3 |
| FR-17 | Coupon management CRUD | 54 | 54 | 24 | 25 | 0 | 8 |
| Mobile-FR04 | Profile management | 39 | 39 | 30 | 9 | 0 | 9 |
| **Total** |  | **131** | **128** | **78** | **41** | **3** | **20** |

## Self-Assessment

| No. | Criteria | Grade | Self-Assessed Grade |
|---:|---|---:|---:|
| 1 | Feature A (Domain + Boundary) | 25 |  |
| 2 | Feature B (Domain + Boundary) | 25 |  |
| 3 | Feature C (Domain + Boundary) | 25 |  |
| 4 | Feature D (Mobile, Domain + Boundary) | 15 |  |
| 5 | Agent Skills | 10 |  |
|  | **Total** | **100** |  |

## Notes

- Planned tests use `Not Executed` until actual execution is performed.
- Screenshots should be placed in `screenshots/`.
- Videos should be placed in `videos/`.
