import { getAllShippingOptions, mapAddressToGHN } from "./shippingService";

jest.mock("./ghnService", () => ({
  getProvinces: jest.fn(),
  getDistricts: jest.fn(),
  getWards: jest.fn(),
  calculateShippingFee: jest.fn(),
}));

import * as ghnService from "./ghnService";

describe("shippingService (address mapping + fee aggregation)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("mapAddressToGHN maps Vietnamese names to GHN IDs", async () => {
    ghnService.getProvinces.mockResolvedValue({
      errCode: 0,
      data: [{ ProvinceID: 1, ProvinceName: "Hồ Chí Minh" }],
    });
    ghnService.getDistricts.mockResolvedValue({
      errCode: 0,
      data: [{ DistrictID: 10, DistrictName: "Quận 1" }],
    });
    ghnService.getWards.mockResolvedValue({
      errCode: 0,
      data: [{ WardCode: "001", WardName: "Bến Nghé" }],
    });

    const mapped = await mapAddressToGHN("Ho Chi Minh", "Quan 1", "Ben Nghe");
    expect(mapped).toMatchObject({
      provinceId: 1,
      districtId: 10,
      wardCode: "001",
    });
  });

  test("getAllShippingOptions returns GHN fee and marks inactive providers unavailable", async () => {
    ghnService.getProvinces.mockResolvedValue({
      errCode: 0,
      data: [{ ProvinceID: 1, ProvinceName: "Hồ Chí Minh" }],
    });
    ghnService.getDistricts.mockResolvedValue({
      errCode: 0,
      data: [{ DistrictID: 10, DistrictName: "Quận 1" }],
    });
    ghnService.getWards.mockResolvedValue({
      errCode: 0,
      data: [{ WardCode: "001", WardName: "Bến Nghé" }],
    });
    ghnService.calculateShippingFee.mockResolvedValue({
      errCode: 0,
      data: { total: 15000 },
    });

    const options = await getAllShippingOptions(
      {
        provinceName: "Hồ Chí Minh",
        districtName: "Quận 1",
        wardName: "Bến Nghé",
      },
      { weight: 500 }
    );

    const ghn = options.find((o) => o.code === "GHN");
    expect(ghn).toBeTruthy();
    expect(ghn.available).toBe(true);
    expect(ghn.fee).toBe(15000);

    const inactive = options.filter((o) => o.active === false);
    expect(inactive.length).toBeGreaterThan(0);
    inactive.forEach((o) => {
      expect(o.available).toBe(false);
      expect(o.fee).toBeNull();
    });
  });
});
