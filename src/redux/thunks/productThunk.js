import {
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  ProductService,
} from "../../services/productService";


const getErrorMessage = (
  error,
  fallback
) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.data?.message ||
    error?.message ||
    fallback
  );
};


const normalizeProducts = (
  response
) => {
  const products =
    response?.data?.data?.products ||
    response?.data?.products ||
    response?.data?.data ||
    response?.products ||
    response?.data ||
    response ||
    [];

  return Array.isArray(products)
    ? products
    : [];
};


const normalizeProduct = (
  response
) => {
  const product =
    response?.data?.data?.product ||
    response?.data?.product ||
    response?.data?.data ||
    response?.product ||
    response?.data ||
    response ||
    null;

  if (
    !product ||
    typeof product !== "object" ||
    Array.isArray(product)
  ) {
    return null;
  }

  return product;
};


const getPaginationObject = (
  response
) => {
  return (
    response?.pagination ||
    response?.data?.pagination ||
    response?.data?.data?.pagination ||
    {}
  );
};


const normalizeProductsPayload = (
  response,
  params = {}
) => {
  const products =
    normalizeProducts(
      response
    );

  const pagination =
    getPaginationObject(
      response
    );

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

  const total =
    Number(
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
    Number.isFinite(total) &&
    total >= 0
      ? total
      : products.length;

  const totalPages =
    Number(
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
    Number.isFinite(totalPages) &&
    totalPages > 0
      ? totalPages
      : Math.max(
          1,
          Math.ceil(
            safeTotal /
              Math.max(
                limit,
                1
              )
          )
        );

  const hasNextPage =
    typeof pagination
      ?.hasNextPage ===
    "boolean"
      ? pagination.hasNextPage
      : page < safeTotalPages;

  const hasPreviousPage =
    typeof pagination
      ?.hasPreviousPage ===
    "boolean"
      ? pagination.hasPreviousPage
      : page > 1;

  const results =
    Number(
      response?.results ??
      response?.data?.results ??
      response?.data?.data?.results ??
      products.length
    );

  return {
    products,

    results:
      Number.isFinite(results)
        ? results
        : products.length,

    total:
      safeTotal,

    totalProducts:
      safeTotal,

    page,

    limit,

    pages:
      safeTotalPages,

    totalPages:
      safeTotalPages,

    hasNextPage,

    hasPreviousPage,

    pagination: {
      page,

      limit,

      total:
        safeTotal,

      totalProducts:
        safeTotal,

      totalPages:
        safeTotalPages,

      hasNextPage,

      hasPreviousPage,
    },
  };
};


export const fetchProducts =
  createAsyncThunk(
    "products/fetchProducts",

    async (
      params = {},
      {
        rejectWithValue,
      }
    ) => {
      try {
        const requestParams = {
          page:
            Number(
              params?.page
            ) || 1,

          limit:
            Number(
              params?.limit
            ) || 10,

          ...params,
        };

        const response =
          await ProductService.getAll(
            requestParams
          );

        return normalizeProductsPayload(
          response,
          requestParams
        );
      } catch (error) {
        console.error(
          "FETCH PRODUCTS ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch products."
          )
        );
      }
    }
  );


export const fetchPublicProducts =
  createAsyncThunk(
    "products/fetchPublicProducts",

    async (
      params = {},
      {
        rejectWithValue,
      }
    ) => {
      try {
        const requestParams = {
          page:
            Number(
              params?.page
            ) || 1,

          limit:
            Number(
              params?.limit
            ) || 10,

          ...params,
        };

        const response =
          await ProductService.getPublic(
            requestParams
          );

        return normalizeProductsPayload(
          response,
          requestParams
        );
      } catch (error) {
        console.error(
          "FETCH PUBLIC PRODUCTS ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch products."
          )
        );
      }
    }
  );


export const fetchProductById =
  createAsyncThunk(
    "products/fetchProductById",

    async (
      id,
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Product ID is required."
          );
        }

        const response =
          await ProductService.getById(
            id
          );

        const product =
          normalizeProduct(
            response
          );

        if (!product) {
          return rejectWithValue(
            "Product not found."
          );
        }

        return product;
      } catch (error) {
        console.error(
          "FETCH PRODUCT BY ID ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch product."
          )
        );
      }
    }
  );


