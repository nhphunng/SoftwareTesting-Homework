# HW06 API Testing — Execution Plan

## 0. Objective

Hoàn thành toàn bộ bài **HW06 – API Testing** theo đúng yêu cầu đề bài, với workflow AI-first nhưng có **Human-in-the-Loop** ở mọi bước quan trọng.

Mục tiêu cuối cùng:

- Chọn đúng **3 API**, mỗi API thuộc một pool khác nhau: Pool A, Pool B, Pool C.
- Mỗi API có ít nhất **35 AI-generated test cases**.
- Audit toàn bộ AI-generated test cases với nhãn `VALID / INVALID / INCOMPLETE`.
- Thêm ít nhất **5 human-added test cases / API** mà AI bỏ sót.
- Execute toàn bộ suite bằng **Postman + Newman**.
- Mỗi request có header `X-Student-Id`.
- Báo cáo bug thật bằng Markdown + GitHub Issues + screenshot.
- Tích hợp Newman vào CI/CD.
- Có 2 pipeline samples: một run pass toàn bộ, một run fail đúng 1 testcase.
- Thiết kế **AI-driven API Test Generator**.
- Tạo và sử dụng:
  - **API Testing Skill — Human-in-the-Loop**
  - **AI Audit Skill**
- Hoàn thiện AI Critique, Git commit log, README, test summary và submission package.

---

# 1. Guiding Principles

## 1.1 AI-First, không AI-autopilot

AI được dùng để:

- phân tích API specification;
- tạo test ideas;
- tạo test cases;
- phân tích domain;
- phân tích state transitions;
- phân tích security;
- sinh Postman assertions;
- hỗ trợ audit;
- hỗ trợ phân tích bug;
- hỗ trợ xây CI/CD;
- hỗ trợ tổng hợp AI Audit Report.

Không được dùng một prompt duy nhất như:

> Generate all API tests and run them.

Workflow phải chia theo từng bước rõ ràng.

## 1.2 Human-in-the-Loop

Human phải review và approve các bước:

1. API selection.
2. Requirement extraction.
3. Domain partition model.
4. State-transition model.
5. Security mapping.
6. AI-generated test cases.
7. VALID / INVALID / INCOMPLETE classification.
8. Human-added tests.
9. Bug confirmation.
10. Final report.
11. Agent Skill design.
12. Self-assessment.

AI không được tự quyết định một bug là genuine bug nếu chưa đối chiếu specification + execution evidence.

## 1.3 Evidence First

Không tạo giả:

- `X-Student-Id` evidence;
- Newman output;
- request/response execution;
- screenshots;
- GitHub Actions run;
- GitHub Issues;
- AI test-generator final diagram.

---

# 2. Phase 0 — Prepare Workspace

## 2.1 Verify project directory

Target workspace:

```text
/ky_3/SoftwareTesting-Homework/HW06
```

## 2.2 Create working structure

Đề xuất:

```text
HW06/
├── README.md
├── plan.md
├── source/
│   └── api_specification.md
├── .agents/skills/
│   ├── api-testing-human-loop/
│   │   └── SKILL.md
│   └── ai-audit-report/
│       ├── SKILL.md
│       ├── agents/openai.yaml
│       └── references/audit-entry-template.md
├── PoolA-FR-05-ProductSearch/
│   ├── analysis/
│   ├── generated/
│   ├── audit/
│   ├── human-added/
│   ├── postman/
│   ├── evidence/
│   └── bugs/
├── PoolB-FR-10-CancelOrder/
│   └── ...
├── PoolC-FR-16-ImportProducts/
│   └── ...
├── postman/
│   ├── collection/
│   ├── environment/
│   ├── data/
│   └── newman/
├── cicd/
├── agent-skill/
├── reports/
│   ├── ai-audit-report.md
│   └── ai-session-logs/
├── screenshots/
└── submission/
```

## 2.3 Initial Git checkpoint

```bash
git status
git add .
git commit -m "chore(hw06): initialize API testing homework workspace"
```

---

# 3. Phase 1 — Create Supporting Skills First

Hai skill nên được tạo trước khi bắt đầu generate testcase để toàn bộ workflow sau đó có thể ghi audit nhất quán.

---

# 4. Skill 1 — API Testing Human-in-the-Loop Skill

## 4.1 Purpose

Skill này điều phối workflow API testing nhưng không tự động bỏ qua human review.

Input chính:

- API specification;
- selected feature / API;
- FR mapping;
- SEC requirements;
- current testing stage.

Output:

- requirement analysis;
- test design artifacts;
- AI-generated test cases;
- audit candidates;
- human review checkpoints;
- Postman implementation guidance;
- execution analysis;
- bug candidates.

## 4.2 Mandatory workflow

Skill phải chia thành các stage:

```text
SPEC ANALYSIS
    ↓
HUMAN REVIEW
    ↓
DOMAIN PARTITION
    ↓
HUMAN REVIEW
    ↓
STATE TRANSITION
    ↓
HUMAN REVIEW
    ↓
SECURITY ANALYSIS
    ↓
HUMAN REVIEW
    ↓
SCHEMA ANALYSIS
    ↓
AI TEST GENERATION
    ↓
HUMAN AUDIT
    ↓
HUMAN EXTENSION
    ↓
POSTMAN IMPLEMENTATION
    ↓
RUNTIME TEST DATA & PRECONDITIONS
    ↓
SMOKE / REAL EXECUTION
    ↓
BUG ANALYSIS
    ↓
HUMAN BUG CONFIRMATION
```

## 4.3 Skill safety / correctness rules

Skill phải:

- Không fabricate API fields/endpoints.
- Không fabricate expected status code nếu specification không nói rõ.
- Mark unknown requirement là `UNRESOLVED`.
- Không tự classify một testcase là valid nếu chưa đối chiếu spec.
- Không tự xác nhận bug nếu thiếu evidence.
- Không generate fake Newman output.
- Không generate fake screenshots.
- Không generate final self-drawn diagram thay student.
- Mọi testcase phải trace được tới:
  - FR;
  - SEC;
  - parameter/domain;
  - state transition;
  - schema rule;
  - hoặc explicitly human-discovered risk.

## 4.4 Suggested testcase schema

```text
ID
Source
API
Requirement
Category
Precondition
Input
Steps
Expected Status
Expected Response
Expected Schema
Security Expectation
State Before
State After
AI Rationale
Human Audit Status
Human Audit Reason
Execution Status
Actual Result
Bug ID
```

## 4.5 Human approval gates

Không chuyển stage nếu chưa có review tại các điểm:

```text
Gate A — requirement mapping accepted
Gate B — partition model accepted
Gate C — state model accepted
Gate D — security coverage accepted
Gate E — generated tests audited
Gate F — human-added tests confirmed
Runtime Readiness — test data/auth/state/preconditions ready
Gate G — execution result reviewed
Gate H — bug confirmed
```

## 4.6 Commit

```bash
git add .agents/skills/api-testing-human-loop
git commit -m "feat(skill): add human-in-the-loop API testing skill"
```

---

# 5. Skill 2 — AI Audit Skill

## 5.1 Purpose

Tự động lưu lại việc dùng AI để đáp ứng yêu cầu AI Audit Report.

Mỗi interaction cần lưu:

- AI tool;
- date;
- time;
- task/stage;
- prompt;
- AI output;
- files/artifacts affected;
- human decision;
- corrections;
- final result.

## 5.2 Audit record format

Ví dụ:

```markdown
## Interaction AI-001

- Tool: ChatGPT
- Date: YYYY-MM-DD
- Time: HH:mm
- Stage: API Selection
- API: N/A

### Prompt

...

### AI Output

...

### Human Review

- Decision: ACCEPT / MODIFY / REJECT
- Reason:
- Changes made:

### Artifact

- `plan.md`
```

## 5.3 Rules

Audit skill phải:

- append, không overwrite lịch sử cũ;
- giữ prompt gốc;
- giữ output đủ để trace;
- ghi rõ human correction;
- không chỉnh sửa lịch sử để làm workflow trông đẹp hơn;
- phân biệt:
  - AI-generated;
  - AI-assisted;
  - human-created;
  - execution evidence.

## 5.4 Suggested files

```text
.agents/skills/ai-audit-report/
├── SKILL.md
├── agents/openai.yaml
└── references/audit-entry-template.md

reports/
├── ai-audit-report.md
└── ai-session-logs/
```

## 5.5 Commit

```bash
git add .agents/skills/ai-audit-report reports/ai-audit-report.md reports/ai-session-logs
git commit -m "refactor(skill): align HW06 AI audit skill with reusable audit pattern"
```

---

# 6. Phase 2 — Obtain and Inspect SUT

## 6.1 Clone / verify EShop SUT

Repository:

```text
https://github.com/ttbhanh/eshop-sut
```

## 6.2 Locate specification

Required source:

```text
api_specification.md
```

## 6.3 Read and extract

Phải xác định:

- all endpoints;
- methods;
- path params;
- query params;
- request body;
- response body;
- expected status codes;
- authentication;
- roles;
- FR mapping;
- SEC-01 → SEC-07;
- states;
- transition rules;
- validation rules.

## 6.4 Create specification matrix

Artifact:

```text
reports/api-inventory.md
```

Suggested table:

| Pool | FR | Feature | Method | Endpoint | Auth | Role | State Change | Candidate |
|---|---|---|---|---|---|---|---|---|

## 6.5 Commit

```bash
git add source reports/api-inventory.md
git commit -m "docs(hw06): inventory SUT APIs and security requirements"
```

---

# 7. Phase 3 — Select Three APIs

## 7.1 Constraint

Chọn đúng:

- 1 API từ Pool A;
- 1 API từ Pool B;
- 1 API từ Pool C.

Không chọn Pool D.

Không được trùng cùng bộ ba với thành viên khác trong nhóm.

## 7.2 Selection criteria

Ưu tiên API có:

