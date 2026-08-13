import api from "../config/axiosInstance";
import { WISHLIST_ENDPOINTS } from "../constants/endpoints";

/*
|--------------------------------------------------------------------------
| Get Wishlist (Logged-in & Guest)
|--------------------------------------------------------------------------
*/
export const getWishlist = async () => {
  const { data } = await api.get(
    WISHLIST_ENDPOINTS.GET
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| Add / Remove Wishlist Item (Toggle)
|--------------------------------------------------------------------------
*/
export const toggleWishlist = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required.");
  }

  const { data } = await api.post(
    WISHLIST_ENDPOINTS.TOGGLE,
    {
      productId,
    }
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| Remove Single Item From Wishlist
|--------------------------------------------------------------------------
*/
export const removeFromWishlist = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required.");
  }

  const cleanProductId = String(productId).trim();
  const endpoint =
    typeof WISHLIST_ENDPOINTS.REMOVE === "function"
      ? WISHLIST_ENDPOINTS.REMOVE(cleanProductId)
      : `/wishlist/remove/${cleanProductId}`;

  const { data } = await api.delete(endpoint);

  return data;
};

/*
|--------------------------------------------------------------------------
| Clear Complete Wishlist
|--------------------------------------------------------------------------
*/
export const clearWishlist = async () => {
  const { data } = await api.delete(
    WISHLIST_ENDPOINTS.CLEAR
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| Merge Guest Wishlist After Login
|--------------------------------------------------------------------------
*/
export const mergeGuestWishlist = async () => {
  const { data } = await api.post(
    WISHLIST_ENDPOINTS.MERGE || "/wishlist/merge"
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| Prepare Wishlist For Logout
|--------------------------------------------------------------------------
| Preserves User.wishlist into GuestWishlist session cookie before logout
|--------------------------------------------------------------------------
*/
export const prepareWishlistForLogout = async () => {
  const { data } = await api.post(
    WISHLIST_ENDPOINTS.PREPARE_LOGOUT || "/wishlist/prepare-logout"
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| Wishlist Service Export Object
|--------------------------------------------------------------------------
*/
const wishlistService = {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
  mergeGuestWishlist,
  prepareWishlistForLogout,
};

export default wishlistService;