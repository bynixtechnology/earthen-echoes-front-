import { createAsyncThunk } from "@reduxjs/toolkit";
import { CartService } from "../../services/cartService";

/*
|--------------------------------------------------------------------------
| Common Error Message Helper
|--------------------------------------------------------------------------
*/

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;


/*
|--------------------------------------------------------------------------
| GET CART
|--------------------------------------------------------------------------
|
| Works for:
|
| Guest:
|   guestSessionId cookie
|       ↓
|   GuestCart
|
| Logged-in:
|   JWT
|       ↓
|   User.cart
|
|--------------------------------------------------------------------------
*/

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",

  async (_, { rejectWithValue }) => {
    try {
      const response = await CartService.getCart();

      return response;
    } catch (error) {
      console.error(
        "FETCH CART ERROR:",
        error?.response?.data || error
      );

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
| ADD PRODUCT TO CART
|--------------------------------------------------------------------------
|
| Supports:
|
| - Guest user
| - Logged-in user
| - Product variants
| - Color
| - SKU
| - Quantity
|
|--------------------------------------------------------------------------
*/

export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",

  async (
    {
      productId,
      quantity = 1,
      variant = null,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await CartService.addToCart({
        productId,
        quantity,
        variant,
      });

      return response;
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error?.response?.data || error
      );

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
| REMOVE PRODUCT FROM CART
|--------------------------------------------------------------------------
|
| Payload:
|
| {
|   productId,
|   variantSku
| }
|
|--------------------------------------------------------------------------
*/

export const removeProductFromCart = createAsyncThunk(
  "cart/removeProductFromCart",

  async (payload, { rejectWithValue }) => {
    const productId =
      typeof payload === "object"
        ? payload.productId
        : payload;

    const variantSku =
      typeof payload === "object"
        ? payload.variantSku || ""
        : "";

    try {
      if (!productId) {
        return rejectWithValue(
          "Product ID is required."
        );
      }

      const cleanProductId = String(productId).trim();
      const cleanVariantSku = String(
        variantSku || ""
      ).trim();

      const response = await CartService.removeFromCart(
        cleanProductId,
        cleanVariantSku
      );

      const freshCart =
        Array.isArray(response?.cart)
          ? response.cart
          : Array.isArray(response?.data?.cart)
            ? response.data.cart
            : Array.isArray(response?.items)
              ? response.items
              : Array.isArray(response?.data)
                ? response.data
                : null;

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      return {
        productId: cleanProductId,
        variantSku: cleanVariantSku,
        cart: freshCart,
        totalItems:
          response?.totalItems ??
          freshCart?.reduce(
            (total, item) =>
              total + (Number(item?.quantity) || 1),
            0
          ) ??
          0,
        totalAmount: response?.totalAmount ?? 0,
        response,
      };
    } catch (error) {
      console.error(
        "REMOVE CART ITEM ERROR:",
        error?.response?.data || error
      );

      return rejectWithValue(
        getErrorMessage(
          error,
          "Unable to remove product from cart."
        )
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| UPDATE CART ITEM QUANTITY
|--------------------------------------------------------------------------
|
| Supports:
|
| - Guest cart
| - User cart
| - Variant SKU
|
|--------------------------------------------------------------------------
*/

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",

  async (
    {
      productId,
      quantity,
      variantSku = "",
      variant = null,
    },
    { rejectWithValue }
  ) => {
    try {
      if (!productId) {
        return rejectWithValue(
          "Product ID is required."
        );
      }

      if (
        !Number.isInteger(Number(quantity)) ||
        Number(quantity) < 1
      ) {
        return rejectWithValue(
          "Quantity must be at least 1."
        );
      }

      const response = await CartService.updateCartItem({
        productId,
        quantity: Number(quantity),
        variantSku,
        variant,
      });

      return response;
    } catch (error) {
      console.error(
        "UPDATE CART ITEM ERROR:",
        error?.response?.data || error
      );

      return rejectWithValue(
        getErrorMessage(
          error,
          "Unable to update cart item."
        )
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| MERGE GUEST CART AFTER LOGIN
|--------------------------------------------------------------------------
*/

export const mergeGuestCartThunk = createAsyncThunk(
  "cart/mergeGuestCart",

  async (_, { rejectWithValue }) => {
    try {
      console.log("🛒 Starting guest cart merge...");

      const response = await CartService.mergeGuestCart();

      console.log("✅ Guest cart merge response:", response);

      localStorage.removeItem("guest_cart");
      localStorage.removeItem("guestCart");

      window.dispatchEvent(new Event("cartUpdated"));

      return response;
    } catch (error) {
      console.error(
        "❌ GUEST CART MERGE ERROR:",
        error?.response?.data || error
      );

      return rejectWithValue(
        getErrorMessage(
          error,
          "Unable to merge guest cart."
        )
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| PREPARE CART FOR LOGOUT
|--------------------------------------------------------------------------
|
| Preserves User.cart into GuestCart session cookie before logging out.
|
|--------------------------------------------------------------------------
*/

export const prepareCartForLogoutThunk = createAsyncThunk(
  "cart/prepareCartForLogout",

  async (_, { rejectWithValue }) => {
    try {
      console.log("🔒 Preparing cart for logout...");

      const response = await CartService.prepareCartForLogout();

      window.dispatchEvent(new Event("cartUpdated"));

      return response;
    } catch (error) {
      console.error(
        "PREPARE LOGOUT CART ERROR:",
        error?.response?.data || error
      );

      return rejectWithValue(
        getErrorMessage(
          error,
          "Unable to prepare cart for logout."
        )
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| CLEAR CART
|--------------------------------------------------------------------------
*/

export const clearCart = createAsyncThunk(
  "cart/clearCart",

  async (_, { rejectWithValue }) => {
    try {
      const response = await CartService.clearCart();

      localStorage.removeItem("guest_cart");
      localStorage.removeItem("guestCart");

      window.dispatchEvent(new Event("cartUpdated"));

      return response;
    } catch (error) {
      console.error(
        "CLEAR CART ERROR:",
        error?.response?.data || error
      );

      return rejectWithValue(
        getErrorMessage(
          error,
          "Unable to clear cart."
        )
      );
    }
  }
);