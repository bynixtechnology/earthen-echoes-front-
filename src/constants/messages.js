export const FRONTEND_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Admin authenticated successfully! Welcome back.",
    LOGIN_FAILED: "Invalid credentials. Please verify your username and password.",
    LOGOUT: "Logged out successfully from session.",
    UNAUTHORIZED: "Session expired or invalid. Please login again."
  },
  PRODUCT: {
    CREATE_SUCCESS: "Premium product deployed successfully to database!",
    CREATE_FAILED: "Failed to upload product. Check field formats.",
    DELETE_SUCCESS: "Product removed from catalog successfully.",
    DELETE_FAILED: "Failed to delete the selected product.",
    FETCH_FAILED: "Error fetching catalog data from backend."
  },
  CATEGORY: {
    NOT_FOUND: "The requested category could not be found.",
    FETCH_SUCCESS: "Categories retrieved successfully.",
    FETCH_ERROR: "Failed to retrieve categories from the database.",
    CREATED: "Category created successfully.",
    ALREADY_EXISTS: "This category name already exists in the database.",
    UPDATED: "Category updated successfully.",
    DELETED: "Category deleted successfully.",
  },
};