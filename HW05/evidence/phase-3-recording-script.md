# Kịch bản quay và chụp màn hình Phase 3 - Stress Test

## 1. Mục tiêu evidence

Quay đoạn Phase 3 khoảng **5-6 phút** để chứng minh:

- JMeter 5.6.3 mở đúng `23127194_Stress_20260812.jmx`.
- Stress test tái sử dụng nguyên vẹn chín request của Scenario C từ Load test.
- Workload tăng tuyến tính tới 80 threads trong 240 giây, có deadline 300 giây và think-time 250 ms.
- Backend được reset và provision 80 account riêng trước measured traffic.
- Aggregate Report là listener riêng của Stress; View Results Tree bị tắt.
- JMeter và resource monitor xuất hiện trong cùng khung hình khi tải đang chạy.
- Breakpoint được phân tích theo `allThreads` trong raw JTL, không suy đoán từ timeline.

Measured Run 01 đã có raw JTL và resource evidence hợp lệ. Khi quay trực tiếp, dùng **Run 02** để không ghi đè evidence hiện có. Chỉ chọn Run 02 làm evidence chính nếu JTL, HTML report, resource CSV và order-state đều hoàn chỉnh.

## 2. Bố trí trước khi quay

1. Bật Do Not Disturb; đóng email, chat và password manager.
2. Không mở `data/scenario-c.local.csv` hoặc hiển thị password/JWT.
3. Sắp xếp bốn vùng trong cùng màn hình:
   - Trái trên: JMeter GUI và final Stress tree.
   - Phải trên: Activity Monitor, lọc `node` và `java`.
   - Trái dưới: terminal chạy Stress runner.
   - Phải dưới: terminal theo dõi console hoặc resource CSV.
4. Mở sẵn thư mục lưu ảnh:

   ```bash
   mkdir -p evidence/screenshots/stress
   ```

5. Xác nhận port 3000 đang trống trước khi chạy. Runner sẽ dừng an toàn nếu có backend cũ giữ port.

## 3. Các lệnh dùng trong video

Chạy từ thư mục `HW05`.

### Mở plan để review

```bash
jmeter -t /Users/nguyenhoangphihung/Document/ky_3/SoftwareTesting-Homework/HW05/tests/23127194_Stress_20260812.jmx
```

Không bấm Start trong GUI. GUI chỉ dùng để trình bày cấu trúc; measured test chạy non-GUI.

### Chạy Stress Run 02

```bash
RUN_SUFFIX=Run02 \
STRESS_THREADS=80 \
STRESS_RAMP_UP_SECONDS=240 \
STRESS_DURATION_SECONDS=300 \
STRESS_THINK_TIME_MS=250 \
scripts/run-measured-stress.sh
```

### Theo dõi console và resource samples

```bash
tail -f results/raw/stress/23127194_Stress_20260812_Run02.console.log
```

```bash
tail -f evidence/stress/23127194_Stress_20260812_Run02-resources.csv
```

### Phân tích band sau khi hoàn tất

```bash
python3 .agents/skills/run-jmeter-stress-test/scripts/analyze_stress_jtl.py \
  results/raw/stress/23127194_Stress_20260812_Run02.jtl
```

## 4. Timeline và lời thoại gợi ý

### 00:00-00:25 — Nhận diện Phase 3

**Màn hình:** JMeter GUI hiển thị tên Test Plan và filename.

**Lời thoại:**

> Đây là Phase 3 Stress Testing của HW05, Student ID 23127194. Tôi sử dụng Apache JMeter 5.6.3 và file chính thức 23127194_Stress_20260812.jmx. Mục tiêu là tăng tải có kiểm soát để tìm band concurrency đầu tiên xuất hiện suy giảm hoặc lỗi, không giả định trước breakpoint.

Chụp `01-stress-plan-identity.png`.

### 00:25-01:10 — Review tree và flow parity

**Màn hình:** Mở lần lượt:

1. Setup validation.
2. `Measured Stress - Scenario C`.
3. CSV Data Set Config.
4. While Controller dùng flow-start deadline.
5. Auth Heavy, Read Heavy, Transactional Cart, Checkout và Order Lifecycle.
6. Chín HTTP samplers.
7. `Aggregate Report - Stress Listener`.
8. `View Results Tree - Debug Only - Disabled`.

