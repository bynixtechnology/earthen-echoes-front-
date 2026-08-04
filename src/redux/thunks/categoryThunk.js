import {
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  CategoryService,
} from "../../services/categoryService";


const getErrorMessage = (
  error,
  fallback
) => {
  return (
    error?.response?.data
      ?.message ||
    error?.response?.data
      ?.error ||
    error?.message ||
    fallback
  );
};


const extractCategories = (
  response
) => {
  const categories =
    response?.data
      ?.categories ||
    response?.data?.data ||
    response?.data ||
    response?.categories ||
    [];

  return Array.isArray(
    categories
  )
    ? categories
    : [];
};


const extractCategory = (
  response
) => {
  return (
    response?.data
      ?.category ||
    response?.data?.data
      ?.category ||
    response?.data?.data ||
    response?.data ||
    response?.category ||
    null
  );
};


const extractProducts = (
  response
) => {
  const products =
    response?.data
      ?.products ||
    response?.data?.data
      ?.products ||
    response?.products ||
    [];

  return Array.isArray(
    products
  )
    ? products
    : [];
};


const extractPagination = (
  response,
  params = {},
  fallbackTotal = 0
) => {
  const pagination =
    response?.pagination ||
    response?.data
      ?.pagination ||
    {};

  const page =
    Number(
      pagination?.page ??
        response?.page ??
        response?.data?.page ??
        params?.page ??
        1
    ) || 1;

  const limit =
    Number(
      pagination?.limit ??
        response?.limit ??
        response?.data?.limit ??
        params?.limit ??
        10
    ) || 10;

  const total =
    Number(
      pagination
        ?.totalCategories ??
        pagination
          ?.totalProducts ??
        pagination?.total ??
        response
          ?.totalCategories ??
        response
          ?.totalProducts ??
        response?.total ??
        response?.data
          ?.totalCategories ??
        response?.data
          ?.totalProducts ??
        response?.data?.total ??
        fallbackTotal
    ) || 0;

  const totalPages =
    Number(
      pagination
        ?.totalPages ??
        response
          ?.totalPages ??
        response?.pages ??
        response?.data
          ?.totalPages ??
        response?.data
          ?.pages ??
        Math.ceil(
          total / limit
        ) ??
        1
    ) || 1;

  const hasNextPage =
    typeof pagination
      ?.hasNextPage ===
    "boolean"
      ? pagination
          .hasNextPage
      : page < totalPages;

  const hasPreviousPage =
    typeof pagination
      ?.hasPreviousPage ===
    "boolean"
      ? pagination
          .hasPreviousPage
      : page > 1;

  return {
    page,

    limit,

    total,

    totalPages,

    hasNextPage,

    hasPreviousPage,
  };
};


/*
|--------------------------------------------------------------------------
| FETCH ALL CATEGORIES
|--------------------------------------------------------------------------
*/

export const fetchCategories =
  createAsyncThunk(
    "categories/fetchCategories",

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
            ) || 100,

          ...params,
        };

        const response =
          await CategoryService.getAll(
            requestParams
          );

        const categories =
          extractCategories(
            response
          );

        const pagination =
          extractPagination(
            response,
            requestParams,
            categories.length
          );

        return {
          categories,

          results:
            Number(
              response
                ?.results ??
                response?.data
                  ?.results ??
                categories.length
            ) ||
            categories.length,

          totalCategories:
            Number(
              response
                ?.totalCategories ??
                response?.data
                  ?.totalCategories ??
                pagination.total
            ) ||
            pagination.total,

          pagination,

          page:
            pagination.page,

          limit:
            pagination.limit,

          total:
            pagination.total,

          pages:
            pagination
              .totalPages,

          totalPages:
            pagination
              .totalPages,

          hasNextPage:
            pagination
              .hasNextPage,

          hasPreviousPage:
            pagination
              .hasPreviousPage,
        };
      } catch (error) {
        console.error(
          "FETCH CATEGORIES ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch categories."
          )
        );
      }
    }
  );


/*
|--------------------------------------------------------------------------
| FETCH CATEGORY BY ID
|--------------------------------------------------------------------------
*/

export const fetchCategoryById =
  createAsyncThunk(
    "categories/fetchCategoryById",

    async (
      id,
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Category ID is required."
          );
        }

        const response =
          await CategoryService.getById(
            id
          );

        const category =
          extractCategory(
            response
          );

        if (
          !category ||
          typeof category !==
            "object"
        ) {
          return rejectWithValue(
            "Category not found."
          );
        }

        return category;
      } catch (error) {
        console.error(
          "FETCH CATEGORY BY ID ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch category."
          )
        );
      }
    }
  );


/*
|--------------------------------------------------------------------------
| FETCH CATEGORY BY SLUG
|--------------------------------------------------------------------------
*/

export const fetchCategoryBySlug =
  createAsyncThunk(
    "categories/fetchCategoryBySlug",

    async (
      slug,
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (
          !slug ||
          !slug.trim()
        ) {
          return rejectWithValue(
            "Category slug is required."
          );
        }

        const response =
          await CategoryService.getBySlug(
            slug.trim()
          );

        const category =
          extractCategory(
            response
          );

        if (
          !category ||
          typeof category !==
            "object"
        ) {
          return rejectWithValue(
            "Category not found."
          );
        }

        return category;
      } catch (error) {
        console.error(
          "FETCH CATEGORY BY SLUG ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch category."
          )
        );
      }
    }
  );


