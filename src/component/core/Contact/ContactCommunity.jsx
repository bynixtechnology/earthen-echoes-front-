import React from "react";
import {
  Image,
  ThumbsUp,
  Bookmark,
  PhoneCall,
} from "lucide-react";
import { C, img } from "../../../constants/theme";

const socialLinks = [
  {
    id: 1,
    title: "Instagram",
    href: "#",
    icon: Image,
  },
  {
    id: 2,
    title: "Facebook",
    href: "#",
    icon: ThumbsUp,
  },
  {
    id: 3,
    title: "Pinterest",
    href: "#",
    icon: Bookmark,
  },
  {
    id: 4,
    title: "WhatsApp",
    href: "https://wa.me/919876543210",
    icon: PhoneCall,
  },
];

const ContactCommunity = () => {
  return (
    <section
      className="py-20"
      style={{
        background: `linear-gradient(135deg, ${C.darkTeal} 0%, ${C.teal} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorations */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "rgba(255,255,255,.06)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: -60,
          bottom: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `${C.coral}25`,
          filter: "blur(10px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto">

          {/* Badge */}
          <span
            className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
            style={{
              background: "rgba(255,255,255,.12)",
              color: C.ivory,
              border: "1px solid rgba(255,255,255,.18)",
            }}
          >
            Join Our Community
          </span>

          {/* Heading */}
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{
              color: C.ivory,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Connect With Our Heritage Community
          </h2>

          {/* Description */}
          <p
            className="mt-6 text-sm md:text-base max-w-2xl mx-auto leading-8"
            style={{
              color: "rgba(255,255,255,.82)",
            }}
          >
            Stay updated with daily artisan wheel-throwing videos, live kiln
            firings, behind-the-scenes craftsmanship, and interior design
            inspiration from Earthen Echoes.
          </p>

          {/* Social Icons */}
          <div className="mt-10 flex items-center justify-center gap-5 flex-wrap">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  target={
                    item.title === "WhatsApp"
                      ? "_blank"
                      : "_self"
                  }
                  rel="noopener noreferrer"
                  title={item.title}
                  className="transition-all duration-300 hover:scale-110"
                  style={{
                    width: 56,
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,.12)",
                    color: C.ivory,
                    border: "1px solid rgba(255,255,255,.18)",
                    backdropFilter: "blur(10px)",
                    boxShadow:
                      "0 10px 25px rgba(0,0,0,.08)",
                  }}
                >
                  <Icon size={22} strokeWidth={2.2} />
                </a>
              );
            })}
          </div>

          {/* Community Image */}
          <div
            className="mt-14 overflow-hidden rounded-3xl"
            style={{
              boxShadow:
                "0 25px 60px rgba(0,0,0,.18)",
            }}
          >
            <img
              src={img(
                "1493106641515-6b5631de4bb9",
                1200,
                500
              )}
              alt="Earthen Echoes Community"
              className="w-full h-[220px] sm:h-[320px] lg:h-[380px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCommunity;