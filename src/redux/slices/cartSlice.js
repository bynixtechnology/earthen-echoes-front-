import { createSlice } from "@reduxjs/toolkit";

import {
  fetchCart,
  addProductToCart,
  updateCartItem,
  removeProductFromCart,
  mergeGuestCartThunk,
  prepareCartForLogoutThunk,
  clearCart as clearCartThunk,
} from "../thunks/cartThunk";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
  cartItems: [],

  loading: false,

  adding: false,

  removing: false,

  updating: false,

  merging: false,

  clearing: false,

  preparingLogout: false,

  error: null,
};

/*
|--------------------------------------------------------------------------
| Normalize Cart Response
|--------------------------------------------------------------------------
|
| Backend may return:
| { cart: [...] }
| OR:
| { data: { cart: [...] } }
| OR:
| { items: [...] }
|--------------------------------------------------------------------------
*/

const normalizeCart = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.cart)) {
    return payload.cart;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data?.cart)) {
    return payload.data.cart;
  }

  if (Array.isArray(payload?.data?.items)) {
    return payload.data.items;
  }

  return null;
};

/*
|--------------------------------------------------------------------------
| Get Product ID From Cart Item
|--------------------------------------------------------------------------
*/

const getCartProductId = (item) => {
  const productId =
    item?.productId?._id ||
    item?.productId?.id ||
    (typeof item?.productId === "string" ? item.productId : null) ||
    item?._id ||
    item?.id;

  return productId ? String(productId).trim() : "";
};

/*
|--------------------------------------------------------------------------
| Get Variant SKU From Cart Item
|--------------------------------------------------------------------------
*/

const getCartVariantSku = (item) => {
  return String(
    item?.variant?.sku ||
    item?.variantSku ||
    ""
  ).trim();
};

/*
|--------------------------------------------------------------------------
| Create Cart Item Identity
|--------------------------------------------------------------------------
*/

const getCartItemKey = (item) => {
  const productId = getCartProductId(item);
  const variantSku = getCartVariantSku(item);

  return `${productId}__${variantSku}`;
};

