import React, { useEffect, useState } from "react";
import { C, img } from "../../../constants/theme";

const photos = [
  { id: "1603697486934-686e0b3c9f06" },
  { id: "1597696929736-6d13bed8e6a8" },
  { id: "1740811620405-8a505f3eb13c" },
  { id: "1507022787381-b30170b5ebf4" },
  { id: "1759753865666-a6bd3da8971d" },
  { id: "1759745063507-40b6beaf1cec" },
];

function GalleryItem({ id, tall, mobile }) {
  const [h, setH] = useState(false);

  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: mobile ? 22 : 24,
        cursor: "pointer",
        width: "100%",
        // Mobile me sabhi images ke liye uniform FULL height (400px)
        height: mobile ? 400 : tall ? 440 : 210,
        gridRow: mobile ? "auto" : tall ? "span 2" : "span 1",
        boxShadow: "0 10px 30px rgba(28,18,8,0.06)",
        background: "#EFECE6",
      }}
    >
      <img
        src={img(id, 600, mobile ? 800 : tall ? 700 : 400)}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: ".6s cubic-bezier(.16,1,.3,1)",
          transform: h ? "scale(1.08)" : "scale(1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: mobile ? 16 : 20,
          opacity: mobile ? 1 : h ? 1 : 0,
          transition: ".35s",
          background:
            "linear-gradient(0deg, rgba(28,18,8,.75) 0%, rgba(28,18,8,0.2) 60%, transparent 100%)",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.9)",
            fontWeight: 600,
            fontSize: mobile ? 11 : 12,
            marginBottom: mobile ? 6 : 10,
          }}
        >
          @earthenechoes
        </div>
        <button
          style={{
            width: "fit-content",
            border: "1px solid rgba(255,255,255,0.3)",
            background: mobile ? "rgba(255,255,255,0.25)" : C.coral,
            backdropFilter: mobile ? "blur(8px)" : "none",
            color: "#fff",
            padding: mobile ? "6px 14px" : "8px 16px",
            borderRadius: 999,
            fontWeight: 700,
            fontSize: mobile ? 11 : 13,
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
          }}
        >
          Shop This Look →
        </button>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const f = () => setMobile(window.innerWidth < 768);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  return (
    <section
      style={{
        padding: mobile ? "60px 16px" : "100px 40px",
        background: C.cream,
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: mobile ? 36 : 52 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              color: C.raspberry,
              textTransform: "uppercase",
            }}
          >
            INSTAGRAM
          </span>
          <h2
            style={{
              fontFamily: "Playfair Display,serif",
              fontSize: mobile ? 28 : "clamp(30px,3.5vw,48px)",
              margin: "10px 0 12px",
              color: C.dark,
            }}
          >
            Earthen Living on Instagram
          </h2>
          <p style={{ fontSize: mobile ? 13.5 : 15, color: "#8A7A6E" }}>
            Follow our journey and share your moments with{" "}
            <span style={{ color: C.coral, fontWeight: 600 }}>
              #EarthenEchoes
            </span>
          </p>
        </div>

        {/* Mobile View: Horizontal Snap Scroll Carousel */}
        {mobile ? (
          <div
            className="hide-scrollbar"
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingBottom: 16,
            }}
          >
            {photos.map((p) => (
              <div
                key={p.id}
                style={{
                  scrollSnapAlign: "start",
                  width: "80vw",
                  maxWidth: "280px",
                  flexShrink: 0,
                }}
              >
                <GalleryItem id={p.id} tall={false} mobile={true} />
              </div>
            ))}
          </div>
        ) : (
          /* Desktop View: Clean Staggered Grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {photos.map((p, i) => (
              <GalleryItem
                key={p.id}
                id={p.id}
                tall={i === 1 || i === 4}
                mobile={false}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}