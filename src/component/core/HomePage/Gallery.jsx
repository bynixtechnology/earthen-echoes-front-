import React, { useEffect, useState } from "react";
import { C } from "../../../constants/theme";

// 5 Columns Structure
const columnsData = [
  // Column 1 (2 Small)
  [
    {
      id: 1,
      imageSrc: "/insta-14.jpg",
      postUrl: "https://www.instagram.com/p/DXgJ-58kihc/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==",
      handle: "@earthen.echoes.jaipur",
    },
    {
      id: 2,
      imageSrc: "/insta-18.jpg",
      postUrl: "https://www.instagram.com/p/DRlpoZZkpB9/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==",
      handle: "@earthen.echoes.jaipur",
    },
  ],
  // Column 2 (1 Full Tall)
  [
    {
      id: 3,
      imageSrc: "/insta-12.heic",
      postUrl: "https://www.instagram.com/p/DU2UCwskh9p/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==",
      handle: "@earthen.echoes.jaipur",
      tall: true,
    },
  ],
  // Column 3 (2 Small)
  [
    {
      id: 4,
      imageSrc: "/insta-20.jpg",
      postUrl: "https://www.instagram.com/p/DU7ZMrXkpF7/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==",
      handle: "@earthen.echoes.jaipur",
    },
    {
      id: 5,
      imageSrc: "/insta-15.jpg",
      postUrl: "https://www.instagram.com/p/DYSjEfDEgJh/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==",
      handle: "@earthen.echoes.jaipur",
    },
  ],
  // Column 4 (1 Full Tall)
  [
    {
      id: 6,
      imageSrc: "/insta-4.heic",
      postUrl: "https://www.instagram.com/p/DUFTNx0EjJy/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==",
      handle: "@earthen.echoes.jaipur",
      tall: true,
    },
  ],
  // Column 5 (2 Small)
  [
    {
      id: 7,
      imageSrc: "/insta-8.jpg",
      postUrl: "https://www.instagram.com/p/DZhFPwykmwT/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==",
      handle: "@earthen.echoes.jaipur",
    },
    {
      id: 8,
      imageSrc: "/insta-19.jpg",
      postUrl: "https://www.instagram.com/p/DVBCQFbEjd_/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==",
      handle: "@earthen.echoes.jaipur",
    },
  ],
];

function InstagramIcon({ size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function GalleryCard({ item, isMobile }) {
  const [h, setH] = useState(false);

  return (
    <a
      href={item.postUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 20,
        width: "100%",
        height: isMobile ? 380 : item.tall ? "100%" : 235,
        minHeight: !isMobile && item.tall ? "486px" : "auto",
        boxShadow: "0 8px 24px rgba(28,18,8,0.06)",
        background: "#E8E4DC",
        display: "block",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      <img
        src={item.imageSrc}
        alt="Earthen Echoes Instagram Post"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: h ? "scale(1.06)" : "scale(1)",
        }}
      />

      {/* Dark tint overlay on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.28)",
          opacity: h ? 1 : 0,
          transition: "opacity 0.35s ease",
          pointerEvents: "none",
        }}
      />

      {/* Centered Instagram Gradient Badge */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: isMobile ? 48 : 54,
          height: isMobile ? 48 : 54,
          borderRadius: "50%",
          background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
          opacity: h ? 1 : 0,
          transform: h ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.6)",
          transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
          pointerEvents: "none",
        }}
      >
        <InstagramIcon size={isMobile ? 22 : 26} />
      </div>
    </a>
  );
}

export default function Gallery() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => setMobile(window.innerWidth < 1024);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const flatPhotos = columnsData.flat();

  return (
    <section
      style={{
        padding: mobile ? "50px 16px" : "70px 24px 90px",
        background: C?.cream || "#F9F6F0",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: mobile ? 28 : 42 }}>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: 3,
              color: "#9C4E36",
              textTransform: "uppercase",
              display: "block",
            }}
          >
            INSTAGRAM
          </span>
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: mobile ? 28 : "clamp(30px, 3.2vw, 46px)",
              margin: "8px 0 10px",
              color: "#2C2018",
              fontWeight: 600,
            }}
          >
            Earthen Living on Instagram
          </h2>
          <p style={{ fontSize: mobile ? 13.5 : 15, color: "#7B6E65", margin: 0 }}>
            Follow our journey and share your moments with{" "}
            <span style={{ color: "#D96245", fontWeight: 600 }}>
              #EarthenEchoes
            </span>
          </p>
        </div>

        {/* Mobile View: Horizontal Scroll */}
        {mobile ? (
          <div
            className="hide-scrollbar"
            style={{
              display: "flex",
              gap: 14,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingBottom: 10,
            }}
          >
            {flatPhotos.map((p) => (
              <div
                key={p.id}
                style={{
                  scrollSnapAlign: "start",
                  width: "75vw",
                  maxWidth: "270px",
                  flexShrink: 0,
                }}
              >
                <GalleryCard item={p} isMobile={true} />
              </div>
            ))}
          </div>
        ) : (
          /* Desktop View: Perfect 5-Column Alignment */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 16,
              alignItems: "stretch",
            }}
          >
            {columnsData.map((col, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  height: "100%",
                }}
              >
                {col.map((item) => (
                  <GalleryCard key={item.id} item={item} isMobile={false} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}