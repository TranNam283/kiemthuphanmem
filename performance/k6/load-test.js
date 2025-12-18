import http from "k6/http";
import { check, sleep } from "k6";

/*
  NOTE (Provenance): This script is an adaptation inspired by the structure of k6 examples
  from the reference repo `fullstack-vitejs-books/performance/k6`. It has been rewritten to
  target THIS project (KTPM - ecom clothing) endpoints and payloads.

  Key changes vs. reference:
  - Uses /api/login (returns accessToken + user) instead of /api/auth/login + /api/auth/me
  - Uses /api/get-all-product-user and /api/add-shopcart with productdetailsizeId
  - Uses env vars for credentials and base URL
*/

const BASE_URL = __ENV.BASE_URL || "http://localhost:8080";
const USER_EMAIL = __ENV.K6_USER_EMAIL;
const USER_PASSWORD = __ENV.K6_USER_PASSWORD;

export const options = {
  vus: Number(__ENV.VUS || 100),
  duration: __ENV.DURATION || "60s",
};

function jsonHeaders(extra = {}) {
  return {
    headers: {
      "Content-Type": "application/json",
      ...extra,
    },
  };
}

function loginIfConfigured() {
  if (!USER_EMAIL || !USER_PASSWORD) return null;

  const res = http.post(
    `${BASE_URL}/api/login`,
    JSON.stringify({ email: USER_EMAIL, password: USER_PASSWORD }),
    jsonHeaders()
  );

  const ok = check(res, {
    "login status 200": (r) => r.status === 200,
    "login has accessToken": (r) => !!r.json("accessToken"),
  });
  if (!ok) return null;

  return {
    accessToken: res.json("accessToken"),
    userId: res.json("user.id"),
  };
}

function pickProductDetailSizeId(productsRes) {
  try {
    const data = productsRes.json("data");
    if (!Array.isArray(data) || data.length === 0) return null;

    const first = data[0];
    const details = first && first.productDetail;
    const firstDetail = Array.isArray(details) && details.length > 0 ? details[0] : null;
    const sizes = firstDetail && firstDetail.productDetailSize;
    const firstSize = Array.isArray(sizes) && sizes.length > 0 ? sizes[0] : null;
    return firstSize && firstSize.id ? firstSize.id : null;
  } catch (e) {
    return null;
  }
}

export default function () {
  // Public browsing: product list (includes details + sizes)
  const productsRes = http.get(`${BASE_URL}/api/get-all-product-user?limit=10&offset=0`);
  check(productsRes, {
    "products status 200": (r) => r.status === 200,
  });

  // Authenticated action (optional): add item to cart
  const session = loginIfConfigured();
  if (session && session.accessToken && session.userId) {
    const productDetailSizeId = pickProductDetailSizeId(productsRes);
    if (productDetailSizeId) {
      const addCartRes = http.post(
        `${BASE_URL}/api/add-shopcart`,
        JSON.stringify({
          userId: session.userId,
          productdetailsizeId: productDetailSizeId,
          quantity: 1,
        }),
        jsonHeaders({ Authorization: `Bearer ${session.accessToken}` })
      );

      check(addCartRes, {
        "add-to-cart status 200": (r) => r.status === 200,
      });
    }
  }

  sleep(1);
}
