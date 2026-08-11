// import React, { useEffect, useState } from "react";
// import { C } from "../../../constants/theme";

// const pillars = [
//   { icon: "♻️", title: "Eco Packaging", desc: "Biodegradable boxes, zero plastic" },
//   { icon: "⛏️", title: "Natural Clay Sourcing", desc: "Ethically mined from Rajasthan mineral beds" },
//   { icon: "👩", title: "Women Artisans", desc: "60% of our artisans are women-led cooperatives" },
//   // { icon: "🌍", title: "Low Carbon Footprint", desc: "Solar-powered kilns, reduced emissions" },
//   { icon: "🤲", title: "Handmade Process", desc: "Zero industrial machinery, pure craft" },
// ];

// // const stats = [
// //   { num: "200+", label: "Artisans Supported", icon: "👩‍🎨" },
// //   { num: "100%", label: "Natural Materials", icon: "🌿" },
// //   { num: "0", label: "Plastic Used", icon: "🚫" },
// //   { num: "15K+", label: "Trees Equivalent Saved", icon: "🌳" },
// // ];

// export default function Sustainability() {
//   const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1400);

//   useEffect(() => {
//     const r = () => setW(window.innerWidth);
//     r();
//     window.addEventListener("resize", r);
//     return () => window.removeEventListener("resize", r);
//   }, []);

//   const isMobile = w < 768;
//   const pillarCols = w < 640 ? 1 : w < 900 ? 2 : w < 1200 ? 3 : 5;
//   const statCols = w < 640 ? 2 : 4;

//   return (
//     <section style={{
//       padding: isMobile ? "60px 16px" : "100px 40px",
//       background: "linear-gradient(135deg,#F0F7E8 0%,#E5F2D8 40%,#EEF7E6 100%)",
//       position: "relative",
//       overflow: "hidden"
//     }}>
//       {/* Background Decorative Blurs */}
//       <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `${C.green}15`, filter: "blur(60px)" }} />
//       <div style={{ position: "absolute", bottom: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: `${C.teal}15`, filter: "blur(50px)" }} />

//       <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
        
//         {/* Header Section */}
//         <div style={{ textAlign: "center", marginBottom: isMobile ? 36 : 50 }}>
//           <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.green, textTransform: "uppercase" }}>
//             Sustainability
//           </span>
//           <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: isMobile ? 28 : "clamp(32px,3.5vw,48px)", margin: "10px 0 12px", color: C.dark }}>
//             Crafting a Greener Tomorrow
//           </h2>
//           <p style={{ maxWidth: 540, margin: "0 auto", lineHeight: 1.7, color: "#4A6A35", fontSize: isMobile ? 13.5 : 15 }}>
//             Every piece of Earthen Echoes pottery is born from sustainable practices that honour the earth.
//           </p>
//         </div>

//         {/* Pillars Display: Horizontal Snap Scroll for Mobile vs Grid for Desktop */}
//         {isMobile ? (
//           <div
//             className="hide-scrollbar"
//             style={{
//               display: "flex",
//               gap: 12,
//               overflowX: "auto",
//               scrollSnapType: "x mandatory",
//               paddingBottom: 10,
//               marginLeft: -16,
//               marginRight: -16,
//               paddingLeft: 16,
//               paddingRight: 16,
//             }}
//           >
//             {pillars.map((p) => (
//               <div
//                 key={p.title}
//                 style={{
//                   scrollSnapAlign: "start",
//                   minWidth: "210px",
//                   maxWidth: "210px",
//                   background: "rgba(255,255,255,.8)",
//                   backdropFilter: "blur(12px)",
//                   borderRadius: 20,
//                   padding: "20px 16px",
//                   textAlign: "left",
//                   border: "1px solid rgba(118,168,69,.3)",
//                   boxShadow: "0 6px 20px rgba(118,168,69,.08)",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   flexShrink: 0
//                 }}
//               >
//                 <div>
//                   <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
//                   <h3 style={{ margin: "0 0 6px", fontFamily: "Playfair Display,serif", fontSize: 16, color: C.dark, lineHeight: 1.25 }}>
//                     {p.title}
//                   </h3>
//                 </div>
//                 <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: "#5A7A48" }}>
//                   {p.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div style={{ display: "grid", gridTemplateColumns: `repeat(${pillarCols},1fr)`, gap: 18 }}>
//             {pillars.map((p) => (
//               <div
//                 key={p.title}
//                 style={{
//                   background: "rgba(255,255,255,.72)",
//                   backdropFilter: "blur(12px)",
//                   borderRadius: 24,
//                   padding: "28px 20px",
//                   textAlign: "center",
//                   border: "1px solid rgba(118,168,69,.3)",
//                   boxShadow: "0 6px 24px rgba(118,168,69,.12)"
//                 }}
//               >
//                 <div style={{ fontSize: 36, marginBottom: 12 }}>{p.icon}</div>
//                 <h3 style={{ margin: "0 0 10px", fontFamily: "Playfair Display,serif", fontSize: 18, color: C.dark }}>
//                   {p.title}
//                 </h3>
//                 <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: "#5A7A48" }}>
//                   {p.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Stats Section */}
//         {/* <div style={{
//           marginTop: isMobile ? 36 : 50,
//           background: "rgba(255,255,255,.75)",
//           borderRadius: isMobile ? 22 : 28,
//           padding: isMobile ? "22px 16px" : "40px 48px",
//           display: "grid",
//           gridTemplateColumns: `repeat(${statCols},1fr)`,
//           gap: isMobile ? 16 : 22,
//           backdropFilter: "blur(12px)",
//           border: "1px solid rgba(118,168,69,.25)",
//           boxShadow: "0 10px 30px rgba(118,168,69,.08)"
//         }}>
//           {stats.map((s) => (
//             <div
//               key={s.label}
//               style={{
//                 textAlign: "center",
//                 background: isMobile ? "rgba(255,255,255,0.5)" : "transparent",
//                 padding: isMobile ? "12px 8px" : "0",
//                 borderRadius: 16
//               }}
//             >
//               <div style={{ fontSize: isMobile ? 22 : 28, marginBottom: 4 }}>{s.icon}</div>
//               <div style={{ fontFamily: "Playfair Display,serif", fontSize: isMobile ? 24 : 36, fontWeight: 700, color: C.green, lineHeight: 1.1 }}>
//                 {s.num}
//               </div>
//               <div style={{ fontSize: isMobile ? 11.5 : 13, color: "#5A7A48", marginTop: 4 }}>
//                 {s.label}
//               </div>
//             </div>
//           ))}
//         </div> */}

