import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaPhoneAlt,
  FaCreditCard,
} from "react-icons/fa";

import {
  MdLocationOn,
  MdEmail,
} from "react-icons/md";

import {
  IoTimeOutline,
} from "react-icons/io5";

import {
  CategoryService,
} from "../../services/categoryService";


const Footer = () => {

  /*
  |--------------------------------------------------------------------------
  | States
  |--------------------------------------------------------------------------
  */

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    isLoadingCategories,
    setIsLoadingCategories,
  ] = useState(true);


  /*
  |--------------------------------------------------------------------------
  | Fetch Categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const fetchCategories =
      async () => {

        try {

          setIsLoadingCategories(true);

          const response =
            await CategoryService.getAll();


          /*
          |--------------------------------------------------------------------------
          | Handle different API response structures
          |--------------------------------------------------------------------------
          |
          | Possible:
          |
          | response.data
          | response.data.data
          | response
          |
          */

          const categoryData =
            response?.data?.data ||
            response?.data ||
            response ||
            [];


          setCategories(
            Array.isArray(categoryData)
              ? categoryData
              : []
          );

        } catch (error) {

          console.error(
            "Footer categories fetch error:",
            error
          );

          setCategories([]);

        } finally {

          setIsLoadingCategories(false);

        }

      };


    fetchCategories();

  }, []);


  return (

    <footer
      className="
        bg-card
        border-t
        border-border
        pt-16
        pb-8
      "
    >

      {/* ================================================================
          MAIN FOOTER
      ================================================================= */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-12
          mb-12
        "
      >

        {/* ================================================================
            BRAND
        ================================================================= */}

        <div className="space-y-4">

          <Link
            to="/"
            className="
              flex
              items-center
              gap-2
              w-fit
            "
          >

            <div
              className="
                w-8
                h-8
                rounded-full
                bg-primary
                flex
                items-center
                justify-center
                text-primary-foreground
                font-heading
                font-bold
                text-base
              "
            >
              EE
            </div>


            <span
              className="
                font-heading
                text-lg
                font-bold
                tracking-wide
                text-foreground
              "
            >
              Earthen Echoes
            </span>

          </Link>


          <p
            className="
              text-xs
              text-muted-foreground
              leading-relaxed
            "
          >

            Sustaining India&apos;s ancient
            terracotta craft heritage with
            elegant, eco-friendly contemporary
            home decor designed for high-end
            living spaces.

          </p>


          {/* Social Icons */}

          <div
            className="
              flex
              items-center
              gap-3
              pt-2
            "
          >

            <a
              href="#"
              aria-label="Instagram"
              className="
                w-9
                h-9
                rounded-full
                border
                border-border
                flex
                items-center
                justify-center
                text-muted-foreground
                hover:text-primary
                hover:border-primary
                transition-all
              "
            >

              <FaInstagram
                size={17}
              />

            </a>


            <a
              href="#"
              aria-label="Facebook"
              className="
                w-9
                h-9
                rounded-full
                border
                border-border
                flex
                items-center
                justify-center
                text-muted-foreground
                hover:text-primary
                hover:border-primary
                transition-all
              "
            >

              <FaFacebookF
                size={15}
              />

            </a>


            <a
              href="#"
              aria-label="Pinterest"
              className="
                w-9
                h-9
                rounded-full
                border
                border-border
                flex
                items-center
                justify-center
                text-muted-foreground
                hover:text-primary
                hover:border-primary
                transition-all
              "
            >

              <FaPinterestP
                size={16}
              />

            </a>


            <Link
              to="/contact"
              aria-label="Contact"
              className="
                w-9
                h-9
                rounded-full
                border
                border-border
                flex
                items-center
                justify-center
                text-muted-foreground
                hover:text-primary
                hover:border-primary
                transition-all
              "
            >

              <FaPhoneAlt
                size={14}
              />

            </Link>

          </div>

        </div>


        {/* ================================================================
            QUICK LINKS
        ================================================================= */}

        <div>

          <h4
            className="
              font-heading
              font-bold
              text-sm
              text-foreground
              uppercase
              tracking-wider
              mb-4
            "
          >
            Quick Links
          </h4>


          <ul
            className="
              space-y-3
              text-xs
              text-muted-foreground
            "
          >

            <li>

              <Link
                to="/"
                className="
                  hover:text-primary
                  transition-colors
                "
              >
                Home Page
              </Link>

            </li>


            <li>

              <Link
                to="/products"
                className="
                  hover:text-primary
                  transition-colors
                "
              >
                Product Catalogue
              </Link>

            </li>


            <li>

              <Link
                to="/about"
                className="
                  hover:text-primary
                  transition-colors
                "
              >
                About Us
              </Link>

            </li>


            <li>

              <Link
                to="/contact"
                className="
                  hover:text-primary
                  transition-colors
                "
              >
                Contact Support
              </Link>

            </li>

          </ul>

        </div>


        {/* ================================================================
            DYNAMIC CATEGORIES FROM API
        ================================================================= */}

        <div>

          <h4
            className="
              font-heading
              font-bold
              text-sm
              text-foreground
              uppercase
              tracking-wider
              mb-4
            "
          >
            Our Categories
          </h4>


          {isLoadingCategories ? (

            /*
            |--------------------------------------------------------------------------
            | Loading Skeleton
            |--------------------------------------------------------------------------
            */

            <div className="space-y-3">

              {[1, 2, 3, 4, 5].map(
                (item) => (

                  <div
                    key={item}
                    className="
                      h-3
                      w-32
                      rounded
                      bg-muted
                      animate-pulse
                    "
                  />

                )
              )}

            </div>

          ) : categories.length === 0 ? (

            /*
            |--------------------------------------------------------------------------
            | Empty Categories
            |--------------------------------------------------------------------------
            */

            <p
              className="
                text-xs
                text-muted-foreground
              "
            >
              No categories available.
            </p>

          ) : (

            /*
            |--------------------------------------------------------------------------
            | API Categories
            |--------------------------------------------------------------------------
            */

            <ul
              className="
                space-y-3
                text-xs
                text-muted-foreground
              "
            >

              {categories.map(
                (category) => (

                  <li
                    key={category._id}
                  >

                    <Link

                      to={`/products?category=${encodeURIComponent(
                        category._id
                      )}`}

                      className="
                        hover:text-primary
                        transition-colors
                        inline-block
                      "
                    >

                      {category.name ||
                        category.title ||
                        "Category"}

                    </Link>

                  </li>

                )
              )}

            </ul>

          )}

        </div>


        {/* ================================================================
            CONTACT INFO
        ================================================================= */}

        <div>

          <h4
            className="
              font-heading
              font-bold
              text-sm
              text-foreground
              uppercase
              tracking-wider
              mb-4
            "
          >
            Get in Touch
          </h4>


          <div
            className="
              space-y-4
              text-xs
              text-muted-foreground
            "
          >

            {/* Address */}

            <div
              className="
                flex
                items-start
                gap-3
              "
            >

              <MdLocationOn
                size={19}
                className="
                  text-primary
                  shrink-0
                  mt-0.5
                "
              />


              <span
                className="
                  leading-relaxed
                "
              >

                A-457, Nemi Nagar Extension,
                Block A, Vaishali Nagar,
                Jaipur, Rajasthan 302021

              </span>

            </div>


            {/* Phone */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <FaPhoneAlt
                size={14}
                className="
                  text-primary
                  shrink-0
                "
              />

              <span>
                +91-98765-43210
              </span>

            </div>


            {/* Email */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <MdEmail
                size={18}
                className="
                  text-primary
                  shrink-0
                "
              />

              <span>
                info@earthenechoes.com
              </span>

            </div>


            {/* Working Hours */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <IoTimeOutline
                size={19}
                className="
                  text-primary
                  shrink-0
                "
              />

              <span>
                Mon - Sat:
                9:00 AM - 6:00 PM IST
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ================================================================
          BOTTOM FOOTER
      ================================================================= */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          border-t
          border-border/60
          pt-8
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-4
            text-xs
            text-muted-foreground
          "
        >

          <p
            className="
              text-center
              sm:text-left
            "
          >

            © 2026 Earthen Echoes.
            Made with love in Jaipur.
            All rights reserved.

          </p>


          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <FaCreditCard
              size={22}
              className="
                text-muted-foreground/60
              "
              title="Visa / Mastercard"
            />


            <span
              className="
                font-semibold
                text-[10px]
                tracking-wider
                uppercase
                text-muted-foreground/50
              "
            >

              Secure UPI &amp;
              Netbanking

            </span>

          </div>

        </div>

      </div>

    </footer>

  );

};

export default Footer;