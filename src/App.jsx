import {
  Toaster,
} from "react-hot-toast";

import ScrollToTop from "./component/core/ScrollToTop";
import AppRoutes from "./layout/routes/AppRoutes";




function App() {
  return (
    <>

      {/* ================================================================
          GLOBAL TOASTER
      ================================================================= */}

      <Toaster
        position="top-center"
        reverseOrder={false}
      />


      {/* ================================================================
          AUTO SCROLL ON ROUTE CHANGE
      ================================================================= */}

      <ScrollToTop />


      {/* ================================================================
          APPLICATION ROUTES
      ================================================================= */}

      <AppRoutes />

    </>
  );
}


export default App;