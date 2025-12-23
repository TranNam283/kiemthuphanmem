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

maybeDescribe("Product API (real MySQL)", () => {
  beforeAll(async () => {
    jest.setTimeout(60000);
    await ensureDatabaseExists();
    await db.sequelize.authenticate();
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  test("DB-PRODUCT-01: GET /api/get-all-product-user returns list", async () => {
    const res = await request(app).get("/api/get-all-product-user");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(typeof res.body.count).toBe("number");
  });

  test("DB-PRODUCT-02: GET /api/get-all-product-user keyword filter returns array", async () => {
    const keyword = `__no_such_keyword__${Date.now()}`;
    const res = await request(app).get(
      `/api/get-all-product-user?keyword=${encodeURIComponent(keyword)}`
    );

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(typeof res.body.count).toBe("number");
  });

  test("DB-PRODUCT-03: GET /api/get-product-new with limit returns list", async () => {
    const limit = 5;
    const res = await request(app).get(`/api/get-product-new?limit=${limit}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(limit);
  });

  test("DB-PRODUCT-04: GET /api/get-product-feature with limit returns list", async () => {
    const limit = 5;
    const res = await request(app).get(
      `/api/get-product-feature?limit=${limit}`
    );

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(limit);
  });
});
