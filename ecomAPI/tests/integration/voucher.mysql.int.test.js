import request from "supertest";
import mysql from "mysql2/promise";
import { Op } from "sequelize";
import moment from "moment";

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
  const email = `tc_voucher_${Date.now()}@example.com`;
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

maybeDescribe("Voucher API (real MySQL)", () => {
  const createdEmails = [];
  const createdUserIds = [];
  const createdVoucherUsedIds = [];
  const createdVoucherIds = [];
  const createdTypeVoucherIds = [];

  beforeAll(async () => {
    jest.setTimeout(60000);
    await ensureDatabaseExists();
    await db.sequelize.authenticate();
  });

  afterEach(async () => {
    if (createdVoucherUsedIds.length > 0) {
      const ids = createdVoucherUsedIds.splice(0, createdVoucherUsedIds.length);
      await db.VoucherUsed.destroy({ where: { id: { [Op.in]: ids } } });
    }

    if (createdVoucherIds.length > 0) {
      const ids = createdVoucherIds.splice(0, createdVoucherIds.length);
      await db.Voucher.destroy({ where: { id: { [Op.in]: ids } } });
    }

    if (createdTypeVoucherIds.length > 0) {
      const ids = createdTypeVoucherIds.splice(0, createdTypeVoucherIds.length);
      await db.TypeVoucher.destroy({ where: { id: { [Op.in]: ids } } });
    }

    if (createdUserIds.length > 0) {
      const userIds = createdUserIds.splice(0, createdUserIds.length);
      await db.VoucherUsed.destroy({ where: { userId: { [Op.in]: userIds } } });
    }

    if (createdEmails.length > 0) {
      const emails = createdEmails.splice(0, createdEmails.length);
      await db.User.destroy({ where: { email: { [Op.in]: emails } } });
    }
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  test("DB-VOUCHER-01: GET /api/get-voucher-store returns list", async () => {
    const { email, userId, token } = await registerAndLogin();
    createdEmails.push(email);
    createdUserIds.push(userId);

    const res = await request(app)
      .get("/api/get-voucher-store?keyword=&limit=10&offset=0")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("DB-VOUCHER-02: GET /api/get-voucher-wallet returns list", async () => {
    const { email, userId, token } = await registerAndLogin();
    createdEmails.push(email);
    createdUserIds.push(userId);

    const res = await request(app)
      .get(`/api/get-voucher-wallet?userId=${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });
    expect(res.body.data).toBeTruthy();
    expect(typeof res.body.data).toBe("object");
    expect(Array.isArray(res.body.data.unused)).toBe(true);
    expect(Array.isArray(res.body.data.used)).toBe(true);
    expect(Array.isArray(res.body.data.expired)).toBe(true);
    expect(Array.isArray(res.body.data.revoked)).toBe(true);
  });

  test("DB-VOUCHER-03: POST /api/claim-voucher success for claimable voucher", async () => {
    const { email, userId, token } = await registerAndLogin();
    createdEmails.push(email);
    createdUserIds.push(userId);

    const now = moment();
    let voucher = await db.Voucher.findOne({
      where: {
        status: 1,
        fromDate: { [Op.lte]: now.endOf("day").toDate() },
        toDate: { [Op.gte]: now.startOf("day").toDate() },
      },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    // If seed data has no claimable voucher, create a deterministic one.
    if (!voucher) {
      const type = await db.TypeVoucher.create({
        typeVoucher: "percent",
        value: 10,
        maxValue: 50000,
        minValue: 0,
        description: "DB test type",
      });
      createdTypeVoucherIds.push(type.id);

      voucher = await db.Voucher.create({
        title: "DB Test Voucher",
        codeVoucher: `DBTEST_${Date.now()}`,
        description: "DB test voucher",
        fromDate: now.startOf("day").toDate(),
        toDate: now.add(7, "days").endOf("day").toDate(),
        typeVoucherId: type.id,
        amount: 100,
        limitPerUser: 1,
        status: 1,
      });
      createdVoucherIds.push(voucher.id);
      voucher = { id: voucher.id };
    }

    const res = await request(app)
      .post("/api/claim-voucher")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId, voucherId: voucher.id });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ errCode: 0 });

    const created = await db.VoucherUsed.findOne({
      where: { userId, voucherId: voucher.id },
      order: [["createdAt", "DESC"]],
      raw: true,
    });
    expect(created?.id).toBeTruthy();
    createdVoucherUsedIds.push(created.id);

    const wallet = await request(app)
      .get(`/api/get-voucher-wallet?userId=${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(wallet.status).toBe(200);
    expect(wallet.body).toMatchObject({ errCode: 0 });
    expect(Array.isArray(wallet.body.data.unused)).toBe(true);
  });
});
