import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  fetchProducts,
  fetchPublicProducts,
  fetchProductById,
  fetchProductBySlug,
  fetchProductsByCategory,
  searchProducts,
  fetchFeaturedProducts,
  fetchPublicFeaturedProducts,
  createProduct,
  importProductsExcel,
  exportProductsExcel,
  updateProduct,
  updateProductStatus,
  updateProductFeatured,
  updateProductStock,
  deleteProduct,
} from "../thunks/productThunk";


const createPagination = () => ({
  page: 1,
  limit: 10,
  total: 0,
  totalProducts: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
});


const initialState = {
  products: [],

  publicProducts: [],

  selectedProduct: null,

  categoryProducts: [],

  featuredProducts: [],

  publicFeaturedProducts: [],

  searchResults: [],

  pagination:
    createPagination(),

  publicPagination:
    createPagination(),

  categoryPagination:
    createPagination(),

  searchPagination:
    createPagination(),

  featuredPagination:
    createPagination(),

  publicFeaturedPagination:
    createPagination(),

  loading: false,

  publicLoading: false,

  detailsLoading: false,

  categoryLoading: false,

  searchLoading: false,

  featuredLoading: false,

  publicFeaturedLoading: false,

  actionLoading: false,

  importLoading: false,

exportLoading: false,

  statusLoading: false,

  featuredActionLoading:
    false,

  stockLoading: false,

  error: null,

  successMessage: null,
};


const getPagination = (
  payload,
  fallbackLength = 0
) => {
  const pagination =
    payload?.pagination ||
    {};

  const page =
    Number(
      pagination?.page ??
      payload?.page ??
      1
    ) || 1;

  const limit =
    Number(
      pagination?.limit ??
      payload?.limit ??
      10
    ) || 10;

  const rawTotal =
    Number(
      pagination
        ?.totalProducts ??
      pagination?.total ??
      payload
        ?.totalProducts ??
      payload?.total ??
      fallbackLength
    );

  const total =
    Number.isFinite(
      rawTotal
    ) &&
    rawTotal >= 0
      ? rawTotal
      : fallbackLength;

  const rawTotalPages =
    Number(
      pagination
        ?.totalPages ??
      payload
        ?.totalPages ??
      payload?.pages
    );

  const totalPages =
    Number.isFinite(
      rawTotalPages
    ) &&
    rawTotalPages > 0
      ? rawTotalPages
      : Math.max(
          1,
          Math.ceil(
            total /
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

    totalProducts:
      total,

    totalPages,

    hasNextPage,

    hasPreviousPage,
  };
};


const recalculatePagination = (
  pagination
) => {
  const total =
    Math.max(
      0,
      Number(
        pagination?.total
      ) || 0
    );

  const limit =
    Math.max(
      1,
      Number(
        pagination?.limit
      ) || 10
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        total / limit
      )
    );

  let page =
    Math.max(
      1,
      Number(
        pagination?.page
      ) || 1
    );

  if (
    page > totalPages
  ) {
    page =
      totalPages;
  }

  return {
    ...pagination,

    page,

    limit,

    total,

    totalProducts:
      total,

    totalPages,

    hasNextPage:
      page < totalPages,

    hasPreviousPage:
      page > 1,
  };
};


const updateProductInArray = (
  products,
  updatedProduct
) => {
  if (
    !Array.isArray(
      products
    ) ||
    !updatedProduct?._id
  ) {
    return products;
  }

  return products.map(
    (product) =>
      product?._id ===
      updatedProduct._id
        ? {
            ...product,

            ...updatedProduct,
          }
        : product
  );
};


const removeProductFromArray = (
  products,
  productId
) => {
  if (
    !Array.isArray(
      products
    ) ||
    !productId
  ) {
    return products;
  }

  return products.filter(
    (product) =>
      product?._id !==
      productId
  );
};


const addProductIfMissing = (
  products,
  product,
  limit = null
) => {
  if (
    !Array.isArray(
      products
    ) ||
    !product?._id
  ) {
    return products;
  }

  const exists =
    products.some(
      (item) =>
        item?._id ===
        product._id
    );

  if (exists) {
    return updateProductInArray(
      products,
      product
    );
  }

  const updated = [
    product,
    ...products,
  ];

  if (
    Number.isFinite(
      limit
    ) &&
    limit > 0 &&
    updated.length > limit
  ) {
    return updated.slice(
      0,
      limit
    );
  }

  return updated;
};


