import axios from "axios";
import { showToast } from "./toast";

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
| withCredentials: true enable kiya gaya hai taaki HTTP-only guest session
| cookies (guestSessionId) automatic sync ho sakein.
*/

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
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
    const isAdminRequest =
      config.url?.startsWith("/admin") ||
      window.location.pathname.startsWith("/admin");

    const token = isAdminRequest
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    /*
    |--------------------------------------------------------------------------
    | FormData Support
    |--------------------------------------------------------------------------
    */

    if (config.data instanceof FormData) {
      // Axios browser me boundary automatically set karta hai
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    const currentPath = window.location.pathname;

    const isLoginRequest =
      requestUrl.includes("/login") || requestUrl.includes("/register");

    const isAdminPage = currentPath.startsWith("/admin");

    /*
    |--------------------------------------------------------------------------
    | IMPORTANT FIX FOR GUEST / PUBLIC ROUTING
    |--------------------------------------------------------------------------
    | 1. Only trigger redirect if the request is for a PROTECTED endpoint.
    | 2. Do NOT trigger login redirect for public pages (Home, Products, Cart, etc.)
    |--------------------------------------------------------------------------
    */

    const isProtectedEndpoint =
      isAdminPage ||
      requestUrl.includes("/admin") ||
      requestUrl.includes("/user/") ||
      requestUrl.includes("/checkout") ||
      requestUrl.includes("/profile") ||
      requestUrl.includes("/orders") ||
      currentPath.startsWith("/user/") ||
      currentPath.startsWith("/checkout");

    if (
      status === 401 &&
      !isLoginRequest &&
      isProtectedEndpoint &&
      !isHandlingUnauthorized
    ) {
      isHandlingUnauthorized = true;

      if (isAdminPage) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      } else {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
      }

      showToast.error("Session expired. Please login again.");

      setTimeout(() => {
        if (isAdminPage) {
          if (currentPath !== "/admin/login") {
            window.location.replace("/admin/login");
          }
        } else {
          if (currentPath !== "/user/login") {
            window.location.replace("/user/login");
          }
        }

        setTimeout(() => {
          isHandlingUnauthorized = false;
        }, 1000);
      }, 300);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;