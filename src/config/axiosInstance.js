import axios from "axios";
import { showToast } from "./toast";

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
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
    | IMPORTANT:
    | Login ke time token nahi hota.
    | Baaki protected APIs ke liye adminToken attach hoga.
    |--------------------------------------------------------------------------
    */

    const token =
      localStorage.getItem("adminToken");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

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
  | Success Response
  |--------------------------------------------------------------------------
  */

  (response) => response,


  /*
  |--------------------------------------------------------------------------
  | Error Response
  |--------------------------------------------------------------------------
  */

  (error) => {

    const status =
      error?.response?.status;

    const requestUrl =
      error?.config?.url || "";


    /*
    |--------------------------------------------------------------------------
    | Check Login Request
    |--------------------------------------------------------------------------
    |
    | Login API agar 401 de to "session expired" nahi dikhana.
    | Login component actual invalid credential message handle karega.
    |
    */

    const isLoginRequest =
      requestUrl.includes("/auth/login");


    /*
    |--------------------------------------------------------------------------
    | Handle Unauthorized
    |--------------------------------------------------------------------------
    */

    if (
      status === 401 &&
      !isLoginRequest
    ) {

      /*
      |--------------------------------------------------------------------------
      | Only Handle Once
      |--------------------------------------------------------------------------
      */

      if (!isHandlingUnauthorized) {

        isHandlingUnauthorized = true;


        /*
        |--------------------------------------------------------------------------
        | Clear Authentication
        |--------------------------------------------------------------------------
        */

        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "adminUser"
        );


        /*
        |--------------------------------------------------------------------------
        | Show Only One Toast
        |--------------------------------------------------------------------------
        */

        showToast.error(
          "Session expired or invalid. Please login again."
        );


        /*
        |--------------------------------------------------------------------------
        | Redirect
        |--------------------------------------------------------------------------
        */

        setTimeout(() => {

          if (
            window.location.pathname !==
            "/admin/login"
          ) {

            window.location.replace(
              "/admin/login"
            );

          }

          /*
          |--------------------------------------------------------------------------
          | Reset Guard
          |--------------------------------------------------------------------------
          */

          setTimeout(() => {

            isHandlingUnauthorized =
              false;

          }, 1000);

        }, 300);

      }

    }


    return Promise.reject(error);

  }

);


export default axiosInstance;