# Test Design Workflow (KTPM) — Quy trình thiết kế và triển khai kiểm thử

> Mục tiêu: mô tả quy trình “thiết kế → triển khai → chạy CI → triage → báo cáo” để minh chứng Chương 4 không chỉ là liệt kê test case.

## 1) Workflow tổng quan

1. **Thu thập yêu cầu & luồng nghiệp vụ**
	- Input: tài liệu yêu cầu, UI flow, DB schema (`ecom.sql`), routes/controllers.
	- Output: danh sách module/luồng ưu tiên.

2. **Lập Scenario list (mức cao)**
	- Output: `docs/adapted/Test_Scenario_REWRITE_NEEDED.md`.
	- Mục đích: gom theo module và định hướng mức kiểm thử (API/UI/perf).

3. **Thiết kế Test Case chi tiết**
	- Output: `docs/adapted/test case/TestCase_*.md`.
	- Mỗi test case có: precondition, steps, test data, expected, status.

4. **Chọn kỹ thuật test design và bổ sung negative/boundary**
	- EP/BVA/Decision Table/State Transition.
	- Bắt buộc có nhóm negative: thiếu token, input rỗng, id không tồn tại.

5. **Ánh xạ sang automation (nếu phù hợp)**
	- Backend: Jest/Supertest; DB-real tests cho các case cần xác nhận ORM/DB.
	- Frontend: Jest (service wrappers + component) + Cypress smoke.

6. **Chạy CI và thu minh chứng**
	- CI chạy trên GitHub Actions, upload artifacts/logs.
	- Khi fail: tự động tạo Issue/PR comment; fallback ghi vào `docs/CI_FAILURES.md`.

7. **Triage lỗi & cập nhật trạng thái test case**
	- Nếu là bug: tạo issue + fix + thêm regression test.
	- Nếu là flaky: giảm phụ thuộc môi trường (stub hoặc tách nightly).

8. **Tổng hợp Test Report**
	- Output: `docs/adapted/test report_REWRITE_NEEDED.md` + screenshot CI.

## 2) RACI (ai làm gì)

| Công việc | Dev BE | Dev FE | Tester/QA (trong nhóm) | Trưởng nhóm |
| --- | --- | --- | --- | --- |
| Scenario list | R | R | A | A |
| Test case chi tiết | R | R | A | A |
| Backend automation | R | C | C | A |
| Frontend unit tests | C | R | C | A |
| Cypress E2E smoke | C | R | C | A |
| CI/CD + artifacts | R | R | C | A |
| Test report + evidence | C | C | R | A |

R = Responsible, A = Accountable, C = Consulted.

## 3) Quy tắc “điểm cao”

- Mỗi artefact phải truy vết được: Scenario → Test case → Automation → Evidence (CI/log).
- Những phần chưa tự động hoá phải ghi rõ lý do (môi trường, dữ liệu) và có kế hoạch (planned).
- Ưu tiên minh chứng chạy thật (CI logs/artifacts) thay vì chỉ mô tả.
