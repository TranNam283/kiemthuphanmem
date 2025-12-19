# Test Scenario (KTPM) — Danh sách scenario mức cao

> Dự án: KTPM eCommerce (web bán quần áo) — React + Node.js + MySQL
>
> Mục tiêu: tạo danh sách **scenario mức cao** để truy vết sang test case chi tiết và test automation (Jest/Supertest/Cypress/k6).

## 1) Quy ước ID và phạm vi

- Scenario ID: `TS-<MODULE>-NN`
- MODULE: `AUTH`, `PROD`, `CART`, `ORDER`, `ADDR`, `PAY`, `ADMIN`, `PERF`
- NN: 01, 02, ...

Phạm vi scenario tập trung vào:

- Luồng người dùng (User): đăng nhập → xem sản phẩm → thêm giỏ → đặt hàng
- Luồng quản trị (Admin): quản lý sản phẩm/đơn hàng (mức tối thiểu)
- Phi chức năng: hiệu năng (k6), ổn định CI

## 2) Danh sách scenario

| Scenario ID | Module | Mô tả scenario | Mức kiểm thử chính | Tự động hoá | Evidence/Mapping |
| --- | --- | --- | --- | --- | --- |
| TS-AUTH-01 | Auth | Đăng nhập thành công với email/password hợp lệ | System (UI) + API | ✅ Cypress smoke + Jest API wrapper | Cypress: `auth-login.cy.js`; API: `POST /api/login` |
| TS-AUTH-02 | Auth | Đăng nhập thất bại (sai mật khẩu/thiếu field) trả lỗi đúng | API/Contract | ✅ Jest/Supertest | `POST /api/login` (negative) |
| TS-PROD-01 | Product | Duyệt danh sách sản phẩm (có phân trang/keyword) | System (UI) + API | ✅ Cypress smoke + Jest wrapper | Cypress: `shop-browse.cy.js`; API: `GET /api/get-all-product-user` |
| TS-PROD-02 | Product | Xem chi tiết sản phẩm theo id | System (UI) + API | ⏳ Planned | UI: `/detail-product/:id`; API: `GET /api/get-detail-product-by-id?id=` |
| TS-CART-01 | Cart | Thêm sản phẩm vào giỏ (quantity/size) | System (UI) + API | ⏳ Planned | API: `POST /api/add-shopcart` |
| TS-CART-02 | Cart | Xem giỏ hàng của user đăng nhập | System (UI) + API | ✅ Cypress smoke | Cypress: `cart-view.cy.js`; API: `GET /api/get-all-shopcart-by-userId?id=` |
| TS-CART-03 | Cart | Xoá item giỏ hàng | API/Contract | ⏳ Planned | API: `DELETE /api/delete-item-shopcart` |
| TS-ORDER-01 | Order | Tạo đơn hàng (COD) từ giỏ hàng | System (UI) + Integration DB | ⏳ Planned (real) | API: `POST /api/create-new-order` |
| TS-ORDER-02 | Order | Xem lịch sử / chi tiết đơn hàng | System + API | ⏳ Planned | API (tuỳ thiết kế) |
| TS-ADDR-01 | Address | Thêm/cập nhật địa chỉ giao hàng | System + API | ⏳ Planned | API (AddressUser) |
| TS-PAY-01 | Payment | Chọn phương thức thanh toán và hiển thị tổng tiền đúng | System + Integration | ⏳ Planned | UI checkout + fee ship |
| TS-ADMIN-01 | Admin | Admin tạo mới sản phẩm và thấy xuất hiện ngoài trang shop | End-to-end (real) | ⏳ Optional | cần seed/admin token |
| TS-PERF-01 | Performance | Load test browse sản phẩm trong 2–5 phút | Non-functional | ✅ k6 | `performance/k6/load-test.js` |
| TS-PERF-02 | Performance | Stress test tăng tải dần đến ngưỡng lỗi | Non-functional | ✅ k6 | `performance/k6/stress-test.js` |

## 3) Quy tắc truy vết scenario → test case → automation

- Mỗi scenario nên có ≥ 2 test case: 1 happy path + 1 negative (hoặc boundary).
- Scenario ưu tiên High-risk (Auth/Cart/Order) cần có automation ở cấp API hoặc System.
- Evidence là link/file trong repo (CI logs, Jest report, Cypress artifacts, k6 scripts).

## 4) Ghi chú “tính điểm cao”

- Repo tham khảo thường có bảng scenario “rõ ràng + gọn” và có mapping sang test case + test report.
- File này đóng vai trò “Scenario list”, còn test case chi tiết nằm ở thư mục `docs/adapted/test case/`.
