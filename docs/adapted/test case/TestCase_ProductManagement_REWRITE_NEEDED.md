# Test Case — Product Management — KTPM

> Module: Product (User browse + Admin manage)
>
> Mục tiêu: đảm bảo danh sách/chi tiết sản phẩm hiển thị đúng và (tuỳ scope) admin CRUD hoạt động đúng.

## 1) Phạm vi

- User browse:
	- `GET /api/get-all-product-user`
	- `GET /api/get-detail-product-by-id?id=...`
- Admin manage (tuỳ triển khai):
	- `POST /api/create-new-product`
	- `PUT /api/update-product`
	- `POST /api/unactive-product` / `POST /api/active-product`

## 2) Test data

- Product seed: có ít nhất 1 sản phẩm (ví dụ áo thun) trong DB.
- Keyword: "ao thun", "áo thun" (có dấu/space để kiểm encode).

## 3) Bảng test case

| Test Case ID | Tiêu đề | Pre-conditions | Test Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-PROD-01 | Xem danh sách sản phẩm (mặc định) | DB có sản phẩm | Gọi `GET /api/get-all-product-user?limit=6&offset=0` | limit=6 offset=0 | 200 + data list + count hợp lệ |  |  |
| TC-PROD-02 | Tìm kiếm theo keyword có khoảng trắng | DB có sản phẩm | Gọi API với keyword "ao thun" | keyword="ao thun" | 200, hệ thống không lỗi; keyword được xử lý đúng |  |  |
| TC-PROD-03 | Sort theo giá | DB có nhiều sản phẩm | Gọi API với sortPrice=true | sortPrice=true | data được sắp xếp theo giá (theo rule) |  |  |
| TC-PROD-04 | Filter theo category/brand | DB có category/brand | Gọi API với categoryId, brandId | categoryId/brandId | 200 + data đúng filter |  |  |
| TC-PROD-05 | Xem chi tiết sản phẩm theo id hợp lệ | DB có product id=1 | Gọi `GET /api/get-detail-product-by-id?id=1` | id=1 | 200 + trả detail đúng |  |  |
| TC-PROD-06 | Xem chi tiết sản phẩm id không tồn tại | - | Gọi detail với id lớn | id=999999 | Trả lỗi rõ ràng (404/errCode) |  |  |
| TC-PROD-07 | Admin tạo sản phẩm mới | Có token admin | 1) Login admin 2) POST create | payload product | 200 + product được tạo |  |  |
| TC-PROD-08 | User thường không tạo sản phẩm | Có token user | POST create-new-product | payload | 403 |  |  |
| TC-PROD-09 | Admin cập nhật sản phẩm | Có token admin + product tồn tại | PUT update-product | payload update | 200 + dữ liệu cập nhật |  |  |
| TC-PROD-10 | Admin unactive/active sản phẩm | Có token admin | POST unactive/active | productId | Trạng thái đổi; user list phản ánh đúng |  |  |

## 4) Mapping automation

- Cypress smoke (UI): browse shop `eCommerce_Reactjs/cypress/e2e/shop-browse.cy.js`.
- FE unit tests: wrapper URL build `eCommerce_Reactjs/src/services/userService.test.js`.
