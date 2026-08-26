import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProductService } from "../../services/productService";

/*
|--------------------------------------------------------------------------
| GET Request Cache / In-Flight Deduplication Layer
|--------------------------------------------------------------------------
| - Request Cache (5-min TTL): Blocks duplicate calls if fresh data exists.
| - In-Flight Set: Blocks multiple components from triggering identical calls.
| - Cache Invalidation: Triggers on create, update, status/stock change, and delete.
|--------------------------------------------------------------------------
*/

const PRODUCT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const productRequestCache = new Map();
const productInFlightRequests = new Set();

/*
|--------------------------------------------------------------------------
| Cache Helpers
|--------------------------------------------------------------------------
*/

const stableSerialize = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value !== "object") return String(value);

  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(",")}]`;
  }

  return Object.keys(value)
    .sort()
    .map((key) => `${key}:${stableSerialize(value[key])}`)
    .join("|");
};

const getCacheKey = (type, value = "") => {
  return `products:${type}:${stableSerialize(value)}`;
};

const getCachedValue = (key) => {
  const cached = productRequestCache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > PRODUCT_CACHE_TTL) {
    productRequestCache.delete(key);
    return null;
  }

  return cached.data;
};

const setCachedValue = (key, data) => {
  productRequestCache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

export const invalidateProductCache = () => {
  productRequestCache.clear();
  productInFlightRequests.clear();
};

/*
|--------------------------------------------------------------------------
| Normalization & Error Helpers
|--------------------------------------------------------------------------
*/

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.data?.message ||
    error?.message ||
    fallback
  );
};

const normalizeProducts = (response) => {
  const products =
    response?.data?.data?.products ||
    response?.data?.products ||
    response?.data?.data ||
    response?.products ||
    response?.data ||
    response ||
    [];

  return Array.isArray(products) ? products : [];
};

const normalizeProduct = (response) => {
  const product =
    response?.data?.data?.product ||
    response?.data?.product ||
    response?.data?.data ||
    response?.product ||
    response?.data ||
    response ||
    null;

  if (!product || typeof product !== "object" || Array.isArray(product)) {
    return null;
  }

  return product;
};

const getPaginationObject = (response) => {
  return (
    response?.pagination ||
    response?.data?.pagination ||
    response?.data?.data?.pagination ||
    {}
  );
};

const normalizeProductsPayload = (response, params = {}) => {
  const products = normalizeProducts(response);
  const pagination = getPaginationObject(response);

  const page =
    Number(
      pagination?.page ??
        response?.page ??
        response?.data?.page ??
        response?.data?.data?.page ??
        params?.page ??
        1
    ) || 1;

  const limit =
    Number(
      pagination?.limit ??
        response?.limit ??
        response?.data?.limit ??
        response?.data?.data?.limit ??
        params?.limit ??
        10
    ) || 10;

  const total = Number(
    pagination?.totalProducts ??
      pagination?.total ??
      response?.totalProducts ??
      response?.total ??
      response?.data?.totalProducts ??
      response?.data?.total ??
      response?.data?.data?.totalProducts ??
      response?.data?.data?.total ??
      0
  );

  const safeTotal =
    Number.isFinite(total) && total >= 0 ? total : products.length;

  const totalPages = Number(
    pagination?.totalPages ??
      pagination?.pages ??
      response?.totalPages ??
      response?.pages ??
      response?.data?.totalPages ??
      response?.data?.pages ??
      response?.data?.data?.totalPages ??
      response?.data?.data?.pages ??
      0
  );

  const safeTotalPages =
    Number.isFinite(totalPages) && totalPages > 0
      ? totalPages
      : Math.max(1, Math.ceil(safeTotal / Math.max(limit, 1)));

  const hasNextPage =
    typeof pagination?.hasNextPage === "boolean"
      ? pagination.hasNextPage
      : page < safeTotalPages;

  const hasPreviousPage =
    typeof pagination?.hasPreviousPage === "boolean"
      ? pagination.hasPreviousPage
      : page > 1;

  const results = Number(
    response?.results ??
      response?.data?.results ??
      response?.data?.data?.results ??
      products.length
  );

  return {
    products,
    results: Number.isFinite(results) ? results : products.length,
    total: safeTotal,
    totalProducts: safeTotal,
    page,
    limit,
    pages: safeTotalPages,
    totalPages: safeTotalPages,
    hasNextPage,
    hasPreviousPage,
    pagination: {
      page,
      limit,
      total: safeTotal,
      totalProducts: safeTotal,
      totalPages: safeTotalPages,
      hasNextPage,
      hasPreviousPage,
    },
  };
};

/*
|--------------------------------------------------------------------------
| FETCH PRODUCTS
|--------------------------------------------------------------------------
*/
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    const requestParams = {
      page: Number(params?.page) || 1,
      limit: Number(params?.limit) || 10,
      ...params,
    };

    const cacheKey = getCacheKey("list", requestParams);
    const cached = getCachedValue(cacheKey);
    if (cached) return cached;

    try {
      const response = await ProductService.getPublic(requestParams);
      const payload = normalizeProductsPayload(response, requestParams);
      setCachedValue(cacheKey, payload);
      return payload;
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);
      return rejectWithValue(
        getErrorMessage(error, "Unable to fetch products.")
      );
    } finally {
      productInFlightRequests.delete(cacheKey);
    }
  },
  {
    condition: (params = {}) => {
      const requestParams = {
        page: Number(params?.page) || 1,
        limit: Number(params?.limit) || 10,
        ...params,
      };
      const cacheKey = getCacheKey("list", requestParams);

      if (getCachedValue(cacheKey) || productInFlightRequests.has(cacheKey)) {
        return false;
      }

      productInFlightRequests.add(cacheKey);
      return true;
    },
  }
);

/*
|--------------------------------------------------------------------------
| FETCH PUBLIC PRODUCTS
|--------------------------------------------------------------------------
*/
export const fetchPublicProducts = createAsyncThunk(
  "products/fetchPublicProducts",
  async (params = {}, { rejectWithValue }) => {
    const requestParams = {
      page: Number(params?.page) || 1,
      limit: Number(params?.limit) || 10,
      ...params,
    };

    const cacheKey = getCacheKey("public-list", requestParams);
    const cached = getCachedValue(cacheKey);
    if (cached) return cached;

    try {
      const response = await ProductService.getPublic(requestParams);
      const payload = normalizeProductsPayload(response, requestParams);
      setCachedValue(cacheKey, payload);
      return payload;
    } catch (error) {
      console.error("FETCH PUBLIC PRODUCTS ERROR:", error);
      return rejectWithValue(
        getErrorMessage(error, "Unable to fetch products.")
      );
    } finally {
      productInFlightRequests.delete(cacheKey);
    }
  },
  {
    condition: (params = {}) => {
      const requestParams = {
        page: Number(params?.page) || 1,
        limit: Number(params?.limit) || 10,
        ...params,
      };
      const cacheKey = getCacheKey("public-list", requestParams);

      if (getCachedValue(cacheKey) || productInFlightRequests.has(cacheKey)) {
        return false;
      }

      productInFlightRequests.add(cacheKey);
      return true;
    },
  }
);

/*
|--------------------------------------------------------------------------
| FETCH PRODUCT BY ID
|--------------------------------------------------------------------------
*/
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    if (!id) {
      return rejectWithValue("Product ID is required.");
    }

    const cacheKey = getCacheKey("by-id", id);
    const cached = getCachedValue(cacheKey);
    if (cached) return cached;

    try {
      const response = await ProductService.getById(id);
      const product = normalizeProduct(response);

      if (!product) {
        return rejectWithValue("Product not found.");
      }

      setCachedValue(cacheKey, product);
      return product;
    } catch (error) {
      console.error("FETCH PRODUCT BY ID ERROR:", error);
      return rejectWithValue(
        getErrorMessage(error, "Unable to fetch product.")
      );
    } finally {
      productInFlightRequests.delete(cacheKey);
    }
  },
  {
    condition: (id) => {
      if (!id) return false;
      const cacheKey = getCacheKey("by-id", id);

      if (getCachedValue(cacheKey) || productInFlightRequests.has(cacheKey)) {
        return false;
      }

      productInFlightRequests.add(cacheKey);
      return true;
    },
  }
);

/*
|--------------------------------------------------------------------------
| FETCH PRODUCT BY SLUG
|--------------------------------------------------------------------------
*/
export const fetchProductBySlug = createAsyncThunk(
  "products/fetchProductBySlug",
  async (slug, { rejectWithValue }) => {
    const cleanSlug = slug?.trim();
    if (!cleanSlug) {
      return rejectWithValue("Product slug is required.");
    }

    const cacheKey = getCacheKey("by-slug", cleanSlug);
    const cached = getCachedValue(cacheKey);
    if (cached) return cached;

    try {
      const response = await ProductService.getBySlug(cleanSlug);
      const product = normalizeProduct(response);

      if (!product) {
        return rejectWithValue("Product not found.");
      }

      setCachedValue(cacheKey, product);
      return product;
    } catch (error) {
      console.error("FETCH PRODUCT BY SLUG ERROR:", error);
      return rejectWithValue(
        getErrorMessage(error, "Unable to fetch product.")
      );
    } finally {
      productInFlightRequests.delete(cacheKey);
    }
  },
  {
    condition: (slug) => {
      const cleanSlug = slug?.trim();
      if (!cleanSlug) return false;
      const cacheKey = getCacheKey("by-slug", cleanSlug);

      if (getCachedValue(cacheKey) || productInFlightRequests.has(cacheKey)) {
        return false;
      }

      productInFlightRequests.add(cacheKey);
      return true;
    },
  }
);

/*
|--------------------------------------------------------------------------
| FETCH PRODUCTS BY CATEGORY
|--------------------------------------------------------------------------
*/
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async ({ categoryId, params = {} }, { rejectWithValue }) => {
    if (!categoryId) {
      return rejectWithValue("Category ID is required.");
    }

    const requestParams = {
      page: Number(params?.page) || 1,
      limit: Number(params?.limit) || 10,
      ...params,
    };

    const cacheKey = getCacheKey("by-category", {
      categoryId,
      params: requestParams,
    });

    const cached = getCachedValue(cacheKey);
    if (cached) return cached;

    try {
      const response = await ProductService.getByCategory(
        categoryId,
        requestParams
      );
      const payload = {
        categoryId,
        ...normalizeProductsPayload(response, requestParams),
      };

      setCachedValue(cacheKey, payload);
      return payload;
    } catch (error) {
      console.error("FETCH PRODUCTS BY CATEGORY ERROR:", error);
      return rejectWithValue(
        getErrorMessage(error, "Unable to fetch category products.")
      );
    } finally {
      productInFlightRequests.delete(cacheKey);
    }
  },
  {
    condition: ({ categoryId, params = {} } = {}) => {
      if (!categoryId) return false;

      const requestParams = {
        page: Number(params?.page) || 1,
        limit: Number(params?.limit) || 10,
        ...params,
      };

      const cacheKey = getCacheKey("by-category", {
        categoryId,
        params: requestParams,
      });

      if (getCachedValue(cacheKey) || productInFlightRequests.has(cacheKey)) {
        return false;
      }

      productInFlightRequests.add(cacheKey);
      return true;
    },
  }
);

/*
|--------------------------------------------------------------------------
| SEARCH PRODUCTS
|--------------------------------------------------------------------------
*/
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async ({ search, params = {} }, { rejectWithValue }) => {
    const cleanSearch = search?.trim();
    if (!cleanSearch) {
      return rejectWithValue("Search keyword is required.");
    }

    const requestParams = {
      page: Number(params?.page) || 1,
      limit: Number(params?.limit) || 10,
      ...params,
    };

    const cacheKey = getCacheKey("search", {
      search: cleanSearch,
      params: requestParams,
    });

    const cached = getCachedValue(cacheKey);
    if (cached) return cached;

    try {
      const response = await ProductService.search(
        cleanSearch,
        requestParams
      );
      const payload = {
        search: cleanSearch,
        ...normalizeProductsPayload(response, requestParams),
      };

      setCachedValue(cacheKey, payload);
      return payload;
    } catch (error) {
      console.error("SEARCH PRODUCTS ERROR:", error);
      return rejectWithValue(
        getErrorMessage(error, "Unable to search products.")
      );
    } finally {
      productInFlightRequests.delete(cacheKey);
    }
  },
  {
    condition: ({ search, params = {} } = {}) => {
      const cleanSearch = search?.trim();
      if (!cleanSearch) return false;

      const requestParams = {
        page: Number(params?.page) || 1,
        limit: Number(params?.limit) || 10,
        ...params,
      };

      const cacheKey = getCacheKey("search", {
        search: cleanSearch,
        params: requestParams,
      });

      if (getCachedValue(cacheKey) || productInFlightRequests.has(cacheKey)) {
        return false;
      }

      productInFlightRequests.add(cacheKey);
      return true;
    },
  }
);

/*
|--------------------------------------------------------------------------
| FETCH FEATURED PRODUCTS
|--------------------------------------------------------------------------
*/
export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (params = {}, { rejectWithValue }) => {
    const requestParams = {
      page: Number(params?.page) || 1,
      limit: Number(params?.limit) || 10,
      ...params,
    };

    const cacheKey = getCacheKey("featured", requestParams);
    const cached = getCachedValue(cacheKey);
    if (cached) return cached;

    try {
      const response = await ProductService.getPublicFeatured(requestParams);
      const payload = normalizeProductsPayload(response, requestParams);

      setCachedValue(cacheKey, payload);
      return payload;
    } catch (error) {
      console.error("FETCH FEATURED PRODUCTS ERROR:", error);
      return rejectWithValue(
        getErrorMessage(error, "Unable to fetch featured products.")
      );
    } finally {
      productInFlightRequests.delete(cacheKey);
    }
  },
  {
    condition: (params = {}) => {
      const requestParams = {
        page: Number(params?.page) || 1,
        limit: Number(params?.limit) || 10,
        ...params,
      };

      const cacheKey = getCacheKey("featured", requestParams);

      if (getCachedValue(cacheKey) || productInFlightRequests.has(cacheKey)) {
        return false;
      }

      productInFlightRequests.add(cacheKey);
      return true;
    },
  }
);

/*
|--------------------------------------------------------------------------
| FETCH PUBLIC FEATURED PRODUCTS
|--------------------------------------------------------------------------
*/
export const fetchPublicFeaturedProducts = createAsyncThunk(
  "products/fetchPublicFeaturedProducts",
  async (params = {}, { rejectWithValue }) => {
    const requestParams = {
      page: Number(params?.page) || 1,
      limit: Number(params?.limit) || 10,
      ...params,
    };

    const cacheKey = getCacheKey("public-featured", requestParams);
    const cached = getCachedValue(cacheKey);
    if (cached) return cached;

    try {
      const response = await ProductService.getPublicFeatured(requestParams);
      const payload = normalizeProductsPayload(response, requestParams);

      setCachedValue(cacheKey, payload);
      return payload;
    } catch (error) {
      console.error("FETCH PUBLIC FEATURED PRODUCTS ERROR:", error);
      return rejectWithValue(
        getErrorMessage(error, "Unable to fetch featured products.")
      );
    } finally {
      productInFlightRequests.delete(cacheKey);
    }
  },
  {
    condition: (params = {}) => {
      const requestParams = {
        page: Number(params?.page) || 1,
        limit: Number(params?.limit) || 10,
        ...params,
      };

      const cacheKey = getCacheKey("public-featured", requestParams);

      if (getCachedValue(cacheKey) || productInFlightRequests.has(cacheKey)) {
        return false;
      }

      productInFlightRequests.add(cacheKey);
      return true;
    },
  }
);

/*
|--------------------------------------------------------------------------
| CREATE PRODUCT
|--------------------------------------------------------------------------
*/
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async ({ formData, onProgress }, { rejectWithValue }) => {
    try {
      if (!formData || !(formData instanceof FormData)) {
        return rejectWithValue("Valid product form data is required.");
      }

      const response = await ProductService.create(formData, onProgress);
      invalidateProductCache();

      const product = normalizeProduct(response);
      if (!product) {
        return rejectWithValue("Invalid product response.");
      }

      return {
        product,
        message:
          response?.message ||
          response?.data?.message ||
          "Product created successfully.",
      };
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);
      return rejectWithValue(
        getErrorMessage(error, "Unable to create product.")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| IMPORT PRODUCTS EXCEL
|--------------------------------------------------------------------------
*/
export const importProductsExcel = createAsyncThunk(
  "products/importProductsExcel",
  async ({ formData, onProgress }, { rejectWithValue }) => {
    try {
      if (!formData || !(formData instanceof FormData)) {
        return rejectWithValue("Excel file is required.");
      }

      const response = await ProductService.importExcel(
        formData,
        onProgress
      );
      invalidateProductCache();

      return {
        message:
          response?.message || "Products imported successfully.",
        data: response?.data || response,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to import products.")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT
|--------------------------------------------------------------------------
*/
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data, onProgress }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Product ID is required.");
      }

      if (!data) {
        return rejectWithValue("Product data is required.");
      }

      const response = await ProductService.update(id, data, onProgress);
      invalidateProductCache();

      const product = normalizeProduct(response);
      if (!product) {
        return rejectWithValue("Invalid updated product response.");
      }

      return {
        id,
        product: {
          ...product,
          _id: product?._id || id,
        },
        message:
          response?.message ||
          response?.data?.message ||
          "Product updated successfully.",
      };
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);
      return rejectWithValue(
        getErrorMessage(error, "Unable to update product.")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT STATUS
|--------------------------------------------------------------------------
*/
export const updateProductStatus = createAsyncThunk(
  "products/updateProductStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Product ID is required.");
      }

      if (typeof isActive !== "boolean") {
        return rejectWithValue("Product status must be true or false.");
      }

      const response = await ProductService.updateStatus(id, isActive);
      invalidateProductCache();

      const product = normalizeProduct(response);

      return {
        id,
        isActive: product?.isActive ?? isActive,
        product,
        message:
          response?.message ||
          response?.data?.message ||
          (isActive
            ? "Product activated successfully."
            : "Product deactivated successfully."),
      };
    } catch (error) {
      console.error("UPDATE PRODUCT STATUS ERROR:", error);
      return rejectWithValue(
        getErrorMessage(error, "Unable to update product status.")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT FEATURED
|--------------------------------------------------------------------------
*/
export const updateProductFeatured = createAsyncThunk(
  "products/updateProductFeatured",
  async ({ id, isFeatured }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Product ID is required.");
      }

      if (typeof isFeatured !== "boolean") {
        return rejectWithValue("Featured status must be true or false.");
      }

      const response = await ProductService.updateFeatured(id, isFeatured);
      invalidateProductCache();

      const product = normalizeProduct(response);

      return {
        id,
        isFeatured: product?.isFeatured ?? isFeatured,
        product,
        message:
          response?.message ||
          response?.data?.message ||
          (isFeatured
            ? "Product marked as featured."
            : "Product removed from featured."),
      };
    } catch (error) {
      console.error("UPDATE PRODUCT FEATURED ERROR:", error);
      return rejectWithValue(
        getErrorMessage(error, "Unable to update featured status.")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT STOCK
|--------------------------------------------------------------------------
*/
export const updateProductStock = createAsyncThunk(
  "products/updateProductStock",
  async ({ id, stock }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Product ID is required.");
      }

      const parsedStock = Number(stock);
      if (!Number.isFinite(parsedStock) || parsedStock < 0) {
        return rejectWithValue("Stock must be a valid non-negative number.");
      }

      const response = await ProductService.updateStock(id, parsedStock);
      invalidateProductCache();

      const product = normalizeProduct(response);

      return {
        id,
        stock: product?.stock ?? parsedStock,
        product,
        message:
          response?.message ||
          response?.data?.message ||
          "Product stock updated successfully.",
      };
    } catch (error) {
      console.error("UPDATE PRODUCT STOCK ERROR:", error);
      return rejectWithValue(
        getErrorMessage(error, "Unable to update product stock.")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| EXPORT PRODUCTS EXCEL
|--------------------------------------------------------------------------
*/
export const exportProductsExcel = createAsyncThunk(
  "products/exportProductsExcel",
  async (params = {}, { rejectWithValue }) => {
    try {
      const file = await ProductService.exportExcel(params);
      return file;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to export products.")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| DELETE PRODUCT
|--------------------------------------------------------------------------
*/
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Product ID is required.");
      }

      const response = await ProductService.delete(id);
      invalidateProductCache();

      return {
        id,
        message:
          response?.message ||
          response?.data?.message ||
          "Product deleted successfully.",
      };
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);
      return rejectWithValue(
        getErrorMessage(error, "Unable to delete product.")
      );
    }
  }
);