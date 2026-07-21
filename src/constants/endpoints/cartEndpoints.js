export const CART_ENDPOINTS = {
  GET: "/users/cart",

  ADD: "/users/cart",

  UPDATE: (productId) =>
    `/users/cart/${productId}`,

  REMOVE: (productId) =>
    `/users/cart/${productId}`,

  CLEAR: "/users/cart",
};