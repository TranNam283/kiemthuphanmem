# PHỤ LỤC A - DANH SÁCH VÀ CHI TIẾT TEST CASES

Phụ lục này tổng hợp **baseline 90 test case** của đồ án (phục vụ Chương 4 - Test Design):

- **78 test case đã hiện thực và có kết quả PASS** (TC01–TC27, TC28–TC29, TC32–TC34, TC35, TC38–TC39, TC40–TC44, TC45–TC51, TC52–TC53, TC54–TC55, TC57–TC61, TC62–TC68, TC69–TC74, TC75–TC79, TC80–TC82, TC89) ở mức Unit/Integration/API-Contract.
- **12 test case ở trạng thái thiết kế (planned)** (còn lại trong TC28–TC90) cho API/Contract, Integration, System/E2E và phi chức năng.

Quy ước:

- **Loại**: Unit / API-Contract / Integration / E2E / Non-functional
- **Kỹ thuật**: Hộp trắng (White-box), Hộp đen (Black-box), Hộp xám (Gray-box)
- **Trạng thái**: Implemented-PASS (đã chạy) hoặc Planned (thiết kế)

Ghi chú mở rộng: ngoài baseline TC01–TC90, repo còn có thêm một số **DB-real regression tests** (MySQL) để tăng độ tin cậy; các test này không tính vào baseline 90 nhưng được dùng làm minh chứng chạy thật.

- Hiện trạng DB-real: **10 suites – 34 tests – PASS** (chạy bằng `cd ecomAPI` → `npm run test:db` với MySQL Docker đang chạy).

## A.1 Authentication Module - Test Cases

### A.1.1 Source Code: authUtils.js

```javascript
const bcrypt = require("bcryptjs");

const authUtils = {
  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },

  comparePassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  },

  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password) => {
    if (!password) return false;
    return password.length >= 6;
  },
};

module.exports = authUtils;
```

### A.1.2 Bảng Test Cases

| ID   | Test Case                   | Input              | Expected           | Actual     | Status  |
| ---- | --------------------------- | ------------------ | ------------------ | ---------- | ------- |
| TC01 | Hash password               | "myPassword123"    | Chuỗi hash ≠ input | Chuỗi hash | ✅ PASS |
| TC02 | Compare password - match    | Password đúng      | true               | true       | ✅ PASS |
| TC03 | Compare password - no match | Password sai       | false              | false      | ✅ PASS |
| TC04 | Email hợp lệ                | "user@example.com" | true               | true       | ✅ PASS |
| TC05 | Email không hợp lệ          | "plainaddress"     | false              | false      | ✅ PASS |
| TC06 | Password mạnh (>=6 ký tự)   | "password123"      | true               | true       | ✅ PASS |
| TC07 | Password yếu (<6 ký tự)     | "12345"            | false              | false      | ✅ PASS |
| TC08 | Password null               | null               | false              | false      | ✅ PASS |
| TC09 | Password undefined          | undefined          | false              | false      | ✅ PASS |

---

## A.2 Product Module - Test Cases

### A.2.1 Source Code: productUtils.js

```javascript
const productUtils = {
  calculateDiscountedPrice: (originalPrice, discountPercent) => {
    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error("Invalid discount percentage");
    }
    return originalPrice * (1 - discountPercent / 100);
  },

  filterByPrice: (products, minPrice, maxPrice) => {
    return products.filter((p) => p.price >= minPrice && p.price <= maxPrice);
  },

  filterByCategory: (products, categoryId) => {
    return products.filter((p) => p.categoryId === categoryId);
  },

  paginateProducts: (products, page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      data: products.slice(startIndex, endIndex),
      page,
      pageSize,
      totalItems: products.length,
      totalPages: Math.ceil(products.length / pageSize),
    };
  },

  searchProducts: (products, keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerKeyword) ||
        (p.description && p.description.toLowerCase().includes(lowerKeyword))
    );
  },
};

module.exports = productUtils;
```

### A.2.2 Bảng Test Cases

