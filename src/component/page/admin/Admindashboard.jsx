import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Plus,
  Phone,
  Eye,
  Loader2,
} from "lucide-react";

import { fetchAdminDashboardStats } from "../../../redux/thunks/userAuthThunk";
import {
  selectAdminDashboardCounts,
  selectAdminDashboardActivities,
  selectAdminDashboardLoading,
  selectAdminDashboardError,
} from "../../../redux/slices/userAuthSlice";

const Admindashboard = () => {
  const dispatch = useDispatch();

  const counts = useSelector(selectAdminDashboardCounts) || {};
  const activities = useSelector(selectAdminDashboardActivities) || {};
  const loading = useSelector(selectAdminDashboardLoading);
  const error = useSelector(selectAdminDashboardError);

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalProducts = 0,
    totalUsers = 0,
    statusBreakdown = {},
  } = counts;

  const {
    recentProducts = [],
    recentOrders = [],
    recentUsers = [],
    lowStockAlerts = [],
  } = activities;

  useEffect(() => {
    dispatch(fetchAdminDashboardStats());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAdminDashboardStats());
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <Clock size={11} className="animate-spin" /> Processing
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
            <Truck size={11} /> Shipped
          </span>
        );
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 size={11} /> Delivered
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            <XCircle size={11} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  if (loading && !counts.totalOrders) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3 bg-[#FBF9F5]">
        <Loader2 size={36} className="animate-spin text-[#F16937]" />
        <p className="text-xs sm:text-sm text-[#78716C]">Loading admin dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8  text-[#1C1917] space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1C1917]">
            Overview Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Real-time sales, inventory alerts, and order processing telemetry
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[rgba(28,25,23,0.12)] text-xs sm:text-sm font-semibold shadow-xs hover:bg-[#F5F0E8] transition-colors cursor-pointer"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Sync Data
          </button>

          <Link
            to="/admin/add-product"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F16937] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#F16937]/20 hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-[rgba(28,25,23,0.08)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FEF1EC] text-[#F16937] flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-heading text-[#F16937] mt-3">
            ₹{Number(totalRevenue).toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-[#78716C] mt-1 block">
            Verified online transactions
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[rgba(28,25,23,0.08)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#EEF8F8] text-[#1BACB1] flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-heading text-[#1C1917] mt-3">
            {totalOrders}
          </p>
          <span className="text-[11px] text-[#78716C] mt-1 block">
            Lifetime orders recorded
          </span>
        </div>

        {/* Total Products */}
        <div className="bg-white p-5 rounded-3xl border border-[rgba(28,25,23,0.08)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
              Total Products
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#F5F0E8] text-[#76A845] flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-heading text-[#1C1917] mt-3">
            {totalProducts}
          </p>
          <span className="text-[11px] text-[#78716C] mt-1 block">
            Catalog inventory items
          </span>
        </div>

        {/* Customers */}
        <div className="bg-white p-5 rounded-3xl border border-[rgba(28,25,23,0.08)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
              Registered Users
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-heading text-[#1C1917] mt-3">
            {totalUsers}
          </p>
          <span className="text-[11px] text-[#78716C] mt-1 block">
            Active customer accounts
          </span>
        </div>
      </div>

      {/* Status Breakdown Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[rgba(28,25,23,0.08)] shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#78716C] mb-4">
          Order Delivery Status Pipeline
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
            <span className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
              <Clock size={14} /> Processing
            </span>
            <p className="text-xl font-bold font-heading text-amber-900 mt-1">
              {statusBreakdown.Processing || 0}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100">
            <span className="text-xs font-semibold text-sky-700 flex items-center gap-1.5">
              <Truck size={14} /> In Transit / Shipped
            </span>
            <p className="text-xl font-bold font-heading text-sky-900 mt-1">
              {statusBreakdown.Shipped || 0}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Completed / Delivered
            </span>
            <p className="text-xl font-bold font-heading text-emerald-900 mt-1">
              {statusBreakdown.Delivered || 0}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100">
            <span className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
              <XCircle size={14} /> Cancelled
            </span>
            <p className="text-xl font-bold font-heading text-rose-900 mt-1">
              {statusBreakdown.Cancelled || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Sidebar Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Recent Orders Table (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[rgba(28,25,23,0.08)] shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-[#1C1917]">
                Recent Orders
              </h2>
              <p className="text-xs text-[#78716C]">Latest transactions requiring tracking</p>
            </div>

            <Link
              to="/admin/order"
              className="text-xs font-bold text-[#F16937] hover:underline inline-flex items-center gap-1"
            >
              View All Orders <ArrowRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-xs sm:text-sm text-[#78716C]">
              No orders placed yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 text-[#78716C] font-semibold text-[11px] uppercase tracking-wider border-b border-gray-100">
                    <th className="py-3.5 px-5">Order</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#FFFDF9] transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-mono font-bold text-[#1C1917]">
                          #{order._id?.toString().slice(-8).toUpperCase()}
                        </span>
                        <span className="block text-[11px] text-[#78716C]">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#1C1917]">
                          {order.shippingAddress?.fullName || order.user?.name || "Customer"}
                        </p>
                        <span className="text-[11px] text-[#78716C]">
                          {order.shippingAddress?.city || "Jaipur"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#F16937] font-heading">
                        ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(order.orderStatus)}</td>

                      <td className="py-3.5 px-5 text-right">
                        <Link
                          to="/admin/order"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#F16937] hover:bg-[#FEF1EC] inline-flex items-center transition-colors"
                        >
                          <Eye size={15} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Low Stock & Recent Users (Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Alerts */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[rgba(28,25,23,0.08)] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-heading font-bold text-sm sm:text-base flex items-center gap-2 text-rose-600">
                <AlertTriangle size={17} /> Low Stock Alert
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
                {lowStockAlerts.length} Items
              </span>
            </div>

            {lowStockAlerts.length === 0 ? (
              <p className="text-xs text-[#78716C]">All products sufficiently stocked.</p>
            ) : (
              <div className="space-y-3">
                {lowStockAlerts.map((prod) => {
                  const img =
                    Array.isArray(prod.images) && prod.images.length > 0
                      ? typeof prod.images[0] === "string"
                        ? prod.images[0]
                        : prod.images[0]?.url
                      : "/placeholder.png";

                  return (
                    <div
                      key={prod._id}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-rose-50/40 border border-rose-100"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={img}
                          alt={prod.title}
                          className="w-10 h-10 rounded-xl object-cover border shrink-0 bg-white"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs truncate text-[#1C1917]">
                            {prod.title}
                          </p>
                          <span className="text-[11px] text-[#78716C]">
                            ₹{Number(prod.price || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] shrink-0 font-mono">
                        {prod.stock} Left
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Newly Registered Customers */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[rgba(28,25,23,0.08)] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-heading font-bold text-sm sm:text-base flex items-center gap-2 text-[#1C1917]">
                <Users size={17} className="text-purple-600" /> Recent Customers
              </h3>

              <Link
                to="/admin/users"
                className="text-xs font-bold text-[#F16937] hover:underline"
              >
                View All
              </Link>
            </div>

            {recentUsers.length === 0 ? (
              <p className="text-xs text-[#78716C]">No customer signups yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentUsers.map((u) => (
                  <div key={u._id} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      {u.name?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-[#1C1917] truncate">{u.name}</p>
                      <span className="text-[11px] text-[#78716C] truncate block">
                        {u.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recently Added Products */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[rgba(28,25,23,0.08)] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
          <div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#1C1917]">
              Recently Added Products
            </h2>
            <p className="text-xs text-[#78716C]">Latest catalog listings created</p>
          </div>

          <Link
            to="/admin/product"
            className="text-xs font-bold text-[#F16937] hover:underline inline-flex items-center gap-1"
          >
            Manage All Products <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recentProducts.map((prod) => {
            const img =
              Array.isArray(prod.images) && prod.images.length > 0
                ? typeof prod.images[0] === "string"
                  ? prod.images[0]
                  : prod.images[0]?.url
                : "/placeholder.png";

            return (
              <div
                key={prod._id}
                className="p-3 rounded-2xl bg-[#FFFDF9] border border-[rgba(28,25,23,0.08)] hover:shadow-sm transition-all"
              >
                <img
                  src={img}
                  alt={prod.title}
                  className="w-full h-32 rounded-xl object-cover bg-white mb-2.5 border"
                />
                <h4 className="font-bold text-xs sm:text-sm text-[#1C1917] truncate">
                  {prod.title}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-[#F16937] text-xs sm:text-sm">
                    ₹{Number(prod.price || 0).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {prod.stock} in stock
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Admindashboard;