- đủ parameters để domain partition;
- security rules rõ;
- state transition rõ;
- deterministic expected output;
- dễ reset test data;
- dễ automate;
- dễ demonstrate bug;
- không phụ thuộc quá nhiều GUI.

## 7.3 Assigned API combination

Ba API đã được phân công và **cố định** cho bài HW06 này:

### API 1 — Pool A — Product Search

```text
Feature: Tìm kiếm sản phẩm
FR: FR-05 — Product listing and search
Method: GET
Endpoint: /api/products?search=keyword
```

Trọng tâm kiểm thử dự kiến:

- domain partition cho query parameter `search`;
- missing / empty / whitespace keyword;
- valid và invalid keyword formats nếu specification có constraint;
- keyword không có kết quả;
- special characters và Unicode/Vietnamese text;
- SQL injection / injection-oriented inputs theo SEC requirements applicable;
- response schema của product list/search result;
- pagination/sorting/filter interaction nếu endpoint specification hỗ trợ;
- consistency giữa search keyword và returned products.

### API 2 — Pool B — Cancel Order

```text
Feature: Hủy đơn hàng
FR: FR-10 — Order state machine
Method: PUT
Endpoint: /api/orders/:id/cancel
```

Trọng tâm kiểm thử dự kiến:

- valid cancel transition;
- invalid cancel transition theo trạng thái hiện tại;
- cancel order đã canceled;
- cancel order ở terminal/non-cancelable state;
- invalid / missing / non-existing order ID;
- ownership và IDOR;
- unauthenticated / unauthorized access;
- repeated cancel request;
- state before / state after;
- response schema và error schema;
- các SEC requirements applicable.

### API 3 — Pool C — Import Products

```text
Feature: Import sản phẩm
FR: FR-16 — Product import from CSV
Method: POST
Endpoint: /api/admin/import-products
```

Trọng tâm kiểm thử dự kiến:

- admin authorization / role escalation;
- missing file;
- empty file;
- valid CSV;
- malformed CSV;
- invalid headers / missing columns;
- invalid row data;
- duplicate products nếu specification định nghĩa behavior;
- boundary về số dòng / kích thước file nếu specification có constraint;
- formula/injection-like CSV content khi applicable;
- partial failure / atomicity behavior nếu specification quy định;
- response/import summary schema;
- SEC-01–SEC-07 mapping applicable cho admin import endpoint.

### API numbering used throughout this plan

```text
API 1 = GET  /api/products?search=keyword       (FR-05)
API 2 = PUT  /api/orders/:id/cancel             (FR-10)
API 3 = POST /api/admin/import-products          (FR-16)
```

Không thay đổi ba API này trong các phase sau trừ khi có thay đổi phân công chính thức.

## 7.4 Human Selection Gate

Trạng thái hiện tại: **ASSIGNED / CONFIRMED**.

Human cần verify trước khi bắt đầu generate test:

- API 1 đúng là `GET /api/products?search=keyword` thuộc FR-05;
- API 2 đúng là `PUT /api/orders/:id/cancel` thuộc FR-10;
- API 3 đúng là `POST /api/admin/import-products` thuộc FR-16;
- endpoint syntax, parameters, authentication, authorization và expected responses khớp `api_specification.md` của SUT;
- ghi nhận ba API này trong `reports/api-selection.md` như bộ API đã được phân công.

## 7.5 Artifact

```text
reports/api-selection.md
```

## 7.6 Commit

```bash
git add reports/api-selection.md
git commit -m "docs(hw06): select three APIs across pools A B and C"
```

---

# 8. Phase 4 — Repeat Full Pipeline for API 1

Các phase sau được thực hiện độc lập cho đúng ba API đã được phân công:

```text
API 1 — Product Search
GET /api/products?search=keyword
FR-05

API 2 — Cancel Order
PUT /api/orders/:id/cancel
FR-10

API 3 — Import Products
POST /api/admin/import-products
FR-16
```

Bắt đầu pipeline với **API 1 — Product Search**, sau đó lặp lại cùng cấu trúc cho API 2 và API 3.

---

# 9. Step A — Requirement Extraction

Tạo:

```text
PoolA-FR-05-ProductSearch/analysis/requirements.md
```

Extract:

- endpoint;
- HTTP method;
- authentication;
- authorization;
- parameters;
- constraints;
- request schema;
- response schema;
- error responses;
- FR;
- SEC requirements;
- state rules.

Không suy diễn requirement nếu spec không hỗ trợ.

Mark:

```text
UNRESOLVED
```

nếu specification thiếu.

## Human Gate

Review requirement extraction trước khi generate test.

## Commit

```bash
git commit -am "test(api1): analyze API requirements"
```

---

# 10. Step B — Domain Partition Design

Phân tích **every parameter**.

Ví dụ categories:

```text
VALID
INVALID
BOUNDARY
MISSING
EMPTY
NULL
TYPE MISMATCH
FORMAT
LENGTH
SPECIAL CHARACTER
OVERFLOW
DUPLICATE
```

Tạo:

```text
PoolA-FR-05-ProductSearch/analysis/domain-partitions.md
```

Table:

| Parameter | Partition | Example | Expected |
|---|---|---|---|

