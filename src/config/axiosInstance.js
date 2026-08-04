import axios from "axios";
import { showToast } from "./toast";

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
      config.headers["Content-Type"] =
        "application/json";
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

    const isLoginRequest =
      requestUrl.includes("/login");

    if (
      status === 401 &&
      !isLoginRequest &&
      !isHandlingUnauthorized
    ) {
      isHandlingUnauthorized = true;

      const isAdminPage =
        window.location.pathname.startsWith("/admin");

      if (isAdminPage) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      } else {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
      }

      showToast.error(
        "Session expired. Please login again."
      );

      setTimeout(() => {
        if (isAdminPage) {
          if (
            window.location.pathname !==
            "/admin/login"
          ) {
            window.location.replace(
              "/admin/login"
            );
          }
        } else {
          if (
            window.location.pathname !==
            "/user/login"
          ) {
            window.location.replace(
              "/user/login"
            );
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