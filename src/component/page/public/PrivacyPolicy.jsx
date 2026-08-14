import React from "react";
import { Link } from "react-router-dom";
import {
  FaUserShield,
  FaLock,
  FaDatabase,
  FaCookieBite,
  FaShareAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const PrivacyPolicy = () => {
  return (
    <div className="bg-background min-h-screen py-12 sm:py-16 text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Data Protection & Trust
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mt-3 mb-2">
            Privacy Policy
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
              <FaUserShield className="text-primary" /> 1. Overview
            </h2>
            <p>
              At <strong>Earthen Echoes</strong> (accessible via{" "}
              <a
                href="https://earthenechoes.in"
                className="text-primary underline hover:opacity-80"
              >
                https://earthenechoes.in/
              </a>
              ), we value your trust and are dedicated to protecting your
              personal information. This Privacy Policy outlines what data we
              collect, why we collect it, how it is used, and the security
              measures we maintain to keep your transactions safe.
            </p>
          </section>

          <hr className="border-border/60" />

          {/* Section 2: Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaDatabase className="text-primary" /> 2. Information We Collect
            </h2>
            <p>
              When you browse our catalogue, register an account, or place an
              order, we may collect the following details:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Personal Identifiers:</strong> Name, email address, phone
                number, and shipping/billing address.
              </li>
              <li>
                <strong>Order Details:</strong> Items purchased, order history,
                transaction date, and delivery preferences.
              </li>
              <li>
                <strong>Technical & Device Data:</strong> IP address, browser
                type, operating system, and on-site browsing behavior.
              </li>
            </ul>
          </section>

          <hr className="border-border/60" />

          {/* Section 3: Payment Security */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaLock className="text-primary" /> 3. Payment Processing & Security
            </h2>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
              <p className="text-foreground font-medium">
                We prioritize your financial safety:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  We <strong>do not store</strong> your complete debit/credit card
                  numbers, PINs, or CVV codes on our servers.
                </li>
                <li>
                  All payment transactions are handled through certified,
                  PCI-DSS compliant payment gateways with bank-grade 256-bit
                  SSL encryption.
                </li>
                <li>
                  UPI, Net Banking, and Wallet authentications are processed
                  directly through your respective bank or authorized payment
                  interface.
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-border/60" />

          {/* Section 4: How We Use Your Information */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              4. How We Use Your Information
            </h2>
            <p>We utilize the collected information strictly to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Process, pack, and deliver your terracotta handcrafted orders.</li>
              <li>
                Send transaction receipts, dispatch confirmations, and tracking
                updates via email or SMS/WhatsApp.
              </li>
              <li>Provide dedicated customer support and handle queries/returns.</li>
              <li>
                Prevent fraudulent transactions and enhance overall website
                security.
              </li>
              <li>
                Send occasional promotional offers or newsletter updates (only if
                opted in).
              </li>
            </ul>
          </section>

          <hr className="border-border/60" />

          {/* Section 5: Third-Party Service Providers */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaShareAlt className="text-primary" /> 5. Third-Party Sharing
            </h2>
            <p>
              We do not sell, rent, or trade your personal data to third parties.
              We only share necessary details with trusted partners essential for
              business operations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Logistics Partners:</strong> Sharing address and contact
                number for accurate doorstep delivery.
              </li>
              <li>
                <strong>Payment Gateways:</strong> Transmitting necessary billing
                information to authorize secure payment checkouts.
              </li>
              <li>
                <strong>Legal Authorities:</strong> Only when strictly required
                by law or court orders to comply with statutory regulations.
              </li>
            </ul>
          </section>

          <hr className="border-border/60" />

          {/* Section 6: Cookies & Tracking */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FaCookieBite className="text-primary" /> 6. Cookies Policy
            </h2>
            <p>
              Our website uses cookies and similar storage technologies to
              remember items in your shopping cart, preserve your session
              preferences, and gather non-identifiable analytical traffic data.
              You can adjust your browser settings to decline cookies, though
              some store features may not function properly as a result.
            </p>
          </section>

          <hr className="border-border/60" />

          {/* Section 7: User Rights & Data Protection */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">
              7. Your Rights & Data Retention
            </h2>
            <p>
              You have the right to review, update, or request the deletion of
              your personal profile data stored with us at any time. We retain
              transactional records only for as long as necessary to fulfill tax,
              legal, and accounting requirements.
            </p>
          </section>

          <hr className="border-border/60" />

          {/* Section 8: Grievance Officer & Contact */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">
              8. Contact Us / Privacy Officer
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or our data handling practices, please contact us:
            </p>
            <div className="bg-muted/40 p-4 rounded-xl space-y-2.5 text-xs sm:text-sm border border-border">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                <span>
                  <strong>Operating Address:</strong> A-457, Nemi Nagar
                  Extension, Block A, Vaishali Nagar, Jaipur, Rajasthan 302021,
                  India
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

export default PrivacyPolicy;