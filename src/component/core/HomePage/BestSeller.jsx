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
import { addProductToCart, fetchCart } from "../../../redux/thunks/cartThunk";
import { getWishlist, toggleWishlist } from "../../../redux/thunks/wishlistThunk";
// 🟢 FIXED IMPORT: selectCartAdding ki jagah selectCartLoading use karein
import { selectCartLoading } from "../../../redux/slices/cartSlice";
import { selectWishlistItems } from "../../../redux/slices/wishlistSlice";
import { showToast } from "../../../config/toast";

const BestSeller = () => {
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
  const adding = useSelector(selectCartLoading); // 🟢 Selector Updated
  const wishlistItems = useSelector(selectWishlistItems) || [];
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += dir * 320;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchBestSellers = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await ProductService.getPublic({
          page: 1,
          limit: 12,
          isFeatured: true,
        });

        const productList = Array.isArray(response?.products)
          ? response.products
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
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
        padding: isMobile ? "40px 16px" : "60px 40px",
        overflow: "hidden",
      }}
    >
      <div className="max-w-7xl mx-auto">
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
                fontSize: "clamp(30px, 4vw, 52px)",
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
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>

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
            No best sellers found.
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
              <BestSellerCard
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

const BestSellerCard = ({
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
      item.productId?._id === productId ||
      item.product === productId ||
      item._id === productId
  );

  const badge = [
    { text: "Best Seller", color: C.coral },
    { text: "Trending", color: C.teal },
    { text: "Editor's Pick", color: C.raspberry },
    { text: "New", color: C.green },
  ][index % 4];

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

  return (
    <div
      className="group transition-all duration-300 hover:-translate-y-2"
      onClick={() => onProductClick(productId)}
      style={{
        width: "100%",
        background: "#fff",
        borderRadius: 24,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        border: "1px solid rgba(28,18,8,.08)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
      }}
    >
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
          alt={product.title || product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
          }}
        />

        <button
          onClick={(e) => onWishlist(e, productId)}
          style={{
            position: "absolute",
            right: 14,
            bottom: 14,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(255,255,255,.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <Heart
            size={18}
            className={isWishlisted ? "fill-red-500 text-red-500" : ""}
          />
        </button>

        {!isMobile && (
          <div className="absolute inset-x-0 bottom-0 p-4 pt-6 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
            <button
              onClick={(e) => onAddToCart(e, product, activeVariant)}
              style={{
                width: "100%",
                border: "none",
                borderRadius: 50,
                background: "#fff",
                color: badge.color,
                height: 42,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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

      <div
        style={{
          padding: "18px 20px 22px",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 8 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
            ))}
          </div>

          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: C.dark,
              margin: "0 0 8px",
            }}
          >
            {product.title || product.name}
          </h3>
        </div>

        <div>
          <span style={{ fontSize: 18, fontWeight: 700, color: C.dark }}>
            ₹{price.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BestSeller;