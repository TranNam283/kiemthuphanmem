# Test Case — Cart Management — KTPM

> Module: Cart (giỏ hàng)
>
> Mục tiêu: đảm bảo thao tác giỏ hàng đúng (thêm/xem/xoá) và validation quantity.

## 1) Phạm vi

- `POST /api/add-shopcart`
- `GET /api/get-all-shopcart-by-userId?id=...`
- `DELETE /api/delete-item-shopcart`
- (tuỳ) cập nhật quantity/size nếu có endpoint.

## 2) Test data

- User đã login (token + userId)
- ProductDetailSizeId tồn tại (id mẫu)

## 3) Bảng test case

| Test Case ID | Tiêu đề | Pre-conditions | Test Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-CART-01 | Add to cart thành công | User login + size hợp lệ | POST add-shopcart | {userId,productdetailsizeId,quantity=1} | 200 + `errCode=0` |  |  |
| TC-CART-02 | Add to cart quantity=0 bị chặn | User login | POST add-shopcart | quantity=0 | 4xx/errCode validation |  |  |
| TC-CART-03 | Add to cart thiếu field | User login | POST add-shopcart thiếu productdetailsizeId | thiếu field | 4xx/errCode validation |  |  |
| TC-CART-04 | Xem giỏ hàng của user | User login | GET cart by userId | id=userId | 200 + list items (có thể rỗng) |  |  |
| TC-CART-05 | Xem giỏ hàng khi chưa login | - | GET cart | không token | 401/403 |  |  |
| TC-CART-06 | Xoá item giỏ hàng thành công | Có item trong cart | DELETE delete-item-shopcart | {itemId} | 200 + item bị xoá |  |  |
| TC-CART-07 | Xoá item không thuộc user | User A login | DELETE item của user B | itemId khác owner | 403 hoặc errCode |  |  |
| TC-CART-08 | UI hiển thị giỏ hàng | User login | Mở trang `/shopcart` | - | Bảng sản phẩm hiển thị đúng |  |  |

## 4) Mapping automation

- Cypress smoke (UI): `eCommerce_Reactjs/cypress/e2e/cart-view.cy.js`.
- FE unit tests: add/get/delete wrapper `eCommerce_Reactjs/src/services/userService.test.js`.
