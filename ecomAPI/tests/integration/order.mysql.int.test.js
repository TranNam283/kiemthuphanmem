import request from "supertest";
import mysql from "mysql2/promise";
import { Op } from "sequelize";

import app from "../../src/app";
import db from "../../src/models";

const dbHost = process.env.DB_HOST || "127.0.0.1";
const dbPort = Number(process.env.DB_PORT || 3306);
const dbName = process.env.DB_NAME || "ecom";
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "";

async function ensureDatabaseExists() {
  const conn = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    multipleStatements: true,
  });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await conn.end();
}

const runDbTests = process.env.RUN_DB_TESTS === "1";
const maybeDescribe = runDbTests ? describe : describe.skip;

function formatSequelizeError(error) {
  const original = error?.original || error?.parent;
  const parts = [
    error?.name,
    error?.message,
    original?.code,
    original?.errno,
    original?.sqlMessage,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" | ") : String(error);
}

async function registerAndLogin() {
  const email = `tc_order_${Date.now()}@example.com`;
  const password = "P@ssw0rd123";

  const reg = await request(app).post("/api/create-new-user").send({
    email,
    password,
    lastName: "User",
  });
  expect(reg.status).toBe(200);
  expect(reg.body).toMatchObject({ errCode: 0 });

  const login = await request(app).post("/api/login").send({ email, password });
  expect(login.status).toBe(200);
  expect(login.body).toMatchObject({ errCode: 0 });
  expect(typeof login.body.accessToken).toBe("string");
  expect(login.body.user?.id).toBeTruthy();

  return { email, userId: login.body.user.id, token: login.body.accessToken };
}

async function ensureAddressUserId(userId) {
  let existing;
  try {
    existing = await db.AddressUser.findOne({
      where: { userId },
      raw: true,
    });
  } catch (error) {
    throw new Error(
      `[ensureAddressUserId] AddressUser.findOne failed: ${formatSequelizeError(
        error
      )}`
    );
  }
  if (existing?.id) return existing.id;

  let user;
  try {
    user = await db.User.findOne({ where: { id: userId }, raw: true });
  } catch (error) {
    throw new Error(
      `[ensureAddressUserId] User.findOne failed: ${formatSequelizeError(
        error
      )}`
    );
  }
  const created = await db.AddressUser.create({
    userId,
    name: "Test Receiver",
    address: "Test address",
    email: user?.email || "test@example.com",
    phonenumber: "0900000000",
    provinceName: "Test Province",
    districtName: "Test District",
    wardName: "Test Ward",
  });
  return created.id;
}

async function findOrderableProductDetailSizeId() {
  const candidates = await db.ReceiptDetail.findAll({
    attributes: ["productDetailSizeId"],
    where: { quantity: { [Op.gt]: 0 } },
    group: ["productDetailSizeId"],
    limit: 50,
    raw: true,
  });

  const ids = candidates
    .map((r) => r.productDetailSizeId)
    .filter((x) => x != null);

  if (ids.length === 0) {
    throw new Error("No ReceiptDetail candidates found for ordering");
  }

  return ids[0];
}

maybeDescribe("Order API (real MySQL)", () => {
  const createdEmails = [];
  const createdUserIds = [];
  const createdOrderIds = [];
  const createdAddressIds = [];

  beforeAll(async () => {
    jest.setTimeout(60000);
    await ensureDatabaseExists();
    await db.sequelize.authenticate();
  });

  afterEach(async () => {
    if (createdOrderIds.length > 0) {
      const ids = createdOrderIds.splice(0, createdOrderIds.length);
      await db.OrderDetail.destroy({ where: { orderId: { [Op.in]: ids } } });
      await db.OrderProduct.destroy({ where: { id: { [Op.in]: ids } } });
    }

    if (createdAddressIds.length > 0) {
      const ids = createdAddressIds.splice(0, createdAddressIds.length);
      await db.AddressUser.destroy({ where: { id: { [Op.in]: ids } } });
    }

    if (createdUserIds.length > 0) {
      const userIds = createdUserIds.splice(0, createdUserIds.length);
      await db.ShopCart.destroy({ where: { userId: { [Op.in]: userIds } } });
    }

    if (createdEmails.length > 0) {
      const emails = createdEmails.splice(0, createdEmails.length);
      await db.User.destroy({ where: { email: { [Op.in]: emails } } });
    }
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  test("DB-ORDER-01: POST /api/create-new-order returns errCode=0", async () => {
    const { email, userId, token } = await registerAndLogin();
    createdEmails.push(email);
    createdUserIds.push(userId);

    const addressUserId = await ensureAddressUserId(userId);
    createdAddressIds.push(addressUserId);

    const productDetailSizeId = await findOrderableProductDetailSizeId();

    const payload = {
      addressUserId,
      isPaymentOnlien: 0,
      shippingFee: 1000,
      note: "db-real order test",
      arrDataShopCart: [
        {
          productId: productDetailSizeId,
          quantity: 1,
          realPrice: 1000,
        },
      ],
    };

    const res = await request(app)
      .post("/api/create-new-order")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });

    let createdOrder;
    try {
      createdOrder = await db.OrderProduct.findOne({
        where: { addressUserId },
        order: [["createdAt", "DESC"]],
        raw: true,
      });
    } catch (error) {
      throw new Error(
        `[DB-ORDER-01] OrderProduct.findOne failed: ${formatSequelizeError(
          error
        )}`
      );
    }
    expect(createdOrder?.id).toBeTruthy();
    createdOrderIds.push(createdOrder.id);

    const detailCount = await db.OrderDetail.count({
      where: { orderId: createdOrder.id },
    });
    expect(detailCount).toBeGreaterThan(0);
  });

  test("DB-ORDER-02: GET /api/get-all-order-by-user returns list", async () => {
    const { email, userId, token } = await registerAndLogin();
    createdEmails.push(email);
    createdUserIds.push(userId);

    const res = await request(app)
      .get(`/api/get-all-order-by-user?userId=${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("DB-ORDER-03: GET /api/get-detail-order missing id -> errCode=1", async () => {
    const res = await request(app).get("/api/get-detail-order");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 1 });
  });
});
