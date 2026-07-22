import MainLayout from "../MainLayout";

import Home from "../../component/page/public/Home";
import About from "../../component/page/public/About";
import Contact from "../../component/page/public/Contact";
import Product from "../../component/page/public/Product";
import ProductDetails from "../../component/page/public/ProductDetails";


const publicRoutes = [
  {
    element: <MainLayout />,

    children: [

      /*
      |--------------------------------------------------------------------------
      | Home
      |--------------------------------------------------------------------------
      */

      {
        index: true,
        element: <Home />,
      },


      /*
      |--------------------------------------------------------------------------
      | About
      |--------------------------------------------------------------------------
      */

      {
        path: "about",
        element: <About />,
      },


      /*
      |--------------------------------------------------------------------------
      | Contact
      |--------------------------------------------------------------------------
      */

      {
        path: "contact",
        element: <Contact />,
      },


      /*
      |--------------------------------------------------------------------------
      | Products
      |--------------------------------------------------------------------------
      */

      {
        path: "products",
        element: <Product />,
      },


      /*
      |--------------------------------------------------------------------------
      | Product Details
      |--------------------------------------------------------------------------
      */

      {
        path: "products/:id",
        element: <ProductDetails />,
      },


      /*
      |--------------------------------------------------------------------------
      | Cart
      |--------------------------------------------------------------------------
      */

      // {
      //   path: "cart",
      //   element: <CartPage />,
      // },

    ],
  },
];


export default publicRoutes;