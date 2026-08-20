import React from "react";
import { C } from "../../../constants/theme";

const AboutHeroSection = () => {
  return (
    <section
      className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{ background: C.dark }}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0">
        <img
          src="/about7.png"
          alt="Earthen Echoes Story Banner"
          className="w-full h-full object-cover "
        />

        {/* Balanced Dark Overlay for clear text readability without hiding pots */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              180deg,
              rgba(28, 18, 8, 0.45) 0%,
              rgba(15, 46, 42, 0.65) 50%,
              rgba(28, 18, 8, 0.75) 100%
            )`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 text-center py-16">
        <div className="max-w-3xl mx-auto space-y-6">

          <span
            className="inline-block text-xs uppercase tracking-[0.2em] font-semibold px-4 py-2 rounded-full backdrop-blur-md"
            style={{
              color: C.ivory,
              background: `${C.coral}33`,
              border: `1px solid ${C.coral}88`,
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            Our Story
          </span>

          <h1
            className="font-bold tracking-tight leading-tight drop-shadow-lg"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
              color: C.ivory,
            }}
          >
            Every Piece Tells a Story
          </h1>

          <p
            className="max-w-xl mx-auto leading-relaxed drop-shadow-md font-medium"
            style={{
              color: "rgba(253, 248, 243, 0.95)",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
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