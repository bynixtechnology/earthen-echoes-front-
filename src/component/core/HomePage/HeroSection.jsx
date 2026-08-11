import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { C, img } from "../../../constants/theme";

export default function HeroSection() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 992);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const stats = [
    ["12K+", "Happy Customers"],
    ["500+", "Products"],
    ["15+", "Years Heritage"],
  ];

  return (
    <section
      style={{
        position: "relative",
        minHeight: mobile ? "auto" : "100vh",
        padding: mobile ? "40px 20px" : "60px 80px",
        display: "flex",
        alignItems: "center",
        background: "#FAF7F2",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: mobile ? "column" : "row",
          gap: mobile ? 40 : 60,
          alignItems: "center",
          zIndex: 2,
        }}
      >
        {/* Left Column - Content */}
        <div style={{ flex: 1, order: mobile ? 2 : 1, width: "100%" }}>
          {/* Top Pill Category */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 16px",
              borderRadius: 999,
              border: `1px solid ${C.coral || "#E86A43"}50`,
              background: "#FDEFE9",
              color: C.coral || "#E86A43",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: C.coral || "#E86A43",
              }}
            />
            JAIPUR HERITAGE COLLECTION
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: mobile ? 36 : 64,
              lineHeight: 1.08,
              color: C.dark || "#1C1208",
              margin: "20px 0 16px 0",
              fontWeight: 800,
            }}
          >
            Handcrafted <br />
            Stories{" "}
            <span
              style={{
                color: C.coral || "#E86A43",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              for
            </span>{" "}
            <br />
            <span
              style={{
                color: C.coral || "#E86A43",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              Beautiful
            </span>{" "}
            Homes
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: mobile ? 14 : 15,
              lineHeight: 1.7,
              color: "#6B5B4E",
              maxWidth: 440,
              margin: "0 0 28px 0",
            }}
          >
            Discover beautifully hand-molded pottery, planters, urns, décor
            accents, and gifting suites from master artisans of traditional
            Indian clay.
          </p>

          {/* Call To Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 32,
            }}
          >
            <Link
              to="/products"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 999,
                background: C.coral || "#E86A43",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                boxShadow: "0 8px 20px rgba(232, 106, 67, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              Shop Collection <ArrowRight size={16} />
            </Link>
            <Link
              to="/about"
              style={{
                textDecoration: "none",
                padding: "14px 28px",
                borderRadius: 999,
                border: "1px solid #D9D2C9",
                color: C.dark || "#1C1208",
                fontWeight: 600,
                fontSize: 14,
                background: "#FAF7F2",
                transition: "all 0.3s ease",
              }}
            >
              Our Story
            </Link>
          </div>

          {/* Feature Highlights */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: mobile ? 12 : 20,
              marginBottom: 32,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: "#5C6B5E",
              }}
            >
              <span style={{ color: C.coral || "#E86A43" }}>✦</span> Handmade
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: "#5C6B5E",
              }}
            >
              <span style={{ color: "#3B7A57" }}>⬡</span> Eco Friendly
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: "#5C6B5E",
              }}
            >
              <span style={{ color: "#3B82F6" }}>✦</span> Made in India
            </span>
          </div>

          {/* Divider & Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              paddingTop: 24,
              borderTop: "1px solid #EAE3DA",
              maxWidth: 480,
            }}
          >
            {stats.map(([n, l]) => (
              <div key={l}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: mobile ? 22 : 28,
                    fontWeight: 700,
                    color: C.dark || "#1C1208",
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#8C7E72",
                    marginTop: 2,
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Hero Showcase Image with Geometric Background Shapes */}
        <div style={{ flex: 1, order: mobile ? 1 : 2, width: "100%" }}>
          <div
            style={{
              position: "relative",
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            {/* Shape 1: Top Right Pinkish Arch / Oval Shape */}
            <div
              style={{
                position: "absolute",
                top: -45,
                right: -45,
                width: 320,
                height: 380,
                borderRadius: "180px 180px 120px 120px",
                background: "rgba(245, 218, 210, 0.75)",
                zIndex: 0,
              }}
            />

            {/* Shape 2: Left Greenish Pill/Circle Shape */}
            <div
              style={{
                position: "absolute",
                top: "15%",
                left: -40,
                width: 140,
                height: 220,
                borderRadius: 100,
                background: "rgba(212, 222, 204, 0.8)",
                zIndex: 0,
              }}
            />

            {/* Shape 3: Bottom Soft Muted Blob */}
            <div
              style={{
                position: "absolute",
                bottom: -35,
                right: "10%",
                width: 280,
                height: 180,
                borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%",
                background: "rgba(224, 233, 230, 0.85)",
                zIndex: 0,
              }}
            />

            {/* Main Image Container */}
            <div
              style={{
                position: "relative",
                borderRadius: 48,
                overflow: "hidden",
                boxShadow: "0 20px 45px rgba(28, 18, 8, 0.12)",
                zIndex: 1,
              }}
            >
              <img
                src={img("1609881583302-61548332039c", 900, 900)}
                alt="Pottery Artisan"
                style={{
                  width: "100%",
                  height: mobile ? 340 : 540,
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Eco Friendly Top Badge */}
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  background: "#6BA543",
                  color: "#fff",
                  padding: "7px 16px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                }}
              >
                <span>🌿</span> 100% Eco Friendly
              </div>
            </div>

            {/* Bottom-Left Floating Product Rating Card */}
            <div
              style={{
                position: "absolute",
                bottom: -20,
                left: mobile ? 10 : -30,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                padding: "12px 16px",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                gap: 12,
                boxShadow: "0 15px 35px rgba(28,18,8,0.12)",
                zIndex: 3,
                border: "1px solid rgba(255,255,255,0.8)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#FCEEE9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                🏺
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: C.dark || "#1C1208",
                  }}
                >
                  Terracotta Vase
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#8C7E72",
                    marginBottom: 4,
                  }}
                >
                  Just restocked
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    fontSize: 10,
                    fontWeight: 600,
                    color: C.dark || "#1C1208",
                  }}
                >
                  <span style={{ color: "#F59E0B" }}>★★★★★</span>
                  <span style={{ marginLeft: 2 }}>4.9 (312)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}