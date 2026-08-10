import React, {
  useState,
} from "react";

import {
  User,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  Heart,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  GoogleLogin,
} from "@react-oauth/google";

import {
  registerUser,
  googleLoginUser,
} from "../../../redux/thunks/userAuthThunk";

import {
  selectUserAuthLoading,
} from "../../../redux/slices/userAuthSlice";

import { C } from "../../../constants/theme";


const UserRegister = () => {

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  const navigate = useNavigate();
  const dispatch = useDispatch();


  /*
  |--------------------------------------------------------------------------
  | Redux State
  |--------------------------------------------------------------------------
  */

  const reduxLoading = useSelector(selectUserAuthLoading);


  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });


  /*
  |--------------------------------------------------------------------------
  | UI State
  |--------------------------------------------------------------------------
  */

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Combined Loading
  |--------------------------------------------------------------------------
  */

  const isLoading = reduxLoading || isGoogleLoading;


  /*
  |--------------------------------------------------------------------------
  | Handle Input Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    /*
    |--------------------------------------------------------------------------
    | Phone - Numbers Only
    |--------------------------------------------------------------------------
    */

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        phone: numericValue,
      }));
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Other Inputs
    |--------------------------------------------------------------------------
    */

    setFormData((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));
  };


  /*
  |--------------------------------------------------------------------------
  | Validate Form
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name) {
      toast.error("Please enter your full name.");
      return false;
    }

    if (name.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return false;
    }

    if (!email) {
      toast.error("Please enter your email address.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!phone) {
      toast.error("Please enter your phone number.");
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid 10 digit mobile number.");
      return false;
    }

    if (!password) {
      toast.error("Please enter a password.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    if (!agreeTerms) {
      toast.error("Please accept the Terms & Conditions.");
      return false;
    }

    return true;
  };


  /*
  |--------------------------------------------------------------------------
  | Normal Registration
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;
    if (!validateForm()) return;

    const registerData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password,
    };

    try {
      const result = await dispatch(registerUser(registerData)).unwrap();

      toast.success(
        result?.message || "Account created successfully."
      );

      navigate("/", { replace: true });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to create account."
      );
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Google Authentication Success
  |--------------------------------------------------------------------------
  */

  const handleGoogleSuccess = async (credentialResponse) => {
    if (isGoogleLoading) return;

    try {
      setIsGoogleLoading(true);

      const credential = credentialResponse?.credential;
      if (!credential) {
        throw new Error("Google credential was not received.");
      }

      const result = await dispatch(googleLoginUser(credential)).unwrap();

      toast.success(
        result?.message ||
        (result?.user?.name
          ? `Welcome, ${result.user.name}.`
          : "Google authentication successful.")
      );

      navigate("/", { replace: true });
    } catch (error) {
      console.error("GOOGLE AUTH ERROR:", error);
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to continue with Google."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Google Authentication Error
  |--------------------------------------------------------------------------
  */

  const handleGoogleError = () => {
    setIsGoogleLoading(false);
    toast.error("Google authentication failed. Please try again.");
  };


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 py-10 lg:py-16"
      style={{ background: C.cream }}
    >
      <div
        className="w-full max-w-6xl grid lg:grid-cols-[0.9fr_1.1fr] rounded-[28px] overflow-hidden shadow-2xl shadow-black/5"
        style={{
          background: C.ivory,
          border: `1px solid ${C.paleCoral}`,
        }}
      >
        {/* ================================================================
            LEFT SECTION (Branding Panel)
        ================================================================= */}
        <div
          className="hidden lg:flex relative overflow-hidden p-12 flex-col justify-between"
          style={{
            background: `linear-gradient(135deg, ${C.coral}, ${C.raspberry})`,
            color: C.ivory,
          }}
        >
          {/* Decorative Circles */}
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />
          <div
            className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <div
            className="absolute top-1/3 right-10 w-32 h-32 rounded-full border"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          />

          {/* Brand + Hero */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-16 group">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-heading font-bold text-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                style={{ background: C.ivory, color: C.coral }}
              >
                EE
              </div>
              <div>
                <p className="font-heading text-xl font-bold" style={{ color: C.ivory }}>
                  Earthen Echoes
                </p>
                <p
                  className="text-xs tracking-wider font-medium"
                  style={{ color: "rgba(253,248,243,0.7)" }}
                >
                  HANDCRAFTED WITH SOUL
                </p>
              </div>
            </Link>

            <div className="max-w-md">
              <span
                className="inline-flex px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-sm"
                style={{
                  border: `1px solid rgba(255,255,255,0.25)`,
                  background: "rgba(255,255,255,0.12)",
                  color: C.ivory,
                }}
              >
                Join Our Community
              </span>

              <h1
                className="font-heading text-4xl xl:text-5xl font-bold leading-tight mb-5"
                style={{ color: C.ivory }}
              >
                Bring timeless craftsmanship into your home.
              </h1>

              <p
                className="leading-7 text-sm"
                style={{ color: "rgba(253,248,243,0.8)" }}
              >
                Create your account and discover authentic handcrafted
                terracotta pieces made by skilled Indian artisans.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="relative z-10 grid grid-cols-3 gap-4 mt-12">
            <div>
              <ShieldCheck size={23} className="mb-3" />
              <p className="text-sm font-semibold">Secure</p>
              <p
                className="text-[11px] mt-1"
                style={{ color: "rgba(253,248,243,0.6)" }}
              >
                Safe account
              </p>
            </div>
            <div>
              <PackageCheck size={23} className="mb-3" />
              <p className="text-sm font-semibold">Orders</p>
              <p
                className="text-[11px] mt-1"
                style={{ color: "rgba(253,248,243,0.6)" }}
              >
                Easy tracking
              </p>
            </div>
            <div>
              <Heart size={23} className="mb-3" />
              <p className="text-sm font-semibold">Wishlist</p>
              <p
                className="text-[11px] mt-1"
                style={{ color: "rgba(253,248,243,0.6)" }}
              >
                Save favorites
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================
            RIGHT SECTION (Registration Form)
        ================================================================= */}
        <div className="px-5 py-8 sm:p-10 lg:p-12 xl:p-14" style={{ background: C.ivory }}>
          <div className="max-w-xl mx-auto">
            {/* Mobile Logo */}
            <Link to="/" className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center font-heading font-bold"
                style={{ background: C.coral, color: C.ivory }}
              >
                EE
              </div>
              <span className="font-heading text-xl font-bold" style={{ color: C.dark }}>
                Earthen Echoes
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <p
                className="text-xs uppercase tracking-[0.2em] font-semibold mb-3"
                style={{ color: C.coral }}
              >
                Create Account
              </p>
              <h2
                className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-3"
                style={{ color: C.dark }}
              >
                Join Earthen Echoes
              </h2>
              <p className="text-sm text-neutral-600 leading-6">
                Create an account to enjoy a smoother shopping experience.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: C.dark }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={isLoading}
                    className="w-full h-12 pl-12 pr-4 rounded-xl border text-sm outline-none transition focus:ring-2 disabled:opacity-60"
                   style={{
  background: C.ivory,
  color: C.dark,
  border: `2px solid ${C.paleCoral}`,
  boxShadow: `0 2px 6px rgba(0,0,0,0.04)`,
}}
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid sm:grid-cols-2 gap-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: C.dark }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={isLoading}
                      className="w-full h-12 pl-12 pr-4 rounded-xl border text-sm outline-none transition focus:ring-2 disabled:opacity-60"
                     style={{
  background: C.ivory,
  color: C.dark,
  border: `2px solid ${C.paleCoral}`,
  boxShadow: `0 2px 6px rgba(0,0,0,0.04)`,
}}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: C.dark }}
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength={10}
                      inputMode="numeric"
                      autoComplete="tel"
                      disabled={isLoading}
                      className="w-full h-12 pl-12 pr-4 rounded-xl border text-sm outline-none transition focus:ring-2 disabled:opacity-60"
                      style={{
  background: C.ivory,
  color: C.dark,
  border: `2px solid ${C.paleCoral}`,
  boxShadow: `0 2px 6px rgba(0,0,0,0.04)`,
}}
                    />
                  </div>
                </div>
              </div>

              {/* Passwords */}
              <div className="grid sm:grid-cols-2 gap-5">
                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: C.dark }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="w-full h-12 pl-12 pr-12 rounded-xl border text-sm outline-none transition focus:ring-2 disabled:opacity-60"
                      style={{
  background: C.ivory,
  color: C.dark,
  border: `2px solid ${C.paleCoral}`,
  boxShadow: `0 2px 6px rgba(0,0,0,0.04)`,
}}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={isLoading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: C.dark }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="w-full h-12 pl-12 pr-12 rounded-xl border text-sm outline-none transition focus:ring-2 disabled:opacity-60"
                      style={{
  background: C.ivory,
  color: C.dark,
  border: `2px solid ${C.paleCoral}`,
  boxShadow: `0 2px 6px rgba(0,0,0,0.04)`,
}}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      disabled={isLoading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-700"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={isLoading}
                  className="mt-1 w-4 h-4 rounded border-neutral-300 accent-[#F16937] cursor-pointer"
                />
                <span className="text-sm text-neutral-600 leading-6">
                  I agree to the{" "}
                  <button type="button" className="font-semibold hover:underline" style={{ color: C.coral }}>
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button type="button" className="font-semibold hover:underline" style={{ color: C.coral }}>
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[52px] rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:opacity-95 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: C.coral, color: C.ivory }}
              >
                {reduxLoading ? (
                  <>
                    <span
                      className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin"
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 py-1">
                <div className="flex-1 h-px bg-neutral-200" />
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Or
                </span>
                <div className="flex-1 h-px bg-neutral-200" />
              </div>

              {/* Google Login */}
              <div className="w-full min-h-[52px] flex items-center justify-center">
                {isGoogleLoading ? (
                  <div
                    className="w-full min-h-[52px] px-5 rounded-xl border border-neutral-200 text-sm font-semibold flex items-center justify-center gap-3 shadow-sm opacity-70"
                    style={{ background: C.ivory, color: C.dark }}
                  >
                    <span
                      className="w-5 h-5 rounded-full border-2 border-neutral-300 border-t-[#F16937] animate-spin"
                    />
                    Connecting...
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center overflow-hidden rounded-xl">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap={false}
                      auto_select={false}
                      theme="outline"
                      size="large"
                      text="continue_with"
                      shape="rectangular"
                      logo_alignment="left"
                      width="500"
                    />
                  </div>
                )}
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
              <p className="text-sm text-neutral-600">
                Already have an account?{" "}
                <Link to="/user/login" className="font-bold hover:underline" style={{ color: C.coral }}>
                  Sign In
                </Link>
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-6 flex justify-center items-center gap-2 text-xs text-neutral-500">
              <ShieldCheck size={15} style={{ color: C.teal }} />
              Your information is safe and secure.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;