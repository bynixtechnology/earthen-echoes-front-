import {
  Navigate,
} from "react-router-dom";

/*
|--------------------------------------------------------------------------
| Layout
|--------------------------------------------------------------------------
*/

import AdminLayout from "../AdminLayout";

/*
|--------------------------------------------------------------------------
| Route Guard
|--------------------------------------------------------------------------
*/

import AdminProtectedRoute from "./AdminProtectedRoute";

/*
|--------------------------------------------------------------------------
| Admin Pages
|--------------------------------------------------------------------------
*/

import AdminLogin from "../../component/page/admin/AdminLogin";
import Dashboard from "../../component/page/admin/Dashboard";
import AddCategory from "../../component/page/admin/AddCategory";
import AddProduct from "../../component/page/admin/AddProduct";

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Routes are NOT changed:
|
| /admin/login
| /admin
| /admin/dashboard
| /admin/add-product
| /admin/add-category
|
*/

const adminRoutes = [
  /*
  |--------------------------------------------------------------------------
  | Admin Login
  |--------------------------------------------------------------------------
  */

  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  /*
  |--------------------------------------------------------------------------
  | Admin Protected Routes
  |--------------------------------------------------------------------------
  */

  {
    element: <AdminProtectedRoute />,

    children: [
      /*
      |--------------------------------------------------------------------------
      | Admin Layout
      |--------------------------------------------------------------------------
      */

      {
        path: "/admin",
        element: <AdminLayout />,

        children: [
          /*
          |--------------------------------------------------------------------------
          | /admin -> /admin/dashboard
          |--------------------------------------------------------------------------
          */

          {
            index: true,

            element: (
              <Navigate
                to="dashboard"
                replace
              />
            ),
          },

          /*
          |--------------------------------------------------------------------------
          | Dashboard
          |--------------------------------------------------------------------------
          |
          | Final URL:
          | /admin/dashboard
          |
          */

          {
            path: "dashboard",
            element: <Dashboard />,
          },

          /*
          |--------------------------------------------------------------------------
          | Add Product
          |--------------------------------------------------------------------------
          |
          | Final URL:
          | /admin/add-product
          |
          */

          {
            path: "add-product",
            element: <AddProduct />,
          },

          /*
          |--------------------------------------------------------------------------
          | Add Category
          |--------------------------------------------------------------------------
          |
          | Final URL:
          | /admin/add-category
          |
          */

          {
            path: "add-category",
            element: <AddCategory />,
          },
        ],
      },
    ],
  },
];

export default adminRoutes;