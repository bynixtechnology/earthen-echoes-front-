import React, { useEffect, useMemo, useState, useRef } from "react";
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
  X,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  selectProducts,
  selectProductsLoading,
  selectProductError,
  selectProductsPagination,
} from "../../../redux/slices/productSlice";

import { selectWishlistItems } from "../../../redux/slices/wishlistSlice";
import { fetchProducts } from "../../../redux/thunks/productThunk";
import { addProductToCart } from "../../../redux/thunks/cartThunk";
import { getWishlist, toggleWishlist } from "../../../redux/thunks/wishlistThunk";
import { CategoryService } from "../../../services/categoryService";
import { showToast } from "../../../config/toast";

const CORAL = "#F16937";
const TEAL = "#1BACB1";
const BLUSH = "#F5B5D0";
const RASPBERRY = "#E44587";
const GREEN = "#76A845";
const DARK_TEAL = "#0D7D82";

const ProductCard = () => {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(selectWishlistItems);
  const products = useSelector(selectProducts) || [];
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductError);
  const pagination = useSelector(selectProductsPagination) || {};

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
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category");
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const productsPerPage = 12;

  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */
  const [search, setSearch] = useState("");
  const [openAccordions, setOpenAccordions] = useState(new Set());
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState(3);

  const productGridClass = {
    1: "grid-cols-1 sm:grid-cols-1 lg:grid-cols-1",
    2: "grid-cols-2 lg:grid-cols-2",
    3: "grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  }[gridColumns];

  useEffect(() => {
    if (!isMobileFilterOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileFilterOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileFilterOpen]);

  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || ""
  );
  const [availability, setAvailability] = useState("all");
  const [maxPrice, setMaxPrice] = useState(10000);

  /*
  |--------------------------------------------------------------------------
  | All Categories
  |--------------------------------------------------------------------------
  */
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Set Page In URL
  |--------------------------------------------------------------------------
  */
  const setCurrentPage = (page) => {
    const nextPage = Math.max(1, Number(page) || 1);

    setSearchParams((previousParams) => {
      const params = new URLSearchParams(previousParams);

      if (nextPage === 1) {
        params.delete("page");
      } else {
        params.set("page", String(nextPage));
      }

      return params;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Load All Categories
  |--------------------------------------------------------------------------
  */
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoryError("");

      const response = await CategoryService.getAll({
        page: 1,
        limit: 100,
      });

      const categoryData =
        response?.data || response?.categories || [];

      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (categoryApiError) {
      console.error("CATEGORY API ERROR:", categoryApiError);
      setCategoryError(
        categoryApiError?.response?.data?.message ||
          "Unable to load categories."
      );
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    dispatch(getWishlist());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Sync URL Category
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    setSelectedCategory(categoryFromUrl || "");
  }, [categoryFromUrl]);

  /*
  |--------------------------------------------------------------------------
  | Fetch Products
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: productsPerPage,
    };

    if (search.trim()) {
      params.search = search.trim();
    }

    if (selectedCategory) {
      params.category = selectedCategory;
    }

    if (Number(maxPrice) < 10000) {
      params.maxPrice = Number(maxPrice);
    }

    if (availability === "inStock") {
      params.inStock = true;
    }

    if (availability === "outOfStock") {
      params.inStock = false;
    }

    dispatch(fetchProducts(params));
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
  const handleCategoryChange = (categoryId) => {
    const nextCategory = selectedCategory === categoryId ? "" : categoryId;

    setSelectedCategory(nextCategory);

    setSearchParams((previousParams) => {
      const params = new URLSearchParams(previousParams);
      params.delete("page");

      if (nextCategory) {
        params.set("category", nextCategory);
      } else {
        params.delete("category");
      }

      return params;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Filter Handlers
  |--------------------------------------------------------------------------
  */
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    if (currentPage !== 1) setCurrentPage(1);
  };

  const handlePriceChange = (event) => {
    setMaxPrice(Number(event.target.value));
    if (currentPage !== 1) setCurrentPage(1);
  };

  const handleAvailabilityChange = (value) => {
    setAvailability(value);
    if (currentPage !== 1) setCurrentPage(1);
  };

  const toggleAccordion = (section) => {
    setOpenAccordions((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setAvailability("all");
    setMaxPrice(10000);
    setSearchParams({});
  };

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */
  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await dispatch(
        addProductToCart({
          productId: product._id,
          quantity: 1,
        })
      ).unwrap();

      showToast.success(response?.message || "Product added to cart.");
    } catch (error) {
      showToast.error(
        error?.message || error || "Unable to add product."
      );
    }
  };

  const handleWishlist = async (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const response = await dispatch(
        toggleWishlist(product._id)
      ).unwrap();
      showToast.success(response.message);
    } catch (error) {
      showToast.error(error?.message || error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Page Change
  |--------------------------------------------------------------------------
  */
  const handlePageChange = (page) => {
    if (
      loading ||
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Visible Pages
  |--------------------------------------------------------------------------
  */
  const visiblePages = useMemo(() => {
    if (totalPages <= 0) return [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [currentPage, totalPages]);

  /*
  |--------------------------------------------------------------------------
  | Initial Loading & Error States
  |--------------------------------------------------------------------------
  */
  if (loading && products.length === 0) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-[500px] flex items-center justify-center text-center px-4">
        <div className="max-w-md w-full border border-border rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-heading font-bold mb-2">
            Unable to load products
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <button
            type="button"
            onClick={() => {
              dispatch(
                fetchProducts({
                  page: currentPage,
                  limit: productsPerPage,
                })
              );
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm">
           
            <span className="text-gray-600 font-medium">Home</span>
          </div>
          <span className="text-gray-300 text-xl">›</span>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full px-5 py-3 font-semibold shadow-sm">
            Catalogue
          </div>
        </div>

        {/* Toolbar */}
        <div className="hidden lg:block bg-white rounded-[28px] border border-[#ECE7E2] shadow-sm px-6 py-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            <p className="hidden lg:block text-[20px] text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {products.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">
                {totalProducts}
              </span>{" "}
              products
            </p>

            <div className="flex items-center gap-4">
              <select
                className="
                  hidden
                  lg:block
                  h-14
                  w-64
                  rounded-2xl
                  border-2
                  border-[#CDE8E8]
                  bg-white
                  px-6
                  text-lg
                  font-medium
                  outline-none
                  cursor-pointer
                "
              >
                <option>Best Selling</option>
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>

              <div className="hidden lg:flex overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {[1, 2, 3, 4].map((columns) => (
                  <button
                    key={columns}
                    type="button"
                    onClick={() => setGridColumns(columns)}
                    title={`${columns} ${columns === 1 ? "column" : "columns"}`}
                    aria-label={`Show products in ${columns} ${columns === 1 ? "column" : "columns"}`}
                    aria-pressed={gridColumns === columns}
                    className={`
                      relative
                      w-14
                      h-14
                      flex
                      items-center
                      justify-center
                      border-r
                      last:border-r-0
                      border-gray-200
                      transition-all
                      duration-200
                      ${
                        gridColumns === columns
                          ? "bg-orange-500 text-white"
                          : "bg-white text-gray-500 hover:bg-orange-50 hover:text-orange-500"
                      }
                    `}
                  >
                    <span
                      className="grid gap-[2px]"
                      style={{
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        width:
                          columns === 1
                            ? "10px"
                            : columns === 2
                            ? "16px"
                            : columns === 3
                            ? "20px"
                            : "22px",
                      }}
                    >
                      {Array.from({ length: columns * 2 }).map((_, index) => (
                        <span
                          key={index}
                          className="block h-[6px] min-w-[3px] rounded-[1px] bg-current"
                        />
                      ))}
                    </span>
                    <span className="sr-only">{columns} grid</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-5">
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="
            w-full
            min-h-12
            px-5
            py-3
            rounded-xl
            border
            border-border/60
            bg-white
            shadow-sm
            flex
            items-center
            justify-between
            gap-3
            text-sm
            font-semibold
            text-gray-800
            transition
            hover:bg-gray-50
            active:scale-[0.99]
          "
          aria-label="Open filters"
          aria-expanded={isMobileFilterOpen}
        >
          <span className="flex items-center gap-2">
            <Funnel size={18} className="text-primary" />
            Filters
          </span>
          <span className="text-xs font-medium text-primary">Open</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:w-64 h-full flex-shrink-0 space-y-7 bg-card p-6 rounded-xl border border-border/60 self-start lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <h3 className="font-heading font-bold text-base flex items-center gap-2">
              <Funnel size={18} className="text-primary" />
              Filters
            </h3>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-primary hover:underline font-medium"
            >
              Clear All
            </button>
          </div>

          <FilterSection
            title="Categories"
            open={openAccordions.has("Categories")}
            onToggle={() => toggleAccordion("Categories")}
          >
            {categoriesLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 size={15} className="animate-spin" />
                Loading Categories...
              </div>
            ) : categoryError ? (
              <div className="space-y-2">
                <p className="text-xs text-red-500">{categoryError}</p>
                <button
                  onClick={loadCategories}
                  className="text-xs text-primary"
                >
                  Try Again
                </button>
              </div>
            ) : categories.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No Categories Found
              </p>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`w-full text-left px-3 py-2 rounded-xl ${
                    selectedCategory === ""
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-muted"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryChange(category._id)}
                    className={`w-full text-left px-3 py-2 rounded-xl ${
                      selectedCategory === category._id
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </FilterSection>

          <FilterSection
            title="Price Range"
            open={openAccordions.has("Price")}
            onToggle={() => toggleAccordion("Price")}
          >
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹0</span>
                <span>₹{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={10000}
                step={100}
                value={maxPrice}
                onChange={handlePriceChange}
                className="w-full accent-primary"
              />
            </div>
          </FilterSection>

          <FilterSection
            title="Availability"
            open={openAccordions.has("Availability")}
            onToggle={() => toggleAccordion("Availability")}
          >
            <div className="space-y-2">
              {[
                { value: "all", label: "All Products" },
                { value: "inStock", label: "In Stock Only" },
                { value: "outOfStock", label: "Out Of Stock" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === option.value}
                    onChange={() => handleAvailabilityChange(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Ratings"
            open={openAccordions.has("Ratings")}
            onToggle={() => toggleAccordion("Ratings")}
          >
            <div className="space-y-1">
              {[4, 3, 2].map((r) => (
                <button
                  key={r}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl w-full hover:bg-gray-50 transition-colors"
                >
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className="text-xs"
                        style={{ color: s <= r ? "#F59E0B" : "#E5E7EB" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">& above</span>
                </button>
              ))}
            </div>
          </FilterSection>
        </aside>

        {/* Products Display Area */}
        <div className="flex-1 min-w-0">
          {products.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🏺</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-3">
                No Products Found
              </h2>
              <p className="text-gray-500 mb-6">Try adjusting your filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSearch("");
                  clearFilters();
                }}
                className="px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:scale-105 transition"
                style={{
                  background: `linear-gradient(135deg, ${CORAL}, #E85520)`,
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Grid Layout */}
              <div
                className={`grid ${productGridClass} gap-3 sm:gap-6 lg:gap-8`}
              >
                {/* First 9 Products */}
                {products.slice(0, 6).map((product) => (
                  <ProductGallery
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    wishlistItems={wishlistItems}
                    onWishlist={handleWishlist}
                  />
                ))}

                {/* Mid-Grid Banner */}
                {products.length > 6 && (
                  <div className="col-span-full relative rounded-3xl overflow-hidden min-h-[260px]">
                    <img
                      src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200"
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/55" />
                    <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-between p-10">
                      <div>
                        <p className="uppercase tracking-[4px] text-white/70 text-sm mb-2">
                          Artisan Collection
                        </p>
                        <h2 className="text-4xl font-bold text-white mb-4">
                          Crafted by Hands
                        </h2>
                        <p className="text-white/80 max-w-xl">
                          Every handcrafted terracotta product tells a story of
                          skilled artisans from Rajasthan.
                        </p>
                      </div>
                      <button
                        className="mt-6 lg:mt-0 px-8 py-3 rounded-full text-white font-semibold shadow-xl hover:scale-105 transition"
                        style={{
                          background: `linear-gradient(135deg, ${CORAL}, #E85520)`,
                        }}
                      >
                        Explore Collection →
                      </button>
                    </div>
                  </div>
                )}

                {/* Remaining Products */}
                {products.slice(6).map((product) => (
                  <ProductGallery
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    wishlistItems={wishlistItems}
                    onWishlist={handleWishlist}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-14">
                  <button
                    disabled={!hasPreviousPage}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-6 py-3 rounded-full border hover:bg-gray-100 disabled:opacity-40"
                  >
                    ← Previous
                  </button>

                  {visiblePages.map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-11 h-11 rounded-full font-semibold transition ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "border hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={!hasNextPage}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-6 py-3 rounded-full border hover:bg-gray-100 disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              )}

              <p className="text-center text-sm text-gray-500 mt-5">
                Showing <span className="font-semibold">{products.length}</span>{" "}
                products • Page{" "}
                <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter Modal */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition ${
          isMobileFilterOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isMobileFilterOpen}
      >
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setIsMobileFilterOpen(false)}
          className={`absolute inset-0 w-full h-full bg-black/45 transition-opacity duration-300 ${
            isMobileFilterOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Product filters"
          className={`absolute left-0 top-0 h-full w-[88%] max-w-[360px] overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 ease-out ${
            isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="space-y-7">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <h3 className="font-heading font-bold text-base flex items-center gap-2">
                <Funnel size={18} className="text-primary" />
                Filters
              </h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-primary hover:underline font-medium"
              >
                Clear All
              </button>
            </div>

            <FilterSection
              title="Categories"
              open={openAccordions.has("Categories")}
              onToggle={() => toggleAccordion("Categories")}
            >
              {categoriesLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 size={15} className="animate-spin" />
                  Loading Categories...
                </div>
              ) : categoryError ? (
                <div className="space-y-2">
                  <p className="text-xs text-red-500">{categoryError}</p>
                  <button
                    onClick={loadCategories}
                    className="text-xs text-primary"
                  >
                    Try Again
                  </button>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No Categories Found
                </p>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange("")}
                    className={`w-full text-left px-3 py-2 rounded-xl ${
                      selectedCategory === ""
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryChange(category._id)}
                      className={`w-full text-left px-3 py-2 rounded-xl ${
                        selectedCategory === category._id
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-muted"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </FilterSection>

            <FilterSection
              title="Price Range"
              open={openAccordions.has("Price")}
              onToggle={() => toggleAccordion("Price")}
            >
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹0</span>
                  <span>₹{formatPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10000}
                  step={100}
                  value={maxPrice}
                  onChange={handlePriceChange}
                  className="w-full accent-primary"
                />
              </div>
            </FilterSection>

            <FilterSection
              title="Availability"
              open={openAccordions.has("Availability")}
              onToggle={() => toggleAccordion("Availability")}
            >
              <div className="space-y-2">
                {[
                  { value: "all", label: "All Products" },
                  { value: "inStock", label: "In Stock Only" },
                  { value: "outOfStock", label: "Out Of Stock" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === option.value}
                      onChange={() => handleAvailabilityChange(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="Ratings"
              open={openAccordions.has("Ratings")}
              onToggle={() => toggleAccordion("Ratings")}
            >
              <div className="space-y-1">
                {[4, 3, 2].map((r) => (
                  <button
                    key={r}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl w-full hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className="text-xs"
                          style={{ color: s <= r ? "#F59E0B" : "#E5E7EB" }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">& above</span>
                  </button>
                ))}
              </div>
            </FilterSection>
          </div>

          <div className="sticky bottom-0 -mx-6 mt-6 border-t border-gray-100 bg-white p-4">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Show Products
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
};

/*
|--------------------------------------------------------------------------
| Sub-Components
|--------------------------------------------------------------------------
*/
const FilterSection = ({ title, open, onToggle, children }) => {
  const contentRef = useRef(null);

  return (
    <div className="border-b border-gray-100 pb-1 h-full">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-gray-800 hover:text-gray-900 transition-colors"
      >
        {title}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        <div className="pb-3">{children}</div>
      </div>
    </div>
  );
};

const Stars = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill={
            s <= Math.floor(rating)
              ? "#F59E0B"
              : s - 0.5 <= rating
              ? "url(#half)"
              : "#E5E7EB"
          }
        >
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
          <path d="M6 1l1.4 2.8 3.1.45-2.25 2.2.53 3.1L6 8.15 3.22 9.55l.53-3.1L1.5 4.25l3.1-.45z" />
        </svg>
      ))}
    </div>
  );
};



const ProductGallery = ({
  product,
  onAddToCart,
  wishlistItems,
  onWishlist,
}) => {
  const [hovered, setHovered] = useState(false);

  // Extract Primary Image
  const image1 =
    product?.images?.[0]?.url ||
    product?.images?.[0]?.secure_url ||
    (typeof product?.images?.[0] === "string"
      ? product.images[0]
      : null) ||
    "/placeholder.png";

  const isWishlisted = wishlistItems?.some((item) => {
    return (
      item.product === product._id ||
      item.product?._id === product._id ||
      item._id === product._id
    );
  });

  // Dynamic Tag Style Generator based on Pill UI Design
  const getTagStyle = (tagName = "") => {
    const lowerName = tagName.toLowerCase();

    if (
      lowerName.includes("natural") ||
      lowerName.includes("handmade") ||
      lowerName.includes("painted") ||
      lowerName.includes("vase") ||
      lowerName.includes("planter")
    ) {
      return {
        bg: "bg-[#FFF6ED]",
        text: "text-[#E85D35]",
        icon: "✦",
      };
    }

    if (
      lowerName.includes("eco") ||
      lowerName.includes("organic") ||
      lowerName.includes("green")
    ) {
      return {
        bg: "bg-[#F2FAF1]",
        text: "text-[#5B9E3A]",
        icon: "♻",
      };
    }

    if (lowerName.includes("india") || lowerName.includes("made")) {
      return {
        bg: "bg-[#EFF6FF]",
        text: "text-[#3B82F6]",
        prefix: "IN",
      };
    }

    // Default Fallback pill style
    return {
      bg: "bg-[#F3F4F6]",
      text: "text-[#374151]",
      icon: "•",
    };
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block h-full"
    >
      <div
        className="
          w-full
          max-w-full
          bg-white
          rounded-[28px]
          overflow-hidden
          border
          border-[#EFE7DF]
          shadow-sm
          transition-all
          duration-500
          flex
          flex-col
          justify-between
          
        "
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div>
          {/* ============================================================
              IMAGE CONTAINER
          ============================================================= */}
          <div
            className="
              relative
              w-full
              aspect-square
              overflow-hidden
              bg-[#FBF6F2]
            "
          >
            {/* Primary Product Image */}
            <img
              src={image1}
              alt={product?.title || "Product"}
              className="
                w-full
                h-full
                object-cover
                
              "
            />

            {/* DESKTOP HOVER OVERLAY */}
            <div
              className="
                hidden
                md:block
                absolute
                inset-0
                bg-gradient-to-t
                from-black/45
                via-black/10
                to-transparent
                opacity-0
                group-hover:opacity-100
                transition-all
                duration-300
              "
            />

            {/* DISCOUNT BADGE */}
            {product?.discountPercentage > 0 && (
              <span
                className="
                  absolute
                  top-3
                  left-3
                  sm:top-4
                  sm:left-4
                  bg-white
                  text-[#EF3D7A]
                  text-[12px]
                  sm:text-[14px]
                  font-bold
                  px-3
                  py-1.5
                  rounded-full
                  shadow-sm
                  z-10
                "
              >
                -{product.discountPercentage}%
              </span>
            )}

            {/* FEATURED / BEST SELLER BADGE */}
            {product?.isFeatured && (
              <span
                className="
                  absolute
                  top-3
                  left-3
                  sm:top-4
                  sm:left-4
                  bg-[#F16937]
                  text-white
                  text-[12px]
                  sm:text-[14px]
                  font-semibold
                  px-3
                  py-1.5
                  rounded-full
                  shadow-sm
                  z-10
                "
              >
                Best Seller
              </span>
            )}

            {/* MOBILE WISHLIST BUTTON */}
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onWishlist(event, product);
              }}
              aria-label={
                isWishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className="
                absolute
                top-3
                right-3
                md:hidden
                w-9
                h-9
                rounded-full
                bg-white/95
                backdrop-blur
                shadow-md
                flex
                items-center
                justify-center
                active:scale-95
                transition-transform
                z-10
              "
            >
              <Heart
                size={16}
                color="#8B8F98"
                fill={isWishlisted ? "#EF4444" : "none"}
              />
            </button>

            {/* DESKTOP WISHLIST BUTTON */}
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onWishlist(event, product);
              }}
              aria-label={
                isWishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className="
                hidden
                md:flex
                absolute
                top-4
                right-4
                w-12
                h-12
                rounded-full
                bg-white
                shadow-md
                items-center
                justify-center
                transition-all
                hover:scale-105
                z-10
              "
            >
              <Heart
                size={21}
                color="#8B8F98"
                fill={isWishlisted ? "#EF4444" : "none"}
              />
            </button>

            {/* DESKTOP HOVER ACTIONS */}
            <div
              className="
                hidden
                md:block
                absolute
                bottom-0
                left-0
                right-0
                p-4
                translate-y-full
                opacity-0
                group-hover:translate-y-0
                group-hover:opacity-100
                transition-all
                duration-300
                z-10
              "
            >
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onWishlist(event, product);
                  }}
                  aria-label={
                    isWishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  className="
                    w-12
                    h-11
                    rounded-2xl
                    bg-white
                    border
                    border-primary/20
                    shadow-lg
                    flex
                    items-center
                    justify-center
                    transition-all
                    hover:bg-red-50
                  "
                >
                  <Heart
                    size={18}
                    color="#EF4444"
                    fill={isWishlisted ? "#EF4444" : "none"}
                  />
                </button>

                <button
                  type="button"
                  disabled={product?.stock <= 0}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="
                    flex-1
                    h-11
                    rounded-2xl
                    bg-[#F16937]
                    hover:bg-[#F16937]/90
                    text-white
                    font-semibold
                    shadow-xl
                    hover:opacity-90
                    transition-all
                    disabled:bg-gray-300
                    disabled:cursor-not-allowed
                  "
                >
                  {product?.stock > 0 ? "Add To Cart" : "Out Of Stock"}
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================
              CARD CONTENT
          ============================================================= */}
          <div className="p-5">
            {/* CATEGORY */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span
                className="
                  inline-flex
                  items-center
                  text-[13px]
                  font-semibold
                  capitalize
                  tracking-wide
                  text-[#12A8AD]
                "
              >
                {product?.category?.name || "Category"}
              </span>
            </div>

            {/* PRODUCT TITLE */}
            <h3
              className="
                mt-2
                font-heading
                text-[15px]
                font-bold
                text-[#171C2B]
                leading-[1.25]
                line-clamp-2
              "
            >
              {product?.title || "Product"}
            </h3>

            {/* PRICE */}
            <div className="mt-3 flex flex-wrap items-end gap-2">
              <span className="text-[14px] font-bold text-[#F16937]">
                ₹{Number(product?.price || 0).toLocaleString()}
              </span>

              {product?.originalPrice > product?.price && (
                <span className="text-[11px] text-[#9AA0AD] line-through">
                  ₹{Number(product.originalPrice).toLocaleString()}
                </span>
              )}
            </div>

            {/* SAVINGS */}
            {product?.originalPrice > product?.price && (
              <p className="mt-1 text-[10px] font-medium text-green-600">
                You Save ₹
                {Number(
                  product.originalPrice - product.price
                ).toLocaleString()}
              </p>
            )}

            {/* DYNAMIC PRODUCT TAGS - Compact & Responsive Layout Fix */}
            {Array.isArray(product?.productTags) &&
              product.productTags.length > 0 && (
                <div className="mt-3 flex items-center gap-1.5 flex-wrap max-w-full">
                  {product.productTags.slice(0, 2).map((tag) => {
                    const style = getTagStyle(tag?.name);
                    return (
                      <span
                        key={tag?._id || tag?.name}
                        title={tag?.name}
                        className={`
                          inline-flex
                          items-center
                          gap-1
                          px-2.5
                          py-1
                          rounded-full
                          text-[11px]
                          font-medium
                          max-w-[110px]
                          ${style.bg}
                          ${style.text}
                        `}
                      >
                        {style.icon && (
                          <span className="text-[10px] shrink-0">{style.icon}</span>
                        )}
                        {style.prefix && (
                          <span className="font-bold text-[9px] uppercase tracking-wider opacity-80 shrink-0">
                            {style.prefix}
                          </span>
                        )}
                        <span className="truncate">{tag?.name}</span>
                      </span>
                    );
                  })}
                </div>
              )}

            {/* STOCK STATUS */}
            <div className="mt-2.5 hidden sm:flex items-center justify-between">
              <span
                className={`
                  px-2.5
                  py-0.5
                  rounded-full
                  text-[10px]
                  font-semibold
                  ${
                    product?.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }
                `}
              >
                {product?.stock > 0 ? "In Stock" : "Out Of Stock"}
              </span>
            </div>
          </div>
        </div>

        {/* MOBILE ADD TO CART */}
        <div className="px-5 pb-3 pt-0 md:hidden">
          <button
            type="button"
            disabled={product?.stock <= 0}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onAddToCart(product);
            }}
            className="
              w-full
              py-2.5
              px-3
              rounded-xl
              bg-[#F16937]
              hover:bg-[#F16937]/90
              active:scale-[0.98]
              text-white
              text-sm
              font-semibold
              shadow-sm
              transition-all
              disabled:bg-gray-200
              disabled:text-gray-400
              disabled:cursor-not-allowed
            "
          >
            {product?.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </Link>
  );
};


export default ProductCard;