import { createSlice } from "@reduxjs/toolkit";

import {
  registerUser,
  loginUser,
  googleLoginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  fetchAllUsers,
  // Customer Order Thunks
  fetchMyOrders,
  fetchOrderDetails,
  // Admin Order & Dashboard Thunks
  fetchAdminDashboardStats,
  fetchAllOrdersAdmin,
  fetchAdminOrderDetails,
  updateOrderStatusAdmin,
  deleteOrderAdmin,
} from "../thunks/userAuthThunk";

/*
|--------------------------------------------------------------------------
| Storage Keys
|--------------------------------------------------------------------------
*/

const USER_TOKEN_KEY = "userToken";
const USER_DATA_KEY = "userData";
const GOOGLE_PROMPT_KEY = "googleSignupPromptClosed";

/*
|--------------------------------------------------------------------------
| Clear Stored User Authentication
|--------------------------------------------------------------------------
*/

const clearStoredUserAuth = () => {
  localStorage.removeItem(USER_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

/*
|--------------------------------------------------------------------------
| Restore User Authentication
|--------------------------------------------------------------------------
*/

const getStoredUserAuth = () => {
  try {
    const token = localStorage.getItem(USER_TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_DATA_KEY);

    if (!token || !savedUser) {
      return { token: null, user: null };
    }

    const user = JSON.parse(savedUser);

    if (!user || typeof user !== "object") {
      clearStoredUserAuth();
      return { token: null, user: null };
    }

    if (user?.role?.toLowerCase() === "admin") {
      clearStoredUserAuth();
      return { token: null, user: null };
    }

    return {
      token,
      user: {
        ...user,
        role: user?.role || "user",
      },
    };
  } catch (error) {
    console.error("RESTORE USER AUTH ERROR:", error);
    clearStoredUserAuth();
    return { token: null, user: null };
  }
};

const storedAuth = getStoredUserAuth();

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
  user: storedAuth.user,
  token: storedAuth.token,
  isAuthenticated: Boolean(storedAuth.token && storedAuth.user),
  loading: false,
  googleLoading: false,
  authInitialized: true,
  error: null,

  // All Users List State
  allUsers: [],
  usersLoading: false,
  usersError: null,

  // Customer Orders State
  myOrders: [],
  myOrdersLoading: false,
  myOrdersError: null,

  // Single Order Details State (Customer & Admin)
  selectedOrder: null,
  orderLoading: false,
  orderError: null,

  // Admin Dashboard Stats & Recent Activities State
  adminDashboardStats: {
    counts: {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
      statusBreakdown: {
        Processing: 0,
        Shipped: 0,
        Delivered: 0,
        Cancelled: 0,
      },
    },
    recentActivities: {
      recentProducts: [],
      recentOrders: [],
      recentUsers: [],
      lowStockAlerts: [],
    },
  },
  adminDashboardLoading: false,
  adminDashboardError: null,

  // Admin Orders Management State
  adminOrders: [],
  adminOrdersTotal: 0,
  adminOrdersPages: 1,
  adminOrdersCurrentPage: 1,
  adminOrdersAnalytics: {
    totalRevenue: 0,
    totalOrdersCount: 0,
    processingCount: 0,
    shippedCount: 0,
    deliveredCount: 0,
  },
  adminOrdersLoading: false,
  adminOrdersError: null,
  adminOrderUpdating: false,
};

/*
|--------------------------------------------------------------------------
| Reset Authentication State
|--------------------------------------------------------------------------
*/

const resetAuthState = (state) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  state.loading = false;
  state.googleLoading = false;
  state.error = null;
};

/*
|--------------------------------------------------------------------------
| Save Authentication
|--------------------------------------------------------------------------
*/

const saveUserAuth = (state, action) => {
  const token = action.payload?.token;
  const user = action.payload?.user;

  if (!token || !user) {
    resetAuthState(state);
    clearStoredUserAuth();
    state.error = "Invalid authentication response.";
    return;
  }

  if (user?.role?.toLowerCase() === "admin") {
    resetAuthState(state);
    clearStoredUserAuth();
    state.error = "Admin accounts cannot use the customer portal.";
    return;
  }

  const normalizedUser = {
    ...user,
    role: user?.role || "user",
  };

  state.loading = false;
  state.googleLoading = false;
  state.user = normalizedUser;
  state.token = token;
  state.isAuthenticated = true;
  state.authInitialized = true;
  state.error = null;

  localStorage.setItem(USER_TOKEN_KEY, token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(normalizedUser));
  localStorage.setItem(GOOGLE_PROMPT_KEY, "true");
};

/*
|--------------------------------------------------------------------------
| User Auth Slice
|--------------------------------------------------------------------------
*/

const userAuthSlice = createSlice({
  name: "userAuth",

  initialState,

  reducers: {
    clearUserAuthError: (state) => {
      state.error = null;
    },

    clearUsersError: (state) => {
      state.usersError = null;
    },

    clearOrdersError: (state) => {
      state.myOrdersError = null;
      state.orderError = null;
      state.adminOrdersError = null;
      state.adminDashboardError = null;
    },

    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },

    logoutUser: (state) => {
      resetAuthState(state);
      state.allUsers = [];
      state.usersLoading = false;
      state.usersError = null;
      state.myOrders = [];
      state.myOrdersLoading = false;
      state.myOrdersError = null;
      state.selectedOrder = null;
      state.adminOrders = [];
      state.adminDashboardStats = initialState.adminDashboardStats;
      state.authInitialized = true;
      clearStoredUserAuth();

      window.dispatchEvent(new Event("userAuthChanged"));
    },

    setUserAuth: (state, action) => {
      saveUserAuth(state, action);
    },

    updateCurrentUser: (state, action) => {
      if (!state.user) return;

      const updatedUser = {
        ...state.user,
        ...action.payload,
      };

      if (updatedUser?.role?.toLowerCase() === "admin") {
        updatedUser.role = state.user?.role || "user";
      }

      state.user = updatedUser;
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    },
  },

  extraReducers: (builder) => {
    builder
      /*
      |--------------------------------------------------------------------------
      | REGISTER USER
      |--------------------------------------------------------------------------
      */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.googleLoading = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        saveUserAuth(state, action);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || "Registration failed.";
      })

      /*
      |--------------------------------------------------------------------------
      | LOGIN USER
      |--------------------------------------------------------------------------
      */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.googleLoading = false;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        saveUserAuth(state, action);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Login failed.";
      })

      /*
      |--------------------------------------------------------------------------
      | GOOGLE LOGIN
      |--------------------------------------------------------------------------
      */
      .addCase(googleLoginUser.pending, (state) => {
        state.googleLoading = true;
        state.error = null;
      })
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        saveUserAuth(state, action);
      })
      .addCase(googleLoginUser.rejected, (state, action) => {
        state.googleLoading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Google authentication failed.";
      })

      /*
      |--------------------------------------------------------------------------
      | GET USER PROFILE
      |--------------------------------------------------------------------------
      */
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = {
            ...state.user,
            ...action.payload,
          };
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(state.user));
        }
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || "Unable to fetch profile.";
      })

      /*
      |--------------------------------------------------------------------------
      | UPDATE PROFILE
      |--------------------------------------------------------------------------
      */
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = {
            ...state.user,
            ...action.payload,
          };
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(state.user));
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Unable to update profile.";
      })

      /*
      |--------------------------------------------------------------------------
      | CHANGE PASSWORD
      |--------------------------------------------------------------------------
      */
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Unable to change password.";
      })

      /*
      |--------------------------------------------------------------------------
      | FETCH ALL USERS (ADMIN)
      |--------------------------------------------------------------------------
      */
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.allUsers = action.payload || [];
        state.usersError = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError =
          action.payload ||
          action.error?.message ||
          "Failed to fetch users list.";
      })

      /*
      |--------------------------------------------------------------------------
      | FETCH MY ORDERS (CUSTOMER)
      |--------------------------------------------------------------------------
      */
      .addCase(fetchMyOrders.pending, (state) => {
        state.myOrdersLoading = true;
        state.myOrdersError = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrders = action.payload || [];
        state.myOrdersError = null;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrdersError =
          action.payload || action.error?.message || "Failed to fetch orders.";
      })

      /*
      |--------------------------------------------------------------------------
      | FETCH ORDER DETAILS (CUSTOMER & ADMIN)
      |--------------------------------------------------------------------------
      */
      .addCase(fetchOrderDetails.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.selectedOrder = action.payload || null;
        state.orderError = null;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError =
          action.payload || action.error?.message || "Failed to fetch order details.";
      })

      /*
      |--------------------------------------------------------------------------
      | FETCH ADMIN DASHBOARD STATS
      |--------------------------------------------------------------------------
      */
      .addCase(fetchAdminDashboardStats.pending, (state) => {
        state.adminDashboardLoading = true;
        state.adminDashboardError = null;
      })
      .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
        state.adminDashboardLoading = false;
        state.adminDashboardStats = {
          counts: action.payload?.counts || initialState.adminDashboardStats.counts,
          recentActivities:
            action.payload?.recentActivities ||
            initialState.adminDashboardStats.recentActivities,
        };
        state.adminDashboardError = null;
      })
      .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
        state.adminDashboardLoading = false;
        state.adminDashboardError =
          action.payload ||
          action.error?.message ||
          "Failed to fetch dashboard statistics.";
      })

      /*
      |--------------------------------------------------------------------------
      | FETCH ALL ORDERS ADMIN
      |--------------------------------------------------------------------------
      */
      .addCase(fetchAllOrdersAdmin.pending, (state) => {
        state.adminOrdersLoading = true;
        state.adminOrdersError = null;
      })
      .addCase(fetchAllOrdersAdmin.fulfilled, (state, action) => {
        state.adminOrdersLoading = false;
        state.adminOrders = action.payload?.orders || [];
        state.adminOrdersTotal = action.payload?.totalOrders || 0;
        state.adminOrdersPages = action.payload?.totalPages || 1;
        state.adminOrdersCurrentPage = action.payload?.currentPage || 1;
        if (action.payload?.analytics) {
          state.adminOrdersAnalytics = action.payload.analytics;
        }
        state.adminOrdersError = null;
      })
      .addCase(fetchAllOrdersAdmin.rejected, (state, action) => {
        state.adminOrdersLoading = false;
        state.adminOrdersError =
          action.payload || action.error?.message || "Failed to fetch admin orders.";
      })

      /*
      |--------------------------------------------------------------------------
      | FETCH ADMIN ORDER DETAILS
      |--------------------------------------------------------------------------
      */
      .addCase(fetchAdminOrderDetails.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(fetchAdminOrderDetails.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.selectedOrder = action.payload || null;
        state.orderError = null;
      })
      .addCase(fetchAdminOrderDetails.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError =
          action.payload || action.error?.message || "Failed to fetch admin order details.";
      })

      /*
      |--------------------------------------------------------------------------
      | UPDATE ORDER STATUS ADMIN
      |--------------------------------------------------------------------------
      */
      .addCase(updateOrderStatusAdmin.pending, (state) => {
        state.adminOrderUpdating = true;
      })
      .addCase(updateOrderStatusAdmin.fulfilled, (state, action) => {
        state.adminOrderUpdating = false;
        const updatedOrder = action.payload?.order;
        if (updatedOrder) {
          state.adminOrders = state.adminOrders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          );
          if (state.selectedOrder?._id === updatedOrder._id) {
            state.selectedOrder = updatedOrder;
          }
        }
      })
      .addCase(updateOrderStatusAdmin.rejected, (state, action) => {
        state.adminOrderUpdating = false;
        state.adminOrdersError =
          action.payload || action.error?.message || "Failed to update status.";
      })

      /*
      |--------------------------------------------------------------------------
      | DELETE ORDER ADMIN
      |--------------------------------------------------------------------------
      */
      .addCase(deleteOrderAdmin.fulfilled, (state, action) => {
        const deletedId = action.payload?.orderId;
        if (deletedId) {
          state.adminOrders = state.adminOrders.filter(
            (order) => order._id !== deletedId
          );
          state.adminOrdersTotal = Math.max(0, state.adminOrdersTotal - 1);
        }
      });
  },
});

