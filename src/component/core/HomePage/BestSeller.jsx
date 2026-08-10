import React, { useEffect, useState, useRef } from "react";
import { C, img } from "../../../constants/theme";
import {
  Heart,
  ShoppingCart,
  Star,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ProductService } from "../../../services/productService";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart } from "../../../redux/thunks/cartThunk";
import { getWishlist, toggleWishlist } from "../../../redux/thunks/wishlistThunk";
import { selectCartAdding } from "../../../redux/slices/cartSlice";
import { selectWishlistItems } from "../../../redux/slices/wishlistSlice";
import { showToast } from "../../../config/toast";

const BestSeller = () => {
  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adding = useSelector(selectCartAdding);
  const wishlistItems = useSelector(selectWishlistItems);
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += dir * 320;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Fetch Best Sellers
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    let isMounted = true;

    const fetchBestSellers = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await ProductService.getAll({
          page: 1,
          limit: 1000,
          isActive: true,
          isFeatured: true,
        });

        const productList = Array.isArray(response?.products)
          ? response.products
          : Array.isArray(response?.data)
          ? response.data
          : [];

        if (isMounted) {
          setProducts(productList);
        }
      } catch (error) {
        console.error("FETCH BEST SELLERS ERROR:", error);
        if (isMounted) {
          setProducts([]);
          setError(
            error?.response?.data?.message ||
              error?.message ||
              "Unable to load products."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    dispatch(getWishlist());
    fetchBestSellers();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Handlers
  |--------------------------------------------------------------------------
  */
  const handleProductClick = (productId) => {
    if (!productId) return;
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = async (event, productId) => {
    event.stopPropagation();
    if (!productId) return;

    try {
      const response = await dispatch(
        addProductToCart({
          productId,
          quantity: 1,
        })
      ).unwrap();

      showToast.success(response?.message || "Product added to cart.");
    } catch (error) {
      showToast.error(error?.message || error || "Unable to add product.");
    }
  };

  const handleWishlist = async (event, productId) => {
    event.stopPropagation();
    if (!productId) return;

    try {
      const response = await dispatch(toggleWishlist(productId)).unwrap();
      showToast.success(response.message);
    } catch (error) {
      showToast.error(error?.message || error);
    }
  };

  const displayedProducts = products.slice(0, 4);

  return (
    <section
      style={{
        padding: isMobile ? "70px 16px" : "110px 0",
        background: C.cream,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: isMobile ? "0" : "0 40px",
        }}
      >
        {/* ================= HEADER ================= */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? 20 : 0,
            marginBottom: 48,
          }}
        >
          <div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 4,
                color: C.teal,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}
            >
              Curated Masterpieces
            </span>
            <h2
              style={{
                margin: 0,
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(32px, 5vw, 56px)",
                color: C.dark,
                letterSpacing: "-1px",
                lineHeight: 1.1,
              }}
            >
              Our Best Sellers
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              width: isMobile ? "100%" : "auto",
              justifyContent: isMobile ? "space-between" : "flex-end",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Link
              to="/products"
              style={{
                textDecoration: "none",
                color: C.coral,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              View All
              <ArrowRight size={18} />
            </Link>

            {!isMobile && (
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => scroll(-1)}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    border: "1.5px solid #D9D2CC",
                    background: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: ".3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.coral;
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = C.coral;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = C.dark;
                    e.currentTarget.style.borderColor = "#D9D2CC";
                  }}
                >
                  ←
                </button>

                <button
                  onClick={() => scroll(1)}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    border: "1.5px solid #D9D2CC",
                    background: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: ".3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.coral;
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = C.coral;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = C.dark;
                    e.currentTarget.style.borderColor = "#D9D2CC";
                  }}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= LOADER / ERROR / GRID ================= */}
        {isLoading ? (
          <div
            style={{
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader2 size={46} className="animate-spin" color={C.coral} />
          </div>
        ) : error ? (
          <div
            style={{
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#DC2626",
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            {error}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div
            style={{
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#777",
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            No products found.
          </div>
        ) : (
          <div
            ref={scrollRef}
            className={isMobile ? "" : "hide-scrollbar"}
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(4, minmax(0, 1fr))",
              gap: isMobile ? 14 : 28,
              overflowX: isMobile ? "visible" : "auto",
              scrollBehavior: "smooth",
              paddingBottom: 12,
            }}
          >
            {displayedProducts.map((product, index) => {
              const productId = product?._id || product?.id;

              const image =
                typeof product?.images?.[0] === "string"
                  ? product.images[0]
                  : product?.images?.[0]?.url ||
                    product?.image?.url ||
                    product?.image ||
                    "/placeholder.png";

              const isWishlisted = wishlistItems.some(
                (item) =>
                  item.productId?._id === productId || item.product === productId
              );

              const badge =
                [
                  { text: "Best Seller", color: C.coral },
                  { text: "Trending", color: C.teal },
                  { text: "Editor's Pick", color: C.raspberry },
                  { text: "New", color: C.green },
                ][index % 4];

              const discount =
                product?.originalPrice || product?.mrp
                  ? Math.round(
                      (1 -
                        product.price /
                          (product.originalPrice || product.mrp)) *
                        100
                    )
                  : 20;

              // Asymmetric mobile border radiuses for magazine look
              const mobileRadiusProfiles = ["24px 12px 24px 12px", "12px 24px 12px 24px", "20px 20px 8px 24px", "8px 24px 20px 20px"];
              const cardRadius = isMobile ? mobileRadiusProfiles[index % mobileRadiusProfiles.length] : 28;

              return (
                <div
                  key={productId || index}
                  onClick={() => handleProductClick(productId)}
                  style={{
                    width: "100%",
                    background: "#fff",
                    borderRadius: cardRadius,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    border: "1px solid rgba(28,18,8,.06)",
                    boxShadow: "0 10px 30px rgba(0,0,0,.06)",
                    transition: "all .5s cubic-bezier(.16,1,.3,1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow =
                        "0 25px 55px rgba(0,0,0,.12)";

                      const imgEl = e.currentTarget.querySelector("img");
                      if (imgEl) {
                        imgEl.style.transform = "scale(1.08)";
                      }

                      const quick = e.currentTarget.querySelector(".quick-add");
                      if (quick) {
                        quick.style.transform = "translateY(0)";
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 30px rgba(0,0,0,.06)";

                      const imgEl = e.currentTarget.querySelector("img");
                      if (imgEl) {
                        imgEl.style.transform = "scale(1)";
                      }

                      const quick = e.currentTarget.querySelector(".quick-add");
                      if (quick) {
                        quick.style.transform = "translateY(100%)";
                      }
                    }
                  }}
                >
                  {/* IMAGE CONTAINER */}
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: isMobile ? "4/5" : "auto",
                      height: isMobile ? "auto" : 260,
                      overflow: "hidden",
                      background: "#F4EFEA",
                    }}
                  >
                    <img
                      src={image}
                      alt={product.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: ".6s cubic-bezier(.16,1,.3,1)",
                      }}
                    />

                    {/* Gradient Overlay for Mobile Badges Readability */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 40%)",
                      }}
                    />

                    {/* Badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: isMobile ? 10 : 14,
                        left: isMobile ? 10 : 14,
                        background: badge.color,
                        color: "#fff",
                        padding: isMobile ? "4px 10px" : "6px 12px",
                        borderRadius: 50,
                        fontSize: isMobile ? 10 : 11,
                        fontWeight: 700,
                        letterSpacing: ".03em",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      {badge.text}
                    </div>

                    {/* Discount */}
                    <div
                      style={{
                        position: "absolute",
                        top: isMobile ? 10 : 14,
                        right: isMobile ? 10 : 14,
                        background: C.raspberry,
                        color: "#fff",
                        padding: isMobile ? "4px 10px" : "6px 12px",
                        borderRadius: 50,
                        fontSize: isMobile ? 10 : 11,
                        fontWeight: 700,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      -{discount}%
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleWishlist(e, productId)}
                      style={{
                        position: "absolute",
                        right: isMobile ? 10 : 14,
                        bottom: isMobile ? 10 : 14,
                        width: isMobile ? 36 : 42,
                        height: isMobile ? 36 : 42,
                        borderRadius: "50%",
                        border: `1.5px solid ${
                          isWishlisted ? C.raspberry : "rgba(28,18,8,.15)"
                        }`,
                        background: isWishlisted
                          ? "rgba(228,69,135,.1)"
                          : "rgba(255,255,255,.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Heart
                        size={isMobile ? 15 : 18}
                        className={
                          isWishlisted ? "fill-red-500 text-red-500" : ""
                        }
                      />
                    </button>

                    {/* Quick Add (Desktop Hover) */}
                    {!isMobile && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          padding: "22px 16px 14px",
                          background: `linear-gradient(0deg,${badge.color}EE 0%,${badge.color}AA 60%,transparent 100%)`,
                          transform: "translateY(100%)",
                          transition: ".35s",
                        }}
                        className="quick-add"
                      >
                        <button
                          onClick={(e) => handleAddToCart(e, productId)}
                          style={{
                            width: "100%",
                            border: "none",
                            borderRadius: 50,
                            background: "#fff",
                            color: badge.color,
                            height: 46,
                            fontWeight: 700,
                            fontSize: 14,
                            cursor: "pointer",
                          }}
                        >
                          {adding ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            "+ Quick Add"
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* CARD CONTENT */}
                  <div
                    style={{
                      padding: isMobile ? "12px 12px 14px" : "18px 20px 20px",
                      background: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      flex: 1,
                    }}
                  >
                    <div>
                      {/* Rating */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          marginBottom: isMobile ? 4 : 8,
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            size={isMobile ? 11 : 13}
                            fill={
                              i <= Math.round(product.rating || 4.8)
                                ? "#F59E0B"
                                : "#E5E7EB"
                            }
                            color={
                              i <= Math.round(product.rating || 4.8)
                                ? "#F59E0B"
                                : "#E5E7EB"
                            }
                          />
                        ))}

                        <span
                          style={{
                            fontSize: isMobile ? 10 : 12,
                            color: "#8A7A6E",
                            marginLeft: 4,
                          }}
                        >
                          ({product.reviewCount || product.reviews?.length || 127})
                        </span>
                      </div>

                      {/* Product Name */}
                      <h3
                        style={{
                          fontSize: isMobile ? 13 : 15,
                          fontWeight: 600,
                          color: C.dark,
                          lineHeight: 1.35,
                          margin: "0 0 10px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.title || product.name}
                      </h3>
                    </div>

                    <div>
                      {/* Price Section */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 6,
                          marginBottom: isMobile ? 10 : 0,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                          <span
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: isMobile ? 16 : 22,
                              fontWeight: 700,
                              color: C.dark,
                            }}
                          >
                            ₹{Number(product.price || 0).toLocaleString("en-IN")}
                          </span>

                          {(product.originalPrice || product.mrp) && (
                            <span
                              style={{
                                fontSize: isMobile ? 11 : 14,
                                color: "#B0A090",
                                textDecoration: "line-through",
                              }}
                            >
                              ₹
                              {Number(
                                product.originalPrice || product.mrp
                              ).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Unique Frosted Glass Mobile Add to Cart Button */}
                      {isMobile && (
                        <button
                          onClick={(e) => handleAddToCart(e, productId)}
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: 12,
                            background: "rgba(241, 105, 55, 0.08)",
                            border: "1px solid rgba(241, 105, 55, 0.3)",
                            color: C.coral,
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            transition: "all 0.2s ease",
                          }}
                        >
                          <ShoppingCart size={13} />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSeller;