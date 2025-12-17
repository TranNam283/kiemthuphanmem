# TESTING_REFACTOR_PLAN — KTPM (Web bán quần áo)

## 0) Tình trạng triển khai (cập nhật theo branch `chore/testing-refactor`)

### 0.1) Mình đã làm được gì (đã commit)

- **CI không còn “pass giả” do `--passWithNoTests`**: đã bỏ flag này khỏi workflow frontend và chuyển sang fail khi không có test.
- **Đã có frontend unit test tối thiểu chạy được**: tạo `eCommerce_Reactjs/src/App.test.js` (React Testing Library) để chứng minh CI chạy test thật.
- **Khi CI fail → tự tạo Issue + comment PR + upload log** (backend & frontend): đã chèn bước upload artifact + tạo Issue bằng `actions/github-script@v7` + comment PR nếu là PR run.
- **Fallback khi không tạo được Issue**: tạo file `docs/CI_FAILURES.md` để lưu lỗi (workflow còn cố tạo PR lưu file bằng `peter-evans/create-pull-request@v6`).
- **Mang artefact dự án “điểm cao” về ktpm** (không placeholder): copy `fullstack-vitejs-books/docs/tests/*` sang `docs/reference-tests/` và copy k6 scripts sang `performance/k6/`.
- **Traceability dạng file**: tạo `docs/tests/test-cases.csv` và `docs/tests/traceability.csv` để map requirement → test → CI job.

Các file/workflow liên quan (đều tồn tại trong repo ktpm):

- Workflows: `.github/workflows/backend-ci.yml`, `.github/workflows/frontend-ci.yml`
- Fallback logs: `docs/CI_FAILURES.md`
- Docs tham chiếu: `docs/reference-tests/`
- Performance: `performance/k6/`
- Traceability: `docs/tests/test-cases.csv`, `docs/tests/traceability.csv`

### 0.2) Bước tiếp theo (ưu tiên)

1. Hoàn thiện nội dung **CI strict rationale (C)** + **Agile analysis (D)** + **V-Model mapping & verification list (E)** ngay trong file này để giảng viên đọc một lần là thấy đủ bằng chứng.
2. (Tuỳ chọn) Tách job `test:db` (MySQL real) ra job riêng để tăng độ tin cậy regression (hiện tại đang chạy chung trong job backend `test`).

---

## 9) WHY: Vì sao CI fail phải tự tạo Issue (C)

- **Traceability**: Issue gắn trực tiếp vào `Run URL` + `Commit SHA` giúp truy vết lỗi rõ ràng thay vì chỉ xem log “trôi” trong Actions.
- **Fast feedback + triage**: Khi fail tự tạo Issue + comment PR, nhóm nhìn thấy lỗi ngay ở đúng nơi làm việc (PR/Issues), tránh pipeline “xanh im lặng” hoặc fail bị bỏ quên.
- **Minh chứng chấm đồ án**: Giảng viên có thể xem lại lịch sử fail/pass như bằng chứng kiểm thử (Issue body + artifact logs) mà không cần hỏi lại nhóm.

---

## 10) Agile analysis & recommendation (D)

### 10.1) Evidence-based: hiện tại có đang theo Agile không?

**Dựa trên artefact trong repo ktpm:**

- Git history có một số commit dạng “fix nhanh/triage” (ví dụ các commit gần đây tập trung Railway/migration/bugfix). Đây là tín hiệu của vòng lặp feedback, nhưng **chưa đủ để kết luận Agile đầy đủ**.
- Repo **KHÔNG TỒN TẠI** `CODEOWNERS`.
- Repo **KHÔNG TỒN TẠI** `.github/ISSUE_TEMPLATE/*`.
- Repo **KHÔNG TỒN TẠI** artefact quản trị Agile trong filesystem như: `docs/sprint-*`, `docs/backlog.*`, file “Definition of Done”, hoặc config Project board.
- Dấu hiệu PR trong lịch sử ktpm rất ít (git log có 1 merge PR) → quy trình review/PR-based chưa rõ ràng.

**Đối chiếu repo tham chiếu fullstack-vitejs-books:**

- Git history có nhiều “Merge pull request #.. from .../dev” → có quy trình tách nhánh + PR + merge thường xuyên hơn.
- Có nhiều commit cập nhật tài liệu/test design → phù hợp mô hình đồ án “điểm cao” (tài liệu + kiểm thử đi kèm).

### 10.2) Khuyến nghị Agile tối giản cho đồ án (nên áp dụng)

- Sprint 1 tuần (nhóm sinh viên dễ theo): backlog nhỏ, ưu tiên bugfix + test.
- Roles: 1 bạn đóng vai PO (ưu tiên yêu cầu), 1 bạn Scrum Master (giữ nhịp), còn lại dev/test.
- WIP limit: tối đa 1–2 task/người.
- Definition of Done (DoD) tối thiểu:
  - Có test (backend hoặc frontend) cho thay đổi quan trọng.
  - CI xanh.
  - Có cập nhật tài liệu nếu thay đổi ảnh hưởng demo.

---

## 11) V-Model mapping & Verification (E)

### 11.1) V-Model (tóm tắt ngắn)

V-Model mapping kỳ vọng:

- Requirements ↔ Acceptance/System test
- System design ↔ System test
- Architecture ↔ Integration test
- Module design ↔ Unit test
- Implementation ↔ Code + Unit test

### 11.2) Mapping phase → artefact → verification (ktpm)

