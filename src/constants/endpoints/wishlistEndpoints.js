// src/constants/endpoints/wishlistEndpoints.js

export const WISHLIST_ENDPOINTS = {
  // GET Logged In / Guest Wishlist
  GET: "/wishlist",

  // Add / Remove Product (Toggle)
  TOGGLE: "/wishlist/toggle",

  // Remove Single Product From Wishlist
  REMOVE: (productId) => `/wishlist/remove/${productId}`,

  // Clear Complete Wishlist
  CLEAR: "/wishlist/clear",

  // Merge Guest Wishlist After Login
  MERGE: "/wishlist/merge",

  // Prepare Wishlist Session Before Logout
  PREPARE_LOGOUT: "/wishlist/prepare-logout",
};

export default WISHLIST_ENDPOINTS;