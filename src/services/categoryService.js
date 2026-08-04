import axiosInstance from "../config/axiosInstance";

import {
  CATEGORY_ENDPOINTS,
} from "../constants/endpoints/categoryEndpoints";




export const CategoryService = {



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




  getById: async (
    id
  ) => {

    /*
    |--------------------------------------------------------------------------
    | Validate Category ID
    |--------------------------------------------------------------------------
    */

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



  getBySlug: async (
    slug
  ) => {

    /*
    |--------------------------------------------------------------------------
    | Validate Slug
    |--------------------------------------------------------------------------
    */

    if (!slug) {

      throw new Error(
        "Category slug is required."
      );

    }


    const response =
      await axiosInstance.get(

        CATEGORY_ENDPOINTS.GET_BY_SLUG(
          slug
        )

      );


    return response.data;

  },




  getProducts: async (
    id,
    params = {}
  ) => {

    /*
    |--------------------------------------------------------------------------
    | Validate Category ID
    |--------------------------------------------------------------------------
    */

    if (!id) {

      throw new Error(
        "Category ID is required."
      );

    }


    const response =
      await axiosInstance.get(

        CATEGORY_ENDPOINTS.GET_PRODUCTS(
          id
        ),

        {
          params,
        }

      );


    return response.data;

  },




  create: async (
    formData
  ) => {

    /*
    |--------------------------------------------------------------------------
    | Validate FormData
    |--------------------------------------------------------------------------
    */

    if (!formData) {

      throw new Error(
        "Category data is required."
      );

    }


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



  update: async (
    id,
    formData
  ) => {



    if (!id) {

      throw new Error(
        "Category ID is required."
      );

    }


    if (!formData) {

      throw new Error(
        "Category update data is required."
      );

    }


    const response =
      await axiosInstance.patch(

        CATEGORY_ENDPOINTS.UPDATE(
          id
        ),

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


  

  updateStatus: async (
    id,
    isActive
  ) => {

   

    if (!id) {

      throw new Error(
        "Category ID is required."
      );

    }

    if (
      typeof isActive !==
      "boolean"
    ) {

      throw new Error(
        "Category status must be true or false."
      );

    }


    const response =
      await axiosInstance.patch(

        CATEGORY_ENDPOINTS.UPDATE_STATUS(
          id
        ),

        {
          isActive,
        }

      );


    return response.data;

  },

  delete: async (
    id
  ) => {

    /*
    |--------------------------------------------------------------------------
    | Validate Category ID
    |--------------------------------------------------------------------------
    */

    if (!id) {

      throw new Error(
        "Category ID is required."
      );

    }


    const response =
      await axiosInstance.delete(

        CATEGORY_ENDPOINTS.DELETE(
          id
        )

      );


    return response.data;

  },

    /*
  |--------------------------------------------------------------------------
  | EXPORT CATEGORIES EXCEL
  |--------------------------------------------------------------------------
  */

  exportExcel: async () => {

    const response =
      await axiosInstance.get(

        CATEGORY_ENDPOINTS.EXPORT_EXCEL,

        {
          responseType: "blob",
        }

      );

    return response;

  },



  /*
  |--------------------------------------------------------------------------
  | IMPORT CATEGORIES EXCEL
  |--------------------------------------------------------------------------
  */

  importExcel: async (
    file
  ) => {

    if (!file) {

      throw new Error(
        "Excel file is required."
      );

    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await axiosInstance.post(

        CATEGORY_ENDPOINTS.IMPORT_EXCEL,

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