| ID   | Test Case           | Input                  | Expected    | Actual      | Status  |
| ---- | ------------------- | ---------------------- | ----------- | ----------- | ------- |
| TC10 | Giảm 20%            | price=100, discount=20 | 80          | 80          | ✅ PASS |
| TC11 | Giảm 50%            | price=200, discount=50 | 100         | 100         | ✅ PASS |
| TC12 | Discount > 100%     | discount=150           | Error       | Error       | ✅ PASS |
| TC13 | Giảm 0%             | price=100, discount=0  | 100         | 100         | ✅ PASS |
| TC14 | Lọc theo giá        | min=20, max=100        | 2 products  | 2 products  | ✅ PASS |
| TC15 | Lọc theo category   | categoryId=1           | 2 products  | 2 products  | ✅ PASS |
| TC16 | Phân trang - page 1 | page=1, size=10        | 10 items    | 10 items    | ✅ PASS |
| TC17 | Phân trang - page 2 | page=2, size=10        | items từ 11 | items từ 11 | ✅ PASS |
| TC18 | Trang cuối ít items | page=3, size=10        | 5 items     | 5 items     | ✅ PASS |
| TC19 | Tìm theo tên        | "Keyboard"             | 1 product   | 1 product   | ✅ PASS |
| TC20 | Tìm theo mô tả      | "gaming"               | 2 products  | 2 products  | ✅ PASS |
| TC21 | Không tìm thấy      | "Tablet"               | 0 products  | 0 products  | ✅ PASS |

---

## A.3 Order Module - Integration Test Cases

### A.3.1 Bảng Test Cases

| ID   | Test Case             | Input                  | Expected        | Actual         | Status  |
| ---- | --------------------- | ---------------------- | --------------- | -------------- | ------- |
| TC22 | Tạo đơn hàng hợp lệ   | userId=1, items=[...]  | Order với total | Order created  | ✅ PASS |
| TC23 | Tạo đơn - items rỗng  | items=[]               | Error           | Error          | ✅ PASS |
| TC24 | Tạo đơn - userId null | userId=null            | Error           | Error          | ✅ PASS |
| TC25 | Cập nhật status       | "processing"           | status updated  | status updated | ✅ PASS |
| TC26 | Status không hợp lệ   | "invalid"              | Error           | Error          | ✅ PASS |
| TC27 | Áp dụng giảm giá 10%  | total=100, discount=10 | 90              | 90             | ✅ PASS |

---

## A.4 Jest Configuration

### A.4.1 File: jest.config.js

```javascript
module.exports = {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/utils/authUtils.js",
    "src/utils/productUtils.js",
    "src/utils/orderUtils.js",
  ],
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 10000,
  verbose: true,
};
```

### A.4.2 Giải thích cấu hình

| Thuộc tính        | Giá trị | Mục đích                      |
| ----------------- | ------- | ----------------------------- |
| testEnvironment   | "node"  | Chạy trong môi trường Node.js |
| coverageThreshold | 80%     | Ngưỡng coverage tối thiểu     |
| testTimeout       | 10000ms | Timeout cho mỗi test          |
| verbose           | true    | Hiển thị kết quả chi tiết     |

---

## A.5 Code Coverage Report

```
-----------------------|---------|----------|---------|---------|
File                   | % Stmts | % Branch | % Funcs | % Lines |
-----------------------|---------|----------|---------|---------|
All files              |     100 |      100 |     100 |     100 |
 authUtils.js          |     100 |      100 |     100 |     100 |
 productUtils.js       |     100 |      100 |     100 |     100 |
 orderUtils.js         |     100 |      100 |     100 |     100 |
-----------------------|---------|----------|---------|---------|
```

---

_Kết thúc Phụ lục A_

---

## A.6 User/Auth API - Test Design (Planned)

Ghi chú: các test case DB thật (TC28, TC29, TC32, TC33, TC34) được hiện thực bằng integration test MySQL và chạy khi bật `RUN_DB_TESTS=1`.

Các test case nhóm này kiểm thử API theo hướng **hộp đen** (contract + negative + authz). Các request/response cụ thể có thể điều chỉnh theo schema thực tế.

