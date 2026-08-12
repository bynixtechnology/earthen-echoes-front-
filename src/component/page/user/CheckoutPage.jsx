import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
} from "lucide-react";
import { selectCartItems } from "../../../redux/slices/cartSlice";

const STEPS = [
  { id: 1, name: "Order", icon: Package },
  { id: 2, name: "Address", icon: MapPin },
  { id: 3, name: "Payment", icon: CreditCard },
];

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Buy Now item state passed via navigation
  const buyNowItem = location.state?.buyNowItem;

  // Redux Cart State
  const cartItems = useSelector(selectCartItems) || [];

  // Active step state: 1 = Order Summary, 2 = Address, 3 = Payment
  const [currentStep, setCurrentStep] = useState(1);

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

  // Payment Method state
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Standardize checkout items structure for both Buy Now and Normal Cart
  const checkoutItems = buyNowItem
    ? [
        {
          product: buyNowItem.product || buyNowItem,
          quantity: buyNowItem.quantity || 1,
          price: Number(buyNowItem.price || buyNowItem.product?.price || 0),
        },
      ]
    : cartItems.map((item) => {
        const prodObj = item.productId || item.product || item;
        return {
          product: prodObj,
          quantity: item.quantity || 1,
          price: Number(item.price || prodObj?.price || 0),
        };
      });

  // Order Totals Calculations
  const subtotal = checkoutItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  const handleShippingChange = (e) => {
    setShippingAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBillingChange = (e) => {
    setBillingAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();

    // Shipping address validation
    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.pincode ||
      !shippingAddress.street
    ) {
      alert("Please fill all required shipping address fields.");
      return;
    }

    // Billing address validation if separate
    if (!sameAsShipping) {
      if (
        !billingAddress.fullName ||
        !billingAddress.phone ||
        !billingAddress.pincode ||
        !billingAddress.street
      ) {
        alert("Please fill all required billing address fields.");
        return;
      }
    }

    setCurrentStep(3);
  };

  const handlePlaceOrder = () => {
    const finalBillingAddress = sameAsShipping ? shippingAddress : billingAddress;

    const orderPayload = {
      items: checkoutItems,
      shippingAddress,
      billingAddress: finalBillingAddress,
      paymentMethod,
      totalAmount: grandTotal,
    };

    console.log("Final Order Payload =>", orderPayload);
    alert("Order Placed Successfully!");
    navigate("/user/orders");
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
    <div className="min-h-screen bg-[#FFFDF9] text-[#1C1917] pb-16 pt-6 sm:pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <button
          type="button"
          onClick={handleTopBackClick}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#78716C] hover:text-[#F16937] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} /> {currentStep > 1 ? "Back to previous step" : "Back to Cart"}
        </button>

        {/* STEP PROGRESS BAR */}
        <div className="bg-[#F5F0E8] rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 shadow-sm border border-[rgba(28,25,23,0.08)]">
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
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                        isActive
                          ? "bg-[#F16937] text-white shadow-md shadow-[#F16937]/20 ring-4 ring-[#F16937]/15"
                          : isCompleted
                          ? "bg-[#76A845] text-white"
                          : "bg-white text-[#78716C] border border-[rgba(28,25,23,0.15)]"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={16} /> : step.id}
                    </div>

                    <span
                      className={`text-xs sm:text-base font-bold capitalize transition-colors ${
                        isActive
                          ? "text-[#1C1917]"
                          : isCompleted
                          ? "text-[#76A845]"
                          : "text-[#78716C]"
                      }`}
                    >
                      {step.name}
                    </span>
                  </button>

                  {idx < STEPS.length - 1 && (
                    <ChevronRight
                      size={18}
                      className={`shrink-0 ${
                        currentStep > step.id
                          ? "text-[#76A845]"
                          : "text-[#78716C]/40"
                      }`}
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
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[rgba(28,25,23,0.1)] shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-[rgba(28,25,23,0.08)]">
                  <h2 className="text-lg sm:text-xl font-bold font-heading">
                    1. Review Items
                  </h2>
                  <span className="text-xs sm:text-sm font-semibold text-[#78716C]">
                    {checkoutItems.length} Item(s)
                  </span>
                </div>

                {checkoutItems.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-[#78716C] mb-4">No items found to checkout.</p>
                    <Link
                      to="/products"
                      className="px-5 py-2.5 bg-[#F16937] text-white rounded-full font-bold text-sm"
                    >
                      Explore Products
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-[rgba(28,25,23,0.08)]">
                    {checkoutItems.map((item, idx) => {
                      const prod = item.product || {};
                      const image =
                        Array.isArray(prod.images) && prod.images.length > 0
                          ? typeof prod.images[0] === "string"
                            ? prod.images[0]
                            : prod.images[0]?.url || prod.images[0]?.secure_url
                          : "/placeholder.png";

                      return (
                        <div key={idx} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                          <img
                            src={image}
                            alt={prod.title || "Product"}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-[#F5F0E8] shrink-0"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold text-sm sm:text-base leading-snug">
                                {prod.title || "Untitled Product"}
                              </h3>
                              <p className="text-xs text-[#78716C] mt-1">
                                Qty: <span className="font-bold">{item.quantity}</span>
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#F16937] text-base sm:text-lg">
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
                    className="mt-6 w-full py-3.5 bg-[#F16937] text-white font-bold text-sm sm:text-base rounded-full shadow-lg shadow-[#F16937]/20 hover:opacity-90 transition-all cursor-pointer"
                  >
                    Proceed to Delivery Address
                  </button>
                )}
              </div>
            )}

            {/* STEP 2: ADDRESSES (SHIPPING & BILLING) */}
            {currentStep === 2 && (
              <form
                onSubmit={handleAddressSubmit}
                className="bg-white rounded-3xl p-5 sm:p-7 border border-[rgba(28,25,23,0.1)] shadow-sm space-y-6"
              >
                {/* --- SECTION A: SHIPPING ADDRESS --- */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[rgba(28,25,23,0.08)]">
                    <Truck size={20} className="text-[#F16937]" />
                    <h2 className="text-lg sm:text-xl font-bold font-heading">
                      2A. Shipping Address
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#78716C] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleShippingChange}
                        required
                        placeholder="Ravinder Kumar"
                        className="w-full rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#F16937]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#78716C] mb-1">
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleShippingChange}
                        required
                        placeholder="9876543210"
                        className="w-full rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#F16937]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#78716C] mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        value={shippingAddress.pincode}
                        onChange={handleShippingChange}
                        required
                        placeholder="302001"
                        className="w-full rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#F16937]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#78716C] mb-1">
                        City / District *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        required
                        placeholder="Jaipur"
                        className="w-full rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#F16937]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#78716C] mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleShippingChange}
                        required
                        placeholder="Rajasthan"
                        className="w-full rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#F16937]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#78716C] mb-1">
                      Street Address / House No. *
                    </label>
                    <textarea
                      name="street"
                      rows={2}
                      value={shippingAddress.street}
                      onChange={handleShippingChange}
                      required
                      placeholder="House No, Building, Street Area"
                      className="w-full rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#F16937]"
                    />
                  </div>
                </div>

                {/* --- SECTION B: BILLING ADDRESS --- */}
                <div className="space-y-4 pt-4 border-t border-[rgba(28,25,23,0.08)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt size={20} className="text-[#1BACB1]" />
                      <h2 className="text-lg sm:text-xl font-bold font-heading">
                        2B. Billing Address
                      </h2>
                    </div>

                    <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1C1917] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="h-4 w-4 accent-[#F16937] rounded cursor-pointer"
                      />
                      Same as shipping address
                    </label>
                  </div>

                  {/* SEPARATE BILLING FORM IF SAME IS UNCHECKED */}
                  {!sameAsShipping && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#78716C] mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={billingAddress.fullName}
                            onChange={handleBillingChange}
                            required={!sameAsShipping}
                            placeholder="Ravinder Kumar"
                            className="w-full rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#F16937]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#78716C] mb-1">
                            Mobile Phone *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={billingAddress.phone}
                            onChange={handleBillingChange}
                            required={!sameAsShipping}
                            placeholder="9876543210"
                            className="w-full rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#F16937]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#78716C] mb-1">
                            PIN Code *
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            maxLength={6}
                            value={billingAddress.pincode}
                            onChange={handleBillingChange}
                            required={!sameAsShipping}
                            placeholder="302001"
                            className="w-full rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#F16937]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#78716C] mb-1">
                            City / District *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={billingAddress.city}
                            onChange={handleBillingChange}
                            required={!sameAsShipping}
                            placeholder="Jaipur"
                            className="w-full rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#F16937]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#78716C] mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={billingAddress.state}
                            onChange={handleBillingChange}
                            required={!sameAsShipping}
                            placeholder="Rajasthan"
                            className="w-full rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#F16937]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#78716C] mb-1">
                          Street Address / House No. *
                        </label>
                        <textarea
                          name="street"
                          rows={2}
                          value={billingAddress.street}
                          onChange={handleBillingChange}
                          required={!sameAsShipping}
                          placeholder="House No, Building, Street Area"
                          className="w-full rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#F16937]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[rgba(28,25,23,0.08)]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border border-[rgba(28,25,23,0.2)] font-bold text-xs sm:text-sm rounded-full hover:bg-[#F5F0E8] cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#F16937] text-white font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-[#F16937]/20 hover:opacity-90 cursor-pointer"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[rgba(28,25,23,0.1)] shadow-sm space-y-4">
                <div className="pb-3 border-b border-[rgba(28,25,23,0.08)]">
                  <h2 className="text-lg sm:text-xl font-bold font-heading">
                    3. Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "cod", label: "Cash on Delivery (COD)", desc: "Pay when package arrives" },
                    { id: "online", label: "UPI / Credit / Debit Card", desc: "Instant secure payment via Razorpay / Stripe" },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-[#F16937] bg-[#FEF1EC]/40 ring-1 ring-[#F16937]"
                          : "border-[rgba(28,25,23,0.12)] hover:bg-[#FFFDF9]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="mt-1 accent-[#F16937] cursor-pointer"
                      />
                      <div>
                        <p className="font-bold text-sm">{method.label}</p>
                        <p className="text-xs text-[#78716C]">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 border border-[rgba(28,25,23,0.2)] font-bold text-xs sm:text-sm rounded-full hover:bg-[#F5F0E8] cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="flex-1 py-3.5 bg-[#F16937] text-white font-bold text-sm rounded-full shadow-lg shadow-[#F16937]/20 hover:opacity-90 cursor-pointer"
                  >
                    Confirm & Place Order · ₹{formatPrice(grandTotal)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: ORDER SUMMARY */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[rgba(28,25,23,0.1)] shadow-sm">
              <h3 className="font-heading font-bold text-base sm:text-lg pb-3 border-b border-[rgba(28,25,23,0.08)]">
                Order Summary
              </h3>

              <div className="py-4 space-y-2.5 text-xs sm:text-sm border-b border-[rgba(28,25,23,0.08)]">
                <div className="flex justify-between text-[#78716C]">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-[#1C1917]">
                    ₹{formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-[#78716C]">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-[#1C1917]">
                    {shippingFee === 0 ? (
                      <span className="text-[#76A845] font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
              </div>

              <div className="py-4 flex justify-between items-center text-sm sm:text-base font-bold">
                <span>Total Amount</span>
                <span className="text-[#F16937] text-xl font-heading">
                  ₹{formatPrice(grandTotal)}
                </span>
              </div>

              {/* Security Badges */}
              <div className="mt-4 pt-4 border-t border-[rgba(28,25,23,0.08)] space-y-2 text-[11px] text-[#78716C]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#1BACB1]" />
                  <span>Safe and Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#F16937]" />
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