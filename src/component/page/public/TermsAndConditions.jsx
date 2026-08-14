import React from "react";
import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaCreditCard,
  FaTruck,
  FaUndoAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const TermsAndConditions = () => {
  return (
    <div className="bg-background min-h-screen py-12 sm:py-16 text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mt-3 mb-2">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Last Updated: August 2026 | Applicable to https://earthenechoes.in/
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-sm leading-relaxed text-muted-foreground">
          {/* Section 1: Introduction */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaShieldAlt className="text-primary" /> 1. Introduction
            </h2>
            <p>
              Welcome to <strong>Earthen Echoes</strong> (accessible via{" "}
              <a
                href="https://earthenechoes.in"
                className="text-primary underline hover:opacity-80"
              >
                https://earthenechoes.in/
              </a>
              ). By accessing or purchasing from this website, you agree to
              comply with and be bound by the following Terms and Conditions.
              These terms govern all transactions, usage of services, and
              interactions on our platform.
            </p>
          </section>

          <hr className="border-border/60" />

          {/* Section 2: Products & Handcrafted Variations */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              2. Products & Handcrafted Character
            </h2>
            <p>
              We specialize in authentic terracotta and handmade home decor
              products. Due to the handcrafted nature of our items:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Slight variations in color, texture, shape, and finish are
                natural characteristics of the craft and not defects.
              </li>
              <li>
                Product images displayed are representative; slight variations
                may occur due to monitor color calibration and natural clay
                firing processes.
              </li>
            </ul>
          </section>

          <hr className="border-border/60" />

          {/* Section 3: Pricing & Payments */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaCreditCard className="text-primary" /> 3. Pricing & Payment
              Terms
            </h2>
            <p>
              All prices listed on the website are in Indian Rupees (INR) and are
              inclusive of applicable taxes (GST) unless specified otherwise.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                We accept payments via verified secure payment gateways (Credit
                Cards, Debit Cards, Net Banking, UPI, and authorized Wallets).
              </li>
              <li>
                We do not store complete card credentials or CVV numbers on our
                servers. All transactions are securely processed through
                PCI-DSS compliant payment aggregators.
              </li>
              <li>
                In case of payment failure where the amount is debited from your
                account, it will be automatically refunded by your issuing bank
                as per their standard settlement cycle (usually 5–7 business
                days).
              </li>
            </ul>
          </section>

          <hr className="border-border/60" />

          {/* Section 4: Shipping & Delivery */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaTruck className="text-primary" /> 4. Shipping & Delivery
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Orders are processed and dispatched within <strong>2 to 4 business days</strong> after payment verification.
              </li>
              <li>
                Standard delivery timelines range between <strong>5 to 9 business days</strong> depending on your delivery pin code.
              </li>
              <li>
                Tracking details are shared via email and SMS once your order is
                dispatched with our courier partners.
              </li>
            </ul>
          </section>

          <hr className="border-border/60" />

          {/* Section 5: Cancellations, Returns & Refunds */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaUndoAlt className="text-primary" /> 5. Cancellation, Return &
              Refund Policy
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Order Cancellation:</strong> You can request order
                cancellations before the product is dispatched by reaching out to
                our support team. Once dispatched, cancellations cannot be
                processed.
              </p>
              <p>
                <strong>Damaged in Transit / Defects:</strong> Terracotta is a
                fragile medium. In the unlikely event that your order arrives
                damaged:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Please notify us within <strong>48 hours</strong> of delivery
                  with unboxing photographs/video proof at{" "}
                  <a
                    href="mailto:info@earthenechoes.in"
                    className="text-primary underline"
                  >
                    info@earthenechoes.in
                  </a>
                  .
                </li>
                <li>
                  Upon verification, we will initiate a free replacement or a
                  full refund.
                </li>
                <li>
                  Refunds are processed back to the original source account
                  within <strong>5–7 working days</strong>.
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-border/60" />

          {/* Section 6: Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              6. Intellectual Property
            </h2>
            <p>
              All trademarks, logos, images, design elements, graphics, and
              textual content displayed on <strong>Earthen Echoes</strong> are the
              exclusive intellectual property of Earthen Echoes and protected
              under Indian copyright and trademark laws. Unauthorized
              reproduction or redistribution is strictly prohibited.
            </p>
          </section>

          <hr className="border-border/60" />

          {/* Section 7: Governing Law & Jurisdiction */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              7. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms & Conditions and any separate agreements shall be
              governed by and construed in accordance with the laws of India.
              Any disputes arising in relation to these terms shall be subject
              to the exclusive jurisdiction of the courts located in{" "}
              <strong>Jaipur, Rajasthan, India</strong>.
            </p>
          </section>

          <hr className="border-border/60" />

          {/* Section 8: Contact & Grievance */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">
              8. Contact Us / Grievance Officer
            </h2>
            <p>
              For any queries, payment issues, or support regarding our terms,
              please reach out to us:
            </p>
            <div className="bg-muted/40 p-4 rounded-xl space-y-2.5 text-xs sm:text-sm border border-border">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                <span>
                  <strong>Operating Address:</strong> A-457, Nemi Nagar Extension,
                  Block A, Vaishali Nagar, Jaipur, Rajasthan 302021, India
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-primary shrink-0" />
                <span>
                  <strong>Phone / WhatsApp:</strong> +91-9772790222
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-primary shrink-0" />
                <span>
                  <strong>Email:</strong> info@earthenechoes.in
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-xs sm:text-sm text-primary hover:underline font-medium"
          >
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;