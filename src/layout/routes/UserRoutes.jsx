import MainLayout from "../MainLayout";
import GuestRoute from "./GuestRoute";
import UserProtectedRoute from "./UserProtectedRoute";

import UserLogin from "../../component/page/user/UserLogin";
import UserRegister from "../../component/page/user/UserRegister";

import UserProfile from "../../component/page/user/Profile";
import UserOrders from "../../component/page/user/Orders";
import UserWishlist from "../../component/page/user/WishlistPage";

const userRoutes = [
  {
    element: <GuestRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/user/login",
            element: <UserLogin />,
          },
          {
            path: "/user/register",
            element: <UserRegister />,
          },
        ],
      },
    ],
  },

  {
    element: <UserProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/user/profile",
            element: <UserProfile />,
          },
          {
            path: "/user/orders",
            element: <UserOrders />,
          },
          {
            path: "/user/wishlist",
            element: <UserWishlist />,
          },
        ],
      },
    ],
  },
];

export default userRoutes;