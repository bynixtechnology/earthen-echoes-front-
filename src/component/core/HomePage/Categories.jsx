// import React, { useEffect, useState } from "react";
// import { Loader2, ArrowUpRight } from "lucide-react";
// import { Link } from "react-router-dom";
// import { CategoryService } from "../../../services/categoryService";
// import { C, img } from "../../../constants/theme";

// const catGridMap = {
//   desktop: {
//     0: { col: "1", row: "1 / 3" },
//     1: { col: "2", row: "1" },
//     2: { col: "3", row: "1" },
//     3: { col: "2", row: "2" },
//     4: { col: "3", row: "2" },
//     5: { col: "4", row: "1 / 3" },
//   }
// };

// function CategoryCard({ cat, i, mobile }) {
//   const place = catGridMap.desktop[i] || {};
//   const isTall = i === 0 || i === 5;
//   const [isHovered, setIsHovered] = useState(false);

//   // Dynamic mobile height variation for true Pinterest staggered masonry feel
//   const mobileHeights = [310, 210, 240, 290, 220, 280];
//   const currentMobileHeight = mobileHeights[i % mobileHeights.length];

//   return (
//     <Link
//       to={cat.id ? `/products?category=${encodeURIComponent(cat.id)}` : "/products"}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{
//         position: "relative",
//         overflow: "hidden",
//         borderRadius: mobile ? 24 : 32,
//         minHeight: mobile ? currentMobileHeight : isTall ? 580 : 280,
//         gridColumn: mobile ? "auto" : place.col,
//         gridRow: mobile ? "auto" : place.row,
//         boxShadow: "0 14px 40px rgba(28,18,8,0.08)",
//         background: "#EFECE6",
//         display: "block",
//         textDecoration: "none",
//         transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease",
//         transform: isHovered && !mobile ? "translateY(-8px)" : "translateY(0)",
//       }}
//     >
//       {/* Background Image with Zoom Effect */}
//       <img
//         src={cat.image || img(cat.img)}
//         alt={cat.name}
//         onError={(e) => e.currentTarget.src = "/placeholder.png"}
//         style={{
//           width: "100%",
//           height: "100%",
//           objectFit: "cover",
//           transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
//           transform: isHovered ? "scale(1.08)" : "scale(1)",
//         }}
//       />

//       {/* Atmospheric Vignette & Warm Gradient */}
//       <div 
//         style={{
//           position: "absolute",
//           inset: 0,
//           background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(28,18,8,0.3) 50%, rgba(28,18,8,0.85) 100%)",
//         }} 
//       />

//       {/* Chic Glowing Accent Dot */}
//       <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 6, zIndex: 2 }}>
//         <span style={{
//           width: 8,
//           height: 8,
//           borderRadius: "50%",
//           backgroundColor: cat.color,
//           boxShadow: "0 0 12px rgba(255,255,255,0.8)"
//         }} />
//       </div>

//       {/* Content Container with Pinterest Glass Card layout */}
//       <div style={{ 
//         position: "absolute", 
//         left: mobile ? 12 : 20, 
//         right: mobile ? 12 : 20, 
//         bottom: mobile ? 12 : 20, 
//         zIndex: 2,
//         display: "flex",
//         flexDirection: "column",
//         gap: mobile ? 8 : 12
//       }}>
//         <h3 style={{
//           margin: 0,
//           color: "#fff",
//           fontSize: mobile ? 18 : isTall ? 28 : 22,
//           fontFamily: "'Playfair Display', serif",
//           fontWeight: 700,
//           letterSpacing: "-0.5px",
//           lineHeight: 1.15,
//           textShadow: "0 2px 10px rgba(0,0,0,0.3)"
//         }}>
//           {cat.name}
//         </h3>

//         {/* Floating Frosted Glass Action Button */}
//         <div style={{
//           alignSelf: "flex-start",
//           display: "inline-flex",
//           alignItems: "center",
//           gap: 6,
//           background: "rgba(255, 255, 255, 0.2)",
//           backdropFilter: "blur(12px)",
//           WebkitBackdropFilter: "blur(12px)",
//           padding: mobile ? "6px 14px" : "9px 18px",
//           borderRadius: 50,
//           color: "#fff",
//           fontSize: mobile ? 11 : 13,
//           fontWeight: 600,
//           border: "1px solid rgba(255,255,255,0.3)",
//           boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//           transition: "background 0.3s ease, transform 0.3s ease",
//           transform: isHovered && !mobile ? "scale(1.05)" : "scale(1)"
//         }}>
//           <span>Explore</span>
//           <ArrowUpRight size={mobile ? 12 : 15} />
//         </div>
//       </div>
//     </Link>
//   );
// }