| ID   | Mục tiêu                              | Endpoint                              | Tiền điều kiện     | Dữ liệu/Request (tóm tắt) | Kết quả mong đợi                   | Loại         | Kỹ thuật  | Ưu tiên | Tự động hóa | Trạng thái       |
| ---- | ------------------------------------- | ------------------------------------- | ------------------ | ------------------------- | ---------------------------------- | ------------ | --------- | ------- | ----------- | ---------------- |
| TC28 | Đăng ký thành công                    | POST `/api/create-new-user`           | Không              | email hợp lệ              | Tạo user mới; errCode=0            | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC29 | Đăng ký trùng email                   | POST `/api/create-new-user`           | Email đã tồn tại   | email trùng               | errCode=1                          | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC30 | Đăng ký email sai định dạng           | POST `/api/create-new-user`           | Không              | email sai                 | Validate fail; status 4xx          | API-Contract | Black-box | Medium  | Có          | Planned          |
| TC31 | Đăng ký password yếu                  | POST `/api/create-new-user`           | Không              | password < 6              | Validate fail; status 4xx          | API-Contract | Black-box | Medium  | Có          | Planned          |
| TC32 | Đăng nhập thành công                  | POST `/api/login`                     | User tồn tại       | email + password đúng     | errCode=0; có `accessToken`        | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC33 | Đăng nhập sai mật khẩu                | POST `/api/login`                     | User tồn tại       | password sai              | errCode=3; không có token          | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC34 | Đổi mật khẩu thành công               | POST `/api/changepassword`            | Có token user      | old/new password hợp lệ   | errCode=0; login bằng mật khẩu mới | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC35 | Đổi mật khẩu thiếu token              | POST `/api/changepassword`            | Không token        | request hợp lệ            | 401; bị chặn bởi middleware        | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC36 | Gửi email quên mật khẩu               | POST `/api/send-forgotpassword-email` | User tồn tại       | email                     | Trả trạng thái gửi thành công      | API-Contract | Black-box | Medium  | Có (mock)   | Planned          |
| TC37 | Đặt lại mật khẩu (token sai)          | POST `/api/forgotpassword-email`      | Có token reset sai | token + newPassword       | 4xx; không đổi mật khẩu            | API-Contract | Black-box | Medium  | Có (mock)   | Planned          |
| TC38 | Admin lấy danh sách user (đúng quyền) | GET `/api/get-all-user`               | Token admin        | -                         | 200; trả list                      | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC39 | User thường gọi API admin             | GET `/api/get-all-user`               | Token user         | -                         | 403/404; bị chặn verifyTokenAdmin  | API-Contract | Black-box | High    | Có          | Implemented-PASS |

---

## A.7 Product API - Test Design (Planned)

| ID   | Mục tiêu                            | Endpoint                            | Tiền điều kiện          | Dữ liệu/Request (tóm tắt)  | Kết quả mong đợi                    | Loại         | Kỹ thuật  | Ưu tiên | Tự động hóa | Trạng thái       |
| ---- | ----------------------------------- | ----------------------------------- | ----------------------- | -------------------------- | ----------------------------------- | ------------ | --------- | ------- | ----------- | ---------------- |
| TC40 | Lấy danh sách sản phẩm (user)       | GET `/api/get-all-product-user`     | Không                   | query filter/sort (nếu có) | 200; danh sách trả về ổn định       | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC41 | Lấy chi tiết sản phẩm hợp lệ        | GET `/api/get-detail-product-by-id` | Có productId            | productId hợp lệ           | 200; đúng dữ liệu                   | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC42 | Lấy chi tiết sản phẩm không tồn tại | GET `/api/get-detail-product-by-id` | Không                   | productId không tồn tại    | 404/4xx; thông báo rõ               | API-Contract | Black-box | Medium  | Có          | Implemented-PASS |
| TC43 | Lấy sản phẩm mới                    | GET `/api/get-product-new`          | Không                   | -                          | 200; danh sách non-empty (nếu seed) | API-Contract | Black-box | Medium  | Có          | Implemented-PASS |
| TC44 | Lấy sản phẩm nổi bật                | GET `/api/get-product-feature`      | Không                   | -                          | 200; danh sách trả về               | API-Contract | Black-box | Medium  | Có          | Implemented-PASS |
| TC45 | Admin tạo sản phẩm (đúng quyền)     | POST `/api/create-new-product`      | Token admin             | payload product hợp lệ     | 201/200; tạo thành công             | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC46 | User tạo sản phẩm (sai quyền)       | POST `/api/create-new-product`      | Token user              | payload hợp lệ             | 403/404; bị chặn                    | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC47 | Admin cập nhật sản phẩm             | PUT `/api/update-product`           | Token admin + productId | payload hợp lệ             | 200; cập nhật thành công            | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC48 | Admin unactive sản phẩm             | POST `/api/unactive-product`        | Token admin             | productId                  | 200; sản phẩm bị ẩn với user        | API-Contract | Black-box | Medium  | Có          | Implemented-PASS |
| TC49 | Admin active sản phẩm               | POST `/api/active-product`          | Token admin             | productId                  | 200; sản phẩm hiện lại với user     | API-Contract | Black-box | Medium  | Có          | Implemented-PASS |
| TC50 | Danh sách admin (đúng quyền)        | GET `/api/get-all-product-admin`    | Token admin             | -                          | 200; trả đủ sản phẩm                | API-Contract | Black-box | Medium  | Có          | Implemented-PASS |
| TC51 | Danh sách admin (thiếu quyền)       | GET `/api/get-all-product-admin`    | Token user/none         | -                          | 401/403                             | API-Contract | Black-box | Medium  | Có          | Implemented-PASS |

