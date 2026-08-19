import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Package,
  Receipt,
  Loader2,
} from "lucide-react";

import { selectCartItems } from "../../../redux/slices/cartSlice";
import {
  createPaymentOrder,
  verifyPayment,
} from "../../../redux/thunks/paymentThunk";
import { clearCart, fetchCart } from "../../../redux/thunks/cartThunk";
import { showToast } from "../../../config/toast";
import { C } from "../../../constants/theme";

const STEPS = [
  { id: 1, name: "Order", icon: Package },
  { id: 2, name: "Address", icon: MapPin },
  { id: 3, name: "Payment", icon: CreditCard },
];

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Buy Now item state passed via navigation
  const buyNowItem = location.state?.buyNowItem;

  // Redux Cart & User State
  const cartItems = useSelector(selectCartItems) || [];
  const user = useSelector(
    (state) => state.userAuth?.user || state.userAuth?.data || null
  );

  // Active step state: 1 = Order Summary, 2 = Address, 3 = Payment
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Shipping Address Form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    street: "",
    city: "",
    state: "",
  });

  // Same as shipping address toggle
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Billing Address Form state
  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    street: "",
    city: "",
    state: "",
  });

  // Prefill address from logged-in user profile
  useEffect(() => {
    if (user) {
      const defaultAddr =
        user.addresses?.find((a) => a.isDefault) ||
        user.addresses?.[0] ||
        {};

      setShippingAddress({
        fullName: defaultAddr.fullName || user.name || "",
        phone: defaultAddr.phone || user.phone || "",
        pincode: defaultAddr.zipCode || defaultAddr.pincode || "",
        street: defaultAddr.street || "",
        city: defaultAddr.city || "",
        state: defaultAddr.state || "",
      });
    }
  }, [user]);

  // Payment Method state (default to online Razorpay)
  const [paymentMethod, setPaymentMethod] = useState("online");

  // Standardize checkout items structure
  const checkoutItems = buyNowItem
    ? [
        {
          product: buyNowItem.product || buyNowItem,
          quantity: buyNowItem.quantity || 1,
          price: Number(buyNowItem.price || buyNowItem.product?.price || 0),
          variant: buyNowItem.selectedVariant || null,
        },
      ]
    : cartItems.map((item) => {
        const prodObj = item.productId || item.product || item;
        return {
          product: prodObj,
          quantity: item.quantity || 1,
          price: Number(item.price || prodObj?.price || 0),
          variant: item.variant || null,
        };
      });

  // Order Totals Calculations (Free Shipping)
  const subtotal = checkoutItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const grandTotal = subtotal;

  const handleShippingChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBillingChange = (e) => {
    setBillingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();

    // Shipping address validation
    if (
      !shippingAddress.fullName.trim() ||
      !shippingAddress.phone.trim() ||
      !shippingAddress.pincode.trim() ||
      !shippingAddress.street.trim()
    ) {
      showToast.error("Please fill all required shipping address fields.");
      return;
    }

    // Billing address validation if separate
    if (!sameAsShipping) {
      if (
        !billingAddress.fullName.trim() ||
        !billingAddress.phone.trim() ||
        !billingAddress.pincode.trim() ||
        !billingAddress.street.trim()
      ) {
        showToast.error("Please fill all required billing address fields.");
        return;
      }
    }

    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    const finalShippingAddress = shippingAddress;
    const finalBillingAddress = sameAsShipping
      ? shippingAddress
      : billingAddress;

    // Standardize items payload for Backend
    const formattedItems = checkoutItems.map((item) => {
      const prod = item.product || {};
      const img =
        Array.isArray(prod.images) && prod.images.length > 0
          ? typeof prod.images[0] === "string"
            ? prod.images[0]
            : prod.images[0]?.url || prod.images[0]?.secure_url
          : "/placeholder.png";

      return {
        productId: prod._id || prod.id || null,
        title: prod.title || prod.name || "Handcrafted Pottery",
        image: img,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        variant: item.variant || null,
      };
    });

    // 1. ONLINE PAYMENT VIA RAZORPAY
    if (paymentMethod === "online") {
      if (typeof window === "undefined" || !window.Razorpay) {
        showToast.error("Razorpay SDK not loaded. Please refresh the page.");
        return;
      }

      try {
        setIsProcessingPayment(true);
        const amountInPaise = Math.round(grandTotal * 100);

        // Create Razorpay Order on Backend
        const orderResponse = await dispatch(
          createPaymentOrder(amountInPaise)
        ).unwrap();

        if (!orderResponse?.order_id) {
          throw new Error(
            orderResponse?.message || "Order initialization failed."
          );
        }

        const razorpayKey =
          import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TRB1OMxRjSoAaP";

        const options = {
          key: razorpayKey,
          amount: orderResponse.amount,
          currency: orderResponse.currency || "INR",
          name: "Earthen Echoes",
          description: `Order payment for ${checkoutItems.length} item(s)`,
          order_id: orderResponse.order_id,
          prefill: {
            name: shippingAddress.fullName || user?.name || "",
            email: user?.email || "",
            contact: shippingAddress.phone || user?.phone || "",
          },
          theme: {
            color: C?.coral || "#F16937",
          },
          handler: async function (paymentResponse) {
            try {
              const verifyPayload = {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                totalAmount: grandTotal,
                items: formattedItems,
                shippingAddress: finalShippingAddress,
                billingAddress: finalBillingAddress,
              };

              const verificationResult = await dispatch(
                verifyPayment(verifyPayload)
              ).unwrap();

              if (verificationResult?.verified || verificationResult?.success) {
                // Clear user cart if order was placed from normal cart flow
                if (!buyNowItem) {
                  await dispatch(clearCart());
                  await dispatch(fetchCart());
                }

                showToast.success("Order placed successfully!");

                navigate("/thank-you", {
                  replace: true,
                  state: {
                    order: verificationResult.order,
                    orderId: paymentResponse.razorpay_order_id,
                    paymentId: paymentResponse.razorpay_payment_id,
                    amount: grandTotal,
                  },
                });
              } else {
                showToast.error("Payment verification failed.");
              }
            } catch (verifyErr) {
              showToast.error(
                typeof verifyErr === "string"
                  ? verifyErr
                  : verifyErr?.message || "Payment verification failed."
              );
            } finally {
              setIsProcessingPayment(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessingPayment(false);
              showToast.info?.("Payment process was cancelled.");
            },
          },
        };

        const razorpayInstance = new window.Razorpay(options);

        razorpayInstance.on("payment.failed", function (failResponse) {
          setIsProcessingPayment(false);
          showToast.error(
            failResponse?.error?.description || "Payment transaction failed."
          );
        });

        razorpayInstance.open();
      } catch (err) {
        setIsProcessingPayment(false);
        showToast.error(
          typeof err === "string"
            ? err
            : err?.message || "Unable to initiate payment."
        );
      }
    } else {
      // 2. CASH ON DELIVERY (COD)
      if (!buyNowItem) {
        await dispatch(clearCart());
        await dispatch(fetchCart());
      }
      showToast.success("COD Order placed successfully!");
      navigate("/thank-you", {
        replace: true,
        state: {
          amount: grandTotal,
        },
      });
    }
  };

  const handleTopBackClick = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/cart");
    }
  };

  const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN");

  return (
    <div
      className="min-h-screen pb-16 pt-6 sm:pt-10 transition-colors duration-300"
      style={{ backgroundColor: C?.ivory || "#FDF8F3", color: C?.dark || "#1C1208" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <button
          type="button"
          onClick={handleTopBackClick}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold hover:opacity-80 transition-colors mb-6 cursor-pointer"
          style={{ color: `${C?.dark || "#1C1208"}90` }}
        >
          <ArrowLeft size={16} />{" "}
          {currentStep > 1 ? "Back to previous step" : "Back to Cart"}
        </button>

        {/* STEP PROGRESS BAR */}
        <div
          className="rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 shadow-xs border"
          style={{
            backgroundColor: C?.cream || "#FAF4ED",
            borderColor: `${C?.dark || "#1C1208"}15`,
          }}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-6 max-w-xl mx-auto">
            {STEPS.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => isCompleted && setCurrentStep(step.id)}
                    className={`flex items-center gap-2 transition-all ${
                      isCompleted ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all shadow-xs"
                      style={
                        isActive
                          ? {
                              backgroundColor: C?.coral || "#F16937",
                              color: "#FFFFFF",
                            }
                          : isCompleted
                          ? {
                              backgroundColor: C?.green || "#76A845",
                              color: "#FFFFFF",
                            }
                          : {
                              backgroundColor: "#FFFFFF",
                              color: `${C?.dark || "#1C1208"}60`,
                              border: `1px solid ${C?.dark || "#1C1208"}20`,
                            }
                      }
                    >
                      {isCompleted ? <CheckCircle2 size={16} /> : step.id}
                    </div>

                    <span
                      className="text-xs sm:text-base font-bold capitalize transition-colors"
                      style={{
                        color: isActive
                          ? C?.coral || "#F16937"
                          : isCompleted
                          ? C?.green || "#76A845"
                          : `${C?.dark || "#1C1208"}70`,
                      }}
                    >
                      {step.name}
                    </span>
                  </button>

                  {idx < STEPS.length - 1 && (
                    <ChevronRight
                      size={18}
                      className="shrink-0"
                      style={{
                        color:
                          currentStep > step.id
                            ? C?.green || "#76A845"
                            : `${C?.dark || "#1C1208"}30`,
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT CONTENT AREA */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* STEP 1: ORDER REVIEW */}
            {currentStep === 1 && (
              <div
                className="rounded-3xl p-5 sm:p-7 border shadow-xs"
                style={{
                  backgroundColor: C?.cream || "#FAF4ED",
                  borderColor: `${C?.dark || "#1C1208"}15`,
                }}
              >
                <div
                  className="flex items-center justify-between pb-4 mb-5 border-b"
                  style={{ borderColor: `${C?.dark || "#1C1208"}15` }}
                >
                  <h2 className="text-lg sm:text-xl font-bold font-heading">
                    1. Review Items
                  </h2>
                  <span
                    className="text-xs sm:text-sm font-semibold"
                    style={{ color: `${C?.dark || "#1C1208"}70` }}
                  >
                    {checkoutItems.length} Item(s)
                  </span>
                </div>

                {checkoutItems.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="mb-4" style={{ color: `${C?.dark || "#1C1208"}70` }}>
                      No items found to checkout.
                    </p>
                    <Link
                      to="/products"
                      className="px-5 py-2.5 text-white rounded-full font-bold text-sm shadow-xs"
                      style={{ backgroundColor: C?.coral || "#F16937" }}
                    >
                      Explore Products
                    </Link>
                  </div>
                ) : (
                  <div
                    className="divide-y"
                    style={{ borderColor: `${C?.dark || "#1C1208"}10` }}
                  >
                    {checkoutItems.map((item, idx) => {
                      const prod = item.product || {};
                      const image =
                        Array.isArray(prod.images) && prod.images.length > 0
                          ? typeof prod.images[0] === "string"
                            ? prod.images[0]
                            : prod.images[0]?.url || prod.images[0]?.secure_url
                          : "/placeholder.png";

                      return (
                        <div
                          key={idx}
                          className="py-4 first:pt-0 last:pb-0 flex gap-4"
                        >
                          <img
                            src={image}
                            alt={prod.title || "Product"}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 shadow-xs"
                            style={{ backgroundColor: C?.paleCoral || "#FEF1EC" }}
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold text-sm sm:text-base leading-snug">
                                {prod.title || "Untitled Product"}
                              </h3>
                              {item.variant?.colorName && (
                                <p
                                  className="text-xs mt-0.5"
                                  style={{ color: `${C?.dark || "#1C1208"}70` }}
                                >
                                  Color:{" "}
                                  <span className="font-medium">
                                    {item.variant.colorName}
                                  </span>
                                </p>
                              )}
                              <p
                                className="text-xs mt-1"
                                style={{ color: `${C?.dark || "#1C1208"}70` }}
                              >
                                Qty: <span className="font-bold">{item.quantity}</span>
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span
                                className="font-bold text-base sm:text-lg"
                                style={{ color: C?.coral || "#F16937" }}
                              >
                                ₹{formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {checkoutItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="mt-6 w-full py-3.5 text-white font-bold text-sm sm:text-base rounded-full shadow-md hover:opacity-90 transition-all cursor-pointer"
                    style={{ backgroundColor: C?.coral || "#F16937" }}
                  >
                    Proceed to Delivery Address
                  </button>
                )}
              </div>
            )}

            {/* STEP 2: ADDRESSES */}
            {currentStep === 2 && (
              <form
                onSubmit={handleAddressSubmit}
                className="rounded-3xl p-5 sm:p-7 border shadow-xs space-y-6"
                style={{
                  backgroundColor: C?.cream || "#FAF4ED",
                  borderColor: `${C?.dark || "#1C1208"}15`,
                }}
              >
                <div className="space-y-4">
                  <div
                    className="flex items-center gap-2 pb-3 border-b"
                    style={{ borderColor: `${C?.dark || "#1C1208"}15` }}
                  >
                    <Truck size={20} style={{ color: C?.coral || "#F16937" }} />
                    <h2 className="text-lg sm:text-xl font-bold font-heading">
                      2A. Shipping Address
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs font-bold mb-1"
                        style={{ color: `${C?.dark || "#1C1208"}80` }}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleShippingChange}
                        required
                        placeholder="Full Name"
                        className="w-full rounded-xl border bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none"
                        style={{ borderColor: `${C?.dark || "#1C1208"}20` }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-bold mb-1"
                        style={{ color: `${C?.dark || "#1C1208"}80` }}
                      >
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleShippingChange}
                        required
                        placeholder="Mobile Number"
                        className="w-full rounded-xl border bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none"
                        style={{ borderColor: `${C?.dark || "#1C1208"}20` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label
                        className="block text-xs font-bold mb-1"
                        style={{ color: `${C?.dark || "#1C1208"}80` }}
                      >
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        value={shippingAddress.pincode}
                        onChange={handleShippingChange}
                        required
                        placeholder="PIN Code"
                        className="w-full rounded-xl border bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none"
                        style={{ borderColor: `${C?.dark || "#1C1208"}20` }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-bold mb-1"
                        style={{ color: `${C?.dark || "#1C1208"}80` }}
                      >
                        City / District *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        required
                        placeholder="City"
                        className="w-full rounded-xl border bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none"
                        style={{ borderColor: `${C?.dark || "#1C1208"}20` }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-bold mb-1"
                        style={{ color: `${C?.dark || "#1C1208"}80` }}
                      >
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleShippingChange}
                        required
                        placeholder="State"
                        className="w-full rounded-xl border bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none"
                        style={{ borderColor: `${C?.dark || "#1C1208"}20` }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-bold mb-1"
                      style={{ color: `${C?.dark || "#1C1208"}80` }}
                    >
                      Street Address / House No. *
                    </label>
                    <textarea
                      name="street"
                      rows={2}
                      value={shippingAddress.street}
                      onChange={handleShippingChange}
                      required
                      placeholder="House No, Building, Street Area"
                      className="w-full rounded-xl border bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none"
                      style={{ borderColor: `${C?.dark || "#1C1208"}20` }}
                    />
                  </div>
                </div>

                {/* --- BILLING ADDRESS --- */}
                <div
                  className="space-y-4 pt-4 border-t"
                  style={{ borderColor: `${C?.dark || "#1C1208"}15` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt
                        size={20}
                        style={{ color: C?.teal || "#1BACB1" }}
                      />
                      <h2 className="text-lg sm:text-xl font-bold font-heading">
                        2B. Billing Address
                      </h2>
                    </div>

                    <label className="flex items-center gap-2 text-xs sm:text-sm font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="h-4 w-4 rounded cursor-pointer"
                        style={{ accentColor: C?.coral || "#F16937" }}
                      />
                      Same as shipping address
                    </label>
                  </div>

                  {!sameAsShipping && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-xs font-bold mb-1"
                            style={{ color: `${C?.dark || "#1C1208"}80` }}
                          >
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={billingAddress.fullName}
                            onChange={handleBillingChange}
                            required={!sameAsShipping}
                            placeholder="Full Name"
                            className="w-full rounded-xl border bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none"
                            style={{ borderColor: `${C?.dark || "#1C1208"}20` }}
                          />
                        </div>

                        <div>
                          <label
                            className="block text-xs font-bold mb-1"
                            style={{ color: `${C?.dark || "#1C1208"}80` }}
                          >
                            Mobile Phone *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={billingAddress.phone}
                            onChange={handleBillingChange}
                            required={!sameAsShipping}
                            placeholder="Mobile Number"
                            className="w-full rounded-xl border bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none"
                            style={{ borderColor: `${C?.dark || "#1C1208"}20` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label
                            className="block text-xs font-bold mb-1"
                            style={{ color: `${C?.dark || "#1C1208"}80` }}
                          >
                            PIN Code *
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            maxLength={6}
                            value={billingAddress.pincode}
                            onChange={handleBillingChange}
                            required={!sameAsShipping}
                            placeholder="PIN Code"
                            className="w-full rounded-xl border bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none"
                            style={{ borderColor: `${C?.dark || "#1C1208"}20` }}
                          />
                        </div>

                        <div>
                          <label
                            className="block text-xs font-bold mb-1"
                            style={{ color: `${C?.dark || "#1C1208"}80` }}
                          >
                            City / District *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={billingAddress.city}
                            onChange={handleBillingChange}
                            required={!sameAsShipping}
                            placeholder="City"
                            className="w-full rounded-xl border bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none"
                            style={{ borderColor: `${C?.dark || "#1C1208"}20` }}
                          />
                        </div>

                        <div>
                          <label
                            className="block text-xs font-bold mb-1"
                            style={{ color: `${C?.dark || "#1C1208"}80` }}
                          >
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={billingAddress.state}
                            onChange={handleBillingChange}
                            required={!sameAsShipping}
                            placeholder="State"
                            className="w-full rounded-xl border bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none"
                            style={{ borderColor: `${C?.dark || "#1C1208"}20` }}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-xs font-bold mb-1"
                          style={{ color: `${C?.dark || "#1C1208"}80` }}
                        >
                          Street Address / House No. *
                        </label>
                        <textarea
                          name="street"
                          rows={2}
                          value={billingAddress.street}
                          onChange={handleBillingChange}
                          required={!sameAsShipping}
                          placeholder="House No, Building, Street Area"
                          className="w-full rounded-xl border bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none"
                          style={{ borderColor: `${C?.dark || "#1C1208"}20` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="flex items-center gap-3 pt-4 border-t"
                  style={{ borderColor: `${C?.dark || "#1C1208"}15` }}
                >
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border font-bold text-xs sm:text-sm rounded-full cursor-pointer hover:opacity-80 transition"
                    style={{ borderColor: `${C?.dark || "#1C1208"}20` }}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 text-white font-bold text-xs sm:text-sm rounded-full shadow-md hover:opacity-90 transition cursor-pointer"
                    style={{ backgroundColor: C?.coral || "#F16937" }}
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {currentStep === 3 && (
              <div
                className="rounded-3xl p-5 sm:p-7 border shadow-xs space-y-4"
                style={{
                  backgroundColor: C?.cream || "#FAF4ED",
                  borderColor: `${C?.dark || "#1C1208"}15`,
                }}
              >
                <div
                  className="pb-3 border-b"
                  style={{ borderColor: `${C?.dark || "#1C1208"}15` }}
                >
                  <h2 className="text-lg sm:text-xl font-bold font-heading">
                    3. Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "online",
                      label: "UPI / Credit / Debit Card / NetBanking",
                      desc: "Instant secure payment via Razorpay Gateway",
                    },
                    {
                      id: "cod",
                      label: "Cash on Delivery (COD)",
                      desc: "Pay in cash when your order arrives",
                    },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className="flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all"
                      style={
                        paymentMethod === method.id
                          ? {
                              borderColor: C?.coral || "#F16937",
                              backgroundColor: C?.paleCoral || "#FEF1EC",
                            }
                          : {
                              borderColor: `${C?.dark || "#1C1208"}15`,
                              backgroundColor: "#FFFDF9",
                            }
                      }
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="mt-1 cursor-pointer"
                        style={{ accentColor: C?.coral || "#F16937" }}
                      />
                      <div>
                        <p className="font-bold text-sm">{method.label}</p>
                        <p
                          className="text-xs"
                          style={{ color: `${C?.dark || "#1C1208"}70` }}
                        >
                          {method.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={isProcessingPayment}
                    className="px-6 py-3 border font-bold text-xs sm:text-sm rounded-full cursor-pointer disabled:opacity-40 hover:opacity-80 transition"
                    style={{ borderColor: `${C?.dark || "#1C1208"}20` }}
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isProcessingPayment}
                    className="flex-1 py-3.5 text-white font-bold text-sm rounded-full shadow-md hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition"
                    style={{ backgroundColor: C?.coral || "#F16937" }}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>Confirm & Place Order · ₹{formatPrice(grandTotal)}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: ORDER SUMMARY */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
            <div
              className="rounded-3xl p-5 sm:p-6 border shadow-xs"
              style={{
                backgroundColor: C?.cream || "#FAF4ED",
                borderColor: `${C?.dark || "#1C1208"}15`,
              }}
            >
              <h3
                className="font-heading font-bold text-base sm:text-lg pb-3 border-b"
                style={{ borderColor: `${C?.dark || "#1C1208"}15` }}
              >
                Order Summary
              </h3>

              <div
                className="py-4 space-y-2.5 text-xs sm:text-sm border-b"
                style={{ borderColor: `${C?.dark || "#1C1208"}15` }}
              >
                <div
                  className="flex justify-between"
                  style={{ color: `${C?.dark || "#1C1208"}70` }}
                >
                  <span>Items Subtotal</span>
                  <span
                    className="font-semibold"
                    style={{ color: C?.dark || "#1C1208" }}
                  >
                    ₹{formatPrice(subtotal)}
                  </span>
                </div>

                <div
                  className="flex justify-between"
                  style={{ color: `${C?.dark || "#1C1208"}70` }}
                >
                  <span>Shipping Fee</span>
                  <span
                    className="font-bold"
                    style={{ color: C?.green || "#76A845" }}
                  >
                    FREE
                  </span>
                </div>
              </div>

              <div className="py-4 flex justify-between items-center text-sm sm:text-base font-bold">
                <span>Total Amount</span>
                <span
                  className="text-xl font-heading"
                  style={{ color: C?.coral || "#F16937" }}
                >
                  ₹{formatPrice(grandTotal)}
                </span>
              </div>

              {/* Security Badges */}
              <div
                className="mt-4 pt-4 border-t space-y-2 text-[11px]"
                style={{
                  borderColor: `${C?.dark || "#1C1208"}15`,
                  color: `${C?.dark || "#1C1208"}70`,
                }}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={16}
                    style={{ color: C?.teal || "#1BACB1" }}
                  />
                  <span>Safe and Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} style={{ color: C?.coral || "#F16937" }} />
                  <span>Fast delivery directly to your door</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;