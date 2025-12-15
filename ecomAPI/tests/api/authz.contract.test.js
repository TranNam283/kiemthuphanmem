import request from "supertest";
import app from "../../src/app";

describe("API-Contract AuthZ (no DB)", () => {
  it("TC35: POST /api/changepassword without token -> 401", async () => {
    const res = await request(app).post("/api/changepassword").send({
      oldPassword: "old",
      newPassword: "new",
    });
    expect(res.status).toBe(401);
  });

  it("TC51: GET /api/get-all-product-admin without token -> 401", async () => {
    const res = await request(app).get("/api/get-all-product-admin");
    expect(res.status).toBe(401);
  });

  it("TC51: GET /api/get-all-product-admin with invalid token -> 403", async () => {
    const res = await request(app)
      .get("/api/get-all-product-admin")
      .set("Authorization", "Bearer invalid.token.value");
    expect(res.status).toBe(403);
  });

  it("TC54: POST /api/add-shopcart without token -> 401", async () => {
    const res = await request(app).post("/api/add-shopcart").send({
      productId: 1,
      quantity: 1,
    });
    expect(res.status).toBe(401);
  });

  it("TC59: DELETE /api/delete-item-shopcart without token -> 401", async () => {
    const res = await request(app)
      .delete("/api/delete-item-shopcart")
      .send({ itemId: 1 });
    expect(res.status).toBe(401);
  });

  it("TC62: POST /api/create-new-order without token -> 401", async () => {
    const res = await request(app)
      .post("/api/create-new-order")
      .send({
        items: [{ productId: 1, quantity: 1 }],
        address: "test",
        paymentMethod: "COD",
      });
    expect(res.status).toBe(401);
  });

  it("Voucher group: GET /api/get-voucher-store without token -> 401", async () => {
    const res = await request(app).get("/api/get-voucher-store");
    expect(res.status).toBe(401);
  });

  it("Non-functional/AuthZ: GET /api/get-all-user without token -> 401", async () => {
    const res = await request(app).get("/api/get-all-user");
    expect(res.status).toBe(401);
  });
});