## Human Gate

Kiểm tra:

- có parameter nào bị bỏ quên không;
- boundary có đúng specification không;
- partitions có overlap hoặc redundant không.

## Commit

```bash
git commit -am "test(api1): define domain partitions"
```

---

# 11. Step C — State Transition Analysis

Nếu API có state:

Tạo:

```text
PoolA-FR-05-ProductSearch/analysis/state-transitions.md
```

Liệt kê:

- states;
- initial state;
- valid transitions;
- invalid transitions;
- terminal states;
- cancelation;
- repeated transition;
- transition without permission;
- concurrent transition nếu relevant.

Matrix:

| From | Action | To | Valid? | Requirement |
|---|---|---|---|---|

Nếu API không có state machine:

Ghi rõ:

```text
No explicit state machine applies to this API.
```

và kiểm tra các state liên quan như:

- account locked/unlocked;
- authenticated/unauthenticated;
- resource exists/deleted.

## Commit

```bash
git commit -am "test(api1): model API state transitions"
```

---

# 12. Step D — Security Analysis

Map testcase candidates tới:

```text
SEC-01
SEC-02
...
SEC-07
```

Các lớp security cần xem:

- unauthenticated access;
- wrong role;
- role escalation;
- IDOR;
- ownership;
- SQL injection;
- injection payloads;
- token invalid/expired;
- mass assignment;
- unexpected fields;
- information disclosure;
- enumeration;
- replay nếu applicable.

Artifact:

```text
PoolA-FR-05-ProductSearch/analysis/security.md
```

Table:

| SEC | Threat | Test Idea | Applicable |
|---|---|---|---|

## Human Gate

Không ép test một SEC requirement nếu thực sự không applicable; phải giải thích.

## Commit

```bash
git commit -am "test(api1): map API security coverage"
```

---

# 13. Step E — Schema Validation Design

Tạo:

```text
PoolA-FR-05-ProductSearch/analysis/schema.md
```

Check:

- required fields;
- types;
- arrays;
- nested objects;
- enums;
- nullable fields;
- date/time format;
- numeric constraints;
- extra properties nếu spec cấm;
- error response schema.

## Commit

```bash
git commit -am "test(api1): define response schema validation"
```

---

# 14. Step F — AI Generate ≥35 Test Cases

AI generate test theo từng batch.

Không generate toàn bộ bằng một generic prompt.

Suggested batches:

```text
Batch 1 — Happy path + basic validation
Batch 2 — Domain partitions
Batch 3 — Boundary and negative
Batch 4 — State transitions
Batch 5 — Security
Batch 6 — Schema validation
Batch 7 — Cross-check coverage gaps
```

Target:

```text
>= 35 AI-generated test cases
```

Artifact:

```text
PoolA-FR-05-ProductSearch/generated/ai-generated-tests.xlsx
```

hoặc CSV/Markdown trung gian rồi tổng hợp Excel.

Mỗi case phải có `Source = AI`.

## Coverage check

Tạo matrix:

| Coverage | Count |
| --- | ---: |
| Functional | |
| Domain partition | |
| Boundary | |
| State transition | |
| Security | |
| Schema | |
| Total | >= 35 |

## Commit

```bash
git add PoolA-FR-05-ProductSearch/generated
git commit -m "test(api1): generate AI API test cases"
```

---

# 15. Step G — Human Audit Every AI Test

Audit tất cả case.

Allowed labels:

```text
VALID
INVALID
INCOMPLETE
```

Mỗi testcase phải có reason.

### VALID

- đúng requirement;
- input hợp lệ;
- expected result đúng;
- không duplicate vô nghĩa.

### INVALID

Ví dụ:

- sai endpoint;
- sai expected status;
- trái specification;
- security expectation sai;
- state transition sai.

### INCOMPLETE

Ví dụ:

- thiếu precondition;
- thiếu expected body;
- thiếu state;
- chưa nói role;
- unclear test data.

Artifact:

```text
PoolA-FR-05-ProductSearch/audit/audit.xlsx
```

và:

```text
PoolA-FR-05-ProductSearch/audit/audit-summary.md
```

Summary:

```text
Generated:
VALID:
INVALID:
INCOMPLETE:
Corrected:
Removed:
Final:
```

## Critical rule

Không xoá dấu vết testcase AI sai.

Phải giữ:

```text
Original AI Test
↓
Audit Decision
↓
Corrected Test
```

để chứng minh human review.

## Commit

```bash
git add PoolA-FR-05-ProductSearch/audit
git commit -m "test(api1): audit and correct AI generated tests"
```

---

# 16. Step H — Add ≥5 Human Test Cases

Human tự tìm coverage gaps sau audit.

Target:

```text
>= 5
```

Ưu tiên:

- security;
- state transitions;
- ownership;
- cross-user;
- unusual sequence;
- repeated operation;
- race/concurrency nếu relevant;
- hidden assumption của AI.

Mỗi case phải ghi:

```text
Source = HUMAN
```

và:

```text
Why AI missed this
```

Phân tích nguyên nhân theo một trong:

