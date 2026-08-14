import { useEffect, useState, useRef } from "react";
import {
  PlusCircle,
  Trash2,
  Edit,
  Loader2,
  Star,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Layers,
  CheckSquare,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

import { ProductService } from "../../../services/productService";
import { CategoryService } from "../../../services/categoryService";
import { ProductTagService } from "../../../services/productTagService";
import { showToast } from "../../../config/toast";
import { FRONTEND_MESSAGES } from "../../../constants/messages";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productTagsList, setProductTagsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [featuredLoading, setFeaturedLoading] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Bulk Action States
  |--------------------------------------------------------------------------
  */
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Pagination & Filters
  |--------------------------------------------------------------------------
  */
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = sessionStorage.getItem("productsCurrentPage");
    return savedPage ? Number(savedPage) : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit, setLimit] = useState(10);

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
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
    success: 0,
    failed: 0,
  });

  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Checkbox Selection Handlers
  |--------------------------------------------------------------------------
  */
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const visibleIds = products.map((item) => item._id || item.id);
      setSelectedProductIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    } else {
      const visibleIds = products.map((item) => item._id || item.id);
      setSelectedProductIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    }
  };

  const handleSelectOne = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const isAllSelectedOnPage =
    products.length > 0 &&
    products.every((p) => selectedProductIds.includes(p._id || p.id));

  /*
  |--------------------------------------------------------------------------
  | Fetch Products
  |--------------------------------------------------------------------------
  */
  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const firstResponse = await ProductService.getAll({
        page: 1,
        limit: 100,
        search,
        category: categoryFilter,
        minPrice,
        maxPrice,
      });

      const firstProducts =
        firstResponse?.data?.products ||
        firstResponse?.products ||
        (Array.isArray(firstResponse?.data)
          ? firstResponse.data
          : Array.isArray(firstResponse)
          ? firstResponse
          : []);

      const firstPagination =
        firstResponse?.data?.pagination ||
        firstResponse?.pagination ||
        {};

      const serverTotalPages = Math.max(
        Number(firstPagination?.totalPages || 1),
        1
      );

      let fetchedProducts = [...firstProducts];

      for (let page = 2; page <= serverTotalPages; page++) {
        const response = await ProductService.getAll({
          page,
          limit: 100,
          search,
          category: categoryFilter,
          minPrice,
          maxPrice,
        });

        const pageProducts =
          response?.data?.products ||
          response?.products ||
          (Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : []);

        fetchedProducts = [...fetchedProducts, ...pageProducts];
      }

      // GLOBAL FEATURED FIRST SORT
      const sortedProducts = [...fetchedProducts].sort(
        (a, b) =>
          Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured))
      );

      setAllProducts(sortedProducts);
      setTotalProducts(sortedProducts.length);

      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;

      const currentPageProducts = sortedProducts.slice(startIndex, endIndex);

      setProducts(currentPageProducts);

      const calculatedTotalPages = Math.max(
        Math.ceil(sortedProducts.length / limit),
        1
      );

      setTotalPages(calculatedTotalPages);
    } catch (err) {
      console.error("FETCH PRODUCTS ERROR:", err);
      showToast.error(
        FRONTEND_MESSAGES?.PRODUCT?.FETCH_FAILED || "Unable to fetch products."
      );
      setProducts([]);
      setAllProducts([]);
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
        res?.data?.categories || res?.categories || res?.data || [];
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

  /*
  |--------------------------------------------------------------------------
  | Bulk Delete Operation
  |--------------------------------------------------------------------------
  */
  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedProductIds.length} selected product(s)?`
    );

    if (!confirmed) return;

    try {
      setIsBulkDeleting(true);

      if (typeof ProductService.bulkDelete === "function") {
        await ProductService.bulkDelete(selectedProductIds);
      } else {
        await Promise.all(
          selectedProductIds.map((id) => ProductService.delete(id))
        );
      }

      showToast.success(
        `${selectedProductIds.length} products deleted successfully.`
      );
      setSelectedProductIds([]);

      const remainingItems = products.length - selectedProductIds.length;
      const targetPage = remainingItems <= 0 && currentPage > 1 ? currentPage - 1 : currentPage;
      
      sessionStorage.setItem("productsCurrentPage", String(targetPage));
      setCurrentPage(targetPage);
      await fetchProducts();
    } catch (err) {
      console.error("BULK DELETE ERROR:", err);
      showToast.error(
        err?.response?.data?.message || "Unable to delete selected products."
      );
    } finally {
      setIsBulkDeleting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Excel Template & Export/Import Logic
  |--------------------------------------------------------------------------
  */
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        ID: 2001,
        Title: "Handcrafted Terracotta Vase",
        MainSKU: "EE-VASE-2001",
        VariantSKU: "EE-VASE-RED",
        Category: "Pottery & Clay",
        ProductTags: "Best Seller, Eco Friendly",
        ColorName: "Terracotta Red",
        ColorCode: "#C85A32",
        Price: 1500,
        OriginalPrice: 1800,
        Stock: 50,
        Composition: "100% natural red clay",
        Description: "Premium handcrafted terracotta vase for home decor.",
        LongDescription: "Handcrafted from 100% natural clay. Elegant finish and organic design.",
        Images: "https://picsum.photos/seed/vase1/800/800, https://picsum.photos/seed/vase2/800/800",
      },
      {
        ID: 2001,
        Title: "Handcrafted Terracotta Vase",
        MainSKU: "EE-VASE-2001",
        VariantSKU: "EE-VASE-BLK",
        Category: "Pottery & Clay",
        ProductTags: "Best Seller, Eco Friendly",
        ColorName: "Black Clay",
        ColorCode: "#1F1F1F",
        Price: 1600,
        OriginalPrice: 1900,
        Stock: 30,
        Composition: "100% natural black clay",
        Description: "Premium handcrafted terracotta vase for home decor.",
        LongDescription: "Handcrafted from 100% natural clay. Elegant finish and organic design.",
        Images: "https://picsum.photos/seed/vase3/800/800",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    worksheet["!cols"] = [
      { wch: 10 }, // ID
      { wch: 30 }, // Title
      { wch: 18 }, // MainSKU
      { wch: 18 }, // VariantSKU
      { wch: 20 }, // Category
      { wch: 25 }, // ProductTags
      { wch: 18 }, // ColorName
      { wch: 12 }, // ColorCode
      { wch: 12 }, // Price
      { wch: 14 }, // OriginalPrice
      { wch: 10 }, // Stock
      { wch: 25 }, // Composition
      { wch: 35 }, // Description
      { wch: 50 }, // LongDescription
      { wch: 70 }, // Images
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "product-variants-import-template.xlsx");

    showToast.success("Product Excel template downloaded.");
  };

  const getAllProductsForExport = async () => {
    const firstResponse = await ProductService.getAll({
      page: 1,
      limit: 100,
    });

    const firstProducts =
      firstResponse?.data?.products ||
      firstResponse?.products ||
      (Array.isArray(firstResponse?.data) ? firstResponse.data : []);

    const pagination =
      firstResponse?.data?.pagination || firstResponse?.pagination || {};

    const totalPagesToFetch = Number(pagination?.totalPages || 1) || 1;

    let allProductsList = [...firstProducts];

    for (let page = 2; page <= totalPagesToFetch; page++) {
      const response = await ProductService.getAll({
        page,
        limit: 100,
      });

      const pageProducts =
        response?.data?.products ||
        response?.products ||
        (Array.isArray(response?.data) ? response.data : []);

      allProductsList = [...allProductsList, ...pageProducts];
    }

    return allProductsList;
  };

  const handleExportProducts = async () => {
    try {
      setIsExporting(true);

      const allProductsList = await getAllProductsForExport();

      if (!Array.isArray(allProductsList) || allProductsList.length === 0) {
        showToast.error("No products available to export.");
        return;
      }

      const excelRows = [];

      allProductsList.forEach((product) => {
        if (product.hasVariants && product.variants?.length > 0) {
          product.variants.forEach((variant) => {
            excelRows.push({
              ID: product.id,
              Title: product.title || "",
              MainSKU: product.sku || "",
              VariantSKU: variant.sku || "",
              Category: product.category?.name || "",
              ProductTags: (product.productTags || [])
                .map((tag) => tag.name || tag)
                .join(", "),
              ColorName: variant.colorName || "",
              ColorCode: variant.colorCode || "",
              Price: Number(variant.price || product.price || 0),
              OriginalPrice: Number(variant.originalPrice || product.originalPrice || 0),
              Stock: Number(variant.stock || 0),
              Composition: variant.specifications?.composition || "100% natural red clay",
              Description: product.description || "",
              Images: (variant.images || []).map((img) => img.url).join(", "),
            });
          });
        } else {
          excelRows.push({
            ID: product.id,
            Title: product.title || "",
            MainSKU: product.sku || "",
            VariantSKU: product.sku || "",
            Category: product.category?.name || "",
            ProductTags: (product.productTags || [])
              .map((tag) => tag.name || tag)
              .join(", "),
            ColorName: "Standard",
            ColorCode: "#C85A32",
            Price: Number(product.price || 0),
            OriginalPrice: Number(product.originalPrice || 0),
            Stock: Number(product.stock || 0),
            Composition: product.specifications?.composition || "100% natural red clay",
            Description: product.description || "",
            Images: (product.images || []).map((img) => img.url).join(", "),
          });
        }
      });

      const worksheet = XLSX.utils.json_to_sheet(excelRows);

      worksheet["!cols"] = [
        { wch: 10 },
        { wch: 30 },
        { wch: 18 },
        { wch: 18 },
        { wch: 20 },
        { wch: 25 },
        { wch: 18 },
        { wch: 12 },
        { wch: 12 },
        { wch: 14 },
        { wch: 10 },
        { wch: 25 },
        { wch: 35 },
        { wch: 70 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

      const date = new Date().toISOString().split("T")[0];
      XLSX.writeFile(workbook, `products-${date}.xlsx`);

      showToast.success(`${allProductsList.length} products exported successfully.`);
    } catch (error) {
      console.error("EXPORT PRODUCTS ERROR:", error);
      showToast.error(
        error?.response?.data?.message ||
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

    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      showToast.error("Please select a valid .xlsx or .xls file.");
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

      const response = await ProductService.importExcel(formData, (progress) => {
        setImportProgress({
          current: progress,
          total: 100,
          success: 0,
          failed: 0,
        });
      });

      setImportProgress({
        current: 100,
        total: 100,
        success: response?.successCount || response?.data?.successCount || 0,
        failed: response?.failedCount || response?.data?.failedCount || 0,
      });

      showToast.success(
        response?.message || "Products imported successfully."
      );

      await fetchProducts();
      setCurrentPage(1);
    } catch (error) {
      console.error("IMPORT EXCEL ERROR:", error);
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
  | Auto Fetch Triggers
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    sessionStorage.setItem("productsCurrentPage", String(currentPage));
    fetchProducts();
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
  | Single Delete Product
  |--------------------------------------------------------------------------
  */
  const handleDelete = async (targetId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(targetId);

      await ProductService.delete(targetId);

      showToast.success(
        FRONTEND_MESSAGES?.PRODUCT?.DELETE_SUCCESS ||
          "Product deleted successfully."
      );

      setSelectedProductIds((prev) => prev.filter((id) => id !== targetId));

      const isLastItemOnPage = products.length === 1 && currentPage > 1;
      const targetPage = isLastItemOnPage ? currentPage - 1 : currentPage;

      sessionStorage.setItem("productsCurrentPage", String(targetPage));

      if (isLastItemOnPage) {
        setCurrentPage(targetPage);
      } else {
        await fetchProducts();
      }
    } catch (err) {
      console.error("DELETE PRODUCT ERROR:", err);
      showToast.error(
        err?.response?.data?.message ||
          FRONTEND_MESSAGES?.PRODUCT?.DELETE_FAILED ||
          "Unable to delete product."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Featured Toggle
  |--------------------------------------------------------------------------
  */
  const handleFeaturedToggle = async (product) => {
    const productId = product._id || product.id;
    const newStatus = !product.isFeatured;

    try {
      setFeaturedLoading(productId);

      const response = await ProductService.updateFeatured(productId, newStatus);

      setProducts((prev) => {
        const updatedList = prev.map((item) => {
          const itemId = item._id || item.id;
          if (itemId !== productId) return item;

          return {
            ...item,
            isFeatured: response?.data?.isFeatured ?? newStatus,
          };
        });

        return [...updatedList].sort(
          (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        );
      });

      showToast.success(
        response?.message ||
          (newStatus
            ? "Product marked as featured."
            : "Product removed from featured.")
      );
    } catch (err) {
      console.error("FEATURED STATUS ERROR:", err);
      showToast.error(
        err?.response?.data?.message || "Unable to update featured status."
      );
    } finally {
      setFeaturedLoading(null);
    }
  };

  const handleEditRedirect = (product) => {
    const productId = product._id || product.id;
    sessionStorage.setItem("productsCurrentPage", String(currentPage));
    navigate(`/admin/edit-product/${productId}`);
  };

  const getVisiblePages = () => {
    const pages = [];
    for (let page = 1; page <= totalPages; page++) {
      if (
        page === 1 ||
        page === totalPages ||
        Math.abs(page - currentPage) <= 1
      ) {
        pages.push(page);
      }
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  const startItem = totalProducts === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalProducts);

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight font-heading leading-tight">
              Products Catalog Management
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Total Inventory:{" "}
              <span className="text-slate-900 font-bold">{totalProducts}</span> items
            </p>
          </div>

          {/* Bulk Delete Button */}
          {selectedProductIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="h-12 inline-flex items-center justify-center gap-2 px-5 bg-red-600 text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-red-700 transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {isBulkDeleting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
              Delete Selected ({selectedProductIds.length})
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            disabled={isImporting}
            className="h-12 inline-flex items-center justify-center gap-2 px-5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            <Download size={18} />
            Template
          </button>

          <button
            type="button"
            onClick={handleExportProducts}
            disabled={isExporting || isImporting}
            className="h-12 inline-flex items-center justify-center gap-2 px-5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {isExporting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {isExporting ? "Exporting..." : "Export Products"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportExcel}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="h-12 inline-flex items-center justify-center gap-2 px-5 bg-amber-500 text-slate-950 rounded-xl text-sm font-bold shadow-sm hover:bg-amber-400 hover:shadow-md transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {isImporting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            {isImporting
              ? `Importing ${importProgress.current}/${importProgress.total}`
              : "Import Excel"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/add-product")}
            className="h-12 inline-flex items-center justify-center gap-2 px-5 bg-slate-950 text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-900 hover:shadow-md transition-all active:scale-[0.98] whitespace-nowrap"
          >
            <PlusCircle size={18} className="text-amber-500" />
            Add New Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Search Product / Color..."
              value={search}
              onChange={(e) => {
                setCurrentPage(1);
                setSearch(e.target.value);
              }}
              className="h-11 w-full px-4 rounded-xl border border-slate-200 bg-white text-black placeholder:text-slate-400 outline-none focus:border-slate-900"
            />

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCurrentPage(1);
                setCategoryFilter(e.target.value);
              }}
              className="h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-slate-900"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => {
                setCurrentPage(1);
                setMinPrice(e.target.value);
              }}
              className="h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-slate-900"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => {
                setCurrentPage(1);
                setMaxPrice(e.target.value);
              }}
              className="h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-slate-900"
            />

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategoryFilter("");
                setMinPrice("");
                setMaxPrice("");
                sessionStorage.setItem("productsCurrentPage", "1");
                setCurrentPage(1);
              }}
              className="h-11 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Excel Import Progress */}
      {isImporting && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-wrap justify-between gap-3 mb-3">
            <div>
              <p className="font-bold text-slate-800">Importing Products</p>
              <p className="text-xs text-slate-500 mt-1">
                Please do not close this page while products are being created.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="text-emerald-600">
                Success: {importProgress.success}
              </span>
              <span className="text-red-500">
                Failed: {importProgress.failed}
              </span>
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-950 rounded-full transition-all duration-300"
              style={{
                width: importProgress.total
                  ? `${(importProgress.current / importProgress.total) * 100}%`
                  : "0%",
              }}
            />
          </div>

          <p className="text-xs text-slate-500 mt-2 text-right">
            {importProgress.current} / {importProgress.total} products processed
          </p>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full min-w-3xl text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelectedOnPage}
                    onChange={handleSelectAll}
                    disabled={isLoading || products.length === 0}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </th>
                <th className="p-4">Preview</th>
                <th className="p-4">Product</th>
                <th className="p-4">Variants / Colors</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="p-16 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2
                        size={28}
                        className="animate-spin text-amber-500"
                      />
                      <span className="font-medium text-sm">
                        Loading products...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-12 text-center">
                    <div className="inline-flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                      <PlusCircle
                        size={28}
                        className="text-slate-400 mb-3"
                      />
                      <span className="text-slate-500 font-semibold">
                        No products found
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const currentId = product._id || product.id;
                  const isSelected = selectedProductIds.includes(currentId);

                  const previewImageUrl = product.hasVariants && product.variants?.[0]?.images?.[0]?.url
                    ? product.variants[0].images[0].url
                    : product.images?.[0]?.url;

                  const totalStock = product.hasVariants && product.variants?.length > 0
                    ? product.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
                    : product.stock || 0;

                  return (
                    <tr
                      key={currentId}
                      className={`hover:bg-slate-50/60 transition-colors group ${
                        isSelected ? "bg-amber-50/40" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 pl-6">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(currentId)}
                          className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                      </td>

                      {/* Image Preview */}
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 relative">
                          {previewImageUrl ? (
                            <img
                              src={previewImageUrl}
                              alt={product.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                              onError={(e) => {
                                e.target.src = "/no-image.png";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">
                              No Image
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Product Title & Category */}
                      <td className="p-4">
                        <div className="max-w-[220px]">
                          <p className="font-semibold text-slate-800 truncate">
                            {product.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {product.category?.name || "No category"}
                          </p>
                        </div>
                      </td>

                      {/* Color Variants */}
                      <td className="p-4">
                        {product.hasVariants && product.variants?.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              {product.variants.slice(0, 4).map((v, i) => (
                                <span
                                  key={v._id || i}
                                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs"
                                  style={{ backgroundColor: v.colorCode || "#C85A32" }}
                                  title={v.colorName}
                                />
                              ))}
                              {product.variants.length > 4 && (
                                <span className="text-[10px] font-bold text-slate-500">
                                  +{product.variants.length - 4}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                              <Layers size={11} /> {product.variants.length} Colors
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Single Color</span>
                        )}
                      </td>

                      {/* SKU */}
                      <td className="p-4 text-xs font-mono text-slate-500">
                        <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                          {product.sku || "N/A"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-4 font-bold text-emerald-600">
                        ₹
                        {Number(product.price || 0).toLocaleString("en-IN")}
                      </td>

                      {/* Stock */}
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            totalStock > 0
                              ? "bg-blue-50 text-blue-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {totalStock > 0
                            ? `${totalStock} in stock`
                            : "Out of stock"}
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          disabled={featuredLoading === currentId}
                          onClick={() => handleFeaturedToggle(product)}
                          title={
                            product.isFeatured
                              ? "Remove Featured"
                              : "Mark Featured"
                          }
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border transition-all disabled:opacity-50 ${
                            product.isFeatured
                              ? "bg-amber-50 border-amber-200 text-amber-500"
                              : "bg-white border-slate-200 text-slate-400 hover:bg-amber-50 hover:text-amber-500"
                          }`}
                        >
                          {featuredLoading === currentId ? (
                            <Loader2 size={17} className="animate-spin" />
                          ) : (
                            <Star
                              size={18}
                              fill={
                                product.isFeatured
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditRedirect(product)}
                            className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                            title="Edit Product"
                          >
                            <Edit size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(currentId)}
                            disabled={actionLoading === currentId}
                            className="w-10 h-10 flex items-center justify-center border border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition disabled:opacity-40"
                            title="Delete Product"
                          >
                            {actionLoading === currentId ? (
                              <Loader2 className="animate-spin" size={18} />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalProducts > 0 && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-slate-50/40">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-800">{startItem}</span> to{" "}
                <span className="font-bold text-slate-800">{endItem}</span> of{" "}
                <span className="font-bold text-slate-800">{totalProducts}</span> products
              </p>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Show</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    sessionStorage.setItem("productsCurrentPage", "1");
                    setCurrentPage(1);
                    setLimit(Number(e.target.value));
                  }}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none cursor-pointer focus:border-slate-400"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1 || isLoading}
                onClick={() => {
                  setCurrentPage((prev) => {
                    const previousPage = Math.max(prev - 1, 1);
                    sessionStorage.setItem("productsCurrentPage", String(previousPage));
                    return previousPage;
                  });
                }}
                className="inline-flex items-center gap-1 px-3 h-10 border border-slate-200 rounded-lg bg-white text-sm font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              {visiblePages.map((page, index) => {
                const previousPage = visiblePages[index - 1];

                return (
                  <div key={page} className="flex items-center gap-2">
                    {previousPage && page - previousPage > 1 && (
                      <span className="px-1 text-slate-400 font-semibold">...</span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        sessionStorage.setItem("productsCurrentPage", String(page));
                        setCurrentPage(page);
                      }}
                      disabled={isLoading}
                      className={`min-w-10 h-10 px-3 rounded-lg text-sm font-bold border transition ${
                        currentPage === page
                          ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => {
                  setCurrentPage((prev) => {
                    const nextPage = Math.min(prev + 1, totalPages);
                    sessionStorage.setItem("productsCurrentPage", String(nextPage));
                    return nextPage;
                  });
                }}
                className="inline-flex items-center gap-1 px-3 h-10 border border-slate-200 rounded-lg bg-white text-sm font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Sticky Bar when items are selected */}
      {selectedProductIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-800 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <CheckSquare className="text-amber-400" size={20} />
            <span className="text-sm font-medium">
              <strong className="text-white">{selectedProductIds.length}</strong> items selected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedProductIds([])}
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Clear Selection
            </button>

            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 disabled:opacity-50"
            >
              {isBulkDeleting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Delete Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
}