import axiosInstance from "../config/axiosInstance";

import {
  PRODUCT_ENDPOINTS,
} from "../constants/endpoints/productEndpoints";

export const ProductService = {
  /*
  |--------------------------------------------------------------------------
  | Get All Products
  |--------------------------------------------------------------------------
  */

  getAll: async (
    params = {}
  ) => {
    const response =
      await axiosInstance.get(
        PRODUCT_ENDPOINTS.GET_ALL,
        {
          params,
        }
      );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Get Product By ID
  |--------------------------------------------------------------------------
  */

  getById: async (id) => {
    if (!id) {
      throw new Error(
        "Product ID is required."
      );
    }

    const response =
      await axiosInstance.get(
        PRODUCT_ENDPOINTS.GET_BY_ID(
          id
        )
      );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Get Products By Category
  |--------------------------------------------------------------------------
  */

  getByCategory: async (
    categoryId
  ) => {
    if (!categoryId) {
      throw new Error(
        "Category ID is required."
      );
    }

    const response =
      await axiosInstance.get(
        PRODUCT_ENDPOINTS.GET_BY_CATEGORY(
          categoryId
        )
      );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Create Product
  |--------------------------------------------------------------------------
  */

  create: async (
    formData,
    onProgress
  ) => {
    const response =
      await axiosInstance.post(
        PRODUCT_ENDPOINTS.CREATE,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },

          onUploadProgress: (
            progressEvent
          ) => {
            if (
              !progressEvent.total ||
              typeof onProgress !==
                "function"
            ) {
              return;
            }

            const percentage =
              Math.round(
                (progressEvent.loaded *
                  100) /
                  progressEvent.total
              );

            onProgress(
              percentage
            );
          },
        }
      );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Update Product
  |--------------------------------------------------------------------------
  */

  update: async (
    id,
    data,
    onProgress
  ) => {
    if (!id) {
      throw new Error(
        "Product ID is required."
      );
    }

    const isFormData =
      data instanceof FormData;

    const response =
      await axiosInstance.put(
        PRODUCT_ENDPOINTS.UPDATE(
          id
        ),
        data,
        {
          headers: {
            "Content-Type":
              isFormData
                ? "multipart/form-data"
                : "application/json",
          },

          onUploadProgress:
            isFormData
              ? (
                  progressEvent
                ) => {
                  if (
                    !progressEvent.total ||
                    typeof onProgress !==
                      "function"
                  ) {
                    return;
                  }

                  const percentage =
                    Math.round(
                      (progressEvent.loaded *
                        100) /
                        progressEvent.total
                    );

                  onProgress(
                    percentage
                  );
                }
              : undefined,
        }
      );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Delete Product
  |--------------------------------------------------------------------------
  */

  delete: async (id) => {
    if (!id) {
      throw new Error(
        "Product ID is required."
      );
    }

    const response =
      await axiosInstance.delete(
        PRODUCT_ENDPOINTS.DELETE(
          id
        )
      );

    return response.data;
  },
};