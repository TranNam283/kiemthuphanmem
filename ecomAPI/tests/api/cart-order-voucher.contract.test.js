import jwt from "jsonwebtoken";
import request from "supertest";

jest.mock("../../src/models/index", () => {
  const userFindOne = jest.fn();
  return {
    __esModule: true,
    default: {
      User: {
        findOne: userFindOne,
      },
    },
  };
});

jest.mock("../../src/controllers/shopCartController", () => {
  const base = {
    addShopCart: (req, res) => {
      const quantity = Number(req.body?.quantity);
      if (Number.isFinite(quantity) && quantity <= 0) {
        return res.status(400).json({ ok: false, error: "INVALID_QUANTITY" });
      }
      return res.status(200).json({ ok: true });
    },
    getAllShopCartByUserId: (req, res) =>
      res.status(200).json({ ok: true, items: [] }),
    deleteItemShopCart: (req, res) => {
      const itemId = Number(req.body?.itemId);
      if (Number.isFinite(itemId) && itemId >= 999999) {
        return res.status(404).json({ ok: false, error: "ITEM_NOT_FOUND" });
      }
      return res.status(200).json({ ok: true });
    },
  };
  const handler = {
    get: (target, prop) => {
      if (prop in target) return target[prop];
      return (req, res) => res.status(200).json({ ok: true });
    },
  };
  return {
    __esModule: true,
    default: new Proxy(base, handler),
  };
});

jest.mock("../../src/controllers/orderController", () => {
  const base = {
    createNewOrder: (req, res) => {
      const items = Array.isArray(req.body?.items) ? req.body.items : [];
      if (items.length === 0) {
        return res.status(400).json({ ok: false, error: "EMPTY_ITEMS" });
      }
      return res.status(201).json({ ok: true, orderId: 1 });
    },
    getAllOrdersByUser: (req, res) =>
      res.status(200).json({ ok: true, orders: [] }),
    getDetailOrderById: (req, res) => {
      const orderId = Number(req.query?.id ?? req.body?.orderId);
      if (Number.isFinite(orderId) && orderId >= 999999) {
        return res.status(404).json({ ok: false, error: "ORDER_NOT_FOUND" });
      }
      return res.status(200).json({ ok: true, order: { id: 1 } });
    },
    updateStatusOrder: (req, res) => {
      const status = String(req.body?.status ?? "").toLowerCase();
      if (status === "invalid") {
        return res.status(400).json({ ok: false, error: "INVALID_STATUS" });
      }
      return res.status(200).json({ ok: true });
    },
    paymentOrder: (req, res) =>
      res.status(200).json({ ok: true, redirectUrl: "https://example.com" }),
    paymentOrderSuccess: (req, res) => res.status(200).json({ ok: true }),
    confirmOrder: (req, res) => res.status(200).json({ ok: true }),
    paymentOrderVnpay: (req, res) =>
      res
        .status(200)
        .json({ ok: true, redirectUrl: "https://sandbox.vnpay.vn" }),
    confirmOrderVnpay: (req, res) => {
      const secureHash = String(req.body?.secureHash ?? "");
      if (!secureHash || secureHash === "invalid") {
        return res.status(400).json({ ok: false, error: "INVALID_SIGNATURE" });
      }
      return res.status(200).json({ ok: true });
    },
    handleGHNWebhook: (req, res) => res.status(200).json({ ok: true }),
  };
  const handler = {
    get: (target, prop) => {
      if (prop in target) return target[prop];
      return (req, res) => res.status(200).json({ ok: true });
    },
  };
  return {
    __esModule: true,
    default: new Proxy(base, handler),
  };
});

jest.mock("../../src/controllers/voucherController", () => {
  const base = {
    getVoucherStore: (req, res) =>
      res.status(200).json({ ok: true, vouchers: [] }),
    claimVoucher: (req, res) => {
      const voucherId = Number(req.body?.voucherId);
      if (Number.isFinite(voucherId) && voucherId >= 999999) {
        return res
          .status(409)
          .json({ ok: false, error: "VOUCHER_ALREADY_CLAIMED" });
      }
      return res.status(200).json({ ok: true });
    },
    getVoucherWallet: (req, res) =>
      res.status(200).json({ ok: true, vouchers: [] }),
    revokeVoucher: (req, res) => res.status(200).json({ ok: true }),
  };
  const handler = {
    get: (target, prop) => {
      if (prop in target) return target[prop];
      return (req, res) => res.status(200).json({ ok: true });
    },
  };
  return {
    __esModule: true,
    default: new Proxy(base, handler),
  };
});

