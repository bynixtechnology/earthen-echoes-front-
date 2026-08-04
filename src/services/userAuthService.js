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
};