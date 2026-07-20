import axiosInstance from "../config/axiosInstance";
import { API_ENDPOINTS } from "../constants/apiEndpoints";


export const AuthService = {
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  }
};



export const ProductService = {
  getAll: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT.GET_ALL);
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT.GET_BY_ID(id));
    return response.data;
  },


  create: async (formData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PRODUCT.CREATE, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },


  createWithProgress: async (formData, onProgressCallback) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PRODUCT.CREATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const total = progressEvent.total;
        if (total) {
          const percentage = Math.round((progressEvent.loaded * 100) / total);
          onProgressCallback(percentage);
        }
      }
    });
    return response.data;
  },

update: async (id, data) => {
    
    const isFormData = data instanceof FormData;
    const res = await axiosInstance.put(API_ENDPOINTS.PRODUCT.UPDATE(id), data, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
    return res.data;
  },

delete: async (id) => {
    const res = await axiosInstance.delete(API_ENDPOINTS.PRODUCT.DELETE(id));
    return res.data;
  }


  
};






export const CategoryService = {
  create: async (formData) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.CATEGORY.CREATE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
},

  getAll: async () => {
    const response = await axiosInstance.get("/categories");
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },
};