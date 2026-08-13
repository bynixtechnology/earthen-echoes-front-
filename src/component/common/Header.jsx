import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  X,
  Heart,
  ShoppingCart,
  User,
  UserCircle,
  Package,
  LogOut,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

import { fetchCart, prepareCartForLogoutThunk } from "../../redux/thunks/cartThunk";
import { getWishlist, prepareWishlistForLogoutThunk } from "../../redux/thunks/wishlistThunk";
import { selectCartItems } from "../../redux/slices/cartSlice";
import {
  logoutUser,
  selectUser,
  selectUserAuthenticated,
} from "../../redux/slices/userAuthSlice";
import { selectWishlistItems } from "../../redux/slices/wishlistSlice";

/*
|--------------------------------------------------------------------------
| Navigation Links
|--------------------------------------------------------------------------
*/
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Catalogue", path: "/products" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Header() {
  /*
  |--------------------------------------------------------------------------
  | Hooks & State
  |--------------------------------------------------------------------------
  */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Redux Selectors
  |--------------------------------------------------------------------------
  */
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectUserAuthenticated);
  const cartItems = useSelector(selectCartItems) || [];
  const reduxWishlistItems = useSelector(selectWishlistItems) || [];
  const wishlistCount = reduxWishlistItems.length;

  /*
  |--------------------------------------------------------------------------
  | User Avatar & Initials Logic
  |--------------------------------------------------------------------------
  */
  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() ||
    user?.email?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  const userAvatar =
    user?.avatar || user?.picture || user?.profileImage || "";

  /*
  |--------------------------------------------------------------------------
  | CART + WISHLIST SYNC
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    dispatch(fetchCart());
    dispatch(getWishlist());
  }, [dispatch, isAuthenticated, location.pathname]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      dispatch(fetchCart());
      dispatch(getWishlist());
    };

    window.addEventListener("guestStorageUpdated", handleStorageUpdate);
    window.addEventListener("cartUpdated", handleStorageUpdate);
    window.addEventListener("wishlistUpdated", handleStorageUpdate);

    return () => {
      window.removeEventListener("guestStorageUpdated", handleStorageUpdate);
      window.removeEventListener("cartUpdated", handleStorageUpdate);
      window.removeEventListener("wishlistUpdated", handleStorageUpdate);
    };
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | CART COUNT
  |--------------------------------------------------------------------------
  */
  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item?.quantity) || 1),
    0
  );

  // Close menus on route change
  useEffect(() => {
    setMobileMenu(false);
    setProfileMenu(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Handlers - PRESERVE CART & WISHLIST ON LOGOUT
  |--------------------------------------------------------------------------
  */
  const handleLogout = async () => {
    try {
      // 🟢 1. Save user cart & wishlist to Guest session cookies before logging out
      try {
        await Promise.all([
          dispatch(prepareCartForLogoutThunk()).unwrap(),
          dispatch(prepareWishlistForLogoutThunk()).unwrap(),
        ]);
      } catch (prepareErr) {
        console.warn("Prepare logout session warning:", prepareErr);
      }

      // 🟢 2. Clear Redux user auth state
      dispatch(logoutUser());
      setProfileMenu(false);
      setMobileMenu(false);

      window.dispatchEvent(new Event("userAuthChanged"));

      // 🟢 3. Re-fetch Guest Cart & Wishlist via Cookies
      await Promise.all([
        dispatch(fetchCart()),
        dispatch(getWishlist()),
      ]);

      toast.success("Logged out successfully.");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      toast.error("Logout failed.");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | JSX Component Render
  |--------------------------------------------------------------------------
  */
  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center shrink-0">
            <div className="w-36 sm:w-48 md:w-60 h-auto flex items-center">
              <img
                src="/Earthen echos logo.png"
                alt="Earthen Echoes Logo"
                className="w-full h-auto object-contain max-h-12"
              />
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `pb-1 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-primary border-b-2 border-primary"
                      : "text-foreground/80 hover:text-primary"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center justify-end gap-3 sm:gap-4">
            
            {/* WISHLIST */}
            <Link
              to="/user/wishlist"
              aria-label="Wishlist"
              className="relative p-1 text-foreground/80 hover:text-primary transition-colors"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* CART */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative p-1 text-foreground/80 hover:text-primary transition-colors"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* USER PROFILE DROPDOWN / LOGIN */}
            <div ref={profileRef} className="relative">
              {isAuthenticated && user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setProfileMenu((prev) => !prev)}
                    aria-label="Open profile menu"
                    aria-expanded={profileMenu}
                    className="flex items-center gap-2 rounded-full transition-all duration-200 hover:bg-secondary/50 sm:pr-2 focus:outline-none"
                  >
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-primary text-sm font-bold text-primary-foreground shadow-sm hover:border-primary/50 transition-all">
                      {userAvatar && !avatarError ? (
                        <img
                          src={userAvatar}
                          alt={user?.name || "User"}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        <span>{userInitial}</span>
                      )}
                    </div>

                    <div className="hidden lg:block text-left">
                      <p className="max-w-[110px] truncate text-xs font-semibold text-foreground">
                        {user?.name || "My Account"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        My Account
                      </p>
                    </div>

                    <ChevronDown
                      size={15}
                      className={`hidden lg:block text-muted-foreground transition-transform duration-200 ${
                        profileMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* PROFILE MENU DROPDOWN */}
                  {profileMenu && (
                    <div className="absolute right-0 top-[calc(100%+12px)] z-[100] w-[280px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10">
                      <div className="border-b border-border bg-secondary/30 px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-bold text-primary-foreground">
                            {userAvatar && !avatarError ? (
                              <img
                                src={userAvatar}
                                alt={user?.name || "User"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span>{userInitial}</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {user?.name || "User"}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {user?.email || ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 space-y-0.5">
                        <Link
                          to="/user/profile"
                          onClick={() => setProfileMenu(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary hover:text-primary"
                        >
                          <UserCircle size={18} />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/user/orders"
                          onClick={() => setProfileMenu(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary hover:text-primary"
                        >
                          <Package size={18} />
                          <span>My Orders</span>
                        </Link>

                        <Link
                          to="/user/wishlist"
                          onClick={() => setProfileMenu(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary hover:text-primary"
                        >
                          <Heart size={18} />
                          <span>My Wishlist</span>
                        </Link>
                      </div>

                      <div className="border-t border-border p-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-all hover:bg-destructive/10 cursor-pointer"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/user/login"
                  title="Login"
                  aria-label="User Login"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-all duration-200 hover:bg-secondary hover:text-primary"
                >
                  <User size={22} />
                </Link>
              )}
            </div>

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              type="button"
              aria-label="Open Menu"
              onClick={() => setMobileMenu(true)}
              className="md:hidden flex items-center justify-center p-1 text-foreground hover:text-primary transition-colors"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div
        onClick={() => setMobileMenu(false)}
        className={`fixed inset-0 z-[999] bg-black/40 transition-opacity duration-300 md:hidden ${
          mobileMenu
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      />

      {/* MOBILE DRAWER */}
      <aside
        className={`fixed top-0 right-0 z-[1000] w-72 max-w-[85%] h-dvh bg-background border-l border-border shadow-xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          mobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* DRAWER HEADER */}
        <div className="h-16 sm:h-20 px-5 flex items-center justify-between border-b border-border shrink-0">
          <Link
            to="/"
            onClick={() => setMobileMenu(false)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
              EE
            </div>
            <span className="font-heading font-semibold text-base text-foreground">
              Earthen Echoes
            </span>
          </Link>

          <button
            type="button"
            aria-label="Close Menu"
            onClick={() => setMobileMenu(false)}
            className="flex items-center justify-center text-foreground hover:text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* LOGGED-IN USER CARD IN MOBILE DRAWER */}
        {isAuthenticated && user && (
          <div className="border-b border-border bg-secondary/30 px-5 py-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-bold text-primary-foreground">
                {userAvatar && !avatarError ? (
                  <img
                    src={userAvatar}
                    alt={user?.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userInitial
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE NAVIGATION LINKS */}
        <nav className="px-5 py-4 overflow-y-auto flex-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenu(false)}
              className={({ isActive }) =>
                `block py-3.5 border-b border-border/60 text-sm font-medium transition-colors ${
                  isActive ? "text-primary font-semibold" : "text-foreground hover:text-primary"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* USER PROFILE LINKS FOR MOBILE */}
          {isAuthenticated && user ? (
            <div className="mt-4 pt-2 border-t border-border/60 space-y-1">
              <Link
                to="/user/profile"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <UserCircle size={18} />
                <span>My Profile</span>
              </Link>

              <Link
                to="/user/orders"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <Package size={18} />
                <span>My Orders</span>
              </Link>

              <Link
                to="/user/wishlist"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <Heart size={18} />
                <span>My Wishlist</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 py-2.5 text-sm font-medium text-destructive transition-colors mt-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/user/login"
              onClick={() => setMobileMenu(false)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <User size={18} />
              <span>Login / Register</span>
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
}