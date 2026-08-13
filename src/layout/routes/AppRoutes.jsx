import { Navigate, useRoutes } from "react-router-dom";

import publicRoutes from "./PublicRoutes";
import userRoutes from "./UserRoutes";
import adminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  const routes = [
    // 1. Public Routes (Home, About, Contact, Products, etc.)
    ...(publicRoutes || []),

    // 2. User Routes (Login, Register, Profile, Orders, Checkout)
    ...(userRoutes || []),

    // 3. Admin Routes (Admin Dashboard, Add/Edit Product)
    ...(adminRoutes || []),

    // 4. Catch-all fallback for undefined routes
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ];

  return useRoutes(routes);
};

export default AppRoutes;