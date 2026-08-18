import { createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "../../services/paymentService.js";

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