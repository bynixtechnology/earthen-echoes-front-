import axiosInstance from "../config/axiosInstance";

import {
  CART_ENDPOINTS,
} from "../constants/endpoints/cartEndpoints";

export const CartService = {
  /*
  |--------------------------------------------------------------------------
  | Get Cart
  |--------------------------------------------------------------------------
  */

  getCart: async () => {
    const response =
      await axiosInstance.get(
        CART_ENDPOINTS.GET
      );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Add To Cart
  |--------------------------------------------------------------------------
  */

  addToCart: async ({
    productId,
    quantity = 1,
  }) => {
    if (!productId) {
      throw new Error(
        "Product ID is required."
      );
    }

    const response =
      await axiosInstance.post(
        CART_ENDPOINTS.ADD,
        {
          productId,
          quantity,
        }
      );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Update Cart Item Quantity
  |--------------------------------------------------------------------------
  */

  updateCartItem: async ({
    productId,
    quantity,
  }) => {
    if (!productId) {
      throw new Error(
        "Product ID is required."
      );
    }

    const response =
      await axiosInstance.patch(
        CART_ENDPOINTS.UPDATE,
        {
          productId,
          quantity,
        }
      );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Remove Cart Item
  |--------------------------------------------------------------------------
  */

  removeFromCart: async (
    productId
  ) => {
    if (!productId) {
      throw new Error(
        "Product ID is required."
      );
    }

    const response =
      await axiosInstance.delete(
        CART_ENDPOINTS.REMOVE(
          productId
        )
      );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Clear Cart
  |--------------------------------------------------------------------------
  */

  clearCart: async () => {
    const response =
      await axiosInstance.delete(
        CART_ENDPOINTS.CLEAR
      );

    return response.data;
  },
};