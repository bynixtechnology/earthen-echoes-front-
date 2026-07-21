import {
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  CategoryService,
} from "../../services/categoryService";


/*
|--------------------------------------------------------------------------
| Get Error Message
|--------------------------------------------------------------------------
*/

const getErrorMessage = (
  error,
  fallback
) => {

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );

};


/*
|--------------------------------------------------------------------------
| Extract Categories
|--------------------------------------------------------------------------
*/

const extractCategories = (
  response
) => {

  const categories =
    response?.data?.categories ||
    response?.data?.data ||
    response?.data ||
    response?.categories ||
    response ||
    [];


  return Array.isArray(
    categories
  )
    ? categories
    : [];

};


/*
|--------------------------------------------------------------------------
| Extract Single Category
|--------------------------------------------------------------------------
*/

const extractCategory = (
  response
) => {

  return (
    response?.data?.category ||
    response?.data?.data?.category ||
    response?.data?.data ||
    response?.data ||
    response?.category ||
    response
  );

};


/*
|--------------------------------------------------------------------------
| Fetch All Categories
|--------------------------------------------------------------------------
*/

export const fetchCategories =
  createAsyncThunk(

    "categories/fetchCategories",

    async (
      params = {},
      {
        rejectWithValue,
      }
    ) => {

      try {

        /*
        |--------------------------------------------------------------------------
        | Call Category API
        |--------------------------------------------------------------------------
        */

        const response =
          await CategoryService.getAll(
            params
          );


        /*
        |--------------------------------------------------------------------------
        | Extract Categories
        |--------------------------------------------------------------------------
        */

        return extractCategories(
          response
        );

      } catch (error) {

        console.error(
          "FETCH CATEGORIES ERROR:",
          error
        );


        return rejectWithValue(

          getErrorMessage(
            error,
            "Unable to fetch categories."
          )

        );

      }

    }

  );


/*
|--------------------------------------------------------------------------
| Fetch Category By ID
|--------------------------------------------------------------------------
*/

export const fetchCategoryById =
  createAsyncThunk(

    "categories/fetchCategoryById",

    async (
      id,
      {
        rejectWithValue,
      }
    ) => {

      try {

        /*
        |--------------------------------------------------------------------------
        | Validate ID
        |--------------------------------------------------------------------------
        */

        if (!id) {

          return rejectWithValue(
            "Category ID is required."
          );

        }


        /*
        |--------------------------------------------------------------------------
        | Call Category API
        |--------------------------------------------------------------------------
        */

        const response =
          await CategoryService.getById(
            id
          );


        /*
        |--------------------------------------------------------------------------
        | Extract Category
        |--------------------------------------------------------------------------
        */

        const category =
          extractCategory(
            response
          );


        /*
        |--------------------------------------------------------------------------
        | Validate Category
        |--------------------------------------------------------------------------
        */

        if (
          !category ||
          typeof category !==
            "object"
        ) {

          return rejectWithValue(
            "Category not found."
          );

        }


        return category;

      } catch (error) {

        console.error(
          "FETCH CATEGORY BY ID ERROR:",
          error
        );


        return rejectWithValue(

          getErrorMessage(
            error,
            "Unable to fetch category."
          )

        );

      }

    }

  );


/*
|--------------------------------------------------------------------------
| Create Category
|--------------------------------------------------------------------------
*/

export const createCategory =
  createAsyncThunk(

    "categories/createCategory",

    async (
      formData,
      {
        rejectWithValue,
      }
    ) => {

      try {

        /*
        |--------------------------------------------------------------------------
        | Validate FormData
        |--------------------------------------------------------------------------
        */

        if (
          !formData ||
          !(
            formData instanceof
            FormData
          )
        ) {

          return rejectWithValue(
            "Valid category form data is required."
          );

        }


        /*
        |--------------------------------------------------------------------------
        | Call Create API
        |--------------------------------------------------------------------------
        */

        const response =
          await CategoryService.create(
            formData
          );


        /*
        |--------------------------------------------------------------------------
        | Extract Created Category
        |--------------------------------------------------------------------------
        */

        const category =
          extractCategory(
            response
          );


        /*
        |--------------------------------------------------------------------------
        | Return Normalized Payload
        |--------------------------------------------------------------------------
        */

        return {

          category:
            category &&
            typeof category ===
              "object"
              ? category
              : null,

          message:
            response?.message ||
            response?.data?.message ||
            "Category created successfully.",

        };

      } catch (error) {

        console.error(
          "CREATE CATEGORY ERROR:",
          error
        );


        return rejectWithValue(

          getErrorMessage(
            error,
            "Unable to create category."
          )

        );

      }

    }

  );


/*
|--------------------------------------------------------------------------
| Update Category
|--------------------------------------------------------------------------
*/

export const updateCategory =
  createAsyncThunk(

    "categories/updateCategory",

    async (
      {
        id,
        data,
      },
      {
        rejectWithValue,
      }
    ) => {

      try {

        /*
        |--------------------------------------------------------------------------
        | Validate ID
        |--------------------------------------------------------------------------
        */

        if (!id) {

          return rejectWithValue(
            "Category ID is required."
          );

        }


        /*
        |--------------------------------------------------------------------------
        | Validate Data
        |--------------------------------------------------------------------------
        */

        if (!data) {

          return rejectWithValue(
            "Category update data is required."
          );

        }


        /*
        |--------------------------------------------------------------------------
        | Call Update API
        |--------------------------------------------------------------------------
        */

        const response =
          await CategoryService.update(
            id,
            data
          );


        /*
        |--------------------------------------------------------------------------
        | Extract Updated Category
        |--------------------------------------------------------------------------
        */

        const category =
          extractCategory(
            response
          );


        return {

          id,

          category:
            category &&
            typeof category ===
              "object"
              ? category
              : null,

          message:
            response?.message ||
            response?.data?.message ||
            "Category updated successfully.",

        };

      } catch (error) {

        console.error(
          "UPDATE CATEGORY ERROR:",
          error
        );


        return rejectWithValue(

          getErrorMessage(
            error,
            "Unable to update category."
          )

        );

      }

    }

  );


/*
|--------------------------------------------------------------------------
| Delete Category
|--------------------------------------------------------------------------
*/

export const deleteCategory =
  createAsyncThunk(

    "categories/deleteCategory",

    async (
      id,
      {
        rejectWithValue,
      }
    ) => {

      try {

        /*
        |--------------------------------------------------------------------------
        | Validate ID
        |--------------------------------------------------------------------------
        */

        if (!id) {

          return rejectWithValue(
            "Category ID is required."
          );

        }


        /*
        |--------------------------------------------------------------------------
        | Call Delete API
        |--------------------------------------------------------------------------
        */

        const response =
          await CategoryService.delete(
            id
          );


        /*
        |--------------------------------------------------------------------------
        | Return Deleted ID
        |--------------------------------------------------------------------------
        */

        return {

          id,

          message:
            response?.message ||
            response?.data?.message ||
            "Category deleted successfully.",

        };

      } catch (error) {

        console.error(
          "DELETE CATEGORY ERROR:",
          error
        );


        return rejectWithValue(

          getErrorMessage(
            error,
            "Unable to delete category."
          )

        );

      }

    }

  );