const transparentPng =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO8nK0QAAAAASUVORK5CYII=";

describe("Shop - Browse products", () => {
  beforeEach(() => {
    // Shop page loads category + brand filters from Allcode on mount.
    // Stub them so the FE E2E does not depend on a real backend.
    cy.intercept("GET", "**/api/get-all-code?type=CATEGORY*", {
      statusCode: 200,
      body: {
        errCode: 0,
        data: [
          { id: 1, type: "CATEGORY", value: "Tất cả", code: "ALL" },
          { id: 9, type: "CATEGORY", value: "Áo thun", code: "ao-thun" },
        ],
      },
    }).as("getCategories");

    cy.intercept("GET", "**/api/get-all-code?type=BRAND*", {
      statusCode: 200,
      body: {
        errCode: 0,
        data: [
          { id: 1, type: "BRAND", value: "Tất cả", code: "ALL" },
          { id: 14, type: "BRAND", value: "ICONDENIM", code: "icondenim" },
        ],
      },
    }).as("getBrands");

    cy.intercept("GET", "**/api/get-all-product-user*", {
      statusCode: 200,
      body: {
        errCode: 0,
        count: 1,
        data: [
          {
            id: 1,
            name: "Áo thun test",
            productDetail: [
              {
                nameDetail: "Basic",
                discountPrice: 199000,
                originalPrice: 249000,
                productImage: [{ image: transparentPng }],
              },
            ],
          },
        ],
      },
    }).as("getProducts");
  });

  it("shows a product card from API and links to detail page", () => {
    cy.visit("/shop");
    cy.wait("@getCategories");
    cy.wait("@getBrands");
    cy.wait("@getProducts");

    cy.contains("Áo thun test").should("be.visible");

    cy.contains("Áo thun test")
      .closest("a")
      .should("have.attr", "href")
      .and("include", "/detail-product/1");
  });
});
