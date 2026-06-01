```
                            [ QA/QC ROLE ]
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
  [ QUALITY ASSURANCE ]                            [ QUALITY CONTROL ]
  (Process-Oriented / Prevention)                  (Product-Oriented / Detection)
         │                                                 │
         ├── Code Quality & Architecture                   ├── Test Execution
         │     ├── Linting & Formatting                    │     ├── Functional & UI Testing
         │     ├── CI/CD Pipeline Integration              │     ├── API & Integration Testing
         │     └── Architecture Compliance                 │     └── Regression Testing
         │                                                 │
         ├── Process & Methodology                         ├── Performance & Security
         │     ├── Agile/Scrum Workflow Optimization       │     ├── Load & Stress Testing
         │     ├── Test Strategy & Planning                │     ├── Vulnerability Scanning
         │     └── Standard Operating Procedures (SOPs)    │     └── Metrics (Throughput/Latency)
         │                                                 │
         └── Risk Management                               └── Defect Lifecycle Management
               ├── Impact Analysis                         ├── Triaging & Prioritization
               ├── Security/Compliance Standards           ├── Root Cause Analysis (RCA)
               └── Root Cause Prevention                   └── Verification & Regression

```

## "Code Quality & Architecture" hoàn toàn vào QA là chưa đúng
Nhiều hoạt động ở đây thực chất là Engineering/Development responsibility, không phải QA. Architecture Compliance thuộc Software Architect/Tech Lead. CI/CD Pipeline → thuộc DevOps hoặc Platform Team.

## "Root Cause Analysis (RCA)" bị đặt hoàn toàn ở QC
RCA thực chất là hoạt động của cả QA và QC. QC phát hiện lỗi, QA phòng ngừa, tìm nguyên nhân hệ thống và ngăn lỗi tái diễn

## "Performance & Security" đặt hoàn toàn trong QC
Security có cả phần phòng ngừa (QA) và kiểm tra (QC)