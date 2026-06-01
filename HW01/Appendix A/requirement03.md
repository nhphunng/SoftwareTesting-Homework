> From: https://gemini.google.com/u/1/app/618aade5c54da32a?pageId=none

# you asked

message time: 2026-06-01 10:59:44

Tôi đang làm bài tập software testing yêu cầu thực hiện testing một thiết bị trong nhà và tôi chọn bếp hồng ngoại. Bếp bao gồm những nút: Khóa, Hẹn giờ, giảm, tăng(nhiệt độ), chức năng để thay đổi chế độ nấu của bếp, bật/ tắt. Các chức năng bao gồm: hầm, nhiệt độ cao, nướng, giữ ấm, lẩu, xào. Bạn hãy đề xuất cho tôi 15 test case theo format Objective / Input / Steps / Expected / Actual / Verdict

---

# gemini response

Dưới đây là đề xuất 15 test case toàn diện cho thiết bị bếp hồng ngoại của bạn, bao gồm các kiểm thử chức năng cơ bản, kiểm thử giá trị biên và kiểm thử trạng thái logic (Khóa, Hẹn giờ). 

Để phù hợp với bài tập thiết kế test case, hai mục **Actual** và **Verdict** sẽ được để trống dưới dạng dòng chờ `...` để bạn điền vào khi chạy thực nghiệm.

---

### TC01: Kiểm tra tính năng Bật nguồn (Power On)
* **Objective:** Xác minh bếp hồng ngoại khởi động thành công và vào trạng thái chờ khi nhấn nút Bật/Tắt.
* **Input:** Nút "Bật/Tắt".
* **Steps:** 1. Cắm dây nguồn của bếp vào nguồn điện ổn định.
  2. Nhấn nút "Bật/Tắt" 1 lần.
* **Expected:** Đèn LED nền sáng lên, màn hình hiển thị trạng thái chờ (ví dụ: hiển thị dạng "- - - -" hoặc "0"), phát ra một tiếng bíp ngắn. Bếp chưa sinh nhiệt.
* **Actual:** ...
* **Verdict:** ...

---

### TC02: Kiểm tra tính năng Tắt nguồn (Power Off) từ trạng thái chờ
* **Objective:** Xác minh bếp tắt hoàn toàn khi nhấn nút Bật/Tắt khi đang ở chế độ chờ.
* **Input:** Nút "Bật/Tắt".
* **Steps:**
  1. Đảm bảo bếp đang ở trạng thái chờ (đã bật nguồn nhưng chưa chọn chế độ).
  2. Nhấn nút "Bật/Tắt" 1 lần.
* **Expected:** Màn hình hiển thị và tất cả các đèn LED tắt hẳn. Bếp ngừng hoạt động hoàn toàn.
* **Actual:** ...
* **Verdict:** ...

---

### TC03: Kích hoạt chức năng nấu mặc định (Chế độ Lẩu)
* **Objective:** Xác minh bếp kích hoạt đúng chế độ nấu và sinh nhiệt khi chọn một chức năng cụ thể.
* **Input:** Nút "Chức năng".
* **Steps:**
  1. Nhấn nút "Bật/Tắt" để bật bếp.
  2. Nhấn nút "Chức năng" cho đến khi đèn LED tại chữ "Lẩu" sáng lên.
* **Expected:** Đèn báo tại chữ "Lẩu" sáng, màn hình hiển thị mức nhiệt độ hoặc công suất mặc định của chế độ lẩu (ví dụ: 1200W hoặc 200°C), mặt bếp bắt đầu đỏ lên và sinh nhiệt.
* **Actual:** ...
* **Verdict:** ...

---

### TC04: Chuyển đổi vòng lặp tuần tự các chức năng nấu
* **Objective:** Xác minh nút "Chức năng" có thể chuyển đổi tuần tự và chính xác qua tất cả 6 chế độ nấu.
* **Input:** Nút "Chức năng".
* **Steps:**
  1. Bật bếp và nhấn nút "Chức năng" lần thứ nhất.
  2. Nhấn liên tục nút "Chức năng" thêm 5 lần nữa để kiểm tra thứ tự chuyển đổi.
* **Expected:** Mỗi lần nhấn, đèn LED chuyển đổi chính xác theo thứ tự: Hầm -> Nhiệt độ cao -> Nướng -> Giữ ấm -> Lẩu -> Xào. Lần nhấn cuối cùng sẽ quay vòng lại chức năng đầu tiên (Hầm).
* **Actual:** ...
* **Verdict:** ...

---

### TC05: Tăng nhiệt độ/công suất nấu
* **Objective:** Xác minh tính năng tăng nhiệt độ hoạt động chính xác khi nhấn nút "Tăng".
* **Input:** Nút "Tăng" (+).
* **Steps:**
  1. Bật bếp và chọn chức năng "Lẩu" (ở mức mặc định).
  2. Nhấn nút "Tăng" (+) 1 lần.
* **Expected:** Mức nhiệt độ/công suất hiển thị trên màn hình tăng lên 1 nấc (ví dụ: từ 1200W lên 1400W), bếp sinh nhiệt mạnh hơn.
* **Actual:** ...
* **Verdict:** ...

---

### TC06: Giảm nhiệt độ/công suất nấu
* **Objective:** Xác minh tính năng giảm nhiệt độ hoạt động chính xác khi nhấn nút "Giảm".
* **Input:** Nút "Giảm" (-).
* **Steps:**
  1. Bật bếp và chọn chức năng "Lẩu".
  2. Nhấn nút "Giảm" (-) 1 lần.
* **Expected:** Mức nhiệt độ/công suất hiển thị trên màn hình giảm xuống 1 nấc (ví dụ: từ 1200W xuống 1000W), bếp giảm độ sinh nhiệt.
* **Actual:** ...
* **Verdict:** ...

---

### TC07: Kiểm tra biên giá trị nhiệt độ tối đa (Max Boundary)
* **Objective:** Xác minh hệ thống không cho phép tăng nhiệt độ vượt quá giới hạn tối đa của bếp.
* **Input:** Nút "Tăng" (+).
* **Steps:**
  1. Bật bếp và chọn chức năng "Nhiệt độ cao".
  2. Nhấn nút "Tăng" liên tục cho đến khi màn hình đạt mức tối đa (ví dụ: 2200W hoặc 270°C).
  3. Nhấn tiếp nút "Tăng" thêm 1 lần nữa.
* **Expected:** Màn hình giữ nguyên ở giá trị tối đa, không tăng thêm. Có thể phát ra tiếng bíp cảnh báo tùy theo thiết kế của bo mạch.
* **Actual:** ...
* **Verdict:** ...

---

### TC08: Kiểm tra biên giá trị nhiệt độ tối thiểu (Min Boundary)
* **Objective:** Xác minh hệ thống không cho phép giảm nhiệt độ xuống dưới giới hạn tối thiểu của bếp.
* **Input:** Nút "Giảm" (-).
* **Steps:**
  1. Bật bếp và chọn chức năng "Giữ ấm".
  2. Nhấn nút "Giảm" liên tục cho đến khi màn hình đạt mức tối thiểu (ví dụ: 200W hoặc 60°C).
  3. Nhấn tiếp nút "Giảm" thêm 1 lần nữa.
* **Expected:** Màn hình giữ nguyên ở giá trị tối thiểu, không giảm thêm.
* **Actual:** ...
* **Verdict:** ...

---

### TC09: Kích hoạt chức năng Khóa an toàn (Child Lock)
* **Objective:** Xác minh tính năng khóa an toàn được kích hoạt thành công để bảo vệ thiết bị.
* **Input:** Nút "Khóa".
* **Steps:**
  1. Bật bếp và chọn một chức năng nấu bất kỳ (ví dụ: Xào).
  2. Nhấn và giữ nút "Khóa" trong khoảng 3 giây.
* **Expected:** Đèn báo hiệu "Khóa" sáng lên, có tiếng bíp xác nhận kích hoạt thành công chế độ Khóa.
* **Actual:** ...
* **Verdict:** ...

---

### TC10: Kiểm tra vô hiệu hóa nút bấm khi đang trong trạng thái Khóa
* **Objective:** Xác minh các nút bấm khác bị vô hiệu hóa hoàn toàn khi chế độ Khóa đang hoạt động (Ngoại trừ nút Tắt nguồn khẩn cấp tùy thiết kế, thông thường khóa toàn bộ).
* **Input:** Các nút "Tăng", "Giảm", "Chức năng", "Hẹn giờ".
* **Steps:**
  1. Kích hoạt chức năng Khóa (như TC09).
  2. Nhấn lần lượt các nút: "Tăng", "Giảm", "Chức năng", "Hẹn giờ".
* **Expected:** Bếp hoàn toàn không phản hồi, không có tiếng bíp điều khiển, nhiệt độ và chế độ nấu trên màn hình giữ nguyên không đổi.
* **Actual:** ...
* **Verdict:** ...

---

### TC11: Hủy kích hoạt chức năng Khóa an toàn
* **Objective:** Xác minh bếp có thể mở khóa thành công để trở lại trạng thái điều khiển bình thường.
* **Input:** Nút "Khóa".
* **Steps:**
  1. Đảm bảo bếp đang ở trạng thái Khóa (đèn Khóa đang sáng).
  2. Nhấn và giữ nút "Khóa" trong 3 giây.
* **Expected:** Đèn báo hiệu "Khóa" tắt, phát ra tiếng bíp ngắn. Các nút bấm khác ("Tăng", "Giảm"...) hoạt động bình thường trở lại.
* **Actual:** ...
* **Verdict:** ...

---

### TC12: Cài đặt thời gian Hẹn giờ nấu (Set Timer)
* **Objective:** Xác minh tính năng thiết lập thời gian đếm ngược hoạt động đúng.
* **Input:** Nút "Hẹn giờ", nút "Tăng" (+).
* **Steps:**
  1. Bật bếp, chọn chế độ "Hầm".
  2. Nhấn nút "Hẹn giờ" 1 lần.
  3. Nhấn nút "Tăng" để điều chỉnh thời gian thành 05 phút.
* **Expected:** Màn hình hiển thị số "05" nhấp nháy, sau đó đèn báo hẹn giờ sáng ổn định. Màn hình bắt đầu chuyển đổi hiển thị luân phiên giữa mức nhiệt độ và thời gian đếm ngược.
* **Actual:** ...
* **Verdict:** ...

---

### TC13: Bếp tự động tắt khi hết thời gian Hẹn giờ (Timer Expiration)
* **Objective:** Xác minh bếp tự ngắt sinh nhiệt an toàn khi thời gian hẹn giờ đếm ngược về 0.
* **Input:** Thời gian đếm ngược tự động.
* **Steps:**
  1. Thực hiện cài đặt hẹn giờ ở mức thời gian thấp nhất (ví dụ: 1 phút) tại chế độ "Giữ ấm".
  2. Chờ cho đến khi thời gian đếm ngược về mức "00".
* **Expected:** Bếp phát ra âm thanh cảnh báo kéo dài (bíp bíp), ngừng sinh nhiệt ngay lập tức và chuyển về trạng thái tắt hoặc chờ an toàn.
* **Actual:** ...
* **Verdict:** ...

---

### TC14: Thay đổi chức năng nấu khi đang chạy Hẹn giờ
* **Objective:** Kiểm tra xem hệ thống xử lý thế nào khi thay đổi chế độ nấu trong lúc bộ hẹn giờ đang hoạt động.
* **Input:** Nút "Chức năng".
* **Steps:**
  1. Bật bếp, chọn chế độ "Lẩu", cài hẹn giờ 10 phút.
  2. Sau khi bếp chạy được 1 phút, nhấn nút "Chức năng" để chuyển sang chế độ "Nướng".
* **Expected:** Đèn chế độ chuyển sang "Nướng" với nhiệt độ mặc định của chế độ nướng. Bộ đếm thời gian hẹn giờ vẫn được giữ nguyên và tiếp tục đếm ngược từ phút thứ 9 (không bị xóa).
* **Actual:** ...
* **Verdict:** ...

---

### TC15: Tắt bếp khi đang hoạt động ở công suất cao và có hẹn giờ (Tắt khẩn cấp)
* **Objective:** Xác minh nút Bật/Tắt có quyền ưu tiên cao nhất, có thể ngắt toàn bộ hoạt động của bếp ngay lập tức.
* **Input:** Nút "Bật/Tắt".
* **Steps:**
  1. Bật bếp, chọn chế độ "Nhiệt độ cao", tăng lên mức tối đa, cài hẹn giờ 30 phút.
  2. Khi bếp đang rất nóng, nhấn nút "Bật/Tắt" 1 lần.