---

## A.8 ShopCart API - Test Design (Planned)

| ID   | Mục tiêu                        | Endpoint                              | Tiền điều kiện | Dữ liệu/Request (tóm tắt)                      | Kết quả mong đợi                 | Loại         | Kỹ thuật  | Ưu tiên | Tự động hóa | Trạng thái       |
| ---- | ------------------------------- | ------------------------------------- | -------------- | ---------------------------------------------- | -------------------------------- | ------------ | --------- | ------- | ----------- | ---------------- |
| TC52 | Thêm sản phẩm vào giỏ           | POST `/api/add-shopcart`              | Token user     | productId + quantity hợp lệ                    | 200; item xuất hiện trong giỏ    | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC53 | Thêm giỏ với quantity = 0       | POST `/api/add-shopcart`              | Token user     | quantity=0                                     | 4xx; validate fail               | API-Contract | Black-box | Medium  | Có          | Implemented-PASS |
| TC54 | Thêm giỏ thiếu token            | POST `/api/add-shopcart`              | Không token    | payload hợp lệ                                 | 401                              | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC55 | Xem giỏ theo userId             | GET `/api/get-all-shopcart-by-userId` | Token user     | -                                              | 200; trả danh sách item          | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC56 | Xem giỏ với token của user khác | GET `/api/get-all-shopcart-by-userId` | Token user A   | cố gắng truy vấn giỏ user B (nếu API cho phép) | 403 hoặc trả đúng giỏ theo token | API-Contract | Black-box | High    | Có          | Planned          |
| TC57 | Xóa item khỏi giỏ               | DELETE `/api/delete-item-shopcart`    | Token user     | itemId hợp lệ                                  | 200; item bị xóa                 | API-Contract | Black-box | High    | Có          | Implemented-PASS |
| TC58 | Xóa item không tồn tại          | DELETE `/api/delete-item-shopcart`    | Token user     | itemId không tồn tại                           | 404/4xx                          | API-Contract | Black-box | Medium  | Có          | Implemented-PASS |
| TC59 | Xóa item thiếu token            | DELETE `/api/delete-item-shopcart`    | Không token    | itemId hợp lệ                                  | 401                              | API-Contract | Black-box | High    | Có          | Implemented-PASS |

---

## A.9 Order API/Integration - Test Design (Planned)

