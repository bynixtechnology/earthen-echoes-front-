export const CATEGORY_ENDPOINTS = {
  GET_ALL: "/categories",

  GET_BY_ID: (id) =>
    `/categories/${id}`,

  CREATE: "/categories",

  UPDATE: (id) =>
    `/categories/${id}`,

  DELETE: (id) =>
    `/categories/${id}`,
};