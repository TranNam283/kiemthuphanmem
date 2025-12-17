# TESTING_REFACTOR_PLAN (redirect)

Báo cáo chính của đồ án nằm ở: `../TESTING_REFACTOR_PLAN.md`.

File này được giữ lại trong `docs/` để reviewer/giảng viên mở theo đường dẫn quen thuộc.

> Gợi ý trình bày (điền theo thực tế):

```text
fullstack-vitejs-books/
  frontend/                # UI + routing + state + services
  backend/                 # API + DB + auth + business
  tests/                   # unit/integration (tuỳ dự án)
  e2e/                     # E2E (Playwright/Cypress)
  docs/                    # tài liệu
  .github/workflows/       # CI chạy lint/test/build
  docker-compose.yml       # môi trường DB + app
  package.json             # scripts: test, test:e2e, lint...
```

### 2.2 Vai trò từng thư mục

- **Frontend**: giao diện, routing, gọi API, hiển thị danh sách sách/giỏ hàng/checkout.
- **Backend**: REST API (hoặc GraphQL), auth, nghiệp vụ (cart/order), kết nối DB.
- **Tests**:
  - Unit: test function/service/component nhỏ.
  - Integration: test API + DB (hoặc mock).
  - E2E: test theo luồng người dùng (login → chọn sách → giỏ → thanh toán).
- **Config/CI**: đảm bảo chạy được `lint/test/build` tự động, reproducible.

### 2.3 Công nghệ sử dụng (cần xác nhận theo dự án thực tế)

Danh mục cần ghi rõ trong báo cáo:

- Build tool: **Vite** (frontend).
- Frontend framework: React/Vue/Svelte (ghi đúng theo thực tế).
- Backend runtime: Node.js (Express/Nest/Fastify… ghi đúng).
- DB/ORM: MySQL/Postgres/Mongo + Prisma/Sequelize/TypeORM…
- Test framework:
  - Unit/Integration: Vitest/Jest + Testing Library/Supertest…
  - E2E: Playwright/Cypress.
- Quality tools: ESLint/Prettier + Husky/lint-staged (nếu có).

---

## 3. Kế hoạch & mức độ kiểm thử của dự án điểm cao (fullstack-vitejs-books)

### 3.1 Các loại kiểm thử đã có (khung đánh giá)

| Loại test   | Dấu hiệu nhận biết trong dự án                 | Mục tiêu                              |
| ----------- | ---------------------------------------------- | ------------------------------------- |
| Unit        | thư mục `__tests__`, `*.test.*`, `vitest/jest` | kiểm tra logic nhỏ, chạy nhanh        |
| Integration | test API với DB test hoặc mock                 | đảm bảo các module phối hợp đúng      |
| E2E         | thư mục `e2e/`, config Playwright/Cypress      | đảm bảo luồng mua hàng hoạt động thực |

### 3.2 Các chức năng thường được kiểm thử (ghi theo thực tế dự án)

- Auth: đăng ký/đăng nhập/đăng xuất, refresh token (nếu có)
- Catalog: xem danh sách sách, tìm kiếm/lọc, xem chi tiết
- Cart: thêm/xoá/cập nhật số lượng
- Checkout/Order: tạo đơn, tính tổng tiền, xác nhận thanh toán
- Admin (nếu có): CRUD sách, quản lý đơn

### 3.3 Nhận xét chất lượng kiểm thử (mẫu nhận xét)

**Điểm mạnh thường gặp**

- Có phân tầng test (Unit → Integration → E2E).
- Có script chạy test trong `package.json` và CI tự động chạy.
- Dữ liệu test tách riêng (seed/mock), ít phụ thuộc môi trường dev.

**Điểm còn thiếu thường gặp**

- Thiếu test cho lỗi biên: hết hàng, giá thay đổi, mã giảm giá sai…
- E2E chưa cover hết biến thể thanh toán/địa chỉ.
- Integration test phụ thuộc DB thật nhưng không có seed/cleanup ổn định.

---

## 4. Phân tích dự án của mình (ktpm)

### 4.1 Cấu trúc thư mục hiện tại

> Điền cây thư mục hiện tại của `ktpm` (các thư mục chính + điểm bất thường).

```text
ktpm/
  (liệt kê theo thực tế)
```

### 4.2 Những vấn đề tồn tại (cần nêu rõ theo 3 nhóm)

#### (A) Thiếu test ở đâu

