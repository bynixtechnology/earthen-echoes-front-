import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../thunks/categoryThunk";


/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {

  // All categories
  categories: [],

  // Single selected category
  selectedCategory: null,

  // GET all loading
  loading: false,

  // GET single loading
  detailsLoading: false,

  // Create / Update / Delete loading
  actionLoading: false,

  // Error
  error: null,

  // Success message
  successMessage: null,

};


/*
|--------------------------------------------------------------------------
| Category Slice
|--------------------------------------------------------------------------
*/

const categorySlice =
  createSlice({

    name: "categories",

    initialState,


    /*
    |--------------------------------------------------------------------------
    | Reducers
    |--------------------------------------------------------------------------
    */

    reducers: {

      /*
      |--------------------------------------------------------------------------
      | Clear Error
      |--------------------------------------------------------------------------
      */

      clearCategoryError: (
        state
      ) => {

        state.error = null;

      },


      /*
      |--------------------------------------------------------------------------
      | Clear Success Message
      |--------------------------------------------------------------------------
      */

      clearCategorySuccess: (
        state
      ) => {

        state.successMessage =
          null;

      },


      /*
      |--------------------------------------------------------------------------
      | Clear Selected Category
      |--------------------------------------------------------------------------
      */

      clearSelectedCategory: (
        state
      ) => {

        state.selectedCategory =
          null;

        state.detailsLoading =
          false;

        state.error = null;

      },


      /*
      |--------------------------------------------------------------------------
      | Reset Categories
      |--------------------------------------------------------------------------
      */

      resetCategories: (
        state
      ) => {

        state.categories = [];

        state.selectedCategory =
          null;

        state.loading = false;

        state.detailsLoading =
          false;

        state.actionLoading =
          false;

        state.error = null;

        state.successMessage =
          null;

      },

    },


    /*
    |--------------------------------------------------------------------------
    | Extra Reducers
    |--------------------------------------------------------------------------
    */

    extraReducers: (
      builder
    ) => {

      builder


        /*
        |--------------------------------------------------------------------------
        | FETCH ALL CATEGORIES - PENDING
        |--------------------------------------------------------------------------
        */

        .addCase(

          fetchCategories.pending,

          (state) => {

            state.loading = true;

            state.error = null;

          }

        )


        /*
        |--------------------------------------------------------------------------
        | FETCH ALL CATEGORIES - FULFILLED
        |--------------------------------------------------------------------------
        */

        .addCase(

          fetchCategories.fulfilled,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.categories =
              Array.isArray(
                action.payload
              )
                ? action.payload
                : [];

            state.error = null;

          }

        )


        /*
        |--------------------------------------------------------------------------
        | FETCH ALL CATEGORIES - REJECTED
        |--------------------------------------------------------------------------
        */

        .addCase(

          fetchCategories.rejected,

          (
            state,
            action
          ) => {

            state.loading = false;

            /*
            | IMPORTANT:
            | Existing categories ko error par
            | unnecessarily clear nahi kar rahe.
            */

            state.error =
              action.payload ||
              "Unable to fetch categories.";

          }

        )


        /*
        |--------------------------------------------------------------------------
        | FETCH CATEGORY BY ID - PENDING
        |--------------------------------------------------------------------------
        */

        .addCase(

          fetchCategoryById.pending,

          (state) => {

            state.detailsLoading =
              true;

            state.selectedCategory =
              null;

            state.error = null;

          }

        )


        /*
        |--------------------------------------------------------------------------
        | FETCH CATEGORY BY ID - FULFILLED
        |--------------------------------------------------------------------------
        */

        .addCase(

          fetchCategoryById.fulfilled,

          (
            state,
            action
          ) => {

            state.detailsLoading =
              false;

            state.selectedCategory =
              action.payload || null;

            state.error = null;

          }

        )


        /*
        |--------------------------------------------------------------------------
        | FETCH CATEGORY BY ID - REJECTED
        |--------------------------------------------------------------------------
        */

        .addCase(

          fetchCategoryById.rejected,

          (
            state,
            action
          ) => {

            state.detailsLoading =
              false;

            state.selectedCategory =
              null;

            state.error =
              action.payload ||
              "Unable to fetch category.";

          }

        )


        /*
        |--------------------------------------------------------------------------
        | CREATE CATEGORY - PENDING
        |--------------------------------------------------------------------------
        */

        .addCase(

          createCategory.pending,

          (state) => {

            state.actionLoading =
              true;

            state.error = null;

            state.successMessage =
              null;

          }

        )


        /*
        |--------------------------------------------------------------------------
        | CREATE CATEGORY - FULFILLED
        |--------------------------------------------------------------------------
        */

        .addCase(

          createCategory.fulfilled,

          (
            state,
            action
          ) => {

            state.actionLoading =
              false;

            /*
            |--------------------------------------------------------------------------
            | categoryThunk returns:
            |
            | {
            |   category,
            |   message
            | }
            |--------------------------------------------------------------------------
            */

            const newCategory =
              action.payload
                ?.category;


            /*
            |--------------------------------------------------------------------------
            | Add Category To Redux State
            |--------------------------------------------------------------------------
            */

            if (
              newCategory &&
              typeof newCategory ===
                "object"
            ) {

              /*
              | Prevent duplicate category
              */

              const alreadyExists =
                state.categories.some(
                  (category) =>
                    category?._id ===
                    newCategory?._id
                );


              if (
                !alreadyExists
              ) {

                state.categories.unshift(
                  newCategory
                );

              }

            }


            state.successMessage =
              action.payload
                ?.message ||
              "Category created successfully.";

            state.error = null;

          }

        )


        /*
        |--------------------------------------------------------------------------
        | CREATE CATEGORY - REJECTED
        |--------------------------------------------------------------------------
        */

        .addCase(

          createCategory.rejected,

          (
            state,
            action
          ) => {

            state.actionLoading =
              false;

            state.successMessage =
              null;

            state.error =
              action.payload ||
              "Unable to create category.";

          }

        )


        /*
        |--------------------------------------------------------------------------
        | UPDATE CATEGORY - PENDING
        |--------------------------------------------------------------------------
        */

        .addCase(

          updateCategory.pending,

          (state) => {

            state.actionLoading =
              true;

            state.error = null;

            state.successMessage =
              null;

          }

        )


        /*
        |--------------------------------------------------------------------------
        | UPDATE CATEGORY - FULFILLED
        |--------------------------------------------------------------------------
        */

        .addCase(

          updateCategory.fulfilled,

          (
            state,
            action
          ) => {

            state.actionLoading =
              false;


            const updatedCategory =
              action.payload
                ?.category;

            const categoryId =
              updatedCategory?._id ||
              action.payload?.id;


            /*
            |--------------------------------------------------------------------------
            | Update Category In Array
            |--------------------------------------------------------------------------
            */

            if (
              categoryId &&
              updatedCategory
            ) {

              const index =
                state.categories.findIndex(
                  (category) =>
                    category?._id ===
                    categoryId
                );


              if (
                index !== -1
              ) {

                state.categories[
                  index
                ] = {

                  ...state.categories[
                    index
                  ],

                  ...updatedCategory,

                };

              }

            }


            /*
            |--------------------------------------------------------------------------
            | Update Selected Category
            |--------------------------------------------------------------------------
            */

            if (
              state
                .selectedCategory
                ?._id ===
                categoryId &&
              updatedCategory
            ) {

              state.selectedCategory = {

                ...state.selectedCategory,

                ...updatedCategory,

              };

            }


            state.successMessage =
              action.payload
                ?.message ||
              "Category updated successfully.";

            state.error = null;

          }

        )


        /*
        |--------------------------------------------------------------------------
        | UPDATE CATEGORY - REJECTED
        |--------------------------------------------------------------------------
        */

        .addCase(

          updateCategory.rejected,

          (
            state,
            action
          ) => {

            state.actionLoading =
              false;

            state.successMessage =
              null;

            state.error =
              action.payload ||
              "Unable to update category.";

          }

        )


        /*
        |--------------------------------------------------------------------------
        | DELETE CATEGORY - PENDING
        |--------------------------------------------------------------------------
        */

        .addCase(

          deleteCategory.pending,

          (state) => {

            state.actionLoading =
              true;

            state.error = null;

            state.successMessage =
              null;

          }

        )


        /*
        |--------------------------------------------------------------------------
        | DELETE CATEGORY - FULFILLED
        |--------------------------------------------------------------------------
        */

        .addCase(

          deleteCategory.fulfilled,

          (
            state,
            action
          ) => {

            state.actionLoading =
              false;


            /*
            |--------------------------------------------------------------------------
            | categoryThunk returns:
            |
            | {
            |   id,
            |   message
            | }
            |--------------------------------------------------------------------------
            */

            const deletedId =
              action.payload?.id;


            /*
            |--------------------------------------------------------------------------
            | Remove From Categories
            |--------------------------------------------------------------------------
            */

            if (
              deletedId
            ) {

              state.categories =
                state.categories.filter(
                  (category) =>
                    category?._id !==
                    deletedId
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Clear Selected Category If Deleted
            |--------------------------------------------------------------------------
            */

            if (
              state
                .selectedCategory
                ?._id ===
              deletedId
            ) {

              state.selectedCategory =
                null;

            }


            state.successMessage =
              action.payload
                ?.message ||
              "Category deleted successfully.";

            state.error = null;

          }

        )


        /*
        |--------------------------------------------------------------------------
        | DELETE CATEGORY - REJECTED
        |--------------------------------------------------------------------------
        */

        .addCase(

          deleteCategory.rejected,

          (
            state,
            action
          ) => {

            state.actionLoading =
              false;

            state.successMessage =
              null;

            state.error =
              action.payload ||
              "Unable to delete category.";

          }

        );

    },

  });


/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

export const {

  clearCategoryError,

  clearCategorySuccess,

  clearSelectedCategory,

  resetCategories,

} = categorySlice.actions;


/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Select All Categories
|--------------------------------------------------------------------------
*/

export const selectCategories = (
  state
) => {

  return (
    state.categories
      ?.categories ||
    []
  );

};


/*
|--------------------------------------------------------------------------
| Select Selected Category
|--------------------------------------------------------------------------
*/

export const selectSelectedCategory = (
  state
) => {

  return (
    state.categories
      ?.selectedCategory ||
    null
  );

};


/*
|--------------------------------------------------------------------------
| Select Categories Loading
|--------------------------------------------------------------------------
*/

export const selectCategoriesLoading = (
  state
) => {

  return Boolean(
    state.categories
      ?.loading
  );

};


/*
|--------------------------------------------------------------------------
| Select Category Details Loading
|--------------------------------------------------------------------------
*/

export const selectCategoryDetailsLoading = (
  state
) => {

  return Boolean(
    state.categories
      ?.detailsLoading
  );

};


/*
|--------------------------------------------------------------------------
| Select Category Action Loading
|--------------------------------------------------------------------------
*/

export const selectCategoryActionLoading = (
  state
) => {

  return Boolean(
    state.categories
      ?.actionLoading
  );

};


/*
|--------------------------------------------------------------------------
| Select Category Error
|--------------------------------------------------------------------------
*/

export const selectCategoryError = (
  state
) => {

  return (
    state.categories
      ?.error ||
    null
  );

};


/*
|--------------------------------------------------------------------------
| Select Category Success Message
|--------------------------------------------------------------------------
*/

export const selectCategorySuccessMessage = (
  state
) => {

  return (
    state.categories
      ?.successMessage ||
    null
  );

};


/*
|--------------------------------------------------------------------------
| Select Category By ID From Existing Redux State
|--------------------------------------------------------------------------
*/

export const selectCategoryById =
  (
    state,
    categoryId
  ) => {

    if (
      !categoryId
    ) {

      return null;

    }


    return (
      state.categories
        ?.categories?.find(
          (category) =>
            category?._id ===
            categoryId
        ) ||
      null
    );

  };


/*
|--------------------------------------------------------------------------
| Select Total Categories
|--------------------------------------------------------------------------
*/

export const selectTotalCategories = (
  state
) => {

  return (
    state.categories
      ?.categories
      ?.length ||
    0
  );

};


/*
|--------------------------------------------------------------------------
| Reducer
|--------------------------------------------------------------------------
*/

export default categorySlice.reducer;