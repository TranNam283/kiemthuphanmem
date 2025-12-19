# CHƯƠNG 4. THIẾT KẾ KIỂM THỬ VÀ CI/CD

> **Đồ án môn**: Kiểm thử phần mềm  
> **Dự án**: eCommerce Full Stack (React.js + Node.js + MySQL)  
> **Cập nhật**: 18/12/2025  
> **Số trang mục tiêu**: 25-30 trang (chiếm ~30% của 80 trang tổng)

---

## 📋 MỤC LỤC CHƯƠNG 4

| STT | Nội dung                         | Số trang     | Trạng thái                 |
| --- | -------------------------------- | ------------ | -------------------------- |
| 4.1 | Tổng quan                        | 2 trang      | ✅ Đã viết                 |
| 4.2 | Phân tích khung nhìn V-Model     | 3 trang      | ✅ Đã viết                 |
| 4.3 | Phân tích khung nhìn Agile/CI-CD | 4 trang      | ✅ **ĐÃ TRIỂN KHAI**       |
| 4.4 | Phân tích khung nhìn phương pháp | 5 trang      | ✅ Đã viết                 |
| 4.5 | Phân tích kỹ thuật nâng cao      | 4 trang      | ✅ Đã viết                 |
| 4.6 | Triển khai Test (Implementation) | 6 trang      | ✅ **ĐÃ TRIỂN KHAI**       |
| 4.7 | Kết quả và đánh giá              | 3 trang      | ✅ Đã viết (cập nhật hình) |
|     | **TỔNG**                         | **27 trang** |                            |

---

## ✅ PHẦN ĐÃ HOÀN THÀNH

### 1. CI/CD Pipeline với GitHub Actions

#### 1.1 Backend CI/CD (`backend-ci.yml`)

**File**: `.github/workflows/backend-ci.yml`

```yaml
# Các jobs đã triển khai:
✅ test          - Unit test + Integration test với MySQL
✅ security-scan - npm audit báo cáo bảo mật
✅ build         - Docker image build + health check
✅ deploy        - Notification (placeholder)
✅ create-issue-on-failure - Tự động tạo GitHub Issue khi fail
```

**Tính năng nổi bật:**

- MySQL 8.0 service container cho integration test
- Code coverage với ngưỡng 80%
- Upload artifacts (coverage report)
- Tự động tạo issue khi test fail

#### 1.2 Frontend CI/CD (`frontend-ci.yml`)

**File**: `.github/workflows/frontend-ci.yml`

```yaml
# Các jobs đã triển khai:
✅ test - Lint + Unit test + Build production
✅ create-issue-on-failure - Tự động tạo GitHub Issue khi fail
```

**Tính năng nổi bật:**

- Build verification trước khi deploy
- Upload build artifacts
- Codecov coverage report

---

### 2. Test Implementation - Backend

#### 2.1 Automated Tests (Jest/Supertest) – kết quả chạy thật

Trong repo, nhóm triển khai kiểm thử tự động bằng **Jest** (unit/integration) và **Supertest** (API-Contract/smoke) để tạo minh chứng PASS/FAIL và logs có thể lặp lại.

**Minh chứng chạy thật (bám theo report trong repo):** file `ecomAPI/jest-results.json` lưu lại kết quả một lần chạy gần nhất.

- Tổng quan: **17 test suites – 116 tests**
- Kết quả: **109 PASS – 7 PENDING – 0 FAIL**

Ghi chú về **PENDING**: đây là các test case đã “thiết kế trước” nhưng chưa assert đầy đủ trong bộ API-contract mock (ví dụ nhóm Product/Cart), được giữ lại để thể hiện lộ trình mở rộng test thay vì xoá.

Ghi nhận: trong quá trình thêm DB-real tests, phát hiện lỗi ở API `/api/get-detail-user-by-email` (service query sai + chưa export hàm) và đã sửa để endpoint chạy đúng.

| Nhóm                              | Vị trí                                                  | Mục tiêu                                                                                                  |
| --------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Unit                              | `ecomAPI/tests/unit/*.test.js`                          | Kiểm thử hàm utils/validators (Auth/Product/Order)                                                        |
| Integration                       | `ecomAPI/tests/integration/*.test.js`                   | Kiểm thử logic ở mức tích hợp (không phụ thuộc chạy server)                                               |
| API-Contract                      | `ecomAPI/tests/api/authz.contract.test.js`              | Kiểm thử contract Auth/AuthZ (thiếu token/invalid token → 401/403)                                        |
| API-Contract (role)               | `ecomAPI/tests/api/authz.roles.contract.test.js`        | Kiểm thử phân quyền admin/user cho một số API (mock DB + mock controllers)                                |
| API-Contract (Product)            | `ecomAPI/tests/api/product.contract.test.js`            | Kiểm thử contract nhóm Product (list/detail/new/feature) ở mức không phụ thuộc DB                         |
| API-Contract (Cart/Order/Voucher) | `ecomAPI/tests/api/cart-order-voucher.contract.test.js` | Kiểm thử contract nhóm Cart/Order/Voucher (happy path + negative + payment/webhook) bằng mock controllers |
| Smoke                             | `ecomAPI/tests/api/app.smoke.test.js`                   | Kiểm tra nhanh CORS/404                                                                                   |

