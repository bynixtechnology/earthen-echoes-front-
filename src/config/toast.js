import toast from "react-hot-toast";

const toastOptions = {
  duration: 3000,
  style: {
    background: "#1e293b", 
    color: "#ffffff",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500",
  },
};

export const showToast = {
  success: (message) => toast.success(message, { ...toastOptions }),
  error: (message) => toast.error(message, { ...toastOptions }),
  loading: (message) => toast.loading(message, { ...toastOptions }),
  dismiss: (toastId) => toast.dismiss(toastId),
};