jest.mock("axios", () => {
  const create = jest.fn((config) => {
    return {
      defaults: { ...config },
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    };
  });

  return {
    __esModule: true,
    default: { create },
    create,
  };
});

describe("axios instance config", () => {
  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
    delete process.env.REACT_APP_BACKEND_URL;
  });

  test("uses REACT_APP_BACKEND_URL as baseURL", async () => {
    process.env.REACT_APP_BACKEND_URL = "http://localhost:8080";
    const instance = (await import("./axios")).default;
    expect(instance.defaults.baseURL).toBe("http://localhost:8080");
  });

  test("adds Authorization header when token exists at import time", async () => {
    process.env.REACT_APP_BACKEND_URL = "http://localhost:8080";
    localStorage.setItem("token", JSON.stringify("abc.def.ghi"));

    const instance = (await import("./axios")).default;

    expect(instance.interceptors.request.use).toHaveBeenCalled();
    const fulfilled = instance.interceptors.request.use.mock.calls[0][0];
    const cfg = fulfilled({ headers: {} });
    expect(cfg.headers.authorization).toBe("Bearer abc.def.ghi");
  });
});
