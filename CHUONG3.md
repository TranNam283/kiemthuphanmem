# CHƯƠNG 3. KẾ HOẠCH KIỂM THỬ (TEST PLAN)

**Môn học**: Kiểm thử phần mềm  
**Dự án**: eCommerce Full Stack (React.js + Node.js + MySQL)  
**Nguồn mã/Workspace**: `ktpm/`

---

## 3.1. Mục đích (Purpose)

Kế hoạch kiểm thử nhằm:

- Xác định **đối tượng kiểm thử** (test objects) và **phạm vi kiểm thử** của hệ thống eCommerce.
- Xây dựng **chiến lược kiểm thử theo cấp độ** (Unit → Integration → System/E2E → Acceptance) và theo **rủi ro** (risk‑based).
- Định nghĩa **môi trường, dữ liệu, công cụ, vai trò**, tiêu chí **vào/ra** (entry/exit) cho hoạt động kiểm thử.
- Tạo cơ sở cho triển khai kiểm thử tự động (CI/CD) và báo cáo kết quả.

---

## 3.2. Bối cảnh dự án (Background)

Hệ thống là website thương mại điện tử gồm:

- **Frontend**: React (thư mục `eCommerce_Reactjs/`).
- **Backend API**: Node.js/Express + Sequelize (thư mục `ecomAPI/`).
- **Database**: MySQL (dữ liệu seed từ `ecom.sql`).
- **Triển khai cục bộ** khuyến nghị bằng Docker Compose (`docker-compose.yml`).
- **Tự động hóa** bằng GitHub Actions workflows trong `.github/workflows/`.

---

## 3.3. Phạm vi kiểm thử (Scope)

### 3.3.1. Trong phạm vi (In-scope)

**A) Backend API (ecomAPI)**

- Kiểm thử API endpoints theo nhóm nghiệp vụ: người dùng, sản phẩm, giỏ hàng, đơn hàng, voucher, blog, thống kê, vận chuyển.
- Kiểm thử middleware xác thực/ phân quyền (JWT, role).
- Kiểm thử tương tác DB (CRUD, ràng buộc dữ liệu, tính nhất quán).
- Kiểm thử tích hợp dịch vụ bên ngoài ở mức “không phá môi trường”: mô phỏng/giới hạn (email, payment, shipping webhook).

Ghi chú triển khai: một số bài kiểm thử “DB thật” (MySQL qua Docker) được cấu hình chạy có điều kiện bằng biến môi trường `RUN_DB_TESTS=1` để tránh làm gián đoạn các bài test contract/mocked khi môi trường DB chưa sẵn sàng.

Minh chứng chạy DB thật (local): `cd ecomAPI` → `npm run test:db` (yêu cầu MySQL Docker đang chạy). Hiện trạng DB-real: **10 suites – 34 tests – PASS**.

**B) Frontend (eCommerce_Reactjs)**

- Kiểm thử luồng người dùng chính (đăng nhập, duyệt sản phẩm, thêm giỏ, đặt hàng, xem đơn hàng).
- Kiểm thử điều hướng và ràng buộc quyền truy cập (route `/admin`, `/user`).
- Kiểm thử hiển thị dữ liệu và xử lý lỗi mạng.

**C) Hạ tầng / DevOps**

- Docker Compose khởi chạy 3 services (MySQL, backend, frontend) và import dữ liệu.
- CI/CD: chạy unit/integration tests, build, security scan, artifacts.

### 3.3.2. Ngoài phạm vi (Out-of-scope)

- Tính đúng/sai nghiệp vụ và SLA của bên thứ ba (GHN, PayPal, VNPay) trong môi trường production thật.
- Kiểm thử “giao đơn thật/ thanh toán thật” (chỉ kiểm thử ở mức mock/sandbox).
- Pen-test chuyên sâu (chỉ thực hiện security checklist + scan cơ bản).

---

## 3.4. Phương pháp luận kiểm thử (Methodology)

Phần này nhằm trình bày rõ phương pháp luận kiểm thử được áp dụng: **kiểm thử theo phương pháp nào, theo quy trình nào, và cơ sở lựa chọn**.

### 3.4.1. Cách kết hợp mẫu 1 và mẫu 2

- **Mẫu 1 (V‑Model/artefact‑based)**: dùng để đảm bảo “phủ đủ” theo tiến trình phát triển phần mềm: _yêu cầu → thiết kế → kiến trúc → triển khai_ và tương ứng với _Acceptance/System/API/Integration/Unit_.
- **Mẫu 2 (Test Plan theo cấu trúc tài liệu)**: dùng để trình bày theo cấu trúc dễ theo dõi và đánh giá: _Purpose/Background/Scope/Strategy/Resources/Deliverables/Milestones_.

Trong chương này:

- Các mục **3.1–3.3, 3.7, 3.11–3.16** thể hiện khung “Test Plan” (tương ứng mẫu 2).
- Các mục **3.5–3.6, 3.9** thể hiện tư duy V‑Model/artefact (tương ứng mẫu 1).
- Mục **3.10** áp dụng **risk‑based testing** để giải thích cơ sở ưu tiên kiểm thử.

### 3.4.2. Các nguyên tắc áp dụng

Kế hoạch kiểm thử áp dụng 4 nguyên tắc:

1. **V‑Model**: mỗi artefact (yêu cầu/thiết kế/kiến trúc/module) đều có cấp độ test đối ứng.
2. **Shift‑left**: ưu tiên unit/API tests sớm để phát hiện lỗi trước khi lên E2E.
3. **Risk‑based**: tập trung tài nguyên vào các luồng có impact cao (đăng nhập, phân quyền, giỏ hàng, đặt hàng, thanh toán, nhất quán dữ liệu).
4. **Automation‑first trong CI**: các test chính phải chạy được trên GitHub Actions để đảm bảo lặp lại và có bằng chứng (logs/coverage/artifacts).

### 3.4.3. Quy trình thực hiện kiểm thử trong dự án

Quy trình kiểm thử được tổ chức theo chu trình 5 bước, mỗi bước có đầu vào/đầu ra rõ ràng:

**Bước 1 — Lập kế hoạch (Planning)**

- **Đầu vào**: cấu trúc repo `ktpm/`, Docker Compose, danh sách API routes, luồng UI.
- **Hoạt động**: xác định phạm vi, đối tượng kiểm thử, rủi ro, môi trường, dữ liệu.
- **Đầu ra**: Test Plan (chương này) + danh sách test objects ưu tiên.

**Bước 2 — Thiết kế kiểm thử (Test Design)**

- **Đầu vào**: test objects + rủi ro (mục 3.10) + mapping V‑Model (mục 3.6).
- **Hoạt động**: thiết kế test cases theo level: Unit / API / Integration / E2E; xác định expected results và negative cases.
- **Đầu ra**: bộ test cases (Phụ lục) + tiêu chí pass/fail.

**Bước 3 — Xây dựng test tự động (Implementation)**

- **Đầu vào**: test cases ưu tiên.
- **Hoạt động**: hiện thực test bằng Jest/Supertest (backend), và E2E (nếu triển khai); chuẩn hóa dữ liệu test.
- **Đầu ra**: mã test + cấu hình chạy trong CI.

**Bước 4 — Thực thi (Execution)**

- **Đầu vào**: môi trường Docker/CI + dữ liệu seed.
- **Hoạt động**: chạy test theo tầng (unit → API → integration → E2E), thu logs/coverage.
- **Đầu ra**: báo cáo pass/fail, coverage, danh sách lỗi.

**Bước 5 — Báo cáo & cải tiến (Reporting/Feedback)**

- **Đầu vào**: kết quả test và lỗi.
- **Hoạt động**: ghi nhận bug (Issues), đánh giá chất lượng, đề xuất cải tiến.
- **Đầu ra**: kết luận, số liệu minh chứng trong chương kết quả.

---

## 3.5. Đối tượng kiểm thử (Test Objects) theo hướng B

### 3.5.1. Phân rã đối tượng kiểm thử theo artefact

| Nhóm                         | Artefact (ví dụ)                                | Vai trò             | Kiểm thử gì                                      |
| ---------------------------- | ----------------------------------------------- | ------------------- | ------------------------------------------------ |
| Frontend UI                  | `eCommerce_Reactjs/src/App.js`, `container/**`  | Điều hướng/hiển thị | UI flow, route guard, form validation, error UI  |
| Frontend API client          | `eCommerce_Reactjs/src/axios.js`, `services/**` | Gọi API             | contract client, lỗi mạng, token attach          |
| Backend routing              | `ecomAPI/src/route/web.js`                      | Map endpoint        | API contract, authz, status code, negative tests |
| Backend controllers/services | `ecomAPI/src/controllers/**`, `src/services/**` | Nghiệp vụ           | business rules, boundary, xử lý lỗi              |
| Middleware auth              | `ecomAPI/src/middlewares/jwtVerify.js`          | Xác thực/quyền      | 401/403, role R1/R4 vs user, token invalid       |
| Data layer                   | `ecomAPI/src/models/**`, `connectDB.js`, MySQL  | Lưu trữ             | CRUD + consistency + constraints                 |
| Infrastructure               | `docker-compose.yml`, workflows                 | Pipeline            | smoke pipeline, artifacts, gates                 |

### 3.5.2. Phân nhóm chức năng theo nghiệp vụ eCommerce

- **Auth/User**: đăng ký, đăng nhập, đổi mật khẩu, quên mật khẩu, verify email, phân quyền.
- **Catalog/Product**: danh sách sản phẩm, chi tiết, filter/sort/search, sản phẩm nổi bật/mới.
- **Cart**: thêm/xóa/đổi số lượng, tính tổng.
- **Order/Checkout**: tạo đơn, cập nhật trạng thái, thanh toán (sandbox), xác nhận đơn.
- **Voucher/Promotion**: áp mã, validate điều kiện, tracking sử dụng.
- **Shipping**: tính phí ship, mapping địa chỉ, webhook cập nhật trạng thái.
- **Blog/Content**: list/detail blog.
- **Admin**: CRUD sản phẩm, đơn hàng, voucher, supplier, thống kê.

---

## 3.6. Tổng quan quy trình kiểm thử theo V‑Model

### 3.6.1. Mapping V‑Model cho dự án

| Tầng (phía trái)   | Artefact dự án                       | Tầng test (phía phải)   | Output mong đợi                     |
| ------------------ | ------------------------------------ | ----------------------- | ----------------------------------- |
| Yêu cầu            | Use case/user story (luồng mua hàng) | Acceptance/System (E2E) | Test cases E2E + criteria pass/fail |
| Thiết kế hệ thống  | Workflow UI ↔ API ↔ DB               | System/API              | Contract + negative tests           |
| Thiết kế kiến trúc | Controllers/Services/Models          | Integration             | API/service+DB integration          |
| Thiết kế module    | Utils/validators                     | Unit                    | Jest unit tests + coverage          |

---

## 3.7. Chiến lược kiểm thử (Test Strategy)

### 3.7.1. Các cấp độ kiểm thử

**(1) Unit Testing**

- Mục tiêu: kiểm thử logic thuần, không phụ thuộc network/DB.
- Hiện trạng: có unit tests cho `authUtils`, `productUtils`, `orderUtils`.
- Mở rộng đề xuất: bổ sung unit cho các hàm validate dữ liệu input, mapping trạng thái đơn hàng, tính toán phí/giảm giá.

**(2) Integration Testing**

- Mục tiêu: kiểm thử tương tác giữa service ↔ database (Sequelize/MySQL) và/hoặc controller ↔ service.
- Đề xuất: dùng MySQL test container (docker) và chạy CRUD thật trên schema test.

**(3) API/Contract Testing**

- Mục tiêu: xác minh endpoint đúng status code + schema response + authz.
- Kỹ thuật: Supertest/Jest gọi trực tiếp Express app.
- Tập trung: `/api/login`, `/api/get-all-product-user`, `/api/add-shopcart`, `/api/create-order`, `/api/confirm-order`, `/api/apply-voucher` (nếu có).

**(4) System / E2E Testing**

- Mục tiêu: kiểm thử luồng nghiệp vụ end‑to‑end trên UI.
- Công cụ đề xuất: Playwright hoặc Cypress.
- Luồng ưu tiên: Login → Browse → Add to cart → Checkout → View order.

**(5) Acceptance Testing**

