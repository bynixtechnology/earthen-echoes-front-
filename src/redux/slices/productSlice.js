import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  fetchProducts,
  fetchProductById,
  fetchProductsByCategory,
  deleteProduct,
} from "../thunks/productThunk";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
  /*
  |--------------------------------------------------------------------------
  | All Products
  |--------------------------------------------------------------------------
  */

  products: [],

  /*
  |--------------------------------------------------------------------------
  | Single Selected Product
  |--------------------------------------------------------------------------
  */

  selectedProduct: null,

  /*
  |--------------------------------------------------------------------------
  | Category Wise Products
  |--------------------------------------------------------------------------
  */

  categoryProducts: [],

  /*
  |--------------------------------------------------------------------------
  | Loading States
  |--------------------------------------------------------------------------
  */

  loading: false,

  detailsLoading: false,

  categoryLoading: false,

  actionLoading: false,

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  error: null,
};

/*
|--------------------------------------------------------------------------
| Product Slice
|--------------------------------------------------------------------------
*/

const productSlice =
  createSlice({
    name: "products",

    initialState,

    /*
    |--------------------------------------------------------------------------
    | Reducers
    |--------------------------------------------------------------------------
    */

    reducers: {
      /*
      |--------------------------------------------------------------------------
      | Clear Product Error
      |--------------------------------------------------------------------------
      */

      clearProductError: (
        state
      ) => {
        state.error = null;
      },

      /*
      |--------------------------------------------------------------------------
      | Clear Selected Product
      |--------------------------------------------------------------------------
      */

      clearSelectedProduct: (
        state
      ) => {
        state.selectedProduct =
          null;

        state.detailsLoading =
          false;

        state.error = null;
      },

      /*
      |--------------------------------------------------------------------------
      | Clear Category Products
      |--------------------------------------------------------------------------
      */

      clearCategoryProducts: (
        state
      ) => {
        state.categoryProducts =
          [];

        state.categoryLoading =
          false;

        state.error = null;
      },

      /*
      |--------------------------------------------------------------------------
      | Reset Product State
      |--------------------------------------------------------------------------
      */

      resetProductState: (
        state
      ) => {
        state.products = [];

        state.selectedProduct =
          null;

        state.categoryProducts =
          [];

        state.loading = false;

        state.detailsLoading =
          false;

        state.categoryLoading =
          false;

        state.actionLoading =
          false;

        state.error = null;
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Extra Reducers
    |--------------------------------------------------------------------------
    */

    extraReducers: (
      builder
    ) => {
      builder

        /*
        |--------------------------------------------------------------------------
        | FETCH ALL PRODUCTS - PENDING
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchProducts.pending,

          (state) => {
            state.loading = true;

            state.error = null;
          }
        )

        /*
        |--------------------------------------------------------------------------
        | FETCH ALL PRODUCTS - FULFILLED
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchProducts.fulfilled,

          (
            state,
            action
          ) => {
            state.loading = false;

            state.products =
              Array.isArray(
                action.payload
              )
                ? action.payload
                : [];

            state.error = null;
          }
        )

        /*
        |--------------------------------------------------------------------------
        | FETCH ALL PRODUCTS - REJECTED
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchProducts.rejected,

          (
            state,
            action
          ) => {
            state.loading = false;

            state.products = [];

            state.error =
              action.payload ||
              "Unable to fetch products.";
          }
        )

        /*
        |--------------------------------------------------------------------------
        | FETCH PRODUCT BY ID - PENDING
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchProductById.pending,

          (state) => {
            state.detailsLoading =
              true;

            state.error = null;

            state.selectedProduct =
              null;
          }
        )

        /*
        |--------------------------------------------------------------------------
        | FETCH PRODUCT BY ID - FULFILLED
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchProductById.fulfilled,

          (
            state,
            action
          ) => {
            state.detailsLoading =
              false;

            state.selectedProduct =
              action.payload ||
              null;

            state.error = null;
          }
        )

        /*
        |--------------------------------------------------------------------------
        | FETCH PRODUCT BY ID - REJECTED
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchProductById.rejected,

          (
            state,
            action
          ) => {
            state.detailsLoading =
              false;

            state.selectedProduct =
              null;

            state.error =
              action.payload ||
              "Unable to fetch product.";
          }
        )

        /*
        |--------------------------------------------------------------------------
        | FETCH PRODUCTS BY CATEGORY - PENDING
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchProductsByCategory.pending,

          (state) => {
            state.categoryLoading =
              true;

            state.error = null;

            /*
            | Optional:
            | Purane category products ko immediately
            | remove kar dete hain taaki stale products
            | show na hon.
            */

            state.categoryProducts =
              [];
          }
        )

        /*
        |--------------------------------------------------------------------------
        | FETCH PRODUCTS BY CATEGORY - FULFILLED
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchProductsByCategory.fulfilled,

          (
            state,
            action
          ) => {
            state.categoryLoading =
              false;

            state.categoryProducts =
              Array.isArray(
                action.payload
              )
                ? action.payload
                : [];

            state.error = null;
          }
        )

        /*
        |--------------------------------------------------------------------------
        | FETCH PRODUCTS BY CATEGORY - REJECTED
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchProductsByCategory.rejected,

          (
            state,
            action
          ) => {
            state.categoryLoading =
              false;

            state.categoryProducts =
              [];

            state.error =
              action.payload ||
              "Unable to fetch category products.";
          }
        )

        /*
        |--------------------------------------------------------------------------
        | DELETE PRODUCT - PENDING
        |--------------------------------------------------------------------------
        */

        .addCase(
          deleteProduct.pending,

          (state) => {
            state.actionLoading =
              true;

            state.error = null;
          }
        )

        /*
        |--------------------------------------------------------------------------
        | DELETE PRODUCT - FULFILLED
        |--------------------------------------------------------------------------
        */

        .addCase(
          deleteProduct.fulfilled,

          (
            state,
            action
          ) => {
            state.actionLoading =
              false;

            /*
            |--------------------------------------------------------------------------
            | Deleted Product ID
            |--------------------------------------------------------------------------
            */

            const deletedId =
              action.payload;

            /*
            |--------------------------------------------------------------------------
            | Remove From All Products
            |--------------------------------------------------------------------------
            */

            state.products =
              state.products.filter(
                (product) =>
                  product?._id !==
                  deletedId
              );

            /*
            |--------------------------------------------------------------------------
            | Remove From Category Products
            |--------------------------------------------------------------------------
            */

            state.categoryProducts =
              state.categoryProducts.filter(
                (product) =>
                  product?._id !==
                  deletedId
              );

            /*
            |--------------------------------------------------------------------------
            | Clear Selected Product If Same Product Deleted
            |--------------------------------------------------------------------------
            */

            if (
              state
                .selectedProduct
                ?._id ===
              deletedId
            ) {
              state.selectedProduct =
                null;
            }

            state.error = null;
          }
        )

        /*
        |--------------------------------------------------------------------------
        | DELETE PRODUCT - REJECTED
        |--------------------------------------------------------------------------
        */

        .addCase(
          deleteProduct.rejected,

          (
            state,
            action
          ) => {
            state.actionLoading =
              false;

            state.error =
              action.payload ||
              "Unable to delete product.";
          }
        );
    },
  });

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

