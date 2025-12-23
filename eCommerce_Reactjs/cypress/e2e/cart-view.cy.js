describe("Cart - View cart", () => {
  beforeEach(() => {
    const user = { id: 123, roleId: "R2", email: "test@example.com" };

    // Header fetches chat rooms for the logged-in user; stub to avoid network errors in CI.
    cy.intercept("GET", "**/api/listRoomOfUser*", {
      statusCode: 200,
      body: { errCode: 0, data: [] },
    }).as("listRooms");

    cy.intercept("GET", "**/api/get-all-shopcart-by-userId*", {
      statusCode: 200,
      body: {
        errCode: 0,
        data: [
          {
            id: 999,
            quantity: 2,
            productData: { name: "Áo thun test" },
            productDetail: { nameDetail: "Basic", discountPrice: 199000 },
            productdetailsizeData: {
              id: 555,
              sizeData: { value: "M" },
            },
            productDetailImage: [
              {
                image:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO8nK0QAAAAASUVORK5CYII=",
              },
            ],
          },
        ],
      },
    }).as("getCart");

    cy.intercept("GET", "**/api/get-all-typeship*", {
      statusCode: 200,
      body: {
        errCode: 0,
        data: [{ id: 1, type: "Standard", price: 15000 }],
      },
    }).as("getShip");

    cy.visit("/shopcart", {
      onBeforeLoad(win) {
        win.localStorage.setItem("userData", JSON.stringify(user));
        win.localStorage.setItem("token", JSON.stringify("test.jwt.token"));
      },
    });
  });

  it("renders cart table with items for logged-in user", () => {
    cy.wait("@getCart");
    cy.wait("@getShip");

    cy.contains("Sản phẩm").should("be.visible");
    cy.contains("Áo thun test - Basic - M").should("be.visible");
    cy.contains("Đi đến thanh toán").should("be.visible");
  });
});
