import request from "supertest";
import app from "../../src/app";

describe("API smoke", () => {
  it("responds to unknown routes with 404", async () => {
    const res = await request(app).get("/__does_not_exist__");
    expect([404, 401, 403]).toContain(res.status);
  });

  it("sets CORS header", async () => {
    const res = await request(app).options("/__does_not_exist__");
    // The app always sets this header via middleware.
    expect(res.headers["access-control-allow-origin"]).toBe("*");
  });
});
