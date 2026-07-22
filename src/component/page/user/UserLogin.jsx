import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

const UserLogin = () => {
  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
      rememberMe: false,
    });

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Handle Input
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
  | Handle Login
  |--------------------------------------------------------------------------
  |
  | Abhi UI ready hai.
  |
  | Next step me yahan:
  |
  | dispatch(loginUser({...}))
  |
  | Redux thunk connect kar sakte hain.
  |
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      console.log(
        "LOGIN DATA:",
        formData
      );

      /*
      |--------------------------------------------------------------------------
      | Temporary Demo
      |--------------------------------------------------------------------------
      |
      | Redux login implement hone ke baad remove kar dena.
      |
      */

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 800)
      );

      // Example:
      // navigate("/account");

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="
        relative
        min-h-[calc(100vh-80px)]
        overflow-hidden
        bg-[#fbf7f2]
        px-4
        py-12
        sm:px-6
        sm:py-16
        lg:px-8
      "
    >
      {/* ================================================================
          DECORATIVE BACKGROUND
      ================================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-24
          top-20
          h-72
          w-72
          rounded-full
          bg-[#b45a2b]/8
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          bottom-10
          h-80
          w-80
          rounded-full
          bg-[#d9a77d]/10
          blur-3xl
        "
      />

      {/* ================================================================
          LOGIN CONTAINER
      ================================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          grid
          w-full
          max-w-5xl
          overflow-hidden
          rounded-[28px]
          border
          border-[#eadfd5]
          bg-white
          shadow-[0_25px_70px_rgba(88,55,40,0.10)]
          lg:grid-cols-[0.9fr_1.1fr]
        "
      >
        {/* ================================================================
            LEFT BRAND PANEL
        ================================================================= */}

        <div
          className="
            relative
            hidden
            overflow-hidden
            bg-[#a94f27]
            p-10
            text-white
            lg:flex
            lg:flex-col
            lg:justify-between
          "
        >
          {/* Decorative circles */}

          <div
            className="
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              border
              border-white/10
            "
          />

          <div
            className="
              absolute
              -right-10
              top-10
              h-48
              w-48
              rounded-full
              border
              border-white/10
            "
          />

          <div
            className="
              absolute
              -bottom-20
              -left-20
              h-64
              w-64
              rounded-full
              bg-white/5
            "
          />

          {/* Logo */}

          <div className="relative z-10">
            <Link
              to="/"
              className="
                inline-flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-[#fff8f2]
                  font-heading
                  text-sm
                  font-bold
                  text-[#a94f27]
                  shadow-sm
                "
              >
                EE
              </div>

              <span
                className="
                  font-heading
                  text-xl
                  font-bold
                "
              >
                Earthen Echoes
              </span>
            </Link>
          </div>

          {/* Main content */}

          <div
            className="
              relative
              z-10
              py-14
            "
          >
            <span
              className="
                mb-5
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/20
                bg-white/10
                px-4
                py-2
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.16em]
              "
            >
              <ShoppingBag size={14} />

              Crafted with Tradition
            </span>

            <h2
              className="
                max-w-sm
                font-heading
                text-4xl
                font-bold
                leading-[1.15]
                xl:text-5xl
              "
            >
              Welcome Back to
              <span className="block">
                Earthen Elegance.
              </span>
            </h2>

            <p
              className="
                mt-5
                max-w-sm
                text-sm
                leading-7
                text-white/75
              "
            >
              Sign in to discover handcrafted
              terracotta creations, manage your
              orders and continue your journey
              through timeless Indian artistry.
            </p>
          </div>

          {/* Bottom */}

          <div
            className="
              relative
              z-10
              flex
              items-center
              gap-2
              text-xs
              text-white/70
            "
          >
            <ShieldCheck size={16} />

            Secure & trusted shopping experience
          </div>
        </div>

        {/* ================================================================
            RIGHT LOGIN FORM
        ================================================================= */}

        <div
          className="
            flex
            items-center
            justify-center
            p-6
            sm:p-10
            lg:p-14
          "
        >
          <div
            className="
              w-full
              max-w-md
            "
          >
            {/* Mobile Logo */}

            <div
              className="
                mb-8
                flex
                justify-center
                lg:hidden
              "
            >
              <Link
                to="/"
                className="
                  flex
                  items-center
                  gap-2.5
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-[#ad542b]
                    font-heading
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  EE
                </div>

                <span
                  className="
                    font-heading
                    text-xl
                    font-bold
                    text-[#55392f]
                  "
                >
                  Earthen Echoes
                </span>
              </Link>
            </div>

            {/* Heading */}

            <div className="mb-8">
              <p
                className="
                  mb-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[#b45a2b]
                "
              >
                Welcome Back
              </p>

              <h1
                className="
                  font-heading
                  text-3xl
                  font-bold
                  text-[#51362e]
                  sm:text-4xl
                "
              >
                Sign in to your account
              </h1>

              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-[#8b776d]
                "
              >
                Enter your details below to
                continue shopping with Earthen
                Echoes.
              </p>
            </div>

            {/* ============================================================
                FORM
            ============================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[#60483e]
                  "
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-[#a68e82]
                    "
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="
                      h-13
                      w-full
                      rounded-xl
                      border
                      border-[#e6dcd5]
                      bg-[#fdfbf9]
                      pl-12
                      pr-4
                      text-sm
                      text-[#51362e]
                      outline-none
                      transition-all
                      placeholder:text-[#b8aaa2]

                      focus:border-[#ad542b]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#ad542b]/10
                    "
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <label
                    htmlFor="password"
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-[#60483e]
                    "
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="
                      text-xs
                      font-semibold
                      text-[#ad542b]
                      transition
                      hover:text-[#8f3f1e]
                    "
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-[#a68e82]
                    "
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
                    placeholder="Enter your password"
                    className="
                      h-13
                      w-full
                      rounded-xl
                      border
                      border-[#e6dcd5]
                      bg-[#fdfbf9]
                      pl-12
                      pr-12
                      text-sm
                      text-[#51362e]
                      outline-none
                      transition-all
                      placeholder:text-[#b8aaa2]

                      focus:border-[#ad542b]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#ad542b]/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-[#a68e82]
                      transition
                      hover:text-[#ad542b]
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember */}

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-2.5
                  text-sm
                  text-[#766159]
                "
              >
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={
                    formData.rememberMe
                  }
                  onChange={handleChange}
                  className="
                    h-4
                    w-4
                    cursor-pointer
                    accent-[#ad542b]
                  "
                />

                Keep me signed in
              </label>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  flex
                  h-13
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#ad542b]
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_8px_20px_rgba(173,84,43,0.20)]
                  transition-all

                  hover:bg-[#98451f]
                  hover:shadow-[0_10px_25px_rgba(173,84,43,0.28)]

                  active:scale-[0.99]

                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                )}
              </button>
            </form>

            {/* Divider */}

            <div
              className="
                my-7
                flex
                items-center
                gap-4
              "
            >
              <div
                className="
                  h-px
                  flex-1
                  bg-[#eee5df]
                "
              />

              <span
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-[#aa9b92]
                "
              >
                New here?
              </span>

              <div
                className="
                  h-px
                  flex-1
                  bg-[#eee5df]
                "
              />
            </div>

            {/* Register */}

            <Link
              to="/register"
              className="
                flex
                h-13
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-[#d8c9c0]
                bg-white
                text-sm
                font-semibold
                text-[#60483e]
                transition-all

                hover:border-[#ad542b]
                hover:bg-[#fff9f5]
                hover:text-[#ad542b]
              "
            >
              Create an Account
            </Link>

            {/* Security */}

            <div
              className="
                mt-7
                flex
                items-center
                justify-center
                gap-2
                text-center
                text-xs
                text-[#9b8980]
              "
            >
              <ShieldCheck
                size={15}
                className="text-[#ad542b]"
              />

              Your information is securely
              protected
            </div>

            {/* Back Home */}

            <div className="mt-5 text-center">
              <Link
                to="/"
                className="
                  text-xs
                  font-medium
                  text-[#8a756b]
                  transition
                  hover:text-[#ad542b]
                "
              >
                ← Back to Earthen Echoes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserLogin;