export const CATEGORY_ENDPOINTS = {
  // Get Categories
  GET_ALL: "/categories",

  GET_BY_ID: (id) => `/categories/${id}`,

  GET_BY_SLUG: (slug) => `/categories/slug/${slug}`,

  GET_PRODUCTS: (id) => `/categories/${id}/products`,

  // Create Category
  CREATE: "/categories",

  // Update Category Details & Image
  UPDATE: (id) => `/categories/${id}`,

  // Update Category Active Status
  UPDATE_STATUS: (id) => `/categories/${id}/status`,

  // Update Category Featured Status
  UPDATE_FEATURED: (id) => `/categories/${id}/featured`,

  // Delete Category
  DELETE: (id) => `/categories/${id}`,

  // Export Categories to Excel
  EXPORT_EXCEL: "/categories/export/excel",

  // Import Categories from Excel
  IMPORT_EXCEL: "/categories/import/excel",
};