const syncProductEverywhere = (
  state,
  product
) => {
  if (!product?._id) {
    return;
  }

  state.products =
    updateProductInArray(
      state.products,
      product
    );

  state.publicProducts =
    updateProductInArray(
      state.publicProducts,
      product
    );

  state.categoryProducts =
    updateProductInArray(
      state.categoryProducts,
      product
    );

  state.searchResults =
    updateProductInArray(
      state.searchResults,
      product
    );

  state.featuredProducts =
    updateProductInArray(
      state.featuredProducts,
      product
    );

  state.publicFeaturedProducts =
    updateProductInArray(
      state.publicFeaturedProducts,
      product
    );

  if (
    state.selectedProduct
      ?._id ===
    product._id
  ) {
    state.selectedProduct = {
      ...state.selectedProduct,

      ...product,
    };
  }
};


const syncFeaturedProduct = (
  state,
  product
) => {
  if (!product?._id) {
    return;
  }

  if (
    product.isFeatured ===
    true
  ) {
    const existsFeatured =
      state.featuredProducts
        .some(
          (item) =>
            item?._id ===
            product._id
        );

    state.featuredProducts =
      addProductIfMissing(
        state.featuredProducts,
        product,
        state
          .featuredPagination
          .limit
      );

    if (
      !existsFeatured
    ) {
      state
        .featuredPagination
        .total += 1;

      state.featuredPagination =
        recalculatePagination(
          state
            .featuredPagination
        );
    }

    if (
      product.isActive ===
      true
    ) {
      const existsPublic =
        state
          .publicFeaturedProducts
          .some(
            (item) =>
              item?._id ===
              product._id
          );

      state
        .publicFeaturedProducts =
        addProductIfMissing(
          state
            .publicFeaturedProducts,
          product,
          state
            .publicFeaturedPagination
            .limit
        );

      if (
        !existsPublic
      ) {
        state
          .publicFeaturedPagination
          .total += 1;

        state
          .publicFeaturedPagination =
          recalculatePagination(
            state
              .publicFeaturedPagination
          );
      }
    } else {
      const existed =
        state
          .publicFeaturedProducts
          .some(
            (item) =>
              item?._id ===
              product._id
          );

      state
        .publicFeaturedProducts =
        removeProductFromArray(
          state
            .publicFeaturedProducts,
          product._id
        );

      if (
        existed &&
        state
          .publicFeaturedPagination
          .total > 0
      ) {
        state
          .publicFeaturedPagination
          .total -= 1;

        state
          .publicFeaturedPagination =
          recalculatePagination(
            state
              .publicFeaturedPagination
          );
      }
    }
  } else {
    const existedFeatured =
      state.featuredProducts
        .some(
          (item) =>
            item?._id ===
            product._id
        );

    const existedPublicFeatured =
      state
        .publicFeaturedProducts
        .some(
          (item) =>
            item?._id ===
            product._id
        );

    state.featuredProducts =
      removeProductFromArray(
        state.featuredProducts,
        product._id
      );

    state.publicFeaturedProducts =
      removeProductFromArray(
        state
          .publicFeaturedProducts,
        product._id
      );

    if (
      existedFeatured &&
      state
        .featuredPagination
        .total > 0
    ) {
      state
        .featuredPagination
        .total -= 1;

      state.featuredPagination =
        recalculatePagination(
          state
            .featuredPagination
        );
    }

    if (
      existedPublicFeatured &&
      state
        .publicFeaturedPagination
        .total > 0
    ) {
      state
        .publicFeaturedPagination
        .total -= 1;

      state
        .publicFeaturedPagination =
        recalculatePagination(
          state
            .publicFeaturedPagination
        );
    }
  }
};


