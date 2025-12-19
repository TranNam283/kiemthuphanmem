# Evidence Capture Guide (KTPM)

Mục tiêu: hướng dẫn chụp “minh chứng” để đưa vào Word/Chương 4 (CI/CD + test results) theo tiêu chí chấm điểm.

## 1) Screenshot cần chụp trên GitHub Actions

Chụp từ trang Actions của repo (run gần nhất):

1. **Danh sách workflow**
   - Backend CI/CD: trạng thái (green)
   - Frontend CI/CD: trạng thái (green)

2. **Frontend CI/CD run**
   - Step `Run unit tests`
   - Step `Run Cypress E2E (smoke)`
   - Step `Build production`
   - Trang artifacts (nếu có)

3. **Backend CI/CD run**
   - Step chạy test (unit/integration/DB-real nếu có)
   - Coverage/artifacts

## 2) Minh chứng tại repo (để trích dẫn)

- Backend report: `ecomAPI/jest-results.json`
- Frontend unit tests: `eCommerce_Reactjs/src/*.test.js`
- Cypress specs: `eCommerce_Reactjs/cypress/e2e/*.cy.js`
- Workflow: `.github/workflows/frontend-ci.yml`

## 3) Gợi ý đặt tên hình để đưa vào Word

- `H4_01_Actions_Overview.png`
- `H4_02_FE_Jest_Unit.png`
- `H4_03_FE_Cypress_Smoke.png`
- `H4_04_FE_Build.png`
- `H4_05_BE_DB_Real.png`

## 4) Nếu CI fail

- Tải artifact logs (`ci-fail-logs-*`, `cypress-artifacts-*`).
- Nếu workflow không tạo được issue thì kiểm tra `docs/CI_FAILURES.md`.
