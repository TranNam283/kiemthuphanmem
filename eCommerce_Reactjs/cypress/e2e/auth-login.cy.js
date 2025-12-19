describe("Auth - Login", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/api/login", {
      statusCode: 200,
      body: {
        errCode: 0,
        errMessage: "OK",
        user: {
          id: 123,
          roleId: "R2",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
        },
        accessToken: "test.jwt.token",
      },
    }).as("login");

    // Home page fetches these on mount; stub so the UI doesn't error.
    cy.intercept("GET", "**/api/get-all-banner*", {
      statusCode: 200,
      body: { errCode: 0, data: [] },
    });
    cy.intercept("GET", "**/api/get-product-feature*", {
      statusCode: 200,
      body: { errCode: 0, data: [] },
    });
    cy.intercept("GET", "**/api/get-product-new*", {
      statusCode: 200,
      body: { errCode: 0, data: [] },
    });
    cy.intercept("GET", "**/api/get-new-blog*", {
      statusCode: 200,
      body: { errCode: 0, data: [] },
    });
  });

  it("logs in and redirects to homepage", () => {
    cy.visit("/login");

    cy.get("#loginemail").type("test@example.com");
    cy.get("#loginPassword").type("P@ssw0rd123");

    cy.contains('input[type="submit"]', "Đăng nhập").click();

    cy.wait("@login");
    cy.location("pathname").should("eq", "/");

    // Token/user should be persisted for subsequent flows.
    cy.window().then((win) => {
      expect(win.localStorage.getItem("userData")).to.contain(
        "test@example.com"
      );
      expect(win.localStorage.getItem("token")).to.exist;
    });
  });
});
