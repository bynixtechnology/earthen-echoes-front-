import React, { useEffect, useRef, useState } from "react";
import { C } from "../../../constants/theme";

// Reels Data (Aspect ratio 9:16 vertical video layout)
const reelsData = [
  {
    id: 1,
    thumbnail: "/reel-thumb-1.jpg",
    videoSrc: "/reel-1.mp4",
    postUrl: "https://www.instagram.com/reel/DZ96Fv4Sdxr/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==",
    views: "12.4K",
    caption: "Let every chime tell a story of tradition, craftsmanship, and timeless beauty. 🔔✨",
  },
  {
    id: 2,
    thumbnail: "/reel-thumb-2.jpg",
    videoSrc: "/reel-2.mp4",
    postUrl: "https://www.instagram.com/reel/example2/",
    views: "24.8K",
    caption: "Perfect for your living room, pooja room, office, or as a thoughtful gift for loved ones. Available exclusively at Earthen Echoes.",
  },
  {
    id: 3,
    thumbnail: "/reel-thumb-3.jpg",
    videoSrc: "/reel-3.mp4",
    postUrl: "https://www.instagram.com/reel/DVLKsM3Ejjm/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==",
    views: "16.5K",
    caption: "Discover beautifully handcrafted terracotta pieces that bring warmth, culture, and elegance into your home.",
  },
  {
    id: 4,
    thumbnail: "/reel-thumb-4.jpg",
    videoSrc: "/reel-4.mp4",
    postUrl: "https://www.instagram.com/reel/DYUs9i-BBZG/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==",
    views: "35.2K",
    caption: "जयपुर ही नहीं पूरे राजस्थान का सबसे Unique Home Decor & Luxury Handmade Pottery Store",
  },
];

function ReelIcon({ size = 22 }) {
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
      <path d="m10 15 5-3-5-3v6z" fill="#FFFFFF" />
      <line x1="2" y1="7" x2="22" y2="7" />
      <line x1="6.5" y1="2" x2="6.5" y2="7" />
      <line x1="17.5" y1="2" x2="17.5" y2="7" />
    </svg>
  );
}

function SoundWaveIcon({ isPlaying, size = 16 }) {
  return isPlaying ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function ReelCard({ item, isMobile }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Play with Sound
  const playReel = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    videoRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Fallback agar browser unmuted autoplay block kare
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      });
  };

  // Pause and Mute
  const pauseReel = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    videoRef.current.muted = true;
    setIsPlaying(false);
  };

  return (
    <div
      onMouseEnter={playReel}
      onMouseLeave={pauseReel}
      onClick={() => {
        if (isMobile) {
          isPlaying ? pauseReel() : playReel();
        }
      }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 20,
        width: "100%",
        aspectRatio: "9 / 16",
        boxShadow: "0 8px 24px rgba(28,18,8,0.08)",
        background: "#1E1A17",
        cursor: "pointer",
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={item.videoSrc}
        poster={item.thumbnail}
        loop
        playsInline
        preload="metadata"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: isPlaying ? "scale(1.04)" : "scale(1)",
        }}
      />

      {/* Persistent Bottom Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.25) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top Header: Badge, Audio Status & Views */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          right: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(6px)",
              padding: "4px 8px",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <ReelIcon size={13} />
            <span style={{ color: "#FFF", fontSize: 11, fontWeight: 600 }}>Reels</span>
          </div>

          {/* Sound Wave Indicator */}
          <div
            style={{
              background: isPlaying ? "#D96245" : "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(6px)",
              borderRadius: "50%",
              width: 26,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.3s ease",
            }}
          >
            <SoundWaveIcon isPlaying={isPlaying} size={13} />
          </div>
        </div>

        {item.views && (
          <span
            style={{
              color: "#FFF",
              fontSize: 12,
              fontWeight: 600,
              textShadow: "0 1px 4px rgba(0,0,0,0.7)",
            }}
          >
            ▶ {item.views}
          </span>
        )}
      </div>

      {/* Instagram Redirection Button on Bottom Right */}
      <a
        href={item.postUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Open on Instagram"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          bottom: 14,
          right: 14,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 3,
          textDecoration: "none",
        }}
      >
        <ReelIcon size={16} />
      </a>

      {/* Caption at Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 14,
          right: 58,
          zIndex: 2,
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#FFFFFF",
            fontSize: 12.5,
            lineHeight: 1.4,
            fontWeight: 500,
            textShadow: "0 1px 4px rgba(0,0,0,0.6)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.caption}
        </p>
      </div>
    </div>
  );
}

export default function InstagramReels() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => setMobile(window.innerWidth < 1024);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  return (
    <section
      style={{
        padding: mobile ? "50px 16px" : "70px 24px 90px",
        background: C?.cream || "#F9F6F0",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        {/* Section Header */}
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
            WATCH ON REELS
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
            Stories in Motion
          </h2>
          <p
            style={{
              fontSize: mobile ? 13.5 : 15,
              color: "#7B6E65",
              margin: 0,
            }}
          >
            Watch our crafts come alive on Instagram{" "}
            <span style={{ color: "#D96245", fontWeight: 600 }}>
              #EarthenEchoes
            </span>
          </p>
        </div>

        {/* Mobile View: Horizontal Snap Carousel */}
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
            {reelsData.map((reel) => (
              <div
                key={reel.id}
                style={{
                  scrollSnapAlign: "start",
                  width: "68vw",
                  maxWidth: "240px",
                  flexShrink: 0,
                }}
              >
                <ReelCard item={reel} isMobile={true} />
              </div>
            ))}
          </div>
        ) : (
          /* Desktop View: 4-Column Grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
              alignItems: "stretch",
            }}
          >
            {reelsData.map((reel) => (
              <ReelCard key={reel.id} item={reel} isMobile={false} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}