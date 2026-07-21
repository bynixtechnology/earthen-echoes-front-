import axiosInstance from "../config/axiosInstance";

import {
  AUTH_ENDPOINTS,
} from "../constants/endpoints";

export const AuthService = {
  login: async (credentials) => {
    const response =
      await axiosInstance.post(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );

    return response.data;
  },

  register: async (data) => {
    const response =
      await axiosInstance.post(
        AUTH_ENDPOINTS.REGISTER,
        data
      );

    return response.data;
  },

  googleLogin: async (credential) => {
    const response =
      await axiosInstance.post(
        AUTH_ENDPOINTS.GOOGLE_LOGIN,
        {
          credential,
        }
      );

    return response.data;
  },
};