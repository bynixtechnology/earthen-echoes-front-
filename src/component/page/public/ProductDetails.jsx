import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProductDetailHeroSection from "../../core/productdetails/ProductDetailHeroSection";
import ProductTreasure from "../../core/productdetails/ProductTreasure";
import ProductFaq from "../../core/productdetails/ProductFaq";
import { selectSelectedProduct } from "../../../redux/slices/productSlice";
import {
  fetchProductBySlug,
  fetchProductById,
} from "../../../redux/thunks/productThunk";

const ProductDetails = () => {
  const { slug, id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(selectSelectedProduct);

  const [categoryId, setCategoryId] = useState("");

  // 1. Smooth scroll to top whenever URL slug/id changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [slug, id]);

  // 2. Fetch Product data by slug or id when URL parameters update
  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    } else if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, slug, id]);

  // 3. Set dynamic document title for SEO & better UX
  useEffect(() => {
    if (product?.title) {
      document.title = `${product.title} | Earthen Echoes`;
    } else {
      document.title = "Handcrafted Pottery | Earthen Echoes";
    }
  }, [product?.title]);

  // 4. Resolve active category ID from product or child callback
  const activeCategoryId = useMemo(() => {
    if (product?.category) {
      return typeof product.category === "object"
        ? product.category._id || product.category.id
        : product.category;
    }
    return categoryId;
  }, [product?.category, categoryId]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFDF9]">
        <p className="text-gray-500 text-lg font-medium">
          Loading product details...
        </p>
      </div>
    );
  }

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