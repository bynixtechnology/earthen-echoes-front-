import { createAsyncThunk } from "@reduxjs/toolkit";
import wishlistService from "../../services/wishlistService";

/*
|--------------------------------------------------------------------------
| Get Wishlist
|--------------------------------------------------------------------------
*/

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, thunkAPI) => {
    try {
      return await wishlistService.getWishlist();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch wishlist."
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Toggle Wishlist
|--------------------------------------------------------------------------
*/

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (productId, thunkAPI) => {
    try {
      return await wishlistService.toggleWishlist(
        productId
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to update wishlist."
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Clear Wishlist
|--------------------------------------------------------------------------
*/

export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, thunkAPI) => {
    try {
      return await wishlistService.clearWishlist();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to clear wishlist."
      );
    }
  }
);