**Lệnh chạy minh chứng:**

- Không cần DB: `cd ecomAPI` → `npx jest --coverage --runInBand`
- DB thật (MySQL Docker): `cd ecomAPI` → `npm run test:db`

#### 2.2 Source Code được test

| File                        | Chức năng                                                                                   | Coverage |
| --------------------------- | ------------------------------------------------------------------------------------------- | -------- |
| `src/utils/authUtils.js`    | hashPassword, comparePassword, validateEmail, validatePassword                              | 100%     |
| `src/utils/productUtils.js` | calculateDiscountedPrice, filterByPrice, filterByCategory, paginateProducts, searchProducts | 100%     |
| `src/utils/orderUtils.js`   | validateOrderData, calculateTotal, applyDiscount, validateOrderStatus                       | 100%     |

#### 2.3 Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  collectCoverageFrom: [
    "src/utils/authUtils.js",
    "src/utils/productUtils.js",
    "src/utils/orderUtils.js",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

---

### 3. Code Coverage Report

```
┌─────────────────────────────────────────────────────────────┐
│ File                  │ % Stmts │ % Branch │ % Funcs │ % Lines │
├───────────────────────┼─────────┼──────────┼─────────┼─────────┤
│ authUtils.js          │  100    │   100    │   100   │   100   │
│ productUtils.js       │  100    │   100    │   100   │   100   │
│ orderUtils.js         │  100    │   100    │   100   │   100   │
├───────────────────────┼─────────┼──────────┼─────────┼─────────┤
│ TOTAL                 │  100%   │   100%   │   100%  │   100%  │
└─────────────────────────────────────────────────────────────┘

✅ Coverage threshold (80%) - configured (CI enforces)
```

---

### 4. GitHub Actions Workflow Status

| Workflow       | Status                     | Lần cuối chạy |
| -------------- | -------------------------- | ------------- |
| Backend CI/CD  | ✅ Có workflow + artifacts | Xem Actions   |
| Frontend CI/CD | ✅ Có workflow + artifacts | Xem Actions   |

**Link kiểm tra**: https://github.com/TranNam283/kiemthuphanmem/actions

---

## NỘI DUNG CHI TIẾT (PHỤC VỤ WORD)

> Ghi chú: Repo “điểm cao” không có file Chương 4 dạng Markdown riêng; phần “Test Design” của họ thể hiện qua bộ template Office ở `docs/tests/**` và bộ automated tests (multi-layer + Selenium). Mình đã tóm tắt cấu trúc/fields (không copy nội dung) tại: `docs/CHUONG4_REFERENCE_ANALYSIS.md`.

### 4.1 TỔNG QUAN

#### 4.1.1 Mục tiêu của Chương 4

Chương 4 tập trung vào **thiết kế kiểm thử** (test design) và cách triển khai kiểm thử trong quy trình CI/CD. Mục tiêu của chương gồm:

- Chuẩn hoá **baseline test cases** để làm căn cứ triển khai và báo cáo kết quả.
- Trình bày **kỹ thuật thiết kế test** (hộp đen/hộp trắng/hộp xám) áp dụng cho từng mức kiểm thử.
- Mô tả cách triển khai kiểm thử tự động (Jest/Supertest) và cách thu thập minh chứng (logs/coverage/artifacts).
- Tạo cơ sở cho phần **kết quả và đánh giá** (mục 4.7) thông qua dữ liệu chạy thật trên CI/CD và/hoặc môi trường demo.

#### 4.1.2 Đầu vào và đầu ra của hoạt động Test Design

| Nhóm       | Đầu vào (Inputs)                                                             | Đầu ra (Outputs)                                                |
| ---------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Tài liệu   | Test Plan (Chương 3), ma trận rủi ro, baseline 90 test case                  | Danh mục test case + traceability + tiêu chí pass/fail          |
| Mã nguồn   | Backend `ecomAPI/`, Frontend `eCommerce_Reactjs/`, DB schema/seed `ecom.sql` | Test scripts (Jest/Supertest), cấu hình CI/CD, báo cáo coverage |
| Môi trường | Docker Compose (local) / Railway (demo) / GitHub Actions (CI)                | Logs, screenshots, artifacts minh chứng                         |

#### 4.1.3 Baseline 90 test case và nguyên tắc phân bổ

Trong phạm vi đồ án, nhóm chốt **baseline = 90 test case** để đảm bảo Chương 4 có quy mô đủ lớn và có thể triển khai theo mức độ ưu tiên:

- Một phần test case đã được **tự động hoá** (unit/integration/api-contract/DB-real) và có minh chứng chạy thật.
- Phần còn lại được giữ ở trạng thái **planned** để thể hiện phạm vi thiết kế và roadmap mở rộng theo rủi ro.

Danh sách test case chi tiết (ID, mục tiêu, dữ liệu, expected, loại test, kỹ thuật, ưu tiên) được trình bày tại: `docs/PHU_LUC_A_TEST_CASES.md`.

Ngoài ra, để dễ truy vết “test case thiết kế ↔ test script”, nhóm dùng traceability dạng file ở `docs/tests/test-cases.csv`.

#### 4.1.4 Làm sao biết “test chạy ổn”?

Trong đồ án, “test chạy ổn” được xác nhận ở 2 cấp:

**(1) Chạy local (trước khi push)**

- Backend:
  - Chạy unit tests: `cd ecomAPI` → `npm run test:unit`
  - Chạy integration tests: `cd ecomAPI` → `npm run test:integration`
  - Xem coverage: thư mục `ecomAPI/coverage/` (report HTML)

**(2) Chạy CI trên GitHub Actions (bằng chứng chính để báo cáo)**

- Mỗi lần push/PR, workflow sẽ chạy và trả kết quả PASS/FAIL.
- Khi FAIL: xem logs từng step để biết fail ở test nào (stack trace), hoặc fail do cấu hình môi trường.
- Khi PASS: lấy **artifacts/coverage report** làm minh chứng đưa vào mục 4.7.

Lưu ý: Giảng viên thường đánh giá cao **bằng chứng CI** vì lặp lại được và có log minh bạch.

### 4.2 PHÂN TÍCH KHUNG NHÌN V-MODEL

```
┌──────────────────────────────────────────────────────────────────┐
│                         V-MODEL                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Requirements ─────────────────────────────── Acceptance Testing │
│       ↓                                              ↑            │
│  System Design ───────────────────────────── System Testing      │
│       ↓                                              ↑            │
│  Architecture Design ────────────────────── Integration Testing  │
│       ↓                                              ↑            │
│  Module Design ──────────────────────────── Unit Testing         │
│       ↓                                              ↑            │
│  Coding ─────────────────────────────────────────────            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Bảng ánh xạ V-Model với dự án:**

> Lưu ý: Các **TCxx** bên dưới là **ID test case thiết kế (baseline)**. Trạng thái chạy thật (PASS/PENDING/FAIL) được tổng hợp ở mục 4.7 theo report (ví dụ `ecomAPI/jest-results.json`) và log CI.

| Giai đoạn thiết kế | Giai đoạn test      | Test đã triển khai                                                                                   |
| ------------------ | ------------------- | ---------------------------------------------------------------------------------------------------- |
| Requirements       | Acceptance Testing  | ⏳ Manual testing                                                                                    |
| System Design      | System Testing      | ✅ E2E smoke (Cypress): `homepage.cy.js`, `auth-login.cy.js`, `shop-browse.cy.js`, `cart-view.cy.js` |
| Architecture       | Integration Testing | ✅ Integration (Jest): `orderService.test.js` + nhóm `*.mysql.int.test.js`                           |
| Module Design      | Unit Testing        | ✅ Unit (Jest): `authService.test.js`, `productService.test.js`, `orderService.test.js`              |

#### 4.2.1 Ánh xạ artefact thực tế của dự án và test case (baseline)

V-Model được sử dụng để đảm bảo việc thiết kế test case không chỉ “liệt kê”, mà có **cơ sở truy vết** từ artefact của dự án (yêu cầu/thiết kế/kiến trúc/module) đến các mức kiểm thử tương ứng.

| Artefact (dự án)        | Ví dụ trong repo                                  | Mức kiểm thử           | Nhóm test case liên quan                           |
| ----------------------- | ------------------------------------------------- | ---------------------- | -------------------------------------------------- |
| Yêu cầu/luồng nghiệp vụ | Luồng mua hàng (Login → Browse → Cart → Checkout) | System/E2E, Acceptance | TC83–TC88                                          |
| Thiết kế hệ thống       | API routes + contract UI ↔ API                    | API/Contract           | TC28–TC59, TC63–TC72, TC75–TC82                    |
| Thiết kế kiến trúc      | Controllers/Services/DB                           | Integration            | TC60, TC70, TC73–TC74                              |
| Thiết kế module         | utils/validators                                  | Unit                   | TC01–TC21 (Auth/Product) + TC22–TC27 (Order utils) |

#### 4.2.2 Ma trận truy vết (Traceability Matrix) ở mức use case

Ma trận truy vết giúp trả lời 2 câu hỏi trong Test Design:

1. **Test case này cover yêu cầu/luồng nào?**
2. **Luồng quan trọng đã có test case chưa?**

| Use case/luồng nghiệp vụ  | Mức ưu tiên (risk) | Test case IDs (baseline)                | Ghi chú                        |
| ------------------------- | ------------------ | --------------------------------------- | ------------------------------ |
| UC-01 Đăng nhập/đăng xuất | High               | TC32–TC35, TC83                         | API + E2E                      |
| UC-02 Duyệt sản phẩm      | High               | TC40–TC44, TC85, TC90                   | API + E2E + performance        |
| UC-03 Quản lý giỏ hàng    | High               | TC52–TC59, TC86                         | API + E2E                      |
| UC-04 Đặt hàng/Checkout   | High               | TC60–TC68, TC87–TC88                    | Integration + E2E              |
| UC-05 Thanh toán/Return   | High               | TC69–TC72                               | API/Integration (mock/sandbox) |
| UC-06 Voucher             | Medium-High        | TC75–TC82                               | API/Contract                   |
| UC-07 Phân quyền admin    | High               | TC38–TC39, TC46, TC51, TC82, TC84, TC89 | API + E2E + security           |

Danh sách truy vết chi tiết tới từng endpoint/test data được đặt trong Phụ lục A để dễ quản lý.

#### 4.2.3 Mapping test case ↔ test scripts (minh chứng tự động hoá)

Để đảm bảo Chương 4 có tính “thiết kế → triển khai”, nhóm ánh xạ **baseline test case** với **test scripts hiện có**. Nguồn tổng hợp chính: `docs/tests/test-cases.csv`.

- **TC35, TC51, TC54, TC59, TC62** → `ecomAPI/tests/api/authz.contract.test.js`
- **TC38–TC39, TC45–TC50, TC80–TC82, TC89** → `ecomAPI/tests/api/authz.roles.contract.test.js`
- **TC40–TC44** → `ecomAPI/tests/api/product.contract.test.js`
- **TC52–TC53, TC55, TC57–TC58, TC60–TC61, TC63–TC74, TC75–TC79** → `ecomAPI/tests/api/cart-order-voucher.contract.test.js`

Các test này tập trung vào **contract + middleware auth/authz** (status code + rule phân quyền). Một số test case trong nhóm contract được để trạng thái **PENDING** (xem `ecomAPI/jest-results.json`) để thể hiện phần “planned/đang hoàn thiện” trong baseline.

#### 4.2.4 Tiêu chí chấp nhận theo mức kiểm thử

- **Unit/Integration (CI bắt buộc)**: tất cả test PASS; coverage không thấp hơn ngưỡng tối thiểu (theo cấu hình).
- **API/Contract (ưu tiên High)**: đúng status code, đúng quy tắc auth/authz, response ổn định với frontend.
- **System/E2E (smoke)**: hoàn thành luồng mua hàng cơ bản; không có lỗi severity High.

### 4.3 PHÂN TÍCH KHUNG NHÌN AGILE/CI-CD (4 trang) ⭐ ĐÃ LÀM

```
┌─────────────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   [PUSH CODE]                                                    │
│       ↓                                                          │
│   ┌───────────┐                                                  │
│   │  GitHub   │ ──trigger──→ GitHub Actions                     │
│   └───────────┘                    ↓                             │
│                           ┌───────────────┐                      │
│                           │   BACKEND CI  │                      │
│                           ├───────────────┤                      │
│                           │ 1. Checkout   │                      │
│                           │ 2. Install    │                      │
│                           │ 3. Lint       │                      │
│                           │ 4. Unit Test  │──→ Coverage Report  │
│                           │ 5. Int. Test  │                      │
│                           │ 6. Security   │──→ Audit Report     │
│                           │ 7. Build      │──→ Docker Image     │
│                           └───────────────┘                      │
│                                  ↓                               │
│                           ┌───────────────┐                      │
│                           │  FRONTEND CI  │                      │
│                           ├───────────────┤                      │
│                           │ 1. Checkout   │                      │
│                           │ 2. Install    │                      │
│                           │ 3. Lint       │                      │
│                           │ 4. Unit Test  │                      │
│                           │ 5. Build      │──→ Build Artifacts  │
│                           └───────────────┘                      │
│                                  ↓                               │
│                           [DEPLOY STAGING]                       │
│                                  ↓                               │
│                           [SMOKE TEST]                           │
│                                  ↓                               │
│                           [DEPLOY PROD]                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Sau khi deploy, kiểm thử những gì?**

