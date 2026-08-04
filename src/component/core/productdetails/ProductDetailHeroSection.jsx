

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronRight,
  RefreshCw,
  Star,
  ShoppingCart,
  CreditCard,
  Heart,
  Share2,
  Loader2,
  Minus,
  Plus,
  Box,
  Leaf,
  Sun,
  Ruler,
  Sparkles,
  Trees,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchProductById,
} from "../../../redux/thunks/productThunk";

import {
  clearSelectedProduct,
  selectSelectedProduct,
  selectProductDetailsLoading,
  selectProductError,
} from "../../../redux/slices/productSlice";

import {
  addProductToCart,
} from "../../../redux/thunks/cartThunk";

import {
  selectCartAdding,
} from "../../../redux/slices/cartSlice";

import {
  showToast,
} from "../../../config/toast";

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

const ProductDetailHeroSection = ({
  setCategoryId,
}) => {
  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  const { id } =
    useParams();

  const dispatch =
    useDispatch();

  /*
  |--------------------------------------------------------------------------
  | Redux
  |--------------------------------------------------------------------------
  */

  const product =
    useSelector(
      selectSelectedProduct
    );

  const loading =
    useSelector(
      selectProductDetailsLoading
    );

  const error =
    useSelector(
      selectProductError
    );

  const isAdding =
    useSelector(
      selectCartAdding
    );

  /*
  |--------------------------------------------------------------------------
  | Local State
  |--------------------------------------------------------------------------
  */

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    selectedImage,
    setSelectedImage,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch Product
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(
      fetchProductById(id)
    );

    return () => {
      dispatch(
        clearSelectedProduct()
      );
    };
  }, [
    dispatch,
    id,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Normalize Images
  |--------------------------------------------------------------------------
  */

  const productImages =
    useMemo(() => {
      if (
        !Array.isArray(
          product?.images
        )
      ) {
        return [];
      }

      return product.images
        .map((image) => {
          if (
            typeof image ===
            "string"
          ) {
            return image;
          }

          return (
            image?.url ||
            image?.secure_url ||
            ""
          );
        })
        .filter(Boolean);
    }, [
      product?.images,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Main Image
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setSelectedImage(
      productImages?.[0] ||
        "/placeholder.png"
    );
  }, [
    productImages,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Category ID Parent
  |--------------------------------------------------------------------------
  */

 useEffect(() => {
  console.log("========== PRODUCT ==========");
  console.log(product);

  const categoryId =
    typeof product?.category === "object"
      ? product?.category?._id
      : product?.category;

  console.log("Category Object =>", product?.category);
  console.log("Category ID =>", categoryId);

  if (
    categoryId &&
    typeof setCategoryId === "function"
  ) {
    console.log("Sending Category ID To Parent =>", categoryId);
    setCategoryId(categoryId);
  }
}, [product, setCategoryId]);

  /*
  |--------------------------------------------------------------------------
  | Reset Quantity
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Dynamic Values
  |--------------------------------------------------------------------------
  */

  const stock =
    Number(
      product?.stock ??
        product?.quantity ??
        0
    );

  const price =
    Number(
      product?.price || 0
    );

  const originalPrice =
    Number(
      product?.originalPrice ||
        product?.mrp ||
        0
    );

  const categoryName =
    typeof product?.category ===
    "object"
      ? product?.category?.name ||
        product?.category?.title
      : "";

  const categoryId =
    typeof product?.category ===
    "object"
      ? product?.category?._id
      : product?.category;

  /*
  |--------------------------------------------------------------------------
  | Discount
  |--------------------------------------------------------------------------
  */

  const discountPercentage =
    useMemo(() => {
      if (
        !originalPrice ||
        originalPrice <= price
      ) {
        return 0;
      }

      return Math.round(
        ((originalPrice -
          price) /
          originalPrice) *
          100
      );
    }, [
      originalPrice,
      price,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Price Formatter
  |--------------------------------------------------------------------------
  */

  const formatPrice = (
    value
  ) => {
    return Number(
      value || 0
    ).toLocaleString(
      "en-IN"
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Quantity Minus
  |--------------------------------------------------------------------------
  */

  const decreaseQuantity =
    () => {
      setQuantity(
        (previous) =>
          Math.max(
            1,
            previous - 1
          )
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Quantity Plus
  |--------------------------------------------------------------------------
  */

  const increaseQuantity =
    () => {
      if (stock <= 0) {
        return;
      }

      setQuantity(
        (previous) =>
          Math.min(
            previous + 1,
            stock
          )
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Quantity Input
  |--------------------------------------------------------------------------
  */

  const handleQuantityChange =
    (event) => {
      let value =
        Number(
          event.target.value
        );

      if (
        !Number.isFinite(value)
      ) {
        return;
      }

      value = Math.floor(
        value
      );

      if (value < 1) {
        value = 1;
      }

      if (
        stock > 0 &&
        value > stock
      ) {
        value = stock;
      }

      setQuantity(value);
    };

  /*
  |--------------------------------------------------------------------------
  | Add To Cart
  |--------------------------------------------------------------------------
  */

  const handleAddToCart =
    async () => {
      if (!product?._id) {
        showToast?.error?.(
          "Product not found."
        );

        return;
      }

      if (stock <= 0) {
        showToast?.error?.(
          "Product is out of stock."
        );

        return;
      }

      try {
        await dispatch(
          addProductToCart({
            productId:
              product._id,

            quantity,
          })
        ).unwrap();

        showToast?.success?.(
          "Product added to cart."
        );
      } catch (error) {
        showToast?.error?.(
          error ||
            "Unable to add product to cart."
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Share
  |--------------------------------------------------------------------------
  */

  const handleShare =
    async () => {
      try {
        if (
          navigator.share
        ) {
          await navigator.share(
            {
              title:
                product?.name ||
                "Product",

              text:
                product
                  ?.description ||
                "",

              url:
                window.location
                  .href,
            }
          );

          return;
        }

        await navigator.clipboard.writeText(
          window.location.href
        );

        showToast?.success?.(
          "Product link copied."
        );
      } catch (error) {
        console.error(
          "Share error:",
          error
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div
        className="
          min-h-[500px]
          flex
          flex-col
          items-center
          justify-center
          gap-3
        "
      >
        <Loader2
          size={38}
          className="
            animate-spin
            text-primary
          "
        />

        <p
          className="
            text-sm
            text-muted-foreground
          "
        >
          Loading product...
        </p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (
    error &&
    !product
  ) {
    return (
      <div
        className="
          min-h-[500px]
          flex
          flex-col
          items-center
          justify-center
          text-center
          px-4
        "
      >
        <h2
          className="
            text-2xl
            font-heading
            font-bold
          "
        >
          Unable to load
          product
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-muted-foreground
          "
        >
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            dispatch(
              fetchProductById(
                id
              )
            )
          }
          className="
            mt-5
            px-5
            py-3
            bg-primary
            text-primary-foreground
            rounded-lg
            flex
            items-center
            gap-2
          "
        >
          <RefreshCw
            size={16}
          />

          Try Again
        </button>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Not Found
  |--------------------------------------------------------------------------
  */

  if (!product) {
    return (
      <div
        className="
          min-h-[500px]
          flex
          flex-col
          items-center
          justify-center
          text-center
        "
      >
        <h2
          className="
            text-2xl
            font-bold
          "
        >
          Product not found
        </h2>

        <Link
          to="/products"
          className="
            mt-4
            text-primary
            font-semibold
            hover:underline
          "
        >
          Back to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ================================================================
          BREADCRUMB
      ================================================================= */}

      <nav
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
          w-full
          text-xs
          text-muted-foreground
          flex
          items-center
          gap-2
          flex-wrap
        "
      >
        <Link
          to="/"
          className="
            hover:text-primary
            transition-colors
          "
        >
          Home
        </Link>

        <ChevronRight
          size={12}
        />

        <Link
          to="/products"
          className="
            hover:text-primary
            transition-colors
          "
        >
          Catalogue
        </Link>

        {categoryName && (
          <>
            <ChevronRight
              size={12}
            />

            <Link
              to={
                categoryId
                  ? `/products?category=${categoryId}`
                  : "/products"
              }
              className="
                hover:text-primary
                transition-colors
              "
            >
              {categoryName}
            </Link>
          </>
        )}

        <ChevronRight
          size={12}
        />

        <span
          className="
            text-foreground
            font-medium
          "
        >
          {product?.name}
        </span>
      </nav>

      {/* ================================================================
          PRODUCT SECTION
      ================================================================= */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
          flex-1
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-8
            lg:gap-12
          "
        >
          {/* ================= IMAGES ================= */}

          <div
            className="
              lg:col-span-7
              space-y-6
            "
          >
            <div
              className="
                relative
                rounded-2xl
                overflow-hidden
                bg-card
                border
                border-border/50
                aspect-square
                shadow-sm
                flex
                items-center
                justify-center
                group
              "
            >
              <img
                src={
                  selectedImage ||
                  "/placeholder.png"
                }
                alt={
                  product?.name ||
                  "Product"
                }
                className="
                  w-full
                  h-full
                  object-cover
                  group-hover:scale-105
                  transition-transform
                  duration-500
                "
              />

              <span
                className="
                  absolute
                  top-4
                  left-4
                  bg-primary
                  text-primary-foreground
                  text-[10px]
                  uppercase
                  tracking-widest
                  font-bold
                  px-3
                  py-1
                  rounded
                "
              >
                {categoryName ||
                  "Premium"}
              </span>
            </div>

            {/* THUMBNAILS */}

            {productImages.length >
              1 && (
              <div
                className="
                  grid
                  grid-cols-4
                  sm:grid-cols-5
                  gap-3
                  sm:gap-4
                "
              >
                {productImages.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          image
                        )
                      }
                      className={`
                        aspect-square
                        rounded-lg
                        overflow-hidden
                        bg-card
                        transition-all

                        ${
                          selectedImage ===
                          image
                            ? "border-2 border-primary"
                            : "border border-border opacity-70 hover:opacity-100"
                        }
                      `}
                    >
                      <img
                        src={image}
                        alt={`${
                          product?.name
                        } ${
                          index + 1
                        }`}
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* ================= INFO ================= */}

          <div
            className="
              lg:col-span-5
              space-y-6
            "
          >
            <div className="space-y-2">
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  flex-wrap
                "
              >
                <span
                  className="
                    text-xs
                    uppercase
                    tracking-widest
                    text-primary
                    font-bold
                  "
                >
                  {categoryName ||
                    "Premium Collection"}
                </span>

                <span
                  className={`
                    text-xs
                    px-2.5
                    py-1
                    rounded-full
                    font-medium
                    flex
                    items-center
                    gap-1

                    ${
                      stock > 0
                        ? "text-green-700 bg-green-100"
                        : "text-red-700 bg-red-100"
                    }
                  `}
                >
                  <span
                    className={`
                      w-1.5
                      h-1.5
                      rounded-full

                      ${
                        stock > 0
                          ? "bg-green-600"
                          : "bg-red-600"
                      }
                    `}
                  />

                  {stock > 0
                    ? `In Stock (${stock} Left)`
                    : "Out of Stock"}
                </span>
              </div>

              <h1
                className="
                  text-3xl
                  sm:text-4xl
                  font-heading
                  font-bold
                  text-foreground
                  leading-tight
                "
              >
                {product?.name}
              </h1>

              {/* RATING */}

              <div
                className="
                  flex
                  items-center
                  gap-1
                "
              >
                {Array.from({
                  length: 5,
                }).map(
                  (
                    _,
                    index
                  ) => (
                    <Star
                      key={index}
                      size={15}
                      fill={
                        index <
                        Math.round(
                          Number(
                            product?.rating ||
                              0
                          )
                        )
                          ? "currentColor"
                          : "none"
                      }
                      className="text-primary"
                    />
                  )
                )}

                <span
                  className="
                    text-muted-foreground
                    ml-1.5
                    text-sm
                    font-medium
                  "
                >
                  (
                  {product?.rating ||
                    0}{" "}
                  Reviews)
                </span>
              </div>
            </div>

            {/* PRICE */}

            <div
              className="
                flex
                items-baseline
                gap-3
                flex-wrap
              "
            >
              <span
                className="
                  text-3xl
                  font-heading
                  font-bold
                  text-primary
                "
              >
                ₹
                {formatPrice(
                  price
                )}
              </span>

              {originalPrice >
                price && (
                <span
                  className="
                    text-sm
                    text-muted-foreground
                    line-through
                  "
                >
                  ₹
                  {formatPrice(
                    originalPrice
                  )}
                </span>
              )}

              {discountPercentage >
                0 && (
                <span
                  className="
                    text-xs
                    text-primary
                    font-bold
                    bg-secondary
                    px-2
                    py-0.5
                    rounded
                  "
                >
                  Save{" "}
                  {
                    discountPercentage
                  }
                  %
                </span>
              )}
            </div>

            {/* DESCRIPTION */}

            <p
              className="
                text-sm
                text-muted-foreground
                leading-relaxed
              "
            >
              {product?.description ||
                "Product description is not available."}
            </p>

            {/* META */}

            <div
              className="
                grid
                grid-cols-2
                gap-4
                py-4
                border-y
                border-border/50
                text-xs
              "
            >
              <div>
                <span
                  className="
                    block
                    text-muted-foreground
                    uppercase
                    tracking-wider
                    mb-1
                  "
                >
                  SKU:
                </span>

                <span
                  className="
                    font-semibold
                    text-foreground
                  "
                >
                  {product?.sku ||
                    "N/A"}
                </span>
              </div>

              <div>
                <span
                  className="
                    block
                    text-muted-foreground
                    uppercase
                    tracking-wider
                    mb-1
                  "
                >
                  Category:
                </span>

                <span
                  className="
                    font-semibold
                    text-foreground
                  "
                >
                  {categoryName ||
                    "Uncategorized"}
                </span>
              </div>
            </div>

            {/* QUANTITY */}

            <div className="space-y-4 pt-2">
              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >
                <span
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-muted-foreground
                  "
                >
                  Quantity:
                </span>

                <div
                  className="
                    flex
                    items-center
                    border
                    border-border
                    rounded-lg
                    bg-card
                    overflow-hidden
                  "
                >
                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= 1
                    }
                    className="
                      px-3
                      py-2
                      hover:bg-muted
                      transition-colors
                      disabled:opacity-40
                    "
                  >
                    <Minus
                      size={16}
                    />
                  </button>

                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    max={
                      stock || 1
                    }
                    onChange={
                      handleQuantityChange
                    }
                    className="
                      w-14
                      text-center
                      text-sm
                      font-semibold
                      bg-transparent
                      border-none
                      focus:outline-none
                    "
                  />

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      stock <= 0 ||
                      quantity >=
                        stock
                    }
                    className="
                      px-3
                      py-2
                      hover:bg-muted
                      transition-colors
                      disabled:opacity-40
                    "
                  >
                    <Plus
                      size={16}
                    />
                  </button>
                </div>
              </div>

              {/* ACTION BUTTONS */}

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-4
                  pt-2
                "
              >
                <button
                  type="button"
                  onClick={
                    handleAddToCart
                  }
                  disabled={
                    stock <= 0 ||
                    isAdding
                  }
                  className="
                    w-full
                    py-4
                    bg-primary
                    text-primary-foreground
                    font-semibold
                    rounded-lg
                    shadow-lg
                    hover:bg-primary/90
                    transition-all
                    flex
                    items-center
                    justify-center
                    gap-2
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {isAdding ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <ShoppingCart
                      size={18}
                    />
                  )}

                  {stock <= 0
                    ? "Out of Stock"
                    : isAdding
                    ? "Adding..."
                    : "Add to Cart"}
                </button>

                <button
                  type="button"
                  disabled={
                    stock <= 0
                  }
                  className="
                    w-full
                    py-4
                    bg-foreground
                    text-background
                    font-semibold
                    rounded-lg
                    shadow-lg
                    hover:bg-foreground/90
                    transition-all
                    flex
                    items-center
                    justify-center
                    gap-2
                    disabled:opacity-50
                  "
                >
                  <CreditCard
                    size={18}
                  />

                  Buy It Now
                </button>
              </div>

              {/* SECONDARY ACTIONS */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  pt-2
                "
              >
                <button
                  type="button"
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    text-xs
                    text-muted-foreground
                    hover:text-primary
                    transition-colors
                    font-medium
                  "
                >
                  <Heart
                    size={18}
                  />

                  Add to Wishlist
                </button>

                <button
                  type="button"
                  onClick={
                    handleShare
                  }
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    text-xs
                    text-muted-foreground
                    hover:text-primary
                    transition-colors
                    font-medium
                  "
                >
                  <Share2
                    size={18}
                  />

                  Share Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          DETAILS
      ================================================================= */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-16
          border-t
          border-border/40
        "
      >
        <div
          className="
            border-b
            border-border/60
          "
        >
          <nav
            className="
              flex
              gap-8
              text-sm
              font-medium
              overflow-x-auto
            "
          >
            <button
              type="button"
              className="
                border-b-2
                border-primary
                text-primary
                pb-4
                whitespace-nowrap
              "
            >
              Description
            </button>

            <button
              type="button"
              className="
                text-muted-foreground
                pb-4
                whitespace-nowrap
              "
            >
              Specifications
            </button>

            <button
              type="button"
              className="
                text-muted-foreground
                pb-4
                whitespace-nowrap
              "
            >
              Care Instructions
            </button>

            <button
              type="button"
              className="
                text-muted-foreground
                pb-4
                whitespace-nowrap
              "
            >
              Shipping & Returns
            </button>

            <button
              type="button"
              className="
                text-muted-foreground
                pb-4
                whitespace-nowrap
              "
            >
              Reviews
            </button>
          </nav>
        </div>

        <div className="py-8 space-y-6">
          <div
            className="
              max-w-3xl
              space-y-4
            "
          >
            <h3
              className="
                font-heading
                text-xl
                font-bold
                text-foreground
              "
            >
              {product?.name}
            </h3>

            {product?.longDescription && (
              <p
                className="
                  text-sm
                  text-muted-foreground
                  leading-relaxed
                "
              >
                {
                  product.longDescription
                }
              </p>
            )}

            {product?.description && (
              <p
                className="
                  text-sm
                  text-muted-foreground
                  leading-relaxed
                "
              >
                {
                  product.description
                }
              </p>
            )}

            {product?.description1 && (
              <p
                className="
                  text-sm
                  text-muted-foreground
                  leading-relaxed
                "
              >
                {
                  product.description1
                }
              </p>
            )}
          </div>

          {/* SPECIFICATIONS */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-6
              pt-6
            "
          >
            <SpecificationCard
              icon={Ruler}
              title="Dimensions & Weight"
              value={
                product
                  ?.specifications
                  ?.dimensions ||
                product
                  ?.dimensions ||
                "Not specified"
              }
            />

            <SpecificationCard
              icon={Leaf}
              title="Material"
              value={
                product
                  ?.specifications
                  ?.material ||
                product?.material ||
                "Not specified"
              }
            />

            <SpecificationCard
              icon={Sun}
              title="Placement"
              value={
                product
                  ?.specifications
                  ?.placement ||
                "Not specified"
              }
            />

            <SpecificationCard
              icon={Box}
              title="Weight"
              value={
                product
                  ?.specifications
                  ?.weight ||
                product?.weight ||
                "Not specified"
              }
            />

            <SpecificationCard
              icon={Sparkles}
              title="Finish"
              value={
                product
                  ?.specifications
                  ?.finish ||
                product?.finish ||
                "Not specified"
              }
            />

            <SpecificationCard
              icon={Trees}
              title="Indoor / Outdoor Use"
              value={
                product
                  ?.specifications
                  ?.usage ||
                product?.usage ||
                "Not specified"
              }
            />
          </div>
        </div>
      </section>
    </>
  );
};

/*
|--------------------------------------------------------------------------
| Specification Card
|--------------------------------------------------------------------------
*/

const SpecificationCard = ({
  icon: Icon,
  title,
  value,
}) => {
  return (
    <div
      className="
        p-5
        bg-card
        border
        border-border/50
        rounded-xl
        flex
        gap-4
      "
    >
      <Icon
        size={24}
        className="
          text-primary
          flex-shrink-0
        "
      />

      <div>
        <h4
          className="
            font-heading
            font-bold
            text-sm
            mb-1
          "
        >
          {title}
        </h4>

        <p
          className="
            text-xs
            text-muted-foreground
            leading-relaxed
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default ProductDetailHeroSection;