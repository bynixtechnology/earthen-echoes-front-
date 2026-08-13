import { createAsyncThunk } from "@reduxjs/toolkit";
import wishlistService from "../../services/wishlistService";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

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
      console.error("FETCH WISHLIST ERROR:", error?.response?.data || error);
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to fetch wishlist.")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Toggle Wishlist (Add / Remove)
|--------------------------------------------------------------------------
*/
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (productId, thunkAPI) => {
    try {
      return await wishlistService.toggleWishlist(productId);
    } catch (error) {
      console.error("TOGGLE WISHLIST ERROR:", error?.response?.data || error);
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to update wishlist.")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Remove Single Item From Wishlist
|--------------------------------------------------------------------------
*/
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, thunkAPI) => {
    try {
      return await wishlistService.removeFromWishlist(productId);
    } catch (error) {
      console.error("REMOVE WISHLIST ERROR:", error?.response?.data || error);
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to remove item from wishlist.")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Merge Guest Wishlist After Login
|--------------------------------------------------------------------------
*/
export const mergeGuestWishlistThunk = createAsyncThunk(
  "wishlist/mergeGuestWishlist",
  async (_, thunkAPI) => {
    try {
      console.log("💖 Starting guest wishlist merge...");
      const response = await wishlistService.mergeGuestWishlist();
      window.dispatchEvent(new Event("wishlistUpdated"));
      return response;
    } catch (error) {
      console.error("MERGE WISHLIST ERROR:", error?.response?.data || error);
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to merge guest wishlist.")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Prepare Wishlist For Logout
|--------------------------------------------------------------------------
| Preserves user wishlist to guest session cookie before logging out.
|--------------------------------------------------------------------------
*/
export const prepareWishlistForLogoutThunk = createAsyncThunk(
  "wishlist/prepareWishlistForLogout",
  async (_, thunkAPI) => {
    try {
      console.log("🔒 Preparing wishlist for logout...");
      const response = await wishlistService.prepareWishlistForLogout();
      window.dispatchEvent(new Event("wishlistUpdated"));
      return response;
    } catch (error) {
      console.error("PREPARE LOGOUT WISHLIST ERROR:", error?.response?.data || error);
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to prepare wishlist for logout.")
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
      const response = await wishlistService.clearWishlist();
      window.dispatchEvent(new Event("wishlistUpdated"));
      return response;
    } catch (error) {
      console.error("CLEAR WISHLIST ERROR:", error?.response?.data || error);
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to clear wishlist.")
      );
    }
  }
);