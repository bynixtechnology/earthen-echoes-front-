import axiosInstance from "../config/axiosInstance";

import {
  PRODUCT_ENDPOINTS,
} from "../constants/endpoints/productEndpoints";


export const ProductService = {

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


  getPublic: async (
    params = {}
  ) => {

    const response =
      await axiosInstance.get(
        PRODUCT_ENDPOINTS.GET_PUBLIC,
        {
          params,
        }
      );

    return response.data;

  },


  getById: async (
    id
  ) => {

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


  getBySlug: async (
    slug
  ) => {

    const cleanSlug =
      slug?.trim();


    if (!cleanSlug) {

      throw new Error(
        "Product slug is required."
      );

    }


    const response =
      await axiosInstance.get(
        PRODUCT_ENDPOINTS.GET_BY_SLUG(
          cleanSlug
        )
      );


    return response.data;

  },


  getByCategory: async (
    categoryId,
    params = {}
  ) => {

    if (!categoryId) {

      throw new Error(
        "Category ID is required."
      );

    }


    const response =
      await axiosInstance.get(
        PRODUCT_ENDPOINTS.GET_ALL,
        {
          params: {

            ...params,

            category:
              categoryId,

          },
        }
      );


    return response.data;

  },


  search: async (
    search,
    params = {}
  ) => {

    const cleanSearch =
      search?.trim();


    if (!cleanSearch) {

      throw new Error(
        "Search keyword is required."
      );

    }


    const response =
      await axiosInstance.get(
        PRODUCT_ENDPOINTS.SEARCH,
        {
          params: {

            ...params,

            search:
              cleanSearch,

          },
        }
      );


    return response.data;

  },


  getFeatured: async (
    params = {}
  ) => {

    const response =
      await axiosInstance.get(
        PRODUCT_ENDPOINTS.GET_FEATURED,
        {
          params,
        }
      );

    return response.data;

  },


  getPublicFeatured: async (
    params = {}
  ) => {

    const response =
      await axiosInstance.get(
        PRODUCT_ENDPOINTS.GET_PUBLIC_FEATURED,
        {
          params,
        }
      );

    return response.data;

  },


  create: async (
    formData,
    onProgress
  ) => {

    if (
      !formData ||
      !(
        formData instanceof
        FormData
      )
    ) {

      throw new Error(
        "Valid product form data is required."
      );

    }


    const config = {};


    if (
      typeof onProgress ===
      "function"
    ) {

      config.onUploadProgress =
        (
          progressEvent
        ) => {

          if (
            !progressEvent.total
          ) {

            return;

          }


          const percentage =
            Math.round(

              (
                progressEvent.loaded *
                100
              ) /

              progressEvent.total

            );


          onProgress(
            percentage
          );

        };

    }


    try {

      const response =
        await axiosInstance.post(
          PRODUCT_ENDPOINTS.CREATE,
          formData,
          config
        );

      return response.data;

    } catch (error) {

      console.log("========== BACKEND ERROR ==========");
      console.log(error.response?.data);
      console.log("STATUS :", error.response?.status);
      console.log("===================================");

      throw error;

    }

  },
importExcel: async (formData, onProgress) => {

  if (!(formData instanceof FormData)) {
    throw new Error("Excel file is required.");
  }

  console.log("========== FRONTEND IMPORT ==========");
  console.log("URL :", PRODUCT_ENDPOINTS.IMPORT_EXCEL);

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(key, {
        name: value.name,
        size: value.size,
        type: value.type,
      });
    } else {
      console.log(key, value);
    }
  }

  try {

    const token = localStorage.getItem("token");

    const response = await axiosInstance.post(
      PRODUCT_ENDPOINTS.IMPORT_EXCEL,
      formData,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },

        transformRequest: [(data) => data],

        onUploadProgress: (progressEvent) => {

          if (
            typeof onProgress === "function" &&
            progressEvent.total
          ) {
            onProgress(
              Math.round(
                (progressEvent.loaded * 100) /
                progressEvent.total
              )
            );
          }

        },
      }
    );

    console.log("========== IMPORT SUCCESS ==========");
    console.log(response.data);

    return response.data;

  } catch (error) {

    console.log("========== IMPORT ERROR ==========");
    console.log(error.response?.status);
    console.log(error.response?.data);
    console.log(error);

    throw error;

  }

},


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


    if (!data) {

      throw new Error(
        "Product update data is required."
      );

    }


    const isFormData =
      data instanceof
      FormData;


    const config = {};


    if (
      isFormData &&
      typeof onProgress ===
      "function"
    ) {

      config.onUploadProgress =
        (
          progressEvent
        ) => {

          if (
            !progressEvent.total
          ) {

            return;

          }


          const percentage =
            Math.round(

              (
                progressEvent.loaded *
                100
              ) /

              progressEvent.total

            );


          onProgress(
            percentage
          );

        };

    }


    const response =
      await axiosInstance.patch(

        PRODUCT_ENDPOINTS.UPDATE(
          id
        ),

        data,

        config

      );


    return response.data;

  },


  updateStatus: async (
    id,
    isActive
  ) => {

    if (!id) {

      throw new Error(
        "Product ID is required."
      );

    }


    if (
      typeof isActive !==
      "boolean"
    ) {

      throw new Error(
        "Product status must be true or false."
      );

    }


    const response =
      await axiosInstance.patch(

        PRODUCT_ENDPOINTS.UPDATE_STATUS(
          id
        ),

        {
          isActive,
        }

      );


    return response.data;

  },


  updateFeatured: async (
    id,
    isFeatured
  ) => {

    if (!id) {

      throw new Error(
        "Product ID is required."
      );

    }


    if (
      typeof isFeatured !==
      "boolean"
    ) {

      throw new Error(
        "Featured status must be true or false."
      );

    }


    const response =
      await axiosInstance.patch(

        PRODUCT_ENDPOINTS.UPDATE_FEATURED(
          id
        ),

        {
          isFeatured,
        }

      );


    return response.data;

  },


  updateStock: async (
    id,
    stock
  ) => {

    if (!id) {

      throw new Error(
        "Product ID is required."
      );

    }


    const parsedStock =
      Number(
        stock
      );


    if (
      !Number.isFinite(
        parsedStock
      ) ||
      parsedStock < 0
    ) {

      throw new Error(
        "Stock must be a valid non-negative number."
      );

    }


    const response =
      await axiosInstance.patch(

        PRODUCT_ENDPOINTS.UPDATE(
          id
        ),

        {
          stock:
            parsedStock,
        }

      );


    return response.data;

  },

  exportExcel: async (
    params = {}
  ) => {

    const response =
      await axiosInstance.get(

        PRODUCT_ENDPOINTS.EXPORT_EXCEL,

        {

          params,

          responseType:
            "blob",

        }

      );

    return response.data;

  },
  delete: async (
    id
  ) => {

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