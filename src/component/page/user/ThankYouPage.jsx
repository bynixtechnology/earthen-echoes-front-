import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Truck,
  ShoppingBag,
  Clock,
  Sparkles,
} from "lucide-react";

const REDIRECT_TIME = 35; // 35 seconds countdown

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [timeLeft, setTimeLeft] = useState(REDIRECT_TIME);

  // State passed from Checkout page
  const orderDetails = location.state?.order || {};
  const orderId =
    orderDetails._id ||
    location.state?.orderId ||
    location.state?.paymentId?.slice(-8).toUpperCase() ||
    "ORD" + Math.floor(100000 + Math.random() * 900000);

  const totalAmount =
    orderDetails.totalAmount || location.state?.amount || 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/user/orders", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const progressPercentage = ((REDIRECT_TIME - timeLeft) / REDIRECT_TIME) * 100;

  return (
    <div className="min-h-[85vh] bg-[#FFFDF9] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-[rgba(28,25,23,0.1)] shadow-xl text-center relative overflow-hidden">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF6E6] text-[#3D7020] text-xs font-bold mb-6">
          <Sparkles size={14} /> Order Placed Successfully
        </div>

        {/* Success Check Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[rgba(118,168,69,0.12)] text-[#76A845] rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-[#76A845]/10 animate-bounce">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl font-bold font-heading text-[#1C1917] tracking-tight">
          Thank You For Your Order!
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-[#78716C] max-w-md mx-auto leading-relaxed">
          Your payment has been received and our master artisans have begun crafting and packaging your earthen order with care.
        </p>

        {/* Order Details Mini Card */}
        <div className="my-6 p-4 sm:p-5 rounded-2xl bg-[#F5F0E8] border border-[rgba(28,25,23,0.08)] flex flex-wrap items-center justify-around gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-[#78716C] block text-[11px] uppercase tracking-wider">Order ID</span>
            <strong className="text-[#1C1917] font-mono text-sm sm:text-base">
              #{orderId.toString().slice(-8).toUpperCase()}
            </strong>
          </div>

          {totalAmount > 0 && (
            <div>
              <span className="text-[#78716C] block text-[11px] uppercase tracking-wider">Total Paid</span>
              <strong className="text-[#F16937] text-sm sm:text-base">
                ₹{Number(totalAmount).toLocaleString("en-IN")}
              </strong>
            </div>
          )}

          <div>
            <span className="text-[#78716C] block text-[11px] uppercase tracking-wider">Estimated Delivery</span>
            <strong className="text-[#3D7020] flex items-center gap-1">
              <Truck size={14} /> 3 - 5 Business Days
            </strong>
          </div>
        </div>

        {/* Live Countdown & Progress Bar */}
        <div className="bg-[rgba(241,105,55,0.06)] rounded-2xl p-4 sm:p-5 mb-8 border border-[#F16937]/15">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#1C1917] mb-2">
            <span className="flex items-center gap-1.5 text-[#F16937]">
              <Clock size={16} /> Auto Redirecting to My Orders
            </span>
            <span className="font-mono font-bold text-[#F16937]">{timeLeft}s</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F16937] transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/user/orders", { replace: true })}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#F16937] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#F16937]/20 hover:opacity-90 transition-all cursor-pointer"
          >
            <Package size={16} /> Go To My Orders Now <ArrowRight size={16} />
          </button>

          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-[rgba(28,25,23,0.15)] text-[#1C1917] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#F5F0E8] transition-all"
          >
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;