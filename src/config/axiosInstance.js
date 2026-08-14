import axios from "axios";
import { showToast } from "./toast";

/*
|--------------------------------------------------------------------------
| API Base URL
|--------------------------------------------------------------------------
|
| Production:
| https://earthen.bynix.in/api
|
| Local:
| http://localhost:5000/api
|
|--------------------------------------------------------------------------
*/

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
|
| withCredentials: true is REQUIRED for:
|
| - guestSessionId
| - guestWishlistSessionId
| - HTTP-only cookies
|
|--------------------------------------------------------------------------
*/

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,

  withCredentials: true,

  timeout: 30000,

  headers: {
    Accept: "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| Prevent Multiple Session Expired Toasts
|--------------------------------------------------------------------------
*/

let isHandlingUnauthorized = false;

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

axiosInstance.interceptors.request.use(
  (config) => {
    /*
    |--------------------------------------------------------------------------
    | Current Path
    |--------------------------------------------------------------------------
    */

    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname
        : "";

    /*
    |--------------------------------------------------------------------------
    | Admin Request Detection
    |--------------------------------------------------------------------------
    */

    const requestUrl = config.url || "";

    const isAdminRequest =
      requestUrl.startsWith("/admin") ||
      requestUrl.includes("/admin/") ||
      currentPath.startsWith("/admin");

    /*
    |--------------------------------------------------------------------------
    | Get Correct Token
    |--------------------------------------------------------------------------
    */

    const token = isAdminRequest
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("userToken");

    /*
    |--------------------------------------------------------------------------
    | Authorization Header
    |--------------------------------------------------------------------------
    */

    if (token) {
      config.headers = config.headers || {};

      config.headers.Authorization = `Bearer ${token}`;
    } else {
      /*
      |--------------------------------------------------------------------------
      | Remove stale Authorization header
      |--------------------------------------------------------------------------
      */

      if (config.headers?.Authorization) {
        delete config.headers.Authorization;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | FormData Handling
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | Do NOT manually set Content-Type for FormData.
    | Browser/Axios automatically adds:
    |
    | multipart/form-data; boundary=...
    |
    |--------------------------------------------------------------------------
    */

    if (config.data instanceof FormData) {
      if (config.headers?.["Content-Type"]) {
        delete config.headers["Content-Type"];
      }

      if (config.headers?.["content-type"]) {
        delete config.headers["content-type"];
      }
    } else {
      /*
      |--------------------------------------------------------------------------
      | JSON Content-Type
      |--------------------------------------------------------------------------
      |
      | Only set this when request actually has a body.
      |
      | GET requests normally don't have a body, so we DON'T add
      | application/json to them.
      |
      | This reduces unnecessary CORS preflight requests.
      |
      |--------------------------------------------------------------------------
      */

      const method = (
        config.method || "get"
      ).toLowerCase();

      const hasRequestBody =
        config.data !== undefined &&
        config.data !== null &&
        ["post", "put", "patch", "delete"].includes(method);

      if (hasRequestBody) {
        config.headers = config.headers || {};

        config.headers["Content-Type"] =
          "application/json";
      } else {
        /*
        |--------------------------------------------------------------------------
        | Remove unnecessary Content-Type from GET requests
        |--------------------------------------------------------------------------
        */

        if (config.headers?.["Content-Type"]) {
          delete config.headers["Content-Type"];
        }

        if (config.headers?.["content-type"]) {
          delete config.headers["content-type"];
        }
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Debug API Request
    |--------------------------------------------------------------------------
    |
    | Useful while fixing production CORS.
    |
    |--------------------------------------------------------------------------
    */

    if (import.meta.env.DEV) {
      console.log(
        "➡️ API REQUEST:",
        config.method?.toUpperCase(),
        `${config.baseURL}${config.url}`
      );
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

axiosInstance.interceptors.response.use(
  /*
  |--------------------------------------------------------------------------
  | Successful Response
  |--------------------------------------------------------------------------
  */

  (response) => {
    if (import.meta.env.DEV) {
      console.log(
        "✅ API RESPONSE:",
        response.status,
        response.config?.url
      );
    }

    return response;
  },

  /*
  |--------------------------------------------------------------------------
  | Error Response
  |--------------------------------------------------------------------------
  */

  (error) => {
    const status = error?.response?.status;

    const requestUrl =
      error?.config?.url || "";

    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname
        : "";

    /*
    |--------------------------------------------------------------------------
    | Debug API Error
    |--------------------------------------------------------------------------
    */

    if (import.meta.env.DEV) {
      console.error(
        "❌ API ERROR:",
        {
          status,
          url: requestUrl,
          message: error?.message,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Login / Register Requests
    |--------------------------------------------------------------------------
    */

    const isLoginRequest =
      requestUrl.includes("/login") ||
      requestUrl.includes("/register") ||
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register");

    /*
    |--------------------------------------------------------------------------
    | Admin Page
    |--------------------------------------------------------------------------
    */

    const isAdminPage =
      currentPath.startsWith("/admin");

    /*
    |--------------------------------------------------------------------------
    | Protected Endpoint
    |--------------------------------------------------------------------------
    */

    const isProtectedEndpoint =
      isAdminPage ||
      requestUrl.includes("/admin") ||
      requestUrl.includes("/user/") ||
      requestUrl.includes("/checkout") ||
      requestUrl.includes("/profile") ||
      requestUrl.includes("/orders") ||
      requestUrl.includes("/auth/me") ||
      requestUrl.includes("/user/me") ||
      currentPath.startsWith("/user/") ||
      currentPath.startsWith("/checkout") ||
      currentPath.startsWith("/profile") ||
      currentPath.startsWith("/orders");

    /*
    |--------------------------------------------------------------------------
    | 401 - Unauthorized
    |--------------------------------------------------------------------------
    |
    | ONLY protected endpoints should cause login redirect.
    |
    | Public:
    | - Products
    | - Categories
    | - Cart
    | - Wishlist
    | - Home
    |
    | should NOT automatically redirect to login.
    |
    |--------------------------------------------------------------------------
    */

    if (
      status === 401 &&
      !isLoginRequest &&
      isProtectedEndpoint &&
      !isHandlingUnauthorized
    ) {
      isHandlingUnauthorized = true;

      /*
      |--------------------------------------------------------------------------
      | Clear Correct Token
      |--------------------------------------------------------------------------
      */

      if (isAdminPage) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      } else {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
      }

      /*
      |--------------------------------------------------------------------------
      | Toast
      |--------------------------------------------------------------------------
      */

      showToast.error(
        "Session expired. Please login again."
      );

      /*
      |--------------------------------------------------------------------------
      | Redirect
      |--------------------------------------------------------------------------
      */

      setTimeout(() => {
        if (isAdminPage) {
          if (currentPath !== "/admin/login") {
            window.location.replace(
              "/admin/login"
            );
          }
        } else {
          if (currentPath !== "/user/login") {
            window.location.replace(
              "/user/login"
            );
          }
        }

        /*
        |--------------------------------------------------------------------------
        | Reset Flag
        |--------------------------------------------------------------------------
        */

        setTimeout(() => {
          isHandlingUnauthorized = false;
        }, 1000);
      }, 300);
    }

    /*
    |--------------------------------------------------------------------------
    | Always Reject Original Error
    |--------------------------------------------------------------------------
    */

    return Promise.reject(error);
  }
);

export default axiosInstance;