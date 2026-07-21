import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";



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

  


  return (

    <>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />


      <ScrollToTop />


      <Routes>

        {/* ============================================================
            PUBLIC WEBSITE
        ============================================================ */}

        <Route
          element={<MainLayout />}
        >

          <Route
            index
            element={<Home />}
          />

          <Route
            path="about"
            element={<About />}
          />

          <Route
            path="contact"
            element={<Contact />}
          />

          <Route
            path="products"
            element={<Product />}
          />

          <Route
            path="products/:id"
            element={<ProductDetails />}
          />

          <Route
            path="cart"
            element={<CartPage />}
          />

        </Route>


        {/* ============================================================
            ADMIN LOGIN
        ============================================================ */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* ============================================================
            PROTECTED ADMIN ROUTES
        ============================================================ */}

        <Route
          element={<ProtectedRoute />}
        >

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            {/* /admin -> /admin/dashboard */}

            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />


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


        {/* ============================================================
            UNKNOWN ROUTE
        ============================================================ */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>


     

    </>

  );

}


export default App;