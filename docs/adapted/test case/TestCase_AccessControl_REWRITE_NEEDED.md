# Test Case — Access Control (Auth/AuthZ) — KTPM

> Module: Auth & Access Control
>
> Mục tiêu: đảm bảo cơ chế đăng nhập và phân quyền (user/admin) hoạt động đúng, lỗi trả về “đúng cách”.

## 1) Phạm vi

- AuthN: `POST /api/login`
- AuthZ: các endpoint cần token/role (tuỳ cấu hình backend)
- JWT middleware: header `Authorization: Bearer <token>`

Giả định role:

- User thường: `R2`
- Admin: `R1`

## 2) Test data

- User hợp lệ: `user@example.com` / `P@ssw0rd123` (seed hoặc mock)
- Admin hợp lệ: `admin@example.com` / `Admin@123` (seed hoặc mock)

## 3) Bảng test case

| Test Case ID | Tiêu đề | Pre-conditions | Test Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-AUTH-01 | Login thành công (user) | Tồn tại user | 1) Gọi `POST /api/login` 2) Lưu token | email+password đúng | Trả `errCode=0` + có token/user |  |  |
| TC-AUTH-02 | Login sai mật khẩu | User tồn tại | Gọi `POST /api/login` với pass sai | pass sai | Trả lỗi rõ ràng (`errCode!=0` hoặc 4xx) |  |  |
| TC-AUTH-03 | Login thiếu email | - | Gọi login thiếu email | thiếu email | Trả lỗi validation |  |  |
| TC-AUTH-04 | Login thiếu password | - | Gọi login thiếu password | thiếu password | Trả lỗi validation |  |  |
| TC-AUTH-05 | Request không token bị chặn | Endpoint yêu cầu login | 1) Gọi endpoint cần token 2) Không set header | không token | 401/403 |  |  |
| TC-AUTH-06 | Token sai/expired bị chặn | Endpoint yêu cầu login | Gọi endpoint với token giả | token invalid | 401/403 |  |  |
| TC-AUTH-07 | User thường bị chặn ở admin endpoint | Có token role user | Gọi endpoint admin | token user | 403 |  |  |
| TC-AUTH-08 | Admin truy cập admin endpoint | Có token role admin | Gọi endpoint admin | token admin | 200 + response hợp lệ |  |  |

## 4) Gợi ý tự động hoá (mapping)

- Cypress (System/UI): login smoke `eCommerce_Reactjs/cypress/e2e/auth-login.cy.js`.
- Jest/Supertest (API/Contract): nên ưu tiên TC-AUTH-05..08 (missing token/role) vì ít flaky.
