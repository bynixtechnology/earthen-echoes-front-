import React from "react";

const teamMembers = [
  {
    id: 1,
    name: "Ram Lal",
    role: "Master Wheeler (32 Years Exp.)",
    description:
      "Ram Lal has been throwing clay since age 12, specializing in large-scale decorative vases and urlis.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    alt: "Artisan Ram Lal",
  },
  {
    id: 2,
    name: "Kamla Devi",
    role: "Lead Relief Carver",
    description:
      "Kamla Devi heads the women's carving group, detailing traditional patterns and motifs on the planters.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    alt: "Artisan Kamla Devi",
  },
  {
    id: 3,
    name: "Shiv Charan",
    role: "Kiln Master",
    description:
      "Shiv Charan monitors the traditional wood kilns, managing high temperatures to guarantee structural strength.",
    image: "https://randomuser.me/api/portraits/men/81.jpg",
    alt: "Artisan Shiv Charan",
  },
];

const MeetTeam = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Meet Our Master Artisans
          </h2>

          <p className="text-muted-foreground">
            The hands that mold the earth and breathe life into Earthen Echoes.
          </p>

          <div className="w-16 h-1 bg-primary mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-card rounded-xl overflow-hidden border border-border/40 shadow-sm text-center"
            >
              <div className="aspect-square bg-muted">
                <img
                  src={member.image}
                  alt={member.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-foreground">
                  {member.name}
                </h3>

                <p className="text-xs text-primary uppercase tracking-wider font-semibold mb-2">
                  {member.role}
                </p>

                <p className="text-xs text-muted-foreground">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetTeam;