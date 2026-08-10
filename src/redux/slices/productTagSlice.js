import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProductTags,
  createProductTag,
  updateProductTag,
  deleteProductTag,
} from "../thunks/productTagThunk";

const initialState = {
  tags: [],
  loading: false,
  error: null,
};

const productTagSlice = createSlice({
  name: "productTags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Tags
      .addCase(fetchProductTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchProductTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Tag
      .addCase(createProductTag.fulfilled, (state, action) => {
        state.tags.unshift(action.payload);
      })

      // Update Tag
      .addCase(updateProductTag.fulfilled, (state, action) => {
        const index = state.tags.findIndex((t) => t.id === action.payload.id || t._id === action.payload._id);
        if (index !== -1) {
          state.tags[index] = action.payload;
        }
      })

      // Delete Tag
      .addCase(deleteProductTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter(
          (t) => t.id !== action.payload && t._id !== action.payload
        );
      });
  },
});

export default productTagSlice.reducer;