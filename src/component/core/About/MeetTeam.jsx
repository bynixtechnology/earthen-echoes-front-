import React from "react";
import { C } from "../../../constants/theme";

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
    <section
      className="py-20"
      style={{ background: C.ivory }}
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
            Our Team
          </span>

          <h2
            className="text-3xl lg:text-5xl font-bold mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: C.dark,
            }}
          >
            Meet Our Master Artisans
          </h2>

          <p
            className="leading-8"
            style={{ color: "#6B5B4E" }}
          >
            The hands that mold the earth and breathe life into Earthen Echoes.
          </p>

          <div
            className="w-16 h-1 rounded-full mx-auto mt-5"
            style={{
              background: `linear-gradient(90deg, ${C.coral}, ${C.teal})`,
            }}
          />
        </div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
              style={{
                background: "#fff",
                border: `1px solid ${C.paleCoral}`,
                boxShadow: "0 12px 35px rgba(28,18,8,.08)",
              }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.alt}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="p-6 text-center">
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: C.dark,
                  }}
                >
                  {member.name}
                </h3>

                <p
                  className="text-xs uppercase tracking-widest font-semibold mb-4"
                  style={{
                    color: C.coral,
                  }}
                >
                  {member.role}
                </p>

                <p
                  className="text-sm leading-7"
                  style={{
                    color: "#6B5B4E",
                  }}
                >
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