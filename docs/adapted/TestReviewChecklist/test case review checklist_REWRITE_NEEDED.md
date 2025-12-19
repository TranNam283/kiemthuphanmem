# Test Case Review Checklist (KTPM)

> Mục tiêu: checklist để nhóm review test case trước khi “đóng” (freeze) và trước khi chuyển sang automation.

## 1) Checklist nội dung test case

| ID | Hạng mục kiểm | Đạt/Không | Ghi chú |
| --- | --- | --- | --- |
| CL-01 | Test case có ID duy nhất, đặt theo module (VD: TC-CART-01) |  |  |
| CL-02 | Tiêu đề rõ ràng, mô tả đúng mục tiêu kiểm thử |  |  |
| CL-03 | Preconditions đầy đủ (role, login, data seed, env) |  |  |
| CL-04 | Steps có thể làm theo, không mơ hồ |  |  |
| CL-05 | Test data cụ thể (giá trị, id, quantity, email…) |  |  |
| CL-06 | Expected result kiểm được (status code, message, UI text, DB change) |  |  |
| CL-07 | Có ít nhất 1 negative case cho mỗi luồng quan trọng |  |  |
| CL-08 | Có boundary/edge case cho input quan trọng (quantity, limit/offset) |  |  |
| CL-09 | Có testcase Auth/AuthZ cho endpoint cần token/role |  |  |
| CL-10 | Không phụ thuộc dữ liệu “mơ hồ” (VD: “sản phẩm bất kỳ”) nếu muốn automation |  |  |

## 2) Checklist truy vết (Traceability)

| ID | Hạng mục kiểm | Đạt/Không | Ghi chú |
| --- | --- | --- | --- |
| TR-01 | Test case map được sang Scenario (TS-*) |  |  |
| TR-02 | Test case map được sang endpoint/UI screen cụ thể |  |  |
| TR-03 | Có chỉ ra mức kiểm thử (Unit/Integration/System/Acceptance) |  |  |
| TR-04 | Nếu đã tự động hoá: có link file test thực tế |  |  |
| TR-05 | Nếu chưa tự động hoá: ghi rõ lý do + kế hoạch (planned) |  |  |

## 3) Checklist chất lượng automation (nếu có)

| ID | Hạng mục kiểm | Đạt/Không | Ghi chú |
| --- | --- | --- | --- |
| AU-01 | Test chạy lặp lại được trên CI (không cần thao tác tay) |  |  |
| AU-02 | Giảm flaky: tránh phụ thuộc network ngoài/clock không kiểm soát |  |  |
| AU-03 | Có log/artifact khi fail (screenshot/video/log tail) |  |  |
| AU-04 | Không hardcode secrets/token thật trong repo |  |  |

## 4) Review theo module (gợi ý)

- Auth: login negative + token missing/invalid.
- Product: list/detail + filter/sort + keyword có dấu/space.
- Cart: add/view/delete + quantity boundary.
- Order: create order + trạng thái/validation.
- Address: create/update + validate phone/address.
