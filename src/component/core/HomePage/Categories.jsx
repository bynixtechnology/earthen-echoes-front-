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
  },
};

function CategoryCard({ cat, i, mobile }) {
  const place = catGridMap.desktop[i] || {};
  const isTall = i === 0 || i === 5;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={
        cat.slug
          ? `/products?category=${encodeURIComponent(cat.slug)}`
          : cat.id
          ? `/products?category=${encodeURIComponent(cat.id)}`
          : "/products"
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: mobile ? 20 : 24,
        minHeight: mobile ? 240 : isTall ? 580 : 280,
        gridColumn: mobile ? "auto" : place.col,
        gridRow: mobile ? "auto" : place.row,
        boxShadow: isHovered
          ? "0 20px 30px -10px rgba(28,18,8,0.15)"
          : "0 10px 20px -10px rgba(28,18,8,0.06)",
        background: "#E5E0D8",
        display: "block",
        textDecoration: "none",
        transition:
          "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease",
        transform: isHovered && !mobile ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Background Image */}
      <img
        src={cat.image || img(cat.img)}
        alt={cat.name}
        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
        }}
      />

      {/* Atmospheric Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(28,18,8,0.4) 70%, rgba(28,18,8,0.85) 100%)",
        }}
      />

      {/* Top Details */}
      <div
        style={{
          position: "absolute",
          top: mobile ? 12 : 16,
          left: mobile ? 12 : 16,
          right: mobile ? 12 : 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: cat.color || C.teal,
              boxShadow: "0 0 8px rgba(255,255,255,0.8)",
            }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div
        style={{
          position: "absolute",
          left: mobile ? 14 : 20,
          right: mobile ? 14 : 20,
          bottom: mobile ? 14 : 20,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: mobile ? 8 : 12,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#FFFFFF",
            fontSize: mobile ? 18 : isTall ? 26 : 20,
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          {cat.name}
        </h3>

        <div
          style={{
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: isHovered
              ? "#FFFFFF"
              : "rgba(255, 255, 255, 0.18)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: mobile ? "6px 12px" : "8px 16px",
            borderRadius: 100,
            color: isHovered ? C.dark : "#FFFFFF",
            fontSize: mobile ? 11 : 12,
            fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.3)",
            transition: "all 0.3s ease",
          }}
        >
          <span>Explore</span>
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
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 992 : false
  );

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
        const rawList = res?.data ?? res?.categories ?? res ?? [];
        if (!mounted) return;

        // Sirf isFeatured: true wali categories filter hongi
        const featuredCategories = (Array.isArray(rawList) ? rawList : [])
          .filter((item) => Boolean(item?.isFeatured))
          .slice(0, 6)
          .map((item, index) => ({
            id: item._id,
            slug: item.slug,
            name: item.name || "Category",
            desc: item.description || "Traditional Handcrafted Collection",
            image: item.image || item.imageUrl,
            totalProducts: item.totalProducts ?? 0,
            activeProducts: item.activeProducts ?? item.totalProducts ?? 0,
            isFeatured: true,
            img: "1603697486934-686e0b3c9f06",
            color: [
              C.coral,
              C.teal,
              C.raspberry,
              C.green,
              C.raspberry,
              C.teal,
            ][index % 6],
          }));

        setCategories(featuredCategories);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      style={{
        padding: mobile ? "40px 16px" : "40px 20px",
        background: C.ivory,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: mobile ? 32 : 48,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              color: C.teal,
              textTransform: "uppercase",
              display: "block",
              marginBottom: 8,
            }}
          >
            Artisan Curation
          </span>
          <h2
            style={{
              fontSize: mobile ? 28 : 44,
              margin: "0 0 10px 0",
              color: C.dark,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Shop by Category
          </h2>
          <p
            style={{
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.5,
              color: "#6B5B4E",
              fontSize: mobile ? 13 : 15,
            }}
          >
            Explore heritage decor and artisanal creations from Rajasthan.
          </p>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 60,
            }}
          >
            <Loader2 className="animate-spin" color={C.teal} size={32} />
          </div>
        ) : error ? (
          <p style={{ textAlign: "center", color: "#D9383A" }}>{error}</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile
                ? "repeat(2, 1fr)"
                : "repeat(4, 1fr)",
              gridAutoRows: mobile ? "auto" : "280px",
              gap: mobile ? 12 : 20,
            }}
          >
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.id || i}
                cat={cat}
                i={i}
                mobile={mobile}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}