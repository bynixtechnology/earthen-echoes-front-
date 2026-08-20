import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaWhatsapp,
} from "react-icons/fa";
import { C } from "../../../constants/theme";

// const DUMMY_BG_IMAGE =
//   "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1920&q=80";

const socialLinks = [
  {
    id: 1,
    title: "Instagram",
    href: "https://www.instagram.com/earthen.echoes.jaipur/",
    icon: FaInstagram,
    hoverBg: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
  },
  {
    id: 2,
    title: "Facebook",
    href: "https://www.facebook.com/Earthen.Echoes.Jaipur/",
    icon: FaFacebookF,
    hoverBg: "#1877F2",
  },
  
  {
    id: 4,
    title: "WhatsApp",
    href: "https://wa.me/919772790222",
    icon: FaWhatsapp,
    hoverBg: "#25D366",
  },
];

const ContactCommunity = () => {
  return (
    <section
      className="relative py-28 lg:py-36 overflow-hidden text-center bg-cover bg-center bg-no-repeat"
      style={{
  backgroundImage: `url("/ContactEnd.png")`,
}}
    >
      {/* Balanced Transparent Overlay: Image + Color Blend */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        
      />

      {/* Subtle Glow Accents */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[30rem] h-[30rem] rounded-full pointer-events-none mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-[-15%] left-[-10%] w-[26rem] h-[26rem] rounded-full pointer-events-none mix-blend-screen"
        style={{
          background: `radial-gradient(circle, ${C.coral || "#ff7a59"}20 0%, rgba(0,0,0,0) 75%)`,
          filter: "blur(50px)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Badge */}
          <span
            className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              color: C.ivory || "#fbf9f5",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            Join Our Community
          </span>

          {/* Heading */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.2] drop-shadow-md"
            style={{
              color: C.ivory || "#fbf9f5",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Connect With Our Heritage Community
          </h2>

          {/* Description */}
          <p
            className="mt-5 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto drop-shadow-sm font-medium"
            style={{
              color: C.ivory || "#fbf9f5",
            }}
          >
            Stay updated with daily artisan wheel-throwing loops, live kiln
            firings, raw behind-the-scenes craft processes, and timeless interior 
            design curation directly from our Jaipur studio.
          </p>

          {/* Social Platform Links */}
          <div className="mt-10 flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Follow us on ${item.title}`}
                  aria-label={item.title}
                  className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-md"
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    color: C.ivory || "#fbf9f5",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = item.hoverBg;
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
                  }}
                >
                  <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
                </a>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactCommunity;