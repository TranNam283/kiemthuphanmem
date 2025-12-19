# UAT Checklist (KTPM) — Acceptance Testing (Manual)

> Mục tiêu: đóng tầng **Acceptance Testing** trong V-Model (Requirements ↔ Acceptance) bằng checklist có thể tick PASS/FAIL và gắn minh chứng (ảnh/clip).
>
> Khuyến nghị: chạy trên môi trường demo (Railway) hoặc docker-compose local.

## Thông tin chạy

- Ngày chạy:
- Người thực hiện:
- Môi trường: Local / Docker / Railway
- URL frontend:
- URL backend:
- Tài khoản test (user/admin):

## Checklist luồng mua hàng (User)

| ID     | Hạng mục              | Steps tóm tắt                                    | Expected                                                 | Result (Pass/Fail) | Evidence (ảnh/clip/link) |
| ------ | --------------------- | ------------------------------------------------ | -------------------------------------------------------- | ------------------ | ------------------------ |
| UAT-01 | Mở homepage           | 1) Vào trang `/`                                 | Trang load, không crash                                  |                    |                          |
| UAT-02 | Đăng nhập             | 1) Vào `/login` 2) Nhập email/pass 3) Submit     | Đăng nhập thành công, chuyển về homepage, token được lưu |                    |                          |
| UAT-03 | Duyệt sản phẩm        | 1) Vào `/shop` 2) Quan sát list                  | Hiển thị danh sách sản phẩm, giá/ảnh hợp lệ              |                    |                          |
| UAT-04 | Xem chi tiết sản phẩm | 1) Click 1 sản phẩm 2) Vào `/detail-product/:id` | Hiển thị thông tin chi tiết                              |                    |                          |
| UAT-05 | Thêm vào giỏ          | 1) Chọn size/qty (nếu có) 2) Add to cart         | Giỏ tăng số lượng, không lỗi                             |                    |                          |
| UAT-06 | Xem giỏ hàng          | 1) Vào `/shopcart`                               | Hiển thị đúng item/qty/giá                               |                    |                          |
| UAT-07 | Đi đến thanh toán     | 1) Click “Đi đến thanh toán”                     | Mở trang checkout, hiển thị tổng tiền                    |                    |                          |
| UAT-08 | Tạo đơn hàng COD      | 1) Chọn COD 2) Submit order                      | Order tạo thành công (thông báo/redirect)                |                    |                          |
| UAT-09 | Đăng xuất             | 1) Logout                                        | Token/userData bị xoá, quay về trạng thái guest          |                    |                          |

## Checklist quyền truy cập (Access Control)

| ID        | Hạng mục                                 | Steps tóm tắt                 | Expected                                      | Result (Pass/Fail) | Evidence |
| --------- | ---------------------------------------- | ----------------------------- | --------------------------------------------- | ------------------ | -------- |
| UAT-AC-01 | Guest bị chặn khi vào trang cần login    | Mở `/shopcart` khi chưa login | UI yêu cầu login hoặc hiển thị trống/redirect |                    |          |
| UAT-AC-02 | User không vào được trang admin (nếu có) | Thử mở route admin            | Bị chặn/403/redirect                          |                    |          |

## Ghi chú

- Nếu có lỗi: ghi lại bước tái hiện, log console/network, và tạo issue.
