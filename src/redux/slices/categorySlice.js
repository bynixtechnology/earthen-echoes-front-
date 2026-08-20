import { createSlice } from "@reduxjs/toolkit";

import {
  fetchCategories,
  fetchCategoryById,
  fetchCategoryBySlug,
  fetchCategoryProducts,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  updateCategoryFeaturedStatus,
  exportCategoriesExcel,
  importCategoriesExcel,
  deleteCategory,
} from "../thunks/categoryThunk";

/*
|--------------------------------------------------------------------------
| Helper: Sort Categories (Featured First, then by sortOrder)
|--------------------------------------------------------------------------
*/
const sortCategoriesList = (list = []) => {
  return [...list].sort((a, b) => {
    const isFeaturedA = Boolean(a?.isFeatured);
    const isFeaturedB = Boolean(b?.isFeatured);

    if (isFeaturedA === isFeaturedB) {
      return (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0);
    }
    return isFeaturedA ? -1 : 1;
  });
};

const initialState = {
  categories: [],
  selectedCategory: null,
  categoryProducts: [],

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalCategories: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  productsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalProducts: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  loading: false,
  detailsLoading: false,
  productsLoading: false,
  actionLoading: false,

  error: null,
  successMessage: null,

  excelLoading: false,
  importSummary: null,
  importErrors: [],
  importSkipped: [],
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },

    clearCategorySuccess: (state) => {
      state.successMessage = null;
    },

    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
      state.detailsLoading = false;
      state.error = null;
    },

    clearCategoryProducts: (state) => {
      state.categoryProducts = [];
      state.productsPagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalProducts: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };
      state.productsLoading = false;
    },

    resetCategories: (state) => {
      state.categories = [];
      state.selectedCategory = null;
      state.categoryProducts = [];

      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalCategories: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      state.productsPagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalProducts: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      state.loading = false;
      state.detailsLoading = false;
      state.productsLoading = false;
      state.actionLoading = false;
      state.error = null;
      state.successMessage = null;
      state.excelLoading = false;
      state.importSummary = null;
      state.importErrors = [];
      state.importSkipped = [];
    },
  },

  extraReducers: (builder) => {
    builder
      /*
      |--------------------------------------------------------------------------
      | Fetch Categories
      |--------------------------------------------------------------------------
      */
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        const fetchedList = Array.isArray(action.payload?.categories)
          ? action.payload.categories
          : [];

        state.categories = sortCategoriesList(fetchedList);

        const pagination = action.payload?.pagination || {};
        const page = Number(pagination?.page ?? action.payload?.page) || 1;
        const limit = Number(pagination?.limit ?? action.payload?.limit) || 10;
        const total =
          Number(
            pagination?.total ??
              pagination?.totalCategories ??
              action.payload?.total ??
              action.payload?.totalCategories
          ) || 0;
        const totalPages =
          Number(
            pagination?.totalPages ??
              action.payload?.totalPages ??
              action.payload?.pages
          ) || 1;

        state.pagination = {
          page,
          limit,
          total,
          totalCategories: total,
          totalPages,
          hasNextPage:
            typeof pagination?.hasNextPage === "boolean"
              ? pagination.hasNextPage
              : page < totalPages,
          hasPreviousPage:
            typeof pagination?.hasPreviousPage === "boolean"
              ? pagination.hasPreviousPage
              : page > 1,
        };
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch categories.";
      })

      /*
      |--------------------------------------------------------------------------
      | Fetch Category By ID
      |--------------------------------------------------------------------------
      */
      .addCase(fetchCategoryById.pending, (state) => {
        state.detailsLoading = true;
        state.selectedCategory = null;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedCategory = action.payload || null;
        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.selectedCategory = null;
        state.error = action.payload || "Unable to fetch category.";
      })

      /*
      |--------------------------------------------------------------------------
      | Fetch Category By Slug
      |--------------------------------------------------------------------------
      */
      .addCase(fetchCategoryBySlug.pending, (state) => {
        state.detailsLoading = true;
        state.selectedCategory = null;
        state.error = null;
      })
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedCategory = action.payload || null;
        state.error = null;
      })
      .addCase(fetchCategoryBySlug.rejected, (state, action) => {
        state.detailsLoading = false;
        state.selectedCategory = null;
        state.error = action.payload || "Unable to fetch category.";
      })

      /*
      |--------------------------------------------------------------------------
      | Fetch Category Products
      |--------------------------------------------------------------------------
      */
      .addCase(fetchCategoryProducts.pending, (state) => {
        state.productsLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.categoryProducts = Array.isArray(action.payload?.products)
          ? action.payload.products
          : [];

        const pagination = action.payload?.pagination || {};
        const page = Number(pagination?.page ?? action.payload?.page) || 1;
        const limit = Number(pagination?.limit ?? action.payload?.limit) || 10;
        const total =
          Number(
            pagination?.total ??
              pagination?.totalProducts ??
              action.payload?.total ??
              action.payload?.totalProducts
          ) || 0;
        const totalPages =
          Number(
            pagination?.totalPages ??
              action.payload?.totalPages ??
              action.payload?.pages
          ) || 1;

        state.productsPagination = {
          page,
          limit,
          total,
          totalProducts: total,
          totalPages,
          hasNextPage:
            typeof pagination?.hasNextPage === "boolean"
              ? pagination.hasNextPage
              : page < totalPages,
          hasPreviousPage:
            typeof pagination?.hasPreviousPage === "boolean"
              ? pagination.hasPreviousPage
              : page > 1,
        };
        state.error = null;
      })
      .addCase(fetchCategoryProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.error = action.payload || "Unable to fetch category products.";
      })

      /*
      |--------------------------------------------------------------------------
      | Create Category
      |--------------------------------------------------------------------------
      */
      .addCase(createCategory.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.actionLoading = false;
        const newCategory = action.payload?.category;

        if (newCategory && typeof newCategory === "object") {
          const alreadyExists = state.categories.some(
            (category) => category?._id === newCategory?._id
          );

          if (!alreadyExists) {
            if (state.pagination.page === 1) {
              const updatedList = [newCategory, ...state.categories];
              state.categories = sortCategoriesList(updatedList);

              if (state.categories.length > state.pagination.limit) {
                state.categories.pop();
              }
            }

            const newTotal = state.pagination.total + 1;
            state.pagination.total = newTotal;
            state.pagination.totalCategories = newTotal;
            state.pagination.totalPages = Math.max(
              1,
              Math.ceil(newTotal / Math.max(state.pagination.limit, 1))
            );
            state.pagination.hasNextPage =
              state.pagination.page < state.pagination.totalPages;
          }
        }

        state.successMessage =
          action.payload?.message || "Category created successfully.";
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.actionLoading = false;
        state.successMessage = null;
        state.error = action.payload || "Unable to create category.";
      })

      /*
      |--------------------------------------------------------------------------
      | Update Category
      |--------------------------------------------------------------------------
      */
      .addCase(updateCategory.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updatedCategory = action.payload?.category;
        const categoryId = updatedCategory?._id || action.payload?.id;

        if (categoryId && updatedCategory) {
          const index = state.categories.findIndex(
            (category) => category?._id === categoryId
          );

          if (index !== -1) {
            state.categories[index] = {
              ...state.categories[index],
              ...updatedCategory,
            };
            state.categories = sortCategoriesList(state.categories);
          }
        }

        if (state.selectedCategory?._id === categoryId && updatedCategory) {
          state.selectedCategory = {
            ...state.selectedCategory,
            ...updatedCategory,
          };
        }

        state.successMessage =
          action.payload?.message || "Category updated successfully.";
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.actionLoading = false;
        state.successMessage = null;
        state.error = action.payload || "Unable to update category.";
      })

      /*
      |--------------------------------------------------------------------------
      | Update Category Status (isActive)
      |--------------------------------------------------------------------------
      */
      .addCase(updateCategoryStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateCategoryStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { id, isActive, category, message } = action.payload || {};
        const categoryId = category?._id || id;

        const index = state.categories.findIndex(
          (item) => item?._id === categoryId
        );

        if (index !== -1) {
          if (category && typeof category === "object") {
            state.categories[index] = {
              ...state.categories[index],
              ...category,
            };
          } else {
            state.categories[index].isActive = isActive;
          }
        }

        if (state.selectedCategory?._id === categoryId) {
          if (category && typeof category === "object") {
            state.selectedCategory = {
              ...state.selectedCategory,
              ...category,
            };
          } else {
            state.selectedCategory.isActive = isActive;
          }
        }

        state.successMessage =
          message ||
          (isActive
            ? "Category activated successfully."
            : "Category deactivated successfully.");
        state.error = null;
      })
      .addCase(updateCategoryStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.successMessage = null;
        state.error = action.payload || "Unable to update category status.";
      })

      /*
      |--------------------------------------------------------------------------
      | Update Category Featured Status (isFeatured)
      |--------------------------------------------------------------------------
      */
      .addCase(updateCategoryFeaturedStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateCategoryFeaturedStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { id, isFeatured, category, message } = action.payload || {};
        const categoryId = category?._id || id;

        const index = state.categories.findIndex(
          (item) => item?._id === categoryId
        );

        if (index !== -1) {
          if (category && typeof category === "object") {
            state.categories[index] = {
              ...state.categories[index],
              ...category,
            };
          } else {
            state.categories[index].isFeatured = isFeatured;
          }

          // Re-sort array immediately so featured category moves to top
          state.categories = sortCategoriesList(state.categories);
        }

        if (state.selectedCategory?._id === categoryId) {
          if (category && typeof category === "object") {
            state.selectedCategory = {
              ...state.selectedCategory,
              ...category,
            };
          } else {
            state.selectedCategory.isFeatured = isFeatured;
          }
        }

        state.successMessage =
          message ||
          (isFeatured
            ? "Category marked as featured."
            : "Category removed from featured categories.");
        state.error = null;
      })
      .addCase(updateCategoryFeaturedStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.successMessage = null;
        state.error =
          action.payload || "Unable to update category featured status.";
      })

      /*
      |--------------------------------------------------------------------------
      | Delete Category
      |--------------------------------------------------------------------------
      */
      .addCase(deleteCategory.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.actionLoading = false;
        const deletedId = action.payload?.id;

        if (deletedId) {
          const existed = state.categories.some(
            (category) => category?._id === deletedId
          );

          state.categories = state.categories.filter(
            (category) => category?._id !== deletedId
          );

          if (existed || state.pagination.total > 0) {
            const newTotal = Math.max(0, state.pagination.total - 1);
            state.pagination.total = newTotal;
            state.pagination.totalCategories = newTotal;
            state.pagination.totalPages = Math.max(
              1,
              Math.ceil(newTotal / Math.max(state.pagination.limit, 1))
            );

            if (state.pagination.page > state.pagination.totalPages) {
              state.pagination.page = state.pagination.totalPages;
            }

            state.pagination.hasNextPage =
              state.pagination.page < state.pagination.totalPages;
            state.pagination.hasPreviousPage = state.pagination.page > 1;
          }
        }

        if (state.selectedCategory?._id === deletedId) {
          state.selectedCategory = null;
        }

        state.successMessage =
          action.payload?.message || "Category deleted successfully.";
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.actionLoading = false;
        state.successMessage = null;
        state.error = action.payload || "Unable to delete category.";
      })

      /*
      |--------------------------------------------------------------------------
      | Export Categories Excel
      |--------------------------------------------------------------------------
      */
      .addCase(exportCategoriesExcel.pending, (state) => {
        state.excelLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(exportCategoriesExcel.fulfilled, (state) => {
        state.excelLoading = false;
        state.successMessage = "Categories exported successfully.";
      })
      .addCase(exportCategoriesExcel.rejected, (state, action) => {
        state.excelLoading = false;
        state.error = action.payload || "Unable to export categories.";
      })

      /*
      |--------------------------------------------------------------------------
      | Import Categories Excel
      |--------------------------------------------------------------------------
      */
      .addCase(importCategoriesExcel.pending, (state) => {
        state.excelLoading = true;
        state.error = null;
        state.successMessage = null;
        state.importSummary = null;
        state.importErrors = [];
        state.importSkipped = [];
      })
      .addCase(importCategoriesExcel.fulfilled, (state, action) => {
        state.excelLoading = false;
        state.successMessage =
          action.payload?.message || "Categories imported successfully.";
        state.importSummary = action.payload?.summary || null;
        state.importErrors = action.payload?.errors || [];
        state.importSkipped = action.payload?.skipped || [];
      })
      .addCase(importCategoriesExcel.rejected, (state, action) => {
        state.excelLoading = false;
        state.error = action.payload || "Unable to import categories.";
      });
  },
});