const productSlice =
  createSlice({
    name:
      "products",

    initialState,

    reducers: {
      clearProductError: (
        state
      ) => {
        state.error =
          null;
      },


      clearProductSuccess: (
        state
      ) => {
        state.successMessage =
          null;
      },


      clearSelectedProduct: (
        state
      ) => {
        state.selectedProduct =
          null;

        state.detailsLoading =
          false;

        state.error =
          null;
      },


      clearCategoryProducts: (
        state
      ) => {
        state.categoryProducts =
          [];

        state.categoryPagination =
          createPagination();

        state.categoryLoading =
          false;

        state.error =
          null;
      },


      clearSearchResults: (
        state
      ) => {
        state.searchResults =
          [];

        state.searchPagination =
          createPagination();

        state.searchLoading =
          false;

        state.error =
          null;
      },


      clearFeaturedProducts: (
        state
      ) => {
        state.featuredProducts =
          [];

        state.featuredPagination =
          createPagination();

        state.featuredLoading =
          false;

        state.error =
          null;
      },


      clearPublicProducts: (
        state
      ) => {
        state.publicProducts =
          [];

        state.publicPagination =
          createPagination();

        state.publicLoading =
          false;
      },


      clearPublicFeaturedProducts: (
        state
      ) => {
        state.publicFeaturedProducts =
          [];

        state
          .publicFeaturedPagination =
          createPagination();

        state.publicFeaturedLoading =
          false;
      },


      resetProductState: () =>
        initialState,
    },


    extraReducers: (
      builder
    ) => {
      builder

        /*
        |--------------------------------------------------------------------------
        | Fetch Admin Products
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchProducts.pending,

          (state) => {
            state.loading =
              true;

            state.error =
              null;
          }
        )


        .addCase(
          fetchProducts.fulfilled,

          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.products =
              Array.isArray(
                action.payload
                  ?.products
              )
                ? action.payload
                    .products
                : [];

            state.pagination =
              getPagination(
                action.payload,

                state.products
                  .length
              );

            state.error =
              null;
          }
        )


        .addCase(
          fetchProducts.rejected,

          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.products =
              [];

            state.pagination =
              createPagination();

            state.error =
              action.payload ||
              "Unable to fetch products.";
          }
        )


        /*
        |--------------------------------------------------------------------------
        | Fetch Public Products
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchPublicProducts.pending,

          (state) => {
            state.publicLoading =
              true;

            state.error =
              null;
          }
        )


        .addCase(
          fetchPublicProducts.fulfilled,

          (
            state,
            action
          ) => {
            state.publicLoading =
              false;

            state.publicProducts =
              Array.isArray(
                action.payload
                  ?.products
              )
                ? action.payload
                    .products
                : [];

            state.publicPagination =
              getPagination(
                action.payload,

                state
                  .publicProducts
                  .length
              );

            state.error =
              null;
          }
        )


        .addCase(
          fetchPublicProducts.rejected,

          (
            state,
            action
          ) => {
            state.publicLoading =
              false;

            state.publicProducts =
              [];

            state.publicPagination =
              createPagination();

            state.error =
              action.payload ||
              "Unable to fetch public products.";
          }
        )


        /*
        |--------------------------------------------------------------------------
        | Fetch Product By ID
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchProductById.pending,

          (state) => {
            state.detailsLoading =
              true;

            state.selectedProduct =
              null;

            state.error =
              null;
          }
        )


        .addCase(
          fetchProductById.fulfilled,

          (
            state,
            action
          ) => {
            state.detailsLoading =
              false;

            state.selectedProduct =
              action.payload ||
              null;

            state.error =
              null;
          }
        )


        .addCase(
          fetchProductById.rejected,

          (
            state,
            action
          ) => {
            state.detailsLoading =
              false;

            state.selectedProduct =
              null;

            state.error =
              action.payload ||
              "Unable to fetch product.";
          }
        )


        /*
        |--------------------------------------------------------------------------
        | Fetch Product By Slug
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchProductBySlug.pending,

          (state) => {
            state.detailsLoading =
              true;

            state.selectedProduct =
              null;

            state.error =
              null;
          }
        )


        .addCase(
          fetchProductBySlug.fulfilled,

          (
            state,
            action
          ) => {
            state.detailsLoading =
              false;

            state.selectedProduct =
              action.payload ||
              null;

            state.error =
              null;
          }
        )


        .addCase(
          fetchProductBySlug.rejected,

          (
            state,
            action
          ) => {
            state.detailsLoading =
              false;

            state.selectedProduct =
              null;

            state.error =
              action.payload ||
              "Unable to fetch product.";
          }
        )


        /*
        |--------------------------------------------------------------------------
        | Products By Category
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchProductsByCategory
            .pending,

          (state) => {
            state.categoryLoading =
              true;

            state.error =
              null;
          }
        )


        .addCase(
          fetchProductsByCategory
            .fulfilled,

          (
            state,
            action
          ) => {
            state.categoryLoading =
              false;

            state.categoryProducts =
              Array.isArray(
                action.payload
                  ?.products
              )
                ? action.payload
                    .products
                : [];

            state.categoryPagination =
              getPagination(
                action.payload,

                state
                  .categoryProducts
                  .length
              );

            state.error =
              null;
          }
        )


        .addCase(
          fetchProductsByCategory
            .rejected,

          (
            state,
            action
          ) => {
            state.categoryLoading =
              false;

            state.categoryProducts =
              [];

            state.categoryPagination =
              createPagination();

            state.error =
              action.payload ||
              "Unable to fetch category products.";
          }
        )


        /*
        |--------------------------------------------------------------------------
        | Search Products
        |--------------------------------------------------------------------------
        */

        .addCase(
          searchProducts.pending,

          (state) => {
            state.searchLoading =
              true;

            state.error =
              null;
          }
        )


        .addCase(
          searchProducts.fulfilled,

          (
            state,
            action
          ) => {
            state.searchLoading =
              false;

            state.searchResults =
              Array.isArray(
                action.payload
                  ?.products
              )
                ? action.payload
                    .products
                : [];

            state.searchPagination =
              getPagination(
                action.payload,

                state.searchResults
                  .length
              );

            state.error =
              null;
          }
        )


        .addCase(
          searchProducts.rejected,

          (
            state,
            action
          ) => {
            state.searchLoading =
              false;

            state.searchResults =
              [];

            state.searchPagination =
              createPagination();

            state.error =
              action.payload ||
              "Unable to search products.";
          }
        )


        /*
        |--------------------------------------------------------------------------
        | Featured Products
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchFeaturedProducts
            .pending,

          (state) => {
            state.featuredLoading =
              true;

            state.error =
              null;
          }
        )


        .addCase(
          fetchFeaturedProducts
            .fulfilled,

          (
            state,
            action
          ) => {
            state.featuredLoading =
              false;

            state.featuredProducts =
              Array.isArray(
                action.payload
                  ?.products
              )
                ? action.payload
                    .products
                : [];

            state.featuredPagination =
              getPagination(
                action.payload,

                state
                  .featuredProducts
                  .length
              );

            state.error =
              null;
          }
        )


        .addCase(
          fetchFeaturedProducts
            .rejected,

          (
            state,
            action
          ) => {
            state.featuredLoading =
              false;

            state.featuredProducts =
              [];

            state.featuredPagination =
              createPagination();

            state.error =
              action.payload ||
              "Unable to fetch featured products.";
          }
        )


        /*
        |--------------------------------------------------------------------------
        | Public Featured Products
        |--------------------------------------------------------------------------
        */

        .addCase(
          fetchPublicFeaturedProducts
            .pending,

          (state) => {
            state.publicFeaturedLoading =
              true;

            state.error =
              null;
          }
        )


        .addCase(
          fetchPublicFeaturedProducts
            .fulfilled,

          (
            state,
            action
          ) => {
            state.publicFeaturedLoading =
              false;

            state.publicFeaturedProducts =
              Array.isArray(
                action.payload
                  ?.products
              )
                ? action.payload
                    .products
                : [];

            state
              .publicFeaturedPagination =
              getPagination(
                action.payload,

                state
                  .publicFeaturedProducts
                  .length
              );

            state.error =
              null;
          }
        )


        .addCase(
          fetchPublicFeaturedProducts
            .rejected,

          (
            state,
            action
          ) => {
            state.publicFeaturedLoading =
              false;

            state.publicFeaturedProducts =
              [];

            state
              .publicFeaturedPagination =
              createPagination();

            state.error =
              action.payload ||
              "Unable to fetch public featured products.";
          }
        )


        /*
        |--------------------------------------------------------------------------
        | Create Product
        |--------------------------------------------------------------------------
        */

        .addCase(
          createProduct.pending,

          (state) => {
            state.actionLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;
          }
        )


        .addCase(
          createProduct.fulfilled,

          (
            state,
            action
          ) => {
            state.actionLoading =
              false;

            const product =
              action.payload
                ?.product;

            if (
              product?._id
            ) {
              const exists =
                state.products
                  .some(
                    (item) =>
                      item?._id ===
                      product._id
                  );

              if (
                !exists
              ) {
                if (
                  state.pagination
                    .page === 1
                ) {
                  state.products =
                    addProductIfMissing(
                      state.products,

                      product,

                      state
                        .pagination
                        .limit
                    );
                }

                state.pagination
                  .total += 1;

                state.pagination =
                  recalculatePagination(
                    state.pagination
                  );
              }

              if (
                product.isActive ===
                true
              ) {
                const publicExists =
                  state
                    .publicProducts
                    .some(
                      (item) =>
                        item?._id ===
                        product._id
                    );

                if (
                  state
                    .publicPagination
                    .page === 1
                ) {
                  state.publicProducts =
                    addProductIfMissing(
                      state
                        .publicProducts,

                      product,

                      state
                        .publicPagination
                        .limit
                    );
                }

                if (
                  !publicExists
                ) {
                  state
                    .publicPagination
                    .total += 1;

                  state
                    .publicPagination =
                    recalculatePagination(
                      state
                        .publicPagination
                    );
                }
              }

              if (
                product.isFeatured ===
                true
              ) {
                syncFeaturedProduct(
                  state,
                  product
                );
              }
            }

            state.successMessage =
              action.payload
                ?.message ||
              "Product created successfully.";

            state.error =
              null;
          }
        )


        .addCase(
          createProduct.rejected,

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
              "Unable to create product.";
          }
        )


        /*
        |--------------------------------------------------------------------------
        | Update Product
        |--------------------------------------------------------------------------
        */

        .addCase(
          updateProduct.pending,

          (state) => {
            state.actionLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;
          }
        )


        .addCase(
          updateProduct.fulfilled,

          (
            state,
            action
          ) => {
            state.actionLoading =
              false;

            const product =
              action.payload
                ?.product;

            if (
              product?._id
            ) {
              syncProductEverywhere(
                state,
                product
              );

              syncFeaturedProduct(
                state,
                product
              );

              if (
                product.isActive ===
                false
              ) {
                const existedPublic =
                  state
                    .publicProducts
                    .some(
                      (item) =>
                        item?._id ===
                        product._id
                    );

                state.publicProducts =
                  removeProductFromArray(
                    state
                      .publicProducts,

                    product._id
                  );

                if (
                  existedPublic &&
                  state
                    .publicPagination
                    .total > 0
                ) {
                  state
                    .publicPagination
                    .total -= 1;

                  state
                    .publicPagination =
                    recalculatePagination(
                      state
                        .publicPagination
                    );
                }
              }
            }

            state.successMessage =
              action.payload
                ?.message ||
              "Product updated successfully.";

            state.error =
              null;
          }
        )


        .addCase(
          updateProduct.rejected,

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
              "Unable to update product.";
          }
        )


        /*
        |--------------------------------------------------------------------------
        | Product Status
        |--------------------------------------------------------------------------
        */

        .addCase(
          updateProductStatus.pending,

          (state) => {
            state.statusLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;
          }
        )


        .addCase(
          updateProductStatus.fulfilled,

          (
            state,
            action
          ) => {
            state.statusLoading =
              false;

            const {
              id,
              isActive,
              product,
              message,
            } =
              action.payload ||
              {};

            const existingProduct =
              state.products.find(
                (item) =>
                  item?._id ===
                  id
              );

            const updatedProduct =
              product?._id
                ? product
                : {
                    ...existingProduct,

                    _id:
                      id,

                    isActive,
                  };

            syncProductEverywhere(
              state,
              updatedProduct
            );

            if (
              updatedProduct
                .isActive ===
              false
            ) {
              const existedPublic =
                state
                  .publicProducts
                  .some(
                    (item) =>
                      item?._id ===
                      id
                  );

              state.publicProducts =
                removeProductFromArray(
                  state
                    .publicProducts,

                  id
                );

              if (
                existedPublic &&
                state
                  .publicPagination
                  .total > 0
              ) {
                state
                  .publicPagination
                  .total -= 1;

                state
                  .publicPagination =
                  recalculatePagination(
                    state
                      .publicPagination
                  );
              }

              const existedPublicFeatured =
                state
                  .publicFeaturedProducts
                  .some(
                    (item) =>
                      item?._id ===
                      id
                  );

              state
                .publicFeaturedProducts =
                removeProductFromArray(
                  state
                    .publicFeaturedProducts,

                  id
                );

              if (
                existedPublicFeatured &&
                state
                  .publicFeaturedPagination
                  .total > 0
              ) {
                state
                  .publicFeaturedPagination
                  .total -= 1;

                state
                  .publicFeaturedPagination =
                  recalculatePagination(
                    state
                      .publicFeaturedPagination
                  );
              }
            } else {
              if (
                updatedProduct
                  .isActive ===
                true
              ) {
                const existedPublic =
                  state
                    .publicProducts
                    .some(
                      (item) =>
                        item?._id ===
                        id
                    );

                if (
                  state
                    .publicPagination
                    .page === 1
                ) {
                  state.publicProducts =
                    addProductIfMissing(
                      state
                        .publicProducts,

                      updatedProduct,

                      state
                        .publicPagination
                        .limit
                    );
                }

                if (
                  !existedPublic
                ) {
                  state
                    .publicPagination
                    .total += 1;

                  state
                    .publicPagination =
                    recalculatePagination(
                      state
                        .publicPagination
                    );
                }

                if (
                  updatedProduct
                    .isFeatured ===
                  true
                ) {
                  syncFeaturedProduct(
                    state,
                    updatedProduct
                  );
                }
              }
            }

            state.successMessage =
              message ||
              (
                updatedProduct
                  .isActive
                  ? "Product activated successfully."
                  : "Product deactivated successfully."
              );

            state.error =
              null;
          }
        )


        .addCase(
          updateProductStatus.rejected,

          (
            state,
            action
          ) => {
            state.statusLoading =
              false;

            state.successMessage =
              null;

            state.error =
              action.payload ||
              "Unable to update product status.";
          }
        )


        /*
        |--------------------------------------------------------------------------
        | Featured Status
        |--------------------------------------------------------------------------
        */

        .addCase(
          updateProductFeatured.pending,

          (state) => {
            state.featuredActionLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;
          }
        )


        .addCase(
          updateProductFeatured.fulfilled,

          (
            state,
            action
          ) => {
            state.featuredActionLoading =
              false;

            const {
              id,
              isFeatured,
              product,
              message,
            } =
              action.payload ||
              {};

            const existingProduct =
              state.products.find(
                (item) =>
                  item?._id ===
                  id
              );

            const updatedProduct =
              product?._id
                ? product
                : {
                    ...existingProduct,

                    _id:
                      id,

                    isFeatured,
                  };

            syncProductEverywhere(
              state,
              updatedProduct
            );

            syncFeaturedProduct(
              state,
              updatedProduct
            );

            state.successMessage =
              message ||
              (
                updatedProduct
                  .isFeatured
                  ? "Product marked as featured."
                  : "Product removed from featured."
              );

            state.error =
              null;
          }
        )


        .addCase(
          updateProductFeatured.rejected,

          (
            state,
            action
          ) => {
            state.featuredActionLoading =
              false;

            state.successMessage =
              null;

            state.error =
              action.payload ||
              "Unable to update featured status.";
          }
        )


        /*
        |--------------------------------------------------------------------------
        | Stock
        |--------------------------------------------------------------------------
        */

        .addCase(
          updateProductStock.pending,

          (state) => {
            state.stockLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;
          }
        )


        .addCase(
          updateProductStock.fulfilled,

          (
            state,
            action
          ) => {
            state.stockLoading =
              false;

            const {
              id,
              stock,
              product,
              message,
            } =
              action.payload ||
              {};

            const existingProduct =
              state.products.find(
                (item) =>
                  item?._id ===
                  id
              );

            const updatedProduct =
              product?._id
                ? product
                : {
                    ...existingProduct,

                    _id:
                      id,

                    stock,
                  };

            syncProductEverywhere(
              state,
              updatedProduct
            );

            state.successMessage =
              message ||
              "Product stock updated successfully.";

            state.error =
              null;
          }
        )


        .addCase(
          updateProductStock.rejected,

          (
            state,
            action
          ) => {
            state.stockLoading =
              false;

            state.successMessage =
              null;

            state.error =
              action.payload ||
              "Unable to update product stock.";
          }
        )


        .addCase(
  importProductsExcel.pending,

  (state) => {

    state.importLoading = true;

    state.error = null;

    state.successMessage = null;

  }
).addCase(
  importProductsExcel.fulfilled,

  (state, action) => {

    state.importLoading = false;

    state.successMessage =
      action.payload?.message ||
      "Products imported successfully.";

    state.error = null;

  }
).addCase(
  importProductsExcel.rejected,

  (state, action) => {

    state.importLoading = false;

    state.successMessage = null;

    state.error =
      action.payload ||
      "Unable to import products.";

  }
).addCase(
  exportProductsExcel.pending,

  (state) => {

    state.exportLoading = true;

    state.error = null;

  }
).addCase(
  exportProductsExcel.fulfilled,

  (state) => {

    state.exportLoading = false;

    state.error = null;

  }
).addCase(
  exportProductsExcel.rejected,

  (state, action) => {

    state.exportLoading = false;

    state.error =
      action.payload ||
      "Unable to export products.";

  }
)


        /*
        |--------------------------------------------------------------------------
        | Delete Product
        |--------------------------------------------------------------------------
        */

        .addCase(
          deleteProduct.pending,

          (state) => {
            state.actionLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;
          }
        )


        .addCase(
          deleteProduct.fulfilled,

          (
            state,
            action
          ) => {
            state.actionLoading =
              false;

            const deletedId =
              action.payload?.id;

            if (
              !deletedId
            ) {
              state.error =
                null;

              return;
            }

            const existedInProducts =
              state.products.some(
                (product) =>
                  product?._id ===
                  deletedId
              );

            const existedInPublic =
              state.publicProducts
                .some(
                  (product) =>
                    product?._id ===
                    deletedId
                );

            const existedInCategory =
              state.categoryProducts
                .some(
                  (product) =>
                    product?._id ===
                    deletedId
                );

            const existedInSearch =
              state.searchResults
                .some(
                  (product) =>
                    product?._id ===
                    deletedId
                );

            const existedInFeatured =
              state.featuredProducts
                .some(
                  (product) =>
                    product?._id ===
                    deletedId
                );

            const existedInPublicFeatured =
              state
                .publicFeaturedProducts
                .some(
                  (product) =>
                    product?._id ===
                    deletedId
                );

            state.products =
              removeProductFromArray(
                state.products,

                deletedId
              );

            state.publicProducts =
              removeProductFromArray(
                state.publicProducts,

                deletedId
              );

            state.categoryProducts =
              removeProductFromArray(
                state.categoryProducts,

                deletedId
              );

            state.searchResults =
              removeProductFromArray(
                state.searchResults,

                deletedId
              );

            state.featuredProducts =
              removeProductFromArray(
                state.featuredProducts,

                deletedId
              );

            state.publicFeaturedProducts =
              removeProductFromArray(
                state
                  .publicFeaturedProducts,

                deletedId
              );

            if (
              existedInProducts &&
              state.pagination
                .total > 0
            ) {
              state.pagination
                .total -= 1;

              state.pagination =
                recalculatePagination(
                  state.pagination
                );
            }

            if (
              existedInPublic &&
              state
                .publicPagination
                .total > 0
            ) {
              state
                .publicPagination
                .total -= 1;

              state.publicPagination =
                recalculatePagination(
                  state
                    .publicPagination
                );
            }

            if (
              existedInCategory &&
              state
                .categoryPagination
                .total > 0
            ) {
              state
                .categoryPagination
                .total -= 1;

              state.categoryPagination =
                recalculatePagination(
                  state
                    .categoryPagination
                );
            }

            if (
              existedInSearch &&
              state
                .searchPagination
                .total > 0
            ) {
              state
                .searchPagination
                .total -= 1;

              state.searchPagination =
                recalculatePagination(
                  state
                    .searchPagination
                );
            }

            if (
              existedInFeatured &&
              state
                .featuredPagination
                .total > 0
            ) {
              state
                .featuredPagination
                .total -= 1;

              state.featuredPagination =
                recalculatePagination(
                  state
                    .featuredPagination
                );
            }

            if (
              existedInPublicFeatured &&
              state
                .publicFeaturedPagination
                .total > 0
            ) {
              state
                .publicFeaturedPagination
                .total -= 1;

              state
                .publicFeaturedPagination =
                recalculatePagination(
                  state
                    .publicFeaturedPagination
                );
            }

            if (
              state.selectedProduct
                ?._id ===
              deletedId
            ) {
              state.selectedProduct =
                null;
            }

            state.successMessage =
              action.payload
                ?.message ||
              "Product deleted successfully.";

            state.error =
              null;
          }
        )


        .addCase(
          deleteProduct.rejected,

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
              "Unable to delete product.";
          }
        );
    },
  });


export const {
  clearProductError,
  clearProductSuccess,
  clearSelectedProduct,
  clearCategoryProducts,
  clearSearchResults,
  clearFeaturedProducts,
  clearPublicProducts,
  clearPublicFeaturedProducts,
  resetProductState,
} =
  productSlice.actions;


/*
|--------------------------------------------------------------------------
| Data Selectors
|--------------------------------------------------------------------------
*/

export const selectProducts = (
  state
) =>
  state.products
    ?.products ||
  [];


export const selectPublicProducts = (
  state
) =>
  state.products
    ?.publicProducts ||
  [];


export const selectSelectedProduct = (
  state
) =>
  state.products
    ?.selectedProduct ||
  null;


export const selectCategoryProducts = (
  state
) =>
  state.products
    ?.categoryProducts ||
  [];


export const selectFeaturedProducts = (
  state
) =>
  state.products
    ?.featuredProducts ||
  [];


export const selectPublicFeaturedProducts = (
  state
) =>
  state.products
    ?.publicFeaturedProducts ||
  [];


export const selectSearchResults = (
  state
) =>
  state.products
    ?.searchResults ||
  [];


/*
|--------------------------------------------------------------------------
| Pagination Selector Helper
|--------------------------------------------------------------------------
*/

const selectPagination = (
  pagination
) => ({
  page:
    pagination?.page ||
    1,

  limit:
    pagination?.limit ||
    10,

  total:
    pagination?.total ||
    0,

  totalProducts:
    pagination
      ?.totalProducts ||
    pagination?.total ||
    0,

  totalPages:
    pagination
      ?.totalPages ||
    1,

  /*
  |--------------------------------------------------------------------------
  | Backward Compatibility
  |--------------------------------------------------------------------------
  */

  pages:
    pagination
      ?.totalPages ||
    1,

  hasNextPage:
    Boolean(
      pagination
        ?.hasNextPage
    ),

  hasPreviousPage:
    Boolean(
      pagination
        ?.hasPreviousPage
    ),
});


