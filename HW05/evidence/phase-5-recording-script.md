# Kịch bản quay và chụp màn hình Phase 5 - Endurance Test

## 1. Mục tiêu evidence

Quay đoạn Phase 5 khoảng **5-6 phút** để chứng minh:

- Apache JMeter 5.6.3 mở đúng `23127194_Endurance_20260812.jmx` của Student ID `23127194`.
- Workload đã review là 60 threads, ramp-up 30 giây, flow-start duration 720 giây và think-time 250 ms.
- Một luồng Scenario C hoàn chỉnh có chín HTTP requests, bao phủ auth-heavy, read-heavy và transactional.
- JWT, product data và fresh `orderId` được correlate; đúng order vừa tạo được hủy và xác nhận `canceled`.
- GUI listeners bị tắt trong measured execution; raw JTL và HTML dashboard là nguồn metric chính.
- Backend được reset và 60 account được provision trước measured traffic.
- JMeter console và backend resource monitor xuất hiện trong cùng khung hình khi chạy.
- Kết luận về steady throughput và memory trend dựa trên raw JTL cùng resource CSV, không suy đoán từ một ảnh đơn lẻ.

Measured Run01 đã hoàn tất. Nếu chưa có ảnh live cho Run01, quay một lần **Run02** để tạo evidence hiển thị thật; runner từ chối ghi đè Run01. Run02 kéo dài khoảng 12 phút, vì vậy có thể cắt các đoạn chờ trong video nhưng phải giữ timestamp và run identity rõ ràng.

## 2. Bố trí trước khi quay

1. Bật Do Not Disturb; đóng email, chat và password manager.
2. Không mở `data/scenario-c.local.csv`; không để password, JWT hoặc token xuất hiện.
3. Bố trí bốn vùng trong cùng màn hình:
   - Trái trên: JMeter GUI với final Endurance tree.
   - Phải trên: Activity Monitor, lọc `node` và `java`.
   - Trái dưới: terminal chạy measured Endurance runner.
   - Phải dưới: terminal theo dõi console hoặc resource CSV.
4. Tạo thư mục ảnh nếu chưa có:

   ```bash
   mkdir -p evidence/screenshots/endurance
   ```

5. Xác nhận port 3000 đang trống. Runner sẽ dừng nếu phát hiện backend cũ.
6. Đảm bảo còn ít nhất 2 GiB dung lượng trống; runner kiểm tra điều này trước khi chạy.

## 3. Các lệnh dùng trong video

Chạy từ thư mục `HW05`.

### Mở final plan để trình bày

```bash
jmeter -t /Users/nguyenhoangphihung/Document/ky_3/SoftwareTesting-Homework/HW05/tests/23127194_Endurance_20260812.jmx
```

Không bấm Start trong GUI. GUI chỉ dùng để review tree; measured traffic chạy non-GUI.

### Chạy Endurance Run02 nếu cần live evidence

```bash
RUN_SUFFIX=Run02 scripts/run-measured-endurance.sh
```

Runner cố định 60 threads, ramp 30 giây, flow-start duration 720 giây, think-time 250 ms, resource interval một giây và tự provision 60 users.

### Theo dõi tiến trình và resource samples

```bash
tail -f results/raw/endurance/23127194_Endurance_20260812_Run02.console.log
```

```bash
tail -f evidence/endurance/23127194_Endurance_20260812_Run02-resources.csv
```

### Phân tích Run02 sau khi hoàn tất

```bash
python3 .agents/skills/design-jmeter-endurance-test/scripts/analyze_endurance.py \
  results/raw/endurance/23127194_Endurance_20260812_Run02.jtl \
  evidence/endurance/23127194_Endurance_20260812_Run02-resources.csv \
  --output results/raw/endurance/23127194_Endurance_20260812_Run02-analysis.json
```

### Mở HTML dashboard

```bash
open results/html/endurance/23127194_Endurance_20260812_Run02/index.html
```

Để trình bày measured Run01 hiện có:

```bash
open results/html/endurance/23127194_Endurance_20260812/index.html
```

### Đối chiếu artifact cuối run

