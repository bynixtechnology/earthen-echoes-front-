import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

const UserProtectedRoute = () => {
  const location = useLocation();

  // LocalStorage keys
  const token = localStorage.getItem("userToken");
  const savedUser = localStorage.getItem("userData");

  // User not logged in
  if (!token || !savedUser) {
    return (
      <Navigate
        to="/user/login"
        replace
        state={{ from: location }}
      />
    );
  }

  try {
    const user = JSON.parse(savedUser);

    // Admin should not access user routes
    if (user?.role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    // Logged in user
    return <Outlet />;
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");

    return (
      <Navigate
        to="/user/login"
        replace
      />
    );
  }
};

export default UserProtectedRoute;