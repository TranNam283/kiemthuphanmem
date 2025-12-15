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

maybeDescribe("User/Admin API (real MySQL)", () => {
  const createdEmails = [];

  beforeAll(async () => {
    jest.setTimeout(60000);
    await ensureDatabaseExists();
    await db.sequelize.authenticate();
  });

  afterEach(async () => {
    if (createdEmails.length === 0) return;
    const emailsToDelete = createdEmails.splice(0, createdEmails.length);
    await db.User.destroy({ where: { email: { [Op.in]: emailsToDelete } } });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  test("DB-ADMIN-01: Admin can call GET /api/get-all-user", async () => {
    const adminEmail = `tc_admin_${Date.now()}@example.com`;
    const adminPassword = "AdminPass_123";

    const reg = await request(app).post("/api/create-new-user").send({
      email: adminEmail,
      password: adminPassword,
      lastName: "Admin",
      roleId: "R1",
    });
    expect(reg.status).toBe(200);
    expect(reg.body).toMatchObject({ errCode: 0 });
    createdEmails.push(adminEmail);

    const login = await request(app).post("/api/login").send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(login.status).toBe(200);
    expect(login.body).toMatchObject({ errCode: 0 });
    expect(typeof login.body.accessToken).toBe("string");

    const res = await request(app)
      .get("/api/get-all-user?keyword=")
      .set("Authorization", `Bearer ${login.body.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(typeof res.body.count).toBe("number");
  });

  test("DB-ADMIN-02: Non-admin is blocked on GET /api/get-all-user", async () => {
    const userEmail = `tc_user_${Date.now()}@example.com`;
    const userPassword = "UserPass_123";

    const reg = await request(app).post("/api/create-new-user").send({
      email: userEmail,
      password: userPassword,
      lastName: "User",
      roleId: "R2",
    });
    expect(reg.status).toBe(200);
    expect(reg.body).toMatchObject({ errCode: 0 });
    createdEmails.push(userEmail);

    const login = await request(app).post("/api/login").send({
      email: userEmail,
      password: userPassword,
    });
    expect(login.status).toBe(200);
    expect(login.body).toMatchObject({ errCode: 0 });

    const res = await request(app)
      .get("/api/get-all-user?keyword=")
      .set("Authorization", `Bearer ${login.body.accessToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({
      status: false,
      errMessage: "Bạn không có đủ quyền",
      refresh: true,
    });
  });
});
