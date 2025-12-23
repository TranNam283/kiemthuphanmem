import request from "supertest";
import mysql from "mysql2/promise";

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

maybeDescribe("Product/Detail API (real MySQL)", () => {
  beforeAll(async () => {
    jest.setTimeout(60000);
    await ensureDatabaseExists();
    await db.sequelize.authenticate();
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  test("DB-PRODUCT-DETAIL-01: GET /api/get-detail-product-by-id returns product", async () => {
    const anyProduct = await db.Product.findOne({ raw: true });
    expect(anyProduct?.id).toBeTruthy();

    const res = await request(app).get(
      `/api/get-detail-product-by-id?id=${encodeURIComponent(anyProduct.id)}`
    );

    expect(res.status).toBe(200);
    // expected shape: {errCode, data}
    expect(res.body.errCode).toBe(0);
    expect(res.body.data).toBeTruthy();
  });
});