/*
|--------------------------------------------------------------------------
| FETCH CATEGORY PRODUCTS
|--------------------------------------------------------------------------
*/

export const fetchCategoryProducts =
  createAsyncThunk(
    "categories/fetchCategoryProducts",

    async (
      {
        id,
        params = {},
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Category ID is required."
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
          await CategoryService.getProducts(
            id,
            requestParams
          );

        const products =
          extractProducts(
            response
          );

        const pagination =
          extractPagination(
            response,
            requestParams,
            products.length
          );

        return {
          categoryId:
            id,

          products,

          results:
            Number(
              response
                ?.results ??
                response?.data
                  ?.results ??
                products.length
            ) ||
            products.length,

          pagination,

          page:
            pagination.page,

          limit:
            pagination.limit,

          total:
            pagination.total,

          pages:
            pagination
              .totalPages,

          totalPages:
            pagination
              .totalPages,

          hasNextPage:
            pagination
              .hasNextPage,

          hasPreviousPage:
            pagination
              .hasPreviousPage,
        };
      } catch (error) {
        console.error(
          "FETCH CATEGORY PRODUCTS ERROR:",
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


/*
|--------------------------------------------------------------------------
| CREATE CATEGORY
|--------------------------------------------------------------------------
*/

export const createCategory =
  createAsyncThunk(
    "categories/createCategory",

    async (
      formData,
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
            "Valid category form data is required."
          );
        }

        const response =
          await CategoryService.create(
            formData
          );

        const category =
          extractCategory(
            response
          );

        return {
          category:
            category &&
            typeof category ===
              "object"
              ? category
              : null,

          message:
            response?.message ||
            response?.data
              ?.message ||
            "Category created successfully.",
        };
      } catch (error) {
        console.error(
          "CREATE CATEGORY ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to create category."
          )
        );
      }
    }
  );


/*
|--------------------------------------------------------------------------
| UPDATE CATEGORY
|--------------------------------------------------------------------------
*/

export const updateCategory =
  createAsyncThunk(
    "categories/updateCategory",

    async (
      {
        id,
        data,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Category ID is required."
          );
        }

        if (!data) {
          return rejectWithValue(
            "Category update data is required."
          );
        }

        const response =
          await CategoryService.update(
            id,
            data
          );

        const category =
          extractCategory(
            response
          );

        return {
          id,

          category:
            category &&
            typeof category ===
              "object"
              ? category
              : null,

          message:
            response?.message ||
            response?.data
              ?.message ||
            "Category updated successfully.",
        };
      } catch (error) {
        console.error(
          "UPDATE CATEGORY ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to update category."
          )
        );
      }
    }
  );


/*
|--------------------------------------------------------------------------
| UPDATE CATEGORY STATUS
|--------------------------------------------------------------------------
*/

export const updateCategoryStatus =
  createAsyncThunk(
    "categories/updateCategoryStatus",

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
            "Category ID is required."
          );
        }

        if (
          typeof isActive !==
          "boolean"
        ) {
          return rejectWithValue(
            "Category status must be true or false."
          );
        }

        const response =
          await CategoryService.updateStatus(
            id,
            isActive
          );

        const category =
          extractCategory(
            response
          );

        return {
          id,

          isActive,

          category:
            category &&
            typeof category ===
              "object"
              ? category
              : null,

          message:
            response?.message ||
            response?.data
              ?.message ||
            (
              isActive
                ? "Category activated successfully."
                : "Category deactivated successfully."
            ),
        };
      } catch (error) {
        console.error(
          "UPDATE CATEGORY STATUS ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to update category status."
          )
        );
      }
    }
  );


/*
|--------------------------------------------------------------------------
| DELETE CATEGORY
|--------------------------------------------------------------------------
*/

export const deleteCategory =
  createAsyncThunk(
    "categories/deleteCategory",

    async (
      id,
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Category ID is required."
          );
        }

        const response =
          await CategoryService.delete(
            id
          );

        return {
          id,

          message:
            response?.message ||
            response?.data
              ?.message ||
            "Category deleted successfully.",
        };
      } catch (error) {
        console.error(
          "DELETE CATEGORY ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to delete category."
          )
        );
      }
    }
  );


  /*
|--------------------------------------------------------------------------
| EXPORT CATEGORIES EXCEL
|--------------------------------------------------------------------------
*/

export const exportCategoriesExcel =
  createAsyncThunk(
    "categories/exportCategoriesExcel",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {

        const response =
          await CategoryService.exportExcel();

        return response;

      } catch (error) {

        console.error(
          "EXPORT CATEGORY EXCEL ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to export categories."
          )
        );

      }
    }
  );



/*
|--------------------------------------------------------------------------
| IMPORT CATEGORIES EXCEL
|--------------------------------------------------------------------------
*/

export const importCategoriesExcel =
  createAsyncThunk(
    "categories/importCategoriesExcel",

    async (
      file,
      {
        rejectWithValue,
      }
    ) => {
      try {

        if (!file) {

          return rejectWithValue(
            "Excel file is required."
          );

        }

        const response =
          await CategoryService.importExcel(
            file
          );

        return {
          imported:
            response?.imported || [],

          skipped:
            response?.skipped || [],

          errors:
            response?.errors || [],

          summary:
            response?.summary || {},

          message:
            response?.message ||
            "Category import completed.",
        };

      } catch (error) {

        console.error(
          "IMPORT CATEGORY EXCEL ERROR:",
          error
        );

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to import categories."
          )
        );

      }
    }
  );