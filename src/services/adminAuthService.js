import axiosInstance from "../config/axiosInstance";

import {
  ADMIN_AUTH_ENDPOINTS,
} from "../constants/endpoints";


export const AdminAuthService = {

  /*
  |--------------------------------------------------------------------------
  | Admin Login
  |--------------------------------------------------------------------------
  */

  login: async (
    credentials
  ) => {

    const response =
      await axiosInstance.post(
        ADMIN_AUTH_ENDPOINTS.LOGIN,
        credentials
      );

    return response.data;

  },


  /*
  |--------------------------------------------------------------------------
  | Admin Profile
  |--------------------------------------------------------------------------
  */

  getProfile: async () => {

    const response =
      await axiosInstance.get(
        ADMIN_AUTH_ENDPOINTS.PROFILE
      );

    return response.data;

  },

};