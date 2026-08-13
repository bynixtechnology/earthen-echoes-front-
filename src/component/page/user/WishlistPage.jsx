import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  Heart,
  Loader2,
  ArrowLeft,
  Trash2,
} from "lucide-react";

import {
  getWishlist,
  removeFromWishlist,
} from "../../../redux/thunks/wishlistThunk";

import { addProductToCart, fetchCart } from "../../../redux/thunks/cartThunk";

import {
  selectWishlistItems,
  selectWishlistLoading,
} from "../../../redux/slices/wishlistSlice";

import { showToast } from "../../../config/toast";
import { C, img } from "../../../constants/theme";

export default function WishlistPage() {
  const dispatch = useDispatch();

  const wishlist = useSelector(selectWishlistItems) || [];
  const loading = useSelector(selectWishlistLoading);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Handle Remove From Wishlist
  |--------------------------------------------------------------------------
  */
  const handleRemove = async (productId) => {
    if (!productId) return;

    try {
      const response = await dispatch(
        removeFromWishlist(productId)
      ).unwrap();

      showToast.success(
        response?.message || "Product removed from wishlist."
      );
      dispatch(getWishlist());
    } catch (error) {
      showToast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to remove item."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Handle Add To Cart
  |--------------------------------------------------------------------------
  */
  const handleAddToCart = async (product, activeVariant) => {
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

      showToast.success(
        response?.message || "Product added to cart."
      );

      // 🟢 Header Badge aur Cart Sync
      dispatch(fetchCart());
    } catch (error) {
      showToast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to add product to cart."
      );
    }
  };

  if (loading && !wishlist.length) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center"
        style={{ background: C.ivory }}
      >
        <Loader2
          className="animate-spin"
          size={40}
          style={{ color: C.coral }}
        />
      </div>
    );
  }

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-screen"
      style={{ background: C.ivory }}
    >
      {/* Header */}
      <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/60 pb-6">
        <div>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: C.teal }}
          >
            Saved Items
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-heading text-gray-900 mt-1">
            My Wishlist ❤️
          </h1>
          <p className="text-gray-500 mt-1.5 text-xs sm:text-sm">
            Save your favourite products and move them to cart anytime.
          </p>
        </div>
        <span
          className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold w-fit shadow-xs"
          style={{ background: C.paleCoral, color: C.coral }}
        >
          {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="rounded-3xl border border-gray-200/80 bg-white p-8 sm:p-16 text-center shadow-xs max-w-xl mx-auto my-12">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-sm"
            style={{ background: C.paleCoral }}
          >
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 fill-red-500/20" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-gray-900 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 mb-8 text-xs sm:text-sm max-w-sm mx-auto">
            Browse products and add your favourites to keep track of them here.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full text-white px-8 py-3.5 text-sm font-bold shadow-md transition-transform hover:scale-105"
            style={{ background: C.coral }}
          >
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((item) => {
            const product = item?.productId?._id
              ? item.productId
              : item?.product?._id
              ? item.product
              : item;

            const productId = product?._id || item?._id;

            return (
              <WishlistCard
                key={productId}
                product={product}
                item={item}
                onAddToCart={handleAddToCart}
                onRemove={handleRemove}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ============================================================================
    WISHLIST CARD COMPONENT WITH COLOR VARIANT SUPPORT
============================================================================ */

const WishlistCard = ({ product, item, onAddToCart, onRemove }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const productId = product?._id || item?._id;

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

  const image =
    resolveImage(imagesSource?.[0]) ||
    resolveImage(product?.images?.[0]) ||
    resolveImage(product?.image) ||
    "/placeholder.png";

  const price = Number(activeVariant?.price ?? product?.price ?? 0);
  const originalPrice = Number(
    activeVariant?.originalPrice ?? product?.originalPrice ?? 0
  );
  const stock = Number(activeVariant?.stock ?? product?.stock ?? 0);
  const discount = Number(product?.discountPercentage || 0);

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EFE7DF] shadow-xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div>
        <Link
          to={`/products/${productId}`}
          className="block relative aspect-square overflow-hidden bg-[#FBF6F2]"
        >
          <img
            src={image}
            alt={product?.title || product?.name || item?.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
          {discount > 0 && (
            <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#E44587] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              -{Math.round(discount)}%
            </span>
          )}
        </Link>

        <div className="p-3.5 sm:p-5">
          <Link to={`/products/${productId}`}>
            <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 min-h-[32px] sm:min-h-[40px] hover:text-[#F16937] transition-colors">
              {product?.title || product?.name || item?.title}
            </h3>
          </Link>

          {/* COLOR VARIANTS SWATCHES */}
          {hasVariants && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              {product.variants.map((v, idx) => (
                <button
                  key={v.sku || idx}
                  type="button"
                  title={v.colorName}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariantIndex(idx);
                  }}
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

          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-sm sm:text-lg font-bold text-gray-900">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {originalPrice > price && (
              <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-3.5 sm:p-5 pt-0 flex gap-2 sm:gap-3">
        <button
          disabled={stock <= 0}
          className="flex-1 rounded-xl text-white py-2.5 px-2 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs hover:opacity-95 active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: stock > 0 ? C.coral : "#D6D3D1" }}
          onClick={() => onAddToCart(product, activeVariant)}
        >
          <ShoppingCart size={15} />
          <span className="hidden xs:inline">
            {stock > 0 ? "Add to Cart" : "Out of Stock"}
          </span>
          <span className="xs:hidden">
            {stock > 0 ? "Add" : "OOS"}
          </span>
        </button>

        <button
          className="rounded-xl border border-gray-200 p-2.5 sm:px-3 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center cursor-pointer"
          onClick={() => onRemove(productId)}
          title="Remove item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};