// export default function Categories() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [mobile, setMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 992 : false);

//   useEffect(() => {
//     const resize = () => setMobile(window.innerWidth < 992);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const res = await CategoryService.getAll();
//         const data = res?.data ?? res ?? [];
//         if (!mounted) return;
//         setCategories((Array.isArray(data) ? data : []).slice(0, 6).map((item, index) => ({
//           id: item._id,
//           name: item.name || "Category",
//           desc: item.description || "Traditional Handcrafted Collection",
//           image: item.image || item.imageUrl,
//           img: "1603697486934-686e0b3c9f06",
//           color: [C.coral, C.teal, C.raspberry, C.green, C.raspberry, C.teal][index]
//         })));
//       } catch (e) {
//         if (mounted) setError(e?.response?.data?.message || e.message);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false };
//   }, []);

//   return (
//     <section style={{ padding: mobile ? "60px 16px" : "110px 40px", background: C.ivory }}>
//       <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        
//         {/* Editorial Pinterest Header */}
//         <div style={{ textAlign: "center", marginBottom: mobile ? 36 : 56 }}>
//           <span style={{ 
//             fontSize: 11, 
//             fontWeight: 700, 
//             letterSpacing: 4, 
//             color: C.teal, 
//             textTransform: "uppercase",
//             display: "block",
//             marginBottom: 8
//           }}>
//             Artisan Curation
//           </span>
//           <h2 style={{ 
//             fontSize: mobile ? 32 : 52, 
//             margin: "0 0 12px 0", 
//             color: C.dark,
//             fontFamily: "'Playfair Display', serif" 
//           }}>
//             Shop by Category
//           </h2>
//           <p style={{ maxWidth: 480, margin: "0 auto", lineHeight: 1.6, color: "#6B5B4E", fontSize: mobile ? 13 : 16 }}>
//             Immerse yourself in heritage decor and handcrafted aesthetics from Rajasthan.
//           </p>
//         </div>

//         {loading ? (
//           <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
//             <Loader2 className="animate-spin" color={C.teal} />
//           </div>
//         ) : error ? (
//           <p style={{ textAlign: "center", color: "red" }}>{error}</p>
//         ) : (
//           <div style={{
//             display: "grid",
//             gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
//             gridAutoRows: mobile ? "auto" : "280px",
//             gap: mobile ? 12 : 20,
//             alignItems: "start"
//           }}>
//             {categories.map((cat, i) => (
//               <CategoryCard key={cat.id || i} cat={cat} i={i} mobile={mobile} />
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }









import React, { useEffect, useState } from "react";
import { Loader2, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CategoryService } from "../../../services/categoryService";
import { C, img } from "../../../constants/theme";

const catGridMap = {
  desktop: {
    0: { col: "1", row: "1 / 3" },
    1: { col: "2", row: "1" },
    2: { col: "3", row: "1" },
    3: { col: "2", row: "2" },
    4: { col: "3", row: "2" },
    5: { col: "4", row: "1 / 3" },
  }
};

