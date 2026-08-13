/*
 * Earthen Echoes palette matched to supplied reference:
 * coral #F16937 | raspberry #E44587 | teal #1BACB1 | green #76A845
 * ivory #FFFDF9 | ivory-dark #F5F0E8 | charcoal #1C1917 | stone #78716C
 */
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Heart,
  Leaf,
  Loader2,
  Minus,
  PackageCheck,
  Plus,
  RefreshCw,
  Ruler,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Sun,
  Trees,
  Truck,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchProductById } from "../../../redux/thunks/productThunk";
import {
  clearSelectedProduct,
  selectSelectedProduct,
  selectProductDetailsLoading,
  selectProductError,
} from "../../../redux/slices/productSlice";
import { addProductToCart, fetchCart } from "../../../redux/thunks/cartThunk";
// 🟢 FIXED: Safe selector import to prevent runtime import crash
import { selectCartLoading } from "../../../redux/slices/cartSlice";
import { selectWishlistItems } from "../../../redux/slices/wishlistSlice";
import {
  getWishlist,
  toggleWishlist as toggleWishlistThunk,
} from "../../../redux/thunks/wishlistThunk";
import { showToast } from "../../../config/toast";

const TABS = ["description", "specifications", "shipping", "reviews"];

const ProductDetailHeroSection = ({ setCategoryId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector(selectSelectedProduct);
  const loading = useSelector(selectProductDetailsLoading);
  const error = useSelector(selectProductError);
  const isAdding = useSelector(selectCartLoading);
  const wishlistItems = useSelector(selectWishlistItems) || [];

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!id) return;

    dispatch(fetchProductById(id));
    dispatch(getWishlist());

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  // Handle active variant resolution
  const hasVariants = Boolean(
    product?.hasVariants &&
      Array.isArray(product?.variants) &&
      product.variants.length > 0
  );

  const activeVariant = useMemo(() => {
    if (!hasVariants) return null;
    return product.variants[selectedVariantIndex] || product.variants[0];
  }, [hasVariants, product?.variants, selectedVariantIndex]);

  // Dynamic Image extraction logic
  const productImages = useMemo(() => {
    let imagesSource = [];

    if (hasVariants && activeVariant?.images?.length > 0) {
      imagesSource = activeVariant.images;
    } else if (Array.isArray(product?.images) && product.images.length > 0) {
      imagesSource = product.images;
    }

    return imagesSource
      .map((image) => {
        if (typeof image === "string") return image;
        return image?.url || image?.secure_url || "";
      })
      .filter(Boolean);
  }, [hasVariants, activeVariant, product?.images]);

  useEffect(() => {
    const firstImage = productImages[0] || "/placeholder.png";
    setSelectedImage(firstImage);
    setSelectedImageIndex(0);
  }, [productImages]);

  useEffect(() => {
    const categoryId =
      typeof product?.category === "object"
        ? product?.category?._id
        : product?.category;

    if (categoryId && typeof setCategoryId === "function") {
      setCategoryId(categoryId);
    }
  }, [product, setCategoryId]);

  useEffect(() => {
    setQuantity(1);
    setSelectedVariantIndex(0);
    setActiveTab("description");
    setPincode("");
    setPincodeMsg("");
  }, [id]);

  const productName = product?.title;

  const wished = useMemo(() => {
    if (!product?._id || !Array.isArray(wishlistItems)) return false;

    return wishlistItems.some((item) => {
      const wishlistProduct = item?.product;
      return (
        wishlistProduct === product._id ||
        wishlistProduct?._id === product._id ||
        item?._id === product._id
      );
    });
  }, [wishlistItems, product?._id]);

  // Dynamic pricing, stock, sku based on active variant or main product
  const stock = Number(
    activeVariant?.stock ?? product?.stock ?? product?.quantity ?? 0
  );
  const price = Number(activeVariant?.price ?? product?.price ?? 0);
  const originalPrice = Number(
    activeVariant?.originalPrice ?? product?.originalPrice ?? product?.mrp ?? 0
  );
  const sku = activeVariant?.sku || product?.sku || "N/A";

  const categoryName =
    typeof product?.category === "object"
      ? product?.category?.name || product?.category?.title || ""
      : "";

  const categoryId =
    typeof product?.category === "object"
      ? product?.category?._id
      : product?.category;

  const rating = Number(product?.rating || 0);
  const reviewCount = Number(
    product?.reviewCount ??
      product?.reviewsCount ??
      product?.totalReviews ??
      product?.reviews?.length ??
      0
  );

  const discountPercentage = useMemo(() => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }, [originalPrice, price]);

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  const decreaseQuantity = () => {
    setQuantity((previous) => Math.max(1, previous - 1));
  };

  const increaseQuantity = () => {
    if (stock <= 0) return;
    setQuantity((previous) => Math.min(previous + 1, stock));
  };

  const handleQuantityChange = (event) => {
    let value = Number(event.target.value);
    if (!Number.isFinite(value)) return;

    value = Math.floor(value);
    if (value < 1) value = 1;
    if (stock > 0 && value > stock) value = stock;

    setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (!product?._id) {
      showToast?.error?.("Product not found.");
      return;
    }

    if (stock <= 0) {
      showToast?.error?.("Product is out of stock.");
      return;
    }

    try {
      const response = await dispatch(
        addProductToCart({
          productId: product._id,
          quantity,
          variant: activeVariant ? activeVariant : undefined,
        })
      ).unwrap();

      showToast?.success?.(response?.message || "Product added to cart.");
      dispatch(fetchCart());
    } catch (cartError) {
      showToast?.error?.(
        typeof cartError === "string"
          ? cartError
          : cartError?.message || "Unable to add product to cart."
      );
    }
  };

  const handleBuyNow = async () => {
    if (!product?._id) {
      showToast?.error?.("Product not found.");
      return;
    }

    if (stock <= 0) {
      showToast?.error?.("Product is out of stock.");
      return;
    }

    navigate("/checkout", {
      state: {
        buyNowItem: {
          product: product,
          quantity: quantity,
          price: price,
          selectedVariant: activeVariant,
        },
      },
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: productName,
          text: product?.description || "",
          url: window.location.href,
        });
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      showToast?.success?.("Product link copied.");
    } catch (shareError) {
      if (shareError?.name !== "AbortError") {
        console.error("Share error:", shareError);
      }
    }
  };

  const handleWishlist = async () => {
    if (!product?._id) {
      showToast?.error?.("Product not found.");
      return;
    }

    setHeartAnim(true);
    window.setTimeout(() => setHeartAnim(false), 400);

    try {
      const response = await dispatch(toggleWishlistThunk(product._id)).unwrap();
      showToast?.success?.(
        response?.message ||
          (wished ? "Product removed from wishlist." : "Product added to wishlist.")
      );

      await dispatch(getWishlist());
    } catch (wishlistError) {
      showToast?.error?.(
        typeof wishlistError === "string"
          ? wishlistError
          : wishlistError?.message || "Unable to update wishlist."
      );
    }
  };

  const checkPincode = () => {
    if (/^\d{6}$/.test(pincode)) {
      setPincodeMsg("Delivery available · Shipping options shown at checkout");
    } else {
      setPincodeMsg("Please enter a valid 6-digit PIN code");
    }
  };

  const selectImage = (image, index) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
  };

  const showPreviousImage = () => {
    if (!productImages.length) return;
    const nextIndex =
      (selectedImageIndex - 1 + productImages.length) % productImages.length;
    selectImage(productImages[nextIndex], nextIndex);
  };

  const showNextImage = () => {
    if (!productImages.length) return;
    const nextIndex = (selectedImageIndex + 1) % productImages.length;
    selectImage(productImages[nextIndex], nextIndex);
  };

  const currentSpecs = activeVariant?.specifications || product?.specifications || {};

  const specifications = [
    {
      icon: Ruler,
      title: "Dimensions",
      value: currentSpecs.dimensions || product?.dimensions || "Not specified",
    },
    {
      icon: Leaf,
      title: "Material / Composition",
      value:
        currentSpecs.composition ||
        currentSpecs.material ||
        product?.composition ||
        "Not specified",
    },
    {
      icon: Sun,
      title: "Placement",
      value: currentSpecs.placement || "Not specified",
    },
    {
      icon: Box,
      title: "Weight",
      value: currentSpecs.weight || product?.weight || "Not specified",
    },
    {
      icon: Sparkles,
      title: "Finish",
      value: currentSpecs.finish || product?.finish || "Not specified",
    },
    {
      icon: Trees,
      title: "Usage",
      value: currentSpecs.usage || product?.usage || "Indoor / Outdoor",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[560px] flex flex-col items-center justify-center gap-3">
        <Loader2 size={40} className="animate-spin text-[#F16937]" />
        <p className="text-sm text-[#78716C]">Loading product...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-[560px] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-heading font-bold">Unable to load product</h2>
        <p className="mt-2 text-sm text-[#78716C]">{error}</p>
        <button
          type="button"
          onClick={() => dispatch(fetchProductById(id))}
          className="mt-5 px-5 py-3 bg-[#F16937] text-white rounded-xl flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[560px] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/products" className="mt-4 text-[#F16937] font-semibold hover:underline">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] text-[#1C1917] pb-24 lg:pb-0 min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-7">
        <nav className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[rgba(241,105,55,0.07)] px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs text-[#78716C] overflow-x-auto">
          <Link to="/" className="hover:text-[#F16937] whitespace-nowrap">
            Home
          </Link>
          <ChevronRight size={12} className="shrink-0" />
          <Link to="/products" className="hover:text-[#F16937] whitespace-nowrap">
            Catalogue
          </Link>

          {categoryName && (
            <>
              <ChevronRight size={12} className="shrink-0" />
              <Link
                to={categoryId ? `/products?category=${categoryId}` : "/products"}
                className="hover:text-[#F16937] whitespace-nowrap"
              >
                {categoryName}
              </Link>
            </>
          )}

          <ChevronRight size={12} className="shrink-0" />
          <span className="font-medium text-[#1C1917] whitespace-nowrap">
            {productName}
          </span>
        </nav>
      </div>

      {/* Product Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 xl:gap-16">
          {/* Gallery */}
          <div className="min-w-0">
            <div
              className="relative overflow-hidden rounded-[20px] sm:rounded-[30px] bg-[#F5F0E8] border border-[rgba(28,25,23,0.12)]/50 group"
              style={{ aspectRatio: isMobile ? "1 / 1" : "1 / 1.08" }}
              onMouseEnter={() => setZoomed(true)}
              onMouseLeave={() => setZoomed(false)}
            >
              <img
                src={selectedImage || "/placeholder.png"}
                alt={productName}
                className="w-full h-full object-cover transition-transform duration-700 ease-out"
                style={{ transform: zoomed && !isMobile ? "scale(1.07)" : "scale(1)" }}
              />

              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col items-start gap-1.5 sm:gap-2">
                {discountPercentage > 0 && (
                  <span className="rounded-full bg-[#E44587] px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold text-white shadow-sm">
                    -{discountPercentage}%
                  </span>
                )}
                {categoryName && (
                  <span className="rounded-full bg-[#1C1917]/65 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-[#FFFDF9]">
                    {categoryName}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleWishlist}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFFDF9]/90 backdrop-blur-md shadow-sm flex items-center justify-center transition-all ${
                  heartAnim ? "scale-125" : "scale-100"
                }`}
              >
                <Heart
                  size={17}
                  className={wished ? "text-[#E44587]" : "text-[#1C1917]"}
                  fill={wished ? "currentColor" : "none"}
                />
              </button>

              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    aria-label="Previous product image"
                    className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1C1917]/45 backdrop-blur-md text-[#FFFDF9] flex items-center justify-center hover:bg-[#1C1917]/65 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    aria-label="Next product image"
                    className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1C1917]/45 backdrop-blur-md text-[#FFFDF9] flex items-center justify-center hover:bg-[#1C1917]/65 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {productImages.length > 1 && (
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[#1C1917]/55 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] font-semibold text-[#FFFDF9]">
                  {selectedImageIndex + 1} / {productImages.length}
                </div>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="mt-3 sm:mt-4 flex gap-2.5 sm:gap-3 overflow-x-auto overflow-y-visible px-1 pt-1 pb-3 scrollbar-hide">
                {productImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => selectImage(image, index)}
                    className={`relative shrink-0 w-14 h-14 sm:w-[78px] sm:h-[78px] rounded-xl sm:rounded-2xl transition-all duration-200 overflow-visible ${
                      selectedImage === image
                        ? "ring-2 ring-[#F16937] ring-offset-2 ring-offset-[#FFFDF9] opacity-100"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="w-full h-full overflow-hidden rounded-xl sm:rounded-2xl">
                      <img
                        src={image}
                        alt={`${productName} ${index + 1}`}
                        className="w-full h-full transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4 sm:gap-5 lg:pt-1">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#1BACB1]">
                {categoryName || product?.collectionName || "Premium Collection"}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold ${
                  stock > 0
                    ? "bg-[#EEF6E6] text-[#3D7020]"
                    : "bg-[#FDF4F8] text-[#8B1A4A]"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    stock > 0 ? "bg-[#76A845] animate-pulse" : "bg-[#E44587]"
                  }`}
                />
                {stock > 0 ? `In Stock · ${stock} left` : "Out of Stock"}
              </span>
            </div>

            <div>
              <h1 className="font-heading text-2xl sm:text-4xl xl:text-[42px] font-bold leading-[1.15] sm:leading-[1.1] tracking-tight">
                {productName}
              </h1>
              {product?.description && (
                <p className="mt-2.5 sm:mt-3 text-xs sm:text-[15px] leading-6 sm:leading-7 text-[#78716C]">
                  {product.description}
                </p>
              )}
            </div>

            {/* COLOR VARIANTS SELECTOR */}
            {hasVariants && (
              <div className="space-y-2 border-y border-[rgba(28,25,23,0.12)]/60 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-[#1C1917]">
                    Color Variant:{" "}
                    <span className="text-[#F16937]">
                      {activeVariant?.colorName || "Standard"}
                    </span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {product.variants.map((variant, index) => {
                    const isSelected = selectedVariantIndex === index;
                    return (
                      <button
                        key={variant.sku || index}
                        type="button"
                        onClick={() => setSelectedVariantIndex(index)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#F16937] bg-[#FEF1EC] text-[#F16937] ring-1 ring-[#F16937]"
                            : "border-[rgba(28,25,23,0.15)] bg-white text-[#78716C] hover:border-[#F16937]"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                          style={{
                            backgroundColor: variant.colorCode || "#CCC",
                          }}
                        />
                        <span>{variant.colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-end gap-3 flex-wrap">
              <span className="font-heading text-3xl sm:text-4xl font-bold text-[#F16937]">
                ₹{formatPrice(price)}
              </span>

              {originalPrice > price && (
                <span className="pb-0.5 sm:pb-1 text-base sm:text-lg text-[#78716C] line-through">
                  ₹{formatPrice(originalPrice)}
                </span>
              )}

              {discountPercentage > 0 && (
                <span className="mb-1 rounded-full bg-[#FDF4F8] text-[#E44587] px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold">
                  Save {discountPercentage}%
                </span>
              )}
            </div>

            {/* Product Tags */}
            {Array.isArray(product?.productTags) && product.productTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {product.productTags.map((tag) => {
                  const tagId = tag?._id || tag?.id || tag;
                  const tagName = typeof tag === "object" ? tag?.name : tag;
                  const tagImage = typeof tag === "object" ? tag?.image : null;
                  if (!tagName) return null;
                  return (
                    <span
                      key={tagId}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold border w-fit"
                      style={{ background: "#FEF1EC", color: "#F16937", borderColor: "#F5B5D0" }}
                    >
                      {tagImage ? (
                        <img
                          src={tagImage}
                          alt={tagName}
                          className="w-4 h-4 rounded-full object-cover shrink-0"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      ) : null}
                      {tagName}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="border-y border-[rgba(28,25,23,0.12)]/60 py-3.5 sm:py-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block uppercase tracking-wider text-[#78716C] mb-1 text-[10px] sm:text-xs">
                  SKU
                </span>
                <span className="font-bold">{sku}</span>
              </div>
              <div>
                <span className="block uppercase tracking-wider text-[#78716C] mb-1 text-[10px] sm:text-xs">
                  Category
                </span>
                <span className="font-bold">{categoryName || "Uncategorized"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs sm:text-sm font-bold">Qty:</span>
              <div className="flex items-center overflow-hidden rounded-full border border-[rgba(28,25,23,0.12)] bg-white">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:bg-[#F5F0E8] transition-colors disabled:opacity-35"
                >
                  <Minus size={15} />
                </button>

                <input
                  type="number"
                  min={1}
                  max={stock || 1}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-10 sm:w-12 bg-transparent text-center text-xs sm:text-sm font-bold outline-none"
                />

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={stock <= 0 || quantity >= stock}
                  className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:bg-[#F5F0E8] transition-colors disabled:opacity-35"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={stock <= 0 || isAdding}
                className="min-h-12 sm:min-h-14 rounded-full bg-[#F16937] text-white text-sm sm:text-base font-bold shadow-lg shadow-[rgba(241,105,55,0.15)] flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isAdding ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <ShoppingCart size={18} />
                )}
                {stock <= 0
                  ? "Out of Stock"
                  : isAdding
                  ? "Adding..."
                  : "Add to Cart"}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={stock <= 0}
                className="min-h-12 sm:min-h-14 rounded-full bg-white text-[#F16937] border-2 border-[#F16937] text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition-all hover:bg-[#FEF3EC] disabled:opacity-50 cursor-pointer"
              >
                <CreditCard size={18} />
                Buy Now
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 px-1">
              <button
                type="button"
                onClick={handleWishlist}
                className={`inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold transition-all ${
                  wished ? "text-[#E44587]" : "text-[#78716C] hover:text-[#F16937]"
                } ${heartAnim ? "scale-110" : ""}`}
              >
                <Heart size={17} fill={wished ? "currentColor" : "none"} />
                {wished ? "Wishlisted" : "Add to Wishlist"}
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-[#78716C] hover:text-[#F16937]"
              >
                <Share2 size={17} />
                Share
              </button>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-[rgba(28,25,23,0.12)]/60 bg-white p-3.5 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                <Truck size={17} className="text-[#F16937]" />
                <p className="text-xs sm:text-sm font-bold">Delivery Estimate</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter PIN code"
                  value={pincode}
                  onChange={(event) => {
                    setPincode(event.target.value.replace(/\D/g, ""));
                    setPincodeMsg("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") checkPincode();
                  }}
                  className="min-w-0 flex-1 rounded-full border border-[rgba(28,25,23,0.12)] bg-[#FFFDF9] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={checkPincode}
                  className="rounded-full bg-[#F16937] px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shrink-0"
                >
                  Check
                </button>
              </div>

              {pincodeMsg && (
                <p
                  className={`mt-2 text-[11px] sm:text-xs ${
                    pincodeMsg.startsWith("Delivery")
                      ? "text-[#3D7020]"
                      : "text-[#E44587]"
                  }`}
                >
                  {pincodeMsg}
                </p>
              )}

              <div className="mt-3 sm:mt-4 flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1.5 text-[10px] sm:text-[11px] text-[#78716C]">
                <span>✓ Secure payment</span>
                <span>✓ Carefully packed</span>
                <span>✓ Easy support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="border-b border-[rgba(28,25,23,0.12)]/70 overflow-x-auto">
          <nav className="flex min-w-max gap-1 sm:gap-3">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative px-3 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? "text-[#F16937]"
                    : "text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-3 right-3 sm:left-5 sm:right-5 h-0.5 rounded-full bg-[#F16937]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 sm:pt-8">
          {activeTab === "description" && (
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
              <div className="space-y-3 sm:space-y-4">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#F16937]">
                  Product Story
                </p>
                <h2 className="font-heading text-xl sm:text-3xl font-bold leading-tight">
                  {productName}
                </h2>

                {product?.longDescription && (
                  <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-[#78716C]">
                    {product.longDescription}
                  </p>
                )}

                {product?.longDescription1 && (
                  <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-[#78716C]">
                    {product.longDescription1}
                  </p>
                )}

                {!product?.longDescription &&
                  !product?.description &&
                  !product?.longDescription1 && (
                    <p className="text-xs sm:text-sm text-[#78716C]">
                      Product description is not available.
                    </p>
                  )}
              </div>

              <div className="rounded-[22px] sm:rounded-[28px] overflow-hidden bg-[#F5F0E8] ">
                <img
                  src={productImages[1] || productImages[0] || "/placeholder.png"}
                  alt={productName}
                  className="w-full h-[650px] object-cover"
                />
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {specifications.map((item) => (
                <SpecificationCard key={item.title} {...item} />
              ))}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              <DetailCard
                icon={Truck}
                title="Delivery"
                text={
                  product?.shippingInfo ||
                  "Delivery timing is calculated at checkout based on your serviceable PIN code."
                }
              />
              <DetailCard
                icon={PackageCheck}
                title="Packaging"
                text={
                  product?.packaging ||
                  "Your product is securely packed to help protect it during transit."
                }
              />
              <DetailCard
                icon={RefreshCw}
                title="Returns"
                text={
                  product?.returnPolicy ||
                  "Returns and exchanges are handled according to the store return policy."
                }
              />
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="rounded-[22px] sm:rounded-[28px] border border-[rgba(28,25,23,0.12)]/60 bg-white p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-7">
                <div className="text-center">
                  <p className="font-heading text-4xl sm:text-5xl font-bold text-[#F16937]">
                    {rating.toFixed(1)}
                  </p>
                  <div className="mt-2 flex justify-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        className="text-amber-400"
                        fill={index < Math.round(rating) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-[#78716C]">
                    {reviewCount} reviews
                  </p>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-heading text-lg sm:text-xl font-bold">
                    Customer Reviews
                  </h3>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-6 text-[#78716C]">
                    {reviewCount > 0
                      ? "Ratings shown here are based on customer feedback available for this product."
                      : "No customer reviews are available for this product yet."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Sticky Cart */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-[rgba(28,25,23,0.12)]/60 bg-[#FFFDF9]/95 backdrop-blur-xl px-3 py-2.5 pb-[max(10px,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleWishlist}
            className="w-11 h-11 shrink-0 rounded-full border border-[rgba(28,25,23,0.12)] flex items-center justify-center bg-white"
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={18}
              className={wished ? "text-[#E44587]" : ""}
              fill={wished ? "currentColor" : "none"}
            />
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={stock <= 0 || isAdding}
            className="flex-1 h-11 rounded-full bg-[#F16937] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-[rgba(241,105,55,0.2)]"
          >
            {isAdding ? (
              <Loader2 size={16} className="animate-spin" />
            ) : stock > 0 ? (
              <ShoppingCart size={16} />
            ) : null}
            {stock <= 0
              ? "Out of Stock"
              : isAdding
              ? "Adding..."
              : `Add to Cart · ₹${formatPrice(price)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

const SpecificationCard = ({ icon: Icon, title, value }) => (
  <div className="rounded-2xl sm:rounded-3xl border border-[rgba(28,25,23,0.12)]/60 bg-white p-4 sm:p-5 flex gap-3.5 sm:gap-4 shadow-sm">
    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#F5F0E8] flex items-center justify-center shrink-0">
      <Icon size={19} className="text-[#F16937]" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#F16937]">
        {title}
      </p>
      <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-semibold leading-5 sm:leading-6 text-[#1C1917] break-words">
        {value}
      </p>
    </div>
  </div>
);

const DetailCard = ({ icon: Icon, title, text }) => (
  <div className="rounded-2xl sm:rounded-3xl border border-[rgba(28,25,23,0.12)]/60 bg-white p-5 sm:p-6">
    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#F5F0E8] flex items-center justify-center mb-3 sm:mb-4">
      <Icon size={19} className="text-[#F16937]" />
    </div>
    <h3 className="font-heading text-sm sm:text-base font-bold">{title}</h3>
    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-[#78716C]">{text}</p>
  </div>
);

export default ProductDetailHeroSection;