import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  loginAdmin,
} from "../thunks/adminAuthThunk";


/*
|--------------------------------------------------------------------------
| Local Storage Keys
|--------------------------------------------------------------------------
*/

const ADMIN_TOKEN_KEY =
  "adminToken";

const ADMIN_USER_KEY =
  "adminUser";


/*
|--------------------------------------------------------------------------
| Get Stored Admin Authentication
|--------------------------------------------------------------------------
*/

const getStoredAdminAuth = () => {
  try {

    const token =
      localStorage.getItem(
        ADMIN_TOKEN_KEY
      );

    const savedUser =
      localStorage.getItem(
        ADMIN_USER_KEY
      );


    /*
    |--------------------------------------------------------------------------
    | No Stored Authentication
    |--------------------------------------------------------------------------
    */

    if (
      !token ||
      !savedUser
    ) {
      return {
        token: null,
        user: null,
      };
    }


    /*
    |--------------------------------------------------------------------------
    | Parse Stored User
    |--------------------------------------------------------------------------
    */

    const user =
      JSON.parse(
        savedUser
      );


    /*
    |--------------------------------------------------------------------------
    | Validate Admin Role
    |--------------------------------------------------------------------------
    */

    if (
      user?.role
        ?.toLowerCase() !==
      "admin"
    ) {

      localStorage.removeItem(
        ADMIN_TOKEN_KEY
      );

      localStorage.removeItem(
        ADMIN_USER_KEY
      );

      return {
        token: null,
        user: null,
      };
    }


    /*
    |--------------------------------------------------------------------------
    | Return Stored Admin
    |--------------------------------------------------------------------------
    */

    return {
      token,
      user,
    };

  } catch (error) {

    console.error(
      "RESTORE ADMIN AUTH ERROR:",
      error
    );


    /*
    |--------------------------------------------------------------------------
    | Remove Invalid Stored Data
    |--------------------------------------------------------------------------
    */

    localStorage.removeItem(
      ADMIN_TOKEN_KEY
    );

    localStorage.removeItem(
      ADMIN_USER_KEY
    );


    return {
      token: null,
      user: null,
    };
  }
};


/*
|--------------------------------------------------------------------------
| Stored Authentication
|--------------------------------------------------------------------------
*/

const storedAuth =
  getStoredAdminAuth();


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
| Admin Auth Slice
|--------------------------------------------------------------------------
*/

const adminAuthSlice =
  createSlice({

    /*
    |--------------------------------------------------------------------------
    | IMPORTANT
    |--------------------------------------------------------------------------
    |
    | User auth ka name alag hona chahiye.
    |
    | adminAuth
    | userAuth
    |
    */

    name: "adminAuth",

    initialState,


    /*
    |--------------------------------------------------------------------------
    | Reducers
    |--------------------------------------------------------------------------
    */

    reducers: {


      /*
      |--------------------------------------------------------------------------
      | Clear Admin Auth Error
      |--------------------------------------------------------------------------
      */

      clearAdminAuthError: (
        state
      ) => {

        state.error = null;

      },


      /*
      |--------------------------------------------------------------------------
      | Logout Admin
      |--------------------------------------------------------------------------
      */

      logoutAdmin: (
        state
      ) => {

        /*
        |--------------------------------------------------------------------------
        | Reset Redux State
        |--------------------------------------------------------------------------
        */

        state.user = null;

        state.token = null;

        state.isAuthenticated =
          false;

        state.loading = false;

        state.error = null;


        /*
        |--------------------------------------------------------------------------
        | Remove Only Admin Storage
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | userToken aur userUser ko touch nahi karenge.
        |
        */

        localStorage.removeItem(
          ADMIN_TOKEN_KEY
        );

        localStorage.removeItem(
          ADMIN_USER_KEY
        );

      },


      /*
      |--------------------------------------------------------------------------
      | Restore / Set Admin Authentication
      |--------------------------------------------------------------------------
      |
      | Optional helper.
      |
      | Useful when authentication state manually set karna ho.
      |
      */

      setAdminCredentials: (
        state,
        action
      ) => {

        const {
          token,
          user,
        } =
          action.payload || {};


        if (
          !token ||
          !user ||
          user?.role
            ?.toLowerCase() !==
            "admin"
        ) {
          return;
        }


        state.token =
          token;

        state.user =
          user;

        state.isAuthenticated =
          true;

        state.error =
          null;


        /*
        |--------------------------------------------------------------------------
        | Save Admin Authentication
        |--------------------------------------------------------------------------
        */

        localStorage.setItem(
          ADMIN_TOKEN_KEY,
          token
        );

        localStorage.setItem(
          ADMIN_USER_KEY,
          JSON.stringify(
            user
          )
        );

      },

    },


    /*
    |--------------------------------------------------------------------------
    | Extra Reducers
    |--------------------------------------------------------------------------
    */

    extraReducers: (
      builder
    ) => {

      builder


        /*
        |--------------------------------------------------------------------------
        | Admin Login Pending
        |--------------------------------------------------------------------------
        */

        .addCase(
          loginAdmin.pending,

          (state) => {

            state.loading =
              true;

            state.error =
              null;

          }
        )


        /*
        |--------------------------------------------------------------------------
        | Admin Login Success
        |--------------------------------------------------------------------------
        */

        .addCase(
          loginAdmin.fulfilled,

          (
            state,
            action
          ) => {

            const token =
              action.payload
                ?.token;

            const user =
              action.payload
                ?.user;


            /*
            |--------------------------------------------------------------------------
            | Safety Check
            |--------------------------------------------------------------------------
            */

            if (
              !token ||
              !user
            ) {

              state.loading =
                false;

              state.user =
                null;

              state.token =
                null;

              state.isAuthenticated =
                false;

              state.error =
                "Invalid authentication response.";

              return;
            }


            /*
            |--------------------------------------------------------------------------
            | Update Redux
            |--------------------------------------------------------------------------
            */

            state.loading =
              false;

            state.user =
              user;

            state.token =
              token;

            state.isAuthenticated =
              true;

            state.error =
              null;


            /*
            |--------------------------------------------------------------------------
            | Store Admin Separately
            |--------------------------------------------------------------------------
            */

            localStorage.setItem(
              ADMIN_TOKEN_KEY,
              token
            );

            localStorage.setItem(
              ADMIN_USER_KEY,

              JSON.stringify(
                user
              )
            );

          }
        )


        /*
        |--------------------------------------------------------------------------
        | Admin Login Failed
        |--------------------------------------------------------------------------
        */

        .addCase(
          loginAdmin.rejected,

          (
            state,
            action
          ) => {

            /*
            |--------------------------------------------------------------------------
            | Reset State
            |--------------------------------------------------------------------------
            */

            state.loading =
              false;

            state.user =
              null;

            state.token =
              null;

            state.isAuthenticated =
              false;

            state.error =
              action.payload ||
              "Admin login failed.";


            /*
            |--------------------------------------------------------------------------
            | Remove Invalid Admin Authentication
            |--------------------------------------------------------------------------
            */

            localStorage.removeItem(
              ADMIN_TOKEN_KEY
            );

            localStorage.removeItem(
              ADMIN_USER_KEY
            );

          }
        );

    },

  });


/*
|--------------------------------------------------------------------------
| Export Admin Actions
|--------------------------------------------------------------------------
*/

export const {

  logoutAdmin,

  clearAdminAuthError,

  setAdminCredentials,

} =
  adminAuthSlice.actions;


/*
|--------------------------------------------------------------------------
| Admin Selectors
|--------------------------------------------------------------------------
*/

export const selectAdmin =
  (state) =>
    state.adminAuth
      ?.user ||
    null;


export const selectAdminToken =
  (state) =>
    state.adminAuth
      ?.token ||
    null;


export const selectAdminAuthenticated =
  (state) =>
    state.adminAuth
      ?.isAuthenticated ||
    false;


export const selectAdminAuthLoading =
  (state) =>
    state.adminAuth
      ?.loading ||
    false;


export const selectAdminAuthError =
  (state) =>
    state.adminAuth
      ?.error ||
    null;


/*
|--------------------------------------------------------------------------
| Export Reducer
|--------------------------------------------------------------------------
*/

export default
  adminAuthSlice.reducer;