/*
|--------------------------------------------------------------------------
| Cart Slice
|--------------------------------------------------------------------------
*/

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    /*
    |--------------------------------------------------------------------------
    | Clear Cart Error
    |--------------------------------------------------------------------------
    */
    clearCartError: (state) => {
      state.error = null;
    },

    /*
    |--------------------------------------------------------------------------
    | Local Clear Cart State (Frontend state reset only)
    |--------------------------------------------------------------------------
    */
    clearCart: (state) => {
      state.cartItems = [];
      state.error = null;
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Async Thunks Extra Reducers
  |--------------------------------------------------------------------------
  */
  extraReducers: (builder) => {
    builder

      /*
      |--------------------------------------------------------------------------
      | FETCH CART
      |--------------------------------------------------------------------------
      */
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const normalized = normalizeCart(action.payload);
        state.cartItems = normalized || [];
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch cart.";
      })

      /*
      |--------------------------------------------------------------------------
      | ADD TO CART
      |--------------------------------------------------------------------------
      */
      .addCase(addProductToCart.pending, (state) => {
        state.adding = true;
        state.error = null;
      })

      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.adding = false;
        const normalized = normalizeCart(action.payload);
        if (normalized !== null) {
          state.cartItems = normalized;
        }
      })

      .addCase(addProductToCart.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload || "Unable to add product to cart.";
      })

      /*
      |--------------------------------------------------------------------------
      | UPDATE CART ITEM
      |--------------------------------------------------------------------------
      */
      .addCase(updateCartItem.pending, (state) => {
        state.updating = true;
        state.error = null;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.updating = false;
        const normalized = normalizeCart(action.payload);
        if (normalized !== null) {
          state.cartItems = normalized;
        }
      })

      .addCase(updateCartItem.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Unable to update cart item.";
      })

      /*
      |--------------------------------------------------------------------------
      | REMOVE PRODUCT FROM CART
      |--------------------------------------------------------------------------
      */
      .addCase(removeProductFromCart.pending, (state) => {
        state.removing = true;
        state.error = null;
      })

      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        state.removing = false;

        // Preferred: Server returned fresh updated cart
        const normalized = normalizeCart(action.payload);

        if (normalized !== null) {
          state.cartItems = normalized;
          return;
        }

        // Fallback: Local optimistic filter if server returns payload meta
        const targetProductId = action.payload?.productId
          ? String(action.payload.productId).trim()
          : "";

        const targetVariantSku = String(
          action.payload?.variantSku || ""
        ).trim();

        state.cartItems = state.cartItems.filter((item) => {
          const itemProductId = getCartProductId(item);
          const itemVariantSku = getCartVariantSku(item);

          if (targetVariantSku) {
            return !(
              itemProductId === targetProductId &&
              itemVariantSku === targetVariantSku
            );
          }

          return itemProductId !== targetProductId;
        });
      })

      .addCase(removeProductFromCart.rejected, (state, action) => {
        state.removing = false;
        state.error = action.payload || "Unable to remove product from cart.";
      })

      /*
      |--------------------------------------------------------------------------
      | MERGE GUEST CART AFTER LOGIN
      |--------------------------------------------------------------------------
      */
      .addCase(mergeGuestCartThunk.pending, (state) => {
        state.merging = true;
        state.error = null;
      })

      .addCase(mergeGuestCartThunk.fulfilled, (state, action) => {
        state.merging = false;
        const normalized = normalizeCart(action.payload);
        if (normalized !== null) {
          state.cartItems = normalized;
        }
      })

      .addCase(mergeGuestCartThunk.rejected, (state, action) => {
        state.merging = false;
        state.error = action.payload || "Unable to merge guest cart.";
      })

      /*
      |--------------------------------------------------------------------------
      | PREPARE CART FOR LOGOUT
      |--------------------------------------------------------------------------
      */
      .addCase(prepareCartForLogoutThunk.pending, (state) => {
        state.preparingLogout = true;
        state.error = null;
      })

      .addCase(prepareCartForLogoutThunk.fulfilled, (state, action) => {
        state.preparingLogout = false;
        const normalized = normalizeCart(action.payload);
        if (normalized !== null) {
          state.cartItems = normalized;
        }
      })

      .addCase(prepareCartForLogoutThunk.rejected, (state, action) => {
        state.preparingLogout = false;
        state.error = action.payload || "Unable to prepare cart for logout.";
      })

      /*
      |--------------------------------------------------------------------------
      | CLEAR CART FROM SERVER
      |--------------------------------------------------------------------------
      */
      .addCase(clearCartThunk.pending, (state) => {
        state.clearing = true;
        state.error = null;
      })

      .addCase(clearCartThunk.fulfilled, (state) => {
        state.clearing = false;
        state.cartItems = [];
      })

      .addCase(clearCartThunk.rejected, (state, action) => {
        state.clearing = false;
        state.error = action.payload || "Unable to clear cart.";
      });
  },
});

/*
|--------------------------------------------------------------------------
| Actions Export
|--------------------------------------------------------------------------
*/

export const { clearCartError, clearCart } = cartSlice.actions;

/*
|--------------------------------------------------------------------------
| Selectors Export
|--------------------------------------------------------------------------
*/

export const selectCartItems = (state) => state.cart?.cartItems || [];

export const selectCartUniqueCount = (state) =>
  state.cart?.cartItems?.length || 0;

export const selectCartCount = (state) => {
  const items = state.cart?.cartItems || [];
  return items.reduce((total, item) => {
    return total + (Number(item?.quantity) || 1);
  }, 0);
};

export const selectCartLoading = (state) => state.cart?.loading || false;

export const selectCartAdding = (state) => state.cart?.adding || false;

export const selectCartUpdating = (state) => state.cart?.updating || false;

export const selectCartRemoving = (state) => state.cart?.removing || false;

export const selectCartMerging = (state) => state.cart?.merging || false;

export const selectCartClearing = (state) => state.cart?.clearing || false;

export const selectCartPreparingLogout = (state) =>
  state.cart?.preparingLogout || false;

export const selectCartError = (state) => state.cart?.error || null;

export const selectCartItemKey = (item) => getCartItemKey(item);

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default cartSlice.reducer;