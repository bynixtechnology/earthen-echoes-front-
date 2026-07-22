import {
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  AdminAuthService,
} from "../../services/adminAuthService";


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


export const loginAdmin =
  createAsyncThunk(

    "adminAuth/login",

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

        const cleanEmail =
          email
            ?.trim()
            .toLowerCase();


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


        const response =
          await AdminAuthService.login({

            email:
              cleanEmail,

            password,

          });


        /*
        |--------------------------------------------------------------------------
        | Normalize Response
        |--------------------------------------------------------------------------
        */

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
        | Backend may return flat user data
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
              data?.role,

          };


        const role =
          user?.role ||
          data?.role;


        if (!token) {

          return rejectWithValue(
            "Authentication token not received."
          );

        }


        if (
          role !==
          "admin"
        ) {

          return rejectWithValue(
            "Access denied. Admin account required."
          );

        }


        return {

          token,

          user: {

            ...user,

            role:
              "admin",

          },

        };

      } catch (error) {

        return rejectWithValue(

          getErrorMessage(
            error,
            "Unable to login as admin."
          )

        );

      }

    }

  );