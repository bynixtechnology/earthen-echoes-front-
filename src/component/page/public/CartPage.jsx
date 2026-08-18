import React, { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCart,
  updateCartItem,
  removeProductFromCart,
} from "../../../redux/thunks/cartThunk";

import {
  selectCartItems,
  selectCartLoading,
  selectCartAdding,
  selectCartRemoving,
  selectCartUpdating,
  selectCartMerging,
  selectCartCount,
} from "../../../redux/slices/cartSlice";

import { selectUserAuthenticated } from "../../../redux/slices/userAuthSlice";
import { C } from "../../../constants/theme";
import { showToast } from "../../../config/toast";

/*
|--------------------------------------------------------------------------
| Cart Page
|--------------------------------------------------------------------------
*/

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Redux State
  |--------------------------------------------------------------------------
  */
  const cartItems = useSelector(selectCartItems) || [];
  const loading = useSelector(selectCartLoading);
  const adding = useSelector(selectCartAdding);
  const removing = useSelector(selectCartRemoving);
  const updating = useSelector(selectCartUpdating);
  const merging = useSelector(selectCartMerging);
  const cartCount = useSelector(selectCartCount);
  const isAuthenticated = useSelector(selectUserAuthenticated);

  /*
  |--------------------------------------------------------------------------
  | Optimistic Removed Items Set
  |--------------------------------------------------------------------------
  */
  const [removedItemKeys, setRemovedItemKeys] = useState(() => new Set());

  /*
  |--------------------------------------------------------------------------
  | CART ITEM KEY HELPER
  |--------------------------------------------------------------------------
  */
  const getCartItemKey = (item) => {
    const productId =
      typeof item?.productId === "object" && item?.productId !== null
        ? item.productId._id || item.productId.id
        : item?.productId || item?._id || item?.id || "";

    const sku = String(
      item?.variant?.sku || item?.variantSku || ""
    ).trim();

    return `${String(productId)}::${sku}`;
  };

  /*
  |--------------------------------------------------------------------------
  | FETCH CART ON MOUNT & AUTH CHANGE
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  /*
  |--------------------------------------------------------------------------
  | FILTER VISIBLE ITEMS (STRICT DELETE MASK)
  |--------------------------------------------------------------------------
  */
  const visibleCartItems = cartItems.filter(
    (item) => !removedItemKeys.has(getCartItemKey(item))
  );

  /*
  |--------------------------------------------------------------------------
  | DELETE CART ITEM (INSTANT MASK + REDUX DISPATCH)
  |--------------------------------------------------------------------------
  */
  const removeFromCart = async (event, item) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const targetProductId =
      typeof item?.productId === "object" && item?.productId !== null
        ? item.productId._id || item.productId.id
        : item?.productId || item?._id || item?.id;

    const targetSku = String(
      item?.variant?.sku || item?.variantSku || ""
    ).trim();

    if (!targetProductId) {
      showToast.error("Invalid product ID.");
      return;
    }

    const removedKey = getCartItemKey(item);

    // 1. Immediately hide from UI
    setRemovedItemKeys((previous) => {
      const next = new Set(previous);
      next.add(removedKey);
      return next;
    });

    try {
      // 2. Dispatch removal
      await dispatch(
        removeProductFromCart({
          productId: targetProductId,
          variantSku: targetSku,
        })
      ).unwrap();

      // 3. Fetch fresh cart
      await dispatch(fetchCart()).unwrap();
      showToast.success("Item removed from cart.");
    } catch (error) {
      console.error("REMOVE ITEM ERROR:", error);

      // Restore if failed
      setRemovedItemKeys((previous) => {
        const next = new Set(previous);
        next.delete(removedKey);
        return next;
      });

      try {
        await dispatch(fetchCart()).unwrap();
      } catch (refreshError) {
        console.error("CART REFRESH ERROR:", refreshError);
      }

      showToast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to remove item."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE QUANTITY
  |--------------------------------------------------------------------------
  */
  const updateQuantity = async (event, item, delta) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const currentQty = Number(item?.quantity) || 1;
    const newQuantity = currentQty + delta;

    if (newQuantity < 1) return;

    const targetProductId =
      typeof item?.productId === "object" && item?.productId !== null
        ? item.productId._id || item.productId.id
        : item?.productId || item?._id || item?.id;

    const targetSku = String(
      item?.variant?.sku || item?.variantSku || ""
    ).trim();

    if (!targetProductId) {
      showToast.error("Invalid product ID.");
      return;
    }

    try {
      await dispatch(
        updateCartItem({
          productId: targetProductId,
          quantity: newQuantity,
          variantSku: targetSku,
          variant: item?.variant || null,
        })
      ).unwrap();

      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      console.error("UPDATE QTY ERROR:", error);

      try {
        await dispatch(fetchCart()).unwrap();
      } catch (refreshError) {
        console.error("CART REFRESH ERROR:", refreshError);
      }

      showToast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to update quantity."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CHECKOUT NAVIGATION
  |--------------------------------------------------------------------------
  */
  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      showToast.error("Please login to proceed to checkout.");
      navigate("/user/login", {
        state: { from: "/cart" },
      });
      return;
    }

    if (!visibleCartItems.length) {
      showToast.error("Your cart is empty.");
      return;
    }

    navigate("/checkout");
  };

  /*
  |--------------------------------------------------------------------------
  | HELPERS - TITLE, PRICE & IMAGE RESOLUTION
  |--------------------------------------------------------------------------
  */
  const getItemTitle = (item) => {
    if (typeof item?.productId === "object" && item?.productId !== null) {
      return (
        item.productId.title ||
        item.productId.name ||
        item.title ||
        item.name ||
        "Handcrafted Pottery"
      );
    }
    return item?.title || item?.name || "Handcrafted Pottery";
  };

  const getItemPrice = (item) => {
    const rawPrice =
      item?.variant?.price ??
      item?.price ??
      (typeof item?.productId === "object"
        ? item?.productId?.price ??
          item?.productId?.discountPrice ??
          item?.productId?.salePrice
        : null) ??
      0;

    return Number(rawPrice) || 0;
  };

  const getItemImage = (item) => {
    const resolve = (img) => {
      if (!img) return null;
      if (typeof img === "string") return img;
      return img.url || img.secure_url || img.path || null;
    };

    if (item?.image) return resolve(item.image);

    if (item?.variant?.images?.length) {
      const variantImage = resolve(item.variant.images[0]);
      if (variantImage) return variantImage;
    }

    if (typeof item?.productId === "object" && item?.productId !== null) {
      if (item.productId.images?.length) {
        const productImage = resolve(item.productId.images[0]);
        if (productImage) return productImage;
      }
      if (item.productId.image) {
        return resolve(item.productId.image);
      }
    }

    if (item?.images?.length) {
      return resolve(item.images[0]);
    }

    return "/placeholder.png";
  };

  /*
  |--------------------------------------------------------------------------
  | CALCULATIONS
  |--------------------------------------------------------------------------
  */
  const subtotal = visibleCartItems.reduce((acc, item) => {
    const price = getItemPrice(item);
    const quantity = Number(item?.quantity) || 1;
    return acc + price * quantity;
  }, 0);

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shipping;

  const cartBusy =
    loading || adding || removing || updating || merging;

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOADING VIEW
  |--------------------------------------------------------------------------
  */
  if (loading && !cartItems.length) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center px-4"
        style={{ background: C.ivory }}
      >
        <Loader2 size={40} className="animate-spin text-[#F16937] mb-4" />
        <p className="text-sm text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | EMPTY CART VIEW
  |--------------------------------------------------------------------------
  */
  if (!loading && !visibleCartItems.length) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center px-4"
        style={{ background: C.ivory }}
      >
        <div
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center mb-6 shadow-sm"
          style={{ background: C.paleCoral }}
        >
          <ShoppingBag
            className="w-16 h-16 sm:w-20 sm:h-20"
            style={{ color: C.coral }}
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-gray-900 mb-2">
          Your cart is empty
        </h2>

        <p className="text-gray-500 mb-8 text-center max-w-md text-sm sm:text-base">
          Looks like you haven't added any products to your cart yet. Explore our handcrafted collections!
        </p>

        <Link
          to="/products"
          className="text-white px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 transition-transform hover:scale-105 shadow-md"
          style={{ background: C.coral }}
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN CART VIEW
  |--------------------------------------------------------------------------
  */
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      style={{
        background: C.ivory,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="p-2.5 rounded-2xl shadow-sm"
          style={{ background: C.paleCoral }}
        >
          <ShoppingBag
            className="w-6 h-6 sm:w-8 sm:h-8"
            style={{ color: C.coral }}
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-gray-900">
          Shopping Cart
        </h1>

        <span
          className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium ml-2 shadow-xs"
          style={{
            background: C.paleTeal,
            color: C.darkTeal,
          }}
        >
          {visibleCartItems.length} {visibleCartItems.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      {/* Syncing Notification */}
      {merging && (
        <div className="mb-5 rounded-2xl bg-[#FEF1EC] border border-[#F16937]/20 px-4 py-3 flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-[#F16937]/30 border-t-[#F16937] animate-spin" />
          <span className="text-sm font-medium text-[#F16937]">
            Syncing your cart...
          </span>
        </div>
      )}

      {/* Cart Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Left Side: Cart List */}
        <div className="lg:w-2/3 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 p-5 bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Product Details</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {/* Cart Items */}
            <div className="divide-y divide-gray-100">
              {visibleCartItems.map((item, index) => {
                const itemProductId =
                  typeof item?.productId === "object" && item?.productId !== null
                    ? item.productId._id || item.productId.id
                    : item?.productId || item?._id || item?.id;

                const itemTitle = getItemTitle(item);
                const itemPrice = getItemPrice(item);
                const itemImage = getItemImage(item);

                const variantColorName =
                  item?.variant?.colorName || item?.colorName || "";

                const variantColorCode =
                  item?.variant?.colorCode || item?.colorCode || "";

                const variantSku =
                  item?.variant?.sku || item?.variantSku || "";

                const quantity = Number(item?.quantity) || 1;

                const itemKey =
                  item?._id || `${itemProductId}-${variantSku || "default"}-${index}`;

                return (
                  <div
                    key={itemKey}
                    className={`grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 sm:p-6 items-center transition-opacity ${
                      cartBusy ? "opacity-80" : ""
                    }`}
                  >
                    {/* Product Meta */}
                    <div className="col-span-1 sm:col-span-6 flex gap-4 items-center">
                      <div className="w-20 h-20 sm:w-20 sm:h-20 flex-shrink-0 rounded-2xl overflow-hidden border border-gray-100 bg-[#FBF6F2]">
                        <Link to={`/products/${itemProductId}`}>
                          <img
                            src={itemImage}
                            alt={itemTitle}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            onError={(e) => {
                              if (e.currentTarget.src.includes("/placeholder.png")) return;
                              e.currentTarget.src = "/placeholder.png";
                            }}
                          />
                        </Link>
                      </div>

                      <div className="flex flex-col justify-center min-w-0">
                        <Link
                          to={`/products/${itemProductId}`}
                          className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 hover:text-[#F16937] transition-colors"
                        >
                          {itemTitle}
                        </Link>

                        {variantColorName && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs text-gray-500 font-medium">
                              Color:
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-[11px] font-semibold text-gray-700">
                              {variantColorCode && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                                  style={{ backgroundColor: variantColorCode }}
                                />
                              )}
                              {variantColorName}
                            </span>
                          </div>
                        )}

                        {variantSku && (
                          <p className="text-[11px] text-gray-400 mt-1">
                            SKU: <span className="font-semibold">{variantSku}</span>
                          </p>
                        )}

                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          Price: ₹{itemPrice.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controller */}
                    <div className="col-span-1 sm:col-span-3 flex items-center justify-between sm:justify-center">
                      <span className="sm:hidden text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        Quantity:
                      </span>

                      <div className="flex items-center border border-gray-200 rounded-full bg-white overflow-hidden shadow-xs">
                        <button
                          type="button"
                          onClick={(e) => updateQuantity(e, item, -1)}
                          className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          disabled={quantity <= 1 || updating}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="w-8 text-center text-xs sm:text-sm font-semibold text-gray-900">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => updateQuantity(e, item, 1)}
                          className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          disabled={updating}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="hidden sm:block col-span-2 text-right">
                      <span className="font-bold text-base sm:text-lg text-gray-900">
                        ₹
                        {(itemPrice * quantity).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    {/* Desktop Remove Button */}
                    <div className="hidden sm:flex col-span-1 justify-center">
                      <button
                        type="button"
                        onClick={(e) => removeFromCart(e, item)}
                        disabled={removing}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Remove Item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Mobile View Total + Remove */}
                    <div className="sm:hidden flex justify-between items-center w-full mt-2 border-t border-gray-100 pt-3">
                      <span className="font-bold text-base text-gray-900">
                        ₹
                        {(itemPrice * quantity).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => removeFromCart(e, item)}
                        disabled={removing}
                        className="text-xs text-red-500 font-semibold flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Summary Card */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 sm:p-7 sticky top-24">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-6 border-b border-gray-100 pb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₹
                  {subtotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="font-semibold" style={{ color: C.green }}>
                    Free
                  </span>
                ) : (
                  <span className="font-medium text-gray-900">
                    ₹
                    {shipping.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5 mb-6">
              <div className="flex justify-between items-end">
                <span className="text-base font-bold text-gray-900">
                  Total Amount
                </span>

                <span
                  className="text-2xl sm:text-3xl font-bold font-heading"
                  style={{ color: C.coral }}
                >
                  ₹
                  {grandTotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={cartBusy || !visibleCartItems.length}
              className="w-full text-white py-4 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:opacity-95 active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: C.coral }}
            >
              {merging ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Syncing Cart...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 bg-gray-50 py-3 rounded-2xl">
              <ShieldCheck size={18} style={{ color: C.green }} />
              <span>Secure & Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}