* **Expected:** Bếp lập tức ngắt mạch sinh nhiệt, xóa toàn bộ thiết lập hẹn giờ, màn hình hiển thị cảnh báo mặt bếp nóng (ví dụ chữ "H" - Hot) và quạt tản nhiệt của bếp vẫn tiếp tục quay để làm mát linh kiện (đúng nguyên lý an toàn của bếp hồng ngoại).
* **Actual:** ...
* **Verdict:** ...

---

# you asked

message time: 2026-06-01 11:09:45

Chuyển tất cả sang tiếng anh

---

# gemini response

Here is the complete set of 15 test cases for the infrared stove translated into English, maintaining the exact format requested for your assignment.

---

### TC01: Power On Test
* **Objective:** Verify that the infrared stove turns on successfully and enters standby mode when pressing the Power button.
* **Input:** "Power (On/Off)" button.
* **Steps:** 
  1. Plug the stove's power cord into a stable power source.
  2. Press the "Power" button once.
* **Expected:** The LED backlight turns on, the screen displays the standby status (e.g., "- - - -" or "0"), and a short beep sounds. The stove does not generate heat yet.
* **Actual:** ...
* **Verdict:** ...

---

### TC02: Power Off Test from Standby Mode
* **Objective:** Verify that the stove turns off completely when pressing the Power button while in standby mode.
* **Input:** "Power (On/Off)" button.
* **Steps:**
  1. Ensure the stove is in standby mode (powered on but no cooking mode selected).
  2. Press the "Power" button once.
* **Expected:** The display screen and all LED lights turn off completely. The stove stops operating entirely.
* **Actual:** ...
* **Verdict:** ...

---

### TC03: Activate Default Cooking Mode (Hotpot Mode)
* **Objective:** Verify that the stove activates the correct cooking mode and generates heat when a specific function is selected.
* **Input:** "Function" button.
* **Steps:**
  1. Press the "Power" button to turn on the stove.
  2. Press the "Function" button until the LED indicator for "Hotpot" lights up.
* **Expected:** The "Hotpot" LED indicator lights up, the screen displays the default temperature or power level for hotpot (e.g., 1200W or 200°C), and the stove surface begins to glow red and generate heat.
* **Actual:** ...
* **Verdict:** ...

---

### TC04: Sequential Loop of Cooking Functions
* **Objective:** Verify that the "Function" button can switch sequentially and accurately through all 6 cooking modes.
* **Input:** "Function" button.
* **Steps:**
  1. Turn on the stove and press the "Function" button for the first time.
  2. Press the "Function" button 5 more times continuously to check the transition order.
* **Expected:** Each press accurately cycles the LED through the order: Stew -> High Heat -> Grill -> Keep Warm -> Hotpot -> Stir-fry. The final press loops back to the first function (Stew).
* **Actual:** ...
* **Verdict:** ...

---

### TC05: Increase Temperature/Power Level
* **Objective:** Verify that the temperature increase feature works correctly when pressing the "Increase" button.
* **Input:** "Increase" (+) button.
* **Steps:**
  1. Turn on the stove and select the "Hotpot" function (at default level).
  2. Press the "Increase" (+) button once.
* **Expected:** The temperature/power level displayed on the screen increases by 1 step (e.g., from 1200W to 1400W), and the stove generates more heat.
* **Actual:** ...
* **Verdict:** ...

---

### TC06: Decrease Temperature/Power Level
* **Objective:** Verify that the temperature decrease feature works correctly when pressing the "Decrease" button.
* **Input:** "Decrease" (-) button.
* **Steps:**
  1. Turn on the stove and select the "Hotpot" function.
  2. Press the "Decrease" (-) button once.
* **Expected:** The temperature/power level displayed on the screen decreases by 1 step (e.g., from 1200W down to 1000W), and the stove reduces heat generation.
* **Actual:** ...
* **Verdict:** ...

---

### TC07: Maximum Temperature Boundary Test (Max Boundary)
* **Objective:** Verify that the system does not allow the temperature to exceed the stove's maximum limit.
* **Input:** "Increase" (+) button.
* **Steps:**
  1. Turn on the stove and select the "High Heat" function.
  2. Continuously press the "Increase" button until the screen reaches the maximum level (e.g., 2200W or 270°C).
  3. Press the "Increase" button one more time.
* **Expected:** The screen remains at the maximum value and does not increase further. A warning beep may sound depending on the circuit board design.
* **Actual:** ...
* **Verdict:** ...

---

