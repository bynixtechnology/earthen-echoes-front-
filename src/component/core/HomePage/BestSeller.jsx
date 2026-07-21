import React, {
  useEffect,
  useState,
} from "react";

import {
  Heart,
  Eye,
  ShoppingCart,
  Star,
  Loader2,
  ArrowRight,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ProductService,
} from "../../../services/productService";

import {
  useCart,
} from "../../core/context/CartContext";


const BestSeller = () => {

  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  const {
    addToCart,
  } = useCart();

  const navigate =
    useNavigate();


  /*
  |--------------------------------------------------------------------------
  | Fetch Best Sellers
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    let isMounted = true;


    const fetchBestSellers =
      async () => {

        try {

          setIsLoading(true);

          setError("");


          /*
          |--------------------------------------------------------------------------
          | Product Service
          |--------------------------------------------------------------------------
          */

          const response =
            await ProductService.getAll();


          console.log(
            "BEST SELLER RESPONSE:",
            response
          );


          /*
          |--------------------------------------------------------------------------
          | Normalize Response
          |--------------------------------------------------------------------------
          */

          const fetchedData =
            response?.data ??
            response ??
            [];


          const productList =
            Array.isArray(
              fetchedData
            )
              ? fetchedData
              : [];


          /*
          |--------------------------------------------------------------------------
          | Active Products Only
          |--------------------------------------------------------------------------
          */

          const filteredProducts =
            productList.filter(
              (product) =>
                product?.isActive ===
                true
            );


          /*
          |--------------------------------------------------------------------------
          | Only First 4 Products
          |--------------------------------------------------------------------------
          */

          if (isMounted) {

            setProducts(
              filteredProducts.slice(
                0,
                4
              )
            );

          }

        } catch (error) {

          console.error(
            "FETCH BEST SELLERS ERROR:",
            error
          );


          if (isMounted) {

            setProducts([]);

            setError(
              error?.response?.data
                ?.message ||
                error?.message ||
                "Unable to load products."
            );

          }

        } finally {

          if (isMounted) {

            setIsLoading(false);

          }

        }

      };


    fetchBestSellers();


    /*
    |--------------------------------------------------------------------------
    | Cleanup
    |--------------------------------------------------------------------------
    */

    return () => {

      isMounted = false;

    };

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Product Details
  |--------------------------------------------------------------------------
  */

  const handleProductClick = (
    productId
  ) => {

    if (!productId) {
      return;
    }

    navigate(
      `/products/${productId}`
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Add To Cart
  |--------------------------------------------------------------------------
  */

  const handleAddToCart = (
    event,
    product,
    productId,
    productTitle,
    productPrice,
    imageUrl
  ) => {

    /*
    |--------------------------------------------------------------------------
    | Prevent Card Navigation
    |--------------------------------------------------------------------------
    */

    event.stopPropagation();


    addToCart({
      ...product,

      _id: productId,

      name: productTitle,

      price: productPrice,

      images:
        product?.images?.length
          ? product.images
          : [imageUrl],
    });

  };


  /*
  |--------------------------------------------------------------------------
  | Wishlist
  |--------------------------------------------------------------------------
  */

  const handleWishlist = (
    event
  ) => {

    event.stopPropagation();

    /*
      Wishlist logic
      yaha add kar sakte ho
    */

  };


  /*
  |--------------------------------------------------------------------------
  | Quick View
  |--------------------------------------------------------------------------
  */

  const handleQuickView = (
    event,
    productId
  ) => {

    event.stopPropagation();

    if (!productId) {
      return;
    }

    navigate(
      `/products/${productId}`
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
        py-20
        bg-muted/30
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* ================================================================
            HEADER
        ================================================================= */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-end
            justify-between
            gap-4
            mb-12
          "
        >

          <div>

            <h2
              className="
                text-3xl
                sm:text-4xl
                font-heading
                font-bold
                mb-2
              "
            >
              Our Best Sellers
            </h2>


            <p
              className="
                text-muted-foreground
              "
            >
              Most-loved handcrafted
              treasures appreciated by
              design connoisseurs.
            </p>

          </div>


          <Link

            to="/products"

            className="
              inline-flex
              items-center
              text-primary
              font-semibold
              hover:gap-2
              transition-all
              mt-4
              md:mt-0
            "
          >

            View All Best Sellers

            <ArrowRight
              size={18}
              className="ml-1"
            />

          </Link>

        </div>


        {/* ================================================================
            LOADING
        ================================================================= */}

        {isLoading ? (

          <div
            className="
              flex
              justify-center
              items-center
              py-20
              min-h-[300px]
            "
          >

            <Loader2
              className="
                w-10
                h-10
                animate-spin
                text-amber-700
              "
            />

          </div>

        ) : error ? (

          /* ================================================================
             ERROR
          ================================================================= */

          <div
            className="
              text-center
              py-12
            "
          >

            <p
              className="
                text-red-600
                font-medium
              "
            >
              {error}
            </p>

          </div>

        ) : products.length === 0 ? (

          /* ================================================================
             EMPTY
          ================================================================= */

          <div
            className="
              text-center
              text-gray-500
              py-10
              font-medium
            "
          >
            No active products found
            right now.
          </div>

        ) : (

          /* ================================================================
             PRODUCT GRID
          ================================================================= */

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-8
            "
          >

            {products.map(
              (
                product,
                index
              ) => {

                /*
                |--------------------------------------------------------------------------
                | Product Data
                |--------------------------------------------------------------------------
                */

                const productId =
                  product?._id ||
                  product?.id;


                const imageUrl =
                  product?.images?.[0] ||
                  product?.image ||
                  "/placeholder.png";


                const productTitle =
                  product?.title ||
                  product?.name ||
                  "Unknown Product";


                const productPrice =
                  Number(
                    product?.price
                  ) || 0;


                const productDesc =
                  product?.description ||
                  "No description available.";


                const productRating =
                  product?.rating ||
                  4.5;


                return (

                  <div

                    key={
                      productId ||
                      index
                    }

                    onClick={() =>
                      handleProductClick(
                        productId
                      )
                    }

                    className="
                      group
                      bg-card
                      rounded-xl
                      cursor-pointer
                      overflow-hidden
                      shadow-sm
                      hover:shadow-lg
                      transition-all
                      duration-300
                      flex
                      flex-col
                    "
                  >

                    {/* ====================================================
                        IMAGE
                    ===================================================== */}

                    <div
                      className="
                        relative
                        overflow-hidden
                        aspect-square
                        bg-muted
                      "
                    >

                      <img

                        src={
                          imageUrl
                        }

                        alt={
                          productTitle
                        }

                        loading="lazy"

                        onError={(
                          event
                        ) => {

                          event.currentTarget
                            .onerror = null;

                          event.currentTarget
                            .src =
                            "/placeholder.png";

                        }}

                        className="
                          w-full
                          h-full
                          object-cover
                          group-hover:scale-105
                          transition-transform
                          duration-500
                        "
                      />


                      {/* Best Seller Badge */}

                      <span
                        className="
                          absolute
                          top-3
                          left-3
                          bg-primary
                          text-primary-foreground
                          text-[10px]
                          uppercase
                          tracking-widest
                          font-bold
                          px-2.5
                          py-1
                          rounded
                        "
                      >
                        Best Seller
                      </span>


                      {/* Wishlist */}

                      <button

                        type="button"

                        onClick={
                          handleWishlist
                        }

                        aria-label="Add to wishlist"

                        className="
                          absolute
                          top-3
                          right-3
                          w-8
                          h-8
                          rounded-full
                          bg-background/80
                          backdrop-blur-md
                          flex
                          items-center
                          justify-center
                          text-foreground
                          hover:text-primary
                          transition-colors
                          shadow
                        "
                      >

                        <Heart
                          size={16}
                        />

                      </button>


                      {/* Quick View */}

                      <div
                        className="
                          absolute
                          inset-x-0
                          bottom-0
                          p-4
                          bg-gradient-to-t
                          from-primary/60
                          to-transparent
                          translate-y-full
                          group-hover:translate-y-0
                          transition-transform
                          duration-300
                          flex
                          justify-center
                          gap-2
                        "
                      >

                        <button

                          type="button"

                          onClick={(
                            event
                          ) =>
                            handleQuickView(
                              event,
                              productId
                            )
                          }

                          className="
                            px-3
                            py-2
                            bg-background
                            text-foreground
                            rounded-md
                            text-xs
                            font-semibold
                            hover:bg-primary
                            hover:text-primary-foreground
                            transition-all
                            flex
                            items-center
                            gap-1
                          "
                        >

                          <Eye
                            size={14}
                          />

                          Quick View

                        </button>

                      </div>

                    </div>


                    {/* ====================================================
                        PRODUCT CONTENT
                    ===================================================== */}

                    <div
                      className="
                        p-5
                        flex-1
                        flex
                        flex-col
                        justify-between
                        bg-white
                      "
                    >

                      <div>

                        {/* Rating */}

                        <div
                          className="
                            flex
                            items-center
                            gap-1
                            text-amber-500
                            text-xs
                            mb-1
                          "
                        >

                          {[
                            ...Array(5),
                          ].map(
                            (_, i) => (

                              <Star
                                key={i}
                                size={14}
                                className="
                                  fill-current
                                "
                              />

                            )
                          )}

                          <span
                            className="
                              text-muted-foreground
                              ml-1
                            "
                          >
                            (
                            {
                              productRating
                            }
                            )
                          </span>

                        </div>


                        {/* Title */}

                        <h3
                          className="
                            font-heading
                            text-lg
                            font-bold
                            text-foreground
                            group-hover:text-primary
                            transition-colors
                            mb-1
                            truncate
                          "
                        >
                          {
                            productTitle
                          }
                        </h3>


                        {/* Description */}

                        <p
                          className="
                            text-xs
                            text-muted-foreground
                            line-clamp-2
                            mb-4
                          "
                        >
                          {
                            productDesc
                          }
                        </p>

                      </div>


                      {/* ==================================================
                          PRICE + CART
                      =================================================== */}

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          border-t
                          border-border/40
                          pt-4
                        "
                      >

                        <span
                          className="
                            font-heading
                            text-lg
                            font-bold
                            text-emerald-600
                          "
                        >
                          ₹
                          {
                            productPrice.toLocaleString(
                              "en-IN"
                            )
                          }
                        </span>


                        <button

                          type="button"

                          onClick={(
                            event
                          ) =>
                            handleAddToCart(
                              event,
                              product,
                              productId,
                              productTitle,
                              productPrice,
                              imageUrl
                            )
                          }

                          className="
                            px-4
                            py-2
                            bg-primary
                            text-primary-foreground
                            rounded-lg
                            text-xs
                            font-semibold
                            hover:bg-primary/90
                            transition-colors
                            flex
                            items-center
                            gap-1.5
                          "
                        >

                          <ShoppingCart
                            size={14}
                          />

                          Add

                        </button>

                      </div>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>

    </section>

  );

};


export default BestSeller;