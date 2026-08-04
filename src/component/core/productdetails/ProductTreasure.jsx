// import React, { useEffect, useState } from "react";
// import { Heart } from "lucide-react";
// import { Link } from "react-router-dom";
// import axiosInstance from "../../../config/axiosInstance";
// import { API_ENDPOINTS } from "../../../constants/endpoints/productEndpoints";
// import { useCart } from "../../core/context/CartContext";



// const ProductTreasure = ({ categoryId }) => {
//   const { addToCart } = useCart();
//   const { updateCartCount } = useCart();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (categoryId) {
//       getProductsByCategory();
//     }
//   }, [categoryId]);

//  const handleAddToCart = async () => {
//     try {

//       setIsAdding(true);
//       addToCart(product, quantity);

//    const res = await axiosInstance.post(API_ENDPOINTS.CART.ADD, {
//         productId: product._id,
//         quantity: quantity
//       }); 


//       if(res.data.cart) {
//          updateCartCount(res.data.cart.length); 
//       } else {


//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);

//     } finally {
//       setIsAdding(false);
//     }
//   };
//   const getProductsByCategory = async () => {
//     try {
//       setLoading(true);

//       const res = await axiosInstance.get(
//         API_ENDPOINTS.PRODUCT.GET_BY_CATEGORY(categoryId)
//       );

//       // console.log(res.data);

//       setProducts(res.data.data.products || []);

//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <section className="py-16 bg-muted/20 border-t border-border/40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
//         <div>
//           <h2 className="text-2xl font-heading font-bold text-foreground mb-8">

//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             {products.slice(0, 4).map((product) => (
//               <Link
//                 key={product.id}
//               to={`/products/${product._id}`}
//                 className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-border/40"
//               >
//                 <div className="relative overflow-hidden aspect-square bg-muted">
//                   <img
//                     src={product.images?.[0] || "/placeholder.png"}
//                     alt={product.title}
//                   />

//                   <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-primary shadow">
//                     <Heart size={16} />
//                   </button>
//                 </div>

//                 <div className="p-5 flex-1 flex flex-col justify-between">
//                   <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary mb-1">
//                     {product.title}
//                   </h3>

//                   <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-2">
//                     <span className="font-heading text-base font-bold text-primary">
//                       {product.price}
//                     </span>

//                     <button  onClick={handleAddToCart}   className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90">
//                       Add
//                     </button>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>

//       </div>
//     </section>

//   )
// }

// export default ProductTreasure





import React, {
  useEffect,
} from "react";

import {
  Heart,
  Loader2,
  ShoppingCart,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchProductsByCategory,
} from "../../../redux/thunks/productThunk";

import {
  clearCategoryProducts,
} from "../../../redux/slices/productSlice";

import {
  useCart,
} from "../../core/context/CartContext";

