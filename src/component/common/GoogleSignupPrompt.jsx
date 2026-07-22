import {
  useEffect,
  useState,
} from "react";

import {
  X,
  ShieldCheck,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";


const GoogleSignupPrompt = () => {

  const navigate = useNavigate();

  const [
    showPrompt,
    setShowPrompt,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Google User Preview
  |--------------------------------------------------------------------------
  |
  | Actual Google OAuth connect hone ke baad
  | ye values Google response se aayengi.
  |
  */

  const googleUser = {
    name: "",
    email: "",
    picture: "",
  };


  /*
  |--------------------------------------------------------------------------
  | Show Prompt
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const promptClosed =
      localStorage.getItem(
        "googleSignupPromptClosed"
      );

    const userToken =
      localStorage.getItem(
        "userToken"
      );


    /*
    |--------------------------------------------------------------------------
    | Logged-in User
    |--------------------------------------------------------------------------
    */

    if (userToken) {
      return;
    }


    /*
    |--------------------------------------------------------------------------
    | User Already Closed Prompt
    |--------------------------------------------------------------------------
    */

    if (
      promptClosed === "true"
    ) {
      return;
    }


    /*
    |--------------------------------------------------------------------------
    | Show After Small Delay
    |--------------------------------------------------------------------------
    */

    const timer =
      setTimeout(() => {

        setShowPrompt(true);

      }, 1000);


    return () => {

      clearTimeout(timer);

    };

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Close
  |--------------------------------------------------------------------------
  */

  const handleClose = () => {

    setShowPrompt(false);

    localStorage.setItem(
      "googleSignupPromptClosed",
      "true"
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Continue With Google
  |--------------------------------------------------------------------------
  */

  const handleGoogleContinue = () => {

    /*
    |--------------------------------------------------------------------------
    | TEMPORARY
    |--------------------------------------------------------------------------
    |
    | Abhi register page par redirect.
    |
    | Google OAuth implement karne ke baad:
    |
    | window.location.href =
    | `${API_URL}/auth/google`;
    |
    */

    navigate(
      "/user/register"
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Avatar Initial
  |--------------------------------------------------------------------------
  */

  const getInitial = () => {

    if (
      googleUser.name
    ) {

      return googleUser.name
        .charAt(0)
        .toUpperCase();

    }

    return "E";

  };


  /*
  |--------------------------------------------------------------------------
  | Don't Render
  |--------------------------------------------------------------------------
  */

  if (!showPrompt) {

    return null;

  }


  return (

    <div
      className="
        fixed

        top-[76px]
        right-3

        sm:top-[82px]
        sm:right-5

        z-[9999]

        w-[calc(100%-24px)]
        max-w-[390px]

        overflow-hidden

        rounded-lg

        border
        border-border

        bg-card

        text-card-foreground

        shadow-2xl

        animate-[googlePromptIn_.25s_ease-out]
      "
    >

      {/* ================================================================
          HEADER
      ================================================================= */}

      <div
        className="
          flex
          min-h-[68px]
          items-center

          gap-3

          border-b
          border-border

          px-4
          pr-12

          bg-card
        "
      >

        {/* Google Logo */}

        <div
          className="
            flex
            h-8
            w-8

            shrink-0

            items-center
            justify-center
          "
        >

          <GoogleLogo />

        </div>


        {/* Heading */}

        <p
          className="
            text-[15px]
            sm:text-[16px]

            font-medium

            leading-[1.35]

            text-muted-foreground
          "
        >

          Sign in to

          <span
            className="
              ml-1

              font-semibold

              text-foreground
            "
          >

            Earthen Echoes

          </span>

          {" "}with Google

        </p>


        {/* Close */}

        <button
          type="button"

          onClick={
            handleClose
          }

          aria-label="Close Google sign in"

          className="
            absolute

            right-3
            top-4

            flex
            h-9
            w-9

            items-center
            justify-center

            rounded-full

            text-muted-foreground

            transition

            hover:bg-muted
            hover:text-foreground
          "
        >

          <X
            size={21}
          />

        </button>

      </div>


      {/* ================================================================
          ACCOUNT
      ================================================================= */}

      <div
        className="
          px-5
          pt-5
          pb-4
        "
      >

        <div
          className="
            flex
            items-center

            gap-4
          "
        >

          {/* Avatar */}

          {googleUser.picture ? (

            <img
              src={
                googleUser.picture
              }

              alt={
                googleUser.name ||
                "Google account"
              }

              className="
                h-14
                w-14

                shrink-0

                rounded-full

                object-cover
              "
            />

          ) : (

            <div
              className="
                flex

                h-14
                w-14

                shrink-0

                items-center
                justify-center

                rounded-full

                bg-primary

                font-sans
                text-xl
                font-semibold

                text-primary-foreground

                shadow-sm
              "
            >

              {getInitial()}

            </div>

          )}


          {/* Account Details */}

          <div
            className="
              min-w-0
              flex-1
            "
          >

            <p
              className="
                truncate

                text-base
                font-semibold

                text-foreground
              "
            >

              {
                googleUser.name ||
                "Continue with Google"
              }

            </p>


            <p
              className="
                mt-0.5

                truncate

                text-sm

                text-muted-foreground
              "
            >

              {
                googleUser.email ||
                "Use your Google account"
              }

            </p>

          </div>

        </div>


        {/* ================================================================
            CONTINUE BUTTON
        ================================================================= */}

        <button
          type="button"

          onClick={
            handleGoogleContinue
          }

          className="
            mt-5

            flex
            min-h-[50px]
            w-full

            items-center
            justify-center

            gap-2

            rounded-md

            bg-primary

            px-5

            text-sm
            font-bold

            uppercase
            tracking-wide

            text-primary-foreground

            shadow-md
            shadow-primary/20

            transition-all
            duration-200

            hover:opacity-90
            hover:shadow-lg

            active:scale-[0.99]

            focus:outline-none
            focus:ring-2
            focus:ring-ring
            focus:ring-offset-2
          "
        >

          {
            googleUser.name
              ? `Continue as ${
                  googleUser.name.split(
                    " "
                  )[0]
                }`
              : "Continue with Google"
          }

        </button>


        {/* ================================================================
            INFORMATION
        ================================================================= */}

        <p
          className="
            mt-4

            text-[12px]
            sm:text-[13px]

            leading-[1.5]

            text-muted-foreground
          "
        >

          To create your account, Google will
          share your name, email address and
          profile picture with

          <span
            className="
              font-semibold
              text-foreground
            "
          >

            {" "}Earthen Echoes

          </span>

          .

        </p>


        {/* ================================================================
            SECURITY
        ================================================================= */}

        <div
          className="
            mt-4

            flex
            items-center

            gap-2

            border-t
            border-border

            pt-3

            text-[11px]

            text-muted-foreground
          "
        >

          <ShieldCheck
            size={14}

            className="
              shrink-0
              text-tertiary
            "
          />

          <span>

            Secure sign-in powered by Google

          </span>

        </div>

      </div>

    </div>

  );

};


/*
|--------------------------------------------------------------------------
| Google Logo
|--------------------------------------------------------------------------
*/

const GoogleLogo = () => {

  return (

    <svg
      width="24"
      height="24"

      viewBox="0 0 24 24"

      aria-hidden="true"
    >

      <path
        fill="#4285F4"

        d="
          M21.6 12.227
          c0-.709-.064-1.391-.182-2.045
          H12v3.868
          h5.382
          a4.6 4.6 0 0 1-1.996 3.018
          v2.509
          h3.232
          c1.891-1.741
          2.982-4.305
          2.982-7.35Z
        "
      />

      <path
        fill="#34A853"

        d="
          M12 22
          c2.7 0
          4.964-.895
          6.618-2.423
          l-3.232-2.509
          c-.895.6-2.041.955-3.386.955
          -2.605 0
          -4.809-1.759
          -5.596-4.123
          H3.064
          v2.591
          A9.996 9.996 0 0 0 12 22Z
        "
      />

      <path
        fill="#FBBC05"

        d="
          M6.404 13.9
          A6.018 6.018 0 0 1 6.09 12
          c0-.659.114-1.3.314-1.9
          V7.509
          h-3.34
          A9.996 9.996 0 0 0 2 12
          c0 1.614.386 3.141 1.064 4.491
          L6.404 13.9Z
        "
      />

      <path
        fill="#EA4335"

        d="
          M12 5.977
          c1.468 0
          2.786.505
          3.823 1.496
          l2.868-2.868
          C16.959 2.991
          14.695 2
          12 2
          a9.996 9.996 0 0 0-8.936 5.509
          l3.34 2.591
          C7.191 7.736
          9.395 5.977
          12 5.977Z
        "
      />

    </svg>

  );

};


export default GoogleSignupPrompt;