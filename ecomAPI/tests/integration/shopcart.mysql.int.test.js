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

async function registerAndLogin() {
  const email = `tc_shopcart_${Date.now()}@example.com`;
  const password = "P@ssw0rd123";

  const reg = await request(app).post("/api/create-new-user").send({
    email,
    password,
    lastName: "User",
  });
  expect(reg.status).toBe(200);
  expect(reg.body).toMatchObject({ errCode: 0 });

  const login = await request(app).post("/api/login").send({
    email,
    password,
  });
  expect(login.status).toBe(200);
  expect(login.body).toMatchObject({ errCode: 0 });
  expect(typeof login.body.accessToken).toBe("string");
  expect(login.body.user?.id).toBeTruthy();

  return {
    email,
    userId: login.body.user.id,
    token: login.body.accessToken,
  };
}

async function findAddableProductDetailSizeId(userId, token) {
  const candidates = await db.ReceiptDetail.findAll({
    attributes: ["productDetailSizeId"],
    where: { quantity: { [Op.gt]: 0 } },
    group: ["productDetailSizeId"],
    limit: 50,
    raw: true,
  });

  const candidateIds = candidates
    .map((r) => r.productDetailSizeId)
    .filter((x) => x != null);

  for (const productDetailSizeId of candidateIds) {
    const res = await request(app)
      .post("/api/add-shopcart")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId,
        productdetailsizeId: productDetailSizeId,
        quantity: 1,
      });

    if (res.status !== 200) continue;
    if (res.body?.errCode === 0) return productDetailSizeId;
  }

  throw new Error(
    "Could not find a productDetailSizeId with available stock to add to cart"
  );
}

maybeDescribe("ShopCart API (real MySQL)", () => {
  const createdEmails = [];
  const createdUserIds = [];

  beforeAll(async () => {
    jest.setTimeout(60000);
    await ensureDatabaseExists();
    await db.sequelize.authenticate();
  });

  afterEach(async () => {
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

  test("DB-SHOPCART-01: POST /api/add-shopcart adds item", async () => {
    const { email, userId, token } = await registerAndLogin();
    createdEmails.push(email);
    createdUserIds.push(userId);

    const productDetailSizeId = await findAddableProductDetailSizeId(
      userId,
      token
    );

    const created = await db.ShopCart.findOne({
      where: { userId, productdetailsizeId: productDetailSizeId, statusId: 0 },
      raw: true,
    });
    expect(created).toBeTruthy();
  });

  test("DB-SHOPCART-02: POST /api/add-shopcart missing quantity -> errCode=1", async () => {
    const { email, userId, token } = await registerAndLogin();
    createdEmails.push(email);
    createdUserIds.push(userId);

    const anyPds = await db.ProductDetailSize.findOne({ raw: true });
    expect(anyPds?.id).toBeTruthy();

    const res = await request(app)
      .post("/api/add-shopcart")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId, productdetailsizeId: anyPds.id, quantity: 0 });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 1 });
  });

  test("DB-SHOPCART-03: GET /api/get-all-shopcart-by-userId returns list", async () => {
    const { email, userId, token } = await registerAndLogin();
    createdEmails.push(email);
    createdUserIds.push(userId);

    await findAddableProductDetailSizeId(userId, token);

    const res = await request(app)
      .get(`/api/get-all-shopcart-by-userId?id=${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("DB-SHOPCART-04: DELETE /api/delete-item-shopcart deletes item", async () => {
    const { email, userId, token } = await registerAndLogin();
    createdEmails.push(email);
    createdUserIds.push(userId);

    const productDetailSizeId = await findAddableProductDetailSizeId(
      userId,
      token
    );

    const item = await db.ShopCart.findOne({
      where: { userId, productdetailsizeId: productDetailSizeId, statusId: 0 },
      raw: true,
    });
    expect(item?.id).toBeTruthy();

    const res = await request(app)
      .delete("/api/delete-item-shopcart")
      .set("Authorization", `Bearer ${token}`)
      .send({ id: item.id });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });

    const after = await db.ShopCart.findOne({
      where: { id: item.id },
      raw: true,
    });
    expect(after).toBeNull();
  });

  test("DB-SHOPCART-05: DELETE /api/delete-item-shopcart missing id -> errCode=1", async () => {
    const { email, userId, token } = await registerAndLogin();
    createdEmails.push(email);
    createdUserIds.push(userId);

    const res = await request(app)
      .delete("/api/delete-item-shopcart")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 1 });
  });

  test("DB-SHOPCART-06: GET /api/get-product-shopcart returns products for cart", async () => {
    const { email, userId, token } = await registerAndLogin();
    createdEmails.push(email);
    createdUserIds.push(userId);

    await findAddableProductDetailSizeId(userId, token);

    const res = await request(app).get(
      `/api/get-product-shopcart?userId=${userId}&limit=5`
    );

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
