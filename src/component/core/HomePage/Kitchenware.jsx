import React, { useEffect, useState, useRef } from "react";
import { C } from "../../../constants/theme";
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
import { addProductToCart, fetchCart } from "../../../redux/thunks/cartThunk";
import { getWishlist, toggleWishlist } from "../../../redux/thunks/wishlistThunk";
import { selectCartLoading } from "../../../redux/slices/cartSlice";
import { selectWishlistItems } from "../../../redux/slices/wishlistSlice";
import { showToast } from "../../../config/toast";

const Kitchenware = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adding = useSelector(selectCartLoading);
  const wishlistItems = useSelector(selectWishlistItems) || [];
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += dir * 320;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchKitchenware = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await ProductService.getPublic({
          page: 1,
          limit: 1000,
          categoryName: "Traditional Kitchenware",
        });

        const rawList = Array.isArray(response?.products)
          ? response.products
          : Array.isArray(response?.data?.products)
          ? response.data.products
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        // 🟢 FIX: Case-insensitive check on name, title, and slug
        const targetCategory = "traditional kitchenware";
        const kitchenwareProducts = rawList.filter((item) => {
          const catName = item?.category?.name?.toLowerCase()?.trim();
          const catTitle = item?.category?.title?.toLowerCase()?.trim();
          const catSlug = item?.category?.slug?.toLowerCase()?.trim();
          const directCat = typeof item?.category === "string" ? item.category.toLowerCase().trim() : "";

          return (
            catName === targetCategory ||
            catTitle === targetCategory ||
            catSlug === "traditional-kitchenware" ||
            directCat === targetCategory
          );
        });

        if (isMounted) {
          // Fallback to rawList if API already pre-filtered the products
          setProducts(kitchenwareProducts.length > 0 ? kitchenwareProducts : rawList);
        }
      } catch (err) {
        console.error("FETCH KITCHENWARE ERROR:", err);
        if (isMounted) {
          setProducts([]);
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load kitchenware products."
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    dispatch(getWishlist());
    fetchKitchenware();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const handleProductClick = (productId) => {
    if (!productId) return;
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = async (event, product, activeVariant) => {
    event.stopPropagation();
    const productId = product?._id || product?.id;
    if (!productId) return;

    try {
      const response = await dispatch(
        addProductToCart({
          productId,
          quantity: 1,
          variant: activeVariant ? activeVariant : undefined,
        })
      ).unwrap();

      showToast.success(response?.message || "Product added to cart.");
      dispatch(fetchCart());
    } catch (err) {
      showToast.error(err?.message || err || "Unable to add product.");
    }
  };

  const handleWishlist = async (event, productId) => {
    event.stopPropagation();
    if (!productId) return;

    try {
      const response = await dispatch(toggleWishlist(productId)).unwrap();
      showToast.success(response?.message || "Wishlist updated.");
    } catch (err) {
      showToast.error(err?.message || err || "Failed to update wishlist.");
    }
  };

  const displayedProducts = products.slice(0, 4);

  return (
    <section
      style={{
        padding: isMobile ? "60px 16px" : "100px 24px",
        overflow: "hidden",
      }}
    >
      <div className="max-w-[1240px] mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? 20 : 0,
            marginBottom: isMobile ? 32 : 48,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(30px, 4vw, 52px)",
                color: C?.dark || "#1C1208",
                letterSpacing: "-1px",
                lineHeight: 1.1,
              }}
            >
              Kitchen Ware Collection
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
              to="/products?category=traditional-kitchenware"
              style={{
                textDecoration: "none",
                color: C?.coral || "#F16937",
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
                    width: 48,
                    height: 48,
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
                    e.currentTarget.style.background = C?.coral || "#F16937";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = C?.coral || "#F16937";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = C?.dark || "#1C1208";
                    e.currentTarget.style.borderColor = "#D9D2CC";
                  }}
                >
                  ←
                </button>

                <button
                  onClick={() => scroll(1)}
                  style={{
                    width: 48,
                    height: 48,
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
                    e.currentTarget.style.background = C?.coral || "#F16937";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = C?.coral || "#F16937";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = C?.dark || "#1C1208";
                    e.currentTarget.style.borderColor = "#D9D2CC";
                  }}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {isLoading ? (
          <div
            style={{
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader2 size={46} className="animate-spin" color={C?.coral || "#F16937"} />
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
            No kitchenware products found.
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
              gap: isMobile ? 16 : 28,
              overflowX: isMobile ? "visible" : "auto",
              scrollBehavior: "smooth",
              padding: isMobile ? "4px" : "12px 4px 20px 4px",
            }}
          >
            {displayedProducts.map((product, index) => (
              <KitchenwareCard
                key={product._id || product.id || index}
                product={product}
                index={index}
                isMobile={isMobile}
                adding={adding}
                wishlistItems={wishlistItems}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
                onWishlist={handleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ============================================================================
    KITCHENWARE CARD SUB-COMPONENT
============================================================================ */
const KitchenwareCard = ({
  product,
  index,
  isMobile,
  adding,
  wishlistItems,
  onProductClick,
  onAddToCart,
  onWishlist,
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const productId = product?._id || product?.id;

  const hasVariants = Boolean(
    product?.hasVariants &&
      Array.isArray(product?.variants) &&
      product.variants.length > 0
  );

  const activeVariant = hasVariants
    ? product.variants[selectedVariantIndex] || product.variants[0]
    : null;

  const resolveImage = (imgObj) => {
    if (!imgObj) return null;
    if (typeof imgObj === "string") return imgObj;
    return imgObj.url || imgObj.secure_url || null;
  };

  const imagesSource =
    hasVariants && activeVariant?.images?.length > 0
      ? activeVariant.images
      : product?.images;

  const image =
    resolveImage(imagesSource?.[0]) ||
    resolveImage(product?.image) ||
    "/placeholder.png";

  const isWishlisted = wishlistItems.some(
    (item) =>
      item?.productId?._id === productId ||
      item?.productId === productId ||
      item?.product === productId ||
      item?._id === productId
  );

  const price = Number(activeVariant?.price ?? product?.price ?? 0);
  const originalPrice = Number(
    activeVariant?.originalPrice ?? product?.originalPrice ?? product?.mrp ?? 0
  );

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : product?.discountPercentage
      ? Math.round(product.discountPercentage)
      : 0;

  const mobileRadiusProfiles = [
    "20px 12px 20px 12px",
    "12px 20px 12px 20px",
    "18px 18px 8px 20px",
    "8px 20px 18px 18px",
  ];
  const cardRadius = isMobile
    ? mobileRadiusProfiles[index % mobileRadiusProfiles.length]
    : 24;

  return (
    <div
      className="group"
      onClick={() => onProductClick(productId)}
      style={{
        width: "100%",
        background: "#fff",
        borderRadius: cardRadius,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        border: "1px solid rgba(28,18,8,.08)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        transition: "all .4s cubic-bezier(.16,1,.3,1)",
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
          alt={product.title || product.name || "Kitchenware Product"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 40%)",
            pointerEvents: "none",
          }}
        />

        {/* Discount */}
        {discount > 0 && (
          <div
            style={{
              position: "absolute",
              top: isMobile ? 10 : 14,
              right: isMobile ? 10 : 14,
              background: C?.raspberry || "#E11D48",
              color: "#fff",
              padding: isMobile ? "4px 8px" : "6px 12px",
              borderRadius: 50,
              fontSize: isMobile ? 10 : 11,
              fontWeight: 700,
              zIndex: 2,
            }}
          >
            -{discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => onWishlist(e, productId)}
          style={{
            position: "absolute",
            right: isMobile ? 10 : 14,
            bottom: isMobile ? 10 : 14,
            width: isMobile ? 34 : 40,
            height: isMobile ? 34 : 40,
            borderRadius: "50%",
            border: `1.5px solid ${
              isWishlisted ? C?.raspberry || "#E11D48" : "rgba(28,18,8,.12)"
            }`,
            background: isWishlisted
              ? "rgba(228,69,135,.15)"
              : "rgba(255,255,255,.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
            backdropFilter: "blur(4px)",
          }}
        >
          <Heart
            size={isMobile ? 14 : 18}
            className={
              isWishlisted ? "fill-red-500 text-red-500" : ""
            }
          />
        </button>

        {/* Quick Add */}
        {!isMobile && (
          <div className="absolute inset-x-0 bottom-0 p-4 pt-6 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
            <button
              type="button"
              onClick={(e) => onAddToCart(e, product, activeVariant)}
              style={{
                width: "100%",
                border: "none",
                borderRadius: 50,
                background: "#fff",
                color: C?.coral || "#F16937",
                height: 42,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
          padding: isMobile ? "12px 12px 16px" : "18px 20px 22px",
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
              marginBottom: isMobile ? 6 : 8,
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
              ({product.reviewsCount || product.reviews?.length || 0})
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: isMobile ? 13 : 15,
              fontWeight: 600,
              color: C?.dark || "#1C1208",
              lineHeight: 1.35,
              margin: "0 0 8px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.title || product.name}
          </h3>

          {/* COLOR VARIANTS SWATCHES PREVIEW */}
          {hasVariants && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 10,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {product.variants.map((v, idx) => (
                <button
                  key={v.sku || idx}
                  type="button"
                  title={v.colorName}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariantIndex(idx);
                  }}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "1px solid #CCC",
                    backgroundColor: v.colorCode || "#CCC",
                    cursor: "pointer",
                    transform:
                      selectedVariantIndex === idx ? "scale(1.25)" : "scale(1)",
                    outline:
                      selectedVariantIndex === idx
                        ? `2px solid ${C?.coral || "#F16937"}`
                        : "none",
                    outlineOffset: 1,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          {/* Price */}
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
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: isMobile ? 16 : 20,
                  fontWeight: 700,
                  color: C?.dark || "#1C1208",
                }}
              >
                ₹{Number(price || 0).toLocaleString("en-IN")}
              </span>

              {originalPrice > price && (
                <span
                  style={{
                    fontSize: isMobile ? 11 : 13,
                    color: "#B0A090",
                    textDecoration: "line-through",
                  }}
                >
                  ₹{Number(originalPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          {/* Mobile Add to Cart Button */}
          {isMobile && (
            <button
              type="button"
              onClick={(e) => onAddToCart(e, product, activeVariant)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: 12,
                background: "rgba(241, 105, 55, 0.08)",
                border: "1px solid rgba(241, 105, 55, 0.3)",
                color: C?.coral || "#F16937",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                marginTop: 8,
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
};

export default Kitchenware;