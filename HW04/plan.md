Mình đã đối chiếu đề HW04 với HW02. Ba tính năng web cần tự động hóa là:

| Pool | Feature | Số test HW02 hiện có |
|---|---|---:|
| A | FR-05 – Product Listing and Search | 15 |
| B | FR-09 – Discount Coupons | 23 |
| C | FR-17 – Coupon Management CRUD | 54 |

Không sử dụng Mobile-FR04 trong HW04.

## Chiến lược đề xuất

Dùng Playwright + TypeScript vì hỗ trợ Chromium, Firefox, WebKit và HTML report thuận tiện. Nên triển khai theo thứ tự:

1. FR-05 trước vì đơn giản và ổn định nhất.
2. FR-17 để xây dựng cơ chế tạo/xóa dữ liệu coupon.
3. FR-09 sau cùng vì phụ thuộc dữ liệu coupon của FR-17.

Tổng quy mô tối thiểu:

- 3 feature.
- Ít nhất 12 test/feature → ít nhất 36 test logic.
- 3 browser/feature → ít nhất 9 lượt chạy.
- Nếu chạy toàn bộ 36 test trên cả ba browser: ít nhất 108 kết quả test.
- 9 HTML report riêng biệt là phương án an toàn nhất để đáp ứng đúng cách diễn đạt của đề.

## Kế hoạch thực hiện trong 4 ngày

Đề ước lượng 10 giờ, nhưng Git yêu cầu commit trải trên ít nhất 4 ngày. Vì vậy nên chia nhỏ công việc theo ngày thật, không dồn vào một ngày.

### Ngày 1 — Khởi tạo và FR-05, khoảng 2,5 giờ

- Kiểm tra deadline Moodle và xác nhận `{StudentID}`.
- Clone/cài đặt và chạy thử EShop.
- Tạo project Playwright TypeScript.
- Cấu hình ba browser.
- Tạo cấu trúc Page Object, test data và report.
- Chọn ít nhất 12 test FR-05 từ [test case HW02](/Users/nguyenhoangphihung/Document/ky_3/SoftwareTesting-Homework/HW02/test-cases/FR05-product-listing-search.md).
- Chuyển dữ liệu sang `fr05-search.json`.
- Viết và chạy FR-05 trên Chromium trước.
- Ghi lại prompt và phản hồi AI ngay sau từng lần tương tác.

Hai commit gợi ý, đều phải sửa `.spec.ts`:

1. `Add initial FR05 product listing automation tests`
2. `Add FR05 search boundary cases and robust assertions`

### Ngày 2 — FR-17, khoảng 3 giờ

- Chọn 12–15 test có giá trị cao: create hợp lệ, required fields, duplicate code, discount boundaries, min order, usage limit, whitespace và delete.
- Viết helper đăng nhập admin.
- Sinh mã coupon duy nhất theo timestamp hoặc worker ID.
- Thực hiện cleanup sau test để tránh dữ liệu giữa các browser ảnh hưởng nhau.
- Kiểm tra dữ liệu có thực sự được lưu trong danh sách, không chỉ kiểm tra toast.
- Ghi nhận các lỗi thật đã thấy trong HW02 nhưng phải tái kiểm chứng trên phiên bản SUT hiện tại.

Hai commit gợi ý:

3. `Add FR17 coupon creation data-driven tests`
4. `Add FR17 validation delete and cleanup scenarios`

### Ngày 3 — FR-09 và ổn định test, khoảng 2,5 giờ

- Chuẩn bị coupon fixture qua UI, API hoặc seed script có kiểm soát.
- Chọn ít nhất 12 trường hợp: hợp lệ, code không tồn tại, hết hạn, dưới minimum order, usage limit, percent/fixed calculation và discount vượt tổng đơn.
- Kiểm tra đồng thời thông báo, số tiền giảm và tổng tiền cuối.
- Thay selector mong manh bằng role, label hoặc test ID.
- Loại bỏ timeout cố định; chờ trạng thái UI hoặc response phù hợp.
- Chạy lặp lại để phát hiện flaky test.

Hai commit gợi ý:

5. `Add FR09 coupon eligibility automation tests`
6. `Add FR09 discount calculations and edge cases`

### Ngày 4 — Multi-browser, bằng chứng và báo cáo, khoảng 2 giờ

- Chạy riêng từng feature trên từng browser.
- Xuất 9 thư mục HTML report độc lập.
- Kiểm tra mỗi report hiển thị:
  - `Run by: {StudentID}`
  - ISO timestamp, ví dụ `2026-08-09T14:30:00+07:00`
- Chụp screenshot cho từng lỗi thật.
- Tạo GitHub Issue và gắn screenshot.
- Hoàn thiện human review, AI critique, audit report và README.
- Ghi commit log ra file text.
- Quay video sau khi toàn bộ quy trình đã ổn định.

Hai commit gợi ý:

7. `Improve cross-browser selectors and test isolation`
8. `Finalize multi-browser automation and failure diagnostics`

Các commit tài liệu bổ sung vẫn hữu ích, nhưng không được tính vào tám commit bắt buộc nếu không sửa file test.

## Cấu trúc thư mục đề xuất

