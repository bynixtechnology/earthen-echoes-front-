import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShoppingBag,
  Loader2,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { UserAuthService } from "../../../services/userAuthService";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await UserAuthService.getMyOrders();

      if (response?.success) {
        setOrders(response.orders || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EEF6E6] text-[#3D7020]">
            <CheckCircle2 size={13} /> Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
            <Truck size={13} /> Shipped
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FDF4F8] text-[#E44587]">
            <AlertCircle size={13} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600">
            <Clock size={13} /> Processing
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#FFFDF9] flex flex-col items-center justify-center gap-3">
        <Loader2 size={40} className="animate-spin text-[#F16937]" />
        <p className="text-xs sm:text-sm text-[#78716C]">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] bg-[#FFFDF9] py-16 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#FDF4F8] text-[#E44587] flex items-center justify-center mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-xl font-bold text-[#1C1917]">Unable to load orders</h2>
        <p className="mt-1 text-xs text-[#78716C] max-w-sm">{error}</p>
        <button
          type="button"
          onClick={loadOrders}
          className="mt-6 px-5 py-2.5 rounded-full bg-[#F16937] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer"
        >
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FFFDF9] py-16 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-[rgba(241,105,55,0.1)] flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-[#F16937]" />
        </div>

        <h2 className="text-2xl font-bold text-[#1C1917] font-heading">
          No Orders Yet
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-[#78716C] max-w-md">
          You haven't placed any orders yet. Once you complete a purchase, your order history and tracking details will appear here.
        </p>

        <Link
          to="/products"
          className="mt-8 px-7 py-3.5 rounded-full bg-[#F16937] text-white text-xs sm:text-sm font-bold shadow-md shadow-[rgba(241,105,55,0.25)] hover:opacity-90 transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#1C1917]">
              My Orders
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#78716C]">
              View and track all your orders and payments.
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-[#F16937] hover:underline flex items-center gap-1"
          >
            Browse More <ChevronRight size={14} />
          </Link>
        </div>

        {/* Orders List */}
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-[rgba(28,25,23,0.1)] p-4 sm:p-6 shadow-sm"
            >
              {/* Order Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#78716C]">
                  <div>
                    <span>Order: </span>
                    <strong className="text-[#1C1917] font-mono">
                      #{order._id?.slice(-8).toUpperCase()}
                    </strong>
                  </div>
                  <div>
                    <span>Placed On: </span>
                    <strong className="text-[#1C1917]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </strong>
                  </div>
                </div>

                <div>{getStatusBadge(order.orderStatus || "Processing")}</div>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-black/5">
                {order.items?.map((item, idx) => {
                  const productTitle =
                    item.title ||
                    item.product?.title ||
                    "Handcrafted Pottery";
                  const productImage =
                    item.image ||
                    item.product?.images?.[0]?.url ||
                    item.product?.images?.[0] ||
                    "/placeholder.png";

                  return (
                    <div
                      key={`${item.product?._id || idx}-${idx}`}
                      className="py-4 flex items-center gap-3 sm:gap-4"
                    >
                      <img
                        src={productImage}
                        alt={productTitle}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover bg-[#F5F0E8] shrink-0 border border-black/5"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs sm:text-sm text-[#1C1917] truncate">
                          {productTitle}
                        </h3>

                        {item.variant?.colorName && (
                          <p className="text-[11px] text-[#78716C] mt-0.5">
                            Color: <span className="font-medium text-[#1C1917]">{item.variant.colorName}</span>
                          </p>
                        )}

                        <p className="text-xs text-[#78716C] mt-1">
                          Qty: {item.quantity} × ₹{Number(item.price || 0).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="text-right font-bold text-xs sm:text-sm text-[#1C1917]">
                        ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString("en-IN")}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-black/5 pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-[#78716C]">
                  <span>Payment: </span>
                  <span className="font-semibold text-[#3D7020]">
                    Paid ({order.paymentInfo?.razorpay_payment_id || "Online"})
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs text-[#78716C]">Total Amount:</span>
                  <span className="text-base sm:text-lg font-bold text-[#F16937]">
                    ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;