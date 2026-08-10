import React from "react";
import { C } from "../../../constants/theme";

const workflowSteps = [
  {
    id: 1,
    title: "Clay Selection",
    description: "Sourcing mineral-rich alluvial clay from local riverbeds.",
  },
  {
    id: 2,
    title: "Hand Shaping",
    description: "Master potters mold each shape on traditional wheels.",
  },
  {
    id: 3,
    title: "Drying",
    description: "Naturally sun-dried for 3 days to remove moisture.",
  },
  {
    id: 4,
    title: "Kiln Firing",
    description: "Double-fired in wood kilns at over 1000°C for durability.",
  },
  {
    id: 5,
    title: "Finishing",
    description: "Careful hand-polishing and detailing with natural slip.",
  },
  {
    id: 6,
    title: "Packaging",
    description: "Secured in eco-friendly, plastic-free protective boxes.",
  },
];

const AboutWorkflow = () => {
  return (
    <section
      className="py-20"
      style={{ background: C.cream }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span
            className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{
              background: `${C.coral}15`,
              color: C.coral,
              border: `1px solid ${C.coral}30`,
            }}
          >
            Our Process
          </span>

          <h2
            className="text-3xl lg:text-5xl font-bold mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: C.dark,
            }}
          >
            Our Handcrafted Process
          </h2>

          <p
            className="leading-8"
            style={{ color: "#6B5B4E" }}
          >
            Six meticulous steps to transform natural earth into a luxury
            masterpiece.
          </p>

          <div
            className="w-16 h-1 mx-auto mt-5 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${C.coral}, ${C.teal})`,
            }}
          />
        </div>

        {/* Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {workflowSteps.map((step) => (
            <div
              key={step.id}
              className="rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2"
              style={{
                background: "#fff",
                border: `1px solid ${C.paleCoral}`,
                boxShadow: "0 10px 30px rgba(28,18,8,.06)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold"
                style={{
                  background: C.coral,
                }}
              >
                {step.id}
              </div>

              <h3
                className="text-lg font-bold mb-2"
                style={{
                  color: C.dark,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {step.title}
              </h3>

              <p
                className="text-sm leading-7"
                style={{
                  color: "#6B5B4E",
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutWorkflow;