import axiosInstance from "../config/axiosInstance";
import { CATEGORY_ENDPOINTS } from "../constants/endpoints/categoryEndpoints";

export const CategoryService = {
  /*
  |--------------------------------------------------------------------------
  | GET ALL CATEGORIES
  |--------------------------------------------------------------------------
  */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get(CATEGORY_ENDPOINTS.GET_ALL, {
      params,
    });
    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | GET CATEGORY BY ID
  |--------------------------------------------------------------------------
  */
  getById: async (id) => {
    if (!id) {
      throw new Error("Category ID is required.");
    }

    const response = await axiosInstance.get(
      CATEGORY_ENDPOINTS.GET_BY_ID(id)
    );
    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | GET CATEGORY BY SLUG
  |--------------------------------------------------------------------------
  */
  getBySlug: async (slug) => {
    if (!slug) {
      throw new Error("Category slug is required.");
    }

    const response = await axiosInstance.get(
      CATEGORY_ENDPOINTS.GET_BY_SLUG(slug)
    );
    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | GET CATEGORY PRODUCTS
  |--------------------------------------------------------------------------
  */
  getProducts: async (id, params = {}) => {
    if (!id) {
      throw new Error("Category ID is required.");
    }

    const response = await axiosInstance.get(
      CATEGORY_ENDPOINTS.GET_PRODUCTS(id),
      {
        params,
      }
    );
    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | CREATE CATEGORY
  |--------------------------------------------------------------------------
  */
  create: async (formData) => {
    if (!formData) {
      throw new Error("Category data is required.");
    }

    const response = await axiosInstance.post(
      CATEGORY_ENDPOINTS.CREATE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | UPDATE CATEGORY
  |--------------------------------------------------------------------------
  */
  update: async (id, formData) => {
    if (!id) {
      throw new Error("Category ID is required.");
    }

    if (!formData) {
      throw new Error("Category update data is required.");
    }

    const response = await axiosInstance.patch(
      CATEGORY_ENDPOINTS.UPDATE(id),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | UPDATE CATEGORY STATUS
  |--------------------------------------------------------------------------
  */
  updateStatus: async (id, isActive) => {
    if (!id) {
      throw new Error("Category ID is required.");
    }

    if (typeof isActive !== "boolean") {
      throw new Error("Category status must be true or false.");
    }

    const response = await axiosInstance.patch(
      CATEGORY_ENDPOINTS.UPDATE_STATUS(id),
      {
        isActive,
      }
    );
    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | UPDATE CATEGORY FEATURED STATUS
  |--------------------------------------------------------------------------
  */
  updateFeaturedStatus: async (id, isFeatured) => {
    if (!id) {
      throw new Error("Category ID is required.");
    }

    if (typeof isFeatured !== "boolean") {
      throw new Error("Category featured status must be true or false.");
    }

    const response = await axiosInstance.patch(
      CATEGORY_ENDPOINTS.UPDATE_FEATURED(id),
      {
        isFeatured,
      }
    );
    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | DELETE CATEGORY
  |--------------------------------------------------------------------------
  */
  delete: async (id) => {
    if (!id) {
      throw new Error("Category ID is required.");
    }

    const response = await axiosInstance.delete(
      CATEGORY_ENDPOINTS.DELETE(id)
    );
    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | EXPORT CATEGORIES EXCEL
  |--------------------------------------------------------------------------
  */
  exportExcel: async () => {
    const response = await axiosInstance.get(
      CATEGORY_ENDPOINTS.EXPORT_EXCEL,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | IMPORT CATEGORIES EXCEL
  |--------------------------------------------------------------------------
  */
  importExcel: async (file) => {
    if (!file) {
      throw new Error("Excel file is required.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(
      CATEGORY_ENDPOINTS.IMPORT_EXCEL,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};