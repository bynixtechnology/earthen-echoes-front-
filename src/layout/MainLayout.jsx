import { Outlet } from "react-router-dom";
import Header from "../component/common/Header";
import Footer from "../component/common/Footer";
import { Phone, ArrowUp } from "lucide-react";
const MainLayout = () => {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <Header />

      <main className="min-h-screen">
        <Outlet />
      </main>

      <Footer />

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


      {/* Back To Top - ONLY PUBLIC ROUTES */}

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
};

export default MainLayout;