export const {
  clearProductError,

  clearSelectedProduct,

  clearCategoryProducts,

  resetProductState,
} = productSlice.actions;

/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Select All Products
|--------------------------------------------------------------------------
*/

export const selectProducts = (
  state
) =>
  state.products?.products ||
  [];

/*
|--------------------------------------------------------------------------
| Select Single Product
|--------------------------------------------------------------------------
*/

export const selectSelectedProduct =
  (state) =>
    state.products
      ?.selectedProduct ||
    null;

/*
|--------------------------------------------------------------------------
| Select Category Products
|--------------------------------------------------------------------------
*/

export const selectCategoryProducts =
  (state) =>
    state.products
      ?.categoryProducts ||
    [];

/*
|--------------------------------------------------------------------------
| Select All Products Loading
|--------------------------------------------------------------------------
*/

export const selectProductsLoading =
  (state) =>
    state.products?.loading ||
    false;

/*
|--------------------------------------------------------------------------
| Select Product Details Loading
|--------------------------------------------------------------------------
*/

export const selectProductDetailsLoading =
  (state) =>
    state.products
      ?.detailsLoading ||
    false;

/*
|--------------------------------------------------------------------------
| Select Category Products Loading
|--------------------------------------------------------------------------
*/

export const selectCategoryProductsLoading =
  (state) =>
    state.products
      ?.categoryLoading ||
    false;

/*
|--------------------------------------------------------------------------
| Select Product Action Loading
|--------------------------------------------------------------------------
*/

export const selectProductActionLoading =
  (state) =>
    state.products
      ?.actionLoading ||
    false;

/*
|--------------------------------------------------------------------------
| Select Product Error
|--------------------------------------------------------------------------
*/

export const selectProductError = (
  state
) =>
  state.products?.error ||
  null;

/*
|--------------------------------------------------------------------------
| Product Reducer
|--------------------------------------------------------------------------
*/

export default productSlice.reducer;