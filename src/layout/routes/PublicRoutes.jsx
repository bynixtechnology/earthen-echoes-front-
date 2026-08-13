// src/routes/PublicRoutes.js

import MainLayout from "../MainLayout"; 

import Home from "../../component/page/public/Home"; 
import About from "../../component/page/public/About"; 
import Contact from "../../component/page/public/Contact"; 
import Product from "../../component/page/public/Product"; 
import ProductDetails from "../../component/page/public/ProductDetails"; 
import CartPage from "../../component/page/public/CartPage"; 
import WishlistPage from "../../component/page/user/WishlistPage"; 

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
        path: "cart", 
        element: <CartPage />, 
      }, 
      { 
        path: "wishlist", 
        element: <WishlistPage />, 
      }, 
      /* 🟢 ADD THIS LINE TO FIX /user/wishlist URL MATCH */
      { 
        path: "user/wishlist", 
        element: <WishlistPage />, 
      }, 
    ], 
  }, 
]; 

export default publicRoutes;