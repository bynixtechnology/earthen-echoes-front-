import React, { useState } from "react";
import ProductDetailHeroSection from "../../core/productdetails/ProductDetailHeroSection";
import ProductTreasure from "../../core/productdetails/ProductTreasure";

const ProductDetails = () => {

  const [categoryId, setCategoryId] = useState("");

  return (
    <>
      <ProductDetailHeroSection
        setCategoryId={setCategoryId}
      />

      <ProductTreasure
        categoryId={categoryId}
      />
    </>
  );
};

export default ProductDetails;