| Phase (V-Model)        | Artefact tương ứng trong ktpm                              | Verification hiện có                                                                         | Status  |
| ---------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------- |
| Requirements           | `README.md`, `docs/PHU_LUC_A_TEST_CASES.md`                | Acceptance/System test: **MISSING**                                                          | Missing |
| System design          | `docker-compose.yml` (hệ thống gồm mysql/backend/frontend) | System test tự động: **MISSING**                                                             | Missing |
| Architecture           | `ecomAPI/src` (services/controllers/models)                | Integration tests: `ecomAPI/tests/integration/*.mysql.int.test.js`                           | Present |
| Module design          | `ecomAPI/src/utils/*Utils.js`                              | Unit tests: `ecomAPI/tests/unit/*.test.js`                                                   | Present |
| Implementation         | `eCommerce_Reactjs/src` + `ecomAPI/src`                    | Frontend unit tests: `eCommerce_Reactjs/src/App.test.js`                                     | Present |
| API contract (bổ sung) | Routes/Controllers (backend)                               | API contract/smoke: `ecomAPI/tests/api/*.test.js`                                            | Present |
| E2E (bổ sung)          | UI flow end-to-end                                         | `eCommerce_Reactjs/cypress/e2e/homepage.cy.js` (spec) nhưng Cypress config/deps: **MISSING** | Missing |
| Performance (bổ sung)  | Non-functional                                             | `performance/k6/*` (đã copy từ repo tham chiếu)                                              | Present |

### 11.3) Verification checklist (đọc nhanh)

- [Present] Backend Unit: `ecomAPI/tests/unit/*.test.js` (CI: `.github/workflows/backend-ci.yml` job `test`)
- [Present] Backend Integration (DB-real): `ecomAPI/tests/integration/*.mysql.int.test.js` (CI: `.github/workflows/backend-ci.yml` chạy `npm run test:db`)
- [Present] Backend API contract/smoke: `ecomAPI/tests/api/*.test.js`
- [Present] Frontend Unit (smoke): `eCommerce_Reactjs/src/App.test.js`
- [Missing] E2E runnable: `eCommerce_Reactjs/cypress/e2e/*` có spec nhưng thiếu `cypress` dependency + `cypress.config.*`
- [Present] Performance scripts: `performance/k6/load-test.js`, `performance/k6/stress-test.js`

---

## 12) Notes & Tracing (F)

### 12.1) Requirement IDs tối giản (vì repo chưa có IDs chuẩn)

Repo ktpm hiện **KHÔNG TỒN TẠI** file định nghĩa Requirement IDs riêng; vì vậy dùng IDs tối giản cho đồ án:

- `REQ-AUTH-01`: Đăng ký
- `REQ-AUTH-02`: Đăng nhập
- `REQ-PROD-01`: Xem danh sách sản phẩm
- `REQ-PROD-02`: Xem chi tiết sản phẩm
- `REQ-CART-01`: Thêm giỏ (theo size)
- `REQ-ORDER-01`: Tạo đơn
- `REQ-VOUCHER-01`: Xem/claim voucher
- `REQ-ADMIN-01`: Admin xem danh sách user
- `REQ-FE-01`: Frontend load và hiển thị (smoke)

### 12.2) Traceability table (file-based)

- `docs/tests/test-cases.csv`: map requirement → test case name → source file.
- `docs/tests/traceability.csv`: map requirement → CI workflow/job.

## 1) Yêu cầu bài làm

- Mục tiêu: lập kế hoạch refactor kiểm thử (testing refactor plan) cho dự án **ktpm** (web bán quần áo), dựa trên đối chiếu với dự án tham chiếu **fullstack-vitejs-books**.
- Ràng buộc: toàn bộ nhận xét về “đã có / chưa có” phải dựa trên artefact có thật trong workspace. Nếu không tìm thấy artefact tương ứng thì ghi rõ **“KHÔNG TỒN TẠI”**.
- Phạm vi so sánh: kiểm thử + CI/CD + tài liệu test + công cụ hỗ trợ.

---

## 2) Dữ liệu đã đọc trực tiếp (cây thư mục + file/script)

### 2.1) Dự án ktpm (web bán quần áo)

**Thư mục chính:**

- `ecomAPI/` (Backend Node/Express/Sequelize)
- `eCommerce_Reactjs/` (Frontend React + CRACO)
- `.github/workflows/` (CI/CD)
- `docs/` (tài liệu test)

**Artefact liên quan testing/CI:**

- Backend tests:
  - `ecomAPI/tests/unit/`:
    - `authService.test.js`
    - `productService.test.js`
    - `orderService.test.js`
  - `ecomAPI/tests/api/`:
    - `app.smoke.test.js`
    - `product.contract.test.js`
    - `authz.contract.test.js`
    - `authz.roles.contract.test.js`
    - `cart-order-voucher.contract.test.js`
  - `ecomAPI/tests/integration/` (có test chạy MySQL thật theo tên file `*.mysql.int.test.js`):
    - `product.mysql.int.test.js`, `product.detail.mysql.int.test.js`, `product.admin.mysql.int.test.js`
    - `auth.mysql.int.test.js`
    - `shopcart.mysql.int.test.js`
    - `order.mysql.int.test.js`
    - `voucher.mysql.int.test.js`
    - `allcode.mysql.int.test.js`
    - `user.profile.mysql.int.test.js`, `user.admin.mysql.int.test.js`
  - `ecomAPI/tests/setup.js`
  - `ecomAPI/jest.config.js`
  - `ecomAPI/jest-results.json`
- Backend scripts:
  - `ecomAPI/package.json`:
    - `npm run test`, `npm run test:unit`, `npm run test:integration`, `npm run test:db`
- Frontend test/e2e:
  - `eCommerce_Reactjs/package.json` có script `test`: `craco test`
  - `eCommerce_Reactjs/cypress/e2e/homepage.cy.js` (file e2e mẫu)
  - `eCommerce_Reactjs/src/App.test.js`: **TỒN TẠI**
  - `eCommerce_Reactjs/**/cypress.config.*`: **KHÔNG TỒN TẠI**
  - `eCommerce_Reactjs/package.json` **KHÔNG có** dependency `cypress`: **KHÔNG TỒN TẠI**
- CI/CD:
  - `.github/workflows/backend-ci.yml`
  - `.github/workflows/frontend-ci.yml`
- Docker/DB phục vụ test/integration:
  - `docker-compose.yml` (có service `mysql`, `backend`, `frontend`)

**Artefact nghiệp vụ “quần áo/size/stock” dùng để thiết kế test:**

- Model size/tồn kho:
  - `ecomAPI/src/models/productDetailSize.js`
  - `ecomAPI/src/models/ProductDetail.js`
  - `ecomAPI/src/models/allcode.js` (liên kết size qua `ProductDetailSize`, alias `sizeData`)
  - `ecomAPI/src/models/ReceiptDetail.js` (nhập kho)
- Service xử lý size/stock:
  - `ecomAPI/src/services/productService.js` (tạo/đọc `ProductDetailSize`, tính `stock`)
  - `ecomAPI/src/services/shopCartService.js` (ràng buộc tồn kho khi add/update cart, dùng `productdetailsizeId`)
  - `ecomAPI/src/services/statisticService.js` (thống kê tồn kho, đọc `ReceiptDetail`)
- Nghiệp vụ “màu sắc biến thể” trong backend:
  - Từ khóa `color` trong `ecomAPI/src/**/*.js`: **KHÔNG TỒN TẠI**

### 2.2) Dự án fullstack-vitejs-books (dự án tham chiếu)

**Thư mục chính:**

- `backend/` (Spring Boot)
- `frontend/` (Vite + React + TypeScript)
- `.github/workflows/ci-cd.yml` (CI/CD)
- `performance/k6/` (k6 load/stress)
- `docs/tests/` (test plan/case/report dạng file Office)

**Artefact liên quan testing/CI:**

- Backend tests (Java):
  - `backend/src/test/java/com/bookstore/backend/controller/` (controller tests):
    - ví dụ: `CartControllerTest.java`, `OrderControllerTest.java`, `AuthControllerTest.java`, ...
  - `backend/src/test/java/com/bookstore/backend/service/` (service tests)
  - `backend/src/test/java/com/bookstore/backend/repository/` (repository tests)
  - `backend/src/test/java/com/bookstore/backend/integration/` (integration tests):
    - ví dụ: `OrderIntegrationTest.java`, `CartIntegrationTest.java`, ...
  - Selenium tests:
    - `backend/src/test/java/com/bookstore/backend/selenium/`: (có nhiều test selenium)
    - `backend/pom.xml` cấu hình `maven-surefire-plugin` **mặc định loại trừ** `**/selenium/**` và có profile `selenium` để chạy
- Backend dependencies/testing config:
  - `backend/pom.xml` có `spring-boot-starter-test`, `junit-jupiter`, `selenium-java`, `webdrivermanager`, `h2`
- Frontend scripts:
  - `frontend/package.json`: `dev`, `dev:test`, `build`, `lint`, `preview`
  - `frontend/package.json` script `test`: **KHÔNG TỒN TẠI**
  - `frontend/src/**/*.{test,spec}.ts(x)`: **KHÔNG TỒN TẠI**
  - `**/playwright.config.*`: **KHÔNG TỒN TẠI**
  - `**/cypress.config.*`: **KHÔNG TỒN TẠI**
- Performance:
  - `performance/k6/load-test.js`
  - `performance/k6/stress-test.js`
  - `performance/k6/hướng dẫn.txt`
- Test documentation:
  - `docs/tests/test plan.docx`
  - `docs/tests/test report.xlsx`
  - `docs/tests/unit test.xlsx`
  - `docs/tests/Test_Scenario.xlsx`
- CI/CD:
  - `.github/workflows/ci-cd.yml` chạy `mvn test`, build frontend, lint frontend; deploy qua Render

---

## 3) Phân tích hiện trạng kiểm thử & CI/CD

### 3.1) Hiện trạng ktpm

**Backend (ecomAPI — Jest/Supertest):**

- Có test tự động theo 3 nhóm:
  - Unit: `ecomAPI/tests/unit/*.test.js`
  - API contract/smoke (không cần DB thật): `ecomAPI/tests/api/*.test.js`
  - Integration với MySQL thật: `ecomAPI/tests/integration/*.mysql.int.test.js` (kích hoạt qua script `test:db`)
- Script chạy test:
  - `ecomAPI/package.json`:
    - `test`: `jest --coverage`
    - `test:unit`: chạy `tests/unit`
    - `test:integration`: chạy `tests/integration`
    - `test:db`: `RUN_DB_TESTS=1` + `--testMatch "**/*.mysql.int.test.js"`
- Ngưỡng coverage:
  - `ecomAPI/jest.config.js` có `coverageThreshold.global` = 80% (branches/functions/lines/statements)
- Báo cáo test có sẵn:
  - `ecomAPI/jest-results.json` ghi nhận: `17` test suites, `116` tests, `109` passed, `7` pending

**Frontend (eCommerce_Reactjs — React/CRACO):**

- Script test tồn tại: `eCommerce_Reactjs/package.json` có `test`: `craco test`.
- Unit test trong source:
  - `eCommerce_Reactjs/src/App.test.js`: **TỒN TẠI**
- E2E:
  - Có file Cypress mẫu `eCommerce_Reactjs/cypress/e2e/homepage.cy.js`
  - Nhưng cấu hình Cypress và dependency Cypress:
    - `eCommerce_Reactjs/**/cypress.config.*`: **KHÔNG TỒN TẠI**
    - `eCommerce_Reactjs/package.json` dependency `cypress`: **KHÔNG TỒN TẠI**

**CI/CD (GitHub Actions):**

- Backend workflow: `.github/workflows/backend-ci.yml`
  - Có MySQL service (`mysql:8.0`) và chạy `npm run test:unit`, `npm run test:integration`
  - Có chạy DB-real: `npm run test:db`
  - Có job `security-scan` chạy `npm audit`
- Frontend workflow: `.github/workflows/frontend-ci.yml`
  - Chạy `npm test -- --coverage --watchAll=false` (không `--passWithNoTests`)
  - Có build `npm run build`

**Nhận xét hiện trạng (tập trung vào quần áo/size/stock):**

- Dự án đã có mô hình size và tồn kho (qua `ProductDetailSize`, `ReceiptDetail`) và đã có test backend chạm vào nghiệp vụ này, ví dụ test DB của cart dùng `productdetailsizeId`.
- Nghiệp vụ “màu sắc biến thể” trong backend: **KHÔNG TỒN TẠI** (không tìm thấy `color` trong `ecomAPI/src/**/*.js`).

### 3.2) Hiện trạng fullstack-vitejs-books (tham chiếu)

**Backend (Spring Boot — JUnit/SpringBootTest/MockMvc):**

- Test tự động phong phú theo lớp:
  - Controller tests: `backend/src/test/java/com/bookstore/backend/controller/*.java`
  - Service tests: `backend/src/test/java/com/bookstore/backend/service/*.java`
  - Repository tests: `backend/src/test/java/com/bookstore/backend/repository/*.java`
  - Integration tests: `backend/src/test/java/com/bookstore/backend/integration/*.java`
- Selenium UI tests:
  - Tồn tại trong `backend/src/test/java/com/bookstore/backend/selenium/`
  - Mặc định không chạy theo `backend/pom.xml` (surefire excludes `**/selenium/**`)
  - Có profile `selenium` để chạy

**Frontend (Vite/React/TS):**

- Có lint (`npm run lint`) và build (`npm run build`).
- Test frontend tự động:
  - Script `test`: **KHÔNG TỒN TẠI**
  - File test trong `frontend/src`: **KHÔNG TỒN TẠI**
  - Playwright/Cypress config: **KHÔNG TỒN TẠI**

**Performance:**

- Có k6 scripts: `performance/k6/load-test.js`, `performance/k6/stress-test.js`.

**CI/CD:**

- `.github/workflows/ci-cd.yml` chạy:
  - Backend: `mvn spotless:check`, `mvn test`
  - Frontend: `npm run build`, `npm run lint`
  - Deploy: trigger Render

---

## 4) Bảng so sánh (ktpm vs fullstack-vitejs-books)

| Hạng mục                                 | ktpm (quần áo)                                                                                                  | fullstack-vitejs-books (tham chiếu)                                         |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------- |
| Backend unit test                        | TỒN TẠI: `ecomAPI/tests/unit/*.test.js`                                                                         | TỒN TẠI: `backend/src/test/java/.../service/*Test.java` (và nhiều lớp khác) |
| Backend integration test (DB thật)       | TỒN TẠI: `ecomAPI/tests/integration/*.mysql.int.test.js` + script `ecomAPI/package.json:test:db`                | TỒN TẠI: `backend/src/test/java/.../integration/*IntegrationTest.java`      |
| Backend API contract/smoke               | TỒN TẠI: `ecomAPI/tests/api/*.test.js`                                                                          | KHÔNG TỒN TẠI (không có thư mục/artefact tương đương trong repo)            |
| Backend coverage gate                    | TỒN TẠI: `ecomAPI/jest.config.js` đặt threshold 80%                                                             | KHÔNG TỒN TẠI (không thấy cấu hình coverage plugin trong `backend/pom.xml`) |
| Frontend unit test (file test trong src) | TỒN TẠI: `eCommerce_Reactjs/src/App.test.js`                                                                    | KHÔNG TỒN TẠI: `frontend/src/**/*.{test,spec}.ts(x)`                        |
| Frontend test script                     | TỒN TẠI: `eCommerce_Reactjs/package.json` có `test: craco test`                                                 | KHÔNG TỒN TẠI: `frontend/package.json` không có script `test`               |
| E2E runner (Cypress/Playwright)          | File spec TỒN TẠI: `eCommerce_Reactjs/cypress/e2e/homepage.cy.js`; cấu hình & dependency Cypress: KHÔNG TỒN TẠI | KHÔNG TỒN TẠI: không có Cypress/Playwright config                           |
| Performance test                         | TỒN TẠI: `performance/k6/load-test.js`, `performance/k6/stress-test.js`                                         | TỒN TẠI: `performance/k6/load-test.js`, `performance/k6/stress-test.js`     |
| Security scan trong CI                   | TỒN TẠI: `.github/workflows/backend-ci.yml` job `security-scan` chạy `npm audit`                                | KHÔNG TỒN TẠI (workflow không có job security scan riêng)                   |
| CI chạy test backend                     | TỒN TẠI: `.github/workflows/backend-ci.yml` chạy Jest                                                           | TỒN TẠI: `.github/workflows/ci-cd.yml` chạy `mvn test`                      |
| CI chạy test frontend                    | TỒN TẠI: `.github/workflows/frontend-ci.yml` chạy `npm test` (không `--passWithNoTests`)                        | KHÔNG TỒN TẠI (workflow chỉ build+lint frontend)                            |
| Tài liệu test (manual)                   | TỒN TẠI: `docs/PHU_LUC_A_TEST_CASES.md`                                                                         | TỒN TẠI: `docs/tests/\*.docx                                                | \*.xlsx` |

