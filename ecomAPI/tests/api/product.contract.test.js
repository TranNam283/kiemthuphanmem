import request from "supertest";

const runDbTests = process.env.RUN_DB_TESTS === "1";
const maybeIt = runDbTests ? it.skip : it;

jest.mock("../../src/controllers/productController", () => {
  const base = {
    getAllProductUser: (req, res) =>
      res.status(200).json({ ok: true, items: [], query: req.query || {} }),

    getDetailProductById: (req, res) => {
      const id = req.query?.id ?? req.query?.productId;
      if (!id)
        return res.status(400).json({ ok: false, message: "missing id" });
      if (String(id) === "999999") {
        return res.status(404).json({ ok: false, message: "not found" });
      }
      return res.status(200).json({ ok: true, id });
    },

    getProductNew: (req, res) => res.status(200).json({ ok: true, items: [] }),
    getProductFeature: (req, res) =>
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

import app from "../../src/app";

describe("API-Contract Product (mock controller, no DB)", () => {
  it("TC40: GET /api/get-all-product-user -> 200", async () => {
    const res = await request(app).get("/api/get-all-product-user");
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/json/);
  });

  it("TC41: GET /api/get-detail-product-by-id with valid id -> 200", async () => {
    const res = await request(app)
      .get("/api/get-detail-product-by-id")
      .query({ id: 1 });
    expect(res.status).toBe(200);
  });

  it("TC42: GET /api/get-detail-product-by-id with non-existent id -> 404", async () => {
    const res = await request(app)
      .get("/api/get-detail-product-by-id")
      .query({ id: 999999 });
    expect(res.status).toBe(404);
  });

  maybeIt("TC43: GET /api/get-product-new -> 200", async () => {
    const res = await request(app).get("/api/get-product-new");
    expect(res.status).toBe(200);
  });

  maybeIt("TC44: GET /api/get-product-feature -> 200", async () => {
    const res = await request(app).get("/api/get-product-feature");
    expect(res.status).toBe(200);
  });
});