| ID   | Mục tiêu                         | Endpoint/Chức năng                | Tiền điều kiện           | Dữ liệu/Request (tóm tắt) | Kết quả mong đợi                    | Loại         | Kỹ thuật  | Ưu tiên     | Tự động hóa | Trạng thái       |
| ---- | -------------------------------- | --------------------------------- | ------------------------ | ------------------------- | ----------------------------------- | ------------ | --------- | ----------- | ----------- | ---------------- |
| TC60 | Tạo đơn hàng thành công          | POST `/api/create-new-order`      | Token user + giỏ có item | payload order hợp lệ      | 201/200; tạo order + total đúng     | Integration  | Gray-box  | High        | Có          | Implemented-PASS |
| TC61 | Tạo đơn với giỏ rỗng             | POST `/api/create-new-order`      | Token user               | items rỗng                | 4xx; không tạo order                | API-Contract | Black-box | High        | Có          | Implemented-PASS |
| TC62 | Tạo đơn thiếu token              | POST `/api/create-new-order`      | Không token              | payload hợp lệ            | 401                                 | API-Contract | Black-box | High        | Có          | Implemented-PASS |
| TC63 | Lấy danh sách đơn theo user      | GET `/api/get-all-order-by-user`  | Token user               | -                         | 200; chỉ trả đơn của user           | API-Contract | Black-box | High        | Có          | Implemented-PASS |
| TC64 | Lấy chi tiết đơn hợp lệ          | GET `/api/get-detail-order`       | Có orderId               | orderId hợp lệ            | 200; trả detail đúng                | API-Contract | Black-box | High        | Có          | Implemented-PASS |
| TC65 | Lấy chi tiết đơn không tồn tại   | GET `/api/get-detail-order`       | -                        | orderId không tồn tại     | 404/4xx                             | API-Contract | Black-box | Medium      | Có          | Implemented-PASS |
| TC66 | Cập nhật trạng thái hợp lệ       | PUT `/api/update-status-order`    | Token user               | orderId + status hợp lệ   | 200; trạng thái đổi                 | API-Contract | Black-box | High        | Có          | Implemented-PASS |
| TC67 | Cập nhật trạng thái không hợp lệ | PUT `/api/update-status-order`    | Token user               | status="invalid"          | 4xx; không cập nhật                 | API-Contract | Black-box | High        | Có          | Implemented-PASS |
| TC68 | Confirm order (happy path)       | PUT `/api/confirm-order`          | Có orderId hợp lệ        | payload theo API          | 200; order confirmed                | API-Contract | Black-box | High        | Có          | Implemented-PASS |
| TC69 | Thanh toán (khởi tạo)            | POST `/api/payment-order`         | Token user + orderId     | orderId + method          | 200; trả thông tin payment/redirect | API-Contract | Black-box | High        | Có (mock)   | Implemented-PASS |
| TC70 | Thanh toán thành công callback   | POST `/api/payment-order-success` | Token user               | payload callback          | 200; cập nhật trạng thái đúng       | Integration  | Gray-box  | High        | Có (mock)   | Implemented-PASS |
| TC71 | VNPay khởi tạo                   | POST `/api/payment-order-vnpay`   | Token user               | orderId                   | 200; trả url redirect               | API-Contract | Black-box | Medium      | Có (mock)   | Implemented-PASS |
| TC72 | VNPay return (signature sai)     | POST `/api/vnpay_return`          | -                        | payload signature sai     | 4xx; không update trạng thái        | API-Contract | Black-box | High        | Có (mock)   | Implemented-PASS |
| TC73 | Webhook GHN hợp lệ               | POST `/api/webhook/ghn`           | -                        | payload GHN hợp lệ        | 200; cập nhật shipping status       | Integration  | Gray-box  | Medium-High | Có (mock)   | Implemented-PASS |
| TC74 | Webhook GHN replay/duplicate     | POST `/api/webhook/ghn`           | Có order                 | payload trùng             | Idempotent hoặc không double-update | Integration  | Gray-box  | Medium      | Có (mock)   | Implemented-PASS |

---

## A.10 Voucher API - Test Design (Planned)