---

## 5) Kế hoạch refactor kiểm thử cho ktpm (tập trung web bán quần áo)

### 5.1) Mục tiêu refactor

- Tăng độ tin cậy regression cho nghiệp vụ trọng tâm: **sản phẩm + size + tồn kho + giỏ hàng + đặt hàng + voucher + thanh toán**.
- Chuẩn hóa chiến lược test theo tầng: unit → contract → integration (DB) → e2e (sau).
- Làm CI “đáng tin”: tránh chạy “passWithNoTests” mà không có test; tránh phụ thuộc ngầm vào môi trường.

### 5.2) Hiện trạng cần chỉnh (theo artefact)

- Trước đây frontend workflow dùng `--passWithNoTests` và không có test file → CI có thể xanh dù không test. Hiện đã bỏ flag và đã có `eCommerce_Reactjs/src/App.test.js` để CI chạy test thật.
- Cypress spec có file nhưng thiếu dependency/config → E2E chưa chạy được bằng script/CI.
- Backend coverage threshold có trong `ecomAPI/jest.config.js` nhưng chỉ collect từ `src/utils/*Utils.js` → phạm vi coverage chưa bao trùm logic chính ở `src/services/*`.

### 5.3) Refactor theo giai đoạn (ưu tiên theo rủi ro)

**Giai đoạn A — Củng cố backend regression (ưu tiên cao):**

- Mở rộng phạm vi collect coverage:
  - Hiện tại `ecomAPI/jest.config.js` chỉ cover 3 file util.
  - Đề xuất bổ sung (hiện tại KHÔNG TỒN TẠI trong config): thêm `src/services/**/*.js` và `src/controllers/**/*.js` vào `collectCoverageFrom`.
- DB-real tests trong CI:
  - Hiện có `test:db` và các file `*.mysql.int.test.js`.
  - CI hiện đã chạy `npm run test:db` trong `.github/workflows/backend-ci.yml` (cùng job backend `test`).
  - (Tuỳ chọn) Tách riêng thành job `db-tests` theo lịch/nhánh để giảm thời gian CI cho PR nhỏ.
- Chuẩn hóa naming/nhóm test để dễ đọc báo cáo:
  - Hiện đang trộn `orderService.test.js` trong `tests/integration/` và `tests/unit/`.

**Giai đoạn B — Kích hoạt E2E chạy được (ưu tiên trung bình):**

- Cypress:
  - Hiện có `eCommerce_Reactjs/cypress/e2e/homepage.cy.js` nhưng không có `cypress` dependency và không có `cypress.config.*`.
  - Đề xuất bổ sung: cài Cypress + thêm config + thêm script `e2e` trong `eCommerce_Reactjs/package.json` (hiện tại KHÔNG TỒN TẠI).

**Giai đoạn C — Frontend unit test (ưu tiên trung bình/thấp):**

- Dự án đã có `@testing-library/react` / `@testing-library/jest-dom` trong dependency.
- Hiện đã có test tối thiểu: `eCommerce_Reactjs/src/App.test.js` (smoke), nhưng coverage hành vi người dùng vẫn còn thấp.
- Đề xuất tạo test tối thiểu cho các trang/flow trọng điểm (phần 6).

---

## 6) Bộ test cần bổ sung cho ktpm (đúng nghiệp vụ quần áo: size + tồn kho)

### 6.1) Backend — test trọng tâm size/tồn kho

**Cơ sở code hiện hữu:**

- Size & tồn kho đi qua `ProductDetailSize` và các service:
  - `ecomAPI/src/services/productService.js`
  - `ecomAPI/src/services/shopCartService.js`
  - `ecomAPI/src/services/statisticService.js`

**Đề xuất bổ sung test (hiện tại KHÔNG TỒN TẠI trong `ecomAPI/tests/*`):**

- Quy tắc tồn kho khi thêm giỏ:
  - Tình huống: add `productdetailsizeId` với `quantity > stock` phải trả thông báo kiểu “Chỉ còn X sản phẩm” (logic nằm trong `shopCartService.js`).
- Quy tắc tồn kho khi cập nhật giỏ:
  - Tình huống: tăng số lượng trong cart vượt tồn kho phải bị chặn.
- Quy tắc tính tồn kho từ nhập kho:
  - Tình huống: có `ReceiptDetail` (nhập kho) → thống kê tồn kho trả đúng.

### 6.2) Backend — test bảo mật/role (đang có, cần mở rộng)

**Đang có:**

- `ecomAPI/tests/api/authz.contract.test.js`
- `ecomAPI/tests/api/authz.roles.contract.test.js`

**Đề xuất bổ sung (hiện tại KHÔNG TỒN TẠI):**

- Kiểm thử chặn truy cập theo role trên các API nhạy cảm khác (ví dụ: nhập kho/phiếu nhập liên quan `Receipt`/`ReceiptDetail`).

### 6.3) Frontend — test tối thiểu theo hành vi người dùng

**Hiện trạng:**

- `eCommerce_Reactjs/src` không có file test.

**Đề xuất bổ sung (file mới):**

- Test hiển thị danh sách sản phẩm và trạng thái loading/empty.
- Test chọn size (dựa trên dữ liệu backend trả về `productDetailSize` / `sizeData`) và thêm vào giỏ.
- Test xử lý lỗi “Chỉ còn X sản phẩm” khi thêm giỏ.

