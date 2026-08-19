import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

import {
  loginUser,
  googleLoginUser,
} from "../../../redux/thunks/userAuthThunk";

import {
  mergeGuestCartThunk,
  fetchCart,
} from "../../../redux/thunks/cartThunk";

import {
  mergeGuestWishlistThunk,
  getWishlist,
} from "../../../redux/thunks/wishlistThunk";

import {
  clearUserAuthError,
  selectUser,
  selectUserAuthenticated,
  selectUserAuthLoading,
  selectGoogleAuthLoading,
} from "../../../redux/slices/userAuthSlice";

import { C } from "../../../constants/theme";

const UserLogin = () => {
  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Redux State
  |--------------------------------------------------------------------------
  */

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(
    selectUserAuthenticated
  );

  const loading = useSelector(
    selectUserAuthLoading
  );

  const googleLoading = useSelector(
    selectGoogleAuthLoading
  );

  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  */

  const [formData, setFormData] = useState({
    email:
      localStorage.getItem("rememberUserEmail") || "",
    password: "",
    rememberMe: Boolean(
      localStorage.getItem("rememberUserEmail")
    ),
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoginProcessing, setIsLoginProcessing] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Redirect Logged-In User
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      !isLoginProcessing
    ) {
      navigate("/", {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    user,
    isLoginProcessing,
    navigate,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Clear Old Authentication Error
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(clearUserAuthError());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Handle Input Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Merge & Sync Cart + Wishlist
  |--------------------------------------------------------------------------
  */

  const syncCartAndWishlistOnLogin =
    async () => {
      try {
        await Promise.allSettled([
          dispatch(
            mergeGuestCartThunk()
          ).unwrap(),

          dispatch(
            mergeGuestWishlistThunk()
          ).unwrap(),
        ]);

        console.log(
          "Cart and Wishlist merged successfully."
        );
      } catch (mergeError) {
        console.log(
          "Guest session merge skipped/failed:",
          mergeError
        );
      }

      try {
        await Promise.allSettled([
          dispatch(
            fetchCart()
          ).unwrap(),

          dispatch(
            getWishlist()
          ).unwrap(),
        ]);

        console.log(
          "Final Cart & Wishlist fetched successfully."
        );
      } catch (fetchError) {
        console.error(
          "Cart/Wishlist fetch error:",
          fetchError
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Email / Password Login
  |--------------------------------------------------------------------------
  |
  | Sign In
  |   ↓
  | loginUser thunk
  |   ↓
  | UserAuthService.login()
  |   ↓
  | Backend Login API
  |   ↓
  | Token + User
  |   ↓
  | Redux
  |
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      loading ||
      googleLoading ||
      isLoginProcessing
    ) {
      return;
    }

    const email =
      formData.email
        ?.trim()
        .toLowerCase();

    const password =
      formData.password;

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!email) {
      toast.error(
        "Please enter your email address."
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error(
        "Please enter a valid email address."
      );
      return;
    }

    if (!password) {
      toast.error(
        "Please enter your password."
      );
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters."
      );
      return;
    }

    dispatch(clearUserAuthError());

    setIsLoginProcessing(true);

    try {
      /*
      |--------------------------------------------------------------------------
      | STEP 1: LOGIN API
      |--------------------------------------------------------------------------
      */

      console.log(
        "LOGIN API CALL:",
        {
          email,
        }
      );

      const result = await dispatch(
        loginUser({
          email,
          password,
        })
      ).unwrap();

      console.log(
        "LOGIN API SUCCESS:",
        result
      );

      /*
      |--------------------------------------------------------------------------
      | STEP 2: Remember Email
      |--------------------------------------------------------------------------
      */

      if (formData.rememberMe) {
        localStorage.setItem(
          "rememberUserEmail",
          email
        );
      } else {
        localStorage.removeItem(
          "rememberUserEmail"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | STEP 3: Merge Guest Cart + Wishlist
      |--------------------------------------------------------------------------
      */

      await syncCartAndWishlistOnLogin();

      /*
      |--------------------------------------------------------------------------
      | STEP 4: Notify Other Components
      |--------------------------------------------------------------------------
      */

      window.dispatchEvent(
        new Event("userAuthChanged")
      );

      /*
      |--------------------------------------------------------------------------
      | STEP 5: Success Message
      |--------------------------------------------------------------------------
      */

      toast.success(
        result?.message ||
          `Welcome back${
            result?.user?.name
              ? `, ${result.user.name}`
              : ""
          }!`
      );

      /*
      |--------------------------------------------------------------------------
      | STEP 6: Navigate
      |--------------------------------------------------------------------------
      */

      navigate("/", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "USER LOGIN ERROR:",
        error
      );

      toast.error(
        typeof error === "string"
          ? error
          : error?.message ||
              "Unable to login. Please try again."
      );

    } finally {
      setIsLoginProcessing(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Google Login Success
  |--------------------------------------------------------------------------
  */

  const handleGoogleSuccess =
    async (credentialResponse) => {
      if (
        googleLoading ||
        loading ||
        isLoginProcessing
      ) {
        return;
      }

      const credential =
        credentialResponse?.credential;

      if (!credential) {
        toast.error(
          "Google credential was not received."
        );
        return;
      }

      dispatch(clearUserAuthError());

      setIsLoginProcessing(true);

      try {
        /*
        |--------------------------------------------------------------------------
        | STEP 1: GOOGLE API
        |--------------------------------------------------------------------------
        */

        console.log(
          "GOOGLE LOGIN API CALL"
        );

        const result = await dispatch(
          googleLoginUser(credential)
        ).unwrap();

        console.log(
          "GOOGLE LOGIN SUCCESS:",
          result
        );

        /*
        |--------------------------------------------------------------------------
        | STEP 2: Merge Cart + Wishlist
        |--------------------------------------------------------------------------
        */

        await syncCartAndWishlistOnLogin();

        /*
        |--------------------------------------------------------------------------
        | STEP 3: Storage / Events
        |--------------------------------------------------------------------------
        */

        localStorage.setItem(
          "googleSignupPromptClosed",
          "true"
        );

        window.dispatchEvent(
          new Event("userAuthChanged")
        );

        /*
        |--------------------------------------------------------------------------
        | STEP 4: Success
        |--------------------------------------------------------------------------
        */

        toast.success(
          result?.message ||
            `Welcome${
              result?.user?.name
                ? `, ${result.user.name}`
                : ""
            }!`
        );

        /*
        |--------------------------------------------------------------------------
        | STEP 5: Navigate
        |--------------------------------------------------------------------------
        */

        navigate("/", {
          replace: true,
        });

      } catch (error) {
        console.error(
          "GOOGLE LOGIN ERROR:",
          error
        );

        toast.error(
          typeof error === "string"
            ? error
            : error?.message ||
                "Unable to continue with Google."
        );

      } finally {
        setIsLoginProcessing(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Google Login Error
  |--------------------------------------------------------------------------
  */

  const handleGoogleError = () => {
    toast.error(
      "Google sign-in failed. Please try again."
    );
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <section
      className="relative min-h-[calc(100vh-80px)] overflow-hidden px-4 py-12 flex items-center justify-center sm:px-6 sm:py-16 lg:px-8"
      style={{
        background: C.cream,
      }}
    >
      {/* Background Glow */}

      <div
        className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full blur-[100px]"
        style={{
          background: C.coral,
          opacity: 0.15,
        }}
      />

      <div
        className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full blur-[100px]"
        style={{
          background: C.teal,
          opacity: 0.1,
        }}
      />

      {/* Login Container */}

      <div
        className="relative z-10 mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl shadow-black/5 lg:grid-cols-[1fr_1.15fr]"
        style={{
          background: C.ivory,
          border: `1px solid ${C.paleCoral}`,
        }}
      >
        {/* Left Branding */}

        <div
          className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between"
          style={{
            background: `linear-gradient(135deg, ${C.coral}, ${C.raspberry})`,
            color: C.ivory,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />

          {/* Brand */}

          <div className="relative z-10">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl font-heading text-sm font-bold shadow-md transition-transform duration-300 group-hover:scale-105"
                style={{
                  background: C.ivory,
                  color: C.coral,
                }}
              >
                EE
              </div>

              <span
                className="font-heading text-2xl font-bold tracking-wide"
                style={{
                  color: C.ivory,
                }}
              >
                Earthen Echoes
              </span>
            </Link>
          </div>

          {/* Left Content */}

          <div className="relative z-10 py-10">
            <span
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] backdrop-blur-sm"
              style={{
                border:
                  "1px solid rgba(255,255,255,.25)",
                background:
                  "rgba(255,255,255,.12)",
                color: C.ivory,
              }}
            >
              <Sparkles size={13} />

              Artisanal Heritage
            </span>

            <h1
              className="max-w-md font-heading text-4xl font-bold leading-[1.2] xl:text-5xl"
              style={{
                color: C.ivory,
              }}
            >
              Timeless pottery,

              <span className="mt-1 block opacity-90">
                crafted for your soul.
              </span>
            </h1>

            <p
              className="mt-6 max-w-sm text-sm leading-relaxed"
              style={{
                color:
                  "rgba(253,248,243,.8)",
              }}
            >
              Log in to access your saved
              wishlist, track handcrafted
              terracotta orders, and experience
              the warmth of sustainable Indian
              artistry.
            </p>
          </div>

          <div
            className="relative z-10 flex items-center gap-2.5 text-xs font-medium"
            style={{
              color:
                "rgba(253,248,243,.75)",
            }}
          >
            <ShieldCheck size={18} />

            100% Secure & Authentic
            Terracotta Store
          </div>
        </div>

        {/* Right Login */}

        <div
          className="flex items-center justify-center p-8 sm:p-12 lg:p-16"
          style={{
            background: C.ivory,
          }}
        >
          <div className="w-full max-w-md">

            {/* Mobile Logo */}

            <div className="mb-8 flex justify-center lg:hidden">
              <Link
                to="/"
                className="flex items-center gap-2.5"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl font-heading text-xs font-bold"
                  style={{
                    background: C.coral,
                    color: C.ivory,
                  }}
                >
                  EE
                </div>

                <span
                  className="font-heading text-xl font-bold"
                  style={{
                    color: C.dark,
                  }}
                >
                  Earthen Echoes
                </span>
              </Link>
            </div>

            {/* Heading */}

            <div className="mb-8">
              <h2
                className="font-heading text-3xl font-bold tracking-tight"
                style={{
                  color: C.dark,
                }}
              >
                Welcome Back
              </h2>

              <p className="mt-2 text-sm text-neutral-600">
                Please enter your credentials
                to access your account.
              </p>
            </div>

            {/* Login Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: C.dark,
                  }}
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="h-12 w-full rounded-xl border-2 pl-12 pr-4 text-sm outline-none transition-all duration-300 focus:ring-2"
                    style={{
                      background: C.ivory,
                      color: C.dark,
                      border: `2px solid ${C.paleCoral}`,
                      boxShadow:
                        "0 2px 8px rgba(0,0,0,.03)",
                    }}
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{
                      color: C.dark,
                    }}
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium transition hover:underline"
                    style={{
                      color: C.coral,
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border-2 pl-12 pr-12 text-sm outline-none transition-all duration-300 focus:ring-2"
                    style={{
                      background: C.ivory,
                      color: C.dark,
                      border: `2px solid ${C.paleCoral}`,
                      boxShadow:
                        "0 2px 8px rgba(0,0,0,.03)",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}

              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-600 select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-[#F16937]"
                />

                Keep me signed in
              </label>

              {/* Sign In Button */}

              <button
                type="submit"
                disabled={
                  loading ||
                  googleLoading ||
                  isLoginProcessing
                }
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold shadow-md transition-all hover:opacity-95 hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: C.coral,
                  color: C.ivory,
                }}
              >
                {loading ||
                isLoginProcessing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                    {isLoginProcessing
                      ? "Signing In..."
                      : "Signing In..."}
                  </>
                ) : (
                  <>
                    Sign In

                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-neutral-200" />

              <span className="text-xs uppercase tracking-wider text-neutral-400">
                Or continue with
              </span>

              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            {/* Google Login */}

            <div className="flex min-h-[52px] w-full items-center justify-center">
              {googleLoading ||
              isLoginProcessing ? (
                <div
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 text-sm font-medium"
                  style={{
                    background: C.ivory,
                    color: C.dark,
                  }}
                >
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-[#F16937]" />

                  Signing in with Google...
                </div>
              ) : (
                <div className="flex w-full justify-center overflow-hidden rounded-xl">
                  <GoogleLogin
                    onSuccess={
                      handleGoogleSuccess
                    }
                    onError={
                      handleGoogleError
                    }
                    useOneTap={false}
                    auto_select={false}
                    theme="outline"
                    size="large"
                    text="continue_with"
                    shape="rectangular"
                    logo_alignment="left"
                    width="400"
                  />
                </div>
              )}
            </div>

            {/* Register Divider */}

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-neutral-200" />

              <span className="text-xs uppercase tracking-wider text-neutral-400">
                New to Earthen Echoes?
              </span>

              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            {/* Register */}

            <Link
              to="/user/register"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-neutral-200 text-sm font-medium transition-all hover:border-[#F16937]/50 hover:bg-[#FEF1EC]/50"
              style={{
                color: C.dark,
              }}
            >
              Create an Account
            </Link>

            {/* Back Home */}

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 transition hover:text-[#F16937]"
              >
                ← Back to Home Catalogue
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default UserLogin;