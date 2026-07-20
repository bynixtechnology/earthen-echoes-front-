import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

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
    <section className="py-20 bg-muted border-t border-border/40">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Frequently Asked Questions
          </h2>

          <p className="text-muted-foreground">
            Everything you need to know about our handcrafted terracotta
            delivery, customization, and wholesale models.
          </p>

          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? -1 : index)
                }
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <span className="font-heading font-bold text-base text-foreground pr-6">
                  {faq.question}
                </span>

                <ChevronRight
                  size={22}
                  className={`text-primary transition-transform duration-300 ${
                    openIndex === index ? "rotate-90" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-8 pb-6 text-sm leading-7 text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactFeq;