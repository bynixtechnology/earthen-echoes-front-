import api from "../config/axiosInstance";

import {
  WISHLIST_ENDPOINTS,
} from "../constants/endpoints";

/*
|--------------------------------------------------------------------------
| Get Logged In User Wishlist
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
| Add / Remove Wishlist (Toggle)
|--------------------------------------------------------------------------
*/

export const toggleWishlist = async (
  productId
) => {
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
| Clear Wishlist
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
| Wishlist Service
|--------------------------------------------------------------------------
*/

const wishlistService = {
  getWishlist,
  toggleWishlist,
  clearWishlist,
};

export default wishlistService;