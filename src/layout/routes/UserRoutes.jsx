import MainLayout from "../MainLayout";
import GuestRoute from "./GuestRoute";
import UserProtectedRoute from "./UserProtectedRoute";
import UserLogin from "../../component/page/user/UserLogin";
import UserRegister from "../../component/page/user/UserRegister";



const userRoutes = [

  {
    element: <GuestRoute />,

    children: [

      {
        element: <MainLayout />,

        children: [

          /*
          |--------------------------------------------------------------------------
          | User Login
          |--------------------------------------------------------------------------
          */

          {
            path: "user/login",
            element: <UserLogin />,
          },


          /*
          |--------------------------------------------------------------------------
          | User Register
          |--------------------------------------------------------------------------
          */

          {
            path: "user/register",
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
        ],
      },

    ],
  },

];


export default userRoutes;