**Lời thoại:**

> Stress plan giữ nguyên chín request của Scenario C từ Load plan. Mỗi flow login, đọc sản phẩm, thêm và kiểm tra cart, checkout, lấy orderId, đọc order pending, hủy đúng order và xác nhận trạng thái canceled. CSV không recycle và dừng thread khi hết dữ liệu. Aggregate Report được dành riêng cho Stress, khác với Summary Report của Load; View Results Tree bị tắt để tránh overhead.

Chụp:

- `02-stress-thread-group-and-csv.png`.
- `03-stress-scenario-tree.png`.
- `04-aggregate-enabled-tree-disabled.png`.

### 01:10-01:40 — Giải thích workload và ngưỡng

**Màn hình:** Hiển thị Test Plan comments/runtime properties, sau đó terminal có lệnh Run 02.

**Lời thoại:**

> Kết quả Load ở 10 VUs có zero error và end-to-end p95 38,35 mili giây. Vì vậy Stress test tăng tuyến tính lên 80 threads trong 240 giây, tương đương khoảng 20 thread mỗi phút, rồi quan sát khoảng 60 giây khi toàn bộ 80 thread đã được khởi tạo. Think-time giảm xuống 250 mili giây. Các tín hiệu suy giảm là HTTP error trên 1 phần trăm, business success dưới 99 phần trăm, end-to-end p95 trên 250 mili giây hoặc transaction p95 trên 100 mili giây.

Chụp `05-stress-runtime-contract.png`.

### 01:40-02:10 — Reset và provision

**Màn hình:** Chạy Stress Run 02 và chờ dòng provisioning hoàn tất.

**Lời thoại:**

> Runner khởi động lại backend để reset database, sau đó provision 80 account riêng. Provisioning là setup traffic và không nằm trong measured JTL. Runner cũng từ chối chạy nếu port 3000 đang bị một backend cũ chiếm giữ.

Chụp `06-provision-80-users.png` khi thấy `total=80`; không để credential xuất hiện.

### 02:10-03:20 — Progressive ramp và resource monitoring

**Màn hình:** Terminal console cùng Activity Monitor và terminal resource CSV. Ghi lại ít nhất hai thời điểm khác nhau trong ramp-up, ví dụ Active khoảng 20-40 và Active khoảng 60-80.

**Lời thoại:**

> JMeter đang chạy non-GUI và tăng thread theo progressive ramp. Trong cùng khung hình là Activity Monitor cho backend node và JMeter java, cùng resource CSV được lấy mẫu mỗi giây. Console cho biết Active, Started, Finished và error count. CPU của java là load-generator CPU, không được nhầm với CPU của backend node.

Chụp:

- `07-stress-running-mid-ramp.png`.
- `08-stress-running-high-band.png`.

Hai ảnh phải thấy JMeter terminal và resource monitor trong cùng frame.

### 03:20-04:10 — HTML dashboard và Aggregate Report

**Màn hình:** Sau khi hoàn tất, mở:

`results/html/stress/23127194_Stress_20260812_Run02/index.html`

Hiển thị Dashboard, Statistics, Active Threads Over Time, Response Times Over Time và Transactions per Second.

**Lời thoại:**

> Đây là dashboard được JMeter sinh từ raw JTL của Run 02. Tôi kiểm tra sample count, error percentage, throughput, percentile và đồ thị active threads. Những số liệu này chỉ được dùng cho Run 02, không sao chép từ measured Run 01.

Chụp:

- `09-stress-dashboard-overview.png`.
- `10-stress-statistics.png`.
- `11-active-threads-over-time.png`.
- `12-stress-response-time-chart.png`.

### 04:10-05:05 — Phân tích breakpoint theo band

**Màn hình:** Chạy `analyze_stress_jtl.py` với raw Run 02 và hiển thị kết quả bốn band.

**Lời thoại:**

> Breakpoint không được suy ra chỉ từ thời gian ramp-up. Script phân nhóm từng sample theo trường allThreads trong raw JTL: 1 đến 20, 21 đến 40, 41 đến 60 và 61 đến 80. Với mỗi band, tôi kiểm tra HTTP error rate, business success, end-to-end p95 và transaction p95. Nếu không band nào vượt ngưỡng, kết luận đúng là chưa quan sát breakpoint tới 80 active threads; 80 không phải capacity ceiling.

Chỉ phát biểu kết luận sau khi đối chiếu output thật của Run 02. Chụp `13-stress-band-analysis.png`.

### 05:05-05:35 — Business state, resource và kết luận

**Màn hình:** Hiển thị:

- `evidence/stress/23127194_Stress_20260812_Run02-order-state.txt`.
- Resource CSV có nhiều dòng.
- Tên raw JTL và HTML directory.

**Lời thoại:**

> Tôi kiểm tra total, canceled và non-canceled orders để xác nhận các flow kết thúc đầy đủ. Resource evidence, environment, order-state, raw JTL và HTML report đều dùng cùng Run 02 identity. Tôi chỉ công bố breakpoint hoặc resource value được chứng minh bởi các file này.

Chụp `14-stress-order-resource-artifacts.png`.

## 5. Danh sách screenshot Phase 3

| File | Nội dung bắt buộc |
| --- | --- |
| `01-stress-plan-identity.png` | Student ID, Stress filename và JMeter version/context |
| `02-stress-thread-group-and-csv.png` | Runtime properties và CSV isolation |
| `03-stress-scenario-tree.png` | Đủ năm transaction groups và chín HTTP samplers |
| `04-aggregate-enabled-tree-disabled.png` | Aggregate Report enabled; View Results Tree disabled |
| `05-stress-runtime-contract.png` | 80 threads, 240 s ramp, 300 s deadline, 250 ms think-time |
| `06-provision-80-users.png` | Provisioning `total=80`, không lộ password |
| `07-stress-running-mid-ramp.png` | Mid-ramp console và resource monitor cùng frame |
| `08-stress-running-high-band.png` | High-band console và resource monitor cùng frame |
| `09-stress-dashboard-overview.png` | Dashboard đúng Run 02 |
| `10-stress-statistics.png` | Samples, errors, throughput và percentiles |
| `11-active-threads-over-time.png` | Đường tăng active threads |
| `12-stress-response-time-chart.png` | Response time khi concurrency tăng |
| `13-stress-band-analysis.png` | Output phân tích 4 active-thread bands |
| `14-stress-order-resource-artifacts.png` | Order state và các artifact cùng Run 02 identity |

Lưu ảnh tại `evidence/screenshots/stress/`. Không sửa số liệu; chỉ crop và che dữ liệu riêng tư nếu cần.

## 6. Checklist sau khi quay

- [ ] Có narration tiếng Việt bằng giọng tester.
- [ ] JMeter và Activity Monitor/resource terminal cùng xuất hiện khi test chạy.
- [ ] Thấy rõ filename, Student ID, Aggregate Report và View Results Tree disabled.
- [ ] Không lộ password, JWT hoặc nội dung CSV cục bộ.
- [ ] Run 02 có raw JTL, HTML dashboard, resource, environment và order-state.
- [ ] Resource CSV có nhiều hơn một dòng header.
- [ ] Metric và breakpoint statement khớp chính xác Run 02.
- [ ] Phân tích band dùng raw JTL Run 02 và trường `allThreads`.
- [ ] Không gọi 80 threads là capacity ceiling nếu chưa đo failure point.
- [ ] Giữ nguyên bản quay và screenshot gốc.

## 7. Nếu Run 02 thất bại

Không xóa hoặc chỉnh raw evidence. Dừng phần kết luận và dùng identity mới:

```bash
RUN_SUFFIX=Run03 \
STRESS_THREADS=80 \
STRESS_RAMP_UP_SECONDS=240 \
STRESS_DURATION_SECONDS=300 \
STRESS_THINK_TIME_MS=250 \
scripts/run-measured-stress.sh
```

Chỉ chọn một run hoàn chỉnh và nhất quán làm evidence chính. Ghi rõ các run bị loại trừ cùng nguyên nhân trong báo cáo.