export const fetchProductBySlug =
  createAsyncThunk(
    "products/fetchProductBySlug",

    async (
      slug,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const cleanSlug =
          slug?.trim();

        if (!cleanSlug) {
          return rejectWithValue(
            "Product slug is required."
          );
        }

        const response =
          await ProductService.getBySlug(
            cleanSlug
          );

        const product =
          normalizeProduct(
            response
          );

        if (!product) {
          return rejectWithValue(
            "Product not found."
          );
        }

        return product;
      } catch (error) {
        console.error(
          "FETCH PRODUCT BY SLUG ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch product."
          )
        );
      }
    }
  );


export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",

  async (
    {
      categoryId,
      params = {},
    },
    {
      rejectWithValue,
    }
  ) => {
    try {
      console.log("======================================");
      console.log("fetchProductsByCategory THUNK");
      console.log("Received categoryId =>", categoryId);
      console.log("Received params =>", params);

      if (!categoryId) {
        console.error("Category ID is missing.");

        return rejectWithValue(
          "Category ID is required."
        );
      }

      const requestParams = {
        page:
          Number(params?.page) || 1,

        limit:
          Number(params?.limit) || 10,

        ...params,
      };

      console.log(
        "Final Request Params =>",
        requestParams
      );

      console.log(
        "Calling ProductService.getByCategory..."
      );

      const response =
        await ProductService.getByCategory(
          categoryId,
          requestParams
        );

      console.log("API Response =>", response);

      return {
        categoryId,

        ...normalizeProductsPayload(
          response,
          requestParams
        ),
      };
    } catch (error) {
      console.error(
        "FETCH PRODUCTS BY CATEGORY ERROR:",
        error
      );

      return rejectWithValue(
        getErrorMessage(
          error,
          "Unable to fetch category products."
        )
      );
    }
  }
);


export const searchProducts =
  createAsyncThunk(
    "products/searchProducts",

    async (
      {
        search,
        params = {},
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const cleanSearch =
          search?.trim();

        if (!cleanSearch) {
          return rejectWithValue(
            "Search keyword is required."
          );
        }

        const requestParams = {
          page:
            Number(
              params?.page
            ) || 1,

          limit:
            Number(
              params?.limit
            ) || 10,

          ...params,
        };

        const response =
          await ProductService.search(
            cleanSearch,
            requestParams
          );

        return {
          search:
            cleanSearch,

          ...normalizeProductsPayload(
            response,
            requestParams
          ),
        };
      } catch (error) {
        console.error(
          "SEARCH PRODUCTS ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to search products."
          )
        );
      }
    }
  );


export const fetchFeaturedProducts =
  createAsyncThunk(
    "products/fetchFeaturedProducts",

    async (
      params = {},
      {
        rejectWithValue,
      }
    ) => {
      try {
        const requestParams = {
          page:
            Number(
              params?.page
            ) || 1,

          limit:
            Number(
              params?.limit
            ) || 10,

          ...params,
        };

        const response =
          await ProductService
            .getFeatured(
              requestParams
            );

        return normalizeProductsPayload(
          response,
          requestParams
        );
      } catch (error) {
        console.error(
          "FETCH FEATURED PRODUCTS ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch featured products."
          )
        );
      }
    }
  );


export const fetchPublicFeaturedProducts =
  createAsyncThunk(
    "products/fetchPublicFeaturedProducts",

    async (
      params = {},
      {
        rejectWithValue,
      }
    ) => {
      try {
        const requestParams = {
          page:
            Number(
              params?.page
            ) || 1,

          limit:
            Number(
              params?.limit
            ) || 10,

          ...params,
        };

        const response =
          await ProductService
            .getPublicFeatured(
              requestParams
            );

        return normalizeProductsPayload(
          response,
          requestParams
        );
      } catch (error) {
        console.error(
          "FETCH PUBLIC FEATURED PRODUCTS ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch featured products."
          )
        );
      }
    }
  );


export const createProduct =
  createAsyncThunk(
    "products/createProduct",

    async (
      {
        formData,
        onProgress,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (
          !formData ||
          !(
            formData instanceof
            FormData
          )
        ) {
          return rejectWithValue(
            "Valid product form data is required."
          );
        }

        const response =
          await ProductService.create(
            formData,
            onProgress
          );

        const product =
          normalizeProduct(
            response
          );

        if (!product) {
          return rejectWithValue(
            "Invalid product response."
          );
        }

        return {
          product,

          message:
            response?.message ||
            response?.data?.message ||
            "Product created successfully.",
        };
      } catch (error) {
        console.error(
          "CREATE PRODUCT ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to create product."
          )
        );
      }
    }
  );

  export const importProductsExcel =
  createAsyncThunk(
    "products/importProductsExcel",

    async (
      {
        formData,
        onProgress,
      },
      {
        rejectWithValue,
      }
    ) => {

      try {

        if (
          !formData ||
          !(
            formData instanceof
            FormData
          )
        ) {

          return rejectWithValue(
            "Excel file is required."
          );

        }

        const response =
          await ProductService.importExcel(
            formData,
            onProgress
          );

        return {
          message:
            response?.message ||
            "Products imported successfully.",

          data:
            response?.data ||
            response,
        };

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to import products."
          )
        );

      }

    }
  );


