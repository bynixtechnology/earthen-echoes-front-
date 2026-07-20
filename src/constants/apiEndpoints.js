export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
  },

  PRODUCT: {
    GET_ALL: "/products",
    GET_BY_ID: (id) => `/products/${id}`,


    GET_BY_CATEGORY: (categoryId) => `/categories/${categoryId}`,

    CREATE: "/products",
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
  },

  CATEGORY: {
    CREATE: "/categories",
    GET_ALL: "/categories",
    GET_BY_ID: (id) => `/categories/${id}`,
  },
  CART: {
    ADD: "/users/cart", 
  },
};