```bash
wc -l results/raw/endurance/23127194_Endurance_20260812_Run02.jtl \
  evidence/endurance/23127194_Endurance_20260812_Run02-resources.csv
```

```bash
cat evidence/endurance/23127194_Endurance_20260812_Run02-order-state.txt
```

Không đọc metric Run01 như thể chúng thuộc Run02. Mọi kết luận Run02 phải được tạo lại từ raw JTL, resource CSV và order-state của chính Run02.

## 4. Timeline và lời thoại gợi ý

### 00:00-00:25 - Nhận diện Phase 5

**Màn hình:** JMeter GUI hiển thị tên Test Plan và filename.

**Lời thoại:**

> Đây là Phase 5 Endurance Testing của HW05, Student ID 23127194. Tôi sử dụng Apache JMeter 5.6.3 và file chính thức 23127194_Endurance_20260812.jmx. Mục tiêu là duy trì tải trong 12 phút để quan sát độ ổn định theo thời gian, throughput của business flow và hành vi bộ nhớ backend.

Chụp `01-endurance-plan-identity.png`.

### 00:25-01:15 - Review workload và Scenario C tree

**Màn hình:** Mở lần lượt:

1. `Unmeasured Setup - Validate Reviewed Runtime Properties`.
2. `Measured Endurance - Scenario C`.
3. `Scenario C Dedicated Users`, HTTP defaults, headers và think-time.
4. `Start New Flow Only Before Reviewed Deadline`.
5. Năm transaction groups và chín HTTP samplers.

**Lời thoại:**

> Measured Thread Group nhận bốn property không có fallback: 60 threads, ramp 30 giây, duration 720 giây và think-time 250 mili giây. CSV không recycle và cần ít nhất một account cho mỗi thread. Flow gồm login, search, product detail, add và verify cart, checkout, đọc order mới, hủy đúng order đó và xác nhận trạng thái canceled trong order history. JWT và orderId được correlate theo từng iteration.

Chụp:

- `02-endurance-thread-group.png`.
- `03-endurance-scenario-tree.png`.
- `04-endurance-csv-and-correlation.png`.

### 01:15-01:45 - Threshold và listener strategy

**Màn hình:** Hiển thị Test Plan comments/acceptance variables, Summary Report disabled và View Results Tree disabled.

**Lời thoại:**

> Các tiêu chí đã review là HTTP error không quá 1 phần trăm, business success ít nhất 99 phần trăm, end-to-end p95 không quá 250 mili giây và từng transaction p95 không quá 100 mili giây. GUI listeners bị tắt để giảm ảnh hưởng của load generator. Kết quả được lấy từ raw JTL, HTML dashboard và analyzer theo cửa sổ một phút.

Chụp:

- `05-endurance-runtime-contract.png`.
- `06-endurance-listeners-disabled.png`.

### 01:45-02:20 - Reset và provision 60 users

**Màn hình:** Bắt đầu Run02 và chờ provisioning hoàn tất.

**Lời thoại:**

> Runner kiểm tra port và dung lượng, khởi động lại backend để reset database, chờ database sẵn sàng rồi provision 60 account trước khi JMeter bắt đầu. Registration là setup traffic nên không nằm trong measured JTL. Mỗi run dùng identity riêng và runner từ chối ghi đè artifact cũ.

Chụp `07-endurance-provision-60-users.png` khi terminal thể hiện đủ 60 users; không để credential xuất hiện.

### 02:20-03:20 - Ramp và sustained load live

**Màn hình:** JMeter console, Activity Monitor và resource CSV trong cùng frame. Lấy ít nhất ba mốc thật:

1. Ramp-up trong 30 giây đầu.
2. Giữa sustained run, khoảng phút 5-6.
3. Gần cuối duration, khoảng phút 11-12.

**Lời thoại:**

> Đây là measured run non-GUI. Trong 30 giây đầu, số thread tăng dần đến 60; sau đó tải được duy trì cho đến deadline bắt đầu flow. Activity Monitor và resource CSV đang ghi riêng CPU và RSS của backend node với tiến trình JMeter java. CPU của java là tải load generator, không phải CPU của SUT. Các active flow đã bắt đầu trước deadline được phép hoàn tất để tránh order còn pending.

Chụp:

- `08a-endurance-live-ramp.png`.
- `08b-endurance-live-mid-run.png`.
- `08c-endurance-live-final-minute.png`.

Mỗi ảnh phải thấy terminal JMeter và resource monitor trong cùng frame.

### 03:20-04:10 - HTML dashboard và whole-run metrics

**Màn hình:** Mở dashboard của đúng run; hiển thị Dashboard, Statistics, Active Threads Over Time và Response Times Over Time.

**Lời thoại cho Run01:**

> Dashboard này được JMeter sinh từ raw JTL của measured Run01. Run có 18.400 complete business flows và 165.600 HTTP requests, không có lỗi. End-to-end p95 là 30 mili giây, transaction p95 cao nhất là 14 mili giây và observed complete-flow rate toàn run là 25,56 flows mỗi giây. Tôi kiểm tra report identity và source file trước khi đọc các số này.

Nếu trình bày Run02, thay toàn bộ số bằng kết quả thực tế của Run02.

Chụp:

- `09-endurance-dashboard-overview.png`.
- `10-endurance-statistics.png`.
- `11-endurance-active-threads.png`.
- `12-endurance-response-times.png`.

### 04:10-05:05 - Steady-state windows và stable flow rate

**Màn hình:** Hiển thị `reports/endurance-test-results.md` hoặc analysis JSON của cùng run, tập trung vào bảng eleven one-minute windows.

**Lời thoại cho Run01:**

> Analyzer loại 30 giây ramp-up và đánh giá 11 cửa sổ steady-state đầy đủ, mỗi cửa sổ dài một phút. Cả 11 cửa sổ đều đạt HTTP error, business success, end-to-end p95 và transaction p95. Tốc độ business flow ổn định cao nhất quan sát được là 26,23 flows mỗi giây ở phút 9. Đây chỉ là maximum observed stable complete-flow rate trong cấu hình 60 threads này, không phải maximum HTTP RPS hay capacity ceiling toàn hệ thống.

Chụp `13-endurance-steady-window-analysis.png`.

### 05:05-05:45 - Resource trend và giới hạn kết luận

**Màn hình:** Hiển thị resource CSV/analysis và bảng memory interpretation.

**Lời thoại cho Run01:**

> Resource CSV có 698 sample. Backend CPU trung bình 12,01 phần trăm và cao nhất 23,2 phần trăm. Backend RSS cao nhất quan sát được là 188,84 MiB. Trong năm cửa sổ cuối, RSS có slope dương 5,99 MiB mỗi phút; vì chưa có plateau rule định lượng và tail trend vẫn tăng, tôi không tuyên bố memory plateau, safe memory ceiling hoặc không có memory leak. JMeter JVM được báo cáo riêng với backend.

Chụp `14-endurance-resource-trend.png`.

### 05:45-06:15 - Business state và kết luận

**Màn hình:** Hiển thị order-state, raw JTL, HTML folder và environment file có cùng run identity.

**Lời thoại cho Run01:**

> Sau khi hoàn tất, backend vẫn alive và readiness trả HTTP 200. Có 18.400 orders, tất cả đều canceled và không còn order chưa hủy. Kết luận của run này là Scenario C ổn định trong 12 phút tại 60 threads theo các tiêu chí đã review. Run không xác lập capacity ceiling hay memory ceiling; muốn kết luận dài hạn cần chạy lâu hơn hoặc lặp lại trên cùng điều kiện phần cứng.

Chụp:

- `15-endurance-order-state.png`.
- `16-endurance-artifact-identity.png`.

## 5. Danh sách screenshot Phase 5