export const updateProduct =
  createAsyncThunk(
    "products/updateProduct",

    async (
      {
        id,
        data,
        onProgress,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Product ID is required."
          );
        }

        if (!data) {
          return rejectWithValue(
            "Product data is required."
          );
        }

        const response =
          await ProductService.update(
            id,
            data,
            onProgress
          );

        const product =
          normalizeProduct(
            response
          );

        if (!product) {
          return rejectWithValue(
            "Invalid updated product response."
          );
        }

        return {
          id,

          product: {
            ...product,

            _id:
              product?._id ||
              id,
          },

          message:
            response?.message ||
            response?.data?.message ||
            "Product updated successfully.",
        };
      } catch (error) {
        console.error(
          "UPDATE PRODUCT ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to update product."
          )
        );
      }
    }
  );


export const updateProductStatus =
  createAsyncThunk(
    "products/updateProductStatus",

    async (
      {
        id,
        isActive,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Product ID is required."
          );
        }

        if (
          typeof isActive !==
          "boolean"
        ) {
          return rejectWithValue(
            "Product status must be true or false."
          );
        }

        const response =
          await ProductService
            .updateStatus(
              id,
              isActive
            );

        const product =
          normalizeProduct(
            response
          );

        return {
          id,

          isActive:
            product?.isActive ??
            isActive,

          product,

          message:
            response?.message ||
            response?.data?.message ||
            (
              isActive
                ? "Product activated successfully."
                : "Product deactivated successfully."
            ),
        };
      } catch (error) {
        console.error(
          "UPDATE PRODUCT STATUS ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to update product status."
          )
        );
      }
    }
  );


export const updateProductFeatured =
  createAsyncThunk(
    "products/updateProductFeatured",

    async (
      {
        id,
        isFeatured,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Product ID is required."
          );
        }

        if (
          typeof isFeatured !==
          "boolean"
        ) {
          return rejectWithValue(
            "Featured status must be true or false."
          );
        }

        const response =
          await ProductService
            .updateFeatured(
              id,
              isFeatured
            );

        const product =
          normalizeProduct(
            response
          );

        return {
          id,

          isFeatured:
            product?.isFeatured ??
            isFeatured,

          product,

          message:
            response?.message ||
            response?.data?.message ||
            (
              isFeatured
                ? "Product marked as featured."
                : "Product removed from featured."
            ),
        };
      } catch (error) {
        console.error(
          "UPDATE PRODUCT FEATURED ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to update featured status."
          )
        );
      }
    }
  );


export const updateProductStock =
  createAsyncThunk(
    "products/updateProductStock",

    async (
      {
        id,
        stock,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Product ID is required."
          );
        }

        const parsedStock =
          Number(stock);

        if (
          !Number.isFinite(
            parsedStock
          ) ||
          parsedStock < 0
        ) {
          return rejectWithValue(
            "Stock must be a valid non-negative number."
          );
        }

        const response =
          await ProductService
            .updateStock(
              id,
              parsedStock
            );

        const product =
          normalizeProduct(
            response
          );

        return {
          id,

          stock:
            product?.stock ??
            parsedStock,

          product,

          message:
            response?.message ||
            response?.data?.message ||
            "Product stock updated successfully.",
        };
      } catch (error) {
        console.error(
          "UPDATE PRODUCT STOCK ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to update product stock."
          )
        );
      }
    }
  );


  export const exportProductsExcel =
  createAsyncThunk(
    "products/exportProductsExcel",

    async (
      params = {},
      {
        rejectWithValue,
      }
    ) => {

      try {

        const file =
          await ProductService.exportExcel(
            params
          );

        return file;

      } catch (error) {

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to export products."
          )
        );

      }

    }
  );

export const deleteProduct =
  createAsyncThunk(
    "products/deleteProduct",

    async (
      id,
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Product ID is required."
          );
        }

        const response =
          await ProductService.delete(
            id
          );

        return {
          id,

          message:
            response?.message ||
            response?.data?.message ||
            "Product deleted successfully.",
        };
      } catch (error) {
        console.error(
          "DELETE PRODUCT ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to delete product."
          )
        );
      }
    }
  );