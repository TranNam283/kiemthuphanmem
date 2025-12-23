import axios from "axios";

const backendUrl =
  (typeof window !== "undefined" &&
    window.__APP_CONFIG__ &&
    window.__APP_CONFIG__.BACKEND_URL) ||
  process.env.REACT_APP_BACKEND_URL;

if (!backendUrl) {
  // eslint-disable-next-line no-console
  console.warn(
    "[config] Missing REACT_APP_BACKEND_URL. API calls may go to the frontend domain and return index.html instead of JSON."
  );
} else {
  // eslint-disable-next-line no-console
  console.log("[config] REACT_APP_BACKEND_URL:", backendUrl);
}

const instance = axios.create({
  baseURL: backendUrl,

  //  withCredentials: true
});
if (localStorage.getItem("token")) {
  instance.interceptors.request.use(
    (config) => {
      config.headers.authorization =
        "Bearer " + localStorage.getItem("token").replaceAll('"', "");

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

instance.interceptors.response.use((response) => {
  // If baseURL is missing, requests often hit the FE domain and return index.html with HTTP 200.
  // That looks like a "successful" request but breaks the app silently.
  try {
    const contentType =
      (response && response.headers && response.headers["content-type"]) || "";
    const data = response ? response.data : undefined;
    const responseUrl =
      response && response.request && response.request.responseURL
        ? response.request.responseURL
        : "";

    if (
      typeof data === "string" &&
      (contentType.includes("text/html") ||
        data.toLowerCase().includes("<html"))
    ) {
      // eslint-disable-next-line no-console
      console.error(
        "[axios] Expected JSON but got HTML. This usually means REACT_APP_BACKEND_URL is not set or the request is hitting the FE domain:",
        responseUrl
      );
    }
  } catch (e) {
    // ignore
  }

  return response.data;
});

// Log network / axios errors with request URL to help debugging Network Error
instance.interceptors.response.use(undefined, (error) => {
  try {
    const req =
      error && error.config
        ? error.config.url || error.config.baseURL || ""
        : "";
    // eslint-disable-next-line no-console
    console.error(
      "[axios] request failed:",
      req,
      error && error.message,
      error && error.response && error.response.status
    );
  } catch (e) {
    // ignore
  }
  return Promise.reject(error);
});

export default instance;
