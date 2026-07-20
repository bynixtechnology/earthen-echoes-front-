import React from "react";
import { Leaf, Trash2, Sparkles, Package } from "lucide-react";

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
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl font-heading font-bold">
            Our Sustainable Commitment
          </h2>

          <p className="text-sm text-primary-foreground/80 leading-relaxed">
            We believe luxury should never cost the earth. Every aspect of our
            production process is optimized to respect nature and preserve
            resources.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
          {sustainabilityData.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.id} className="space-y-3">
                <Icon className="mx-auto text-secondary" size={42} />

                <h3 className="font-heading font-bold text-base">
                  {item.title}
                </h3>

                <p className="text-xs text-primary-foreground/75 leading-relaxed">
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