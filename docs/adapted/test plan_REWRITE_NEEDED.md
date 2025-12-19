# Test Plan (KTPM) — Kế hoạch kiểm thử

> Dự án: KTPM eCommerce (bán quần áo)
>
> Phiên bản: 1.0 — 19/12/2025

## 1) Mục tiêu

- Xác nhận các luồng chính hoạt động đúng: đăng nhập → duyệt sản phẩm → giỏ hàng → tạo đơn.
- Phát hiện lỗi sớm thông qua test tự động (backend Jest/Supertest + frontend Jest + Cypress smoke + k6).
- Tạo **minh chứng** có thể nộp: report/logs/artifacts từ CI.

## 2) Phạm vi

### In-scope

- Backend API: Auth, Product list/detail, Cart, Order (tối thiểu), quyền truy cập.
- Frontend UI: các màn hình chính (homepage/login/shop/shopcart) ở mức smoke.
- Phi chức năng: kịch bản k6 (load/stress) để minh hoạ.

### Out-of-scope (hoặc chỉ planned)

- Thanh toán thật (gateway), đối soát, email/OTP thật.
- Kiểm thử bảo mật chuyên sâu (pentest), fuzzing lớn.
- E2E “full checkout” nếu thiếu seed/điều kiện môi trường.

## 3) Chiến lược theo V-Model

- Unit: test utils/service wrappers (ổn định, chạy nhanh).
- Integration: backend DB-real với MySQL (giảm rủi ro mismatch ORM/DB).
- System: Cypress smoke (UI wiring + routing + basic flows).
- Acceptance: checklist UAT/manual dựa trên yêu cầu/luồng nghiệp vụ.

## 4) Môi trường kiểm thử

- Local dev:
  - Backend: Node.js + MySQL (Docker compose hoặc MySQL local).
  - Frontend: React/CRACO.
- CI (GitHub Actions):
  - Backend job có MySQL service container.
  - Frontend job chạy Jest + Cypress + build.

## 5) Dữ liệu kiểm thử (test data strategy)

- Tài khoản user/admin: dùng seed hoặc stub trong Cypress smoke (để giảm flaky).
- Sản phẩm: ưu tiên seed có sẵn trong `ecom.sql` (khi chạy docker-compose) hoặc stub list trong Cypress.
- Địa chỉ/ship: mock dữ liệu GHN ở unit tests để không gọi network.

## 6) Tiêu chí vào/ra (Entry/Exit Criteria)

### Entry

- Code build được; cấu hình env cơ bản hợp lệ.
- DB schema/seed sẵn sàng (nếu chạy DB-real).

### Exit

- Backend: tất cả test bắt buộc PASS (DB-real nếu bật trong CI).
- Frontend: Jest PASS; Cypress smoke PASS; build PASS.
- Có report/logs/artifacts (để chụp minh chứng nộp).

## 7) Deliverables (Artefacts)

- Scenario list: `docs/adapted/Test_Scenario_REWRITE_NEEDED.md`
- Test cases theo module: `docs/adapted/test case/*.md`
- Unit test inventory: `docs/adapted/unit test_REWRITE_NEEDED.md`
- Test report: `docs/adapted/test report_REWRITE_NEEDED.md`
- CI workflows: `.github/workflows/*` + artifacts

## 8) Rủi ro & biện pháp

- Flaky UI tests do phụ thuộc backend/DB → dùng smoke + stub API, và (tuỳ chọn) tách real E2E vào workflow manual/nightly.
- Thiếu dữ liệu seed đồng nhất → ưu tiên docker-compose (mysql + import `ecom.sql`).
- “Chứng cứ” khi CI fail → workflow upload logs + fallback vào `docs/CI_FAILURES.md`.
