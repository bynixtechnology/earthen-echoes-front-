import { createSlice } from "@reduxjs/toolkit";
import {
  createPaymentOrder,
  verifyPayment,
  placeCodOrder,
} from "../thunks/paymentThunk.js";

const initialState = {
  loading: false,
  orderData: null,
  isVerified: false,
  isCodSuccess: false,
  lastPlacedOrder: null,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.orderData = null;
      state.isVerified = false;
      state.isCodSuccess = false;
      state.lastPlacedOrder = null;
      state.error = null;
    },
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /*
      |--------------------------------------------------------------------------
      | CREATE RAZORPAY PAYMENT ORDER
      |--------------------------------------------------------------------------
      */
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /*
      |--------------------------------------------------------------------------
      | VERIFY RAZORPAY PAYMENT
      |--------------------------------------------------------------------------
      */
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.isVerified = true;
        state.lastPlacedOrder = action.payload?.order || null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isVerified = false;
      })

      /*
      |--------------------------------------------------------------------------
      | CASH ON DELIVERY (COD) ORDER
      |--------------------------------------------------------------------------
      */
      .addCase(placeCodOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isCodSuccess = false;
      })
      .addCase(placeCodOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.isCodSuccess = true;
        state.lastPlacedOrder = action.payload?.order || null;
      })
      .addCase(placeCodOrder.rejected, (state, action) => {
        state.loading = false;
        state.isCodSuccess = false;
        state.error = action.payload;
      });
  },
});

/*
|--------------------------------------------------------------------------
| Actions & Selectors
|--------------------------------------------------------------------------
*/
export const { resetPaymentState, clearPaymentError } = paymentSlice.actions;

export const selectPaymentLoading = (state) => state.payment.loading;
export const selectPaymentOrderData = (state) => state.payment.orderData;
export const selectPaymentVerified = (state) => state.payment.isVerified;
export const selectCodSuccess = (state) => state.payment.isCodSuccess;
export const selectLastPlacedOrder = (state) => state.payment.lastPlacedOrder;
export const selectPaymentError = (state) => state.payment.error;

export default paymentSlice.reducer;