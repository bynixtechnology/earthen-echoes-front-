import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../../services/authService";

/*
|--------------------------------------------------------------------------
| Admin Login Thunk
|--------------------------------------------------------------------------
*/

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",

  async ({ email, password }, { rejectWithValue }) => {
    try {
      /*
      |--------------------------------------------------------------------------
      | Normalize Input
      |--------------------------------------------------------------------------
      */

      const cleanEmail = email?.trim().toLowerCase();

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
      | Call Login API
      |--------------------------------------------------------------------------
      */

      const response = await AuthService.login({
        email: cleanEmail,
        password,
      });

      console.log(
        "ADMIN LOGIN RESPONSE:",
        response
      );

      /*
      |--------------------------------------------------------------------------
      | Handle Different API Response Structures
      |--------------------------------------------------------------------------
      |
      | Supports:
      |
      | {
      |   token,
      |   user
      | }
      |
      | OR
      |
      | {
      |   success: true,
      |   data: {
      |     token,
      |     user
      |   }
      | }
      |
      */

      const data =
        response?.data &&
        typeof response.data === "object"
          ? response.data
          : response;

      /*
      |--------------------------------------------------------------------------
      | Extract Token
      |--------------------------------------------------------------------------
      */

      const token =
        data?.token ||
        response?.token;

      if (!token) {
        return rejectWithValue(
          data?.message ||
            response?.message ||
            "Authentication failed. Token not received."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Extract User
      |--------------------------------------------------------------------------
      */

      const user =
        data?.user ||
        response?.user ||
        {};

      /*
      |--------------------------------------------------------------------------
      | Extract Role
      |--------------------------------------------------------------------------
      */

      const role =
        user?.role ||
        data?.role ||
        response?.role;

      if (!role) {
        return rejectWithValue(
          "User role was not received from the server."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Admin Role Validation
      |--------------------------------------------------------------------------
      */

      if (
        role.toLowerCase() !== "admin"
      ) {
        return rejectWithValue(
          "Access denied. Only admin accounts can access this portal."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Prepare Admin User
      |--------------------------------------------------------------------------
      */

      const admin = {
        ...user,
        role: "admin",
      };

      /*
      |--------------------------------------------------------------------------
      | Return Payload
      |--------------------------------------------------------------------------
      |
      | LocalStorage should preferably be handled by authSlice,
      | listener middleware, or a storage helper.
      |
      */

      return {
        token,
        user: admin,
      };
    } catch (error) {
      console.error(
        "LOGIN ADMIN THUNK ERROR:",
        error
      );

      /*
      |--------------------------------------------------------------------------
      | Handle Axios / API Errors
      |--------------------------------------------------------------------------
      */

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to login. Please try again.";

      return rejectWithValue(message);
    }
  }
);