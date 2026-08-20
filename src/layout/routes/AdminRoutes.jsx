import {
  Navigate,
} from "react-router-dom";

import AdminLayout from "../AdminLayout";

import AdminProtectedRoute from "./AdminProtectedRoute";

import AdminLogin from "../../component/page/admin/AdminLogin";
import Dashboard from "../../component/page/admin/Dashboard";
import AddCategory from "../../component/page/admin/AddCategory";
import AddProduct from "../../component/page/admin/AddProduct";
import EditProduct from "../../component/page/admin/EditProduct";
import AddProductTag from "../../component/page/admin/AddProductTag";
import AllUsers from "../../component/page/admin/AllUsers"; // 👈 Imported AllUsers Component
import AllOrders from "../../component/page/admin/AllOrders";

const adminRoutes = [
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  {
    element: <AdminProtectedRoute />,

    children: [
      {
        path: "/admin",
        element: <AdminLayout />,

        children: [
          {
            index: true,
            element: (
              <Navigate
                to="dashboard"
                replace
              />
            ),
          },

          {
            path: "users", // 👈 Route for /admin/users
            element: <AllUsers />,
          },

          {
            path: "product",
            element: <Dashboard />,
          },

          {
            path: "add-product",
            element: <AddProduct />,
          },

          {
            path: "edit-product/:id",
            element: <EditProduct />,
          },

          {
            path: "add-category",
            element: <AddCategory />,
          },

          {
            path: "add-product-tags",
            element: <AddProductTag />,
          },
           {
            path: "order",
            element: <AllOrders />,
          },
        ],
      },
    ],
  },
];

export default adminRoutes;