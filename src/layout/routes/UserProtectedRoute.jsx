import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

const UserProtectedRoute = () => {
  const location = useLocation();

  /*
  |--------------------------------------------------------------------------
  | Get User Auth Data
  |--------------------------------------------------------------------------
  */

  const token =
    localStorage.getItem("token");

  const savedUser =
    localStorage.getItem("user");

  /*
  |--------------------------------------------------------------------------
  | User Not Logged In
  |--------------------------------------------------------------------------
  */

  if (!token || !savedUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Saved User
  |--------------------------------------------------------------------------
  */

  try {
    const user =
      JSON.parse(savedUser);

    /*
    |--------------------------------------------------------------------------
    | Admin Cannot Use User Protected Area
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
    | Allow Normal User
    |--------------------------------------------------------------------------
    */

    return <Outlet />;
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

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }
};

export default UserProtectedRoute;