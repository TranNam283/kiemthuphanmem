import http from "k6/http";
import { sleep } from "k6";

// Kiểm thử tải (Load Testing)
// đánh giá xem hệ thống hoạt động ra sao khi nhiều người dùng truy cập cùng lúc, nhằm đảm bảo phần mềm chạy ổn định dưới tải thực tế

export let options = {
  vus: 100, // 100 người dùng
  duration: "60s",
};

export default function () {
  // Đăng nhập
  let loginRes = http.post(
    "http://localhost:8080/api/auth/login",
    JSON.stringify({
      email: "quanglam@456",
      password: "456789",
    }),
    { headers: { "Content-Type": "application/json" } }
  );

  let token = loginRes.json("token");

  // lấy thông tin tài khoản
  let meRes = http.get("http://localhost:8080/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let userData = JSON.parse(meRes.body);
  let userId = userData.id;

  // Lấy các sản phẩm
  http.get("http://localhost:8080/api/book/active");

  // Xem chi tiết sản phẩm
  http.get(
    "http://localhost:8080/api/book/active/hoi-ky-alex-ferguson-tai-ban-2024"
  );

  // Thêm sản phẩm vào giỏ
  http.post(
    `http://localhost:8080/api/cart?userId=${userId}&bookId=658858f3-3265-4009-a6c1-d11c06215d8d&quantity=1`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  sleep(1);
}
