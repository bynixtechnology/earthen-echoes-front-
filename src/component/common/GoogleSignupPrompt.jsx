import {
  useEffect,
  useState,
} from "react";

import {
  X,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  GoogleLogin,
} from "@react-oauth/google";

import {
  googleLoginUser,
} from "../../redux/thunks/userAuthThunk";

import {
  clearUserAuthError,
  selectUserAuthenticated,
  selectGoogleAuthLoading,
  selectUserAuthError,
} from "../../redux/slices/userAuthSlice";

import {
  showToast,
} from "../../config/toast";


const GoogleSignupPrompt = () => {

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

  const isAuthenticated =
    useSelector(
      selectUserAuthenticated
    );

  const googleLoading =
    useSelector(
      selectGoogleAuthLoading
    );

  const authError =
    useSelector(
      selectUserAuthError
    );


  /*
  |--------------------------------------------------------------------------
  | Local State
  |--------------------------------------------------------------------------
  */

  const [
    showPrompt,
    setShowPrompt,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Show Prompt
  |--------------------------------------------------------------------------
  |
  | Conditions:
  |
  | 1. User login nahi hona chahiye
  | 2. User ne popup permanently close nahi kiya ho
  |
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
    | Already Logged In
    |--------------------------------------------------------------------------
    */

    if (
      isAuthenticated ||
      userToken
    ) {

      setShowPrompt(
        false
      );

      return;

    }


    /*
    |--------------------------------------------------------------------------
    | Already Closed
    |--------------------------------------------------------------------------
    */

    if (
      promptClosed ===
      "true"
    ) {

      return;

    }


    /*
    |--------------------------------------------------------------------------
    | Show After Delay
    |--------------------------------------------------------------------------
    */

    const timer =
      setTimeout(() => {

        setShowPrompt(
          true
        );

      }, 1200);


    return () => {

      clearTimeout(
        timer
      );

    };

  }, [
    isAuthenticated,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Hide Prompt Immediately After Login
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (
      isAuthenticated
    ) {

      setShowPrompt(
        false
      );

    }

  }, [
    isAuthenticated,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Clear Old Redux Error
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (
      showPrompt
    ) {

      dispatch(
        clearUserAuthError()
      );

    }

  }, [
    showPrompt,
    dispatch,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Close Prompt
  |--------------------------------------------------------------------------
  */

  const handleClose =
    () => {

      setShowPrompt(
        false
      );


      /*
      |--------------------------------------------------------------------------
      | Don't Show Again
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "googleSignupPromptClosed",
        "true"
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Google Login Success
  |--------------------------------------------------------------------------
  |
  | GoogleLogin returns:
  |
  | {
  |   credential: "GOOGLE_ID_TOKEN",
  |   clientId: "..."
  | }
  |
  | credential backend /auth/google ko send hoga.
  |
  */

  const handleGoogleSuccess =
    async (
      credentialResponse
    ) => {

      try {

        /*
        |--------------------------------------------------------------------------
        | Validate Google Credential
        |--------------------------------------------------------------------------
        */

        const credential =
          credentialResponse
            ?.credential;


        if (
          !credential
        ) {

          showToast.error(
            "Google credential was not received."
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


        /*
        |--------------------------------------------------------------------------
        | Redux Thunk
        |--------------------------------------------------------------------------
        |
        | googleLoginUser
        |
        |     ↓
        |
        | UserAuthService.googleLogin()
        |
        |     ↓
        |
        | POST /auth/google
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
        | Save Prompt State
        |--------------------------------------------------------------------------
        |
        | Slice already saveUserAuth me bhi ye kar raha hai,
        | but keeping this ensures popup won't reopen.
        |
        */

        localStorage.setItem(
          "googleSignupPromptClosed",
          "true"
        );


        /*
        |--------------------------------------------------------------------------
        | Close Popup
        |--------------------------------------------------------------------------
        */

        setShowPrompt(
          false
        );


        /*
        |--------------------------------------------------------------------------
        | Success Message
        |--------------------------------------------------------------------------
        */

        showToast.success(

          `Welcome${
            result?.user?.name
              ? `, ${result.user.name}`
              : ""
          }!`

        );


        /*
        |--------------------------------------------------------------------------
        | Navigate Home
        |--------------------------------------------------------------------------
        |
        | Header Redux state detect karega aur User icon ki jagah
        | profile avatar automatically show karega.
        |
        */

        navigate(
          "/",
          {
            replace: true,
          }
        );

      } catch (
        error
      ) {

        console.error(
          "GOOGLE LOGIN ERROR:",
          error
        );


        showToast.error(

          typeof error ===
            "string"

            ? error

            : "Unable to continue with Google."

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

      showToast.error(
        "Google sign-in was cancelled or failed."
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Email Registration
  |--------------------------------------------------------------------------
  */

  const handleEmailRegister =
    () => {

      setShowPrompt(
        false
      );


      navigate(
        "/user/register"
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Existing User Login
  |--------------------------------------------------------------------------
  */

  const handleLogin =
    () => {

      setShowPrompt(
        false
      );


      navigate(
        "/user/login"
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Don't Render
  |--------------------------------------------------------------------------
  */

  if (
    !showPrompt ||
    isAuthenticated
  ) {

    return null;

  }


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <div
      className="
        fixed

        top-[88px]
        right-4

        sm:right-6
        lg:right-8

        z-[9999]

        w-[calc(100%-32px)]
        max-w-[400px]

        overflow-hidden

        rounded-2xl

        border
        border-border

        bg-card

        text-card-foreground

        shadow-2xl
        shadow-black/10

        animate-[googlePromptIn_.3s_ease-out]
      "
    >

      {/* ================================================================
          TOP ACCENT
      ================================================================= */}

      <div
        className="
          h-1
          w-full

          bg-primary
        "
      />


      {/* ================================================================
          HEADER
      ================================================================= */}

      <div
        className="
          relative

          flex
          items-center

          gap-3

          border-b
          border-border

          bg-secondary/30

          px-5
          py-4

          pr-14
        "
      >

        {/* Google Logo */}

        <div
          className="
            flex

            h-10
            w-10

            shrink-0

            items-center
            justify-center

            rounded-full

            border
            border-border

            bg-card

            shadow-sm
          "
        >

          <GoogleLogo />

        </div>


        {/* Heading */}

        <div
          className="
            min-w-0
          "
        >

          <p
            className="
              text-sm
              font-semibold

              text-foreground
            "
          >

            Sign in to Earthen Echoes

          </p>


          <p
            className="
              mt-0.5

              text-xs

              text-muted-foreground
            "
          >

            Continue securely with Google

          </p>

        </div>


        {/* Close */}

        <button
          type="button"

          onClick={
            handleClose
          }

          aria-label="Close Google sign in"

          className="
            absolute

            right-4
            top-1/2

            -translate-y-1/2

            flex

            h-9
            w-9

            items-center
            justify-center

            rounded-full

            text-muted-foreground

            transition-all

            hover:bg-secondary
            hover:text-foreground
          "
        >

          <X
            size={19}
          />

        </button>

      </div>


      {/* ================================================================
          CONTENT
      ================================================================= */}

      <div
        className="
          px-5
          py-5
        "
      >

        {/* ==============================================================
            TITLE
        ============================================================== */}

        <div
          className="
            mb-5
          "
        >

          <h3
            className="
              !text-xl

              font-heading
              font-bold

              !text-foreground
            "
          >

            Create or sign in to your account

          </h3>


          <p
            className="
              mt-2

              text-sm

              leading-6

              text-muted-foreground
            "
          >

            Sign in faster to manage your orders,
            wishlist and enjoy a personalized
            shopping experience.

          </p>

        </div>


        {/* ==============================================================
            GOOGLE LOGIN
        ============================================================== */}

        <div
          className="
            relative

            min-h-[44px]
          "
        >

          {

            googleLoading

              ? (

                <div
                  className="
                    flex

                    min-h-[44px]
                    w-full

                    items-center
                    justify-center

                    gap-2

                    rounded-md

                    border
                    border-border

                    bg-card

                    text-sm
                    font-semibold

                    text-foreground
                  "
                >

                  <Loader2
                    size={18}

                    className="
                      animate-spin

                      text-primary
                    "
                  />

                  Signing in...

                </div>

              )

              : (

                <div
                  className="
                    flex
                    w-full
                    justify-center

                    overflow-hidden
                  "
                >

                  <GoogleLogin

                    onSuccess={
                      handleGoogleSuccess
                    }

                    onError={
                      handleGoogleError
                    }

                    useOneTap={
                      false
                    }

                    auto_select={
                      false
                    }

                    theme="outline"

                    size="large"

                    shape="rectangular"

                    text="continue_with"

                    width="350"

                  />

                </div>

              )

          }

        </div>


        {/* ==============================================================
            API ERROR
        ============================================================== */}

        {
          authError && (

            <div
              className="
                mt-3

                rounded-lg

                border
                border-destructive/20

                bg-destructive/5

                px-3
                py-2.5

                text-xs

                text-destructive
              "
            >

              {
                authError
              }

            </div>

          )
        }


        {/* ==============================================================
            DIVIDER
        ============================================================== */}

        <div
          className="
            my-5

            flex
            items-center

            gap-3
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
              text-[11px]

              uppercase
              tracking-wider

              text-muted-foreground
            "
          >

            or

          </span>


          <div
            className="
              h-px
              flex-1

              bg-border
            "
          />

        </div>


        {/* ==============================================================
            EMAIL REGISTER
        ============================================================== */}

        <button
          type="button"

          onClick={
            handleEmailRegister
          }

          disabled={
            googleLoading
          }

          className="
            flex

            min-h-[48px]
            w-full

            items-center
            justify-center

            rounded-xl

            bg-primary

            px-5

            text-sm
            font-semibold

            text-primary-foreground

            shadow-md
            shadow-primary/15

            transition-all
            duration-200

            hover:opacity-90
            hover:shadow-lg

            active:scale-[0.99]

            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >

          Create account with email

        </button>


        {/* ==============================================================
            EXISTING ACCOUNT
        ============================================================== */}

        <p
          className="
            mt-4

            text-center

            text-sm

            text-muted-foreground
          "
        >

          Already have an account?

          <button
            type="button"

            onClick={
              handleLogin
            }

            className="
              ml-1.5

              font-semibold

              text-primary

              hover:underline
            "
          >

            Sign in

          </button>

        </p>


        {/* ==============================================================
            INFORMATION
        ============================================================== */}

        <p
          className="
            mt-5

            text-[11px]

            leading-5

            text-muted-foreground
          "
        >

          By continuing with Google, Google may
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


        {/* ==============================================================
            SECURITY
        ============================================================== */}

        <div
          className="
            mt-4

            flex
            items-center
            justify-center

            gap-2

            border-t
            border-border

            pt-4

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

const GoogleLogo =
  () => {

    return (

      <svg
        width="22"
        height="22"

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