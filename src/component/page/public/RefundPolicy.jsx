import React from "react";
import { Link } from "react-router-dom";
import {
  FaUndoAlt,
  FaTimesCircle,
  FaShieldAlt,
  FaClock,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const RefundPolicy = () => {
  return (
    <div className="bg-background min-h-screen py-12 sm:py-16 text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Customer Assurance
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mt-3 mb-2">
            Cancellation &amp; Refund Policy
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
              <FaShieldAlt className="text-primary" /> 1. Overview &amp; Craft Authenticity
            </h2>
            <p>
              At <strong>Earthen Echoes</strong>, every piece is handcrafted by
              skilled artisans using authentic terracotta and natural clay.
              Because each creation is individually shaped and kiln-fired,
              slight variations in shade, texture, and contour are natural
              hallmarks of handmade pottery rather than structural flaws.
            </p>
            <p>
              We take great care in packaging our fragile items with heavy-duty
              protective cushioning. In the rare instance something goes wrong
              with your shipment, we have a simple, hassle-free resolution
              policy.
            </p>
          </section>

          <hr className="border-border/60" />

          {/* Section 2: Order Cancellation */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaTimesCircle className="text-primary" /> 2. Order Cancellation
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Before Dispatch:</strong> You may request an order
                cancellation within <strong>12 to 24 hours</strong> of placing
                it, provided the package has not already been dispatched from
                our workshop. To cancel, WhatsApp us or email{" "}
                <a
                  href="mailto:info@earthenechoes.in"
                  className="text-primary underline"
                >
                  info@earthenechoes.in
                </a>{" "}
                with your Order ID. A 100% refund will be issued immediately to
                your original payment source.
              </p>
              <p>
                <strong>After Dispatch:</strong> Once your consignment has been
                handed over to our courier partner and a tracking ID is generated,
                cancellations cannot be processed.
              </p>
            </div>
          </section>

          <hr className="border-border/60" />

          {/* Section 3: Damaged / Defective / Incorrect Items */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaUndoAlt className="text-primary" /> 3. Damaged in Transit or Defective Delivery
            </h2>
            <p>
              Given the fragile nature of terracotta craftwork, we provide full
              coverage against courier transit damage:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Reporting Window:</strong> You must notify us within{" "}
                <strong>48 hours of delivery</strong> if an item arrives broken,
                damaged, or incorrect.
              </li>
              <li>
                <strong>Required Proof:</strong> Please share clear photos or an
                unboxing video showing the outer shipping box, shipping label,
                and the damaged product to{" "}
                <a
                  href="mailto:info@earthenechoes.in"
                  className="text-primary underline"
                >
                  info@earthenechoes.in
                </a>{" "}
                or WhatsApp at <strong>+91-9772790222</strong>.
              </li>
              <li>
                <strong>Resolution:</strong> After our team verifies the damage,
                you can choose between:
                <ul className="list-circle pl-5 mt-1 space-y-1">
                  <li>A <strong>free replacement</strong> sent via express dispatch (subject to stock availability).</li>
                  <li>A <strong>full 100% refund</strong> credited back to your original payment mode.</li>
                </ul>
              </li>
            </ul>
          </section>

          <hr className="border-border/60" />

          {/* Section 4: Return & Reverse Pickup Process */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              4. Return &amp; Reverse Logistics
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                For approved return cases, our logistics team will coordinate a
                reverse pickup from your delivery address whenever serviceable.
              </li>
              <li>
                Items must be repacked securely in their original packaging to
                prevent further breakage during return transit.
              </li>
              <li>
                Items returned in used condition, without original tags/packaging,
                or reported after the 48-hour window are not eligible for refunds.
              </li>
            </ul>
          </section>

          <hr className="border-border/60" />

          {/* Section 5: Refund Timeline & Payment Gateway Settlement */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaClock className="text-primary" /> 5. Refund Method &amp; Timelines
            </h2>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
              <p className="text-foreground font-medium">
                How and when you will receive your money back:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Once your refund request is approved, we initiate the credit
                  within <strong>24 to 48 business hours</strong>.
                </li>
                <li>
                  <strong>Online Payments (UPI, Net Banking, Cards):</strong> The
                  amount is refunded directly to your original payment method
                  and typically reflects in your bank statement within{" "}
                  <strong>5 to 7 business days</strong> (depending on your bank
                  and payment gateway clearing cycle).
                </li>
                <li>
                  You will receive an automated email confirmation along with the
                  refund transaction ARN/reference number.
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-border/60" />

          {/* Section 6: Non-Refundable Scenarios */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              6. Non-Refundable / Ineligible Cases
            </h2>
            <p>Refunds or replacements will not be issued in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Incorrect or incomplete delivery address provided by the customer.</li>
              <li>Multiple failed delivery attempts by the courier partner.</li>
              <li>Minor handcrafted irregularities natural to raw terracotta pottery.</li>
              <li>Issues reported after 48 hours of parcel delivery.</li>
            </ul>
          </section>

          <hr className="border-border/60" />

          {/* Section 7: Support & Help Desk */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">
              7. Customer Support &amp; Grievances
            </h2>
            <p>
              Need assistance with an order, cancellation, or refund? Contact our
              Jaipur studio team:
            </p>
            <div className="bg-muted/40 p-4 rounded-xl space-y-2.5 text-xs sm:text-sm border border-border">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                <span>
                  <strong>Workshop &amp; Office:</strong> A-457, Nemi Nagar
                  Extension, Block A, Vaishali Nagar, Jaipur, Rajasthan 302021,
                  India
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-primary shrink-0" />
                <span>
                  <strong>Phone / WhatsApp:</strong> +91-9772790222 (9:00 AM – 6:00 PM IST)
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

export default RefundPolicy;