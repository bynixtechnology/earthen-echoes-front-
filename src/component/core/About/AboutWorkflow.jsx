import React from "react";

const workflowSteps = [
  {
    id: 1,
    title: "Clay Selection",
    description:
      "Sourcing mineral-rich alluvial clay from local riverbeds.",
  },
  {
    id: 2,
    title: "Hand Shaping",
    description:
      "Master potters mold each shape on traditional wheels.",
  },
  {
    id: 3,
    title: "Drying",
    description:
      "Naturally sun-dried for 3 days to remove moisture.",
  },
  {
    id: 4,
    title: "Kiln Firing",
    description:
      "Double-fired in wood kilns at over 1000°C for durability.",
  },
  {
    id: 5,
    title: "Finishing",
    description:
      "Careful hand-polishing and detailing with natural slip.",
  },
  {
    id: 6,
    title: "Packaging",
    description:
      "Secured in eco-friendly, plastic-free protective boxes.",
  },
];

const AboutWorkflow = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Our Handcrafted Process
          </h2>

          <p className="text-muted-foreground">
            Six meticulous steps to transform natural earth into a luxury
            masterpiece.
          </p>

          <div className="w-16 h-1 bg-primary mx-auto mt-4" />
        </div>

        {/* Process Steps Grid */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
          {workflowSteps.map((step) => (
            <div
              key={step.id}
              className="bg-card p-6 rounded-xl border border-border/50 text-center space-y-3 shadow-sm"
            >
              <div className="w-10 h-10 bg-primary text-primary-foreground font-heading font-bold rounded-full flex items-center justify-center mx-auto">
                {step.id}
              </div>

              <h3 className="font-heading font-bold text-sm text-foreground">
                {step.title}
              </h3>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
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