1. **Smoke Testing** - Kiểm tra nhanh các chức năng chính hoạt động
2. **Sanity Testing** - Kiểm tra logic nghiệp vụ cơ bản
3. **Regression Testing** - Đảm bảo không phá vỡ tính năng cũ
4. **Performance Testing** - Đo thời gian response, load testing

### 4.4 PHÂN TÍCH KHUNG NHÌN PHƯƠNG PHÁP (5 trang)

#### 4.4.1 Static Testing (Verification)

**Checklist Code Review:**

| STT | Tiêu chí                 | Áp dụng                            |
| --- | ------------------------ | ---------------------------------- |
| 1   | Naming convention        | ✅ camelCase                       |
| 2   | Error handling           | ✅ try-catch                       |
| 3   | Input validation         | ✅ validateEmail, validatePassword |
| 4   | Security (SQL injection) | ✅ Sequelize ORM                   |
| 5   | Code duplication         | ✅ Utils functions                 |

**Data Flow Analysis:**

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA FLOW - LOGIN                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   User Input → validateEmail() → validatePassword()          │
│       ↓                                                      │
│   hashPassword() → Database Query → comparePassword()        │
│       ↓                                                      │
│   Generate JWT Token → Response to Client                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Kiểm tra:
✅ Input được validate trước khi xử lý
✅ Password được hash trước khi lưu
✅ Không có SQL injection (dùng ORM)
```

#### 4.4.2 Dynamic Testing

**Black-Box Testing:**

- Test dựa trên requirements, không cần biết code
- Ví dụ: Test API `/api/login` với các input khác nhau

**White-Box Testing:**

- Test dựa trên cấu trúc code
- Ví dụ: Test tất cả branches trong `validatePassword()`

**Gray-Box Testing:**

- Kết hợp cả 2, biết một phần code
- Ví dụ: Test integration với database

#### 4.4.3 Thiết kế test cases (Test Design) theo baseline 90 test case

Mục tiêu của phần này là chuyển từ “chiến lược kiểm thử” (Chương 3) sang **danh sách test case cụ thể** (Chương 4), bao gồm: ID, mục tiêu, dữ liệu vào, bước kiểm thử, kết quả mong đợi, loại test và mức ưu tiên.

Trong phạm vi đồ án, nhóm chốt **baseline = 90 test case**:

- Một phần đã được hiện thực thành test tự động (unit/integration/api-contract/DB-real) và có report chạy thật.
- Phần còn lại là test case thiết kế (planned) cho System/E2E và phi chức năng, ưu tiên theo ma trận rủi ro.

Toàn bộ danh sách test case (có mô tả cụ thể theo bảng) được trình bày tại: `docs/PHU_LUC_A_TEST_CASES.md`.

#### 4.4.4 Quy tắc thiết kế test case và cách đọc bảng

- **Hộp đen**: dùng cho API/Contract, E2E (tập trung input/output, status code, hành vi quan sát).
- **Hộp trắng**: dùng cho Unit test (bao phủ nhánh/điều kiện/handling).
- **Hộp xám**: dùng cho Integration (service ↔ DB, kiểm tra tính nhất quán dữ liệu).

Trong các bảng test case, cột **Ưu tiên** được xác định theo: _Impact_ (mức ảnh hưởng), _Likelihood_ (khả năng xảy ra), và _Exposure_ (mức phơi bày endpoint).

#### 4.4.5 Các kỹ thuật thiết kế test áp dụng cho KTPM

Để đảm bảo Chương 4 có tính “thiết kế” thay vì chỉ “liệt kê case”, nhóm áp dụng các kỹ thuật test design phổ biến và gắn trực tiếp vào module/endpoint của dự án:

1. **Phân lớp tương đương (Equivalence Partitioning – EP)**

- Áp dụng cho các input có miền giá trị rộng: email/password, quantity, limit/offset, status.
- Ví dụ: `POST /api/login` chia lớp: email hợp lệ/không hợp lệ; mật khẩu đúng/sai; account bị khoá.

2. **Giá trị biên (Boundary Value Analysis – BVA)**

- Áp dụng cho `quantity`, `limit`, `offset`, `price range`, và các ID.
- Ví dụ: `POST /api/add-shopcart` với `quantity` ở biên: 0, 1, giá trị lớn bất thường; hoặc thiếu field.

3. **Bảng quyết định (Decision Table)**

- Áp dụng cho **Auth/AuthZ** và các rule nhiều điều kiện.
- Ví dụ: truy cập admin endpoint phụ thuộc: (có token? token hợp lệ? role admin?) → 401/403/200.

4. **Chuyển trạng thái (State Transition)**

- Áp dụng cho luồng đơn hàng: pending → processing → shipped → completed/cancelled (tuỳ thiết kế).
- Thiết kế test case theo các transition hợp lệ/không hợp lệ (ví dụ: không cho nhảy từ pending → completed nếu thiếu bước xử lý).

5. **Negative testing & robustness**

- Thiết kế các test case “xấu” bắt buộc có trong baseline: thiếu token, token sai, thiếu field, id không tồn tại, dữ liệu rỗng.
- Nhóm test API-contract hiện tại tập trung mạnh vào lớp này để đảm bảo backend “fail đúng cách” (status code + errCode).

### 4.5 PHÂN TÍCH KỸ THUẬT NÂNG CAO (4 trang)

#### 4.5.1 Khi nào dùng Manual Test vs Auto Test?

| Tiêu chí              | Manual Test                | Auto Test             |
| --------------------- | -------------------------- | --------------------- |
| **Khi nào dùng**      | UI/UX, Exploratory, Ad-hoc | Regression, Unit, API |
| **Chi phí ban đầu**   | Thấp                       | Cao                   |
| **Chi phí lâu dài**   | Cao                        | Thấp                  |
| **Tốc độ**            | Chậm                       | Nhanh                 |
| **Độ chính xác**      | Phụ thuộc người            | Cao                   |
| **Ví dụ trong dự án** | Test giao diện checkout    | Unit test authUtils   |

**Tỷ lệ đề xuất cho dự án:**

- 70% Automation (Unit + Integration + API)
- 30% Manual (UI/UX + Exploratory)

#### 4.5.2 AI hỗ trợ trong kiểm thử (có kiểm soát)

AI (ví dụ Copilot/ChatGPT) chỉ được dùng như **công cụ hỗ trợ** (gợi ý test ideas, gợi ý skeleton test), còn nội dung cuối cùng phải được nhóm tự kiểm chứng bằng chạy test thật + đối chiếu repo.

1. **Generate test cases từ requirements**

```
Prompt: "Viết test cases cho chức năng đăng nhập với:
- Email hợp lệ/không hợp lệ
- Password đúng/sai
- Account bị khóa"
```

2. **Generate test code**

```
Prompt: "Viết Jest test cho hàm calculateDiscount(price, percent)"
```

3. **Phân tích test coverage**

```
Prompt: "Phân tích test này có cover đủ edge cases không?"
```

#### 4.5.3 Tự động hoá quy trình triage khi CI fail (đã triển khai)

Trong dự án, nhóm triển khai cơ chế “fail là có người xử” ngay trên GitHub Actions:

- Khi job test FAIL: workflow tự **upload artifact logs** + tự **tạo GitHub Issue** và (nếu là PR) **comment vào PR**.
- Nếu quyền tạo Issue bị chặn: workflow fallback ghi vào `docs/CI_FAILURES.md` và tạo PR để lưu log.

Ý nghĩa đối với Chương 4: ngoài “thiết kế test case”, nhóm còn thiết kế **quy trình xử lý lỗi** (test triage) để đảm bảo CI/CD có giá trị thực tế.

### 4.6 TRIỂN KHAI TEST (6 trang) ⭐ ĐÃ LÀM

#### 4.6.1 Backend Unit Tests

**File: `authService.test.js`**

```javascript
// Ví dụ code trong báo cáo
describe("Auth Service - Password Hashing", () => {
  test("Should hash password correctly", async () => {
    const plainPassword = "myPassword123";
    const hashedPassword = await authService.hashPassword(plainPassword);

    expect(hashedPassword).not.toBe(plainPassword);
    expect(typeof hashedPassword).toBe("string");
  });
});
```

**Kết quả:**

- ✅ 9/9 tests pass
- ✅ 100% coverage

#### 4.6.2 Backend Integration Tests

**File: `orderService.test.js`**

```javascript
describe("Order Service - Integration", () => {
  test("Should create order successfully", async () => {
    const items = [{ id: 1, name: "Áo thun", price: 199000, quantity: 1 }];
    const order = await orderService.createOrder(1, items);

    expect(order.status).toBe("pending");
    expect(order.total).toBe(1000);
  });
});
```

#### 4.6.3 CI/CD Implementation

**Backend CI/CD Workflow:**

```yaml
# .github/workflows/backend-ci.yml (rút gọn)
jobs:
  test:
    services:
      mysql:
        image: mysql:8.0
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:unit -- --json --outputFile=ci-jest-unit.json
      - run: npm run test:integration -- --json --outputFile=ci-jest-integration.json
      - run: npm run test:db -- --json --outputFile=ci-jest-db.json
      - uses: actions/upload-artifact@v4
