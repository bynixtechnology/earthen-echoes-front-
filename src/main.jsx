import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";

import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/800.css";
import "@fontsource/playfair-display/900.css";
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './component/core/context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  
    <CartProvider>
      <BrowserRouter>
       <App />
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)