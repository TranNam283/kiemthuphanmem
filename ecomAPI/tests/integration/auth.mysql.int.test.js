import request from "supertest";
import mysql from "mysql2/promise";
import { Op } from "sequelize";

// Important: load env from .env.test via tests/setup.js
import app from "../../src/app";
import db from "../../src/models";

const dbHost = process.env.DB_HOST || "127.0.0.1";
const dbPort = Number(process.env.DB_PORT || 3306);
const dbName = process.env.DB_NAME || "ecom";
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "";

async function ensureTestDatabaseExists() {
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

maybeDescribe("Auth API (real MySQL)", () => {
  const createdEmails = [];

  beforeAll(async () => {
    jest.setTimeout(60000);

    await ensureTestDatabaseExists();

    // Use the existing schema loaded from ecom.sql (Docker init).
    // We only need to verify the connection is usable.
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

  test("TC28: Register success", async () => {
    const email = `tc_authmysql_28_${Date.now()}@example.com`;
    const res = await request(app).post("/api/create-new-user").send({
      email,
      password: "P@ssw0rd123",
      firstName: "Test",
      lastName: "User",
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });

    createdEmails.push(email);

    const created = await db.User.findOne({ where: { email } });
    expect(created).toBeTruthy();
  });

  test("TC29: Register duplicate email", async () => {
    const email = `tc_authmysql_29_${Date.now()}@example.com`;

    const first = await request(app).post("/api/create-new-user").send({
      email,
      password: "P@ssw0rd123",
      lastName: "User",
    });
    expect(first.status).toBe(200);
    expect(first.body).toMatchObject({ errCode: 0 });
    createdEmails.push(email);

    const second = await request(app).post("/api/create-new-user").send({
      email,
      password: "P@ssw0rd123",
      lastName: "User",
    });

    expect(second.status).toBe(200);
    expect(second.body).toMatchObject({ errCode: 1 });
  });

  test("TC32: Login success returns accessToken", async () => {
    const email = `tc_authmysql_32_${Date.now()}@example.com`;
    const password = "P@ssw0rd123";

    const reg = await request(app).post("/api/create-new-user").send({
      email,
      password,
      lastName: "User",
    });
    expect(reg.status).toBe(200);
    expect(reg.body).toMatchObject({ errCode: 0 });
    createdEmails.push(email);

    const login = await request(app).post("/api/login").send({
      email,
      password,
    });

    expect(login.status).toBe(200);
    expect(login.body).toMatchObject({ errCode: 0 });
    expect(typeof login.body.accessToken).toBe("string");
    expect(login.body.accessToken.length).toBeGreaterThan(10);
    expect(login.body.user).toBeTruthy();
    expect(login.body.user.email).toBe(email);
  });

  test("TC33: Login wrong password", async () => {
    const email = `tc_authmysql_33_${Date.now()}@example.com`;

    await request(app).post("/api/create-new-user").send({
      email,
      password: "correct_password",
      lastName: "User",
    });
    createdEmails.push(email);

    const login = await request(app).post("/api/login").send({
      email,
      password: "wrong_password",
    });

    expect(login.status).toBe(200);
    expect(login.body).toMatchObject({ errCode: 3 });
  });

  test("TC34: Change password success", async () => {
    const email = `tc_authmysql_34_${Date.now()}@example.com`;
    const oldPassword = "OldPass_123";
    const newPassword = "NewPass_456";

    const reg = await request(app).post("/api/create-new-user").send({
      email,
      password: oldPassword,
      lastName: "User",
    });
    expect(reg.status).toBe(200);
    expect(reg.body).toMatchObject({ errCode: 0 });
    createdEmails.push(email);

    const login1 = await request(app).post("/api/login").send({
      email,
      password: oldPassword,
    });
    expect(login1.status).toBe(200);
    expect(login1.body).toMatchObject({ errCode: 0 });
    expect(typeof login1.body.accessToken).toBe("string");
    expect(login1.body.user?.id).toBeTruthy();

    const change = await request(app)
      .post("/api/changepassword")
      .set("Authorization", `Bearer ${login1.body.accessToken}`)
      .send({
        id: login1.body.user.id,
        oldpassword: oldPassword,
        password: newPassword,
      });

    expect(change.status).toBe(200);
    expect(change.body).toMatchObject({ errCode: 0 });

    const login2 = await request(app).post("/api/login").send({
      email,
      password: newPassword,
    });
    expect(login2.status).toBe(200);
    expect(login2.body).toMatchObject({ errCode: 0 });
  });
});
