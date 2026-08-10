import React, { useEffect, useState } from "react";
import {
  Sparkles, Leaf, Flame, MapPin, ShieldCheck,
  Package, Truck, RefreshCw,
} from "lucide-react";
import { C } from "../../../constants/theme";

const features = [
  { icon: Sparkles, title: "100% Handmade", desc: "Artisan hand-crafted by skilled Indian potters", color: C.coral, bg: C.paleCoral },
  { icon: Leaf, title: "Eco Friendly", desc: "Natural clay, zero harmful chemicals", color: C.green, bg: C.paleGreen },
  { icon: Flame, title: "Natural Clay", desc: "Pure mineral clay sourced from Rajasthan", color: C.teal, bg: C.paleTeal },
  { icon: ShieldCheck, title: "Premium Quality", desc: "Rigorous quality checks on every piece", color: C.raspberry, bg: C.paleBlush },
  { icon: MapPin, title: "Made in India", desc: "Supporting local artisan craft clusters", color: C.coral, bg: C.paleCoral },
  { icon: Truck, title: "Fast Shipping", desc: "Packed & shipped within 2 business days", color: C.teal, bg: C.paleTeal },
  { icon: Package, title: "Safe Packaging", desc: "Eco-friendly and shatterproof packaging", color: C.green, bg: C.paleGreen },
  { icon: RefreshCw, title: "Gift Ready", desc: "Beautifully boxed for gifting occasions", color: C.raspberry, bg: C.paleBlush },
];

function FeatureCard({ f, isMobile }) {
  const [hovered, setHovered] = useState(false);
  const Icon = f.icon;

  if (isMobile) {
    return (
      <div
        style={{
          minWidth: "220px",
          maxWidth: "220px",
          background: "#fff",
          borderRadius: 20,
          padding: "20px 16px",
          border: "1.5px solid rgba(28,18,8,.08)",
          boxShadow: "0 6px 20px rgba(28,18,8,.04)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Soft background color aura matching the theme */}
        <div style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: f.bg,
          opacity: 0.7,
          zIndex: 0
        }} />

        <div style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: f.color + "15",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
          zIndex: 1
        }}>
          <Icon size={22} color={f.color} />
        </div>

        <div style={{ zIndex: 1 }}>
          <h3 style={{ margin: "0 0 6px", fontFamily: "Playfair Display, serif", fontSize: 16, color: C.dark }}>
            {f.title}
          </h3>
          <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: "#8A7A6E" }}>
            {f.desc}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? f.bg : "#fff",
        borderRadius: 24,
        padding: "28px 24px",
        border: `1.5px solid ${hovered ? f.color + "55" : "rgba(28,18,8,.1)"}`,
        transition: "all .35s cubic-bezier(.16,1,.3,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 40px ${f.color}20` : "0 2px 12px rgba(28,18,8,.05)",
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 18,
        background: hovered ? f.color : f.color + "15",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: ".35s", marginBottom: 18
      }}>
        <Icon size={28} color={hovered ? "#fff" : f.color} />
      </div>

      <h3 style={{ margin: "0 0 10px", fontFamily: "Playfair Display, serif", fontSize: 18, color: C.dark }}>
        {f.title}
      </h3>

      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#8A7A6E" }}>
        {f.desc}
      </p>
    </div>
  );
}

export default function WhyChoose() {
  const [cols, setCols] = useState(4);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      if (w < 640) setCols(1);
      else if (w < 992) setCols(2);
      else if (w < 1200) setCols(3);
      else setCols(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section style={{
      padding: isMobile ? "60px 0" : "100px 40px",
      background: C.ivory,
      overflow: "hidden"
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 16px" : "0" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 32 : 60 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 3,
            textTransform: "uppercase", color: C.raspberry
          }}>
            Our Promise
          </span>

          <h2 style={{
            fontFamily: "Playfair Display, serif",
            fontSize: isMobile ? 28 : "clamp(34px,3.5vw,48px)",
            color: C.dark,
            margin: "10px 0 12px"
          }}>
            Why Choose Earthen Echoes
          </h2>

          <p style={{
            maxWidth: 520, margin: "0 auto",
            lineHeight: 1.7, color: "#8A7A6E",
            fontSize: isMobile ? 13.5 : 15.5
          }}>
            We blend timeless pottery traditions with contemporary quality standards.
          </p>

          <div style={{
            width: 40, height: 3, borderRadius: 2,
            margin: "18px auto 0",
            background: `linear-gradient(90deg,${C.raspberry},${C.coral})`
          }} />
        </div>

        {/* Mobile View: Pinterest style smooth horizontal snap scroll */}
        {isMobile ? (
          <div
            className="hide-scrollbar"
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingBottom: 10,
              marginLeft: -16,
              marginRight: -16,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            {features.map(item => (
              <div key={item.title} style={{ scrollSnapAlign: "start" }}>
                <FeatureCard f={item} isMobile={true} />
              </div>
            ))}
          </div>
        ) : (
          /* Desktop View: Standard Grid */
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols},1fr)`,
            gap: 20
          }}>
            {features.map(item => (
              <FeatureCard key={item.title} f={item} isMobile={false} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}