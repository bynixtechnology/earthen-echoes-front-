import React from "react";
import MainLayout from "../MainLayout";

import GuestRoute from "./GuestRoute";
import UserProtectedRoute from "./UserProtectedRoute";

/*
|--------------------------------------------------------------------------
| Auth Pages
|--------------------------------------------------------------------------
|
| Pages create hone ke baad uncomment kar dena.
|
*/

// import Login from "../component/page/auth/Login";
// import Register from "../component/page/auth/Register";

/*
|--------------------------------------------------------------------------
| User Pages
|--------------------------------------------------------------------------
*/

// import UserDashboard from "../component/page/user/Dashboard";
// import Profile from "../component/page/user/Profile";
// import Orders from "../component/page/user/Orders";
// import Wishlist from "../component/page/user/Wishlist";

/*
|--------------------------------------------------------------------------
| User Routes Configuration
|--------------------------------------------------------------------------
*/

const userRoutes = [
  /*
  |--------------------------------------------------------------------------
  | Guest Only Routes
  |--------------------------------------------------------------------------
  |
  | Sirf non-logged-in users access karenge.
  |
  | Example:
  | /login
  | /register
  |
  */

  {
    element: <GuestRoute />,

    children: [
      /*
      {
        path: "login",
        element: <Login />,
      },

      {
        path: "register",
        element: <Register />,
      },
      */
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | User Protected Routes
  |--------------------------------------------------------------------------
  |
  | Login required.
  |
  | MainLayout use hone ki wajah se:
  |
  | Header
  | User Page
  | Footer
  |
  | sab available rahenge.
  |
  */

  {
    element: <UserProtectedRoute />,

    children: [
      {
        element: <MainLayout />,

        children: [
          /*
          |--------------------------------------------------------------------------
          | User Dashboard
          |--------------------------------------------------------------------------
          */

          /*
          {
            path: "dashboard",
            element: <UserDashboard />,
          },
          */

          /*
          |--------------------------------------------------------------------------
          | Profile
          |--------------------------------------------------------------------------
          */

          /*
          {
            path: "profile",
            element: <Profile />,
          },
          */

          /*
          |--------------------------------------------------------------------------
          | Orders
          |--------------------------------------------------------------------------
          */

          /*
          {
            path: "orders",
            element: <Orders />,
          },
          */

          /*
          |--------------------------------------------------------------------------
          | Wishlist
          |--------------------------------------------------------------------------
          */

          /*
          {
            path: "wishlist",
            element: <Wishlist />,
          },
          */
        ],
      },
    ],
  },
];

export default userRoutes;