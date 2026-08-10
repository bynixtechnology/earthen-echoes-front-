import {
  Outlet,
} from "react-router-dom";

import {
  Phone,
  ArrowUp,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Common Components
|--------------------------------------------------------------------------
*/

import Header from "../component/common/Header";
import Footer from "../component/common/Footer";
import GoogleSignupPrompt from "../component/common/GoogleSignupPrompt";


const MainLayout = () => {

  /*
  |--------------------------------------------------------------------------
  | Back To Top
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

    <div
      className="
        min-h-screen
        flex
        flex-col
      "
    >

      {/* ================================================================
          HEADER
      ================================================================= */}

      <Header />


      {/* ================================================================
          FIRST VISIT GOOGLE SIGNUP PROMPT
      ================================================================= */}

      <GoogleSignupPrompt />


      {/* ================================================================
          PAGE CONTENT
      ================================================================= */}

      <main
        className="
          flex-1
        "
      >

        <Outlet />

      </main>


      {/* ================================================================
          FOOTER
      ================================================================= */}

      <Footer />


      {/* ================================================================
          WHATSAPP FLOATING BUTTON (Bottom Right)
      ================================================================= */}

      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"

        className="
          fixed

          bottom-5
          right-4
          sm:bottom-6
          sm:right-6

          z-50

          flex

          h-12
          w-12
          sm:h-14
          sm:w-14

          items-center
          justify-center

          rounded-full

          bg-[#25D366]
          text-white

          shadow-2xl

          transition-all
          duration-300

          hover:scale-110

          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
        "
      >

        <Phone
          size={22}
          className="sm:w-[26px] sm:h-[26px]"
        />

      </a>


      {/* ================================================================
          BACK TO TOP (Staggered above WhatsApp on Mobile, Left on Desktop)
      ================================================================= */}

      <button
        type="button"

        onClick={
          handleBackToTop
        }

        aria-label="Back to top"

        className="
          fixed

          bottom-20
          right-4
          sm:bottom-6
          sm:left-6

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
          text-foreground

          shadow-lg

          transition-all
          duration-300

          hover:bg-muted
          hover:-translate-y-1

          focus:outline-none
          focus:ring-2
          focus:ring-ring
          focus:ring-offset-2
        "
      >

        <ArrowUp
          size={18}
        />

      </button>

    </div>

  );

};


export default MainLayout;