import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestRoute = () => {
  // Read state from Redux (if available) with localStorage fallback
  const reduxToken = useSelector((state) => state.auth?.token);
  const reduxUser = useSelector((state) => state.auth?.user);

  const token = reduxToken || localStorage.getItem("userToken");
  const savedUserData = localStorage.getItem("userData");

  let user = reduxUser;

  // Fallback to localStorage if user object not in Redux state
  if (!user && savedUserData) {
    try {
      user = JSON.parse(savedUserData);
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      return <Outlet />;
    }
  }

  // If user is not logged in -> Allow login/register pages
  if (!token || !user) {
    return <Outlet />;
  }

  // If already logged in -> Redirect based on role
  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/user/profile" replace />;
};

export default GuestRoute;