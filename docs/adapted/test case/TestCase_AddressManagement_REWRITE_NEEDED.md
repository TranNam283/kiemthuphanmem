# Test Case — Address Management — KTPM

> Module: Address (địa chỉ giao hàng)
>
> Mục tiêu: đảm bảo user quản lý địa chỉ đúng và dữ liệu địa chỉ đủ điều kiện để checkout.

## 1) Phạm vi

Tuỳ theo backend routes, nhóm address thường có các thao tác:

- Tạo mới địa chỉ giao hàng (create)
- Cập nhật địa chỉ (update)
- Lấy danh sách địa chỉ theo user
- Chọn địa chỉ khi checkout

## 2) Test data

- User login
- Dữ liệu địa chỉ mẫu:
	- Họ tên: Nguyễn Văn A
	- SĐT: 09xxxxxxxx
	- Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM

## 3) Bảng test case

| Test Case ID | Tiêu đề | Pre-conditions | Test Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-ADDR-01 | Tạo địa chỉ hợp lệ | User login | Gọi API create address | name/phone/address hợp lệ | 200 + tạo thành công |  |  |
| TC-ADDR-02 | Tạo địa chỉ thiếu số điện thoại | User login | Create address thiếu phone | phone missing | 4xx/errCode validation |  |  |
| TC-ADDR-03 | Tạo địa chỉ số điện thoại sai format | User login | Create address với phone sai | phone="abc" | 4xx/errCode validation |  |  |
| TC-ADDR-04 | Cập nhật địa chỉ | User login + có addressId | Update address | addressId + address mới | 200 + dữ liệu cập nhật |  |  |
| TC-ADDR-05 | User không update địa chỉ người khác | User A login | Update addressId của user B | addressId khác owner | 403/404 |  |  |
| TC-ADDR-06 | Lấy danh sách địa chỉ theo user | User login | GET list address by user | userId | 200 + list |  |  |
| TC-ADDR-07 | Checkout yêu cầu có địa chỉ | User login + cart | Thực hiện checkout | không chọn address | UI báo lỗi hoặc backend reject |  |  |

## 4) Mapping automation

- Nếu có endpoint rõ ràng: ưu tiên integration DB-real cho TC-ADDR-01..06.
- Nếu UI checkout có chọn địa chỉ: thêm Cypress flow real backend (workflow manual/nightly).
