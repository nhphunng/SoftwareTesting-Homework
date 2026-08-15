# Kịch bản quay và chụp màn hình Phase 2 - Load Test

## 1. Mục tiêu evidence

Quay một đoạn khoảng **3-4 phút** cho riêng Phase 2 để ghép vào video HW05 tối thiểu 6 phút. Video phải chứng minh:

- Người thực hiện dùng JMeter 5.6.3 và plan `23127194_Load_20260812.jmx`.
- Final JMeter tree đã được review trước khi chạy.
- Scenario C gồm auth-heavy, read-heavy và transactional endpoints.
- Measured workload dùng 10 VUs, ramp-up 20 giây, deadline 140 giây và think-time 500 ms.
- Backend được reset và provision đủ 10 tài khoản trước measured traffic.
- JMeter và resource monitor xuất hiện **trong cùng một khung hình** khi test đang chạy.
- Kết quả được đọc từ raw JTL/HTML dashboard thật, không từ số liệu nhập tay.

Run 01 đã đạt các threshold nhưng resource CSV chỉ có header. Vì vậy, dùng **Run 02** cho đoạn quay/resource evidence và giữ nguyên Run 01 để bảo toàn lịch sử.

## 2. Chuẩn bị trước khi bấm Record

1. Đóng email, chat, password manager và notification có dữ liệu riêng tư.
2. Không mở `data/scenario-c.local.csv`; file chứa password cục bộ.
3. Mở bốn cửa sổ và sắp xếp:
   - Góc trái trên: JMeter GUI với final tree.
   - Góc phải trên: Activity Monitor, tìm `node` và `java`.
   - Góc trái dưới: terminal chạy measured test.
   - Góc phải dưới: terminal phụ để theo dõi console/resource file.
4. Đặt zoom JMeter/terminal đủ lớn để đọc được Student ID, filename và thông số.
5. Bật Do Not Disturb và kiểm tra microphone.
6. Tạo trước thư mục screenshot:

   ```bash
   mkdir -p evidence/screenshots/load
   ```

## 3. Lệnh dùng trong video

### Mở final plan để giới thiệu tree

```bash
jmeter -t /Users/nguyenhoangphihung/Document/ky_3/SoftwareTesting-Homework/HW05/tests/23127194_Load_20260812.jmx
```

Không bấm nút Start trong GUI. Measured execution phải chạy non-GUI.

### Chạy Run 02 mà không ghi đè Run 01

Từ thư mục `HW05`:

```bash
RUN_SUFFIX=Run02 scripts/run-measured-load.sh
```

Runner tự lấy password từ CSV cục bộ, không in password ra màn hình; reset backend, provision 10 users, chạy JMeter và lưu evidence với hậu tố `Run02`.

### Theo dõi trong terminal phụ

```bash
tail -f results/raw/load/23127194_Load_20260812_Run02.console.log
```

Sau khi test bắt đầu, có thể mở terminal phụ khác:

```bash
tail -f evidence/load/23127194_Load_20260812_Run02-resources.csv
```

## 4. Timeline và lời thoại gợi ý

### 00:00-00:25 — Nhận diện bài test

**Màn hình:** JMeter GUI, tên file và Test Plan được nhìn thấy.

**Lời thoại:**

> Đây là Phase 2 Load Testing của bài HW05, Student ID 23127194. Công cụ sử dụng là Apache JMeter 5.6.3. Scenario được chọn là Scenario C — checkout sau đó hủy đúng order vừa tạo. File chính thức là 23127194_Load_20260812.jmx.

Chụp `01-final-plan-identity.png` ở đoạn này.

### 00:25-01:10 — Review JMeter tree

**Màn hình:** Mở lần lượt các node, không hiển thị giá trị password:

1. `Validate required load properties and CSV capacity`.
2. `Measured Load - Scenario C`.
3. `Scenario C Dedicated Users`.
4. `Start New Flow Only Before Reviewed Deadline`.
5. Các Transaction Controller và 9 HTTP sampler.
6. `Summary Report - Human Approved Load Listener`.
7. `View Results Tree - Debug Only - Disabled`.

**Lời thoại:**

> Plan nhận workload qua runtime properties và không có workload mặc định ẩn. CSV không recycle và dừng thread khi hết dữ liệu, giúp mỗi concurrent thread dùng một account riêng. Luồng gồm login và JWT extraction, product search/detail, cart, checkout, lấy orderId, đọc order pending, hủy đúng orderId và xác nhận trạng thái canceled. Summary Report được dùng cho Load; View Results Tree bị tắt khi chạy measured test.

Chụp:

- `02-thread-group-and-csv.png`.
- `03-scenario-c-tree.png`.
- `04-summary-enabled-tree-disabled.png`.

### 01:10-01:40 — Khởi chạy và provisioning

**Màn hình:** Terminal chạy `RUN_SUFFIX=Run02 scripts/run-measured-load.sh`.

**Lời thoại:**

> Backend reset toàn bộ database mỗi lần khởi động, nên runner provision lại 10 user trước khi bắt đầu measured traffic. Registration là setup traffic và không được ghi vào JTL. Run này sử dụng 10 VUs, ramp-up 20 giây, thời gian giữ tải đầy đủ 120 giây trong deadline 140 giây, và think-time 500 mili giây.

