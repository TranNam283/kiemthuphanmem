/**
 * E2E Test: Homepage Search Functionality
 * Using Cypress for Black-Box Testing
 */

describe("Homepage - Search Functionality E2E Test", () => {
  beforeEach(() => {
    // Stub homepage API calls to keep the smoke test stable in CI.
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

    cy.visit("/");
  });

  it("Should load homepage successfully", () => {
    // Title comes from public/index.html
    cy.title().should("include", "Eiser Shop");
    cy.get("body").should("be.visible");
  });

  it("Should display navigation menu", () => {
    cy.get("header.header_area").should("be.visible");
    cy.contains("Trang chủ").should("be.visible");
    cy.contains("Cửa hàng").should("be.visible");
  });
});
