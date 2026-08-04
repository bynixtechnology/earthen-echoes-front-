
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Funnel,
  Heart,
  Eye,
  ShoppingCart,
  Star,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Search,
  RefreshCw,
} from "lucide-react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";



import {
  selectProducts,
  selectProductsLoading,
  selectProductError,
  selectProductsPagination,
} from "../../../redux/slices/productSlice";

import {
  selectWishlistItems,
} from "../../../redux/slices/wishlistSlice";

import {
  fetchProducts,
} from "../../../redux/thunks/productThunk";

import {
  addProductToCart,
} from "../../../redux/thunks/cartThunk";

import {
  getWishlist,
  toggleWishlist,
} from "../../../redux/thunks/wishlistThunk";

import {
  CategoryService,
} from "../../../services/categoryService";


import { showToast } from "../../../config/toast";


const ProductCard = () => {

  const dispatch =
    useDispatch();

  const wishlistItems =
    useSelector(
      selectWishlistItems
    );


  const products =
    useSelector(
      selectProducts
    ) || [];


  const loading =
    useSelector(
      selectProductsLoading
    );


  const error =
    useSelector(
      selectProductError
    );


  const pagination =
    useSelector(
      selectProductsPagination
    ) || {};


  const {
    totalProducts = 0,
    totalPages = 0,
    hasNextPage = false,
    hasPreviousPage = false,
  } = pagination;




  /*
  |--------------------------------------------------------------------------
  | URL
  |--------------------------------------------------------------------------
  */

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  const categoryFromUrl =
    searchParams.get(
      "category"
    );


  const currentPage =
    Math.max(
      1,
      Number(
        searchParams.get(
          "page"
        )
      ) || 1
    );


  const productsPerPage =
    12


  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  const [
    search,
    setSearch,
  ] = useState("");


  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(
    categoryFromUrl || ""
  );


  const [
    availability,
    setAvailability,
  ] = useState("all");


  const [
    maxPrice,
    setMaxPrice,
  ] = useState(10000);


  /*
  |--------------------------------------------------------------------------
  | All Categories
  |--------------------------------------------------------------------------
  */

  const [
    categories,
    setCategories,
  ] = useState([]);


  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(false);


  const [
    categoryError,
    setCategoryError,
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Set Page In URL
  |--------------------------------------------------------------------------
  */

  const setCurrentPage = (
    page
  ) => {

    const nextPage =
      Math.max(
        1,
        Number(page) || 1
      );


    setSearchParams(
      (
        previousParams
      ) => {

        const params =
          new URLSearchParams(
            previousParams
          );


        if (
          nextPage === 1
        ) {

          params.delete(
            "page"
          );

        } else {

          params.set(
            "page",
            String(
              nextPage
            )
          );

        }


        return params;

      }
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Load All Categories
  |--------------------------------------------------------------------------
  */

  const loadCategories =
    async () => {

      try {

        setCategoriesLoading(
          true
        );

        setCategoryError("");


        const response =
          await CategoryService.getAll({

            page: 1,

            limit: 100,

          });


        const categoryData =
          response?.data ||
          response?.categories ||
          [];


        setCategories(
          Array.isArray(
            categoryData
          )
            ? categoryData
            : []
        );

      } catch (
      categoryApiError
      ) {

        console.error(
          "CATEGORY API ERROR:",
          categoryApiError
        );


        setCategoryError(
          categoryApiError
            ?.response
            ?.data
            ?.message ||
          "Unable to load categories."
        );

      } finally {

        setCategoriesLoading(
          false
        );

      }

    };


  useEffect(() => {

    loadCategories();

    dispatch(
      getWishlist()
    );

  }, [dispatch]);


  /*
  |--------------------------------------------------------------------------
  | Sync URL Category
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    setSelectedCategory(
      categoryFromUrl || ""
    );

  }, [
    categoryFromUrl,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Fetch Products
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | Pagination + filters are sent to backend.
  |
  */

  useEffect(() => {

    const params = {

      page:
        currentPage,

      limit:
        productsPerPage,

    };


    if (
      search.trim()
    ) {

      params.search =
        search.trim();

    }


    if (
      selectedCategory
    ) {

      params.category =
        selectedCategory;

    }


    if (
      Number(maxPrice) <
      10000
    ) {

      params.maxPrice =
        Number(
          maxPrice
        );

    }


    if (
      availability ===
      "inStock"
    ) {

      params.inStock =
        true;

    }


    if (
      availability ===
      "outOfStock"
    ) {

      params.inStock =
        false;

    }


    dispatch(
      fetchProducts(
        params
      )
    );

  }, [

    dispatch,

    currentPage,

    search,

    selectedCategory,

    maxPrice,

    availability,

  ]);


  /*
  |--------------------------------------------------------------------------
  | Category Change
  |--------------------------------------------------------------------------
  */

  const handleCategoryChange =
    (
      categoryId
    ) => {

      const nextCategory =

        selectedCategory ===
          categoryId

          ? ""

          : categoryId;


      setSelectedCategory(
        nextCategory
      );


      setSearchParams(
        (
          previousParams
        ) => {

          const params =
            new URLSearchParams(
              previousParams
            );


          params.delete(
            "page"
          );


          if (
            nextCategory
          ) {

            params.set(
              "category",
              nextCategory
            );

          } else {

            params.delete(
              "category"
            );

          }


          return params;

        }
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Search Change
  |--------------------------------------------------------------------------
  */

  const handleSearchChange =
    (
      event
    ) => {

      setSearch(
        event.target.value
      );


      if (
        currentPage !== 1
      ) {

        setCurrentPage(1);

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Price Change
  |--------------------------------------------------------------------------
  */

  const handlePriceChange =
    (
      event
    ) => {

      setMaxPrice(
        Number(
          event.target.value
        )
      );


      if (
        currentPage !== 1
      ) {

        setCurrentPage(1);

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Availability Change
  |--------------------------------------------------------------------------
  */

  const handleAvailabilityChange =
    (
      value
    ) => {

      setAvailability(
        value
      );


      if (
        currentPage !== 1
      ) {

        setCurrentPage(1);

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Clear Filters
  |--------------------------------------------------------------------------
  */

  const clearFilters =
    () => {

      setSearch("");

      setSelectedCategory("");

      setAvailability(
        "all"
      );

      setMaxPrice(
        10000
      );


      setSearchParams(
        {}
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const formatPrice =
    (
      price
    ) => {

      return Number(
        price || 0
      ).toLocaleString(
        "en-IN"
      );

    };


  const getProductImage =
    (
      product
    ) => {

      const firstImage =
        product
          ?.images?.[0];


      if (
        typeof firstImage ===
        "string"
      ) {

        return firstImage;

      }


      return (

        firstImage?.url ||

        firstImage
          ?.secure_url ||

        "/placeholder.png"

      );

    };

  const handleAddToCart = async (product) => {
    try {
      const response = await dispatch(
        addProductToCart({
          productId: product._id,
          quantity: 1,
        })
      ).unwrap();

      showToast.success(
        response?.message || "Product added to cart."
      );

    } catch (error) {

      showToast.error(
        error?.message ||
        error ||
        "Unable to add product."
      );

    }
  };


  const handleWishlist = async (
    event,
    product
  ) => {

    event.preventDefault();

    event.stopPropagation();

    try {

      const response =
        await dispatch(
          toggleWishlist(
            product._id
          )
        ).unwrap();

      showToast.success(
        response.message
      );

    } catch (error) {

      showToast.error(
        error?.message ||
        error
      );

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Page Change
  |--------------------------------------------------------------------------
  */

  const handlePageChange =
    (
      page
    ) => {

      if (
        loading ||
        page < 1 ||
        page > totalPages ||
        page === currentPage
      ) {

        return;

      }


      setCurrentPage(
        page
      );


      window.scrollTo({

        top: 0,

        behavior:
          "smooth",

      });

    };


  /*
  |--------------------------------------------------------------------------
  | Visible Pages
  |--------------------------------------------------------------------------
  */

  const visiblePages =
    useMemo(
      () => {

        if (
          totalPages <= 0
        ) {

          return [];

        }


        if (
          totalPages <= 5
        ) {

          return Array.from(

            {
              length:
                totalPages,
            },

            (
              _,
              index
            ) =>
              index + 1

          );

        }


        let start =
          Math.max(
            1,
            currentPage - 2
          );


        let end =
          Math.min(
            totalPages,
            start + 4
          );


        if (
          end - start < 4
        ) {

          start =
            Math.max(
              1,
              end - 4
            );

        }


        return Array.from(

          {
            length:
              end -
              start +
              1,
          },

          (
            _,
            index
          ) =>
            start + index

        );

      },

      [
        currentPage,
        totalPages,
      ]

    );


  /*
  |--------------------------------------------------------------------------
  | Initial Loading
  |--------------------------------------------------------------------------
  */

  if (
    loading &&
    products.length === 0
  ) {

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
          size={36}
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
          Loading products...
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
    products.length === 0
  ) {

    return (

      <div
        className="
          min-h-[500px]
          flex
          items-center
          justify-center
          text-center
          px-4
        "
      >

        <div
          className="
            max-w-md
            w-full
            border
            border-border
            rounded-2xl
            bg-card
            p-8
            shadow-sm
          "
        >

          <h2
            className="
              text-xl
              font-heading
              font-bold
              mb-2
            "
          >
            Unable to load products
          </h2>

          <p
            className="
              text-sm
              text-muted-foreground
              mb-6
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={() => {

              dispatch(
                fetchProducts({

                  page:
                    currentPage,

                  limit:
                    productsPerPage,

                })
              );

            }}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-5
              py-2.5
              rounded-lg
              bg-primary
              text-primary-foreground
              text-sm
              font-semibold
            "
          >

            <RefreshCw
              size={16}
            />

            Try Again

          </button>

        </div>

      </div>

    );

  }


  return (

    <section
      className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-12
      "
    >

      {/* Header */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-4
          mb-8
        "
      >

        <div>

          <h2
            className="
              text-2xl
              font-heading
              font-bold
            "
          >
            Our Products
          </h2>

          <p
            className="
              text-sm
              text-muted-foreground
              mt-1
            "
          >

            Showing{" "}

            <strong>
              {products.length}
            </strong>

            {" "}of{" "}

            <strong>
              {totalProducts}
            </strong>

            {" "}products

          </p>

        </div>


        <div
          className="
            relative
            w-full
            sm:w-80
          "
        >

          <Search
            size={17}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <input
            type="text"
            value={search}
            onChange={
              handleSearchChange
            }
            placeholder="Search products or SKU..."
            className="
              w-full
              border
              border-border
              rounded-lg
              pl-10
              pr-4
              py-3
              text-sm
              bg-card
              outline-none
              focus:ring-1
              focus:ring-primary
            "
          />

        </div>

      </div>


      <div
        className="
          flex
          flex-col
          lg:flex-row
          gap-8
        "
      >

        {/* Sidebar */}

        <aside
          className="
            w-full
            lg:w-64
            flex-shrink-0
            space-y-7
            bg-card
            p-6
            rounded-xl
            border
            border-border/60
            self-start
            lg:sticky
            lg:top-24
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-border/60
              pb-4
            "
          >

            <h3
              className="
                font-heading
                font-bold
                text-base
                flex
                items-center
                gap-2
              "
            >

              <Funnel
                size={18}
                className="
                  text-primary
                "
              />

              Filters

            </h3>


            <button
              type="button"
              onClick={
                clearFilters
              }
              className="
                text-xs
                text-primary
                hover:underline
                font-medium
              "
            >
              Clear All
            </button>

          </div>


          {/* All Categories */}

          <div className="space-y-3">

            <h4
              className="
      font-heading
      font-bold
      text-xs
      uppercase
      tracking-wider
    "
            >
              All Categories
            </h4>

            {categoriesLoading ? (

              <div
                className="
        flex
        items-center
        gap-2
        text-sm
        text-muted-foreground
      "
              >
                <Loader2
                  size={15}
                  className="animate-spin"
                />

                Loading categories...
              </div>

            ) : categoryError ? (

              <div className="space-y-2">

                <p className="text-xs text-red-500">
                  {categoryError}
                </p>

                <button
                  type="button"
                  onClick={loadCategories}
                  className="
          text-xs
          text-primary
          hover:underline
        "
                >
                  Try again
                </button>

              </div>

            ) : categories.length === 0 ? (

              <p
                className="
        text-xs
        text-muted-foreground
      "
              >
                No categories found.
              </p>

            ) : (

              <div className="space-y-3">

                <label
                  className="
          flex
          items-center
          gap-3
          cursor-pointer
          text-sm
        "
                >

                  <input
                    type="radio"
                    name="category"
                    checked={!selectedCategory}
                    onChange={() =>
                      handleCategoryChange("")
                    }
                    className="
            w-4
            h-4
            accent-primary
            cursor-pointer
          "
                  />

                  <span>
                    All Categories
                  </span>

                </label>

                {categories.map(
                  (category) => (

                    <label
                      key={category._id}
                      className="
              flex
              items-center
              gap-3
              cursor-pointer
              text-sm
              text-muted-foreground
              hover:text-foreground
              transition-colors
            "
                    >

                      <input
                        type="radio"
                        name="category"
                        checked={
                          selectedCategory ===
                          category._id
                        }
                        onChange={() =>
                          handleCategoryChange(
                            category._id
                          )
                        }
                        className="
                w-4
                h-4
                accent-primary
                cursor-pointer
              "
                      />

                      <span>
                        {category.name}
                      </span>

                    </label>

                  )
                )}

              </div>

            )}

          </div>


          {/* Price */}

          <div
            className="
              space-y-3
              border-t
              border-border/40
              pt-6
            "
          >

            <h4
              className="
                font-heading
                font-bold
                text-xs
                uppercase
                tracking-wider
              "
            >
              Price Range
            </h4>


            <div
              className="
                flex
                justify-between
                text-xs
                text-muted-foreground
              "
            >

              <span>
                ₹0
              </span>

              <span>
                Up to ₹
                {formatPrice(
                  maxPrice
                )}
              </span>

            </div>


            <input
              type="range"
              min={0}
              max={10000}
              step={100}
              value={
                maxPrice
              }
              onChange={
                handlePriceChange
              }
              className="
                w-full
                accent-primary
              "
            />

          </div>


          {/* Availability */}

          <div
            className="
              space-y-3
              border-t
              border-border/40
              pt-6
            "
          >

            <h4
              className="
                font-heading
                font-bold
                text-xs
                uppercase
                tracking-wider
              "
            >
              Availability
            </h4>


            {[
              {
                value:
                  "all",

                label:
                  "All Products",
              },

              {
                value:
                  "inStock",

                label:
                  "In Stock Only",
              },

              {
                value:
                  "outOfStock",

                label:
                  "Out of Stock",
              },

            ].map(
              (
                option
              ) => (

                <label
                  key={
                    option.value
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    cursor-pointer
                  "
                >

                  <input
                    type="radio"
                    name="availability"
                    checked={
                      availability ===
                      option.value
                    }
                    onChange={() =>
                      handleAvailabilityChange(
                        option.value
                      )
                    }
                    className="
                      accent-primary
                    "
                  />

                  {option.label}

                </label>

              )
            )}

          </div>

        </aside>


        {/* Products */}

        <div
          className="
            flex-1
            min-w-0
          "
        >

          {loading &&
            products.length > 0 && (

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  mb-5
                  text-sm
                  text-muted-foreground
                "
              >

                <Loader2
                  size={17}
                  className="
                    animate-spin
                  "
                />

                Loading page...

              </div>

            )}


          {!loading &&
            products.length === 0 ? (

            <div
              className="
                min-h-[400px]
                border
                border-border/60
                rounded-xl
                flex
                flex-col
                items-center
                justify-center
                text-center
                p-8
                bg-card
              "
            >

              <Funnel
                size={40}
                className="
                  text-muted-foreground
                  mb-4
                "
              />

              <h3
                className="
                  font-bold
                  text-lg
                "
              >
                No products found
              </h3>

              <p
                className="
                  text-sm
                  text-muted-foreground
                  mt-2
                "
              >
                Try changing your
                search or filters.
              </p>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="
                  mt-5
                  px-5
                  py-2.5
                  bg-primary
                  text-primary-foreground
                  rounded-lg
                  text-sm
                  font-semibold
                "
              >
                Clear Filters
              </button>

            </div>

          ) : (

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3
                gap-8
              "
            >

              {products.map(
                (
                  product
                ) => {

                  const stock =
                    Number(
                      product
                        ?.stock
                    ) || 0; const isWishlisted =
                      Array.isArray(
                        wishlistItems
                      ) &&
                      wishlistItems.some(
                        (item) =>
                          item.productId?._id ===
                          product._id
                      );




                  const inStock =
                    stock > 0;


                  return (

                    <Link
                      key={
                        product._id
                      }
                      to={
                        `/products/${product._id}`
                      }
                      className="
                        group
                        bg-card
                        rounded-xl
                        overflow-hidden
                        shadow-sm
                        hover:shadow-lg
                        hover:-translate-y-1
                        transition-all
                        duration-300
                        flex
                        flex-col
                        border
                        border-border/40
                      "
                    >

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
                            getProductImage(
                              product
                            )
                          }
                          alt={
                            product
                              ?.title ||
                            "Product"
                          }
                          loading="lazy"
                          onError={(
                            event
                          ) => {

                            event
                              .currentTarget
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


                        <span
                          className={`
                            absolute
                            top-3
                            left-3
                            px-2.5
                            py-1
                            rounded-full
                            text-[10px]
                            font-bold
                            z-10

                            ${inStock

                              ? "bg-green-100 text-green-700"

                              : "bg-red-100 text-red-700"
                            }
                          `}
                        >

                          {inStock

                            ? "In Stock"

                            : "Out of Stock"}

                        </span>


                        <button
                          type="button"
                          aria-label="Add to wishlist"
                          onClick={(event) =>
                            handleWishlist(
                              event,
                              product
                            )
                          }
                          className="
                            absolute
                            top-3
                            right-3
                            w-9
                            h-9
                            rounded-full
                            bg-background/90
                            flex
                            items-center
                            justify-center
                            text-primary
                            shadow
                            z-20
                          "
                        >

                         <Heart
  size={17}
  className={
    isWishlisted
      ? "fill-red-500 text-red-500"
      : ""
  }
/>

                        </button>


                        <div
                          className="
                            absolute
                            inset-x-0
                            bottom-0
                            p-4
                            bg-gradient-to-t
                            from-black/60
                            to-transparent
                            translate-y-full
                            group-hover:translate-y-0
                            transition-transform
                            duration-300
                            flex
                            justify-center
                          "
                        >

                          <button
                            type="button"
                            onClick={(
                              event
                            ) => {

                              event
                                .preventDefault();

                              event
                                .stopPropagation();

                            }}
                            className="
                              px-4
                              py-2
                              bg-background
                              text-foreground
                              rounded-md
                              text-xs
                              font-semibold
                              flex
                              items-center
                              gap-1.5
                            "
                          >

                            <Eye
                              size={14}
                            />

                            Quick View

                          </button>

                        </div>

                      </div>


                      <div
                        className="
                          p-5
                          flex-1
                          flex
                          flex-col
                          justify-between
                        "
                      >

                        <div>

                          <p
                            className="
                              text-[11px]
                              uppercase
                              tracking-wider
                              text-primary
                              font-semibold
                              mb-2
                            "
                          >

                            {typeof product
                              ?.category ===
                              "object"

                              ? product
                                ?.category
                                ?.name ||
                              "Uncategorized"

                              : "Uncategorized"}

                          </p>


                          <div
                            className="
                              flex
                              items-center
                              gap-1
                              text-xs
                              mb-2
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
                                  key={
                                    index
                                  }
                                  size={12}
                                  fill="currentColor"
                                  className="
                                    text-amber-500
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
                              {product
                                ?.rating ||
                                0}
                              )
                            </span>

                          </div>


                          <h3
                            className="
                              font-heading
                              text-lg
                              font-bold
                              group-hover:text-primary
                              transition-colors
                              mb-1
                              line-clamp-2
                            "
                          >

                            {product
                              ?.title ||
                              "Untitled Product"}

                          </h3>


                          {product
                            ?.sku && (

                              <p
                                className="
                                text-[11px]
                                text-muted-foreground
                                mb-2
                              "
                              >

                                SKU:{" "}
                                {
                                  product.sku
                                }

                              </p>

                            )}


                          <p
                            className="
                              text-xs
                              text-muted-foreground
                              line-clamp-2
                              mb-4
                            "
                          >

                            {product
                              ?.description ||
                              "No description available."}

                          </p>

                        </div>


                        <div
                          className="
                            border-t
                            border-border/40
                            pt-4
                          "
                        >

                          <div
                            className="
                              flex
                              flex-wrap
                              items-center
                              gap-2
                              mb-4
                            "
                          >

                            <span
                              className="
                                font-heading
                                text-lg
                                font-bold
                                text-primary
                              "
                            >

                              ₹
                              {formatPrice(
                                product
                                  ?.price
                              )}

                            </span>


                            {product
                              ?.originalPrice &&
                              Number(
                                product
                                  .originalPrice
                              ) >
                              Number(
                                product
                                  ?.price ||
                                0
                              ) && (

                                <span
                                  className="
                                  text-xs
                                  text-muted-foreground
                                  line-through
                                "
                                >

                                  ₹
                                  {formatPrice(
                                    product
                                      .originalPrice
                                  )}

                                </span>

                              )}

                          </div>


                          <button
                            type="button"
                            disabled={
                              !inStock
                            }
                            onClick={(
                              event
                            ) => {

                              event
                                .preventDefault();

                              event
                                .stopPropagation();


                              if (
                                inStock
                              ) {

                                handleAddToCart(
                                  product
                                );

                              }

                            }}
                            className="
                              w-full
                              px-4
                              py-2.5
                              bg-primary
                              text-primary-foreground
                              rounded-lg
                              text-xs
                              font-semibold
                              hover:bg-primary/90
                              flex
                              items-center
                              justify-center
                              gap-1.5
                              disabled:opacity-50
                              disabled:cursor-not-allowed
                            "
                          >

                            <ShoppingCart
                              size={14}
                            />

                            {inStock

                              ? "Add to Cart"

                              : "Out of Stock"}

                          </button>

                        </div>

                      </div>

                    </Link>

                  );

                }
              )}

            </div>

          )}


          {/* Pagination */}

          {totalProducts > 0 &&
            totalPages > 1 && (

              <div
                className="
                border-t
                border-border/60
                mt-10
                pt-8
              "
              >

                <div
                  className="
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-3
                "
                >

                  <button
                    type="button"
                    disabled={
                      loading ||
                      !hasPreviousPage ||
                      currentPage === 1
                    }
                    onClick={() =>
                      handlePageChange(
                        currentPage - 1
                      )
                    }
                    className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2.5
                    rounded-lg
                    border
                    border-border
                    text-sm
                    font-medium
                    hover:bg-muted
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                  >

                    <ArrowLeft
                      size={16}
                    />

                    Previous

                  </button>


                  {visiblePages[0] >
                    1 && (
                      <>

                        <button
                          type="button"
                          disabled={
                            loading
                          }
                          onClick={() =>
                            handlePageChange(
                              1
                            )
                          }
                          className="
                        w-10
                        h-10
                        rounded-lg
                        border
                        border-border
                        text-sm
                        font-semibold
                      "
                        >
                          1
                        </button>

                        {visiblePages[0] >
                          2 && (

                            <span>
                              ...
                            </span>

                          )}

                      </>
                    )}


                  {visiblePages.map(
                    (
                      page
                    ) => (

                      <button
                        key={
                          page
                        }
                        type="button"
                        disabled={
                          loading
                        }
                        onClick={() =>
                          handlePageChange(
                            page
                          )
                        }
                        className={`
                        w-10
                        h-10
                        rounded-lg
                        text-sm
                        font-semibold
                        transition-colors

                        ${currentPage ===
                            page

                            ? "bg-primary text-primary-foreground"

                            : "border border-border hover:bg-muted"
                          }
                      `}
                      >

                        {page}

                      </button>

                    )
                  )}


                  {visiblePages[
                    visiblePages.length -
                    1
                  ] < totalPages && (
                      <>

                        {visiblePages[
                          visiblePages.length -
                          1
                        ] <
                          totalPages - 1 && (

                            <span>
                              ...
                            </span>

                          )}

                        <button
                          type="button"
                          disabled={
                            loading
                          }
                          onClick={() =>
                            handlePageChange(
                              totalPages
                            )
                          }
                          className="
                        w-10
                        h-10
                        rounded-lg
                        border
                        border-border
                        text-sm
                        font-semibold
                      "
                        >

                          {totalPages}

                        </button>

                      </>
                    )}


                  <button
                    type="button"
                    disabled={
                      loading ||
                      !hasNextPage ||
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      handlePageChange(
                        currentPage + 1
                      )
                    }
                    className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2.5
                    rounded-lg
                    border
                    border-border
                    text-sm
                    font-medium
                    hover:bg-muted
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                  >

                    Next

                    <ArrowRight
                      size={16}
                    />

                  </button>

                </div>


                <p
                  className="
                  text-center
                  text-xs
                  text-muted-foreground
                  mt-4
                "
                >

                  Page{" "}

                  <strong>
                    {currentPage}
                  </strong>

                  {" "}of{" "}

                  <strong>
                    {totalPages}
                  </strong>

                  {" "}•{" "}

                  <strong>
                    {totalProducts}
                  </strong>

                  {" "}total products

                </p>

              </div>

            )}

        </div>

      </div>

    </section>

  );

};


export default ProductCard;