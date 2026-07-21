export const PRODUCT_ENDPOINTS = {
  GET_ALL: "/products",

  GET_BY_ID: (id) =>
    `/products/${id}`,

  GET_BY_CATEGORY: (categoryId) =>
    `/products?category=${categoryId}`,

  CREATE: "/products",

  UPDATE: (id) =>
    `/products/${id}`,

  DELETE: (id) =>
    `/products/${id}`,
};