- prompt quality;
- context missing;
- model limitation;
- specification ambiguity;
- API-specific behavior;
- cross-request reasoning;
- state-history dependency;
- security ownership assumption.

Artifact:

```text
PoolA-FR-05-ProductSearch/human-added/human-tests.xlsx
```

## Commit

```bash
git add PoolA-FR-05-ProductSearch/human-added
git commit -m "test(api1): add human discovered coverage cases"
```

---

# 17. Step I — Implement in Postman

## 17.1 Collection structure

Suggested:

```text
HW06 API Testing
├── Setup
├── API 1
│   ├── Functional
│   ├── Domain
│   ├── State
│   ├── Security
│   └── Schema
├── API 2
└── API 3
```

## 17.2 Environment

Variables:

```text
baseUrl
studentId
userToken
adminToken
userId
productId
orderId
...
```

## 17.3 X-Student-Id

Mọi request bắt buộc:

```http
X-Student-Id: {{studentId}}
```

Có thể dùng collection-level pre-request script.

Phải chụp screenshot console evidence.

## 17.4 Postman tests

Check:

- status code;
- response time nếu hợp lý;
- headers;
- body values;
- JSON schema;
- state;
- access control;
- error structure.

## 17.5 Data-driven

Dùng CSV/JSON cho domain partitions khi phù hợp.

Ví dụ:

```text
postman/data/api1-domain.csv
```

## 17.6 Use Postman features reasonably

Aim to exercise:

- Workspace;
- Collection;
- Folder;
- Environment;
- Collection variables;
- Pre-request scripts;
- Test scripts;
- Collection Runner;
- data-driven run;
- mock server nếu hữu ích;
- monitors nếu có giá trị thực.

Không dùng feature chỉ để tick checkbox nếu không hợp lý.

## Commit

```bash
git add postman PoolA-FR-05-ProductSearch/postman
git commit -m "test(api1): implement Postman API test suite"
```

---

# 18. Step J — Prepare Runtime Test Data and Preconditions

Step này áp dụng cho **cả 3 API**, nhưng dữ liệu/precondition phải được thiết kế riêng theo từng API. Không copy cứng test data của FR-05 sang FR-10 hoặc FR-16.

Mục tiêu:

- chạy SUT thật trước khi official execution;
- xác định dataset/state/authentication thực tế cần cho testcase;
- thay các placeholder runtime bằng giá trị thật có thể reproduce;
- chuẩn bị dedicated/disposable test data cho mutation tests;
- xác định setup/cleanup strategy;
- chỉ bật các state-changing/destructive test khi precondition đã an toàn và rõ ràng;
- không fabricate token, ID, resource, file fixture, expected dataset hoặc execution evidence.

## 18.1 Common preparation contract

Trước khi chạy Newman chính thức, với mỗi API phải xác định tối thiểu:

```text
Runtime endpoint/base URL
Required actors/tokens/roles
Controlled input values
Required resource IDs
Required initial states
Dedicated mutation data if needed
Setup procedure
Cleanup/reset procedure
Remaining unresolved runtime dependencies
```

Nếu testcase phụ thuộc dữ liệu mà runtime chưa có, phải tạo hoặc discover dữ liệu thật bằng documented setup path. Không điền giá trị giả chỉ để collection chạy.

## 18.2 API 1 — FR-05 Product Search

Chuẩn bị các giá trị thật khi applicable:

```text
matchingKeyword
noMatchKeyword
exactProductName
partialKeyword
unicodeKeyword
normalKeywordA
normalKeywordB
```

Ngoài ra:

- tạo dedicated product nếu rename/delete sequence cần mutation;
- lấy admin token thật nếu documented mutation endpoint yêu cầu;
- chỉ bật rename/delete tests sau khi disposable product và cleanup path đã sẵn sàng.

## 18.3 API 2 — FR-10 Cancel Order

Chuẩn bị controlled order states và authenticated actors:

```text
PENDING order
CONFIRMED order
SHIPPING order
DELIVERED order
CANCELED order
```

Kèm theo:

- user token thật;
- admin token nếu testcase cần;
- order ownership đúng cho ownership/IDOR cases;
- dedicated/disposable orders;
- exact `orderId` cho từng state;
- reset/recreate strategy để các testcase stateful có thể chạy lặp lại.

## 18.4 API 3 — FR-16 Import Products

Chuẩn bị auth và controlled import fixtures:

```text
admin token
non-admin token when required
valid CSV
invalid-header CSV
missing-name CSV
zero/negative-price CSV
RFC4180 quoted-comma CSV
mixed valid+invalid rows for atomic rollback
```

Kèm theo:

- baseline product state/count hoặc unique names khi testcase cần so sánh trước/sau;
- cleanup strategy cho successful imports;
- không tạo file fixture giả mạo requirement mà source không định nghĩa.

## 18.5 Runtime-data readiness check

Trước khi sang execution, ghi rõ cho từng testcase/stateful group:

```text
READY
BLOCKED — missing runtime data
BLOCKED — missing auth/role
BLOCKED — unsafe mutation setup
```

