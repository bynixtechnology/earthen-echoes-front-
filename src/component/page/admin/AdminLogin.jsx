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

import {
  loginAdmin,
} from "../../../redux/thunks/authThunk";

import {
  clearAuthError,
} from "../../../redux/slices/authSlice";

import {
  showToast,
} from "../../../config/toast";

import LoginForm from "../../../component/core/admin/LoginForm";


export default function AdminLogin() {

  /*
  |--------------------------------------------------------------------------
  | Redux
  |--------------------------------------------------------------------------
  */

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();


  const {
    user,
    isAuthenticated,
    loading,
    error,
  } = useSelector(
    (state) =>
      state.auth
  );


  /*
  |--------------------------------------------------------------------------
  | Local Form State
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
  | Already Logged In
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (
      isAuthenticated &&
      user?.role === "admin"
    ) {

      navigate(
        "/admin/dashboard",
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
  | Clear Old Error
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    dispatch(
      clearAuthError()
    );

  }, [dispatch]);


  /*
  |--------------------------------------------------------------------------
  | Handle Login
  |--------------------------------------------------------------------------
  */

  const handleLogin = async (
    e
  ) => {

    e.preventDefault();


    if (loading) {
      return;
    }


    /*
    |--------------------------------------------------------------------------
    | Clean Email
    |--------------------------------------------------------------------------
    */

    const cleanEmail =
      email
        .trim()
        .toLowerCase();


    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!cleanEmail) {

      showToast.error(
        "Email is required."
      );

      return;

    }


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
      clearAuthError()
    );


    try {

      /*
      |--------------------------------------------------------------------------
      | Dispatch Login Thunk
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
      | Success Toast
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
      | Navigate
      |--------------------------------------------------------------------------
      */

      navigate(
        "/admin/dashboard",
        {
          replace: true,
        }
      );

    } catch (message) {

      /*
      |--------------------------------------------------------------------------
      | Error Toast
      |--------------------------------------------------------------------------
      */

      showToast.error(

        typeof message ===
          "string"

          ? message

          : "Unable to login. Please try again."

      );

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Clear Error From LoginForm
  |--------------------------------------------------------------------------
  */

  const handleClearError =
    () => {

      dispatch(
        clearAuthError()
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

        email={email}

        setEmail={setEmail}

        password={password}

        setPassword={
          setPassword
        }

        handleSubmit={
          handleLogin
        }

        error={error}

        setError={
          handleClearError
        }

        loading={loading}

      />

    </div>

  );

}