function CategoryCard({ cat, i, mobile }) {
  const place = catGridMap.desktop[i] || {};
  const isTall = i === 0 || i === 5;
  const [isHovered, setIsHovered] = useState(false);

  // Unique organic border radii profiles for cards to build an asymmetric masonry mosaic look
  const borderRadiusStyles = mobile 
    ? ["28px 12px 28px 12px", "12px 28px 12px 28px", "20px 20px 8px 28px", "8px 28px 20px 20px", "28px 8px 28px 12px", "12px 28px 8px 28px"]
    : ["32px 12px 32px 12px", "12px 32px 12px 32px", "24px 24px 8px 32px", "8px 32px 24px 24px", "32px 8px 32px 12px", "12px 32px 8px 32px"];
  
  const currentBorderRadius = borderRadiusStyles[i % borderRadiusStyles.length];
  const mobileHeights = [320, 220, 250, 300, 230, 290];
  const currentMobileHeight = mobileHeights[i % mobileHeights.length];

  return (
    <Link
      to={cat.id ? `/products?category=${encodeURIComponent(cat.id)}` : "/products"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: currentBorderRadius,
        minHeight: mobile ? currentMobileHeight : isTall ? 580 : 280,
        gridColumn: mobile ? "auto" : place.col,
        gridRow: mobile ? "auto" : place.row,
        boxShadow: isHovered ? "0 20px 45px rgba(28,18,8,0.14)" : "0 8px 25px rgba(28,18,8,0.05)",
        background: "#E5E0D8",
        display: "block",
        textDecoration: "none",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: isHovered && !mobile ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
      }}
    >
      {/* Background Image with Cinematic Zoom */}
      <img
        src={cat.image || img(cat.img)}
        alt={cat.name}
        onError={(e) => e.currentTarget.src = "/placeholder.png"}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: isHovered ? "scale(1.1)" : "scale(1)",
        }}
      />

      {/* Atmospheric Editorial Gradient Vignette */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(28,18,8,0.0) 20%, rgba(28,18,8,0.4) 60%, rgba(28,18,8,0.9) 100%)",
          mixBlendMode: "multiply",
        }} 
      />

      {/* Minimalist Floating Index Tag */}
      <div style={{ 
        position: "absolute", 
        top: 18, 
        right: 18, 
        zIndex: 3,
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(8px)",
        borderRadius: "50%",
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: 11,
        fontWeight: 600,
        border: "1px solid rgba(255,255,255,0.2)"
      }}>
        0{i + 1}
      </div>

      {/* Accent Color Dot Indicator */}
      <div style={{ position: "absolute", top: 22, left: 20, zIndex: 3 }}>
        <span style={{
          display: "block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: cat.color,
          boxShadow: "0 0 10px rgba(255,255,255,0.9)"
        }} />
      </div>

      {/* Editorial Content Frame */}
      <div style={{ 
        position: "absolute", 
        left: mobile ? 16 : 24, 
        right: mobile ? 16 : 24, 
        bottom: mobile ? 16 : 24, 
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        gap: mobile ? 8 : 12
      }}>
        <h3 style={{
          margin: 0,
          color: "#fff",
          fontSize: mobile ? 19 : isTall ? 30 : 22,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          letterSpacing: "-0.5px",
          lineHeight: 1.1,
          textShadow: "0 2px 12px rgba(0,0,0,0.4)"
        }}>
          {cat.name}
        </h3>

        {/* Boutique Interactive Action Pill */}
        <div style={{
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: isHovered ? "#fff" : "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: mobile ? "6px 14px" : "9px 18px",
          borderRadius: 50,
          color: isHovered ? C.dark : "#fff",
          fontSize: mobile ? 11 : 12,
          fontWeight: 600,
          border: "1px solid rgba(255,255,255,0.35)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <span>Discover</span>
          <ArrowUpRight size={mobile ? 12 : 14} />
        </div>
      </div>
    </Link>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 992 : false);

  useEffect(() => {
    const resize = () => setMobile(window.innerWidth < 992);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await CategoryService.getAll();
        const data = res?.data ?? res ?? [];
        if (!mounted) return;
        setCategories((Array.isArray(data) ? data : []).slice(0, 6).map((item, index) => ({
          id: item._id,
          name: item.name || "Category",
          desc: item.description || "Traditional Handcrafted Collection",
          image: item.image || item.imageUrl,
          img: "1603697486934-686e0b3c9f06",
          color: [C.coral, C.teal, C.raspberry, C.green, C.raspberry, C.teal][index]
        })));
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  return (
    <section style={{ padding: mobile ? "60px 16px" : "110px 40px", background: C.ivory }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        
        {/* Magazine-Style Centered Header */}
        <div style={{ textAlign: "center", marginBottom: mobile ? 36 : 56 }}>
          <div style={{ display: "inline-block", position: "relative", marginBottom: 10 }}>
            <span style={{ 
              fontSize: 11, 
              fontWeight: 700, 
              letterSpacing: 4, 
              color: C.teal, 
              textTransform: "uppercase",
              display: "block",
            }}>
              Artisanal Directory
            </span>
          </div>
          <h2 style={{ 
            fontSize: mobile ? 32 : 52, 
            margin: "0 0 12px 0", 
            color: C.dark,
            fontFamily: "'Playfair Display', serif" 
          }}>
            Shop by Category
          </h2>
          <p style={{ maxWidth: 460, margin: "0 auto", lineHeight: 1.6, color: "#6B5B4E", fontSize: mobile ? 13 : 16 }}>
            Handpicked Rajasthan heritage collections styled for modern interior aesthetics.
          </p>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <Loader2 className="animate-spin" color={C.teal} />
          </div>
        ) : error ? (
          <p style={{ textAlign: "center", color: "red" }}>{error}</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gridAutoRows: mobile ? "auto" : "280px",
            gap: mobile ? 14 : 20,
            alignItems: "start"
          }}>
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id || i} cat={cat} i={i} mobile={mobile} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}