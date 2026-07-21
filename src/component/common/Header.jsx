import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  Menu,
  X,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";

import {
  useCart,
} from "../core/context/CartContext";


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
  | State
  |--------------------------------------------------------------------------
  */

  const [
    mobileMenu,
    setMobileMenu,
  ] = useState(false);


  const location =
    useLocation();


  /*
  |--------------------------------------------------------------------------
  | Cart
  |--------------------------------------------------------------------------
  */

  const {
    cartItems,
  } = useCart();


  const cartCount =
    cartItems?.reduce(
      (total, item) =>
        total +
        (item.quantity || 1),
      0
    ) || 0;


  /*
  |--------------------------------------------------------------------------
  | Close Mobile Menu On Route Change
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    setMobileMenu(false);

  }, [location.pathname]);


  /*
  |--------------------------------------------------------------------------
  | Stop Body Scroll When Drawer Open
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (mobileMenu) {

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

  }, [mobileMenu]);


  /*
  |--------------------------------------------------------------------------
  | Close Drawer With Escape Key
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const handleEscape =
      (event) => {

        if (
          event.key === "Escape"
        ) {

          setMobileMenu(false);

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
          bg-background/95
          backdrop-blur-md
          border-b
          border-border/60
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

          {/* ================= LOGO ================= */}

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
                w-10
                h-10
                rounded-full
                bg-primary
                flex
                items-center
                justify-center
                text-primary-foreground
                font-bold
              "
            >
              EE
            </div>

          </Link>


          {/* ================= DESKTOP NAVIGATION ================= */}

          <nav
            className="
              hidden
              md:flex
              items-center
              gap-8
            "
          >

            {navLinks.map(
              (item) => (

                <NavLink
                  key={item.path}
                  to={item.path}

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

                  {item.name}

                </NavLink>

              )
            )}

          </nav>


          {/* ================= RIGHT ACTIONS ================= */}

          <div
            className="
              flex
              items-center
              justify-end
              gap-4
            "
          >

            {/* Wishlist */}

            <button
              type="button"
              aria-label="Wishlist"
              className="
                relative
                text-foreground/80
                hover:text-primary
                transition-colors
              "
            >

              <Heart size={22} />


              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  w-4
                  h-4
                  rounded-full
                  bg-primary
                  text-white
                  text-[10px]
                  flex
                  items-center
                  justify-center
                "
              >
                2
              </span>

            </button>


            {/* Cart */}

            <Link
              to="/cart"
              aria-label="Shopping Cart"

              className="
                relative
                text-foreground/80
                hover:text-primary
                transition-colors
              "
            >

              <ShoppingCart
                size={22}
              />


              {cartCount > 0 && (

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

                  {cartCount}

                </span>

              )}

            </Link>


            {/* Admin Login */}

            <Link
              to="/admin/login"
              title="Admin Portal Login"

              className="
                text-foreground/80
                hover:text-primary
                transition-colors
                duration-200
              "
            >

              <User size={22} />

            </Link>


            {/* Mobile Hamburger */}

            <button
              type="button"
              aria-label="Open Menu"

              onClick={() =>
                setMobileMenu(true)
              }

              className="
                md:hidden
                flex
                items-center
                justify-center
                text-foreground
              "
            >

              <Menu size={26} />

            </button>

          </div>

        </div>

      </header>


      {/* ================================================================
          MOBILE OVERLAY
      ================================================================= */}

      <div

        onClick={() =>
          setMobileMenu(false)
        }

        className={`
          fixed
          inset-0
          z-999

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
          SIMPLE MOBILE DRAWER
      ================================================================= */}

      <aside
        className={`
          fixed
          top-0
          right-0

          z-1000

          w-70
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

        {/* ================= DRAWER HEADER ================= */}

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
              setMobileMenu(false)
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


          {/* Close Button */}

          <button
            type="button"
            aria-label="Close Menu"

            onClick={() =>
              setMobileMenu(false)
            }

            className="
              flex
              items-center
              justify-center

              text-foreground

              hover:text-primary

              transition-colors
            "
          >

            <X size={24} />

          </button>

        </div>


        {/* ================= MOBILE NAVIGATION ================= */}

        <nav
          className="
            px-5
            py-4
          "
        >

          {navLinks.map(
            (item) => (

              <NavLink
                key={item.path}

                to={item.path}

                onClick={() =>
                  setMobileMenu(false)
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

                {item.name}

              </NavLink>

            )
          )}

        </nav>

      </aside>

    </>

  );

}