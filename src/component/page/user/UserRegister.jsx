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


const UserRegister = () => {

  const navigate = useNavigate();


  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  */

  const [
    formData,
    setFormData,
  ] = useState({
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

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    agreeTerms,
    setAgreeTerms,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    isGoogleLoading,
    setIsGoogleLoading,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Handle Input Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData(
      (prev) => ({
        ...prev,

        [name]:
          name === "email"
            ? value.toLowerCase()
            : value,
      })
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Validate Form
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {

    const name =
      formData.name.trim();

    const email =
      formData.email
        .trim()
        .toLowerCase();

    const phone =
      formData.phone.trim();

    const password =
      formData.password;

    const confirmPassword =
      formData.confirmPassword;


    /*
    |--------------------------------------------------------------------------
    | Name Validation
    |--------------------------------------------------------------------------
    */

    if (!name) {

      toast.error(
        "Please enter your full name."
      );

      return false;

    }


    if (name.length < 2) {

      toast.error(
        "Name must be at least 2 characters."
      );

      return false;

    }


    /*
    |--------------------------------------------------------------------------
    | Email Validation
    |--------------------------------------------------------------------------
    */

    if (!email) {

      toast.error(
        "Please enter your email address."
      );

      return false;

    }


    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailRegex.test(email)
    ) {

      toast.error(
        "Please enter a valid email address."
      );

      return false;

    }


    /*
    |--------------------------------------------------------------------------
    | Phone Validation
    |--------------------------------------------------------------------------
    */

    if (!phone) {

      toast.error(
        "Please enter your phone number."
      );

      return false;

    }


    const phoneRegex =
      /^[6-9]\d{9}$/;


    if (
      !phoneRegex.test(phone)
    ) {

      toast.error(
        "Please enter a valid 10 digit mobile number."
      );

      return false;

    }


    /*
    |--------------------------------------------------------------------------
    | Password Validation
    |--------------------------------------------------------------------------
    */

    if (!password) {

      toast.error(
        "Please enter a password."
      );

      return false;

    }


    if (
      password.length < 6
    ) {

      toast.error(
        "Password must be at least 6 characters."
      );

      return false;

    }


    /*
    |--------------------------------------------------------------------------
    | Confirm Password
    |--------------------------------------------------------------------------
    */

    if (
      password !==
      confirmPassword
    ) {

      toast.error(
        "Passwords do not match."
      );

      return false;

    }


    /*
    |--------------------------------------------------------------------------
    | Terms
    |--------------------------------------------------------------------------
    */

    if (!agreeTerms) {

      toast.error(
        "Please accept the Terms & Conditions."
      );

      return false;

    }


    return true;

  };


  /*
  |--------------------------------------------------------------------------
  | Handle Normal Register
  |--------------------------------------------------------------------------
  */

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      if (
        !validateForm()
      ) {

        return;

      }


      try {

        setIsLoading(true);


        /*
        |--------------------------------------------------------------------------
        | Prepare Register Data
        |--------------------------------------------------------------------------
        */

        const registerData = {

          name:
            formData.name.trim(),

          email:
            formData.email
              .trim()
              .toLowerCase(),

          phone:
            formData.phone.trim(),

          password:
            formData.password,

        };


        console.log(
          "REGISTER DATA:",
          registerData
        );


        /*
        |--------------------------------------------------------------------------
        | API / Redux Integration
        |--------------------------------------------------------------------------
        |
        | Redux thunk ready hone ke baad:
        |
        | const result = await dispatch(
        |   registerUser(registerData)
        | ).unwrap();
        |
        */


        /*
        |--------------------------------------------------------------------------
        | Temporary Demo Delay
        |--------------------------------------------------------------------------
        */

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1000
            )
        );


        toast.success(
          "Account created successfully."
        );


        /*
        |--------------------------------------------------------------------------
        | Redirect Login
        |--------------------------------------------------------------------------
        */

        navigate(
          "/user/login"
        );


      } catch (error) {

        console.error(
          "REGISTER ERROR:",
          error
        );


        toast.error(

          error?.response
            ?.data
            ?.message ||

          error?.message ||

          "Unable to create account."

        );


      } finally {

        setIsLoading(false);

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Continue With Google
  |--------------------------------------------------------------------------
  */

  const handleGoogleRegister =
    async () => {

      if (
        isGoogleLoading
      ) {

        return;

      }


      try {

        setIsGoogleLoading(
          true
        );


        /*
        |--------------------------------------------------------------------------
        | Google OAuth
        |--------------------------------------------------------------------------
        |
        | Actual Google authentication
        | next step me yahan integrate hoga.
        |
        | Flow:
        |
        | Google Account
        |       ↓
        | Google Credential
        |       ↓
        | Backend /auth/google
        |       ↓
        | JWT Token + User
        |       ↓
        | Redux / localStorage
        |       ↓
        | User Dashboard
        |
        */


        console.log(
          "Continue with Google clicked"
        );


        /*
        |--------------------------------------------------------------------------
        | Temporary Message
        |--------------------------------------------------------------------------
        */

        toast(
          "Google authentication will be connected here."
        );


      } catch (error) {

        console.error(
          "GOOGLE REGISTER ERROR:",
          error
        );


        toast.error(
          "Unable to continue with Google."
        );


      } finally {

        setIsGoogleLoading(
          false
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <div
      className="
        min-h-[calc(100vh-80px)]

        bg-background

        flex
        items-center
        justify-center

        px-4
        sm:px-6

        py-10
        lg:py-16
      "
    >

      <div
        className="
          w-full
          max-w-6xl

          grid
          lg:grid-cols-[0.9fr_1.1fr]

          bg-card

          border
          border-border

          rounded-[28px]

          overflow-hidden

          shadow-2xl
          shadow-primary/10
        "
      >


        {/* ================================================================
            LEFT SECTION
        ================================================================= */}

        <div
          className="
            hidden
            lg:flex

            relative
            overflow-hidden

            bg-primary
            text-primary-foreground

            p-12

            flex-col
            justify-between
          "
        >


          {/* Decorative Circle */}

          <div
            className="
              absolute
              -top-24
              -right-24

              w-72
              h-72

              rounded-full

              bg-secondary/20
            "
          />


          <div
            className="
              absolute
              -bottom-32
              -left-24

              w-80
              h-80

              rounded-full

              bg-background/10
            "
          />


          <div
            className="
              absolute

              top-1/3
              right-10

              w-32
              h-32

              rounded-full

              border
              border-primary-foreground/20
            "
          />


          {/* ================================================================
              BRAND
          ================================================================= */}

          <div
            className="
              relative
              z-10
            "
          >

            <Link
              to="/"

              className="
                inline-flex
                items-center

                gap-3

                mb-16
              "
            >

              <div
                className="
                  w-12
                  h-12

                  rounded-full

                  bg-primary-foreground
                  text-primary

                  flex
                  items-center
                  justify-center

                  font-heading
                  font-bold

                  text-lg

                  shadow-lg
                "
              >

                EE

              </div>


              <div>

                <p
                  className="
                    font-heading

                    text-xl

                    font-bold
                  "
                >

                  Earthen Echoes

                </p>


                <p
                  className="
                    text-xs

                    text-primary-foreground/70

                    tracking-wider
                  "
                >

                  HANDCRAFTED WITH SOUL

                </p>

              </div>

            </Link>


            {/* ================================================================
                HERO CONTENT
            ================================================================= */}

            <div
              className="
                max-w-md
              "
            >

              <span
                className="
                  inline-flex

                  px-4
                  py-2

                  rounded-full

                  bg-primary-foreground/10

                  border
                  border-primary-foreground/20

                  text-xs
                  font-semibold

                  uppercase

                  tracking-widest

                  mb-6
                "
              >

                Join Our Community

              </span>


              <h1
                className="
                  font-heading

                  text-4xl
                  xl:text-5xl

                  font-bold

                  leading-tight

                  mb-5
                "
              >

                Bring timeless
                craftsmanship
                into your home.

              </h1>


              <p
                className="
                  text-primary-foreground/75

                  leading-7

                  text-sm
                "
              >

                Create your account and
                discover authentic handcrafted
                terracotta pieces made by
                skilled Indian artisans.

              </p>

            </div>

          </div>


          {/* ================================================================
              FEATURES
          ================================================================= */}

          <div
            className="
              relative
              z-10

              grid
              grid-cols-3

              gap-4

              mt-12
            "
          >

            <div>

              <ShieldCheck
                size={23}
                className="mb-3"
              />

              <p
                className="
                  text-sm
                  font-semibold
                "
              >

                Secure

              </p>

              <p
                className="
                  text-[11px]

                  text-primary-foreground/60

                  mt-1
                "
              >

                Safe account

              </p>

            </div>


            <div>

              <PackageCheck
                size={23}
                className="mb-3"
              />

              <p
                className="
                  text-sm
                  font-semibold
                "
              >

                Orders

              </p>

              <p
                className="
                  text-[11px]

                  text-primary-foreground/60

                  mt-1
                "
              >

                Easy tracking

              </p>

            </div>


            <div>

              <Heart
                size={23}
                className="mb-3"
              />

              <p
                className="
                  text-sm
                  font-semibold
                "
              >

                Wishlist

              </p>

              <p
                className="
                  text-[11px]

                  text-primary-foreground/60

                  mt-1
                "
              >

                Save favorites

              </p>

            </div>

          </div>

        </div>


        {/* ================================================================
            RIGHT SECTION
        ================================================================= */}

        <div
          className="
            px-5
            py-8

            sm:p-10
            lg:p-12
            xl:p-14
          "
        >

          <div
            className="
              max-w-xl
              mx-auto
            "
          >


            {/* ================================================================
                MOBILE LOGO
            ================================================================= */}

            <Link
              to="/"

              className="
                lg:hidden

                flex
                items-center
                justify-center

                gap-3

                mb-8
              "
            >

              <div
                className="
                  w-11
                  h-11

                  rounded-full

                  bg-primary
                  text-primary-foreground

                  flex
                  items-center
                  justify-center

                  font-heading
                  font-bold
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


            {/* ================================================================
                HEADING
            ================================================================= */}

            <div
              className="
                mb-8
              "
            >

              <p
                className="
                  text-primary

                  text-xs

                  uppercase

                  tracking-[0.2em]

                  font-semibold

                  mb-3
                "
              >

                Create Account

              </p>


              <h2
                className="
                  !text-3xl
                  sm:!text-4xl

                  font-heading
                  font-bold

                  !text-foreground

                  mb-3
                "
              >

                Join Earthen Echoes

              </h2>


              <p
                className="
                  text-muted-foreground

                  text-sm

                  leading-6
                "
              >

                Create an account to enjoy a
                smoother shopping experience.

              </p>

            </div>


            {/* ================================================================
                FORM
            ================================================================= */}

            <form
              onSubmit={
                handleSubmit
              }

              className="
                space-y-5
              "
            >


              {/* ================================================================
                  FULL NAME
              ================================================================= */}

              <div>

                <label
                  htmlFor="name"

                  className="
                    block

                    text-sm
                    font-semibold

                    text-foreground

                    mb-2
                  "
                >

                  Full Name

                </label>


                <div
                  className="
                    relative
                  "
                >

                  <User
                    size={18}

                    className="
                      absolute

                      left-4
                      top-1/2

                      -translate-y-1/2

                      text-muted-foreground
                    "
                  />


                  <input
                    id="name"

                    type="text"

                    name="name"

                    value={
                      formData.name
                    }

                    onChange={
                      handleChange
                    }

                    placeholder="Enter your full name"

                    autoComplete="name"

                    disabled={
                      isLoading ||
                      isGoogleLoading
                    }

                    className="
                      w-full

                      h-12

                      pl-12
                      pr-4

                      rounded-xl

                      border
                      border-input

                      bg-background

                      text-foreground
                      text-sm

                      outline-none

                      transition

                      placeholder:text-muted-foreground/70

                      focus:border-primary

                      focus:ring-2
                      focus:ring-primary/15

                      disabled:opacity-60
                    "
                  />

                </div>

              </div>


              {/* ================================================================
                  EMAIL + PHONE
              ================================================================= */}

              <div
                className="
                  grid
                  sm:grid-cols-2

                  gap-5
                "
              >


                {/* Email */}

                <div>

                  <label
                    htmlFor="email"

                    className="
                      block

                      text-sm
                      font-semibold

                      text-foreground

                      mb-2
                    "
                  >

                    Email Address

                  </label>


                  <div
                    className="
                      relative
                    "
                  >

                    <Mail
                      size={18}

                      className="
                        absolute

                        left-4
                        top-1/2

                        -translate-y-1/2

                        text-muted-foreground
                      "
                    />


                    <input
                      id="email"

                      type="email"

                      name="email"

                      value={
                        formData.email
                      }

                      onChange={
                        handleChange
                      }

                      placeholder="you@example.com"

                      autoComplete="email"

                      disabled={
                        isLoading ||
                        isGoogleLoading
                      }

                      className="
                        w-full

                        h-12

                        pl-12
                        pr-4

                        rounded-xl

                        border
                        border-input

                        bg-background

                        text-foreground
                        text-sm

                        outline-none

                        transition

                        placeholder:text-muted-foreground/70

                        focus:border-primary

                        focus:ring-2
                        focus:ring-primary/15

                        disabled:opacity-60
                      "
                    />

                  </div>

                </div>


                {/* Phone */}

                <div>

                  <label
                    htmlFor="phone"

                    className="
                      block

                      text-sm
                      font-semibold

                      text-foreground

                      mb-2
                    "
                  >

                    Phone Number

                  </label>


                  <div
                    className="
                      relative
                    "
                  >

                    <Phone
                      size={18}

                      className="
                        absolute

                        left-4
                        top-1/2

                        -translate-y-1/2

                        text-muted-foreground
                      "
                    />


                    <input
                      id="phone"

                      type="tel"

                      name="phone"

                      value={
                        formData.phone
                      }

                      onChange={
                        handleChange
                      }

                      placeholder="9876543210"

                      maxLength={10}

                      inputMode="numeric"

                      autoComplete="tel"

                      disabled={
                        isLoading ||
                        isGoogleLoading
                      }

                      className="
                        w-full

                        h-12

                        pl-12
                        pr-4

                        rounded-xl

                        border
                        border-input

                        bg-background

                        text-foreground
                        text-sm

                        outline-none

                        transition

                        placeholder:text-muted-foreground/70

                        focus:border-primary

                        focus:ring-2
                        focus:ring-primary/15

                        disabled:opacity-60
                      "
                    />

                  </div>

                </div>

              </div>


              {/* ================================================================
                  PASSWORD + CONFIRM PASSWORD
              ================================================================= */}

              <div
                className="
                  grid
                  sm:grid-cols-2

                  gap-5
                "
              >


                {/* Password */}

                <div>

                  <label
                    htmlFor="password"

                    className="
                      block

                      text-sm
                      font-semibold

                      text-foreground

                      mb-2
                    "
                  >

                    Password

                  </label>


                  <div
                    className="
                      relative
                    "
                  >

                    <LockKeyhole
                      size={18}

                      className="
                        absolute

                        left-4
                        top-1/2

                        -translate-y-1/2

                        text-muted-foreground
                      "
                    />


                    <input
                      id="password"

                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }

                      name="password"

                      value={
                        formData.password
                      }

                      onChange={
                        handleChange
                      }

                      placeholder="Minimum 6 characters"

                      autoComplete="new-password"

                      disabled={
                        isLoading ||
                        isGoogleLoading
                      }

                      className="
                        w-full

                        h-12

                        pl-12
                        pr-12

                        rounded-xl

                        border
                        border-input

                        bg-background

                        text-foreground
                        text-sm

                        outline-none

                        transition

                        placeholder:text-muted-foreground/70

                        focus:border-primary

                        focus:ring-2
                        focus:ring-primary/15

                        disabled:opacity-60
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

                      className="
                        absolute

                        right-4
                        top-1/2

                        -translate-y-1/2

                        text-muted-foreground

                        hover:text-primary

                        transition
                      "

                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
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


                {/* Confirm Password */}

                <div>

                  <label
                    htmlFor="confirmPassword"

                    className="
                      block

                      text-sm
                      font-semibold

                      text-foreground

                      mb-2
                    "
                  >

                    Confirm Password

                  </label>


                  <div
                    className="
                      relative
                    "
                  >

                    <LockKeyhole
                      size={18}

                      className="
                        absolute

                        left-4
                        top-1/2

                        -translate-y-1/2

                        text-muted-foreground
                      "
                    />


                    <input
                      id="confirmPassword"

                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }

                      name="confirmPassword"

                      value={
                        formData
                          .confirmPassword
                      }

                      onChange={
                        handleChange
                      }

                      placeholder="Re-enter password"

                      autoComplete="new-password"

                      disabled={
                        isLoading ||
                        isGoogleLoading
                      }

                      className="
                        w-full

                        h-12

                        pl-12
                        pr-12

                        rounded-xl

                        border
                        border-input

                        bg-background

                        text-foreground
                        text-sm

                        outline-none

                        transition

                        placeholder:text-muted-foreground/70

                        focus:border-primary

                        focus:ring-2
                        focus:ring-primary/15

                        disabled:opacity-60
                      "
                    />


                    <button
                      type="button"

                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) =>
                            !prev
                        )
                      }

                      className="
                        absolute

                        right-4
                        top-1/2

                        -translate-y-1/2

                        text-muted-foreground

                        hover:text-primary

                        transition
                      "

                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >

                      {
                        showConfirmPassword
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

              </div>


              {/* ================================================================
                  TERMS & CONDITIONS
              ================================================================= */}

              <label
                className="
                  flex
                  items-start

                  gap-3

                  cursor-pointer

                  py-1
                "
              >

                <input
                  type="checkbox"

                  checked={
                    agreeTerms
                  }

                  onChange={(e) =>
                    setAgreeTerms(
                      e.target.checked
                    )
                  }

                  disabled={
                    isLoading ||
                    isGoogleLoading
                  }

                  className="
                    mt-1

                    w-4
                    h-4

                    accent-primary

                    cursor-pointer
                  "
                />


                <span
                  className="
                    text-sm

                    text-muted-foreground

                    leading-6
                  "
                >

                  I agree to the{" "}

                  <button
                    type="button"

                    className="
                      text-primary

                      font-semibold

                      hover:underline
                    "
                  >

                    Terms & Conditions

                  </button>

                  {" "}and{" "}

                  <button
                    type="button"

                    className="
                      text-primary

                      font-semibold

                      hover:underline
                    "
                  >

                    Privacy Policy

                  </button>

                  .

                </span>

              </label>


              {/* ================================================================
                  CREATE ACCOUNT BUTTON
              ================================================================= */}

              <button
                type="submit"

                disabled={
                  isLoading ||
                  isGoogleLoading
                }

                className="
                  w-full

                  min-h-[52px]

                  rounded-xl

                  bg-primary
                  text-primary-foreground

                  font-semibold
                  text-sm

                  flex
                  items-center
                  justify-center

                  gap-2

                  shadow-lg
                  shadow-primary/20

                  transition-all

                  hover:opacity-90
                  hover:-translate-y-0.5

                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  disabled:translate-y-0
                "
              >

                {
                  isLoading
                    ? (
                      <>

                        <span
                          className="
                            w-5
                            h-5

                            rounded-full

                            border-2

                            border-primary-foreground/30
                            border-t-primary-foreground

                            animate-spin
                          "
                        />

                        Creating Account...

                      </>
                    )
                    : (
                      <>

                        Create Account

                        <ArrowRight
                          size={18}
                        />

                      </>
                    )
                }

              </button>


              {/* ================================================================
                  DIVIDER
              ================================================================= */}

              <div
                className="
                  flex
                  items-center

                  gap-4

                  py-1
                "
              >

                <div
                  className="
                    flex-1

                    h-px

                    bg-border
                  "
                />

                <span
                  className="
                    text-xs

                    font-medium

                    text-muted-foreground

                    uppercase

                    tracking-wider
                  "
                >

                  Or

                </span>

                <div
                  className="
                    flex-1

                    h-px

                    bg-border
                  "
                />

              </div>


              {/* ================================================================
                  CONTINUE WITH GOOGLE
              ================================================================= */}

              <button
                type="button"

                onClick={
                  handleGoogleRegister
                }

                disabled={
                  isLoading ||
                  isGoogleLoading
                }

                className="
                  w-full

                  min-h-[52px]

                  px-5

                  rounded-xl

                  border
                  border-border

                  bg-card

                  text-foreground

                  flex
                  items-center
                  justify-center

                  gap-3

                  text-sm
                  font-semibold

                  shadow-sm

                  transition-all
                  duration-200

                  hover:bg-secondary/40

                  hover:border-primary/40

                  hover:shadow-md

                  hover:-translate-y-0.5

                  active:translate-y-0

                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  disabled:translate-y-0
                "
              >

                {
                  isGoogleLoading
                    ? (
                      <>

                        <span
                          className="
                            w-5
                            h-5

                            rounded-full

                            border-2

                            border-muted

                            border-t-primary

                            animate-spin
                          "
                        />

                        Connecting...

                      </>
                    )
                    : (
                      <>

                        {/* Google Logo */}

                        <svg
                          width="20"
                          height="20"

                          viewBox="0 0 24 24"

                          aria-hidden="true"
                        >

                          <path
                            fill="#4285F4"

                            d="M21.6 12.227c0-.709-.064-1.391-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.996 3.018v2.509h3.232c1.891-1.741 2.982-4.305 2.982-7.35Z"
                          />

                          <path
                            fill="#34A853"

                            d="M12 22c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.041.955-3.386.955-2.605 0-4.809-1.759-5.596-4.123H3.064v2.591A9.996 9.996 0 0 0 12 22Z"
                          />

                          <path
                            fill="#FBBC05"

                            d="M6.404 13.9A6.018 6.018 0 0 1 6.09 12c0-.659.114-1.3.314-1.9V7.509h-3.34A9.996 9.996 0 0 0 2 12c0 1.614.386 3.141 1.064 4.491L6.404 13.9Z"
                          />

                          <path
                            fill="#EA4335"

                            d="M12 5.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C16.959 2.991 14.695 2 12 2a9.996 9.996 0 0 0-8.936 5.509l3.34 2.591C7.191 7.736 9.395 5.977 12 5.977Z"
                          />

                        </svg>


                        <span>

                          Continue with Google

                        </span>

                      </>
                    )
                }

              </button>

            </form>


            {/* ================================================================
                LOGIN LINK
            ================================================================= */}

            <div
              className="
                mt-8

                pt-6

                border-t
                border-border

                text-center
              "
            >

              <p
                className="
                  text-sm

                  text-muted-foreground
                "
              >

                Already have an account?{" "}

                <Link
                  to="/user/login"

                  className="
                    text-primary

                    font-bold

                    hover:underline
                  "
                >

                  Sign In

                </Link>

              </p>

            </div>


            {/* ================================================================
                SECURITY MESSAGE
            ================================================================= */}

            <div
              className="
                mt-6

                flex
                justify-center
                items-center

                gap-2

                text-xs

                text-muted-foreground
              "
            >

              <ShieldCheck
                size={15}

                className="
                  text-tertiary
                "
              />

              Your information is safe
              and secure.

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};


export default UserRegister;