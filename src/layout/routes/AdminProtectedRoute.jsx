import {
  Navigate,
  Outlet,
} from "react-router-dom";

const AdminProtectedRoute = () => {
  /*
  |--------------------------------------------------------------------------
  | Get Admin Auth Data
  |--------------------------------------------------------------------------
  */

  const adminToken =
    localStorage.getItem(
      "adminToken"
    );

  const savedAdmin =
    localStorage.getItem(
      "adminUser"
    );

  /*
  |--------------------------------------------------------------------------
  | Admin Not Logged In
  |--------------------------------------------------------------------------
  */

  if (
    !adminToken ||
    !savedAdmin
  ) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Admin
  |--------------------------------------------------------------------------
  */

  try {
    const admin =
      JSON.parse(savedAdmin);

    if (
      admin?.role !== "admin"
    ) {
      localStorage.removeItem(
        "adminToken"
      );

      localStorage.removeItem(
        "adminUser"
      );

      return (
        <Navigate
          to="/admin/login"
          replace
        />
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Admin Authorized
    |--------------------------------------------------------------------------
    */

    return <Outlet />;
  } catch (error) {
    console.error(
      "Invalid saved admin:",
      error
    );

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminUser"
    );

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }
};

export default AdminProtectedRoute;