import {
  Routes,
  Route,
} from "react-router-dom";

import {
  Phone,
  ArrowUp,
} from "lucide-react";

import {
  Toaster,
} from "react-hot-toast";

import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";

import Home from "./component/page/Home";
import About from "./component/page/About";
import Contact from "./component/page/Contact";
import Product from "./component/page/Product";
import ProductDetails from "./component/page/ProductDetails";
import CartPage from "./component/page/CartPage";

import AdminLogin from "./component/page/admin/AdminLogin";
import Dashboard from "./component/page/admin/Dashboard";
import AddProduct from "./component/page/admin/AddProduct";
import AddCategory from "./component/page/admin/AddCategory";

import ProtectedRoute from "./component/core/admin/ProtectedRoute";

import ScrollToTop from "./component/core/ScrollToTop";


function App() {

  /*
  |--------------------------------------------------------------------------
  | Manual Back To Top
  |--------------------------------------------------------------------------
  */

  const handleBackToTop = () => {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

  };


  return (

    <>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />


      {/* ================================================================
          AUTO SCROLL TO TOP ON ROUTE CHANGE
      ================================================================= */}

      <ScrollToTop />


      {/* ================================================================
          ROUTES
      ================================================================= */}

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/products"
            element={<Product />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<CartPage />}
          />

        </Route>


        {/* ================= ADMIN LOGIN ================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* ================= PROTECTED ADMIN ================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            <Route
              path="add-product"
              element={<AddProduct />}
            />

            <Route
              path="add-category"
              element={<AddCategory />}
            />

          </Route>

        </Route>

      </Routes>


      {/* ================================================================
          WHATSAPP FLOATING BUTTON
      ================================================================= */}

      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="
          fixed
          bottom-6
          right-6
          z-50
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-[#25D366]
          text-white
          shadow-2xl
          transition
          hover:scale-110
        "
      >

        <Phone size={26} />

      </a>


      {/* ================================================================
          MANUAL BACK TO TOP BUTTON
      ================================================================= */}

      <button
        type="button"
        onClick={handleBackToTop}
        aria-label="Back to top"
        className="
          fixed
          bottom-6
          left-6
          z-50
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-border
          bg-card
          shadow-lg
          transition
          hover:bg-muted
        "
      >

        <ArrowUp size={18} />

      </button>

    </>

  );

}

export default App;