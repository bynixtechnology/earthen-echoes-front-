export const CART_ENDPOINTS = {
  // GET Logged In User Cart
  GET: "/cart",

  // Add Product
  ADD: "/cart/add",

  // Update Product Quantity
  UPDATE: "/cart/update",

  // Remove Product
  REMOVE: (productId) =>
    `/cart/remove/${productId}`,

  // Clear Complete Cart
  CLEAR: "/cart/clear",

  // Merge Guest Cart
  MERGE: "/cart/merge",
};