| ID   | Mục tiêu                   | Endpoint                       | Tiền điều kiện           | Dữ liệu/Request (tóm tắt) | Kết quả mong đợi           | Loại         | Kỹ thuật  | Ưu tiên     | Tự động hóa | Trạng thái       |
| ---- | -------------------------- | ------------------------------ | ------------------------ | ------------------------- | -------------------------- | ------------ | --------- | ----------- | ----------- | ---------------- |
| TC75 | Xem voucher store          | GET `/api/get-voucher-store`   | Token user (nếu yêu cầu) | -                         | 200; danh sách voucher     | API-Contract | Black-box | Medium      | Có          | Implemented-PASS |
| TC76 | Claim voucher thành công   | POST `/api/claim-voucher`      | Token user               | voucherId hợp lệ          | 200; voucher vào ví        | API-Contract | Black-box | Medium-High | Có          | Implemented-PASS |
| TC77 | Claim voucher đã claim     | POST `/api/claim-voucher`      | Token user               | voucherId đã claim        | 4xx; không nhân đôi        | API-Contract | Black-box | Medium      | Có          | Implemented-PASS |
| TC78 | Xem voucher wallet         | GET `/api/get-voucher-wallet`  | Token user               | -                         | 200; list voucher đã claim | API-Contract | Black-box | Medium      | Có          | Implemented-PASS |
| TC79 | Revoke voucher thành công  | PUT `/api/revoke-voucher`      | Token admin              | voucherId                 | 200; voucher bị thu hồi    | API-Contract | Black-box | Low         | Có          | Implemented-PASS |
| TC80 | Admin tạo voucher          | POST `/api/create-new-voucher` | Token admin              | payload hợp lệ            | 201/200; tạo voucher       | API-Contract | Black-box | Medium      | Có          | Implemented-PASS |
| TC81 | Admin cập nhật voucher     | PUT `/api/update-voucher`      | Token admin              | payload hợp lệ            | 200; update ok             | API-Contract | Black-box | Low         | Có          | Implemented-PASS |
| TC82 | User gọi API admin voucher | POST `/api/create-new-voucher` | Token user               | payload                   | 403/404                    | API-Contract | Black-box | Medium      | Có          | Implemented-PASS |

---

## A.11 System/E2E - Test Design (Planned)

| ID   | Luồng E2E                  | Tiền điều kiện        | Các bước (tóm tắt)              | Kết quả mong đợi                         | Loại | Kỹ thuật  | Ưu tiên     | Tự động hóa             | Trạng thái |
| ---- | -------------------------- | --------------------- | ------------------------------- | ---------------------------------------- | ---- | --------- | ----------- | ----------------------- | ---------- |
| TC83 | Login thành công           | Có user               | Mở web → login → vào trang user | Đăng nhập thành công; token lưu; UI đúng | E2E  | Black-box | High        | Có (Playwright/Cypress) | Planned    |
| TC84 | Route guard `/admin`       | Có user thường        | Truy cập `/admin`               | Bị chặn/redirect; không truy cập được    | E2E  | Black-box | High        | Có                      | Planned    |
| TC85 | Duyệt sản phẩm             | Không                 | Mở home → xem list → vào detail | List và detail hiển thị đúng             | E2E  | Black-box | High        | Có                      | Planned    |
| TC86 | Thêm vào giỏ và xem giỏ    | Có user               | Login → add product → mở cart   | Item xuất hiện; tổng tiền cập nhật       | E2E  | Black-box | High        | Có                      | Planned    |
| TC87 | Checkout tạo đơn           | Có user + cart        | Checkout → tạo order            | Tạo order; hiển thị xác nhận             | E2E  | Black-box | High        | Có                      | Planned    |
| TC88 | Xem danh sách đơn của user | Có user + đã có order | Vào “Đơn hàng”                  | Hiển thị order vừa tạo; trạng thái đúng  | E2E  | Black-box | Medium-High | Có                      | Planned    |

---

## A.12 Non-functional - Test Design (Planned)

| ID   | Mục tiêu                    | Kịch bản                                                  | Tiêu chí chấp nhận        | Loại           | Kỹ thuật  | Ưu tiên | Tự động hóa       | Trạng thái       |
| ---- | --------------------------- | --------------------------------------------------------- | ------------------------- | -------------- | --------- | ------- | ----------------- | ---------------- |
| TC89 | Kiểm thử bảo mật (AuthZ)    | Gọi API admin bằng token user (ví dụ `/api/get-all-user`) | 403/404; không lộ dữ liệu | Non-functional | Black-box | High    | Có                | Implemented-PASS |
| TC90 | Kiểm thử hiệu năng (Browse) | Gọi GET `/api/get-all-product-user` với tải nhẹ           | p95 < 2s; error rate ~0%  | Non-functional | Black-box | Medium  | Có (k6/artillery) | Planned          |
