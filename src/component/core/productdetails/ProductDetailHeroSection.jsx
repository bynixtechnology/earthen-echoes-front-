import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  RefreshCw,
  Star,
  ShoppingCart,
  CreditCard,
  Heart,
  Share2,
} from "lucide-react";
import { useParams } from 'react-router-dom';
import axiosInstance from "../../../config/axiosInstance";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import { FRONTEND_MESSAGES } from "../../../constants/messages";

import { useCart } from "../../../component/core/context/CartContext";



const ProductDetailHeroSection = ({ setCategoryId }) => {
    const { id } = useParams();
  

  const { updateCartCount } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (id) {
      getProductById();
    }
  }, [id]);

  const getProductById = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_ENDPOINTS.PRODUCT.GET_BY_ID(id));
      const productData = res.data.data || res.data;
      setProduct(productData);

      if (productData?.category?._id) {
        setCategoryId(productData.category._id);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  
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

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
  <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full text-xs text-muted-foreground flex items-center gap-2">
    <a href="#" className="hover:text-primary transition-colors">
      Home
    </a>
    <ChevronRight size={12} className="text-[10px]" />
    <a href="#" className="hover:text-primary transition-colors">
      Catalogue
    </a>
    <ChevronRight size={12} className="text-[10px]" />
    <a href="#" className="hover:text-primary transition-colors">
      Urlis
    </a>
    <ChevronRight size={12} className="text-[10px]" />
    <span className="text-foreground font-medium">Jaipur Royal Urli</span>
  </nav>
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-7 space-y-6">
        <div className="relative rounded-2xl overflow-hidden bg-card border border-border/50 aspect-square shadow-sm flex items-center justify-center group">
          <img
            id="main-product-img"
            src={
    product?.images?.[0]?.url ||
    product?.images?.[0] ||
    "/placeholder.png"
  }
            alt={product?.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
          />
          <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded">
         {product?.name}
  </span>
<button className="absolute bottom-4 right-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-md">
  <RefreshCw size={16} /> 360° Interactive View
          </button>
        </div>
      <div className="grid grid-cols-4 gap-4">
  {(product?.images || []).map((img, index) => (
    <button
      key={index}
      className={`aspect-square rounded-lg overflow-hidden bg-card ${
        index === 0
          ? "border-2 border-primary"
          : "border border-border opacity-70 hover:opacity-100"
      }`}
    >
      <img
        src={img?.url || img}
        alt={`${product?.name}-${index}`}
        className="w-full h-full object-cover"
      />
    </button>
  ))}
</div>
      </div>
      <div className="lg:col-span-5 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-primary font-bold">
              Premium Urli Collection
            </span>
            <span className="text-xs text-primary bg-secondary px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> In Stock
              (12 Left)
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground leading-tight">
           {product.name}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-primary text-sm">
             {Array.from({ length: 5 }).map((_, index) => (
  <Star
    key={index}
    size={15}
    fill="currentColor"
    className="text-primary"
  />
))}
              <span className="text-muted-foreground ml-1.5 font-sans font-medium">
                ({product.rating || 0} Reviews)
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-heading font-bold text-primary">
₹{product.price}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            ₹4,200
          </span>
          <span className="text-xs text-primary font-bold bg-secondary px-2 py-0.5 rounded">
            Save 18%
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
  {product?.description}
        </p>
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50 text-xs">
          <div>
            <span className="block text-muted-foreground uppercase tracking-wider mb-1">
              SKU:
            </span>
            <span className="font-semibold text-foreground">EE-URL-001</span>
          </div>
         <div>
  <span className="block text-muted-foreground uppercase tracking-wider mb-1">
    Category:
  </span>

  <span className="font-semibold text-foreground">
    {product?.category?.name}
  </span>
</div>
        </div>
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Quantity:
            </span>
            <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden">
              <button className="px-3 py-2 hover:bg-muted text-foreground transition-colors font-bold">
                -
              </button>
              <input
                type="number"
                defaultValue={1}
                min={1}
                className="w-12 text-center text-sm font-semibold bg-transparent border-none focus:outline-none focus:ring-0"
              />
              <button className="px-3 py-2 hover:bg-muted text-foreground transition-colors font-bold">
                +
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                 <button 
  onClick={handleAddToCart}
  className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
>
  <ShoppingCart size={18} /> Add to Cart
</button>
            <button className="w-full py-4 bg-foreground text-background font-semibold rounded-lg shadow-lg hover:bg-foreground/90 transition-all flex items-center justify-center gap-2">
              <CreditCard size={18} className="text-xl" /> Buy
              It Now
            </button>
          </div>
          <div className="flex items-center justify-between pt-2">
            <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
              <Heart size={18} className="text-base" /> Add to
              Wishlist
            </button>
            <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
              <Share2 size={18} className="text-base" /> Share
              Product
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/40">
  <div className="border-b border-border/60">
    <nav className="flex gap-8 text-sm font-medium overflow-x-auto">
      <button className="border-b-2 border-primary text-primary pb-4 whitespace-nowrap">
        Description
      </button>
      <button className="text-muted-foreground hover:text-foreground pb-4 whitespace-nowrap">
        Specifications
      </button>
      <button className="text-muted-foreground hover:text-foreground pb-4 whitespace-nowrap">
        Care Instructions
      </button>
      <button className="text-muted-foreground hover:text-foreground pb-4 whitespace-nowrap">
        Shipping &amp; Returns
      </button>
      <button className="text-muted-foreground hover:text-foreground pb-4 whitespace-nowrap">
        Reviews
      </button>
    </nav>
  </div>
  <div className="py-8 space-y-6">
    <div className="max-w-3xl space-y-4">
      <h3 className="font-heading text-xl font-bold text-foreground">
        A Symphony of Earth and Craft
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
     {product.longDescription}
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {product.description}
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {product.description1}
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
      <div className="p-5 bg-card border border-border/50 rounded-xl flex gap-4">
        <iconify-icon
          icon="lucide:box"
          className="text-primary text-2xl flex-shrink-0"
        />
        <div>
          <h4 className="font-heading font-bold text-sm mb-1">
            Dimensions &amp; Weight
          </h4>
          <p className="text-xs text-muted-foreground">
            Diameter: 14 inches | Height: 5 inches | Weight: 2.8 kg
          </p>
        </div>
      </div>
      <div className="p-5 bg-card border border-border/50 rounded-xl flex gap-4">
        <iconify-icon
          icon="lucide:leaf"
          className="text-primary text-2xl flex-shrink-0"
        />
        <div>
          <h4 className="font-heading font-bold text-sm mb-1">
            Organic Composition
          </h4>
          <p className="text-xs text-muted-foreground">
            100% natural red clay with hand-finished detailing.
          </p>
        </div>
      </div>
      <div className="p-5 bg-card border border-border/50 rounded-xl flex gap-4">
        <iconify-icon
          icon="lucide:sun"
          className="text-primary text-2xl flex-shrink-0"
        />
        <div>
          <h4 className="font-heading font-bold text-sm mb-1">
            Versatile Placement
          </h4>
          <p className="text-xs text-muted-foreground">
            Perfect for both indoor foyer and covered outdoor patio spaces.
          </p>
        </div>
      </div>
      <div className="p-5 bg-card border border-border/50 rounded-xl flex gap-4">
        <iconify-icon
          icon="lucide:ruler"
          className="text-primary text-2xl flex-shrink-0"
        />
        <div>
          <h4 className="font-heading font-bold text-sm mb-1">
            Handmade Details
          </h4>
          <p className="text-xs text-muted-foreground">
            Subtle artisan irregularities make every piece uniquely collectible.
          </p>
        </div>
      </div>
      <div className="p-5 bg-card border border-border/50 rounded-xl flex gap-4">
        <iconify-icon
          icon="lucide:sparkles"
          className="text-primary text-2xl flex-shrink-0"
        />
        <div>
          <h4 className="font-heading font-bold text-sm mb-1">Finish</h4>
          <p className="text-xs text-muted-foreground">
            Matte terracotta body with premium polished highlights.
          </p>
        </div>
      </div>
      <div className="p-5 bg-card border border-border/50 rounded-xl flex gap-4">
        <iconify-icon
          icon="lucide:trees"
          className="text-primary text-2xl flex-shrink-0"
        />
        <div>
          <h4 className="font-heading font-bold text-sm mb-1">
            Indoor / Outdoor Use
          </h4>
          <p className="text-xs text-muted-foreground">
            Works best indoors or in shaded outdoor environments.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

</>

  )
}