### 6.4) E2E — nâng từ “file mẫu” thành “pipeline chạy được”

**Hiện trạng:**

- Cypress spec: `eCommerce_Reactjs/cypress/e2e/homepage.cy.js`.

**Đề xuất tối thiểu (hiện tại KHÔNG TỒN TẠI):**

- Flow E2E: đăng ký → đăng nhập → xem sản phẩm → chọn size → add cart → checkout (tối giản).

### 6.5) Hiệu năng

- Repo ktpm không có k6/jmeter script: **KHÔNG TỒN TẠI**.
- Đề xuất tham chiếu từ dự án books:
  - `fullstack-vitejs-books/performance/k6/load-test.js`
  - `fullstack-vitejs-books/performance/k6/stress-test.js`

---

## 7) Lộ trình triển khai + đo lường chất lượng

### 7.1) Chỉ số đo lường

- Backend:
  - Giữ ngưỡng coverage ≥ 80% (đang có trong `ecomAPI/jest.config.js`) và mở rộng phạm vi coverage vào `src/services`.
  - Theo dõi số test pending (đang có 7 pending trong `ecomAPI/jest-results.json`).
- Frontend:
  - Mục tiêu có ít nhất 1–3 test file thật trong `eCommerce_Reactjs/src` để tránh CI “xanh nhưng không test”.

### 7.2) Checklist hoàn thành

- CI backend chạy ổn định unit + integration (đã có).
- Có job chạy DB-real `test:db` (đã có trong `.github/workflows/backend-ci.yml`).
- Cypress chạy được bằng script và có config (hiện tại KHÔNG TỒN TẠI).
- Frontend có test file thật (hiện tại KHÔNG TỒN TẠI).

---

## Phụ lục: Lệnh chạy test (từ script hiện có)

### ktpm

- Backend:

  - `cd ecomAPI`
  - `npm run test`
  - `npm run test:unit`
  - `npm run test:integration`
  - `npm run test:db`

- Frontend:
  - `cd eCommerce_Reactjs`
  - `npm test`

### fullstack-vitejs-books

- Backend:

  - `cd backend`
  - `mvn test`
  - (Selenium) `mvn test -Pselenium`

- Frontend:
  - `cd frontend`
  - `npm run build`
  - `npm run lint`
  - Test frontend: **KHÔNG TỒN TẠI**

---

## 8) CI strict (A, B) — siết luật + tự tạo Issue/comment PR

### 8.1) Scan workflow hiện tại (jobs/services/scripts/flags)

**Backend**: `.github/workflows/backend-ci.yml`

- Jobs:
  - `test` (có service `mysql:8.0`)
  - `security-scan` (npm audit)
  - `build`, `deploy`, `create-issue-on-failure` (job legacy)
- Scripts chạy test:
  - `npm run test:unit` (đã bọc thêm `--json --outputFile=ci-jest-unit.json` và log `tee ci-backend-unit.log`)
  - `npm run test:integration -- --no-coverage` (đã bọc thêm `--json --outputFile=ci-jest-integration.json` và log `tee ci-backend-integration.log`)

**Frontend**: `.github/workflows/frontend-ci.yml`

- Jobs:
  - `test`
  - `create-issue-on-failure` (job legacy)
- Script chạy test và flag:
  - Trước khi siết: `npm test -- --coverage --watchAll=false --passWithNoTests` (flag này làm CI “xanh” dù không có test)
  - Sau khi siết: bỏ `--passWithNoTests` để **fail khi “No tests found”**; hiện đã có `eCommerce_Reactjs/src/App.test.js` nên CI chạy test thật.

### 8.2) Các thay đổi CI đã áp dụng để “fail thật + báo lỗi thật”

1. **Fail khi không có test**

- Đã xóa flag `--passWithNoTests` khỏi `.github/workflows/frontend-ci.yml`.

2. **Capture log khi fail + upload artifact**

- Frontend tạo file: `eCommerce_Reactjs/ci-fail-logs/${GITHUB_JOB}-${GITHUB_RUN_ID}.log` (tail 100 dòng) và upload artifact `ci-fail-logs-frontend-${run_id}`.
- Backend tạo file: `ecomAPI/ci-fail-logs/${GITHUB_JOB}-${GITHUB_RUN_ID}.log` (tail 100 dòng) và upload artifact `ci-fail-logs-backend-${run_id}`.

3. **Tự tạo Issue + comment PR khi fail**

- Cả 2 workflow dùng `actions/github-script@v7` để:
  - Tạo/đảm bảo tồn tại labels: `ci/failure`, `severity:high`, `severity:medium`, `triage-needed`.
  - Tạo Issue với title dạng `[CI FAIL] <workflow> - <job> - <reason>`.
  - Body có: job/workflow, commit SHA, run URL, artifact name, failing summary.
  - Nếu chạy trên PR: comment lên PR (issue link + 1-line action).

4. **Fallback khi không thể tạo Issue**

- Repo hiện **KHÔNG TỒN TẠI** `CODEOWNERS` và **KHÔNG TỒN TẠI** `.github/ISSUE_TEMPLATE/*`, nên workflow dùng nhãn `triage-needed`.
- Nếu GitHub API không cho tạo Issue (thiếu quyền/labels bị policy chặn), workflow sẽ append vào `docs/CI_FAILURES.md` và cố tạo PR qua `peter-evans/create-pull-request@v6`.

### 8.3) YAML snippet đã chèn (để reviewer audit)

**(Frontend) Upload logs + Create issue/comment** — trong `.github/workflows/frontend-ci.yml`

```yaml
- name: Collect short test logs
  if: failure()
  working-directory: ./eCommerce_Reactjs
  run: |
    mkdir -p ci-fail-logs
    LOG_FILE="ci-fail-logs/${GITHUB_JOB}-${GITHUB_RUN_ID}.log"
    echo "==== FRONTEND TEST OUTPUT (tail 100 lines) ====" > "$LOG_FILE"
    tail -n 100 ci-frontend-test.log >> "$LOG_FILE" || true
    cp "$LOG_FILE" ci-fail-logs/test-output.txt

- name: Upload failure logs artifact
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: ci-fail-logs-frontend-${{ github.run_id }}
    path: |
      eCommerce_Reactjs/ci-fail-logs
      eCommerce_Reactjs/ci-frontend-test.log
    retention-days: 14

- name: Create GitHub Issue + comment PR (frontend)
  if: failure()
  uses: actions/github-script@v7
  with:
    script: |
      // create labels -> create issue -> comment PR (if any)
```

**(Backend) Upload logs + Create issue/comment + Jest JSON** — trong `.github/workflows/backend-ci.yml`

```yaml
- name: Run unit tests
  working-directory: ./ecomAPI
  run: |
    set -o pipefail
    npm run test:unit -- --json --outputFile=ci-jest-unit.json 2>&1 | tee ci-backend-unit.log

- name: Collect short test logs
  if: failure()
  working-directory: ./ecomAPI
  run: |
    mkdir -p ci-fail-logs
    LOG_FILE="ci-fail-logs/${GITHUB_JOB}-${GITHUB_RUN_ID}.log"
    echo "==== BACKEND UNIT TEST OUTPUT (tail 100 lines) ====" > "$LOG_FILE"
    tail -n 100 ci-backend-unit.log >> "$LOG_FILE" || true
    echo "" >> "$LOG_FILE"
    echo "==== BACKEND INTEGRATION TEST OUTPUT (tail 100 lines) ====" >> "$LOG_FILE"
    tail -n 100 ci-backend-integration.log >> "$LOG_FILE" || true
    cp "$LOG_FILE" ci-fail-logs/unit-test-output.txt

- name: Create GitHub Issue + comment PR (backend)
  if: failure()
  uses: actions/github-script@v7
  with:
    script: |
      // parse ci-jest-unit.json + ci-jest-integration.json -> create labels -> create issue -> comment PR
```

### 8.4) E2E trong CI (đánh giá reproducible)

- ktpm có 1 spec Cypress: `eCommerce_Reactjs/cypress/e2e/homepage.cy.js`.
- Nhưng Cypress runner/config hiện **KHÔNG TỒN TẠI**:
  - `eCommerce_Reactjs/**/cypress.config.*`: **KHÔNG TỒN TẠI**
  - dependency `cypress` trong `eCommerce_Reactjs/package.json`: **KHÔNG TỒN TẠI**
- Đề xuất hướng reproducible (chưa triển khai trong CI):
  - Spin local stack qua `docker-compose.yml` (mysql + backend + frontend) rồi chạy e2e.
  - Hoặc chạy e2e against preview deployment (repo hiện **KHÔNG TỒN TẠI** workflow preview env).

---

## 9) Vì sao CI phải auto-create Issues (C)

- CI tự tạo Issue khi fail giúp **traceability** (commit/PR/run URL/log) rõ ràng, không bị “mất lỗi” trong lịch sử build.
- Với đồ án, đây là bằng chứng chấm điểm: giảng viên mở Issue thấy ngay suite fail, log tóm tắt và link chạy lại.
- Tự động hoá triage giúp phản hồi nhanh: PR nhận comment + issue link, tránh pipeline “xanh giả” và giảm thời gian tìm nguyên nhân.

---

## 10) Agile analysis & recommendation (D)

### 10.1) ktpm hiện có đang theo Agile không? (evidence-based)

**Dấu hiệu có một phần Agile/CI practice:**

- Repo có PR ít nhất 1 lần: commit message `Merge pull request #1 from phochimtong/main` (xem `git log --oneline` ở repo `ktpm`).
- CI chạy trên `pull_request` và `push`: `.github/workflows/backend-ci.yml`, `.github/workflows/frontend-ci.yml`.

**Dấu hiệu chưa đủ để gọi là Agile đầy đủ (Scrum/Kanban):**

- **KHÔNG TỒN TẠI** file `CODEOWNERS`.
- **KHÔNG TỒN TẠI** `.github/ISSUE_TEMPLATE/*`.
- **KHÔNG TỒN TẠI** artefact sprint/milestone/kanban trong filesystem (không có config/project file trong `.github/`).
- README có placeholder “Thêm thông tin thành viên…” (README.md) → cho thấy tài liệu quy trình/roles chưa hoàn thiện.

Kết luận: ktpm đang có **CI và PR-based workflow (mức cơ bản)** nhưng **chưa có đủ artefact quản trị Agile**.

### 10.2) Tham chiếu fullstack-vitejs-books (so sánh maturity)

- `fullstack-vitejs-books` có lịch sử nhiều PR merges (ví dụ `Merge pull request #67 ...`, `#66`, `#65` trong `git log --oneline`).
- Có hệ test backend đa dạng và performance (`performance/k6/*`).
- Có tài liệu test dạng Word/Excel trong `docs/tests/*`.

### 10.3) Khuyến nghị Agile tối thiểu cho đồ án (không “over-process”)

- Sprint 1 tuần, WIP limit 2/task/người.
- Roles: 1 PO (đại diện yêu cầu), 1 Tech lead (review/merge), các dev luân phiên QA.
- Definition of Done (DoD) tối thiểu:
  - Có test liên quan (backend) hoặc cập nhật test plan.
  - CI xanh (và nếu fail thì có Issue tự tạo).
  - PR mô tả rõ: scope + cách test.