```text
HW04/
├── README.md
├── package.json
├── playwright.config.ts
├── tests/
│   ├── fr05-product-search.spec.ts
│   ├── fr09-discount-coupons.spec.ts
│   └── fr17-coupon-management.spec.ts
├── data/
│   ├── fr05-search.json
│   ├── fr09-coupons.json
│   └── fr17-coupon-crud.json
├── pages/
│   ├── product.page.ts
│   ├── checkout.page.ts
│   └── admin-coupon.page.ts
├── fixtures/
│   ├── auth.fixture.ts
│   └── coupon.fixture.ts
├── reports/
│   ├── main-report.md
│   ├── main-report.pdf
│   ├── ai-audit-report.md
│   ├── ai-audit-report.pdf
│   ├── ai-critique.md
│   ├── ai-critique.pdf
│   ├── bug-report.md
│   └── html/
├── screenshots/
├── agent-skill/
├── git-commit-log.txt
└── submission-checklist.md
```

## Thiết kế test data-driven

Mỗi record JSON nên chứa tối thiểu:

```json
{
  "id": "FR05-DT-007",
  "description": "Exact-name search",
  "input": {
    "keyword": "MacBook Pro M3"
  },
  "expected": {
    "productName": "MacBook Pro M3",
    "resultCount": 1
  }
}
```

Script chỉ đọc dữ liệu từ `.json` hoặc `.csv`; không đặt mảng test data trực tiếp trong `.spec.ts`.

Nên có ít nhất ba kiểu assertion trong từng feature hoặc thể hiện rõ trên toàn suite:

- Trạng thái/phần tử: visible, enabled, checked.
- Nội dung: text hoặc thông báo lỗi.
- Số lượng/giá trị: số product, discount, final amount.
- Có thể bổ sung URL, thuộc tính và trạng thái dữ liệu sau reload.

## Quy trình cộng tác với AI

Không dùng một prompt kiểu “viết toàn bộ test”. Với mỗi feature, chia thành các tương tác:

1. Yêu cầu AI phân tích test case và precondition.
2. Yêu cầu đề xuất selector.
3. Yêu cầu thiết kế JSON/CSV.
4. Sinh từng nhóm test nhỏ.
5. Chạy test và cung cấp lỗi thực tế cho AI phân tích.
6. Tự review và chỉnh sửa.
7. Yêu cầu AI rà soát flaky wait, isolation và assertion.
8. Ghi rõ phần nào được chấp nhận, sửa, loại bỏ hoặc bổ sung.

Mỗi tương tác phải lưu:

- Công cụ AI.
- Ngày giờ.
- Prompt nguyên văn.
- Output AI.
- Nhận xét human review.

Đừng đợi đến cuối mới dựng lại audit log vì đề yêu cầu toàn bộ output, không chỉ bản tóm tắt.

## Nội dung main report

Mỗi feature nên có cùng cấu trúc:

1. Feature và phạm vi.
2. Nguồn test case từ HW02.
3. Danh sách test được chọn.
4. Quy trình AI sinh script.
5. Thiết kế data-driven.
6. Selector và assertion.
7. Human review.
8. Các lỗi AI mắc phải và nguyên nhân.
9. Kết quả trên ba browser.
10. Test chưa tự động hóa được và lý do.
11. Bug phát hiện được.
12. Liên kết HTML report và GitHub Issue.

Phần human review nên đưa bằng chứng cụ thể, ví dụ:

- AI dùng CSS selector phụ thuộc vị trí.
- AI chỉ kiểm tra toast nhưng không kiểm tra dữ liệu đã lưu.
- AI dùng `waitForTimeout`.
- AI không cleanup coupon sau test.
- AI tính tiền từ chuỗi có ký hiệu `₫` sai.
- AI không phát hiện sự phụ thuộc giữa FR-17 và FR-09.

## Video demo

Nên chọn FR-05 để demo vì ít phụ thuộc dữ liệu và dễ chạy ổn định. Video dài khoảng 6–8 phút:

1. Hiển thị `whoami` và `hostname`.
2. Giới thiệu feature và file data.
3. Giải thích script.
4. Chỉ ra một lỗi trong output AI và cách đã sửa.
5. Chạy trên ba browser.
6. Mở HTML report.
7. Phóng to `Run by: {StudentID}` và ISO timestamp.
8. Tóm tắt pass/fail.

Nếu muốn lấy 10 điểm Agent Skill, nên có thêm đoạn hoặc video riêng chứng minh skill được dùng end-to-end trên một feature hoàn chỉnh.

## Checklist trước khi nộp

- [ ] Đúng FR-05, FR-09 và FR-17.
- [ ] Mỗi feature có ít nhất 12 test.
- [ ] Test data nằm ngoài script.
- [ ] Có ít nhất ba loại assertion.
- [ ] Có đủ chín lượt chạy feature–browser.
- [ ] Mỗi HTML report có Student ID và ISO timestamp.
- [ ] Không khai báo kết quả chưa chạy.
- [ ] Bug thật có Markdown, GitHub Issue và screenshot.
- [ ] Video ít nhất năm phút, có giọng nói và bằng chứng tác giả.
- [ ] AI Audit Report đầy đủ prompt/output.
- [ ] AI Critique đủ 200–300 từ.
- [ ] Ít nhất tám commit sửa test, trải trên bốn ngày.
- [ ] README có bảng tự đánh giá và test summary.
- [ ] Markdown đã chuyển sang PDF và kiểm tra trình bày.
- [ ] ZIP đúng mẫu `<StudentID>_HW04_AI_Automation_<Grade>.zip`.

Điểm cần ưu tiên ngay là bắt đầu lịch commit bốn ngày và xác nhận Student ID/deadline. Hai yêu cầu này không thể sửa hợp lệ bằng cách làm dồn vào cuối.