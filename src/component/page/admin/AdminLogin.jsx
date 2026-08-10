import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";


/*
|--------------------------------------------------------------------------
| Admin Redux
|--------------------------------------------------------------------------
*/

import {
  loginAdmin,
} from "../../../redux/thunks/adminAuthThunk";

import {
  clearAdminAuthError,
  selectAdmin,
  selectAdminAuthenticated,
  selectAdminAuthLoading,
  selectAdminAuthError,
} from "../../../redux/slices/adminAuthSlice";


/*
|--------------------------------------------------------------------------
| Helpers / Components
|--------------------------------------------------------------------------
*/

import {
  showToast,
} from "../../../config/toast";

import LoginForm from "../../../component/core/admin/LoginForm";


const AdminLogin = () => {

  /*
  |--------------------------------------------------------------------------
  | Redux / Router
  |--------------------------------------------------------------------------
  */

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();


  /*
  |--------------------------------------------------------------------------
  | Admin Auth State
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | Old:
  | state.auth
  |
  | New:
  | state.adminAuth
  |
  | Selectors use karne se component store structure se cleaner rahega.
  |
  */

  const user =
    useSelector(
      selectAdmin
    );

  const isAuthenticated =
    useSelector(
      selectAdminAuthenticated
    );

  const loading =
    useSelector(
      selectAdminAuthLoading
    );

  const error =
    useSelector(
      selectAdminAuthError
    );


  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  */

  const [
    email,
    setEmail,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Redirect Already Logged-In Admin
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (
      isAuthenticated &&
      user?.role
        ?.toLowerCase() ===
        "admin"
    ) {

      navigate(
        "/admin/product",
        {
          replace: true,
        }
      );

    }

  }, [
    isAuthenticated,
    user,
    navigate,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Clear Previous Admin Error On Mount
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    dispatch(
      clearAdminAuthError()
    );

  }, [
    dispatch,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Handle Admin Login
  |--------------------------------------------------------------------------
  */

  const handleLogin =
    async (e) => {

      e.preventDefault();


      /*
      |--------------------------------------------------------------------------
      | Prevent Multiple Requests
      |--------------------------------------------------------------------------
      */

      if (loading) {
        return;
      }


      /*
      |--------------------------------------------------------------------------
      | Normalize Input
      |--------------------------------------------------------------------------
      */

      const cleanEmail =
        email
          ?.trim()
          .toLowerCase();


      /*
      |--------------------------------------------------------------------------
      | Email Validation
      |--------------------------------------------------------------------------
      */

      if (!cleanEmail) {

        showToast.error(
          "Email is required."
        );

        return;

      }


      /*
      |--------------------------------------------------------------------------
      | Password Validation
      |--------------------------------------------------------------------------
      */

      if (!password) {

        showToast.error(
          "Password is required."
        );

        return;

      }


      /*
      |--------------------------------------------------------------------------
      | Clear Previous Error
      |--------------------------------------------------------------------------
      */

      dispatch(
        clearAdminAuthError()
      );


      try {

        /*
        |--------------------------------------------------------------------------
        | Login Admin
        |--------------------------------------------------------------------------
        */

        const result =
          await dispatch(

            loginAdmin({

              email:
                cleanEmail,

              password,

            })

          ).unwrap();


        /*
        |--------------------------------------------------------------------------
        | Extra Safety Check
        |--------------------------------------------------------------------------
        */

        if (
          result?.user?.role
            ?.toLowerCase() !==
          "admin"
        ) {

          showToast.error(
            "Access denied. Admin account required."
          );

          return;

        }


        /*
        |--------------------------------------------------------------------------
        | Success Message
        |--------------------------------------------------------------------------
        */

        showToast.success(

          `Welcome back, ${
            result?.user?.name ||
            "Admin"
          }.`

        );


        /*
        |--------------------------------------------------------------------------
        | Redirect To Admin Dashboard
        |--------------------------------------------------------------------------
        */

        navigate(
          "/admin/product",
          {
            replace: true,
          }
        );

      } catch (message) {

        /*
        |--------------------------------------------------------------------------
        | Login Error
        |--------------------------------------------------------------------------
        */

        console.error(
          "ADMIN LOGIN ERROR:",
          message
        );


        showToast.error(

          typeof message ===
            "string"

            ? message

            : message?.message ||
              "Unable to login. Please try again."

        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Clear Error From Login Form
  |--------------------------------------------------------------------------
  */

  const handleClearError =
    () => {

      dispatch(
        clearAdminAuthError()
      );

    };


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <div
      className="
        min-h-screen

        flex
        items-center
        justify-center

        bg-slate-100

        px-4
        py-10
      "
    >

      <LoginForm

        /*
        | Email
        */

        email={
          email
        }

        setEmail={
          setEmail
        }


        /*
        | Password
        */

        password={
          password
        }

        setPassword={
          setPassword
        }


        /*
        | Submit
        */

        handleSubmit={
          handleLogin
        }


        /*
        | Error
        */

        error={
          error
        }

        setError={
          handleClearError
        }


        /*
        | Loading
        */

        loading={
          loading
        }

      />

    </div>

  );

};


export default AdminLogin;