Official execution chỉ bắt đầu khi các testcase dự kiến chạy có precondition xác định và reproducible.

---

# 19. Step K — Execute Real Tests

## 19.1 Run SUT

Verify real hostname:

```text
localhost
```

hoặc:

```text
127.0.0.1
```

## 19.2 Run Postman manually first

Fix:

- setup;
- dynamic IDs;
- auth;
- data dependencies;
- cleanup;
- flaky tests.

## 19.3 Run Newman through the reusable Step K runner

Do not ask the AI agent to ingest the full Newman CLI/JSON/HTML output by default.
Use the reusable runner so raw execution evidence is preserved on disk while a
small failure-oriented summary is generated for AI reasoning.

```bash
./scripts/run-step-k.sh FR05
./scripts/run-step-k.sh FR10
./scripts/run-step-k.sh FR16
```

Before an API is runtime-ready, validate file resolution without executing:

```bash
./scripts/run-step-k.sh FR10 --dry-run
```

The runner:

1. resolves the correct collection/environment/runtime-data files;
2. executes Newman;
3. stores the full CLI/JSON/HTML/JUnit artifacts in `postman/newman/`;
4. invokes `scripts/extract-newman-summary.js`;
5. produces compact `FRxx-execution-summary.json` and `.md` files;
6. preserves Newman's real exit code so genuine failures remain visible to CI.

Raw reports remain the evidence source of truth. The compact summary is the
default AI input for Step K and Gate G.

## 19.4 Record real evidence

Store:

- CLI output;
- HTML report;
- screenshots;
- actual request/response;
- X-Student-Id proof.

Additionally store the compact AI-consumption artifact:

```text
postman/newman/FR05-execution-summary.json
postman/newman/FR05-execution-summary.md
```

and analogously for FR10 and FR16.

### Token-efficiency rule

For normal Step K analysis, the AI should read only the compact execution
summary. Do **not** load complete Newman JSON/HTML/CLI reports into context.
Inspect a raw report only when a specific failed testcase cannot be diagnosed
from the compact summary.

## 19.5 Never normalize real failures away

Nếu testcase fail:

1. inspect expected;
2. inspect spec;
3. reproduce;
4. distinguish:
   - test bug;
   - environment problem;
   - genuine SUT bug.

Use this evidence flow:

```text
Newman raw evidence
        ↓
extract-newman-summary.js
        ↓
compact totals + failures only
        ↓
Human Gate G
        ↓
open raw evidence only for unresolved failed cases
```

## Commit

```bash
git add postman/newman PoolA-FR-05-ProductSearch/evidence
git commit -m "test(api1): execute API suite with Newman"
```

---

# 20. Step L — Genuine Bug Reporting

Một failure chỉ được report là bug sau Human Confirmation Gate.

Check:

```text
Specification
+
Reproduction
+
Expected
+
Actual
+
Environment
```

Bug report phải chứa:

```text
Bug ID
Title
Severity
API
Requirement
Precondition
Steps
Request
Expected
Actual
Evidence
Reproducibility
```

Tạo:

```text
PoolA-FR-05-ProductSearch/bugs/BUG-001.md
```

Đồng thời mở GitHub Issue.

Attach screenshot.

Nếu AI-generated case tìm ra bug:

```text
Found by: AI-generated test
```

Nếu human-added case tìm ra:

```text
Found by: Human-added test
AI missed: Yes
```

## Commit

```bash
git add PoolA-FR-05-ProductSearch/bugs
git commit -m "bug(api1): document confirmed API defects"
```

---

# 21. Repeat Phases for API 2

Lặp toàn bộ:

```text
Requirement Analysis
Domain Partition
State Analysis
Security
Schema
>=35 AI Tests
Audit
>=5 Human Tests
Postman
Runtime Data & Preconditions
Newman
Bug Report
```

Commit riêng cho từng stage.

---

# 22. Repeat Phases for API 3

Lặp toàn bộ pipeline tương tự API 1 và API 2.

---

# 23. Phase 5 — Consolidate Test Cases into Excel

Required final Excel should include all 3 APIs.

Suggested sheets:

```text
Summary
API1_Final
API1_AI_Audit
API2_Final
API2_AI_Audit
API3_Final
API3_AI_Audit
Bug_Summary
```

Summary metrics:

```text
APIs tested
AI-generated test cases
Invalid AI cases
Incomplete AI cases
Corrected cases
Human-added cases
Executed
Passed
Failed
Blocked
Bugs
AI-missed bugs
```

---

# 24. Phase 6 — CI/CD Integration

## 24.1 GitHub Actions pipeline

Suggested workflow:

```text
Checkout
↓
Install dependencies
↓
Start SUT
↓
Wait for health
↓
Install Newman
↓
Run Newman
↓
Publish report artifact
```

File example:

```text
.github/workflows/api-tests.yml
```

## 24.2 Required Run A — All Passing

Create a commit where:

```text
ALL API TESTS PASS
```

Capture:

- commit hash;
- GitHub Actions URL;
- screenshot;
- Newman output.

