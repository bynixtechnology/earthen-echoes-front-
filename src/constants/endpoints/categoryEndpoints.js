export const CATEGORY_ENDPOINTS = {
  // Get Categories
  GET_ALL: "/categories",

  GET_BY_ID: (id) =>
    `/categories/${id}`,

  GET_BY_SLUG: (slug) =>
    `/categories/slug/${slug}`,

  GET_PRODUCTS: (id) =>
    `/categories/${id}/products`,

  // Create Category
  CREATE: "/categories",

  // Update Category
  UPDATE: (id) =>
    `/categories/${id}`,

  // Update Status
  UPDATE_STATUS: (id) =>
    `/categories/${id}/status`,

  // Delete Category
  DELETE: (id) =>
    `/categories/${id}`,

  // Export Categories Excel
  EXPORT_EXCEL:
    "/categories/export/excel",

  // Import Categories Excel
  IMPORT_EXCEL:
    "/categories/import/excel",
};