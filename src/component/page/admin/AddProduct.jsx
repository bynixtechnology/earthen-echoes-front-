import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  Loader2,
  ArrowLeft,
  Tag,
  Plus,
  Trash2,
  Layers,
} from "lucide-react";

import { fetchCategories } from "../../../redux/thunks/categoryThunk";
import { fetchProductTags } from "../../../redux/thunks/productTagThunk";
import { createProduct } from "../../../redux/thunks/productThunk";

import {
  selectCategories,
  selectCategoriesLoading,
} from "../../../redux/slices/categorySlice";
import { selectProductActionLoading } from "../../../redux/slices/productSlice";
import { showToast } from "../../../config/toast";

/*
|--------------------------------------------------------------------------
| Theme Colors
|--------------------------------------------------------------------------
*/
export const C = {
  coral: "#F16937",
  teal: "#1BACB1",
  blush: "#F5B5D0",
  raspberry: "#E44587",
  green: "#76A845",
  ivory: "#FDF8F3",
  cream: "#FAF4ED",
  dark: "#1C1208",
  darkTeal: "#0D6B70",
  paleTeal: "#E8F7F8",
  paleBlush: "#FEF0F6",
  paleCoral: "#FEF1EC",
  paleGreen: "#EEF6E7",
};

export default function AddProduct() {
  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Redux State
  |--------------------------------------------------------------------------
  */
  const categories = useSelector(selectCategories);
  const loadingCategories = useSelector(selectCategoriesLoading);
  const { tags: productTagsList = [] } = useSelector(
    (state) => state.productTags || {}
  );
  const loading = useSelector(selectProductActionLoading);

  /*
  |--------------------------------------------------------------------------
  | Local State
  |--------------------------------------------------------------------------
  */
  const [hasVariants, setHasVariants] = useState(false);
  const [images, setImages] = useState([]); // Fallback single product images

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    category: "",
    productTags: [],
    sku: "",
    description: "",
    longDescription: "",
    longDescription1: "",
    price: "",
    originalPrice: "",
    discountPercentage: "",
    stock: "",
    composition: "100% natural red clay",
    suggestedProducts: [],
  });

  // Color Variants State Array
  const [variants, setVariants] = useState([
    {
      colorName: "Terracotta Red",
      colorCode: "#C85A32",
      sku: "",
      price: "",
      originalPrice: "",
      stock: "",
      specifications: {
        composition: "100% natural red clay",
      },
      images: [],
    },
  ]);

  /*
  |--------------------------------------------------------------------------
  | Fetch Categories & Product Tags
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProductTags());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Input Change Handler (Main Form)
  |--------------------------------------------------------------------------
  */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Tag Selection Toggle
  |--------------------------------------------------------------------------
  */
  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      const currentTags = prev.productTags;
      if (currentTags.includes(tagId)) {
        return {
          ...prev,
          productTags: currentTags.filter((id) => id !== tagId),
        };
      } else {
        return {
          ...prev,
          productTags: [...currentTags, tagId],
        };
      }
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Single Mode Image Handlers
  |--------------------------------------------------------------------------
  */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 5) {
      showToast.error("Maximum 5 images are allowed.");
      e.target.value = "";
      return;
    }

    setImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  /*
  |--------------------------------------------------------------------------
  | Variant Operations Handlers
  |--------------------------------------------------------------------------
  */
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        colorName: "",
        colorCode: "#C85A32",
        sku: "",
        price: formData.price || "",
        originalPrice: formData.originalPrice || "",
        stock: formData.stock || "",
        specifications: {
          composition: formData.composition || "100% natural red clay",
        },
        images: [],
      },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) {
      showToast.error("At least one variant is required when variants are enabled.");
      return;
    }
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleVariantSpecChange = (variantIndex, specField, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex] = {
        ...updated[variantIndex],
        specifications: {
          ...updated[variantIndex].specifications,
          [specField]: value,
        },
      };
      return updated;
    });
  };

  const handleVariantImageChange = (variantIndex, e) => {
    const files = Array.from(e.target.files || []);
    const currentImages = variants[variantIndex].images || [];

    if (currentImages.length + files.length > 5) {
      showToast.error("Maximum 5 images allowed per color variant.");
      e.target.value = "";
      return;
    }

    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex].images = [...currentImages, ...files];
      return updated;
    });

    e.target.value = "";
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[variantIndex].images = updated[variantIndex].images.filter(
        (_, idx) => idx !== imageIndex
      );
      return updated;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Submit Product
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!formData.category) {
      showToast.error("Please select a valid category.");
      return;
    }

    if (hasVariants) {
      if (variants.length === 0) {
        showToast.error("Please add at least one color variant.");
        return;
      }

      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        if (!v.colorName.trim()) {
          showToast.error(`Color Name is required for variant #${i + 1}.`);
          return;
        }
        if (v.images.length === 0) {
          showToast.error(`At least one image is required for variant "${v.colorName}".`);
          return;
        }
      }
    } else {
      if (images.length === 0) {
        showToast.error("At least one product image is required.");
        return;
      }
    }

    const data = new FormData();

    // Core fields
    data.append("id", formData.id);
    data.append("title", formData.title.trim());
    data.append("category", formData.category);
    data.append("sku", formData.sku.trim());
    data.append("description", formData.description.trim());
    data.append("longDescription", formData.longDescription.trim());

    if (formData.longDescription1) {
      data.append("longDescription1", formData.longDescription1.trim());
    }

    data.append("price", Number(formData.price));
    if (formData.originalPrice !== "") {
      data.append("originalPrice", Number(formData.originalPrice));
    }
    if (formData.discountPercentage !== "") {
      data.append("discountPercentage", Number(formData.discountPercentage));
    }

    data.append("stock", Number(formData.stock || 0));
    
    // Status is always sent as active (true)
    data.append("isActive", "true");
    data.append("hasVariants", String(hasVariants));

    if (formData.productTags && formData.productTags.length > 0) {
      data.append("productTags", JSON.stringify(formData.productTags));
    }

    if (hasVariants) {
      const variantsMetadata = variants.map((v) => ({
        colorName: v.colorName.trim(),
        colorCode: v.colorCode.trim(),
        sku: v.sku.trim() || undefined,
        price: v.price ? Number(v.price) : Number(formData.price),
        originalPrice: v.originalPrice ? Number(v.originalPrice) : Number(formData.originalPrice) || 0,
        stock: v.stock !== "" ? Number(v.stock) : Number(formData.stock) || 0,
        specifications: {
          composition: v.specifications.composition?.trim() || "100% natural red clay",
        },
      }));

      data.append("variants", JSON.stringify(variantsMetadata));

      variants.forEach((v, vIndex) => {
        v.images.forEach((imgFile) => {
          data.append(`variant_${vIndex}_images`, imgFile);
        });
      });
    } else {
      const specifications = {
        composition: formData.composition?.trim() || "100% natural red clay",
      };
      data.append("specifications", JSON.stringify(specifications));

      images.forEach((image) => {
        data.append("images", image);
      });
    }

    if (formData.suggestedProducts?.length) {
      data.append("suggestedProducts", JSON.stringify(formData.suggestedProducts));
    }

    try {
      const response = await dispatch(createProduct({ formData: data })).unwrap();

      showToast.success(response?.message || "Product created successfully.");
      navigate("/admin/product", { replace: true });
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);
      showToast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to create product."
      );
    }
  };

  return (
    <div
      className="max-w-6xl mx-auto w-full space-y-6 pb-16"
      style={{ color: C.dark }}
    >
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/product")}
          className="p-2 bg-white border rounded-xl hover:opacity-80 transition shadow-sm"
          style={{ borderColor: C.blush, color: C.teal }}
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: C.dark }}
          >
            Add New Product
          </h2>
          <p
            className="text-xs mt-0.5 font-medium"
            style={{ color: C.teal }}
          >
            Create and publish a new Earthen Echoes product.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. CORE INFORMATION */}
          <div
            className="bg-white rounded-2xl border shadow-sm p-4 sm:p-6 space-y-4"
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >
            <h3
              className="text-sm sm:text-base font-bold border-b pb-2"
              style={{ borderColor: C.blush, color: C.dark }}
            >
              1. Core Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: C.darkTeal }}
                >
                  Numerical ID *
                </label>
                <input
                  type="number"
                  required
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="101"
                  className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                  style={{ borderColor: C.blush }}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: C.darkTeal }}
                >
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Clay Pitcher"
                  className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                  style={{ borderColor: C.blush }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: C.darkTeal }}
                >
                  Main SKU *
                </label>
                <input
                  type="text"
                  required
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="EE-POT-01"
                  className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                  style={{ borderColor: C.blush }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: C.darkTeal }}
                >
                  Category *
                </label>
                <select
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={loadingCategories}
                  className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none disabled:opacity-60"
                  style={{ borderColor: C.blush }}
                >
                  <option value="" disabled>
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select Category"}
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category._id || category.id}
                      value={category._id || category.id}
                    >
                      {category.name || category.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* PRODUCT TAGS SELECTION */}
          <div
            className="bg-white p-6 rounded-2xl border shadow-sm space-y-3"
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >
            <h3
              className="text-sm font-bold border-b pb-2"
              style={{ borderColor: C.blush, color: C.dark }}
            >
              Product Tags
            </h3>
            <p className="text-xs text-slate-500">
              Select multiple tags to associate with this product.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {productTagsList && productTagsList.length > 0 ? (
                productTagsList.map((tag) => {
                  const tagId = tag._id || tag.id;
                  const isSelected = formData.productTags.includes(tagId);
                  return (
                    <button
                      key={tagId}
                      type="button"
                      onClick={() => handleTagToggle(tagId)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        isSelected
                          ? "shadow-sm"
                          : "bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                      style={{
                        backgroundColor: isSelected ? C.paleCoral : "#FFFFFF",
                        color: isSelected ? C.coral : "#475569",
                        borderColor: isSelected ? C.coral : C.blush,
                      }}
                    >
                      <Tag size={12} />
                      {tag.name}
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No product tags available.
                </p>
              )}
            </div>
          </div>

          {/* FINANCIALS & BASE STOCK */}
          <div
            className="bg-white p-6 rounded-2xl border shadow-sm space-y-4"
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >
            <h3
              className="text-sm font-bold border-b pb-2"
              style={{ borderColor: C.blush, color: C.dark }}
            >
              2. Base Financials & Stock
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { name: "price", label: "Sale Price", required: true },
                { name: "originalPrice", label: "Original Price" },
                { name: "discountPercentage", label: "Discount %" },
                { name: "stock", label: "Base Stock", required: !hasVariants },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: C.darkTeal }}
                  >
                    {field.label}
                  </label>
                  <input
                    type="number"
                    required={field.required}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                    style={{ borderColor: C.blush }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* COLOR VARIANTS TOGGLE AND SECTION */}
          <div
            className="bg-white p-6 rounded-2xl border shadow-sm space-y-4"
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Layers size={18} style={{ color: C.coral }} />
                <h3 className="text-sm font-bold" style={{ color: C.dark }}>
                  Color Variants Mode
                </h3>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => setHasVariants(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F16937]"></div>
                <span className="ml-2 text-xs font-bold text-slate-700">
                  {hasVariants ? "Enabled" : "Disabled"}
                </span>
              </label>
            </div>

            {hasVariants ? (
              <div className="space-y-6 pt-2">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 sm:p-5 rounded-xl border space-y-4 shadow-sm"
                    style={{ borderColor: C.blush }}
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <span
                        className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                        style={{ color: C.darkTeal }}
                      >
                        <span
                          className="w-4 h-4 rounded-full border shadow-inner"
                          style={{
                            backgroundColor: variant.colorCode || "#C85A32",
                            borderColor: C.blush,
                          }}
                        ></span>
                        Variant #{index + 1}: {variant.colorName || "Untitled Color"}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Color Info & Color Picker */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Color Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={variant.colorName}
                          onChange={(e) =>
                            handleVariantChange(index, "colorName", e.target.value)
                          }
                          placeholder="Terracotta Red"
                          className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs focus:outline-none"
                          style={{ borderColor: C.blush }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Color Code (Hex)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={variant.colorCode || "#C85A32"}
                            onChange={(e) =>
                              handleVariantChange(index, "colorCode", e.target.value)
                            }
                            className="w-9 h-9 rounded-lg border cursor-pointer p-0.5 bg-white"
                            style={{ borderColor: C.blush }}
                          />
                          <input
                            type="text"
                            value={variant.colorCode}
                            onChange={(e) =>
                              handleVariantChange(index, "colorCode", e.target.value)
                            }
                            placeholder="#C85A32"
                            className="w-full px-2.5 py-2 bg-slate-50 border rounded-lg text-xs font-mono focus:outline-none uppercase"
                            style={{ borderColor: C.blush }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Variant SKU
                        </label>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) =>
                            handleVariantChange(index, "sku", e.target.value)
                          }
                          placeholder="EE-POT-RED"
                          className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs focus:outline-none"
                          style={{ borderColor: C.blush }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) =>
                            handleVariantChange(index, "stock", e.target.value)
                          }
                          placeholder="10"
                          className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs focus:outline-none"
                          style={{ borderColor: C.blush }}
                        />
                      </div>
                    </div>

                    {/* Composition Specification */}
                    <div className="space-y-3 pt-1 border-t">
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Composition
                        </label>
                        <input
                          type="text"
                          value={variant.specifications.composition}
                          onChange={(e) =>
                            handleVariantSpecChange(
                              index,
                              "composition",
                              e.target.value
                            )
                          }
                          placeholder="100% natural red clay"
                          className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs focus:outline-none"
                          style={{ borderColor: C.blush }}
                        />
                      </div>
                    </div>

                    {/* Variant Images Upload */}
                    <div className="pt-1 border-t">
                      <label className="block text-xs font-semibold mb-1.5">
                        Variant Images (Max 5) *
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {variant.images.map((img, imgIdx) => (
                          <ImagePreview
                            key={imgIdx}
                            image={img}
                            onRemove={() => removeVariantImage(index, imgIdx)}
                          />
                        ))}

                        {variant.images.length < 5 && (
                          <label
                            className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition gap-1"
                            style={{
                              borderColor: C.blush,
                              color: C.teal,
                            }}
                          >
                            <Upload size={16} />
                            <span className="text-[10px] font-bold">
                              Add Photo
                            </span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleVariantImageChange(index, e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addVariant}
                  className="w-full py-2.5 border-2 border-dashed rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition"
                  style={{ borderColor: C.coral, color: C.coral }}
                >
                  <Plus size={16} />
                  Add Another Color Variant
                </button>
              </div>
            ) : (
              /* SINGLE SPECIFICATIONS FALLBACK */
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: C.darkTeal }}
                  >
                    Composition
                  </label>
                  <input
                    type="text"
                    name="composition"
                    value={formData.composition}
                    onChange={handleInputChange}
                    placeholder="e.g. 100% natural red clay"
                    className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none"
                    style={{ borderColor: C.blush }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col space-y-6">
          {/* DESCRIPTION */}
          <div
            className="bg-white p-6 rounded-2xl border shadow-sm space-y-4"
            style={{ borderColor: C.blush, backgroundColor: C.ivory }}
          >
            <h3
              className="text-sm font-bold border-b pb-2"
              style={{ borderColor: C.blush, color: C.dark }}
            >
              3. Product Description
            </h3>

            <textarea
              rows={3}
              required
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Short description"
              className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none resize-none"
              style={{ borderColor: C.blush }}
            />

            <textarea
              rows={5}
              required
              name="longDescription"
              value={formData.longDescription}
              onChange={handleInputChange}
              placeholder="Long description"
              className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none resize-none"
              style={{ borderColor: C.blush }}
            />

            <textarea
              rows={4}
              name="longDescription1"
              value={formData.longDescription1}
              onChange={handleInputChange}
              placeholder="Additional long description (Optional)"
              className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none resize-none"
              style={{ borderColor: C.blush }}
            />
          </div>

          {/* SINGLE PRODUCT IMAGES (When Variants Disabled) */}
          {!hasVariants && (
            <div
              className="bg-white p-6 rounded-2xl border shadow-sm space-y-3"
              style={{ borderColor: C.blush, backgroundColor: C.ivory }}
            >
              <h3
                className="text-sm font-bold border-b pb-2"
                style={{ borderColor: C.blush, color: C.dark }}
              >
                4. Main Product Images
              </h3>

              <p className="text-xs" style={{ color: C.teal }}>
                Maximum 5 images allowed.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <ImagePreview
                    key={`${image.name}-${index}`}
                    image={image}
                    onRemove={() => removeImage(index)}
                  />
                ))}

                {images.length < 5 && (
                  <label
                    className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition gap-2"
                    style={{
                      borderColor: C.blush,
                      backgroundColor: C.cream,
                      color: C.teal,
                    }}
                  >
                    <Upload size={20} />
                    <span className="text-xs font-semibold">Upload</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-4 font-bold transition shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: C.coral, color: "#FFFFFF" }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating Product...
              </>
            ) : (
              "Create Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Image Preview Component
|--------------------------------------------------------------------------
*/
function ImagePreview({ image, onRemove }) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  return (
    <div
      className="relative aspect-square rounded-xl overflow-hidden border group"
      style={{ borderColor: C.blush, backgroundColor: C.cream }}
    >
      <img
        src={preview}
        alt="preview"
        onError={(e) => {
          e.currentTarget.src = "/no-image.png";
        }}
        className="w-full h-full object-cover"
      />

      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
        style={{ backgroundColor: C.dark, color: "#FFFFFF" }}
      >
        <X size={14} />
      </button>
    </div>
  );
}