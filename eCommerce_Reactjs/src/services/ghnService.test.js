import { createShippingOrder } from "./ghnService";

describe("ghnService (mocked order creation)", () => {
  test("createShippingOrder returns a fake GHN order code without calling network", async () => {
    jest.useFakeTimers();

    const promise = createShippingOrder({
      toAddress: "test",
      items: [{ name: "Áo thun", qty: 1 }],
    });

    jest.advanceTimersByTime(600);
    const res = await promise;

    expect(res.errCode).toBe(0);
    expect(res.data.orderCode).toMatch(/^GHN_FAKE_/);

    jest.useRealTimers();
  });
});