/*
|--------------------------------------------------------------------------
| Export Actions
|--------------------------------------------------------------------------
*/

export const {
  clearUserAuthError,
  clearUsersError,
  clearOrdersError,
  clearSelectedOrder,
  logoutUser,
  setUserAuth,
  updateCurrentUser,
} = userAuthSlice.actions;

/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/

export const selectUser = (state) => state.userAuth?.user || null;
export const selectUserToken = (state) => state.userAuth?.token || null;
export const selectUserAuthenticated = (state) =>
  Boolean(state.userAuth?.isAuthenticated);
export const selectUserAuthLoading = (state) =>
  Boolean(state.userAuth?.loading);
export const selectGoogleAuthLoading = (state) =>
  Boolean(state.userAuth?.googleLoading);
export const selectUserAuthInitialized = (state) =>
  state.userAuth?.authInitialized ?? true;
export const selectUserAuthError = (state) => state.userAuth?.error || null;

// Users Selectors
export const selectAllUsers = (state) => state.userAuth?.allUsers || [];
export const selectAllUsersLoading = (state) =>
  Boolean(state.userAuth?.usersLoading);
export const selectAllUsersError = (state) =>
  state.userAuth?.usersError || null;

// Customer Orders Selectors
export const selectMyOrders = (state) => state.userAuth?.myOrders || [];
export const selectMyOrdersLoading = (state) =>
  Boolean(state.userAuth?.myOrdersLoading);
