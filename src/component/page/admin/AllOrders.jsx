import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";

import {
  fetchAllOrdersAdmin,
  updateOrderStatusAdmin,
  deleteOrderAdmin,
} from "../../../redux/thunks/userAuthThunk";

import {
  selectAdminOrders,
  selectAdminOrdersLoading,
  selectAdminOrdersTotal,
  selectAdminOrdersPages,
  selectAdminOrdersCurrentPage,
  selectAdminOrdersAnalytics,
  selectAdminOrderUpdating,
} from "../../../redux/slices/userAuthSlice";

import { showToast } from "../../../config/toast";

const STATUS_TABS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const AllOrders = () => {
  const dispatch = useDispatch();

  // Redux Selectors
  const orders = useSelector(selectAdminOrders) || [];
  const loading = useSelector(selectAdminOrdersLoading);
  const totalOrders = useSelector(selectAdminOrdersTotal);
  const totalPages = useSelector(selectAdminOrdersPages);
  const currentPage = useSelector(selectAdminOrdersCurrentPage);
  const analytics = useSelector(selectAdminOrdersAnalytics) || {};
  const isUpdating = useSelector(selectAdminOrderUpdating);

  // Local Filter & Search States
  const [activeStatus, setActiveStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // Modal States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModalOrder, setStatusModalOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  // Fetch Orders
  const loadOrders = (targetPage = page) => {
    dispatch(
      fetchAllOrdersAdmin({
        status: activeStatus === "All" ? undefined : activeStatus,
        search: searchTerm.trim() || undefined,
        page: targetPage,
        limit: 15,
      })
    );
  };

  useEffect(() => {
    loadOrders(1);
    setPage(1);
  }, [activeStatus, dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders(1);
    setPage(1);
  };

  const handleStatusUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!statusModalOrder?._id || !newStatus) return;

    try {
      await dispatch(
        updateOrderStatusAdmin({
          orderId: statusModalOrder._id,
          statusData: {
            orderStatus: newStatus,
            courierName: courierName.trim() || undefined,
            trackingNumber: trackingNumber.trim() || undefined,
            trackingUrl: trackingUrl.trim() || undefined,
          },
        })
      ).unwrap();

      showToast?.success?.(`Order status updated to ${newStatus}`);
      setStatusModalOrder(null);
      loadOrders(page);
    } catch (err) {
      showToast?.error?.(err || "Failed to update order status.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteOrderId) return;
    try {
      await dispatch(deleteOrderAdmin(deleteOrderId)).unwrap();
      showToast?.success?.("Order deleted successfully.");
      setDeleteOrderId(null);
      loadOrders(page);
    } catch (err) {
      showToast?.error?.(err || "Unable to delete order.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <Clock size={13} className="animate-spin" /> Processing
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
            <Truck size={13} /> Shipped
          </span>
        );
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 size={13} /> Delivered
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            <XCircle size={13} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (order) => {
    const isCod =
      order.paymentInfo?.paymentMethod === "COD" ||
      !order.paymentInfo?.razorpay_payment_id;

    if (isCod) {
      return (
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
            <Banknote size={11} /> COD (Due on Delivery)
          </span>
        </div>
      );
    }

    return (
      <div>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
          <CreditCard size={11} /> Online (Paid)
        </span>
        {order.paymentInfo?.razorpay_payment_id && (
          <span className="block text-[10px] text-[#78716C] font-mono mt-0.5 truncate max-w-[120px]">
            {order.paymentInfo.razorpay_payment_id}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen text-[#1C1917]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1C1917]">
            Orders & Shipments
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Manage customer purchases, tracking IDs, and delivery lifecycle
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadOrders(page)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[rgba(28,25,23,0.12)] text-xs sm:text-sm font-semibold shadow-xs hover:bg-[#F5F0E8] transition-colors cursor-pointer"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Analytics Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[rgba(28,25,23,0.08)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FEF1EC] text-[#F16937] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold font-heading text-[#F16937] mt-3">
            ₹{Number(analytics.totalRevenue || 0).toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-[#78716C] mt-1 block">
            From verified online payments
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[rgba(28,25,23,0.08)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
              All Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F5F0E8] text-[#1C1917] flex items-center justify-center">
              <Package size={16} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold font-heading text-[#1C1917] mt-3">
            {analytics.totalOrdersCount || totalOrders || 0}
          </p>
          <span className="text-[11px] text-[#78716C] mt-1 block">
            Lifetime orders recorded
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[rgba(28,25,23,0.08)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
              Processing
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold font-heading text-amber-700 mt-3">
            {analytics.processingCount || 0}
          </p>
          <span className="text-[11px] text-[#78716C] mt-1 block">
            Needs dispatch & packing
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[rgba(28,25,23,0.08)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
              Delivered
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold font-heading text-emerald-700 mt-3">
            {analytics.deliveredCount || 0}
          </p>
          <span className="text-[11px] text-[#78716C] mt-1 block">
            Successfully completed
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[rgba(28,25,23,0.08)] shadow-xs mb-6 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveStatus(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeStatus === tab
                    ? "bg-[#F16937] text-white shadow-xs"
                    : "bg-[#F5F0E8] text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]"
              />
              <input
                type="text"
                placeholder="Search by Order ID, Name, Phone, City..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] outline-none focus:border-[#F16937]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1C1917] text-white text-xs sm:text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-3xl border border-[rgba(28,25,23,0.08)] shadow-xs overflow-hidden">
        {loading && orders.length === 0 ? (
          <div className="min-h-[350px] flex flex-col items-center justify-center gap-3">
            <Loader2 size={36} className="animate-spin text-[#F16937]" />
            <p className="text-xs sm:text-sm text-[#78716C]">Loading orders data...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="min-h-[350px] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#FEF1EC] text-[#F16937] flex items-center justify-center mb-3">
              <Package size={28} />
            </div>
            <h3 className="text-base sm:text-lg font-bold font-heading">No orders found</h3>
            <p className="text-xs sm:text-sm text-[#78716C] mt-1 max-w-sm">
              There are no orders matching your selected status filter or search keyword.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-[#78716C] uppercase tracking-wider">
                  <th className="py-4 px-4 sm:px-6">Order ID & Date</th>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Items / Qty</th>
                  <th className="py-4 px-4">Total Amount</th>
                  <th className="py-4 px-4">Payment Method</th>
                  <th className="py-4 px-4">Delivery Status</th>
                  <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 font-medium">
                {orders.map((order) => {
                  const shortId = order._id?.toString().slice(-8).toUpperCase();
                  const customerName =
                    order.shippingAddress?.fullName || order.user?.name || "Customer";
                  const customerPhone =
                    order.shippingAddress?.phone || order.user?.phone || "N/A";
                  const itemsCount = order.items?.reduce(
                    (sum, i) => sum + (Number(i.quantity) || 1),
                    0
                  );

                  return (
                    <tr key={order._id} className="hover:bg-[#FFFDF9] transition-colors">
                      {/* Order ID & Date */}
                      <td className="py-4 px-4 sm:px-6">
                        <span className="font-mono font-bold text-[#1C1917]">
                          #{shortId}
                        </span>
                        <span className="block text-[11px] text-[#78716C] mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-[#1C1917]">{customerName}</p>
                        <span className="text-[11px] text-[#78716C] flex items-center gap-1 mt-0.5">
                          <Phone size={11} /> {customerPhone}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#1C1917]">
                          {order.items?.length || 0} Product(s)
                        </span>
                        <span className="block text-[11px] text-[#78716C]">
                          Total Qty: {itemsCount}
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#F16937] text-sm sm:text-base font-heading">
                          ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Payment Method Badge */}
                      <td className="py-4 px-4">{getPaymentBadge(order)}</td>

                      {/* Delivery Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(order.orderStatus)}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* View Detail Drawer */}
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 rounded-lg text-gray-500 hover:text-[#1BACB1] hover:bg-[#EEF8F8] transition-colors cursor-pointer"
                            title="View Full Breakdown"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Quick Status Update Modal */}
                          <button
                            type="button"
                            onClick={() => {
                              setStatusModalOrder(order);
                              setNewStatus(order.orderStatus);
                              setCourierName(order.courierName || "");
                              setTrackingNumber(order.trackingNumber || "");
                              setTrackingUrl(order.trackingUrl || "");
                            }}
                            className="p-2 rounded-lg text-gray-500 hover:text-[#F16937] hover:bg-[#FEF1EC] transition-colors cursor-pointer"
                            title="Update Tracking & Status"
                          >
                            <Truck size={16} />
                          </button>

                          {/* Delete Order */}
                          <button
                            type="button"
                            onClick={() => setDeleteOrderId(order._id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 flex items-center justify-between gap-4">
            <span className="text-xs text-[#78716C]">
              Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalOrders} Total Orders)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const prevPage = Math.max(1, page - 1);
                  setPage(prevPage);
                  loadOrders(prevPage);
                }}
                disabled={page <= 1 || loading}
                className="p-2 rounded-lg border border-[rgba(28,25,23,0.15)] disabled:opacity-30 hover:bg-gray-50 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextPage = Math.min(totalPages, page + 1);
                  setPage(nextPage);
                  loadOrders(nextPage);
                }}
                disabled={page >= totalPages || loading}
                className="p-2 rounded-lg border border-[rgba(28,25,23,0.15)] disabled:opacity-30 hover:bg-gray-50 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================================
          1. ORDER FULL BREAKDOWN MODAL
      ========================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 border-b pb-4 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF1EC] text-[#F16937] flex items-center justify-center">
                <Package size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg">
                  Order #{selectedOrder._id?.toString().slice(-8).toUpperCase()}
                </h3>
                <span className="text-xs text-[#78716C]">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Courier Tracking Info if dispatched */}
            {(selectedOrder.trackingNumber || selectedOrder.courierName) && (
              <div className="bg-sky-50/70 border border-sky-100 p-4 rounded-2xl mb-6 text-xs sm:text-sm">
                <h4 className="font-bold text-sky-800 mb-1 flex items-center gap-1.5">
                  <Truck size={15} /> Courier Dispatch Tracking
                </h4>
                <p className="text-sky-950">
                  Courier: <strong>{selectedOrder.courierName || "Standard Shipping"}</strong> | AWB:{" "}
                  <strong>{selectedOrder.trackingNumber}</strong>
                </p>
                {selectedOrder.trackingUrl && (
                  <a
                    href={selectedOrder.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:underline mt-1.5"
                  >
                    Track Shipment Live <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}

            {/* Address Box */}
            <div className="bg-[#FBF6F2] border border-[#EFE5DC] p-4 rounded-2xl mb-6 text-xs sm:text-sm">
              <h4 className="font-bold text-[#F16937] mb-2 flex items-center gap-1.5">
                <MapPin size={15} /> Delivery Address
              </h4>
              <p className="font-semibold text-[#1C1917]">
                {selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name}
              </p>
              <p className="text-[#78716C] mt-0.5">
                {selectedOrder.shippingAddress?.street}
              </p>
              <p className="text-[#78716C]">
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{" "}
                <strong>{selectedOrder.shippingAddress?.pincode}</strong>
              </p>
              <p className="text-[#78716C] mt-1 font-medium">
                Phone: {selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone || "N/A"}
              </p>
            </div>

            {/* Line Items */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                Purchased Products ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-gray-100 border rounded-2xl overflow-hidden">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="p-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-50 border"
                      />
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-[#1C1917]">{item.title}</p>
                        {item.variant?.colorName && (
                          <span className="text-[11px] text-[#78716C]">
                            Color: {item.variant.colorName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs sm:text-sm font-bold text-[#F16937]">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                      <span className="text-[11px] text-[#78716C]">
                        ₹{item.price} × {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Snapshot */}
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm mb-6">
              <div>
                <span className="text-[#78716C] block">Payment Details</span>
                <span className="font-semibold text-[#1C1917]">
                  {selectedOrder.paymentInfo?.paymentMethod === "COD"
                    ? "Cash on Delivery (Pending)"
                    : `Razorpay Online (${selectedOrder.paymentInfo?.razorpay_payment_id || "Verified"})`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#78716C] block">Grand Total</span>
                <span className="text-lg font-bold font-heading text-[#F16937]">
                  ₹{Number(selectedOrder.totalAmount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 bg-[#1C1917] text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}

      {/* ==========================================================
          2. UPDATE TRACKING & DELIVERY STATUS MODAL
      ========================================================== */}
      {statusModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleStatusUpdateSubmit}
            className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
          >
            <h3 className="font-heading font-bold text-lg text-[#1C1917] mb-1">
              Update Order Status
            </h3>
            <p className="text-xs text-[#78716C] mb-4">
              Order #{statusModalOrder._id?.toString().slice(-8).toUpperCase()}
            </p>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#78716C] mb-1">
                  Delivery Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[rgba(28,25,23,0.15)] bg-white font-semibold outline-none focus:border-[#F16937]"
                >
                  <option value="Processing">Processing (Packing Order)</option>
                  <option value="Shipped">Shipped (Dispatched with Courier)</option>
                  <option value="Delivered">Delivered (Handed to Customer)</option>
                  <option value="Cancelled">Cancelled (Auto Restock Item)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#78716C] mb-1">
                  Courier Partner Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. BlueDart, Delhivery, DTDC"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] outline-none focus:border-[#F16937]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#78716C] mb-1">
                  Tracking Number / AWB
                </label>
                <input
                  type="text"
                  placeholder="e.g. BLD1289312389"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] outline-none focus:border-[#F16937]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#78716C] mb-1">
                  Live Tracking URL
                </label>
                <input
                  type="url"
                  placeholder="https://track.courier.com/..."
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[rgba(28,25,23,0.15)] bg-[#FFFDF9] outline-none focus:border-[#F16937]"
                />
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setStatusModalOrder(null)}
                className="flex-1 py-2.5 rounded-xl border border-[rgba(28,25,23,0.15)] text-xs sm:text-sm font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 py-2.5 rounded-xl bg-[#F16937] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#F16937]/20 hover:opacity-90 cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Update Status"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================================
          3. DELETE ORDER CONFIRMATION MODAL
      ========================================================== */}
      {deleteOrderId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} />
            </div>
            <h3 className="font-heading font-bold text-base text-[#1C1917]">
              Delete Order Record?
            </h3>
            <p className="text-xs text-[#78716C] mt-1 mb-6">
              This action cannot be undone. This order will be permanently deleted from the database.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteOrderId(null)}
                className="flex-1 py-2.5 rounded-xl border border-[rgba(28,25,23,0.15)] text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;