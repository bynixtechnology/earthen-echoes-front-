import { createSlice } from "@reduxjs/toolkit";

import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
  mergeGuestWishlistThunk,
  prepareWishlistForLogoutThunk,
  clearWishlist,
} from "../thunks/wishlistThunk";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
  items: [],
  totalItems: 0,
  loading: false,
  toggling: false,
  removing: false,
  merging: false,
  preparingLogout: false,
  error: null,
};

/*
|--------------------------------------------------------------------------
| Normalize Wishlist Helper
|--------------------------------------------------------------------------
*/

const normalizeWishlistResponse = (payload) => {
  if (Array.isArray(payload)) {
    return { items: payload, totalItems: payload.length };
  }

  const items =
    payload?.wishlist ||
    payload?.items ||
    payload?.data?.wishlist ||
    payload?.data?.items ||
    [];

  const totalItems =
    payload?.totalItems ??
    payload?.data?.totalItems ??
    items.length;

  return { items, totalItems };
};

/*
|--------------------------------------------------------------------------
| Wishlist Slice
|--------------------------------------------------------------------------
*/

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    resetWishlist: () => initialState,

    clearWishlistError: (state) => {
      state.error = null;
    },
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

      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const { items, totalItems } = normalizeWishlistResponse(action.payload);
        state.items = items;
        state.totalItems = totalItems;
      })

      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch wishlist.";
      })

      /*
      |--------------------------------------------------------------------------
      | Toggle Wishlist
      |--------------------------------------------------------------------------
      */

      .addCase(toggleWishlist.pending, (state) => {
        state.toggling = true;
        state.error = null;
      })

      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.toggling = false;
        const { items, totalItems } = normalizeWishlistResponse(action.payload);
        state.items = items;
        state.totalItems = totalItems;
      })

      .addCase(toggleWishlist.rejected, (state, action) => {
        state.toggling = false;
        state.error = action.payload || "Failed to update wishlist.";
      })

      /*
      |--------------------------------------------------------------------------
      | Remove Single Product From Wishlist
      |--------------------------------------------------------------------------
      */

      .addCase(removeFromWishlist.pending, (state) => {
        state.removing = true;
        state.error = null;
      })

      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.removing = false;
        const { items, totalItems } = normalizeWishlistResponse(action.payload);
        state.items = items;
        state.totalItems = totalItems;
      })

      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.removing = false;
        state.error = action.payload || "Failed to remove item from wishlist.";
      })

      /*
      |--------------------------------------------------------------------------
      | Merge Guest Wishlist After Login
      |--------------------------------------------------------------------------
      */

      .addCase(mergeGuestWishlistThunk.pending, (state) => {
        state.merging = true;
        state.error = null;
      })

      .addCase(mergeGuestWishlistThunk.fulfilled, (state, action) => {
        state.merging = false;
        const { items, totalItems } = normalizeWishlistResponse(action.payload);
        state.items = items;
        state.totalItems = totalItems;
      })

      .addCase(mergeGuestWishlistThunk.rejected, (state, action) => {
        state.merging = false;
        state.error = action.payload || "Failed to merge guest wishlist.";
      })

      /*
      |--------------------------------------------------------------------------
      | Prepare Wishlist For Logout
      |--------------------------------------------------------------------------
      */

      .addCase(prepareWishlistForLogoutThunk.pending, (state) => {
        state.preparingLogout = true;
        state.error = null;
      })

      .addCase(prepareWishlistForLogoutThunk.fulfilled, (state, action) => {
        state.preparingLogout = false;
        const { items, totalItems } = normalizeWishlistResponse(action.payload);
        state.items = items;
        state.totalItems = totalItems;
      })

      .addCase(prepareWishlistForLogoutThunk.rejected, (state, action) => {
        state.preparingLogout = false;
        state.error = action.payload || "Failed to prepare wishlist for logout.";
      })

      /*
      |--------------------------------------------------------------------------
      | Clear Wishlist
      |--------------------------------------------------------------------------
      */

      .addCase(clearWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(clearWishlist.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalItems = 0;
      })

      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to clear wishlist.";
      });
  },
});

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

export const { resetWishlist, clearWishlistError } = wishlistSlice.actions;

/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/

export const selectWishlistItems = (state) =>
  state.wishlist?.items || [];

export const selectWishlistLoading = (state) =>
  state.wishlist?.loading || false;

export const selectWishlistToggling = (state) =>
  state.wishlist?.toggling || false;

export const selectWishlistRemoving = (state) =>
  state.wishlist?.removing || false;

export const selectWishlistMerging = (state) =>
  state.wishlist?.merging || false;

export const selectWishlistPreparingLogout = (state) =>
  state.wishlist?.preparingLogout || false;

export const selectWishlistTotalItems = (state) =>
  state.wishlist?.totalItems || 0;

export const selectWishlistError = (state) =>
  state.wishlist?.error || null;

export default wishlistSlice.reducer;