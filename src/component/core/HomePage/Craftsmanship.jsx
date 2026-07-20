import React from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

const features = [
  {
    title: "Traditional Techniques",
    description: "Wheel-spun and hand-patted for organic textures.",
  },
  {
    title: "Natural Clay Selection",
    description:
      "Locally sourced alluvial clay with no synthetic additives.",
  },
  {
    title: "Kiln-Fired Durability",
    description:
      "Fired at high temperatures for long-lasting structural strength.",
  },
  {
    title: "Artisan Heritage",
    description:
      "Directly supporting and funding 40+ artisan families.",
  },
];

const Craftsmanship = () => {
  return (
    <section className="py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Image side */}

          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] lg:aspect-auto lg:h-[500px]">
            <img
              src="https://uxmagic.blob.core.windows.net/public/agent-images/artisan-craft-1783060841778-xbzpiwajcvf.png"
              alt="Jaipur Terracotta Artisan Craftsmanship"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />

            <div className="absolute bottom-6 left-6 text-primary-foreground">
              <p className="text-xs uppercase tracking-widest text-primary-foreground mb-1">
                Master Artisan Ram Lal
              </p>

              <p className="font-heading text-lg italic">
                "Clay remembers the hand that holds it."
              </p>
            </div>
          </div>

          {/* Text side */}

          <div className="space-y-6">

            <div className="inline-block bg-primary/10 text-primary text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full">
              Our Heritage
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
              Sustaining the Ancient Art of Clay Molding
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              For generations, the potters of Jaipur have listened to the
              whispers of the earth. At Earthen Echoes, we bring these timeless
              methods to modern living spaces, protecting our heritage while
              crafting sustainable designs.
            </p>

            {/* Features */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle
                    size={22}
                    className="text-primary flex-shrink-0 mt-0.5"
                  />

                  <div>
                    <h4 className="font-heading font-bold text-foreground">
                      {feature.title}
                    </h4>

                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Button */}

            <div className="pt-6">
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-all"
              >
                Learn More About Our Journey

                <ArrowRight size={18} className="ml-2" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Craftsmanship;