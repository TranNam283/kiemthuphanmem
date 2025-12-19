import axios from "../axios";
import {
  handleLoginService,
  getAllProductUser,
  addShopCartService,
  getAllShopCartByUserIdService,
  deleteItemShopCartService,
  createNewOrderService,
} from "./userService";

jest.mock("../axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe("userService (API wrappers)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handleLoginService posts to /api/login", () => {
    const payload = { email: "test@example.com", password: "secret" };
    handleLoginService(payload);
    expect(axios.post).toHaveBeenCalledWith("/api/login", payload);
  });

  test("getAllProductUser builds query string", () => {
    getAllProductUser({
      limit: 6,
      offset: 0,
      sortPrice: true,
      sortName: "",
      categoryId: "C1",
      brandId: "B1",
      keyword: "ao thun",
    });

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/get-all-product-user?")
    );
    const calledUrl = axios.get.mock.calls[0][0];
    expect(calledUrl).toContain("limit=6");
    expect(calledUrl).toContain("offset=0");
    expect(calledUrl).toContain("sortPrice=true");
    expect(calledUrl).toContain("categoryId=C1");
    expect(calledUrl).toContain("brandId=B1");
    expect(calledUrl).toContain("keyword=ao%20thun");
  });

  test("addShopCartService posts to /api/add-shopcart", () => {
    const payload = { userId: 1, productdetailsizeId: 10, quantity: 2 };
    addShopCartService(payload);
    expect(axios.post).toHaveBeenCalledWith("/api/add-shopcart", payload);
  });

  test("getAllShopCartByUserIdService gets cart by user id", () => {
    getAllShopCartByUserIdService(123);
    expect(axios.get).toHaveBeenCalledWith(
      "/api/get-all-shopcart-by-userId?id=123"
    );
  });

  test("deleteItemShopCartService sends DELETE body via axios.delete", () => {
    const payload = { itemId: 999 };
    deleteItemShopCartService(payload);
    expect(axios.delete).toHaveBeenCalledWith("/api/delete-item-shopcart", {
      data: payload,
    });
  });

  test("createNewOrderService posts to /api/create-new-order", () => {
    const payload = {
      items: [{ productId: 1, quantity: 1 }],
      paymentMethod: "COD",
    };
    createNewOrderService(payload);
    expect(axios.post).toHaveBeenCalledWith("/api/create-new-order", payload);
  });
});
