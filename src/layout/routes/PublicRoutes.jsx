// src/routes/PublicRoutes.js

import MainLayout from "../MainLayout"; 

import Home from "../../component/page/public/Home"; 
import About from "../../component/page/public/About"; 
import Contact from "../../component/page/public/Contact"; 
import Product from "../../component/page/public/Product"; 
import ProductDetails from "../../component/page/public/ProductDetails"; 
import CartPage from "../../component/page/public/CartPage"; 
import WishlistPage from "../../component/page/user/WishlistPage"; 

// 🟢 Policy Pages Imports
import TermsAndConditions from "../../component/page/public/TermsAndConditions"; 
import PrivacyPolicy from "../../component/page/public/PrivacyPolicy"; 
import ShippingPolicy from "../../component/page/public/ShippingPolicy"; 
import RefundPolicy from "../../component/page/public/RefundPolicy"; 

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
        path: "products/:slug", 
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
      { 
        path: "user/wishlist", 
        element: <WishlistPage />, 
      }, 

      /* 🟢 MANDATORY PAYMENT GATEWAY POLICY ROUTES */
      { 
        path: "terms-and-conditions", 
        element: <TermsAndConditions />, 
      }, 
      { 
        path: "privacy-policy", 
        element: <PrivacyPolicy />, 
      }, 
      { 
        path: "shipping-policy", 
        element: <ShippingPolicy />, 
      }, 
      { 
        path: "refund-policy", 
        element: <RefundPolicy />, 
      }, 
    ], 
  }, 
]; 

export default publicRoutes;