- Mục tiêu: xác nhận “đúng theo yêu cầu” bằng tiêu chí nghiệm thu (Given‑When‑Then).
- Phạm vi: các luồng người dùng quan trọng + role admin.

### 3.7.2. Ánh xạ luồng nghiệp vụ và cấp độ kiểm thử

| Workflow            | Test mục tiêu                               | Loại test                    |
| ------------------- | ------------------------------------------- | ---------------------------- |
| Đăng nhập/đăng xuất | token đúng/ sai, lock route `/admin`        | API + E2E                    |
| Duyệt sản phẩm      | sort/filter/search/pagination               | API + UI                     |
| Giỏ hàng            | thêm/xóa/đổi số lượng, tổng tiền            | API + E2E                    |
| Đặt hàng            | validate địa chỉ, tổng tiền, trạng thái đơn | Integration + E2E            |
| Thanh toán          | redirect/return, cập nhật trạng thái        | API contract + E2E (sandbox) |

### 3.7.3. Ánh xạ mô hình dữ liệu và mục tiêu kiểm thử

- Ràng buộc dữ liệu: khóa ngoại, unique, not null (ở DB) + validate ở API.
- Nhất quán dữ liệu: tổng tiền đơn = sum(orderDetail), trạng thái đơn hợp lệ, voucherUsed.
- Concurrency: cùng lúc cập nhật giỏ/đơn (mô tả rủi ro + test mô phỏng nếu kịp).

### 3.7.4. Kiểm thử theo khía cạnh giao diện (UI/UX)

- Điều hướng đúng theo route.
- Validation form (đăng nhập, địa chỉ, thanh toán).
- Thông báo lỗi mạng/API rõ ràng.
- Responsive mức cơ bản (desktop/mobile).

### 3.7.5. Quy mô bộ test cases (ước lượng)

Trong khuôn khổ đồ án, số lượng test case được xác định theo nguyên tắc **risk-based** (ưu tiên luồng High trước), đồng thời đảm bảo có đủ các cấp độ kiểm thử (Unit/API/Integration/E2E). Số lượng dưới đây là **mức dự kiến tối thiểu** để lập kế hoạch nguồn lực; có thể điều chỉnh khi hoàn tất bước Thiết kế kiểm thử.

| Nhóm kiểm thử          | Phạm vi/đối tượng chính                                | Số test case dự kiến |
| ---------------------- | ------------------------------------------------------ | -------------------: |
| Unit (hộp trắng)       | utils/validators, hàm tính toán, mapping trạng thái    |                20–30 |
| API/Contract (hộp đen) | endpoint trọng yếu + negative/authz cases              |                25–35 |
| Integration (xám)      | service ↔ DB (Sequelize/MySQL), tính nhất quán dữ liệu |                10–15 |
| System/E2E (hộp đen)   | luồng mua hàng end-to-end + admin smoke                |                 6–10 |
| Phi chức năng          | security checklist + 3 kịch bản performance tối thiểu  |                12–18 |

Tổng quy mô dự kiến: **khoảng 75–108 test case** (bao gồm test tự động và checklist phi chức năng).

Trong phạm vi đồ án, để thuận tiện cho Chương 4 (Test Design) và kiểm soát khối lượng triển khai, nhóm chốt **baseline = 90 test case** (27 đã hiện thực ở mức Unit/Integration; phần còn lại là test case thiết kế và ưu tiên triển khai theo rủi ro).

### 3.7.6. Phương pháp và kỹ thuật kiểm thử áp dụng

Kế hoạch áp dụng kết hợp các phương pháp/kỹ thuật sau:

- **Kiểm thử hộp đen (Black-box testing)**: dựa trên yêu cầu/luồng nghiệp vụ và hành vi quan sát được.
  - Áp dụng cho: API/Contract tests, System/E2E, Acceptance.
  - Kỹ thuật chính: phân lớp tương đương (Equivalence Partitioning), giá trị biên (Boundary Value Analysis), kiểm thử tình huống âm (negative/error), bảng quyết định ở các rule (decision table) khi có điều kiện/voucher/trạng thái.
- **Kiểm thử hộp trắng (White-box testing)**: dựa trên cấu trúc mã nguồn, nhánh điều kiện, xử lý lỗi.
  - Áp dụng cho: Unit tests (utils/validators/service logic có thể cô lập).
  - Tiêu chí tham khảo: bao phủ câu lệnh/nhánh ở các hàm trọng yếu.