- Chưa có (hoặc rất ít) **Unit test** cho:
  - xử lý giá/khuyến mãi/tính tổng tiền
  - validate input (đăng ký, checkout)
  - helpers/utils
- Chưa có **Integration test** cho API:
  - auth, cart, order, inventory
- Chưa có **E2E** cho luồng mua sách.

#### (B) Code tổ chức chưa hợp lý ở đâu (mẫu vấn đề hay gặp)

- Frontend gọi API rải rác, thiếu lớp `services/` hoặc `apiClient`.
- Backend gom quá nhiều logic vào controller, thiếu `service/usecase`.
- Thiếu chuẩn hoá lỗi (error handling) → khó test case lỗi.

#### (C) Thiếu tài liệu / thiếu config cho kiểm thử

- Thiếu `README` hướng dẫn chạy test.
- Thiếu `.env.test`/DB test riêng.
- Thiếu script `test`, `test:watch`, `test:e2e`, `coverage`.
- Thiếu CI chạy test khi push/pull request.

---

## 5. So sánh 2 dự án (bảng)

| Tiêu chí          | fullstack-vitejs-books                      | ktpm                | Nhận xét                                      |
| ----------------- | ------------------------------------------- | ------------------- | --------------------------------------------- |
| Cấu trúc thư mục  | Tách lớp rõ (frontend/backend/tests/config) | (điền theo thực tế) | ktpm cần chuẩn hoá để dễ mở rộng & test       |
| Kiểm thử          | Có/định hướng có Unit+Integration+E2E       | (điền theo thực tế) | ktpm cần ưu tiên E2E cho luồng mua sách       |
| Khả năng mở rộng  | Module hoá, chuẩn script/CI                 | (điền theo thực tế) | ktpm nên tách `services`, `modules`, `shared` |
| Mức độ hoàn thiện | Script build/test/deploy rõ                 | (điền theo thực tế) | ktpm bổ sung docs + pipeline test             |

---

## 6. Đề xuất cấu trúc thư mục mới cho ktpm

> Mục tiêu: tách rành mạch **source / tests / configs / docs** (không xoá code cũ; có thể “đóng gói” dần).

### 6.1 Cây thư mục đề xuất (chuẩn hoá theo mô hình dự án tham khảo)

```text
ktpm/
  apps/
    web/                       # frontend (Vite/React/Vue...)
      src/
        pages/
        components/
        services/              # gọi API
        hooks/
        utils/
      tests/                   # unit/component tests
    api/                       # backend
      src/
        modules/               # theo domain: auth, books, cart, orders
          auth/
            auth.controller.*
            auth.service.*
            auth.routes.*
            auth.schema.*      # validation
          books/
          cart/
          orders/
        db/
        middlewares/
        utils/
      tests/                   # unit/integration tests (API)
  e2e/                         # Playwright/Cypress
    specs/
    fixtures/
  docs/
    TEST_PLAN.md
    TEST_CASES.md
    REPORT.md
  configs/
    eslint/
    prettier/
  scripts/
    seed-db.*
  .github/workflows/
    ci.yml                     # lint + unit + integration + e2e (tuỳ)
  README.md
```

### 6.2 Quy ước thư mục theo mục đích

- **Source code**: `apps/web/src`, `apps/api/src`
- **Test**:
  - Unit/component: `apps/web/tests`, `apps/api/tests/unit`
  - Integration: `apps/api/tests/integration`
  - E2E: `e2e/specs`
- **Config**: `configs/*`, file cấu hình ở root (vite/jest/vitest/playwright)
- **Docs**: `docs/*` (kế hoạch test, test cases, báo cáo)

---

## 7. KẾ HOẠCH KIỂM THỬ ĐỀ XUẤT CHO ktpm (PHẦN QUAN TRỌNG)

### 7.1 Mục tiêu kiểm thử

- Đảm bảo các luồng chính của web bán sách hoạt động đúng:
  - đăng nhập → xem sách → thêm giỏ → checkout → tạo đơn
- Giảm lỗi hồi quy khi thay đổi UI/API.
- Tạo bằng chứng chất lượng (test report/coverage) cho đồ án.

### 7.2 Phạm vi kiểm thử

**In-scope**

- Frontend: UI hiển thị, gọi API đúng, validate form cơ bản.
- Backend: API auth/books/cart/orders; xử lý lỗi/biên.
- E2E: luồng mua sách end-to-end.

