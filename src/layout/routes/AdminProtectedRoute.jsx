import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

const AdminProtectedRoute = () => {
  const location = useLocation();

  const adminToken = localStorage.getItem("adminToken");
  const adminUser = localStorage.getItem("adminUser");

  // No admin session
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
    const admin = JSON.parse(adminUser);

    // Invalid admin object
    if (!admin || admin.role !== "admin") {
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
  } catch (error) {
    console.error("Invalid admin session:", error);

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
};

export default AdminProtectedRoute;