- **Kiểm thử hộp xám (Gray-box testing)**: kết hợp hiểu biết về kiến trúc và dữ liệu để thiết kế ca kiểm thử hiệu quả.
  - Áp dụng cho: Integration tests (service ↔ DB), một phần API tests (kiểm tra ràng buộc dữ liệu/transaction).

### 3.7.7. Thuật ngữ: Test case, Unit test và mối quan hệ

- **Test case (ca kiểm thử)**: một mô tả kiểm thử có cấu trúc, thường gồm _mục tiêu, tiền điều kiện, dữ liệu vào, các bước thực hiện, kết quả mong đợi, tiêu chí pass/fail_. Test case có thể được thực hiện thủ công hoặc tự động.
- **Unit test**: một bài kiểm thử tự động ở mức _đơn vị nhỏ nhất có thể kiểm thử_ (hàm/module), chạy nhanh và (lý tưởng) độc lập với network/DB bằng cách cô lập phụ thuộc (mock/stub).
- **Khác nhau cốt lõi**:
  - _Test case_ là **đặc tả kịch bản kiểm thử** (cái cần kiểm).
  - _Unit test_ là **cách hiện thực kiểm thử ở cấp độ unit** (cách kiểm ở mức nào và bằng gì).
  - Một test case có thể được hiện thực bằng một hoặc nhiều unit test; và không phải test case nào cũng là unit test (ví dụ E2E test case).

---

## 3.8. Kiểm thử phi chức năng (Non‑functional)

### 3.8.1. Kiểm thử hiệu suất (Performance)

- Mục tiêu: đo thời gian phản hồi và tỉ lệ lỗi cho endpoint chính.
- Kịch bản tối thiểu:
  - Browse products: GET list (N requests/s)
  - Add to cart: POST add item
  - Create order: POST create order
- Công cụ: k6/JMeter (demo) hoặc artillery.
- Tiêu chí tham khảo (có thể điều chỉnh theo yêu cầu môn):
  - 95th percentile < 2s cho browse, < 3s cho checkout ở tải nhẹ.

### 3.8.2. Kiểm thử bảo mật (Security)

- Authn/Authz: token invalid/expired, role-based access (R1/R4 vs user).
- Injection: kiểm tra input query/params/body.
- Secrets: không hardcode token/key trong source (đặc biệt service shipping).
- CORS/TLS: rà soát cấu hình CORS và việc tắt TLS verify.
- Dependency scan: npm audit trong CI.

---

## 3.9. Phân tích kiến trúc phục vụ kiểm thử

### 3.9.1. Tổng quan kiến trúc

- Frontend gọi backend qua baseURL cấu hình bởi `REACT_APP_BACKEND_URL`.
- Backend kết nối MySQL theo env variables (DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD).
- DB seed/import từ `ecom.sql` khi chạy docker.

### 3.9.2. Phân tích thành phần & kiểm thử tích hợp

**Backend (routing, entities, …)**

- Routing: đảm bảo endpoint hoạt động và phân quyền đúng.
- Entities/Models: mapping đúng kiểu dữ liệu, liên kết đúng.
- Service layer: validate dữ liệu đầu vào, xử lý transaction hợp lý.

**Frontend**

- Route guard: `/admin` chỉ vào khi roleId R1/R4, `/user` yêu cầu đăng nhập.
- Error handling: lỗi API phải hiển thị thông báo, không crash.

### 3.9.3. Kiểm thử kết nối & API

- Contract: schema response phải ổn định với frontend.
- HTTP status: 200/201/400/401/403/404/500 đúng ngữ nghĩa.
- Token attach: axios interceptor gửi đúng header Authorization.

### 3.9.4. Kiểm thử dữ liệu & nhất quán

- DB ↔ API ↔ UI: dữ liệu danh sách sản phẩm, đơn hàng, giỏ hàng hiển thị khớp.
- Reset dữ liệu: test chạy lại được, không phụ thuộc state cũ.

### 3.9.5. Kiểm thử triển khai & unit test / GitHub CI/CD

