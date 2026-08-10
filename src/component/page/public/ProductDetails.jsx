import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProductDetailHeroSection from "../../core/productdetails/ProductDetailHeroSection";
import ProductTreasure from "../../core/productdetails/ProductTreasure";
import ProductFaq from "../../core/productdetails/ProductFaq";
import { selectSelectedProduct } from "../../../redux/slices/productSlice";

const ProductDetails = () => {
  const [categoryId, setCategoryId] = useState("");
  const product = useSelector(selectSelectedProduct);

  return (
    <>
      <ProductDetailHeroSection
        setCategoryId={setCategoryId}
      />

      <ProductTreasure
        categoryId={categoryId}
      />

      <ProductFaq product={product} /> 
    </>
  );
};

export default ProductDetails;