const ProductTreasure = ({
  categoryId,
}) => {
  /*
  |--------------------------------------------------------------------------
  | Redux
  |--------------------------------------------------------------------------
  */

  const dispatch =
    useDispatch();

  const {
    categoryProducts = [],
    categoryLoading = false,
    error = null,
  } = useSelector(
    (state) =>
      state.products || {}
  );

  /*
  |--------------------------------------------------------------------------
  | Cart
  |--------------------------------------------------------------------------
  */

  const {
    addToCart,
  } = useCart();

  /*
  |--------------------------------------------------------------------------
  | Fetch Products By Category
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    console.log("=================================");
    console.log("ProductTreasure Loaded");
    console.log("Category ID =>", categoryId);

    if (!categoryId) {
      console.log("Category ID Empty");
      dispatch(clearCategoryProducts());
      return;
    }

    console.log("Dispatching fetchProductsByCategory");

    dispatch(
      fetchProductsByCategory({
        categoryId,
      })
    );
  }, [categoryId, dispatch]);
  /*
  |--------------------------------------------------------------------------
  | Add To Cart
  |--------------------------------------------------------------------------
  */

  const handleAddToCart = (
    e,
    product
  ) => {
    /*
    |--------------------------------------------------------------------------
    | Prevent Product Details Navigation
    |--------------------------------------------------------------------------
    */

    e.preventDefault();

    e.stopPropagation();

    if (!product?._id) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | CartContext Handles Cart
    |--------------------------------------------------------------------------
    */

    addToCart(
      product,
      1
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (categoryLoading) {
    return (
      <section
        className="
          py-16
          bg-muted/20
          border-t
          border-border/40
        "
      >
        <div
          className="
            min-h-[250px]
            flex
            items-center
            justify-center
          "
        >
          <Loader2
            size={36}
            className="
              animate-spin
              text-primary
            "
          />
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <section
        className="
          py-16
          bg-muted/20
          border-t
          border-border/40
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            text-center
          "
        >
          <p
            className="
              text-red-600
              text-sm
            "
          >
            {error}
          </p>

          {categoryId && (
            <button
              type="button"
              onClick={() =>
                dispatch(
                  fetchProductsByCategory(
                    categoryId
                  )
                )


              }
              className="
                mt-4
                px-5
                py-2.5
                bg-primary
                text-primary-foreground
                rounded-lg
                text-sm
                font-semibold
              "
            >
              Try Again
            </button>
          )}
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty
  |--------------------------------------------------------------------------
  */

  if (
    !categoryProducts.length
  ) {
    return (
      <section
        className="
          py-16
          bg-muted/20
          border-t
          border-border/40
        "
      >
        <div
          className="
            text-center
            text-muted-foreground
          "
        >
          No products found in
          this category.
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <section
      className="
        py-16
        bg-muted/20
        border-t
        border-border/40
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            mb-8
          "
        >
          <h2
            className="
              text-2xl
              font-heading
              font-bold
              text-foreground
            "
          >
            You May Also Like
          </h2>

          <Link
            to={`/products?category=${encodeURIComponent(
              categoryId
            )}`}
            className="
              text-sm
              font-semibold
              text-primary
              hover:underline
            "
          >
            View All
          </Link>
        </div>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-8
          "
        >
          {categoryProducts
            .slice(0, 4)
            .map(
              (product) => (
                <div
                  key={
                    product._id
                  }
                  className="
                    group
                    bg-card
                    rounded-xl
                    overflow-hidden
                    shadow-sm
                    hover:shadow-lg
                    transition-all
                    duration-300
                    flex
                    flex-col
                    border
                    border-border/40
                  "
                >
                  {/* Image */}

                  <div
                    className="
                      relative
                      overflow-hidden
                      aspect-square
                      bg-muted
                    "
                  >
                    <Link
                      to={`/products/${product._id}`}
                      className="
                        block
                        w-full
                        h-full
                      "
                    >
                      <img
                        src={
                          product?.images?.[0]?.url ||
                          product?.image?.url ||
                          product?.image ||
                          "/placeholder.png"
                        }
                        alt={product?.title || "Product"}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                        className="
    w-full
    h-full
    object-cover
    transition-transform
    duration-500
    group-hover:scale-105
  "
                      />
                    </Link>

                    {/* Wishlist */}

                    <button
                      type="button"
                      onClick={(
                        e
                      ) => {
                        e.preventDefault();

                        e.stopPropagation();
                      }}
                      className="
                        absolute
                        top-3
                        right-3
                        w-9
                        h-9
                        rounded-full
                        bg-background/80
                        backdrop-blur-md
                        flex
                        items-center
                        justify-center
                        text-primary
                        shadow
                        hover:scale-110
                        transition
                      "
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        size={17}
                      />
                    </button>
                  </div>

                  {/* Product Details */}

                  <div
                    className="
                      p-5
                      flex-1
                      flex
                      flex-col
                      justify-between
                    "
                  >
                    <Link
                      to={`/products/${product._id}`}
                    >
                      <h3
                        className="
                          font-heading
                          text-base
                          font-bold
                          text-foreground
                          group-hover:text-primary
                          transition
                          mb-1
                        "
                      >
                        {product.title}
                      </h3>
                    </Link>

                    {product
                      ?.category
                      ?.name && (
                        <p
                          className="
                          text-xs
                          text-muted-foreground
                          mb-3
                        "
                        >
                          {
                            product
                              .category
                              .name
                          }
                        </p>
                      )}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        border-t
                        border-border/40
                        pt-4
                        mt-2
                      "
                    >
                      {/* Price */}

                      <span
                        className="
                          font-heading
                          text-base
                          font-bold
                          text-primary
                        "
                      >
                        ₹
                        {Number(
                          product.price ||
                          0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>

                      {/* Add To Cart */}

                      <button
                        type="button"
                        onClick={(
                          e
                        ) =>
                          handleAddToCart(
                            e,
                            product
                          )
                        }
                        className="
                          px-3
                          py-2
                          bg-primary
                          text-primary-foreground
                          rounded-lg
                          text-xs
                          font-semibold
                          hover:bg-primary/90
                          transition
                          flex
                          items-center
                          gap-1.5
                        "
                      >
                        <ShoppingCart
                          size={14}
                        />

                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
        </div>
      </div>
    </section>
  );
};

export default ProductTreasure;