import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  loginAdmin,
} from "../thunks/authThunk";

/*
|--------------------------------------------------------------------------
| Get Stored Authentication
|--------------------------------------------------------------------------
*/

const getStoredAuth = () => {
  try {
    const token =
      localStorage.getItem(
        "adminToken"
      );

    const savedUser =
      localStorage.getItem(
        "adminUser"
      );

    if (!token || !savedUser) {
      return {
        token: null,
        user: null,
      };
    }

    const user =
      JSON.parse(savedUser);

    /*
    |--------------------------------------------------------------------------
    | Only Restore Admin
    |--------------------------------------------------------------------------
    */

    if (user?.role !== "admin") {
      localStorage.removeItem(
        "adminToken"
      );

      localStorage.removeItem(
        "adminUser"
      );

      return {
        token: null,
        user: null,
      };
    }

    return {
      token,
      user,
    };
  } catch (error) {
    console.error(
      "RESTORE AUTH ERROR:",
      error
    );

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminUser"
    );

    return {
      token: null,
      user: null,
    };
  }
};


/*
|--------------------------------------------------------------------------
| Stored Auth
|--------------------------------------------------------------------------
*/

const storedAuth =
  getStoredAuth();


/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {

  user:
    storedAuth.user,

  token:
    storedAuth.token,

  isAuthenticated:
    Boolean(
      storedAuth.token &&
      storedAuth.user
    ),

  loading: false,

  error: null,

};


/*
|--------------------------------------------------------------------------
| Auth Slice
|--------------------------------------------------------------------------
*/

const authSlice = createSlice({

  name: "auth",

  initialState,

  reducers: {

    /*
    |--------------------------------------------------------------------------
    | Clear Error
    |--------------------------------------------------------------------------
    */

    clearAuthError: (
      state
    ) => {

      state.error = null;

    },


    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    logout: (
      state
    ) => {

      state.user = null;

      state.token = null;

      state.isAuthenticated =
        false;

      state.loading = false;

      state.error = null;


      /*
      |--------------------------------------------------------------------------
      | Clear Local Storage
      |--------------------------------------------------------------------------
      */

      localStorage.removeItem(
        "adminToken"
      );

      localStorage.removeItem(
        "adminUser"
      );

    },

  },


  /*
  |--------------------------------------------------------------------------
  | Async Thunk Reducers
  |--------------------------------------------------------------------------
  */

  extraReducers: (
    builder
  ) => {

    builder

      /*
      |--------------------------------------------------------------------------
      | Login Pending
      |--------------------------------------------------------------------------
      */

      .addCase(
        loginAdmin.pending,

        (state) => {

          state.loading = true;

          state.error = null;

        }
      )


      /*
      |--------------------------------------------------------------------------
      | Login Success
      |--------------------------------------------------------------------------
      */

      .addCase(
        loginAdmin.fulfilled,

        (
          state,
          action
        ) => {

          state.loading = false;

          state.user =
            action.payload.user;

          state.token =
            action.payload.token;

          state.isAuthenticated =
            true;

          state.error = null;


          /*
          |--------------------------------------------------------------------------
          | Save Local Storage
          |--------------------------------------------------------------------------
          */

          localStorage.setItem(
            "adminToken",
            action.payload.token
          );

          localStorage.setItem(
            "adminUser",

            JSON.stringify(
              action.payload.user
            )
          );

        }
      )


      /*
      |--------------------------------------------------------------------------
      | Login Failed
      |--------------------------------------------------------------------------
      */

      .addCase(
        loginAdmin.rejected,

        (
          state,
          action
        ) => {

          state.loading = false;

          state.user = null;

          state.token = null;

          state.isAuthenticated =
            false;

          state.error =
            action.payload ||
            "Login failed.";


          /*
          |--------------------------------------------------------------------------
          | Remove Invalid Authentication
          |--------------------------------------------------------------------------
          */

          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem(
            "adminUser"
          );

        }
      );

  },

});


/*
|--------------------------------------------------------------------------
| Export Actions
|--------------------------------------------------------------------------
*/

export const {
  logout,
  clearAuthError,
} = authSlice.actions;


/*
|--------------------------------------------------------------------------
| Export Reducer
|--------------------------------------------------------------------------
*/

export default authSlice.reducer;