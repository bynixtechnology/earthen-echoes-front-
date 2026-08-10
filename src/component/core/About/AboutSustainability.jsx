import React from "react";
import { Leaf, Trash2, Sparkles, Package } from "lucide-react";
import { C } from "../../../constants/theme";

const sustainabilityData = [
  {
    id: 1,
    title: "Eco-Friendly Production",
    description:
      "Powered by natural fires and sun drying with zero chemical run-off.",
    icon: Leaf,
  },
  {
    id: 2,
    title: "Minimal Waste",
    description:
      "Any un-fired clay is entirely recycled and remolded into new designs.",
    icon: Trash2,
  },
  {
    id: 3,
    title: "Natural Materials",
    description:
      "Pure alluvial soil and organic plant-based binders with no synthetic additives.",
    icon: Sparkles,
  },
  {
    id: 4,
    title: "Plastic-Free Packaging",
    description:
      "Shipped strictly in biodegradable wood shavings and reinforced cardboard.",
    icon: Package,
  },
];

const AboutSustainability = () => {
  return (
    <section
      className="py-20"
      style={{
        background: `linear-gradient(135deg, ${C.darkTeal} 0%, ${C.teal} 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Heading */}
        <div className="max-w-2xl mx-auto mb-16">

          <span
            className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
            style={{
              background: "rgba(255,255,255,.12)",
              color: C.ivory,
              border: "1px solid rgba(255,255,255,.18)",
            }}
          >
            Sustainability
          </span>

          <h2
            className="text-3xl lg:text-5xl font-bold mb-5"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: C.ivory,
            }}
          >
            Our Sustainable Commitment
          </h2>

          <p
            className="leading-8"
            style={{
              color: "rgba(255,255,255,.85)",
            }}
          >
            We believe luxury should never cost the earth. Every aspect of our
            production process is optimized to respect nature and preserve
            resources.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {sustainabilityData.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.12)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{
                    background: `${C.green}25`,
                  }}
                >
                  <Icon
                    size={32}
                    color={C.green}
                    strokeWidth={2.2}
                  />
                </div>

                <h3
                  className="text-xl font-bold mb-4"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: C.ivory,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="text-sm leading-7"
                  style={{
                    color: "rgba(255,255,255,.75)",
                  }}
                >
                  {item.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default AboutSustainability;