# Kịch bản quay và chụp màn hình Phase 4 - Spike Test

## 1. Mục tiêu evidence

Quay đoạn Phase 4 khoảng **5-6 phút** để chứng minh:

- JMeter 5.6.3 mở đúng `23127194_Spike_20260812.jmx` của Student ID 23127194.
- Ba stage chạy tuần tự theo hợp đồng đã review: Baseline 10 threads/30 giây, Spike 80 threads/60 giây và Recovery 10 threads/30 giây; ramp mỗi stage 1 giây, think-time 250 ms.
- Mỗi stage giữ nguyên chín request của Scenario C, JWT và `orderId` correlation, hủy đúng order vừa tạo và xác nhận trạng thái `canceled`.
- Response Time Graph là listener riêng của Spike; View Results Tree bị tắt khi measured execution.
- Backend được reset và 80 account được provision tự động trước measured traffic.
- JMeter, backend resource monitor và tiến trình tải xuất hiện trong cùng khung hình khi chạy.
- Kết luận recovery dựa trên raw JTL, stage metrics, các cửa sổ Recovery 10 giây và business state; không suy đoán chỉ từ đồ thị một phút.

Measured Run 01 đã hoàn tất và có evidence hợp lệ. Khi quay trực tiếp, dùng **Run02** để runner không ghi đè evidence hiện có. Chỉ chọn Run02 làm evidence chính nếu raw JTL, HTML dashboard, resource CSV, environment và order-state đều hoàn chỉnh.

## 2. Bố trí trước khi quay

1. Bật Do Not Disturb; đóng email, chat và password manager.
2. Không mở `data/scenario-c.local.csv`; không để password, JWT hoặc token xuất hiện.
3. Bố trí bốn vùng trong cùng màn hình:
   - Trái trên: JMeter GUI và final Spike tree.
   - Phải trên: Activity Monitor, lọc `node` và `java`.
   - Trái dưới: terminal chạy measured Spike runner.
   - Phải dưới: terminal theo dõi console hoặc resource CSV.
4. Tạo thư mục ảnh nếu chưa có:

   ```bash
   mkdir -p evidence/screenshots/spike
   ```

5. Xác nhận port 3000 đang trống. Runner sẽ dừng an toàn nếu backend cũ đang giữ port.

## 3. Các lệnh dùng trong video

Chạy từ thư mục `HW05`.

### Mở final plan để review

```bash
jmeter -t /Users/nguyenhoangphihung/Document/ky_3/SoftwareTesting-Homework/HW05/tests/23127194_Spike_20260812.jmx
```

Không bấm Start trong GUI. GUI chỉ dùng để trình bày final tree; measured test chạy non-GUI.

### Chạy Spike Run02

```bash
RUN_SUFFIX=Run02 scripts/run-measured-spike.sh
```

Runner cố định workload đã được review: 10/30 giây -> 80/60 giây -> 10/30 giây, ramp 1 giây và think-time 250 ms.

### Theo dõi console và resource samples

```bash
tail -f results/raw/spike/23127194_Spike_20260812_Run02.console.log
```

```bash
tail -f evidence/spike/23127194_Spike_20260812_Run02-resources.csv
```

### Mở HTML dashboard sau khi hoàn tất

```bash
open results/html/spike/23127194_Spike_20260812_Run02/index.html
```

### Đối chiếu artifact cuối run

```bash
wc -l results/raw/spike/23127194_Spike_20260812_Run02.jtl \
  evidence/spike/23127194_Spike_20260812_Run02-resources.csv
```

```bash
cat evidence/spike/23127194_Spike_20260812_Run02-order-state.txt
```

Không phát biểu metric Run02 từ báo cáo Run01. Sau Run02, phân tích raw JTL và cập nhật báo cáo riêng trước khi kết luận p95 hoặc recovery time.

## 4. Timeline và lời thoại gợi ý

### 00:00-00:25 - Nhận diện Phase 4

**Màn hình:** JMeter GUI hiển thị Test Plan và filename.

**Lời thoại:**

> Đây là Phase 4 Spike Testing của HW05, Student ID 23127194. Tôi sử dụng Apache JMeter 5.6.3 và file chính thức 23127194_Spike_20260812.jmx. Mục tiêu là quan sát phản ứng khi tải tăng đột ngột từ 10 lên 80 threads rồi trở về 10 threads, đồng thời kiểm tra khả năng recovery của ứng dụng.

Chụp `01-spike-plan-identity.png`.

### 00:25-01:20 - Review ba stage và Scenario C tree

**Màn hình:** Mở lần lượt:

1. Setup validation.
2. `01 Baseline Stage - Scenario C`.
3. `02 Spike Stage - Scenario C`.
4. `03 Recovery Stage - Scenario C`.
5. CSV Data Set Config và flow-start deadline của từng stage.
6. Auth Heavy, Read Heavy, Transactional Cart, Checkout và Order Lifecycle.
7. Chín HTTP samplers của một stage, rồi đối chiếu cùng cấu trúc ở hai stage còn lại.

