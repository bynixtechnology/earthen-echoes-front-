import React from "react";
import { C } from "../../../constants/theme";

const AboutHeroSection = () => {
  return (
    <section
      className="relative h-[60vh] flex items-center justify-center overflow-hidden"
      style={{ background: C.dark }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://uxmagic.blob.core.windows.net/public/agent-images/artisan-craft-1783060841778-xbzpiwajcvf.png"
          alt="Earthen Echoes Story Banner"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              90deg,
              ${C.dark}CC 0%,
              ${C.darkTeal}99 45%,
              transparent 100%
            )`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-5">

          <span
            className="inline-block text-xs uppercase tracking-[0.18em] font-semibold px-4 py-2 rounded-full"
            style={{
              color: C.ivory,
              background: `${C.coral}22`,
              border: `1px solid ${C.coral}66`,
              backdropFilter: "blur(10px)",
            }}
          >
            Our Story
          </span>

          <h1
            className="font-bold"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem,5vw,4.5rem)",
              color: C.ivory,
            }}
          >
            Every Piece Tells a Story
          </h1>

          <p
            className="max-w-xl mx-auto leading-relaxed"
            style={{
              color: "rgba(253,248,243,0.9)",
              fontSize: "clamp(1rem,2vw,1.1rem)",
            }}
          >
            From the sacred soil of Rajasthan to your modern home sanctuary.
          </p>

        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;