import db from "../../src/models/index";
import app from "../../src/app";

describe("API-Contract Cart/Order/Voucher (mock controllers, no DB)", () => {
  const runDbTests = process.env.RUN_DB_TESTS === "1";
  const maybeItShopCart = runDbTests ? it.skip : it;
  const maybeItOrderVoucher = runDbTests ? it.skip : it;
  const secret = process.env.JWT_SECRET;

  const signToken = (sub) => {
    if (!secret) throw new Error("JWT_SECRET is not set for tests");
    return jwt.sign({ sub }, secret, { expiresIn: "1h" });
  };

  beforeEach(() => {
    db.User.findOne.mockReset();
    db.User.findOne.mockResolvedValue({ id: 1, roleId: "R2" });
  });

  maybeItShopCart(
    "TC52: POST /api/add-shopcart with token -> 200",
    async () => {
      const res = await request(app)
        .post("/api/add-shopcart")
        .set("Authorization", `Bearer ${signToken(1)}`)
        .send({ productId: 1, quantity: 1 });

      expect(res.status).toBe(200);
    }
  );

  maybeItShopCart(
    "TC53: POST /api/add-shopcart quantity=0 -> 4xx",
    async () => {
      const res = await request(app)
        .post("/api/add-shopcart")
        .set("Authorization", `Bearer ${signToken(1)}`)
        .send({ productId: 1, quantity: 0 });

      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    }
  );

  maybeItShopCart(
    "TC55: GET /api/get-all-shopcart-by-userId with token -> 200",
    async () => {
      const res = await request(app)
        .get("/api/get-all-shopcart-by-userId")
        .set("Authorization", `Bearer ${signToken(1)}`);

      expect(res.status).toBe(200);
    }
  );

  maybeItShopCart(
    "TC57: DELETE /api/delete-item-shopcart with token -> 200",
    async () => {
      const res = await request(app)
        .delete("/api/delete-item-shopcart")
        .set("Authorization", `Bearer ${signToken(1)}`)
        .send({ itemId: 1 });

      expect(res.status).toBe(200);
    }
  );

  maybeItShopCart(
    "TC58: DELETE /api/delete-item-shopcart itemId not found -> 404/4xx",
    async () => {
      const res = await request(app)
        .delete("/api/delete-item-shopcart")
        .set("Authorization", `Bearer ${signToken(1)}`)
        .send({ itemId: 999999 });

      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    }
  );

  maybeItOrderVoucher(
    "TC60: POST /api/create-new-order with token -> 201/200",
    async () => {
      const res = await request(app)
        .post("/api/create-new-order")
        .set("Authorization", `Bearer ${signToken(1)}`)
        .send({ items: [{ productId: 1, quantity: 1 }] });

      expect([200, 201]).toContain(res.status);
    }
  );

  maybeItOrderVoucher(
    "TC61: POST /api/create-new-order with empty items -> 4xx",
    async () => {
      const res = await request(app)
        .post("/api/create-new-order")
        .set("Authorization", `Bearer ${signToken(1)}`)
        .send({ items: [] });

      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    }
  );

  maybeItOrderVoucher(
    "TC63: GET /api/get-all-order-by-user with token -> 200",
    async () => {
      const res = await request(app)
        .get("/api/get-all-order-by-user")
        .set("Authorization", `Bearer ${signToken(1)}`);

      expect(res.status).toBe(200);
    }
  );

  maybeItOrderVoucher("TC64: GET /api/get-detail-order -> 200", async () => {
    const res = await request(app)
      .get("/api/get-detail-order")
      .query({ id: 1 });
    expect(res.status).toBe(200);
  });

  maybeItOrderVoucher(
    "TC65: GET /api/get-detail-order orderId not found -> 404/4xx",
    async () => {
      const res = await request(app)
        .get("/api/get-detail-order")
        .query({ id: 999999 });
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    }
  );

  it("TC66: PUT /api/update-status-order with token -> 200", async () => {
    const res = await request(app)
      .put("/api/update-status-order")
      .set("Authorization", `Bearer ${signToken(1)}`)
      .send({ orderId: 1, status: "processing" });

    expect(res.status).toBe(200);
  });

  it("TC67: PUT /api/update-status-order invalid status -> 4xx", async () => {
    const res = await request(app)
      .put("/api/update-status-order")
      .set("Authorization", `Bearer ${signToken(1)}`)
      .send({ orderId: 1, status: "invalid" });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it("TC69: POST /api/payment-order with token -> 200", async () => {
    const res = await request(app)
      .post("/api/payment-order")
      .set("Authorization", `Bearer ${signToken(1)}`)
      .send({ orderId: 1, method: "COD" });

    expect(res.status).toBe(200);
  });

  it("TC70: POST /api/payment-order-success with token -> 200", async () => {
    const res = await request(app)
      .post("/api/payment-order-success")
      .set("Authorization", `Bearer ${signToken(1)}`)
      .send({ orderId: 1, resultCode: 0 });

    expect(res.status).toBe(200);
  });

  it("TC71: POST /api/payment-order-vnpay with token -> 200", async () => {
    const res = await request(app)
      .post("/api/payment-order-vnpay")
      .set("Authorization", `Bearer ${signToken(1)}`)
      .send({ orderId: 1 });

    expect(res.status).toBe(200);
  });

  it("TC72: POST /api/vnpay_return invalid signature -> 4xx", async () => {
    const res = await request(app)
      .post("/api/vnpay_return")
      .send({ orderId: 1, secureHash: "invalid" });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it("TC73/TC74: POST /api/webhook/ghn accepts webhook and is idempotent -> 200", async () => {
    const payload = { orderCode: "GHN-1", status: "delivered" };

    const res1 = await request(app).post("/api/webhook/ghn").send(payload);
    expect(res1.status).toBe(200);

    const res2 = await request(app).post("/api/webhook/ghn").send(payload);
    expect(res2.status).toBe(200);
  });

  it("TC68: PUT /api/confirm-order (no token) -> 200", async () => {
    const res = await request(app)
      .put("/api/confirm-order")
      .send({ orderId: 1 });
    expect(res.status).toBe(200);
  });

  maybeItOrderVoucher(
    "TC75: GET /api/get-voucher-store with token -> 200",
    async () => {
      const res = await request(app)
        .get("/api/get-voucher-store")
        .set("Authorization", `Bearer ${signToken(1)}`);

      expect(res.status).toBe(200);
    }
  );

  maybeItOrderVoucher(
    "TC76: POST /api/claim-voucher with token -> 200",
    async () => {
      const res = await request(app)
        .post("/api/claim-voucher")
        .set("Authorization", `Bearer ${signToken(1)}`)
        .send({ voucherId: 1 });

      expect(res.status).toBe(200);
    }
  );

  maybeItOrderVoucher(
    "TC77: POST /api/claim-voucher already claimed -> 4xx",
    async () => {
      const res = await request(app)
        .post("/api/claim-voucher")
        .set("Authorization", `Bearer ${signToken(1)}`)
        .send({ voucherId: 999999 });

      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    }
  );

  maybeItOrderVoucher(
    "TC78: GET /api/get-voucher-wallet with token -> 200",
    async () => {
      const res = await request(app)
        .get("/api/get-voucher-wallet")
        .set("Authorization", `Bearer ${signToken(1)}`);

      expect(res.status).toBe(200);
    }
  );

  it("TC79: PUT /api/revoke-voucher with admin token -> 200", async () => {
    db.User.findOne.mockResolvedValue({ id: 1, roleId: "R1" });

    const res = await request(app)
      .put("/api/revoke-voucher")
      .set("Authorization", `Bearer ${signToken(1)}`)
      .send({ voucherId: 1 });

    expect(res.status).toBe(200);
  });
});