**Lời thoại:**

> Ba Thread Group được serialize nên không chồng lấn account. Mỗi stage giữ nguyên chín request: login, search, product detail, add và verify cart, checkout, đọc order mới, hủy đúng order đó và xác nhận canceled trong history. CSV không recycle, JWT và orderId được correlate theo từng flow, và active flow được phép hoàn tất sau deadline bắt đầu flow.

Chụp:

- `02-spike-three-stages.png`.
- `03-spike-scenario-tree.png`.
- `04-spike-csv-correlation.png`.

### 01:20-01:50 - Workload, listener và recovery contract

**Màn hình:** Hiển thị Test Plan comments/runtime properties, Response Time Graph và View Results Tree disabled.

**Lời thoại:**

> Baseline dùng 10 threads trong 30 giây, Spike tăng đột ngột lên 80 threads trong 60 giây, sau đó Recovery trở về 10 threads trong 30 giây. Mỗi ramp là một giây và think-time là 250 mili giây. Response Time Graph là report view riêng của Spike, khác Summary Report của Load và Aggregate Report của Stress. View Results Tree bị tắt để tránh overhead trong measured run. Recovery đạt yêu cầu khi latency, HTTP error và business success trở lại giới hạn đã review; resource recovery chỉ được công bố khi sample theo thời gian hỗ trợ.

Chụp:

- `05-spike-runtime-contract.png`.
- `06-response-time-graph-tree-disabled.png`.

### 01:50-02:20 - Reset và provision 80 account

**Màn hình:** Chạy Run02 và chờ provisioning hoàn tất.

**Lời thoại:**

> Runner khởi động lại backend để reset database, đợi database sẵn sàng, rồi provision 80 account trước khi JMeter bắt đầu. Registration là setup traffic và không nằm trong measured JTL. Runner cũng từ chối ghi đè artifact của run đã tồn tại.

Chụp `07-provision-80-users.png` khi terminal cho thấy `total=80`; không để credential xuất hiện.

### 02:20-03:25 - Baseline, sudden Spike và Recovery live

**Màn hình:** Giữ JMeter console, Activity Monitor và resource CSV trong cùng frame. Ghi lại ba mốc:

1. Baseline khoảng 10 active threads.
2. Ngay sau khi Spike bắt đầu, tải tăng về phía 80 active threads.
3. Recovery khi workload trở lại khoảng 10 active threads.

**Lời thoại:**

> Đây là measured run chạy non-GUI. Baseline thiết lập trạng thái ngay trước spike; stage thứ hai tạo bước nhảy tải đột ngột lên 80 threads; stage cuối đưa workload trở lại 10 threads để quan sát recovery. Activity Monitor và resource CSV đang ghi riêng CPU/RSS của backend node và JMeter java. CPU java là tải của load generator, không phải CPU của SUT.

Chụp:

- `08a-spike-live-baseline.png`.
- `08b-spike-live-sudden-load.png`.
- `08c-spike-live-recovery.png`.

Ba ảnh phải thấy terminal JMeter và resource monitor trong cùng frame.

### 03:25-04:15 - HTML dashboard và ba stage

**Màn hình:** Mở dashboard Run02; hiển thị Dashboard, Statistics, Active Threads Over Time và Response Times Over Time.

**Lời thoại:**

> Đây là dashboard được JMeter sinh từ raw JTL của Run02. Tôi kiểm tra source filename, thời gian chạy, error percentage, throughput và percentile theo các label Baseline, Spike và Recovery. Active Threads Over Time giúp xác nhận hình dạng tải, nhưng vì đồ thị mặc định có granularity một phút nên tôi không dùng riêng đồ thị này để công bố recovery time.

Chụp:

- `09-spike-dashboard-overview-Run02.png`.
- `10-spike-statistics-Run02.png`.
- `11-active-threads-over-time-Run02.png`.
- `12-spike-response-times-over-time-Run02.png`.

### 04:15-05:10 - Recovery windows và business state

**Màn hình:** Hiển thị kết quả phân tích Run02 theo stage/cửa sổ Recovery, sau đó order-state.

**Lời thoại:**

> Tôi so sánh Recovery với Baseline của cùng Run02. Điều kiện tương đối là Recovery end-to-end p95 không vượt 1,5 lần Baseline; điều kiện tuyệt đối là end-to-end p95 không quá 250 mili giây, mỗi transaction p95 không quá 100 mili giây, HTTP error không quá 1 phần trăm và business success ít nhất 99 phần trăm. Recovery time chỉ được xác nhận từ các cửa sổ 10 giây liên tiếp trong raw JTL. Order-state phải có non-canceled orders bằng zero.

Chỉ đọc các số thật của Run02. Chụp:

- `13-spike-stage-and-recovery-analysis-Run02.png`.
- `14-spike-order-state-Run02.png`.

### 05:10-05:40 - Resource evidence và kết luận

