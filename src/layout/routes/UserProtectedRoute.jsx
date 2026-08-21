import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const UserProtectedRoute = () => {
  const location = useLocation();

  // Read state from Redux store with LocalStorage fallback
  const reduxToken = useSelector((state) => state.auth?.token);
  const reduxUser = useSelector((state) => state.auth?.user);

  const token = reduxToken || localStorage.getItem("userToken");
  const savedUserData = localStorage.getItem("userData");

  let user = reduxUser;

  // Fallback to localStorage if user object is not yet populated in Redux
  if (!user && savedUserData) {
    try {
      user = JSON.parse(savedUserData);
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);

      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");

      return (
        <Navigate
          to="/user/login"
          replace
          state={{ from: location }}
        />
      );
    }
  }

  // 1. User not logged in -> Redirect to login page
  if (!token || !user) {
    return (
      <Navigate
        to="/user/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // 2. Admin role detected -> Redirect to admin dashboard
  if (user?.role === "admin") {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  // 3. Logged-in customer/user -> Grant access to protected outlet
  return <Outlet />;
};

export default UserProtectedRoute;