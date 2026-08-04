import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  registerUser,
  loginUser,
  googleLoginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../thunks/userAuthThunk";


/*
|--------------------------------------------------------------------------
| Storage Keys
|--------------------------------------------------------------------------
*/

const USER_TOKEN_KEY =
  "userToken";

const USER_DATA_KEY =
  "userData";

const GOOGLE_PROMPT_KEY =
  "googleSignupPromptClosed";


/*
|--------------------------------------------------------------------------
| Clear Stored User Authentication
|--------------------------------------------------------------------------
*/

const clearStoredUserAuth =
  () => {

    localStorage.removeItem(
      USER_TOKEN_KEY
    );

    localStorage.removeItem(
      USER_DATA_KEY
    );

  };


/*
|--------------------------------------------------------------------------
| Restore User Authentication
|--------------------------------------------------------------------------
*/

const getStoredUserAuth =
  () => {

    try {

      /*
      |--------------------------------------------------------------------------
      | Get LocalStorage Data
      |--------------------------------------------------------------------------
      */

      const token =
        localStorage.getItem(
          USER_TOKEN_KEY
        );


      const savedUser =
        localStorage.getItem(
          USER_DATA_KEY
        );


      /*
      |--------------------------------------------------------------------------
      | No Stored Session
      |--------------------------------------------------------------------------
      */

      if (
        !token ||
        !savedUser
      ) {

        return {

          token:
            null,

          user:
            null,

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
      | Validate User Object
      |--------------------------------------------------------------------------
      */

      if (
        !user ||
        typeof user !==
          "object"
      ) {

        clearStoredUserAuth();


        return {

          token:
            null,

          user:
            null,

        };

      }


      /*
      |--------------------------------------------------------------------------
      | Never Restore Admin As Customer
      |--------------------------------------------------------------------------
      */

      if (
        user?.role
          ?.toLowerCase() ===
        "admin"
      ) {

        clearStoredUserAuth();


        return {

          token:
            null,

          user:
            null,

        };

      }


      /*
      |--------------------------------------------------------------------------
      | Restore Authentication
      |--------------------------------------------------------------------------
      */

      return {

        token,

        user: {

          ...user,

          role:
            user?.role ||
            "user",

        },

      };

    } catch (error) {

      console.error(
        "RESTORE USER AUTH ERROR:",
        error
      );


      /*
      |--------------------------------------------------------------------------
      | Invalid LocalStorage Data
      |--------------------------------------------------------------------------
      */

      clearStoredUserAuth();


      return {

        token:
          null,

        user:
          null,

      };

    }

  };


/*
|--------------------------------------------------------------------------
| Stored Authentication
|--------------------------------------------------------------------------
*/

const storedAuth =
  getStoredUserAuth();


/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {

  /*
  |--------------------------------------------------------------------------
  | Logged In User
  |--------------------------------------------------------------------------
  */

  user:
    storedAuth.user,


  /*
  |--------------------------------------------------------------------------
  | JWT Token
  |--------------------------------------------------------------------------
  */

  token:
    storedAuth.token,


  /*
  |--------------------------------------------------------------------------
  | Authentication Status
  |--------------------------------------------------------------------------
  */

  isAuthenticated:
    Boolean(

      storedAuth.token &&

      storedAuth.user

    ),


  /*
  |--------------------------------------------------------------------------
  | Normal Login / Register Loading
  |--------------------------------------------------------------------------
  */

  loading:
    false,


  /*
  |--------------------------------------------------------------------------
  | Google Login Loading
  |--------------------------------------------------------------------------
  */

  googleLoading:
    false,


  /*
  |--------------------------------------------------------------------------
  | Authentication Initialization
  |--------------------------------------------------------------------------
  |
  | LocalStorage restore synchronous hai,
  | isliye initial render ke baad auth ready hai.
  |
  */

  authInitialized:
    true,


  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  error:
    null,

};


/*
|--------------------------------------------------------------------------
| Reset Authentication State
|--------------------------------------------------------------------------
*/

const resetAuthState =
  (state) => {

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

  };


/*
|--------------------------------------------------------------------------
| Save Authentication
|--------------------------------------------------------------------------
|
| Used by:
|
| registerUser.fulfilled
| loginUser.fulfilled
| googleLoginUser.fulfilled
|
*/

const saveUserAuth = (
  state,
  action
) => {

  /*
  |--------------------------------------------------------------------------
  | Extract Payload
  |--------------------------------------------------------------------------
  */

  const token =
    action.payload?.token;


  const user =
    action.payload?.user;


  /*
  |--------------------------------------------------------------------------
  | Safety Validation
  |--------------------------------------------------------------------------
  */

  if (
    !token ||
    !user
  ) {

    resetAuthState(
      state
    );

    clearStoredUserAuth();

    state.error =
      "Invalid authentication response.";

    return;

  }


  /*
  |--------------------------------------------------------------------------
  | Prevent Admin Session Inside Customer Authentication
  |--------------------------------------------------------------------------
  */

  if (
    user?.role
      ?.toLowerCase() ===
    "admin"
  ) {

    resetAuthState(
      state
    );

    clearStoredUserAuth();

    state.error =
      "Admin accounts cannot use the customer portal.";

    return;

  }


  /*
  |--------------------------------------------------------------------------
  | Normalize User
  |--------------------------------------------------------------------------
  */

  const normalizedUser = {

    ...user,

    role:
      user?.role ||
      "user",

  };


  /*
  |--------------------------------------------------------------------------
  | Update Redux State
  |--------------------------------------------------------------------------
  */

  state.loading =
    false;

  state.googleLoading =
    false;

  state.user =
    normalizedUser;

  state.token =
    token;

  state.isAuthenticated =
    true;

  state.authInitialized =
    true;

  state.error =
    null;


  /*
  |--------------------------------------------------------------------------
  | Save Authentication
  |--------------------------------------------------------------------------
  */

  localStorage.setItem(

    USER_TOKEN_KEY,

    token

  );


  localStorage.setItem(

    USER_DATA_KEY,

    JSON.stringify(
      normalizedUser
    )

  );


  /*
  |--------------------------------------------------------------------------
  | Stop First Visit Google Signup Prompt
  |--------------------------------------------------------------------------
  |
  | User has successfully authenticated.
  |
  */

  localStorage.setItem(

    GOOGLE_PROMPT_KEY,

    "true"

  );

};


/*
|--------------------------------------------------------------------------
| User Auth Slice
|--------------------------------------------------------------------------
*/

const userAuthSlice =
  createSlice({

    name:
      "userAuth",


    initialState,


    /*
    |--------------------------------------------------------------------------
    | Synchronous Reducers
    |--------------------------------------------------------------------------
    */

    reducers: {


      /*
      |--------------------------------------------------------------------------
      | Clear Authentication Error
      |--------------------------------------------------------------------------
      */

      clearUserAuthError: (
        state
      ) => {

        state.error =
          null;

      },


      /*
      |--------------------------------------------------------------------------
      | Logout User
      |--------------------------------------------------------------------------
      */

      logoutUser: (
        state
      ) => {

        /*
        |--------------------------------------------------------------------------
        | Reset Redux State
        |--------------------------------------------------------------------------
        */

        resetAuthState(
          state
        );


        state.authInitialized =
          true;


        /*
        |--------------------------------------------------------------------------
        | Remove Authentication Storage
        |--------------------------------------------------------------------------
        */

        clearStoredUserAuth();


        /*
        |--------------------------------------------------------------------------
        | Notify Non-Redux Components If Needed
        |--------------------------------------------------------------------------
        */

        window.dispatchEvent(

          new Event(
            "userAuthChanged"
          )

        );

      },


      /*
      |--------------------------------------------------------------------------
      | Manually Set User Authentication
      |--------------------------------------------------------------------------
      |
      | Useful when:
      |
      | - OAuth callback
      | - Session restoration API
      | - Profile refresh
      |
      */

      setUserAuth: (
        state,
        action
      ) => {

        saveUserAuth(
          state,
          action
        );

      },


      /*
      |--------------------------------------------------------------------------
      | Update Current User
      |--------------------------------------------------------------------------
      |
      | Useful after profile update.
      |
      */

      updateCurrentUser: (
        state,
        action
      ) => {

        if (
          !state.user
        ) {

          return;

        }


        const updatedUser = {

          ...state.user,

          ...action.payload,

        };


        /*
        |--------------------------------------------------------------------------
        | Prevent Role Escalation
        |--------------------------------------------------------------------------
        */

        if (
          updatedUser?.role
            ?.toLowerCase() ===
          "admin"
        ) {

          updatedUser.role =
            state.user?.role ||
            "user";

        }


        state.user =
          updatedUser;


        /*
        |--------------------------------------------------------------------------
        | Update LocalStorage
        |--------------------------------------------------------------------------
        */

        localStorage.setItem(

          USER_DATA_KEY,

          JSON.stringify(
            updatedUser
          )

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
        | REGISTER USER - Pending
        |--------------------------------------------------------------------------
        */

        .addCase(

          registerUser.pending,

          (state) => {

            state.loading =
              true;

            state.googleLoading =
              false;

            state.error =
              null;

          }

        )


        /*
        |--------------------------------------------------------------------------
        | REGISTER USER - Success
        |--------------------------------------------------------------------------
        */

        .addCase(

          registerUser.fulfilled,

          (
            state,
            action
          ) => {

            saveUserAuth(
              state,
              action
            );

          }

        )


        /*
        |--------------------------------------------------------------------------
        | REGISTER USER - Failed
        |--------------------------------------------------------------------------
        */

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

              action.error?.message ||

              "Registration failed.";

          }

        )


        /*
        |--------------------------------------------------------------------------
        | LOGIN USER - Pending
        |--------------------------------------------------------------------------
        */

        .addCase(

          loginUser.pending,

          (state) => {

            state.loading =
              true;

            state.googleLoading =
              false;

            state.error =
              null;

          }

        )


        /*
        |--------------------------------------------------------------------------
        | LOGIN USER - Success
        |--------------------------------------------------------------------------
        */

        .addCase(

          loginUser.fulfilled,

          (
            state,
            action
          ) => {

            saveUserAuth(
              state,
              action
            );

          }

        )


        /*
        |--------------------------------------------------------------------------
        | LOGIN USER - Failed
        |--------------------------------------------------------------------------
        */

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

              action.error?.message ||

              "Login failed.";

          }

        )


        /*
        |--------------------------------------------------------------------------
        | GOOGLE LOGIN - Pending
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


        /*
        |--------------------------------------------------------------------------
        | GOOGLE LOGIN - Success
        |--------------------------------------------------------------------------
        */

        .addCase(

          googleLoginUser.fulfilled,

          (
            state,
            action
          ) => {

            saveUserAuth(
              state,
              action
            );

          }

        )


        /*
        |--------------------------------------------------------------------------
        | GOOGLE LOGIN - Failed
        |--------------------------------------------------------------------------
        */

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

              action.error?.message ||

              "Google authentication failed.";

          }

        ) 

        
        /*
|--------------------------------------------------------------------------
| UPDATE PROFILE - Pending
|--------------------------------------------------------------------------
*/

.addCase(
  updateUserProfile.pending,
  (state) => {
    state.loading = true;
    state.error = null;
  }
)

.addCase(
  updateUserProfile.fulfilled,
  (state, action) => {
    state.loading = false;

    state.user = {
      ...state.user,
      ...action.payload,
    };

    localStorage.setItem(
      USER_DATA_KEY,
      JSON.stringify(state.user)
    );
  }
)

.addCase(
  updateUserProfile.rejected,
  (state, action) => {
    state.loading = false;

    state.error =
      action.payload ||
      action.error?.message ||
      "Unable to update profile.";
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

  clearUserAuthError,

  logoutUser,

  setUserAuth,

  updateCurrentUser,

} = userAuthSlice.actions;


/*
|--------------------------------------------------------------------------
| Select User
|--------------------------------------------------------------------------
*/

export const selectUser =
  (state) => {

    return (
      state.userAuth?.user ||
      null
    );

  };


/*
|--------------------------------------------------------------------------
| Select User Token
|--------------------------------------------------------------------------
*/

export const selectUserToken =
  (state) => {

    return (
      state.userAuth?.token ||
      null
    );

  };


/*
|--------------------------------------------------------------------------
| Select Authentication Status
|--------------------------------------------------------------------------
*/

export const selectUserAuthenticated =
  (state) => {

    return Boolean(
      state.userAuth
        ?.isAuthenticated
    );

  };


/*
|--------------------------------------------------------------------------
| Select Normal Loading
|--------------------------------------------------------------------------
*/

export const selectUserAuthLoading =
  (state) => {

    return Boolean(
      state.userAuth
        ?.loading
    );

  };


/*
|--------------------------------------------------------------------------
| Select Google Loading
|--------------------------------------------------------------------------
*/

export const selectGoogleAuthLoading =
  (state) => {

    return Boolean(
      state.userAuth
        ?.googleLoading
    );

  };


/*
|--------------------------------------------------------------------------
| Select Auth Initialized
|--------------------------------------------------------------------------
*/

export const selectUserAuthInitialized =
  (state) => {

    return (

      state.userAuth
        ?.authInitialized ??

      true

    );

  };


/*
|--------------------------------------------------------------------------
| Select Authentication Error
|--------------------------------------------------------------------------
*/

export const selectUserAuthError =
  (state) => {

    return (
      state.userAuth?.error ||
      null
    );

  };


/*
|--------------------------------------------------------------------------
| Export Reducer
|--------------------------------------------------------------------------
*/

export default userAuthSlice.reducer;