**Màn hình:** Hiển thị resource CSV có nhiều dòng, environment file, raw JTL và HTML directory cùng identity Run02.

**Lời thoại:**

> Tôi đối chiếu CPU và RSS của backend trước spike, trong spike và cuối Recovery. Tôi chỉ tuyên bố CPU hoặc memory recovery khi các sample của Run02 chứng minh điều đó. Measured Run01 xác nhận application recovery trong 10 giây và CPU trở về gần mức trước spike, nhưng RSS vẫn cao hơn rõ rệt; vì vậy Run01 không được dùng để tuyên bố memory recovery. Nếu Run02 cũng không có failure, kết luận đúng là hệ thống resilient tại mức spike 80 threads, không phải 80 là capacity ceiling.

Chụp `15-spike-resource-and-artifacts-Run02.png`.

## 5. Danh sách screenshot Phase 4

| File | Nội dung bắt buộc | Trạng thái hiện tại |
| --- | --- | --- |
| `01-spike-plan-identity.png` | Student ID, Spike filename và JMeter context | Chụp trong GUI |
| `02-spike-three-stages.png` | Baseline, Spike và Recovery Thread Groups | Chụp trong GUI |
| `03-spike-scenario-tree.png` | Năm transaction groups và chín HTTP samplers | Chụp trong GUI |
| `04-spike-csv-correlation.png` | CSV isolation, JWT và fresh `orderId` correlation | Chụp trong GUI |
| `05-spike-runtime-contract.png` | 10/30 s -> 80/60 s -> 10/30 s; ramp 1 s; think 250 ms | Chụp trong GUI |
| `06-response-time-graph-tree-disabled.png` | Response Time Graph enabled; View Results Tree disabled | Chụp trong GUI |
| `07-provision-80-users.png` | Provisioning `total=80`, không lộ password | Chụp khi chạy Run02 |
| `08a-spike-live-baseline.png` | Baseline console và resource monitor cùng frame | Chụp khi chạy Run02 |
| `08b-spike-live-sudden-load.png` | Sudden Spike console và resource monitor cùng frame | Chụp khi chạy Run02 |
| `08c-spike-live-recovery.png` | Recovery console và resource monitor cùng frame | Chụp khi chạy Run02 |
| `09-spike-dashboard-overview.jpg` | Dashboard đúng measured Run01 | Đã chụp tự động |
| `10-spike-statistics.jpg` | Error %, sample count, p95 và throughput | Đã chụp tự động |
| `11-active-threads-over-time.jpg` | Đồ thị active threads theo stage | Đã chụp tự động |
| `12-spike-response-times-over-time.jpg` | Response time theo thời gian | Đã chụp tự động |
| `13-spike-stage-and-recovery-analysis-Run02.png` | Metric theo stage và các cửa sổ Recovery 10 giây | Chụp sau phân tích Run02 |
| `14-spike-order-state-Run02.png` | Total/canceled/non-canceled orders | Chụp sau Run02 |
| `15-spike-resource-and-artifacts-Run02.png` | Resource CSV, environment, JTL và HTML cùng identity | Chụp sau Run02 |

Bốn ảnh dashboard hiện có nằm tại `evidence/screenshots/spike/` và được tạo từ measured Run01. Khi Run02 hoàn tất, dùng tên có hậu tố `-Run02` như timeline để không nhầm hai lần chạy. Không chỉnh số liệu; chỉ crop hoặc che dữ liệu riêng tư nếu cần.

## 6. Checklist sau khi quay

- [ ] Tổng video của bài đạt ít nhất 6 phút và có narration tiếng Việt bằng giọng tester.
- [ ] JMeter và Activity Monitor/resource terminal cùng xuất hiện khi Spike chạy.
- [ ] Thấy rõ filename, Student ID, ba stage, Response Time Graph và View Results Tree disabled.
- [ ] Không lộ password, JWT hoặc nội dung CSV cục bộ.
- [ ] Run02 có raw JTL, HTML dashboard, resource, environment và order-state.
- [ ] Resource CSV có nhiều hơn một dòng header.
- [ ] Mọi metric và recovery statement khớp chính xác Run02.
- [ ] Recovery time dựa trên raw timestamp windows, không chỉ dựa vào đồ thị một phút.
- [ ] Không tuyên bố memory recovery nếu RSS chưa về gần pre-spike range.
- [ ] Không gọi 80 threads là capacity ceiling khi chưa đo failure point.
- [ ] Giữ nguyên video và screenshot gốc.

## 7. Nếu Run02 thất bại

Không xóa hoặc chỉnh raw evidence. Dừng phần kết luận và dùng identity mới:

```bash
RUN_SUFFIX=Run03 scripts/run-measured-spike.sh
```

Chỉ chọn một run hoàn chỉnh và nhất quán làm evidence chính. Ghi rõ run bị loại trừ và nguyên nhân trong báo cáo; không trộn metric, dashboard hoặc resource evidence giữa các run.
