import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  GoogleLogin,
} from "@react-oauth/google";

import toast from "react-hot-toast";

import {
  loginUser,
  googleLoginUser,
} from "../../../redux/thunks/userAuthThunk";

import {
  clearUserAuthError,
  selectUser,
  selectUserAuthenticated,
  selectUserAuthLoading,
  selectGoogleAuthLoading,
} from "../../../redux/slices/userAuthSlice";


const UserLogin = () => {

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();


  /*
  |--------------------------------------------------------------------------
  | Redux State
  |--------------------------------------------------------------------------
  */

  const user =
    useSelector(
      selectUser
    );

  const isAuthenticated =
    useSelector(
      selectUserAuthenticated
    );

  const loading =
    useSelector(
      selectUserAuthLoading
    );

  const googleLoading =
    useSelector(
      selectGoogleAuthLoading
    );


  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  */

  const [
    formData,
    setFormData,
  ] = useState({

    email:
      localStorage.getItem(
        "rememberUserEmail"
      ) || "",

    password: "",

    rememberMe:
      Boolean(
        localStorage.getItem(
          "rememberUserEmail"
        )
      ),

  });


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Redirect Logged-In User
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (
      isAuthenticated &&
      user
    ) {

      navigate(
        "/",
        {
          replace: true,
        }
      );

    }

  }, [
    isAuthenticated,
    user,
    navigate,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Clear Old Authentication Error
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    dispatch(
      clearUserAuthError()
    );

  }, [dispatch]);


  /*
  |--------------------------------------------------------------------------
  | Handle Input Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (
    e
  ) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;


    setFormData(
      (prev) => ({

        ...prev,

        [name]:
          type === "checkbox"
            ? checked
            : value,

      })
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Email / Password Login
  |--------------------------------------------------------------------------
  */

  const handleSubmit =
    async (
      e
    ) => {

      e.preventDefault();


      /*
      |--------------------------------------------------------------------------
      | Prevent Duplicate Request
      |--------------------------------------------------------------------------
      */

      if (
        loading ||
        googleLoading
      ) {

        return;

      }


      /*
      |--------------------------------------------------------------------------
      | Normalize Values
      |--------------------------------------------------------------------------
      */

      const email =
        formData.email
          .trim()
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


      if (
        !emailRegex.test(
          email
        )
      ) {

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


      /*
      |--------------------------------------------------------------------------
      | Clear Previous Error
      |--------------------------------------------------------------------------
      */

      dispatch(
        clearUserAuthError()
      );


      try {

        /*
        |--------------------------------------------------------------------------
        | Redux Login
        |--------------------------------------------------------------------------
        |
        | Flow:
        |
        | UserLogin
        |     ↓
        | loginUser thunk
        |     ↓
        | UserAuthService.login()
        |     ↓
        | POST /auth/login
        |     ↓
        | userAuthSlice
        |     ↓
        | Redux + LocalStorage
        |
        */

        const result =
          await dispatch(

            loginUser({

              email,

              password,

            })

          ).unwrap();


        /*
        |--------------------------------------------------------------------------
        | Remember Email
        |--------------------------------------------------------------------------
        */

        if (
          formData.rememberMe
        ) {

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
        | Notify Components
        |--------------------------------------------------------------------------
        */

        window.dispatchEvent(

          new Event(
            "userAuthChanged"
          )

        );


        /*
        |--------------------------------------------------------------------------
        | Success Toast
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
        | Redirect
        |--------------------------------------------------------------------------
        */

        navigate(
          "/",
          {
            replace: true,
          }
        );

      } catch (error) {

        console.error(
          "USER LOGIN ERROR:",
          error
        );


        toast.error(

          typeof error ===
            "string"

            ? error

            : error?.message ||
              "Unable to login. Please try again."

        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Google Login Success
  |--------------------------------------------------------------------------
  */

  const handleGoogleSuccess =
    async (
      credentialResponse
    ) => {

      /*
      |--------------------------------------------------------------------------
      | Prevent Duplicate Request
      |--------------------------------------------------------------------------
      */

      if (
        googleLoading ||
        loading
      ) {

        return;

      }


      /*
      |--------------------------------------------------------------------------
      | Google ID Token
      |--------------------------------------------------------------------------
      */

      const credential =
        credentialResponse
          ?.credential;


      if (!credential) {

        toast.error(
          "Google credential was not received."
        );

        return;

      }


      dispatch(
        clearUserAuthError()
      );


      try {

        /*
        |--------------------------------------------------------------------------
        | Redux Google Authentication
        |--------------------------------------------------------------------------
        |
        | GoogleLogin
        |     ↓
        | credential
        |     ↓
        | googleLoginUser(credential)
        |     ↓
        | UserAuthService.googleLogin()
        |     ↓
        | POST /auth/google
        |     ↓
        | Backend verifies Google token
        |     ↓
        | JWT + User
        |     ↓
        | userAuthSlice saves session
        |
        */

        const result =
          await dispatch(

            googleLoginUser(
              credential
            )

          ).unwrap();


        /*
        |--------------------------------------------------------------------------
        | Close Google Signup Prompt Permanently
        |--------------------------------------------------------------------------
        */

        localStorage.setItem(
          "googleSignupPromptClosed",
          "true"
        );


        /*
        |--------------------------------------------------------------------------
        | Notify Header / Other Components
        |--------------------------------------------------------------------------
        */

        window.dispatchEvent(

          new Event(
            "userAuthChanged"
          )

        );


        /*
        |--------------------------------------------------------------------------
        | Success Toast
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
        | Redirect Home
        |--------------------------------------------------------------------------
        */

        navigate(
          "/",
          {
            replace: true,
          }
        );

      } catch (error) {

        console.error(
          "GOOGLE LOGIN ERROR:",
          error
        );


        toast.error(

          typeof error ===
            "string"

            ? error

            : error?.message ||
              "Unable to continue with Google."

        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Google Login Error
  |--------------------------------------------------------------------------
  */

  const handleGoogleError =
    () => {

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
      className="
        relative
        min-h-[calc(100vh-80px)]
        overflow-hidden
        bg-background
        px-4
        py-12
        flex
        items-center
        justify-center
        sm:px-6
        sm:py-16
        lg:px-8
      "
    >

      {/* Background Decoration */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-10
          h-96
          w-96
          rounded-full
          bg-primary/15
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-10
          h-96
          w-96
          rounded-full
          bg-tertiary/10
          blur-[100px]
        "
      />


      {/* Login Container */}

      <div
        className="
          relative
          z-10
          mx-auto
          grid
          w-full
          max-w-5xl
          overflow-hidden
          rounded-3xl
          border
          border-border/80
          bg-card
          shadow-2xl
          shadow-black/5
          lg:grid-cols-[1fr_1.15fr]
        "
      >

        {/* Left Side */}

        <div
          className="
            relative
            hidden
            overflow-hidden
            bg-primary
            p-12
            text-primary-foreground
            lg:flex
            lg:flex-col
            lg:justify-between
          "
        >

          <div
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]
            "
          />

          <div
            className="
              absolute
              -right-20
              -top-20
              h-72
              w-72
              rounded-full
              border
              border-primary-foreground/10
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
              bg-primary-foreground/5
            "
          />


          {/* Brand */}

          <div
            className="
              relative
              z-10
            "
          >

            <Link
              to="/"
              className="
                group
                inline-flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-primary-foreground
                  font-heading
                  text-sm
                  font-bold
                  text-primary
                  shadow-md
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              >
                EE
              </div>

              <span
                className="
                  font-heading
                  text-2xl
                  font-bold
                  tracking-wide
                  text-primary-foreground
                "
              >
                Earthen Echoes
              </span>

            </Link>

          </div>


          {/* Left Content */}

          <div
            className="
              relative
              z-10
              py-10
            "
          >

            <span
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-primary-foreground/20
                bg-primary-foreground/10
                px-4
                py-1.5
                text-xs
                font-medium
                uppercase
                tracking-[0.2em]
                text-primary-foreground
                backdrop-blur-sm
              "
            >

              <Sparkles
                size={13}
              />

              Artisanal Heritage

            </span>


            <h1
              className="
                max-w-md
                font-heading
                text-4xl
                font-bold
                leading-[1.2]
                text-primary-foreground
                xl:text-5xl
              "
            >

              Timeless pottery,

              <span
                className="
                  mt-1
                  block
                  text-primary-foreground/90
                "
              >
                crafted for your soul.
              </span>

            </h1>


            <p
              className="
                mt-6
                max-w-sm
                text-sm
                leading-relaxed
                text-primary-foreground/80
              "
            >
              Log in to access your saved wishlist,
              track handcrafted terracotta orders,
              and experience the warmth of sustainable
              Indian artistry.
            </p>

          </div>


          <div
            className="
              relative
              z-10
              flex
              items-center
              gap-2.5
              text-xs
              font-medium
              text-primary-foreground/75
            "
          >

            <ShieldCheck
              size={18}
              className="
                text-primary-foreground
              "
            />

            100% Secure & Authentic Terracotta Store

          </div>

        </div>


        {/* Right Login Section */}

        <div
          className="
            flex
            items-center
            justify-center
            bg-card
            p-8
            sm:p-12
            lg:p-16
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
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    bg-primary
                    font-heading
                    text-xs
                    font-bold
                    text-primary-foreground
                  "
                >
                  EE
                </div>

                <span
                  className="
                    font-heading
                    text-xl
                    font-bold
                    text-foreground
                  "
                >
                  Earthen Echoes
                </span>

              </Link>

            </div>


            {/* Heading */}

            <div
              className="
                mb-8
              "
            >

              <h2
                className="
                  !text-3xl
                  font-heading
                  font-bold
                  tracking-tight
                  !text-foreground
                "
              >
                Welcome Back
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  text-muted-foreground
                "
              >
                Please enter your credentials to access
                your account.
              </p>

            </div>


            {/* Login Form */}

            <form
              onSubmit={
                handleSubmit
              }
              className="
                space-y-5
              "
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
                    text-foreground/80
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
                      text-muted-foreground
                    "
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="name@example.com"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-input
                      bg-background
                      pl-12
                      pr-4
                      text-sm
                      text-foreground
                      outline-none
                      transition-all
                      placeholder:text-muted-foreground/50
                      focus:border-primary
                      focus:bg-card
                      focus:ring-2
                      focus:ring-primary/20
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
                      text-foreground/80
                    "
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="
                      text-xs
                      font-medium
                      text-primary
                      transition
                      hover:underline
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
                      text-muted-foreground
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
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="••••••••"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-input
                      bg-background
                      pl-12
                      pr-12
                      text-sm
                      text-foreground
                      outline-none
                      transition-all
                      placeholder:text-muted-foreground/50
                      focus:border-primary
                      focus:bg-card
                      focus:ring-2
                      focus:ring-primary/20
                    "
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) =>
                          !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-muted-foreground
                      transition
                      hover:text-foreground
                    "
                  >

                    {
                      showPassword
                        ? (
                          <EyeOff
                            size={18}
                          />
                        )
                        : (
                          <Eye
                            size={18}
                          />
                        )
                    }

                  </button>

                </div>

              </div>


              {/* Remember Me */}

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-2.5
                  text-sm
                  text-muted-foreground
                  select-none
                "
              >

                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={
                    formData.rememberMe
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    h-4
                    w-4
                    cursor-pointer
                    rounded
                    border-input
                    accent-primary
                  "
                />

                Keep me signed in

              </label>


              {/* Login Button */}

              <button
                type="submit"
                disabled={
                  loading ||
                  googleLoading
                }
                className="
                  group
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-primary
                  px-5
                  text-sm
                  font-semibold
                  text-primary-foreground
                  shadow-md
                  transition-all
                  hover:opacity-95
                  hover:shadow-lg
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {
                  loading
                    ? (
                      <>
                        <span
                          className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-primary-foreground/40
                            border-t-primary-foreground
                          "
                        />

                        Signing In...
                      </>
                    )
                    : (
                      <>
                        Sign In

                        <ArrowRight
                          size={17}
                          className="
                            transition-transform
                            group-hover:translate-x-1
                          "
                        />
                      </>
                    )
                }

              </button>

            </form>


            {/* Divider */}

            <div
              className="
                my-6
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  h-px
                  flex-1
                  bg-border
                "
              />

              <span
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-muted-foreground
                "
              >
                Or continue with
              </span>

              <div
                className="
                  h-px
                  flex-1
                  bg-border
                "
              />

            </div>


            {/* Google Login */}

            <div
              className="
                flex
                min-h-[52px]
                w-full
                items-center
                justify-center
              "
            >

              {
                googleLoading
                  ? (

                    <div
                      className="
                        flex
                        h-12
                        w-full
                        items-center
                        justify-center
                        gap-3
                        rounded-xl
                        border
                        border-border
                        bg-background
                        text-sm
                        font-medium
                        text-foreground
                      "
                    >

                      <span
                        className="
                          h-5
                          w-5
                          animate-spin
                          rounded-full
                          border-2
                          border-border
                          border-t-primary
                        "
                      />

                      Signing in with Google...

                    </div>

                  )
                  : (

                    <div
                      className="
                        flex
                        w-full
                        justify-center
                        overflow-hidden
                        rounded-xl
                      "
                    >

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

                  )
              }

            </div>


            {/* Register Divider */}

            <div
              className="
                my-6
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  h-px
                  flex-1
                  bg-border
                "
              />

              <span
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-muted-foreground
                "
              >
                New to Earthen Echoes?
              </span>

              <div
                className="
                  h-px
                  flex-1
                  bg-border
                "
              />

            </div>


            {/* Register */}

            <Link
              to="/user/register"
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-border
                bg-background
                text-sm
                font-medium
                text-foreground
                transition-all
                hover:border-primary/50
                hover:bg-secondary/40
                hover:text-primary
              "
            >
              Create an Account
            </Link>


            {/* Back Home */}

            <div
              className="
                mt-6
                text-center
              "
            >

              <Link
                to="/"
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  text-xs
                  font-medium
                  text-muted-foreground
                  transition
                  hover:text-primary
                "
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