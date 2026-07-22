import {
  Navigate,
  Outlet,
} from "react-router-dom";

const GuestRoute = () => {
  /*
  |--------------------------------------------------------------------------
  | User Authentication
  |--------------------------------------------------------------------------
  */

  const token =
    localStorage.getItem("token");

  const savedUser =
    localStorage.getItem("user");

  /*
  |--------------------------------------------------------------------------
  | No Login → Allow Login/Register
  |--------------------------------------------------------------------------
  */

  if (!token || !savedUser) {
    return <Outlet />;
  }

  /*
  |--------------------------------------------------------------------------
  | Already Logged In
  |--------------------------------------------------------------------------
  */

  try {
    const user =
      JSON.parse(savedUser);

    /*
    |--------------------------------------------------------------------------
    | Admin
    |--------------------------------------------------------------------------
    */

    if (user?.role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Normal User
    |--------------------------------------------------------------------------
    */

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  } catch (error) {
    console.error(
      "Invalid saved user:",
      error
    );

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    return <Outlet />;
  }
};

export default GuestRoute;