import axiosInstance from "../config/axiosInstance";

import {
  USER_AUTH_ENDPOINTS,
} from "../constants/endpoints";

export const UserAuthService = {
  /*
  |--------------------------------------------------------------------------
  | User Login
  |--------------------------------------------------------------------------
  */
  login: async (credentials) => {
    const response = await axiosInstance.post(
      USER_AUTH_ENDPOINTS.LOGIN,
      credentials
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | User Register
  |--------------------------------------------------------------------------
  */
  register: async (data) => {
    const response = await axiosInstance.post(
      USER_AUTH_ENDPOINTS.REGISTER,
      data
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Google Login / Register
  |--------------------------------------------------------------------------
  */
  googleLogin: async (credential) => {
    const response = await axiosInstance.post(
      USER_AUTH_ENDPOINTS.GOOGLE_LOGIN,
      {
        credential,
      }
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Get All Users List
  |--------------------------------------------------------------------------
  */
  getAllUsers: async () => {
    const response = await axiosInstance.get(
      USER_AUTH_ENDPOINTS.ALL_USERS
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Get User Profile
  |--------------------------------------------------------------------------
  */
  getProfile: async () => {
    const response = await axiosInstance.get(
      USER_AUTH_ENDPOINTS.PROFILE
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Update User Profile
  |--------------------------------------------------------------------------
  */
  updateProfile: async (data) => {
    const response = await axiosInstance.put(
      USER_AUTH_ENDPOINTS.UPDATE_PROFILE,
      data
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Change Password
  |--------------------------------------------------------------------------
  */
  changePassword: async (data) => {
    const response = await axiosInstance.put(
      USER_AUTH_ENDPOINTS.CHANGE_PASSWORD,
      data
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Get User Orders
  |--------------------------------------------------------------------------
  */
  getMyOrders: async () => {
    const response = await axiosInstance.get(
      USER_AUTH_ENDPOINTS.ORDERS
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Get Single Order Details (User)
  |--------------------------------------------------------------------------
  */
  getOrderDetails: async (id) => {
    const endpoint =
      typeof USER_AUTH_ENDPOINTS.ORDER_DETAILS === "function"
        ? USER_AUTH_ENDPOINTS.ORDER_DETAILS(id)
        : `${USER_AUTH_ENDPOINTS.ORDERS}/${id}`;

    const response = await axiosInstance.get(endpoint);

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Admin: Get Dashboard Stats & Recent Activities
  |--------------------------------------------------------------------------
  */
  getAdminDashboardStats: async () => {
    const response = await axiosInstance.get(
      USER_AUTH_ENDPOINTS.ADMIN_DASHBOARD_STATS
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Admin: Get All Orders (Supports filters: status, paymentStatus, search, page)
  |--------------------------------------------------------------------------
  */
  getAllOrdersAdmin: async (params = {}) => {
    const response = await axiosInstance.get(
      USER_AUTH_ENDPOINTS.ADMIN_ORDERS,
      { params }
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Admin: Get Single Order Details
  |--------------------------------------------------------------------------
  */
  getAdminOrderDetails: async (id) => {
    const endpoint =
      typeof USER_AUTH_ENDPOINTS.ADMIN_ORDER_DETAILS === "function"
        ? USER_AUTH_ENDPOINTS.ADMIN_ORDER_DETAILS(id)
        : `${USER_AUTH_ENDPOINTS.ADMIN_ORDERS}/${id}`;

    const response = await axiosInstance.get(endpoint);

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Admin: Update Order Status & Courier Tracking
  |--------------------------------------------------------------------------
  */
  updateOrderStatusAdmin: async (id, statusData) => {
    const endpoint =
      typeof USER_AUTH_ENDPOINTS.ADMIN_UPDATE_ORDER_STATUS === "function"
        ? USER_AUTH_ENDPOINTS.ADMIN_UPDATE_ORDER_STATUS(id)
        : `${USER_AUTH_ENDPOINTS.ADMIN_ORDERS}/${id}/status`;

    const response = await axiosInstance.put(endpoint, statusData);

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Admin: Delete Order
  |--------------------------------------------------------------------------
  */
  deleteOrderAdmin: async (id) => {
    const endpoint =
      typeof USER_AUTH_ENDPOINTS.ADMIN_DELETE_ORDER === "function"
        ? USER_AUTH_ENDPOINTS.ADMIN_DELETE_ORDER(id)
        : `${USER_AUTH_ENDPOINTS.ADMIN_ORDERS}/${id}`;

    const response = await axiosInstance.delete(endpoint);

    return response.data;
  },
};

export default UserAuthService;