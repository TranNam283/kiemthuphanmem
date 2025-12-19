# Unit Test Inventory (KTPM) — Danh mục unit test theo layer

> Mục tiêu: trình bày danh sách unit tests theo “đơn vị cần test” (unit under test) và gắn link sang file test thực tế.

## 1) Quy ước ID

- Backend unit: `UT-BE-UTIL-NN` (ưu tiên utils vì ổn định)
- Frontend unit: `UT-FE-SVC-NN` (service wrappers), `UT-FE-CMP-NN` (components)

## 2) Backend — Unit (utils)

| Test ID       | Unit Under Test         | Mô tả                              | Dữ liệu test          | Kết quả mong đợi                         | Mapping code/test                                |
| ------------- | ----------------------- | ---------------------------------- | --------------------- | ---------------------------------------- | ------------------------------------------------ |
| UT-BE-UTIL-01 | Password hashing        | Hash + compare password đúng       | password hợp lệ + sai | hash khác plain; compare true/false đúng | `ecomAPI/src/utils/authUtils.js` + tests/unit    |
| UT-BE-UTIL-02 | Validate email/password | Kiểm tra email/password theo rule  | email sai, pass yếu   | trả false/throw đúng                     | `ecomAPI/src/utils/authUtils.js` + tests/unit    |
| UT-BE-UTIL-03 | Product pricing         | Tính giá giảm, tìm kiếm/phân trang | price/percent/keyword | total đúng + paginate đúng               | `ecomAPI/src/utils/productUtils.js` + tests/unit |
| UT-BE-UTIL-04 | Order total             | Tính tổng tiền + discount          | items + voucher       | total đúng                               | `ecomAPI/src/utils/orderUtils.js` + tests/unit   |

Ghi chú: backend report tổng hợp nằm ở `ecomAPI/jest-results.json`.

## 3) Frontend — Unit (service wrappers + config)

| Test ID      | Unit Under Test                 | Mô tả                   | Dữ liệu test            | Kết quả mong đợi                  | Mapping code/test                                        |
| ------------ | ------------------------------- | ----------------------- | ----------------------- | --------------------------------- | -------------------------------------------------------- |
| UT-FE-SVC-01 | `handleLoginService`            | Gọi đúng endpoint login | {email,password}        | gọi `POST /api/login`             | `eCommerce_Reactjs/src/services/userService.test.js`     |
| UT-FE-SVC-02 | `getAllProductUser`             | Build query string đúng | limit/offset/keyword    | URL chứa params + keyword encoded | `eCommerce_Reactjs/src/services/userService.test.js`     |
| UT-FE-SVC-03 | `addShopCartService`            | Post add to cart        | payload                 | gọi `POST /api/add-shopcart`      | `eCommerce_Reactjs/src/services/userService.test.js`     |
| UT-FE-SVC-04 | `getAllShopCartByUserIdService` | Get cart by user        | id                      | gọi URL đúng                      | `eCommerce_Reactjs/src/services/userService.test.js`     |
| UT-FE-SVC-05 | Axios baseURL                   | baseURL lấy từ env      | `REACT_APP_BACKEND_URL` | `instance.defaults.baseURL` đúng  | `eCommerce_Reactjs/src/axios.test.js`                    |
| UT-FE-SVC-06 | Axios auth header               | gắn Bearer token        | token in localStorage   | request config có `Authorization` | `eCommerce_Reactjs/src/axios.test.js`                    |
| UT-FE-SVC-07 | GHN mock order                  | Tạo mã GHN giả lập      | order data              | trả errCode 0 + orderCode fake    | `eCommerce_Reactjs/src/services/ghnService.test.js`      |
| UT-FE-SVC-08 | Shipping options                | Map địa chỉ + fee       | province/district/ward  | trả option GHN available          | `eCommerce_Reactjs/src/services/shippingService.test.js` |

## 4) Frontend — Unit (component)

| Test ID      | Unit Under Test | Mô tả                         | Dữ liệu test        | Kết quả mong đợi               | Mapping code/test                                             |
| ------------ | --------------- | ----------------------------- | ------------------- | ------------------------------ | ------------------------------------------------------------- |
| UT-FE-CMP-01 | `ItemProduct`   | Render tên + link detail đúng | props id/name/price | link tới `/detail-product/:id` | `eCommerce_Reactjs/src/component/Product/ItemProduct.test.js` |

## 5) Kết luận ngắn (phục vụ V-Model)

- Unit tests đảm bảo module-level correctness (utils/service wrappers/component render).
- Integration & System tests được mô tả ở các artefact riêng và triển khai qua Jest DB-real + Cypress.