| File | Nội dung bắt buộc | Trạng thái hiện tại |
| --- | --- | --- |
| `01-endurance-plan-identity.png` | Student ID, Endurance filename và JMeter context | Tester chụp trong GUI |
| `02-endurance-thread-group.png` | Một measured Thread Group, 60 threads/ramp 30 s/duration 720 s | Tester chụp trong GUI |
| `03-endurance-scenario-tree.png` | Năm transaction groups và chín HTTP samplers | Tester chụp trong GUI |
| `04-endurance-csv-and-correlation.png` | CSV isolation, JWT và fresh `orderId` | Tester chụp trong GUI |
| `05-endurance-runtime-contract.png` | Workload và reviewed thresholds | Tester chụp trong GUI |
| `06-endurance-listeners-disabled.png` | Summary Report và View Results Tree disabled | Tester chụp trong GUI |
| `07-endurance-provision-60-users.png` | Provisioning đủ 60 users, không lộ password | Tester chụp khi chạy visible Run02 |
| `08a-endurance-live-ramp.png` | Ramp console và resource monitor cùng frame | Tester chụp khi chạy visible Run02 |
| `08b-endurance-live-mid-run.png` | Giữa sustained run và resource monitor cùng frame | Tester chụp khi chạy visible Run02 |
| `08c-endurance-live-final-minute.png` | Phút cuối và resource monitor cùng frame | Tester chụp khi chạy visible Run02 |
| `09-endurance-dashboard-overview.png` | Dashboard đúng run identity | Tester chụp từ HTML dashboard |
| `10-endurance-statistics.png` | Samples, error %, p95 và throughput | Tester chụp từ HTML dashboard |
| `11-endurance-active-threads.png` | Đồ thị active threads theo thời gian | Tester chụp từ HTML dashboard |
| `12-endurance-response-times.png` | Response time theo thời gian | Tester chụp từ HTML dashboard |
| `13-endurance-steady-window-analysis.png` | 11 cửa sổ một phút và stable flow rate | Tester chụp từ report/analysis của cùng run |
| `14-endurance-resource-trend.png` | Backend CPU/RSS, tail slope và giới hạn kết luận | Tester chụp từ report/analysis của cùng run |
| `15-endurance-order-state.png` | Backend alive, total/canceled/non-canceled orders | Tester chụp từ order-state |
| `16-endurance-artifact-identity.png` | JTL, HTML, resource, environment và order-state cùng identity | Tester chụp sau run |

Không có ảnh Phase 5 nào được đánh dấu là đã chụp trong tài liệu này. Ảnh dashboard phải lấy trực tiếp từ HTML report thật; không chỉnh số liệu, ghép metric hoặc tái sử dụng ảnh của Load/Stress/Spike.

## 6. Checklist sau khi quay

- [ ] Tổng video toàn bài đạt ít nhất 6 phút và có narration tiếng Việt bằng giọng tester.
- [ ] JMeter và Activity Monitor/resource terminal cùng xuất hiện trong measured Endurance run.
- [ ] Thấy rõ Student ID, filename, 60 threads, ramp 30 giây, duration 720 giây và think-time 250 ms.
- [ ] Thấy đủ auth-heavy, read-heavy và transactional trong Scenario C tree.
- [ ] Không lộ password, JWT hoặc nội dung CSV cục bộ.
- [ ] Nếu dùng Run02, JTL, HTML, analysis JSON, resource, environment và order-state đều mang hậu tố `Run02`.
- [ ] Resource CSV có nhiều dòng timestamp trong toàn bộ run.
- [ ] Metric được đọc từ đúng raw JTL/dashboard/analysis của run đang trình bày.
- [ ] Stable rate được gọi là `maximum observed stable complete-flow rate`, không gọi là capacity ceiling.
- [ ] `188.84 MiB` của Run01 chỉ được gọi là maximum observed backend RSS.
- [ ] Không tuyên bố memory plateau hoặc memory ceiling khi tail slope vẫn dương.
- [ ] Giữ nguyên video và screenshot gốc.

## 7. Nếu Run02 thất bại

Không xóa hoặc sửa raw evidence. Dùng identity mới cho lần tiếp theo:

```bash
RUN_SUFFIX=Run03 scripts/run-measured-endurance.sh
```

Ghi rõ run bị loại trừ và nguyên nhân. Không trộn JTL, dashboard, resource CSV, order-state hoặc metric giữa các run.
