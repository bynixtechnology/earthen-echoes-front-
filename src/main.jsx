import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

/*
|--------------------------------------------------------------------------
| CSS
|--------------------------------------------------------------------------
*/

import "./index.css";


/*
|--------------------------------------------------------------------------
| Fonts
|--------------------------------------------------------------------------
*/

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";

import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/800.css";
import "@fontsource/playfair-display/900.css";


/*
|--------------------------------------------------------------------------
| App
|--------------------------------------------------------------------------
*/

import App from "./App.jsx";


/*
|--------------------------------------------------------------------------
| Redux Store
|--------------------------------------------------------------------------
*/

import store from "./redux/store.js";


/*
|--------------------------------------------------------------------------
| Context Providers
|--------------------------------------------------------------------------
*/

import { CartProvider } from "./component/core/context/CartContext.jsx";


/*
|--------------------------------------------------------------------------
| Google Client ID
|--------------------------------------------------------------------------
*/

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID;


/*
|--------------------------------------------------------------------------
| Validate Google Client ID
|--------------------------------------------------------------------------
*/

if (!GOOGLE_CLIENT_ID) {

  console.warn(
    "VITE_GOOGLE_CLIENT_ID is missing from frontend .env file."
  );

}


/*
|--------------------------------------------------------------------------
| Render Application
|--------------------------------------------------------------------------
*/

createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

    {/* Redux available in complete application */}

    <Provider store={store}>

      {/* Google OAuth available in complete application */}

      <GoogleOAuthProvider
        clientId={GOOGLE_CLIENT_ID || ""}
      >

        {/* React Router */}

        <BrowserRouter>

          {/* Cart Context */}

          <CartProvider>

            <App />

          </CartProvider>

        </BrowserRouter>

      </GoogleOAuthProvider>

    </Provider>

  </StrictMode>

);