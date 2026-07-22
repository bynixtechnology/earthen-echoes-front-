import MainLayout from "../MainLayout";

import Home from "../../component/page/public/Home";
import About from "../../component/page/public/About";
import Contact from "../../component/page/public/Contact";
import Product from "../../component/page/public/Product";
import ProductDetails from "../../component/page/public/ProductDetails";
import UserLogin from "../../component/page/user/UserLogin";

const publicRoutes = [
  {
    element: <MainLayout />,

    children: [
 
      {
        index: true,
        element: <Home />,
      },

      {
        path: "about",
        element: <About />,
      },

      {
        path: "contact",
        element: <Contact />,
      },


      {
        path: "products",
        element: <Product />,
      },


      {
        path: "products/:id",
        element: <ProductDetails />,
      },

      {
        path: "user/login",
        element: <UserLogin />,
      },


      // {
      //   path: "cart",
      //   element: <CartPage />,
      // },
    ],
  },
];

export default publicRoutes;