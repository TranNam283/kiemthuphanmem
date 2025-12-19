# Phân tích “Chương 4” của repo điểm cao (tham chiếu)

> Mục tiêu: tách **cấu trúc/artefact test design** (dạng template) trong repo điểm cao để dùng như **khung tham khảo** khi viết Chương 4 cho KTPM, **không copy nguyên văn** nội dung.

## 1) Chương 4 trong repo điểm cao thực chất là gì?

Trong repo tham chiếu, mình không thấy một file Markdown tên “CHUONG4/Chapter4” riêng biệt. Thay vào đó, “Chương 4 – Thiết kế kiểm thử” thể hiện qua 2 nhóm bằng chứng chính:

1. **Artefact test design dạng Office** (Excel/Word) nằm ở `docs/tests/**` (gồm test scenario, test case, unit test, test report, test design forms, review checklist).
2. **Automated tests** trong backend (multi-layer test: controller/service/repository/integration, và có cả Selenium UI tests).

=> Nói cách khác: _Chương 4 = quy trình + mẫu biểu thiết kế test + cách triển khai/thu thập minh chứng (automation + report)._

## 2) Bộ artefact test design (Office) và vai trò

Repo tham chiếu có các nhóm artefact (tên file/folder có thể khác nhau tuỳ phiên bản):

- `docs/tests/test plan.docx`: Test Plan (chủ yếu là Chương 3 ở KTPM).
- `docs/tests/Test_Scenario.xlsx`: danh sách scenario mức cao.
- `docs/tests/test case/TestCase_*.xlsx`: test case chi tiết theo module.
- `docs/tests/unit test.xlsx`: danh sách unit test theo lớp (controller/service/repository).
- `docs/tests/test report.xlsx`: report tổng hợp kết quả.
- `docs/tests/TestDesign/*`: form/biểu thiết kế test (định hướng kỹ thuật, hạng mục, tiêu chí…)
- `docs/tests/TestReviewChecklist/*`: checklist review artefact test (peer review / QC).

## 3) Trích xuất cấu trúc (fields/columns) từ các template (không copy nội dung)

### 3.1) Test Scenario template (`Test_Scenario.xlsx`)

Template scenario ở sheet chính có 3 cột:

- `Scenario ID`
- `Module`
- `Description`

Gợi ý quy ước đặt ID theo module (ví dụ dạng `TS-<Module>-NN`).

### 3.2) Test Case template (`TestCase_*.xlsx`)

Mỗi file test case theo module thường có:

- Một sheet **Cover** (thông tin chung, metadata)
- Một sheet **Module <name>** (bảng test case chính)

Header bảng test case (8 cột) mình trích xuất được từ sheet module:

- `Test Case ID`
- `Tiêu đề (Summary)`
- `Điều kiện tiên quyết (Pre-conditions)`
- `Các bước thực hiện (Test Steps)`
- `Test Data`
- `Kết quả mong đợi (Expected Result)`
- `Actual Result`
- `Status (Pass/Fail)`

Mẫu này còn có kiểu dòng “phân nhóm chức năng” (ví dụ dạng `A. Nhóm chức năng: <...>`), sau đó mới đến các TC cụ thể.

### 3.3) Unit Test template (`unit test.xlsx`)

File unit test có nhiều sheet:

- `Cover` (metadata)
- `UnitTestCaseController`
- `UnitTestCaseService`
- `UnitTestCaseRepository`

Bảng unit test (ở các sheet UnitTestCase\*) có 6 cột:

- `Test Case ID`
- `Unit Under Test`
- `Test Description`
- `Test Data`
- `Expected result`
- `Result`

Điểm đáng chú ý: repo tham chiếu tách unit test list theo **layer** (controller/service/repository).

### 3.4) Test Report template (`test report.xlsx`)

File report có ít nhất 2 sheet:

- `Cover` (metadata)
- `Test Report` (bảng tổng hợp)

Một header mà mình trích được trong sheet `Test Report`:

- `No`
- `Description`
- `Critical`
- `High`
- `Medium`
- `Low`
- `Remarks`

=> Gợi ý report có phần tổng hợp/đếm theo mức độ (severity/priority) và ghi chú.

## 4) Liên hệ với phần automated tests (điểm “ăn điểm”)

Repo tham chiếu không chỉ có file Excel “đẹp” mà còn có **test code chạy được**:

- Test theo lớp (controller/service/repository)
- Integration tests
- Selenium UI tests (E2E)

Điểm mạnh nằm ở chỗ: artefact thiết kế (scenario/case/unit-list) **đi cùng** bằng chứng thực thi (test chạy thật, logs/CI artifacts).

## 5) Mapping sang KTPM (web bán quần áo)

KTPM có thể giữ “khung” giống repo tham chiếu nhưng nội dung phải **đúng domain KTPM**:

- Scenario (mức cao): map theo module KTPM (Auth, Product, Cart, Order, Voucher, User/Profile, Admin…).
- Test case (chi tiết): giữ 8 cột như trên, nhưng bước/data/expected phải theo endpoint/UI của KTPM.
- Unit test list: map theo util/service/controller thật trong KTPM (hiện KTPM thiên về Jest/Supertest).
- Test report: tổng hợp pass/fail + issue/defect + mức độ (nếu có), kèm link evidence (CI run, artifacts).

Artefact hiện có trong KTPM để “đỡ phải Excel hoá” toàn bộ:

- `docs/PHU_LUC_A_TEST_CASES.md` (baseline test cases)
- `docs/tests/test-cases.csv` và `docs/tests/traceability.csv` (traceability dạng file)
- `ecomAPI/tests/**` + CI workflows + `jest-results.json` (minh chứng chạy thật)

## 6) Lưu ý về provenance / chống copy

- Các template Office dưới `docs/ref/**` đang được đánh dấu là **COPIED_VERBATIM** trong báo cáo provenance.
- Deliverable cần nộp nên dùng nội dung tự viết (có thể dựa trên outline ở `docs/adapted/**`), hoặc chuyển sang artefact dạng Markdown/CSV của KTPM.

Tham khảo policy: `docs/NOTICE_ADAPTATION.md`.
