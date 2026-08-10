import {
  useEffect,
  useState,
   useRef,
} from "react";

import {
  PlusCircle,
  Trash2,
  Edit,
  Loader2,
  X,
  Power,
  Star,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Tag,
} from "lucide-react";

import * as XLSX from "xlsx";

import {
  useNavigate,
} from "react-router-dom";

import {
  ProductService,
} from "../../../services/productService";

import {
  CategoryService,
} from "../../../services/categoryService";

import {
  ProductTagService,
} from "../../../services/productTagService";

import {
  showToast,
} from "../../../config/toast";

import {
  FRONTEND_MESSAGES,
} from "../../../constants/messages";


export default function Dashboard() {

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    productTagsList,
    setProductTagsList,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(null);

  const [
    statusLoading,
    setStatusLoading,
  ] = useState(null);

  const [
    featuredLoading,
    setFeaturedLoading,
  ] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    totalProducts,
    setTotalProducts,
  ] = useState(0);

  const [
    limit,
    setLimit,
  ] = useState(10);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");

  const [minPrice, setMinPrice] = useState("");

  const [maxPrice, setMaxPrice] = useState("");

  /*
|--------------------------------------------------------------------------
| Excel Import / Export States
|--------------------------------------------------------------------------
*/

  const fileInputRef = useRef(null);

  const [
    isExporting,
    setIsExporting,
  ] = useState(false);

  const [
    isImporting,
    setIsImporting,
  ] = useState(false);

  const [
    importProgress,
    setImportProgress,
  ] = useState({
    current: 0,
    total: 0,
    success: 0,
    failed: 0,
  });


  const navigate =
    useNavigate();


  /*
  |--------------------------------------------------------------------------
  | Fetch Products
  |--------------------------------------------------------------------------
  */

  const fetchProducts =
    async (
      page = currentPage,
      pageLimit = limit
    ) => {

      try {

        setIsLoading(true);

        const res =
          await ProductService.getAll({
            page,
            limit: pageLimit,
            search,
            category: categoryFilter,
            minPrice,
            maxPrice,
          });

        const productData =
          res?.data?.products ||
          res?.products ||
          (
            Array.isArray(
              res?.data
            )
              ? res.data
              : Array.isArray(
                res
              )
                ? res
                : []
          );


        setProducts(
          Array.isArray(
            productData
          )
            ? productData
            : []
        );


        const pagination =
          res?.data?.pagination ||
          res?.pagination ||
          {};


        setCurrentPage(
          Number(
            pagination
              ?.currentPage ||
            pagination?.page ||
            page
          )
        );


        setTotalPages(
          Math.max(
            Number(
              pagination
                ?.totalPages ||
              1
            ),
            1
          )
        );


        setTotalProducts(
          Number(
            pagination
              ?.totalProducts ??
            pagination?.total ??
            res?.totalProducts ??
            res?.results ??
            productData.length
          )
        );


      } catch (err) {

        console.error(
          "FETCH PRODUCTS ERROR:",
          err
        );

        showToast.error(
          FRONTEND_MESSAGES
            ?.PRODUCT
            ?.FETCH_FAILED ||
          "Unable to fetch products."
        );


        setProducts([]);

        setTotalProducts(0);

        setTotalPages(1);

      } finally {

        setIsLoading(false);

      }

    };

  const fetchCategories = async () => {
    try {
      const res = await CategoryService.getAll({
        page: 1,
        limit: 1000,
      });

      const list =
        res?.data?.categories ||
        res?.categories ||
        res?.data ||
        [];

      setCategories(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProductTags = async () => {
    try {
      const res = await ProductTagService.getAll();
      const list = res?.data || res || [];
      setProductTagsList(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        "Numerical ID": 2001,
        "SKU": "SKU-2001",
        "Product Title": "Bamboo Basket",
        "Collection": "Premium Collection",
        "Category": "Home & Kitchen",
        "Product Tags": "Best Seller, Eco Friendly",
        "Sale Price": 1500,
        "Original Price": 1800,
        "Discount %": 20,
        "Stock": 100,
        "Description":
          "Premium bamboo basket for home use.",
        "Long Description":
          "High quality bamboo basket made from natural bamboo. Perfect for storage, decoration and everyday use.",
        "Long Description 1":
          "Suitable for kitchen, bedroom, living room and gifting purpose.",
        "Dimensions": "20 x 15 x 10 cm",
        "Weight": "1.2 kg",
        "Composition": "Natural Bamboo",
        "Placement": "Indoor",
        "Finish": "Matte",
        "Status": "Active",
        "Featured": "No",
        "Product Image URL":
          "https://picsum.photos/seed/product1/800/800",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    worksheet["!cols"] = [
      { wch: 15 }, // Numerical ID
      { wch: 20 }, // SKU
      { wch: 35 }, // Product Title
      { wch: 25 }, // Collection
      { wch: 25 }, // Category
      { wch: 25 }, // Product Tags
      { wch: 15 }, // Sale Price
      { wch: 18 }, // Original Price
      { wch: 12 }, // Discount %
      { wch: 10 }, // Stock
      { wch: 45 }, // Description
      { wch: 70 }, // Long Description
      { wch: 70 }, // Long Description 1
      { wch: 22 }, // Dimensions
      { wch: 15 }, // Weight
      { wch: 25 }, // Composition
      { wch: 20 }, // Placement
      { wch: 20 }, // Finish
      { wch: 12 }, // Status
      { wch: 12 }, // Featured
      { wch: 70 }, // Product Image URL
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Products"
    );

    XLSX.writeFile(
      workbook,
      "product-import-template.xlsx"
    );

    showToast.success(
      "Product Excel template downloaded successfully."
    );
  };

  const getAllProductsForExport =
    async () => {

      const firstResponse =
        await ProductService.getAll({
          page: 1,
          limit: 100,
        });


      const firstProducts =
        firstResponse?.data?.products ||
        firstResponse?.products ||
        (
          Array.isArray(
            firstResponse?.data
          )
            ? firstResponse.data
            : []
        );


      const pagination =
        firstResponse?.data?.pagination ||
        firstResponse?.pagination ||
        {};


      const totalPagesToFetch =
        Number(
          pagination?.totalPages || 1
        ) || 1;


      let allProducts = [
        ...firstProducts,
      ];


      for (
        let page = 2;
        page <= totalPagesToFetch;
        page++
      ) {

        const response =
          await ProductService.getAll({
            page,
            limit: 100,
          });


        const pageProducts =
          response?.data?.products ||
          response?.products ||
          (
            Array.isArray(
              response?.data
            )
              ? response.data
              : []
          );


        allProducts = [
          ...allProducts,
          ...pageProducts,
        ];
      }


      return allProducts;
    };

  const handleExportProducts = async () => {
    try {
      setIsExporting(true);

      const allProducts =
        await getAllProductsForExport();

      if (
        !Array.isArray(allProducts) ||
        allProducts.length === 0
      ) {
        showToast.error(
          "No products available to export."
        );

        return;
      }

      const excelData =
        allProducts.map(
          (product, index) => ({
            "S.No": index + 1,

            "Numerical ID":
              product.numericalId ||
              product.numericId ||
              product.id ||
              "",

            "Product Title":
              product.title || "",

            "SKU":
              product.sku || "",

            "Collection":
              product.collectionName ||
              "",

            "Category ID":
              product.category?._id ||
              product.category ||
              "",

            "Category Name":
              product.category?.name ||
              "",

            "Product Tags": (product.productTags || [])
              .map((tag) => tag.name || tag)
              .join(", "),

            "Sale Price":
              Number(
                product.price || 0
              ),

            "Original Price":
              Number(
                product.originalPrice ||
                0
              ),

            "Discount %":
              Number(
                product.discountPercentage ||
                0
              ),

            "Stock":
              Number(
                product.stock || 0
              ),

            "Status":
              product.isActive
                ? "Active"
                : "Inactive",

            "Featured":
              product.isFeatured
                ? "Yes"
                : "No",

            "Short Description":
              product.description || "",

            "Long Description":
              product.longDescription ||
              "",

            "Dimensions":
              product.specifications
                ?.dimensions || "",

            "Weight":
              product.specifications
                ?.weight || "",

            "Composition":
              product.specifications
                ?.composition || "",

            "Placement":
              product.specifications
                ?.placement || "",

            "Finish":
              product.specifications
                ?.finish || "",
          })
        );

      const worksheet =
        XLSX.utils.json_to_sheet(
          excelData
        );

      worksheet["!cols"] = [
        { wch: 8 },
        { wch: 15 },
        { wch: 35 },
        { wch: 18 },
        { wch: 25 },
        { wch: 25 },
        { wch: 25 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 10 },
        { wch: 12 },
        { wch: 12 },
        { wch: 45 },
        { wch: 60 },
        { wch: 20 },
        { wch: 15 },
        { wch: 25 },
        { wch: 20 },
        { wch: 20 },
      ];

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Products"
      );

      const date =
        new Date()
          .toISOString()
          .split("T")[0];

      XLSX.writeFile(
        workbook,
        `products-${date}.xlsx`
      );

      showToast.success(
        `${allProducts.length} products exported successfully.`
      );

    } catch (error) {
      console.error(
        "EXPORT PRODUCTS ERROR:",
        error
      );

      showToast.error(
        error?.response?.data
          ?.message ||
        error?.message ||
        "Unable to export products."
      );

    } finally {
      setIsExporting(false);
    }
  };

  const handleImportExcel = async (event) => {

    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {

      showToast.error(
        "Please select a valid .xlsx or .xls file."
      );

      return;
    }

    try {

      setIsImporting(true);

      setImportProgress({
        current: 0,
        total: 100,
        success: 0,
        failed: 0,
      });

      const formData = new FormData();

      formData.append("file", file);

      const response =
        await ProductService.importExcel(
          formData,
          (progress) => {

            setImportProgress({
              current: progress,
              total: 100,
              success: 0,
              failed: 0,
            });

          }
        );

      setImportProgress({
        current: 100,
        total: 100,
        success:
          response?.successCount ||
          response?.data?.successCount ||
          0,
        failed:
          response?.failedCount ||
          response?.data?.failedCount ||
          0,
      });

      showToast.success(
        response?.message ||
        "Products imported successfully."
      );

      await fetchProducts(1, limit);

      if (currentPage !== 1) {
        setCurrentPage(1);
      }

    } catch (error) {

      console.error(
        "IMPORT EXCEL ERROR:",
        error
      );

      showToast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to import Excel file."
      );

    } finally {

      setIsImporting(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Fetch Whenever Page / Limit Changes
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    fetchProducts(
      currentPage,
      limit
    );

  }, [

    currentPage,

    limit,

    search,

    categoryFilter,

    minPrice,

    maxPrice,

  ]);

  useEffect(() => {

    fetchCategories();
    fetchProductTags();

  }, []);




  /*
  |--------------------------------------------------------------------------
  | Delete Product
  |--------------------------------------------------------------------------
  */

  const handleDelete =
    async (
      targetId
    ) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this product?"
        );

      if (!confirmed) {
        return;
      }


      try {

        setActionLoading(
          targetId
        );


        await ProductService.delete(
          targetId
        );


        showToast.success(
          FRONTEND_MESSAGES
            ?.PRODUCT
            ?.DELETE_SUCCESS ||
          "Product deleted successfully."
        );


        if (
          products.length === 1 &&
          currentPage > 1
        ) {

          setCurrentPage(
            currentPage - 1
          );

        } else {

          await fetchProducts(
            currentPage,
            limit
          );

        }


      } catch (err) {

        console.error(
          "DELETE PRODUCT ERROR:",
          err
        );


        showToast.error(
          err?.response?.data
            ?.message ||
          FRONTEND_MESSAGES
            ?.PRODUCT
            ?.DELETE_FAILED ||
          "Unable to delete product."
        );


      } finally {

        setActionLoading(
          null
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Product Status
  |--------------------------------------------------------------------------
  */

  const handleStatusToggle =
    async (
      product
    ) => {

      const productId =
        product._id ||
        product.id;

      const newStatus =
        !product.isActive;


      try {

        setStatusLoading(
          productId
        );


        const response =
          await ProductService
            .updateStatus(
              productId,
              newStatus
            );


        setProducts(
          (prev) =>
            prev.map(
              (item) => {

                const itemId =
                  item._id ||
                  item.id;


                if (
                  itemId !==
                  productId
                ) {

                  return item;

                }


                return {

                  ...item,

                  isActive:
                    response?.data
                      ?.isActive ??
                    newStatus,

                };

              }
            )
        );


        showToast.success(
          response?.message ||
          (
            newStatus
              ? "Product activated successfully."
              : "Product deactivated successfully."
          )
        );


      } catch (err) {

        console.error(
          "UPDATE STATUS ERROR:",
          err
        );


        showToast.error(
          err?.response?.data
            ?.message ||
          "Unable to update product status."
        );


      } finally {

        setStatusLoading(
          null
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Featured Status
  |--------------------------------------------------------------------------
  */

  const handleFeaturedToggle =
    async (
      product
    ) => {

      const productId =
        product._id ||
        product.id;

      const newStatus =
        !product.isFeatured;


      try {

        setFeaturedLoading(
          productId
        );


        const response =
          await ProductService
            .updateFeatured(
              productId,
              newStatus
            );


        setProducts(
          (prev) =>
            prev.map(
              (item) => {

                const itemId =
                  item._id ||
                  item.id;


                if (
                  itemId !==
                  productId
                ) {

                  return item;

                }


                return {

                  ...item,

                  isFeatured:
                    response?.data
                      ?.isFeatured ??
                    newStatus,

                };

              }
            )
        );


        showToast.success(
          response?.message ||
          (
            newStatus
              ? "Product marked as featured."
              : "Product removed from featured."
          )
        );


      } catch (err) {

        console.error(
          "FEATURED STATUS ERROR:",
          err
        );


        showToast.error(
          err?.response?.data
            ?.message ||
          "Unable to update featured status."
        );


      } finally {

        setFeaturedLoading(
          null
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Open Edit Page (Redirect)
  |--------------------------------------------------------------------------
  */

  const handleEditRedirect = (product) => {
    const productId = product._id || product.id;
    navigate(`/admin/edit-product/${productId}`);
  };


  /*
  |--------------------------------------------------------------------------
  | Pagination Page Numbers
  |--------------------------------------------------------------------------
  */

  const getVisiblePages =
    () => {

      const pages = [];


      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {

        if (
          page === 1 ||
          page === totalPages ||
          Math.abs(
            page -
            currentPage
          ) <= 1
        ) {

          pages.push(
            page
          );

        }

      }


      return pages;

    };


  const visiblePages =
    getVisiblePages();


  /*
  |--------------------------------------------------------------------------
  | Showing Range
  |--------------------------------------------------------------------------
  */

  const startItem =
    totalProducts === 0
      ? 0
      : (
        currentPage - 1
      ) * limit + 1;


  const endItem =
    Math.min(
      currentPage * limit,
      totalProducts
    );


  return (

    <div
      className="
        max-w-7xl
        mx-auto
        w-full
        space-y-8
        animate-in
        fade-in
        slide-in-from-bottom-4
        duration-500
      "
    >

      {/* Header */}

      <div
        className="
    flex
    flex-col
    gap-6
  "
      >
        {/* Title Section */}
        <div>
          <h2
            className="
        text-3xl
        md:text-4xl
        font-bold
        text-slate-800
        tracking-tight
        font-heading
        leading-tight
      "
          >
            Products Catalog Management
          </h2>

          <p
            className="
        text-sm
        text-slate-500
        mt-2
        font-medium
      "
          >
            Total Inventory:{" "}
            <span
              className="
          text-slate-900
          font-bold
        "
            >
              {totalProducts}
            </span>{" "}
            items
          </p>
        </div>

        {/* Action Buttons */}
        <div
          className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:flex
      lg:flex-wrap
      items-center
      gap-3
    "
        >
          {/* Template */}
          <button
            type="button"
            onClick={handleDownloadTemplate}
            disabled={isImporting}
            className="
        h-12
        inline-flex
        items-center
        justify-center
        gap-2
        px-5
        bg-white
        border
        border-slate-200
        rounded-xl
        text-sm
        font-semibold
        text-slate-700
        shadow-sm
        hover:bg-slate-50
        hover:border-slate-300
        transition-all
        disabled:opacity-50
        whitespace-nowrap
      "
          >
            <Download size={18} />
            Template
          </button>

          {/* Export Products */}
          <button
            type="button"
            onClick={handleExportProducts}
            disabled={
              isExporting ||
              isImporting
            }
            className="
        h-12
        inline-flex
        items-center
        justify-center
        gap-2
        px-5
        bg-white
        border
        border-slate-200
        rounded-xl
        text-sm
        font-semibold
        text-slate-700
        shadow-sm
        hover:bg-slate-50
        hover:border-slate-300
        transition-all
        disabled:opacity-50
        whitespace-nowrap
      "
          >
            {isExporting ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Download size={18} />
            )}

            {isExporting
              ? "Exporting..."
              : "Export Products"}
          </button>

          {/* Hidden Excel Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportExcel}
            className="hidden"
          />

          {/* Import Excel */}
          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={isImporting}
            className="
        h-12
        inline-flex
        items-center
        justify-center
        gap-2
        px-5
        bg-amber-500
        text-slate-950
        rounded-xl
        text-sm
        font-bold
        shadow-sm
        hover:bg-amber-400
        hover:shadow-md
        transition-all
        disabled:opacity-50
        whitespace-nowrap
      "
          >
            {isImporting ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Upload size={18} />
            )}

            {isImporting
              ? `Importing ${importProgress.current}/${importProgress.total}`
              : "Import Excel"}
          </button>

          {/* Add Product */}
          <button
            type="button"
            onClick={() =>
              navigate("/admin/add-product")
            }
            className="
        h-12
        inline-flex
        items-center
        justify-center
        gap-2
        px-5
        bg-slate-950
        text-white
        rounded-xl
        text-sm
        font-semibold
        shadow-sm
        hover:bg-slate-900
        hover:shadow-md
        transition-all
        active:scale-[0.98]
        whitespace-nowrap
      "
          >
            <PlusCircle
              size={18}
              className="text-amber-500"
            />

            Add New Product
          </button>
        </div>
        {/* Filters */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

            {/* Search */}

            <input
              type="text"
              placeholder="Search Product..."

              value={search}

              onChange={(e) => {

                setCurrentPage(1);

                setSearch(e.target.value);

              }}

              className="
        h-11
        px-4
        rounded-xl
        border
        border-slate-200
        outline-none
        focus:border-slate-900
      "
            />

            {/* Category */}

            <select

              value={categoryFilter}

              onChange={(e) => {

                setCurrentPage(1);

                setCategoryFilter(e.target.value);

              }}

              className="
        h-11
        px-4
        rounded-xl
        border
        border-slate-200
        outline-none
        focus:border-slate-900
      "

            >

              <option value="">
                All Categories
              </option>

              {categories.map((category) => (

                <option

                  key={category._id}

                  value={category._id}

                >

                  {category.name}

                </option>

              ))}

            </select>

            {/* Min Price */}

            <input

              type="number"

              placeholder="Min Price"

              value={minPrice}

              onChange={(e) => {

                setCurrentPage(1);

                setMinPrice(e.target.value);

              }}

              className="
        h-11
        px-4
        rounded-xl
        border
        border-slate-200
        outline-none
        focus:border-slate-900
      "
            />

            {/* Max Price */}

            <input

              type="number"

              placeholder="Max Price"

              value={maxPrice}

              onChange={(e) => {

                setCurrentPage(1);

                setMaxPrice(e.target.value);

              }}

              className="
        h-11
        px-4
        rounded-xl
        border
        border-slate-200
        outline-none
        focus:border-slate-900
      "
            />

            {/* Reset */}

            <button

              type="button"

              onClick={() => {

                setSearch("");

                setCategoryFilter("");

                setMinPrice("");

                setMaxPrice("");

                setCurrentPage(1);

              }}

              className="
        h-11
        rounded-xl
        bg-slate-900
        text-white
        font-semibold
        hover:bg-slate-800
      "

            >

              Reset Filters

            </button>

          </div>

        </div>
      </div>


      {/* Excel Import Progress */}

      {isImporting && (

        <div
          className="
      bg-white
      border
      border-slate-200
      rounded-2xl
      p-5
      shadow-sm
    "
        >

          <div
            className="
        flex
        flex-wrap
        justify-between
        gap-3
        mb-3
      "
          >

            <div>

              <p
                className="
            font-bold
            text-slate-800
          "
              >
                Importing Products
              </p>

              <p
                className="
            text-xs
            text-slate-500
            mt-1
          "
              >
                Please do not close this page
                while products are being created.
              </p>

            </div>


            <div
              className="
          flex
          items-center
          gap-4
          text-xs
          font-semibold
        "
            >

              <span
                className="
            text-emerald-600
          "
              >
                Success:{" "}
                {importProgress.success}
              </span>

              <span
                className="
            text-red-500
          "
              >
                Failed:{" "}
                {importProgress.failed}
              </span>

            </div>

          </div>


          <div
            className="
        w-full
        h-2.5
        bg-slate-100
        rounded-full
        overflow-hidden
      "
          >

            <div
              className="
          h-full
          bg-slate-950
          rounded-full
          transition-all
          duration-300
        "
              style={{

                width:
                  importProgress.total
                    ? `${(
                      importProgress.current /
                      importProgress.total
                    ) * 100
                    }%`
                    : "0%",

              }}
            />

          </div>


          <p
            className="
        text-xs
        text-slate-500
        mt-2
        text-right
      "
          >

            {importProgress.current}
            {" / "}
            {importProgress.total}
            {" products processed"}

          </p>

        </div>

      )}


      {/* Table Card */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow-sm
          border
          border-slate-200
          overflow-hidden
        "
      >

        <div
          className="
            overflow-x-auto
          "
        >

          <table
            className="
              w-full
              min-w-3xl
              text-left
              border-collapse
              whitespace-nowrap
            "
          >

            <thead
              className="
                bg-slate-50/80
                text-slate-500
                uppercase
                text-[11px]
                tracking-wider
                font-bold
                border-b
                border-slate-200
              "
            >

              <tr>

                <th className="p-4 pl-6">
                  Preview
                </th>

                <th className="p-4">
                  Product
                </th>

                <th className="p-4">
                  SKU
                </th>

                <th className="p-4">
                  Price
                </th>

                <th className="p-4">
                  Stock
                </th>

                <th className="p-4 text-center">
                  Featured
                </th>

                <th className="p-4 text-center">
                  Status
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody
              className="
                divide-y
                divide-slate-100
                text-slate-700
                text-sm
              "
            >

              {isLoading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="
                      p-16
                      text-center
                      text-slate-400
                    "
                  >

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                        gap-3
                      "
                    >

                      <Loader2
                        size={28}
                        className="
                          animate-spin
                          text-amber-500
                        "
                      />

                      <span
                        className="
                          font-medium
                          text-sm
                        "
                      >
                        Loading products...
                      </span>

                    </div>

                  </td>

                </tr>

              ) : products.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="
                      p-12
                      text-center
                    "
                  >

                    <div
                      className="
                        inline-flex
                        flex-col
                        items-center
                        justify-center
                        p-6
                        bg-slate-50
                        rounded-2xl
                        border
                        border-slate-100
                        border-dashed
                      "
                    >

                      <PlusCircle
                        size={28}
                        className="
                          text-slate-400
                          mb-3
                        "
                      />

                      <span
                        className="
                          text-slate-500
                          font-semibold
                        "
                      >
                        No products found
                      </span>

                    </div>

                  </td>

                </tr>

              ) : (

                products.map(
                  (
                    product
                  ) => {

                    const currentId =
                      product._id ||
                      product.id;


                    return (

                      <tr
                        key={
                          currentId
                        }

                        className="
                          hover:bg-slate-50/60
                          transition-colors
                          group
                        "
                      >

                        {/* Image */}

                        <td
                          className="
                            p-4
                            pl-6
                          "
                        >

                          <div
                            className="
                              w-12
                              h-12
                              rounded-xl
                              border
                              border-slate-200
                              overflow-hidden
                              bg-slate-50
                            "
                          >

                            {product.images?.[0]?.url ? (
                              <img
                                src={product.images[0].url}
                                alt={product.title}
                                className="
      w-full
      h-full
      object-cover
      transition-transform
      group-hover:scale-110
    "
                                onError={(e) => {
                                  e.target.src = "/no-image.png";
                                }}
                              />
                            ) : (

                              <div
                                className="
                                  w-full
                                  h-full
                                  flex
                                  items-center
                                  justify-center
                                  text-[9px]
                                  text-slate-400
                                "
                              >
                                No Image
                              </div>

                            )}

                          </div>

                        </td>


                        {/* Product */}

                        <td className="p-4">

                          <div
                            className="
                              max-w-[240px]
                            "
                          >

                            <p
                              className="
                                font-semibold
                                text-slate-800
                                truncate
                              "
                            >
                              {product.title}
                            </p>


                            <p
                              className="
                                text-xs
                                text-slate-400
                                mt-1
                              "
                            >
                              {product
                                .category
                                ?.name ||
                                "No category"}
                            </p>

                          </div>

                        </td>


                        {/* SKU */}

                        <td
                          className="
                            p-4
                            text-xs
                            font-mono
                            text-slate-500
                          "
                        >

                          <span
                            className="
                              bg-slate-100
                              px-2
                              py-1
                              rounded-md
                              border
                              border-slate-200
                            "
                          >
                            {product.sku ||
                              "N/A"}
                          </span>

                        </td>


                        {/* Price */}

                        <td
                          className="
                            p-4
                            font-bold
                            text-emerald-600
                          "
                        >

                          ₹{Number(
                            product.price ||
                            0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </td>


                        {/* Stock */}

                        <td className="p-4">

                          <span
                            className={`
                              px-2.5
                              py-1
                              rounded-full
                              text-xs
                              font-semibold

                              ${product.stock >
                                0

                                ? `
                                    bg-blue-50
                                    text-blue-700
                                  `

                                : `
                                    bg-red-50
                                    text-red-600
                                  `
                              }
                            `}
                          >

                            {product.stock >
                              0
                              ? `${product.stock} in stock`
                              : "Out of stock"}

                          </span>

                        </td>


                        {/* Featured */}

                        <td
                          className="
                            p-4
                            text-center
                          "
                        >

                          <button
                            type="button"

                            disabled={
                              featuredLoading ===
                              currentId
                            }

                            onClick={() =>
                              handleFeaturedToggle(
                                product
                              )
                            }

                            title={
                              product.isFeatured
                                ? "Remove Featured"
                                : "Mark Featured"
                            }

                            className={`
                              inline-flex
                              items-center
                              justify-center
                              w-10
                              h-10
                              rounded-xl
                              border
                              transition-all
                              disabled:opacity-50

                              ${product.isFeatured

                                ? `
                                    bg-amber-50
                                    border-amber-200
                                    text-amber-500
                                  `

                                : `
                                    bg-white
                                    border-slate-200
                                    text-slate-400
                                    hover:bg-amber-50
                                    hover:text-amber-500
                                  `
                              }
                            `}
                          >

                            {featuredLoading ===
                              currentId ? (

                              <Loader2
                                size={17}
                                className="
                                  animate-spin
                                "
                              />

                            ) : (

                              <Star
                                size={18}

                                fill={
                                  product
                                    .isFeatured
                                    ? "currentColor"
                                    : "none"
                                }
                              />

                            )}

                          </button>

                        </td>


                        {/* Status */}

                        <td
                          className="
                            p-4
                            text-center
                          "
                        >

                          <span
                            className={`
                              inline-flex
                              items-center
                              justify-center
                              min-w-[76px]
                              px-3
                              py-1.5
                              rounded-full
                              text-xs
                              font-bold

                              ${product.isActive

                                ? `
                                    bg-emerald-100
                                    text-emerald-700
                                  `

                                : `
                                    bg-red-100
                                    text-red-600
                                  `
                              }
                            `}
                          >

                            {product.isActive
                              ? "Active"
                              : "Inactive"}

                          </span>

                        </td>


                        {/* Actions */}

                        <td className="p-4">

                          <div
                            className="
                              flex
                              justify-center
                              gap-2
                            "
                          >

                            <button
                              type="button"

                              onClick={() =>
                                handleEditRedirect(
                                  product
                                )
                              }

                              className="
                                w-10
                                h-10
                                flex
                                items-center
                                justify-center
                                border
                                border-slate-200
                                text-slate-500
                                hover:text-slate-900
                                hover:bg-slate-100
                                rounded-xl
                                transition
                              "

                              title="Edit Product"
                            >

                              <Edit
                                size={18}
                              />

                            </button>


                            <button
                              type="button"

                              onClick={() =>
                                handleStatusToggle(
                                  product
                                )
                              }

                              disabled={
                                statusLoading ===
                                currentId
                              }

                              className={`
                                w-10
                                h-10
                                flex
                                items-center
                                justify-center
                                border
                                rounded-xl
                                transition
                                disabled:opacity-50

                                ${product.isActive

                                  ? `
                                      border-slate-200
                                      text-slate-500
                                      hover:bg-red-50
                                      hover:text-red-600
                                      hover:border-red-200
                                    `

                                  : `
                                      border-emerald-200
                                      text-emerald-600
                                      hover:bg-emerald-50
                                    `
                                }
                              `}

                              title={
                                product.isActive
                                  ? "Deactivate Product"
                                  : "Activate Product"
                              }
                            >

                              {statusLoading ===
                                currentId ? (

                                <Loader2
                                  size={18}
                                  className="
                                    animate-spin
                                  "
                                />

                              ) : (

                                <Power
                                  size={18}
                                />

                              )}

                            </button>


                            <button
                              type="button"

                              onClick={() =>
                                handleDelete(
                                  currentId
                                )
                              }

                              disabled={
                                actionLoading ===
                                currentId
                              }

                              className="
                                w-10
                                h-10
                                flex
                                items-center
                                justify-center
                                border
                                border-red-200
                                text-red-500
                                hover:text-red-600
                                hover:bg-red-50
                                rounded-xl
                                transition
                                disabled:opacity-40
                              "

                              title="Delete Product"
                            >

                              {actionLoading ===
                                currentId ? (

                                <Loader2
                                  className="
                                    animate-spin
                                  "
                                  size={18}
                                />

                              ) : (

                                <Trash2
                                  size={18}
                                />

                              )}

                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  }
                )

              )}

            </tbody>

          </table>

        </div>


        {/* Pagination */}

        {!isLoading &&
          totalProducts > 0 && (

            <div
              className="
                flex
                flex-col
                lg:flex-row
                lg:items-center
                justify-between
                gap-4
                px-6
                py-4
                border-t
                border-slate-200
                bg-slate-50/40
              "
            >

              {/* Results + Limit */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-4
                "
              >

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >

                  Showing{" "}

                  <span
                    className="
                      font-bold
                      text-slate-800
                    "
                  >
                    {startItem}
                  </span>

                  {" "}to{" "}

                  <span
                    className="
                      font-bold
                      text-slate-800
                    "
                  >
                    {endItem}
                  </span>

                  {" "}of{" "}

                  <span
                    className="
                      font-bold
                      text-slate-800
                    "
                  >
                    {totalProducts}
                  </span>

                  {" "}products

                </p>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <span
                    className="
                      text-xs
                      font-semibold
                      text-slate-500
                    "
                  >
                    Show
                  </span>


                  <select
                    value={
                      limit
                    }

                    onChange={(
                      e
                    ) => {

                      setCurrentPage(
                        1
                      );

                      setLimit(
                        Number(
                          e.target.value
                        )
                      );

                    }}

                    className="
                      px-3
                      py-2
                      bg-white
                      border
                      border-slate-200
                      rounded-lg
                      text-sm
                      font-semibold
                      text-slate-700
                      outline-none
                      cursor-pointer
                      focus:border-slate-400
                    "
                  >

                    <option value={5}>
                      5
                    </option>

                    <option value={10}>
                      10
                    </option>

                    <option value={20}>
                      20
                    </option>

                    <option value={50}>
                      50
                    </option>

                    <option value={100}>
                      100
                    </option>

                  </select>

                </div>

              </div>


              {/* Page Buttons */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >

                <button
                  type="button"

                  disabled={
                    currentPage <= 1 ||
                    isLoading
                  }

                  onClick={() =>
                    setCurrentPage(
                      (prev) =>
                        Math.max(
                          prev - 1,
                          1
                        )
                    )
                  }

                  className="
                    inline-flex
                    items-center
                    gap-1
                    px-3
                    h-10
                    border
                    border-slate-200
                    rounded-lg
                    bg-white
                    text-sm
                    font-semibold
                    text-slate-600
                    hover:bg-slate-100
                    transition
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                >

                  <ChevronLeft
                    size={17}
                  />

                  Previous

                </button>


                {visiblePages.map(
                  (
                    page,
                    index
                  ) => {

                    const previousPage =
                      visiblePages[
                      index - 1
                      ];


                    return (

                      <div
                        key={page}
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        {previousPage &&
                          page -
                          previousPage >
                          1 && (

                            <span
                              className="
                                px-1
                                text-slate-400
                                font-semibold
                              "
                            >
                              ...
                            </span>

                          )}


                        <button
                          type="button"

                          onClick={() =>
                            setCurrentPage(
                              page
                            )
                          }

                          disabled={
                            isLoading
                          }

                          className={`
                            min-w-10
                            h-10
                            px-3
                            rounded-lg
                            text-sm
                            font-bold
                            border
                            transition

                            ${currentPage ===
                              page

                              ? `
                                  bg-slate-950
                                  text-white
                                  border-slate-950
                                  shadow-sm
                                `

                              : `
                                  bg-white
                                  text-slate-600
                                  border-slate-200
                                  hover:bg-slate-100
                                `
                            }
                          `}
                        >

                          {page}

                        </button>

                      </div>

                    );

                  }
                )}


                <button
                  type="button"

                  disabled={
                    currentPage >=
                    totalPages ||
                    isLoading
                  }

                  onClick={() =>
                    setCurrentPage(
                      (prev) =>
                        Math.min(
                          prev + 1,
                          totalPages
                        )
                    )
                  }

                  className="
                    inline-flex
                    items-center
                    gap-1
                    px-3
                    h-10
                    border
                    border-slate-200
                    rounded-lg
                    bg-white
                    text-sm
                    font-semibold
                    text-slate-600
                    hover:bg-slate-100
                    transition
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                >

                  Next

                  <ChevronRight
                    size={17}
                  />

                </button>

              </div>

            </div>

          )}

      </div>

    </div>

  );

}