import React from "react";
import { C } from "../../../constants/theme";

const AboutJourney = () => {
  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{ background: C.ivory }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Content */}
        <div className="space-y-6">
          <span
            className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest"
            style={{
              background: `${C.coral}15`,
              color: C.coral,
              border: `1px solid ${C.coral}30`,
            }}
          >
            Our Journey
          </span>

          <h2
            className="text-3xl lg:text-5xl font-bold"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: C.dark,
            }}
          >
            The Journey of Earthen Echoes
          </h2>

          <p
            className="leading-8"
            style={{
              color: "#6B5B4E",
            }}
          >
            Earthen Echoes was born from a desire to bridge the gap between
            ancient heritage craftsmanship and modern luxury living. Based in
            Jaipur, India, we work directly with native pottery clusters to
            bring you authentic, premium terracotta home décor.
          </p>

          <p
            className="leading-8"
            style={{
              color: "#6B5B4E",
            }}
          >
            Our products are made using traditional clay-molding techniques
            passed down through generations. By utilizing natural Banas
            riverbed clay and wooden-fired kilns, we ensure every piece carries
            the true warmth of the earth while promoting sustainable,
            zero-plastic lifestyles.
          </p>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">

            <div
              className="rounded-2xl p-6"
              style={{
                background: C.paleCoral,
                border: `1px solid ${C.coral}25`,
              }}
            >
              <h3
                className="text-xl font-bold mb-2"
                style={{
                  color: C.coral,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Our Mission
              </h3>

              <p
                className="text-sm leading-7"
                style={{ color: "#6B5B4E" }}
              >
                To preserve India's pottery heritage while creating beautiful,
                sustainable modern home décor.
              </p>
            </div>

            <div
              className="rounded-2xl p-6"
              style={{
                background: C.paleTeal,
                border: `1px solid ${C.teal}25`,
              }}
            >
              <h3
                className="text-xl font-bold mb-2"
                style={{
                  color: C.teal,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Our Vision
              </h3>

              <p
                className="text-sm leading-7"
                style={{ color: "#6B5B4E" }}
              >
                To become India's most loved handcrafted terracotta lifestyle
                brand across the globe.
              </p>
            </div>

          </div>
        </div>

        {/* Right Image */}
        <div
          className="relative overflow-hidden rounded-3xl shadow-2xl"
          style={{
            boxShadow: "0 30px 70px rgba(28,18,8,.15)",
          }}
        >
          <img
          src="/about9.png"
            alt="Earthen Echoes Clay Pottery"
            className="w-full h-[380px] sm:h-[450px] lg:h-[520px] object-cover"
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,transparent 55%,rgba(28,18,8,.25) 100%)",
            }}
          />
        </div>

      </div>
    </section>
  );
};

export default AboutJourney;