export default ProductDetailHeroSection


// import {
//   ChevronRight,
//   RefreshCw,
//   Star,
//   ShoppingCart,
//   CreditCard,
//   Heart,
//   Share2,
// } from "lucide-react";
// import { useParams } from 'react-router-dom';
// import axiosInstance from "../../../config/axiosInstance";
// import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
// import { FRONTEND_MESSAGES } from "../../../constants/messages";
// import { useCart } from "../../../component/core/context/CartContext";

// const ProductDetailHeroSection = ({ setCategoryId }) => {
//   const { id } = useParams();
  

//   const { updateCartCount } = useCart();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { addToCart } = useCart();

//   const [quantity, setQuantity] = useState(1);
//   const [isAdding, setIsAdding] = useState(false);

//   useEffect(() => {
//     if (id) {
//       getProductById();
//     }
//   }, [id]);

//   const getProductById = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get(API_ENDPOINTS.PRODUCT.GET_BY_ID(id));
//       const productData = res.data.data || res.data;
//       setProduct(productData);

//       if (productData?.category?._id) {
//         setCategoryId(productData.category._id);
//       }
//     } catch (error) {
//       console.log(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

  
//   const handleAddToCart = async () => {
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

//   if (!product) {
//     return <div>Product not found</div>;
//   }

