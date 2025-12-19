# Test Report (KTPM) — Báo cáo kết quả kiểm thử

> Dự án: KTPM eCommerce (bán quần áo)
>
> Kỳ báo cáo: 19/12/2025

## 1) Tóm tắt (Executive Summary)

- Backend: có automated tests (Jest/Supertest) + có DB-real (MySQL) khi chạy CI.
- Frontend: có unit tests (Jest) + E2E smoke (Cypress) trong CI.
- Phi chức năng: có script k6 (load/stress) để minh hoạ.

## 2) Phạm vi & môi trường chạy

- CI: GitHub Actions
  - Backend workflow: `.github/workflows/backend-ci.yml`
  - Frontend workflow: `.github/workflows/frontend-ci.yml`
- Local/Docker: `docker-compose.yml` (mysql + backend + frontend) dùng để demo real backend nếu cần.

## 3) Kết quả theo tầng (V-Model)

### 3.1 Unit tests

| Hạng mục                              | Công cụ | Kết quả                    | Evidence                          |
| ------------------------------------- | ------- | -------------------------- | --------------------------------- |
| Backend utils                         | Jest    | PASS/Report trong repo     | `ecomAPI/jest-results.json`       |
| Frontend service wrappers + component | Jest    | PASS (13 tests / 6 suites) | `eCommerce_Reactjs/src/*.test.js` |

### 3.2 Integration tests

| Hạng mục                | Công cụ                   | Kết quả              | Evidence                          |
| ----------------------- | ------------------------- | -------------------- | --------------------------------- |
| Backend DB-real (MySQL) | Jest + MySQL service (CI) | PASS khi bật DB-real | workflow backend + artifacts/logs |

### 3.3 System tests (E2E)

| Hạng mục                            | Công cụ | Kết quả   | Evidence                                        |
| ----------------------------------- | ------- | --------- | ----------------------------------------------- |
| UI smoke (homepage/login/shop/cart) | Cypress | PASS (CI) | Cypress artifacts (screenshots/videos khi fail) |

Ghi chú quan trọng: các E2E smoke hiện ưu tiên ổn định CI nên có kịch bản dùng `cy.intercept()` để stub API.

### 3.4 Acceptance (UAT/manual)

| Hạng mục                     | Hình thức | Trạng thái                | Evidence                    |
| ---------------------------- | --------- | ------------------------- | --------------------------- |
| UAT checklist luồng mua hàng | Manual    | ⏳ Thực hiện khi demo/nộp | (chụp màn hình/clip + link) |

## 4) Thống kê nhanh (minh chứng trong repo)

### 4.1 Backend (Jest/Supertest)

Nguồn: `ecomAPI/jest-results.json`.

- Test suites: 17
- Total tests: 116
- PASS: 109
- PENDING: 7
- FAIL: 0

### 4.2 Frontend (Jest)

- Test suites: 6
- Total tests: 13
- FAIL: 0

### 4.3 Cypress E2E smoke

- Số spec: 4
- Luồng cover: homepage, login, browse shop, view cart

## 5) Defects đã phát hiện / bài học

| ID     | Mô tả                                  | Tầng phát hiện      | Mức độ | Trạng thái | Ghi chú                          |
| ------ | -------------------------------------- | ------------------- | ------ | ---------- | -------------------------------- |
| DEF-01 | API get user by email lỗi query/export | Integration/DB-real | Medium | ✅ Fixed   | phát hiện khi tăng DB-real tests |

## 6) Rủi ro còn lại & đề xuất

- PENDING tests: ưu tiên chuyển dần sang PASS để bộ test “đóng” hoàn toàn.
- E2E hiện mới smoke: cần mở rộng checkout/payment và edge cases (tối thiểu 1 luồng real backend chạy manual/nightly).
- Acceptance: cần checklist UAT có evidence (ảnh/clip).

## 7) Danh sách minh chứng cần chụp (để nộp Word)

- Screenshot GitHub Actions run (Backend + Frontend).
- Screenshot step “Run unit tests” (frontend) và “Run Cypress E2E”.
- Link artifact: `cypress-artifacts-*` (khi fail) và logs/coverage.
