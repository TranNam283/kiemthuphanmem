# CHƯƠNG 4. THIẾT KẾ KIỂM THỬ VÀ CI/CD

> **Đồ án môn**: Kiểm thử phần mềm  
> **Dự án**: eCommerce Full Stack (React.js + Node.js + MySQL)  
> **Cập nhật**: 08/12/2025  
> **Số trang mục tiêu**: 25-30 trang (chiếm ~30% của 80 trang tổng)

---

## 📋 MỤC LỤC CHƯƠNG 4

| STT | Nội dung                         | Số trang     | Trạng thái           |
| --- | -------------------------------- | ------------ | -------------------- |
| 4.1 | Tổng quan                        | 2 trang      | ⏳ Cần viết          |
| 4.2 | Phân tích khung nhìn V-Model     | 3 trang      | ⏳ Cần viết          |
| 4.3 | Phân tích khung nhìn Agile/CI-CD | 4 trang      | ✅ **ĐÃ TRIỂN KHAI** |
| 4.4 | Phân tích khung nhìn phương pháp | 5 trang      | ⏳ Cần viết          |
| 4.5 | Phân tích kỹ thuật nâng cao      | 4 trang      | ⏳ Cần viết          |
| 4.6 | Triển khai Test (Implementation) | 6 trang      | ✅ **ĐÃ TRIỂN KHAI** |
| 4.7 | Kết quả và đánh giá              | 3 trang      | ⏳ Đợi CI/CD pass    |
|     | **TỔNG**                         | **27 trang** |                      |

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

**Kết quả chạy thật (local, khi tắt DB-real / `RUN_DB_TESTS=0`): 9 test suites – 88 tests – PASS** (các suite DB-real sẽ bị skip).

Ngoài ra có thêm nhóm **DB thật (MySQL qua Docker)**, chỉ chạy khi bật biến môi trường `RUN_DB_TESTS=1` (mặc định sẽ bị skip để tránh fail khi chưa có DB):

- Khi bật DB thật (`RUN_DB_TESTS=1`): tổng **19 test suites – 122 tests – GREEN** (trong đó **106 PASS**, **16 SKIP** là các test mock đã được “chuyển” sang DB-real để tránh chạy trùng khi bật DB).
- DB-real: **10 suites – 34 tests – PASS** (Auth + User/Admin + User/Profile + Product list/detail/admin/new/feature + Allcode + ShopCart + Order + Voucher)

Phân loại theo nhóm test (tính theo số lượng tests **PASS** trong Jest report khi bật DB):

- Unit: **32**
- API-Contract/Mocked (Supertest + mock controllers/DB): **34**
- Integration (không DB): **6**
- Integration DB-real (MySQL): **34**

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

