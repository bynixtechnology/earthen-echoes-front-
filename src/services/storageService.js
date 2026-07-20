export const StorageService = {
  setToken: (token) => {
    if (!token) return;
    
    localStorage.setItem("adminToken", token);
  },

  getToken: () => {
    return localStorage.getItem("adminToken");
  },

  clearSession: () => {
    localStorage.removeItem("adminToken");
    
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("adminToken");
    
    return !!token;
  }
};