export const PRODUCT_TAG_ENDPOINTS = {
  GET_ALL: "/v1/product-tags",
  CREATE: "/v1/product-tags",
  GET_BY_ID: (id) => `/v1/product-tags/${id}`,
  UPDATE: (id) => `/v1/product-tags/${id}`,
  DELETE: (id) => `/v1/product-tags/${id}`,
};