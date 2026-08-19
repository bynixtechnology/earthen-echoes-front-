export const USER_AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",

  REGISTER: "/auth/register",

  // Agar backend me Google route nahi hai to isko use mat karo
  GOOGLE_LOGIN: "/auth/google",

  // Get All Users (Admin / User List)
  ALL_USERS: "/user/all",

  // User Profile
  PROFILE: "/user/profile",

  // Update Profile
  UPDATE_PROFILE: "/user/profile",

  // Change Password
  CHANGE_PASSWORD: "/user/change-password",

  // Orders
  ORDERS: "/user/orders",
  ORDER_DETAILS: (id) => `/user/orders/${id}`,

  // Cart
  CART: "/user/cart",

  // Wishlist
  WISHLIST: "/user/wishlist",
};