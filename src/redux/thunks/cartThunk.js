import {
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  CartService,
} from "../../services/cartService";

const getErrorMessage = (
  error,
  fallback
) =>
  error?.response?.data
    ?.message ||
  error?.message ||
  fallback;

/*
|--------------------------------------------------------------------------
| Get Cart
|--------------------------------------------------------------------------
*/

export const fetchCart =
  createAsyncThunk(
    "cart/fetchCart",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await CartService.getCart();

        return (
          response?.data?.cart ||
          response?.cart ||
          response?.data ||
          []
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch cart."
          )
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Add To Cart
|--------------------------------------------------------------------------
*/

export const addProductToCart =
  createAsyncThunk(
    "cart/addProductToCart",

    async (
      {
        productId,
        quantity,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await CartService.addToCart(
            {
              productId,
              quantity,
            }
          );

        return (
          response?.data?.cart ||
          response?.cart ||
          response?.data ||
          []
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to add product to cart."
          )
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Remove From Cart
|--------------------------------------------------------------------------
*/

export const removeProductFromCart =
  createAsyncThunk(
    "cart/removeProductFromCart",

    async (
      productId,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await CartService.removeFromCart(
            productId
          );

        return {
          productId,

          cart:
            response?.data
              ?.cart ||
            response?.cart ||
            response?.data ||
            null,
        };
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to remove product from cart."
          )
        );
      }
    }
  );