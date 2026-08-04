import { createSlice } from "@reduxjs/toolkit";

import {
  getWishlist,
  toggleWishlist,
  clearWishlist,
} from "../thunks/wishlistThunk";

const initialState = {
  items: [],
  totalItems: 0,
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    resetWishlist: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      /*
      |--------------------------------------------------------------------------
      | Get Wishlist
      |--------------------------------------------------------------------------
      */

      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        getWishlist.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items =
            action.payload?.wishlist || [];

          state.totalItems =
            action.payload?.totalItems || 0;
        }
      )

      .addCase(
        getWishlist.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      /*
      |--------------------------------------------------------------------------
      | Toggle Wishlist
      |--------------------------------------------------------------------------
      */

      .addCase(
        toggleWishlist.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        toggleWishlist.fulfilled,
        (state, action) => {
          state.loading = false;

          state.items =
            action.payload?.wishlist || [];

          state.totalItems =
            action.payload?.totalItems || 0;
        }
      )

      .addCase(
        toggleWishlist.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      /*
      |--------------------------------------------------------------------------
      | Clear Wishlist
      |--------------------------------------------------------------------------
      */

      .addCase(
        clearWishlist.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        clearWishlist.fulfilled,
        (state) => {
          state.loading = false;
          state.items = [];
          state.totalItems = 0;
        }
      )

      .addCase(
        clearWishlist.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  resetWishlist,
} = wishlistSlice.actions;

/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/

export const selectWishlistItems = (
  state
) => state.wishlist.items;

export const selectWishlistLoading = (
  state
) => state.wishlist.loading;

export const selectWishlistTotalItems = (
  state
) => state.wishlist.totalItems;

export const selectWishlistError = (
  state
) => state.wishlist.error;

export default wishlistSlice.reducer;