- Backend CI: test + coverage + audit + docker build.
- Frontend CI: build + (unit tests nếu bổ sung).
- Artifacts: coverage report, audit report.

---

## 3.10. Ma trận rủi ro và ưu tiên kiểm thử (Risk‑based)

### 3.10.1. Tiêu chí ưu tiên

- **Impact**: lỗi gây mất tiền, sai đơn hàng, lộ dữ liệu, downtime.
- **Likelihood**: code phức tạp, nhiều phụ thuộc, nhiều luồng.
- **Exposure**: endpoint public, auth liên quan.

### 3.10.2. Các rủi ro trọng yếu và mức ưu tiên

| Hạng mục         | Rủi ro                               | Ưu tiên     | Loại test          |
| ---------------- | ------------------------------------ | ----------- | ------------------ |
| Auth/Role        | bypass `/admin`, token sai vẫn vào   | High        | API + E2E          |
| Order/Checkout   | tạo đơn sai tổng tiền/trạng thái     | High        | Integration + E2E  |
| Cart             | sai số lượng/tổng tiền               | High        | API + E2E          |
| Payment return   | cập nhật trạng thái sai, replay      | High        | API contract       |
| Shipping/webhook | mapping status sai, dữ liệu shipping | Medium‑High | Integration        |
| Voucher          | áp sai điều kiện/được giảm sai       | Medium‑High | Unit+API           |
| Data consistency | mismatch UI↔API↔DB                   | Medium      | Integration        |
| Security config  | CORS/TLS/secrets                     | Medium      | Security checklist |

---

## 3.11. Môi trường kiểm thử & dữ liệu (Environment & Test Data)

### 3.11.1. Môi trường cục bộ

- Khuyến nghị: Docker Compose.
- Cổng dịch vụ:
  - Frontend: 3000
  - Backend: 8080
  - MySQL: 3307 (host) → 3306 (container)
- Dữ liệu: import tự động từ `ecom.sql`.

### 3.11.2. Môi trường CI

- GitHub Actions chạy trên ubuntu-latest.
- MySQL service container phục vụ test backend.

### 3.11.3. Chiến lược dữ liệu test

- Dữ liệu seed: dùng `ecom.sql` cho smoke/system.
- Data reset: `docker-compose down -v` để reset.
- Account test: tạo user test và admin test (roleId R1/R4) để chạy E2E.

---

## 3.12. Công cụ kiểm thử (Tools)

- **Unit/Integration (Backend)**: Jest, Supertest.
- **Unit (Frontend)**: React Testing Library (nếu bổ sung test).
- **E2E**: Playwright/Cypress (đề xuất).
- **CI/CD**: GitHub Actions.
- **Container**: Docker/Docker Compose.
- **Security scan**: npm audit.
- **Performance**: k6/JMeter (demo).

---

## 3.13. Vai trò & phân công (Resources / Roles)

- **Test Planner/Test Lead**: lập kế hoạch, chọn rủi ro, chốt phạm vi.
- **Test Developer**: viết test tự động (Jest/Supertest/E2E).
- **Tester**: chạy test, ghi log, tạo bug report.

---

## 3.14. Deliverables (Đầu ra)

- Test Plan (Chương 3).
- Danh sách test cases (phụ lục).
- Test logs/CI artifacts (coverage report, audit report).
- Bug reports (GitHub Issues).
- Báo cáo kết quả (pass/fail, số lượng lỗi, coverage, nhận xét).

---

## 3.15. Tiêu chí vào/ra (Entry / Exit Criteria)

### 3.15.1. Entry

- Build chạy được bằng Docker.
- DB import thành công.
- Backend chạy được và trả response.

### 3.15.2. Exit

- Unit tests pass.
- Các luồng E2E ưu tiên High pass.
- Không còn lỗi severity High.
- Coverage đạt ngưỡng đặt ra (tối thiểu 80% cho module được chọn).

---

## 3.16. Kế hoạch tiến độ (Milestones) – dự kiến

- Tuần 1: hoàn thiện Test Plan + test cases ưu tiên.
- Tuần 2: triển khai unit + API tests cho luồng High.
- Tuần 3: triển khai E2E (smoke) + chạy CI ổn định.
- Tuần 4: tổng hợp báo cáo, đánh giá chất lượng.
