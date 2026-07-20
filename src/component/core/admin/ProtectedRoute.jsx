
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { showToast } from "../../../config/toast";
import { FRONTEND_MESSAGES } from "../../../constants/messages"; 

export default function ProtectedRoute() {
  const token = localStorage.getItem("adminToken");
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!token) {
   
      showToast.error(FRONTEND_MESSAGES.AUTH.UNAUTHORIZED);
      
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [token]);

  if (!token && !shouldRedirect) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-sm">Verifying Credentials...</div>;
  }

  if (!token && shouldRedirect) {
    return <Navigate to="/admin/login" replace={true} />;
  }

  return <Outlet />;
}