import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

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

import {
  fetchCart,
} from "../../redux/thunks/cartThunk";

import {
  getWishlist,
} from "../../redux/thunks/wishlistThunk";

import {
  clearCart,
  selectCartCount,
} from "../../redux/slices/cartSlice";

import {
  logoutUser,
  selectUser,
  selectUserAuthenticated,
} from "../../redux/slices/userAuthSlice";

import {
  selectWishlistItems,
} from "../../redux/slices/wishlistSlice";


/*
|--------------------------------------------------------------------------
| Navigation Links
|--------------------------------------------------------------------------
*/

const navLinks = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Catalogue",
    path: "/products",
  },
  {
    name: "About Us",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];


export default function Header() {

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const profileRef =
    useRef(null);


  /*
  |--------------------------------------------------------------------------
  | Local State
  |--------------------------------------------------------------------------
  */

  const [
    mobileMenu,
    setMobileMenu,
  ] = useState(false);

  const [
    profileMenu,
    setProfileMenu,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | User Authentication
  |--------------------------------------------------------------------------
  */

  const user =
    useSelector(
      selectUser
    );

  const isAuthenticated =
    useSelector(
      selectUserAuthenticated
    );

  const cartCount =
    useSelector(
      selectCartCount
    );

  const wishlistItems =
    useSelector(
      selectWishlistItems
    );

  const wishlistCount =
    wishlistItems?.length || 0;


  /*
  |--------------------------------------------------------------------------
  | Cart
  |--------------------------------------------------------------------------
  */



  /*
  |--------------------------------------------------------------------------
  | User Initial
  |--------------------------------------------------------------------------
  */

  const userInitial =
    user?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() ||

    user?.email
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() ||

    "U";


  /*
  |--------------------------------------------------------------------------
  | User Avatar
  |--------------------------------------------------------------------------
  |
  | Supports:
  |
  | avatar
  | picture
  | profileImage
  |
  */

  const userAvatar =
    user?.avatar ||
    user?.picture ||
    user?.profileImage ||
    "";


  useEffect(() => {

    if (
      isAuthenticated
    ) {

      dispatch(fetchCart());

      dispatch(getWishlist());

    }

  }, [
    dispatch,
    isAuthenticated,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Close Menus On Route Change
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    setMobileMenu(
      false
    );

    setProfileMenu(
      false
    );

  }, [
    location.pathname,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Stop Body Scroll When Mobile Drawer Open
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (
      mobileMenu
    ) {

      document.body.style.overflow =
        "hidden";

    } else {

      document.body.style.overflow =
        "";

    }


    return () => {

      document.body.style.overflow =
        "";

    };

  }, [
    mobileMenu,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Escape Key
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const handleEscape =
      (
        event
      ) => {

        if (
          event.key ===
          "Escape"
        ) {

          setMobileMenu(
            false
          );

          setProfileMenu(
            false
          );

        }

      };


    document.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Close Profile Dropdown On Outside Click
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const handleOutsideClick =
      (
        event
      ) => {

        if (
          profileRef.current &&
          !profileRef.current.contains(
            event.target
          )
        ) {

          setProfileMenu(
            false
          );

        }

      };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Logout User
  |--------------------------------------------------------------------------
  */

  const handleLogout =
    () => {

      dispatch(
        logoutUser()
      );

      dispatch(
        clearCart()
      );


      setProfileMenu(
        false
      );

      setMobileMenu(
        false
      );


      /*
      |--------------------------------------------------------------------------
      | Notify Other Components
      |--------------------------------------------------------------------------
      */

      window.dispatchEvent(

        new Event(
          "userAuthChanged"
        )

      );


      toast.success(
        "Logged out successfully."
      );


      navigate(
        "/",
        {
          replace: true,
        }
      );

    };


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <>

      {/* ================================================================
          HEADER
      ================================================================= */}

      <header
        className="
          sticky
          top-0
          z-50

          border-b
          border-border/60

          bg-background/95
          backdrop-blur-md

          shadow-sm
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto

            h-20

            px-4
            sm:px-6
            lg:px-8

            flex
            items-center
            justify-between
          "
        >

          {/* ============================================================
              LOGO
          ============================================================ */}

          <Link
            to="/"

            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
    w-96
    h-12

  "
            >
              <img
                src="/Earthen echos logo.png"
                alt="Earthen Echoes Logo"
                className="w-fit  h-full object-cover"
              />
            </div>

          </Link>


          {/* ============================================================
              DESKTOP NAVIGATION
          ============================================================ */}

          <nav
            className="
              hidden

              md:flex
              items-center

              gap-8
            "
          >

            {
              navLinks.map(
                (
                  item
                ) => (

                  <NavLink
                    key={
                      item.path
                    }

                    to={
                      item.path
                    }

                    className={({
                      isActive,
                    }) =>

                      `
                        pb-1

                        transition-colors
                        duration-200

                        ${isActive

                        ? `
                                text-primary

                                border-b-2
                                border-primary
                              `

                        : `
                                text-foreground/80

                                hover:text-primary
                              `
                      }
                      `

                    }
                  >

                    {
                      item.name
                    }

                  </NavLink>

                )
              )
            }

          </nav>


          {/* ============================================================
              RIGHT ACTIONS
          ============================================================ */}

          <div
            className="
              flex
              items-center
              justify-end

              gap-3
              sm:gap-4
            "
          >

            {/* ========================================================
                WISHLIST
            ======================================================== */}

            <Link
              to={
                isAuthenticated
                  ? "/user/wishlist"
                  : "/user/login"
              }
              className="
    relative
    text-foreground/80
    hover:text-primary
  "
            >

              <Heart size={22} />

              {
                wishlistCount > 0 && (
                  <span
                    className="
          absolute
          -top-2
          -right-2
          min-w-4
          h-4
          px-1
          rounded-full
          bg-red-500
          text-white
          text-[10px]
          flex
          items-center
          justify-center
        "
                  >
                    {
                      wishlistCount > 99
                        ? "99+"
                        : wishlistCount
                    }
                  </span>
                )
              }

            </Link>


            {/* ========================================================
                CART
            ======================================================== */}

            <Link
              to="/cart"

              aria-label="Shopping Cart"

              className="
                relative

                text-foreground/80

                transition-colors

                hover:text-primary
              "
            >

              <ShoppingCart
                size={22}
              />


              {
                cartCount > 0 && (

                  <span
                    className="
                      absolute

                      -top-2
                      -right-2

                      min-w-4
                      h-4

                      px-1

                      rounded-full

                      bg-primary

                      text-white
                      text-[10px]

                      flex
                      items-center
                      justify-center
                    "
                  >

                    {
                      cartCount > 99
                        ? "99+"
                        : cartCount
                    }

                  </span>

                )
              }

            </Link>


            {/* ========================================================
                USER AUTH / PROFILE
            ======================================================== */}

            <div
              ref={
                profileRef
              }

              className="
                relative
              "
            >

              {
                isAuthenticated &&
                  user

                  ? (

                    <>

                      {/* ==================================================
                          LOGGED-IN PROFILE BUTTON
                      ================================================== */}

                      <button
                        type="button"

                        onClick={() =>
                          setProfileMenu(
                            (
                              previous
                            ) =>
                              !previous
                          )
                        }

                        aria-label="Open profile menu"

                        aria-expanded={
                          profileMenu
                        }

                        className="
                          flex
                          items-center

                          gap-2

                          rounded-full

                          transition-all
                          duration-200

                          hover:bg-secondary/50

                          sm:pr-2
                        "
                      >

                        {/* Avatar */}

                        <div
                          className="
                            flex

                            h-10
                            w-10

                            shrink-0

                            items-center
                            justify-center

                            overflow-hidden

                            rounded-full

                            border-2
                            border-primary/20

                            bg-primary

                            text-sm
                            font-bold

                            text-primary-foreground

                            shadow-sm

                            transition-all

                            hover:border-primary/50
                          "
                        >

                          {
                            userAvatar

                              ? (

                                <img
                                  src={userAvatar}
                                  alt={user?.name || "User"}
                                  className="h-full w-full object-cover"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    console.log("Avatar failed:", userAvatar);
                                    e.target.style.display = "none";
                                  }}
                                />

                              )

                              : (

                                <span>

                                  {
                                    userInitial
                                  }

                                </span>

                              )
                          }

                        </div>


                        {/* Desktop Name */}

                        <div
                          className="
                            hidden

                            text-left

                            lg:block
                          "
                        >

                          <p
                            className="
                              max-w-[110px]

                              truncate

                              text-xs
                              font-semibold

                              text-foreground
                            "
                          >

                            {
                              user?.name ||
                              "My Account"
                            }

                          </p>


                          <p
                            className="
                              text-[10px]

                              text-muted-foreground
                            "
                          >

                            My Account

                          </p>

                        </div>


                        <ChevronDown
                          size={15}

                          className={`
                            hidden

                            text-muted-foreground

                            transition-transform
                            duration-200

                            lg:block

                            ${profileMenu
                              ? "rotate-180"
                              : ""
                            }
                          `}
                        />

                      </button>


                      {/* ==================================================
                          PROFILE DROPDOWN
                      ================================================== */}

                      {
                        profileMenu && (

                          <div
                            className="
                              absolute

                              right-0
                              top-[calc(100%+12px)]

                              z-[100]

                              w-[280px]
                              max-w-[calc(100vw-24px)]

                              overflow-hidden

                              rounded-2xl

                              border
                              border-border

                              bg-card

                              shadow-2xl
                              shadow-black/10
                            "
                          >

                            {/* ============================================
                                USER DETAILS
                            ============================================ */}

                            <div
                              className="
                                border-b
                                border-border

                                bg-secondary/30

                                px-4
                                py-4
                              "
                            >

                              <div
                                className="
                                  flex
                                  items-center

                                  gap-3
                                "
                              >

                                <div
                                  className="
                                    flex

                                    h-12
                                    w-12

                                    shrink-0

                                    items-center
                                    justify-center

                                    overflow-hidden

                                    rounded-full

                                    bg-primary

                                    font-bold

                                    text-primary-foreground
                                  "
                                >

                                  {
                                    userAvatar

                                      ? (

                                        <img
                                          src={
                                            userAvatar
                                          }

                                          alt={
                                            user?.name ||
                                            "User"
                                          }

                                          className="
                                            h-full
                                            w-full

                                            object-cover
                                          "
                                        />

                                      )

                                      : (

                                        <span>

                                          {
                                            userInitial
                                          }

                                        </span>

                                      )
                                  }

                                </div>


                                <div
                                  className="
                                    min-w-0
                                    flex-1
                                  "
                                >

                                  <p
                                    className="
                                      truncate

                                      text-sm
                                      font-semibold

                                      text-foreground
                                    "
                                  >

                                    {
                                      user?.name ||
                                      "User"
                                    }

                                  </p>


                                  <p
                                    className="
                                      mt-0.5

                                      truncate

                                      text-xs

                                      text-muted-foreground
                                    "
                                  >

                                    {
                                      user?.email ||
                                      ""
                                    }

                                  </p>

                                </div>

                              </div>

                            </div>


                            {/* ============================================
                                MENU LINKS
                            ============================================ */}

                            <div
                              className="
                                p-2
                              "
                            >

                              {/* Profile */}

                              <Link
                                to="/user/profile"

                                onClick={() =>
                                  setProfileMenu(
                                    false
                                  )
                                }

                                className="
                                  flex
                                  items-center

                                  gap-3

                                  rounded-xl

                                  px-3
                                  py-2.5

                                  text-sm
                                  font-medium

                                  text-foreground

                                  transition-all

                                  hover:bg-secondary
                                  hover:text-primary
                                "
                              >

                                <UserCircle
                                  size={18}
                                />

                                <span>
                                  My Profile
                                </span>

                              </Link>


                              {/* Orders */}

                              <Link
                                to="/user/orders"

                                onClick={() =>
                                  setProfileMenu(
                                    false
                                  )
                                }

                                className="
                                  flex
                                  items-center

                                  gap-3

                                  rounded-xl

                                  px-3
                                  py-2.5

                                  text-sm
                                  font-medium

                                  text-foreground

                                  transition-all

                                  hover:bg-secondary
                                  hover:text-primary
                                "
                              >

                                <Package
                                  size={18}
                                />

                                <span>
                                  My Orders
                                </span>

                              </Link>


                              {/* Wishlist */}

                              <Link
                                to="/user/wishlist"

                                onClick={() =>
                                  setProfileMenu(
                                    false
                                  )
                                }

                                className="
                                  flex
                                  items-center

                                  gap-3

                                  rounded-xl

                                  px-3
                                  py-2.5

                                  text-sm
                                  font-medium

                                  text-foreground

                                  transition-all

                                  hover:bg-secondary
                                  hover:text-primary
                                "
                              >

                                <Heart
                                  size={18}
                                />

                                <span>
                                  My Wishlist
                                </span>

                              </Link>

                            </div>


                            {/* ============================================
                                LOGOUT
                            ============================================ */}

                            <div
                              className="
                                border-t
                                border-border

                                p-2
                              "
                            >

                              <button
                                type="button"

                                onClick={
                                  handleLogout
                                }

                                className="
                                  flex
                                  w-full
                                  items-center

                                  gap-3

                                  rounded-xl

                                  px-3
                                  py-2.5

                                  text-sm
                                  font-medium

                                  text-destructive

                                  transition-all

                                  hover:bg-destructive/10
                                  cursor-pointer
                                "
                              >

                                <LogOut
                                  size={18}
                                />

                                <span>
                                  Logout
                                </span>

                              </button>

                            </div>

                          </div>

                        )
                      }

                    </>

                  )

                  : (

                    /* ====================================================
                        NOT LOGGED-IN USER
                    ==================================================== */

                    <Link
                      to="/user/login"

                      title="Login"

                      aria-label="User Login"

                      className="
                        flex

                        h-10
                        w-10

                        items-center
                        justify-center

                        rounded-full

                        text-foreground/80

                        transition-all
                        duration-200

                        hover:bg-secondary
                        hover:text-primary
                      "
                    >

                      <User
                        size={22}
                      />

                    </Link>

                  )
              }

            </div>


            {/* ========================================================
                MOBILE HAMBURGER
            ======================================================== */}

            <button
              type="button"

              aria-label="Open Menu"

              onClick={() =>
                setMobileMenu(
                  true
                )
              }

              className="
                md:hidden

                flex
                items-center
                justify-center

                text-foreground
              "
            >

              <Menu
                size={26}
              />

            </button>

          </div>

        </div>

      </header>


      {/* ================================================================
          MOBILE OVERLAY
      ================================================================= */}

      <div

        onClick={() =>
          setMobileMenu(
            false
          )
        }

        className={`
          fixed
          inset-0

          z-[999]

          bg-black/40

          transition-opacity
          duration-300

          md:hidden

          ${mobileMenu

            ? `
                  opacity-100
                  visible
                `

            : `
                  opacity-0
                  invisible
                  pointer-events-none
                `
          }
        `}

      />


      {/* ================================================================
          MOBILE DRAWER
      ================================================================= */}

      <aside
        className={`
          fixed

          top-0
          right-0

          z-[1000]

          w-72
          max-w-[85%]

          h-dvh

          bg-background

          border-l
          border-border

          shadow-xl

          transform

          transition-transform
          duration-300
          ease-in-out

          md:hidden

          ${mobileMenu
            ? "translate-x-0"
            : "translate-x-full"
          }
        `}
      >

        {/* ============================================================
            DRAWER HEADER
        ============================================================ */}

        <div
          className="
            h-20

            px-5

            flex
            items-center
            justify-between

            border-b
            border-border
          "
        >

          {/* Logo */}

          <Link
            to="/"

            onClick={() =>
              setMobileMenu(
                false
              )
            }

            className="
              flex
              items-center

              gap-2
            "
          >

            <div
              className="
                w-9
                h-9

                rounded-full

                bg-primary

                text-primary-foreground

                flex
                items-center
                justify-center

                font-bold
                text-sm
              "
            >

              EE

            </div>


            <span
              className="
                font-heading
                font-semibold

                text-base
                text-foreground
              "
            >

              Earthen Echoes

            </span>

          </Link>


          {/* Close */}

          <button
            type="button"

            aria-label="Close Menu"

            onClick={() =>
              setMobileMenu(
                false
              )
            }

            className="
              flex
              items-center
              justify-center

              text-foreground

              transition-colors

              hover:text-primary
            "
          >

            <X
              size={24}
            />

          </button>

        </div>


        {/* ============================================================
            LOGGED-IN USER MOBILE CARD
        ============================================================ */}

        {
          isAuthenticated &&
          user && (

            <div
              className="
                border-b
                border-border

                bg-secondary/30

                px-5
                py-4
              "
            >

              <div
                className="
                  flex
                  items-center

                  gap-3
                "
              >

                <div
                  className="
                    flex

                    h-11
                    w-11

                    shrink-0

                    items-center
                    justify-center

                    overflow-hidden

                    rounded-full

                    bg-primary

                    font-bold

                    text-primary-foreground
                  "
                >

                  {
                    userAvatar

                      ? (

                        <img
                          src={
                            userAvatar
                          }

                          alt={
                            user?.name ||
                            "User"
                          }

                          className="
                            h-full
                            w-full

                            object-cover
                          "
                        />

                      )

                      : (

                        userInitial

                      )
                  }

                </div>


                <div
                  className="
                    min-w-0
                  "
                >

                  <p
                    className="
                      truncate

                      text-sm
                      font-semibold

                      text-foreground
                    "
                  >

                    {
                      user?.name ||
                      "User"
                    }

                  </p>


                  <p
                    className="
                      truncate

                      text-xs

                      text-muted-foreground
                    "
                  >

                    {
                      user?.email ||
                      ""
                    }

                  </p>

                </div>

              </div>

            </div>

          )
        }


        {/* ============================================================
            MOBILE NAVIGATION
        ============================================================ */}

        <nav
          className="
            px-5
            py-4
          "
        >

          {
            navLinks.map(
              (
                item
              ) => (

                <NavLink
                  key={
                    item.path
                  }

                  to={
                    item.path
                  }

                  onClick={() =>
                    setMobileMenu(
                      false
                    )
                  }

                  className={({
                    isActive,
                  }) =>

                    `
                      block

                      py-4

                      border-b
                      border-border/60

                      text-sm
                      font-medium

                      transition-colors
                      duration-200

                      ${isActive

                      ? `
                              text-primary
                            `

                      : `
                              text-foreground

                              hover:text-primary
                            `
                    }
                    `

                  }
                >

                  {
                    item.name
                  }

                </NavLink>

              )
            )
          }


          {/* ============================================================
              USER MOBILE LINKS
          ============================================================ */}

          {
            isAuthenticated &&
              user

              ? (

                <div
                  className="
                    mt-3
                  "
                >

                  <Link
                    to="/user/profile"

                    onClick={() =>
                      setMobileMenu(
                        false
                      )
                    }

                    className="
                      flex
                      items-center

                      gap-3

                      py-3

                      text-sm
                      font-medium

                      text-foreground

                      transition

                      hover:text-primary
                    "
                  >

                    <UserCircle
                      size={18}
                    />

                    My Profile

                  </Link>


                  <Link
                    to="/user/orders"

                    onClick={() =>
                      setMobileMenu(
                        false
                      )
                    }

                    className="
                      flex
                      items-center

                      gap-3

                      py-3

                      text-sm
                      font-medium

                      text-foreground

                      transition

                      hover:text-primary
                    "
                  >

                    <Package
                      size={18}
                    />

                    My Orders

                  </Link>


                  <Link
                    to="/user/wishlist"

                    onClick={() =>
                      setMobileMenu(
                        false
                      )
                    }

                    className="
                      flex
                      items-center

                      gap-3

                      py-3

                      text-sm
                      font-medium

                      text-foreground

                      transition

                      hover:text-primary
                    "
                  >

                    <Heart
                      size={18}
                    />

                    My Wishlist

                  </Link>


                  <button
                    type="button"

                    onClick={
                      handleLogout
                    }

                    className="
                      flex
                      w-full
                      items-center

                      gap-3

                      py-3

                      text-sm
                      font-medium

                      text-destructive

                      transition
                    "
                  >

                    <LogOut
                      size={18}
                    />

                    Logout

                  </button>

                </div>

              )

              : (

                <Link
                  to="/user/login"

                  onClick={() =>
                    setMobileMenu(
                      false
                    )
                  }

                  className="
                    mt-5

                    flex
                    w-full
                    items-center
                    justify-center

                    gap-2

                    rounded-xl

                    bg-primary

                    px-4
                    py-3

                    text-sm
                    font-semibold

                    text-primary-foreground

                    transition

                    hover:opacity-90
                  "
                >

                  <User
                    size={18}
                  />

                  Login / Register

                </Link>

              )
          }

        </nav>

      </aside>

    </>

  );

}