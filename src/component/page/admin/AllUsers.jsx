import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  AlertCircle,
  Hash,
  ShoppingCart,
  Heart,
  Eye,
  X,
  Package,
} from "lucide-react";

import { fetchAllUsers } from "../../../redux/thunks/userAuthThunk";
import {
  selectAllUsers,
  selectAllUsersLoading,
  selectAllUsersError,
} from "../../../redux/slices/userAuthSlice";

export const C = {
  coral: "#F16937",
  teal: "#1BACB1",
  blush: "#F5B5D0",
  raspberry: "#E44587",
  green: "#76A845",
  ivory: "#FDF8F3",
  cream: "#FAF4ED",
  dark: "#1C1208",
  darkTeal: "#0D6B70",
  paleTeal: "#E8F7F8",
  paleBlush: "#FEF0F6",
  paleCoral: "#FEF1EC",
  paleGreen: "#EEF6E7",
};

export default function AllUsers() {
  const dispatch = useDispatch();

  const users = useSelector(selectAllUsers);
  const loading = useSelector(selectAllUsersLoading);
  const error = useSelector(selectAllUsersError);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [cartFilter, setCartFilter] = useState("all");

  // Selected User Cart Modal State
  const [selectedUserCart, setSelectedUserCart] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAllUsers());
  };

  // Helper functions
  const getCartTotalUnits = (cart = []) => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => total + (Number(item?.quantity) || 1), 0);
  };

  const getCartUniqueItems = (cart = []) => {
    return Array.isArray(cart) ? cart.length : 0;
  };

  const getWishlistCount = (wishlist = []) => {
    return Array.isArray(wishlist) ? wishlist.length : 0;
  };

  const getProductImage = (prod) => {
    if (!prod) return "/placeholder.png";
    if (Array.isArray(prod.images) && prod.images.length > 0) {
      const firstImg = prod.images[0];
      if (typeof firstImg === "string") return firstImg;
      return firstImg?.url || firstImg?.secure_url || "/placeholder.png";
    }
    return "/placeholder.png";
  };

  // Search & Filter Logic
  const filteredUsers = useMemo(() => {
    return (users || []).filter((user) => {
      const term = searchTerm.toLowerCase();
      const nameMatch = user?.name?.toLowerCase().includes(term);
      const emailMatch = user?.email?.toLowerCase().includes(term);
      const phoneMatch = user?.phone?.toString().includes(term);
      const idMatch = user?._id?.toLowerCase().includes(term);

      const matchesSearch = nameMatch || emailMatch || phoneMatch || idMatch;
      const matchesRole =
        roleFilter === "all" ? true : user?.role === roleFilter;

      const cartItemCount = user?.cart?.length || 0;
      let matchesCart = true;
      if (cartFilter === "has_cart") matchesCart = cartItemCount > 0;
      if (cartFilter === "empty_cart") matchesCart = cartItemCount === 0;

      return matchesSearch && matchesRole && matchesCart;
    });
  }, [users, searchTerm, roleFilter, cartFilter]);

  const totalUsers = users?.length || 0;
  const adminCount = users?.filter((u) => u.role === "admin").length || 0;
  const customerCount = totalUsers - adminCount;
  const usersWithCartItems =
    users?.filter((u) => (u.cart?.length || 0) > 0).length || 0;

  // Cart total value calculation for the modal
  const cartTotalValue = useMemo(() => {
    if (!selectedUserCart?.cart) return 0;
    return selectedUserCart.cart.reduce((acc, item) => {
      const price = Number(item.productId?.price || 0);
      const qty = Number(item.quantity || 1);
      return acc + price * qty;
    }, 0);
  }, [selectedUserCart]);

  // Extract phone number helper (direct phone or fallback to address)
  const getUserPhone = (user) => {
    if (user?.phone && user.phone.trim() !== "") return user.phone;
    const addrPhone = user?.addresses?.find((a) => a.phone)?.phone;
    return addrPhone || null;
  };

  return (
    <div
      className="w-full  p-2 sm:p-3 lg:p-4 space-y-6"
    
    >
      {/* ── Top Header ────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl p-5 shadow-sm border"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: C.paleCoral,
        }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl shadow-inner border"
            style={{
              backgroundColor: C.paleCoral,
              color: C.coral,
              borderColor: `${C.coral}30`,
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <h1
              className="text-xl sm:text-2xl font-bold tracking-tight"
              style={{ color: C.dark }}
            >
              Registered Users & Cart Inventory
            </h1>
            <p className="text-xs sm:text-sm font-medium mt-0.5 text-slate-500">
              Manage accounts, inspect active cart contents, prices, and wishlists
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 disabled:opacity-50 shadow-sm self-start sm:self-auto cursor-pointer"
          style={{
            backgroundColor: C.paleTeal,
            color: C.darkTeal,
            border: `1px solid ${C.teal}40`,
          }}
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
            style={{ color: C.teal }}
          />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* ── Metric Summary Cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 shadow-sm border"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: C.paleCoral,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Users
            </span>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: C.paleCoral, color: C.coral }}
            >
              <Users size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold" style={{ color: C.dark }}>
            {totalUsers}
          </p>
          <div className="mt-2 text-xs text-slate-400 font-medium">
            Registered database accounts
          </div>
        </div>

        {/* Active Carts */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 shadow-sm border"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: `${C.coral}30`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Carts
            </span>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: C.paleCoral, color: C.coral }}
            >
              <ShoppingCart size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold" style={{ color: C.coral }}>
            {usersWithCartItems}
          </p>
          <div className="mt-2 text-xs text-slate-400 font-medium">
            Users with items in cart
          </div>
        </div>

        {/* Customers */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 shadow-sm border"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: C.paleGreen,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Customers
            </span>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: C.paleGreen, color: C.green }}
            >
              <UserCheck size={20} />
            </div>
          </div>
          <p
            className="mt-2 text-3xl font-extrabold"
            style={{ color: C.green }}
          >
            {customerCount}
          </p>
          <div className="mt-2 text-xs text-slate-400 font-medium">
            Customer profiles
          </div>
        </div>

        {/* Admins */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 shadow-sm border"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: C.paleTeal,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Admins
            </span>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: C.paleTeal, color: C.teal }}
            >
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold" style={{ color: C.teal }}>
            {adminCount}
          </p>
          <div className="mt-2 text-xs text-slate-400 font-medium">
            Admin accounts
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: C.darkTeal }}
          />
          <input
            type="text"
            placeholder="Search by name, email, phone, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl pl-10 pr-4 py-3 text-sm placeholder-slate-400 border focus:outline-none transition shadow-sm"
            style={{
              backgroundColor: "#FFFFFF",
              color: C.dark,
              borderColor: `${C.teal}35`,
            }}
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl px-4 py-3 text-sm font-semibold border focus:outline-none transition cursor-pointer shadow-sm"
          style={{
            backgroundColor: "#FFFFFF",
            color: C.dark,
            borderColor: `${C.teal}35`,
          }}
        >
          <option value="all">All Roles</option>
          <option value="user">Customer Only</option>
          <option value="admin">Admin Only</option>
        </select>

        {/* Cart Filter */}
        <select
          value={cartFilter}
          onChange={(e) => setCartFilter(e.target.value)}
          className="rounded-xl px-4 py-3 text-sm font-semibold border focus:outline-none transition cursor-pointer shadow-sm"
          style={{
            backgroundColor: "#FFFFFF",
            color: C.dark,
            borderColor: `${C.coral}35`,
          }}
        >
          <option value="all">All Cart Status</option>
          <option value="has_cart">With Cart Items</option>
          <option value="empty_cart">Empty Cart</option>
        </select>
      </div>

      {/* ── Error Banner ──────────────────────────────────────── */}
      {error && (
        <div
          className="flex items-center gap-3 rounded-xl border p-4 text-sm font-medium"
          style={{
            backgroundColor: C.paleBlush,
            color: C.raspberry,
            borderColor: `${C.raspberry}40`,
          }}
        >
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Clean & Simple Table ─────────────────────────────── */}
      <div
        className="overflow-hidden rounded-2xl border shadow-sm"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: C.paleCoral,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead
              className="border-b text-xs uppercase tracking-wider font-bold"
             
            >
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-center">Cart Status</th>
                <th className="px-6 py-4">Wishlist</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
              </tr>
            </thead>

            <tbody className="divide-y" style={{ borderColor: C.cream }}>
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <RefreshCw
                      size={28}
                      className="mx-auto animate-spin mb-3"
                      style={{ color: C.coral }}
                    />
                    <p className="font-semibold" style={{ color: C.dark }}>
                      Fetching user records...
                    </p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <Users size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold" style={{ color: C.dark }}>
                      No users found matching your search
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting filters or search query
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const cartCount = getCartUniqueItems(user?.cart);
                  const cartUnits = getCartTotalUnits(user?.cart);
                  const wishlistCount = getWishlistCount(user?.wishlist);
                  const displayPhone = getUserPhone(user);

                  return (
                    <tr
                      key={user._id}
                      className="transition-colors duration-150 hover:bg-amber-50/40"
                    >
                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover border shrink-0 shadow-sm"
                              style={{ borderColor: C.paleCoral }}
                            />
                          ) : (
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-full font-bold border shrink-0 shadow-sm"
                              style={{
                                backgroundColor: C.paleCoral,
                                color: C.coral,
                                borderColor: `${C.coral}30`,
                              }}
                            >
                              {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p
                              className="font-bold truncate text-sm sm:text-base"
                              style={{ color: C.dark }}
                            >
                              {user.name || "Unnamed User"}
                            </p>
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono mt-0.5">
                              <Hash size={11} className="text-slate-400" />
                              <span className="truncate">{user._id}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div
                            className="flex items-center gap-2 text-xs sm:text-sm font-medium"
                            style={{ color: C.dark }}
                          >
                            <Mail
                              size={15}
                              className="shrink-0"
                              style={{ color: C.coral }}
                            />
                            <span className="truncate">{user.email || "No email"}</span>
                          </div>
                          {displayPhone ? (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Phone size={14} className="shrink-0 text-slate-400" />
                              <span>{displayPhone}</span>
                            </div>
                          ) : null}
                        </div>
                      </td>

                      {/* Cart Action Button */}
                      <td className="px-6 py-4 text-center">
                        {cartCount > 0 ? (
                          <button
                            type="button"
                            onClick={() => setSelectedUserCart(user)}
                            className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer hover:opacity-90 border"
                            style={{
                              backgroundColor: C.paleCoral,
                              color: C.coral,
                              borderColor: `${C.coral}40`,
                            }}
                          >
                            <ShoppingCart size={14} />
                            <span>
                              {cartCount} Items ({cartUnits} Units)
                            </span>
                            <Eye size={12} />
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                            <ShoppingCart size={13} className="text-slate-300" />
                            <span>Empty Cart</span>
                          </span>
                        )}
                      </td>

                      {/* Wishlist */}
                      <td className="px-6 py-4">
                        {wishlistCount > 0 ? (
                          <span
                            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border"
                            style={{
                              backgroundColor: C.paleBlush,
                              color: C.raspberry,
                              borderColor: `${C.raspberry}30`,
                            }}
                          >
                            <Heart size={12} className="fill-current" />
                            <span>{wishlistCount} Saved</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">0</span>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wide border"
                          style={
                            user.role === "admin"
                              ? {
                                  backgroundColor: C.paleTeal,
                                  color: C.darkTeal,
                                  borderColor: `${C.teal}40`,
                                }
                              : {
                                  backgroundColor: C.paleGreen,
                                  color: C.green,
                                  borderColor: `${C.green}40`,
                                }
                          }
                        >
                          {user.role === "admin" ? (
                            <ShieldCheck size={13} style={{ color: C.teal }} />
                          ) : (
                            <UserCheck size={13} style={{ color: C.green }} />
                          )}
                          <span>{user.role || "user"}</span>
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 text-xs sm:text-sm text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="shrink-0 text-slate-400" />
                          <span>
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div
          className="border-t px-6 py-3.5 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 font-semibold"
          style={{
            backgroundColor: C.cream,
            borderColor: C.paleCoral,
            color: C.dark,
          }}
        >
          <span>
            Showing <strong style={{ color: C.coral }}>{filteredUsers.length}</strong> of{" "}
            <strong style={{ color: C.dark }}>{totalUsers}</strong> total registered accounts
          </span>
          <span className="text-slate-500">
            Active Cart Users: <strong style={{ color: C.coral }}>{usersWithCartItems}</strong>
          </span>
        </div>
      </div>

      {/* ── Cart Inspection Detail Modal (Pop-up) ──────────────── */}
      {selectedUserCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-2xl rounded-3xl p-6 shadow-2xl border space-y-5 max-h-[85vh] flex flex-col"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: C.paleCoral,
              color: C.dark,
            }}
          >
            {/* Modal Header with Phone Number */}
            <div
              className="flex items-start justify-between pb-4 border-b"
              style={{ borderColor: `${C.dark}15` }}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner shrink-0"
                  style={{ backgroundColor: C.paleCoral, color: C.coral }}
                >
                  <ShoppingCart size={22} />
                </div>
                <div>
                  <h3
                    className="font-bold text-lg font-heading"
                    style={{ color: C.dark }}
                  >
                    {selectedUserCart.name}&apos;s Cart Items
                  </h3>

                  {/* Contact Badges: Email & Phone Number */}
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Mail size={12} className="text-slate-400" />
                      <span>{selectedUserCart.email}</span>
                    </span>

                    {/* 📞 Phone Number Tag in Modal */}
                    {getUserPhone(selectedUserCart) ? (
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border"
                        style={{
                          backgroundColor: C.paleGreen,
                          color: C.green,
                          borderColor: `${C.green}30`,
                        }}
                      >
                        <Phone size={11} />
                        <span>{getUserPhone(selectedUserCart)}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        (No phone provided)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUserCart(null)}
                className="p-2 rounded-full hover:bg-black/5 transition cursor-pointer"
                style={{ color: C.dark }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Items Table */}
            <div
              className="flex-1 overflow-y-auto pr-1"
              style={{ borderColor: `${C.dark}10` }}
            >
              {selectedUserCart.cart && selectedUserCart.cart.length > 0 ? (
                <div
                  className="overflow-hidden rounded-xl border"
                  style={{ borderColor: C.paleCoral }}
                >
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead
                      className="border-b font-bold"
                      style={{
                        backgroundColor: C.cream,
                        borderColor: C.paleCoral,
                        color: C.dark,
                      }}
                    >
                      <tr>
                        <th className="p-3">Product</th>
                        <th className="p-3">Variant</th>
                        <th className="p-3 text-center">Quantity</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody
                      className="divide-y"
                      style={{ borderColor: `${C.dark}10` }}
                    >
                      {selectedUserCart.cart.map((item, idx) => {
                        const prod =
                          typeof item.productId === "object" &&
                          item.productId !== null
                            ? item.productId
                            : null;
                        const prodTitle =
                          prod?.title ||
                          prod?.name ||
                          `Product (${item.productId || "N/A"})`;
                        const prodImg = getProductImage(prod);
                        const price = Number(prod?.price || 0);
                        const qty = Number(item.quantity || 1);
                        const subtotal = price * qty;

                        return (
                          <tr key={item._id || idx} className="hover:bg-amber-50/30">
                            {/* Product */}
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prodImg}
                                  alt={prodTitle}
                                  className="h-12 w-12 rounded-xl object-cover border shrink-0 bg-[#FAF4ED]"
                                  style={{ borderColor: `${C.dark}15` }}
                                />
                                <div className="min-w-0">
                                  <p
                                    className="font-bold truncate max-w-[150px] sm:max-w-[200px]"
                                    style={{ color: C.dark }}
                                  >
                                    {prodTitle}
                                  </p>
                                 
                                </div>
                              </div>
                            </td>

                            {/* Variant */}
                            <td className="p-3">
                              {item.variant?.colorName ? (
                                <span
                                  className="inline-block text-xs font-semibold px-2 py-0.5 rounded border"
                                  style={{ borderColor: `${C.dark}20` }}
                                >
                                  {item.variant.colorName}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-xs">
                                  Standard
                                </span>
                              )}
                            </td>

                            {/* Quantity */}
                            <td className="p-3 text-center font-bold">
                              <span
                                className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold"
                                style={{
                                  backgroundColor: C.paleCoral,
                                  color: C.coral,
                                }}
                              >
                                {qty} Qty
                              </span>
                            </td>

                            {/* Unit Price */}
                            <td className="p-3 text-right font-medium">
                              {price > 0 ? `₹${price.toLocaleString("en-IN")}` : "N/A"}
                            </td>

                            {/* Subtotal */}
                            <td
                              className="p-3 text-right font-bold"
                              style={{ color: C.coral }}
                            >
                              {price > 0
                                ? `₹${subtotal.toLocaleString("en-IN")}`
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <Package size={36} className="mx-auto mb-2 opacity-50" />
                  <p>Cart is currently empty.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className="pt-4 border-t flex items-center justify-between"
              style={{ borderColor: `${C.dark}15` }}
            >
              <div>
                <span className="text-xs text-slate-500 block">
                  Estimated Cart Value:
                </span>
                <strong
                  className="text-lg font-extrabold"
                  style={{ color: C.coral }}
                >
                  ₹{cartTotalValue.toLocaleString("en-IN")}
                </strong>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUserCart(null)}
                className="px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white shadow-sm cursor-pointer transition hover:opacity-90"
                style={{ backgroundColor: C.coral }}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}