Chụp `05-provision-10-users.png` sau dòng `Provisioning complete`, bảo đảm màn hình không có password.

### 01:40-02:30 — Test đang chạy cùng resource monitor

**Màn hình:** Giữ terminal JMeter và Activity Monitor cùng hiện rõ. Activity Monitor hiển thị `node` và `java`; terminal phụ hiển thị resource CSV đang có nhiều dòng.

**Lời thoại:**

> Đây là measured execution ở non-GUI mode. JMeter và resource monitor đang xuất hiện trong cùng một frame theo yêu cầu evidence. Tôi theo dõi số active threads, error count, CPU và bộ nhớ trong khi tải đang chạy. Tôi không dùng View Results Tree vì listener này gây overhead và không phù hợp với measured load.

Chụp `06-running-jmeter-and-resource-monitor.png`. Đây là ảnh quan trọng nhất của Phase 2.

### 02:30-03:20 — Kết quả thật

**Màn hình:** Sau khi runner báo hoàn tất, mở:

`results/html/load/23127194_Load_20260812_Run02/index.html`

Hiển thị Dashboard, Statistics và Response Times Over Time.

**Lời thoại:**

> Đây là HTML dashboard do JMeter sinh từ raw JTL của Run 02. Tôi đánh giá bốn tiêu chí đã duyệt: HTTP error rate không vượt quá 1%, business-flow success tối thiểu 99%, end-to-end p95 không vượt quá 250 mili giây, và p95 của từng transaction không vượt quá 100 mili giây. Các số liệu tôi nêu ở báo cáo sẽ được lấy trực tiếp từ raw JTL và statistics.json của chính run này.

Không đọc lại số của Run 01 như thể chúng là Run 02. Chỉ nói số Run 02 sau khi đã kiểm tra file thật.

Chụp:

- `07-html-dashboard-overview.png`.
- `08-html-statistics.png` — nhìn rõ Error %, Throughput và percentile.
- `09-response-time-chart.png`.

### 03:20-03:45 — Business state và kết luận

**Màn hình:** Mở file:

`evidence/load/23127194_Load_20260812_Run02-order-state.txt`

Sau đó cho thấy raw JTL và tên thư mục HTML trong Finder hoặc terminal, không mở CSV credential.

**Lời thoại:**

> Sau run, tôi kiểm tra số order canceled và non-canceled để chứng minh checkout và cancel hoàn tất cùng một business flow. Raw JTL được giữ nguyên, HTML report nằm trong thư mục riêng của Run 02, và resource data được gắn cùng run identity. Kết quả này chỉ kết luận cho workload 10 VUs, không được xem là capacity ceiling của hệ thống.

Chụp `10-order-state-and-artifact-paths.png`.

## 5. Checklist ảnh Phase 2

| File đề xuất | Nội dung bắt buộc |
| --- | --- |
| `01-final-plan-identity.png` | Student ID, filename và JMeter GUI |
| `02-thread-group-and-csv.png` | Thread Group, runtime properties, CSV controls; không lộ password |
| `03-scenario-c-tree.png` | Đủ nhóm Auth, Read, Cart, Checkout, Order Lifecycle |
| `04-summary-enabled-tree-disabled.png` | Summary Report enabled và View Results Tree disabled |
| `05-provision-10-users.png` | `created/reused/total=10`, không có credential |
| `06-running-jmeter-and-resource-monitor.png` | JMeter terminal và Activity Monitor trong cùng frame |
| `07-html-dashboard-overview.png` | Dashboard đúng Run 02 |
| `08-html-statistics.png` | Samples, Error %, Throughput, p95/p99 |
| `09-response-time-chart.png` | Biểu đồ response time có tên run/đường thời gian |
| `10-order-state-and-artifact-paths.png` | Total/canceled/non-canceled và đường dẫn raw report |

Lưu tất cả vào `evidence/screenshots/load/`. Không chỉnh sửa số liệu trên ảnh; chỉ crop vùng dư thừa và che dữ liệu riêng tư nếu lỡ xuất hiện.

## 6. Kiểm tra sau khi quay

- [ ] Video nghe rõ giọng tiếng Việt của tester.
- [ ] JMeter và resource monitor xuất hiện cùng frame khi test chạy.
- [ ] Filename, Student ID và Scenario C đọc được.
- [ ] Không lộ password, JWT hoặc nội dung `scenario-c.local.csv`.
- [ ] Run 02 có raw JTL, HTML dashboard, environment, resource CSV và order-state file.
- [ ] Resource CSV có nhiều hơn một dòng header trước khi dùng làm evidence.
- [ ] Các metric trong lời thoại khớp chính xác Run 02.
- [ ] Không gọi baseline, dry run hoặc Run 01 resource CSV là evidence của Run 02.
- [ ] Giữ video gốc và ảnh gốc; chỉ dùng bản sao khi biên tập.

## 7. Nếu Run 02 thất bại

Không xóa hoặc sửa raw artifact. Dừng quay phần kết luận, ghi nhận đúng lỗi và dùng hậu tố mới cho lần kế tiếp, ví dụ:

```bash
RUN_SUFFIX=Run03 scripts/run-measured-load.sh
```

Chỉ chọn một run hoàn chỉnh có JTL, HTML report, resource samples và order-state khớp nhau làm evidence chính.
