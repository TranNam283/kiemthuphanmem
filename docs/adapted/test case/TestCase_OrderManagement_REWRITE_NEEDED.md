# Test Case — Order Management — KTPM

> Module: Order
>
> Mục tiêu: đảm bảo tạo đơn hàng đúng, tính tổng tiền đúng, validate dữ liệu và trạng thái order.

## 1) Phạm vi

- `POST /api/create-new-order`
- (tuỳ) `GET /api/get-order-by-userId`, `GET /api/get-detail-order-by-id`
- (tuỳ admin) cập nhật trạng thái đơn.

## 2) Test data

- User login + có cart items hoặc payload items.
- Địa chỉ giao hàng hợp lệ.
- Phương thức thanh toán: COD (mặc định).

## 3) Bảng test case

| Test Case ID | Tiêu đề                                 | Pre-conditions               | Test Steps            | Test Data                     | Expected Result                   | Actual Result | Status |
| ------------ | --------------------------------------- | ---------------------------- | --------------------- | ----------------------------- | --------------------------------- | ------------- | ------ |
| TC-ORDER-01  | Tạo đơn hàng COD thành công             | User login + có item         | POST create-new-order | items + address + payment=COD | 200 + `errCode=0` + orderId       |               |        |
| TC-ORDER-02  | Tạo đơn hàng thiếu items                | User login                   | POST thiếu items      | items=[]                      | 4xx/errCode validation            |               |        |
| TC-ORDER-03  | Tạo đơn hàng thiếu địa chỉ              | User login                   | POST thiếu address    | address null                  | 4xx/errCode validation            |               |        |
| TC-ORDER-04  | Tạo đơn hàng khi chưa login             | -                            | POST create           | -                             | 401/403                           |               |        |
| TC-ORDER-05  | Tổng tiền = sum(item) + ship - discount | User login + có ship/voucher | POST create           | items + shipFee + voucher     | total tính đúng (nếu response có) |               |        |
| TC-ORDER-06  | Xem danh sách đơn theo user             | User login                   | GET orders by userId  | userId                        | 200 + list                        |               |        |
| TC-ORDER-07  | User không xem được order user khác     | User A login                 | GET order của user B  | orderId khác owner            | 403/404                           |               |        |
| TC-ORDER-08  | Admin cập nhật trạng thái order         | Admin login                  | Update status         | orderId + status              | 200 + status đổi đúng             |               |        |

## 4) Mapping automation

- Backend integration/DB-real: khuyến nghị tự động hoá TC-ORDER-01..04 để đảm bảo luồng order chạy thật với MySQL.
- Cypress (tuỳ chọn real E2E): nếu chạy docker-compose, có thể test `visit /shopcart -> checkout`.
