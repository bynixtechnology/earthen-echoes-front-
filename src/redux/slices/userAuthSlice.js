import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  registerUser,
  loginUser,
  googleLoginUser,
} from "../thunks/userAuthThunk";


/*
|--------------------------------------------------------------------------
| Restore User Authentication
|--------------------------------------------------------------------------
*/

const getStoredUserAuth = () => {

  try {

    const token =
      localStorage.getItem(
        "userToken"
      );

    const savedUser =
      localStorage.getItem(
        "userData"
      );


    if (
      !token ||
      !savedUser
    ) {

      return {
        token: null,
        user: null,
      };

    }


    const user =
      JSON.parse(
        savedUser
      );


    /*
    |--------------------------------------------------------------------------
    | Never restore admin as normal user
    |--------------------------------------------------------------------------
    */

    if (
      user?.role ===
      "admin"
    ) {

      localStorage.removeItem(
        "userToken"
      );

      localStorage.removeItem(
        "userData"
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

  } catch {

    localStorage.removeItem(
      "userToken"
    );

    localStorage.removeItem(
      "userData"
    );


    return {
      token: null,
      user: null,
    };

  }

};


const storedAuth =
  getStoredUserAuth();


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

  loading:
    false,

  googleLoading:
    false,

  error:
    null,

};


const saveUserAuth = (
  state,
  action
) => {

  state.loading =
    false;

  state.googleLoading =
    false;

  state.user =
    action.payload.user;

  state.token =
    action.payload.token;

  state.isAuthenticated =
    true;

  state.error =
    null;


  localStorage.setItem(
    "userToken",
    action.payload.token
  );


  localStorage.setItem(
    "userData",

    JSON.stringify(
      action.payload.user
    )

  );


  localStorage.setItem(
    "googleSignupPromptClosed",
    "true"
  );

};


const userAuthSlice =
  createSlice({

    name:
      "userAuth",

    initialState,

    reducers: {

      clearUserAuthError: (
        state
      ) => {

        state.error =
          null;

      },


      logoutUser: (
        state
      ) => {

        state.user =
          null;

        state.token =
          null;

        state.isAuthenticated =
          false;

        state.loading =
          false;

        state.googleLoading =
          false;

        state.error =
          null;


        localStorage.removeItem(
          "userToken"
        );

        localStorage.removeItem(
          "userData"
        );

      },

    },


    extraReducers: (
      builder
    ) => {

      builder


        /*
        |--------------------------------------------------------------------------
        | Register
        |--------------------------------------------------------------------------
        */

        .addCase(
          registerUser.pending,

          (state) => {

            state.loading =
              true;

            state.error =
              null;

          }
        )


        .addCase(
          registerUser.fulfilled,
          saveUserAuth
        )


        .addCase(
          registerUser.rejected,

          (
            state,
            action
          ) => {

            state.loading =
              false;

            state.error =
              action.payload ||
              "Registration failed.";

          }
        )


        /*
        |--------------------------------------------------------------------------
        | Login
        |--------------------------------------------------------------------------
        */

        .addCase(
          loginUser.pending,

          (state) => {

            state.loading =
              true;

            state.error =
              null;

          }
        )


        .addCase(
          loginUser.fulfilled,
          saveUserAuth
        )


        .addCase(
          loginUser.rejected,

          (
            state,
            action
          ) => {

            state.loading =
              false;

            state.error =
              action.payload ||
              "Login failed.";

          }
        )


        /*
        |--------------------------------------------------------------------------
        | Google Authentication
        |--------------------------------------------------------------------------
        */

        .addCase(
          googleLoginUser.pending,

          (state) => {

            state.googleLoading =
              true;

            state.error =
              null;

          }
        )


        .addCase(
          googleLoginUser.fulfilled,
          saveUserAuth
        )


        .addCase(
          googleLoginUser.rejected,

          (
            state,
            action
          ) => {

            state.googleLoading =
              false;

            state.error =
              action.payload ||
              "Google authentication failed.";

          }
        );

    },

  });


export const {

  clearUserAuthError,

  logoutUser,

} = userAuthSlice.actions;


/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/

export const selectUser =
  (state) =>
    state.userAuth?.user ||
    null;


export const selectUserToken =
  (state) =>
    state.userAuth?.token ||
    null;


export const selectUserAuthenticated =
  (state) =>
    state.userAuth
      ?.isAuthenticated ||
    false;


export const selectUserAuthLoading =
  (state) =>
    state.userAuth?.loading ||
    false;


export const selectGoogleAuthLoading =
  (state) =>
    state.userAuth
      ?.googleLoading ||
    false;


export const selectUserAuthError =
  (state) =>
    state.userAuth?.error ||
    null;


export default userAuthSlice.reducer;