export const {
  clearCategoryError,
  clearCategorySuccess,
  clearSelectedCategory,
  clearCategoryProducts,
  resetCategories,
} = categorySlice.actions;

/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/

export const selectCategories = (state) =>
  state.categories?.categories || [];

export const selectSelectedCategory = (state) =>
  state.categories?.selectedCategory || null;

export const selectCategoryProducts = (state) =>
  state.categories?.categoryProducts || [];

export const selectCategoriesLoading = (state) =>
  Boolean(state.categories?.loading);

export const selectCategoryDetailsLoading = (state) =>
  Boolean(state.categories?.detailsLoading);

export const selectCategoryProductsLoading = (state) =>
  Boolean(state.categories?.productsLoading);

export const selectCategoryActionLoading = (state) =>
  Boolean(state.categories?.actionLoading);

export const selectCategoryError = (state) =>
  state.categories?.error || null;

export const selectCategorySuccessMessage = (state) =>
  state.categories?.successMessage || null;

export const selectCategoryPagination = (state) => {
  const pagination = state.categories?.pagination;
  return {
    page: pagination?.page || 1,
    limit: pagination?.limit || 10,
    total: pagination?.total || 0,
    totalCategories: pagination?.totalCategories || pagination?.total || 0,
    totalPages: pagination?.totalPages || 1,
    pages: pagination?.totalPages || 1,
    hasNextPage: Boolean(pagination?.hasNextPage),
    hasPreviousPage: Boolean(pagination?.hasPreviousPage),
  };
};

export const selectCategoryProductsPagination = (state) => {
  const pagination = state.categories?.productsPagination;
  return {
    page: pagination?.page || 1,
    limit: pagination?.limit || 10,
    total: pagination?.total || 0,
    totalProducts: pagination?.totalProducts || pagination?.total || 0,
    totalPages: pagination?.totalPages || 1,
    pages: pagination?.totalPages || 1,
    hasNextPage: Boolean(pagination?.hasNextPage),
    hasPreviousPage: Boolean(pagination?.hasPreviousPage),
  };
};

export const selectCategoryById = (state, categoryId) => {
  if (!categoryId) return null;
  return (
    state.categories?.categories?.find(
      (category) => category?._id === categoryId
    ) || null
  );
};

export const selectCategoryBySlug = (state, slug) => {
  if (!slug) return null;
  return (
    state.categories?.categories?.find(
      (category) => category?.slug === slug
    ) || null
  );
};

export const selectTotalCategories = (state) =>
  state.categories?.pagination?.totalCategories ??
  state.categories?.pagination?.total ??
  state.categories?.categories?.length ??
  0;

export const selectActiveCategories = (state) =>
  (state.categories?.categories || []).filter(
    (category) => category?.isActive === true
  );

export const selectFeaturedCategories = (state) =>
  (state.categories?.categories || []).filter(
    (category) => category?.isFeatured === true
  );

export const selectCategoryExcelLoading = (state) =>
  Boolean(state.categories?.excelLoading);

export const selectCategoryImportSummary = (state) =>
  state.categories?.importSummary || null;

export const selectCategoryImportErrors = (state) =>
  state.categories?.importErrors || [];

export const selectCategoryImportSkipped = (state) =>
  state.categories?.importSkipped || [];

export default categorySlice.reducer;