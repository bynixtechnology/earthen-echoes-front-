import React from "react";
import { C } from "../../../constants/theme";

const ContactHeroSection = () => {
  return (
    <section
      className="py-16 border-b"
      style={{
        background: C.cream,
        borderColor: `${C.dark}15`,
      }}
    >
      <div className="max-w-3xl mx-auto px-4 text-center">

        <span
          className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
          style={{
            background: `${C.coral}15`,
            color: C.coral,
            border: `1px solid ${C.coral}30`,
          }}
        >
          Get in Touch
        </span>

        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: C.dark,
          }}
        >
          We'd Love to Hear From You
        </h1>

        <p
          className="text-sm sm:text-base leading-8 max-w-lg mx-auto"
          style={{
            color: "#6B5B4E",
          }}
        >
          Have a question about our collections, custom orders, or shipping?
          Reach out and our Jaipur heritage team will assist you shortly.
        </p>

        <div
          className="w-16 h-1 rounded-full mx-auto mt-8"
          style={{
            background: `linear-gradient(90deg, ${C.coral}, ${C.teal})`,
          }}
        />
      </div>
    </section>
  );
};

export default ContactHeroSection;