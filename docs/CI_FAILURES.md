# CI_FAILURES (Fallback)

File này dùng làm **fallback** khi GitHub Actions **không thể tạo GitHub Issue** (thiếu quyền `issues:write`, labels bị chặn, hoặc policy của repo).

- Workflow sẽ cố tạo Issue + comment PR.
- Nếu thất bại, workflow sẽ **append** một entry mới vào file này trong runner workspace và cố tạo PR (action `peter-evans/create-pull-request`).
- Nếu ngay cả tạo PR cũng bị chặn, workflow vẫn upload artifact `ci-fail-logs-*` để giảng viên/nhóm có thể tải log về.

## Entries

(Chưa có entry)
## 2025-12-17T18:30:17.462Z — [CI FAIL] Backend CI/CD - test - backend tests failed
- Run URL: https://github.com/floorgangs/ktpm/actions/runs/20313227460
- Commit: 82fb94b300f2087bc71feefd16809867a991d909
- Job: test
- Reason: failed to create issue via API: HttpError: Issues has been disabled in this repository.

```
==== BACKEND UNIT TEST OUTPUT (tail 100 lines) ====

> ecomapi@1.0.0 test:unit
> cross-env NODE_OPTIONS=--no-deprecation jest tests/unit --coverage --json --outputFile=ci-jest-unit.json

PASS tests/unit/productService.test.js
  Product Service - Discount Calculation
    ✓ Should calculate 20% discount correctly (4 ms)
    ✓ Should calculate 50% discount correctly (1 ms)
    ✓ Should throw error for invalid discount (18 ms)
    ✓ Should handle 0% discount (1 ms)
  Product Service - Filtering
    ✓ Should filter products by price range (1 ms)
    ✓ Should filter products by category (1 ms)
  Product Service - Pagination
    ✓ Should paginate correctly - page 1 (1 ms)
    ✓ Should paginate correctly - page 2 (1 ms)
    ✓ Should handle last page with fewer items
  Product Service - Search
    ✓ Should search by product name
    ✓ Should search by description
    ✓ Should return empty array when no match (1 ms)

PASS tests/unit/orderService.test.js
  Order Utilities - Unit Tests
    Order Data Validation
      ✓ Should validate correct order data (6 ms)
      ✓ Should reject missing userId (1 ms)
      ✓ Should reject empty items (1 ms)
    Total Calculation
      ✓ Should calculate total correctly
      ✓ Should handle single item (1 ms)
      ✓ Should return 0 for empty items
    Discount Application
      ✓ Should apply 10% discount (1 ms)
      ✓ Should apply 50% discount
      ✓ Should handle 0% discount
      ✓ Should reject invalid discount percent (11 ms)
    Order Status Validation
      ✓ Should accept valid status (1 ms)
      ✓ Should reject invalid status

PASS tests/unit/authService.test.js
  Auth Service - Password Hashing
    ✓ Should hash password correctly (97 ms)
    ✓ Should compare password correctly - match (168 ms)
    ✓ Should compare password correctly - no match (167 ms)
  Auth Service - Email Validation
    ✓ Should accept valid email (1 ms)
    ✓ Should reject invalid email (1 ms)
  Auth Service - Password Validation
    ✓ Should accept strong password
    ✓ Should reject weak password (1 ms)
    ✓ Should handle null/undefined password

Test Suites: 3 passed, 3 total
Tests:       32 passed, 32 total
Snapshots:   0 total
Time:        1.905 s
Ran all test suites matching /tests\/unit/i.
Test results written to: ci-jest-unit.json

==== BACKEND INTEGRATION TEST OUTPUT (tail 100 lines) ====

> ecomapi@1.0.0 test:integration
> cross-env NODE_OPTIONS=--no-deprecation jest tests/integration --coverage --no-coverage --json --outputFile=ci-jest-integration.json

PASS tests/integration/orderService.test.js
  Order Service - Integration
    Create Order
      ✓ Should create order successfully (5 ms)
      ✓ Should throw error for invalid order data (25 ms)
    Update Order Status
      ✓ Should update status to pending → processing (1 ms)
      ✓ Should reject invalid status (2 ms)
    Discount Calculation
      ✓ Should apply 10% discount correctly (1 ms)
      ✓ Should handle 0% discount

Test Suites: 10 skipped, 1 passed, 1 of 11 total
Tests:       34 skipped, 6 passed, 40 total
Snapshots:   0 total
Time:        8.852 s
Ran all test suites matching /tests\/integration/i.
Test results written to: ci-jest-integration.json

==== BACKEND DB-REAL TEST OUTPUT (tail 100 lines) ====
  ● Allcode API (real MySQL) › DB-ALLCODE-02: GET /api/get-all-code missing type -> errCode=1

    connect ECONNREFUSED 127.0.0.1:3307

    [0m [90m 12 |[39m
     [90m 13 |[39m [36masync[39m [36mfunction[39m ensureDatabaseExists() {
    [31m[1m>[22m[39m[90m 14 |[39m   [36mconst[39m conn [33m=[39m [36mawait[39m mysql[33m.[39mcreateConnection({
     [90m    |[39m                            [31m[1m^[22m[39m
     [90m 15 |[39m     host[33m:[39m dbHost[33m,[39m
     [90m 16 |[39m     port[33m:[39m dbPort[33m,[39m
     [90m 17 |[39m     user[33m:[39m dbUser[33m,[39m[0m

      at Object.createConnectionPromise [as createConnection] (node_modules/mysql2/promise.js:19:31)
      at createConnection (tests/integration/allcode.mysql.int.test.js:14:28)
      at Generator.call (tests/integration/allcode.mysql.int.test.js:2:1)
      at Generator._invoke [as next] (tests/integration/allcode.mysql.int.test.js:2:1)
      at asyncGeneratorStep (tests/integration/allcode.mysql.int.test.js:2:1)
      at asyncGeneratorStep (tests/integration/allcode.mysql.int.test.js:2:1)
      at _next (tests/integration/allcode.mysql.int.test.js:2:1)
      at tests/integration/allcode.mysql.int.test.js:2:1
      at apply (tests/integration/allcode.mysql.int.test.js:25:2)
      at apply (tests/integration/allcode.mysql.int.test.js:13:36)
      at ensureDatabaseExists (tests/integration/allcode.mysql.int.test.js:33:11)
      at Generator.call (tests/integration/allcode.mysql.int.test.js:2:1)
      at Generator._invoke [as next] (tests/integration/allcode.mysql.int.test.js:2:1)
      at asyncGeneratorStep (tests/integration/allcode.mysql.int.test.js:2:1)
      at asyncGeneratorStep (tests/integration/allcode.mysql.int.test.js:2:1)
      at _next (tests/integration/allcode.mysql.int.test.js:2:1)
      at Object.<anonymous> (tests/integration/allcode.mysql.int.test.js:2:1)

  ● Allcode API (real MySQL) › DB-ALLCODE-03: GET /api/get-list-allcode returns data + count

    connect ECONNREFUSED 127.0.0.1:3307

    [0m [90m 12 |[39m
     [90m 13 |[39m [36masync[39m [36mfunction[39m ensureDatabaseExists() {
    [31m[1m>[22m[39m[90m 14 |[39m   [36mconst[39m conn [33m=[39m [36mawait[39m mysql[33m.[39mcreateConnection({
     [90m    |[39m                            [31m[1m^[22m[39m
     [90m 15 |[39m     host[33m:[39m dbHost[33m,[39m
     [90m 16 |[39m     port[33m:[39m dbPort[33m,[39m
     [90m 17 |[39m     user[33m:[39m dbUser[33m,[39m[0m

      at Object.createConnectionPromise [as createConnection] (node_modules/mysql2/promise.js:19:31)
      at createConnection (tests/integration/allcode.mysql.int.test.js:14:28)
      at Generator.call (tests/integration/allcode.mysql.int.test.js:2:1)
      at Generator._invoke [as next] (tests/integration/allcode.mysql.int.test.js:2:1)
      at asyncGeneratorStep (tests/integration/allcode.mysql.int.test.js:2:1)
      at asyncGeneratorStep (tests/integration/allcode.mysql.int.test.js:2:1)
      at _next (tests/integration/allcode.mysql.int.test.js:2:1)
      at tests/integration/allcode.mysql.int.test.js:2:1
      at apply (tests/integration/allcode.mysql.int.test.js:25:2)
      at apply (tests/integration/allcode.mysql.int.test.js:13:36)
      at ensureDatabaseExists (tests/integration/allcode.mysql.int.test.js:33:11)
      at Generator.call (tests/integration/allcode.mysql.int.test.js:2:1)
      at Generator._invoke [as next] (tests/integration/allcode.mysql.int.test.js:2:1)
      at asyncGeneratorStep (tests/integration/allcode.mysql.int.test.js:2:1)
      at asyncGeneratorStep (tests/integration/allcode.mysql.int.test.js:2:1)
      at _next (tests/integration/allcode.mysql.int.test.js:2:1)
      at Object.<anonymous> (tests/integration/allcode.mysql.int.test.js:2:1)

FAIL tests/integration/product.detail.mysql.int.test.js
  Product/Detail API (real MySQL)
    ✕ DB-PRODUCT-DETAIL-01: GET /api/get-detail-product-by-id returns product

  ● Product/Detail API (real MySQL) › DB-PRODUCT-DETAIL-01: GET /api/get-detail-product-by-id returns product

    connect ECONNREFUSED 127.0.0.1:3307

    [0m [90m 12 |[39m
     [90m 13 |[39m [36masync[39m [36mfunction[39m ensureDatabaseExists() {
    [31m[1m>[22m[39m[90m 14 |[39m   [36mconst[39m conn [33m=[39m [36mawait[39m mysql[33m.[39mcreateConnection({
     [90m    |[39m                            [31m[1m^[22m[39m
     [90m 15 |[39m     host[33m:[39m dbHost[33m,[39m
     [90m 16 |[39m     port[33m:[39m dbPort[33m,[39m
     [90m 17 |[39m     user[33m:[39m dbUser[33m,[39m[0m

      at Object.createConnectionPromise [as createConnection] (node_modules/mysql2/promise.js:19:31)
      at createConnection (tests/integration/product.detail.mysql.int.test.js:14:28)
      at Generator.call (tests/integration/product.detail.mysql.int.test.js:2:1)
      at Generator._invoke [as next] (tests/integration/product.detail.mysql.int.test.js:2:1)
      at asyncGeneratorStep (tests/integration/product.detail.mysql.int.test.js:2:1)
      at asyncGeneratorStep (tests/integration/product.detail.mysql.int.test.js:2:1)
      at _next (tests/integration/product.detail.mysql.int.test.js:2:1)
      at tests/integration/product.detail.mysql.int.test.js:2:1
      at apply (tests/integration/product.detail.mysql.int.test.js:25:2)
      at apply (tests/integration/product.detail.mysql.int.test.js:13:36)
      at ensureDatabaseExists (tests/integration/product.detail.mysql.int.test.js:33:11)
      at Generator.call (tests/integration/product.detail.mysql.int.test.js:2:1)
      at Generator._invoke [as next] (tests/integration/product.detail.mysql.int.test.js:2:1)
      at asyncGeneratorStep (tests/integration/product.detail.mysql.int.test.js:2:1)
      at asyncGeneratorStep (tests/integration/product.detail.mysql.int.test.js:2:1)
      at _next (tests/integration/product.detail.mysql.int.test.js:2:1)
      at Object.<anonymous> (tests/integration/product.detail.mysql.int.test.js:2:1)

Test Suites: 10 failed, 10 total
Tests:       34 failed, 34 total
Snapshots:   0 total
Time:        7.174 s
Ran all test suites.
Test results written to: ci-jest-db.json

```
