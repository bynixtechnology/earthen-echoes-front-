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
  useCart,
} from "../../core/context/CartContext";



import {
  selectProducts,
  selectProductsLoading,
  selectProductError,
} from "../../../redux/slices/productSlice";
import { fetchProducts } from "../../../redux/thunks/productThunk";


const ProductCard = () => {
  /*
  |--------------------------------------------------------------------------
  | Redux
  |--------------------------------------------------------------------------
  */

  const dispatch =
    useDispatch();

  const products =
    useSelector(
      selectProducts
    );

  const loading =
    useSelector(
      selectProductsLoading
    );

  const error =
    useSelector(
      selectProductError
    );


  /*
  |--------------------------------------------------------------------------
  | Cart
  |--------------------------------------------------------------------------
  */

  const {
    addToCart,
  } = useCart();


  /*
  |--------------------------------------------------------------------------
  | URL Query Parameters
  |--------------------------------------------------------------------------
  */

  const [
    searchParams,
  ] = useSearchParams();

  const categoryFromUrl =
    searchParams.get(
      "category"
    );


  /*
  |--------------------------------------------------------------------------
  | Filter State
  |--------------------------------------------------------------------------
  */

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState([]);

  const [
    selectedMaterials,
    setSelectedMaterials,
  ] = useState([]);

  const [
    selectedPlacements,
    setSelectedPlacements,
  ] = useState([]);

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
  | Pagination
  |--------------------------------------------------------------------------
  */

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const productsPerPage = 9;


  /*
  |--------------------------------------------------------------------------
  | Fetch Products Using Redux
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(
      fetchProducts()
    );
  }, [dispatch]);


  /*
  |--------------------------------------------------------------------------
  | Apply Category Filter From URL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategories([
        categoryFromUrl,
      ]);
    } else {
      setSelectedCategories([]);
    }

    setCurrentPage(1);
  }, [categoryFromUrl]);


  /*
  |--------------------------------------------------------------------------
  | Dynamic Categories
  |--------------------------------------------------------------------------
  */

  const categories =
    useMemo(() => {
      const categoryMap =
        new Map();

      products.forEach(
        (product) => {
          const category =
            product?.category;

          if (!category) {
            return;
          }

          const id =
            typeof category ===
            "object"
              ? category?._id
              : category;

          const name =
            typeof category ===
            "object"
              ? category?.name
              : "Category";

          if (!id) {
            return;
          }

          if (
            categoryMap.has(id)
          ) {
            categoryMap.get(
              id
            ).count += 1;
          } else {
            categoryMap.set(
              id,
              {
                _id: id,

                name:
                  name ||
                  "Category",

                count: 1,
              }
            );
          }
        }
      );

      return Array.from(
        categoryMap.values()
      );
    }, [products]);


  /*
  |--------------------------------------------------------------------------
  | Dynamic Materials
  |--------------------------------------------------------------------------
  */

  const materials =
    useMemo(() => {
      const values =
        products
          .map(
            (product) =>
              product
                ?.specifications
                ?.composition
          )
          .filter(Boolean);

      return [
        ...new Set(values),
      ];
    }, [products]);


  /*
  |--------------------------------------------------------------------------
  | Dynamic Placements
  |--------------------------------------------------------------------------
  */

  const placements =
    useMemo(() => {
      const values =
        products
          .map(
            (product) =>
              product
                ?.specifications
                ?.placement
          )
          .filter(Boolean);

      return [
        ...new Set(values),
      ];
    }, [products]);


  /*
  |--------------------------------------------------------------------------
  | Maximum Product Price
  |--------------------------------------------------------------------------
  */

  const highestPrice =
    useMemo(() => {
      if (
        products.length === 0
      ) {
        return 10000;
      }

      const highest =
        Math.max(
          ...products.map(
            (product) =>
              Number(
                product?.price
              ) || 0
          )
        );

      return (
        Math.ceil(
          highest / 500
        ) * 500 || 10000
      );
    }, [products]);


  /*
  |--------------------------------------------------------------------------
  | Set Initial Maximum Price
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      products.length > 0
    ) {
      setMaxPrice(
        highestPrice
      );
    }
  }, [
    products.length,
    highestPrice,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Category Filter Change
  |--------------------------------------------------------------------------
  */

  const handleCategoryChange =
    (categoryId) => {
      setSelectedCategories(
        (previous) => {
          if (
            previous.includes(
              categoryId
            )
          ) {
            return previous.filter(
              (id) =>
                id !==
                categoryId
            );
          }

          return [
            ...previous,
            categoryId,
          ];
        }
      );

      setCurrentPage(1);
    };


  /*
  |--------------------------------------------------------------------------
  | Material Filter Change
  |--------------------------------------------------------------------------
  */

  const handleMaterialChange =
    (material) => {
      setSelectedMaterials(
        (previous) => {
          if (
            previous.includes(
              material
            )
          ) {
            return previous.filter(
              (item) =>
                item !==
                material
            );
          }

          return [
            ...previous,
            material,
          ];
        }
      );

      setCurrentPage(1);
    };


  /*
  |--------------------------------------------------------------------------
  | Placement Filter Change
  |--------------------------------------------------------------------------
  */

  const handlePlacementChange =
    (placement) => {
      setSelectedPlacements(
        (previous) => {
          if (
            previous.includes(
              placement
            )
          ) {
            return previous.filter(
              (item) =>
                item !==
                placement
            );
          }

          return [
            ...previous,
            placement,
          ];
        }
      );

      setCurrentPage(1);
    };


  /*
  |--------------------------------------------------------------------------
  | Filter Products
  |--------------------------------------------------------------------------
  */

  const filteredProducts =
    useMemo(() => {
      return products.filter(
        (product) => {
          /*
          | Search
          */

          const searchValue =
            search
              .trim()
              .toLowerCase();

          const title =
            String(
              product?.title || ""
            ).toLowerCase();

          const sku =
            String(
              product?.sku || ""
            ).toLowerCase();

          const collectionName =
            String(
              product
                ?.collectionName ||
                ""
            ).toLowerCase();

          const matchesSearch =
            !searchValue ||
            title.includes(
              searchValue
            ) ||
            sku.includes(
              searchValue
            ) ||
            collectionName.includes(
              searchValue
            );


          /*
          | Category
          */

          const categoryId =
            typeof product
              ?.category ===
            "object"
              ? product
                  ?.category
                  ?._id
              : product
                  ?.category;

          const matchesCategory =
            selectedCategories
              .length === 0 ||
            selectedCategories.includes(
              categoryId
            );


          /*
          | Price
          */

          const productPrice =
            Number(
              product?.price
            ) || 0;

          const matchesPrice =
            productPrice <=
            Number(maxPrice);


          /*
          | Material
          */

          const composition =
            product
              ?.specifications
              ?.composition;

          const matchesMaterial =
            selectedMaterials
              .length === 0 ||
            selectedMaterials.includes(
              composition
            );


          /*
          | Placement
          */

          const placement =
            product
              ?.specifications
              ?.placement;

          const matchesPlacement =
            selectedPlacements
              .length === 0 ||
            selectedPlacements.includes(
              placement
            );


          /*
          | Availability
          */

          const stock =
            Number(
              product?.stock
            ) || 0;

          let matchesAvailability =
            true;

          if (
            availability ===
            "inStock"
          ) {
            matchesAvailability =
              stock > 0;
          }

          if (
            availability ===
            "outOfStock"
          ) {
            matchesAvailability =
              stock <= 0;
          }


          return (
            matchesSearch &&
            matchesCategory &&
            matchesPrice &&
            matchesMaterial &&
            matchesPlacement &&
            matchesAvailability
          );
        }
      );
    }, [
      products,
      search,
      selectedCategories,
      maxPrice,
      selectedMaterials,
      selectedPlacements,
      availability,
    ]);


  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const totalPages =
    Math.max(
      1,

      Math.ceil(
        filteredProducts.length /
          productsPerPage
      )
    );

  const startIndex =
    (currentPage - 1) *
    productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      startIndex,

      startIndex +
        productsPerPage
    );


  /*
  |--------------------------------------------------------------------------
  | Reset Page When Filters Change
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    maxPrice,
    availability,
    selectedMaterials,
    selectedPlacements,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Prevent Invalid Current Page
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Clear Filters
  |--------------------------------------------------------------------------
  */

  const clearFilters = () => {
    setSearch("");

    setSelectedCategories([]);

    setSelectedMaterials([]);

    setSelectedPlacements([]);

    setAvailability("all");

    setMaxPrice(
      highestPrice
    );

    setCurrentPage(1);
  };


  /*
  |--------------------------------------------------------------------------
  | Price Format
  |--------------------------------------------------------------------------
  */

  const formatPrice =
    (price) => {
      return Number(
        price || 0
      ).toLocaleString(
        "en-IN"
      );
    };


  /*
  |--------------------------------------------------------------------------
  | Product Image Helper
  |--------------------------------------------------------------------------
  */

  const getProductImage =
    (product) => {
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
        firstImage?.secure_url ||
        "/placeholder.png"
      );
    };


  /*
  |--------------------------------------------------------------------------
  | Loading UI
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
  | API Error UI
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
          flex-col
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

            onClick={() =>
              dispatch(
                fetchProducts()
              )
            }

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
              hover:bg-primary/90
              transition-colors
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
        flex-1
      "
    >
      {/* ================================================================
          HEADER + SEARCH
      ================================================================= */}

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
              {
                filteredProducts.length
              }
            </strong>

            {" "}of{" "}

            <strong>
              {products.length}
            </strong>

            {" "}products
          </p>
        </div>


        {/* Search */}

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
              pointer-events-none
            "
          />

          <input
            type="text"

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            placeholder=
              "Search products or SKU..."

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
              transition
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
        {/* ================================================================
            FILTER SIDEBAR
        ================================================================= */}

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
          {/* Filter Header */}

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

                className=
                  "text-primary"
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


          {/* ============================================================
              CATEGORY
          ============================================================= */}

          <div
            className=
              "space-y-3"
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
              Category
            </h4>

            <div
              className="
                space-y-2
                text-sm
                text-muted-foreground
              "
            >
              {categories.length ===
              0 ? (
                <p
                  className=
                    "text-xs"
                >
                  No categories
                </p>
              ) : (
                categories.map(
                  (category) => (
                    <label
                      key={
                        category._id
                      }

                      className="
                        flex
                        items-center
                        gap-2
                        cursor-pointer
                        hover:text-foreground
                      "
                    >
                      <input
                        type="checkbox"

                        checked={
                          selectedCategories.includes(
                            category._id
                          )
                        }

                        onChange={() =>
                          handleCategoryChange(
                            category._id
                          )
                        }

                        className="
                          rounded
                          accent-primary
                        "
                      />

                      <span
                        className="
                          flex-1
                          truncate
                        "
                      >
                        {
                          category.name
                        }
                      </span>

                      <span
                        className="
                          text-xs
                          text-muted-foreground
                        "
                      >
                        (
                        {
                          category.count
                        }
                        )
                      </span>
                    </label>
                  )
                )
              )}
            </div>
          </div>


          {/* ============================================================
              PRICE
          ============================================================= */}

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
              className=
                "space-y-4"
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  text-xs
                  text-muted-foreground
                "
              >
                <span>
                  ₹0
                </span>

                <span>
                  Up to ₹
                  {
                    formatPrice(
                      maxPrice
                    )
                  }
                </span>
              </div>

              <input
                type="range"

                min={0}

                max={
                  highestPrice
                }

                step={100}

                value={
                  maxPrice
                }

                onChange={(e) => {
                  setMaxPrice(
                    Number(
                      e.target.value
                    )
                  );

                  setCurrentPage(1);
                }}

                className="
                  w-full
                  h-1
                  bg-muted
                  rounded-lg
                  appearance-none
                  cursor-pointer
                  accent-primary
                "
              />
            </div>
          </div>


          {/* ============================================================
              AVAILABILITY
          ============================================================= */}

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

            <div
              className=
                "space-y-2"
            >
              <label
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
                    "all"
                  }

                  onChange={() => {
                    setAvailability(
                      "all"
                    );

                    setCurrentPage(1);
                  }}

                  className=
                    "accent-primary"
                />

                All Products
              </label>


              <label
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
                    "inStock"
                  }

                  onChange={() => {
                    setAvailability(
                      "inStock"
                    );

                    setCurrentPage(1);
                  }}

                  className=
                    "accent-primary"
                />

                In Stock Only
              </label>


              <label
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
                    "outOfStock"
                  }

                  onChange={() => {
                    setAvailability(
                      "outOfStock"
                    );

                    setCurrentPage(1);
                  }}

                  className=
                    "accent-primary"
                />

                Out of Stock
              </label>
            </div>
          </div>
        </aside>


        {/* ================================================================
            PRODUCT AREA
        ================================================================= */}

        <div
          className="
            flex-1
            min-w-0
            flex
            flex-col
          "
        >
          {currentProducts.length ===
          0 ? (
            /*
            |--------------------------------------------------------------------------
            | Empty State
            |--------------------------------------------------------------------------
            */

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
                  max-w-sm
                "
              >
                No products match
                the selected filters.
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
                  hover:bg-primary/90
                  transition-colors
                "
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /*
            |--------------------------------------------------------------------------
            | Product Grid
            |--------------------------------------------------------------------------
            */

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3
                gap-8
              "
            >
              {currentProducts.map(
                (product) => {
                  const stock =
                    Number(
                      product?.stock
                    ) || 0;

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
                      {/* Image */}

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

                          onError={(e) => {
                            e.currentTarget.src =
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


                        {/* Stock Badge */}

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

                            ${
                              inStock
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                          `}
                        >
                          {
                            inStock
                              ? "In Stock"
                              : "Out of Stock"
                          }
                        </span>


                        {/* Wishlist */}

                        <button
                          type="button"

                          aria-label=
                            "Add to wishlist"

                          onClick={(e) => {
                            e.preventDefault();

                            e.stopPropagation();
                          }}

                          className="
                            absolute
                            top-3
                            right-3
                            w-9
                            h-9
                            rounded-full
                            bg-background/90
                            backdrop-blur-md
                            flex
                            items-center
                            justify-center
                            text-primary
                            shadow
                            z-20
                            hover:scale-105
                            transition-transform
                          "
                        >
                          <Heart
                            size={17}
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

                            onClick={(e) => {
                              e.preventDefault();

                              e.stopPropagation();
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
                              shadow-sm
                            "
                          >
                            <Eye
                              size={14}
                            />

                            Quick View
                          </button>
                        </div>
                      </div>


                      {/* Product Details */}

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
                          {/* Category */}

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
                            {
                              typeof product
                                ?.category ===
                              "object"
                                ? product
                                    ?.category
                                    ?.name ||
                                  "Uncategorized"
                                : "Uncategorized"
                            }
                          </p>


                          {/* Rating */}

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

                                  fill=
                                    "currentColor"

                                  className=
                                    "text-amber-500"
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
                                product
                                  ?.rating ||
                                0
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
                              line-clamp-2
                            "
                          >
                            {
                              product
                                ?.title ||
                              "Untitled Product"
                            }
                          </h3>


                          {/* SKU */}

                          {product?.sku && (
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
                              product
                                ?.description ||
                              "No description available."
                            }
                          </p>
                        </div>


                        <div
                          className="
                            border-t
                            border-border/40
                            pt-4
                          "
                        >
                          {/* Price */}

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
                              {
                                formatPrice(
                                  product
                                    ?.price
                                )
                              }
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
                                  {
                                    formatPrice(
                                      product
                                        .originalPrice
                                    )
                                  }
                                </span>
                              )}
                          </div>


                          {/* Add To Cart */}

                          <button
                            type="button"

                            disabled={
                              !inStock
                            }

                            onClick={(e) => {
                              e.preventDefault();

                              e.stopPropagation();

                              if (
                                inStock
                              ) {
                                addToCart(
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
                              transition-colors
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

                            {
                              inStock
                                ? "Add to Cart"
                                : "Out of Stock"
                            }
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          )}


          {/* ================================================================
              PAGINATION
          ================================================================= */}

          {filteredProducts.length >
            0 &&
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
                  {/* Previous */}

                  <button
                    type="button"

                    disabled={
                      currentPage === 1
                    }

                    onClick={() => {
                      setCurrentPage(
                        (previous) =>
                          Math.max(
                            1,

                            previous -
                              1
                          )
                      );

                      window.scrollTo({
                        top: 0,
                        behavior:
                          "smooth",
                      });
                    }}

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
                      transition-colors
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    <ArrowLeft
                      size={16}
                    />

                    Previous
                  </button>


                  {/* Page Numbers */}

                  {Array.from({
                    length:
                      totalPages,
                  }).map(
                    (
                      _,
                      index
                    ) => {
                      const page =
                        index + 1;

                      return (
                        <button
                          key={page}

                          type="button"

                          onClick={() => {
                            setCurrentPage(
                              page
                            );

                            window.scrollTo({
                              top: 0,

                              behavior:
                                "smooth",
                            });
                          }}

                          className={`
                            w-10
                            h-10
                            rounded-lg
                            text-sm
                            font-semibold
                            transition-colors

                            ${
                              currentPage ===
                              page
                                ? "bg-primary text-primary-foreground"
                                : "border border-border hover:bg-muted"
                            }
                          `}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}


                  {/* Next */}

                  <button
                    type="button"

                    disabled={
                      currentPage ===
                      totalPages
                    }

                    onClick={() => {
                      setCurrentPage(
                        (previous) =>
                          Math.min(
                            totalPages,

                            previous +
                              1
                          )
                      );

                      window.scrollTo({
                        top: 0,
                        behavior:
                          "smooth",
                      });
                    }}

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
                      transition-colors
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


                {/* Page Info */}

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
                </p>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default ProductCard;