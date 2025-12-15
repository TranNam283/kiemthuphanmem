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

maybeDescribe("User/Profile API (real MySQL)", () => {
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

  test("DB-USER-01: PUT /api/update-user updates profile (requires token)", async () => {
    const email = `tc_profile_${Date.now()}@example.com`;
    const password = "ProfilePass_123";

    const reg = await request(app).post("/api/create-new-user").send({
      email,
      password,
      lastName: "User",
    });
    expect(reg.status).toBe(200);
    expect(reg.body).toMatchObject({ errCode: 0 });
    createdEmails.push(email);

    const login = await request(app)
      .post("/api/login")
      .send({ email, password });
    expect(login.status).toBe(200);
    expect(login.body).toMatchObject({ errCode: 0 });

    const userId = login.body.user?.id;
    expect(userId).toBeTruthy();

    const res = await request(app)
      .put("/api/update-user")
      .set("Authorization", `Bearer ${login.body.accessToken}`)
      .send({ id: userId, firstName: "Updated" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });

    const updated = await db.User.findOne({ where: { id: userId }, raw: true });
    expect(updated.firstName).toBe("Updated");
  });

  test("DB-USER-02: PUT /api/update-user missing id -> errCode=2", async () => {
    const email = `tc_profile2_${Date.now()}@example.com`;
    const password = "ProfilePass_123";

    const reg = await request(app).post("/api/create-new-user").send({
      email,
      password,
      lastName: "User",
    });
    expect(reg.status).toBe(200);
    expect(reg.body).toMatchObject({ errCode: 0 });
    createdEmails.push(email);

    const login = await request(app)
      .post("/api/login")
      .send({ email, password });
    expect(login.status).toBe(200);
    expect(login.body).toMatchObject({ errCode: 0 });

    const res = await request(app)
      .put("/api/update-user")
      .set("Authorization", `Bearer ${login.body.accessToken}`)
      .send({ firstName: "Updated" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 2 });
  });

  test("DB-USER-03: GET /api/get-detail-user-by-id returns created user", async () => {
    const email = `tc_detail_${Date.now()}@example.com`;
    const password = "DetailPass_123";

    const reg = await request(app).post("/api/create-new-user").send({
      email,
      password,
      lastName: "User",
    });
    expect(reg.status).toBe(200);
    expect(reg.body).toMatchObject({ errCode: 0 });
    createdEmails.push(email);

    const login = await request(app)
      .post("/api/login")
      .send({ email, password });
    expect(login.status).toBe(200);
    expect(login.body).toMatchObject({ errCode: 0 });

    const userId = login.body.user?.id;
    const res = await request(app).get(
      `/api/get-detail-user-by-id?id=${userId}`
    );

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });
    expect(res.body.data).toBeTruthy();
    expect(res.body.data.id).toBe(userId);
    expect(res.body.data.email).toBe(email);
  });

  test("DB-USER-04: GET /api/get-detail-user-by-id missing id -> errCode=1", async () => {
    const res = await request(app).get("/api/get-detail-user-by-id");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 1 });
  });

  test("DB-USER-05: GET /api/get-detail-user-by-email returns created user", async () => {
    const email = `tc_byemail_${Date.now()}@example.com`;
    const password = "EmailPass_123";

    const reg = await request(app).post("/api/create-new-user").send({
      email,
      password,
      lastName: "User",
    });
    expect(reg.status).toBe(200);
    expect(reg.body).toMatchObject({ errCode: 0 });
    createdEmails.push(email);

    const res = await request(app).get(
      `/api/get-detail-user-by-email?email=${encodeURIComponent(email)}`
    );

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });
    expect(res.body.data).toBeTruthy();
    expect(res.body.data.email).toBe(email);
  });
});
