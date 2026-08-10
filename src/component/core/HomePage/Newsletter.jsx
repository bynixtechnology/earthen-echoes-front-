import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { C } from "../../../constants/theme";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const r = () => setMobile(window.innerWidth < 768);
    r();
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Please enter your email");
    setSubscribed(true);
    toast.success("Thank you for subscribing!");
  };

  return (
    <section style={{ padding: mobile ? "60px 16px" : "110px 40px", background: C.ivory, overflow: "hidden" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{
          background: `linear-gradient(135deg, ${C.darkTeal} 0%, ${C.teal} 60%, #17969B 100%)`,
          borderRadius: mobile ? 28 : 40,
          padding: mobile ? "48px 20px" : "72px 64px",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 25px 60px ${C.teal}35`,
          border: "1px solid rgba(255,255,255,0.15)"
        }}>
          {/* Elegant Floating Orbs */}
          <div style={{ position: "absolute", right: -50, top: -50, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,.07)", filter: "blur(20px)" }} />
          <div style={{ position: "absolute", left: -40, bottom: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,.05)", filter: "blur(15px)" }} />
          <div style={{ position: "absolute", right: 40, bottom: -50, width: 180, height: 180, borderRadius: "50%", background: `${C.coral}40`, filter: "blur(25px)" }} />

          <div style={{ position: "relative", textAlign: "center", zIndex: 2 }}>
            
            {/* Minimalist Sub-heading pill */}
            <div style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              padding: "6px 16px",
              borderRadius: 50,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 16,
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              Stay Connected
            </div>

            <h2 style={{
              fontFamily: "Playfair Display,serif",
              fontSize: mobile ? 30 : "clamp(32px, 4vw, 48px)",
              color: "#fff",
              margin: "0 0 14px",
              lineHeight: 1.15,
              letterSpacing: "-0.5px"
            }}>
              Join the Earthen Circle
            </h2>

            <p style={{
              maxWidth: 480,
              margin: "0 auto 32px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,.85)",
              fontSize: mobile ? 13.5 : 15.5
            }}>
              Subscribe for early access to new collections, artisan stories, exclusive discounts, and seasonal gifting tips.
            </p>

            {subscribed ? (
              <div style={{
                display: "inline-block",
                padding: "16px 32px",
                borderRadius: 50,
                background: "rgba(255,255,255,.2)",
                backdropFilter: "blur(10px)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
              }}>
                🎉 Welcome to the circle! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{
                display: "flex",
                flexDirection: mobile ? "column" : "row",
                gap: 10,
                maxWidth: 520,
                margin: "0 auto",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                padding: 6,
                borderRadius: 999,
                border: "1.5px solid rgba(255,255,255,0.25)"
              }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  style={{
                    flex: 1,
                    padding: mobile ? "14px 20px" : "12px 22px",
                    borderRadius: 999,
                    border: "none",
                    background: "transparent",
                    color: "#fff",
                    outline: "none",
                    fontSize: 14,
                  }}
                />
                <button type="submit" style={{
                  padding: mobile ? "14px 24px" : "12px 28px",
                  border: "none",
                  borderRadius: 999,
                  cursor: "pointer",
                  background: C.coral,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  whiteSpace: "nowrap",
                  boxShadow: `0 6px 20px ${C.coral}60`,
                  transition: "transform 0.2s ease, background 0.2s ease"
                }}>
                  Subscribe Now
                </button>
              </form>
            )}

            <p style={{
              marginTop: 20,
              fontSize: 11.5,
              color: "rgba(255,255,255,.6)"
            }}>
              No spam, unsubscribe at any time.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}