//   return (
//     <>
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full text-xs text-muted-foreground flex items-center gap-2">
    
//       </nav>
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
    
//           <div className="lg:col-span-7 space-y-6">
//             <div className="relative rounded-2xl overflow-hidden bg-card border border-border/50 aspect-square shadow-sm flex items-center justify-center group">
//               <img
//                 id="main-product-img"
//                 src={product?.images?.[0]?.url || product?.images?.[0] || "/placeholder.png"}
//                 alt={product?.name}
//                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
//               />
//               <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded">
//                 {product?.name}
//               </span>
//               <button className="absolute bottom-4 right-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-md">
//                 <RefreshCw size={16} /> 360° Interactive View
//               </button>
//             </div>

//             <div className="grid grid-cols-4 gap-4">
//               {(product?.images || []).map((img, index) => (
//                 <button
//                   key={index}
//                   className={`aspect-square rounded-lg overflow-hidden bg-card ${
//                     index === 0 ? "border-2 border-primary" : "border border-border opacity-70 hover:opacity-100"
//                   }`}
//                 >
//                   <img src={img?.url || img} alt={`${product?.name}-${index}`} className="w-full h-full object-cover" />
//                 </button>
//               ))}
//             </div>
//           </div>

        
//           <div className="lg:col-span-5 space-y-6">
  
//             <div className="space-y-4 pt-2">
              
   
//               <div className="flex items-center gap-4">
//                 <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
//                   Quantity:
//                 </span>
//                 <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden">
//                   <button 
//                     onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}
//                     className="px-3 py-2 hover:bg-muted text-foreground transition-colors font-bold"
//                   >
//                     -
//                   </button>
//                   <input
//                     type="number"
//                     value={quantity}
//                     readOnly
//                     className="w-12 text-center text-sm font-semibold bg-transparent border-none focus:outline-none focus:ring-0"
//                   />
//                   <button 
//                     onClick={() => setQuantity(q => q + 1)}
//                     className="px-3 py-2 hover:bg-muted text-foreground transition-colors font-bold"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>

           
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
//          <button 
//   onClick={handleAddToCart}
//   className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
// >
//   <ShoppingCart size={18} /> Add to Cart
// </button>
//                 <button className="w-full py-4 bg-foreground text-background font-semibold rounded-lg shadow-lg hover:bg-foreground/90 transition-all flex items-center justify-center gap-2">
//                   <CreditCard size={18} className="text-xl" /> Buy It Now
//                 </button>
//               </div>

//               {/* ... (बाकी का Wishlist और Share कोड) ... */}
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* ... (आपका Description सेक्शन कोड) ... */}
//     </>
//   )
// }

// export default ProductDetailHeroSection;