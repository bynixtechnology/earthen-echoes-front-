import React, {
  useEffect,
} from "react";

import { Link } from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  ShoppingCart,
  Heart,
  Loader2,
} from "lucide-react";

import {
  getWishlist,
  toggleWishlist,
} from "../../../redux/thunks/wishlistThunk";

import {
  addProductToCart,
} from "../../../redux/thunks/cartThunk";

import {
  selectWishlistItems,
  selectWishlistLoading,
} from "../../../redux/slices/wishlistSlice";

import { showToast } from "../../../config/toast";


export default function WishlistPage() {
  const dispatch = useDispatch();

  const wishlist =
    useSelector(
      selectWishlistItems
    ) || [];

  const loading =
    useSelector(
      selectWishlistLoading
    );

  useEffect(() => {

    dispatch(
      getWishlist()
    );

  }, [dispatch]);


  const handleRemove =
    async (productId) => {

      try {

        const response =
          await dispatch(
            toggleWishlist(productId)
          ).unwrap();

        showToast.success(
          response.message
        );

      } catch (error) {

        showToast.error(
          error.message
        );

      }

    };

  const handleAddToCart =
    async (productId) => {

      try {

        const response =
          await dispatch(
            addProductToCart({
              productId,
              quantity: 1,
            })
          ).unwrap();

        showToast.success(
          response.message
        );

      } catch (error) {

        showToast.error(
          error.message
        );

      }

    };

  if (loading) {

    return (

      <div className="min-h-[400px] flex items-center justify-center">

        <Loader2
          className="animate-spin"
          size={35}
        />

      </div>

    );

  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Wishlist ❤️</h1>
        <p className="text-gray-500 mt-2">
          Save your favourite products and move them to cart anytime.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="border rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-semibold mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Browse products and add your favourites.
          </p>

          <Link
            to="/products"
            className="inline-flex rounded-lg bg-black text-white px-6 py-3"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              
              key={
                item.productId?._id
              }
              className="border rounded-xl overflow-hidden shadow-sm"
            >
              <Link to={`/products/${item.productId?._id}`}>
              <img
                src={
                  item.productId?.images?.[0]?.url ||
                  item.productId?.images?.[0] ||
                  "/placeholder.png"
                }
                alt={item.productId?.title}
                className="aspect-square w-full object-cover"
              />
              </Link>

              <div className="p-5">
                <h3 className="font-semibold text-lg">
                  {item.title}
                </h3>

                <p className="mt-2 font-bold">
                  ₹{item.productId?.price}
                </p>

                <div className="flex gap-3 mt-5">
                  <button
                    className="flex-1 rounded-lg bg-black text-white py-2"
                    onClick={() =>
                      handleAddToCart(
                        item.productId._id
                      )
                    }
                  >

                    Add To Cart

                  </button>

                  <button
                    className="rounded-lg border px-4 py-2"
                    onClick={() =>
                      handleRemove(
                        item.productId._id
                      )
                    }
                  >

                    <Heart
                      size={16}
                      className="inline mr-2 text-red-500"
                    />

                    Remove

                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
