/*
|--------------------------------------------------------------------------
| CART API ENDPOINTS
|--------------------------------------------------------------------------
*/

export const CART_ENDPOINTS = {
  // 1. Get Logged-In / Guest Cart Session
  GET: "/cart",

  // 2. Add Product To Cart (Supports Color Variants)
  ADD: "/cart/add",

  // 3. Update Cart Item Quantity
  UPDATE: "/cart/update",

  // 4. Remove Single Cart Item (By Product ID & Variant SKU)
  REMOVE: (productId) => `/cart/remove/${productId}`,
  ITEM: (productId) => `/cart/item/${productId}`,

  // 5. Clear Complete Cart
  CLEAR: "/cart/clear",

  // 6. Merge Guest Cart (After Login/Register)
  MERGE: "/cart/merge",
};

export default CART_ENDPOINTS;