import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProductTagService } from "../../services/productTagService";

export const fetchProductTags = createAsyncThunk(
  "productTags/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ProductTagService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tags");
    }
  }
);

export const createProductTag = createAsyncThunk(
  "productTags/create",
  async (tagData, { rejectWithValue }) => {
    try {
      const response = await ProductTagService.create(tagData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create tag");
    }
  }
);

export const updateProductTag = createAsyncThunk(
  "productTags/update",
  async ({ id, tagData }, { rejectWithValue }) => {
    try {
      const response = await ProductTagService.update(id, tagData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update tag");
    }
  }
);

export const deleteProductTag = createAsyncThunk(
  "productTags/delete",
  async (id, { rejectWithValue }) => {
    try {
      await ProductTagService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete tag");
    }
  }
);