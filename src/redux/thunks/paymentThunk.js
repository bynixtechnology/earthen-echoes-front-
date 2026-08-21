import { createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "../../services/paymentService.js";

/*
|--------------------------------------------------------------------------
| CREATE RAZORPAY PAYMENT ORDER
|--------------------------------------------------------------------------
*/
export const createPaymentOrder = createAsyncThunk(
  "payment/createOrder",
  async (amount, { rejectWithValue }) => {
    try {
      return await paymentService.createRazorpayOrder(amount);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Order create karne me dikkat aayi"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| VERIFY RAZORPAY PAYMENT & CREATE ORDER
|--------------------------------------------------------------------------
*/
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      return await paymentService.verifyRazorpayPayment(paymentData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Payment verify nahi ho paya"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| CREATE CASH ON DELIVERY (COD) ORDER
|--------------------------------------------------------------------------
*/
export const placeCodOrder = createAsyncThunk(
  "payment/placeCodOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      return await paymentService.createCodOrder(orderData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "COD order place karne me dikkat aayi"
      );
    }
  }
);