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

maybeDescribe("Allcode API (real MySQL)", () => {
  beforeAll(async () => {
    jest.setTimeout(60000);
    await ensureDatabaseExists();
    await db.sequelize.authenticate();
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  test("DB-ALLCODE-01: GET /api/get-all-code with valid type returns list", async () => {
    const anyAllcode = await db.Allcode.findOne({ raw: true });
    expect(anyAllcode?.type).toBeTruthy();

    const res = await request(app).get(
      `/api/get-all-code?type=${encodeURIComponent(anyAllcode.type)}`
    );

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("DB-ALLCODE-02: GET /api/get-all-code missing type -> errCode=1", async () => {
    const res = await request(app).get("/api/get-all-code");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 1 });
  });

  test("DB-ALLCODE-03: GET /api/get-list-allcode returns data + count", async () => {
    const anyAllcode = await db.Allcode.findOne({ raw: true });
    expect(anyAllcode?.type).toBeTruthy();

    const res = await request(app).get(
      `/api/get-list-allcode?type=${encodeURIComponent(
        anyAllcode.type
      )}&keyword=&limit=5&offset=0`
    );

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(typeof res.body.count).toBe("number");
  });
});
