import {
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  ProductService,
} from "../../services/productService";


/*
|--------------------------------------------------------------------------
| Error Helper
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
| Normalize Products Response
|--------------------------------------------------------------------------
*/

const normalizeProducts = (
  response
) => {

  if (
    Array.isArray(response)
  ) {
    return response;
  }

  if (
    Array.isArray(
      response?.data
    )
  ) {
    return response.data;
  }

  if (
    Array.isArray(
      response?.products
    )
  ) {
    return response.products;
  }

  if (
    Array.isArray(
      response?.data?.products
    )
  ) {
    return response.data.products;
  }

  return [];
};


/*
|--------------------------------------------------------------------------
| Fetch All Products
|--------------------------------------------------------------------------
*/

export const fetchProducts =
  createAsyncThunk(
    "products/fetchProducts",

    async (
      params = {},
      {
        rejectWithValue,
      }
    ) => {

      try {

        const response =
          await ProductService.getAll(
            params
          );

        return normalizeProducts(
          response
        );

      } catch (error) {

        console.error(
          "FETCH PRODUCTS ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch products."
          )
        );

      }

    }
  );


/*
|--------------------------------------------------------------------------
| Fetch Product By ID
|--------------------------------------------------------------------------
*/

export const fetchProductById =
  createAsyncThunk(
    "products/fetchProductById",

    async (
      id,
      {
        rejectWithValue,
      }
    ) => {

      try {

        if (!id) {

          return rejectWithValue(
            "Product ID is required."
          );

        }

        const response =
          await ProductService.getById(
            id
          );


        const product =
          response?.data?.product ||
          response?.data ||
          response?.product ||
          response;


        if (
          !product ||
          typeof product !==
            "object"
        ) {

          return rejectWithValue(
            "Product not found."
          );

        }

        return product;

      } catch (error) {

        console.error(
          "FETCH PRODUCT BY ID ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch product."
          )
        );

      }

    }
  );


/*
|--------------------------------------------------------------------------
| Fetch Products By Category
|--------------------------------------------------------------------------
*/

export const fetchProductsByCategory =
  createAsyncThunk(
    "products/fetchProductsByCategory",

    async (
      categoryId,
      {
        rejectWithValue,
      }
    ) => {

      try {

        if (!categoryId) {

          return rejectWithValue(
            "Category ID is required."
          );

        }

        const response =
          await ProductService.getByCategory(
            categoryId
          );

        return normalizeProducts(
          response
        );

      } catch (error) {

        console.error(
          "FETCH PRODUCTS BY CATEGORY ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch category products."
          )
        );

      }

    }
  );


/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

export const createProduct =
  createAsyncThunk(
    "products/createProduct",

    async (
      formData,
      {
        rejectWithValue,
      }
    ) => {

      try {

        if (
          !formData
        ) {

          return rejectWithValue(
            "Product data is required."
          );

        }


        const response =
          await ProductService.create(
            formData
          );


        console.log(
          "CREATE PRODUCT RESPONSE:",
          response
        );


        return response;

      } catch (error) {

        console.error(
          "CREATE PRODUCT ERROR:",
          error
        );


        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to create product."
          )
        );

      }

    }
  );


/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

export const updateProduct =
  createAsyncThunk(
    "products/updateProduct",

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

        if (!id) {

          return rejectWithValue(
            "Product ID is required."
          );

        }


        if (!data) {

          return rejectWithValue(
            "Product data is required."
          );

        }


        const response =
          await ProductService.update(
            id,
            data
          );


        return response;

      } catch (error) {

        console.error(
          "UPDATE PRODUCT ERROR:",
          error
        );


        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to update product."
          )
        );

      }

    }
  );


/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/

export const deleteProduct =
  createAsyncThunk(
    "products/deleteProduct",

    async (
      id,
      {
        rejectWithValue,
      }
    ) => {

      try {

        if (!id) {

          return rejectWithValue(
            "Product ID is required."
          );

        }


        await ProductService.delete(
          id
        );


        return id;

      } catch (error) {

        console.error(
          "DELETE PRODUCT ERROR:",
          error
        );


        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to delete product."
          )
        );

      }

    }
  );