//       </div>
//     </section>
//   );
// }










import React, { useEffect, useState } from "react";
import { C } from "../../../constants/theme";

const pillars = [
  { icon: "♻️", title: "Eco Packaging", desc: "Biodegradable boxes, zero plastic" },
  { icon: "⛏️", title: "Natural Clay Sourcing", desc: "Ethically mined from Rajasthan mineral beds" },
  { icon: "👩", title: "Women Artisans", desc: "60% of our artisans are women-led cooperatives" },
  { icon: "🤲", title: "Handmade Process", desc: "Zero industrial machinery, pure craft" },
];

export default function Sustainability() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1400);

  useEffect(() => {
    const r = () => setW(window.innerWidth);
    r();
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  const isMobile = w < 768;

  return (
    <section style={{
      padding: isMobile ? "60px 16px" : "100px 40px",
      background: "linear-gradient(135deg,#F0F7E8 0%,#E5F2D8 40%,#EEF7E6 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Decorative Blurs */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `${C.green}15`, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: `${C.teal}15`, filter: "blur(50px)" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
        
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? 36 : 50 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.green, textTransform: "uppercase" }}>
            Sustainability
          </span>
          <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: isMobile ? 28 : "clamp(32px,3.5vw,48px)", margin: "10px 0 12px", color: C.dark }}>
            Crafting a Greener Tomorrow
          </h2>
          <p style={{ maxWidth: 540, margin: "0 auto", lineHeight: 1.7, color: "#4A6A35", fontSize: isMobile ? 13.5 : 15 }}>
            Every piece of Earthen Echoes pottery is born from sustainable practices that honour the earth.
          </p>
        </div>

        {/* Pillars Display */}
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
            {pillars.map((p) => (
              <div
                key={p.title}
                style={{
                  scrollSnapAlign: "start",
                  minWidth: "210px",
                  maxWidth: "210px",
                  background: "rgba(255,255,255,.8)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 20,
                  padding: "20px 16px",
                  textAlign: "left",
                  border: "1px solid rgba(118,168,69,.3)",
                  boxShadow: "0 6px 20px rgba(118,168,69,.08)",
                  display: "flex",
                  flexDirection: "column",
                  justify: "space-between",
                  flexShrink: 0
                }}
              >
                <div>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
                  <h3 style={{ margin: "0 0 6px", fontFamily: "Playfair Display,serif", fontSize: 16, color: C.dark, lineHeight: 1.25 }}>
                    {p.title}
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: "#5A7A48" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
            gap: 20 
          }}>
            {pillars.map((p) => (
              <div
                key={p.title}
                style={{
                  background: "rgba(255,255,255,.72)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 24,
                  padding: "28px 20px",
                  textAlign: "center",
                  border: "1px solid rgba(118,168,69,.3)",
                  boxShadow: "0 6px 24px rgba(118,168,69,.12)"
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{p.icon}</div>
                <h3 style={{ margin: "0 0 10px", fontFamily: "Playfair Display,serif", fontSize: 18, color: C.dark }}>
                  {p.title}
                </h3>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: "#5A7A48" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}