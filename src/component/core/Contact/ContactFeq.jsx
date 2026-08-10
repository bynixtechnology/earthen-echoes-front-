import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { C, img } from "../../../constants/theme";

const faqs = [
  {
    question:
      "Do you deliver terracotta planters and urlis safely without breaking?",
    answer:
      "Yes, absolutely. We have partnered with premium express logistics networks and utilize specialized, shatterproof 5-layer corrugated packaging lined with biodegradable wood wool shavings. Every shipment is fully insured, and in the rare event of damage, we offer an immediate free replacement.",
  },
  {
    question:
      "Can we request custom sizes or custom relief carvings?",
    answer:
      'Yes! For custom sizes, personalized motifs, or specific design patterns, choose "Bulk Orders & Customization" in our contact form. Custom handcrafted orders usually require 4–6 weeks.',
  },
  {
    question:
      "Do you offer corporate gifting solutions or bulk discounts?",
    answer:
      "Yes. We provide custom corporate gifting, logo engraving, sustainable packaging, and wholesale pricing for hotels, architects, resorts, and wedding planners.",
  },
  {
    question:
      "How do I care for my terracotta pottery?",
    answer:
      "Terracotta is naturally breathable. Clean it using a soft damp cloth and avoid harsh chemicals. A white mineral patina is completely natural.",
  },
];

const ContactFeq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
   <section
  className="py-20"
  style={{
    background: C.cream,
    borderTop: `1px solid ${C.paleCoral}`,
  }}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="grid lg:grid-cols-2 gap-16 items-center">

      {/* FAQ */}
      <div>

        <div className="text-center lg:text-left mb-14">
          <span
            className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
            style={{
              background: `${C.coral}15`,
              color: C.coral,
              border: `1px solid ${C.coral}30`,
            }}
          >
            FAQs
          </span>

          <h2
            className="text-3xl lg:text-5xl font-bold mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: C.dark,
            }}
          >
            Frequently Asked Questions
          </h2>

          <p
            style={{
              color: "#6B5B4E",
              lineHeight: 1.8,
            }}
          >
            Everything you need to know about our handcrafted terracotta
            delivery, customization, and wholesale models.
          </p>

          <div
            className="w-16 h-1 rounded-full mt-6"
            style={{
              background: `linear-gradient(90deg, ${C.coral}, ${C.teal})`,
            }}
          />
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#fff",
                border: `1px solid ${C.paleCoral}`,
                boxShadow: "0 8px 24px rgba(28,18,8,.05)",
              }}
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? -1 : index)
                }
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <span
                  style={{
                    color: C.dark,
                    fontWeight: 700,
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {faq.question}
                </span>

                <ChevronRight
                  size={22}
                  color={C.coral}
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-90" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ${
                  openIndex === index
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p
                    className="px-8 pb-6 text-sm leading-7"
                    style={{
                      color: "#6B5B4E",
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Right Image */}
      <div className="hidden lg:block">
        <div
          className="overflow-hidden rounded-3xl"
          style={{
            boxShadow: "0 30px 70px rgba(28,18,8,.12)",
          }}
        >
          <img
            src={img("1493106641515-6b5631de4bb9", 800, 900)}
            alt="Terracotta Craft"
            className="w-full h-[700px] object-cover"
          />
        </div>
      </div>

    </div>

  </div>
</section>
  );
};

export default ContactFeq;