---

## 11) V-Model mapping & Verification checklist (E)

### 11.1) Tóm tắt V-Model

V-Model ánh xạ các pha phát triển (Requirements → Design → Implementation) sang hoạt động verification/validation tương ứng (Unit/Integration/System/Acceptance).

### 11.2) Mapping artefact thật trong ktpm

| Pha V-Model           | Artefact (ktpm)                                                                                                                     | Verification hiện có                                                                         | Trạng thái                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Requirements          | README: `README.md`; Test-case baseline: `docs/PHU_LUC_A_TEST_CASES.md`                                                             | API-Contract tests: `ecomAPI/tests/api/*.test.js` (TC35, TC38–TC39, TC40–TC51, TC60–TC79, …) | Present                                     |
| System Design         | `CHUONG3.md`, `CHUONG4.md`                                                                                                          | CI workflows: `.github/workflows/backend-ci.yml`, `.github/workflows/frontend-ci.yml`        | Present                                     |
| Architecture          | Docker compose: `docker-compose.yml`; backend structure `ecomAPI/src/{controllers,services,models}`                                 | Integration tests (MySQL): `ecomAPI/tests/integration/*.mysql.int.test.js`                   | Present                                     |
| Module Design         | Backend module split theo service/controller; ví dụ stock/size trong `ecomAPI/src/services/shopCartService.js`, `productService.js` | Unit tests: `ecomAPI/tests/unit/*.test.js`                                                   | Present                                     |
| Implementation        | `ecomAPI/src/*`, `eCommerce_Reactjs/src/*`                                                                                          | Frontend unit tests trong source: `eCommerce_Reactjs/src/App.test.js`                        | Present                                     |
| System Test (E2E)     | Cypress spec: `eCommerce_Reactjs/cypress/e2e/homepage.cy.js`                                                                        | Cypress runner/config/deps                                                                   | Missing (Cypress config/deps KHÔNG TỒN TẠI) |
| Acceptance Test (UAT) | UAT sign-off doc                                                                                                                    | (Không có artefact UAT)                                                                      | Missing                                     |

### 11.3) Verification list (điểm kiểm chứng cụ thể)

- Backend Unit: `ecomAPI/tests/unit/authService.test.js`, `productService.test.js`, `orderService.test.js`.
- Backend Integration (MySQL thật): `ecomAPI/tests/integration/auth.mysql.int.test.js`, `product.detail.mysql.int.test.js`, `shopcart.mysql.int.test.js`, ...
- Backend API-Contract/Smoke: `ecomAPI/tests/api/app.smoke.test.js`, `authz.contract.test.js`, `product.contract.test.js`, ...
- Frontend Unit (smoke): `eCommerce_Reactjs/src/App.test.js`.
- E2E: có spec nhưng runner/config **MISSING**.

---

## 12) Notes & Tracing (F)

### 12.1) Verification traceability (REQ → Test → CI job)

Ghi chú: ktpm hiện không có requirement IDs chuẩn hoá trong repo, nên tạo tối thiểu các mã REQ để phục vụ traceability.

| Requirement ID | Mô tả                    | Test case / file chứng minh                                                                                                                    | CI job                      |
| -------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| REQ-AUTH-01    | Đăng ký tài khoản        | `ecomAPI/tests/integration/auth.mysql.int.test.js` (TC28, TC29)                                                                                | Backend CI/CD → job `test`  |
| REQ-AUTH-02    | Đăng nhập                | `ecomAPI/tests/integration/auth.mysql.int.test.js` (TC32, TC33)                                                                                | Backend CI/CD → job `test`  |
| REQ-PROD-01    | Xem danh sách sản phẩm   | `ecomAPI/tests/integration/product.mysql.int.test.js` (DB-PRODUCT-01) + `ecomAPI/tests/api/product.contract.test.js` (TC40)                    | Backend CI/CD → job `test`  |
| REQ-PROD-02    | Xem chi tiết sản phẩm    | `ecomAPI/tests/integration/product.detail.mysql.int.test.js` (DB-PRODUCT-DETAIL-01) + `ecomAPI/tests/api/product.contract.test.js` (TC41/TC42) | Backend CI/CD → job `test`  |
| REQ-CART-01    | Thêm giỏ theo size       | `ecomAPI/tests/integration/shopcart.mysql.int.test.js` (DB-SHOPCART-01)                                                                        | Backend CI/CD → job `test`  |
| REQ-ORDER-01   | Tạo đơn hàng             | `ecomAPI/tests/api/cart-order-voucher.contract.test.js` (TC60/TC61)                                                                            | Backend CI/CD → job `test`  |
| REQ-VOUCHER-01 | Lấy/claim voucher        | `ecomAPI/tests/api/cart-order-voucher.contract.test.js` (TC75–TC78)                                                                            | Backend CI/CD → job `test`  |
| REQ-ADMIN-01   | Admin xem danh sách user | `ecomAPI/tests/integration/user.admin.mysql.int.test.js` (DB-ADMIN-01/02) + `ecomAPI/tests/api/authz.roles.contract.test.js` (TC38/TC39)       | Backend CI/CD → job `test`  |
| REQ-FE-01      | Frontend có unit tests   | `eCommerce_Reactjs/src/App.test.js`                                                                                                            | Frontend CI/CD → job `test` |

### 12.2) Artefact tham chiếu đã “mang về” từ repo điểm cao

- Word/Excel test docs (copy nguyên bản): `docs/reference-tests/*`.
- Performance tests (k6): `performance/k6/load-test.js`, `performance/k6/stress-test.js`, `performance/k6/hướng dẫn.txt`.
