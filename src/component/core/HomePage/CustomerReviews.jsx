import React, { useEffect, useState } from "react";
import { C } from "../../../constants/theme";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    text: "The Jaipur Bloom Urn is a masterpiece. The blue detailing and incredibly seamless craft make it something I proudly display in my living room.",
    avatar: "/review1.jpg",
    accent: C.coral,
  },
  {
    name: "Ananya Sharma",
    location: "Bengaluru, India",
    text: "Love their sustainable packaging! Every potter creation is gifted in gallery condition. The craftsmanship is genuinely extraordinary.",
    avatar: "/review2.jpg",
    accent: C.teal,
  },
  {
    name: "Surya Rai",
    location: "Delhi, India",
    text: "Earthen Echoes is our go-to for luxury ceramic gifts. Clients are always delighted by the quality and authentic Indian craft story.",
    avatar: "/review3.jpg",
    accent: C.raspberry,
  },
  {
    name: "Kavya Singh",
    location: "Pune, India",
    text: "The texture and earthy feel of the planters are unmatched. They bring such a calming, organic vibe to my indoor jungle balcony.",
    avatar: "/review4.jpg",
    accent: C.green,
  },
  {
    name: "Shruti Sharma",
    location: "Jaipur, India",
    text: "Knowing these pieces are crafted by local artisans right here in Rajasthan makes owning them even more special. True heritage quality.",
    avatar: "/review5.jpg",
    accent: C.coral,
  },
  {
    name: "Radhika Jain",
    location: "Kochi, India",
    text: "Exceptional customer service and pristine delivery. The terracotta tea set looks even more breathtaking in person than it does online.",
    avatar: "/review6.jpg",
    accent: C.teal,
  },
];

function Card({ t, isMobile }) {
  const [h, setH] = useState(false);

  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h || isMobile ? "rgba(255,255,255,.98)" : "rgba(255,255,255,.88)",
        backdropFilter: "blur(16px)",
        borderRadius: isMobile ? 22 : 28,
        padding: isMobile ? "24px 20px" : "34px 28px",
        border: `1.5px solid ${h || isMobile ? t.accent + "55" : "rgba(0,0,0,.08)"}`,
        boxShadow: h ? `0 20px 50px ${t.accent}20` : "0 4px 24px rgba(0,0,0,.07)",
        transform: h && !isMobile ? "translateY(-6px)" : "none",
        transition: ".35s",
        position: "relative",
        overflow: "hidden",
        width: isMobile ? "280px" : "100%",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 20,
          fontSize: isMobile ? 60 : 80,
          fontFamily: "Playfair Display,serif",
          color: t.accent + "15",
        }}
      >
        "
      </div>

      <div>
        <div style={{ display: "flex", gap: 2, marginBottom: isMobile ? 12 : 16 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} style={{ color: "#F59E0B", fontSize: isMobile ? 14 : 16 }}>
              ★
            </span>
          ))}
        </div>
        <p
          style={{
            fontFamily: "Playfair Display,serif",
            fontStyle: "italic",
            lineHeight: 1.7,
            color: C.dark,
            fontSize: isMobile ? 14.5 : 16,
            margin: 0,
          }}
        >
          "{t.text}"
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: isMobile ? 20 : 24 }}>
        <img
          src={t.avatar}
          alt={t.name}
          style={{
            width: isMobile ? 52 : 58,
            height: isMobile ? 52 : 58,
            borderRadius: "50%",
            objectFit: "cover",
            objectPosition: "top center",
            flexShrink: 0,
            border: `2px solid ${t.accent}`,
            background: "#f3f4f6",
          }}
        />
        <div>
          <div style={{ fontWeight: 700, color: C.dark, fontSize: isMobile ? 15 : 16 }}>
            {t.name}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginTop: 3 }}>
            <span style={{ fontSize: isMobile ? 11.5 : 12.5, color: "#8A7A6E" }}>{t.location}</span>
            <span
              style={{
                fontSize: 10.5,
                padding: "2px 8px",
                borderRadius: 30,
                background: t.accent + "15",
                color: t.accent,
                fontWeight: 600,
              }}
            >
              ✓ Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerReviews() {
  const [cols, setCols] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const f = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setCols(w < 640 ? 1 : w < 992 ? 2 : 3);
    };
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  return (
    <section style={{ padding: isMobile ? "60px 0" : "100px 40px", background: C.ivory, overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 16px" : "0" }}>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? 32 : 60 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              color: C.teal,
              textTransform: "uppercase",
            }}
          >
            REVIEWS
          </span>
          <h2
            style={{
              fontFamily: "Playfair Display,serif",
              fontSize: isMobile ? 28 : "clamp(30px,3.5vw,48px)",
              margin: "10px 0 12px",
              color: C.dark,
            }}
          >
            Whispers of Appreciation
          </h2>
          <p
            style={{
              maxWidth: 500,
              margin: "0 auto",
              lineHeight: 1.7,
              color: "#8A7A6E",
              fontSize: isMobile ? 13.5 : 15,
            }}
          >
            Hear from patrons who have welcomed Earthen Echoes into their homes.
          </p>
          <div
            style={{
              width: 40,
              height: 3,
              margin: "18px auto 0",
              borderRadius: 2,
              background: `linear-gradient(90deg,${C.teal},${C.coral})`,
            }}
          />
        </div>

        {/* Mobile View: Horizontal Scroll */}
        {isMobile ? (
          <div
            className="hide-scrollbar"
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingBottom: 12,
              marginLeft: -16,
              marginRight: -16,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            {testimonials.map((t) => (
              <div key={t.name} style={{ scrollSnapAlign: "start" }}>
                <Card t={t} isMobile={true} />
              </div>
            ))}
          </div>
        ) : (
          /* Desktop View: Grid */
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 24 }}>
            {testimonials.map((t) => (
              <Card key={t.name} t={t} isMobile={false} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}