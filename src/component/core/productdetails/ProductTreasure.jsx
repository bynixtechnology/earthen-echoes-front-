import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../config/axiosInstance";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import { useCart } from "../../core/context/CartContext";



const ProductTreasure = ({ categoryId }) => {
  const { addToCart } = useCart();
  const { updateCartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryId) {
      getProductsByCategory();
    }
  }, [categoryId]);

 const handleAddToCart = async () => {
    try {

      setIsAdding(true);
      addToCart(product, quantity);
    
   const res = await axiosInstance.post(API_ENDPOINTS.CART.ADD, {
        productId: product._id,
        quantity: quantity
      }); 

     
      if(res.data.cart) {
         updateCartCount(res.data.cart.length); 
      } else {
   
   
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
   
    } finally {
      setIsAdding(false);
    }
  };
  const getProductsByCategory = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        API_ENDPOINTS.PRODUCT.GET_BY_CATEGORY(categoryId)
      );

      // console.log(res.data);

      setProducts(res.data.data.products || []);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <section className="py-16 bg-muted/20 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-8">
            
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product) => (
              <Link
                key={product.id}
              to={`/products/${product._id}`}
                className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-border/40"
              >
                <div className="relative overflow-hidden aspect-square bg-muted">
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.title}
                  />

                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-primary shadow">
                    <Heart size={16} />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary mb-1">
                    {product.title}
                  </h3>

                  <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-2">
                    <span className="font-heading text-base font-bold text-primary">
                      {product.price}
                    </span>

                    <button  onClick={handleAddToCart}   className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90">
                      Add
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
 
      </div>
    </section>

  )
}

export default ProductTreasure