**Out-of-scope (tuỳ đồ án)**

- Load/Stress test lớn.
- Security pentest chuyên sâu (chỉ kiểm tra cơ bản: auth, input validation).

### 7.3 Các loại test cần có

#### Unit test (test gì)

- **Frontend**
  - component: render danh sách sách, trạng thái empty/loading/error
  - utils: format tiền, tính tổng giỏ hàng, validate input
- **Backend**
  - service/usecase: tính tổng đơn hàng, áp dụng giảm giá, kiểm tra tồn kho
  - validation schema: email/password/địa chỉ/quantity

#### Integration test (test gì)

- API endpoints (ưu tiên quan trọng):
  - `POST /login`
  - `GET /books`
  - `POST /cart/items`
  - `PATCH /cart/items/:id`
  - `POST /orders`
- Test với DB test hoặc mock repository:
  - kiểm tra transaction tạo đơn + trừ tồn kho (nếu có)
  - kiểm tra trả lỗi chuẩn (401/403/400/404)

#### E2E test (test luồng mua sách)

- Luồng chuẩn:
  1. Mở trang → đăng nhập
  2. Tìm/chọn sách → xem chi tiết
  3. Thêm vào giỏ → chỉnh số lượng
  4. Checkout → tạo đơn → hiển thị thành công
- Luồng lỗi:
  - login sai mật khẩu
  - hết hàng khi checkout
  - cart trống mà bấm thanh toán
  - network fail: hiển thị thông báo + retry

### 7.4 Danh sách test case tiêu biểu cho web bán sách

| Nhóm           | Test case           | Kỳ vọng                                          |
| -------------- | ------------------- | ------------------------------------------------ |
| Đăng nhập      | Sai mật khẩu        | Hiện lỗi, không tạo session/token                |
| Đăng nhập      | Đúng tài khoản      | Redirect đúng trang, lưu trạng thái đăng nhập    |
| Danh sách sách | Load trang list     | Hiển thị list; phân trang/lọc (nếu có) hoạt động |
| Chi tiết sách  | Mở detail           | Hiển thị đúng giá, mô tả, tồn kho                |
| Giỏ hàng       | Thêm sách           | Item xuất hiện, số lượng đúng, tổng tiền đúng    |
| Giỏ hàng       | Cập nhật số lượng   | Tổng tiền cập nhật; không cho quantity < 1       |
| Thanh toán     | Checkout thành công | Tạo order; hiển thị mã đơn/trạng thái            |
| Thanh toán     | Cart trống          | Chặn checkout, thông báo rõ ràng                 |

> Chuẩn bằng chứng đồ án: mỗi test case có **ID**, **precondition**, **steps**, **expected**, **actual**, **status**, **note** (có thể đặt ở `docs/TEST_CASES.md`).

---

## 8. Lộ trình cải tổ dự án ktpm

### Bước 1: Tổ chức lại thư mục (không phá vỡ code)

- Tạo cấu trúc mới (mục 6), sau đó **di chuyển dần theo module**.
- Chuẩn hoá scripts chạy dự án + test.
- Tách cấu hình môi trường dev/test (`.env`, `.env.test`).

### Bước 2: Bổ sung test (ưu tiên theo giá trị)

- Ưu tiên **E2E 1 luồng mua sách** để demo (độ thuyết phục cao).
- Sau đó thêm Integration tests cho API “đường sống” (auth/cart/orders).
- Cuối cùng bổ sung Unit tests cho utils/services quan trọng.

### Bước 3: Hoàn thiện tài liệu & báo cáo

- Viết hướng dẫn chạy test trong `README`.
- Xuất test report/coverage (đính kèm trong báo cáo).
- Chụp màn hình CI pass (nếu có) làm minh chứng.

---

## 9. Kết luận

### Giá trị đạt được nếu áp dụng theo kế hoạch này

- Dự án **dễ bảo trì, dễ mở rộng**, giảm rủi ro lỗi hồi quy.
- Có **bộ test** chứng minh chất lượng (đúng tinh thần môn Kiểm thử phần mềm).
- Demo thuyết phục: “có test chạy được” thay vì chỉ mô tả.

### Phù hợp với đồ án Kiểm thử phần mềm

- Đáp ứng đủ: kế hoạch test → thiết kế test case → thực thi test (Unit/Integration/E2E) → báo cáo kết quả.
- Trình bày rõ ràng theo chuẩn tài liệu nộp giảng viên.

---
