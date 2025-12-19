/**
 * E2E Test: Homepage Search Functionality
 * Using Cypress for Black-Box Testing
 */

describe("Homepage - Search Functionality E2E Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Should load homepage successfully", () => {
    cy.title().should("include", "E-Commerce");
    cy.get("body").should("be.visible");
  });

  it("Should display search input", () => {
    cy.get('input[type="text"]').should("be.visible");
  });

  it("Should display navigation menu", () => {
    cy.get("nav").should("be.visible");
  });
});