```

    #### 4.6.4 Triển khai môi trường demo bằng Railway (phục vụ kiểm thử hệ thống)

    Mục tiêu triển khai Railway trong đồ án là tạo **môi trường chạy thật** để:

    - Thực hiện smoke test sau deploy.
    - Thực hiện một số test case mức API/E2E trong điều kiện gần production.
    - Thu thập minh chứng (URL, logs, screenshots) đưa vào phần kết quả.

    **Kiến trúc triển khai đề xuất:**

    - 01 service Backend (Node.js) từ thư mục `ecomAPI/`.
    - 01 database MySQL (Railway plugin).
    - 01 service Frontend (React static) từ thư mục `eCommerce_Reactjs/`.

    **Biến môi trường tối thiểu (Backend):**

    - `PORT` (Railway tự cấp, backend lắng nghe theo env)
    - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
    - `JWT_SECRET`
    - `URL_REACT` (trỏ về URL frontend)

    **Biến môi trường tối thiểu (Frontend):**

    - `REACT_APP_BACKEND_URL` (trỏ về URL backend)

    **Lưu ý dữ liệu seed:**

    - Khi dùng MySQL plugin trên Railway, file `ecom.sql` không tự động import như Docker Compose.
    - Seed được thực hiện bằng cách kết nối DB và import thủ công (nội dung hướng dẫn xem `docs/RAILWAY_DEPLOY.md`).

    **Post-deploy smoke test (tối thiểu):**

    1. Gọi endpoint health/simple: `GET /` trả về “hello”.
    2. Test đăng nhập: `POST /api/login` (tài khoản seed) nhận token.
    3. Test browse: `GET /api/get-all-product-user` trả về danh sách.

    Kết quả smoke test (ảnh chụp Postman/Terminal + logs Railway) được dùng làm minh chứng cho mục 4.7.

### 4.7 KẾT QUẢ VÀ ĐÁNH GIÁ (3 trang)

Phần này tổng hợp kết quả dựa trên **minh chứng chạy thật** trong repo (logs/artifacts/Jest report). Các hình ảnh (screenshot GitHub Actions) có thể bổ sung khi chụp từ trang Actions.

#### 4.7.1 Tổng hợp kết quả backend (Jest/Supertest)

Nguồn: `ecomAPI/jest-results.json`.

| Hạng mục    | Giá trị |
| ----------- | ------- |
| Test suites | 17      |
| Total tests | 116     |
| PASS        | 109     |
| PENDING     | 7       |
| FAIL        | 0       |

Các test PENDING hiện nằm chủ yếu ở nhóm API-contract mock (ví dụ: TC43, TC44, TC52, TC53, TC55, TC57, TC58). Đây là các case đã có trong baseline nhưng chưa “đóng” đầy đủ bằng assert.

#### 4.7.2 Kết quả frontend (React tests) và E2E smoke (Cypress)

- Frontend unit test được chạy trong workflow `Frontend CI/CD` (step `npm test -- --coverage --watchAll=false`). Minh chứng là log step và artifact build.
- E2E smoke được tự động hoá bằng Cypress và **chạy trong CI** (workflow `Frontend CI/CD`) với các kịch bản:
  - `eCommerce_Reactjs/cypress/e2e/homepage.cy.js` (load trang)
  - `eCommerce_Reactjs/cypress/e2e/auth-login.cy.js` (login – stub API)
  - `eCommerce_Reactjs/cypress/e2e/shop-browse.cy.js` (browse shop – stub product list)
  - `eCommerce_Reactjs/cypress/e2e/cart-view.cy.js` (view cart – stub cart + shipping)

Ghi chú: các E2E smoke dùng `cy.intercept()` để stub API nhằm giảm phụ thuộc backend/DB và giảm flaky trên CI.

#### 4.7.3 Kết quả kiểm thử hiệu năng (k6)

Kịch bản k6 nằm trong `performance/k6/` gồm:

- `load-test.js`: mô phỏng duyệt sản phẩm + (tuỳ chọn) login và add-to-cart.
- `stress-test.js`: tăng tải để quan sát hệ thống dưới áp lực.

Mục tiêu phần này là chứng minh nhóm có artefact kiểm thử phi chức năng và có thể chạy lặp lại bằng cấu hình env (`BASE_URL`, `K6_USER_EMAIL`, `K6_USER_PASSWORD`).

#### 4.7.4 Defect/Lỗi đã phát hiện trong quá trình thiết kế & triển khai test

Trong quá trình bổ sung DB-real tests, nhóm phát hiện lỗi ở API `/api/get-detail-user-by-email` (service query sai + chưa export hàm) và đã sửa để endpoint hoạt động đúng. Đây là ví dụ của việc test design giúp “bóc” lỗi logic/service thay vì chỉ kiểm tra UI.

#### 4.7.5 Đánh giá và hạn chế

Điểm mạnh:

- Có **CI chạy thật** (backend + frontend), có logs/artifacts và cơ chế triage khi fail.
- Backend test có cả lớp **DB-real** (MySQL service trong CI), giúp tăng độ tin cậy.
- Có đủ lớp kiểm thử: unit/integration/api-contract + smoke + k6.

Hạn chế:

- Một số test case API-contract còn trạng thái **PENDING** (chưa assert đầy đủ).
- E2E Cypress mới ở mức smoke (login/browse/cart), chưa cover đầy đủ checkout/payment và các edge cases UI.

#### 4.7.6 Đề xuất cải tiến

- Chuyển các test PENDING thành PASS bằng cách hoàn thiện mock/controller hoặc chuyển sang DB-real khi phù hợp.
- Mở rộng Cypress theo các luồng High-risk (login → cart → checkout) và cân nhắc chạy nightly CI (không block PR).
- Bổ sung test security ở mức request validation (payload size, missing fields, rate limiting nếu có).

#### 4.7.7 So sánh với repo “điểm cao” (gap analysis về kiểm thử)

Phần này đối chiếu nhanh giữa repo của nhóm và repo “điểm cao” (tham khảo cấu trúc minh chứng Test Design + automated tests, đã tóm tắt tại `docs/CHUONG4_REFERENCE_ANALYSIS.md`). Mục tiêu là trả lời rõ: **nhóm đã có test tự động chưa, integration test tới đâu, và còn thiếu gì để “bắt kịp”**.

| Hạng mục              | Repo KTPM (repo hiện tại)                                                                                                                         | Repo “điểm cao” (tham khảo)                               | Nhận xét / khoảng cách                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Test design artefacts | Baseline test case + phụ lục + traceability (`docs/PHU_LUC_A_TEST_CASES.md`, `docs/tests/*.csv`)                                                  | Bộ template Office (Scenario/TestCase/TestReport) rõ form | Mình mạnh ở dạng text/CSV, nhưng yếu về “bộ template chuẩn” nếu GV ưu tiên hình thức Office           |
| Backend unit          | Có (Jest): `ecomAPI/tests/unit/*.test.js`                                                                                                         | Có (multi-layer)                                          | Tương đồng về ý tưởng; repo điểm cao thường có nhiều lớp/độ phủ rộng hơn                              |
| Integration / DB-real | Có DB-real với MySQL thật (gated `RUN_DB_TESTS=1`), có MySQL service trong CI: `ecomAPI/tests/integration/*.mysql.int.test.js` + workflow backend | Thường có integration đa lớp                              | Đây là điểm mạnh của KTPM vì có “run với DB thật” và có thể lặp lại trên CI                           |
| API contract / AuthZ  | Có contract tests (Supertest) tập trung auth/authz/roles: `ecomAPI/tests/api/*.contract.test.js`                                                  | Tuỳ repo; thường có integration/E2E                       | KTPM đang làm tốt phần “negative/authz” ở layer API                                                   |
| Frontend unit         | Có nhưng còn ít: `eCommerce_Reactjs/src/App.test.js`                                                                                              | Thường nhiều hơn (component/service)                      | Đây là gap lớn: thiếu test component/state/edge cases                                                 |
| E2E/UI                | Có Cypress E2E smoke (homepage/login/browse/cart) và **đã chạy trong CI**                                                                         | Thường có E2E/UI automation nhiều hơn (có thể Selenium)   | Đã có baseline tự động hoá UI; gap còn lại là mở rộng checkout/payment + tăng độ phủ luồng/edge cases |
| Performance           | Có k6 artefact: `performance/k6/load-test.js`, `performance/k6/stress-test.js`                                                                    | Có thể có performance scripts                             | Gap chủ yếu là “chạy & báo cáo định kỳ” (nightly/CI), không phải thiếu script                         |

Kết luận ngắn:

- Nhóm **đã có test tự động** (backend unit + integration + API-contract + DB-real) và có minh chứng chạy thật (report/log/CI).
- Nhóm “thua” repo điểm cao chủ yếu ở **E2E/UI** và **frontend unit tests**, cùng với phần **test design template (Office)** nếu xét về hình thức.

---

## 🎯 PHƯƠNG HƯỚNG TIẾP THEO

### Việc cần làm ngay:

| STT | Task                                   | Ưu tiên | Trạng thái         |
| --- | -------------------------------------- | ------- | ------------------ |
| 1   | Kiểm tra GitHub Actions pass           | 🔴 Cao  | ⏳ Đang chờ        |
| 2   | Chụp screenshot kết quả CI/CD          | 🔴 Cao  | ⏳ Chờ task 1      |
| 3   | Viết phần 4.1 Tổng quan (Word)         | 🟡 TB   | ⏳                 |
| 4   | Viết phần 4.2 V-Model (Word)           | 🟡 TB   | ⏳                 |
| 5   | Viết phần 4.4 Phương pháp (Word)       | 🟡 TB   | ⏳                 |
| 6   | Viết phần 4.5 Kỹ thuật nâng cao (Word) | 🟡 TB   | ⏳                 |
| 7   | Hoàn thiện phần 4.7 Kết quả (Word)     | 🔴 Cao  | ⏳ Chờ screenshots |

### Timeline đề xuất:

```
📅 TIMELINE HOÀN THÀNH CHƯƠNG 4

Tuần 1 (9-15/12):
├─ Ngày 1-2: Kiểm tra CI/CD, chụp screenshots
├─ Ngày 3-4: Viết 4.1 + 4.2 (5 trang)
└─ Ngày 5-7: Viết 4.4 + 4.5 (9 trang)

Tuần 2 (16-22/12):
├─ Ngày 1-2: Hoàn thiện 4.6 + 4.7 (9 trang)
├─ Ngày 3-4: Review, chỉnh sửa
└─ Ngày 5-7: Format Word, thêm hình ảnh

📌 Deadline: 22/12/2025
```

---

## 📊 TỔNG KẾT

### Đã hoàn thành:

| Hạng mục            | Chi tiết                                                         | Trạng thái |
| ------------------- | ---------------------------------------------------------------- | ---------- |
| Backend tests       | 116 tests (109 pass, 7 pending) theo `ecomAPI/jest-results.json` | ✅         |
| Code Coverage       | Có report (collectCoverageFrom utilities)                        | ✅         |
| Jest Config         | Coverage threshold 80%                                           | ✅         |
| Backend CI/CD       | GitHub Actions workflow                                          | ✅         |
| Frontend CI/CD      | GitHub Actions workflow                                          | ✅         |
| Auto Issue Creation | Khi test fail                                                    | ✅         |

### Chưa hoàn thành:

| Hạng mục            | Chi tiết                        | Trạng thái |
| ------------------- | ------------------------------- | ---------- |
| Verify CI/CD pass   | Chờ GitHub Actions              | ⏳         |
| Frontend Unit Tests | React components                | ⏳         |
| E2E Tests           | Cypress (đã đưa vào CI – smoke) | ✅         |
| Viết Word           | 27 trang                        | ⏳         |
| Screenshots         | CI/CD results                   | ⏳         |

---

## 📎 PHỤ LỤC

### A. Commands hữu ích

```bash
# Chạy unit tests
cd ecomAPI && npm run test:unit

# Chạy với coverage
cd ecomAPI && npm run test:unit -- --coverage

# Chạy integration tests
cd ecomAPI && npm run test:integration

# Xem coverage report
open ecomAPI/coverage/lcov-report/index.html
```

### B. Links quan trọng

- **GitHub Repo**: https://github.com/TranNam283/kiemthuphanmem
- **GitHub Actions**: https://github.com/TranNam283/kiemthuphanmem/actions
- **Coverage Report**: `ecomAPI/coverage/lcov-report/index.html`

### C. Files đã tạo

```
kiemthuphanmem/
├── .github/workflows/
│   ├── backend-ci.yml          ✅ CI/CD Backend
│   └── frontend-ci.yml         ✅ CI/CD Frontend
├── ecomAPI/
│   ├── src/utils/
│   │   ├── authUtils.js        ✅ Password, validation
│   │   ├── productUtils.js     ✅ Discount, filter, pagination
│   │   └── orderUtils.js       ✅ Order processing
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── authService.test.js      ✅ unit tests
│   │   │   ├── productService.test.js   ✅ unit tests
│   │   │   └── orderService.test.js     ✅ unit/integration tests
│   │   └── setup.js
│   └── jest.config.js          ✅ Coverage config
└── CHUONG4.md                  📄 File này
```

---

_Cập nhật lần cuối: 18/12/2025_
