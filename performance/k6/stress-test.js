import http from "k6/http";
import { check, sleep } from "k6";

/*
  NOTE (Provenance): This file was initially inspired by the idea of having a k6
  "stress test" script in the reference repo `fullstack-vitejs-books/performance/k6`.
  The implementation below is rewritten for THIS project (KTPM - ecom clothing):
  - Uses scenario-based load shaping (not the same stage list)
  - Targets KTPM public product browsing endpoint
*/

const BASE_URL = __ENV.BASE_URL || "http://localhost:8080";
const LIMIT = Number(__ENV.LIMIT || 12);

// Stress testing: push beyond normal traffic and observe error/latency behavior.
// Using arrival-rate helps keep pressure steady even if requests slow down.
export const options = {
  scenarios: {
    spike_browse_products: {
      executor: "ramping-arrival-rate",
      startRate: 5,
      timeUnit: "1s",
      stages: [
        { target: 20, duration: "20s" },
        { target: 80, duration: "20s" },
        { target: 160, duration: "20s" },
        { target: 0, duration: "10s" },
      ],
      preAllocatedVUs: 50,
      maxVUs: 800,
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<1500"],
    http_req_failed: ["rate<0.05"],
  },
};

export default function () {
  const offset = Math.floor(Math.random() * 5) * LIMIT;
  const url = `${BASE_URL}/api/get-all-product-user?limit=${LIMIT}&offset=${offset}`;
  const res = http.get(url);

  check(res, {
    "products status 200": (r) => r.status === 200,
  });

  sleep(0.5);
}