✅ Coverage threshold (80%) - PASSED
```

---

### 4. GitHub Actions Workflow Status

| Workflow       | Status         | Lần cuối chạy |
| -------------- | -------------- | ------------- |
| Backend CI/CD  | ⏳ Đang verify | 08/12/2025    |
| Frontend CI/CD | ⏳ Đang verify | 08/12/2025    |

**Link kiểm tra**: https://github.com/TranNam283/kiemthuphanmem/actions

---

## NỘI DUNG CHI TIẾT (PHỤC VỤ WORD)

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

- **78 test case đã hiện thực và có kết quả PASS**: gồm Unit/Integration (TC01–TC27) và API-Contract ưu tiên High/Medium (ví dụ: TC28–TC29, TC32–TC35, TC38–TC39, TC40–TC44, TC45–TC51, TC52–TC53, TC54–TC55, TC57–TC61, TC62–TC68, TC69–TC74, TC75–TC79, TC80–TC82, TC89).
- **12 test case ở trạng thái thiết kế (planned)**: còn lại trong TC28–TC90, ưu tiên hiện thực theo rủi ro (High trước).

Danh sách test case chi tiết (ID, mục tiêu, dữ liệu, expected, loại test, kỹ thuật, ưu tiên) được trình bày tại: `docs/PHU_LUC_A_TEST_CASES.md`.

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

| Giai đoạn thiết kế | Giai đoạn test      | Test đã triển khai             |
| ------------------ | ------------------- | ------------------------------ |
| Requirements       | Acceptance Testing  | ⏳ Manual testing              |
| System Design      | System Testing      | ⏳ E2E (Cypress)               |
| Architecture       | Integration Testing | ✅ orderService.test.js        |
| Module Design      | Unit Testing        | ✅ authService, productService |

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

#### 4.2.4 Mapping test case ↔ test scripts (minh chứng tự động hoá)

Để đảm bảo Chương 4 có tính “thiết kế → triển khai”, các test case đã hiện thực được ánh xạ trực tiếp đến file test (tự động hoá):

- **TC35, TC51, TC54, TC59, TC62** → `ecomAPI/tests/api/authz.contract.test.js`
- **TC38–TC39, TC45–TC50, TC80–TC82, TC89** → `ecomAPI/tests/api/authz.roles.contract.test.js`
- **TC40–TC44** → `ecomAPI/tests/api/product.contract.test.js`
- **TC52–TC53, TC55, TC57–TC58, TC60–TC61, TC63–TC74, TC75–TC79** → `ecomAPI/tests/api/cart-order-voucher.contract.test.js`

Các test này tập trung vào **contract + middleware auth/authz** (status code + rule phân quyền). Phần nghiệp vụ/DB (tạo sản phẩm, voucher, …) vẫn được giữ trong nhóm test planned hoặc cần môi trường DB để triển khai đầy đủ.

#### 4.2.3 Tiêu chí chấp nhận theo mức kiểm thử

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

- **TC01–TC27**: đã hiện thực (Unit/Integration) và có kết quả PASS.
- **TC28–TC90**: test case thiết kế (planned) cho API/Contract, Integration, System/E2E và phi chức năng, ưu tiên theo ma trận rủi ro.

Toàn bộ danh sách test case (có mô tả cụ thể theo bảng) được trình bày tại: `docs/PHU_LUC_A_TEST_CASES.md`.

#### 4.4.4 Quy tắc thiết kế test case và cách đọc bảng

- **Hộp đen**: dùng cho API/Contract, E2E (tập trung input/output, status code, hành vi quan sát).
- **Hộp trắng**: dùng cho Unit test (bao phủ nhánh/điều kiện/handling).
- **Hộp xám**: dùng cho Integration (service ↔ DB, kiểm tra tính nhất quán dữ liệu).

Trong các bảng test case, cột **Ưu tiên** được xác định theo: _Impact_ (mức ảnh hưởng), _Likelihood_ (khả năng xảy ra), và _Exposure_ (mức phơi bày endpoint).

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

#### 4.5.2 AI trong kiểm thử

**Cách sử dụng ChatGPT/Copilot:**

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

#### 4.5.3 Tự động hóa quy trình (n8n, Make.com)

```
┌─────────────────────────────────────────────────────────────┐
│              n8n WORKFLOW - TEST AUTOMATION                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   [GitHub Webhook]                                           │
│        ↓                                                     │
│   [Trigger Test Suite]                                       │
│        ↓                                                     │
│   [Parse Test Results]                                       │
│        ↓                                                     │
│   ┌─────────┬─────────┐                                     │
│   │  PASS   │  FAIL   │                                     │
│   └────┬────┴────┬────┘                                     │
│        ↓         ↓                                          │
│   [Slack OK] [Slack Alert + Create Jira Ticket]             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

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
    const items = [{ id: 1, name: "Laptop", price: 1000, quantity: 1 }];
    const order = await orderService.createOrder(1, items);

    expect(order.status).toBe("pending");
    expect(order.total).toBe(1000);
  });
});
```

#### 4.6.3 CI/CD Implementation

**Backend CI/CD Workflow:**

```yaml
# .github/workflows/backend-ci.yml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
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

> ⏳ **CHỜ CẬP NHẬT SAU KHI CI/CD PASS**

**Dự kiến nội dung:**

- Screenshot GitHub Actions pass ✅
- Coverage report
- Bảng tổng hợp test results
- Lessons learned
- Đề xuất cải tiến

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

| Hạng mục            | Chi tiết                | Trạng thái |
| ------------------- | ----------------------- | ---------- |
| Backend Unit Tests  | 32 tests, 100% pass     | ✅         |
| Code Coverage       | 100% trên utility files | ✅         |
| Jest Config         | Threshold 80%           | ✅         |
| Backend CI/CD       | GitHub Actions workflow | ✅         |
| Frontend CI/CD      | GitHub Actions workflow | ✅         |
| Auto Issue Creation | Khi test fail           | ✅         |

### Chưa hoàn thành:

| Hạng mục            | Chi tiết                | Trạng thái |
| ------------------- | ----------------------- | ---------- |
| Verify CI/CD pass   | Chờ GitHub Actions      | ⏳         |
| Frontend Unit Tests | React components        | ⏳         |
| E2E Tests           | Cypress (đã bỏ khỏi CI) | ⚠️         |
| Viết Word           | 27 trang                | ⏳         |
| Screenshots         | CI/CD results           | ⏳         |

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
│   │   │   ├── authService.test.js      ✅ 9 tests
│   │   │   ├── productService.test.js   ✅ 12 tests
│   │   │   └── orderService.test.js     ✅ (Integration)
│   │   └── setup.js
│   └── jest.config.js          ✅ Coverage config
└── CHUONG4.md                  📄 File này
```

---

_Cập nhật lần cuối: 08/12/2025_
