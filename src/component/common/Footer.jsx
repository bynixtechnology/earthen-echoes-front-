import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaPhoneAlt,
  FaCreditCard,
} from "react-icons/fa";
import { MdLocationOn, MdEmail } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { CategoryService } from "../../services/categoryService";

const Footer = () => {
  /*
  |--------------------------------------------------------------------------
  | States
  |--------------------------------------------------------------------------
  */
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Fetch Categories
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await CategoryService.getAll();

        const categoryData =
          response?.data?.data || response?.data || response || [];

        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (error) {
        console.error("Footer categories fetch error:", error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      {/* ================================================================
          MAIN FOOTER
      ================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        {/* ================================================================
            1. BRAND
        ================================================================= */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <img
              src="/Earthen echos logo.png"
              alt="Earthen Echoes Logo"
              className="h-10 w-auto object-contain shrink-0"
            />
          </Link>

          <p
            className={`text-xs text-muted-foreground leading-relaxed ${
              isMobile ? "text-center sm:text-left" : ""
            }`}
          >
            Sustaining India&apos;s ancient terracotta craft heritage with
            elegant, eco-friendly contemporary home decor designed for high-end
            living spaces.
          </p>

          {/* Social Icons */}
          <div
            className={`flex items-center gap-3 pt-2 ${
              isMobile ? "justify-center sm:justify-start" : ""
            }`}
          >
            <a
              href="https://www.instagram.com/earthen.echoes.jaipur/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
            >
              <FaInstagram size={17} />
            </a>

            <a
              href="https://www.facebook.com/Earthen.Echoes.Jaipur/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
            >
              <FaFacebookF size={15} />
            </a>

            <a
              href="https://wa.me/919772790222"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
            >
              <FaWhatsapp size={17} />
            </a>

            <a
              href="tel:+919772790222"
              aria-label="Call Us"
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
            >
              <FaPhoneAlt size={14} />
            </a>
          </div>
        </div>

        {/* ================================================================
            2. QUICK LINKS
        ================================================================= */}
        <div className={isMobile ? "text-center sm:text-left" : ""}>
          <h4 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider mb-4">
            Quick Links
          </h4>

          <ul className="space-y-3 text-xs text-muted-foreground">
            <li>
              <Link
                to="/"
                className="hover:text-primary transition-colors inline-block"
              >
                Home Page
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-primary transition-colors inline-block"
              >
                Product Catalogue
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-primary transition-colors inline-block"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-primary transition-colors inline-block"
              >
                Contact Support
              </Link>
            </li>
          </ul>
        </div>

        {/* ================================================================
            3. CUSTOMER POLICIES (Payment Gateway Required)
        ================================================================= */}
        <div className={isMobile ? "text-center sm:text-left" : ""}>
          <h4 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider mb-4">
            Policies
          </h4>

          <ul className="space-y-3 text-xs text-muted-foreground">
            <li>
              <Link
                to="/terms-and-conditions"
                className="hover:text-primary transition-colors inline-block"
              >
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-primary transition-colors inline-block"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/shipping-policy"
                className="hover:text-primary transition-colors inline-block"
              >
                Shipping &amp; Delivery
              </Link>
            </li>
            <li>
              <Link
                to="/refund-policy"
                className="hover:text-primary transition-colors inline-block"
              >
                Refund &amp; Cancellation
              </Link>
            </li>
          </ul>
        </div>

        {/* ================================================================
            4. DYNAMIC CATEGORIES FROM API
        ================================================================= */}
        <div className={isMobile ? "text-center sm:text-left" : ""}>
          <h4 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider mb-4">
            Our Categories
          </h4>

          {isLoadingCategories ? (
            <div
              className={`space-y-3 ${
                isMobile ? "flex flex-col items-center sm:items-start" : ""
              }`}
            >
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-3 w-32 rounded bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No categories available.
            </p>
          ) : (
            <ul className="space-y-3 text-xs text-muted-foreground">
              {categories.slice(0, 5).map((category) => (
                <li key={category._id}>
                  <Link
                    to={`/products?category=${encodeURIComponent(
                      category._id
                    )}`}
                    className="hover:text-primary transition-colors inline-block"
                  >
                    {category.name || category.title || "Category"}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ================================================================
            5. CONTACT INFO
        ================================================================= */}
        <div className={isMobile ? "text-center sm:text-left" : ""}>
          <h4 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider mb-4">
            Get in Touch
          </h4>

          <div
            className={`space-y-4 text-xs text-muted-foreground ${
              isMobile ? "flex flex-col items-center sm:items-start" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <MdLocationOn
                size={19}
                className="text-primary shrink-0 mt-0.5"
              />
              <span className="leading-relaxed text-left">
                A-457, Nemi Nagar Extension, Block A, Vaishali Nagar, Jaipur,
                Rajasthan 302021
              </span>
            </div>

            <div className="flex items-center gap-3">
              <FaPhoneAlt size={14} className="text-primary shrink-0" />
              <a
                href="tel:+919772790222"
                className="hover:text-primary transition-colors"
              >
                +91-9772790222
              </a>
            </div>

            <div className="flex items-center gap-3">
              <MdEmail size={18} className="text-primary shrink-0" />
              <a
                href="mailto:info@earthenechoes.in"
                className="hover:text-primary transition-colors"
              >
                info@earthenechoes.in
              </a>
            </div>

            <div className="flex items-center gap-3">
              <IoTimeOutline size={19} className="text-primary shrink-0" />
              <span>Mon - Sun: 9:00 AM - 6:00 PM IST</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          BOTTOM FOOTER
      ================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/60 pt-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          {/* Copyright Text */}
          <p className="text-center lg:text-left">
            © 2026 Earthen Echoes. Made with love in Jaipur. All rights reserved.
          </p>

          {/* All 4 Policy Links in a single responsive row */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px]">
            <Link
              to="/terms-and-conditions"
              className="hover:text-primary transition-colors"
            >
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <Link
              to="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              to="/shipping-policy"
              className="hover:text-primary transition-colors"
            >
              Shipping Policy
            </Link>
            <span>•</span>
            <Link
              to="/refund-policy"
              className="hover:text-primary transition-colors"
            >
              Refund &amp; Cancellation
            </Link>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-3">
            <FaCreditCard
              size={22}
              className="text-muted-foreground/60"
              title="Visa / Mastercard"
            />
            <span className="font-semibold text-[10px] tracking-wider uppercase text-muted-foreground/50">
              Secure UPI &amp; Netbanking
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;