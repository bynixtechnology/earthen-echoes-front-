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
    error?.response?.data
      ?.message ||
    error?.response?.data
      ?.error ||
    error?.data?.message ||
    error?.message ||
    fallback
  );
};


/*
|--------------------------------------------------------------------------
| Normalize Products Response
|--------------------------------------------------------------------------
|
| Supported:
|
| []
|
| { products: [] }
|
| { data: [] }
|
| { data: { products: [] } }
|
| Axios:
| {
|   data: {
|     data: []
|   }
| }
|
| Axios:
| {
|   data: {
|     data: {
|       products: []
|     }
|   }
| }
|
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
      response?.products
    )
  ) {
    return response.products;
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
      response?.data
        ?.products
    )
  ) {
    return response.data
      .products;
  }

  if (
    Array.isArray(
      response?.data?.data
    )
  ) {
    return response.data
      .data;
  }

  if (
    Array.isArray(
      response?.data?.data
        ?.products
    )
  ) {
    return response.data
      .data.products;
  }

  return [];
};


/*
|--------------------------------------------------------------------------
| Normalize Single Product Response
|--------------------------------------------------------------------------
*/

const normalizeProduct = (
  response
) => {
  return (
    response?.data?.data
      ?.product ||

    response?.data
      ?.product ||

    response?.data?.data ||

    response?.product ||

    response?.data ||

    response ||

    null
  );
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

        const products =
          normalizeProducts(
            response
          );

        return products;
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
          normalizeProduct(
            response
          );

        if (
          !product ||
          typeof product !==
            "object" ||
          Array.isArray(product)
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
          await ProductService
            .getByCategory(
              categoryId
            );

        const products =
          normalizeProducts(
            response
          );

        return products;
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
        if (!formData) {
          return rejectWithValue(
            "Product data is required."
          );
        }

        const response =
          await ProductService.create(
            formData
          );

        const product =
          normalizeProduct(
            response
          );

        /*
        |--------------------------------------------------------------------------
        | Return actual created product
        |--------------------------------------------------------------------------
        |
        | Slice ko complete API response nahi,
        | actual product object milega.
        |
        */

        if (
          !product ||
          typeof product !==
            "object" ||
          Array.isArray(product)
        ) {
          return rejectWithValue(
            "Invalid product response."
          );
        }

        return product;
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

        const product =
          normalizeProduct(
            response
          );

        if (
          !product ||
          typeof product !==
            "object" ||
          Array.isArray(product)
        ) {
          return rejectWithValue(
            "Invalid updated product response."
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Ensure ID Available
        |--------------------------------------------------------------------------
        */

        return {
          ...product,

          _id:
            product?._id ||
            id,
        };
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

        /*
        |--------------------------------------------------------------------------
        | Return Deleted Product ID
        |--------------------------------------------------------------------------
        |
        | Slice:
        |
        | state.products = state.products.filter(
        |   product => product._id !== action.payload
        | )
        |
        */

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