/*
|--------------------------------------------------------------------------
| Pagination Selectors
|--------------------------------------------------------------------------
*/

export const selectProductsPagination = (
  state
) =>
  selectPagination(
    state.products
      ?.pagination
  );


export const selectPublicProductsPagination = (
  state
) =>
  selectPagination(
    state.products
      ?.publicPagination
  );


export const selectCategoryPagination = (
  state
) =>
  selectPagination(
    state.products
      ?.categoryPagination
  );


export const selectSearchPagination = (
  state
) =>
  selectPagination(
    state.products
      ?.searchPagination
  );


export const selectFeaturedPagination = (
  state
) =>
  selectPagination(
    state.products
      ?.featuredPagination
  );


export const selectPublicFeaturedPagination = (
  state
) =>
  selectPagination(
    state.products
      ?.publicFeaturedPagination
  );


/*
|--------------------------------------------------------------------------
| Loading Selectors
|--------------------------------------------------------------------------
*/

export const selectProductsLoading = (
  state
) =>
  Boolean(
    state.products
      ?.loading
  );


export const selectPublicProductsLoading = (
  state
) =>
  Boolean(
    state.products
      ?.publicLoading
  );


export const selectProductDetailsLoading = (
  state
) =>
  Boolean(
    state.products
      ?.detailsLoading
  );


export const selectCategoryProductsLoading = (
  state
) =>
  Boolean(
    state.products
      ?.categoryLoading
  );


export const selectSearchProductsLoading = (
  state
) =>
  Boolean(
    state.products
      ?.searchLoading
  );


export const selectFeaturedProductsLoading = (
  state
) =>
  Boolean(
    state.products
      ?.featuredLoading
  );


export const selectPublicFeaturedLoading = (
  state
) =>
  Boolean(
    state.products
      ?.publicFeaturedLoading
  );


export const selectProductActionLoading = (
  state
) =>
  Boolean(
    state.products
      ?.actionLoading
  );

  export const selectImportLoading = (
  state
) =>
  Boolean(
    state.products
      ?.importLoading
  );

export const selectExportLoading = (
  state
) =>
  Boolean(
    state.products
      ?.exportLoading
  );


export const selectProductStatusLoading = (
  state
) =>
  Boolean(
    state.products
      ?.statusLoading
  );


export const selectProductFeaturedActionLoading = (
  state
) =>
  Boolean(
    state.products
      ?.featuredActionLoading
  );


export const selectProductStockLoading = (
  state
) =>
  Boolean(
    state.products
      ?.stockLoading
  );


/*
|--------------------------------------------------------------------------
| Error / Success Selectors
|--------------------------------------------------------------------------
*/

export const selectProductError = (
  state
) =>
  state.products
    ?.error ||
  null;


export const selectProductSuccessMessage = (
  state
) =>
  state.products
    ?.successMessage ||
  null;


/*
|--------------------------------------------------------------------------
| Total Selectors
|--------------------------------------------------------------------------
*/

export const selectTotalProducts = (
  state
) =>
  state.products
    ?.pagination
    ?.totalProducts ??
  state.products
    ?.pagination
    ?.total ??
  state.products
    ?.products
    ?.length ??
  0;


export const selectTotalPublicProducts = (
  state
) =>
  state.products
    ?.publicPagination
    ?.totalProducts ??
  state.products
    ?.publicPagination
    ?.total ??
  state.products
    ?.publicProducts
    ?.length ??
  0;


export default productSlice.reducer;