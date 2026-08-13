

import axiosInstance from "../config/axiosInstance";
import { CART_ENDPOINTS } from "../constants/endpoints/cartEndpoints";

export const CartService = {
  /*
  |--------------------------------------------------------------------------
  | Get Cart
  |--------------------------------------------------------------------------
  */
  getCart: async () => {
    const response = await axiosInstance.get(
      CART_ENDPOINTS.GET
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Add To Cart
  | Supports Product + Variant
  |--------------------------------------------------------------------------
  */
  addToCart: async ({
    productId,
    quantity = 1,
    variant = null,
  }) => {
    if (!productId) {
      throw new Error("Product ID is required.");
    }

    const response = await axiosInstance.post(
      CART_ENDPOINTS.ADD,
      {
        productId,
        quantity,
        variant,
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
    variantSku = "",
    variant = null,
  }) => {
    if (!productId) {
      throw new Error("Product ID is required.");
    }

    if (!quantity || Number(quantity) < 1) {
      throw new Error("Quantity must be at least 1.");
    }

    const response = await axiosInstance.patch(
      CART_ENDPOINTS.UPDATE,
      {
        productId,
        quantity: Number(quantity),
        variantSku: String(variantSku || "").trim(),
        variant,
      }
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | REMOVE CART ITEM
  |
  | Backend expects:
  | DELETE /cart/remove/:productId?variantSku=SKU
  |--------------------------------------------------------------------------
  */
  removeFromCart: async (
    productId,
    variantSku = ""
  ) => {
    if (!productId) {
      throw new Error("Product ID is required.");
    }

    const cleanProductId = String(productId).trim();
    const cleanVariantSku = String(
      variantSku || ""
    ).trim();

    /*
    |--------------------------------------------------------------------------
    | Build Product Remove URL
    |--------------------------------------------------------------------------
    */
    const endpoint =
      typeof CART_ENDPOINTS.REMOVE === "function"
        ? CART_ENDPOINTS.REMOVE(cleanProductId)
        : `/cart/remove/${cleanProductId}`;

    /*
    |--------------------------------------------------------------------------
    | Query Config for variantSku
    |--------------------------------------------------------------------------
    */
    const config = {};

    if (cleanVariantSku) {
      config.params = {
        variantSku: cleanVariantSku,
      };
    }

    const response = await axiosInstance.delete(
      endpoint,
      config
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Clear Complete Cart
  |--------------------------------------------------------------------------
  */
  clearCart: async () => {
    const response = await axiosInstance.delete(
      CART_ENDPOINTS.CLEAR
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Merge Guest Cart After Login
  |--------------------------------------------------------------------------
  */
  mergeGuestCart: async (payload = {}) => {
    const items = Array.isArray(payload?.items)
      ? payload.items
      : [];

    const response = await axiosInstance.post(
      CART_ENDPOINTS.MERGE || "/cart/merge",
      {
        items,
      }
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Prepare Cart For Logout
  |--------------------------------------------------------------------------
  | Preserves logged-in User.cart into GuestCart MongoDB session cookie.
  |--------------------------------------------------------------------------
  */
  prepareCartForLogout: async () => {
    const response = await axiosInstance.post(
      CART_ENDPOINTS.PREPARE_LOGOUT || "/cart/prepare-logout"
    );

    return response.data;
  },
};

export default CartService;