import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();

  const adminToken = localStorage.getItem("adminToken");
  const adminUser = localStorage.getItem("adminUser");

  // Admin not logged in
  if (!adminToken || !adminUser) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  try {
    const parsedAdmin = JSON.parse(adminUser);

    // Invalid admin object
    if (
      !parsedAdmin ||
      parsedAdmin.role !== "admin"
    ) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      return (
        <Navigate
          to="/admin/login"
          replace
          state={{ from: location }}
        />
      );
    }
  } catch (error) {
    console.error(
      "Invalid admin session:",
      error
    );

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;