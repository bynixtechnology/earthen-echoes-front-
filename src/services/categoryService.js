import axiosInstance from "../config/axiosInstance";

import {
  CATEGORY_ENDPOINTS,
} from "../constants/endpoints/categoryEndpoints";

export const CategoryService = {
  /*
  |--------------------------------------------------------------------------
  | Get All
  |--------------------------------------------------------------------------
  */

  getAll: async (
    params = {}
  ) => {
    const response =
      await axiosInstance.get(
        CATEGORY_ENDPOINTS.GET_ALL,
        {
          params,
        }
      );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Get By ID
  |--------------------------------------------------------------------------
  */

  getById: async (id) => {
    if (!id) {
      throw new Error(
        "Category ID is required."
      );
    }

    const response =
      await axiosInstance.get(
        CATEGORY_ENDPOINTS.GET_BY_ID(
          id
        )
      );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  create: async (
    formData
  ) => {
    const response =
      await axiosInstance.post(
        CATEGORY_ENDPOINTS.CREATE,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  },
};