## 24.3 Required Run B — Exactly One Failing Test

Create intentional test expectation mismatch or controlled failing case.

Important:

- failure phải rõ là sample CI demonstration;
- không pretend đó là SUT defect;
- exactly one testcase fail nếu có thể kiểm soát.

Capture:

- commit;
- pipeline URL;
- screenshot.

Sau evidence, restore valid testcase.

## 24.4 CI/CD report

Create:

```text
cicd/CI-CD-Report.md
```

Include:

- pipeline architecture;
- YAML explanation;
- environment;
- pass run;
- fail run;
- links;
- screenshots;
- limitations.

## Commit

```bash
git add .github cicd
git commit -m "ci(hw06): run Newman API tests in GitHub Actions"
```

---

# 25. Phase 7 — AI-Driven API Test Generator

Đây là phần Agent Skill / G9.5.

## 25.1 Goal

Input:

```text
API Specification
```

Output:

```text
Structured API Test Cases
```

## 25.2 Suggested internal stages

```text
Specification Input
↓
Requirement Parser
↓
Endpoint Model
↓
Parameter / Constraint Analyzer
↓
Domain Partition Generator
↓
State Transition Analyzer
↓
Security Mapper
↓
Schema Test Generator
↓
Coverage Analyzer
↓
Deduplicator
↓
Human Review Gate
↓
Final Test Cases
```

## 25.3 Pseudocode

Create:

```text
agent-skill/pseudocode.md
```

## 25.4 Skill implementation

Optionally implement:

```text
agent-skill/api-test-generator/
```

Skill should accept:

- spec path;
- selected endpoint/FR;
- security requirements;
- output format.

It should generate:

- requirement model;
- coverage model;
- candidate tests;
- audit-ready metadata.

## 25.5 Diagram

IMPORTANT:

Final submitted diagram must be **self-drawn by student**.

AI may:

- explain architecture;
- review your draft;
- check consistency.

AI must not directly generate the final diagram that will be submitted as self-drawn evidence.

Save:

```text
agent-skill/api-test-generator-diagram.png
```

## 25.6 Optional demo video

Record a real demonstration of generator producing tests for one API.

## Commit

```bash
git add agent-skill
git commit -m "feat(agent): design AI-driven API test generator"
```

---

# 26. Phase 8 — AI Audit Report

Use logs produced from the beginning.

Generate:

```text
reports/ai-audit-report.md
```

For every significant interaction include:

```text
Tool
Date
Time
Prompt
Output
Human Review
Correction
Artifact
```

Do not recreate fake historical interactions.

AI Audit should demonstrate:

```text
AI Output
→ Human Evaluation
→ Correction
→ Final Artifact
```

Export PDF later.

## Commit

```bash
git add reports/ai-audit-report.md reports/ai-session-logs
git commit -m "docs(hw06): compile AI audit report"
```

---

# 27. Phase 9 — AI Critique

Length:

```text
200–300 words
```

Must answer:

1. AI sai/thiếu/bias ở đâu?
2. Tại sao AI không bắt được?
3. Bài học về human-AI collaboration là gì?

Use actual evidence from:

- INVALID tests;
- INCOMPLETE tests;
- human-added tests;
- bugs AI missed;
- prompt limitations.

Do not write generic praise.

Artifact:

```text
reports/AI-Critique.md
```

## Commit

```bash
git add reports/AI-Critique.md
git commit -m "docs(hw06): add evidence-based AI critique"
```

---

# 28. Phase 10 — Main Report

Create:

```text
reports/main-report.md
```

Suggested structure:

```text
1. Assignment Overview
2. SUT and Environment
3. AI Usage Method
4. API Selection
5. API 1
   5.1 Requirement Analysis
   5.2 AI Generation
   5.3 Human Audit
   5.4 Human Extension
   5.5 Postman Implementation
   5.6 Execution
   5.7 Bugs
6. API 2
7. API 3
8. Postman Features Used
9. CI/CD
10. AI Test Generator
11. Test Summary
12. AI Critique
13. Conclusions
Appendix A — AI Audit
```

Export:

```text
main-report.pdf
```

---

# 29. Phase 11 — README and Self-Assessment

Create/update:

```text
README.md
```

Must contain:

## Self-assessment

| No. | Criteria | Grade | Self-Assessed |
| --- | --- | ---: | ---: |
| 1 | API 1 full pipeline | 30 | |
| 2 | API 2 full pipeline | 30 | |
| 3 | API 3 full pipeline | 30 | |
| 4 | Agent Skill | 10 | |
| | Total | 100 | |

## Test summary

Include:

```text
Number of APIs
AI-generated tests
Human-added tests
Executed
Passed
Failed
Bugs
AI-missed bugs
```

## Repository links

- GitHub repository
- CI/CD runs
- GitHub Issues
- optional video

---

# 30. Phase 12 — Git Commit Log

Requirement:

Create a commit for each important procedure step.

Export:

```bash
git log --date=iso --pretty=format:"%h | %ad | %an | %s" > git-commit-log.txt
```

Verify history clearly shows:

```text
generation
audit
extension
execution
bugs
CI/CD
agent skill
documentation
```

---

# 31. Phase 13 — Final Compliance Audit

Before packaging, perform requirement-by-requirement audit.

## API Selection

- [ ] Exactly 3 APIs.
- [ ] Pool A represented.
- [ ] Pool B represented.
- [ ] Pool C represented.
- [ ] No Pool D.
- [ ] Combination confirmed non-duplicate within group.

## Per API

- [ ] >=35 AI-generated tests.
- [ ] Every parameter domain-partitioned.
- [ ] State transitions covered where applicable.
- [ ] SEC-01–SEC-07 mapped where applicable.
- [ ] Schema validation included.
- [ ] Every AI case classified VALID/INVALID/INCOMPLETE.
- [ ] Invalid/incomplete cases corrected.
- [ ] >=5 human-added cases.
- [ ] Reason AI missed each human-added case.
- [ ] Implemented in Postman.
- [ ] Executed.
- [ ] Newman HTML report.
- [ ] Genuine bugs reported.

## Evidence

- [ ] `X-Student-Id` screenshot is real.
- [ ] Newman run is real.
- [ ] Hostname matches local deployment.
- [ ] GitHub Issues screenshots are real.
- [ ] GitHub Actions evidence is real.
- [ ] Final agent diagram is self-drawn.

## Postman

- [ ] Collection.
- [ ] Environment.
- [ ] Variables.
- [ ] Pre-request script.
- [ ] Data-driven run.
- [ ] Tests.
- [ ] Features used are listed in report.

## CI/CD

- [ ] Pipeline YAML committed.
- [ ] all-pass sample run.
- [ ] one-fail sample run.
- [ ] screenshots.
- [ ] run links.
- [ ] CI/CD report.

## AI

- [ ] AI Audit Report.
- [ ] Tool names.
- [ ] Dates/times.
- [ ] Prompts.
- [ ] Outputs.
- [ ] Human decisions/corrections.
- [ ] AI Critique 200–300 words.

## Agent Skill

- [ ] Design complete.
- [ ] Pseudocode complete.
- [ ] Self-drawn diagram.
- [ ] Reusable skill if implemented.
- [ ] Optional demo video.

## Git

- [ ] Commits created throughout workflow.
- [ ] Git commit log exported.

## Reports

- [ ] Main report Markdown.
- [ ] Main report PDF.
- [ ] Excel test cases.
- [ ] Test summary.
- [ ] Bug report.
- [ ] AI Audit Markdown.
- [ ] AI Audit PDF.
- [ ] AI Critique.
- [ ] CI/CD Report.
- [ ] README.
- [ ] Self-assessment.

---

# 32. Phase 14 — Submission Package

Filename:

```text
<StudentID>_HW06_AI_API_<SelfAssessedGrade>.zip
```

Example:

```text
23127194_HW06_AI_API_090.zip
```

Suggested package:

```text
<StudentID>_HW06_AI_API_<GRADE>/
├── README.md
├── Main-Report.md
├── Main-Report.pdf
├── API-Test-Cases.xlsx
├── postman/
│   ├── collection.json
│   ├── environment.json
│   ├── data/
│   └── Newman-Report.html
├── cicd/
│   ├── CI-CD-Report.md
│   └── screenshots/
├── bugs/
│   ├── Bug-Report.md
│   └── screenshots/
├── agent-skill/
│   ├── diagram.png
│   ├── pseudocode.md
│   └── skill/
├── ai/
│   ├── AI-Audit-Report.md
│   ├── AI-Audit-Report.pdf
│   └── AI-Critique.md
└── git-commit-log.txt
```

---

# 33. Recommended Execution Order

Thứ tự thực hiện thực tế:

```text
P0  Initialize workspace
P1  Create AI Audit Skill
P2  Create API Testing Human-in-the-Loop Skill
P3  Inspect SUT + api_specification.md
P4  Build API inventory
P5  Select 3 APIs + human confirmation
P6  API 1 full pipeline
P7  API 2 full pipeline
P8  API 3 full pipeline
P9  Consolidate Excel test suite
P10 Finalize Postman/Newman
P11 CI/CD integration
P12 AI-driven API Test Generator
P13 Self-drawn diagram + pseudocode
P14 Compile AI Audit Report
P15 Write evidence-based AI Critique
P16 Main report + README
P17 Export Git commit log
P18 Full compliance audit
P19 Create final ZIP
```

---

# 34. Definition of Done

HW06 chỉ được xem là DONE khi:

```text
3 APIs
×
(
  >=35 AI-generated tests
  + full human audit
  + >=5 human-added tests
  + real Postman execution
  + Newman report
  + bug analysis
)
+
Postman feature evidence
+
CI/CD pass run
+
CI/CD intentional fail run
+
AI-driven test generator
+
self-drawn diagram
+
AI Audit Report
+
AI Critique
+
Git commit history
+
README + self-assessment
+
final submission package
```

Không mark DONE nếu còn thiếu bất kỳ mandatory document hoặc execution evidence nào.
