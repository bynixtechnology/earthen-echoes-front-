export const PRODUCT_ENDPOINTS = {
  GET_ALL: "/products",

  GET_PUBLIC: "/products/public",

  GET_BY_ID: (id) =>
    `/products/${id}`,

  GET_BY_SLUG: (slug) =>
    `/products/slug/${slug}`,

  GET_BY_CATEGORY: (categoryId) =>
    `/products?category=${categoryId}`,

  SEARCH: "/products",

  GET_FEATURED: "/products?isFeatured=true",

  GET_PUBLIC_FEATURED:
    "/products/public?isFeatured=true",

  CREATE: "/products",

  IMPORT_EXCEL:
  "/products/import/excel",

 EXPORT_EXCEL:
  "/products/export/excel",

  UPDATE: (id) =>
    `/products/${id}`,

  UPDATE_STATUS: (id) =>
    `/products/${id}/status`,

  UPDATE_FEATURED: (id) =>
    `/products/${id}/featured`,

  DELETE: (id) =>
    `/products/${id}`,
};

export default PRODUCT_ENDPOINTS;