import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const ProductFaq = ({ product }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "How should I care for this product?",
      a:
        product?.careInstructions ||
        "Clean gently with a soft cloth. Avoid harsh chemicals and prolonged soaking unless the product instructions specifically allow it.",
    },
    {
      q: "Can I return or exchange this product?",
      a:
        product?.returnPolicy ||
        "Returns and exchanges are subject to the store return policy. Please check the shipping and returns information before placing your order.",
    },
    {
      q: "How is the product packed?",
      a:
        product?.packaging ||
        "The product is securely packed to help protect it during transit.",
    },
  ];

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14 mt-7 sm:mt-10">
      <div className="text-center mb-5 sm:mb-6">
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#F16937]">
          FAQ
        </p>
        <h2 className="mt-7 sm:mt-5 font-heading text-xl sm:text-2xl font-bold">Common Questions</h2>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={faq.q}
            className="overflow-hidden rounded-xl sm:rounded-2xl border border-[rgba(28,25,23,0.12)]/60 bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5 sm:py-4 text-left"
            >
              <span className="text-xs sm:text-sm font-bold">{faq.q}</span>
              <ChevronDown
                size={17}
                className={`shrink-0 transition-transform ${
                  openFaq === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openFaq === index && (
              <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                <p className="text-xs sm:text-sm leading-6 text-[#78716C]">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductFaq;