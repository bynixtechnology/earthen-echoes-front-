import {
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  UserAuthService,
} from "../../services/userAuthService";


/*
|--------------------------------------------------------------------------
| Get Error Message
|--------------------------------------------------------------------------
*/

const getErrorMessage = (
  error,
  fallback
) => {

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );

};


/*
|--------------------------------------------------------------------------
| Normalize Authentication Response
|--------------------------------------------------------------------------
*/

const normalizeAuthResponse = (
  response
) => {

  const data =
    response?.data &&
      typeof response.data === "object"

      ? response.data

      : response;


  const token =
    data?.token ||
    response?.token ||
    null;


  /*
  |--------------------------------------------------------------------------
  | Supports:
  |
  | {
  |   token,
  |   user: {...}
  | }
  |
  | OR
  |
  | {
  |   _id,
  |   name,
  |   email,
  |   role,
  |   token
  | }
  |--------------------------------------------------------------------------
  */

  let user =
    data?.user ||
    response?.user ||
    null;


  /*
  |--------------------------------------------------------------------------
  | Flat Backend Response
  |--------------------------------------------------------------------------
  */

  if (!user && data) {

    user = {

      ...data,

      role: data?.role || "user",

    };

  }


  return {

    token,

    user,

    message:
      data?.message ||
      response?.message ||
      "",

  };

};


/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

export const registerUser =
  createAsyncThunk(

    "userAuth/register",

    async (
      {
        name,
        email,
        password,
      },

      {
        rejectWithValue,
      }

    ) => {

      try {

        /*
        |--------------------------------------------------------------------------
        | Normalize
        |--------------------------------------------------------------------------
        */

        const cleanName =
          name?.trim();

        const cleanEmail =
          email
            ?.trim()
            .toLowerCase();


        /*
        |--------------------------------------------------------------------------
        | Validation
        |--------------------------------------------------------------------------
        */

        if (!cleanName) {

          return rejectWithValue(
            "Name is required."
          );

        }


        if (!cleanEmail) {

          return rejectWithValue(
            "Email is required."
          );

        }


        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
          !emailRegex.test(
            cleanEmail
          )
        ) {

          return rejectWithValue(
            "Please enter a valid email address."
          );

        }


        if (
          !password ||
          password.trim().length < 6
        ) {

          return rejectWithValue(
            "Password must be at least 6 characters."
          );

        }


        /*
        |--------------------------------------------------------------------------
        | Register API
        |--------------------------------------------------------------------------
        */

        const response =
          await UserAuthService.register({

            name:
              cleanName,

            email:
              cleanEmail,

            password,

            /*
            |--------------------------------------------------------------------------
            | Force Customer Role
            |--------------------------------------------------------------------------
            */

            role:
              "user",

          });


        /*
        |--------------------------------------------------------------------------
        | Normalize Response
        |--------------------------------------------------------------------------
        */

        const auth =
          normalizeAuthResponse(
            response
          );


        if (!auth.token?.trim()) {

          return rejectWithValue(

            auth.message ||

            "Registration successful but authentication token was not received."

          );

        }


        /*
        |--------------------------------------------------------------------------
        | Security Check
        |--------------------------------------------------------------------------
        */

        if (
          auth.user?.role
            ?.toLowerCase() ===
          "admin"
        ) {

          return rejectWithValue(
            "Invalid customer account."
          );

        }


        /*
        |--------------------------------------------------------------------------
        | Return
        |--------------------------------------------------------------------------
        */

        return {

          ...auth,

          user: {

            ...auth.user,

            role:
              auth.user?.role ||
              "user",

          },

        };

      } catch (error) {

        return rejectWithValue(

          getErrorMessage(

            error,

            "Unable to create account."

          )

        );

      }

    }

  );


/*
|--------------------------------------------------------------------------
| User Login
|--------------------------------------------------------------------------
*/

export const loginUser =
  createAsyncThunk(

    "userAuth/login",

    async (
      {
        email,
        password,
      },

      {
        rejectWithValue,
      }

    ) => {

      try {

        /*
        |--------------------------------------------------------------------------
        | Normalize
        |--------------------------------------------------------------------------
        */

        const cleanEmail =
          email
            ?.trim()
            .toLowerCase();


        /*
        |--------------------------------------------------------------------------
        | Validation
        |--------------------------------------------------------------------------
        */

        if (!cleanEmail) {

          return rejectWithValue(
            "Email is required."
          );

        }


        if (!password) {

          return rejectWithValue(
            "Password is required."
          );

        }


        /*
        |--------------------------------------------------------------------------
        | Login API
        |--------------------------------------------------------------------------
        */

        const response =
          await UserAuthService.login({

            email:
              cleanEmail,

            password,

          });


        /*
        |--------------------------------------------------------------------------
        | Normalize
        |--------------------------------------------------------------------------
        */

        const auth =
          normalizeAuthResponse(
            response
          );


        if (!auth.token?.trim()) {

          return rejectWithValue(

            auth.message ||

            "Authentication token not received."

          );

        }


        /*
        |--------------------------------------------------------------------------
        | Admin Cannot Login From Customer Portal
        |--------------------------------------------------------------------------
        */

        if (
          auth.user?.role
            ?.toLowerCase() ===
          "admin"
        ) {

          return rejectWithValue(
            "Please use the admin login portal."
          );

        }


        return auth;

      } catch (error) {

        return rejectWithValue(

          getErrorMessage(

            error,

            "Unable to login."

          )

        );

      }

    }

  );


/*
|--------------------------------------------------------------------------
| Google Login / Registration
|--------------------------------------------------------------------------
|
| Google flow:
|
| GoogleLogin component
|       ↓
| credentialResponse.credential
|       ↓
| googleLoginUser(credential)
|       ↓
| POST /auth/google
|       ↓
| Backend verifies Google token
|       ↓
| Existing User -> Login
| New User      -> Create + Login
|       ↓
| JWT returned
|
*/

export const googleLoginUser =
  createAsyncThunk(

    "userAuth/googleLogin",

    async (
      credential,

      {
        rejectWithValue,
      }

    ) => {

      try {

        /*
        |--------------------------------------------------------------------------
        | Validate Credential
        |--------------------------------------------------------------------------
        */

        if (!credential) {

          return rejectWithValue(
            "Google credential is required."
          );

        }


        /*
        |--------------------------------------------------------------------------
        | Google Authentication API
        |--------------------------------------------------------------------------
        */

        const response =
          await UserAuthService.googleLogin(
            credential
          );


        /*
        |--------------------------------------------------------------------------
        | Normalize
        |--------------------------------------------------------------------------
        */

        const auth =
          normalizeAuthResponse(
            response
          );


        if (!auth.token?.trim()) {

          return rejectWithValue(

            auth.message ||

            "Google authentication failed."

          );

        }


        /*
        |--------------------------------------------------------------------------
        | Prevent Admin Login
        |--------------------------------------------------------------------------
        */

        if (
          auth.user?.role
            ?.toLowerCase() ===
          "admin"
        ) {

          return rejectWithValue(
            "Admin accounts cannot use customer login."
          );

        }


        /*
        |--------------------------------------------------------------------------
        | Return Authentication
        |--------------------------------------------------------------------------
        */

        return {

          ...auth,

          user: {

            ...auth.user,

            role:
              auth.user?.role ||
              "user",

          },

        };

      } catch (error) {

        return rejectWithValue(

          getErrorMessage(

            error,

            "Unable to continue with Google."

          )

        );

      }

    }

  );


/*
|--------------------------------------------------------------------------
| Get User Profile
|--------------------------------------------------------------------------
*/

export const getUserProfile =
  createAsyncThunk(

    "userAuth/getProfile",

    async (_, { rejectWithValue }) => {

      try {

        const response =
          await UserAuthService.getProfile();

        const data =
          response?.data || response;

        return data.user;

      } catch (error) {

        return rejectWithValue(

          getErrorMessage(
            error,
            "Unable to fetch profile."
          )

        );

      }

    }

  );


/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

export const updateUserProfile =
  createAsyncThunk(

    "userAuth/updateProfile",

    async (

      data,

      { rejectWithValue }

    ) => {

      try {

        const response =
          await UserAuthService.updateProfile(
            data
          );

        const result =
          response?.data || response;

        return result.user;

      } catch (error) {

        return rejectWithValue(

          getErrorMessage(

            error,

            "Unable to update profile."

          )

        );

      }

    }

  );


/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export const changePassword =
  createAsyncThunk(

    "userAuth/changePassword",

    async (

      data,

      { rejectWithValue }

    ) => {

      try {

        const response =
          await UserAuthService.changePassword(
            data
          );

        return response?.data || response;

      } catch (error) {

        return rejectWithValue(

          getErrorMessage(

            error,

            "Unable to change password."

          )

        );

      }

    }

  );