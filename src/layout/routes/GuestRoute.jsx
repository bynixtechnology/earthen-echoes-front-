import React from "react";
import {
  Navigate,
  Outlet,
} from "react-router-dom";

const GuestRoute = () => {
  // Read correct localStorage keys
  const token = localStorage.getItem("userToken");
  const savedUser = localStorage.getItem("userData");

  // Not logged in -> allow login/register pages
  if (!token || !savedUser) {
    return <Outlet />;
  }

  try {
    const user = JSON.parse(savedUser);

    // Admin user
    if (user?.role === "admin") {
      return (
        <Navigate
          to="/admin/product"
          replace
        />
      );
    }

    // Normal user
    return (
      <Navigate
        to="/user/profile"
        replace
      />
    );
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");

    return <Outlet />;
  }
};

export default GuestRoute;