export const selectMyOrdersError = (state) =>
  state.userAuth?.myOrdersError || null;

// Single Order Breakdown Selectors
export const selectSelectedOrder = (state) =>
  state.userAuth?.selectedOrder || null;
export const selectOrderLoading = (state) =>
  Boolean(state.userAuth?.orderLoading);
export const selectOrderError = (state) =>
  state.userAuth?.orderError || null;

// Admin Dashboard Stats Selectors
export const selectAdminDashboardStats = (state) =>
  state.userAuth?.adminDashboardStats || {};
export const selectAdminDashboardCounts = (state) =>
  state.userAuth?.adminDashboardStats?.counts || {};
export const selectAdminDashboardActivities = (state) =>
  state.userAuth?.adminDashboardStats?.recentActivities || {};
export const selectAdminDashboardLoading = (state) =>
  Boolean(state.userAuth?.adminDashboardLoading);
export const selectAdminDashboardError = (state) =>
  state.userAuth?.adminDashboardError || null;

// Admin Orders Management Selectors
export const selectAdminOrders = (state) =>
  state.userAuth?.adminOrders || [];
export const selectAdminOrdersTotal = (state) =>
  state.userAuth?.adminOrdersTotal || 0;
export const selectAdminOrdersPages = (state) =>
  state.userAuth?.adminOrdersPages || 1;
export const selectAdminOrdersCurrentPage = (state) =>
  state.userAuth?.adminOrdersCurrentPage || 1;
export const selectAdminOrdersAnalytics = (state) =>
  state.userAuth?.adminOrdersAnalytics || {};
export const selectAdminOrdersLoading = (state) =>
  Boolean(state.userAuth?.adminOrdersLoading);
export const selectAdminOrdersError = (state) =>
  state.userAuth?.adminOrdersError || null;
export const selectAdminOrderUpdating = (state) =>
  Boolean(state.userAuth?.adminOrderUpdating);

/*
|--------------------------------------------------------------------------
| Export Reducer
|--------------------------------------------------------------------------
*/

export default userAuthSlice.reducer;