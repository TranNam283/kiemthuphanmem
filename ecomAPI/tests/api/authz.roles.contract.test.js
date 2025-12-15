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

jest.mock("../../src/controllers/userController", () => {
  const base = {
    getAllUser: (req, res) => res.status(200).json({ ok: true, users: [] }),
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

jest.mock("../../src/controllers/productController", () => {
  const base = {
    createNewProduct: (req, res) => res.status(201).json({ ok: true }),
    updateProduct: (req, res) => res.status(200).json({ ok: true }),
    UnactiveProduct: (req, res) => res.status(200).json({ ok: true }),
    ActiveProduct: (req, res) => res.status(200).json({ ok: true }),
    getAllProductAdmin: (req, res) =>
      res.status(200).json({ ok: true, items: [] }),
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
    createNewVoucher: (req, res) => res.status(201).json({ ok: true }),
    updateVoucher: (req, res) => res.status(200).json({ ok: true }),
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

describe("API-Contract AuthZ roles (mock DB + mock controllers)", () => {
  const secret = process.env.JWT_SECRET;

  const signToken = (sub) => {
    if (!secret) {
      throw new Error("JWT_SECRET is not set for tests");
    }
    return jwt.sign({ sub }, secret, { expiresIn: "1h" });
  };

  beforeEach(() => {
    db.User.findOne.mockReset();
  });

  it("TC38: GET /api/get-all-user with admin token -> 200", async () => {
    db.User.findOne.mockResolvedValue({ id: 1, roleId: "R1" });

    const res = await request(app)
      .get("/api/get-all-user")
      .set("Authorization", `Bearer ${signToken(1)}`);

    expect(res.status).toBe(200);
  });

  it("TC39: GET /api/get-all-user with user token -> 404 (insufficient role)", async () => {
    db.User.findOne.mockResolvedValue({ id: 2, roleId: "R2" });

    const res = await request(app)
      .get("/api/get-all-user")
      .set("Authorization", `Bearer ${signToken(2)}`);

    expect(res.status).toBe(404);
  });

  it("TC89: GET /api/get-all-user with user token (security) -> 404/blocked", async () => {
    const res = await request(app)
      .get("/api/get-all-user")
      .set("Authorization", `Bearer ${signToken(2)}`);
    expect([403, 404]).toContain(res.status);
  });

  it("TC45: POST /api/create-new-product with admin token -> 201", async () => {
    db.User.findOne.mockResolvedValue({ id: 1, roleId: "R4" });

    const res = await request(app)
      .post("/api/create-new-product")
      .set("Authorization", `Bearer ${signToken(1)}`)
      .send({ name: "P", price: 100 });

    expect(res.status).toBe(201);
  });

  it("TC46: POST /api/create-new-product with user token -> 404 (insufficient role)", async () => {
    db.User.findOne.mockResolvedValue({ id: 2, roleId: "R2" });

    const res = await request(app)
      .post("/api/create-new-product")
      .set("Authorization", `Bearer ${signToken(2)}`)
      .send({ name: "P", price: 100 });

    expect(res.status).toBe(404);
  });

  it("TC47: PUT /api/update-product with admin token -> 200", async () => {
    db.User.findOne.mockResolvedValue({ id: 1, roleId: "R1" });

    const res = await request(app)
      .put("/api/update-product")
      .set("Authorization", `Bearer ${signToken(1)}`)
      .send({ id: 1, name: "P2" });

    expect(res.status).toBe(200);
  });

  it("TC48: POST /api/unactive-product with admin token -> 200", async () => {
    db.User.findOne.mockResolvedValue({ id: 1, roleId: "R1" });

    const res = await request(app)
      .post("/api/unactive-product")
      .set("Authorization", `Bearer ${signToken(1)}`)
      .send({ id: 1 });

    expect(res.status).toBe(200);
  });

  it("TC49: POST /api/active-product with admin token -> 200", async () => {
    db.User.findOne.mockResolvedValue({ id: 1, roleId: "R1" });

    const res = await request(app)
      .post("/api/active-product")
      .set("Authorization", `Bearer ${signToken(1)}`)
      .send({ id: 1 });

    expect(res.status).toBe(200);
  });

  it("TC50: GET /api/get-all-product-admin with admin token -> 200", async () => {
    db.User.findOne.mockResolvedValue({ id: 1, roleId: "R4" });

    const res = await request(app)
      .get("/api/get-all-product-admin")
      .set("Authorization", `Bearer ${signToken(1)}`);

    expect(res.status).toBe(200);
  });

  it("TC80: POST /api/create-new-voucher with admin token -> 201", async () => {
    db.User.findOne.mockResolvedValue({ id: 1, roleId: "R1" });

    const res = await request(app)
      .post("/api/create-new-voucher")
      .set("Authorization", `Bearer ${signToken(1)}`)
      .send({ code: "VOUCHER", discount: 10 });

    expect(res.status).toBe(201);
  });

  it("TC81: PUT /api/update-voucher with admin token -> 200", async () => {
    db.User.findOne.mockResolvedValue({ id: 1, roleId: "R1" });

    const res = await request(app)
      .put("/api/update-voucher")
      .set("Authorization", `Bearer ${signToken(1)}`)
      .send({ id: 1, code: "VOUCHER2" });

    expect(res.status).toBe(200);
  });

  it("TC82: POST /api/create-new-voucher with user token -> 404 (insufficient role)", async () => {
    db.User.findOne.mockResolvedValue({ id: 2, roleId: "R2" });

    const res = await request(app)
      .post("/api/create-new-voucher")
      .set("Authorization", `Bearer ${signToken(2)}`)
      .send({ code: "V", discount: 1 });

    expect(res.status).toBe(404);
  });
});
