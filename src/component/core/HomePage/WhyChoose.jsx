
import React from "react";
import {
  Sparkles,
  Leaf,
  Flame,
  MapPin,
  ShieldCheck,
  Package,
  Truck,
  RefreshCw,
} from "lucide-react";

const features = [
  {
    title: "100% Handmade",
    description: "Molded and hand-carved by master artisans.",
    icon: Sparkles,
  },
  {
    title: "Eco Friendly",
    description: "Sourced naturally and entirely biodegradable.",
    icon: Leaf,
  },
  {
    title: "Natural Clay",
    description: "Pure alluvial clay rich in natural minerals.",
    icon: Flame,
  },
  {
    title: "Made in India",
    description: "Sustaining ancient craft clusters of Jaipur.",
    icon: MapPin,
  },
  {
    title: "Premium Quality",
    description: "Rigorous double-firing quality standards.",
    icon: ShieldCheck,
  },
  {
    title: "Safe Packaging",
    description: "Eco-friendly shatterproof protective boxing.",
    icon: Package,
  },
  {
    title: "Fast Shipping",
    description: "Insured express delivery across India & globally.",
    icon: Truck,
  },
  {
    title: "Sustainable Craft",
    description: "Empowering artisans with fair-wage models.",
    icon: RefreshCw,
  },
];

const WhyChoose = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Why Choose Earthen Echoes
          </h2>

          <p className="text-muted-foreground">
            We blend ancient pottery traditions with contemporary luxury
            standards.
          </p>

          <div className="w-16 h-1 bg-primary mx-auto mt-4" />
        </div>

        {/* Feature Grid */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="p-6 bg-card rounded-xl border border-border/50 text-center hover:border-primary/50 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                  <Icon size={28} strokeWidth={2} />
                </div>

                <h3 className="font-heading text-xl
                 font-bold mb-2 whitespace-nowrap">
                  {feature.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;