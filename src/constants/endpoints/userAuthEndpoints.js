export const USER_AUTH_ENDPOINTS = {
  /*
  |--------------------------------------------------------------------------
  | AUTHENTICATION ENDPOINTS
  |--------------------------------------------------------------------------
  */
  LOGIN: "/user/login",
  REGISTER: "/user/register",
  GOOGLE_LOGIN: "/user/google",

  /*
  |--------------------------------------------------------------------------
  | USER PROFILE & ACCOUNT ENDPOINTS
  |--------------------------------------------------------------------------
  */
  PROFILE: "/user/profile",
  UPDATE_PROFILE: "/user/profile",
  CHANGE_PASSWORD: "/user/change-password",

  /*
  |--------------------------------------------------------------------------
  | USER ORDERS ENDPOINTS
  |--------------------------------------------------------------------------
  */
  ORDERS: "/user/orders",
  ORDER_DETAILS: (id) => `/user/orders/${id}`,

  /*
  |--------------------------------------------------------------------------
  | USER CART & WISHLIST ENDPOINTS
  |--------------------------------------------------------------------------
  */
  CART: "/user/cart",
  WISHLIST: "/user/wishlist",

  /*
  |--------------------------------------------------------------------------
  | ADMIN MANAGEMENT, DASHBOARD & ORDER TRACKING ENDPOINTS
  |--------------------------------------------------------------------------
  */
  // Admin Dashboard Summary Stats & Analytics
  ADMIN_DASHBOARD_STATS: "/user/admin/dashboard-stats",

  // All Users List
  ALL_USERS: "/user/all",

  // Admin Orders List & Search/Filter
  ADMIN_ORDERS: "/user/admin/orders",

  // Admin Single Order Breakdown
  ADMIN_ORDER_DETAILS: (id) => `/user/admin/orders/${id}`,

  // Admin Update Delivery/Tracking Status
  ADMIN_UPDATE_ORDER_STATUS: (id) => `/user/admin/orders/${id}/status`,

  // Admin Delete Order
  ADMIN_DELETE_ORDER: (id) => `/user/admin/orders/${id}`,
};

export default USER_AUTH_ENDPOINTS;