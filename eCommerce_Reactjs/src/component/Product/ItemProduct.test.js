import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ItemProduct from "./ItemProduct";

jest.mock("./AddToCartModal", () => () => (
  <div data-testid="add-to-cart-modal" />
));

describe("ItemProduct", () => {
  test("renders name and link to detail page", () => {
    render(
      <MemoryRouter>
        <ItemProduct
          id={1}
          name="Áo thun test"
          img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO8nK0QAAAAASUVORK5CYII="
          discountPrice={199000}
          price={249000}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Áo thun test")).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/detail-product/1");
  });
});
