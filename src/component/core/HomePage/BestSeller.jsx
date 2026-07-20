
//  import React, { useState, useEffect } from 'react';
// import {
//   Heart,
//   Eye,
//   ShoppingCart,
//   Star,
//   Loader2,
//   ArrowRight
// } from "lucide-react";
// import axiosInstance from "../../../config/axiosInstance"; 
// import { API_ENDPOINTS } from "../../../constants/apiEndpoints"; 

// const BestSeller = () => {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchBestSellers = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT.GET_ALL);


//         const fetchedData = response?.data?.data || response?.data || [];


//         const filteredProducts = fetchedData.filter(
//           (product) => product.isActive === true 
//         );

//         setProducts(filteredProducts.slice(0, 4));

//       } catch (error) {
//         console.error("Failed to fetch best sellers:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBestSellers();
//   }, []);

//   return (
//     <section className="py-20 bg-muted/30">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
//           <div>
//             <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-2">
//               Our Best Sellers
//             </h2>
//             <p className="text-muted-foreground">
//               Most-loved handcrafted treasures appreciated by design connoisseurs.
//             </p>
//           </div>
//           <a
//             href="/best-sellers"
//             className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all mt-4 md:mt-0"
//           >
//             View All Best Sellers
//             <ArrowRight size={18} className="ml-1" />
//           </a>
//         </div>


//         {isLoading ? (
//           <div className="flex justify-center items-center py-20 min-h-[300px]">
//             <Loader2 className="w-10 h-10 animate-spin text-amber-700" />
//           </div>
//         ) : products.length === 0 ? (
//           <div className="text-center text-gray-500 py-10 font-medium">
//             No active products found right now.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             {products.map((product, index) => {
//               const productId = product._id || product.id || index;
//               const imageUrl = product.images?.[0] || product.image || "https://placehold.co/500?text=No+Image";
//               const productTitle = product.title || "Unknown Product";
//               const productPrice = product.price || 0;
//               const productDesc = product.description || "No description available.";

//               return (
//                 <div
//                   key={productId}
//                   className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
//                 >
//                   <div className="relative overflow-hidden aspect-square bg-muted">
//                     <img
//                       src={imageUrl}
//                       alt={productTitle}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                     />

//                     <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded">
//                       Best Seller
//                     </span>

//                     <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-foreground hover:text-primary transition-colors shadow">
//                       <Heart size={16} />
//                     </button>

//                     <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-primary/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-2">
//                       <button className="px-3 py-2 bg-background text-foreground rounded-md text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-1">
//                         <Eye size={14} />
//                         Quick View
//                       </button>
//                     </div>
//                   </div>

//                   <div className="p-5 flex-1 flex flex-col justify-between bg-white">
//                     <div>
//                       <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
//                         {[...Array(5)].map((_, i) => (
//                           <Star key={i} size={14} className="fill-current" />
//                         ))}
//                         <span className="text-muted-foreground ml-1">({product.rating || 4.5})</span>
//                       </div>

//                       <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1 truncate">
//                         {productTitle}
//                       </h3>

//                       <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
//                         {productDesc}
//                       </p>
//                     </div>

//                     <div className="flex items-center justify-between border-t border-border/40 pt-4">
//                       <span className="font-heading text-lg font-bold text-emerald-600">
//                         ₹{productPrice}
//                       </span>

//                       <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5">
//                         <ShoppingCart size={14} />
//                         Add
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default BestSeller;
import React, { useState, useEffect } from 'react';
import {
  Heart,
  Eye,
  ShoppingCart,
  Star,
  Loader2,
  ArrowRight
} from "lucide-react";
import axiosInstance from "../../../config/axiosInstance";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

import { useCart } from "../../core/context/CartContext";
import { Link, useNavigate } from 'react-router-dom';

const BestSeller = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const { addToCart } = useCart();

 const navigate = useNavigate();

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT.GET_ALL);

        const fetchedData = response?.data?.data || response?.data || [];

        const filteredProducts = fetchedData.filter(
          (product) => product.isActive === true
        );

        setProducts(filteredProducts.slice(0, 4));

      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const handleClick = (productId) => {
    if (!productId) return;

    navigate(`/products/${productId}`);
  };
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-2">
              Our Best Sellers
            </h2>
            <p className="text-muted-foreground">
              Most-loved handcrafted treasures appreciated by design connoisseurs.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all mt-4 md:mt-0"
          >
            View All Best Sellers
            <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 min-h-[300px]">
            <Loader2 className="w-10 h-10 animate-spin text-amber-700" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-medium">
            No active products found right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => {

              const productId = product._id || product.id || index;
              const imageUrl = product.images?.[0] || product.image || "https://placehold.co/500?text=No+Image";
              const productTitle = product.title || product.name || "Unknown Product";
              const productPrice = product.price || 0;
              const productDesc = product.description || "No description available.";

              return (
                <div
                  key={productId}
                  onClick={() => handleClick(productId)}
                  className="group bg-card rounded-xl cursor-pointer overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="relative overflow-hidden aspect-square bg-muted">
                    <img
                      src={imageUrl}
                      alt={productTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded">
                      Best Seller
                    </span>

                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-foreground hover:text-primary transition-colors shadow">
                      <Heart size={16} />
                    </button>

                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-primary/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-2">
                      <button className="px-3 py-2 bg-background text-foreground rounded-md text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-1">
                        <Eye size={14} />
                        Quick View
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-current" />
                        ))}
                        <span className="text-muted-foreground ml-1">({product.rating || 4.5})</span>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1 truncate">
                        {productTitle}
                      </h3>

                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                        {productDesc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/40 pt-4">
                      <span className="font-heading text-lg font-bold text-emerald-600">
                        ₹{productPrice}
                      </span>


                      <button
                        onClick={() => addToCart({
                          ...product,
                          _id: productId,
                          name: productTitle,
                          price: productPrice,
                          images: product.images || [imageUrl]
                        })}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                      >
                        <ShoppingCart size={14} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSeller;