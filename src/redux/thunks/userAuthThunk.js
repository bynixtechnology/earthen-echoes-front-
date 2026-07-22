import {
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  UserAuthService,
} from "../../services/userAuthService";


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
| Normalize User Response
|--------------------------------------------------------------------------
*/

const normalizeAuthResponse = (
  response
) => {

  const data =
    response?.data &&
    typeof response.data ===
      "object"

      ? response.data
      : response;


  const token =
    data?.token ||
    response?.token;


  /*
  |--------------------------------------------------------------------------
  | Supports Both:
  |
  | { token, user: {...} }
  |
  | AND
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

  const user =
    data?.user ||
    response?.user ||
    {

      _id:
        data?._id,

      name:
        data?.name,

      email:
        data?.email,

      role:
        data?.role || "user",

      avatar:
        data?.avatar,

    };


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

        if (!name?.trim()) {

          return rejectWithValue(
            "Name is required."
          );

        }


        if (!email?.trim()) {

          return rejectWithValue(
            "Email is required."
          );

        }


        if (
          !password ||
          password.length < 6
        ) {

          return rejectWithValue(
            "Password must be at least 6 characters."
          );

        }


        const response =
          await UserAuthService.register({

            name:
              name.trim(),

            email:
              email
                .trim()
                .toLowerCase(),

            password,

            /*
            |--------------------------------------------------------------------------
            | Never accept admin role from registration form
            |--------------------------------------------------------------------------
            */

            role:
              "user",

          });


        const auth =
          normalizeAuthResponse(
            response
          );


        if (!auth.token) {

          return rejectWithValue(
            auth.message ||
            "Token not received."
          );

        }


        return {

          ...auth,

          user: {

            ...auth.user,

            role:
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

        const response =
          await UserAuthService.login({

            email:
              email
                ?.trim()
                .toLowerCase(),

            password,

          });


        const auth =
          normalizeAuthResponse(
            response
          );


        if (!auth.token) {

          return rejectWithValue(
            "Authentication token not received."
          );

        }


        /*
        |--------------------------------------------------------------------------
        | Admin cannot enter from customer login
        |--------------------------------------------------------------------------
        */

        if (
          auth.user?.role ===
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

        if (!credential) {

          return rejectWithValue(
            "Google credential is required."
          );

        }


        const response =
          await UserAuthService.googleLogin(
            credential
          );


        const auth =
          normalizeAuthResponse(
            response
          );


        if (!auth.token) {

          return rejectWithValue(
            "Google authentication failed."
          );

        }


        if (
          auth.user?.role ===
          "admin"
        ) {

          return rejectWithValue(
            "Admin accounts cannot use customer login."
          );

        }


        return auth;

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