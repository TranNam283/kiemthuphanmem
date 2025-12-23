# Cheat Sheet Vấn Đáp (Kiểm thử phần mềm) — KTPM

Mục tiêu: **không để thầy hỏi dồn**. Em chủ động dẫn: **Kiến trúc → Test plan → Test cases → Test code (white/black/integration) → Evidence chạy thật**.

---

## 1) Kịch bản “phủ đầu” 5–7 phút (đọc như thuyết trình)

### 1.1 Kiến trúc (30–45s)

- Hệ thống eCommerce gồm **Frontend React** + **Backend Node/Express API** + **MySQL (Docker)**.
- Luồng chính: Auth → xem sản phẩm → giỏ hàng → đặt hàng; Admin quản trị user/sản phẩm.

Gợi ý mở nhanh sơ đồ use-case:

- docs/tests/Images/Use case summary.png
- docs/tests/Images/usecase_he_thong-uc1_KiemSoatVaTruyCap.png

### 1.2 Test strategy (1–2 phút)

- Em chia kiểm thử theo tầng:
  - **Unit (White-box)**: kiểm hàm thuần / util.
  - **API-Contract (Black-box)**: kiểm request/response + authz (không cần DB).
  - **Integration DB-real**: chạy API thật + MySQL thật (supertest + sequelize).
  - **E2E UI**: Cypress một số luồng UI.
  - **Non-functional**: k6 load/stress.

### 1.3 Test plan → Test case (1–2 phút)

- Em có baseline **90 test case** (Test Design), dùng để coverage requirement.
- Repo có thêm **automation**: Jest chạy unit + API-contract + DB-real.
- Số “116 tests” là **số test tự động Jest** (cách đếm khác với baseline 90).

Tài liệu test case baseline:

- docs/PHU_LUC_A_TEST_CASES.md

### 1.4 Chỉ thầy xem “tổ chức thư mục” (30–60s)

- Backend tests:
  - ecomAPI/tests/unit/ (white-box)
  - ecomAPI/tests/api/ (black-box API-contract, mock controller)
  - ecomAPI/tests/integration/ (\*.mysql.int.test.js) (integration DB-real)
- E2E UI:
  - eCommerce_Reactjs/cypress/e2e/
- Checklists (Excel):
  - docs/tests/TestReviewChecklist/test case review checklist.xlsx
- Test plan (docx):
  - docs/tests/docs/test-plan.docx

### 1.5 Show “đoạn code test” theo đúng câu thầy hay hỏi (2 phút)

- Hộp trắng (white-box) — unit test util:
  - ecomAPI/tests/unit/authService.test.js
  - ecomAPI/tests/unit/productService.test.js
  - ecomAPI/tests/unit/orderService.test.js
- Hộp đen (black-box) — API contract (không DB):
  - ecomAPI/tests/api/authz.contract.test.js
  - ecomAPI/tests/api/product.contract.test.js
- Tích hợp (integration) — API + MySQL thật:
  - ecomAPI/tests/integration/auth.mysql.int.test.js
  - ecomAPI/tests/integration/user.admin.mysql.int.test.js
  - ecomAPI/tests/integration/shopcart.mysql.int.test.js

---

## 2) Phân loại cực nhanh (để trả lời thầy trong 10 giây)

### 2.1 White-box (Unit)

- Đặc điểm: import trực tiếp module/hàm; test logic nội bộ.
- Ví dụ: ecomAPI/tests/unit/authService.test.js (hash/compare/validate).

### 2.2 Black-box (API contract)

- Đặc điểm: coi hệ thống như “hộp đen”; kiểm **đầu vào/đầu ra** (status code, JSON schema, auth).
- Ví dụ: ecomAPI/tests/api/authz.contract.test.js (no token → 401).

### 2.3 Integration (DB-real)

- Đặc điểm: dùng API thật + MySQL thật; vừa kiểm response vừa kiểm DB state.
- Ví dụ: ecomAPI/tests/integration/shopcart.mysql.int.test.js:
  - gọi POST /api/add-shopcart
  - rồi query db.ShopCart để xác nhận row đã tạo

---

## 3) Lệnh chạy minh chứng (để thầy thấy “có chạy thật”)

### 3.0 Checklist mở máy (Windows) — để chạy được White/Black/Integration/E2E

Mục tiêu: **mở máy lên là chạy được** (Docker + Node + report).

1. Cài/kiểm tra công cụ

- Git
- Node.js LTS (khuyến nghị 18/20). Kiểm tra:
  - `node -v`
  - `npm -v`
- Docker Desktop (bật WSL2). Kiểm tra:
  - `docker --version`
  - `docker compose version`

2. Pull deps một lần (nếu máy mới)

- Backend:
  - `cd ecomAPI`
  - `npm install`
- Frontend:
  - `cd ..\eCommerce_Reactjs`
  - `npm install`

3. Khởi động MySQL + services bằng Docker Compose (khuyến dùng)

Tại root repo:

- `docker-compose up -d --build`

Kiểm tra chạy ổn:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- MySQL: `localhost:3307`

Thông số DB theo docker-compose (để nhập Adminer/DB tool):

- DB: `ecom`
- User: `root`
- Password: `ecompassword`
- Host/Port từ máy bạn: `localhost:3307` (mapping vào container `3306`)

4. Nếu cần reset data để demo lại “sạch”

- `docker-compose down -v`
- `docker-compose up -d --build`

5. Chuẩn bị cửa sổ “evidence” trước khi thầy hỏi

- Terminal 1 (logs): `docker-compose logs -f`
- Trình duyệt tab 1: Frontend `http://localhost:3000`
- Trình duyệt tab 2: Adminer (nếu compose có) hoặc DB tool
- VS Code sẵn mở:
  - Jest report `ecomAPI/jest-results.json` + `ecomAPI/coverage/lcov-report/index.html`
  - Cypress screenshots/videos (nếu có) trong `eCommerce_Reactjs/cypress/`
  - k6 scripts trong `performance/k6/`

### 3.1 Backend (Jest)

Trong thư mục ecomAPI:

- Unit + coverage:
  - npm run test:unit
- Integration DB-real (cần MySQL Docker đang chạy):
  - npm run test:db

Ghi chú: DB-real chỉ chạy khi RUN_DB_TESTS=1 (đã set trong script test:db).

#### 3.1.1 Thầy hỏi “white-box/black-box/integration nằm đâu, chạy lệnh nào?”

- White-box (Unit): `ecomAPI/tests/unit/` → chạy `npm run test:unit`
- Black-box (API contract): `ecomAPI/tests/api/` → có thể chạy `npm run test` (hoặc `npm run test:integration` nếu repo gom vào integration; tùy file đặt ở đâu)
- Integration DB-real: `ecomAPI/tests/integration/*.mysql.int.test.js` → chạy `npm run test:db`

#### 3.1.2 Evidence Jest/coverage đưa thầy xem gì?

- Console output PASS/FAIL ngay khi chạy.
- File report:
  - `ecomAPI/jest-results.json` (minh chứng test suite + số tests)
  - `ecomAPI/coverage/lcov-report/index.html` (coverage UI)

Khi thầy hỏi “thành công là gì?”

- **PASS** toàn bộ test cần demo.
- Với coverage: mở `lcov-report` và chỉ nhanh % Statements/Branches/Functions/Lines (không cần khoe quá nhiều).

### 3.2 Cypress (E2E)

Trong thư mục eCommerce_Reactjs:

- npx cypress open
- hoặc npx cypress run

Gợi ý chạy nhanh (headless):

- `npm run cy:run`

Evidence Cypress:

- Output terminal PASS/FAIL.
- Nếu có cấu hình ghi hình/ảnh: dùng `eCommerce_Reactjs/cypress/screenshots/` và `eCommerce_Reactjs/cypress/videos/` để mở cho thầy xem.

Spec mẫu:

- eCommerce_Reactjs/cypress/e2e/auth-login.cy.js
- eCommerce_Reactjs/cypress/e2e/cart-view.cy.js

### 3.3 k6 (Performance)

- Kịch bản k6 ở performance/k6/

Chạy k6 (nếu máy có k6):

- `k6 run performance/k6/load-test.js`
- `k6 run performance/k6/stress-test.js`

Evidence k6:

- Console metrics: http_req_duration, checks, http_req_failed.
- Nếu thầy hỏi “success”: tỉ lệ lỗi thấp (http_req_failed gần 0), p(95) latency trong ngưỡng nhóm đặt ra khi thuyết trình.

---

## 4) “Câu trả lời mẫu” ngắn cho các câu hỏi hay gặp

### 4.1 Vì sao 90 vs 116?

- 90 = baseline test cases thiết kế cho coverage requirement.
- 116 = số test automation Jest (unit + contract + integration) — cách đếm khác.

### 4.2 Tích hợp ở đâu?

- ecomAPI/tests/integration/\*.mysql.int.test.js: chạy API thật bằng supertest, connect MySQL thật bằng sequelize.

### 4.3 Hộp trắng/hộp đen khác gì?

- White-box: dựa vào cấu trúc code (hàm/branch/exception), thường unit.
- Black-box: dựa vào đặc tả/contract (input/output), thường API/E2E.

### 4.4 Evidence em dùng gì?

- Postman status/JSON, DB (Adminer), log backend, report Jest/Cypress/k6.

---

## 5) Kịch bản demo “đưa thầy xem bằng chứng” (rất cụ thể, tránh bị hỏi dồn)

Mục tiêu: thầy nhìn thấy **(1) chạy thật**, **(2) có verification**, **(3) trace được từ requirement → testcase → automation → report**.

### 5.1 Demo nhanh 3–5 phút (đúng trọng tâm)

1. Mở kiến trúc (30s)

- Mở README root: cho thấy chạy bằng Docker Compose, ports.
- Nói 1 câu: “Em demo theo tầng: Unit → API-contract → Integration DB → E2E → Performance”.

2. Show folder test (20s)

- Mở cây thư mục:
  - `ecomAPI/tests/unit/`
  - `ecomAPI/tests/api/`
  - `ecomAPI/tests/integration/`

3. Chạy Unit (white-box) + show report (60–90s)

- `cd ecomAPI`
- `npm run test:unit`
- Khi PASS: mở `ecomAPI/coverage/lcov-report/index.html` cho thầy thấy coverage.

4. Chạy Integration DB-real (60–90s)

- Đảm bảo Docker đang up: `docker-compose ps`
- `cd ecomAPI`
- `npm run test:db`
- Khi PASS: nói rõ “test này vừa verify response, vừa verify DB state”.

5. Chạy 1–2 Cypress spec (60–90s)

- `cd eCommerce_Reactjs`
- `npm run cy:run`
- Nếu có artifacts: mở `cypress/screenshots` hoặc `cypress/videos`.

6. K6 (tuỳ thời gian, 30–60s)

- Chạy 10–20s rồi stop (Ctrl+C), mở summary metrics.

### 5.2 Hướng dẫn chi tiết chạy “Postman status/JSON”

Mục tiêu: chứng minh **black-box API** bằng request/response + auth.

1. Bật backend (nếu không dùng docker cho backend): `cd ecomAPI` → `npm run start`.
2. Trong Postman:

- Tạo request `POST /login` (hoặc endpoint login của hệ thống) để lấy token.
- Copy token sang Authorization (Bearer Token).
- Gọi 1 API cần auth (ví dụ: cart/order/admin).

Evidence đưa thầy xem:

- Status code (200/401/403).
- JSON body (fields chính), nhấn mạnh “đúng contract”.
- Với case âm: bỏ token → thấy 401 (đây là verification rõ nhất).

### 5.3 Hướng dẫn chi tiết chạy “DB (Adminer) verification”

Mục tiêu: chứng minh **integration**: API tạo dữ liệu thật trong DB.

1. Mở Adminer (nếu docker-compose có service adminer) hoặc dùng tool DB bất kỳ.
2. Kết nối MySQL:

- Host: `localhost`
- Port: `3307`
- User: `root`
- Password: `ecompassword`
- Database: `ecom`

Demo verification gợi ý:

- Trước khi gọi API: `SELECT` bảng ShopCart/Orders (hoặc bảng liên quan) cho thấy chưa có row.
- Gọi API add-to-cart / create-order.
- Refresh query: thấy row mới xuất hiện → kết luận “đã verify DB state”.

### 5.4 Hướng dẫn chi tiết “log backend” (đưa thầy xem đúng lúc)

Mục tiêu: chứng minh request thật chạy qua server + dễ trace lỗi.

- Nếu chạy docker: `docker-compose logs -f` và filter service backend.
- Khi gửi API (Postman/Cypress): trỏ vào dòng log tương ứng (timestamp, route, status).

Khi thầy hỏi “em debug/trace thế nào?”

- Trả lời: “Em dùng logs để map request → controller/service, và test automation để tái hiện lỗi có kiểm soát”.

### 5.5 “Report Jest/Cypress/k6” mở phần nào?

- Jest:
  - Terminal output PASS/FAIL
  - `ecomAPI/jest-results.json`
  - `ecomAPI/coverage/lcov-report/index.html`
- Cypress:
  - Terminal output
  - `eCommerce_Reactjs/cypress/screenshots/` + `eCommerce_Reactjs/cypress/videos/`
- k6:
  - Console summary metrics
  - File script `performance/k6/*.js` (giải thích scenario + thresholds nếu có)

---

## 6) Nếu thầy hỏi “Em có verification không?” — trả lời và chỉ ra ngay

Trả lời mẫu (20–30s):

- “Dạ có. Verification của em là: (1) verify **response** (status/JSON) bằng Postman/supertest, (2) verify **DB state** bằng query DB trong integration test/Adminer, (3) verify **UI flow** bằng Cypress, và (4) verify **non-functional** bằng k6 metrics.”

Chỉ ra ngay (không nói suông):

- Mở 1 file integration test `*.mysql.int.test.js` và chỉ đoạn: gọi API xong rồi query sequelize để assert.
- Hoặc làm live: call API tạo cart → Adminer `SELECT` ra row.

---

## 7) Nếu thầy hỏi “GitHub CI/CD đâu? Thành công là gì?”

Repo có sẵn GitHub Actions trong `.github/workflows/`.

Bạn nói và chỉ như sau (30–45s):

- “Dạ tụi em có CI chạy tự động khi push/PR. Backend/Frontend đều có workflow riêng, và có workflow manual để chạy E2E với backend thật.”
- Mở GitHub → tab **Actions**:
  - Workflow **Backend CI/CD**
  - Workflow **Frontend CI/CD**
  - Workflow **E2E (Real Backend) - Manual** (workflow_dispatch)

Thành công là gì (nói đúng theo CI):

- Dấu **xanh**: tất cả jobs/steps PASS.
- Backend CI sẽ chạy: unit + integration + DB-real với MySQL service (import `ecom.sql`).
- Frontend CI sẽ chạy: unit + Cypress smoke + build.
- Khi fail: CI upload artifacts (logs, Cypress screenshots/videos) để verification.

---

## 8) So sánh Verification vs Validation (và chỉ rõ trong đồ án)

### 8.1 Khác nhau nhanh (trả lời 15–20s)

- **Verification**: “Mình xây đúng theo đặc tả chưa?” (đúng code/đúng contract/đúng DB state) → thường là **unit/contract/integration**.
- **Validation**: “Sản phẩm có đúng nhu cầu người dùng/use-case không?” (luồng người dùng chạy được, mục tiêu nghiệp vụ đạt) → thường là **E2E/UAT/exploratory**.

Gói gọn 1 câu hay dùng:

- Verification = _build the product right_
- Validation = _build the right product_

### 8.2 Bảng so sánh (để thầy khỏi bắt bẻ)

| Tiêu chí       | Verification                                       | Validation                                         |
| -------------- | -------------------------------------------------- | -------------------------------------------------- |
| Câu hỏi        | “Làm đúng thiết kế/đặc tả chưa?”                   | “Có đúng nhu cầu/đúng bài toán không?”             |
| Tập trung      | Code correctness, contract, DB state, lỗi kỹ thuật | Use-case, trải nghiệm, chấp nhận nghiệp vụ         |
| Người đánh giá | Dev/QA                                             | User/PO/giảng viên (acceptance) + QA               |
| Evidence       | Test tự động + logs + reports                      | E2E demo + test case baseline + kịch bản nghiệp vụ |

### 8.3 Trong đồ án này: cái nào là Verification?

1. **Unit (White-box) = Verification**

- Chạy: `cd ecomAPI` → `npm run test:unit`
- Evidence: PASS/FAIL + coverage report.

2. **API-Contract (Black-box) = Verification**

- Mục tiêu: verify status/JSON đúng contract, auth đúng (401/403/200).
- Evidence:
  - Postman: status code + JSON body.
  - Jest/supertest (nếu có): test contract trong `ecomAPI/tests/api/`.

3. **Integration DB-real = Verification**

- Chạy: `cd ecomAPI` → `npm run test:db`
- Verification điểm mạnh nhất: “gọi API xong → query DB → assert DB state”.

4. **CI (GitHub Actions) = Verification ở mức pipeline**

- Backend CI/CD chạy unit + integration + DB-real với MySQL service.
- Frontend CI/CD chạy unit + Cypress smoke + build.
- Evidence: Actions xanh + logs + artifacts khi fail.

### 8.4 Trong đồ án này: cái nào là Validation?

1. **E2E UI bằng Cypress = Validation luồng người dùng**

- Ví dụ luồng: login → browse sản phẩm → add cart → xem cart.
- Evidence: chạy `npm run cy:run` + (screenshots/videos nếu có).

2. **Baseline test cases (90) = Validation theo requirement/use-case**

- Baseline `docs/PHU_LUC_A_TEST_CASES.md`: mapping requirement → testcase → expected result.
- Khi thầy hỏi “có đúng nghiệp vụ không?”: mở baseline test case và chỉ expected/acceptance.

3. **k6 = Validation một phần cho NFR (hiệu năng)**

- Nếu nhóm có tiêu chí NFR (ví dụ p95/throughput), k6 giúp validate hệ thống chịu tải theo mục tiêu.
- Evidence: summary metrics (checks/http_req_failed/http_req_duration).

### 8.5 Câu trả lời mẫu khi thầy hỏi trực diện

- “Dạ verification bên em là bằng Jest unit/contract/integration và DB-real tests (assert DB state). Còn validation là em chạy Cypress E2E theo luồng use-case và đối chiếu baseline test case (90) để chứng minh đúng nghiệp vụ.”
