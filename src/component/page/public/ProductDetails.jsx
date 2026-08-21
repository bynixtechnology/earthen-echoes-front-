import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import ProductDetailHeroSection from "../../core/productdetails/ProductDetailHeroSection";
import ProductTreasure from "../../core/productdetails/ProductTreasure";
import ProductFaq from "../../core/productdetails/ProductFaq";
import { selectSelectedProduct } from "../../../redux/slices/productSlice";

const ProductDetails = () => {
  const { slug, id } = useParams();
  const product = useSelector(selectSelectedProduct);

  const [categoryId, setCategoryId] = useState("");

  // 1. Smooth scroll to top whenever URL slug/id changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [slug, id]);

  // 2. Set dynamic document title for SEO & better UX
  useEffect(() => {
    if (product?.title) {
      document.title = `${product.title} | Earthen Echoes`;
    } else {
      document.title = "Handcrafted Pottery | Earthen Echoes";
    }
  }, [product?.title]);

  // 3. Resolve active category ID from product or child callback
  const activeCategoryId = useMemo(() => {
    if (product?.category) {
      return typeof product.category === "object"
        ? product.category._id || product.category.id
        : product.category;
    }
    return categoryId;
  }, [product?.category, categoryId]);

  return (
    <main className="min-h-screen bg-[#FFFDF9]">
      <ProductDetailHeroSection setCategoryId={setCategoryId} />

      {activeCategoryId && (
        <ProductTreasure categoryId={activeCategoryId} />
      )}

      <ProductFaq product={product} />
    </main>
  );
};

export default ProductDetails;