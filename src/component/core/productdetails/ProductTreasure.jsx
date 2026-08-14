import React, { useEffect, useRef, useState } from "react";
import { Heart, Loader2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchProductsByCategory } from "../../../redux/thunks/productThunk";
import { clearCategoryProducts } from "../../../redux/slices/productSlice";
import { addProductToCart, fetchCart } from "../../../redux/thunks/cartThunk";
import { toggleWishlist, getWishlist } from "../../../redux/thunks/wishlistThunk";
import { selectWishlistItems } from "../../../redux/slices/wishlistSlice";

import { showToast } from "../../../config/toast";

const ProductTreasure = ({ categoryId }) => {
  const dispatch = useDispatch();

  const {
    categoryProducts = [],
    categoryLoading = false,
    error = null,
  } = useSelector((state) => state.products || {});

  const wishlistItems = useSelector(selectWishlistItems) || [];

  /*
  |--------------------------------------------------------------------------
  | Slider Setup
  |--------------------------------------------------------------------------
  */
  const sliderRef = useRef(null);
  const autoSlideRef = useRef(null);
  const [isSliderPaused, setIsSliderPaused] = useState(false);

  const getSlideStep = () => {
    const slider = sliderRef.current;
    if (!slider) return 0;

    const firstCard = slider.firstElementChild;
    if (!firstCard) return 0;

    const styles = window.getComputedStyle(slider);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");

    return firstCard.getBoundingClientRect().width + gap;
  };

  const slideNext = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const step = getSlideStep();
    if (!step) return;

    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

    if (slider.scrollLeft >= maxScrollLeft - step * 0.45) {
      slider.scrollTo({
        left: 0,
        behavior: "smooth",
      });
      return;
    }

    slider.scrollBy({
      left: step,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (isSliderPaused || categoryProducts.length <= 1) {
      return undefined;
    }

    autoSlideRef.current = window.setInterval(() => {
      slideNext();
    }, 2800);

    return () => {
      if (autoSlideRef.current) {
        window.clearInterval(autoSlideRef.current);
      }
    };
  }, [isSliderPaused, categoryProducts.length]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: 0,
        behavior: "auto",
      });
    }
  }, [categoryId]);

  /*
  |--------------------------------------------------------------------------
  | Fetch Products By Category (Public API Request)
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (!categoryId) {
      dispatch(clearCategoryProducts());
      return;
    }

    dispatch(fetchProductsByCategory({ categoryId }));
  }, [categoryId, dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Add To Cart Handler (Redux)
  |--------------------------------------------------------------------------
  */
  const handleAddToCart = async (e, product, selectedVariant = null) => {
    e.preventDefault();
    e.stopPropagation();

    const productId = product?._id || product?.id;
    if (!productId) return;

    try {
      const response = await dispatch(
        addProductToCart({
          productId,
          quantity: 1,
          variant: selectedVariant || undefined,
        })
      ).unwrap();

      showToast.success(response?.message || "Product added to cart.");
      dispatch(fetchCart());
    } catch (err) {
      showToast.error(
        typeof err === "string" ? err : err?.message || "Failed to add to cart."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Toggle Wishlist Handler (Redux)
  |--------------------------------------------------------------------------
  */
  const handleToggleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId) return;

    try {
      const response = await dispatch(toggleWishlist(productId)).unwrap();
      showToast.success(response?.message || "Wishlist updated.");
      dispatch(getWishlist());
    } catch (err) {
      showToast.error(
        typeof err === "string" ? err : err?.message || "Failed to update wishlist."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */
  if (categoryLoading) {
    return (
      <section className="py-10 sm:py-14 lg:py-16 bg-[#FFFDF9] border-t border-[rgba(28,25,23,0.10)]">
        <div className="min-h-[250px] flex items-center justify-center">
          <Loader2 size={36} className="animate-spin text-[#F16937]" />
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error State
  |--------------------------------------------------------------------------
  */
  if (error) {
    return (
      <section className="py-16 bg-[#FFFDF9] border-t border-[rgba(28,25,23,0.10)]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-600 text-sm font-medium">{error}</p>
          {categoryId && (
            <button
              type="button"
              onClick={() => dispatch(fetchProductsByCategory({ categoryId }))}
              className="mt-4 px-6 py-2.5 bg-[#F16937] text-white rounded-xl text-sm font-semibold hover:bg-[#E85D2C] transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty State
  |--------------------------------------------------------------------------
  */
  if (!categoryProducts.length) {
    return (
      <section className="py-16 bg-[#FFFDF9] border-t border-[rgba(28,25,23,0.10)]">
        <div className="text-center text-[#78716C] text-sm">
          No products found in this category.
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI Render
  |--------------------------------------------------------------------------
  */
  return (
    <section className="py-12 sm:py-16 bg-[#FFFDF9] border-t border-[rgba(28,25,23,0.10)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-3xl font-heading font-bold text-[#1C1917] tracking-tight">
            <span className="block mb-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#1BACB1]">
              More to explore
            </span>
            You May Also Like
          </h2>

          <Link
            to={`/products?category=${encodeURIComponent(categoryId || "")}`}
            className="text-xs sm:text-sm font-bold text-[#F16937] bg-[rgba(241,105,55,0.08)] px-4 py-2 rounded-full hover:bg-[rgba(241,105,55,0.14)] transition"
          >
            View All
          </Link>
        </div>

        <div
          ref={sliderRef}
          onMouseEnter={() => setIsSliderPaused(true)}
          onMouseLeave={() => setIsSliderPaused(false)}
          onTouchStart={() => setIsSliderPaused(true)}
          onTouchEnd={() => {
            window.setTimeout(() => {
              setIsSliderPaused(false);
            }, 1200);
          }}
          className="flex gap-3 sm:gap-6 lg:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-5 -mb-5 overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Recommended products slider"
        >
          {categoryProducts.map((product) => {
            const isWishlisted = wishlistItems.some((item) => {
              const pId = item?.productId?._id || item?.productId || item?._id;
              return String(pId) === String(product?._id);
            });

            return (
              <div
                key={product._id}
                className="snap-start shrink-0 w-[72%] xs:w-[68%] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-6rem)/4)]"
              >
                <ProductGallery
                  product={product}
                  isWishlisted={isWishlisted}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================================================
    RESPONSIVE PRODUCT GALLERY WITH VARIANT & WISHLIST SUPPORT
============================================================================ */

const ProductGallery = ({
  product,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [hovered, setHovered] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const hasVariants = Boolean(
    product?.hasVariants &&
      Array.isArray(product?.variants) &&
      product.variants.length > 0
  );

  const activeVariant = hasVariants
    ? product.variants[selectedVariantIndex] || product.variants[0]
    : null;

  const resolveImage = (image) => {
    if (!image) return null;
    if (typeof image === "string") return image;
    return image?.url || image?.secure_url || null;
  };

  const imagesSource =
    hasVariants && activeVariant?.images?.length > 0
      ? activeVariant.images
      : product?.images;

  const image1 =
    resolveImage(imagesSource?.[0]) ||
    resolveImage(product?.image) ||
    "/placeholder.png";

  const image2 = resolveImage(imagesSource?.[1]) || image1;

  const price = Number(activeVariant?.price ?? product?.price ?? 0);
  const originalPrice = Number(
    activeVariant?.originalPrice ?? product?.originalPrice ?? 0
  );
  const stock = Number(activeVariant?.stock ?? product?.stock ?? 0);
  const discount = Number(product?.discountPercentage || 0);

  return (
    <Link to={`/products/${product._id}`} className="group block h-full">
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="h-full overflow-hidden rounded-[18px] sm:rounded-[28px] border border-[#EFE7DF] bg-white shadow-[0_4px_20px_rgba(28,25,23,0.04)] transition-all duration-500 md:hover:-translate-y-2 md:hover:shadow-[0_20px_50px_rgba(28,25,23,0.14)]"
      >
        {/* IMAGE */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#FBF6F2]">
          <img
            src={hovered ? image2 : image1}
            alt={product?.title || "Product"}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = "/placeholder.png";
            }}
            className="h-full w-full object-cover transition-all duration-700 ease-out md:group-hover:scale-110"
          />

          {/* Discount */}
          {discount > 0 && (
            <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#E44587] px-2 py-0.5 text-[9px] font-bold text-white shadow-md sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-xs">
              -{Math.round(discount)}%
            </span>
          )}

          {/* Featured */}
          {product?.isFeatured && (
            <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-[#1BACB1] px-2 py-0.5 text-[9px] font-bold text-white shadow-md sm:right-4 sm:top-4 sm:px-3 sm:py-1 sm:text-xs">
              Featured
            </span>
          )}

          {/* MOBILE ACTIONS */}
          <div className="absolute bottom-2.5 right-2.5 z-20 flex flex-col gap-1.5 md:hidden">
            <button
              type="button"
              onClick={(e) => onToggleWishlist(e, product._id)}
              aria-label="Wishlist"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white bg-white/95 shadow-md backdrop-blur transition active:scale-90"
            >
              <Heart
                size={15}
                color="#E44587"
                fill={isWishlisted ? "#E44587" : "none"}
              />
            </button>

            <button
              type="button"
              disabled={stock <= 0}
              onClick={(e) => onAddToCart(e, product, activeVariant)}
              aria-label="Add to cart"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F16937] text-white shadow-[0_4px_12px_rgba(241,105,55,0.30)] transition active:scale-90 disabled:cursor-not-allowed disabled:bg-[#D6D3D1] disabled:shadow-none"
            >
              <ShoppingCart size={15} />
            </button>
          </div>

          {/* DESKTOP HOVER ACTIONS */}
          <div className="absolute bottom-0 left-0 right-0 z-20 hidden translate-y-full p-4 opacity-0 transition-all duration-300 md:block md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={(e) => onToggleWishlist(e, product._id)}
                aria-label="Wishlist"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#F5B5D0] bg-white shadow-lg transition-all hover:bg-[#FDF4F8] hover:scale-105"
              >
                <Heart
                  size={19}
                  color="#E44587"
                  fill={isWishlisted ? "#E44587" : "none"}
                />
              </button>

              <button
                type="button"
                disabled={stock <= 0}
                onClick={(e) => onAddToCart(e, product, activeVariant)}
                className="h-12 flex-1 rounded-2xl bg-[#F16937] px-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(241,105,55,0.28)] transition-all hover:bg-[#E85D2C] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#D6D3D1] disabled:shadow-none"
              >
                {stock > 0 ? "Add To Cart" : "Out Of Stock"}
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-3 sm:p-5">
          <span className="inline-flex max-w-full items-center truncate rounded-full bg-[rgba(27,172,177,0.10)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0D7D82] sm:px-3 sm:py-1 sm:text-[11px]">
            {product?.category?.name || "Category"}
          </span>

          <h3 className="mt-2 min-h-[40px] line-clamp-2 text-xs font-bold leading-snug text-[#1C1917] transition-colors group-hover:text-[#F16937] sm:mt-3 sm:min-h-[56px] sm:text-lg sm:leading-7">
            {product?.title || "Product"}
          </h3>

          {/* COLOR VARIANTS SWATCHES */}
          {hasVariants && (
            <div
              className="mt-2 flex items-center gap-1.5 flex-wrap"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {product.variants.map((v, idx) => (
                <button
                  key={v.sku || idx}
                  type="button"
                  title={v.colorName}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`w-3.5 h-3.5 rounded-full border border-gray-300 transition-transform ${
                    selectedVariantIndex === idx
                      ? "scale-125 ring-1 ring-[#F16937] ring-offset-1"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: v.colorCode || "#CCC" }}
                />
              ))}
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-end gap-x-2 gap-y-0.5 sm:mt-4">
            <span className="text-base font-bold text-[#F16937] sm:text-2xl">
              ₹{price.toLocaleString("en-IN")}
            </span>

            {originalPrice > price && (
              <span className="pb-0.5 text-[11px] text-[#A8A29E] line-through sm:text-sm">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {originalPrice > price && (
            <p className="mt-0.5 text-[10px] font-semibold text-[#76A845] sm:text-xs">
              You Save ₹{(originalPrice - price).toLocaleString("en-IN")}
            </p>
          )}

          <div className="mt-2.5 flex items-center justify-between sm:mt-4">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold sm:px-3 sm:py-1 sm:text-xs ${
                stock > 0
                  ? "bg-[rgba(118,168,69,0.12)] text-[#5B842F]"
                  : "bg-[rgba(228,69,135,0.10)] text-[#E44587]"
              }`}
            >
              {stock > 0 ? `${stock} In Stock` : "Out Of Stock"}
            </span>

            <span className="hidden text-[10px] font-bold uppercase tracking-wider text-[#78716C] sm:inline">
              View Product
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductTreasure;