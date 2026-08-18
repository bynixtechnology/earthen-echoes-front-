import React from "react";
import { Link } from "react-router-dom";
import {
  FaTruck,
  FaBoxOpen,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ShippingPolicy = () => {
  return (
    <div className="bg-background min-h-screen py-12 sm:py-16 text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Logistics & Delivery
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mt-3 mb-2">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Last Updated: August 2026 | Applicable to https://earthenechoes.in/
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-sm leading-relaxed text-muted-foreground">
          {/* Section 1: Overview */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaTruck className="text-primary" /> 1. Shipping Overview
            </h2>
            <p>
              At <strong>Earthen Echoes</strong>, we partner with reputable courier
              aggregators and logistics providers across India to ensure your handcrafted
              terracotta artifacts reach your doorstep securely and on schedule.
            </p>
            <p>
              All shipments originate from our central craft studio and packaging facility
              located in <strong>Jaipur, Rajasthan</strong>.
            </p>
          </section>

          <hr className="border-border/60" />

          {/* Section 2: Order Processing & Dispatch Timelines */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaBoxOpen className="text-primary" /> 2. Processing &amp; Dispatch Time
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Order Processing:</strong> Standard orders are verified, securely packed,
                and dispatched within <strong>2 to 4 business days</strong> from the date of order placement and payment verification.
              </li>
              <li>
                <strong>Custom or Made-to-Order Items:</strong> Certain large pottery or artisanal decor
                pieces may take an additional <strong>3 to 5 working days</strong> for kiln-drying and safe handling.
              </li>
              <li>
                Orders are processed and dispatched from Monday through Saturday (excluding public holidays).
              </li>
            </ul>
          </section>

          <hr className="border-border/60" />

          {/* Section 3: Delivery Timelines */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaMapMarkedAlt className="text-primary" /> 3. Estimated Delivery Timelines
            </h2>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
              <p className="text-foreground font-medium">
                Standard Pan-India Transit Expectations:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Tier 1 &amp; Metro Cities (Delhi NCR, Mumbai, Bengaluru, etc.):</strong> 4 to 6 business days post-dispatch.
                </li>
                <li>
                  <strong>Rest of India (Tier 2 &amp; Tier 3 regions):</strong> 6 to 9 business days post-dispatch.
                </li>
                <li>
                  <strong>Remote / Special Pin Codes:</strong> 8 to 12 business days depending on local courier connectivity.
                </li>
              </ul>
            </div>
            <p className="text-xs italic text-muted-foreground pt-1">
              * Note: Unforeseen operational delays caused by severe weather conditions, local holidays, or transit checkpoints are beyond our direct control, but our support team will actively assist in case of delays.
            </p>
          </section>

          <hr className="border-border/60" />

          {/* Section 4: Shipping Charges */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              4. Shipping Charges &amp; Pricing
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Applicable shipping fees (if any) are calculated based on shipment weight and destination pin code, displayed transparently on the final checkout screen prior to payment.
              </li>
              <li>
                We may offer <strong>Free Shipping</strong> promotional thresholds on eligible cart totals (as announced on the website header/announcement banner).
              </li>
              <li>
                All product prices and shipping fees quoted on the website are in Indian Rupees (INR) and include GST.
              </li>
            </ul>
          </section>

          <hr className="border-border/60" />

          {/* Section 5: Fragile Packaging Standards */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaShieldAlt className="text-primary" /> 5. Fragile &amp; Safe Transit Packaging
            </h2>
            <p>
              Natural terracotta requires specialized transit care. We employ multi-layer protection:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>High-density shock-absorbing bubble cushioning and recycled corrugated inner liners.</li>
              <li>Heavy-duty 5-to-7 ply rigid outer cartons engineered to resist external pressure.</li>
              <li>Prominent <em>&ldquo;Fragile — Handle With Care&rdquo;</em> safety labels on all sides of every package.</li>
            </ul>
          </section>

          <hr className="border-border/60" />

          {/* Section 6: Tracking Your Consignment */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              6. Order Tracking
            </h2>
            <p>
              As soon as your package is scanned by our logistics partner, you will receive an email and SMS/WhatsApp confirmation containing:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Courier partner name (e.g., Bluedart, Delhivery, DTDC, Xpressbees).</li>
              <li>Air Waybill (AWB) Tracking Number.</li>
              <li>A direct tracking link to monitor your order&apos;s journey in real time.</li>
            </ul>
          </section>

          <hr className="border-border/60" />

          {/* Section 7: Delivery Attempts & Address Accuracy */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              7. Delivery Attempts &amp; Address Verification
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Our delivery partners make up to <strong>3 delivery attempts</strong> before returning the package to our origin center.</li>
              <li>Please provide an accurate and complete shipping address along with landmark details and an active mobile number to ensure smooth delivery.</li>
              <li>If a parcel is returned due to incorrect address information or customer unavailability, re-shipping charges may apply.</li>
            </ul>
          </section>

          <hr className="border-border/60" />

          {/* Section 8: Support & Shipping Queries */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">
              8. Shipping Support &amp; Enquiries
            </h2>
            <p>
              For updates regarding an in-transit order or address modification requests prior to dispatch:
            </p>
            <div className="bg-muted/40 p-4 rounded-xl space-y-2.5 text-xs sm:text-sm border border-border">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                <span>
                  <strong>Operating Studio:</strong> A-457, Nemi Nagar
                  Extension, Block A, Vaishali Nagar, Jaipur, Rajasthan 302021,
                  India
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-primary shrink-0" />
                <span>
                  <strong>Support Line:</strong> +91-9772790222 (Mon – Sun: 9:00 AM – 6:00 PM IST)
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

export default ShippingPolicy;