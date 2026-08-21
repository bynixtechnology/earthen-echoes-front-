import axios from "axios";
import { PAYMENT_ENDPOINTS } from "../constants/endpoints/paymentEndpoints.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Helper function to retrieve headers with Authorization Bearer token
 */
const getAuthConfig = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("userToken");

  return {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  };
};

/**
 * CREATE RAZORPAY ORDER
 * POST /api/payment/create-order
 */
const createRazorpayOrder = async (amount) => {
  const response = await axios.post(
    `${BASE_URL}${PAYMENT_ENDPOINTS.CREATE_ORDER}`,
    { amount: Number(amount) },
    getAuthConfig()
  );
  return response.data;
};

/**
 * VERIFY RAZORPAY PAYMENT
 * POST /api/payment/verify-payment
 */
const verifyRazorpayPayment = async (paymentData) => {
  const response = await axios.post(
    `${BASE_URL}${PAYMENT_ENDPOINTS.VERIFY_PAYMENT}`,
    paymentData,
    getAuthConfig()
  );
  return response.data;
};

/**
 * CREATE CASH ON DELIVERY (COD) ORDER
 * POST /api/payment/cod-order
 */
const createCodOrder = async (orderData) => {
  const response = await axios.post(
    `${BASE_URL}${PAYMENT_ENDPOINTS.COD_ORDER}`,
    orderData,
    getAuthConfig()
  );
  return response.data;
};

const paymentService = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createCodOrder,
};

export default paymentService;