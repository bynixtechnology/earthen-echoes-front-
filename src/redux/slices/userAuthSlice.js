import { createSlice } from "@reduxjs/toolkit";

import {
  registerUser,
  loginUser,
  googleLoginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  fetchAllUsers, // 👈 Imported fetchAllUsers
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

    logoutUser: (state) => {
      resetAuthState(state);
      state.allUsers = [];
      state.usersLoading = false;
      state.usersError = null;
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
      | FETCH ALL USERS (ADMIN / USER LIST)
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

// All Users Selectors
export const selectAllUsers = (state) => state.userAuth?.allUsers || [];
export const selectAllUsersLoading = (state) =>
  Boolean(state.userAuth?.usersLoading);
export const selectAllUsersError = (state) =>
  state.userAuth?.usersError || null;

/*
|--------------------------------------------------------------------------
| Export Reducer
|--------------------------------------------------------------------------
*/

export default userAuthSlice.reducer;