import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  fetchCart,
  addProductToCart,
  updateCartItem,
  removeProductFromCart,
} from "../thunks/cartThunk";

const initialState = {
  cartItems: [],

  loading: false,

  adding: false,

  removing: false,

  error: null,
};

const normalizeCart = (
  payload
) => {

  if (Array.isArray(payload)) {
    return payload;
  }

  if (
    Array.isArray(
      payload?.cart
    )
  ) {
    return payload.cart;
  }

  if (
    Array.isArray(
      payload?.items
    )
  ) {
    return payload.items;
  }

  return [];

};

const cartSlice =
  createSlice({
    name: "cart",

    initialState,

    reducers: {
      clearCartError: (
        state
      ) => {
        state.error = null;
      },

      clearCart: (
        state
      ) => {
        state.cartItems = [];
        state.error = null;
      },
    },

    extraReducers: (
      builder
    ) => {
      builder

        /*
        |--------------------------------------------------------------------------
        | Fetch Cart
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchCart.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchCart.fulfilled,
          (
            state,
            action
          ) => {

           

            state.loading = false;

            state.cartItems =
              normalizeCart(
                action.payload
              );

           

          }
        )

        .addCase(
          fetchCart.rejected,
          (state, action) => {

            console.log(
              "Fetch Cart Rejected:",
              action
            );

            state.loading = false;
            state.error = action.payload;
          }
        )

        /*
        |--------------------------------------------------------------------------
        | Add Cart
        |--------------------------------------------------------------------------
        */

        .addCase(
          addProductToCart.pending,
          (state) => {
            state.adding = true;
            state.error = null;
          }
        )

        .addCase(
          addProductToCart.fulfilled,
          (
            state,
            action
          ) => {
            state.adding = false;

            state.cartItems =
              normalizeCart(
                action.payload
              );
          }
        )

        .addCase(
          addProductToCart.rejected,
          (
            state,
            action
          ) => {
            state.adding = false;

            state.error =
              action.payload;
          }
        )

        /*
|--------------------------------------------------------------------------
| Update Cart
|--------------------------------------------------------------------------
*/

        .addCase(
          updateCartItem.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          updateCartItem.fulfilled,
          (
            state,
            action
          ) => {

            state.loading = false;

            state.cartItems =
              normalizeCart(
                action.payload
              );

          }
        )

        .addCase(
          updateCartItem.rejected,
          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload;

          }
        )

        /*
        |--------------------------------------------------------------------------
        | Remove Cart
        |--------------------------------------------------------------------------
        */

        .addCase(
          removeProductFromCart.pending,
          (state) => {
            state.removing = true;
            state.error = null;
          }
        )

        .addCase(
          removeProductFromCart.fulfilled,
          (state, action) => {
            state.removing = false;

            if (action.payload?.cart) {
              state.cartItems = normalizeCart(action.payload.cart);
              return;
            }

            state.cartItems = state.cartItems.filter(
              (item) =>
                item.productId?._id !== action.payload.productId
            );
          }
        )

        .addCase(
          removeProductFromCart.rejected,
          (
            state,
            action
          ) => {
            state.removing = false;

            state.error =
              action.payload;
          }
        );
    },
  });

export const {
  clearCartError,
  clearCart,
} = cartSlice.actions;

/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/

export const selectCartItems = (
  state
) =>
  state.cart?.cartItems ||
  [];

export const selectCartAdding = (
  state
) =>
  state.cart?.adding ||
  false;

export const selectCartCount = (
  state
) =>
  (
    state.cart?.cartItems ||
    []
  ).reduce(
    (
      total,
      item
    ) =>
      total +
      Number(
        item?.quantity || 1
      ),

    0
  );

export const selectCartLoading =
  (state) =>
    state.cart?.loading ||
    false;

export const selectCartRemoving =
  (state) =>
    state.cart?.removing ||
    false;

export default cartSlice.reducer;