### TC08: Minimum Temperature Boundary Test (Min Boundary)
* **Objective:** Verify that the system does not allow the temperature to drop below the stove's minimum limit.
* **Input:** "Decrease" (-) button.
* **Steps:**
  1. Turn on the stove and select the "Keep Warm" function.
  2. Continuously press the "Decrease" button until the screen reaches the minimum level (e.g., 200W or 60°C).
  3. Press the "Decrease" button one more time.
* **Expected:** The screen remains at the minimum value and does not decrease further.
* **Actual:** ...
* **Verdict:** ...

---

### TC09: Activate Child Lock Function
* **Objective:** Verify that the child lock feature is successfully activated to protect the device.
* **Input:** "Lock" button.
* **Steps:**
  1. Turn on the stove and select any cooking function (e.g., Stir-fry).
  2. Press and hold the "Lock" button for about 3 seconds.
* **Expected:** The "Lock" indicator LED lights up, and a beep sounds to confirm the successful activation of Lock mode.
* **Actual:** ...
* **Verdict:** ...

---

### TC10: Button Disabling Verification in Lock State
* **Objective:** Verify that other buttons are completely disabled while Lock mode is active.
* **Input:** "Increase", "Decrease", "Function", "Timer" buttons.
* **Steps:**
  1. Activate the Lock function (as in TC09).
  2. Press the "Increase", "Decrease", "Function", and "Timer" buttons one by one.
* **Expected:** The stove does not respond at all, no control beep sounds, and the temperature and cooking mode on the screen remain unchanged.
* **Actual:** ...
* **Verdict:** ...

---

### TC11: Deactivate Child Lock Function
* **Objective:** Verify that the stove can be unlocked successfully to return to normal control status.
* **Input:** "Lock" button.
* **Steps:**
  1. Ensure the stove is in Lock state (Lock LED is on).
  2. Press and hold the "Lock" button for 3 seconds.
* **Expected:** The "Lock" indicator LED turns off, emitting a short beep. Other buttons ("Increase", "Decrease"...) resume normal operation.
* **Actual:** ...
* **Verdict:** ...

---

### TC12: Set Cooking Timer
* **Objective:** Verify that the countdown timer setup feature works correctly.
* **Input:** "Timer" button, "Increase" (+) button.
* **Steps:**
  1. Turn on the stove, select the "Stew" mode.
  2. Press the "Timer" button once.
  3. Press the "Increase" button to adjust the time to 05 minutes.
* **Expected:** The screen displays a flashing "05", then the timer indicator lights up steadily. The screen begins to alternate between displaying the temperature level and the countdown time.
* **Actual:** ...
* **Verdict:** ...

---

### TC13: Auto-shutdown on Timer Expiration
* **Objective:** Verify that the stove safely cuts off heat generation when the countdown timer reaches 0.
* **Input:** Automatic countdown timer.
* **Steps:**
  1. Set the timer to the lowest possible time (e.g., 1 minute) under "Keep Warm" mode.
  2. Wait for the countdown timer to reach "00".
* **Expected:** The stove emits a continuous warning sound (beep beep), immediately stops generating heat, and switches to a safe off or standby state.
* **Actual:** ...
* **Verdict:** ...

---

### TC14: Change Cooking Function While Timer is Running
* **Objective:** Check how the system handles a change in cooking mode while the timer is actively counting down.
* **Input:** "Function" button.
* **Steps:**
  1. Turn on the stove, select "Hotpot" mode, set the timer for 10 minutes.
  2. After the stove runs for 1 minute, press the "Function" button to switch to "Grill" mode.
* **Expected:** The mode indicator switches to "Grill" with the default temperature of grill mode. The countdown timer remains intact and continues to count down from the 9th minute (it is not cleared).
* **Actual:** ...
* **Verdict:** ...

---

### TC15: Turn Off Stove During High-Power Operation with Active Timer (Emergency Off)
* **Objective:** Verify that the Power button has the highest priority and can immediately shut down all operations of the stove.
* **Input:** "Power (On/Off)" button.
* **Steps:**
  1. Turn on the stove, select "High Heat" mode, increase to the maximum level, set the timer for 30 minutes.
  2. While the stove is very hot, press the "Power" button once.
* **Expected:** The stove immediately cuts off the heating circuit, clears all timer settings, and displays a hot surface warning on the screen (e.g., "H" for Hot). The cooling fan continues to run to cool down internal components safely.
* **Actual:** ...
* **Verdict:** ...