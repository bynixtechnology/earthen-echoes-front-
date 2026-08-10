import axiosInstance from "../config/axiosInstance";
import { PRODUCT_TAG_ENDPOINTS } from "../constants/endpoints/productTagEndpoints";

export const ProductTagService = {
  getAll: async () => {
    const response = await axiosInstance.get(PRODUCT_TAG_ENDPOINTS.GET_ALL);
    return response.data;
  },

  create: async (tagData) => {
    const response = await axiosInstance.post(PRODUCT_TAG_ENDPOINTS.CREATE, tagData);
    return response.data;
  },

  update: async (id, tagData) => {
    const response = await axiosInstance.patch(PRODUCT_TAG_ENDPOINTS.UPDATE(id), tagData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(PRODUCT_TAG_ENDPOINTS.DELETE(id));
    return response.data;
  },
};