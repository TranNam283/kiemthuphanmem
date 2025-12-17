import http from "k6/http";
import { sleep } from "k6";

// Kiểm thử sức chịu đựng (Stress Testing)
// mô phỏng hệ thống hoạt động dưới tải cực đại hoặc vượt mức bình thường
// nhằm đánh giá giới hạn chịu tải và khả năng hồi phục của hệ thống
export let options = {
  stages: [
    { duration: "20s", target: 50 }, // tăng dần tới 50 VUs
    { duration: "20s", target: 200 }, // tăng dần tới 200 VUs
    { duration: "20s", target: 500 }, // tăng dần tới 500 VUs
    { duration: "10s", target: 800 }, // max VUs
    { duration: "10s", target: 0 }, // thả tải về 0
  ],
  thresholds: {
    http_req_duration: ["p(95)<1200"], // 95% request < 1.2s
    http_req_failed: ["rate<0.05"], // <= 5% request lỗi
  },
};

export default function () {
  http.get("http://localhost:8080/api/book/active");
  sleep(1);
}
