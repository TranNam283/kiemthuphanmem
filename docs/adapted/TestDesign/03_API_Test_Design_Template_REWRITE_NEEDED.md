# API Test Design Template (KTPM) — Mẫu thiết kế test cho API

> Mục tiêu: chuẩn hoá cách thiết kế test cho endpoint API để dễ chuyển sang automation (Jest/Supertest) và dễ review.

## A) Template chung (copy để dùng cho endpoint mới)

### A.1 Thông tin endpoint

- Endpoint: `METHOD /api/...`
- Mục đích:
- Actor/Role: Guest/User/Admin
- AuthN/AuthZ:
	- Token: có/không
	- Role requirement: (nếu có)
- Input:
	- Query:
	- Body:
- Output:
	- Success schema:
	- Error schema:

### A.2 Kỹ thuật test design áp dụng

- EP (phân lớp tương đương):
- BVA (giá trị biên):
- Negative/robustness:
- Decision table (nếu liên quan quyền):

### A.3 Bộ test case cho endpoint

| API-TC ID | Mục tiêu | Preconditions | Request | Expected | Priority | Automation |
| --- | --- | --- | --- | --- | --- | --- |

### A.4 Gợi ý assert tối thiểu

- HTTP status code
- `errCode` / `errMessage` (nếu theo convention)
- Kiểu dữ liệu/field bắt buộc
- Không lộ thông tin nhạy cảm (password, token raw trong log)

---

## B) Ví dụ 1 — `POST /api/login`

### B.1 Mô tả

- Mục đích: xác thực email/password và trả token (hoặc session).
- Actor: Guest
- Risk: High (cửa vào hệ thống)

### B.2 EP/BVA

- Email:
	- hợp lệ (đúng format)
	- không hợp lệ (thiếu @, rỗng)
- Password:
	- đúng
	- sai
	- rỗng

### B.3 Test cases

| API-TC ID | Mục tiêu | Preconditions | Request | Expected | Priority | Automation |
| --- | --- | --- | --- | --- | --- | --- |
| API-AUTH-01 | Login thành công | User tồn tại | body `{email,password}` đúng | 200 + `errCode=0` + token/user | High | ✅ Cypress (stub) + ✅ Jest (planned real) |
| API-AUTH-02 | Sai mật khẩu | User tồn tại | body sai pass | 200/4xx + `errCode!=0` | High | ✅ Jest/Supertest |
| API-AUTH-03 | Thiếu email | - | body thiếu email | 4xx hoặc `errCode!=0` | Medium | ✅ Jest/Supertest |
| API-AUTH-04 | Thiếu password | - | body thiếu password | 4xx hoặc `errCode!=0` | Medium | ✅ Jest/Supertest |

---

## C) Ví dụ 2 — `GET /api/get-all-product-user`

### C.1 Mô tả

- Mục đích: lấy danh sách sản phẩm hiển thị cho user.
- Actor: Guest/User
- Input: `limit`, `offset`, `keyword`, `categoryId`, `brandId`, `sortPrice`, `sortName`.

### C.2 EP/BVA

- `limit`: 0, 1, 6 (default), rất lớn
- `offset`: 0, 1, âm, rất lớn
- `keyword`: rỗng, có dấu/space, ký tự đặc biệt

### C.3 Test cases

| API-TC ID | Mục tiêu | Preconditions | Request | Expected | Priority | Automation |
| --- | --- | --- | --- | --- | --- | --- |
| API-PROD-01 | List sản phẩm mặc định | có seed data | query limit=6 offset=0 | 200 + danh sách/`count` hợp lệ | High | ✅ Cypress (stub) + ✅ Jest wrapper |
| API-PROD-02 | Keyword có khoảng trắng | có seed data | keyword="ao thun" | 200 + không crash; keyword được encode | Medium | ✅ FE unit test (URL encode) |
| API-PROD-03 | limit=0 | - | limit=0 | 200 + data rỗng hoặc error rõ ràng | Low | ⏳ Planned |
| API-PROD-04 | offset âm | - | offset=-1 | 4xx hoặc normalize về 0 | Low | ⏳ Planned |

---

## D) Ví dụ 3 — `POST /api/add-shopcart`

### D.1 Mô tả

- Mục đích: thêm sản phẩm (kèm size) vào giỏ hàng.
- Actor: User
- Risk: High (động trực tiếp tới đơn hàng)

### D.2 Decision table (tối giản)

| Token | User tồn tại | productDetailSizeId hợp lệ | quantity hợp lệ | Expected |
| --- | --- | --- | --- | --- |
| No | - | - | - | 401/errCode auth |
| Yes | No | - | - | 404/errCode user |
| Yes | Yes | No | - | 4xx/errCode product |
| Yes | Yes | Yes | No (0/âm) | 4xx/errCode validation |
| Yes | Yes | Yes | Yes | 200 + cart updated |

### D.3 Test cases

| API-TC ID | Mục tiêu | Preconditions | Request | Expected | Priority | Automation |
| --- | --- | --- | --- | --- | --- | --- |
| API-CART-01 | Add to cart ok | user login + size tồn tại | body `{userId, productdetailsizeId, quantity}` | 200 + `errCode=0` | High | ⏳ Planned (real) |
| API-CART-02 | Không token | - | gọi không header auth | 401/403 | High | ✅ Jest contract (AuthZ) |
| API-CART-03 | quantity=0 | user login | quantity=0 | 4xx/errCode validation | Medium | ⏳ Planned |

## E) Checklist review nhanh cho endpoint

- Có ít nhất 1 happy + 1 negative.
- Có EP/BVA rõ ràng cho input.
- Có testcase AuthZ nếu endpoint cần quyền.
- Có mapping sang file automation (nếu đã implement).
