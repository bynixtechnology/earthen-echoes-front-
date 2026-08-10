import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";



import App from "./App.jsx";

import { store } from "./redux/store";

import {
  CartProvider,
} from "./component/core/context/CartContext.jsx";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(
  document.getElementById("root")
).render(
  <Provider store={store}>
    <GoogleOAuthProvider
      clientId={GOOGLE_CLIENT_ID || ""}
    >
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </Provider>
);