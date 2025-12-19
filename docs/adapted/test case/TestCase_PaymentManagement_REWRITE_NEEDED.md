# Test Case — Payment Management — KTPM

> Module: Payment/Checkout
>
> Mục tiêu: kiểm tra lựa chọn phương thức thanh toán và các ràng buộc ở bước checkout.

## 1) Phạm vi

- Checkout UI (frontend): chọn phương thức thanh toán, hiển thị tổng tiền.
- Backend order create: `POST /api/create-new-order` có field paymentMethod (nếu có).

Ghi chú: nếu dự án chưa tích hợp gateway thanh toán thật, các test “online payment callback” được đánh dấu planned.

## 2) Test data

- Giỏ hàng có 1–2 sản phẩm, quantity hợp lệ.
- Ship fee cố định (hoặc lấy từ typeship).

## 3) Bảng test case

| Test Case ID | Tiêu đề                                     | Pre-conditions       | Test Steps        | Test Data             | Expected Result                        | Actual Result | Status |
| ------------ | ------------------------------------------- | -------------------- | ----------------- | --------------------- | -------------------------------------- | ------------- | ------ |
| TC-PAY-01    | Checkout chọn COD và đặt hàng               | User login + có cart | Chọn COD → submit | paymentMethod=COD     | Order tạo thành công                   |               |        |
| TC-PAY-02    | Không chọn payment method (nếu bắt buộc)    | User login + có cart | Submit không chọn | paymentMethod missing | UI báo lỗi hoặc backend reject         |               |        |
| TC-PAY-03    | Tổng tiền hiển thị đúng                     | User login + có cart | Mở checkout       | items + shipFee       | Total = sum + ship - discount (nếu có) |               |        |
| TC-PAY-04    | Thay đổi phương thức thanh toán cập nhật UI | User login           | Chọn method khác  | COD/ONLINE            | UI cập nhật đúng label/fee             |               |        |
| TC-PAY-05    | Online payment callback (planned)           | Gateway configured   | giả lập callback  | payload callback      | Order status cập nhật đúng             |               | ⏳     |

## 4) Mapping automation

- Hiện tại ưu tiên: TC-PAY-01..03 ở mức System/Integration.
- Nếu có gateway thật: tách workflow riêng (manual/nightly) để tránh flaky.
