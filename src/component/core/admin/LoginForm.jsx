import { useState } from "react";

import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  error,
  setError,
  loading,
}) {
  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [showPassword, setShowPassword] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Email Change
  |--------------------------------------------------------------------------
  */

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    if (error) {
      setError("");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Password Change
  |--------------------------------------------------------------------------
  */

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (error) {
      setError("");
    }
  };

  return (
    <div
      className="
        max-w-md
        w-full
        bg-white
        p-6
        sm:p-8
        rounded-2xl
        shadow-xl
        border
        border-slate-200/80
      "
    >
      {/* ================================================================
          HEADER
      ================================================================= */}

      <div className="text-center mb-8">
        <div
          className="
            inline-flex
            items-center
            justify-center
            w-14
            h-14
            rounded-2xl
            bg-slate-950
            text-amber-500
            mb-4
            shadow-inner
            ring-4
            ring-slate-100
          "
        >
          <ShieldCheck size={28} />
        </div>

        <h2
          className="
            text-3xl
            font-bold
            text-slate-900
            tracking-tight
            font-heading
          "
        >
          Earthen Echoes
        </h2>

        <p
          className="
            text-xs
            uppercase
            tracking-[0.15em]
            text-slate-400
            mt-1.5
            font-medium
          "
        >
          Admin Control Center
        </p>
      </div>

      {/* ================================================================
          ERROR MESSAGE
      ================================================================= */}

      {error && (
        <div
          className="
            bg-red-50
            text-red-700
            p-3.5
            rounded-xl
            text-sm
            mb-5
            font-medium
            text-center
            border
            border-red-100
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <span
            className="
              w-1.5
              h-1.5
              rounded-full
              bg-red-500
            "
          />

          {error}
        </div>
      )}

      {/* ================================================================
          LOGIN FORM
      ================================================================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        noValidate
      >
        {/* ================= EMAIL ================= */}

        <div>
          <label
            htmlFor="admin-email"
            className="
              text-xs
              font-bold
              text-slate-500
              uppercase
              tracking-wider
              block
              mb-1.5
              pl-1
            "
          >
            Email
          </label>

          <div className="relative group">
            <Mail
              size={18}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-slate-400
                pointer-events-none
                transition-colors
                group-focus-within:text-slate-800
              "
            />

            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              disabled={loading}
              value={email}
              onChange={handleEmailChange}
              placeholder="admin@gmail.com"
              className="
                w-full
                pl-11
                pr-4
                py-3
                bg-slate-50/50
                border
                border-slate-200
                rounded-xl
                outline-none
                text-sm
                text-slate-800
                placeholder:text-slate-400
                transition-all
                duration-200

                focus:ring-2
                focus:ring-slate-950/20
                focus:border-slate-950
                focus:bg-white

                disabled:bg-slate-100
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            />
          </div>
        </div>

        {/* ================= PASSWORD ================= */}

        <div>
          <label
            htmlFor="admin-password"
            className="
              text-xs
              font-bold
              text-slate-500
              uppercase
              tracking-wider
              block
              mb-1.5
              pl-1
            "
          >
            Password
          </label>

          <div className="relative group">
            <Lock
              size={18}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-slate-400
                pointer-events-none
                transition-colors
                group-focus-within:text-slate-800
              "
            />

            <input
              id="admin-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              required
              autoComplete="current-password"
              disabled={loading}
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className="
                w-full
                pl-11
                pr-12
                py-3
                bg-slate-50/50
                border
                border-slate-200
                rounded-xl
                outline-none
                text-sm
                text-slate-800
                placeholder:text-slate-400
                transition-all
                duration-200

                focus:ring-2
                focus:ring-slate-950/20
                focus:border-slate-950
                focus:bg-white

                disabled:bg-slate-100
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            />

            {/* Show / Hide Password */}

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
              className="
                absolute
                right-3.5
                top-1/2
                -translate-y-1/2
                flex
                items-center
                justify-center
                text-slate-400
                hover:text-slate-700
                transition
                disabled:cursor-not-allowed
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

        {/* ================= LOGIN BUTTON ================= */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            min-h-12.5
            bg-slate-950
            text-white
            py-3.5
            rounded-xl
            font-bold
            hover:bg-slate-900
            active:scale-[0.99]
            transition-all
            duration-200
            shadow-md
            hover:shadow-lg
            disabled:opacity-60
            disabled:cursor-not-allowed
            flex
            items-center
            justify-center
            gap-2
            mt-2
          "
        >
          {loading ? (
            <>
              <Loader2
                className="animate-spin"
                size={18}
              />

              Authenticating...
            </>
          ) : (
            <>
              <ShieldCheck size={18} />

              Secure Sign In
            </>
          )}
        </button>
      </form>
    </div>
  );
}